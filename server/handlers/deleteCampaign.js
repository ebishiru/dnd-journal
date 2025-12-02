const { MongoClient } = require("mongodb");
require("dotenv").config();
const { MONGO_URI } = process.env;

const DB = "dndJournal";
const CAMPAIGNS_COLLECTION = "campaigns";

const deleteCampaign = async (req, res) => {
    const client = new MongoClient(MONGO_URI);
    const { _id } = req.body;
    const query = { _id };
    try {
        await client.connect();
        const db = client.db(DB);
        const deletion = await db.collection(CAMPAIGNS_COLLECTION).deleteOne( query );
        //check if delete was successfully
        if (deletion.deletedCount === 0) {
            return res.status(400).json({
                status: 400,
                message: "Campaign could not be deleted."
            })
        }
        //Confirm delete was successful
        res.status(200).json({
            status: 200,
            message: "Campaign successfully deleted."
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

module.exports = deleteCampaign;