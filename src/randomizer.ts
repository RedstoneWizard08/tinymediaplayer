import * as jsmediatags from "jsmediatags";
import { AudioMetadata, SongData } from "./types";
import { bufferToBase64 } from "./util";

export const getRandom = async (
    audios: Record<string, string>
): Promise<SongData> => {
    const keys = Object.keys(audios);
    const idx = Math.floor(Math.random() * keys.length);
    const key = keys[idx];
    const data = audios[key];
    const dataBlob = await fetch(data).then((res) => res.blob());

    const metadata = await new Promise<AudioMetadata>((r, re) =>
        jsmediatags.read(dataBlob, {
            onSuccess: async (tag) => {
                const coverData = tag.tags.APIC.data.data;
                const coverBuf = new Uint8Array(coverData);
                const coverEnc = await bufferToBase64(coverBuf);
                const cover = `data:image/jpeg;base64,${coverEnc}`;

                const title = tag.tags.title || "Unknown Song";
                const artist = tag.tags.artist || "Unknown Artist";
                const album = tag.tags.album || "Unknown Album";

                r({ title, artist, album, cover });
            },

            onError: (err: any) => re(err),
        })
    );

    return {
        metadata,
        data: URL.createObjectURL(dataBlob),
        index: idx,
        tracks: keys.length,
    };
};
