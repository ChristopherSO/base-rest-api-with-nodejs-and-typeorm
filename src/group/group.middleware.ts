import BaseMiddleware from "../shared/base/base.middleware";
import Group from "./group.entity";
import groupService from "./group.service";

class GroupMiddleware extends BaseMiddleware<Group> {

	constructor() {
		super(Group, groupService);
	}
}

export default new GroupMiddleware();
