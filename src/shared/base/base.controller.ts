import { plainToInstance } from "class-transformer";
import { NextFunction, Request, Response } from "express";

import BaseService from "./base.service";
import { firstCharToLowerCase } from "../utils";

export default class BaseController<T> {

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

	/**
	 * The following methods are used as arrow functions in order to preserve the class context.
	 * This is because the methods used in the router methods (post, get, put, delete) are sent
	 * by reference without outer context. If we use normal functions we will lose the context
	 * of the controller instance, for example, by calling `this` inside a method it would return
	 * `undefined`. By using arrow functions we enforce to use the context of the controller and
	 * not of the passed function.
	 */

	create = async (request: Request, response: Response, next: NextFunction) => {
		const entity: any = plainToInstance(this._entityType, request.body);

		const [createdEntity, error] = await this._entityService.create(entity);
		if (error) {
			next(error);
			return;
		}

		response
			.status(201) // Status 201 Created
			.json(createdEntity);
	};

	getAll = async (request: Request, response: Response, next: NextFunction) => {
		const [entities, error] = await this._entityService.getAll();
		if (error) {
			next(error);
			return;
		}

		response.json(entities); // Default status 200 OK
	};

	getById = (
		relations?: string[],
	) => async (request: Request, response: Response, next: NextFunction) => {
		const id = +request.params.id;

		const [entity, error] = await this._entityService.getById(id, relations);
		if (error) {
			next(error);
			return;
		}

		if (!entity) {
			const errorMessage = `The ${this._entityName} with ID ${id} was not found.`;
			response
				.status(404) // Status 404 Not Found
				.send(errorMessage);
			return;
		}

		response.json(entity); // Default status 200 OK
	};

	update = async (request: Request, response: Response, next: NextFunction) => {
		const entity: any = plainToInstance(this._entityType, request.body);
		entity.id = +request.params.id;

		const [updatedEntity, error] = await this._entityService.update(entity);
		if (error) {
			next(error);
			return;
		}

		response
			.status(200) // Status 200 OK PUT method (Updated)
			.json(updatedEntity);
	};

	remove = async (request: Request, response: Response, next: NextFunction) => {
		const id = +request.params.id;

		const [_wasEntityRemoved, error] = await this._entityService.remove(id);
		if (error) {
			next(error);
			return;
		}

		const successMessage = `The ${this._entityName} with ID ${id} was successfully removed.`;
		response
			.status(200) // Status 200 OK DELETE method (Removed)
			.send(successMessage);
	};

	/**
	 * This method expects that the param id to validate must be called "<entityName>Id".
	 */
	addEntity = (
		typeOfEntityToAdd: any,
	) => async (request: Request, response: Response, next: NextFunction) => {
		const parentEntityId = +request.params[`${this._entityName}Id`];
		const routePath = request.route.path;
		// Get last parameter id from endpoint
		const idOfEntityToAdd = +request.params[routePath.slice(routePath.lastIndexOf(":") + 1)];
		const nameOfEntityToAdd = firstCharToLowerCase(typeOfEntityToAdd.name);
		const requestBody: Object = request.body;
		const entityToAdd: any = plainToInstance(typeOfEntityToAdd, requestBody);
		entityToAdd.id = idOfEntityToAdd;

		const [wasEntityAdded, error] = await this._entityService.addEntity(
			parentEntityId,
			entityToAdd,
		);
		if (error) {
			next(error);
			return;
		}

		if (!wasEntityAdded) {
			const errorMessage = `The ${nameOfEntityToAdd} with ID ${idOfEntityToAdd} already belongs to the ${this._entityName}, nothing was added.`;
			response
				.status(409) // Status 409 Conflict
				.send(errorMessage);
			return;
		}

		const successMessage = `The ${nameOfEntityToAdd} with ID ${idOfEntityToAdd} was successfully added.`;
		response
			.status(200) // Status 200 OK PUT method (Added)
			.send(successMessage);
	};

	/**
	 * This method expects that the param id to validate must be called "<entityName>Id".
	 */
	removeEntity = (
		typeOfEntityToRemove: any,
	) => async (request: Request, response: Response, next: NextFunction) => {
		const parentEntityId = +request.params[`${this._entityName}Id`];
		const routePath = request.route.path;
		// Get last parameter id from endpoint
		const idOfEntityToRemove = +request.params[routePath.slice(routePath.lastIndexOf(":") + 1)];
		const nameOfEntityToRemove = firstCharToLowerCase(typeOfEntityToRemove.name);

		const [wasEntityRemoved, error] = await this._entityService.removeEntity(
			parentEntityId,
			idOfEntityToRemove,
			typeOfEntityToRemove,
		);
		if (error) {
			next(error);
			return;
		}

		if (!wasEntityRemoved) {
			const errorMessage = `The ${nameOfEntityToRemove} with ID ${idOfEntityToRemove} was not found in the ${this._entityName}, nothing was removed.`;
			response
				.status(404) // Status 404 Not Found
				.send(errorMessage);
			return;
		}

		const successMessage = `The ${nameOfEntityToRemove} with ID ${idOfEntityToRemove} was successfully removed.`;
		response
			.status(200) // Status 200 OK PUT method (Removed)
			.send(successMessage);
	};
}
