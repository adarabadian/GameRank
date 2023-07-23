export class Review{
	public constructor(
		public reviewer?:		 string,
		public title?:			string,
		public description?:	string,
		public score?:			number,
		public date?:			 string,
		public reviewerId?:	 number,
		public gameId?:		 any
	){}

}