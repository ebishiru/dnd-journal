const { MongoClient } = require("mongodb");
require("dotenv").config();
const { MONGO_URI } = process.env;

const DB = "dndJournal";
const CHARACTERS_COLLECTION = "characters";

const getCharacters = async (req, res) => {
    const client = new MongoClient(MONGO_URI);

    try {
        await client.connect();
        const db = client.db(DB);
        const characters = await db.collection(CHARACTERS_COLLECTION).find().toArray();
        res.status(200).json({
            status: 200,
            data: characters
        });

    } catch (error) {
        res.status(502).json({
            status: 502,
            message: error.message
        })

    } finally {
        await client.close();
    }
}

module.exports = getCharacters;