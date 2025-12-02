const { MongoClient } = require("mongodb");
require("dotenv").config();
const { MONGO_URI } = process.env;

const DB = "dndJournal";
const CAMPAIGNS_COLLECTION = "campaigns";

const getCampaign = async (req, res) => {
    const client = new MongoClient(MONGO_URI);
    const { _id } = req.params;

    try {
        await client.connect();
        const db = client.db(DB);
        const campaign = await db.collection(CAMPAIGNS_COLLECTION).findOne({ _id });

        //if campaign is not found
        if (!campaign) {
            return res.status(404).json({
                status: 404,
                message: "Campaign not found."
            })
        }

        //If campaign is found
        res.status(200).json({
            status: 200,
            data: campaign
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

module.exports = getCampaign;