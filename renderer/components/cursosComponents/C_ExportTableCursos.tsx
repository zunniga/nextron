import React, { useState, useEffect } from "react"
import { participantDB } from "./C_ReadExcelParticipants"
import jsPDF from "jspdf"
import { DataForSendCursos } from "../../databasesCursos/C_emailSendDB" // Importa la clase DataForSendCursos
import SendMail from "./C_SendEmail"

interface Certificate {
  id: number
  ownerName: string
  type: string
  certificateDataURL: string
  selected: boolean
  correoOwner: string // Asegúrate de que este campo está en tu interfaz
}

type CertificatesList = Certificate[]

interface CertificatesTableProps {
  certificates: CertificatesList
  onCertificateSelect: (id: number) => void
  mapCertificateTypeToLabel: (type: string) => string
}

const CertificatesTable: React.FC<CertificatesTableProps> = ({
  certificates,
  onCertificateSelect,
  mapCertificateTypeToLabel,
}) => {
  // Define state unconditionally
  const [ownerDetails, setOwnerDetails] = useState<{
    [key: string]: { email: string }
  }>({})

  useEffect(() => {
    console.log("Certificados:", certificates) // Agrega este console log para imprimir los certificados
    async function fetchOwnerDetails() {
      const details = await Promise.all(
        certificates.map(async (certificate) => {
          const participant = await participantDB.participants
            .where("nombreParticipante")
            .equals(certificate.ownerName)
            .first()
          return participant
            ? {
                name: certificate.ownerName,
                email: participant.correoParticipante,
              }
            : { name: certificate.ownerName, email: "" }
        })
      )
      const ownerDetailsMap: { [key: string]: { email: string } } = {}
      details.forEach((detail) => {
        ownerDetailsMap[detail.name] = { email: detail.email }
      })
      setOwnerDetails(ownerDetailsMap)
    }
    fetchOwnerDetails()
  }, [certificates])

  if (!certificates) {
    return <div>Loading...</div>
  }

  // Count certificates of each type
  const certificateCounts: { [key: string]: number } = certificates.reduce(
    (counts, certificate) => {
      counts[certificate.type] = (counts[certificate.type] || 0) + 1
      return counts
    },
    {}
  )

  // Total count of all certificates
  const totalCount = certificates.length

  // Para mostrar el numero de certificados
  const displayCertificateCountMessage = () => {
    const digitalCount = certificateCounts.certificadoDigital || 0
    const fisicosCount = certificateCounts.certificadoFisico || 0
    const firmaEmpresaCount = certificateCounts.certificadoOnly || 0
    return (
      <>
        <p className="text-sm text-gray-400">
          Certificados Digitales: {digitalCount}
        </p>
        <p className="text-sm text-gray-400">
          Certificados Físicos: {fisicosCount}
        </p>
        <p className="text-sm text-gray-400">
          Certificados Firma Empresa: {firmaEmpresaCount}
        </p>
        <p className="text-sm text-gray-400">
          Certificados Totales:{" "}
          <strong className="text-cyan-500">{totalCount}</strong>
        </p>
      </>
    )
  }

  const handleCheckboxChange = (id: number) => {
    onCertificateSelect(id)
  }

  const guardarDatos = async () => {
    const db = new DataForSendCursos() // Instancia de DataForSendCursos
    try {
      // Borra todos los datos de la tabla antes de agregar nuevos datos
      await db.partForSend.clear()

      // Filtra los certificados que tienen los tipos 'Firma-Empresa' o 'Digital'
      const filteredCertificates = certificates.filter(
        (certificate) =>
          certificate.type === "certificadoOnly" ||
          certificate.type === "certificadoDigital"
      )

      const partForSendDataArray = []
      for (const certificate of filteredCertificates) {
        const { ownerName, correoOwner } = certificate
        const participant = await participantDB.participants
          .where("nombreParticipante")
          .equals(ownerName)
          .first()
        let email, cursoName, materialsLinks

        if (participant) {
          //PARA PONER TODOS LOS CORREOS DE CADA PARTICIPANTE
          email = participant.correoParticipante
          cursoName = participant.CursoName
          materialsLinks = participant.enlacesMateriales
        } else {
          email = correoOwner //
          cursoName = "" // establece un valor por defecto para el curso
          materialsLinks = "" // establece un valor por defecto para el curso
        }
        const pdfBlob = await generatePdfBlob(certificate) // Genera el blob del PDF
        partForSendDataArray.push({
          name: ownerName,
          email,
          pdf: pdfBlob,
          curso: cursoName,
          material: materialsLinks,
        }) // Almacena el blob del PDF
      }
      // Agrega los datos filtrados a la base de datos
      await db.partForSend.bulkAdd(partForSendDataArray)

      console.log("Datos de los participantes almacenados correctamente.")
    } catch (error) {
      console.error("Error al almacenar datos de los participantes:", error)
    }
  }

  // Función para generar el blob del PDF
  const generatePdfBlob = (certificate: Certificate): Promise<Blob> => {
    return new Promise((resolve, reject) => {
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
      const blob = pdf.output("blob")
      resolve(blob)
    })
  }

  return (
    <div className="flex flex-row">
      <div className="flex flex-col bg-[#1e2936] w-full rounded-lg  mr-2 mb-4 ">
        <table className="table table-sm table-pin-rows rounded-lg table-pin-cols">
          <thead>
            <tr>
              <th className="rounded-tl-lg "></th>
              <th>Nombre del Participante</th>
              <th className="rounded-tr-lg">Tipo de certificado</th>
            </tr>
          </thead>
          <tbody>
            {certificates &&
              certificates.map((certificate, index) => (
                <tr key={index}>
                  <td>
                    <label>
                      <input
                        type="checkbox"
                        className="checkbox"
                        checked={certificate.selected}
                        onChange={() => handleCheckboxChange(certificate.id)}
                      />
                    </label>
                  </td>
                  <td>{certificate.ownerName}</td>
                  <td>{mapCertificateTypeToLabel(certificate.type)}</td>
                </tr>
              ))}
          </tbody>
        </table>
        <div>
          <div className="bg-[#1e2936] w-full  ">
            <p className="mt-2 ">{displayCertificateCountMessage()}</p>{" "}
            {/* Display certificate count message */}
          </div>
        </div>
      </div>

      <div className="mr-2">
        <SendMail onSaveData={guardarDatos} />
      </div>
    </div>
  )
}

export default CertificatesTable
