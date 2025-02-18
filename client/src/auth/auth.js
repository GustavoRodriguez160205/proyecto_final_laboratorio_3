import axios from 'axios'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'


// Definimos los estados del hook

const useAuth = () => {
    const [isauth, setIsauth] = useState(false) 
    const [nombre, setNombre] = useState("") 
    const [empresa, setEmpresa] = useState("") 
    const [domicilio, setDomicilio] = useState("") 
    const [telefono, setTelefono] = useState("") 
    const [password, setPassword] = useState("") 
    const [correo, setCorreo] = useState("") 
    const [userId, setUserid] = useState("") 
    const [isAdmin, setIsadmin] = useState(false) 
    const navigate = useNavigate() 
     
    // Verificamos si la persona inicio sesión
    useEffect(() => {
        const authStatus = async () => { 
            try {
                // Nos permite enviar cookies para saber si el usuario está autenticado
                const resp = await axios.get('http://localhost:5500/auth/verify', { withCredentials: true }) 

                if (resp.status === 200) {  // Si está todo ok guarda los datos del usuario
                    setIsauth(true)
                    setNombre(resp.data.nombre)
                    setEmpresa(resp.data.empresa)
                    setDomicilio(resp.data.domicilio)
                    setTelefono(resp.data.telefono)
                    setPassword(resp.data.password)
                    setCorreo(resp.data.correo)
                    setUserid(resp.data.id)
                    setIsadmin(resp.data.admin)
                    console.log(resp.data)

                } else { // Borramos los datos si la condición falla
                    setIsauth(false)
                    setNombre("")
                    setEmpresa("")
                    setDomicilio("")
                    setTelefono("")
                    setPassword("")
                    setCorreo("")
                    setUserid("")
                    setIsadmin("")
                }
            } catch (error) { // Borra los datos si hay un error
                console.error(error) 
                setIsauth(false)
                setNombre("")
                setEmpresa("")
                setDomicilio("")
                setTelefono("")
                setPassword("")
                setCorreo("")
                setUserid("")
                setIsadmin("")
            }
        }

        authStatus() // Ejecutamos la función

    }, [navigate]) 

///////////////////
///////////////////

    // Cierra sesión de la app haciendo uso de la petición
    const logout = async () => {
          try {
             const resp = await axios.get('http://localhost:5500/auth/logout', {withCredentials: true} )
             
             if (resp.status === 200) { // Si se cumple la condición se borran los datos
                setIsauth(false)
                setNombre("")
                setEmpresa("")
                setDomicilio("")
                setTelefono("")
                setPassword("")
                setCorreo("")
                setUserid("")
                setIsadmin(false)
                return true // Si se cerro con exito la sesión
                
            } else {

                return false
            }
             // Si hubo error también elimina los datos
          } catch (error) {
            console.log(error);
            setIsauth(false)
            setNombre("")
            setEmpresa("")
            setDomicilio("")
            setTelefono("")
            setPassword("")
            setCorreo("")
            setUserid("")
            setIsadmin(false)
            return false
          }
    }

    return {
        isauth,
        nombre, 
        empresa, 
        domicilio, 
        correo, 
        password,
        telefono,
        setCorreo,
        setNombre,
        setCorreo,
        setDomicilio,
        setPassword,
        setEmpresa,
        setTelefono,
        userId,
        isAdmin,
        logout
    }

}

export default useAuth
