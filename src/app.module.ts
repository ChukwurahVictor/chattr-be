import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { PostsModule } from './posts/posts.module';
import { CommentsModule } from './comments/comments.module';
import { CategoriesModule } from './categories/categories.module';
import { ReactionsModule } from './reactions/reactions.module';
import { FollowsModule } from './follows/follows.module';

@Module({
  imports: [AuthModule, UsersModule, PostsModule, CommentsModule, CategoriesModule, ReactionsModule, FollowsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
