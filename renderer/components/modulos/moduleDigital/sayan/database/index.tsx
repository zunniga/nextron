
let db: IDBDatabase | null = null;

export const openDatabase = (): Promise<IDBDatabase> => {
  return new Promise<IDBDatabase>((resolve, reject) => {
    if (db) {
      resolve(db);
    } else {
      const request = window.indexedDB.open('ImageDatabaseSayan', 2);
      request.onerror = (event) => {
        console.error('Error al abrir la base de datos:', request.error);
        reject(request.error);
      };
      request.onupgradeneeded = (event) => {
        console.log('onupgradeneeded event triggered');
        const dbInstance = (event.target as IDBOpenDBRequest).result;
        if (!dbInstance.objectStoreNames.contains('sayan')) {
          console.log('Creating object store: sayan');
          dbInstance.createObjectStore('sayan', { autoIncrement: true });
        }
        if (!dbInstance.objectStoreNames.contains('ImagesSayan')) {
          console.log('Creating object store: ImagesSayan');
          dbInstance.createObjectStore('ImagesSayan', { autoIncrement: true });
        }
      };
      request.onsuccess = (event) => {
        db = (event.target as IDBOpenDBRequest).result;
        resolve(db);
      };
    }
  }).then((database) => {
    const existingObjectStores = Array.from(database.objectStoreNames);
    const expectedObjectStores = ['sayan', 'ImagesSayan'];

    const missingObjectStores = expectedObjectStores.filter(store => !existingObjectStores.includes(store));
    const excessObjectStores = existingObjectStores.filter(store => !expectedObjectStores.includes(store));

    if (missingObjectStores.length > 0 || excessObjectStores.length > 0) {
      // Eliminamos la base de datos actual
      return deleteAndRecreateDatabase().then(() => {
        return new Promise<IDBDatabase>((resolve, reject) => {
          const request = window.indexedDB.open('ImageDatabaseSayan', 2);
          request.onerror = (event) => {
            console.error('Error al abrir la base de datos:', request.error);
            reject(request.error);
          };
          request.onupgradeneeded = (event) => {
            console.log('onupgradeneeded event triggered');
            const dbInstance = (event.target as IDBOpenDBRequest).result;
            dbInstance.createObjectStore('sayan', { autoIncrement: true });
            dbInstance.createObjectStore('ImagesSayan', { autoIncrement: true });
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
    const dbName = 'ImageDatabaseSayan';
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
        dbInstance.createObjectStore('sayan', { autoIncrement: true });
        dbInstance.createObjectStore('ImagesSayan', { autoIncrement: true });
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

