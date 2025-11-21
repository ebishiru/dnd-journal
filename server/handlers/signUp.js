const { MongoClient } = require("mongodb");
require("dotenv").config();
const { MONGO_URI } = process.env;
const { v4: uuidv4 } = require("uuid");

const DB = "dndJournal"
const USERS_COLLECTION = "users";

const signUp = async (req, res) => {
    const { username, password } = req.body;
    const client = new MongoClient(MONGO_URI);

    //Verify if username & password are provided
    if (!username || !password) {
        return res.status(400).json({
            status: 400,
            message: "Please provide an username and password."
        })
    }

    //convert username to lowercase
    const normalizedUsername = username.toLowerCase();

    try {
        await client.connect();
        const db = client.db(DB);

        //Verify if username is unique
        const existingUsername = await db.collection(USERS_COLLECTION).findOne({ username: normalizedUsername });
        if (existingUsername) {
            return res.status(409).json({
                status: 409,
                message: "Username is taken. Please try another."
            });
        }
        
        //Create new user
        const newUser = {
            _id: uuidv4(),
            username: normalizedUsername,
            password,
        };
        const result = await db.collection(USERS_COLLECTION).insertOne(newUser);

        //Verify if user has been properly created
        if (!result.acknowledged) {
            return res.status(500).json({
                status: 500,
                message: "Server issue - Could not create account."
            });
        }
        
        //If user is successfully created
        res.status(201).json({
            status: 201,
            message: "User successfully created.",
            data: normalizedUsername,
        })

    } catch (error) {
        res.status(502).json({
            status: 502,
            message: error.message
        });
    
    } finally {
        await client.close();
    } 

}

module.exports = signUp;