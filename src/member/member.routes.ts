import { Router } from "express";

import sharedMiddleware from "../shared/shared.middleware";
import memberMiddleware from "./member.middleware";
import memberController from "./member.controller";
import Group from "../group/group.entity";
import phoneNumberMiddleware from "../phoneNumber/phoneNumber.middleware";
import PhoneNumber from "../phoneNumber/phoneNumber.entity";
import groupMiddleware from "../group/group.middleware";

class MemberRoutes {
	private readonly router: Router;

	constructor() {
		this.router = Router();
		this.initRoutes();
	}

	private initRoutes(): void {
		const {
			create,
			getAll,
			getById,
			update,
			remove,
			addEntity,
			removeEntity,
		} = memberController;

		this.router.post(
			"/",
			memberMiddleware.validateEntityProperties,
			memberMiddleware.validateEntityDoesNotExistByProperties(["firstName", "lastName"]),
			create,
		);

		this.router.get(
			"/",
			getAll,
		);

		this.router.get(
			"/:id",
			sharedMiddleware.validateParamIds,
			getById(["phoneNumbers", "groups"]),
		);

		this.router.put(
			"/:id",
			sharedMiddleware.validateParamIds,
			memberMiddleware.validateEntityAlreadyExists,
			update,
		);

		this.router.delete(
			"/:id",
			sharedMiddleware.validateParamIds,
			memberMiddleware.validateEntityAlreadyExists,
			remove,
		);

		this.router.put(
			"/:memberId/groups/:groupId",
			sharedMiddleware.validateParamIds,
			memberMiddleware.validateEntityAlreadyExists,
			groupMiddleware.validateEntityProperties,
			addEntity(Group),
		);

		this.router.delete(
			"/:memberId/groups/:groupId",
			sharedMiddleware.validateParamIds,
			memberMiddleware.validateEntityAlreadyExists,
			removeEntity(Group),
		);

		this.router.put(
			"/:memberId/phone-numbers/:phoneNumberId",
			sharedMiddleware.validateParamIds,
			memberMiddleware.validateEntityAlreadyExists,
			phoneNumberMiddleware.validateEntityProperties,
			addEntity(PhoneNumber),
		);

		this.router.delete(
			"/:memberId/phone-numbers/:phoneNumberId",
			sharedMiddleware.validateParamIds,
			memberMiddleware.validateEntityAlreadyExists,
			removeEntity(PhoneNumber),
		);
	}

	public getRouter(): Router {
		return this.router;
	}
}

export default new MemberRoutes();
