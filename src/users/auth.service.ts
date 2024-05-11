import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util'; // will take functions that use callbacks and make them to return promise

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

  async signup(email: string, password: string) {
    // See if email is in use
    const users = await this.usersService.find(email);
    if (users.length) {
      throw new BadRequestException(
        'The user with such email is already exist.',
      );
    }

    // Hash the user password
    // 1) generate salt
    // 2) hash salt and password
    // 3) join the hashed result and the salt together

    const salt = randomBytes(8).toString('hex'); // 16 characters/numbers string
    const hash = (await scrypt(password, salt, 32)) as Buffer;
    const result = salt + '.' + hash.toString('hex');
    // Create a new user and save it
    const user = await this.usersService.create(email, result);
    // Return the user
    return user;
  }

  async signin(email: string, password: string) {
    const [user] = await this.usersService.find(email);
    if (!user) {
      throw new NotFoundException("The user with such email doesn't exist.");
    }

    const [salt, storedHash] = user.password.split('.');

    const hash = (await scrypt(password, salt, 32)) as Buffer;

    if (storedHash !== hash.toString('hex')) {
      throw new BadRequestException('Invalid password.');
    }

    return user;
  }
}
