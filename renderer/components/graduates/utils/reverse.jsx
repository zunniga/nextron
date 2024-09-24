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
      ctx.textAlign = "justify";
      ctx.drawImage(img, 0, 0);

      ctx.fillStyle = "#000000";
      ctx.textBaseline = "top";

      ctx.textAlign = "center";
      ctx.font = "bold 80px Century Gothic ";
      ctx.fillText(participant.CursoName, 3050, 1350);

      ctx.textAlign = "center";
      ctx.font = "bold 80px Century Gothic ";
      ctx.fillText(participant.NotaParcial, 4220, 1708);

      ctx.textAlign = "center";
      ctx.font = "bold 80px Century Gothic ";
      ctx.fillText(participant.NotaFinal, 4220, 2028);

      ctx.textAlign = "center";
      ctx.font = "bold 80px Century Gothic ";
      ctx.fillText(participant.Promedio, 4170, 2965);

      ctx.textAlign = "center";
      ctx.fillStyle = "black ";
      ctx.font = " 100px Century Gothic ";
      ctx.fillText(participant.codigoParticipante, 1185, 2770);

      // Definición del texto completo y el ancho máximo
var textoCompleto = participant.Modulos;
var anchoMaximo = 2700;
var tamanoFuente = 39; // Tamaño de la fuente en píxeles
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
var alturaCanvas = 2580; // Altura total del canvas (ejemplo)
var alturaDisponible = alturaCanvas - yInicial;
var alturaModulo = alturaDisponible / cantidadModulos; // Altura equitativa para cada módulo

// Dibujar cada módulo en el canvas
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
 
  // Establecer la fuente y el color del texto del título del módulo
  ctx.textAlign = "left";
  ctx.font = `${tamanoFuente}px Century Gothic`;
  ctx.fillStyle = "black";

  // Renderizar el título del módulo
  ctx.fillText(tituloModulo, xTitulo, yTitulo);

  // Renderizar el texto del módulo
  ctx.fillText(textoModulo, xTexto, yTexto);
}
      // Generar el certificado como una imagen
      const certificateDataURL = canvas.toDataURL("image/jpeg");

      return certificateDataURL; // Devolver la URL de la imagen del certificado
    } else {
      // Si falta algún campo, lanzar un error
      throw new Error("Faltan campos necesarios para generar el diplomado.");
    }
  };
  export default generateCertificateReverso;