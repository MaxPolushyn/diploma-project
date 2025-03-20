import { Controller, Get, Post, Body } from '@nestjs/common';
import { TestsService } from './tests.service';
import { Test } from './entities/test.entity';

@Controller('tests')
export class TestsController {
  constructor(private readonly testsService: TestsService) {}

  @Post()
  async create(@Body() testData: { subject: string; questions: { text: string; answers: { text: string; isCorrect: boolean }[] }[] }): Promise<Test> {
    const test = await this.testsService.createTest(testData.subject, testData.questions);

    for (const questionData of testData.questions) {
      const question = await this.testsService.createQuestion(test.id, questionData.text);

      for (const answerData of questionData.answers) {
        await this.testsService.createAnswer(question.id, answerData.text, answerData.isCorrect);
      }
    }

    return this.testsService.getTestWithQuestionsAndAnswers(test.id);
  }

  @Get()
  getAllTests(): Promise<Test[]> {
    return this.testsService.getAllTests();
  }
}
