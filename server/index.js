const express = require("express");
require("dotenv").config();
const { PORT } = process.env
import cors from "cors";

//Handlers
const signUp = require("./handlers/signUp");
const logIn = require("./handlers/logIn");

const getCharacters = require("./handlers/getCharacters");
const getCharacter = require("./handlers/getCharacter");
const createCharacter = require("./handlers/createCharacter");
const editCharacter = require("./handlers/editCharacter");
const deleteCharacter = require("./handlers/deleteCharacter");

const getCampaigns = require("./handlers/getCampaigns")
const getCampaign = require("./handlers/getCampaign");
const createCampaign = require("./handlers/createCampaign");
const editCampaign = require("./handlers/editCampaign");
const deleteCampaign = require("./handlers/deleteCampaign");

const app = express();

app.use(cors({
    origin: "*",
    credentials: true
}))

app.use(express.json());

app.post("/signup", signUp);
app.post("/login", logIn);

app.get("/characters", getCharacters);
app.get("/character/:_id", getCharacter);
app.post("/createCharacter", createCharacter);
app.patch("/editCharacter", editCharacter);
app.delete("/character", deleteCharacter);

app.get("/campaigns", getCampaigns);
app.get("/campaign/:_id", getCampaign);
app.post("/createCampaign", createCampaign);
app.patch("/editCampaign", editCampaign);
app.delete("/campaign", deleteCampaign);

//catch-all middleware
app.use((req, res) => {
    res.status(404).json({
        status: 404,
        message: "This is probably not the endpoint you're looking for."
    });
});

app.listen(PORT, () => console.info(`Listening on port ${PORT}`));