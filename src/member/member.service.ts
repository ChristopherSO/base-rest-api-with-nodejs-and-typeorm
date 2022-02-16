import BaseService from "../shared/base/base.service";
import Member from "./member.entity";
import memberRepository from "./member.repository";

class MemberService extends BaseService<Member> {

	constructor() {
		super(memberRepository);
	}
}

export default new MemberService();
