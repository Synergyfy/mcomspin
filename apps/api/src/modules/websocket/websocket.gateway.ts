import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@WebSocketGateway({
  cors: {
    origin: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:5004'],
    credentials: true,
  },
  namespace: '/ws',
})
export class AppGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private userSockets = new Map<string, Set<string>>();

  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  handleConnection(client: Socket) {
    const token = client.handshake.query.token as string;
    if (!token) {
      client.disconnect();
      return;
    }

    try {
      const payload = this.jwtService.verify(token, {
        secret: this.configService.get('JWT_ACCESS_SECRET', 'access-secret'),
      });
      const userId = payload.sub as string;
      const roles: string[] = payload.roles || [];

      if (!this.userSockets.has(userId)) {
        this.userSockets.set(userId, new Set());
      }
      this.userSockets.get(userId)!.add(client.id);
      client.join(`user:${userId}`);

      for (const role of roles) {
        client.join(`role:${role}`);
      }
    } catch {
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    for (const [userId, sockets] of this.userSockets.entries()) {
      if (sockets.delete(client.id) && sockets.size === 0) {
        this.userSockets.delete(userId);
      }
    }
  }

  sendToUser(userId: string, event: string, data: any) {
    this.server.to(`user:${userId}`).emit(event, data);
  }

  sendToRole(role: string, event: string, data: any) {
    this.server.to(`role:${role}`).emit(event, data);
  }

  sendToAll(event: string, data: any) {
    this.server.emit(event, data);
  }

  @SubscribeMessage('ping')
  handlePing(@ConnectedSocket() client: Socket) {
    client.emit('pong', { timestamp: new Date().toISOString() });
  }

  @SubscribeMessage('subscribe:business')
  handleSubscribeBusiness(@ConnectedSocket() client: Socket, @MessageBody() data: { businessId: string }) {
    if (data?.businessId) {
      client.join(`business:${data.businessId}`);
    }
  }

  @SubscribeMessage('unsubscribe:business')
  handleUnsubscribeBusiness(@ConnectedSocket() client: Socket, @MessageBody() data: { businessId: string }) {
    if (data?.businessId) {
      client.leave(`business:${data.businessId}`);
    }
  }
}
