const { MongoClient } = require("mongodb");
require("dotenv").config();
const { MONGO_URI } = process.env;
const { v4: uuidv4 } = require("uuid");

const DB = "dndJournal";
const CHARACTERS_COLLECTION = "characters";

const createCharacter = async (req, res) => {
    const { author, characterName } = req.body;
    const client = new MongoClient(MONGO_URI);
    const date = new Date();

    if (!characterName) {
        return res.status(400).json({
            status: 400,
            message: "Missing Character Name"
        })
    }

    try {
        await client.connect();
        const db = client.db(DB);

        //Create new character document
        const newCharacter = {
            _id: uuidv4(),
            author,
            createdAt: date,
            lastEdit: date,
            name: characterName,
            story: null,
            quotes: null,
        }
        const result = await db.collection(CHARACTERS_COLLECTION).insertOne(newCharacter);

        //Verify if there's any server issues
        if (!result.acknowledged) {
            return res.status(500).json({
                status: 500,
                message: "Server issue - Character not created."
            })
        }

        //If Character is created
        res.status(201).json({
            status: 201,
            message: "Character successfully created.",
            data: newCharacter
        })

    } catch (error) {
        res.status(502).json({
            status: 502,
            message: error.message,
        })

    } finally {
        await client.close();
    }

}

module.exports = createCharacter;