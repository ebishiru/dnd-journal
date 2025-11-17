const express = require("express");
require("dotenv").config();
const { PORT } = process.env

const app = express();

//catch-all middleware
app.use((req, res) => {
    res.status(404).json({
        status: 404,
        message: "This is probably not the endpoint you're looking for."
    });
});

app.listen(PORT, () => console.info(`Listening on port ${PORT}`));