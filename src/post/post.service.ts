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
    return { success: true, newPost }
  }

  async findAll(userId: string, publish?: boolean) {
    if (publish !== undefined) {
      const posts = await this.databaseService.post.findMany({
        where: {
          authorId: userId,
          published: publish,
        },
      });

      if (!posts.length) return { success: true, message: "No posts yet." };
      return { success: true, posts };
    }

    const posts = await this.databaseService.post.findMany({
      where: { authorId: userId },
    });

    if (!posts.length) return { success: true, message: "No posts yet." };
    return { success: true, posts };
  }


  async findOne(postId: string) {
    if (!postId.trim()) throw new BadRequestException("Post ID is required.");

    const post = await this.databaseService.post.findUnique({ where: { id: postId } });

    if (!post) throw new NotFoundException("Post not found.");
    return { success: true, post }
  }

  async update(postId: string, updatePostDto: UpdatePostDto) {
    if (!postId) throw new BadRequestException("Post ID is required.");

    const existingPost = await this.databaseService.post.findUnique({ where: { id: postId } });
    if (!existingPost) throw new NotFoundException("Post not found.");

    const updatedPost = await this.databaseService.post.update({
      where: { id: postId },
      data: updatePostDto,
    });
    return { success: true, message: "Post updated successfully.", updatedPost };
  }

  async remove(postId: string) {
    if (!postId) throw new BadRequestException("Post ID is required.");

    const existingPost = await this.databaseService.post.findUnique({ where: { id: postId } });
    if (!existingPost) throw new NotFoundException("Post not found.");

    const deletedPost = await this.databaseService.post.delete({ where: { id: postId } });
    return { success: true, message: "Post deleted successfully.", deletedPost };
  }
}
