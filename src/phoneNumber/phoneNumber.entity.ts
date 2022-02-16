import { Type } from "class-transformer";
import { IsNotEmpty, MaxLength, ValidateNested } from "class-validator";
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";

import Member from "../member/member.entity";
import IdOnly from "../shared/id-only.entity";

@Entity("phone_numbers")
export default class PhoneNumber {

	constructor(label: string, number: string) {
		this.label = label;
		this.number = number;
	}

	@PrimaryGeneratedColumn()
	id: number;

	@Column({ length: 100 })
	@IsNotEmpty()
    @MaxLength(100)
	label: string;

	@Column({ length: 100 })
	@IsNotEmpty()
    @MaxLength(100)
	number: string;

	@ManyToOne(() => Member, member => member.phoneNumbers)
	@IsNotEmpty()
	@ValidateNested()
	@Type(() => IdOnly)
	member: Member;
}
