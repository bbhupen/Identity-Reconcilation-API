const express = require('express');
const { identifyUser } = require('../services/contactServices');
const router = express.Router()

router.get("/", async (req, res) => {
    res.send(`Please visit <a href="https://github.com/bbhupen/bitespeed-task#:~:text=visiting%20this%20URL.-,API%20Documentation,-Available%20routes">here</a> for documentation regarding the API usage`);
})

router.get("/api/v1/identify", async (req, res) => {
    res.send(`Please visit <a href="https://github.com/bbhupen/bitespeed-task#:~:text=visiting%20this%20URL.-,API%20Documentation,-Available%20routes">here</a> for documentation regarding the API usage
    <br>`);
})


router.post("/api/v1/identify", async (req,res) => {
    const requestBody = req.body;
    const response = await identifyUser(requestBody);

    if (!response || Object.keys(response).length === 0) {
        return res.status(404).json({ error: 'Unexpected error occurred'});
      }

    res.status(200).json(response);

})

module.exports = router;