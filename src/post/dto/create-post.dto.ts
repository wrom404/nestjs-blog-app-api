import { IsString, IsBoolean, MaxLength, MinLength, IsNotEmpty, IsOptional, Matches } from "class-validator";
export class CreatePostDto {
  @IsString()
  @IsNotEmpty({ message: 'title must not be empty.' })
  @MinLength(3, { message: 'title should be at least 3 characters.' })
  @MaxLength(50, { message: 'title cannot be longer than 50 characters.' })
  title: string;

  @IsBoolean()
  @IsOptional()
  published: boolean;

  @IsString()
  @Matches(/^[0-9a-fA-F]{24}$/, { // We use regex to check if authorId is a valid MongoDB ObjectId format.
    message: 'authorId must be a valid MongoDB ObjectId.',
  })
  authorId: string;
}
