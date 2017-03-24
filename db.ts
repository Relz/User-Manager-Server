import * as sqlite3 from "sqlite3";

sqlite3.verbose();
const db: sqlite3.Database = new sqlite3.Database("usermanager.db");

export class User
{
	public id: number;
	public lastName: string;
	public firstName: string;
	public middleName: string;
	public birthday: number;
	public email: string;
	public phoneNumber: string;
	public photo: string;
}

db.serialize( () => {
	db.run("CREATE TABLE IF NOT EXISTS user (\
`id` INTEGER PRIMARY KEY AUTOINCREMENT,\
`last_name` VARCHAR(255) DEFAULT '',\
`first_name` VARCHAR(255) DEFAULT '',\
`middle_name` VARCHAR(255) DEFAULT '',\
`birthday` DATE NOT NULL,\
`email` VARCHAR(255) DEFAULT '',\
`phone_number` VARCHAR(15) DEFAULT '',\
`photo` VARCHAR(255) DEFAULT '')"
	);
});
interface IDbUser {
	name: string;
}
// tslint:disable:no-any
export function getUsers(callback: (err: Error, row: any) => void, onComplete: () => void): void
{
	db.each("SELECT * FROM user", callback, onComplete);
}
// tsling:enable:no-any

export function addUser(user: User): void
{
	const query: string = `INSERT INTO user \
('last_name','first_name','middle_name','birthday','email','phone_number','photo') VALUES \
('${user.lastName}','${user.firstName}','${user.middleName}',\
'${user.birthday}','${user.email}','${user.phoneNumber}','${user.photo}')`;
	db.run(query);
}

export function editUser(id: number, columns: string, values: string): void
{
	const query: string =
		`UPDATE user \
SET (${columns}) = \
(${values}) \
WHERE id='${id}'`;
	db.run(query);
}

export function removeUser(id: number): void
{
	const query: string = `DELETE FROM user WHERE id='${id}'`;
	db.run(query);
}

// tslint:disable:no-any
export function getUserData(id: number, columns: string, callback: (err: Error, row: any) => void): void
{
	const query: string = `SELECT ${columns} FROM user WHERE id='${id}'`;
	db.each(query, callback);
}
// tsling:enable:no-any
