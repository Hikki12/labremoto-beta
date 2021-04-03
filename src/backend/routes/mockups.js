const express = require('express');
const router = new express.Router();


/**
 * @endpoint : /addNewMockup
 * @method : POST
**/
router.post('/addNewMockup', async (req, res) => {
    console.log("Petición para añadir nueva maqueta");
    res.send('POST request to the homepage');
});

module.exports = router;