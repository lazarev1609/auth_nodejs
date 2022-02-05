const { connection } = require('../database/connection');
const bcrypt = require('bcryptjs');
const {validationResult} = require('express-validator');
const jwt  = require('jsonwebtoken');
const {secret} = require('../config');

const generateAccessToken = (id, roles) => {
	const payload = {
		id,
		roles
	};
	return jwt.sign(payload, secret, {expiresIn: "24h"}); //Первый параметр - данные которые мы хотим спрятать, второй - секретный ключ
}

class authController {
	
	async registration(req, res){
		
		try{
			const errors = validationResult(req);
			if(!errors.isEmpty()){
				return res.status(400).json({message: "Ошибка при регистрация"});
			}
			const {username, password} = req.body;
			const users = await connection.promise().query("SELECT username,password FROM user WHERE username = '"+username+"'");
			
			//console.log("Users: ", users[0][0].password);
			
			if(users[0].length > 0){
				throw "Пользователь с таким именем уже существует";
			}
			const hashPassword = bcrypt.hashSync(password,5); // Хэшируем пароль
			const userRole = await connection.promise().query("SELECT Value FROM roles WHERE Value = 'admin'");
			//console.log("Результат запроса:", userRole[0][0].Value);
			const Role = userRole[0][0].Value;
			//await connection.promise().query(`INSERT INTO user (username, password, roles) VALUES('${username}', '${hashPassword}','${userRole}')`);
			await connection.promise().query("INSERT INTO user (username, password, roles) VALUES(?,?,?)",[username, hashPassword, Role]);
			res.status(201).json({message: "Успешная регистрация"}); //Успешное создание
		} catch(e){
			console.log(e);
			res.status(400).json({message: e}); //Ошибка пользователя при вводе данных
		}
	}

	async login(req, res){
		
		try{
			//console.log("HERE");
			let {username, password} = req.body
			//console.log(password);
			const users = await connection.promise().query("SELECT id, username, password, roles FROM user WHERE username = '"+username+"'");
			console.log(users[0][0].id);
			if(users[0].length == 0){
				throw "Пользователя с таким именем не существует";
			}
			//const p = password;
			const validPassword = bcrypt.compareSync(password,users[0][0].password);
			if(!validPassword){
				throw "Введен неверный пароль";
			}
			let tmp_id = users[0][0]["id"];
			let tmp_roles = users[0][0].roles;
			console.log(tmp_id + ' ' + tmp_id);
			const token = generateAccessToken(tmp_id, tmp_roles);
			return res.json({token});

		} catch(e){
			console.log(e);
			res.status(400).json({message: e}); //Ошибка пользователя при вводе данных
		}
	}

	async getUsers(req, res){
		
		try{
			const users = await connection.promise().query("SELECT * FROM user");
			res.json(users[0]);
			console.log(users[0]);
		} catch(e){
			
		}
	}

}

module.exports = new authController()