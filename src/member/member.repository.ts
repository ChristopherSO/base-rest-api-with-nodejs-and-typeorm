import BaseRepository from "../shared/base/base.repository";
import Member from "./member.entity";

class MemberRepository extends BaseRepository<Member> {

	constructor() {
		super(Member);
	}
}

export default new MemberRepository();
