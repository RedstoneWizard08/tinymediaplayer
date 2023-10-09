export const bufferToBase64 = async (buffer: Uint8Array) => {
    const base64url = await new Promise<string>((r) => {
        const reader = new FileReader();
        reader.onload = () => r(reader.result as string);
        reader.readAsDataURL(new Blob([buffer]));
    });

    return base64url.slice(base64url.indexOf(",") + 1);
};

export const getMeta = async (url: string): Promise<HTMLImageElement> => {
    const img = new Image();

    img.src = url;

    await img.decode();

    return img;
};

export const percentage = (value: number, max: number) => (value / max) * 100;

export const formatTime = (time: number) => {
    const min = (time - (time % 60)) / 60;
    const sec = time - min * 60;

    const mins = min <= 0 ? "00" : min < 10 ? "0" + min : min;
    const secs = sec <= 0 ? "00" : sec < 10 ? "0" + sec : sec;

    return mins + ":" + secs;
};
