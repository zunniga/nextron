"use client"
import React, { useState, useEffect } from "react"
import Link from "next/link"
import jsPDF from "jspdf"
import { ImageDatabaseCursos } from "../../../databasesCursos/C_ImageUploaderDB"
import JSZip from "jszip"
import { saveAs } from "file-saver"
import LogoComponent from "../../../components/cursosComponents/C_LogoComponent"
import CertificatesTable from "../../../components/cursosComponents/C_ExportTableCursos" // Importa el componente CertificatesTable
import ModalExit from "../../../components/cursosComponents/C_ExitModal"
import { useRouter } from "next/router"
import { participantDB } from "../../../components/cursosComponents/C_ReadExcelParticipants"
import { IoInformationCircleOutline } from "react-icons/io5"
import { FaRegFileExcel } from "react-icons/fa"
import { IoTrashBinOutline } from "react-icons/io5"
import fs from "fs"
import path from "path"

const imageDB = new ImageDatabaseCursos()

interface Certificate {
  id: number
  ownerName: string
  type: string
  certificateDataURL: string
  selected: boolean
  correoOwner: string
}

type CertificatesList = Certificate[]

export default function ExportCert() {
  const [certificates, setCertificates] = useState<CertificatesList>([])
  const [modalIsOpen, setModalIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false) // Estado para controlar el loading
  const router = useRouter()
  const [selectedFilePathCursos, setSelectedFilePathCursos] = useState("")

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedValue = sessionStorage.getItem("selectedFilePathCursos")
      if (storedValue) {
        setSelectedFilePathCursos(storedValue)
      }
    }
  }, [])

  const handleDeleteStorage = () => {
    sessionStorage.removeItem("selectedFilePathCursos")
    setSelectedFilePathCursos("")
  }
  const openModal = () => setModalIsOpen(true)
  const closeModal = () => setModalIsOpen(false)

  const handleExit = async () => {
    setIsLoading(true) // Activar el loading
    await limpiarLocalStorageYDBs()
    closeModal()
    router.push("/home")
    setIsLoading(false) // Desactivar el loading
  }

  const limpiarLocalStorageYDBs = async () => {
    sessionStorage.removeItem("selectedFilePathCursos")

    try {
      setIsLoading(true) // Activar el loading
      await imageDB.certificates.clear()
      await participantDB.participants.clear()
      console.log("Tablas limpiadas correctamente")
    } catch (error) {
      console.error("Error al limpiar las tablas:", error)
    } finally {
      setIsLoading(false) // Desactivar el loading, independientemente de si hay error o no
    }
  }

  useEffect(() => {
    const obtenerCertificados = async () => {
      try {
        const allCertificates: CertificatesList =
          await imageDB.certificates.toArray()
        allCertificates.forEach((cert) => (cert.selected = true)) // Habilitar por defecto
        setCertificates(allCertificates)
      } catch (error) {
        console.error("Error al obtener los certificados:", error)
      }
    }

    obtenerCertificados()
  }, [])

  // Función para mapear los tipos de certificado a etiquetas deseadas
  const mapCertificateTypeToLabel = (type: string): string => {
    switch (type) {
      case "certificadoDigital":
        return "Digital"
      case "certificadoFisico":
        return "Físico"
      case "certificadoOnly":
        return "Firma-Empresa"
      default:
        return ""
    }
  }

  const exportarPDFs = async () => {
    let directoryPath // Declarar directoryPath fuera del bloque condicional

    const rutaArchivoExcel = sessionStorage.getItem("selectedFilePathCursos")

    if (rutaArchivoExcel !== null) {
      directoryPath = rutaArchivoExcel
        .replace(/\\/g, "/")
        .replace(/\/[^/]*$/, "")
      console.log(directoryPath)
    } else {
      console.log(
        "La ruta del archivo Excel no está definida en el almacenamiento local."
      )
      exportarPDFsNoExcel()
      return // Salir de la función si no se encuentra la ruta del archivo Excel
    }

    // Crear la carpeta "Certificados_Cursos" si no existe
    const certificadosDir = path.join(directoryPath, "Certificados_CURSOS")
    if (!fs.existsSync(certificadosDir)) {
      fs.mkdirSync(certificadosDir)
    }

    const selectedCertificatesCursos = certificates.filter(
      (certificate) => certificate.selected
    )

    const pdfPromises = selectedCertificatesCursos.map(async (certificate) => {
      const pdf = new jsPDF("landscape")
      const width = pdf.internal.pageSize.getWidth()
      const height = pdf.internal.pageSize.getHeight()
      pdf.addImage(
        certificate.certificateDataURL,
        "JPEG",
        0,
        0,
        width,
        height,
        "",
        "SLOW"
      )

      const certificateTypeLabel = mapCertificateTypeToLabel(certificate.type)
      const fileName = `${certificate.ownerName}_${certificateTypeLabel}.pdf`

      const pdfBlob = pdf.output("blob")
      const arrayBuffer = await pdfBlob.arrayBuffer()
      const buffer = Buffer.from(arrayBuffer)

      const filePath = path.join(certificadosDir, fileName)

      try {
        fs.writeFileSync(filePath, buffer)
        console.log(`Archivo guardado exitosamente en: ${filePath}`)
      } catch (error) {
        console.error("Error guardando el PDF:", error)
      }
    })

    // Espera a que todas las promesas de PDF se completen
    await Promise.all(pdfPromises)

    alert(
      'Todos los PDFs han sido guardados exitosamente en la carpeta "Certificados_Cursos" dentro de la carpeta de donde se subió el archivo excel.'
    )
  }

  const exportarPDFsNoExcel = async () => {
    const selectedCertificatesCursos = certificates.filter(
      (certificate) => certificate.selected
    )

    const zip = new JSZip()

    selectedCertificatesCursos.forEach(async (certificate, index) => {
      const pdf = new jsPDF("landscape")
      const width = pdf.internal.pageSize.getWidth()
      const height = pdf.internal.pageSize.getHeight()
      pdf.addImage(
        certificate.certificateDataURL,
        "JPEG",
        0,
        0,
        width,
        height,
        "",
        "SLOW"
      )

      // Mapea el tipo de certificado al nombre deseado
      const certificateTypeLabel = mapCertificateTypeToLabel(certificate.type)

      // Usa el nombre deseado en lugar del tipo original en el nombre del archivo
      const fileName = `${certificate.ownerName}_${certificateTypeLabel}.pdf`

      // Add PDF to zip file
      const pdfData = pdf.output("blob")
      zip.file(fileName, pdfData, { binary: true })
    })

    // Generate and save zip file
    zip
      .generateAsync({ type: "blob" })
      .then(function (content) {
        saveAs(content, "Certificados_Cursos.zip")
      })
      .catch(function (error) {
        console.error("Error al generar zip file:", error)
      })
  }

  const handleCertificateSelect = (id: number) => {
    const updatedCertificates = certificates.map((cert) => {
      if (cert.id === id) {
        return { ...cert, selected: !cert.selected }
      }
      return cert
    })
    setCertificates(updatedCertificates)
  }

  return (
    <div className="bg-[#1c222a] h-screen overflow-hidden">
      <div className="absolute top-0 left-0 m-4">
        <LogoComponent />
      </div>
      <header className="mt-8 text-center">
        <h1 className="mb-4 text-3xl">CERTIFICADOS PARA CURSOS</h1>
        <ul className="steps w-full">
          <li className="step step-info">Certificado Digital</li>
          <li className="step step-info">Certificado físico</li>
          <li className="step step-info">
            Certificado Digital (Firma-Empresa)
          </li>
          <li className="step step-info">Exportar y enviar</li>
        </ul>
      </header>
      <div className="bg-[#1c222a] flex h-full w-full">
        <div className="flex w-full">
          <div className="mr-2 w-1/4 p-4 bg-gray-800 text-white mt-4 h-full rounded-r-xl">
            <ul>
              <li>
                <button
                  className="z-10 tooltip tooltip-right w-full btn btn-success mt-2"
                  data-tip="✅ Se exportarán todos los PDF's con check, puedes desmarcar aquellos que no desesas guardar."
                  onClick={exportarPDFs}
                >
                  Exportar en PDF
                </button>
              </li>
              <li>
                <div className="join grid grid-cols-2 mt-3">
                  <Link
                    href="/certificados_cursos/cert_soloemp/page"
                    passHref
                    legacyBehavior
                  >
                    <button className="join-item btn-info btn btn-outline text-white">
                      Atrás
                    </button>
                  </Link>
                  <button
                    onClick={openModal}
                    className="join-item btn-error btn-outline text-white btn hover:bg-[#f36365] hover:border-transparent hover:!text-white"
                  >
                    Salir
                  </button>
                </div>
              </li>
              {selectedFilePathCursos ? (
                <li className="mt-4 flex items-center">
                  <div className="flex flex-row items-center">
                    <FaRegFileExcel className="text-green-500 mr-2 h-4 w-4" />
                    <p className="text-green-500 text-xs">
                      Ruta archivo Excel:{" "}
                      {selectedFilePathCursos.replace(/[^\\]*$/, "")}
                    </p>
                    <button
                      className="ml-2 tooltip"
                      data-tip="Elimina la ruta para elegir dónde guardar los certificados."
                      onClick={handleDeleteStorage}
                    >
                      <IoTrashBinOutline className="text-red-500 h-5 w-5" />
                    </button>
                  </div>
                </li>
              ) : (
                <li className="mt-4 flex items-center">
                  <p className="text-red-500 text-xs">
                    No hay ruta de archivo Excel seleccionada. (Si no hay ruta, los PDFs se exportarán en un ZIP)
                  </p>
                  <div
                    className="ml-2 tooltip"
                    data-tip="Sube un archivo excel para insertar una ruta."
                  >
                    <IoInformationCircleOutline className="text-red-500 h-5 w-5" />
                  </div>
                </li>
              )}

              <li className="mt-4 flex items-center">
                <div
                  className="flex flex-row tooltip tooltip-right items-center"
                  data-tip="💾 Al exportar los PDFs, se guardarán en la carpeta desde donde se subió el archivo Excel. Se creará una carpeta llamada Certificados_Cursos. Si ya existe una carpeta con ese nombre, esta se reemplazará. Finalmente, si se generaron los certificados manualmente, estos se exportarán en un ZIP."
                >
                  <IoInformationCircleOutline className="text-yellow-500 mr-2 h-5 w-5" />
                  <p className=" text-yellow-500 text-xs">Léeme</p>
                </div>
              </li>
            </ul>
          </div>
          <div className="overflow-x-auto mt-4 rounded-lg w-full h-[83%]">
            {/* Utiliza el componente CertificatesTable */}
            <CertificatesTable
              mapCertificateTypeToLabel={mapCertificateTypeToLabel}
              certificates={certificates}
              onCertificateSelect={handleCertificateSelect}
            />
          </div>
        </div>
      </div>
      <ModalExit
        isOpen={modalIsOpen}
        onClose={closeModal}
        onConfirm={handleExit}
      />
      {isLoading && (
        <div className="z-50 fixed top-0 left-0 w-full h-full bg-[#1c222a] opacity-75 flex justify-center items-center">
          <span className="loading loading-spinner loading-lg"></span>
          <h3 className="ml-2">Eliminando certificados... 🗑️</h3>
        </div>
      )}
    </div>
  )
}
