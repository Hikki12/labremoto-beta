const express = require('express');
const router = new express.Router();

router.post('/make-reservation', async (req, res) => {
    console.log('making a reservation');
    res.end();
});

router.get('/reservations', async (req, res) => {
    console.log("Hola")
    res.end();
});

module.exports = router;