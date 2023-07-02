const express = require('express');
const { identifyUser } = require('../services/contactServices');
const router = express.Router()


router.get("/api/v1/test", async (req,res) => {
    // const requestBody = req.body;
    // const response = await identifyUser(requestBody);
    res.send("Hello");

})

router.post("/api/v1/identify", async (req,res) => {
    const requestBody = req.body;
    const response = await identifyUser(requestBody);
    res.send(response);

})

module.exports = router;