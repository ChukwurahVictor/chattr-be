import { Module } from "@nestjs/common";
import { PrismaModule } from "src/prisma/prisma.module";
import { ReactionsService } from './reactions.service';
import { ReactionsController } from './reactions.controller';

@Module({
  controllers: [ReactionsController],
  providers: [ReactionsService],
  imports: [PrismaModule],
})
export class ReactionsModule {}