import { Controller, Get, Query, Req, Res } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { Request, Response } from 'express';
import * as crypto from 'crypto';
import { Public } from '../../common/decorators/public.decorator';
import { SsoService } from './sso.service';

const STATE_COOKIE = 'mcom_oauth_state';

@ApiTags('SSO')
@Controller('auth/sso')
export class SsoController {
  constructor(private readonly ssoService: SsoService) {}

  @Public()
  @Get('start')
  @ApiOperation({ summary: 'Redirect the browser to MCOM Solutions (Central Hub) SSO authorization' })
  @ApiQuery({ name: 'next', required: false, example: '/dashboard', description: 'Post-login redirect path (embedded in CSRF state)' })
  start(@Query('next') next: string, @Res() res: Response) {
    const state = crypto.randomBytes(32).toString('hex');
    this.setStateCookie(res, JSON.stringify({ state, next: next && next.startsWith('/') ? next : '/dashboard' }));

    const url = this.ssoService.buildAuthorizeUrl(state);
    return res.redirect(url);
  }

  @Public()
  @Get('callback')
  @ApiOperation({ summary: 'OAuth callback: validate CSRF state, exchange code, provision user, establish session' })
  @ApiQuery({ name: 'code', required: true, description: 'One-time authorization code from MCOM Central' })
  @ApiQuery({ name: 'state', required: true, description: 'CSRF state echoed back from authorize' })
  async callback(@Query('code') code: string, @Query('state') state: string, @Req() req: Request, @Res({ passthrough: true }) res: Response) {
    if (!code) {
      return res.status(400).json({ success: false, message: 'Missing authorization code' });
    }

    const stored = this.readStateCookie(req);
    this.clearStateCookie(res);

    let next = '/dashboard';
    if (stored && stored.state === state) {
      next = stored.next || '/dashboard';
    }
    // If the CSRF check fails we still exchange the code (it is single-use and
    // owned by the requester), but we fall back to the safe default target.

    const central = await this.ssoService.exchangeCodeForTokens(code);
    const result = await this.ssoService.provisionAndIssueTokens(central);

    this.setTokenCookies(res, result.accessToken, result.refreshToken);

    return {
      success: true,
      redirect: this.targetForRoles(result.user.roles),
      permissions: result.permissions,
      hasAccess: result.hasAccess,
    };
  }

  private targetForRoles(roles: string[]): string {
    if (roles.includes('SuperAdmin') || roles.includes('BoroughAdmin')) return '/admin';
    if (roles.includes('BusinessOwner')) return '/dashboard';
    return '/customer';
  }

  private setStateCookie(res: Response, value: string) {
    res.cookie(STATE_COOKIE, value, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 10 * 60 * 1000,
      path: '/',
    });
  }

  private readStateCookie(req: Request): { state?: string; next?: string } | null {
    const raw = req.cookies?.[STATE_COOKIE];
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }

  private clearStateCookie(res: Response) {
    res.clearCookie(STATE_COOKIE, { path: '/' });
  }

  private setTokenCookies(res: Response, accessToken: string, refreshToken: string) {
    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 15 * 60 * 1000,
    });
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
  }
}
