import { useState } from "react"
import useAuth from "../auth/auth"
import axios from "axios"

const Card = ({
  nombre,
  empresa,
  propietario,
  domicilio,
  correo,
  telefono,
  isPublic: isPublicProp,
  isVisible: isVisibleProp,
  id,
  onDelete,
  onEdit,
  onVisible,
  onPublic,
  disabled,

}) => {
  const [isEditing, setIsEditing] = useState(false)
  const [newNombre, setNewNombre] = useState(nombre)
  const [newEmpresa, setNewEmpresa] = useState(empresa)
  const [newPropietario, setNewPropietario] = useState(propietario)
  const [newDomicilio, setNewDomicilio] = useState(domicilio)
  const [newCorreo, setNewCorreo] = useState(correo)
  const [newTelefono, setNewTelefono] = useState(telefono)
  const [isVisible, setIsVisible] = useState(isVisibleProp)
  const [isPublic, setIsPublic] = useState(isPublicProp)
  const { isAdmin } = useAuth()


  // Eliminamos al usuario desde el icono de card

  const handleDelete = async () => {
    try {
        await axios.delete(
            `http://localhost:5500/users/delete-users/${id}`
        )
        onDelete(id)
    } catch (error) {
        console.log(error)
    }
  }

  const handleEdit = async () => {
        setIsEditing(true)
  }

  // Editamos el usuario
  
  const saveEdition = async () => {
    try {
        await axios.patch(`http://localhost:5500/users/edit-users/${id}`, {
            nombre: newNombre,
            empresa: newEmpresa,
            domicilio: newDomicilio,
            telefono: newTelefono,
            correo: newCorreo,
            propietario: newPropietario
        })
        
        onEdit(
            id,
            newNombre,
            newEmpresa,
            newDomicilio,
            newTelefono,
            newCorreo,
            newPropietario
        )
        setIsEditing(false)
    } catch (error) {
        console.log(error)
    }
  }

  const cancelEdition = async () => {
    setIsEditing(false)
    setNewNombre(nombre)
    setNewEmpresa(empresa)
    setNewPropietario(propietario)
    setNewTelefono(telefono)
    setNewCorreo(correo)
    setNewDomicilio(domicilio)
  }

  const handleVisibility = async () => {
    setIsVisible(!isVisible)
    onVisible(id, !isVisible)
  }

  const handlePrivacity  = async () => {
    setIsPublic(!isPublic)
    onPublic(id, !isPublic)
  }

  return (
    <div className="card d-flex p-4 flex-row mt-3 container">
      <div className="card-body p-0 row">
        {isEditing ? (
          <div className="row">
            <input
              className="m-0 col-md-4 col-sm-6 g-3"
              type="text"
              value={newNombre}
              onChange={(e) => setNewNombre(e.target.value)}
              placeholder="Nombre y Apellido"
            />
            <input
              className="m-0 col-md-4 col-sm-6 g-3"
              type="text"
              value={newEmpresa}
              onChange={(e) => setNewEmpresa(e.target.value)}
              placeholder="Empresa"
            />
            <input
              className="m-0 col-md-4 col-sm-6 g-3"
              type="text"
              value={newDomicilio}
              onChange={(e) => setNewDomicilio(e.target.value)}
              placeholder="Domicilio"
            />
            <input
              className="m-0 col-md-4 col-sm-6 g-3"
              type="text"
              value={newTelefono}
              onChange={(e) => setNewTelefono(e.target.value)}
              placeholder="Teléfono"
            />
            <input
              className="m-0 col-md-4 col-sm-6 g-3"
              type="text"
              value={newCorreo}
              onChange={(e) => setNewCorreo(e.target.value)}
              placeholder="Correo electrónico"
            />
            <input
              className="m-0 col-md-4 col-sm-6 g-3"
              type="text"
              value={newPropietario}
              onChange={(e) => setNewPropietario(e.target.value)}
              placeholder="Propietario"
            />
          </div>
        ) : (
          <div>
            <h5 className="card-title">{nombre.toUpperCase()}</h5>
            <p className="card-text m-0">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                className="bi bi-building me-3"
                viewBox="0 0 16 16"
              >
                <path d="M4 2.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5zm3 0a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5zm3.5-.5a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5zM4 5.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5zM7.5 5a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5zm2.5.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5zM4.5 8a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5zm2.5.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5zm3.5-.5a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5z" />
                <path d="M2 1a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1zm11 0H3v14h3v-2.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 .5.5V15h3z" />
              </svg>
              {empresa.toUpperCase()}
            </p>
            <p className="card-text m-0">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                className="bi bi-geo-alt me-3"
                viewBox="0 0 16 16"
              >
                <path d="M12.166 8.94c-.524 1.062-1.234 2.12-1.96 3.07A32 32 0 0 1 8 14.58a32 32 0 0 1-2.206-2.57c-.726-.95-1.436-2.008-1.96-3.07C3.304 7.867 3 6.332 3 5.5c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .832-.304 2.367-.834 3.44zM8 7a3 3 0 1 0-3-3 3 3 0 0 0 3 3z" />
              </svg>
              {domicilio}
            </p>
            <p className="card-text m-0">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                className="bi bi-phone me-3"
                viewBox="0 0 16 16"
              >
                <path d="M11.742 10.344a1 1 0 0 1 .199 1.098l-1 3a1 1 0 0 1-.832.618l-2.24-.56a1 1 0 0 0-.843.332l-1.193 1.667a12.068 12.068 0 0 1-5.83-5.83l1.666-1.194a1 1 0 0 0 .332-.843l-.56-2.24a1 1 0 0 1 .618-.832l3-1a1 1 0 0 1 1.098.199l2.653 3.413a1 1 0 0 1 .198 1.097l-1 3a1 1 0 0 1-.832.618l-1.43-.358z" />
              </svg>
              {telefono}
            </p>
            <p className="card-text m-0">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                className="bi bi-envelope me-3"
                viewBox="0 0 16 16"
              >
                <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V4zm2 0v1.236l6 4.5 6-4.5V4H2zm12 0v1.236l-6 4.5-6-4.5V4h12z" />
              </svg>
              {correo}
            </p>
            <p className="card-text m-0">{propietario}</p>
          </div>
        )}
        <div className="actions col d-flex flex-column justify-content-between p-0">
          {isAdmin && !isEditing && (
            <>
              <button onClick={handleEdit} className="btn btn-outline-primary mt-2">
                Editar
              </button>
              <button
                onClick={handleDelete}
                className="btn btn-outline-danger mt-2"
              >
                Eliminar
              </button>
            </>
          )}
          <button onClick={handleVisibility} className="btn btn-outline-info mt-2">
            {isVisible ? "Ocultar" : "Mostrar"}
          </button>
          <button onClick={handlePrivacity} className="btn btn-outline-secondary mt-2">
            {isPublic ? "Privado" : "Público"}
          </button>
        </div>
      </div>
    </div>
  )
}

export default Card
