var router = require('express').Router();
var expressWs = require('express-ws');
expressWs(router);
router.ws("/", (ws, req)=>{
    ws.on('message', (msg)=>{
        if(msg=="ping"){
            ws.send("pong");
        }else{
            console.log(msg);
        }
        
    });
})
module.exports = router;