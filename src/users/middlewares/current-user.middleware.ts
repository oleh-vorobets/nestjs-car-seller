import { Injectable, NestMiddleware } from '@nestjs/common';
import { UsersService } from '../users.service';
import { NextFunction, Request, Response } from 'express';
import { UserEntity } from '../user.entity';

declare global {
  namespace Express {
    interface Request {
      currentUser?: UserEntity;
    }
  }
}

@Injectable()
export class CurrentUserMiddleware implements NestMiddleware {
  constructor(private readonly usersService: UsersService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const { userId } = req.session || {};
    if (userId) {
      const user = await this.usersService.findOne(userId);
      req.currentUser = user;
    }
    return next();
  }
}
