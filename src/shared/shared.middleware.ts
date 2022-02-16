import { NextFunction, Request, Response } from "express";

class SharedMiddleware {

	/**
	 * Validate only ID type params (numbers).
	 * Param names must be called "id" or end with "Id", slug type names will be ignored.
	 */
	validateParamIds(request: Request, response: Response, next: NextFunction) {
		const ids = Object.entries(request.params)
			.filter(([key, value]) => key === "id" || key.endsWith("Id"))
			.map(([key, value]) => value);

		let errorMessage;
		for (let i = 0; i < ids.length; i++) {
			const id = ids[i];
			if (!(
				id.match(/^\d+$/) // Check if the id is a string parsable to a number
				&& +id <= 2147483647 // Check if the number is a Postgres integer
			)) {
				errorMessage = `The given ID "${id}" is not valid.`;
				break;
			}
		}

		if (errorMessage) {
			response
				.status(400) // Status 400 Bad Request
				.send(errorMessage);
			return;
		}

		// If no errors, continue.
		next();
	}

	logErrors(error: Error, request: Request, response: Response, next: NextFunction) {
		// console.error(error.stack);
		next(error);
	}

	globalErrorHandler(error: Error, request: Request, response: Response, next: NextFunction) {
		/**
		 * Using `next(error)` at this point (the very end) will delegate the error handling to Express
		 * which will use the built-in error handler. Read more about it here:
		 * https://expressjs.com/en/guide/error-handling.html#the-default-error-handler
		 * If you want to send something custom, don't use `next(error)`.
		 */
		next(error);

		// Uncomment next lines if a view engine can be used.
		// response
		// 	.status(500) // Status 500 Internal Server Error
		// 	.render("error", { error });
	}
}

export default new SharedMiddleware();
