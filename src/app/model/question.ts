export class Question {
    public book: string;
    public chapter: string; 
    public verse: string;
    public section: number;
    public type: string;
    public isBFlight: boolean;
    public isUnpublished: boolean;
    public question: string;
    public answer: string;

    constructor(passedBook: string, passedChapter: string,  passedVerse: string, passedSection: number, passedType: string,
        passedIsBFlight: boolean, passedIsUnpublished: boolean, passedQuestion: string, passedAnswer: string) 
    {
        this.book = passedBook;
        this.chapter = passedChapter;
        this.verse = passedVerse;
        this.section = passedSection;
        this.type = passedType;
        this.isBFlight = passedIsBFlight;
        this.isUnpublished = passedIsUnpublished;
        this.question = passedQuestion;
        this.answer = passedAnswer;
    }
}
