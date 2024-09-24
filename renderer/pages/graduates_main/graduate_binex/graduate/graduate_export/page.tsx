"use client"
import React, { useState, useEffect } from "react"
import Link from "next/link"
import jsPDF from "jspdf"
import Confetti from "react-confetti"
import { NewDataBinex } from "../../../../../components/graduates/Binex/ImageBinexDB"
import { GrLinkNext, GrLinkPrevious } from "react-icons/gr"
import { RiFileExcel2Fill } from "react-icons/ri"
import { FaHand } from "react-icons/fa6"
import { LuCheckCircle } from "react-icons/lu"
import { BsCheckCircleFill, BsXCircleFill } from "react-icons/bs"
import fs from "fs"

const imageDB = new NewDataBinex()

interface Certificate {
  id: number
  ownerName: string
  type: string
  certificateDataURL: string
  certificateUploaded: boolean
}

type CertificatesList = Certificate[]

const CertificatesTable: React.FC<{
  certificates: CertificatesList
  title: string
}> = ({ certificates, title }) => {
  return (
    <div>
      <h2 className="text-lg mb-2">{title}</h2>
      <table className="rounded-xl table table-xs table-auto table-pin-rows mb-4">
        <thead>
          <tr>
            <th>Nombre del Participante</th>
            <th>Verificado</th>
          </tr>
        </thead>
        <tbody>
          {certificates.map((certificate, index) => (
            <tr key={index}>
              <td>{certificate.ownerName}</td>
              <td>
                {certificate.certificateUploaded ? (
                  <BsCheckCircleFill className="text-green-500" size={30} />
                ) : (
                  <span>
                    {certificate.ownerName}{" "}
                    <BsXCircleFill className="text-red-700" size={30} />
                  </span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default function Home() {
  const [mostrarConfetti, setMostrarConfetti] = useState(false)
  const [digitalCertificates, setDigitalCertificates] =
    useState<CertificatesList>([])
  const [physicalCertificates, setPhysicalCertificates] =
    useState<CertificatesList>([])
  const [excelFolderPath, setExcelFolderPath] = useState<string | null>(null)

  useEffect(() => {
    // Cargar certificados al montar el componente
    obtenerCertificados()
    if (mostrarConfetti) {
      setTimeout(() => {
        setMostrarConfetti(false)
      }, 6000) // Ocultar confetti después de 3 segundos
    }
  }, [mostrarConfetti])

  const obtenerCertificados = async () => {
    try {
      const certificates: CertificatesList =
        await imageDB.newCertificates.toArray()

      const digitalCerts = certificates
        .filter((cert) => cert.type === "certificadoDigital")
        .map((cert) => ({ ...cert, certificateUploaded: true }))

      const physicalCerts = certificates
        .filter((cert) => cert.type === "certificadoFisico")
        .map((cert) => ({ ...cert, certificateUploaded: true }))

      setDigitalCertificates(digitalCerts)
      setPhysicalCertificates(physicalCerts)

      // Obtener la ruta de la carpeta del archivo Excel desde sessionStorage
      const storedExcelFilePath = sessionStorage.getItem("excelFilePath")
      if (storedExcelFilePath) {
        const folderPath = storedExcelFilePath.substring(
          0,
          storedExcelFilePath.lastIndexOf("\\") + 1
        )
        setExcelFolderPath(folderPath)
        console.log(
          "Ruta del archivo Excel obtenida de sessionStorage:",
          folderPath
        )
      }
    } catch (error) {
      console.error("Error al obtener los certificados:", error)
    }
  }

  const exportarPDF = () => {
    const certificates = digitalCertificates.concat(physicalCertificates)

    if (certificates.length === 0 || !excelFolderPath) {
      alert(
        "Por favor, primero selecciona un archivo de Excel o no hay certificados para exportar."
      )
      return
    }

    // Crear la carpeta "Diplomados" si no existe
    const folderPath = `${excelFolderPath}/DIPLOMADOS`
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true })
    }

    // Agrupar certificados por participante
    const certificadosPorParticipante: { [key: string]: Certificate[] } = {}
    certificates.forEach((certificate) => {
      if (!certificadosPorParticipante[certificate.ownerName]) {
        certificadosPorParticipante[certificate.ownerName] = []
      }
      certificadosPorParticipante[certificate.ownerName].push(certificate)
    })

    // Generar y guardar PDF por participante
    Object.entries(certificadosPorParticipante).forEach(
      ([ownerName, certs]) => {
        const pdf = new jsPDF("landscape")
        certs.forEach((cert, index) => {
          const width = pdf.internal.pageSize.getWidth()
          const height = pdf.internal.pageSize.getHeight()
          pdf.addImage(
            cert.certificateDataURL,
            "JPEG",
            0,
            0,
            width,
            height,
            "",
            "SLOW"
          )
          if (index !== certs.length - 1) {
            pdf.addPage()
          }
        })

        const primerParticipante = ownerName
        const fileName = primerParticipante
          ? `${primerParticipante}.pdf`
          : "Diplomado.pdf"

        const filePath = `${folderPath}/${fileName}`

        // Guardar el PDF sin abrir una ventana de diálogo de guardado
        try {
          const buffer = pdf.output() // Obtener el contenido del PDF como un ArrayBuffer
          fs.writeFileSync(filePath, buffer, { encoding: "binary" }) // Escribir el contenido en el sistema de archivos
          console.log(`PDF guardado correctamente en ${filePath}`)
        } catch (error) {
          console.error("Error al guardar el PDF:", error)
        }
      }
    )

    alert("Todos los PDFs se han guardado correctamente.")
  }

  const exportarPDFManual = () => {
    const pdf = new jsPDF("landscape")
    const certificates = digitalCertificates.concat(physicalCertificates)

    if (certificates.length === 0) {
      alert("No realizaste ninguna inserción manual")
      return
    }

    certificates.forEach((certificate, index) => {
      if (index > 0) {
        pdf.addPage() // Agrega una nueva página para cada certificado, excepto el primero
      }

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
    })

    // Obtener el nombre del primer participante (si hay alguno)
    const primerParticipante = certificates[0].ownerName
    const fileName = primerParticipante
      ? `${primerParticipante}.pdf`
      : "Diplomado.pdf"

    // Guardar el PDF una vez que se hayan agregado todas las imágenes
    pdf.save(fileName)
  }

  return (
    <div className="bg-[#0079bb] h-screen overflow-hidden">
      <header className="mt-8 text-center">
        <h1 className="mb-4 text-3xl font-extralight">EMISIÓN DE DIPLOMADOS</h1>
        <ul className="steps w-full">
          {/* Envuelve cada <li> en un componente <Link> */}
          <li className="step step-accent font-extralight text-xl ">
            <div>Insercion de Participantes</div>
            <Link
              href="/graduates_main/graduate_binex/graduate/graduate_reverso/page"
              passHref
              legacyBehavior
            >
              <div>
                <button className=" bg-[#0079bb] text-white btn btn-outline hover:bg-[#039f85] hover:text-white mt-4">
                  <GrLinkPrevious size={25} />
                  Retroceder
                </button>
              </div>
            </Link>
          </li>
          <li className="step step-accent font-extralight text-xl ">
            <Link href="/graduates_main/graduate_binex/graduate/graduate_reverso/page">
              <div>Anverso del Diplomado</div>
            </Link>
          </li>
          <li className="step step-accent font-extralight text-xl">
            <Link href="/" passHref>
              <div>Exportar en PDF</div>
            </Link>
            <Link
              href="/graduates_main/graduate_binex/graduate/graduate_export/page"
              passHref
              legacyBehavior
            >
              <div>
                <button className=" bg-[#0079bb] text-white btn btn-outline hover:bg-[#039f85] hover:text-white mt-4">
                  Avanzar
                  <GrLinkNext size={25} />
                </button>
              </div>
            </Link>
          </li>
        </ul>
      </header>
      <div className="bg-[#0079bb] flex h-full">
        {/* Contenedor Principal */}
        <div className=" flex w-full ">
          {/* Sidebar */}
          <div className="w-[400px]  text-white mt-24 ml-5  rounded-r-xl ">
            <ul className="p-4 border border-slate-200 rounded-xl">
            <li>
                <button
                  className="w-full  text-xl font-futura-bkbt btn bg-gradient-to-b from-[#039b03] to-[#06440f] text-[#fff] hover:bg-white mb-5"
                  onClick={() => {
                    exportarPDF()
                    setMostrarConfetti(true)
                  }}
                >
                  Exportar en PDF (Excel)
                  <RiFileExcel2Fill className="" size={25} color="#" />
                  {mostrarConfetti && (
                    <Confetti numberOfPieces={400} recycle={false} />
                  )}
                </button>
                <button
                  className="w-full text-xl font-futura-bkbt btn bg-gradient-to-b from-[#006fee] to-[#001d51] text-[#ffff] hover:bg-white mb-5"
                  onClick={exportarPDFManual}
                >
                  Exportar en PDF (Manual)
                  <FaHand size={25} />
                </button>
              </li>
            </ul>
          </div>

          <div className="overflow-x-auto mt-24 max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <p className="text-lg font-futura-bkbt flex items-center justify-center">
                Verifica que todos los participantes estén insertados.
                <LuCheckCircle className="ml-2" size={35} />
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="bg-[#0079bb] border rounded-lg p-10 text-white">
                <h2 className="text-2xl font-futura-bkbt mb-6">
                  Diplomados (ANVERSO)
                </h2>
                <CertificatesTable
                  certificates={digitalCertificates}
                  title=""
                />
              </div>
              <div className="bg-[#0079bb] border rounded-lg p-10 text-white">
                <h2 className="text-2xl font-futura-bkbt mb-6">
                  Diplomados (REVERSO)
                </h2>
                <CertificatesTable
                  certificates={physicalCertificates}
                  title=""
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
