"use client";

import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import { Dexie } from 'dexie';
import fs from 'fs';

class ParticipantDatabase extends Dexie {
  participants;
  constructor() {
    super("ParticipantDatabase");
    this.version(1).stores({
      participants: "++id, nombreParticipante, codigoParticipante, CursoName, FechaInicio, Modulos, Resolucion, NotaParcial, NotaFinal, Promedio, FechaFin, estadoPago",
    });
    this.participants = this.table("participants");
  }
}

const participantDB = new ParticipantDatabase();

const ReadExcelParticipants = ({ onCloseModal }) => {
  const [excelFile, setExcelFile] = useState(null);
  const [showInput, setShowInput] = useState(true);

  const handleFileChange = async (event) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setExcelFile(file);

      // Almacenar la ruta del archivo en sessionStorage
      const filePath = event.target.files[0].path;
      sessionStorage.setItem('excelFilePath', filePath);
      console.log('Ruta del archivo almacenada en sessionStorage:', filePath);
    }

    try {
      const filePath = sessionStorage.getItem('excelFilePath');
      if (!filePath) {
        console.error("La ruta del archivo no está disponible en sessionStorage.");
        return;
      }

      const buffer = fs.readFileSync(filePath); // Lee el archivo usando fs
      const wb = XLSX.read(buffer, { type: 'buffer' });
      const ws = wb.Sheets[wb.SheetNames[0]];

      const CursoName = ws['C1'] ? ws['C1'].v : '';
      const FechaInicio = ws['C2'] ? ws['C2'].v : '';
      const FechaFin = ws['C3'] ? ws['C3'].v : '';
      const Modulos = ws['C4'] ? ws['C4'].v : '';
      const ResoDirectoral = ws['C5'] ? ws['C5'].v : '';

      const participantes = [];
      let rowIndex = 13;
      while (ws['B' + rowIndex]) {
        const participantName = ws['B' + rowIndex].v;
        const codigoParticipante = ws['P' + rowIndex].v;
        const NotaParcial = ws['M' + rowIndex].v;
        const NotaFinal = ws['N' + rowIndex].v;
        const Promedio = ws['O' + rowIndex].v;
        const estadoPago = ws['S' + rowIndex] ? ws['S' + rowIndex].v : '';

        const participanteData = {
          nombreParticipante: participantName,
          codigoParticipante: codigoParticipante,
          CursoName: CursoName,
          FechaInicio: FechaInicio,
          FechaFin: FechaFin,
          Modulos: Modulos,
          Resolucion: ResoDirectoral,
          NotaParcial: NotaParcial,
          NotaFinal: NotaFinal,
          Promedio: Promedio,
          estadoPago: estadoPago
        };
        participantes.push(participanteData);
        rowIndex++;
      }
      console.log(participantes);
      await participantDB.participants.clear();
      await participantDB.participants.bulkAdd(participantes);
      alert("Datos del Excel guardados correctamente :)");
      onCloseModal();
      setShowInput(false);
    } catch (error) {
      console.error("Error al leer el archivo Excel:", error);
      alert("Hubo un error al procesar el archivo Excel.");
    }
  };

  return (
    <div>
        <form method="dialog">
          <label className="form-control text-slate-200 w-full mb-4">
            <input
              id="fileInput"
              className="file-input file-input-info text-slate-200 file-input-bordered text w-full"
              type="file"
              accept=".xlsx, .xls, .xlsm"
              onChange={handleFileChange}
            />
          </label>
        </form>
    </div>
  );
};

export { participantDB };
export default ReadExcelParticipants;
