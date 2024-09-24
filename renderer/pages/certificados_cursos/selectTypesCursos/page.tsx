"use client"
import React, { useState, useEffect } from "react"
import Link from "next/link"
import { GrUserAdmin } from "react-icons/gr"
import LogoComponent from "../../../components/cursosComponents/C_LogoComponent"
import { ImageDatabaseCursos } from "@/databasesCursos/C_ImageUploaderDB"

export default function TiposCertificados() {
  const [selectedCertificatesCursos, setselectedCertificatesCursos] = useState<
    string[]
  >(["certificadoDigital", "certificadoFisico", "certificadoOnly"])
  const [isImageAvailable, setIsImageAvailable] = useState<boolean>(true)

  useEffect(() => {
    const storedCertificates = localStorage.getItem(
      "selectedCertificatesCursos"
    )
    if (storedCertificates) {
      setselectedCertificatesCursos(JSON.parse(storedCertificates))
    }

    const selectedCompany = localStorage.getItem("selectedCompanyCursos")
    if (selectedCompany) {
      const db = new ImageDatabaseCursos()
      const table = db.table(
        `images${
          selectedCompany.charAt(0).toUpperCase() + selectedCompany.slice(1)
        }`
      )
      table.count().then((count) => {
        setIsImageAvailable(count > 0)
      })
    }
  }, [])

  const handleCheckboxChange = (index: number, type: string) => {
    setselectedCertificatesCursos((prevCertificates) => {
      if (prevCertificates.includes(type)) {
        return prevCertificates.filter((cert) => cert !== type)
      } else {
        return [...prevCertificates, type]
      }
    })
  }

  useEffect(() => {
    localStorage.setItem(
      "selectedCertificatesCursos",
      JSON.stringify(selectedCertificatesCursos)
    )
  }, [selectedCertificatesCursos])

  const handleButtonClick = () => {
    console.log(selectedCertificatesCursos)
  }

  const isAnyCheckboxSelected = selectedCertificatesCursos.length > 0

  return (
    <main className="relative flex flex-col items-center justify-center h-screen">
      <div className="w-12 h-10 absolute top-0 right-0 mt-2 mr-2 cursor-pointer text-gray-200 hover:text-cyan-500">
        <span
          className={`badge badge-success badge-xs ml-4 ${
            !isImageAvailable ? "badge badge-error" : ""
          }`}
        ></span>
        <Link href="/certificados_cursos/subirImagesCursos/page">
          <GrUserAdmin
            className="w-12 h-10 absolute top-0 right-0 m-4 cursor-pointer text-gray-200 hover:text-cyan-500"
            size={24}
          />
        </Link>
      </div>
      <div className="absolute top-0 left-0 m-4">
        <LogoComponent />
      </div>
      <h1 className="text-4xl font-bold tracking-tight text-gray-300 sm:text-5xl md:text-6xl p-6 mb-8">
        <span className="block">
          Certificados para{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-tr to-cyan-500 from-blue-600">
            {" "}
            CURSOS
          </span>
        </span>
      </h1>
      <h2 className="text-xl mb-4">
        Por favor seleccione qué tipo de certificados se va a generar:{" "}
      </h2>
      <div className="flex flex-row">
        {[0, 1, 2].map((index) => (
          <div
            key={index}
            className="flex items-center bg-gray-200 text-gray-800 font-semibold mr-4 p-4 rounded-xl"
          >
            <div className="mr-2">
              {index === 0
                ? "Certificado Digital"
                : index === 1
                ? "Certificado Físico"
                : "Certificado Firma-Empresa"}
            </div>
            <div className="flex items-end">
              <input
                className="checkbox checkbox-info checkbox-lg  mr-1"
                type="checkbox"
                onChange={() =>
                  handleCheckboxChange(
                    index,
                    index === 0
                      ? "certificadoDigital"
                      : index === 1
                      ? "certificadoFisico"
                      : "certificadoOnly"
                  )
                }
                checked={selectedCertificatesCursos.includes(
                  index === 0
                    ? "certificadoDigital"
                    : index === 1
                    ? "certificadoFisico"
                    : "certificadoOnly"
                )}
              />
            </div>
          </div>
        ))}
      </div>
      <div className="flex gap-x-2">
        <Link
          href="/certificados_cursos/cert_digital/page"
          passHref
          legacyBehavior
        >
          <button
            className={`btn btn-info btn-lg mt-8 ${
              !isAnyCheckboxSelected
                ? "disabled:opacity-50 cursor-not-allowed"
                : ""
            }`}
            onClick={handleButtonClick}
            disabled={!isAnyCheckboxSelected}
          >
            Ir a generar Certificados
          </button>
        </Link>
        <Link href="/certificados_cursos/page" passHref legacyBehavior>
          <button className="btn btn-info btn-outline btn-lg mt-8 ">
            Volver atrás
          </button>
        </Link>
      </div>
    </main>
  )
}
