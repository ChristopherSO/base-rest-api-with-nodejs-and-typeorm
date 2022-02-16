import BaseController from "../shared/base/base.controller";
import PhoneNumber from "./phoneNumber.entity";
import phoneNumberService from "./phoneNumber.service";

class PhoneNumberController extends BaseController<PhoneNumber> {

	constructor() {
		super(PhoneNumber, phoneNumberService);
	}
}

export default new PhoneNumberController();
