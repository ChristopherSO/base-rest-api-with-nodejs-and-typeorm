import { IsInt } from "class-validator";

export default class IdOnly {

	@IsInt()
	id: number;
}
