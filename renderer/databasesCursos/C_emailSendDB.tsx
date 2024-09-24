import { Dexie, Table } from "dexie";

// Define la interfaz Participant
export type Participant = {
  id?: number;
  name: string;
  email: string;
  curso: string;
  material: string;
  pdf: Blob;
};

// Clase DataForSendCursos que utiliza Dexie
class DataForSendCursos extends Dexie {
  partForSend: Table<Participant, number>;

  constructor() {
    super("DataForSendCursos");
    this.version(4).stores({
      partForSend: "++id, name, email, curso, pdf, material",
    });
    this.partForSend = this.table("partForSend");
  }

  async getParticipantById(id: number): Promise<Participant | undefined> {
    try {
      const participant = await this.partForSend.get(id);
      return participant;
    } catch (error) {
      console.error("Error getting participant by ID:", error);
      throw error;
    }
  }
}

// Exporta la clase DataForSendCursos
export { DataForSendCursos };
