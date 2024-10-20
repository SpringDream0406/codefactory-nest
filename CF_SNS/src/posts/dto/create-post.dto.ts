import { PickType } from '@nestjs/mapped-types';
import { PostsModel } from '../entities/post.entity';

// Pick, Omit, Partial -> Type 반환
// PickType, OmitType, PartialType -> 값을 반환
export class CretePostDto extends PickType(PostsModel, ['title', 'content']) {}
