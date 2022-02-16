import { Router } from "express";

import sharedMiddleware from "../shared/shared.middleware";
import phoneNumberController from "./phoneNumber.controller";
import phoneNumberMiddleware from "./phoneNumber.middleware";

class PhoneNumberRoutes {
	private readonly router: Router;

	constructor() {
		this.router = Router();
		this.initRoutes();
	}

	private initRoutes(): void {
		const { create, getAll, getById, update, remove } = phoneNumberController;

		this.router.post(
			"/",
			phoneNumberMiddleware.validateEntityProperties,
			phoneNumberMiddleware.validateEntityDoesNotExistByProperties(["number"]),
			create,
		);

		this.router.get(
			"/",
			getAll,
		);

		this.router.get(
			"/:id",
			sharedMiddleware.validateParamIds,
			getById,
		);

		this.router.put(
			"/:id",
			sharedMiddleware.validateParamIds,
			phoneNumberMiddleware.validateEntityAlreadyExists,
			update,
		);

		this.router.delete(
			"/:id",
			sharedMiddleware.validateParamIds,
			phoneNumberMiddleware.validateEntityAlreadyExists,
			remove,
		);
	}

	public getRouter(): Router {
		return this.router;
	}
}

export default new PhoneNumberRoutes();
