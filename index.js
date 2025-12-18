const express = require("express");
const app = express();

app.use(express.json());

app.get("/", (req,res) => {
    res.send('servidor funcionando');
})

app.listen(3000, () =>{
    console.log("Servidor corriendo en 3000");
});

app.post("/login", (req , res) => {
    console.log(req.body); 
    console.log(req.body.usuario); 
    res.send("datos recibidos");
} );
