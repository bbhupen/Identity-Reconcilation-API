const express = require('express');
const { identifyUser } = require('../services/contactServices');
const router = express.Router()


router.post("/api/v1/identify", async (req,res) => {
    const requestBody = req.body;
    const response = await identifyUser(requestBody);
    res.send(response);

})

module.exports = router;