import BaseMiddleware from "../shared/base/base.middleware";
import Member from "./member.entity";
import memberService from "./member.service";

class MemberMiddleware extends BaseMiddleware<Member> {

	constructor() {
		super(Member, memberService);
	}
}

export default new MemberMiddleware();
