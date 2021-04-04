const express = require('express');
const router = new express.Router();


const mockups = {
    "mockups":[
        {
            "id": 1,
            "name":"Movimiento Circular Uniforme",
            "description": "Something...",
            "url": "/mcu",
            "state": "active"
        },
        {
            "id": 2,
            "name": "Caída Libre",
            "description":"Something...",
            "url": "/freefall",
            "state": "active"
        }
    ]
};


/**
 * @endpoint : /addNewMockup
 * @method : POST
**/
router.post('/addNewMockup', async (req, res) => {
    console.log("Petición para añadir nueva maqueta");
    res.send('POST request to the homepage');
});


router.get('/mockups', (req, res) => {
    res.status(200).send(mockups);
});

module.exports = router;