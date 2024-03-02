import express from 'express';
import session from "express-session"
import crypto from 'crypto';
import cors from 'cors';
import { UserRoutes } from './userAuth/userRoutes.js';
const app = express()
const router = express.Router();
const port = 3000

app.use(cors())

app.use(session({
  secret: crypto.randomBytes(20).toString('hex'),
  resave: false,
  saveUninitialized: true
}))

let userRoutes = new UserRoutes();
userRoutes.createRoutes(router);

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