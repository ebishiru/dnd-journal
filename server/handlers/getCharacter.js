const { MongoClient } = require("mongodb");
require("dotenv").config();
const { MONGO_URI } = process.env;

const DB = "dndJournal";
const CHARACTERS_COLLECTION = "characters";

const getCharacter = async (req, res) => {
    const client = new MongoClient(MONGO_URI);
    const { _id } = req.params;

    try {
        await client.connect();
        const db = client.db(DB);
        const character = await db.collection(CHARACTERS_COLLECTION).findOne({ _id });

        //if character is not found
        if (!character) {
            return res.status(404).json({
                status: 404,
                message: "Character not found."
            })
        }

        //If character is found
        res.status(200).json({
            status: 200,
            data: character
        })
    } catch (error) {
        res.status(502).json({
            status: 502,
            message: error.message
        })
    } finally {
        await client.close();
    }

}

module.exports = getCharacter;