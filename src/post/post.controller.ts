import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseBoolPipe, HttpCode, UseGuards } from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { AuthGuard } from 'src/guard/auth.guard';

@UseGuards(AuthGuard)
@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) { }

  @HttpCode(201)
  @Post()
  create(@Body() createPostDto: CreatePostDto) {
    return this.postService.createBlogPost(createPostDto);
  }

  @Get('/user/:userId')
  findAll(@Param('userId') userId: string, @Query('publish', new ParseBoolPipe({ optional: true })) publish?: boolean) {
    return this.postService.findAll(userId, publish);
  }

  @Get(':postId')
  findOne(@Param('postId') postId: string) {
    return this.postService.findOne(postId);
  }

  @Patch(':postId')
  update(@Param('postId') postId: string, @Body() updatePostDto: UpdatePostDto) {
    return this.postService.update(postId, updatePostDto);
  }

  @Delete(':postId')
  remove(@Param('postId') postId: string) {
    return this.postService.remove(postId);
  }
}
