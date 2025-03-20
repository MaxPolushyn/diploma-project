import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TestsService } from './tests.service';
import { CreateTestDto } from './dto/create-test.dto';
import { UpdateTestDto } from './dto/update-test.dto';
import { Test } from './entities/test.entity';

@Controller('tests')
export class TestsController {
  constructor(private readonly testsService: TestsService) {}

  @Post()
  create (@Body() testData: { subject: string; questions: any[] }): Promise<Test> {
    return this.testsService.createTest(testData.subject, testData.questions);
  }

  @Get()
  getAllTests(): Promise<Test[]> {
    return this.testsService.getAllTests();
  }

  
}
