import { Injectable, UnauthorizedException, BadGatewayException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { AuthService } from '../auth/auth.service';

export interface CentralUserProfile {
  id: string;
  email: string;
  role: string;
  firstName?: string;
  lastName?: string;
  name?: string;
  phone?: string;
  membershipLevel?: string;
  membershipTier?: string;
  membershipStatus?: string;
  businessId?: string | null;
  packages?: Array<{ platform: string; packageName?: string; status: string }>;
  permissions?: Record<string, boolean>;
}

export interface CentralTokenResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  tokenType: string;
  user: {
    id: string;
    email: string;
    role: string;
    firstName?: string;
    lastName?: string;
    name?: string;
    businessProfile?: { id: string; businessName: string } | null;
  };
}

@Injectable()
export class SsoService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
    private readonly authService: AuthService,
  ) {}

  private get clientId(): string {
    return this.config.get<string>('MCOM_CLIENT_ID', 'mcom-spin-local');
  }

  private get clientSecret(): string {
    return this.config.get<string>('MCOM_CLIENT_SECRET', '');
  }

  private get hmacSecret(): string {
    return this.config.get<string>('MCOM_HMAC_SECRET', '');
  }

  private get redirectUri(): string {
    return this.config.get<string>(
      'MCOM_REDIRECT_URI',
      'http://localhost:5004/auth/callback',
    );
  }

  private get scopes(): string {
    return this.config.get<string>(
      'MCOM_SCOPES',
      'profile email business membership packages',
    );
  }

  private get platformSlug(): string {
    return this.config.get<string>('MCOM_PLATFORM_SLUG', 'spin_local');
  }

  private get centralBaseUrl(): string {
    return this.config
      .get<string>('MCOM_SOLUTIONS_URL', 'http://localhost:3010')
      .replace(/\/+$/, '');
  }

  /**
   * Build the McomSolution (Central Hub) OAuth authorize URL the browser is
   * sent to, embedding a random 32-byte CSRF state.
   */
  buildAuthorizeUrl(state: string): string {
    const params = new URLSearchParams({
      client_id: this.clientId,
      redirect_uri: this.redirectUri,
      scope: this.scopes,
      state,
    });
    return `${this.centralBaseUrl}/api/v1/auth/sso/authorize?${params.toString()}`;
  }

  /**
   * Server-to-server exchange of the one-time authorization code for tokens.
   * Authenticates with the client credentials via Basic auth (the Central
   * token endpoint forbids client_secret in the body).
   */
  async exchangeCodeForTokens(code: string): Promise<CentralTokenResponse> {
    const basic = Buffer.from(`${this.clientId}:${this.clientSecret}`).toString('base64');
    const body = {
      code,
      client_id: this.clientId,
      redirect_uri: this.redirectUri,
    };

    let response: Response;
    try {
      response = await fetch(`${this.centralBaseUrl}/api/v1/auth/sso/token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Basic ${basic}`,
        },
        body: JSON.stringify(body),
      });
    } catch {
      throw new BadGatewayException('MCOM Central Hub is unreachable');
    }

    if (!response.ok) {
      throw new UnauthorizedException('Authorization code exchange failed');
    }

    return (await response.json()) as CentralTokenResponse;
  }

  /**
   * Refresh the MCOM Central access token using the central refresh token.
   */
  async refreshCentralToken(refreshToken: string): Promise<{ accessToken: string; expiresIn: number }> {
    let response: Response;
    try {
      response = await fetch(`${this.centralBaseUrl}/api/v1/auth/sso/token/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh_token: refreshToken }),
      });
    } catch {
      throw new BadGatewayException('MCOM Central Hub is unreachable');
    }

    if (!response.ok) {
      throw new UnauthorizedException('Central token refresh failed');
    }

    return (await response.json()) as { accessToken: string; expiresIn: number };
  }

  /**
   * Fetch freshly-synchronized user profile + permissions from Central using a
   * Bearer access token (e.g. to re-check package access).
   */
  async getCentralUserInfo(accessToken: string): Promise<CentralUserProfile> {
    let response: Response;
    try {
      response = await fetch(`${this.centralBaseUrl}/api/v1/auth/sso/userinfo`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
    } catch {
      throw new BadGatewayException('MCOM Central Hub is unreachable');
    }

    if (!response.ok) {
      throw new UnauthorizedException('Failed to fetch user info from Central Hub');
    }

    return (await response.json()) as CentralUserProfile;
  }

  /**
   * HMAC-signed server-to-server request to MCOM Central data-sharing APIs.
   */
  async callMcomSignedApi(endpoint: string, data: Record<string, unknown>): Promise<unknown> {
    const rawBody = JSON.stringify(data);
    const signature = crypto
      .createHmac('sha256', this.hmacSecret)
      .update(rawBody)
      .digest('hex');

    let response: Response;
    try {
      response = await fetch(`${this.centralBaseUrl}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Mcom-Signature': `sha256=${signature}`,
          'X-Mcom-Client-ID': this.clientId,
        },
        body: rawBody,
      });
    } catch {
      throw new BadGatewayException('MCOM Central Hub is unreachable');
    }

    if (!response.ok) {
      throw new UnauthorizedException('Signed request to MCOM Central failed');
    }

    return response.json();
  }

  /**
   * Provision (or update) the local user from the central profile, stamp the
   * central profile (id, tokens, permissions) into metadata, and issue
   * mcomspin's own JWT pair.
   */
  async provisionAndIssueTokens(central: CentralTokenResponse, centralRefreshToken?: string) {
    const user = await this.authService.findOrCreateUserFromCentral({
      email: central.user.email,
      role: central.user.role,
      firstName: central.user.firstName,
      lastName: central.user.lastName,
      name: central.user.name,
    });

    const profile = await this.getCentralUserInfo(central.accessToken);
    const permissions = profile.permissions ?? {};
    const hasAccess = permissions[`canAccess_${this.platformSlug}`] === true;

    if (this.isBusinessRole(central.user.role)) {
      await this.ensureDefaultBusiness(user, profile);
    }

    const metadata = (user.metadata ?? {}) as Record<string, unknown>;
    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        metadata: {
          ...metadata,
          centralId: central.user.id,
          centralAccessToken: central.accessToken,
          centralRefreshToken: centralRefreshToken ?? central.refreshToken,
          centralProfile: profile as unknown as Prisma.InputJsonValue,
          centralPermissions: permissions,
        } as Prisma.InputJsonValue,
      },
    });

    const tokens = await this.authService.generateTokens(user.id, user.email);
    return { ...tokens, permissions, hasAccess };
  }

  private isBusinessRole(role?: string): boolean {
    const r = (role || '').toUpperCase();
    return r === 'BUSINESS' || r === 'OWNER';
  }

  /**
   * JIT-provision a default Business record for SSO users whose central role
   * is BUSINESS, so business-scoped endpoints (billing, dashboard, etc.) work
   * immediately after sign-in. Mirrors MCOM Mall's storefront sync.
   */
  private async ensureDefaultBusiness(
    user: { id: string; email: string; firstName?: string | null },
    profile: CentralUserProfile,
  ): Promise<void> {
    const existing = await this.prisma.business.findFirst({
      where: { ownerId: user.id, deletedAt: null },
      select: { id: true },
    });
    if (existing) return;

    const rawName = profile.name || `${user.firstName ?? 'My'}` || user.email.split('@')[0];
    const base = (rawName || 'my-business')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 40) || 'my-business';

    // One-shot unique slug: each user JIT-provisions at most one default business,
    // so prefixing with the user id is effectively collision-free (1 query, no loop).
    let slug = `${base}-${user.id.slice(0, 6)}`;

    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        await this.prisma.business.create({
          data: {
            ownerId: user.id,
            name: (rawName || 'My Business').slice(0, 100),
            slug,
            contactEmail: user.email,
            contactPhone: profile.phone ?? null,
            description: 'Imported from MCOM Solutions (Central Hub)',
            isActive: true,
          },
        });
        return;
      } catch (err) {
        // Collision on the @unique slug — retry with a fresh random suffix.
        if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
          slug = `${base}-${user.id.slice(0, 4)}-${crypto.randomBytes(2).toString('hex')}`;
          continue;
        }
        throw err;
      }
    }

    throw new Error('Failed to allocate a unique business slug');
  }
}
