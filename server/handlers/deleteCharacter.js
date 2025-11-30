const { MongoClient } = require("mongodb");
require("dotenv").config();
const { MONGO_URI } = process.env;

const DB = "dndJournal";
const CHARACTERS_COLLECTION = "characters";

const deleteCharacter = async (req, res) => {
    const client = new MongoClient(MONGO_URI);
    const { _id } = req.body;
    const query = { _id };
    try {
        await client.connect();
        const db = client.db(DB);
        const deletion = await db.collection(CHARACTERS_COLLECTION).deleteOne( query );
        if (deletion.deletedCount === 0) {
            res.status(400).json({
                status: 400,
                message: "Character was not deleted."
            })
        }
        res.status(200).json({
            status: 200,
            message: "Character successfully deleted."
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

module.exports = deleteCharacter;