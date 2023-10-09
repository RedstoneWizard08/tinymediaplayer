import { play, result, status, coverArt, next } from "./elements";
import { getRandom } from "./randomizer";
import { getMeta } from "./util";

export const playSong = () => {
    result.play();
    play.innerHTML = "Pause";
};

export const pause = () => {
    result.pause();
    play.innerHTML = "Play";
};

export const playPause = () => {
    if (result.paused) playSong();
    else pause();
};

export const nextSong = async (audios: Record<string, string>) => {
    const { data, index, metadata, tracks } = await getRandom(audios);

    const meta = await getMeta(metadata.cover);
    const w = meta.naturalWidth;
    const h = meta.naturalHeight;

    status.innerHTML =
        "Now playing: " +
        metadata.title +
        " - " +
        metadata.album +
        " (" +
        index +
        " of " +
        tracks +
        ")";

    coverArt.src = metadata.cover;
    result.src = data;

    playSong();

    if ("mediaSession" in navigator) {
        navigator.mediaSession.metadata = new MediaMetadata({
            title: metadata.title,
            album: metadata.album,
            artist: metadata.artist,

            artwork: [
                {
                    src: metadata.cover,
                    sizes: `${w}x${h}`,
                    type: "image/jpeg",
                },
            ],
        });

        navigator.mediaSession.setActionHandler("play", playSong);
        navigator.mediaSession.setActionHandler("pause", pause);

        navigator.mediaSession.setActionHandler("stop", () => {
            pause();
            result.currentTime = 0;
        });

        navigator.mediaSession.setActionHandler("previoustrack", () => {
            if (result.currentTime <= 0) nextSong(audios);
            else result.currentTime = 0;
        });

        navigator.mediaSession.setActionHandler("nexttrack", () =>
            nextSong(audios)
        );

        navigator.mediaSession.setActionHandler("seekforward", (ev) => {
            const skipTime = ev.seekOffset || 5;

            result.currentTime += skipTime;
        });

        navigator.mediaSession.setActionHandler("seekbackward", (ev) => {
            const skipTime = ev.seekOffset || 5;

            result.currentTime -= skipTime;
        });

        navigator.mediaSession.setActionHandler("seekto", (ev) => {
            if (ev.fastSeek && "fastSeek" in result) {
                result.fastSeek(ev.seekTime as number);
                return;
            }

            result.currentTime = ev.seekTime as number;
        });
    }
};

export const registerControls = (audios: Record<string, string>) => {
    window.addEventListener("keydown", (ev) => {
        switch (ev.code) {
            case "Space":
                playPause();
                break;

            case "ArrowRight":
                result.currentTime += 5;
                break;

            case "ArrowLeft":
                result.currentTime -= 5;
                break;

            case "KeyN":
                if (ev.shiftKey) nextSong(audios);
                break;
        }
    });

    result.addEventListener("ended", () => nextSong(audios));
    next.addEventListener("click", () => nextSong(audios));
    play.addEventListener("click", playPause);
};
