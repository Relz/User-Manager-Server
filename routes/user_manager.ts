import * as express from "express";
import * as fs from "fs";
import * as path from "path";
import {config} from "../config";
import * as db from "../db";

export function getUsers(req: express.Request, res: express.Response): void
{
	res.setHeader("Content-Type", "application/json");

	const users: db.User[] = [];
	db.getUsers((err, row) => {
		if (err)
		{
			return false;
		}
		const user: db.User = {
			id: row.id,
			lastName: row.last_name,
			firstName: row.first_name,
			middleName: row.middle_name,
			birthday: row.birthday,
			email: row.email,
			phoneNumber: row.phone_number,
			photo: row.photo
		};
		users.push(user);
	}, () => {
		res.send(users);
	});
}

export function addUser(req: express.Request, res: express.Response): void
{
	const user: db.User =
	{
		id: 0,
		lastName: req.body.last_name,
		firstName: req.body.first_name,
		middleName: req.body.middle_name,
		birthday: req.body.birthday,
		email: req.body.email,
		phoneNumber: req.body.phone_number,
		photo: req.file.path
	};
	db.addUser(user);
	res.send(config.HTTP_STATUS.OK);
}

export function editUser(req: express.Request, res: express.Response): void
{
	const userId: number = req.params.id;
	const filePath: string = (req.file !== undefined) ? req.file.path : "";
	const user: db.User = {
		id: userId,
		lastName: req.body.last_name,
		firstName: req.body.first_name,
		middleName: req.body.middle_name,
		birthday: req.body.birthday,
		email: req.body.email,
		phoneNumber: req.body.phone_number,
		photo: filePath
	};
	let columns: string = "";
	let values: string = "";
	if (user.lastName !== undefined)
	{
		if (columns.length !== 0)
		{
			columns += ",";
			values += ",";
		}
		columns += "last_name";
		values += `'${user.lastName}'`;
	}
	if (user.firstName !== undefined)
	{
		if (columns.length !== 0)
		{
			columns += ",";
			values += ",";
		}
		columns += "first_name";
		values += `'${user.firstName}'`;
	}
	if (user.middleName !== undefined)
	{
		if (columns.length !== 0)
		{
			columns += ",";
			values += ",";
		}
		columns += "middle_name";
		values += `'${user.middleName}'`;
	}
	if (user.birthday !== undefined)
	{
		if (columns.length !== 0)
		{
			columns += ",";
			values += ",";
		}
		columns += "birthday";
		values += `'${user.birthday}'`;
	}
	if (user.email !== undefined)
	{
		if (columns.length !== 0)
		{
			columns += ",";
			values += ",";
		}
		columns += "email";
		values += `'${user.email}'`;
	}
	if (user.phoneNumber !== undefined)
	{
		if (columns.length !== 0)
		{
			columns += ",";
			values += ",";
		}
		columns += "phone_number";
		values += `'${user.phoneNumber}'`;
	}
	if (user.photo !== "")
	{
		if (columns.length !== 0)
		{
			columns += ",";
			values += ",";
		}
		columns += "photo";
		values += `'${user.photo}'`;
	}
	if (user.photo !== "")
	{
		db.getUserData(user.id, "photo", (err: Error, row: any) => {
			if (err)
			{
				res.send(config.HTTP_STATUS.SERVER_INTERNAL_ERROR);
			}
			else
			{
				db.editUser(user.id, columns, values);
				fs.unlink(path.join(__dirname, "../" + row.photo), () => {
					res.send(config.HTTP_STATUS.OK);
				});
			}
		});
	}
	else
	{
		db.editUser(user.id, columns, values);
		res.send(config.HTTP_STATUS.OK);
	}
}

export function removeUser(req: express.Request, res: express.Response): void
{
	const id: number = req.params.id;
	db.getUserData(id, "photo", (err: Error, row: any) => {
		if (err)
		{
			res.send(config.HTTP_STATUS.SERVER_INTERNAL_ERROR);
		}
		else
		{
			db.removeUser(id);
			fs.unlink(path.join(__dirname, "../" + row.photo), () => {
				res.send(config.HTTP_STATUS.OK);
			});
		}
	});
}

export function getUserPhoto(req: express.Request, res: express.Response): void
{
	const photo: string = req.params.photo;
	res.sendFile(path.join(__dirname, "../" + config.uploadDir) + photo);
}

export function getUserData(req: express.Request, res: express.Response): void
{
	db.getUserData(req.query.userId, "*", (err: Error, row: any) => {
		if (err)
		{
			res.send(config.HTTP_STATUS.SERVER_INTERNAL_ERROR);
		}
		else
		{
			const user: db.User = {
				id: row.id,
				lastName: row.last_name,
				firstName: row.first_name,
				middleName: row.middle_name,
				birthday: row.birthday,
				email: row.email,
				phoneNumber: row.phone_number,
				photo: row.photo
			};
			res.send(JSON.stringify(user));
		}
	});
}
