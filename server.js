const express = require('express');
require('dotenv').config();

const PORT = process.env.PORT || 3000;

const contactRoute = require("./src/controllers/contactController");

const app = express();

app.use(express.json())

app.use("/", contactRoute);


app.listen(PORT, () => {
    console.log(`App listening on PORT ${PORT}`);
})