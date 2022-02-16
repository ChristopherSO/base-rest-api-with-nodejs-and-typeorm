import { Router } from "express";

import memberMiddleware from "../member/member.middleware";
import sharedMiddleware from "../shared/shared.middleware";
import groupController from "./group.controller";
import groupMiddleware from "./group.middleware";

class GroupRoutes {
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
		} = groupController;

		this.router.post(
			"/",
			groupMiddleware.validateEntityProperties,
			groupMiddleware.validateEntityDoesNotExistByProperties(["name"]),
			create,
		);

		this.router.get(
			"/",
			getAll,
		);

		this.router.get(
			"/:id",
			sharedMiddleware.validateParamIds,
			getById(["members"]),
		);

		this.router.put(
			"/:id",
			sharedMiddleware.validateParamIds,
			groupMiddleware.validateEntityAlreadyExists,
			groupMiddleware.validateEntityProperties,
			update,
		);

		this.router.delete(
			"/:id",
			sharedMiddleware.validateParamIds,
			groupMiddleware.validateEntityAlreadyExists,
			remove,
		);

		this.router.put(
			"/:groupId/members/:memberId",
			sharedMiddleware.validateParamIds,
			groupMiddleware.validateEntityAlreadyExists,
			memberMiddleware.validateEntityProperties,
			addEntity,
		);

		this.router.delete(
			"/:groupId/members/:memberId",
			sharedMiddleware.validateParamIds,
			groupMiddleware.validateEntityAlreadyExists,
			removeEntity,
		);
	}

	public getRouter(): Router {
		return this.router;
	}
}

export default new GroupRoutes();
