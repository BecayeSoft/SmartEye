export class Customer {
    private _age: number = -1
    private _emotion: string = 'NA'
    private _gender: string = 'NA'
    private _smile: boolean = false


    constructor(age?: number, gender?: string, emotion?: string, smile?: boolean) {
        this._age = age
        this._gender = gender
        this._emotion = emotion
        this._smile = smile
    }

    //-------------------------------
    // Getters and Setters
    // ------------------------------
    public get age() : number {
        return this._age;
    }
    public set age(v : number) {
        this._age = v;
    }
    
    public get emotion() : string {
        return this._emotion;
    }
    public set emotion(v : string) {
        this._emotion = v;
    }
    
    public get gender() : string {
        return this._gender;
    }
    public set gender(v : string) {
        this._gender = v;
    }

    public get smile() : boolean {
        return this._smile;
    }
    public set smile(v : boolean) {
        this._smile = v;
    }
    
      
}