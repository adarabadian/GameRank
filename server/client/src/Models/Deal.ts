export class Deal{
    public constructor(
        public price?   : any, 
        public store?   : string, 
        public link?    : string, 
        public edition? : string,
        public platform?: String
    ){}
}