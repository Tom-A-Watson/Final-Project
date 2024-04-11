import multer from 'multer';
import { UserService } from './userService.js';
import { isEmpty, logUserOut } from "../utils.js"
import { Router } from 'express';

class UserRoutes
{
	constructor() {}
	
	/**
	 * Create routes for all user stuff like login and signUp
	 * @param {Router} router
	 */
	createRoutes(router)
	{
		let userService = new UserService();
		let upload = multer();

		router.post("/api/user/signup", upload.none(), async function (req, res)
		{
			if (!req.body)
			{
				res.status(400);
				res.json({error: "One or more fields were not filled out"});
				return;
			}
			
			let { username, email, password, confirmPass } = req.body;
			
			if (isEmpty(username) || isEmpty(email) || isEmpty(password) || isEmpty(confirmPass))
			{
				res.status(400);
				res.json({error: "One or more fields were not filled out"});
				return;
			}
			
			if (password !== confirmPass)
			{
				res.status(400);
				res.json({error: "Passwords don't match"});
				return;
			}
			
			if (await userService.checkUsername(username) || await userService.checkEmail(email))
			{
				res.status(409);
				res.json({error: "Username or email already exists"})
				return;
			}
			
			let error = await userService.insertUser(username, email, password);
			
			if (error)
			{
				res.status(500);
				res.json(error);
				return;
			}
			
			res.sendStatus(201);
		})
		
		router.post("/api/user/login", upload.none(), async function (req, res)
		{
			if (!req.body)
			{
				res.status(400);
				res.json({error: "One or more fields were not filled out"});
			}
			
			let { user, password } = req.body;
			if (isEmpty(user) || isEmpty(password))
			{
				res.status(400);
				res.json({error: "One or more fields were ont filled out"});
				return;
			}
			
			let loginResult = await userService.login(user, password)
			
			if ( !loginResult.loginSuccessful )
			{
				res.status(500)
				res.json(loginResult);
				return;
			}
			console.log("Before ------------------------" + user);

			req.session.user = loginResult.user;
			console.log("HEREE ------------------------" + JSON.stringify(req.session.user) );
			res.sendStatus(200);
		})

		router.get("/user/loginsignup", async function (req, res) 
		{	
			res.render("loginsignup");
		})

		router.get("/api/user/isloggedin", async function (req, res) 
		{	
			console.log("HEREE isLoggedIn ------------------------" + req.session.user);
			if (req.session.user == null)
			{
				res.status(403);
				res.json({error: "You are not logged in, please login to make a reservation"});
				return;
			}

			res.sendStatus(200);
		})
		
		router.get("/user/logout", async function(req, res)
		{
			let loggedIn = logUserOut(req);

			if (!loggedIn) 
			{
				res.status(400);
				res.json({error: "You are not logged in!"});
				return;
			}

			res.redirect("/");
		})

		router.get("user/profile", async function(req, res)
		{
			let username = req.params.username
			let accountDetails = await userService.findUser(username);
			let userReservations = await userService.findReservations(username);

			res.render("profile", accountDetails, userReservations);
		})

		router.post("/api/admin/createadmin", upload.none(), async function(req, res) 
		{
			if (!req.body)
			{
				res.status(400);
				res.json({error: "One or more fields were not filled out"});
			}
			
			let { username, email, password, isAdmin } = req.body;
			if (isEmpty(username) || isEmpty(email) || isEmpty(password))
			{
				res.status(400);
				res.json({error: "One or more fields were ont filled out"});
				return;
			}

			if (await userService.checkUsername(username) || await userService.checkEmail(email))
			{
				res.status(409);
				res.json({error: "Username or email already exists"})
				return;
			}

			let error = await userService.insertAdmin(username, email, password, isAdmin);
			
			if (error)
			{
				res.status(500);
				res.json(error);
				return;
			}

			res.sendStatus(201);
		})

		router.delete("/api/user/:username", async function(req, res) 
		{
			let username = req.params.username;
			let userDeleted = await userService.deleteUser(username);

			console.log("DELETED USER RESULT:" + JSON.stringify(userDeleted))

			if (!userDeleted) 
			{
				res.status(404);
				res.json({error: "User was not found (they may have already been deleted prior)"});
				return;
			}

			res.sendStatus(200);
		})
	}
}

export { UserRoutes }