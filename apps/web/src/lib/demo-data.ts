export type Musician = {
  id: string;
  name: string;
  role: string;
  instrument: string;
  location: string;
  genres: string[];
  image: string;
  available: boolean;
};

// Design fixtures only. Never mix these records with Supabase results.
export const demoMusicians: Musician[] = [
  {
    id: "marcus-thorne",
    name: "Marcus Thorne",
    role: "Lead Guitarist",
    instrument: "Electric Guitar",
    location: "London, UK",
    genres: ["Metalcore", "Progressive", "Session"],
    image: "guitar",
    available: true,
  },
  {
    id: "sena-park",
    name: "Sena Park",
    role: "Keyboard & Synth",
    instrument: "Keyboard",
    location: "Berlin, DE",
    genres: ["Indie Pop", "Electronic", "Synthwave"],
    image: "keys",
    available: true,
  },
  {
    id: "david-vance",
    name: "David Vance",
    role: "Bass Guitarist",
    instrument: "Bass Guitar",
    location: "New York, USA",
    genres: ["Funk", "Soul", "Neo-Jazz"],
    image: "guitar",
    available: false,
  },
  {
    id: "elena-rostova",
    name: "Elena Rostova",
    role: "Lead Vocalist",
    instrument: "Vocals",
    location: "Stockholm, SE",
    genres: ["Alt Rock", "Acoustic", "Coaching"],
    image: "vocal",
    available: true,
  },
  {
    id: "aiden-cross",
    name: "Aiden Cross",
    role: "Session Drummer",
    instrument: "Drums",
    location: "Los Angeles, USA",
    genres: ["Progressive", "Fusion", "Metal"],
    image: "drums",
    available: true,
  },
  {
    id: "marcus-rivera",
    name: "Marcus Rivera",
    role: "Session Musician",
    instrument: "Keyboard",
    location: "Berlin, DE",
    genres: ["Jazz", "Neo-Soul", "Funk"],
    image: "keys",
    available: true,
  },
];
