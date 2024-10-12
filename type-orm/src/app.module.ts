import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModel } from './entity/user.entity';
import { StudentModel, TeacherModel } from './entity/person.entity';
import { BookModel, CarModel } from './entity/inheritance.entity';
import { ProfileModel } from './entity/profile.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: '127.0.0.1',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'typeormstudy',
      entities: [
        UserModel, //
        StudentModel,
        TeacherModel,
        BookModel,
        CarModel,
        ProfileModel,
      ],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([
      UserModel, //
      ProfileModel,
    ]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
