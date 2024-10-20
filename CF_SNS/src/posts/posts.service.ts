import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { PostsModel } from './entities/post.entity';
import { CretePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

// let posts: PostModel[] = [
//   {
//     id: 1,
//     author: 'newjeans_official',
//     title: '뉴진스 민지',
//     content: '메이크업 고치고 있는 민지',
//     likeCount: 10000000,
//     commentCount: 9999,
//   },
//   {
//     id: 2,
//     author: 'newjeans_official',
//     title: '뉴진스 해린',
//     content: '노래 연습 하고 있는 해린',
//     likeCount: 10000000,
//     commentCount: 9999,
//   },
//   {
//     id: 3,
//     author: 'backpink_official',
//     title: '플랙핑크 로제',
//     content: '종합운동장에서 공연중인 로제',
//     likeCount: 10000000,
//     commentCount: 9999,
//   },
// ];

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(PostsModel)
    private readonly postsRepository: Repository<PostsModel>,
  ) {}

  async getAllPosts() {
    return this.postsRepository.find({
      relations: ['author'],
    });
  }

  async getPostById(id: number) {
    const post = await this.postsRepository.findOne({
      where: { id },
      relations: ['author'],
    });
    if (!post) throw new NotFoundException();
    return post;
  }

  async createPost(authorId: number, postDto: CretePostDto) {
    // 1) create -> 저장할 객체를 생성한다.
    // 2) save -> 객체를 저장한다. (create 메서드에서 생성한 객채로)

    const post = this.postsRepository.create({
      author: {
        id: authorId,
      },
      ...postDto,
      likeCount: 0,
      commentCount: 0,
    });

    const newPost = await this.postsRepository.save(post);

    return newPost;
  }

  async updatePost(postId: number, postDto: UpdatePostDto) {
    const { title, content } = postDto;
    // save의 기능
    // 1) 만약에 데이터가 존재하지 않는다면 (id 기준으로) 새로 생성한다.
    // 2) 만약에 데이터가 존재한다면 (같은 id의 값이 존재한다면) 존재하던 값을 업데이트한다.

    const post = await this.postsRepository.findOne({
      where: {
        id: postId,
      },
    });

    if (!post) throw new NotFoundException();

    if (title) post.title = title;
    if (content) post.content = content;

    const newPost = await this.postsRepository.save(post);

    return newPost;
  }

  async deletePost(postId: number) {
    const post = await this.postsRepository.findOne({
      where: { id: postId },
    });

    if (!post) throw new NotFoundException();

    await this.postsRepository.delete(postId);

    return postId;
  }
}
