import { DeleteResult } from "typeorm";

import BaseRepository from "./base.repository";
import { Response } from "../utils";

export default class BaseService<T> {

	constructor(
		private _entityRepository: BaseRepository<T>,
	) { }

	async create(entity: T): Promise<Response<T>> {
		return this._entityRepository.create(entity);
	}

	async getAll(): Promise<Response<T[]>> {
		return this._entityRepository.getAll();
	}

	async getById(id: number, relations?: string[]): Promise<Response<T>> {
		return this._entityRepository.getById(id, relations);
	}

	async getByProperties(properties: Object): Promise<Response<T>> {
		return this._entityRepository.getByProperties(properties);
	}

	async update(entity: T): Promise<Response<T>> {
		return this._entityRepository.update(entity);
	}

	async remove(id: number): Promise<Response<DeleteResult>> {
		return this._entityRepository.remove(id);
	}

	async addEntity(parentEntityId: number, entityToAdd: any): Promise<Response<boolean>> {
		const entityName = entityToAdd.constructor.name;
		const relationName = this._entityRepository.getRelationPropertyName(entityName);

		const [parentEntity, error] = await this._entityRepository.getById(
			parentEntityId,
			[relationName],
		);
		if (error) return [null, error];

		// Check if the entity to add already exists
		const foundEntity = parentEntity[relationName]
			.find(entity => entity.id === entityToAdd.id);
		if (foundEntity) {
			// Entity-to-add was already there, nothing to add.
			return [false];
		}

		parentEntity[relationName].push(entityToAdd);
		const [_updateResult, updateError] = await this._entityRepository.update(parentEntity);
		if (updateError) return [null, updateError];

		return [true];
	}

	async removeEntity(
		parentEntityId: number,
		idOfEntityToRemove: number,
		typeOfEntityToRemove: any,
	): Promise<Response<boolean>> {
		const entityName = typeOfEntityToRemove.name;
		const relationName = this._entityRepository.getRelationPropertyName(entityName);

		const [parentEntity, error] = await this._entityRepository.getById(
			parentEntityId,
			[relationName],
		);
		if (error) return [null, error];

		// Check if the entity to remove exists
		const foundEntity = parentEntity[relationName]
			.find(entity => entity.id === idOfEntityToRemove);
		if (!foundEntity) {
			// Entity-to-remove was not found, nothing to remove.
			return [false];
		}

		parentEntity[relationName] = parentEntity[relationName]
			.filter(entity => entity.id !== idOfEntityToRemove);
		const [_updatedEntity, updateError] = await this._entityRepository.update(parentEntity);
		if (updateError) return [null, updateError];

		return [true];
	}
}
