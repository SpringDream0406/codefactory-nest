import { PartialType } from '@nestjs/mapped-types';
import { PostsModel } from '../entities/post.entity';

export class UpdatePostDto extends PartialType(PostsModel) {}
