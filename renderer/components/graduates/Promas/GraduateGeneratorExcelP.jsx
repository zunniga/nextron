import React, { useState, useEffect } from "react";
import { NewDataPromas } from "../../../components/graduates/Promas/ImagePromasDB";
import { participantDB } from "../../../components/graduates/Promas/ReadExcelParticipants";
import { TbCertificate } from "react-icons/tb";
import { MdDelete } from "react-icons/md";
import { PropagateLoader } from 'react-spinners';

const imageDB = new NewDataPromas();

const CertificateGeneratorExcel = ({
  onCertificateGenerated,
  onDeleteData,
}) => {
  const [generatingCertificates, setGeneratingCertificates] = useState(false);
  const [participantsExist, setParticipantsExist] = useState(false); // Estado para rastrear si existen participantes en la tabla
  const [dataExists, setDataExists] = useState(false);

  const handleDelete = async () => {
    try {
      await Promise.all([
        imageDB.newCertificates.clear(),
        participantDB.participants.clear(),
      ]);
      alert("Datos limpiados correctamente.");
      const participants = await participantDB.participants.toArray();
      setParticipantsExist(participants.length > 0);
      onDeleteData();
    } catch (error) {
      console.error("Error al limpiar las tablas:", error);
    }
  };

  useEffect(() => {
    const checkDataExists = async () => {
      try {
        const certificates = await imageDB.newCertificates.toArray();
        const participants = await participantDB.participants.toArray();
        setDataExists(certificates.length > 0 || participants.length > 0);
      } catch (error) {
        console.error("Error al verificar la existencia de datos:", error);
      }
    };
    checkDataExists();
  }, []);

  useEffect(() => {
    // Verificar si hay participantes en la tabla al montar el componente
    const checkParticipantsExistence = async () => {
      const participants = await participantDB.participants.toArray();
      setParticipantsExist(participants.length > 0);
    };
    checkParticipantsExistence();
  }, []);

  const generateCertificates = async () => {
    try {
      setGeneratingCertificates(true);
      console.log("Limpiando la base de datos de certificados...");
      await imageDB.newCertificates.clear();
      const participants = await participantDB.participants.toArray();
      if (participants.length === 0) {
        console.warn("No hay participantes en la base de datos.");
        return;
      }
      console.log("Lista de participantes:");
      participants.forEach((participant) => {
        console.log(participant);
      });
      // Cargar todas las imágenes desde imageDB
      const images = await imageDB.newImages.toArray();
      const imageData = {};
      images.forEach((image) => {
        imageData[image.name] = image.imageDataURL;
      });
      // Obtener el array selectedCertificates del localStorage
      const selectedCertificates = JSON.parse(
        sessionStorage.getItem("selectedCertificates")
      );
      console.log("Tipos de certificados seleccionados:", selectedCertificates);
      for (const participant of participants) {
        try {
          if (participant.estadoPago === "Aprobado") {
            console.log("Datos de las imágenes:", imageData); // Agrega este console.log para imprimir datos de las imágenes
            if (selectedCertificates.includes("certificadoDigital")) {
              const certificateDataURLDigital = await generateCertificate(
                participant,
                imageData.imgAnverso
              );
              await imageDB.newCertificates.add({
                certificateDataURL: certificateDataURLDigital,
                type: "certificadoDigital",
                ownerName: participant.nombreParticipante,
              }); // Agrega ownerName al certificado
              console.log(
                `Certificado digital generado para ${participant.nombreParticipante}`
              );
            }
            if (selectedCertificates.includes("certificadoFisico")) {
              const certificateDataURLPhisyc = await generateCertificateReverso(
                participant,
                imageData.imgReverso
              );
              await imageDB.newCertificates.add({
                certificateDataURL: certificateDataURLPhisyc,
                type: "certificadoFisico",
                ownerName: participant.nombreParticipante,
              }); // Agrega ownerName al certificado
              console.log(
                `Certificado físico generado para ${participant.nombreParticipante}`
              );
            }
          } else {
            console.log(
              `El participante ${participant.nombreParticipante} no tiene el estado de pago aprobado. No se generará ningún certificado.`
            );
          }
        } catch (error) {
          console.error(
            `Error al generar el certificado para ${participant.nombreParticipante}:`,
            error
          );
        }
      }
      alert(
            "Diplomados Gernerados exitosamente"
      );
      // Llamar a la función onCertificateGenerated al completar la generación de certificados
      onCertificateGenerated();
    } catch (error) {
      console.error("Error al generar los certificados:", error);
      console.error(
        "Error al generar los certificados. Por favor, inténtalo de nuevo."
      );
    } finally {
      setGeneratingCertificates(false);
    }
  };

// IMAGEN DE ANVERSO
const generateCertificate = async (participant, imageDataURL) => {
  // Verificar si todos los campos necesarios están disponibles
  if (imageDataURL) {
    // Crear un lienzo y configurar contexto
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    canvas.width = 4677;
    canvas.height = 3307;
    // Cargar la imagen en el lienzo
    const img = new Image();
    img.src = imageDataURL;
    await new Promise((resolve, reject) => {
      img.onload = resolve;
      img.onerror = reject;
    });
    ctx.drawImage(img, 0, 0);
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
    const fontSizeFinal = ajustarTextoYAnchoMaximo(ctx, participant.nombreParticipante, maxWidth, fontSizeInicial);
    // Dibujar el texto ajustado
    ctx.fillText(participant.nombreParticipante, x, yy);
    // Obtener el mes del texto proporcionado (asumiendo que `FechaFin` contiene el texto con la fecha)
    const words = participant.FechaFin.split(" ");
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
      // Si encontramos el mes en el array
      if (indice < meses.length - 1) {
        mesActual = meses[indice + 1];
        yearActual = new Date().getFullYear();
      } else {
        // Si es diciembre, el siguiente mes es enero del siguiente año
        mesActual = "enero";
        yearActual = new Date().getFullYear() + 1;
      }
    } else {
      // Si no se encontró el mes en el texto por alguna razón, manejar el caso según tu lógica
      mesActual = "mes no encontrado"; // O alguna lógica de manejo de error
      yearActual = new Date().getFullYear();
    }
    // Texto a dibujar con el mes actualizado
    const texto = `Lima, ${mesActual} del ${yearActual}`;
    // Dibujar el texto en el lienzo
    ctx.textAlign = "center";
    ctx.font = "65px Century Gothic";
    ctx.fillText(texto, 3650, 2480);
    // Dibujar código del participante
    ctx.textAlign = "center";
    ctx.fillStyle = "black";
    ctx.font = "bold 55px Century Gothic";
    ctx.fillText(participant.codigoParticipante, 700, 2875);
    const textoCompleto =
      `Por haber culminado y aprobado satisfactoriamente el DIPLOMADO DE ESPECIALIZACIÓN ${participant.CursoName} en su calidad de asistente, aprobado mediante la ${participant.Resolucion}, llevado a cabo del ${participant.FechaInicio} al ${participant.FechaFin} con una duración de 420 horas académicas, equivalente a 26 créditos, de conformidad con la ley Universitaria vigente.`;
    const anchoMaximo = 2500;
    // Función para dividir el texto en líneas según el ancho máximo
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
    // Obtener las líneas divididas
    const lineas = dividirTextoEnLineas(textoCompleto, anchoMaximo);
    let y = 1680; // Posición vertical inicial
    // Dibujar cada línea en el canvas
    for (let i = 0; i < lineas.length; i++) {
      const linea = lineas[i];
      const partes = linea.split(
        new RegExp(
          `(${participant.CursoName}|420 horas académicas|26 créditos)`,
          "g"
        )
      );
      // Calcular el ancho total de la línea para centrarla
      let anchoTotal = partes.reduce((total, parte) => {
        const font =
          parte === participant.CursoName ||
          parte === "420 horas académicas" ||
          parte === "26 créditos"
            ? "bold 65px Century Gothic"
            : "65px Century Gothic";
        ctx.font = font;
        return total + ctx.measureText(parte).width;
      }, 0);
      let x = 2870 - anchoTotal / 2; // Centrar horizontalmente
      ctx.textAlign = "left"; // Alinear el texto a la izquierda para el dibujo manual
      ctx.fillStyle = "black";
      // Dibujar cada parte de la línea
      partes.forEach((parte) => {
        const font =
          parte === participant.CursoName ||
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
        x += ctx.measureText(textToDraw).width; // Incrementar la posición x para la siguiente parte
      });
      // Incrementar la posición y para la siguiente línea
      y += 55 + 55; // Espacio vertical entre líneas (tamaño de fuente + 50)
    }
    // Generar el certificado como una imagen
    const certificateDataURL = canvas.toDataURL("image/jpeg");
    return certificateDataURL; // Devolver la URL de la imagen del certificado
  } else {
    // Si falta algún campo, lanzar un error
    throw new Error("Faltan campos necesarios para generar el diplomado.");
  }
};

  // IMAGEN DE REVERSO
  const generateCertificateReverso = async (participant, imageDataURL) => {
    if (imageDataURL) {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      canvas.width = 4677;
      canvas.height = 3307;
      const img = new Image();
      img.src = imageDataURL;
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
      });
      ctx.drawImage(img, 0, 0);
      ctx.fillStyle = "#000000";
      ctx.textBaseline = "top";
      ctx.textAlign = "center";
      ctx.font = "bold 56px Century Gothic";
      ctx.fillText(participant.CursoName.toUpperCase(), 3050, 1360);
      ctx.textAlign = "center";
      ctx.font = "bold 48px Century Gothic";
      ctx.fillText(participant.NotaParcial, 4220, 1723);
      ctx.textAlign = "center";
      ctx.font = "bold 48px Century Gothic";
      ctx.fillText(participant.NotaFinal, 4220, 2043);
      ctx.textAlign = "center";
      ctx.font = "bold 48px Century Gothic";
      ctx.fillText(participant.Promedio, 4170, 2980);
      ctx.textAlign = "center";
      ctx.fillStyle = "black";
      ctx.font = " 56px Century Gothic";
      ctx.fillText(participant.codigoParticipante, 1185, 2790);
      // Definir el texto completo y el ancho máximo para textoModulo
      var textoCompleto = participant.Modulos;
      var anchoMaximoTexto = 1880; // Ancho máximo para textoModulo en píxeles
      var tamanoFuenteInicial = 46; // Tamaño de la fuente inicial para tituloModulo y textoModulo en píxeles
      var margenHorizontal = 320; // Margen horizontal entre el título del módulo y el texto del módulo
      var margenIzquierdo = 1750; // Margen izquierdo para el texto
      var margenSeparacion = 0; // Margen vertical entre el título y el texto
      // Función para convertir un número a números romanos (hasta 15)
      function convertirARomanos(num) {
        if (num < 1 || num > 15) return ""; // Asegurar que el número esté en el rango 1-15
        var romanos = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII", "XIII", "XIV", "XV"];
        return romanos[num - 1];
      }
      // Función para dividir el texto en módulos según el carácter de viñeta
      function dividirTextoEnModulos(texto) {
        return texto.split("• ").filter(Boolean); // Divide el texto donde encuentra "• " y filtra entradas vacías
      }
      var modulos = dividirTextoEnModulos(textoCompleto);
      var cantidadModulos = Math.min(modulos.length, 15); // Obtener la cantidad de módulos (limitado a 15)
      var yInicial = 1600; // Posición inicial en Y
      var alturaCanvas = 2600; // Altura total del canvas (ejemplo)
      var alturaDisponible = alturaCanvas - yInicial;
      var alturaModulo = alturaDisponible / cantidadModulos; // Altura equitativa para cada módulo
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
      // Generar el certificado como una imagen
      const certificateDataURL = canvas.toDataURL("image/jpeg");
      return certificateDataURL; // Devolver la URL de la imagen del certificado
    } else {
      // Si falta algún campo, lanzar un error
      throw new Error("Faltan campos necesarios para generar el diplomado.");
    }
  };

  return (
    <>
      <button
        className="w-full btn text-xl font-futura-bkbt  items-center  bg-gradient-to-b from-[#04d74b] to-[#056622] text-white  hover:bg-gray-200  mb-5 rounded-lg"
        onClick={generateCertificates}
      >
        {generatingCertificates ? (
            <PropagateLoader color={'#ffffff'} size={10} />
        ) : (
          'Generar Diplomados'
        )}
        <TbCertificate size={25}/>
      </button>
      <button
        className="w-full btn text-lg font-futura-bkbt bg-gradient-to-b from-[#c70606] to-[#660505] text-white hover:bg-red-400 mb-5"
        onClick={handleDelete}
      >
        Limpiar todos los Datos
        <MdDelete className="" size={20} />
      </button>
    </>
  );
};

export default CertificateGeneratorExcel;
