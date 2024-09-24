import React, { useState, useEffect } from "react"
import { ImageDatabaseCursos } from "../../databasesCursos/C_ImageUploaderDB"
import { participantDB } from "./C_ReadExcelParticipants"

const imageDB = new ImageDatabaseCursos()

const CertificateGeneratorExcel = ({
  onCertificateGenerated,
  onDeleteData,
}) => {
  const [generatingCertificates, setGeneratingCertificates] = useState(false)
  const [participantsExist, setParticipantsExist] = useState(false) // Estado para rastrear si existen participantes en la tabla
  const [dataExists, setDataExists] = useState(false)
  const [whenDelete, setWhenDelete] = useState(false)

  const handleDelete = async () => {
    try {
      setWhenDelete(true) // Cambiar a true mientras se está limpiando
      localStorage.removeItem("selectedFilePath")
      await Promise.all([
        imageDB.certificates.clear(),
        participantDB.participants.clear(),
      ])
      alert("Datos limpiados correctamente.")
      const participants = await participantDB.participants.toArray()
      setParticipantsExist(participants.length > 0)
      onDeleteData()
    } catch (error) {
      console.error("Error al limpiar las tablas:", error)
    } finally {
      setWhenDelete(false) // Cambiar de vuelta a false cuando la limpieza esté completa
    }
  }

  useEffect(() => {
    const checkDataExists = async () => {
      try {
        const certificates = await imageDB.certificates.toArray()
        const participants = await participantDB.participants.toArray()
        setDataExists(certificates.length > 0 || participants.length > 0)
      } catch (error) {
        console.error("Error al verificar la existencia de datos:", error)
      }
    }
    checkDataExists()
  }, [])

  useEffect(() => {
    // Verificar si hay participantes en la tabla al montar el componente
    const checkParticipantsExistence = async () => {
      const participants = await participantDB.participants.toArray()
      setParticipantsExist(participants.length > 0)
    }
    checkParticipantsExistence()
  }, [])

  const generateCertificates = async () => {
    try {
      setGeneratingCertificates(true)
      console.log("Limpiando la base de datos de certificados...")
      await imageDB.certificates.clear()

      const participants = await participantDB.participants.toArray()

      if (participants.length === 0) {
        console.warn("No hay participantes en la base de datos.")
        return
      }

      console.log("Lista de participantes:")
      participants.forEach((participant) => {
        console.log(participant)
      })

      // Obtener el valor almacenado en localStorage que indica la empresa actual
      const currentCompany = localStorage.getItem("selectedCompanyCursos")

      // Verificar si el valor de currentCompany es válido
      if (currentCompany && currentCompany.trim() !== "") {
        // Determinar el nombre de la tabla de imágenes correspondiente al valor de currentCompany
        const tableName = `images${
          currentCompany.charAt(0).toUpperCase() + currentCompany.slice(1)
        }`
        console.log(tableName)
        // Consultar la tabla correspondiente en la base de datos Dexie
        const images = await imageDB[tableName].toArray()
        console.log(images)
        // Procesar las imágenes obtenidas
        const imageData = {}
        images.forEach((image) => {
          imageData[image.name] = image.imageDataURL
        })

        // Obtener el array selectedCertificatesCursos del localStorage
        const selectedCertificatesCursos = JSON.parse(
          localStorage.getItem("selectedCertificatesCursos")
        )
        console.log(
          "Tipos de certificados seleccionados:",
          selectedCertificatesCursos
        )

        let firstDigitalCertificateGenerated = false
        let firstPhysicalCertificateGenerated = false
        let firstOnlyCertificateGenerated = false

        for (const participant of participants) {
          try {
            if (participant.estadoPago === "Aprobado") {
              console.log("Datos de las imágenes:", imageData)

              if (selectedCertificatesCursos.includes("certificadoDigital")) {
                const certificateDataURLDigital = await generateCertificate(
                  participant,
                  imageData.imgCertiDigital,
                  currentCompany,
                  "certificadoDigital"
                )
                await imageDB.certificates.add({
                  certificateDataURL: certificateDataURLDigital,
                  type: "certificadoDigital",
                  ownerName: participant.nombreParticipante,
                })
                console.log(
                  `Certificado digital generado para ${participant.nombreParticipante}`
                )

                // Si es el primer certificado digital generado, eliminarlo y volver a generarlo
                if (!firstDigitalCertificateGenerated) {
                  await imageDB.certificates
                    .where({
                      ownerName: participant.nombreParticipante,
                      type: "certificadoDigital",
                    })
                    .delete()
                  console.log(
                    `Certificado digital eliminado para ${participant.nombreParticipante}`
                  )
                  const newCertificateDataURLDigital =
                    await generateCertificate(
                      participant,
                      imageData.imgCertiDigital,
                      currentCompany,
                      "certificadoDigital"
                    )
                  await imageDB.certificates.add({
                    certificateDataURL: newCertificateDataURLDigital,
                    type: "certificadoDigital",
                    ownerName: participant.nombreParticipante,
                  })
                  console.log(
                    `Certificado digital re-generado para ${participant.nombreParticipante}`
                  )
                  firstDigitalCertificateGenerated = true
                }
              }

              if (selectedCertificatesCursos.includes("certificadoFisico")) {
                const certificateDataURLPhisyc = await generateCertificate(
                  participant,
                  imageData.imgCertiPhisyc,
                  currentCompany,
                  "certificadoFisico"
                )
                await imageDB.certificates.add({
                  certificateDataURL: certificateDataURLPhisyc,
                  type: "certificadoFisico",
                  ownerName: participant.nombreParticipante,
                })
                console.log(
                  `Certificado físico generado para ${participant.nombreParticipante}`
                )

                // Si es el primer certificado físico generado, eliminarlo y volver a generarlo
                if (!firstPhysicalCertificateGenerated) {
                  await imageDB.certificates
                    .where({
                      ownerName: participant.nombreParticipante,
                      type: "certificadoFisico",
                    })
                    .delete()
                  console.log(
                    `Certificado físico eliminado para ${participant.nombreParticipante}`
                  )
                  const newCertificateDataURLPhisyc = await generateCertificate(
                    participant,
                    imageData.imgCertiPhisyc,
                    currentCompany,
                    "certificadoFisico"
                  )
                  await imageDB.certificates.add({
                    certificateDataURL: newCertificateDataURLPhisyc,
                    type: "certificadoFisico",
                    ownerName: participant.nombreParticipante,
                  })
                  console.log(
                    `Certificado físico re-generado para ${participant.nombreParticipante}`
                  )
                  firstPhysicalCertificateGenerated = true
                }
              }
            } else if (
              participant.estadoPago === "No aprobado" &&
              selectedCertificatesCursos.includes("certificadoOnly")
            ) {
              const certificateDataURLOnly = await generateCertificate(
                participant,
                imageData.imgCertiOnly,
                currentCompany,
                "certificadoOnly"
              )
              await imageDB.certificates.add({
                certificateDataURL: certificateDataURLOnly,
                type: "certificadoOnly",
                ownerName: participant.nombreParticipante,
              })
              console.log(
                `Certificado only generado para ${participant.nombreParticipante}`
              )

              // Si es el primer certificado 'only' generado, eliminarlo y volver a generarlo
              if (!firstOnlyCertificateGenerated) {
                await imageDB.certificates
                  .where({
                    ownerName: participant.nombreParticipante,
                    type: "certificadoOnly",
                  })
                  .delete()
                console.log(
                  `Certificado only eliminado para ${participant.nombreParticipante}`
                )
                const newCertificateDataURLOnly = await generateCertificate(
                  participant,
                  imageData.imgCertiOnly,
                  currentCompany,
                  "certificadoOnly"
                )
                await imageDB.certificates.add({
                  certificateDataURL: newCertificateDataURLOnly,
                  type: "certificadoOnly",
                  ownerName: participant.nombreParticipante,
                })
                console.log(
                  `Certificado only re-generado para ${participant.nombreParticipante}`
                )
                firstOnlyCertificateGenerated = true
              }
            }
          } catch (error) {
            console.error(
              `Error al generar el certificado para ${participant.nombreParticipante}:`,
              error
            )
          }
        }
        alert(
          "Certificados generados exitosamente para todos los participantes."
        )
        // Llamar a la función onCertificateGenerated al completar la generación de certificados
        onCertificateGenerated()
      } else {
        console.error(
          "No se encontró un valor válido para la empresa actual en el almacenamiento local."
        )
      }
    } catch (error) {
      console.error("Error al generar los certificados:", error)
      console.error(
        "Error al generar los certificados. Por favor, inténtalo de nuevo."
      )
    } finally {
      setGeneratingCertificates(false)
    }
  }

  const generateCertificate = async (
    participant,
    imageDataURL,
    currentCompany,
    tipoCertificado
  ) => {
    // Verificar si todos los campos necesarios están disponibles
    if (imageDataURL) {
      // Crear un lienzo
      const canvas = document.createElement("canvas")
      const ctx = canvas.getContext("2d")

      canvas.width = 4677 // Ancho de tu imagen
      canvas.height = 3308 // Alto de tu imagen

      // Cargar la imagen en el lienzo
      const img = new Image()
      img.src = imageDataURL
      await new Promise((resolve, reject) => {
        img.onload = resolve
        img.onerror = reject
      })
      ctx.textAlign = "justify"
      ctx.drawImage(img, 0, 0)

      ctx.fillStyle = "#000000" // Color del texto
      ctx.textBaseline = "middle"
      ctx.font = "Century Gothic"

      const drawText = (text, fontSize, x, y, maxWidth) => {
        ctx.font = `bold ${fontSize}px Century Gothic`
        while (ctx.measureText(text).width > maxWidth) {
          fontSize -= 1
          ctx.font = `bold ${fontSize}px Century Gothic`
        }
        ctx.fillText(text, x, y)
      }

      const drawMultiLineText = (
        text,
        initialFontSize,
        x,
        y,
        maxWidth,
        maxHeight
      ) => {
        let fontSize = initialFontSize
        ctx.font = `bold ${fontSize}px Century Gothic`

        if (text.length > 80) {
          // Dividir el texto en dos líneas
          const middle = Math.floor(text.length / 2)
          let breakPoint = text.lastIndexOf(" ", middle)
          if (breakPoint === -1) breakPoint = middle

          const firstLine = text.slice(0, breakPoint).trim()
          const secondLine = text.slice(breakPoint).trim()

          // Ajustar el tamaño de la fuente para ambas líneas
          while (
            ctx.measureText(firstLine).width > maxWidth ||
            ctx.measureText(secondLine).width > maxWidth ||
            fontSize * 2 > maxHeight
          ) {
            fontSize -= 1
            ctx.font = `bold ${fontSize}px Century Gothic`
          }

          // Dibujar ambas líneas 30px más arriba
          ctx.fillText(firstLine, x, y - 35)
          ctx.fillText(secondLine, x, y - 35 + fontSize + 5) // Espacio entre las líneas
        } else {
          // Ajuste específico para texto más corto
          drawText(text, fontSize, x, y - 50 + fontSize / 2, maxWidth)
        }
      }

      const maxWidthCursoName = 2800 // Máximo ancho para el nombre del curso
      const maxWidthNombreParticipante = 2800 // Máximo ancho para el nombre del participante
      const maxHeightCursoName = 140 // Máxima altura para el nombre del curso

      ctx.textAlign = "center"

      // Ajustar el tamaño del texto para CursoName
      drawMultiLineText(
        participant.CursoName,
        98,
        3045,
        1634,
        maxWidthCursoName,
        maxHeightCursoName
      )

      // Ajustar el tamaño del texto para nombreParticipante
      drawText(
        participant.nombreParticipante,
        120,
        3045,
        1326,
        maxWidthNombreParticipante
      )

      //PONENTE
      function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
        let words = text.split(" ")
        let line = ""
        let lines = []
        const maxLines = 3 // Número máximo de líneas permitidas

        for (let n = 0; n < words.length; n++) {
          let testLine = line + words[n] + " "
          let metrics = ctx.measureText(testLine)
          let testWidth = metrics.width

          if (testWidth > maxWidth && n > 0) {
            lines.push(line)
            line = words[n] + " "
            if (lines.length === maxLines) {
              // Si hemos alcanzado el número máximo de líneas, reducimos el tamaño de la fuente
              return false
            }
          } else {
            line = testLine
          }
        }
        lines.push(line)

        for (let i = 0; i < lines.length; i++) {
          ctx.fillText(lines[i], x, y + i * lineHeight)
        }

        return true
      }

      // Configuración del contexto
      ctx.textAlign = "center"
      ctx.fillStyle = "white"

      // Uso de la función para ajustar el texto
      let text = participant.Ponente
      let xPonente = 700
      let yPonente = 855
      let maxWidth = 800 // Ancho máximo del texto
      let lineHeight = 48 // Altura de línea (puedes ajustarlo según sea necesario)
      let fontSize = 42 // Tamaño de fuente inicial
      ctx.font = `bold ${fontSize}px Century Gothic`

      while (!wrapText(ctx, text, xPonente, yPonente, maxWidth, lineHeight)) {
        // Reducir el tamaño de la fuente si el texto supera las 3 líneas
        fontSize -= 2
        ctx.font = `bold ${fontSize}px Century Gothic`
      }

      //CODIGOPARTICIPANTE
      ctx.textAlign = "center"
      ctx.fillStyle = "black"
      ctx.font = "bold 60px Century Gothic"
      ctx.fillText(participant.codigoParticipante, 713, 2835)

      //TEXTO DE ORGANIZACION, FECHAS Y HORAS
      let tamanoFuente = 80 // Tamaño de fuente en píxeles
      // Definir una letiable para almacenar el texto de la organización
      let instituciones = ""

      // Determinar la organización según el tipo de certificado y la empresa actual
      switch (currentCompany) {
        case "ecomas":
          switch (tipoCertificado) {
            case "certificadoDigital":
            case "certificadoFisico":
              instituciones =
                "el Colegio de Ingenieros del Perú - CD Huancavelica y ECOMÁS Consultoría y Capacitación"
              break
            case "certificadoOnly":
              instituciones = "ECOMÁS Consultoría y Capacitación"
              break
            default:
              instituciones = "Organización desconocida"
              break
          }
          break
        case "promas":
          switch (tipoCertificado) {
            case "certificadoDigital":
            case "certificadoFisico":
              instituciones =
                "la Universidad Nacional de Piura, FUNDENORP y Corporación PROMÁS"
              break
            case "certificadoOnly":
              instituciones = "Corporación PROMÁS"
              break
            default:
              instituciones = "Organización desconocida"
              break
          }
          break
        case "binex":
          switch (tipoCertificado) {
            case "certificadoDigital":
            case "certificadoFisico":
              instituciones =
                "la Universidad Nacional de Piura, FUNDENORP y BINEX Educación Continua"
              break
            case "certificadoOnly":
              instituciones = "BINEX Educación Continua"
              break
            default:
              instituciones = "Organización desconocida"
              break
          }
          break
        case "cimade":
          switch (tipoCertificado) {
            case "certificadoDigital":
            case "certificadoFisico":
              instituciones =
                "el Colegio de Ingenieros del Perú - CD Tacna y CIMADE Educación Continua"
              break
            case "certificadoOnly":
              instituciones = "CIMADE Educación Continua"
              break
            default:
              instituciones = "Organización desconocida"
              break
          }
          break
        case "rizo":
          switch (tipoCertificado) {
            case "certificadoDigital":
            case "certificadoFisico":
              instituciones =
                "la Universidad Nacional de Piura, FUNDENORP y Corporación RIZO"
              break
            case "certificadoOnly":
              instituciones = "Corporación RIZO"
              break
            default:
              instituciones = "Organización desconocida"
              break
          }
          break
        case "sayan":
          switch (tipoCertificado) {
            case "certificadoDigital":
            case "certificadoFisico":
              instituciones =
                "la Universidad Nacional de Piura, FUNDENORP y Corporación SAYAN"
              break
            case "certificadoOnly":
              instituciones = "Corporación SAYAN"
              break
            default:
              instituciones = "Organización desconocida"
              break
          }
          break
        default:
          instituciones = "Organización desconocida"
          break
      }


      let textoCompleto = ""; // Definir la variable antes de usarla

      // Obtenemos los meses de las fechas de inicio y fin
      let mesInicio = participant.FechaInicio.split(" ")[2]
      console.log(mesInicio);
      let mesFin = participant.FechaFin.split(" ")[2]
      console.log(mesFin);
      // Si los meses son iguales, cambiamos el formato
      if (mesInicio === mesFin) {
        textoCompleto =
          "Curso organizado por " +
          instituciones +
          ", llevado a cabo desde el " +
          participant.FechaInicio.split(" ")[0] +
          " al " +
          participant.FechaFin +
          " con una duración de " +
          participant.HorasAcademicas +
          " académicas."
      } else {
        textoCompleto =
          "Curso organizado por " +
          instituciones +
          ", llevado a cabo desde el " +
          participant.FechaInicio +
          " hasta el " +
          participant.FechaFin +
          " con una duración de " +
          participant.HorasAcademicas +
          " académicas."
      }

      // Ancho máximo deseado para el texto
      const anchoMaximo1 = 1920
      // Función para dividir el texto en líneas según el ancho máximo
      function dividirTextoEnLineas(texto, anchoMaximo1) {
        let palabras = texto.split(" ")
        let lineas1 = []
        let lineaActual = palabras[0]
        for (let i = 1; i < palabras.length; i++) {
          let palabra = palabras[i]
          let medida = ctx.measureText(lineaActual + " " + palabra)
          if (medida.width < anchoMaximo1) {
            lineaActual += " " + palabra
          } else {
            lineas1.push(lineaActual)
            lineaActual = palabra
          }
        }
        lineas1.push(lineaActual)
        return lineas1
      }

      // Obtener las líneas divididas
      let lineas1 = dividirTextoEnLineas(textoCompleto, anchoMaximo1)
      let y1 = 1910
      // Dibujar cada línea en el canvas
      for (let i = 0; i < lineas1.length; i++) {
        ctx.textAlign = "center"
        ctx.font = "85px Century Gothic" // Sin negrita
        ctx.fillStyle = "black"

        ctx.fillText(lineas1[i], 3045, y1)
        y1 += tamanoFuente + 15 // Espacio vertical entre líneas
      }

      //TEMARIO -----------------------------------------------------------------------
      // Ancho máximo permitido para el texto
      let anchoMaximo = 800

      ctx.fillStyle = "white"
      ctx.textAlign = "left"
      ctx.font = "bold 42px Century Gothic"

      // Separar el temario por líneas
      let lineas = participant.Temario.split("\n")

      let x = 300 // Posición x inicial
      let y = 1120 // Posición y inicial

      lineas.forEach(function (linea, index) {
        // Separar la línea en palabras
        let palabrasLinea = linea.split(" ")
        let lineaActual = ""

        palabrasLinea.forEach(function (palabra, index) {
          // Medir el ancho de la línea actual con la palabra actual agregada
          let anchoLinea = ctx.measureText(lineaActual + palabra).width

          // Si la línea actual excede el ancho máximo permitido, dibujar la línea actual y pasar a la siguiente línea
          if (anchoLinea > anchoMaximo) {
            ctx.fillText(lineaActual, x, y)
            y += 45 // Incrementar la posición y para el salto de línea
            // Reiniciar la línea actual con la palabra actual
            lineaActual = palabra + " "
          } else {
            // Agregar la palabra actual a la línea actual
            //Stiwi was here
            lineaActual += palabra + " "
          }
        })

        // Dibujar la última línea actual
        ctx.fillText(lineaActual, x, y)
        y += 50 // Incrementar la posición y para el salto de línea
      })

      // Generar el certificado como una imagen
      const certificateDataURL = canvas.toDataURL("image/jpeg")

      return certificateDataURL // Devolver la URL de la imagen del certificado
    } else {
      // Si falta algún campo, lanzar un error
      throw new Error("Faltan campos necesarios para generar el certificado.")
    }
  }

  return (
    <>
      <button
        className="w-full btn btn-success mt-2 tooltip tooltip-right border-transparent"
        onClick={generateCertificates}
        disabled={generatingCertificates || !participantsExist}
        data-tip="⚠️ Al generar nuevos certificados por Excel, se eliminarán automáticamente todos los certificados existentes."
      >
        {generatingCertificates ? (
          <>
            <span className="loading loading-spinner loading-xs mr-1"></span>
            Generando Certificados...
          </>
        ) : (
          "Generar certificados"
        )}
      </button>

      {/* Botón de limpiar datos con texto condicional */}
      <button
        className="w-full btn btn-outline btn-error mt-2 tooltip tooltip-right hover:bg-[#f36365] hover:border-transparent hover:!text-white"
        onClick={handleDelete}
        disabled={whenDelete}
        data-tip="⛔ Elimina todos los certificados, así como también el archivo Excel insertado."
      >
        {whenDelete ? (
          <>
            <span className="loading loading-spinner loading-xs mr-1"></span>
            Limpiando...
          </>
        ) : (
          "Limpiar todos los datos"
        )}
      </button>
    </>
  )
}

export default CertificateGeneratorExcel
