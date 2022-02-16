
import BaseController from "../shared/base/base.controller";
import Group from "./group.entity";
import groupService from "./group.service";

class GroupController extends BaseController<Group> {

	constructor() {
		super(Group, groupService);
	}
}

export default new GroupController();
