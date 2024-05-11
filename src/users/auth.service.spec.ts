import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from './users.service';
import { UserEntity } from './user.entity';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('AuthService', () => {
  let service: AuthService;
  let fakeUsersService: Partial<UsersService>;

  beforeEach(async () => {
    //Create a fake copy of the UsersService
    const users: UserEntity[] = [];
    // fakeUsersService = {
    //   find: () => Promise.resolve([]),
    //   create: (email: string, password: string) =>
    //     Promise.resolve({ id: 1, email, password } as UserEntity),
    // };

    fakeUsersService = {
      find: (email: string) => {
        const filteredUsers = users.filter((user) => user.email === email);
        return Promise.resolve(filteredUsers);
      },
      create: (email: string, password: string) => {
        const user = { id: Date.now(), email, password } as UserEntity;
        users.push(user);
        return Promise.resolve(user);
      },
    };
    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: fakeUsersService }, // if anyone need UsersService give them a copy of fakeUSersService
      ],
    }).compile();

    service = module.get(AuthService);
  });

  it('can create an instance of AuthService', async () => {
    expect(service).toBeDefined();
  });

  it('creates a new user with a salted and hashed password', async () => {
    const password = 'StrongPassword1234';
    const user = await service.signup('asdasd@email.com', password);
    expect(user.password).not.toEqual(password);

    const [salt, hash] = user.password.split('.');
    expect(salt).toBeDefined();
    expect(hash).toBeDefined();
  });

  it('throws an error if user signs up with email that is in use', async () => {
    await service.signup('sfsdfsdg@gmail.com', 'osasePasdw');
    await expect(
      service.signup('sfsdfsdg@gmail.com', 'osasePasdw'),
    ).rejects.toThrow(BadRequestException);
  });

  it('throws if sign in is called with unused email', async () => {
    await expect(
      service.signin('asdasdasdasda@fasd.com', 'sdfsfsdf'),
    ).rejects.toThrow(NotFoundException);
  });

  it('throws if an invalid password is provided', async () => {
    await service.signup('asdsdfsdf@sdfs.com', 'asfsgvs');
    await expect(
      service.signin('asdsdfsdf@sdfs.com', 'password'),
    ).rejects.toThrow(BadRequestException);
  });

  it('returns a user if password is correct', async () => {
    // fakeUsersService.find = () =>
    //   Promise.resolve([
    //     {
    //       id: 1,
    //       email: 'asdsdfsdf@sdfs.com',
    //       password:
    //         '28073d6fd4c63017.720910b640e735fd74050fed14eff0991f1013dc15570d47b54238264d74b667',
    //     } as UserEntity,
    //   ]);
    await service.signup('asdf@dsf.com', 'password');
    const user = await service.signin('asdf@dsf.com', 'password');
    expect(user).toBeDefined();
  });
});
