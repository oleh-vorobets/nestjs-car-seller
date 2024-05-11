import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity) private readonly repo: Repository<UserEntity>,
  ) {}

  async create(email: string, password: string) {
    const user = this.repo.create({ email, password }); // create UserEntity object
    console.log(user);
    console.log(1);

    return await this.repo.save(user);
  }

  async findOne(id: number) {
    if (!id) return null;

    const user = await this.repo.findOne({ where: { id } }); // or this.repo.findOneBy({id});
    if (!user) {
      throw new NotFoundException('User was not found');
    }
    return user;
  }

  find(email: string) {
    return this.repo.find({ where: { email } });
  }

  async update(id: number, attrs: Partial<UserEntity>) {
    const user = await this.findOne(id);
    if (!user) {
      throw new NotFoundException('User was not found');
    }
    Object.assign(user, attrs);

    return this.repo.save(user); // not to use update or insert bcz of hooks will never execute
  }

  async remove(id: number) {
    const user = await this.findOne(id);
    if (!user) {
      throw new BadRequestException(`User with such id: ${id} was not found`);
    }

    return this.repo.remove(user);
  }
}
