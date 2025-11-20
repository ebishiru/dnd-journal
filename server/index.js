const express = require("express");
require("dotenv").config();
const { PORT } = process.env

//Handlers
const signUp = require("./handlers/signUp");
const logIn = require("./handlers/logIn");

const getCharacters = require("./handlers/getCharacters");
const createCharacter = require("./handlers/createCharacter");

const app = express();

app.use(express.json());

app.post("/signup", signUp);
app.post("/login", logIn);

app.get("/characters", getCharacters);
app.post("/createCharacter", createCharacter);

//catch-all middleware
app.use((req, res) => {
    res.status(404).json({
        status: 404,
        message: "This is probably not the endpoint you're looking for."
    });
});

app.listen(PORT, () => console.info(`Listening on port ${PORT}`));