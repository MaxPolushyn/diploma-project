import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TestsService } from './tests.service';
import { TestsController } from './tests.controller';
import { Test } from './entities/test.entity';
import { Question } from './entities/question.entity';
import { Answer } from './entities/answer.entity';
@Module({
  imports: [TypeOrmModule.forFeature([Test, Question, Answer])], 
  controllers: [TestsController],
  providers: [TestsService],
  exports: [TestsService],
})
export class TestsModule {}