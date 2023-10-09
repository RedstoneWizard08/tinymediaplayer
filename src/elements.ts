import blankImage from "./blank.jpg";

export interface PageElements {
    fileIn: HTMLInputElement;
    status: HTMLDivElement;
    result: HTMLAudioElement;
    coverArt: HTMLImageElement;
    controls: HTMLDivElement;
    play: HTMLParagraphElement;
    sp0: HTMLParagraphElement;
    position: HTMLParagraphElement;
    remaining: HTMLParagraphElement;
    progress: HTMLDivElement;
    progressInner: HTMLDivElement;
    sp1: HTMLParagraphElement;
    next: HTMLParagraphElement;
}

export const make = <K extends keyof HTMLElementTagNameMap>(
    name: K,
    id: string,
    classes: string[] = [],
    attrs: Record<string, any> = {},
    content?: string
): HTMLElementTagNameMap[K] => {
    const el = document.createElement(name)!;

    el.id = id;
    el.className = classes.join(" ");

    for (const attr of Object.keys(attrs)) {
        el.setAttribute(attr, attrs[attr]);
    }

    if (content) el.innerHTML = content;

    return el;
};

export const append = (parent: Node, ...children: Node[]) => {
    for (const child of children) {
        parent.appendChild(child);
    }
};

export const createElements = (): PageElements => {
    const fileIn = make("input", "filein", [], {
        type: "file",
        multiple: true,
        accept: "audio/*",
        placeholder: "Choose your music...",
    });

    const status = make("div", "status", ["status"], {}, "Waiting...");
    const result = make("audio", "result");

    const coverArt = make("img", "coverArt", [], {
        src: blankImage,
    });

    const controls = make("div", "control", ["control"]);
    const play = make("p", "play", ["controller"], {}, "Play");
    const sp0 = make("p", "_sp0", [], {}, "&nbsp;&nbsp;&nbsp;");
    const position = make("p", "pos", ["time"], {}, "00:00");
    const progress = make("div", "progress");
    const progressInner = make("div", "progressInner");
    const remaining = make("p", "rem", ["time"], {}, "-00:00");
    const sp1 = make("p", "_sp1", [], {}, "&nbsp;&nbsp;&nbsp;");
    const next = make("p", "next", ["controller"], {}, "&gt;&gt;");

    append(progress, progressInner);
    append(controls, play, sp0, position, progress, remaining, sp1, next);
    append(document.body, fileIn, status, result, coverArt, controls);

    return {
        fileIn,
        status,
        result,
        coverArt,
        controls,
        play,
        sp0,
        position,
        progress,
        progressInner,
        remaining,
        sp1,
        next,
    };
};

export const {
    fileIn,
    status,
    result,
    coverArt,
    play,
    position,
    progress,
    progressInner,
    remaining,
    next,
} = createElements();
