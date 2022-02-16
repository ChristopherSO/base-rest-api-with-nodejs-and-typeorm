import { IsNotEmpty, MaxLength } from "class-validator";
import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from "typeorm";

import Member from "../member/member.entity";

@Entity("groups")
export default class Group {

	constructor(name: string, description: string = "") {
		this.name = name;
		this.description = description;
	}

	@PrimaryGeneratedColumn()
	id: number;

	@Column({ length: 100, unique: true })
	@IsNotEmpty()
    @MaxLength(100)
	name: string;

	@Column({ length: 255 })
    @MaxLength(255)
	description: string;

	@ManyToMany(() => Member, member => member.groups)
	members: Member[];
}
