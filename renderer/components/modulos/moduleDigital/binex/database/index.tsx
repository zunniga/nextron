
let db: IDBDatabase | null = null;

export const openDatabase = (): Promise<IDBDatabase> => {
  return new Promise<IDBDatabase>((resolve, reject) => {
    if (db) {
      resolve(db);
    } else {
      const request = window.indexedDB.open('ImageDatabaseBinex', 2);
      request.onerror = (event) => {
        console.error('Error al abrir la base de datos:', request.error);
        reject(request.error);
      };
      request.onupgradeneeded = (event) => {
        console.log('onupgradeneeded event triggered');
        const dbInstance = (event.target as IDBOpenDBRequest).result;
        if (!dbInstance.objectStoreNames.contains('binex')) {
          console.log('Creating object store: binex');
          dbInstance.createObjectStore('binex', { autoIncrement: true });
        }
        if (!dbInstance.objectStoreNames.contains('ImagesBinex')) {
          console.log('Creating object store: ImagesBinex');
          dbInstance.createObjectStore('ImagesBinex', { autoIncrement: true });
        }
      };
      request.onsuccess = (event) => {
        db = (event.target as IDBOpenDBRequest).result;
        resolve(db);
      };
    }
  }).then((database) => {
    const existingObjectStores = Array.from(database.objectStoreNames);
    const expectedObjectStores = ['binex', 'ImagesBinex'];

    const missingObjectStores = expectedObjectStores.filter(store => !existingObjectStores.includes(store));
    const excessObjectStores = existingObjectStores.filter(store => !expectedObjectStores.includes(store));

    if (missingObjectStores.length > 0 || excessObjectStores.length > 0) {
      // Eliminamos la base de datos actual
      return deleteAndRecreateDatabase().then(() => {
        return new Promise<IDBDatabase>((resolve, reject) => {
          const request = window.indexedDB.open('ImageDatabaseBinex', 2);
          request.onerror = (event) => {
            console.error('Error al abrir la base de datos:', request.error);
            reject(request.error);
          };
          request.onupgradeneeded = (event) => {
            console.log('onupgradeneeded event triggered');
            const dbInstance = (event.target as IDBOpenDBRequest).result;
            dbInstance.createObjectStore('binex', { autoIncrement: true });
            dbInstance.createObjectStore('ImagesBinex', { autoIncrement: true });
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
const deleteAndRecreateDatabase = (): Promise<void> => {
  return new Promise<void>((resolve, reject) => {
    const dbName = 'ImageDatabaseBinex';
    const request = window.indexedDB.deleteDatabase(dbName);
    request.onerror = (event) => {
      console.error('Error al eliminar la base de datos:', request.error);
      reject(request.error);
    };
    request.onsuccess = () => {
      console.log('Base de datos eliminada correctamente.');
      const openRequest = window.indexedDB.open(dbName, 2);
      openRequest.onerror = (event) => {
        console.error('Error al abrir la base de datos:', openRequest.error);
        reject(openRequest.error);
      };
      openRequest.onupgradeneeded = (event) => {
        console.log('onupgradeneeded event triggered');
        const dbInstance = (event.target as IDBOpenDBRequest).result;
        dbInstance.createObjectStore('binex', { autoIncrement: true });
        dbInstance.createObjectStore('ImagesBinex', { autoIncrement: true });
      };
      openRequest.onsuccess = (event) => {
        db = (event.target as IDBOpenDBRequest).result;
        resolve();
      };
    };
  });
};

export const getDatabase = (): IDBDatabase | null => {
  return db;
};

