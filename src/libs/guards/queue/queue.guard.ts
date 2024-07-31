import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { QueueService } from 'src/3-domain/queue/queue.service';

@Injectable()
export class QueueGuard implements CanActivate {
  constructor(private readonly queueService: QueueService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const headers = request.headers;
    const token = headers['authorization'];

    const queue = await this.queueService.getWorking({ token });

    request.queue = queue;

    return true;
  }
}
