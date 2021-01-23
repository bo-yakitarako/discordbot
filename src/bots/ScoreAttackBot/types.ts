type SparebeatProfile = {
  biography: string | null;
  displayName: string | null;
  isPublisher: boolean;
  name: string;
  website: string | null;
};

type Track = {
  id: string;
  title: string;
  artist: string;
  bpm: number;
  levelEasy: number;
  levelNormal: number;
  levelHard: number;
  url: string | null;
};

type Tracks = {
  tracks: Track[];
};

type PlayAPI = {
  publisher: {
    name: string;
    displayName: string | null;
  };
  track: Track;
};

type SongTable = {
  title: string;
  url: string;
  artist: string;
  artistWebsite: string | null;
  hash: string;
  mapperName: string;
  mapperDisplayName: string | null;
  difficulty: 1 | 2 | 3;
  level: number;
};

export { SparebeatProfile, Track, Tracks, PlayAPI, SongTable };
