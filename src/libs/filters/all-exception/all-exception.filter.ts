import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class AllExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const data = {
      statusCode: null,
      path: request.url,
      message: [], // validation 오류인 경우 array로 나가기 때문에 array로 통일
    };

    if (exception instanceof HttpException) {
      // 개발자가 발생시킨 HTTP 에러
      data.statusCode = exception.getStatus();

      const error = exception.getResponse() as
        | string
        | { error: string; statusCode: number; message: string | string[] };

      if (typeof error == 'string') {
        data.message = [];
      } else {
        data.message = Array.isArray(error.message)
          ? error.message
          : [error.message];
      }
    } else {
      // 이외의 발생된 에러
      data.statusCode = 500;
      data.message = ['잠시후 다시 시도해주세요.'];
    }

    response.status(data.statusCode).json(data);
  }
}
