import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

const VIBE_MAP = {
  "rainy day": [
    "indie folk acoustic",
    "lo-fi melancholy",
    "soft piano sad",
    "mellow reflective indie",
  ],
  "late night drive": [
    "synthwave drive",
    "dark ambient night",
    "atmospheric indie",
    "nocturnal electronic",
  ],
  "late night": [
    "synthwave",
    "dark ambient",
    "night lo-fi",
    "atmospheric chill",
  ],
  "gym hype": [
    "workout rap hype",
    "high energy edm",
    "intense trap",
    "pump up hip hop",
  ],
  hype: ["hype rap", "trap banger", "high energy edm", "aggressive hip hop"],
  chill: ["lo-fi hip hop", "chillhop", "soft r&b chill", "ambient chill"],
  summer: [
    "summer pop upbeat",
    "beach feel good",
    "tropical pop",
    "indie summer",
  ],
  heartbreak: [
    "sad pop breakup",
    "emotional ballad",
    "slow heartbreak",
    "melancholy indie",
  ],
  sad: ["sad indie", "melancholy pop", "slow emotional", "acoustic heartbreak"],
  happy: ["happy pop upbeat", "feel good indie", "joyful dance", "bright pop"],
  party: ["dance pop party", "club hip hop", "edm festival", "upbeat banger"],
  focus: [
    "lo-fi study",
    "instrumental focus",
    "ambient piano",
    "concentration music",
  ],
  study: [
    "lo-fi study",
    "instrumental study",
    "ambient focus",
    "soft piano study",
  ],
  romantic: [
    "romantic r&b",
    "love songs acoustic",
    "slow dance pop",
    "soft romantic indie",
  ],
  nostalgic: [
    "80s pop classic",
    "retro synthpop",
    "classic rock hits",
    "oldies feel good",
  ],
  angry: ["metal aggressive", "hard rock intense", "rage rap", "punk rock"],
  sleep: ["sleep ambient", "calm piano", "soft lullaby", "relaxing nature"],
  "road trip": [
    "road trip rock",
    "indie driving",
    "classic rock",
    "upbeat pop travel",
  ],
};

const SLANG_MAP = {
  "turn up": ["energetic party", "dance hype", "edm banger", "club rap"],
  "in my feels": [
    "emotional sad indie",
    "introspective slow",
    "heartbreak ballad",
    "melancholy acoustic",
  ],
  "main character": [
    "cinematic indie pop",
    "confident empowering",
    "cool alternative",
    "bold anthems",
  ],
  gaming: [
    "video game soundtrack",
    "game OST",
    "nintendo music",
    "video game music instrumental",
  ],
  "video games": [
    "video game soundtrack",
    "game OST",
    "nintendo music",
    "video game music instrumental",
  ],
  game: [
    "video game soundtrack",
    "game OST instrumental",
    "game music",
    "retro game music",
  ],
  nintendo: [
    "nintendo music",
    "video game soundtrack",
    "game OST",
    "super mario music",
  ],
  "understood the assignment": [
    "bold confident pop",
    "powerful hip hop",
    "empowering dance",
    "attitude banger",
  ],
  "villain arc": [
    "dark menacing",
    "aggressive electronic",
    "dark hip hop intense",
    "cinematic dark",
  ],
  "hot girl summer": [
    "confident summer pop",
    "upbeat dance",
    "empowering feel good",
    "attitude pop",
  ],
  serotonin: [
    "happy uplifting pop",
    "feel good bright",
    "joyful indie",
    "cheerful",
  ],
  "night owl": [
    "late night synthwave",
    "dark ambient lo-fi",
    "nocturnal chill",
    "midnight electronic",
  ],
  "therapy session": [
    "sad acoustic slow",
    "emotional introspective",
    "healing indie",
    "vulnerable pop",
  ],
  brat: [
    "attitude pop edgy",
    "bold dance",
    "confident aggressive pop",
    "unapologetic",
  ],
  cottagecore: [
    "folk acoustic gentle",
    "pastoral indie soft",
    "nature dreamy",
    "cozy acoustic",
  ],
  "dark academia": [
    "dark classical moody",
    "intellectual indie",
    "atmospheric orchestral",
    "moody piano",
  ],
  lowkey: [
    "understated lo-fi",
    "soft acoustic mellow",
    "quiet indie",
    "subtle chill",
  ],
  hyperpop: [
    "hyperpop electronic",
    "glitchy pop edgy",
    "maximalist pop",
    "alternative bubbly",
  ],
  vibe: ["lo-fi chill mellow", "soft r&b", "ambient groove", "smooth indie"],
  emo: [
    "emo pop punk",
    "emotional alternative",
    "sad rock angst",
    "post-hardcore",
  ],
  heartcore: [
    "raw emotional indie",
    "vulnerable acoustic",
    "slow heartbreak",
    "sad ballad",
  ],
};

const WORD_EXPAND = {
  sad: ["sad indie acoustic", "emotional ballad"],
  happy: ["upbeat feel good", "joyful pop"],
  angry: ["aggressive rock", "intense rap"],
  cozy: ["cozy acoustic lo-fi", "soft folk"],
  dark: ["dark ambient moody", "atmospheric dark"],
  dreamy: ["dreamy indie shoegaze", "ethereal ambient"],
  epic: ["epic orchestral", "cinematic epic"],
  funky: ["funk soul groove", "groovy bass"],
  groovy: ["groove funk soul", "disco funky"],
  jazzy: ["jazz modern smooth", "neo soul jazz"],
  lofi: ["lo-fi hip hop", "lofi chill beats"],
  peaceful: ["peaceful ambient", "calm meditation"],
  zen: ["zen ambient", "meditation calm"],
  hype: ["hype rap", "high energy edm"],
  feels: ["emotional indie slow", "sad introspective"],
  chill: ["lo-fi chill", "ambient relaxed"],
  vibes: ["chill mellow indie", "soft groove"],
  nostalgia: ["nostalgic retro pop", "80s classic hits"],
  romantic: ["romantic r&b", "slow love songs"],
  spooky: ["dark halloween eerie", "haunting ambient"],
  indie: ["indie rock alternative", "indie pop"],
  soft: ["soft acoustic gentle", "mellow indie"],
  loud: ["loud rock intense", "high energy"],
  quiet: ["quiet acoustic", "soft ambient"],
  boss: ["powerful confident", "boss hip hop"],
  summer: ["summer pop upbeat", "beach tropical"],
  winter: ["winter acoustic cozy", "cold ambient"],
  love: ["love songs romantic", "r&b slow"],
  workout: ["workout hype", "pump up edm"],
};

function getKeywords(vibe) {
  const normalized = vibe.trim().toLowerCase();

  // 1. Exact match
  if (VIBE_MAP[normalized]) return VIBE_MAP[normalized];
  if (SLANG_MAP[normalized]) return SLANG_MAP[normalized];

  // 2. Partial match — check both maps
  for (const map of [VIBE_MAP, SLANG_MAP]) {
    for (const [key, keywords] of Object.entries(map)) {
      if (normalized.includes(key) || key.includes(normalized)) return keywords;
    }
  }

  // 3. Word-level expansion for unknown inputs
  const words = normalized.split(/\s+/).filter((w) => w.length > 2);
  const expanded = new Set();
  for (const word of words) {
    if (WORD_EXPAND[word]) {
      WORD_EXPAND[word].forEach((k) => expanded.add(k));
    }
  }
  const result =
    expanded.size > 0 ? [...expanded] : ["chill", "ambient", "indie"];

  return [...new Set(result)].slice(0, 4);
}

function normalizeTitle(title = "") {
  return title
    .toLowerCase()
    .replace(
      /\s*[\(\[][^\)\]]*(remix|live|version|edit|acoustic|remaster|remastered|instrumental|cover|demo|mix|radio|feat\.?|ft\.?)[^\)\]]*[\)\]]/gi,
      "",
    )
    .replace(/\s+/g, " ")
    .trim();
}

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

async function fetchSongs(keyword) {
  const url = `https://itunes.apple.com/search?term=${encodeURIComponent(keyword)}&media=music&entity=song&limit=10`;
  const res = await fetch(url);
  const data = await res.json();
  return data.results || [];
}

app.post("/api/playlist", async (req, res) => {
  const { vibe } = req.body;

  if (!vibe || !vibe.trim()) {
    return res.status(400).json({ error: "Vibe is required" });
  }

  try {
    const keywords = getKeywords(vibe);

    // Fetch all keywords in parallel
    const results = await Promise.all(keywords.map(fetchSongs));
    const allTracks = results.flat();

    // Deduplicate by trackId, then by normalized title
    const seenIds = new Set();
    const seenTitles = new Set();
    const unique = allTracks.filter((t) => {
      if (!t.trackId || seenIds.has(t.trackId)) return false;
      const titleKey = normalizeTitle(t.trackName);
      if (seenTitles.has(titleKey)) return false;
      seenIds.add(t.trackId);
      seenTitles.add(titleKey);
      return true;
    });

    // Shuffle first so we don't always pick from the same keyword's results
    // then keep only one song per artist
    const artistSeen = new Set();
    const varied = shuffle(unique).filter((t) => {
      const artist = t.artistName?.toLowerCase().trim();
      if (!artist || artistSeen.has(artist)) return false;
      artistSeen.add(artist);
      return true;
    });

    if (varied.length === 0) {
      return res
        .status(404)
        .json({ error: "No songs found for this vibe. Try something else!" });
    }

    const songs = varied.slice(0, 5).map((t) => ({
      title: t.trackName,
      artist: t.artistName,
      album: t.collectionName || "",
      artwork: t.artworkUrl100
        ? t.artworkUrl100.replace("100x100", "300x300")
        : "",
    }));

    const label =
      vibe.trim().charAt(0).toUpperCase() + vibe.trim().slice(1).toLowerCase();

    res.json({
      playlistName: `${label} Vibes`,
      description: `The perfect soundtrack for your ${vibe.trim().toLowerCase()} mood.`,
      songs,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong. Please try again." });
  }
});

app.listen(3001, () => console.log("Server running on http://localhost:3001"));
