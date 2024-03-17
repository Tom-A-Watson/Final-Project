import express from 'express';
import session from "express-session";
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { UserRoutes } from './userAuth/userRoutes.js';
import { ReservationRoutes } from './reservationAuth/reservationRoutes.js';

const app = express()
const router = express.Router();
const port = 3000

app.use(cors())
app.use(cookieParser())

app.use(session({
  secret: "z;t7T6dxV~*p/AXX4duv7q9)c",
  resave: false,
  saveUninitialized:  true
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

app.use('/api', router);
app.listen(port, () =>
{
  console.log(`Example app listening on port ${port}`)
});