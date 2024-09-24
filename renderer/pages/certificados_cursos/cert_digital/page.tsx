"use client"
import React, { useRef, useState, useEffect } from "react"
import ReadExcelParticipants from "../../../components/cursosComponents/C_ReadExcelParticipants"
import CertificateGeneratorExcel from "../../../components/cursosComponents/C_CertificateGeneratorExcel"
import CertificateGenerator from "../../../components/cursosComponents/C_CertificateGenerator"
import Link from "next/link"
import { IoCloseCircle } from "react-icons/io5"
import { ImageDatabaseCursos } from "../../../databasesCursos/C_ImageUploaderDB"
import ImageMagnifier from "../../../components/cursosComponents/C_imgMagnifier"
import LogoComponent from "../../../components/cursosComponents/C_LogoComponent"
import { IoIosArrowBack } from "react-icons/io"
import { IoIosArrowForward } from "react-icons/io"

const imageDB = new ImageDatabaseCursos() // creando instancia de imágenes

export default function Home() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isLoading, setIsLoading] = useState(false) // Estado para la pantalla de carga
  const modalRef = useRef<HTMLDialogElement>(null)
  const excelModalRef = useRef<HTMLDialogElement>(null)
  const [generatedCertificates, setGeneratedCertificates] = useState<string[]>(
    []
  )

  useEffect(() => {
    console.log(modalRef.current) // Verifica la referencia del modal
  }, [])

  useEffect(() => {
    const obtenerCertificados = async () => {
      try {
        setIsLoading(true)
        const certificates = await imageDB.certificates
          .where("type")
          .equals("certificadoDigital")
          .toArray()
        setGeneratedCertificates(
          certificates.map((certificate) => certificate.certificateDataURL)
        )
      } catch (error) {
        console.error("Error al obtener los certificados:", error)
      } finally {
        setIsLoading(false)
      }
    }
    obtenerCertificados()
  }, [])

  const actualizarCertificados = async () => {
    try {
      setIsLoading(true)
      const certificates = await imageDB.certificates
        .where("type")
        .equals("certificadoDigital")
        .toArray()
      setGeneratedCertificates(
        certificates.map((certificate) => certificate.certificateDataURL)
      )
    } catch (error) {
      console.error("Error al obtener los certificados:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const updateButton = async () => {
    try {
      setIsLoading(true)
      setGeneratedCertificates([])
    } catch (error) {
      console.error("Error al limpiar las tablas:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const eliminarImagen = async () => {
    try {
      setIsLoading(true)
      const certificateDataURL = generatedCertificates[currentImageIndex]
      const imageToDelete = await imageDB.certificates
        .where("certificateDataURL")
        .equals(certificateDataURL)
        .first()
      if (imageToDelete) {
        await imageDB.certificates.delete(imageToDelete.id)
        await actualizarCertificados()
        goPrevious()
      } else {
        console.warn("La imagen no existe en la base de datos.")
      }
    } catch (error) {
      console.error("Error al eliminar la imagen:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const goPrevious = () => {
    setCurrentImageIndex(currentImageIndex === 0 ? 0 : currentImageIndex - 1)
  }

  const goNext = () => {
    const lastIndex = generatedCertificates.length - 1
    setCurrentImageIndex(
      currentImageIndex === lastIndex ? 0 : currentImageIndex + 1
    )
  }

  const openModal = () => {
    if (modalRef.current) {
      modalRef.current.showModal()
    }
  }

  const openExcelModal = () => {
    if (excelModalRef.current) {
      excelModalRef.current.showModal()
    }
  }

  const closeModal = () => {
    if (modalRef.current) {
      modalRef.current.close()
    }
  }

  const closeExcelModal = () => {
    if (excelModalRef.current) {
      excelModalRef.current.close()
    }
  }

  return (
    <div className="bg-[#1c222a] h-screen overflow-hidden">
      {/* Logo de la empresa en la esquina superior izquierda */}
      <div className="absolute top-0 left-0 m-4">
        <LogoComponent />
      </div>
      {/* Encabezado fijo */}
      <header className="mt-8 text-center">
        <h1 className="mb-4 text-3xl">CERTIFICADOS PARA CURSOS</h1>
        <ul className="steps w-full">
          {/* Envuelve cada <li> en un componente <Link> */}
          <li className="step step-info ">Certificado Digital</li>
          <li className="step">Certificado físico</li>
          <li className="step">Certificado Digital (Firma-Empresa)</li>
          <li className="step">Exportar y enviar</li>
        </ul>
      </header>
      {/* Sidebar */}
      <div className="bg-[#1c222a] flex h-full">
        {/* Contenedor Principal */}
        <div className="flex w-full">
          {/* Sidebar */}
          <div className="w-1/3 p-4 bg-gray-800 text-white mt-4 h-full rounded-r-xl">
            <ul>
              <li>
                <button className="w-full btn btn-outline" onClick={openModal}>
                  Agregar manualmente
                </button>
              </li>
              <li>
                <button
                  className="w-full btn bg-white text-black hover:bg-gray-200 mt-2"
                  onClick={openExcelModal}
                >
                  Insertar datos por Excel
                </button>
              </li>
              <li>
                <CertificateGeneratorExcel
                  onCertificateGenerated={actualizarCertificados}
                  onDeleteData={updateButton}
                />
              </li>
              <li>
                <div className="join grid grid-cols-2 mt-3 ">
                  <Link
                    href="/certificados_cursos/selectTypesCursos/page"
                    passHref
                    legacyBehavior
                  >
                    <button className="join-item btn-info btn btn-outline text-white">
                      Atrás
                    </button>
                  </Link>
                  <Link
                    href="/certificados_cursos/cert_phisyc/page"
                    passHref
                    legacyBehavior
                  >
                    <button className="join-item btn-info animate-pulse btn hover:scale-110 hover:animate-none border-transparent">
                      Siguiente
                    </button>
                  </Link>
                </div>
              </li>
            </ul>
          </div>
          <div className="px-4 pt-3 flex flex-col items-center">
            {/* Contador de imágenes */}
            <div className="text-white flex items-center justify-between mt-2">
              {/* Botón Anterior */}
              <button
                onClick={goPrevious}
                className="btn bg-gray-800 text-white hover:bg-gray-600 mr-2"
              >
                <IoIosArrowBack />
              </button>
              {/* Contador de imágenes */}
              <div className="text-white flex items-center justify-between w-full">
                <div className="join">
                  {generatedCertificates.map((_, index) => (
                    <button
                      key={index}
                      className={`join-item btn ${
                        index === currentImageIndex ? "btn-info text-white" : ""
                      }`}
                      onClick={() => setCurrentImageIndex(index)}
                    >
                      {index + 1}
                    </button>
                  ))}
                </div>
              </div>

              {/* Botón Siguiente */}
              <button
                onClick={goNext}
                className="btn bg-gray-800 text-white hover:bg-gray-600 ml-2"
              >
                <IoIosArrowForward />
              </button>
              {/* Botón Eliminar */}
              <button
                className="ml-20 btn btn-outline btn-error hover:bg-[#f36365] hover:border-transparent hover:!text-white"
                onClick={eliminarImagen}
              >
                Eliminar Certificado
              </button>
            </div>

            {/* Imagen */}
            <div className="mt-4 carousel-container max-w-[88%] flex flex-col items-center">
              {" "}
              {/* Ajustar max-w-lg según sea necesario */}
              {generatedCertificates.length > 0 ? (
                <ImageMagnifier
                  src={generatedCertificates[currentImageIndex]}
                  magnifierHeight={150}
                  magnifieWidth={300}
                  zoomLevel={1.5}
                  alt={`Generated Certificate ${currentImageIndex}`}
                />
              ) : (
                <img
                  className="image-container w-3/4"
                  src="/imagesCursos/cert-digital.png"
                  alt="No Image Here"
                />
              )}
            </div>
          </div>
        </div>
      </div>
      <div>
        <dialog id="my_modal_1" className="modal" ref={modalRef}>
          <div className="modal-box">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-lg mb-4">Ingresar Datos</h3>
              <button className="close-button" onClick={closeModal}>
                <IoCloseCircle className="text-red-500 h-8 w-8 mb-4" />
              </button>
            </div>
            <CertificateGenerator
              onCertificateGenerated={actualizarCertificados}
              onCloseModal={closeModal}
            />
          </div>
        </dialog>

        <dialog id="excel_modal" className="modal" ref={excelModalRef}>
          <div className="modal-box">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-lg mb-4">Insertar por Excel</h3>
              <button className="close-button" onClick={closeExcelModal}>
                <IoCloseCircle className="text-red-500 h-8 w-8 mb-4" />
              </button>
            </div>
            <ReadExcelParticipants />
          </div>
        </dialog>
      </div>
      {isLoading && (
        <div className="fixed inset-0 flex items-center justify-center bg-[#1c222a] bg-opacity-65">
          <span className="loading loading-spinner loading-lg"></span>
          <h3 className="ml-2">Cargando... 🙈</h3>
        </div>
      )}
    </div>
  )
}
