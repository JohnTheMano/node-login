const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const express = require("express");

const app = express();
app.use(express.json());

mongoose.connect("mongodb://atlas-sql-694417567e396c09274545a4-5obtd.a.query.mongodb.net/sample_mflix?ssl=true&authSource=admin",{
})
.then(() =>  console.log("Conectado a MongoDB Atlas")) 
.catch(err => console.error("error de conexión",err) );


const usuarioPrueba = {
    usuario: "Jason",
    password: "" // se llena con hash
};

// Generar hash al iniciar el servidor
bcrypt.hash("Friday" , 10, (err,hash) => {
    if (err) throw err;
    usuarioPrueba.password = hash;
    console.log("Hash generado para usuario de prueba", hash)
});



app.get("/", (req,res) => {
    res.send('servidor funcionando');
})

app.listen(3000, () =>{
    console.log("Servidor corriendo en 3000");
});

app.post("/login", (req , res) => {
    const {usuario , password} = req.body;
    
    if (usuario !== usuarioPrueba.usuario) {
        return res.status(401).json({mensage:"Usuario o contraseña incorrectos"});
        } 
        
    bcrypt.compare(password, usuarioPrueba.password, (err, resultado) => {
        if (err) return res.status(500).json({mensaje:"Error de servidor"});

        if (resultado) {
            return res.status(200).json({mensaje: "Login exitoso"});
        } else {
            return res.status(401).json({mensaje: "Usuario o contraseña incorrectos"});
        }
        });
} );
