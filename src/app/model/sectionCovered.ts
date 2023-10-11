export class SectionCovered {
    public section: number;
    public sectionId: string;
    public isSelected: boolean = false;

    constructor(passedSection: number) 
    {
        this.section = passedSection;
    }
}
