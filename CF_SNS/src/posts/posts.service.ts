import { Injectable, NotFoundException } from '@nestjs/common';
import { PostModel } from './posts.controller';

let posts: PostModel[] = [
  {
    id: 1,
    author: 'newjeans_official',
    title: '뉴진스 민지',
    content: '메이크업 고치고 있는 민지',
    likeCount: 10000000,
    commentCount: 9999,
  },
  {
    id: 2,
    author: 'newjeans_official',
    title: '뉴진스 해린',
    content: '노래 연습 하고 있는 해린',
    likeCount: 10000000,
    commentCount: 9999,
  },
  {
    id: 3,
    author: 'backpink_official',
    title: '플랙핑크 로제',
    content: '종합운동장에서 공연중인 로제',
    likeCount: 10000000,
    commentCount: 9999,
  },
];

@Injectable()
export class PostsService {
  getAllPosts() {
    return posts;
  }

  getPostById(id: number) {
    const post = posts.find((post) => post.id === id);
    if (!post) throw new NotFoundException();
    return post;
  }

  createPost(author: string, title: string, content: string) {
    const post = {
      id: posts[posts.length - 1].id + 1,
      author,
      title,
      content,
      likeCount: 0,
      commentCount: 0,
    };

    posts = [...posts, post];

    return post;
  }

  updatePost(postId: number, author: string, title: string, content: string) {
    const post = posts.find((post) => post.id === postId);

    if (!post) throw new NotFoundException();

    if (author) post.author = author;
    if (title) post.title = title;
    if (content) post.content = content;

    // posts = posts.map((prevPost) => (prevPost.id === postId ? post : prevPost));

    return post;
  }

  deletePost(postId: number) {
    const post = posts.find((post) => post.id === postId);
    if (!post) throw new NotFoundException();

    posts = posts.filter((post) => post.id !== postId);
    return postId;
  }
}
