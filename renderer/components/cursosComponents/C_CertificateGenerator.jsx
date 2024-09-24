import React, { useState, useEffect } from "react"
import { ImageDatabaseCursos } from "../../databasesCursos/C_ImageUploaderDB" // Asegúrate de importar la clase ImageDatabaseCursos desde donde se encuentra definida

const imageDB = new ImageDatabaseCursos()

const generateCertificate = async (
  CursoName,
  FechaInicio,
  FechaFin,
  Ponente,
  Temario,
  HorasAcademicas,
  ParticipanteName,
  CodigoParticipante,
  imageDataURL,
  selectedImageTypes,
  type
) => {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  canvas.width = 4677;
  canvas.height = 3308;

  const img = new Image();
  img.src = imageDataURL;

  const meses = [
    "enero", "febrero", "marzo", "abril", "mayo", "junio",
    "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"
  ];

  const formatearFecha = (fecha) => {
    const partes = fecha.split("-");
    const dia = partes[2];
    const mes = meses[parseInt(partes[1], 10) - 1];
    const año = partes[0];
    return { dia, mes, año };
  };

  const fechaInicioObj = formatearFecha(FechaInicio);
  const fechaFinObj = formatearFecha(FechaFin);
  const mismoMesYAño = (FechaInicio.split("-")[1] === FechaFin.split("-")[1]) && (FechaInicio.split("-")[0] === FechaFin.split("-")[0]);

  const fechaFormateada = mismoMesYAño
    ? `desde el ${fechaInicioObj.dia} al ${fechaFinObj.dia} de ${fechaInicioObj.mes} del ${fechaInicioObj.año}`
    : `desde el ${fechaInicioObj.dia} de ${fechaInicioObj.mes} hasta el ${fechaFinObj.dia} de ${fechaFinObj.mes} de ${fechaFinObj.año}`;

  return new Promise((resolve) => {
    img.onload = () => {
      if (ctx) {
        ctx.textAlign = "justify";
        ctx.drawImage(img, 0, 0);

        ctx.fillStyle = "#000000";
        ctx.textBaseline = "middle";
        ctx.font = "Century Gothic";

        const drawText = (text, fontSize, x, y, maxWidth) => {
          ctx.font = `bold ${fontSize}px Century Gothic`;
          while (ctx.measureText(text).width > maxWidth) {
            fontSize -= 1;
            ctx.font = `bold ${fontSize}px Century Gothic`;
          }
          ctx.fillText(text, x, y);
        };

        const drawMultiLineText = (text, initialFontSize, x, y, maxWidth, maxHeight) => {
          let fontSize = initialFontSize;
          ctx.font = `bold ${fontSize}px Century Gothic`;

          if (text.length > 80) {
            const middle = Math.floor(text.length / 2);
            let breakPoint = text.lastIndexOf(" ", middle);
            if (breakPoint === -1) breakPoint = middle;

            const firstLine = text.slice(0, breakPoint).trim();
            const secondLine = text.slice(breakPoint).trim();

            while (
              ctx.measureText(firstLine).width > maxWidth ||
              ctx.measureText(secondLine).width > maxWidth ||
              fontSize * 2 > maxHeight
            ) {
              fontSize -= 1;
              ctx.font = `bold ${fontSize}px Century Gothic`;
            }

            ctx.fillText(firstLine, x, y - 35);
            ctx.fillText(secondLine, x, y - 35 + fontSize + 5);
          } else {
            drawText(text, fontSize, x, y - 50 + fontSize / 2, maxWidth);
          }
        };

        const maxWidthCursoName = 2800;
        const maxWidthNombreParticipante = 2800;
        const maxHeightCursoName = 140;

        ctx.textAlign = "center";

        drawMultiLineText(CursoName, 98, 3045, 1634, maxWidthCursoName, maxHeightCursoName);
        drawText(ParticipanteName, 120, 3045, 1326, maxWidthNombreParticipante);

        function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
          let words = text.split(" ");
          let line = "";
          let lines = [];
          const maxLines = 3;

          for (let n = 0; n < words.length; n++) {
            let testLine = line + words[n] + " ";
            let metrics = ctx.measureText(testLine);
            let testWidth = metrics.width;

            if (testWidth > maxWidth && n > 0) {
              lines.push(line);
              line = words[n] + " ";
              if (lines.length === maxLines) {
                return false;
              }
            } else {
              line = testLine;
            }
          }
          lines.push(line);

          for (let i = 0; i < lines.length; i++) {
            ctx.fillText(lines[i], x, y + i * lineHeight);
          }

          return true;
        }

        ctx.textAlign = "center";
        ctx.fillStyle = "white";

        let text = Ponente;
        let xPonente = 700;
        let yPonente = 860;
        let maxWidth = 800;
        let lineHeight = 48;
        let fontSize = 42;
        ctx.font = `bold ${fontSize}px Century Gothic`;

        while (!wrapText(ctx, text, xPonente, yPonente, maxWidth, lineHeight)) {
          fontSize -= 2;
          ctx.font = `bold ${fontSize}px Century Gothic`;
        }

        ctx.textAlign = "center";
        ctx.fillStyle = "black";
        ctx.font = "bold 60px Century Gothic";
        ctx.fillText(CodigoParticipante, 713, 2835);

        let instituciones = "";
        const selectedCompanyCursos = localStorage.getItem("selectedCompanyCursos");

        switch (selectedCompanyCursos) {
          case "ecomas":
            instituciones =
              type === "tipo3"
                ? "ECOMÁS Consultoría y Capacitación"
                : "el Colegio de Ingenieros del Perú - CD Huancavelica y ECOMÁS Consultoría y Capacitación";
            break;
          case "promas":
            instituciones =
              type === "tipo3"
                ? "Corporación PROMÁS"
                : "la Universidad Nacional de Piura, FUNDENORP y Corporación PROMÁS";
            break;
          case "binex":
            instituciones =
              type === "tipo3"
                ? "BINEX Educación Continua"
                : "la Universidad Nacional de Piura, FUNDENORP y BINEX Educación Continua";
            break;
          case "cimade":
            instituciones =
              type === "tipo3"
                ? "CIMADE Educación Continua"
                : "el Colegio de Ingenieros del Perú - CD Tacna y CIMADE Educación Continua";
            break;
          case "rizo":
            instituciones =
              type === "tipo3"
                ? "Corporación RIZO"
                : "la Universidad Nacional de Piura, FUNDENORP y Corporación RIZO";
            break;
          case "sayan":
            instituciones =
              type === "tipo3"
                ? "Corporación SAYAN"
                : "la Universidad Nacional de Piura, FUNDENORP y Corporación SAYAN";
            break;
          default:
            instituciones = "Organización desconocida";
            break;
        }

        const textoCompleto =
          "Curso organizado por " +
          instituciones +
          ", llevado a cabo " +
          fechaFormateada +
          " con una duración de " +
          HorasAcademicas +
          " académicas.";
        const anchoMaximo = 2000;
        const tamanoFuente = 80;

        const dividirTextoEnLineas = (texto, anchoMaximo) => {
          const palabras = texto.split(" ");
          const lineas = [];
          let lineaActual = palabras[0];
          for (let i = 1; i < palabras.length; i++) {
            const palabra = palabras[i];
            const anchoLinea = ctx.measureText(lineaActual + " " + palabra).width;
            if (anchoLinea < anchoMaximo) {
              lineaActual += " " + palabra;
            } else {
              lineas.push(lineaActual);
              lineaActual = palabra;
            }
          }
          lineas.push(lineaActual);
          return lineas;
        };

        const lineas = dividirTextoEnLineas(textoCompleto, anchoMaximo);
        let y = 1920;

        lineas.forEach((linea) => {
          ctx.textAlign = "center";
          ctx.font = "85px Century Gothic";
          ctx.fillStyle = "black";
          ctx.fillText(linea, 3045, y);
          y += tamanoFuente + 15;
        });

        const anchoMaximoTemario = 800;
        ctx.fillStyle = "white";
        ctx.textAlign = "left";
        ctx.font = "bold 42px Century Gothic";
        const palabrasTemario = Temario.split("\n");
        let x = 300;
        let yTemario = 1120;

        palabrasTemario.forEach((linea) => {
          const palabrasLinea = linea.split(" ");
          let lineaActual = "";
          palabrasLinea.forEach((palabra) => {
            const anchoLinea = ctx.measureText(lineaActual + palabra).width;
            if (anchoLinea > anchoMaximoTemario) {
              ctx.fillText(lineaActual, x, yTemario);
              yTemario += 45;
              lineaActual = palabra + " ";
            } else {
              lineaActual += palabra + " ";
            }
          });
          ctx.fillText(lineaActual, x, yTemario);
          yTemario += 50;
        });

        const certificateDataURL = canvas.toDataURL("image/jpeg");
        resolve(certificateDataURL);
      }
    };
  });
};

const CertificateGenerator = ({ onCertificateGenerated, onCloseModal }) => {
  const [CursoName, setCursoName] = useState("")
  const [FechaInicio, setFechaInicio] = useState("")
  const [FechaFin, setFechaFin] = useState("")
  const [Ponente, setPonente] = useState("")
  const [Temario, setTemario] = useState("")
  const [HorasAcademicas, setHorasAcademicas] = useState("")
  const [ParticipanteName, setParticipanteName] = useState("")
  const [CodigoParticipante, setCodigoParticipante] = useState("")
  const [submitButtonDisabled, setSubmitButtonDisabled] = useState(true)
  const [selectedImageTypes, setSelectedImageTypes] = useState([])
  const [correoParticipante, setCorreoParticipante] = useState("")

  useEffect(() => {
    const textarea = document.getElementById("Temario")
    textarea.placeholder =
      "Temario (Cada tema separado por un salto de línea y con viñeta) \nTema 1 \nTema 2 \nTema 3"
  }, [])

  const checkFields = () => {
    if (
      CursoName &&
      FechaInicio &&
      FechaFin &&
      Ponente &&
      Temario &&
      HorasAcademicas &&
      ParticipanteName &&
      CodigoParticipante &&
      correoParticipante &&
      selectedImageTypes.length > 0
    ) {
      setSubmitButtonDisabled(false)
    } else {
      setSubmitButtonDisabled(true)
    }
  }

  useEffect(() => {
    checkFields()
  }, [
    CursoName,
    FechaInicio,
    FechaFin,
    Ponente,
    Temario,
    HorasAcademicas,
    ParticipanteName,
    CodigoParticipante,
    selectedImageTypes,
  ])

  const handleCheckboxChange = (e) => {
    const value = e.target.value
    setSelectedImageTypes((prev) => {
      if (prev.includes(value)) {
        return prev.filter((type) => type !== value)
      } else {
        if (prev.length === 3) return prev
        return [...prev, value]
      }
    })
  }

  const loadSelectedImages = async (types) => {
    try {
      const selectedCompanyCursos = localStorage.getItem(
        "selectedCompanyCursos"
      )
      if (!selectedCompanyCursos) {
        console.log("No se ha seleccionado ninguna empresa.")
        return null
      }

      const capitalizedCheckbox =
        selectedCompanyCursos.charAt(0).toUpperCase() +
        selectedCompanyCursos.slice(1)
      const tableName = `images${capitalizedCheckbox}`
      const images = {}

      for (const type of types) {
        let imageName
        switch (type) {
          case "tipo1":
            imageName = "imgCertiDigital"
            break
          case "tipo2":
            imageName = "imgCertiPhisyc"
            break
          case "tipo3":
            imageName = "imgCertiOnly"
            break
          default:
            console.error(`Tipo de imagen desconocido: ${type}`)
            continue
        }

        const image = await imageDB
          .table(tableName)
          .where("name")
          .equals(imageName)
          .first()
        if (image) {
          images[type] = image.imageDataURL
        } else {
          console.log(`No se encontró una imagen para el tipo: ${type}`)
        }
      }
      return images
    } catch (error) {
      console.error("Error al cargar las imágenes:", error)
      return null
    }
  }

  // Define un objeto para mantener un registro de si se ha generado el primer certificado para cada tipo
  const firstCertificateGenerated = {
    tipo1: false,
    tipo2: false,
    tipo3: false,
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (
      CursoName &&
      FechaInicio &&
      FechaFin &&
      Ponente &&
      Temario &&
      HorasAcademicas &&
      ParticipanteName &&
      CodigoParticipante &&
      correoParticipante &&
      selectedImageTypes.length > 0
    ) {
      console.log(
        "Todos los campos están completos, procediendo a cargar las imágenes seleccionadas..."
      )
      //Stiwi was here
      const imageUrls = await loadSelectedImages(selectedImageTypes)
      if (imageUrls) {
        for (const [type, imageDataURL] of Object.entries(imageUrls)) {
          console.log(`Procesando certificado para el tipo: ${type}`)
          let certificateType
          switch (type) {
            case "tipo1":
              certificateType = "certificadoDigital"
              break
            case "tipo2":
              certificateType = "certificadoFisico"
              break
            case "tipo3":
              certificateType = "certificadoOnly"
              break
            default:
              throw new Error(
                "No se ha seleccionado ningún tipo de certificado."
              )
          }

          // Si es el primer certificado, regenera y guarda
          if (!firstCertificateGenerated[type]) {
            // Generar un nuevo certificado
            let certificateDataURL = await generateCertificate(
              CursoName,
              FechaInicio,
              FechaFin,
              Ponente,
              Temario,
              HorasAcademicas,
              ParticipanteName,
              CodigoParticipante,
              imageDataURL,
              selectedImageTypes,
              type
            )
            certificateDataURL = await generateCertificate(
              CursoName,
              FechaInicio,
              FechaFin,
              Ponente,
              Temario,
              HorasAcademicas,
              ParticipanteName,
              CodigoParticipante,
              imageDataURL,
              selectedImageTypes,
              type
            )

            try {
              await imageDB.certificates.add({
                certificateDataURL,
                type: certificateType,
                ownerName: ParticipanteName,
                correoOwner: correoParticipante,
              })
              console.log(
                `Certificado de tipo ${type} regenerado y guardado correctamente en la base de datos.`
              )
              firstCertificateGenerated[type] = true
            } catch (error) {
              console.error(
                "Error al guardar el certificado en la base de datos:",
                error
              )
            }
          } else {
            // Si no es el primer certificado, solo guarda sin regenerar
            try {
              await imageDB.certificates.add({
                certificateDataURL: imageDataURL,
                type: certificateType,
                ownerName: ParticipanteName,
                correoOwner: correoParticipante,
              })
              console.log(
                `Certificado de tipo ${type} guardado correctamente en la base de datos.`
              )
            } catch (error) {
              console.error(
                "Error al guardar el certificado en la base de datos:",
                error
              )
            }
          }
        }

        alert("¡Certificados generados exitosamente!")
        onCertificateGenerated()
        onCloseModal()
      } else {
        console.log("No se pudieron cargar las imágenes seleccionadas.")
      }
    } else {
      const camposFaltantes = []
      if (!CursoName) camposFaltantes.push("Nombre del curso")
      if (!FechaInicio) camposFaltantes.push("Fecha de inicio")
      if (!FechaFin) camposFaltantes.push("Fecha de finalización")
      if (!Ponente) camposFaltantes.push("Ponente")
      if (!Temario) camposFaltantes.push("Temario")
      if (!HorasAcademicas) camposFaltantes.push("Horas académicas")
      if (!ParticipanteName) camposFaltantes.push("Nombre del participante")
      if (!CodigoParticipante) camposFaltantes.push("Código del participante")
      if (!selectedImageTypes.length)
        camposFaltantes.push("Tipo de certificado")

      alert(
        `Por favor completa los siguientes campos antes de generar el certificado: ${camposFaltantes.join(
          ", "
        )}.`
      )
    }
  }

  return (
    <div>
      <form method="dialog" onSubmit={handleSubmit}>
        <label
          className="input bg-[#1e293b] flex items-center mb-4 "
          htmlFor="CursoName"
        >
          <input
            placeholder="Nombre del curso"
            type="text"
            id="CursoName"
            className="w-full"
            value={CursoName}
            onChange={(e) => setCursoName(e.target.value)}
          />
        </label>

        <label
          className="input bg-[#1e293b] flex items-center mb-4"
          htmlFor="FechaInicio"
        >
          <input
            placeholder="Fecha de inicio"
            type="date"
            id="FechaInicio"
            className="w-full"
            value={FechaInicio}
            onChange={(e) => setFechaInicio(e.target.value)}
          />
        </label>

        <label
          className="input bg-[#1e293b] flex items-center mb-4"
          htmlFor="FechaFin"
        >
          <input
            placeholder="Fecha de finalización"
            type="date"
            id="FechaFin"
            className="w-full"
            value={FechaFin}
            onChange={(e) => setFechaFin(e.target.value)}
          />
        </label>

        <label
          className="input bg-[#1e293b] flex items-center mb-4"
          htmlFor="Ponente"
        >
          <input
            placeholder="Ponente"
            type="text"
            id="Ponente"
            className="w-full"
            value={Ponente}
            onChange={(e) => setPonente(e.target.value)}
          />
        </label>
        <label className="flex items-center mb-4 w-full" htmlFor="Temario">
          <textarea
            id="Temario"
            onChange={(e) => setTemario(e.target.value)}
            value={Temario}
            className="textarea bg-[#1e293b] textarea-sm w-full h-36"
          ></textarea>
        </label>
        <label
          className="input bg-[#1e293b] flex items-center mb-4"
          htmlFor="HorasAcademicas"
        >
          <input
            placeholder="Horas Academicas (Solo número)"
            type="text"
            id="HorasAcademicas"
            className="w-full"
            value={HorasAcademicas}
            onChange={(e) => setHorasAcademicas(e.target.value)}
          />
        </label>
        <label
          className="input bg-[#1e293b] flex items-center mb-4"
          htmlFor="ParticipanteName"
        >
          <input
            placeholder="Nombre del Participante"
            type="text"
            className="w-full"
            id="ParticipanteName"
            value={ParticipanteName}
            onChange={(e) => setParticipanteName(e.target.value)}
          />
        </label>
        <label
          className="input bg-[#1e293b] flex items-center mb-4"
          htmlFor="CodigoParticipante"
        >
          <input
            placeholder="Código del Participante"
            type="text"
            id="CodigoParticipante"
            className="w-full"
            value={CodigoParticipante}
            onChange={(e) => setCodigoParticipante(e.target.value)}
          />
        </label>
        <label
          className="input bg-[#1e293b] flex items-center mb-4"
          htmlFor="correoParticipante"
        >
          <input
            placeholder="Correo del Participante"
            type="email"
            id="correoParticipante"
            className="w-full border-0 focus:ring-0"
            value={correoParticipante}
            onChange={(e) => setCorreoParticipante(e.target.value)}
          />
        </label>

        <div className="form-control mb-4 ">
          <label className="cursor-pointer label hover:bg-[#1e293b] rounded-lg px-2">
            <span className="label-text">Digital</span>
            <input
              type="checkbox"
              value="tipo1"
              checked={selectedImageTypes.includes("tipo1")}
              onChange={handleCheckboxChange}
              className="checkbox checkbox-info"
            />
          </label>
          <label className="cursor-pointer label hover:bg-[#1e293b] rounded-lg px-2">
            <span className="label-text">Físico</span>
            <input
              type="checkbox"
              value="tipo2"
              checked={selectedImageTypes.includes("tipo2")}
              onChange={handleCheckboxChange}
              className="checkbox checkbox-info"
            />
          </label>
          <label className="cursor-pointer label hover:bg-[#1e293b] rounded-lg px-2">
            <span className="label-text">Firma - Empresa</span>
            <input
              type="checkbox"
              value="tipo3"
              checked={selectedImageTypes.includes("tipo3")}
              onChange={handleCheckboxChange}
              className="checkbox checkbox-info"
            />
          </label>
        </div>
        <button
          className="btn btn-info w-full border-transparent"
          type="submit"
          disabled={submitButtonDisabled}
        >
          Generar Certificado
        </button>
      </form>
    </div>
  )
}

export default CertificateGenerator
