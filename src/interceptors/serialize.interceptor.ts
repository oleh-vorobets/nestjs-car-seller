import {
  UseInterceptors,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { plainToClass } from 'class-transformer';

interface ClassConstructor {
  // This interface means any class
  new (...args: any[]): {};
}

export function Serialize(dto: ClassConstructor) {
  return UseInterceptors(new SerializeInterceptor(dto));
}

class SerializeInterceptor implements NestInterceptor {
  constructor(private readonly dto: any) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    // // Run someting before a request is handled by the request handler
    // console.log(context);

    return next.handle().pipe(
      map((data: any) => {
        // // Run something before the response is sent out
        return plainToClass(this.dto, data, {
          excludeExtraneousValues: true, // will remove properties that doesnt fit in UserDto
        });
      }),
    );
  }
}
