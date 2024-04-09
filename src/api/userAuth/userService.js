import bcrypt from 'bcrypt';
import { dbConnect } from '../config.js';
import moment from 'moment';

class UserService
{
	async findAll() 
	{
		let connection = await dbConnect();
		let [rows, fields] = await connection.execute("SELECT * FROM users");

		return rows;
	}

	async findReservations(username) 
	{
		let connection = await dbConnect();
		let [rows, fields] = await connection.execute("SELECT * FROM reservations WHERE username=?", [username]);

		rows.forEach(row => {
			row.dateTime = moment(row.dateTime).format("MMMM Do YYYY [at] HH:mma");
		});

		return (rows.length > 0) ? rows : [];
	}

	async deleteUser(username)
	{
		let connection = await dbConnect();
		let [rows, fields] = await connection.execute("DELETE FROM users WHERE username=?", [username]);

		console.log("DELETED ROWS:" + JSON.stringify(rows))
		return (rows.affectedRows > 0);
	}

	/**
	 * Checks if username is in table if so return true if not return false
	 * @param {string} username
	 * @return {Promise<boolean>}
	 */
	async checkUsername(username)
	{
		let connection = await dbConnect();
		let [rows, fields] = await connection.execute("SELECT * FROM users WHERE username=?", [username])
		
		if (rows.length > 0)
		{
			return true;
		}
		
		return false
	}
	
	/**
	 * Checks if email is in the database
	 * @param {string} email
	 * @returns {Promise<boolean>}
	 */
	async checkEmail(email)
	{
		let connection = await dbConnect();
		let [rows, fields] = await connection.execute("SELECT * FROM users WHERE email=?", [email])
		
		if (rows.length > 0)
		{
			return true;
		}
		
		return false
	}
	
	async insertUser(username, email, password)
	{
		let connection = await dbConnect(); // Establish connection
		const hash = await bcrypt.hash(password, 10); // Hash password
		
		try
		{
			await connection.execute("INSERT INTO users (username, email, password) VALUES (?, ?, ?)", [username, email, hash]);
			return null; // User is inserted successfully
		}
		catch (error)
		{
			console.error("Error:", error);
			return { error: error }; // Return the error
		}
	}
	
	async login(user, password)
	{
		let connection = await dbConnect();
		if (!await this.checkUsername(user))
		{
			return {error: "User does not exist, please sign up."}
		}
		
		let [rows, fields] = await connection.execute("SELECT * FROM users WHERE username=? or email=?", [user, user]);
		return await bcrypt.compare(password, rows[0].password).then(result =>
		{
			if (result)
			{
				return {
					loginSuccessful: true, 
					user: rows[0]
				};
			}
			
			return {
				loginSuccessful: false,
				error: "Username or password is incorrect"
			};
			
		}).catch(error => { return {error: error} })
	}

	async insertAdmin(username, email, password, isAdmin)
	{
		let connection = await dbConnect(); // Establish connection
		const hash = await bcrypt.hash(password, 10); // Hash password
		isAdmin = 1; 
		
		try
		{
			console.log("username =" + username);
			console.log("email =" + email);
			console.log("password =" + hash);

			await connection.execute("INSERT INTO users (username, email, password, isAdmin) VALUES (?, ?, ?, ?)", [username, email, hash, isAdmin]);
			return null; // Admin is inserted successfully
		}
		catch (error)
		{
			console.error("Error:", error);
			return { error: error }; // Return the error
		}
	}
}

export { UserService }