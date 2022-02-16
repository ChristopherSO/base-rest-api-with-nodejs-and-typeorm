import { IsBoolean, IsNotEmpty, MaxLength } from "class-validator";
import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToMany, JoinTable } from "typeorm";

import Group from "../group/group.entity";
import PhoneNumber from "../phoneNumber/phoneNumber.entity";

@Entity("members")
export default class Member {

	constructor(firstName: string, lastName: string, isActive: boolean = true) {
		this.firstName = firstName;
		this.lastName = lastName;
		this.isActive = isActive;
	}

	@PrimaryGeneratedColumn()
	id: number;

	@Column({ length: 100 })
	@IsNotEmpty()
    @MaxLength(100)
	firstName: string;

	@Column({ length: 100 })
	@IsNotEmpty()
    @MaxLength(100)
	lastName: string;

	@Column()
	@IsBoolean()
	isActive: boolean;

	@OneToMany(() => PhoneNumber, phoneNumber => phoneNumber.member)
	phoneNumbers: PhoneNumber[];

	@ManyToMany(() => Group, group => group.members)
	@JoinTable()
	groups: Group[];
}
