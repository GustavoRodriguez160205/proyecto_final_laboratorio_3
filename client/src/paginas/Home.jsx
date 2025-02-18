import { useEffect, useState } from "react"
import Card from "../Components/Card"
import axios from "axios"


// Definimos el estado

const Home = () => {
  const [contacts, setContacts] = useState([])

  useEffect(() => {
    const userData = async () => {
      try {
        // Hacemos la petición para obtener llos contactos del backend
        const resp = await axios.get("http://localhost:5500/users/get-contacts", { withCredentials: true })
        setContacts(resp.data.respuesta) // Guardamos los datos en el estado
      
      } catch (error) {

        if (error.response && error.response.status === 404) { // Sino encuentra el contacto
          console.log("Recurso no Encontrado")
        } else {
          console.log("Error al traer contactos")
        }
      }
    }
    
    userData() // Lllamamos a la función
  }, [])

  return (
    <section className="container py-5 px-0">
      <h2>TODOS LOS CONTACTOS</h2>
      <hr />
      <div>
        {  
          contacts.length === 0 ? (
            <p>No hay contactos para mostrar</p>
          ) : (
            // Recorremos el array de contactos y mostramos por pantalla
            contacts.map(contact => (
              <Card
                key={contact._id} 
                nombre={contact.nombre} 
                empresa={contact.empresa} 
                propietario={contact.propietario} 
                correo={contact.correo} 
                telefono={contact.telefono} 
                domicilio={contact.domicilio} 
                id={contact.id}
                disabled="d-none"
              />
            ))
          )
        }
      </div>
    </section>
  )
}

export default Home
