const DB_NAME = 'pokedev';
const DB_VERSION = 1;
let DB: IDBDatabase;
const indexedDB: IDBFactory = window.indexedDB;

export enum PokedevTables {
	API_CALLS = 'api_calls',
}

/**
 * Returns a Promise with the indexedDB ready
 * @returns {Promise<IDBDatabase>}
 */
export async function getDB(): Promise<IDBDatabase> {
	return new Promise((resolve, reject) => {
		if(DB) {
			return resolve(DB);
		}

		const request = indexedDB.open(DB_NAME, DB_VERSION);

		request.onerror = error => reject(error);

		request.onsuccess = (event) => {
			DB = (event.target as IDBOpenDBRequest)?.result;
			resolve(DB);
		};

		request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
			const db: IDBDatabase = (event.target as IDBOpenDBRequest)?.result;

			if(event.oldVersion < 1) { // Original
				db.createObjectStore("api_calls", {keyPath: 'url'});
			}
		};
	});
}

/**
 * Gets one element by its id from the indexedDB
 * @param {string | number} id
 * @param {PokedevTables} objectStore
 * @returns {Promise<any>}
 */
export async function getFromDB(id: string | number, objectStore: PokedevTables): Promise<any> {
	if(!id) {
		return null;
	}

	const db = await getDB();
	return new Promise((resolve) => {
		const transaction = db.transaction([objectStore], 'readwrite');

		const store = transaction.objectStore(objectStore);
		const request = store.get(id);

		request.onsuccess = () => {
			resolve(request.result?.data);
		};
	});
}

/**
 * Gets all the elements from an object store of the indexedDB
 * @param {PokedevTables} objectStore
 * @returns {Promise<any[]>}
 */
export async function getAllFromDB(objectStore: PokedevTables): Promise<any[]> {
	const db = await getDB();

	return new Promise((resolve, reject) => {
		const transaction = db.transaction([objectStore], 'readwrite');

		transaction.oncomplete = () => resolve(elements);
		transaction.onerror = error => reject(error);
		transaction.onabort = abort => reject(abort);

		const store = transaction.objectStore(objectStore);
		const elements: any[] = [];

		// We use cursors because methods like getAll/getAllKeys return an array of keys/values.
		// But an object storage can be huge, bigger than the available memory. Then getAll will
		// fail to get all records as an array.
		store.openCursor().onsuccess = (event) => {
			const cursor: IDBCursorWithValue = (event.target as IDBRequest)?.result;
			if(cursor) {
				elements.push(cursor.value);
				cursor.continue();
			}
		};
	});
}

/**
 * Deletes one element by its id from the indexedDB
 * @param {number} id
 * @param {PokedevTables} objectStore
 * @returns {Promise<true | Event | null>}
 */
export async function deleteFromDB(id: number, objectStore: PokedevTables): Promise<true | Event | null> {
	if(!id) {
		return null;
	}

	const db = await getDB();
	return new Promise((resolve, reject) => {
		const transaction = db.transaction([objectStore], 'readwrite');

		transaction.onerror = error => reject(error);
		transaction.onabort = abort => reject(abort);

		const store = transaction.objectStore(objectStore);
		const request = store.delete(id);
		request.onsuccess = () => resolve(true);
	});
}

/**
 * Deletes all the elements in an object store of the indexedDB
 * @param {PokedevTables} objectStore
 * @returns {Promise<true | Event>}
 */
export async function deleteAllInDB(objectStore: PokedevTables): Promise<true | Event> {
	const db = await getDB();

	return new Promise((resolve, reject) => {
		const transaction = db.transaction([objectStore], 'readwrite');

		transaction.oncomplete = () => resolve(true);
		transaction.onerror = error => reject(error);
		transaction.onabort = abort => reject(abort);

		const store = transaction.objectStore(objectStore);
		store.clear();
	});
}

/**
 * Deletes the indexedDB
 * @returns {Promise<true | Event>}
 */
export async function deleteIDB(): Promise<true | Event> {
	return new Promise((resolve, reject) => {
		const DBDeleteRequest = indexedDB.deleteDatabase(DB_NAME);

		DBDeleteRequest.onsuccess = () => resolve(true);
		DBDeleteRequest.onerror = event => reject(event);
	});
}

/**
 * Saves an element to a table in the indexedDB
 * @param {any} model
 * @param {PokedevTables} objectStore
 * @returns {Promise<true | Event>}
 */
export async function saveToDB(model: any, objectStore: PokedevTables): Promise<true | Event> {
	const db = await getDB();

	return new Promise((resolve, reject) => {
		try {
			const transaction = db.transaction([objectStore], 'readwrite');

			transaction.oncomplete = () => resolve(true);
			transaction.onerror = error => reject(error);
			transaction.onabort = abort => reject(abort);

			const store = transaction.objectStore(objectStore);
			store.put(model);
		} catch(error) {
			reject(error);
		}
	});
}
