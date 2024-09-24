
let db: IDBDatabase | null = null;

export const openDatabase = (): Promise<IDBDatabase> => {
  return new Promise<IDBDatabase>((resolve, reject) => {
    if (db) {
      resolve(db);
    } else {
      const request = window.indexedDB.open('DatabasePhysicalBinex', 2);
      request.onerror = (event) => {
        console.error('Error al abrir la base de datos:', request.error);
        reject(request.error);
      };
      request.onupgradeneeded = (event) => {
        console.log('onupgradeneeded event triggered');
        const dbInstance = (event.target as IDBOpenDBRequest).result;
        if (!dbInstance.objectStoreNames.contains('physical')) {
          console.log('Creating object store: physical');
          dbInstance.createObjectStore('physical', { autoIncrement: true });
        }
        if (!dbInstance.objectStoreNames.contains('ImagesPhysical')) {
          console.log('Creating object store: ImagesPhysical');
          dbInstance.createObjectStore('ImagesPhysical', { autoIncrement: true });
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
    const expectedObjectStores = ['physical', 'ImagesPhysical'];

    const missingObjectStores = expectedObjectStores.filter(store => !existingObjectStores.includes(store));
    const excessObjectStores = existingObjectStores.filter(store => !expectedObjectStores.includes(store));

    if (missingObjectStores.length > 0 || excessObjectStores.length > 0) {
      // Eliminamos la base de datos actual
      return deleteAndRecreateDatabase().then(() => {
        return new Promise<IDBDatabase>((resolve, reject) => {
          const request = window.indexedDB.open('DatabasePhysicalBinex', 2);
          request.onerror = (event) => {
            console.error('Error al abrir la base de datos:', request.error);
            reject(request.error);
          };
          request.onupgradeneeded = (event) => {
            console.log('onupgradeneeded event triggered');
            const dbInstance = (event.target as IDBOpenDBRequest).result;
            dbInstance.createObjectStore('physical', { autoIncrement: true });
            dbInstance.createObjectStore('ImagesPhysical', { autoIncrement: true });
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
    const dbName = 'DatabasePhysicalBinex';
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
        dbInstance.createObjectStore('physical', { autoIncrement: true });
        dbInstance.createObjectStore('ImagesPhysical', { autoIncrement: true });
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

