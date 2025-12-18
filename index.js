const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const express = require("express");

const app = express();
app.use(express.json());

mongoose.connect("mongodb+srv://pablolito:moro@cluster0.lldz94w.mongodb.net/aprendiendo-node?appName=Cluster0",{
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

app.post("/login", async (req, res) => {
    const { usuario, password } = req.body;

    try {
        // 1. Buscar usuario en MongoDB
        const user = await Usuario.findOne({ usuario });

        if (!user) {
            return res.status(401).json({ mensaje: "Usuario o contraseña incorrectos" });
        }

        // 2. Comparar contraseña con bcrypt
        const resultado = await bcrypt.compare(password, user.password);

        if (resultado) {
            return res.status(200).json({ mensaje: "Login exitoso" });
        } else {
            return res.status(401).json({ mensaje: "Usuario o contraseña incorrectos" });
        }

    } catch (error) {
        return res.status(500).json({ mensaje: "Error de servidor" });
    }
});

