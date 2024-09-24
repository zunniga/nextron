
import { ExcelData } from '../../../components/modulos/interface/interface';
import * as XLSX from 'xlsx';

const extractExcelData = async (file: File): Promise<ExcelData> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = new Uint8Array((e?.target as FileReader).result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const sheetData: string[][] = XLSX.utils.sheet_to_json(sheet, { header: 1 });
        const filteredData = sheetData.filter((row) => row.length > 0 && row.some((cell) => typeof cell === 'string' && cell.trim() !== ''));
        const nombres = filteredData.slice(10).map((row: string[]) => row[0]);
        const email = filteredData.slice(10).map((row: string[]) => row[2]);
        const codigo = filteredData.slice(10).map((row: string[]) => row[8]);
        const participacion = filteredData.slice(9).map((row: string[]) => row[9]);
        const actividadAcademica = sheet['B1'] ? sheet['B1'].v : null;
        const fechaInicio = sheet['B2'] ? sheet['B2'].v : null;
        const fechaFinal = sheet['B3'] ? sheet['B3'].v : null;
        const temario = sheet['B4'] ? sheet['B4'].v : null;
        const ponente = sheet['B5'] ? sheet['B5'].v : null;
        const horas = sheet['B6'] ? sheet['B6'].v : null;
        //const materiales = sheet['B9'] ? sheet['B9'].v : null;
        resolve({nombres, email, codigo, participacion, actividadAcademica, fechaInicio, fechaFinal, temario, ponente, horas });
      };
      reader.onerror = (error) => {
        reject(error);
      };
      reader.readAsArrayBuffer(new Blob([file]));
    });
  };

  export default extractExcelData;