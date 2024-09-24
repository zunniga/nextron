import jsPDF from 'jspdf';
import fs from 'fs';
import path from 'path';

const convertImageToPDF = async (image: File, groupName: string, index: number) => {
    try {
        const pdf = new jsPDF({
            orientation: 'landscape'
        });
        const reader = new FileReader();
        reader.onload = async () => {
          const imgData = reader.result as string;
          pdf.addImage(imgData, 'JPEG', 0, 0, 297, 210);
          let routeExcel;
          const excelFilePath = sessionStorage.getItem('excelFilePath');
          console.log("excelFilPathhhhhhhhhhhhhhhhh", excelFilePath);
          if (excelFilePath !== null) {
              routeExcel = excelFilePath.replace(/\\/g, '/').replace(/\/[^/]*$/, "");
              console.log("rutaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa°", routeExcel);
          } else {
              console.log("La ruta del archivo Excel no está definida en el almacenamiento local.");
              return; // Salir de la función si no se encuentra la ruta del archivo Excel
          }
          console.log("Ruta del archivo Excel:", routeExcel);
          // Verificar si la ruta del archivo Excel está definida
          if (!excelFilePath) {
              console.error('La ruta del archivo Excel no está definida en el almacenamiento local');
              return;
          }
          // Crear directorio "MODULOS" en la ruta del archivo Excel
          const modulesDir = path.join(routeExcel, "MODULARES_FÍSICOS");
          if (!fs.existsSync(modulesDir)) {
              fs.mkdirSync(modulesDir, { recursive: true });
          }
          // Crear directorio del grupo dentro de MODULOS
          const groupDir = path.join(modulesDir, groupName);
          if (!fs.existsSync(groupDir)) {
              fs.mkdirSync(groupDir, { recursive: true });
          }
          // Guardar el archivo PDF en el directorio del grupo
          const pdfFileName = `${groupName}_${index}.pdf`;
          const pdfFilePath = path.join(groupDir, pdfFileName);
          const pdfData = pdf.output('arraybuffer');
          fs.writeFileSync(pdfFilePath, Buffer.from(pdfData));
          console.log(`Archivo PDF guardado exitosamente en: ${pdfFilePath}`);
        };
        reader.readAsDataURL(image);
    } catch (error) {
        console.error('Error al guardar el PDF localmente:', error);
        alert('Error al guardar el PDF localmente');
    }
  };

export default convertImageToPDF;