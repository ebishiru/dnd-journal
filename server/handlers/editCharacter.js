const { MongoClient } = require("mongodb");
require("dotenv").config();
const { MONGO_URI } = process.env;

const DB = "dndJournal";
const CHARACTERS_COLLECTION = "characters";

//Get date in DD/MM/YYYY format
const formatDate = (date = new Date()) => {
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return `${day < 10 ? "0" + day : day}/${month < 10 ? "0" + month : month}/${year}`;
};

const editCharacter = async (req, res) => {
    const { _id, name, story, quotes } = req.body;
    const client = new MongoClient(MONGO_URI);

    //Verify that CharId is provided
    if (!_id) {
        return res.status(400).json({
            status: 400,
            message: "Character ID is missing. Please try again."
        })
    }
    const query = { _id };
    const edittedValues = {
        $set: {

        }
    }
}