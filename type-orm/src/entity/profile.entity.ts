import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserModel } from './user.entity';

@Entity()
export class ProfileModel {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => UserModel, (user) => user.profil)
  @JoinColumn() // JoinColumn 있는곳에 컬럼 생김
  user: UserModel;

  @Column()
  profileImg: string;
}
