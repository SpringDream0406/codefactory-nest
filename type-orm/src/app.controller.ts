import { Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Role, UserModel } from './entity/user.entity';
import {
  Between,
  Equal,
  ILike,
  IsNull,
  LessThan,
  LessThanOrEqual,
  Like,
  MoreThan,
  MoreThanOrEqual,
  Not,
  Repository,
} from 'typeorm';
import { ProfileModel } from './entity/profile.entity';
import { PostModel } from './entity/post.entity';
import { TagModel } from './entity/tag.entity';

@Controller()
export class AppController {
  constructor(
    @InjectRepository(UserModel)
    private readonly userRepository: Repository<UserModel>,
    @InjectRepository(ProfileModel)
    private readonly profileRepository: Repository<ProfileModel>,
    @InjectRepository(PostModel)
    private readonly postRepository: Repository<PostModel>,
    @InjectRepository(TagModel)
    private readonly tagRepository: Repository<TagModel>,
  ) {}

  @Get('users')
  getUsers() {
    return this.userRepository.find({
      // where: {
      //   // 아닌경우 가져오기
      //   id: Not(1),
      //   // 적은 경우 가져오기
      //   id: LessThan(30),
      //   // 적은거나 같은경우
      //   id: LessThanOrEqual(30),
      //   // 많은경우
      //   id: MoreThan(30),
      //   // 많거나 같은경우
      //   id: MoreThanOrEqual(30),
      //   // 같은경우
      //   id: Equal(30),
      //   // 유사값 = like
      //   email: Like('%0%'),
      //   // 대소문자 구분 안하는 유사값
      //   email: ILike('GOOGLE'),
      //   // 사이값
      //   id: Between(10, 15),
      //   // 해당되는 여러개의 값
      //   id: In([1, 3, 5, 7, 99]),
      //   // null인 경우 가져오기
      //   id: IsNull(),
      // },
      // 어떤 프로퍼티를 선택할지
      // 기본은 모든 프로퍼티를 가져온다
      // 만약에 select를 정의하지 않으면
      // select를 정의하면 정의된 프로퍼티들만 가져오게 된다.
      // select: {
      //   id: true,
      //   createdAt: true,
      //   updatedAt: true,
      //   version: true,
      //   profil: {
      //     id: true,
      //   },
      // },
      // 필터링할 조건을 입력하게 된다.
      // where: [
      //   {
      //     profil: {
      //       id: 3,
      //     },
      //   },
      //   { version: 1 },
      // ],
      // 관계를 가져오는 법
      // relations: {
      //   profil: true,
      // },
      // // 오름차(ASC), 내림차(DESC)
      // order: {
      //   profil: {
      //     id: 'ASC',
      //   },
      // },
      // // 처음 부터 몇개를 제외할지
      // skip: 0,
      // // 처음 부터 몇개를 가져올지
      // take: 0,
    });
  }

  @Post('sample')
  async sample() {
    // 모델에 해당되는 객체 생성 - 저장은 안함
    const user1 = this.userRepository.create({
      email: 'test@codefactory.ai',
    });

    // 저장
    const user2 = await this.userRepository.save({
      email: 'test@codefactory.ai',
    });

    // preload
    // 입력된 값을 기반으로 데이터베이스에 있는 데이터를 불러오고
    // 추가 입력된 값으로 데이터베이스에서 가져온 값들을 대체함
    // 저장하지는 않음
    // find + create
    const user3 = await this.userRepository.preload({
      id: 101,
      email: 'codefactory@codefactory.ai',
    });

    // 삭제하기
    await this.userRepository.delete(101);

    // 값을 증가시킴
    await this.userRepository.increment(
      {
        id: 1,
      },
      'count',
      2,
    );

    // 값을 감소시킴
    await this.userRepository.decrement(
      {
        id: 1,
      },
      'count',
      1,
    );

    // 갯수 카운팅하기
    const count = await this.userRepository.count({
      where: {
        email: ILike('%0%'),
      },
    });

    // sum
    const sum = await this.userRepository.sum('count', {
      email: ILike('%0%'),
    });

    // average
    const average = await this.userRepository.average('count', {
      id: LessThan(4),
    });

    // 최소값
    const min = await this.userRepository.minimum('count', {
      id: LessThanOrEqual(4),
    });

    // 최대값
    const max = await this.userRepository.maximum('count', {
      id: MoreThan(5),
    });

    // find
    const user = await this.userRepository.find({});

    // findOne
    const userOne = await this.userRepository.findOne({
      where: {
        id: 3,
      },
    });

    // 페이지 네이션 => 가져오는 데이터 수 제한걸어서 가져오고, 전체 데이터 수 같이 알려줌.
    const usersAndCount = await this.userRepository.findAndCount({
      take: 5, // 가져오는 갯수 제한이라 count 값이랑 다름
    });
  }

  @Post('users')
  postUser() {
    return this.userRepository.save({
      role: Role.ADMIN,
    });
  }

  @Patch('users/:id')
  async patchUser(@Param('id') id: string) {
    const user = await this.userRepository.findOne({
      where: {
        id: parseInt(id),
      },
    });

    return this.userRepository.save({
      ...user,
      // title: user.title + '0',
    });
  }

  @Delete('user/profile/:id')
  async deleteProfile(@Param('id') id: string) {
    await this.profileRepository.delete(+id);
  }

  @Post('user/profile')
  async createUserAndProfile() {
    const user = await this.userRepository.save({
      email: 'asdf@codefactory.ai',
      profile: {
        profileImg: 'asdf.jpg',
      },
    });

    // const profile = await this.profileRepository.save({
    //   profileImg: 'asdf.jpg',
    //   user,
    // });
    return user;
  }

  @Post('user/post')
  async createUserAndPosts() {
    const user = await this.userRepository.save({
      email: 'postuser@codefactory.ai',
    });

    await this.postRepository.save({
      author: user,
      title: 'post 1',
    });

    await this.postRepository.save({
      author: user,
      title: 'post 2',
    });

    return user;
  }

  @Post('posts/tags')
  async createPostsTags() {
    const post1 = await this.postRepository.save({
      title: 'NestJS Lecture',
    });
    const post2 = await this.postRepository.save({
      title: 'Programming Lecture',
    });

    const tag1 = await this.tagRepository.save({
      name: 'Javascript',
      posts: [post1, post2],
    });
    const tag2 = await this.tagRepository.save({
      name: 'Typescript',
      posts: [post1],
    });

    const post3 = await this.postRepository.save({
      title: 'NextJS Lecture',
      tags: [tag1, tag2],
    });

    return true;
  }

  @Get('posts')
  getPosts() {
    return this.postRepository.find({
      relations: {
        tags: true,
      },
    });
  }

  @Get('tags')
  getTags() {
    return this.tagRepository.find({
      relations: {
        posts: true,
      },
    });
  }
}
