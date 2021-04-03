
export default function ApiRouter(app) {
    /**
     * @endpoint : /api/mockups
     * @method : GET 
    **/
    app.get('/api/mockups', (req, res)=>{
        console.log('Mockups info solicitada!');
        res.end();
    });
    
    /**
     * @endpoint : /api/mockup/:name
     * @method : GET 
    **/
     app.get('/api/mockup/:name', (req, res)=>{
        console.log('Mockup info solicitada');
        res.end();
    });


}