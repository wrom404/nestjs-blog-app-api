import {
  // HttpException,
  Injectable,
  NotFoundException,
  // InternalServerErrorException,
} from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { Role, User } from '@prisma/client';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService { 
  constructor(private readonly databaseService: DatabaseService) { }

  async findAll(role?: Role) {
    let users: User[] = [];
    if (role) {
      users = await this.databaseService.user.findMany({ where: { role } });
      console.log("users: ", users)
      if (users.length === 0) throw new NotFoundException(`users role ${role} not found.`);
      return { success: true, users };
    }
    users = await this.databaseService.user.findMany();
    if (users.length === 0) throw new NotFoundException(`No users found.`);
    return { success: true, users: users };
  }

  async findOne(id: string) {
    const user = await this.databaseService.user.findUnique({
      where: { id },
    });
    console.log("user: ", user);
    if (!user) throw new NotFoundException(`User with an id of ${id} Not found.`);
    return { success: true, user };
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.databaseService.user.findUnique({
      where: { id },
    });
    if (!user) throw new NotFoundException(`User with an id of ${id} Not found.`);
    const updatedUser = await this.databaseService.user.update({
      where: { id },
      data: updateUserDto,
    });
    return { success: true, updatedUser };
  }

  async remove(id: string) {
    // try {
    const user = await this.databaseService.user.findUnique({
      where: { id },
    });
    if (!user) {
      throw new NotFoundException(`User with an id of ${id} Not found.`);
    }
    const deletedUser = await this.databaseService.user.delete({ where: { id } });
    return { success: true, deletedUser, message: 'User deleted successfully.' };
    //   } catch (error) {
    //     this.logger.error('Error creating user', error.stack);
    //     if (error instanceof HttpException) { this is how we implement a condition that checks if th error is instance of exception or the error from the catch block (e.g. NotFoundException()) and re-throw it
    //       throw error;
    //     }
    //     throw new InternalServerErrorException('Unexpected error occurred.');
    //   }
  }
}
