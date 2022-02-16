import BaseRepository from "../shared/base/base.repository";
import PhoneNumber from "./phoneNumber.entity";

class PhoneNumberRepository extends BaseRepository<PhoneNumber> {

	constructor() {
		super(PhoneNumber);
	}
}

export default new PhoneNumberRepository();
