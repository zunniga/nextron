'use client';
import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import { Dexie } from 'dexie';
import { useRouter } from 'next/router';

class ParticipantDatabaseCursos extends Dexie {
  participants;
  constructor() {
    super("ParticipantDatabaseCursos");
    this.version(4).stores({
      participants: "++id, nombreParticipante, codigoParticipante, correoParticipante, CursoName, FechaInicio, FechaFin, Ponente, Temario, HorasAcademicas, estadoPago, enlacesMateriales",
    });
    this.participants = this.table("participants");
  }
}

const participantDB = new ParticipantDatabaseCursos();

const ReadExcelParticipants = () => {
  const router = useRouter();
  const [excelFile, setExcelFile] = useState(null);

  const handleFileChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const selectedFilePathCursos = file.path; // Obtener la ruta del archivo seleccionado
      setExcelFile(file);
      console.log('Ruta select', selectedFilePathCursos);
      // Guardar la ruta del archivo seleccionado en el almacenamiento local
      sessionStorage.setItem('selectedFilePathCursos', selectedFilePathCursos);
    }
  };

  const generateCertificates = async () => {
    if (!excelFile) {
      console.error("Debes seleccionar un archivo de Excel.");
      return;
    }

    try {
      const bufferArray = await readFileAsArrayBuffer(excelFile);
      const wb = XLSX.read(bufferArray, { type: 'buffer' });
      const ws = wb.Sheets[wb.SheetNames[0]];

      const CursoName = ws['B1'] ? ws['B1'].v : '';
      const FechaInicio = ws['B2'] ? ws['B2'].v : '';
      const FechaFin = ws['B3'] ? ws['B3'].v : '';
      const Ponente = ws['B5'] ? ws['B5'].v : '';
      const Temario = ws['B4'] ? ws['B4'].v : '';
      const HorasAcademicas = ws['B6'] ? ws['B6'].v : '';
      const enlacesMateriales = ws['B9'] ? ws['B9'].v : '';

      const participantes = [];
      let rowIndex = 12;
      while (ws['A' + rowIndex]) {
        const participantName = ws['A' + rowIndex].v;
        const codigoParticipante = ws['I' + rowIndex].v;
        const correoParticipante = ws['C' + rowIndex] ? ws['C' + rowIndex].v : ''; // Nuevo campo de correo electrónico
        const estadoPago = ws['L' + rowIndex] ? ws['L' + rowIndex].w : '';

        const participanteData = {
          nombreParticipante: participantName,
          codigoParticipante: codigoParticipante,
          correoParticipante: correoParticipante, // Nuevo campo de correo electrónico
          CursoName: CursoName,
          FechaInicio: FechaInicio,
          FechaFin: FechaFin,
          Ponente: Ponente,
          Temario: Temario,
          HorasAcademicas: HorasAcademicas,
          estadoPago: estadoPago,
          enlacesMateriales: enlacesMateriales,
        };
        participantes.push(participanteData);
        rowIndex++;
      }
      await participantDB.participants.clear();
      await participantDB.participants.bulkAdd(participantes);
      alert("Datos del Excel guardados correctamente.");
      router.push('/certificados_cursos/DummyPage/page');
    } catch (error) {
      alert("Error al leer el archivo Excel:", error);
    }
  };

  const readFileAsArrayBuffer = (file) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.onload = () => {
        if (fileReader.result instanceof ArrayBuffer) {
          resolve(fileReader.result);
        } else {
          reject(new Error("Error al leer el archivo."));
        }
      };
      fileReader.onerror = () => {
        reject(new Error("Error al leer el archivo."));
      };
      fileReader.readAsArrayBuffer(file);
    });
  };

  return (
    <div>
      <form method="dialog">
        <label className="form-control w-full mb-4">Subir archivo de Excel:
          <input
            className="file-input border-transparent input-success w-full"
            type="file"
            accept=".xlsx, .xls, .xlsm"
            onChange={handleFileChange}
          />
        </label>
        <button
          className="btn btn-success w-full border-transparent cursor-pointer"
          type="button"
          onClick={generateCertificates}
          disabled={!excelFile}
        >
          Agregar datos Excel
        </button>
      </form>
    </div>
  );
};

export { participantDB };

export default ReadExcelParticipants;
