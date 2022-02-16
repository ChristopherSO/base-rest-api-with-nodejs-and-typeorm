import BaseController from "../shared/base/base.controller";
import Member from "./member.entity";
import memberService from "./member.service";

class MemberController extends BaseController<Member> {

	constructor() {
		super(Member, memberService);
	}
}

export default new MemberController();
