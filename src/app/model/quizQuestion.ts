import { Question } from "./question";

export class QuizQuestion {
    public questionNumber: string;
    public question: Question

    constructor(passedQuestion: Question, passedQuestionNumber: string) 
    {
        this.question = passedQuestion;
        this.questionNumber = passedQuestionNumber;
    }
}
