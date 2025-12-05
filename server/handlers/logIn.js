const { MongoClient } = require("mongodb");
require("dotenv").config();
const { MONGO_URI } = process.env;
const bcrypt = require("bcrypt");

const DB = "dndJournal"
const USERS_COLLECTION = "users";

const logIn = async (req, res) => {
    const { username, password } = req.body;
    const client = new MongoClient(MONGO_URI);

    //Verify if username & password are provided
    if (!username || !password) {
        return res.status(400).json({
            status: 400,
            message: "Please provide an username and password."
        })
    }

    //Put username to lowercase
    const normalizedUsername = username.toLowerCase();

    try {
        await client.connect();
        const db = client.db(DB);

        //Verify user with username exists
        const existingUsername = await db.collection(USERS_COLLECTION).findOne({ username: normalizedUsername });
        if (!existingUsername) {
            return res.status(404).json({
                status: 404,
                message: "Incorrect credentials. Please try again."
            })
        }

        //Verify that password matches the hashed password
        const isMatch = await bcrypt.compare(password, existingUsername.password);

        if (!isMatch) {
            return res.status(401).json({
                status: 401,
                message: "Incorrect credentials. Please try again."
            })
        }

        //Successful login
        res.status(200).json({
            status: 200,
            message: "Successfully logged in.",
            data: normalizedUsername
        });

    } catch (error) {
        res.status(502).json({
            status: 502,
            message: error.message
        });

    } finally {
        await client.close();
    }
}

module.exports = logIn;