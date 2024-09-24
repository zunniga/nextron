import React, { useState, useEffect } from "react"
import { DataForSendCursos, Participant } from "../../databasesCursos/C_emailSendDB"
import { MdDelete } from "react-icons/md"
import { IoInformationCircleOutline } from "react-icons/io5"
import nodemailer from "nodemailer" // Importa Nodemailer
import EcomasEmailTemplate from "../../emailsCursos/ecomas_email_template"
import PromasEmailTemplate from "../../emailsCursos/promas_email_template"
import BinexEmailTemplate from "../../emailsCursos/binex_email_template"
import SayanEmailTemplate from "../../emailsCursos/sayan_email_template"
import CimadeEmailTemplate from "../../emailsCursos/cimade_email_template"
import RizoEmailTemplate from "../../emailsCursos/rizo_email_template"
import { render } from "@react-email/render"

interface Props {
  onSaveData: () => void
}

const SendMail: React.FC<Props> = ({ onSaveData }) => {
  const [participants, setParticipants] = useState<Participant[]>([])
  const [sendSuccess, setSendSuccess] = useState(false)
  const [sendError, setSendError] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isSendButtonDisabled, setIsSendButtonDisabled] = useState(true)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [sentStatus, setSentStatus] = useState<boolean[]>([])
  const [sendingEmails, setSendingEmails] = useState(false)

  const fetchData = async () => {
    try {
      const db = new DataForSendCursos()
      const allParticipants = await db.partForSend.toArray()
      setParticipants(allParticipants)
      setIsLoading(false)
      setIsSendButtonDisabled(allParticipants.length === 0)
      setSentStatus(Array(allParticipants.length).fill(false))
    } catch (error) {
      console.error("Error al obtener los datos de los participantes:", error)
      setIsLoading(false)
      setIsSendButtonDisabled(true)
    }
  }


  const TwoFunctions = async () => {
    await handleSaveData()
    formatMaterialsForSend()
  }

  const formatMaterialsForSend = () => {
    const formattedMaterials = participants.map((participant) => ({
      ...participant,
      material: participant.material
        .replace(/ SESI /g, "\nSESI ")
        .replace(/ MATERIALES:/g, "MATERIALES:\n")
        .replace(/ VIDEOS:/g, "\nVIDEOS:\n"),
    }))
    setParticipants(formattedMaterials)
  }

  const sendMessageToAll = () => {
    setShowConfirmation(true)
  }

  const handleConfirmSend = async () => {
    const currentCompany = localStorage.getItem("selectedCompanyCursos")

    if (!currentCompany) {
      console.error("No company selected.")
      return
    }

    const emailAccounts = {
      ecomas: {
        email: "ecomas.201@gmail.com",
        pass: "aubslrrzusgphuad",
        template: "EcomasEmailTemplate",
      },
      promas: {
        email: "promascorporacion@gmail.com",
        pass: "hxqdcmlfshgzknsc",
        template: "PromasEmailTemplate",
      },
      binex: {
        email: "binexeducacion@gmail.com",
        pass: "vkomtvrdkpkxhvci",
        template: "BinexEmailTemplate",
      },
      cimade: {
        email: "cimade.educacion@gmail.com",
        pass: "btfsfgjlbbmfiodi",
        template: "CimadeEmailTemplate",
      },
      rizo: {
        email: "corporacionrizo@gmail.com",
        pass: "pffgvmqlcmpbkbcd",
        template: "RizoEmailTemplate",
      },
      sayan: {
        email: "sayancorporacion@gmail.com",
        pass: "jvqcfyplbjmbcoih",
        template: "SayanEmailTemplate",
      },
    }

    const senderAccount = emailAccounts[currentCompany]

    if (!senderAccount) {
      console.error("No email account found for the selected company.")
      return
    }

    // Configurar el transporter de Nodemailer
    const transporter = nodemailer.createTransport({
      service: "gmail",
      host: 'smtp.gmail.com',
      port: 587,
      secure: true,
      auth: {

        user: senderAccount.email, // Correo electrónico del remitente
        pass: senderAccount.pass, // Contraseña del remitente

      },
    })

    try {
      setSendingEmails(true)
      for (let i = 0; i < participants.length; i++) {
        const participant = participants[i]
        if (
          !participant ||
          !participant.email
        ) {
          console.error("Datos del participante incompletos:", participant)
          continue
        }

        const firstNameMatch = participant.name.match(/^\S+/)
        const firstName = firstNameMatch ? firstNameMatch[0] : ""

        const getEmailComponent = (type) => {
          switch (type) {
            case "EcomasEmailTemplate":
              return (
                <EcomasEmailTemplate
                  name={firstName}
                  message={participant.material}
                  curso={participant.curso}
                />
              )
            case "PromasEmailTemplate":
              return (
                <PromasEmailTemplate
                  name={firstName}
                  message={participant.material}
                  curso={participant.curso}
                />
              )
            case "BinexEmailTemplate":
              return (
                <BinexEmailTemplate
                  name={firstName}
                  message={participant.material}
                  curso={participant.curso}
                />
              )
            case "SayanEmailTemplate":
              return (
                <SayanEmailTemplate
                  name={firstName}
                  message={participant.material}
                  curso={participant.curso}
                />
              )
            case "CimadeEmailTemplate":
              return (
                <CimadeEmailTemplate
                  name={firstName}
                  message={participant.material}
                  curso={participant.curso}
                />
              )
            case "RizoEmailTemplate":
              return (
                <RizoEmailTemplate
                  name={firstName}
                  message={participant.material}
                  curso={participant.curso}
                />
              )
            default:
              return <div>No email type selected</div>
          }
        }
        console.log("Sender account template:", senderAccount.template)

        const emailHtml = render(getEmailComponent(senderAccount.template))

        const participantPdfArrayBuffer = await participant.pdf.arrayBuffer()
        const participantPdfBuffer = Buffer.from(participantPdfArrayBuffer)
        const fileName = participant.name.endsWith(".pdf")
          ? participant.name
          : participant.name + ".pdf"

        const mailOptions = {
          from: senderAccount.email,
          to: participant.email, // Dirección de correo electrónico del destinatario
          subject: "Certificado de Curso",
          html: emailHtml,
          attachments: [
            {
              filename: fileName, // Usar fileName en lugar de participant.name
              content: participantPdfBuffer,
            },
          ],
        }

        // Enviar el correo electrónico
        const info = await transporter.sendMail(mailOptions)
        console.log("Correo electrónico enviado:", info.response)

        setSentStatus((prevStatus) => {
          const updatedStatus = [...prevStatus]
          updatedStatus[i] = true
          return updatedStatus
        })
      }

      setSendSuccess(true)
      setTimeout(() => {
        setSendSuccess(false)
      }, 4000)
    } catch (error) {
      console.log("Error al enviar el email: ", error)
      setSendError(true)
      setTimeout(() => {
        setSendError(false)
      }, 5000)
    } finally {
      setSendingEmails(false) // Step 2: Set loading state to false when done
    }

    setShowConfirmation(false)
  }

  const handleCancelSend = () => {
    setShowConfirmation(false)
  }

  const handleSaveData = async () => {
    onSaveData()
    setTimeout(() => {
      fetchData()
    }, 1000)
    setIsSendButtonDisabled(false)
  }

  const handleClearDatabase = async () => {
    try {
      const db = new DataForSendCursos()
      await db.partForSend.clear()
      setParticipants([])
      setIsSendButtonDisabled(true)
      setSentStatus([])
      console.log("Base de datos limpiada.")
    } catch (error) {
      console.error("Error al limpiar la base de datos:", error)
    }
  }

  const handleDeleteParticipant = async (participantId: number | undefined) => {
    if (typeof participantId === "undefined") {
      console.error("El ID del participante es indefinido.")
      return
    }

    try {
      const db = new DataForSendCursos()
      await db.partForSend.where("id").equals(participantId).delete()
      setParticipants((prevParticipants) =>
        prevParticipants.filter(
          (participant) => participant.id !== participantId
        )
      )
      const remainingParticipants = participants.filter(
        (participant) => participant.id !== participantId
      )
      setIsSendButtonDisabled(remainingParticipants.length === 0)
      setSentStatus(remainingParticipants.map(() => false))
      console.log("Participante eliminado correctamente.")
    } catch (error) {
      console.error("Error al eliminar el participante:", error)
    }
  }

  const handleUpdateEmail = (
    participantId: number | undefined,
    newEmail: string
  ) => {
    if (participantId !== undefined) {
      setParticipants((prevParticipants) =>
        prevParticipants.map((participant) =>
          participant.id === participantId
            ? { ...participant, email: newEmail }
            : participant
        )
      )
    }
  }

  const handleUpdateCurso = (newCurso: string) => {
    setParticipants((prevParticipants) =>
      prevParticipants.map((participant) => ({
        ...participant,
        curso: newCurso,
      }))
    )
  }

  const handleUpdateMaterial = (newMaterial: string) => {
    setParticipants((prevParticipants) =>
      prevParticipants.map((participant) => ({
        ...participant,
        material: newMaterial,
      }))
    )
  }

  return (
    <main className="w-full flex justify-center items-center flex-col ">
      <div className="bg-[#1e2936] w-full rounded-xl p-3 mx-4 mb-4">
        <button
          className="btn-success btn-outline tooltip tooltip-left btn w-full mb-2"
          data-tip="Se mostrarán los certificados a enviarse, (Solo digitales y firma-empresa). 🦅"
          onClick={TwoFunctions}
        >
          Mostrar Certificados a enviarse
        </button>
        <button
          className="btn btn-success mb-2 w-full  border-transparent "
          onClick={sendMessageToAll}
          disabled={isSendButtonDisabled}
        >
          Enviar todos los correos
        </button>
        {showConfirmation && (
          <div className="flex flex-row p-3 mx-4 mb-2 items-center justify-center">
            <p>¿Estás segur@ que deseas enviar todos los correos?</p>
            <button
              className="btn btn-success mx-2 "
              onClick={handleConfirmSend}
            >
              Sí
            </button>
            <button
              className="btn btn-error"
              onClick={handleCancelSend}
            >
              No
            </button>
          </div>
        )}
        {sendingEmails && ( // Step 3: Render loading indicator when sendingEmails is true
          <div className="text-yellow-500 flex flex-row">
            <span className="loading loading-spinner text-warning mr-2"></span>
            Enviando todos los correos...</div>
        )}
        {sendSuccess && (
          <div className="text-green-600">
            ¡Correos enviados!
          </div>
        )}
        {sendError && (
          <div className="text-red-600">
            ¡Hubo un error al enviar los correos!
          </div>
        )}
        {!isLoading && (
          <>
            <table className="table table-xs table-pin-rows table-pin-cols w-full mt-1">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Correo electrónico</th>
                  <th>Correo Enviado</th>
                  <th>PDF</th>
                  <th>Elim.</th>
                </tr>
              </thead>
              <tbody>
                {participants.map((participant, index) => (
                  <tr key={participant.id}>
                    <td>{participant.name}</td>
                    <td>
                      <input
                        className=" text-xs py-1 rounded px-2 bg-gray-800"
                        type="email"
                        id="email"
                        value={participant.email}
                        onChange={(e) =>
                          handleUpdateEmail(participant.id, e.target.value)
                        }
                        style={{
                          border:
                            participant.email &&
                            !/\S+@\S+\.\S+/.test(participant.email)
                              ? "1px solid #f75962"
                              : "1px solid #000",
                        }}
                      />
                    </td>
                    <td>
                      {sentStatus[index] ? (
                        <span className="text-green-500">Enviado</span>
                      ) : (
                        <span className="text-[#f75962]">No enviado</span>
                      )}
                    </td>
                    <td>
                      {participant.pdf ? (
                        <a
                          href={URL.createObjectURL(participant.pdf)}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Ver PDF
                        </a>
                      ) : (
                        <span className="text-red-500">
                          No hay PDF disponible
                        </span>
                      )}
                    </td>
                    <td>
                      <button
                        className=" text-white"
                        onClick={() => handleDeleteParticipant(participant.id)}
                      >
                        <MdDelete className="w-8" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="flex justify-between items-center mt-2">
              <button
                className="btn btn-error text-red-400 btn-ghost hover:!text-white"
                onClick={handleClearDatabase}
                disabled={isSendButtonDisabled}
              >
                <MdDelete className="" />
                Eliminar Certificados a enviarse
              </button>
              <button
                className="tooltip tooltip-left"
                data-tip="🐍 Si solo se generaron certificados manualmente, por favor agregue el curso y materiales para enviar."
              >
                <IoInformationCircleOutline className="mr-4 w-8 h-8" />
              </button>
            </div>
            {participants.length > 0 && (
              <div className="bg-gray-700 p-3 mt-4 rounded-md">
                <p className="pb-2">
                  <strong>Curso:</strong>
                  <input
                    type="text"
                    value={participants[0].curso}
                    onChange={(e) => handleUpdateCurso(e.target.value)}
                    className="input w-full mt-1"
                  />
                </p>
                <p>
                  <strong>Enlaces Materiales:</strong>
                </p>
                <textarea
                  value={participants[0].material}
                  onChange={(e) => handleUpdateMaterial(e.target.value)}
                  className="textarea w-full h-36 mt-1"
                  style={{
                    border:
                      participants[0].material.trim() === ""
                        ? "1px solid #f75962"
                        : "1px solid #000",
                  }}
                />
              </div>
            )}
          </>
        )}
      </div>
    </main>
  )
}

export default SendMail
