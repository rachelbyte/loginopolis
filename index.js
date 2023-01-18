const express = require('express');
const app = express();
const { User } = require('./db');
const bcrypt = require("bcrypt");

const SALT_COUNT = 10;

app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.get('/', async (req, res, next) => {
  try {
    res.send('<h1>Welcome to Loginopolis!</h1><p>Log in via POST /login or register via POST /register</p>');
  } catch (error) {
    console.error(error);
    next(error)
  }
});

// POST /register
// TODO - takes req.body of {username, password} and creates a new user with the hashed password
app.post("/register", async(req, res, next) => {

  try {
  const {username, password} = req.body
  const hashed = await bcrypt.hash(password, SALT_COUNT)
  await User.create({username, password: hashed});

  console.log(req.body);
  res.send(`User "${username}" was successfully created.`);

  } catch (error) {
    console.error(error);
    next(error)
  }
  
});
// POST /login
// TODO - takes req.body of {username, password}, finds user by username, and compares the password with the hashed version from the DB
app.post("/login", async (req, res, next) => {

  try {
    const {username, password} = req.body;
    const [foundUser] = await User.findOne({where: {username}})
    // hash compare
    if (!foundUser) {
      res.send('User not found')
      return
    }
    // hash compare#
    const isMatch = await bcrypt.compare(password, foundUser.password)
    if (!isMatch) {
      res.status(401).send('Username or password is incorrect.')
      return
    }
res.send(`successfully logged in user: ${username}`)
  } catch (error) {
    console.error(error);
    next(error)
  }

})
// we export the app, not listening in here, so that we can run tests
module.exports = app;
