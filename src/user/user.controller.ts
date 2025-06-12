import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ValidationPipe,
  UseGuards,
  Req,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { Role } from '@prisma/client';
import { AuthGuard } from 'src/auth/auth.guard';
import { Public } from 'src/public/public.decorator';

@UseGuards(AuthGuard) // implements guard to all routes in the user controller
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Public() // implement a public route to this route, meaning this route doesn't need a jwt
  @Get()
  findAll(@Query('role') role?: Role) {
    return this.userService.findAll(role);
  }

  @Get('current-user')
  getMe(@Req() req: Request) {
    return req['user']; // returns the current user information that is being set in the auth guard (e.g. request['user'] = payload;);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body(ValidationPipe) updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }
}
