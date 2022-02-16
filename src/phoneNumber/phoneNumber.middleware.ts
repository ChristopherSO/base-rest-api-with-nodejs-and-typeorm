import { NextFunction, Request, Response } from "express";

import BaseMiddleware from "../shared/base/base.middleware";
import PhoneNumber from "./phoneNumber.entity";
import phoneNumberService from "./phoneNumber.service";

class PhoneNumberMiddleware extends BaseMiddleware<PhoneNumber> {

	constructor() {
		super(PhoneNumber, phoneNumberService);
	}
}

export default new PhoneNumberMiddleware();
