import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany} from "typeorm";
import { Question } from './question.entity';

@Entity('tests')
export class Test {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  subject: string;

  @OneToMany(() => Question, (question) => question.test, { cascade: true })
  questions: Question[];
}