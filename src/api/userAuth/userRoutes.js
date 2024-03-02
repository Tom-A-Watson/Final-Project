import multer from 'multer';
import { UserData } from './userData.js';
import { Utils } from "../utils.js"

class UserRoutes
{
	constructor()
	{

	}
	
	/**
	 * Create Routes for all User stuff like login and signUp
	 * @param {Router} router
	 */
	createRoutes(router)
	{
		let userData = new UserData();
		let upload = multer();
		let utils = new Utils();
		router.post("/user/signup", upload.none(), async function (req, res)
		{
			if (!req.body)
			{
				res.status(400)
				res.json({error: "One or more fields were not filled out"});
				return;
			}
			
			let { username, email, password, confirmPass } = req.body;
			
			if (utils.isEmpty(username) || utils.isEmpty(email) || utils.isEmpty(password) || utils.isEmpty(confirmPass))
			{
				res.status(400)
				res.json({error: "One or more fields were not filled out"});
				return;
			}
			
			if (password !== confirmPass)
			{
				res.status(400)
				res.json({error: "Passwords don't match"});
				return;
			}
			
			if (await userData.checkUsername(username) || await userData.checkEmail(email))
			{
				res.status(409);
				res.json({error: "Username or email already exists"})
				return;
			}
			
			let error = await userData.insertUser(username, email, password);
			
			if (error)
			{
				res.status(500);
				res.json(error);
				return;
			}
			
			res.sendStatus(201);
		})
		
		router.post("/user/login", upload.none(), async function (req, res)
		{
			if (!req.body)
			{
				res.status(400);
				res.json({error: "Not all data filled out"});
			}
			
			let { user, password} = req.body;
			if (utils.isEmpty(user) || utils.isEmpty(password))
			{
				res.status(400);
				res.json({error: "Not all data filled out"});
				return;
			}
			
			let error = await userData.login(user, password)
			
			if (error)
			{
				res.status(500)
				res.json(error);
				return;
			}
			
			req.session.user = user;
			res.sendStatus(200);
		})
	}
}

export { UserRoutes }