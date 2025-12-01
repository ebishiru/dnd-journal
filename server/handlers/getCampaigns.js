const { MongoClient } = require("mongodb");
require("dotenv").config();
const { MONGO_URI } = process.env;

const DB = "dndJournal";
const CAMPAIGNS_COLLECTION = "campaigns";

const getCampaigns = async (req, res) => {
    const client = new MongoClient(MONGO_URI);
    
    try {
        await client.connect();
        const db = client.db(DB);
        const campaigns = await db.collection(CAMPAIGNS_COLLECTION).find().toArray();
        res.status(200).json({
            status: 200,
            data: campaigns
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

module.exports = getCampaigns;