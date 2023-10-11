export class MaterialCovered {
    public book: string;
    public chapter: string;
    public matId: string; 
    public isSelected: boolean = false;

    constructor(passedBook: string, passedChapter: string) 
    {
        this.book = passedBook;
        this.chapter = passedChapter;
    }
}
