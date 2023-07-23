import { Deal } from "./Deal";
import { Review } from "./Review";

export class Game{
	public constructor(
		public id?:				 number,
		public name?:				 string,
		public developer?:			string,
		public releaseDate?:		any,
		public picture?:			string,
		public description?:		string,
		public isPc?:				 boolean,
		public isPs?:				 boolean,
		public isXbox?:			 boolean,
		public reviewsCount?:		 number,
		public userScore?:			number,
		public scoreSummary?:		 number,
		public reviews?:			Array<Review>,
		public deals?:				Array<Deal>
	){}

}