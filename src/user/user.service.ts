import {
  HttpException,
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { Role, User } from '@prisma/client';
import { UpdateUserDto } from './dto/update-user.dto';
import { Logger } from '@nestjs/common';

@Injectable()
export class UserService {
  constructor(private readonly databaseService: DatabaseService) { }
  private readonly logger = new Logger(UserService.name)

  async findAll(role?: Role) {
    let users: User[] = [];
    try {
      if (role) {
        users = await this.databaseService.user.findMany({ where: { role } });
        console.log("users: ", users)
        if (users.length === 0) {
          throw new NotFoundException(`users role ${role} not found.`);
        }

        return users;
      }
      users = await this.databaseService.user.findMany();
      if (users.length === 0) {
        throw new NotFoundException(`No users found.`);
      }

      return users;
    } catch (error) {
      this.logger.error('Error creating user', error.stack);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException('Unexpected error occurred.');
    }
  }

  async findOne(id: string) {
    try {
      const user = await this.databaseService.user.findUnique({
        where: { id },
      });
      if (!user) {
        throw new NotFoundException(`User with an id of ${id} Not found.`);
      }

      return user;
    } catch (error) {
      this.logger.error('Error creating user', error.stack);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException('Unexpected error occurred.');
    }
  }

  async update(id: string, updateUserDto: UpdateUserDto) {

    try {
      const user = await this.databaseService.user.findUnique({
        where: { id },
      });
      if (!user) {
        throw new NotFoundException(`User with an id of ${id} Not found.`);
      }

      const updatedUser = await this.databaseService.user.update({
        where: { id },
        data: updateUserDto,
      });

      return updatedUser;
    } catch (error) {
      this.logger.error('Error creating user', error.stack);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException('Unexpected error occurred.');
    }
  }

  async remove(id: string) {
    try {
      const user = await this.databaseService.user.findUnique({
        where: { id },
      });
      if (!user) {
        throw new NotFoundException(`User with an id of ${id} Not found.`);
      }

      const deletedUser = await this.databaseService.user.delete({ where: { id } });

      return { deletedUser, message: 'User deleted successfully.' };
    } catch (error) {
      this.logger.error('Error creating user', error.stack);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException('Unexpected error occurred.');
    }
  }
}
