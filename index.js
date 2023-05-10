// initial package
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const db = require('./database');
const recipes = require('./controllers/recipes');
const users = require('./controllers/users');


// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}));
// parse application/json
app.use(bodyParser.json());

// routes

// users
app.get("/users/:id", getById);
app.get("/users", getAll);
app.post("/users", createUser);
app.patch("/users/:id", update);
app.delete("/users/:id", deleteUser);


// recipes
app.get("/recipes/:id", getById);
app.get("/recipes", getAll);
app.post("/recipes", createRecipes);
app.patch("/recipes/:id", update);
app.delete("/recipes/:id", deleteRecipes);


app.get("/", (req, res) => {
    res.send("API for Users");
  });
  
  app.listen(3000, () => {
    console.log("App running in port 3000");
  });