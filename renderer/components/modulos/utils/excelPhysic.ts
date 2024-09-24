
import { ExcelData, ExcelDataPhysic } from '../../../components/modulos/interface/interface';
import * as XLSX from 'xlsx';

const physictExcelData = async (file: File): Promise<ExcelDataPhysic> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = new Uint8Array((e?.target as FileReader).result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const sheetData: string[][] = XLSX.utils.sheet_to_json(sheet, { header: 1 });
        const filteredData = sheetData.filter((row) => row.length > 0 && row.some((cell) => typeof cell === 'string' && cell.trim() !== ''));

         // Filtrar y procesar la columna "fisico" y "nombres"
         const datos = filteredData.slice(10).map((row: string[], rowIndex: number) => {
          const fisico = row[15]; // Dato de la columna "fisico"
          const nombres = row[0]; // Dato de la columna "nombres"
          const codigo = row[8]; // Dato de la columna codigo
          const cellLabel = `P${rowIndex + 1}`; // Ejemplo de etiqueta de celda, ajustar según sea necesario
          if (fisico !== undefined && fisico.trim() !== '') {
              return { fisico, nombres, codigo, celda: cellLabel };
          }
          return null;
      }).filter(Boolean);
      console.log("DatosyNombrees: ", datos)

      // Imprimir los datos de "fisico" y "nombres" en la consola
      datos.forEach(({ fisico, nombres, codigo, celda }) => {
          console.log(`Físico: ${fisico}, Nombres: ${nombres}, Codigo: ${codigo}, Celda: ${celda}`);
      });

        const actividadAcademica = sheet['B1'] ? sheet['B1'].v : null;
        const fechaInicio = sheet['B2'] ? sheet['B2'].v : null;
        const fechaFinal = sheet['B3'] ? sheet['B3'].v : null;
        const temario = sheet['B4'] ? sheet['B4'].v : null;
        const ponente = sheet['B5'] ? sheet['B5'].v : null;
        const horas = sheet['B6'] ? sheet['B6'].v : null;
        resolve({ datos, actividadAcademica, fechaInicio, fechaFinal, temario, ponente, horas });
      };
      reader.onerror = (error) => {
        reject(error);
      };
      reader.readAsArrayBuffer(new Blob([file]));
    });
  };

  export default physictExcelData;