// create-user.dto.ts
import { Role } from '@prisma/client';
import { IsEnum, IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @MinLength(2, { message: "Name must be at least 2 characters long." })
  @MaxLength(50, { message: "Name cannot be longer than 50 characters." })
  name: string;

  @IsEmail()
  @MaxLength(250)
  email: string;

  @IsEnum(Role, { message: `Role must be one of: ${Object.values(Role).join(', ')}` })
  role?: Role = Role.USER; // // Default to USER if not provided
}
