const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const express = require("express");
const jwt = require("jsonwebtoken");

const JWT_SECRET = "mi_clave_super_secreta"; // luego poner en .env
const app = express();
app.use(express.json());

mongoose.connect("mongodb+srv://pablolito:moro@cluster0.lldz94w.mongodb.net/aprendiendo-node?appName=Cluster0",{
})
.then(() =>  console.log("Conectado a MongoDB Atlas")) 
.catch(err => console.error("error de conexión",err) );



const usuarioSchema = mongoose.Schema({
    usuario: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["staff", "profesor"], required: true }
});


const Usuario = mongoose.model("Usuario", usuarioSchema);



// Generar hash al iniciar el servidor
bcrypt.hash("Friday", 10, async (err, hash) => {
    if (err) throw err;

    const usuario = new Usuario({
        usuario: "Staff1",
        password: hash,
        role: "staff"
    });

    await usuario.save().catch(err => console.log("usuario ya existe"));
    console.log("usuario de prueba guardado en MongoDB");
});

bcrypt.hash("Profesor123", 10, async (err, hash) => {
    if (err) throw err;

    const usuario = new Usuario({
        usuario: "Profesor1",
        password: hash,
        role: "profesor"
    });

    await usuario.save().catch(err => console.log("usuario ya existe"));
    console.log("usuario profesor guardado en MongoDB");
});


const verificarToken = (rolesPermitidos = []) => {
    return (req, res, next) => {
        const authHeader = req.headers["authorization"];
        const token = authHeader && authHeader.split(" ")[1];

        if (!token) {
            return res.status(401).json({ mensaje: "No se proporcionó token" });
        }

        try {
            const usuario = jwt.verify(token, JWT_SECRET);
            req.usuario = usuario; // guardamos los datos del usuario en req

            if (rolesPermitidos.length && !rolesPermitidos.includes(usuario.role)) {
                return res.status(403).json({ mensaje: "No tienes permiso para esta acción" });
            }

            next(); // continuar con la ruta
        } catch (error) {
            return res.status(403).json({ mensaje: "Token inválido o expirado" });
        }
    }
};


app.get("/", (req,res) => {
    res.send('servidor funcionando');
})

app.get("/staff/alumnos", verificarToken(["staff"]), (req, res) => {
    res.json({ mensaje: `Hola ${req.usuario.usuario}, puedes ver todos los alumnos` });
});

app.get("/profesor/alumnos", verificarToken(["profesor"]), (req, res) => {
    res.json({ mensaje: `Hola ${req.usuario.usuario}, puedes ver solo tus alumnos` });
});



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
            // Crear token JWT
            const token = jwt.sign(
                { id: user._id, usuario: user.usuario, role: user.role },
                JWT_SECRET,
                { expiresIn: "4h" } // duración del token
            );

            return res.status(200).json({
                mensaje: "Login exitoso",
                token,
                role: user.role
            });
        } else {
            return res.status(401).json({ mensaje: "Usuario o contraseña incorrectos" });
        }


    } catch (error) {
        return res.status(500).json({ mensaje: "Error de servidor" });
    }
});

