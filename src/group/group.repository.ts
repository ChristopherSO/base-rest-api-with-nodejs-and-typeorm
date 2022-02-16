import BaseRepository from "../shared/base/base.repository";
import Group from "./group.entity";

class GroupRepository extends BaseRepository<Group> {

	constructor() {
		super(Group);
	}
}

export default new GroupRepository();
