import BaseService from "../shared/base/base.service";
import Group from "./group.entity";
import groupRepository from "./group.repository";

class GroupService extends BaseService<Group> {

	constructor() {
		super(groupRepository);
	}
}

export default new GroupService();
