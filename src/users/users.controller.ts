import {
  Controller,
  Post,
  Body,
  Get,
  Patch,
  Query,
  Param,
  Delete,
  Session,
  UseGuards,
  HttpCode,
  // UseInterceptors,
} from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dtos/update-user.dto';
import { Serialize } from '../interceptors/serialize.interceptor';
import { UserDto } from './dtos/user.dto';
import { AuthService } from './auth.service';
import { CurrentUser } from './decorators/current-user.decorator';
// import { CurrentUserInterceptor } from './interceptors/current-user.interceptor';
import { UserEntity } from './user.entity';
import { AuthGuard } from '../guards/auth.guard';

@Controller('auth')
@Serialize(UserDto)
// @UseInterceptors(CurrentUserInterceptor)
export class UsersController {
  constructor(
    private readonly userService: UsersService,
    private readonly authService: AuthService,
  ) {}

  @Get('/whoami')
  @UseGuards(AuthGuard)
  whoAmI(@CurrentUser() user: UserEntity) {
    return user;
  }

  @Get('/signout')
  signout(@Session() session: any) {
    session.userId = null;
  }

  // @Get('/colors/:color')
  // setColor(@Param('color') color: string, @Session() session: any) {
  //   session.color = color;
  //   console.log(session);
  // }

  // @Get('/colors')
  // getColor(@Session() session: any) {
  //   console.log(session);
  //   return session.color;
  // }
  @Post('/signup')
  // @Serialize(UserDto)
  @HttpCode(204)
  async createUser(@Body() body: CreateUserDto, @Session() session: any) {
    console.log(body);
    const user = await this.authService.signup(body.email, body.password);
    session.userId = user.id;
    return user;
  }

  @Post('/signin')
  // @Serialize(UserDto)
  async signin(@Body() body: CreateUserDto, @Session() session: any) {
    const user = await this.authService.signin(body.email, body.password);
    session.userId = user.id;
    return user;
  }

  // @UseInterceptors(ClassSerializerInterceptor)
  // @Serialize(UserDto)
  @Get('/:id')
  findUser(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  // @Serialize(UserDto)
  @Get()
  findAllUsers(@Query('email') email: string) {
    return this.userService.find(email);
  }

  // @Serialize(UserDto)
  @Delete('/:id')
  deleteUser(@Param('id') id: string) {
    return this.userService.remove(+id);
  }

  // @Serialize(UserDto)
  @Patch('/:id')
  updateUser(@Param('id') id: string, @Body() body: UpdateUserDto) {
    return this.userService.update(+id, body);
  }
}
