import { createConnection } from "typeorm";
import * as express from "express";
import { Request, Response } from "express";
import "reflect-metadata";

import memberRoutes from "./member/member.routes";
import groupRoutes from "./group/group.routes";
import phoneNumberRoutes from "./phoneNumber/phoneNumber.routes";
import sharedMiddleware from "./shared/shared.middleware";
import { ObserverEvent, observerService } from "./shared/observer.service";

// Start TypeORM connection
createConnection()
	.then(() => {

		// create and setup express app
		const app = express();
		app.use(express.json());

		// Root route
		app.get("/", (req: Request, res: Response) => {
			res.send("Welcome to my API!");
		});

		// Entity routes
		app.use("/api/v1/members", memberRoutes.getRouter());
		app.use("/api/v1/groups", groupRoutes.getRouter());
		app.use("/api/v1/phone-numbers", phoneNumberRoutes.getRouter());

		// Error middlewares (always leave these last)
		app.use(sharedMiddleware.logErrors);
		app.use(sharedMiddleware.globalErrorHandler);

		// start express server
		const port = process.env.PORT || 3000;
		app.listen(port, () => {
			console.log(`Running on port ${port}`);
		});

		// Notify connection is ready
		observerService.notify(ObserverEvent.ConnectionIsReady);
	})
	.catch(error => console.log("Connection", error));
