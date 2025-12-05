const { MongoClient } = require("mongodb");
require("dotenv").config();
const { MONGO_URI } = process.env;

const DB = "dndJournal";
const CAMPAIGNS_COLLECTION = "campaigns";

//Get date in DD/MM/YYYY format
const formatDate = (date = new Date()) => {
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return `${day < 10 ? "0" + day : day}/${month < 10 ? "0" + month : month}/${year}`;
};

const editCampaign = async (req, res) => {
    const { _id, title, story } = req.body;
    const client = new MongoClient(MONGO_URI);

    //Verify that campaign id is provided
    if (!_id) {
        return res.status(400).json({
            status: 400,
            message: "Campaign ID is missing. Please try again."
        })
    }
    const query = { _id };
    const edittedValues = {
        $set: {
            title,
            story,
            lastEdit: formatDate()
        }
    }
    try {
        await client.connect();
        const db = client.db(DB);

        //Check if campaign_id exists
        const foundCampaign = await db.collection(CAMPAIGNS_COLLECTION).findOne({ _id });
        if (!foundCampaign) {
            return res.status(404).json({
                status: 404,
                message: "Campaign could not be found."
            })
        }

        //Update campaign info
        const result = await db.collection(CAMPAIGNS_COLLECTION).updateOne(query, edittedValues);
        if (result.modifiedCount === 0) {
            return res.status(400).json({
                status: 400,
                message: "Campaign could not be updated."
            })
        }
        //Confirm update success
        res.status(202).json({
            status: 202,
            message: "Campaign successfully updated."
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

module.exports = editCampaign;