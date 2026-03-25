import { openDB } from "idb";

export type WrongNote = {
  id: number;
  spanish: string;
  korean: string;
  tema: string;
};

let dbPromise: ReturnType<typeof openDB> | null = null;

function getDB() {
  if (!dbPromise) {
    dbPromise = openDB("voca-quiz", 1, {
      upgrade(db) {
        db.createObjectStore("wrong-notes", { keyPath: "id" });
      },
    });
  }
  return dbPromise;
}

export async function saveWrongNotes(vocas: WrongNote[]) {
  const db = await getDB();
  const tx = db.transaction("wrong-notes", "readwrite");
  await Promise.all(vocas.map((v) => tx.store.put(v)));
  await tx.done;
}

export async function getWrongNotes(): Promise<WrongNote[]> {
  return (await getDB()).getAll("wrong-notes");
}

export async function getWrongNotesByTema(tema: string): Promise<WrongNote[]> {
  const all = await getWrongNotes();
  return all.filter((v) => v.tema === tema);
}

export async function deleteWrongNote(id: number) {
  return (await getDB()).delete("wrong-notes", id);
}

export async function clearWrongNotes() {
  return (await getDB()).clear("wrong-notes");
}