import React, { useState, useEffect } from "react";
import { NewDataRizo } from "./ImageRizoDB"; // Importa la clase ImageDatabase
import { LuBookUp } from "react-icons/lu";
import { LuBookDown } from "react-icons/lu";


const CertificateGenerator = () => {
  const [CursoName, setCursoName] = useState("");
  const [FechaInicio, setFechaInicio] = useState("");
  const [FechaFin, setFechaFin] = useState("");
  const [ParticipanteName, setParticipanteName] = useState("");
  const [Resolucion, setResolucion] = useState("");
  const [CodigoParticipante, setCodigoParticipante] = useState("");
  const [NotaParcial, setNotaParcial] = useState("");
  const [NotaFinal, setNotaFinal] = useState("");
  const [Promedio, setPromedio] = useState("");

  const [digitalImageDataURL, setDigitalImageDataURL] = useState(null);
  const [physicalImageDataURL, setPhysicalImageDataURL] = useState(null);
  const [submitButtonDisabled, setSubmitButtonDisabled] = useState(true);
  const [selectedImageType, setSelectedImageType] = useState("");

  const imageDB = new NewDataRizo();

  const [selectedModularContent, setSelectedModularContent] = useState("");

  const handleModularChange = (e) => {
    setSelectedModularContent(e.target.value);
  };

  const loadSelectedImages = async () => {
    try {
      const images = await imageDB.newImages.toArray();
      if (images.length > 0) {
        const digitalImage = images.find(
          (image) => image.name === "imgAnverso"
        );
        const physicalImage = images.find(
          (image) => image.name === "imgReverso"
        );

        if (digitalImage) {
          setDigitalImageDataURL(digitalImage.imageDataURL);
          console.log(
            "Imagen digital obtenida de la base de datos:",
            digitalImage
          );
        } else {
          console.log("No se encontró una imagen digital.");
        }

        if (physicalImage) {
          setPhysicalImageDataURL(physicalImage.imageDataURL);
          console.log(
            "Imagen física obtenida de la base de datos:",
            physicalImage
          );
        } else {
          console.log("No se encontró una imagen física.");
        }
      } else {
        console.log("No se encontraron imágenes en la base de datos.");
      }
    } catch (error) {
      console.error(
        "Error al cargar las imágenes desde la Base de Datos:",
        error
      );
    }
  };

  useEffect(() => {
    loadSelectedImages();
  }, [selectedImageType]);

  const checkFields = () => {
    if (
      CursoName &&
      selectedModularContent &&
      FechaInicio &&
      FechaFin &&
      ParticipanteName &&
      Resolucion &&
      CodigoParticipante &&
      NotaParcial &&
      NotaFinal &&
      Promedio &&
      selectedImageType
    ) {
      setSubmitButtonDisabled(false);
    } else {
      setSubmitButtonDisabled(true);
    }
  };

  useEffect(() => {
    checkFields();
  }, [
    CursoName,
    FechaInicio,
    FechaFin,
    selectedModularContent,
    ParticipanteName,
    Resolucion,
    CodigoParticipante,
    NotaParcial,
    NotaFinal,
    Promedio,
    digitalImageDataURL,
    physicalImageDataURL,
  ]);

  useEffect(() => {
    checkFields();
  }, [
    CursoName,
    selectedModularContent,
    FechaInicio,
    FechaFin,
    ParticipanteName,
    Resolucion,
    CodigoParticipante,
    NotaParcial,
    NotaFinal,
    Promedio,
    digitalImageDataURL,
    physicalImageDataURL,
  ]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      CursoName &&
      FechaInicio &&
      (digitalImageDataURL || physicalImageDataURL)
    ) {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      canvas.width = 4677;
      canvas.height = 3307;

      function formatearFechaInicio(fecha) {
        const meses = [
          "enero",
          "febrero",
          "marzo",
          "abril",
          "mayo",
          "junio",
          "julio",
          "agosto",
          "septiembre",
          "octubre",
          "noviembre",
          "diciembre",
        ];
        const partes = fecha.split("-");
        const mes = meses[parseInt(partes[1], 10) - 1];
        const dia = partes[2];
        return dia + " de " + mes;
      }

      function formatearFechaFin(fecha) {
        const meses = [
          "enero",
          "febrero",
          "marzo",
          "abril",
          "mayo",
          "junio",
          "julio",
          "agosto",
          "septiembre",
          "octubre",
          "noviembre",
          "diciembre",
        ];
        const partes = fecha.split("-");
        const mes = meses[parseInt(partes[1], 10) - 1];
        return `${partes[2]} de ${mes} del ${partes[0]}`;
      }

      const fechaInicioFormateada = formatearFechaInicio(FechaInicio);
      const fechaFinFormateada = formatearFechaFin(FechaFin);

      const generateCertificate = async (imageDataURL, type) => {
        return new Promise((resolve, reject) => {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");
          canvas.width = 4677;
          canvas.height = 3307;
          const img = new Image();
          img.src = imageDataURL;
          img.onload = async () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0);
            ctx.fillStyle = "#000000";
            ctx.font = "bold 65px Century Gothic";
            ctx.textBaseline = "top";
            if (type === "certificadoDigital") {
              // Función para ajustar dinámicamente el tamaño del texto según un ancho máximo
              function ajustarTextoYAnchoMaximo(ctx, texto, maxWidth, fontSizeInicial) {
                let fontSize = fontSizeInicial; // Tamaño inicial del texto
                let minFontSize = 1; // Tamaño mínimo del texto
                let maxFontSize = fontSizeInicial; // Tamaño máximo inicial del texto
                // Búsqueda binaria para encontrar el tamaño de fuente óptimo
                while (minFontSize <= maxFontSize) {
                  let midFontSize = Math.floor((minFontSize + maxFontSize) / 2);
                  ctx.font = "bold " + midFontSize + "px Century Gothic"; // Configurar tamaño de fuente medio
                  let textWidth = ctx.measureText(texto).width;

                  if (textWidth > maxWidth) {
                      maxFontSize = midFontSize - 1; // Reducir tamaño de fuente si excede el ancho máximo
                  } else {
                      minFontSize = midFontSize + 1; // Incrementar tamaño de fuente si no excede el ancho máximo
                      fontSize = midFontSize; // Actualizar tamaño de fuente óptimo
                  }
                }
                // Configurar el contexto con el tamaño final de la fuente
                ctx.font = "bold " + fontSize + "px Century Gothic";
                return fontSize; // Devolver el tamaño final de la fuente
              }
              // Uso de la función para dibujar el nombre del participante con ancho máximo
              const maxWidth = 2600; // Ancho máximo deseado en píxeles
              const fontSizeInicial = 140; // Tamaño inicial del texto en píxeles
              const x = 2890; // Posición x donde dibujar el texto
              const yy = 1420; // Posición y donde dibujar el texto
              // Configurar contexto para el texto
              ctx.fillStyle = "#000000"; // Color del texto
              ctx.textBaseline = "top";
              ctx.textAlign = "center";
              // Ajustar dinámicamente el tamaño del texto según el ancho máximo
              const fontSizeFinal = ajustarTextoYAnchoMaximo(ctx, ParticipanteName, maxWidth, fontSizeInicial);
              // Dibujar el texto ajustado
              ctx.fillText(ParticipanteName, x, yy);
              // Obtener la fecha final del participante
              const words = fechaFinFormateada.split(" ");
              const mesTexto = words[2].toLowerCase(); // Tomar la tercera palabra y convertirla a minúsculas
              // Array con los nombres de los meses en español
              const meses = [
                "enero", "febrero", "marzo", "abril", "mayo", "junio",
                "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"
              ];
              // Encontrar el índice del mes
              const indice = meses.indexOf(mesTexto);
              // Obtener el mes siguiente y actualizar el año si es enero
              let mesActual;
              let yearActual;
              if (indice !== -1) {
                if (indice < meses.length - 1) {
                  mesActual = meses[indice + 1];
                  yearActual = new Date().getFullYear();
                } else {
                  mesActual = "enero";
                  yearActual = new Date().getFullYear() + 1;
                }
              } else {
                mesActual = "mes no encontrado";
                yearActual = new Date().getFullYear();
              }
              const texto = `Lima, ${mesActual} del ${yearActual}`;
              ctx.textAlign = "center";
              ctx.font = "65px Century Gothic";
              ctx.fillText(texto, 3650, 2480);
              ctx.textAlign = "center";
              ctx.fillStyle = "black";
              ctx.font = "bold 55px Century Gothic";
              ctx.fillText(CodigoParticipante, 700, 2875);
              const textoCompleto =
                `Por haber culminado y aprobado satisfactoriamente el DIPLOMADO DE ESPECIALIZACIÓN ${CursoName} en su calidad de asistente, aprobado mediante la ${Resolucion}, llevado a cabo del ${fechaInicioFormateada} al ${fechaFinFormateada} con una duración de 420 horas académicas, equivalente a 26 créditos, de conformidad con la ley Universitaria vigente.`;
              const anchoMaximo = 2500;
              function dividirTextoEnLineas(texto, anchoMaximo) {
                const palabras = texto.split(" ");
                const lineas = [];
                let lineaActual = palabras[0];
                for (let i = 1; i < palabras.length; i++) {
                  const palabra = palabras[i];
                  const medida = ctx.measureText(lineaActual + " " + palabra);
                  if (medida.width < anchoMaximo) {
                    lineaActual += " " + palabra;
                  } else {
                    lineas.push(lineaActual);
                    lineaActual = palabra;
                  }
                }
                lineas.push(lineaActual);
                return lineas;
              }
              const lineas = dividirTextoEnLineas(textoCompleto, anchoMaximo);
              let y = 1680;
              for (let i = 0; i < lineas.length; i++) {
                const linea = lineas[i];
                const partes = linea.split(
                  new RegExp(
                    `(${CursoName}|420 horas académicas|26 créditos)`,
                    "g"
                  )
                );
                let anchoTotal = partes.reduce((total, parte) => {
                  const font =
                    parte === CursoName ||
                    parte === "420 horas académicas" ||
                    parte === "26 créditos"
                      ? "bold 65px Century Gothic"
                      : "65px Century Gothic";
                  ctx.font = font;
                  return total + ctx.measureText(parte).width;
                }, 0);
                let x = 2870 - anchoTotal / 2;
                ctx.textAlign = "left";
                ctx.fillStyle = "black";
                partes.forEach((parte) => {
                  const font =
                    parte === CursoName ||
                    parte === "420 horas académicas" ||
                    parte === "26 créditos"
                      ? "bold 65px Century Gothic"
                      : "65px Century Gothic";
                  ctx.font = font;
                  // Convertir texto dentro de comillas o paréntesis a minúsculas
  let textToDraw = parte;

  // Si es el CursoName, convertir a mayúsculas todo menos el texto dentro de comillas o paréntesis
  if (parte === participant.CursoName) {
    textToDraw = parte.replace(/["'()](.*?)["'()]/g, (match, p1) => `"${p1.toLowerCase()}"`)
                     .replace(/\((.*?)\)/g, (match, p1) => `(${p1.toLowerCase()})`);
  }
                  ctx.fillText(textToDraw, x, y);
                  x += ctx.measureText(textToDraw).width;
                });
                y += 55 + 55;
              }
            } else if (type === "certificadoFisico") {
              // Mantener el estilo del certificado físico
              ctx.textAlign = "center";
              ctx.font = "bold 56px Century Gothic";
              const cursoNameConComillas = `"${CursoName.toUpperCase()}"`;
              ctx.fillText(cursoNameConComillas, 3050, 1350);
              ctx.textAlign = "center";
              ctx.font = "bold 48px Century Gothic";
              ctx.fillText(NotaParcial, 4220, 1720);
              ctx.textAlign = "center";
              ctx.font = "bold 48px Century Gothic";
              ctx.fillText(NotaFinal, 4220, 2040);
              const textoCompleto = selectedModularContent;
              var anchoMaximoTexto = 1880;
              var tamanoFuenteInicial = 46;
              const margenHorizontal = 320;
              const margenIzquierdo = 1750;
              var margenSeparacion = 0;
              function convertirARomanos(num) {
                if (num < 1 || num > 15) return "";
                const romanos = [
                  "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X",
                  "XI", "XII", "XIII", "XIV", "XV"
                ];
                return romanos[num - 1];
              }
              function dividirTextoEnModulos(texto) {
                return texto.split("• ").filter(Boolean);
              }
              const modulos = dividirTextoEnModulos(textoCompleto);
              const cantidadModulos = Math.min(modulos.length, 15);
              const yInicial = 1600;
              const alturaCanvas = 2600;
              const alturaDisponible = alturaCanvas - yInicial;
              const alturaModulo = alturaDisponible / cantidadModulos;
              // Verificar el tamaño máximo inicial para títuloModulo y textoModulo
              var tamanoFuenteTitulo = tamanoFuenteInicial;
              var tamanoFuenteTexto = tamanoFuenteInicial;
              var espaciadoLineas = 10;
                    // Dibujar cada módulo en el canvas con el tamaño de fuente ajustado
                for (var i = 0; i < cantidadModulos; i++) {
                  var tituloModulo = `Módulo ${convertirARomanos(i + 1)}`; // Convertir el número a romano
                  var textoModulo = modulos[i].trim();
                  // Calcular las posiciones horizontales para el título y el texto del módulo
                  var xTitulo = margenIzquierdo;
                  var xTexto = margenIzquierdo + margenHorizontal;
                  // Posiciones verticales
                  var yBase = yInicial + (i * alturaModulo); // Base del módulo
                  var yTitulo = yBase + (alturaModulo / 4); // Título a 1/4 del módulo desde la base
                  var yTexto = yBase + (alturaModulo / 4) + margenSeparacion; // Texto a 1/2 del módulo desde la base
                  // Establecer la fuente y el color del texto del título y del texto del módulo
                  ctx.textAlign = "left";
                  ctx.fillStyle = "black";
                  // Ajustar tamaño de fuente para títuloModulo y textoModulo
                  ctx.font = `${tamanoFuenteTitulo}px Century Gothic`;
                  ctx.fillText(tituloModulo, xTitulo, yTitulo);
                  // Verificar y dividir textoModulo si excede el ancho máximo
                  var palabras = textoModulo.split(' ');
                  var linea = '';
                  for (var palabra of palabras) {
                    var medidaPalabra = ctx.measureText(linea + palabra + ' ').width;
                    if (medidaPalabra > anchoMaximoTexto) {
                      ctx.font = `${tamanoFuenteTexto}px Century Gothic`;
                      ctx.fillText(linea.trim(), xTexto, yTexto);
                      linea = palabra + ' ';
                      yTexto += tamanoFuenteTexto - espaciadoLineas; // Espaciado entre líneas
                    } else {
                      linea += palabra + ' ';
                    }
                  }
                  // Finalmente, escribir la última línea
                  ctx.font = `${tamanoFuenteTexto}px Century Gothic`;
                  ctx.fillText(linea.trim(), xTexto, yTexto);
                }
              ctx.textAlign = "center";
              ctx.font = "bold 48px Century Gothic";
              ctx.fillText(Promedio, 4170, 2980);
              ctx.textAlign = "center";
              ctx.fillStyle = "black ";
              ctx.font = " 56px Century Gothic";
              ctx.fillText(CodigoParticipante, 1185, 2790);
            }
            const certificateDataURL = canvas.toDataURL("image/jpeg");
            resolve({ certificateDataURL, type, ownerName: ParticipanteName });
          };
          img.onerror = (error) => {
            reject(error);
          };
        });
      };

      const certificatesToSave = [];

      if (selectedImageType === "tipo4") {
        if (digitalImageDataURL) {
          certificatesToSave.push(
            generateCertificate(digitalImageDataURL, "certificadoDigital")
          );
        }
        if (physicalImageDataURL) {
          certificatesToSave.push(
            generateCertificate(physicalImageDataURL, "certificadoFisico")
          );
        }
      } else {
        alert("No se ha seleccionado ningún tipo de certificado.");
        return;
      }

      Promise.all(certificatesToSave)
        .then((certificates) =>
          Promise.all(
            certificates.map((cert) => imageDB.newCertificates.add(cert))
          )
        )
        .then(() => {
          alert("¡Certificado generado exitosamente!");
          window.location.href = "/graduates_main/graduate_rizo/graduate/route/page";
        })
        .catch((error) => {
          console.error(
            "Error al guardar el certificado en la base de datos:",
            error
          );
        });
    } else {
      alert(
        "Por favor completa todos los campos antes de generar el certificado."
      );
    }
  };

  return (
    <div>
      <form method="dialog" onSubmit={handleSubmit}>
      <div className="text-center text-xl bg-[#001d51] font-futura-bkbt border border-zinc-950 rounded-md mb-4 p-2 flex items-center justify-center">
      ANVERSO DEL DIPLOMADO
      <LuBookUp className="ml-2" size={25} />
    </div>
        <label
          className="input bg-slate-200  input-bordered flex items-center mb-4"
          htmlFor="CursoName"
        >
          <input
            required
            className="text-[#001d51] w-full"
            placeholder="Nombre del Diplomado"
            type="text"
            id="CursoName"
            value={CursoName}
            onChange={(e) => setCursoName(e.target.value)}
          />
        </label>
        <label
          className="input bg-slate-200 input-bordered flex items-center mb-4"
          htmlFor="ParticipanteName"
        >
          <input
          className="text-[#001d51] w-full"
            required
            placeholder="Nombre del participante"
            type="text"
            id="ParticipanteName"
            value={ParticipanteName}
            onChange={(e) => setParticipanteName(e.target.value)}
          />
        </label>
        <label
          className="input bg-slate-200 input-bordered flex items-center mb-4"
          htmlFor="CodigoParticipante"
        >
          <input
            className="text-[#001d51] w-full"
            required
            placeholder="Código del participante"
            type="text"
            id="CodigoParticipante"
            value={CodigoParticipante}
            onChange={(e) => setCodigoParticipante(e.target.value)}
          />
        </label>
        <label
          className="input bg-slate-200 input-bordered flex items-center mb-4"
          htmlFor="Resolucion"
        >
          <input 
          className="text-[#001d51] w-full"
            required
            placeholder="Resolucion"
            type="text"
            id="Resolucion"
            value={Resolucion}
            onChange={(e) => setResolucion(e.target.value)}
          />
        </label>
        <label
          className="input bg-[#649bdd] input-bordered flex items-center mb-4"
          htmlFor="FechaInicio"
        >
        <h1 className="mr-40 text-slate-100" > Fecha de Inicio:  </h1>
          <input
          className="text-slate-100"
            required
            placeholder="Fecha de inicio"
            type="date"
            id="FechaInicio"
            value={FechaInicio}
            onChange={(e) => setFechaInicio(e.target.value)}
          />
          
          
        </label>
        <label
          className="input bg-[#649bdd] input-bordered flex items-center mb-4"
          htmlFor="FechaFin"
        >
           <h1 className="mr-28 text-slate-100"  > Fecha de Finalización:  </h1>
          <input
          className="text-slate-100"
            required
            placeholder="Fecha de fin"
            type="date"
            id="FechaFin"
            value={FechaFin}
            onChange={(e) => setFechaFin(e.target.value)}
          />
        </label>

        <div className="text-center text-xl bg-[#001d51] font-futura-bkbt border border-zinc-950 rounded-md mb-4 p-2 flex items-center justify-center">
      REVERSO DEL DIPLOMADO
      <LuBookDown className="ml-2" size={25} />
    </div>
        <label
          className="input bg-slate-200 input-bordered flex items-center mb-4"
          htmlFor="CursoName"
        >
          <input
            className="text-[#001d51] w-full"
            placeholder="Nombre del curso"
            type="text"
            id="CursoName"
            value={CursoName}
            onChange={(e) => setCursoName(e.target.value)}
          />
        </label>
        <label
          className="input bg-slate-200 input-bordered flex items-center mb-4"
          htmlFor="CodigoParticipante"
        >
          <input
          className="text-[#001d51] w-full"
            placeholder="Código del participante"
            type="text"
            id="CodigoParticipante"
            value={CodigoParticipante}
            onChange={(e) => setCodigoParticipante(e.target.value)}
          />
        </label>

        <label className="flex  items-center mb-4 w-full">
          <textarea
            required
            id="modularType"
            value={selectedModularContent}
            onChange={handleModularChange}
            className="textarea text-[#001d51] bg-slate-200 textarea-bordered textarea-sm w-full h-36"
            placeholder="Ingresa los Módulos correspondientes al diplomado"
          ></textarea>
        </label>

        <label
          className="input bg-slate-200  input-bordered flex items-center mb-4"
          htmlFor="NotaParcial"
        >
          <input 
          className="text-[#001d51] w-full"
            required
            placeholder="Nota Parcial"
            type="text"
            id="NotaParcial"
            value={NotaParcial}
            onChange={(e) => setNotaParcial(e.target.value)}
          />
        </label>

        <label
          className="input bg-slate-200  input-bordered flex items-center mb-4"
          htmlFor="NotaFinal"
        >
          <input 
            className="text-[#001d51] w-full"
            required
            placeholder="Nota Final"
            type="text"
            id="NotaFinal"
            value={NotaFinal}
            onChange={(e) => setNotaFinal(e.target.value)}
          />
        </label>

        <label
          className="input bg-slate-200  input-bordered flex items-center mb-4"
          htmlFor="Promedio"
        >
          <input 
            className="text-[#001d51] w-full"
            required
            placeholder="Promedio"
            type="text"
            id="Promedio"
            value={Promedio}
            onChange={(e) => setPromedio(e.target.value)}
          />
        </label>

        <select
          required
          className="select bg-[#649bdd] text-slate-100 select-bordered w-full mb-5"
          id="imageType"
          value={selectedImageType}
          onChange={(e) => setSelectedImageType(e.target.value)}
        >
          <option defaultValue>Seleccionar tipo de certificado</option>
          <option value="tipo4">Diplomado Físico</option>
        </select>

        <button
          className="btn bg-[#001d51] w-full hover:scale-110 duration-300"
          type="submit"
          disabled={setSubmitButtonDisabled}
        >
          <p className="text-gray-200 text-xl font-bold">Generar Diplomado</p>
        </button>
      </form>
    </div>
  );
};

// ParticipanteName.js


export default CertificateGenerator;
