export class CreateTestDto {
    title: string;
    subject: string;
    questions: {
      text: string;
      answers: {
        text: string;
        isCorrect: boolean;
      }[];
    }[];
  }
  