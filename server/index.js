const express = require("express");
require("dotenv").config();
const { PORT } = process.env

//Handlers
const signUp = require("./handlers/signUp");
const logIn = require("./handlers/logIn");

const getCharacters = require("./handlers/getCharacters");
const getCharacter = require("./handlers/getCharacter");
const createCharacter = require("./handlers/createCharacter");
const editCharacter = require("./handlers/editCharacter");
const deleteCharacter = require("./handlers/deleteCharacter");

const getCampaigns = require("./handlers/getCampaigns")
const createCampaign = require("./handlers/createCampaign");

const app = express();

app.use(express.json());

app.post("/signup", signUp);
app.post("/login", logIn);

app.get("/characters", getCharacters);
app.get("/character/:_id", getCharacter);
app.post("/createCharacter", createCharacter);
app.patch("/editCharacter", editCharacter);
app.delete("/character", deleteCharacter);

app.get("/campaigns", getCampaigns);
app.post("/createCampaign", createCampaign);

//catch-all middleware
app.use((req, res) => {
    res.status(404).json({
        status: 404,
        message: "This is probably not the endpoint you're looking for."
    });
});

app.listen(PORT, () => console.info(`Listening on port ${PORT}`));