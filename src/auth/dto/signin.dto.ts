import { IsEmpty, IsString } from "class-validator";

export class SigninDto {
  @IsString()
  @IsEmpty()
  email: string;

  @IsString()
  @IsEmpty()
  password: string;
}