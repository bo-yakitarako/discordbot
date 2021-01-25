type SparebeatProfile = {
  biography: string | null;
  displayName: string | null;
  isPublisher: boolean;
  name: string;
  website: string | null;
};

type Track = {
  title: string;
  artist: string;
  url: string | null;
  bpm: number;
  levelEasy: number;
  levelNormal: number;
  levelHard: number;
  id: string;
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

type PlayRecord = {
  difficulty: 1 | 2 | 3;
  layout: number;
  bind: boolean;
  score: number;
  chain: number;
  just: number;
  early: number;
  late: number;
  miss: number;
  attack: number;
  createdAt: string;
  track: Track;
};

type ScoreInfo = {
  score: number;
  scoreCreatedAt: string;
};

export { SparebeatProfile, Track, Tracks, PlayAPI, SongTable, PlayRecord, ScoreInfo };
