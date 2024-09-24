import Dexie from "dexie";

class NewDataSayan extends Dexie {
  constructor() {
    super("NewDataSayan");
    this.version(5).stores({
      newImages: "++id, name, imageDataURL", // Cambia el nombre de la tabla de imágenes
      newCertificates: "++id, type, certificateDataURL, ownerName" // Cambia el nombre de la tabla de certificados
    });
    this.newImages = this.table("newImages"); // Cambia la referencia a la tabla de imágenes
    this.newCertificates = this.table("newCertificates"); // Cambia la referencia a la tabla de certificados
  }

  async getItem(id) {
    try {
      console.log("Obteniendo certificado con ID:", id);
      const certificate = await this.newCertificates.get(id); // Cambia la referencia a la tabla de certificados
      return certificate ? certificate.certificateDataURL : null;
    } catch (error) {
      console.error("Error al obtener certificado de la base de datos:", error);
      throw error;
    }
  }
}

const newDB = new NewDataSayan(); // Cambia el nombre de la instancia de la base de datos

const useUploader = () => {
  const saveImages = async (images) => {
    try {
      const names = ['imgAnverso', 'imgReverso']; // Cambia los nombres específicos para las imágenes

      await Promise.all(images.map(async ({ file, name }, index) => {
        const imageDataURL = await convertImage(file);
        const imageName = name || names[index] || `img${index}`; // Cambia el nombre de la imagen
        await saveImage(imageName, imageDataURL); // Cambia la función para guardar la imagen
        console.log("Imagen guardada en la base de datos:", imageName, imageDataURL);
      }));
    } catch (error) {
      console.error("Error al guardar las imágenes:", error);
    }
  };

  const clearImagesTable = async () => {
    try {
      await newDB.newImages.clear(); // Cambia la referencia a la tabla de imágenes
      console.log("Tabla de imágenes vaciada");
    } catch (error) {
      console.error("Error al vaciar la tabla de imágenes:", error);
    }
  };

  const convertImage = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const saveImage = async (name, imageDataURL) => {
    try {
      const existingImage = await newDB.newImages.where('name').equals(name).first(); // Cambia la referencia a la tabla de imágenes
      if (existingImage) {
        await newDB.newImages.update(existingImage.id, { imageDataURL }); // Cambia la referencia a la tabla de imágenes
        console.log("Imagen actualizada en la base de datos");
      } else {
        await newDB.newImages.add({ name, imageDataURL }); // Cambia la referencia a la tabla de imágenes
        console.log("Imagen guardada en la base de datos");
      }
    } catch (error) {
      console.error("Error al guardar la imagen en la base de datos:", error);
    }
  };

  return { saveImages, clearImagesTable };
};

export { useUploader, NewDataSayan }; // Cambia el nombre de la función exportada y de la instancia de la base de datos
