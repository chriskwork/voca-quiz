import { openDB } from "idb";

export type WrongNote = {
  id: number;
  spanish: string;
  korean: string;
  tema: string;
};

const dbPromise = openDB("voca-quiz", 1, {
  upgrade(db) {
    db.createObjectStore("wrong-notes", { keyPath: "id" });
  },
});

export async function saveWrongNotes(vocas: WrongNote[]) {
  const db = await dbPromise;
  const tx = db.transaction("wrong-notes", "readwrite");
  await Promise.all(vocas.map((v) => tx.store.put(v)));
  await tx.done;
}

export async function getWrongNotes(): Promise<WrongNote[]> {
  return (await dbPromise).getAll("wrong-notes");
}

export async function getWrongNotesByTema(tema: string): Promise<WrongNote[]> {
  const all = await getWrongNotes();
  return all.filter((v) => v.tema === tema);
}
