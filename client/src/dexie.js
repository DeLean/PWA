import Dexie from "dexie";


export const dexie = new Dexie("AllData");
dexie.version(1).stores({
    cities: "++id",
    newCities: "++id"
});

const openDB = async () => {
    try {
        dexie.open();
    } catch(err) {
        console.error(err);
    }
}

openDB();
