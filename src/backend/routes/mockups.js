const express = require('express');
const router = new express.Router();

/*


*/

const mockups = {
    "mockups":[
        {
            "id": 1,
            "name":"Movimiento Circular",
            "description": "Something...",
            "url": "/mcu",
            "state": "active",

            "topics": [
                "Período y Frecuencia",
                "...",
                "..."
            ],
            "materials":[
                "Cronómetro y calculadora",
                "...",
                "..."
            ],

            "descriptions":[
                "Determinar experimentalmente la relación que existe entre el número de rotaciones y el tiempo transcurrido en relación con los parámetros de período y frecuencia de un movimiento circular.",
                "Something 2...",
                "Something 3..."
            ],
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