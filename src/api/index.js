import express from 'express';
import { dirname } from 'path';
import path from 'path'
import { fileURLToPath } from 'url';
import session from "express-session";
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { isUserLoggedIn } from './utils.js';
import { UserRoutes } from './userAuth/userRoutes.js';
import { UserService } from './userAuth/userService.js';
import { ReservationRoutes } from './reservationAuth/reservationRoutes.js';
import { ReservationService } from './reservationAuth/reservationService.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express()
const router = express.Router();
const port = 3000
const userService = new UserService();
const reservationService = new ReservationService();

app.use(cors())
app.use(cookieParser())

app.use(session({
  secret: "z;t7T6dxV~*p/AXX4duv7q9)c",
  resave: false,
  saveUninitialized: true
}));

let userRoutes = new UserRoutes();
userRoutes.createRoutes(router);

let reservationRoutes = new ReservationRoutes();
reservationRoutes.createRoutes(router);

app.use(function (req, res, next)
{
  if (res.get("Content-Type") === "text/html")
  {
    res.type("json")
  }
  next();
});

app.use('/', router);

app.listen(port, () =>
{
  console.log(`Node app listening on port ${port}`)
});

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.get("/", (req, res) => {
    res.render("home");
}); 

app.get("/admin", (req, res) => {
  userService.findAll().then((users) => {
    reservationService.findAll().then((reservations) => {
      res.render("admin", { title: "Admin", users: users, reservations: reservations });
    }); 
  });
});

app.get("/reservation", (req, res) => {
  if ( !isUserLoggedIn(req)  ) {
    res.render("loginsignup");
    return;
  }

  res.render("reservation")
}); 