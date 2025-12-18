const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const express = require("express");

const app = express();
app.use(express.json());

mongoose.connect("mongodb://atlas-sql-694417567e396c09274545a4-5obtd.a.query.mongodb.net/sample_mflix?ssl=true&authSource=admin",{
})
.then(() =>  console.log("Conectado a MongoDB Atlas")) 
.catch(err => console.error("error de conexión",err) );



const usuarioSchema = mongoose.Schema({
    usuario: {type : String, required:true, unique:true},
    password: {type: String, required: true}
})

const Usuario = mongoose.model("Usuario", usuarioSchema);



// Generar hash al iniciar el servidor
bcrypt.hash("Friday" , 10, async(err,hash) => {
    if (err) throw err;

    const usuario = new Usuario({
        usuario: "Jason",
        password: hash // se llena con hash
    });

    await usuario.save().catch(err => console.log("usuario ya existe"));
    console.log("usuario de prueba guardado en  MongoDB")
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
