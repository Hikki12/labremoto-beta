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
                "Velocidad angular",
                "..."
            ],
            "materials":[
                "Cronómetro y calculadora",
                "Cronómetro y calculadora",
                "..."
            ],

            "descriptions":[
                "Determinar experimentalmente la relación que existe entre el número de rotaciones y el tiempo transcurrido en relación con los parámetros de período y frecuencia de un movimiento circular.",
                "Determinar experimentalmente la relación que existe entre el desplazamiento angular y el tiempo transcurrido en relación con el parámetro de velocidad angular en un movimiento circular.",
                "Something 3..."
            ],

            "instructions":[
                
                [
                    "Haciendo uso de un cronómetro, mida el tiempo que le toma a la partícula realizar las rotaciones que se especifican en la primera columna de la tabla.",
                    "Complete la segunda columna (“Tiempo”) con estas mediciones.",
                    "Utilice los datos de la primera y segunda columna para determinar el periodo y la frecuencia en la tercera y cuarta columna, respectivamente.",
                    "Para finalizar la práctica haga clic en el botón ¨Cuestionario¨ y responda las preguntas que se plantean ahí."
                ],
                [
                    "Haciendo uso de un cronómetro, mide el tiempo que le toma a la partícula girar el ángulo que se especifica en la primera columna de la tabla.",
                    "Complete la segunda columna (“Tiempo”) con estas mediciones. Nota: Si el disco deja de rotar mientras hace las mediciones, presione el botón iniciar, el disco se pondrá en movimiento nuevamente.",
                    "Utilice los datos de la primera y segunda columna para determinar la velocidad angular en la tercera columna.",
                    "Para finalizar la práctica haga clic en el botón ¨Cuestionario¨ y responda las preguntas que se plantean ahí."

                ],
                [],
            ]
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