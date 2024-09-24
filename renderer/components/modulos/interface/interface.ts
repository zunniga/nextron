
export interface ExcelData {
    nombres: string[];
    email: string[];
    codigo: string[];
    participacion: string[];
    actividadAcademica: string | null;
    fechaInicio: string | null;
    fechaFinal: string | null;
    temario: string | null;
    ponente: string | null;
    horas: string | null;
  }

  export interface ExcelDataPhysic {
    actividadAcademica: string | null;
    fechaInicio: string | null;
    fechaFinal: string | null;
    temario: string | null;
    ponente: string | null;
    horas: string | null;
    datos: {
      fisico: string;
      nombres: string;
      codigo: string;
      celda: string;
  }[];
  }