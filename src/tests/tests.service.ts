import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Test } from './entities/test.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class TestsService {
  constructor(
    @InjectRepository(Test)
    private readonly testRepository: Repository<Test>,
  ) {}

  async createTest(subject: string, questions: any[]): Promise<Test> {
    const test = this.testRepository.create({ subject, questions });
    return this.testRepository.save(test);
  }

  async getAllTests(): Promise<Test[]> {
    return this.testRepository.find();
  }
}
