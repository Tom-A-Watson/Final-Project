import express from 'express';
import { dirname } from 'path';
import path from 'path'
import { fileURLToPath } from 'url';
import session from "express-session";
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { isUserLoggedIn, isAdminUserLoggedIn } from './utils.js';
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

const userRoutes = new UserRoutes();
userRoutes.createRoutes(router);

const reservationRoutes = new ReservationRoutes();
reservationRoutes.createRoutes(router);

app.use(function (req, res, next)
{
  if (res.get("Content-Type") === "text/html")
  {
    res.type("json")
  }
  next();
});

let userAuthUrls = [ "/reservation", "/user/myprofile", "/api/reserve" ];
let adminUserUrls = [ "/admin" ];

app.use('/', function (req, res, next) {
  let isAdminUrl = adminUserUrls.find(url => req.url.startsWith(url));
  if ( isAdminUrl && !isAdminUserLoggedIn(req) ) {
    res.redirect("/user/loginsignup");
    return;
  }

  next()
});

app.use('/', function (req, res, next) {
  let isUserAuthUrl = userAuthUrls.find(url => req.url.startsWith(url));
  if ( isUserAuthUrl && !isUserLoggedIn(req) ) {
    res.redirect("/user/loginsignup");
    return;
  }

  next()
});




app.use('/', router);

app.listen(port, () =>
{
  console.log(`Node app listening on port ${port}`)
});

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
    res.render("home", { title: "Home", isUserLoggedIn, req });
}); 

app.get("/admin", (req, res) => {
  userService.findAll().then((users) => {
    reservationService.findAll().then((reservations) => {
      res.render("admin", { title: "Admin", isUserLoggedIn, req, users: users, reservations: reservations });
    }); 
  });
});

app.get("/reservation", (req, res) => {
  res.render("reservation", { title: "Book a Table", isUserLoggedIn, req })
}); 