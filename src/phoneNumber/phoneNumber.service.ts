import BaseService from "../shared/base/base.service";
import PhoneNumber from "./phoneNumber.entity";
import phoneNumberRepository from "./phoneNumber.repository";

class PhoneNumberService extends BaseService<PhoneNumber> {

	constructor() {
		super(phoneNumberRepository);
	}
}

export default new PhoneNumberService();
