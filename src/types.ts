export interface AudioMetadata {
    /**
     * The song title.
     */
    title: string;

    /**
     * The song artist.
     */
    artist: string;

    /**
     * The song album.
     */
    album: string;

    /**
     * The cover URL.
     */
    cover: string;
}

export interface SongData {
    /**
     * The song metadata.
     */
    metadata: AudioMetadata;

    /**
     * The audio's source URL. Is a Blob URL.
     */
    data: string;

    /**
     * The index of the track.
     */
    index: number;

    /**
     * The number of available tracks in the playlist.
     */
    tracks: number;
}
