import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Test } from './entities/test.entity';
import { Question } from './entities/question.entity';
import { Answer } from './entities/answer.entity';

@Injectable()
export class TestsService {
  constructor(
    @InjectRepository(Test)
    private readonly testRepository: Repository<Test>,

    @InjectRepository(Question)
    private readonly questionRepository: Repository<Question>,

    @InjectRepository(Answer)
    private readonly answerRepository: Repository<Answer>,
  ) {}

  async createTest(subject: string, questions: { text: string; answers: { text: string; isCorrect: boolean }[] }[]): Promise<Test> {
    const test = this.testRepository.create({ subject });
    await this.testRepository.save(test);

    for (const questionData of questions) {
      const question = await this.createQuestion(test.id, questionData.text);

      for (const answerData of questionData.answers) {
        await this.createAnswer(question.id, answerData.text, answerData.isCorrect);
      }
    }

    return test;
  }

  async getAllTests(): Promise<Test[]> {
    return this.testRepository.find({ relations: ['questions', 'questions.answers'] });
  }

  async getTestWithQuestionsAndAnswers(testId: number): Promise<Test> {
    const test = await this.testRepository.findOne({ where: { id: testId }, relations: ['questions', 'questions.answers'] });
  
    if (!test) {
      throw new NotFoundException('Test not found'); 
    }
  
    return test;
  }

async createQuestion(testId: number, text: string): Promise<Question> {
  const test = await this.testRepository.findOne({ where: { id: testId } });  
  if (!test) {
    throw new NotFoundException('Test not found');
  }
  const question = this.questionRepository.create({ text, test });
  return this.questionRepository.save(question);
}


async createAnswer(questionId: number, text: string, isCorrect: boolean): Promise<Answer> {
  const question = await this.questionRepository.findOne({ where: { id: questionId } });  
  if (!question) {
    throw new NotFoundException('Question not found');
  }
  const answer = this.answerRepository.create({ text, isCorrect, question });
  return this.answerRepository.save(answer);
}


}
