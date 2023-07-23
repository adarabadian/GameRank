export class UserDetails{
	public constructor(
		public userId?		 : number,
		public userName?		 : string,
		public firstName?		: string,
		public lastName?		 : string,
		public email?			: string,
		public token?			: string,
		public socket?		 : any
	){}
}