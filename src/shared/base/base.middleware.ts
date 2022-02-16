import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { NextFunction, Request, Response } from "express";

import BaseService from "./base.service";
import { firstCharToLowerCase } from "../utils";

export default class BaseMiddleware<T> {

	private _entityName: string;

	constructor(
		private _entityType: any,
		private _entityService: BaseService<T>,
	) {
		// Entity name in PascalCase
		const entityName = this._entityType.name;
		// Entity name in camelCase
		this._entityName = firstCharToLowerCase(entityName);
	}

	validateEntityProperties = async (
		request: Request,
		response: Response,
		next: NextFunction,
	) => {
		const entity = plainToInstance(this._entityType, request.body);
		const errors = await validate(entity);
		if (errors.length > 0) {
			const errorMessages = [];

			errors.forEach(error => {
				Object.values(error.constraints || []).forEach(errorMessage => {
					errorMessages.push(errorMessage);
				});
				error.children.forEach(childError => {
					Object.values(childError.constraints).forEach(errorMessage => {
						errorMessages.push(`${error.property} ${errorMessage}`);
					});
				});
			});

			response
				.status(400) // Status 400 Bad Request
				.json(errorMessages);

			return;
		}

		// If no errors, continue.
		next();
	};

	/**
	 * This middleware expects that the param id to validate must be called either "id"
	 * or "<entityName>Id".
	 */
	validateEntityAlreadyExists = async (
		request: Request,
		response: Response,
		next: NextFunction,
	) => {
		const id = request.params.id || request.params[`${this._entityName}Id`];

		const [foundEntity, error] = await this._entityService.getById(+id);
		if (error) {
			next(error);
			return;
		}
		if (!foundEntity) {
			const errorMessage = `The ${this._entityName} with ID ${id} does not exist.`;
			response
				.status(404) // Status 404 Not Found
				.send(errorMessage);
			return;
		}

		// If no errors, continue.
		next();
	};

	validateEntityDoesNotExistByProperties = (propertyNames: string[]) => async (
		request: Request,
		response: Response,
		next: NextFunction,
	) => {
		const entity = plainToInstance(this._entityType, request.body);

		const properties = {};
		propertyNames.forEach(propertyName => {
			properties[propertyName] = entity[propertyName];
		});

		// Validate given property names
		Object.entries(properties).forEach(([propertyName, value]) => {
			if (value === undefined) {
				throw new Error(`The given property name "${propertyName}" is not valid for ${this._entityType.name}. Valid property names are ${JSON.stringify(Object.keys(entity))}.`);
			}
		});

		const [foundEntity, error] = await this._entityService.getByProperties(properties);
		if (error) {
			next(error);
			return;
		}
		if (foundEntity) {
			const errorMessage = `The ${this._entityName} with properties ${JSON.stringify(properties)} already exists.`;

			response
				.status(409) // Status 409 Conflict
				.send(errorMessage);
			return;
		}

		// If no errors, continue.
		next();
	};
}
