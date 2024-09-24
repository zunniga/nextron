"use client"
import React, { useRef, useState, useEffect } from "react"
import ReadExcelParticipants from "../../../../../components/graduates/Cimade/ReadExcelParticipants"
import CertificateGeneratorExcel from "../../../../../components/graduates/Cimade/GraduateGeneratorExcelC"
import CertificateGenerator from "../../../../../components/graduates/Cimade/GraduateGeneratorC"
import Link from "next/link"
import { IoCloseCircle } from "react-icons/io5"
import { RiFileExcel2Fill } from "react-icons/ri"
import { GrChapterNext } from "react-icons/gr"
import { GrChapterPrevious } from "react-icons/gr"
import { GrLinkNext } from "react-icons/gr"
import { GrLinkPrevious } from "react-icons/gr"
import { MdOutlineFileDownloadOff } from "react-icons/md"
import { NewDataCimade } from "../../../../../components/graduates/Cimade/ImageCimadeDB"
import { ImageMagnifier } from "../../../../../components/graduates/ImgZoom"
import { LuPenSquare } from "react-icons/lu"
import { BiLogOut } from "react-icons/bi"

const imageDB = new NewDataCimade() // Asegúrate de crear la instancia de la base de datos

export default function Home() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const modalRef = useRef<HTMLDialogElement>(null)
  const excelModalRef = useRef<HTMLDialogElement>(null)
  const [generatedCertificates, setGeneratedCertificates] = useState<string[]>(
    []
  )

  useEffect(() => {
    const obtenerCertificados = async () => {
      try {
        const certificates = await imageDB.newCertificates
          .where("type")
          .equals("certificadoDigital")
          .toArray()
        setGeneratedCertificates(
          certificates.map((certificate) => certificate.certificateDataURL)
        )
      } catch (error) {
        console.error("Error al obtener los certificados:", error)
      }
    }

    obtenerCertificados()
  }, [])
  // Función para abrir o cerrar la lista
  const [listaAbierta, setListaAbierta] = useState(false)

  // Función para abrir o cerrar la lista
  const toggleLista = () => {
    setListaAbierta(!listaAbierta)
  }

  const openModulares = () => {
    // Aquí puedes realizar las acciones necesarias al abrir el modal
    console.log("Abrir modal de Excel")
  }

  const actualizarCertificados = async () => {
    try {
      const certificates = await imageDB.newCertificates
        .where("type")
        .equals("certificadoDigital")
        .toArray()
      setGeneratedCertificates(
        certificates.map((newCertificate) => newCertificate.certificateDataURL)
      )
    } catch (error) {
      console.error("Error al obtener los certificados:", error)
    }
  }

  const updateButton = async () => {
    try {
      setGeneratedCertificates([])
    } catch (error) {
      console.error("Error al limpiar las tablas:", error)
    }
  }

  const eliminarImagen = async () => {
    try {
      const certificateDataURL = generatedCertificates[currentImageIndex]
      const imageToDelete = await imageDB.newCertificates
        .where("certificateDataURL")
        .equals(certificateDataURL)
        .first()
      console.log(imageToDelete)
      if (imageToDelete) {
        await imageDB.newCertificates.delete(imageToDelete.id)
        await actualizarCertificados()
        goPrevious() // Llamamos directamente a goPrevious después de eliminar la imagen
      } else {
        console.warn("La imagen no existe en la base de datos.")
      }
    } catch (error) {
      console.error("Error al eliminar la imagen:", error)
    }
  }

  const goPrevious = () => {
    const lastIndex = generatedCertificates.length - 1
    setCurrentImageIndex(
      currentImageIndex === 0 ? lastIndex : currentImageIndex - 1
    )
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
    <div className=" min-h-screen bg-[#002e79]  overflow-hidden">
      <Link href="/graduates_main/graduate_cimade/routess/page">
        <BiLogOut
          color="#ffff"
          className="w-12 h-12 absolute top-0 left-0 m-4 cursor-pointer text-gray-500"
          size={24}
        />
      </Link>
      {/* Encabezado fijo */}
      <header className="mt-8 text-center mb-10">
        <h1 className="mb-4 text-3xl font-extralight">EMISIÓN DE DIPLOMADOS</h1>
        <ul className="steps w-full">
          {/* Envuelve cada <li> en un componente <Link> */}
          <li className="step step-secondary font-extralight text-xl ">
            <div>Insercion de Participantes</div>
            <Link
              href="/graduates_main/graduate_cimade/graduate/route/page"
              passHref
              legacyBehavior
            >
              <button className=" bg-[#002e79] text-white btn btn-outline hover:bg-[#ff00d4]/70 hover:text-white mt-4">
                <GrLinkPrevious size={25} />
                Retroceder
              </button>
            </Link>
          </li>
          <li className="step font-extralight text-xl ">
            <Link href="/graduates_main/graduate_cimade/graduate/graduate_reverso/page">
              Anverso del Diplomado
            </Link>
          </li>
          <li className="step font-extralight text-xl">
            <Link href="/" passHref>
              Exportar en PDF
            </Link>
            <Link
              href="/graduates_main/graduate_cimade/graduate/graduate_reverso/page"
              passHref
              legacyBehavior
            >
              <button className=" bg-[#002e79] text-white btn btn-outline hover:bg-[#ff00d4]/70 hover:text-white mt-4">
                Avanzar
                <GrLinkNext size={25} />
              </button>
            </Link>
          </li>
        </ul>
      </header>
      {/* Sidebar */}
      <div className="bg-[#002e79]  flex h-full">
        {/* Contenedor Principal */}
        <div className=" flex w-full ">
          {/* Sidebar */}

          <div className="w-[400px]  text-white mt-24 ml-5  rounded-r-xl ">
            <ul className="p-4  border border-slate-200 rounded-xl">
              <li>
                <button
                  className="w-full  text-xl font-futura-bkbt btn bg-[#006eb0] text-[#ffff] hover:bg-[#ff00d4]/70 mb-5"
                  onClick={openModal}
                >
                  Agregar manualmente
                  <LuPenSquare className="" size={20} color="#" />
                </button>
              </li>
              <li>
                <button
                  className="w-full btn text-xl font-futura-bkbt bg-[#006eb0] text-[#ffff] hover:bg-[#ff00d4]/70 mb-5"
                  onClick={openExcelModal}
                >
                  Inserción por Excel
                  <RiFileExcel2Fill className="ml-6" size={25} color="#" />
                </button>
              </li>
              <li className="">
                <CertificateGeneratorExcel
                  onCertificateGenerated={actualizarCertificados}
                  onDeleteData={updateButton}
                />
              </li>

              <li className="join grid grid-cols-2 mt-3 ">
                <button
                  onClick={goPrevious}
                  className="btn bg-slate-100 text-[#001d51] hover:bg-gray-500 mr-2"
                >
                  <GrChapterPrevious className="" size={20} />
                  Anterior
                </button>
                <button
                  onClick={goNext}
                  className="btn bg-slate-100 text-[#001d51]  hover:bg-gray-500 ml-2"
                >
                  Siguiente
                  <GrChapterNext className="" size={20} />
                </button>
              </li>

              <li>
                <div className="join grid grid-cols-2 mt-3 "></div>
              </li>
            </ul>
          </div>

          {/* Contador de imágenes */}

          {/* Imagen */}
          <div className="carousel-container max-w-[60%] h-full flex flex-col justify-center items-center mb-14 ">
            <div className="mb-4 text-white flex items-center justify-between">
              {/* Botón Anterior */}

              {/* Contador de imágenes */}
              <div className="  text-white flex items-center justify-between ">
                <div className="join">
                  {generatedCertificates.map((_, index) => (
                    <button
                      key={index}
                      className={`join-item btn ${
                        index === currentImageIndex
                          ? "bg-[#ff00d4] text-white"
                          : ""
                      }`}
                      onClick={() => setCurrentImageIndex(index)}
                    >
                      {index + 1}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            {/* Ajustar max-w-lg según sea necesario */}
            {generatedCertificates.length > 0 ? (
              <>
                <ImageMagnifier
                  src={generatedCertificates[currentImageIndex]}
                  magnifierHeight={150}
                  magnifierWidth={300}
                  zoomLevel={1.5}
                  alt={`Generated Certificate ${currentImageIndex}`}
                />
                {/* <button
                  className="ml-20 btn bg-gradient-to-b from-[#c70606] to-[#660505] text-white hover:bg-red-400 mt-2 "
                  onClick={eliminarImagen}
                >
                  Eliminar Certificado
                </button> */}
              </>
            ) : (
              <div className="flex flex-col ml-96 mt-10 items-center text-center">
                <MdOutlineFileDownloadOff size={150} />
                <span className="font-extralight">
                  Aún no hay diplomados generados :({" "}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div>
        <dialog id="my_modal_1" className="modal" ref={modalRef}>
          <div className="modal-box bg-slate-300">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-lg text-[#001d51] mb-4">
                INGRESA LOS DATOS DEL PARTICIPANTE
              </h3>
              <button className="close-button" onClick={closeModal}>
                <IoCloseCircle className="text-red-500 h-8 w-8 mb-4" />
              </button>
            </div>

            <CertificateGenerator />
          </div>
        </dialog>

        <dialog id="excel_modal" className="modal" ref={excelModalRef}>
          <div className="modal-box bg-cyan-300/20">
            <div className="flex justify-between items-center">
              <h3 className="font-futura-bkbt font-bold text-[#e8e9eb] text-lg mb-4">
                INSERTAR POR EXCEL
              </h3>
              <button className="btn btn-ghost" onClick={closeExcelModal}>
                <IoCloseCircle className="text-red-500 h-8 w-8 mb-4" />
              </button>
            </div>
            <ReadExcelParticipants onCloseModal={closeExcelModal}/>
          </div>
        </dialog>
      </div>
    </div>
  )
}
