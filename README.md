# Base REST API built with Node.js, Express, TypeORM, and PostgreSQL
The intention of this repo is to serve as a base/template project that can be used to speed up the creation of new REST APIs.

Steps to run this project:

1. Run `npm i` command
2. Edit the `ormconfig.json` file and put your PostgreSQL database connection configuration options.
3. Run `npm start` command

## Key Features
* Folder per entity. Instead of using the common folders entity, controllers, services, etc. This project uses a folder for each entity and groups all their related files. For example:

		MyProject
		└── src
		    └── member                      // Entity folder
		        ├── member.entity.ts        // The entity
		        ├── member.routes.ts        // Self explanatory
		        ├── member.controller.ts
		        ├── member.repository.ts
		        └── etc.
	In the `ormconfig.json` configuration be sure to point the entities location to `"src/**/*.entity.ts"` to make this file structure work.
* Use of the Controller-Service-Repository pattern.
* Node.js way for singletons are used by doing, for example:

		export default new MemberController();

	This way the instance that is being passed works as a singleton since Node.js places it in cache and will pass the same instance of `new MemberController()` wherever is imported.
* TypeScript classes and inheritance. All basic methods for CRUD operations plus adding and removing elements from relational collections (e.g. member phone numbers) are extracted in reusable base classes. The idea is to just implement the base class to inherit all the most used methods. Any special/specific methods should go in the child classes. There are base classes for middleware, controller, service, and repository.
* Endpoint request validations and checks are done in Express middlewares.
* Repositories uses (and should use) the `responseHelper()` method which is a wrapper for the async calls and handles the error catching in order to don't see any "try-catch" in the app but only there. It returns the custom type `Response<T> = [T] | [null, Error]`, doing so it can be used like this, for example:

		const [entities, error] = await this._entityService.getAll();

* A shared middleware called `globalErrorHandler` is defined to handle all unexpected errors.
* A custom Observer Service is used. Simple subscribe to event and notify to listeners are available.
* It contains 3 sample entities: Group, Member, and PhoneNumber. With these the relationships of TypeORM are put to test.
	* One-to-many

		A Member can have many PhoneNumbers
	* Many-to-one

		A PhoneNumber can be owned by one Member
	* Many-to-many

		A Member can be part of many Groups

		A Group can contain many Members

## License
[MIT](https://github.com/ChristopherSO/base-rest-api-with-nodejs-and-typeorm/blob/main/LICENSE)
