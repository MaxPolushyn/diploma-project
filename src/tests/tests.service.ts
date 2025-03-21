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

  async createTest(title: string, subject: string, questions: any[]): Promise<Test> {
    const test = this.testRepository.create({ title, subject });
    await this.testRepository.save(test);
  
    for (const questionData of questions) {
      const question = this.questionRepository.create({ text: questionData.text, test });
      await this.questionRepository.save(question);
  
      for (const answerData of questionData.answers) {
        const answer = this.answerRepository.create({
          text: answerData.text,
          isCorrect: answerData.isCorrect,
          question,
        });
        await this.answerRepository.save(answer);
      }
    }
  
    const savedTest = await this.testRepository.findOne({
      where: { id: test.id },
      relations: ['questions', 'questions.answers'],
    });
  
    if (!savedTest) {
      throw new Error('Test not found after saving');
    }
  
    return savedTest;
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
async deleteQuestion(questionId: number): Promise<void> {
  await this.questionRepository.delete(questionId);
}

}
