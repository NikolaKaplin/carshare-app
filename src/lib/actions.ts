import { invoke } from "@tauri-apps/api/core";

export async function saveDbFile(file: File) {
    const arrayBuffer = await file.arrayBuffer();
    await invoke("replace_database", {
        newDbData: new Uint8Array(arrayBuffer),
    });
}

async function getDatabase(): Promise<Uint8Array<ArrayBuffer>> {
    const dbFile = await invoke<number[]>('download_database');
    const uintArray = new Uint8Array(dbFile);
    return uintArray
}

export async function exportDatabase() {
    const db = await getDatabase()
    const blob = new Blob([db], { type: 'application/octet-stream' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'carshare-app.db';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}