import { Injectable, ExecutionContext, UnauthorizedException, CanActivate } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import { ErrorHandler } from '../../exceptions/exception';
import { JwtService } from '@nestjs/jwt';
import { QueueService } from '../../domain/auth/services/queue.service';
import { TicketSessionService } from '../../domain/auth/services/ticket-session.service';
import { TicketStatus } from '../../domain/auth/entities/ticket-session';

@Injectable()
export class BasicAuthGuard extends AuthGuard('jwt') { // 기본 전략을 'jwt'로 설정
  constructor(
    private readonly jwtService: JwtService,
    private readonly queueService: QueueService,
    private readonly ticketSession: TicketSessionService,
    private readonly reflector: Reflector,
  ) {
    super();
  }
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    try {
      const token = request.headers.authorization.split(' ')[1];
      const user = this.jwtService.verify(token);
      console.log('userId', user.userId);

      const [queue, ticketSession] = await Promise.all([
        this.queueService.findQueueItemByUserId(user.userId),
        this.ticketSession.findSessionByUserId(user.userId),
      ]);
      // const queue = await this.queueService.findQueueItemByUserId(user.userId);
      // const ticketSession = await this.ticketSession.findSessionByUserId(user.userId);
      console.log('queue,ticketSession', queue, ticketSession);

      if (queue || ticketSession) {
        return await super.canActivate(context) as boolean;
      }
      return false;
    } catch (e) {
      throw ErrorHandler.notFound(e.message);
    }
  }
}


@Injectable()
export class ReservationAuthGuard extends AuthGuard('jwt') { // 기본 전략을 'jwt'로 설정
  constructor(
    private readonly jwtService: JwtService,
    private readonly queueService: QueueService,
    private readonly ticketSession: TicketSessionService,
    private readonly reflector: Reflector,
  ) {
    super();
  }
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    try {
      const token = request.headers.authorization.split(' ')[1];
      const user = this.jwtService.verify(token);
      console.log('userId', user.userId);

      const [queue, ticketSession] = await Promise.all([
        this.queueService.findQueueItemByUserId(user.userId),
        this.ticketSession.findSessionByUserId(user.userId),
      ]);

      if ((queue && queue.isProcessed())|| (ticketSession && ticketSession.status !== TicketStatus.expired)) {
        return await super.canActivate(context) as boolean;
      }
      return false;
    } catch (e) {
      throw ErrorHandler.notFound(e.message);
    }

  }

  handleRequest(err, user, info, context) {
    if (err || !user) {
      throw err || new UnauthorizedException();
    }
    console.log('handleRequest',user);
    return user;
  }
}
