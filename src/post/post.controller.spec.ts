// Import necessary testing utilities from NestJS
import { Test, TestingModule } from '@nestjs/testing';
// Import the controller and service to be tested
import { PostController } from './post.controller';
import { PostService } from './post.service';

// Define a test suite for PostController
describe('PostController', () => {
  let controller: PostController;
  let postService: PostService;

  // Create a mock version of PostService with Jest
  const mockPostService = {
    createBlogPost: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  // Before each test, create a testing module with mocked PostService
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PostController], // Register the controller we're testing
      providers: [
        {
          provide: PostService,       // Replace the real service with our mock
          useValue: mockPostService,
        },
      ],
    }).compile(); // Compile the testing module

    // Get instances of the controller and mocked service from the module
    controller = module.get<PostController>(PostController);
    postService = module.get<PostService>(PostService);
  });

  // Basic test to check if the controller is created successfully
  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  // Test the controller's create() method
  it('should create a post', async () => {
    const dto = { title: 'Test Post', authorId: '123', published: true };
    const result = {
      success: true,
      message: 'New post created successfully.',
      newPost: { id: '1', ...dto },
    };

    // Mock the service method's return value
    mockPostService.createBlogPost.mockResolvedValue(result);

    // Call the controller method
    const response = await controller.create(dto);

    // Assertions
    expect(response).toEqual(result);
    expect(mockPostService.createBlogPost).toHaveBeenCalledWith(dto);
  });

  // Test the controller's findAll() method
  it('should get all posts for a user', async () => {
    const userId = '123';
    const result = {
      success: true,
      posts: [{ id: '1', title: 'Sample', authorId: userId }],
    };

    // Mock the service response
    mockPostService.findAll.mockResolvedValue(result);

    const response = await controller.findAll(userId, undefined);
    expect(response).toEqual(result);
    expect(mockPostService.findAll).toHaveBeenCalledWith(userId, undefined);
  });

  // Test the controller's findOne() method
  it('should return one post', async () => {
    const postId = '1';
    const result = { success: true, post: { id: '1', title: 'One' } };

    mockPostService.findOne.mockResolvedValue(result);

    const response = await controller.findOne(postId);
    expect(response).toEqual(result);
    expect(mockPostService.findOne).toHaveBeenCalledWith(postId);
  });

  // Test the controller's update() method
  it('should update a post', async () => {
    const id = '1';
    const dto = { title: 'Updated' };
    const result = {
      success: true,
      message: 'Post updated successfully.',
      updatedPost: { id, ...dto },
    };

    mockPostService.update.mockResolvedValue(result);

    const response = await controller.update(id, dto);
    expect(response).toEqual(result);
    expect(mockPostService.update).toHaveBeenCalledWith(id, dto);
  });

  // Test the controller's remove() method
  it('should delete a post', async () => {
    const id = '1';
    const result = {
      success: true,
      message: 'Post deleted successfully.',
      deletedPost: { id },
    };

    mockPostService.remove.mockResolvedValue(result);

    const response = await controller.remove(id);
    expect(response).toEqual(result);
    expect(mockPostService.remove).toHaveBeenCalledWith(+id);
  });
});
