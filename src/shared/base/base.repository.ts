import { DeleteResult, FindConditions, getRepository, Repository } from "typeorm";

import { ObserverEvent, observerService } from "../observer.service";
import { Response, responseHelper } from "../utils";

export default class BaseRepository<T> {
	private _repository: Repository<T>;
	private _entityNameByRelationPropertyNameMap = new Map<string, string>();

	constructor(
		private _entityType: any,
	) {
		observerService.subscribe({
			event: ObserverEvent.ConnectionIsReady,
			callback: () => {
				this._repository = getRepository(this._entityType);
				this._generateRelationsMap();
			},
			useOnce: true,
		});
	}

	private _generateRelationsMap() {
		// Generate map from TypeORM one-to-many and many-to-many relations
		this._repository.metadata.oneToManyRelations
			.concat(this._repository.metadata.manyToManyRelations)
			.forEach(relation => {
				const { type, propertyName } = relation;
				const entityName = (type as Function).name;
				this._entityNameByRelationPropertyNameMap.set(entityName, propertyName);
			});
	}

	getRelationPropertyName(entityType: any): string {
		return this._entityNameByRelationPropertyNameMap.get(entityType);
	}

	async create(entity): Promise<Response<T>> {
		return responseHelper(this._repository.save(entity));
	}

	async getAll(): Promise<Response<T[]>> {
		const conditions: FindConditions<any> = {
			order: {
				id: "ASC",
			},
		};
		return responseHelper(this._repository.find(conditions));
	}

	async getById(id: number, relations?: string[]): Promise<Response<T>> {
		return responseHelper(this._repository.findOne(id, { relations }));
	}

	async getByProperties(properties: Object): Promise<Response<T>> {
		return responseHelper(this._repository.findOne({ where: properties }));
	}

	async update(entity): Promise<Response<T>> {
		return responseHelper(this._repository.save(entity));
	}

	async remove(id: number): Promise<Response<DeleteResult>> {
		return responseHelper(this._repository.delete(id));
	}
}
