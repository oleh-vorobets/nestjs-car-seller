import { Expose } from 'class-transformer'; // anonimus to Exclude

export class UserDto {
  @Expose()
  id: number;

  @Expose()
  email: string;
}
