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
            name,
            story,
            quotes,
            lastEdit: formatDate()
        }
    }

    try {
        await client.connect();
        const db = client.db(DB);
        //Verify character _id exists
        const foundCharacter = await db.collection(CHARACTERS_COLLECTION).findOne({ _id });
        if (!foundCharacter) {
            return res.status(404).json({
                status: 404,
                message: "Character could not be found."
            })
        }

        //Update character info
        const result = await db.collection(CHARACTERS_COLLECTION).updateOne(query, edittedValues);
        if (result.modifiedCount === 0) {
            return res.status(400).json({
                status: 400,
                message: "Character could not be updated."
            })
        }
        // Confirm update success
        res.status(202).json({
            status: 202,
            message: "Character successfully updated."
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

module.exports = editCharacter;