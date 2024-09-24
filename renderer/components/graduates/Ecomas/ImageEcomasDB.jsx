import { useState, useEffect } from "react";
import Dexie from "dexie";

class ImageDatabase extends Dexie {
  constructor() {
    super("ImageDatabase");
    this.version(5).stores({
      images: "++id, name, imageDataURL", 
      certificates: "++id, type, certificateDataURL, ownerName" 
    });
    this.images = this.table("images");
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

const imageDB = new ImageDatabase();

const useImageUploader = () => {
  const guardarImagenes = async (imagenes) => { // Ahora recibe un array de objetos { file, nombre }
    try {
      const nombres = ['imgCertiDigital', 'imgCertiPhisyc']; // Nombres específicos para las imágenes

      await Promise.all(imagenes.map(async ({ file, nombre }, index) => {
        const imageDataURL = await convertirImagen(file);
        const nombreImagen = nombre || nombres[index] || `img${index}`; // Si hay un nombre específico, lo usamos; de lo contrario, usamos uno genérico o predeterminado
        await guardarImagen(nombreImagen, imageDataURL); // Guardar la imagen con el nombre específico
        console.log("Imagen guardada en la base de datos:", nombreImagen, imageDataURL);
      }));
    } catch (error) {
      console.error("Error al guardar las imágenes:", error);
    }
  };
  const vaciarTablaImagenes = async () => {
    try {
      // Eliminar todas las imágenes de la tabla
      await imageDB.images.clear();
      console.log("Tabla de imágenes vaciada");
    } catch (error) {
      console.error("Error al vaciar la tabla de imágenes:", error);
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

  const guardarImagen = async (name, imageDataURL) => {
    try {
      const existingImage = await imageDB.images.where('name').equals(name).first(); // Buscar una imagen con el mismo nombre
      if (existingImage) {
        // Si ya existe una imagen con el mismo nombre, actualizarla en lugar de agregar una nueva
        await imageDB.images.update(existingImage.id, { imageDataURL });
        console.log("Imagen actualizada en la base de datos");
      } else {
        // Si no existe una imagen con el mismo nombre, agregarla a la base de datos
        await imageDB.images.add({ name, imageDataURL });
        console.log("Imagen guardada en la base de datos");
      }
    } catch (error) {
      console.error("Error al guardar la imagen en la base de datos:", error);
    }
  };



  return { guardarImagenes };
};


export { useImageUploader, ImageDatabase };