"use client"
import Link from "next/link"
import React, { useState } from "react"
import LogoComponent from "../../../components/cursosComponents/C_LogoComponent"
import { useRouter } from "next/router"

const LoginCursos: React.FC = () => {
  const router = useRouter()
  const [username, setUsername] = useState<string>("")
  const [password, setPassword] = useState<string>("")
  const [error, setError] = useState<string>("")

  const handleloginCursos = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    // Aquí deberías tener una lógica de autenticación más robusta, como una llamada a una API o validación en el servidor
    const mockUsername = "admin" // Cambia 'usuario' por el nombre de usuario deseado
    const mockPassword = "Ecomas@12345" // Cambia 'contraseña' por la contraseña deseada

    if (username === mockUsername && password === mockPassword) {
      // Credenciales válidas, iniciar sesión
      sessionStorage.setItem("isLoggedInCursos", "true")
      router.push("/certificados_cursos/subirImagesCursos/page")
    } else {
      // Credenciales inválidas, mostrar un mensaje de error
      setError("Usuario o contraseña incorrectos")
    }
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      {/* Logo de la empresa en la esquina superior izquierda */}
      <div className="absolute top-0 left-0 m-4">
        <LogoComponent />
      </div>
      <div className="bg-gradient-to-tr to-cyan-500 from-blue-600 p-8 rounded-xl">
        <h1 className="text-2xl font-bold mb-4 text-">
          Inicia sesión para subir imágenes
        </h1>

        <form onSubmit={handleloginCursos}>
          <label className="input flex items-center gap-2 mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              fill="currentColor"
              className="w-4 h-4 opacity-70"
            >
              <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" />
            </svg>
            <input
              type="text"
              className="grow"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </label>
          <label className="input flex items-center gap-2 mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              fill="currentColor"
              className="w-4 h-4 opacity-70"
            >
              <path
                fillRule="evenodd"
                d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
                clipRule="evenodd"
              />
            </svg>
            <input
              type="password"
              className="grow"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>

          <button
            className="btn w-full btn-info text-white mb-4 hover:bg-cyan-500"
            type="submit"
          >
            Iniciar sesión
          </button>
          <Link href="/certificados_cursos/selectTypesCursos/page">
            <button className="btn w-full btn-outline btn-accent hover:bg-cyan-500 hover:!text-white hover:border-transparent">
              Volver atrás
            </button>
          </Link>
        </form>
        {error && <p className="text-red-500 font-bold text-cemter">{error}</p>}
      </div>
    </div>
  )
}

export default LoginCursos
