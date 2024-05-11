import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { AuthService } from './auth.service';
import { UserEntity } from './user.entity';
import exp from 'constants';

describe('UsersController', () => {
  let controller: UsersController;
  let fakeUsersService: Partial<UsersService>;
  let fakeAuthService: Partial<AuthService>;

  beforeEach(async () => {
    fakeUsersService = {
      findOne: (id: number) => {
        return Promise.resolve({
          id,
          email: 'asdaff@email.com',
          password: 'afsdffssddf',
        } as UserEntity);
      },
      find: (email: string) => {
        return Promise.resolve([
          { id: 1, email, password: 'afsdffssddf' } as UserEntity,
        ]);
      },
      // remove: () => {}
      // update: () => {}
    };
    fakeAuthService = {
      signin: (email: string, password: string) => {
        return Promise.resolve({ id: 1, email, password } as UserEntity);
      },
    };
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        { provide: AuthService, useValue: fakeAuthService },
        { provide: UsersService, useValue: fakeUsersService },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('FindAllUsers returns a list of users with a given email', async () => {
    const users = await controller.findAllUsers('asdaff@email.com');
    expect(users.length).toEqual(1);
    expect(users[0].email).toEqual('asdaff@email.com');
  });

  it('findUser returns a single user with id', async () => {
    const user = await controller.findUser('1');
    expect(user).toBeDefined();
  });

  it('findUser equal to null if user with given id is not found', async () => {
    fakeUsersService.findOne = () => null;
    expect(await controller.findUser('1')).toEqual(null);
  });

  it('signin updates session object and returns user', async () => {
    const session = {
      userId: 0,
    };
    const user = await controller.signin(
      {
        email: 'asdasf@gfds.asd',
        password: 'asdgfdsf',
      },
      session,
    );
    expect(user.id).toEqual(1);
    expect(session.userId).toEqual(user.id);
  });
});
