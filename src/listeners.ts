import { nextSong } from "./controls";
import {
    fileIn,
    position,
    progressInner,
    remaining,
    result,
    status,
} from "./elements";
import { formatTime, percentage } from "./util";

export const registerListeners = (
    audios: Record<string, string> = {}
): Record<string, string> => {
    fileIn.addEventListener("change", async () => {
        for (const audio of Object.keys(audios)) {
            URL.revokeObjectURL(audios[audio]);
            delete audios[audio];
        }

        for (let i = 0; i < fileIn.files!.length; i++) {
            const file = fileIn.files![i];

            if (
                !file.name.endsWith(".mp3") &&
                !file.name.endsWith(".ogg") &&
                !file.name.endsWith(".wav")
            )
                continue;

            status.innerHTML = `Processing ${i + 1} of ${
                fileIn.files!.length
            }: ${file.name}`;

            const url = URL.createObjectURL(file);

            audios[file.name] = url;
        }

        status.innerHTML = "Processing complete!";

        await nextSong(audios);
    });

    result.addEventListener("timeupdate", () => {
        const value = result.currentTime;
        const max = result.duration;

        if (Number.isNaN(value) || Number.isNaN(max)) return;

        const perc = percentage(value, max).toFixed(2);

        progressInner.style.width = perc + "%";

        position.innerHTML = formatTime(Math.floor(value));
        remaining.innerHTML = "-" + formatTime(Math.floor(max - value));
    });

    return audios;
};
