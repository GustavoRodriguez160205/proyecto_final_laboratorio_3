const express = require('express')         
require('../server/Conex/conect')           
const user = require('./models/model')    
const app = express()
const coockie = require('cookie-parser')
const morgan = require('morgan')           
const jwt = require('jsonwebtoken')
const cors = require('cors')

const userRoutes = express.Router()
const authRoutes = express.Router()

app.use(express.json())
app.use(coockie())
app.use(morgan('dev'))

// Definimos donde se crearan las peticiones del front al back
app.use(cors({
    origin : ['http://localhost:5173'] , credentials : true
}))

// Definimos las rutas
app.use('/users', userRoutes)
app.use('/auth' , authRoutes)

userRoutes.get('/get-users', async (req, res) => {
    const resp = await user.find({})
    return res.status(200).json({resp, message: 'Usuarios obtenidos correctamente'})
})


// Ruta para crear el usuario 

userRoutes.post('/create-users', async (req , res) => {
    try {
        const usuariosData = req.body
        const {correo}  = req.body
        const usuario = await user.findOne({correo}) // Busca el correo en la bd y si lo encuentra nose puede crear el usuario
        if(usuario){
            return res.status(401).json('Correo existente')
        }
        usuariosData.is_public = false
        const nuevoUser = new user(usuariosData)
        const resp = await nuevoUser.save()
        return res.status(201).json({resp, message: 'Registrado exitosamente'} )
    } catch (error) {
        console.log(error)
    }
})

// Ruta para editar el usuario en base a su id

userRoutes.patch('/edit-users/:id' , async (req , res) => {
    try {
        const {id} = req.params
        const usuariosData = req.body
        const resp = await user.findByIdAndUpdate(id , usuariosData , {new : true}) // Lo mismo que en la linea 69
        if(!resp){
            return res.status(404).json({resp , message: 'Recursos no encontrados'})
        }
        return res.status(200).json({resp, message: 'Usuario modificado'} )
    } catch (error) {
        console.log(error)
    }
})

ege
// Ruta para eliminar el usuario en base a su id
userRoutes.delete('/delete-users/:id' , async (req, res) => {
    try {
        const {id} = req.params
        const resp = await user.findByIdAndDelete(id) // Metodo que busca en base al id, lo encuentra y lo elimina
        if(!resp){
            return res.status(404).json({resp , message : 'Usuario no encontrado'})
        }
        return res.status(200).json({resp , message : 'Eliminamos datos'})
    } catch (error) {
        console.log(error);
    }
})

// Ruta de manejo de sesión del usuario
authRoutes.post('/login-users', async (req, res) => {
  try {
   const { correo, password } = req.body;
   const usuario = await user.findOne({ correo });
   if (!usuario) {
       return res.status(401).json({ usuario, message: 'Email o contraseña incorrectos' });
   }
   if (password !== usuario.password) {
       return res.status(401).json({ usuario, message: 'Contraseña Incorrecta' });
   }

   // Generamos un token que contiene la información del usuario
   const token = jwt.sign(
     {
       id: String(usuario._id),
       correo: String(usuario.correo),
       password: String(usuario.password),
       nombre: String(usuario.nombre || ''),
       telefono: String(usuario.telefono || ''),
       empresa: String(usuario.empresa || ''),
       domicilio: String(usuario.domicilio || ''),
       admin: Boolean(usuario.admin)
     },
     'hola123',
     { expiresIn: '1h' }
   );

   // Definimos la duración del token 
   res.cookie('llave', token, { httpOnly: true, maxAge: 36000000, sameSite: "lax", secure: false });
   return res.status(200).json({ message: 'Has iniciado sesión correctamente', token });

  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Error en el servidor' });
  }
});

const  verificarUsuario = (req , res , next) => {
      const token = req.cookies.llave
      if(!token){
         return res.status(404).json({message: 'No se encontro el token'} , token)
      }
      
      try {
        const decode = jwt.verify(token , 'hola123')
        req.usuario = decode 
        next()
      } catch (error) {
        return res.status(403).json({message: 'Token Invalido'} , token)
      }
}

// Verificamos el token
authRoutes.get('/verify' , verificarUsuario , async (req , res) => {
      const {id , nombre , empresa , telefono , correo , password , domicilio , admin} = req.usuario
      return res.status(200).json({message: 'Se obtuvieron los datos' ,id , nombre , empresa , telefono , correo , password , domicilio , admin})
})

// Cierra sesión y el usuario elimina el token
authRoutes.get('/logout' , verificarUsuario ,  async (req , res) => {
       res.clearCookie('llave') 
       return res.status(200).json({message: 'Se elimino el token correctamente'}) 
})

// Empezamos con el CRUD 

userRoutes.post('/create-contact' , verificarUsuario, async (req , res) => {
       try {
          const contactosData = req.body 
          const {correo} = req.body
          const contacto = await user.findOne({correo})
          console.log(contactosData);
          
          if(contacto){
            return res.status(401).json({message: 'Email existente'})
          }

          if(req.usuario && req.usuario.nombre){
            contactosData.propietario = req.usuario.nombre
          }else{
            contactosData.propietario = 'admin'
          }

            const newContact = new user(contactosData)
            const respuesta = await newContact.save() // Guarda el contacto
            return res.status(201).json({message: 'Contacto creado con exito' , respuesta})

       } catch (error) {
          return res.status(500).json(error.message)
       }
})


userRoutes.get('/get-contacts' , async(req , res) => {
     try {
        const respuesta = await user.find({password: '' , is_visible: true})
        console.log(respuesta);
        
        if (respuesta.length === 0) {
            return res.status(404).json({message: 'No hay contactos para mostrar'})
        }

        return res.status(200).json({message: 'Contactos obtenidos con exito', respuesta})
     } catch (error) {
        return res.status(500).json(error.message)
     }
})

userRoutes.get('/get-contacts-by-role', verificarUsuario, async (req, res) => {
    try {
      const isAdmin = req.usuario.admin;
      console.log(isAdmin)
      let contactos;
      if (isAdmin) {
        contactos = await user.find({ password: '' });
      } else {
        const nombresUserLog = req.usuario.nombre;
        contactos = await user.find({ propietario: nombresUserLog });
      }
  
      if (contactos.length === 0) {
        return res.status(404).json({ message: 'No hay contactos creados', contactos });
      }
  
      return res.status(200).json(contactos);
    } catch (error) {
      return res.status(500).json(error.message);
    }
  });


// Puerto que se ejecutara la app
  app.listen(5500, () => {
    console.log('App corriendo en server', app)
})
