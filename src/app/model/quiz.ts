import { QuizQuestion } from "./quizQuestion";

export class Quiz {
    public quizId: string;
    public questionList: Array<QuizQuestion>

    constructor(passedQuestionList: Array<QuizQuestion>, passedQuizId: string) 
    {
        this.questionList = passedQuestionList;
        this.quizId = passedQuizId;
    }
}
