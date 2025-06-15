import { BadRequestException, Injectable, NotFoundException, InternalServerErrorException, Logger } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class PostService {
  constructor(private readonly databaseService: DatabaseService) { }
  private readonly logger = new Logger(PostService.name);

  async createBlogPost(createPostDto: CreatePostDto) {
    const { title, authorId } = createPostDto;
    if (!title || !authorId) throw new BadRequestException('Title and authorId are required.');

    const user = await this.databaseService.user.findUnique({ where: { id: authorId } });
    this.logger.log("user: ", user)

    if (!user) throw new NotFoundException('User not found.');

    const newPost = await this.databaseService.post.create({
      data: createPostDto
    });

    if (!newPost) throw new InternalServerErrorException('Failed to create post.');
    return { newPost }
  }

  async findAll(userId: string, publish?: boolean) {
    if (publish !== undefined) {
      const posts = await this.databaseService.post.findMany({
        where: {
          authorId: userId,
          published: publish,
        },
      });

      if (!posts.length) return { message: "No posts yet." };
      return { posts };
    }

    const posts = await this.databaseService.post.findMany({
      where: { authorId: userId },
    });

    if (!posts.length) return { message: "No posts yet." };
    return { posts };
  }


  async findOne(postId: string) {
    if (!postId.trim()) throw new BadRequestException("Post ID is required.");

    const post = await this.databaseService.post.findUnique({ where: { id: postId } });

    if (!post) throw new NotFoundException("Post not found.");
    return { post }
  }

  async update(id: number, updatePostDto: UpdatePostDto) {
    return `This action updates a #${id} post`;
  }

  async remove(id: number) {
    return `This action removes a #${id} post`;
  }
}
