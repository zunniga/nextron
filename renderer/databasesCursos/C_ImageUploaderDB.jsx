import Dexie from "dexie";
//Creamos la base de datos que contendra las imagenes subidas y los certificados generados
class ImageDatabaseCursos extends Dexie {
  constructor() {
    super("ImageDatabaseCursos");
    this.version(8).stores({
      imagesEcomas: "++id, name, imageDataURL",
      imagesBinex: "++id, name, imageDataURL",
      imagesPromas: "++id, name, imageDataURL",
      imagesRizo: "++id, name, imageDataURL",
      imagesSayan: "++id, name, imageDataURL",
      imagesCimade: "++id, name, imageDataURL",
      certificates: "++id, type, certificateDataURL, ownerName, correoOwner",
    });
    this.imagesEcomas = this.table("imagesEcomas");
    this.imagesBinex = this.table("imagesBinex");
    this.imagesPromas = this.table("imagesPromas");
    this.imagesRizo = this.table("imagesRizo");
    this.imagesSayan = this.table("imagesSayan");
    this.imagesCimade = this.table("imagesCimade");
    this.certificates = this.table("certificates");
  }

  async getItem(id) {
    try {
      console.log("Obteniendo certificado con ID:", id);
      const certificate = await this.certificates.get(id);
      return certificate ? certificate.certificateDataURL : null;
    } catch (error) {
      console.error("Error al obtener certificado de la base de datos:", error);
      throw error;
    }
  }
}

const imageDB = new ImageDatabaseCursos();

const useImageUploader = () => {
  const guardarImagenes = async (imagenes) => {
    try {
      const nombres = ["imgCertiDigital", "imgCerPhisyc", "imgCerOnly"];
      const selectedCompanyCursos = localStorage.getItem(
        "selectedCompanyCursos"
      ); // Obtener el valor del local storage

      await Promise.all(
        imagenes.map(async ({ file, nombre }, index) => {
          const imageDataURL = await convertirImagen(file);
          const nombreImagen = nombre || nombres[index] || `img${index}`;

          // Determinar la tabla correspondiente según el valor en el localStorage
          let tablaImagenes;
          switch (selectedCompanyCursos) {
            case "ecomas":
              tablaImagenes = imageDB.imagesEcomas;
              break;
            case "binex":
              tablaImagenes = imageDB.imagesBinex;
              break;
            case "promas":
              tablaImagenes = imageDB.imagesPromas;
              break;
            case "rizo":
              tablaImagenes = imageDB.imagesRizo;
              break;
            case "sayan":
              tablaImagenes = imageDB.imagesSayan;
              break;
            case "cimade":
              tablaImagenes = imageDB.imagesCimade;
              break;
            default:
              console.error("No se ha seleccionado una empresa válida");
              return; // Salir de la iteración si no hay empresa seleccionada
          }
          // Guardar la imagen en la tabla correspondiente
          await guardarImagen(nombreImagen, imageDataURL, tablaImagenes);
          console.log(
            "Imagen guardada en la base de datos:",
            nombreImagen,
            imageDataURL
          );
        })
      );
    } catch (error) {
      console.error("Error al guardar las imágenes:", error);
    }
  };

  const convertirImagen = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const guardarImagen = async (name, imageDataURL, tablaImagenes) => {
    try {
      const existingImage = await tablaImagenes
        .where("name")
        .equals(name)
        .first();
      if (existingImage) {
        await tablaImagenes.update(existingImage.id, { imageDataURL });
        console.log("Imagen actualizada en la base de datos");
      } else {
        await tablaImagenes.add({ name, imageDataURL });
        console.log("Imagen guardada en la base de datos");
      }
    } catch (error) {
      console.error("Error al guardar la imagen en la base de datos:", error);
    }
  };

  return { guardarImagenes };
};

export { useImageUploader, ImageDatabaseCursos };
