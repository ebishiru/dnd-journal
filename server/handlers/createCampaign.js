const { MongoClient } = require("mongodb");
require("dotenv").config();
const { MONGO_URI } = process.env;
const { v4: uuidv4 } = require("uuid");

const DB = "dndJournal";
const CAMPAIGNS_COLLECTION = "campaigns";

const createCampaign = async (req, res) => {
    const { author, title, story } = req.body;
    const client = new MongoClient(MONGO_URI);
    const date = new Date();

    //format date to be DD/MM/YYYY
    const formatDate = (date) => {
        const day = date.getDate();
        const month = date.getMonth() + 1;
        const year = date.getFullYear();

        return `${day < 10? "0" + day : day}/${month < 10? "0" + month : month}/${year}`;
    }
    const formattedDate = formatDate(date);

    if (!title) {
        return res.status(400).json({
            status: 400,
            message: "Missing Campaign Title"
        })
    }

    try {
        await client.connect();
        const db = client.db(DB);

        //Create a new campaign document
        const newCampaign = {
            _id: uuidv4(),
            author,
            createdAt: formattedDate,
            lastEdit: formattedDate,
            title,
            story: story || "",
        }
        const result = await db.collection(CAMPAIGNS_COLLECTION).insertOne(newCampaign);

        //Verify if there's any server issues
        if (!result.acknowledged) {
            return res.status(500).json({
                status: 500,
                message: "Server issue - Campaign not created."
            })
        }

        //If Campaign is successfully created
        res.status(201).json({
            status: 201,
            message: "Campaign successfully created.",
            data: newCampaign
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

module.exports = createCampaign;