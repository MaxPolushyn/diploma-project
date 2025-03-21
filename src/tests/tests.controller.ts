import { Controller, Get, Post, Delete, Body, Param } from '@nestjs/common';
import { TestsService } from './tests.service';
import { Test } from './entities/test.entity';
import { Question } from './entities/question.entity';
import { Answer } from './entities/answer.entity';
import { CreateTestDto } from './dto/create-test.dto';

@Controller('tests')
export class TestsController {
  constructor(private readonly testsService: TestsService) {}

  @Post()
  async create(@Body() testData: CreateTestDto): Promise<Test> {
    return this.testsService.createTest(testData.title, testData.subject, testData.questions);
  }

  @Get()
  getAllTests(): Promise<Test[]> {
    return this.testsService.getAllTests();
  }

  @Post(':testId/questions')
  async addQuestion(
    @Param('testId') testId: number,
     @Body() 
   questionData: { text: string }): Promise<Question> {

    return this.testsService.createQuestion(testId, questionData.text);

  }

  @Post('questions/:questionId/answers')
  async addAnswer(@Param('questionId') questionId: number, 
  @Body() 
  answerData: { text: string; isCorrect: boolean }): Promise<Answer> {

    return this.testsService.createAnswer(questionId, answerData.text, answerData.isCorrect);
  }

  @Delete('questions/:questionId')
  async deleteQuestion(@Param('questionId') questionId: number): Promise<void> {

    return this.testsService.deleteQuestion(questionId);
  }
}
