
let db: IDBDatabase | null = null;

export const openDatabase = (): Promise<IDBDatabase> => {
  return new Promise<IDBDatabase>((resolve, reject) => {
    if (db) {
      resolve(db);
    } else {
      const request = window.indexedDB.open('ImageDatabaseEcomas', 2);
      request.onerror = (event) => {
        console.error('Error al abrir la base de datos:', request.error);
        reject(request.error);
      };
      request.onupgradeneeded = (event) => {
        console.log('onupgradeneeded event triggered');
        const dbInstance = (event.target as IDBOpenDBRequest).result;
        if (!dbInstance.objectStoreNames.contains('ecomas')) {
          console.log('Creating object store: ecomas');
          dbInstance.createObjectStore('ecomas', { autoIncrement: true });
        }
        if (!dbInstance.objectStoreNames.contains('ImagesEcomas')) {
          console.log('Creating object store: ImagesEcomas');
          dbInstance.createObjectStore('ImagesEcomas', { autoIncrement: true });
        }
      };
      request.onsuccess = (event) => {
        db = (event.target as IDBOpenDBRequest).result;
        resolve(db);
      };
    }
  }).then((database) => {
    // Comprobamos si los nombres de los almacenes de objetos son correctos
    const existingObjectStores = Array.from(database.objectStoreNames);
    const expectedObjectStores = ['ecomas', 'ImagesEcomas'];

    const missingObjectStores = expectedObjectStores.filter(store => !existingObjectStores.includes(store));
    const excessObjectStores = existingObjectStores.filter(store => !expectedObjectStores.includes(store));

    if (missingObjectStores.length > 0 || excessObjectStores.length > 0) {
      // Eliminamos la base de datos actual
      return deleteAndRecreateDatabase().then(() => {
        return new Promise<IDBDatabase>((resolve, reject) => {
          const request = window.indexedDB.open('ImageDatabaseEcomas', 2);
          request.onerror = (event) => {
            console.error('Error al abrir la base de datos:', request.error);
            reject(request.error);
          };
          request.onupgradeneeded = (event) => {
            console.log('onupgradeneeded event triggered');
            const dbInstance = (event.target as IDBOpenDBRequest).result;
            dbInstance.createObjectStore('ecomas', { autoIncrement: true });
            dbInstance.createObjectStore('ImagesEcomas', { autoIncrement: true });
          };
          request.onsuccess = (event) => {
            db = (event.target as IDBOpenDBRequest).result;
            resolve(db);
          };
        });
      });
    } else {
      return database;
    }
  });
};

// Función para eliminar y recrear la base de datos con los nuevos nombres de almacenes
const deleteAndRecreateDatabase = (): Promise<void> => {
  return new Promise<void>((resolve, reject) => {
    const dbName = 'ImageDatabaseEcomas';
    const request = window.indexedDB.deleteDatabase(dbName);
    request.onerror = (event) => {
      console.error('Error al eliminar la base de datos:', request.error);
      reject(request.error);
    };
    request.onsuccess = () => {
      console.log('Base de datos eliminada correctamente.');
      // Volver a abrir la base de datos para crearla con los nuevos nombres de almacenes
      const openRequest = window.indexedDB.open(dbName, 2);
      openRequest.onerror = (event) => {
        console.error('Error al abrir la base de datos:', openRequest.error);
        reject(openRequest.error);
      };
      openRequest.onupgradeneeded = (event) => {
        console.log('onupgradeneeded event triggered');
        const dbInstance = (event.target as IDBOpenDBRequest).result;
        dbInstance.createObjectStore('ecomas', { autoIncrement: true });
        dbInstance.createObjectStore('ImagesEcomas', { autoIncrement: true });
      };
      openRequest.onsuccess = (event) => {
        db = (event.target as IDBOpenDBRequest).result;
        resolve();
      };
    };
  });
};

// Función para obtener la instancia de la base de datos
export const getDatabase = (): IDBDatabase | null => {
  return db;
};

/* const Database: React.FC = () => {
  useEffect(() => {
    const createDatabaseAndObjectStore = async () => {
      try {
        const db = await openDatabase();
        await createObjectStoreIfNotExists(db);
      } catch (error) {
        console.error('Error al crear la base de datos o al cargar las imágenes:', error);
      }
    };
    createDatabaseAndObjectStore();
  }, []);

  const createObjectStoreIfNotExists = (db: IDBDatabase): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (!db.objectStoreNames.contains('ecomas')) {
        console.log('Creating object store: images');
        const transaction = db.transaction(['ecomas'], 'readwrite');
        transaction.oncomplete = () => {
          resolve();
        };
        transaction.onerror = (event) => {
          console.error('Error al crear el almacén de objetos:', (event.target as IDBRequest).error);
          reject((event.target as IDBRequest).error);
        };
        transaction.objectStore('ecomas');
      } else {
        resolve();
      }
    });
  };

  return null;
};

export default Database; */
