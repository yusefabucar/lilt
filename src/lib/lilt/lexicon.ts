export type LexGuess = {
  region: string;
  locality: string;
  country: string;
  confidence: number;
  cues: string[];
  hits: string[];
};

type Profile = {
  id: string;
  region: string;
  locality: string;
  country: string;
  terms: string[];
  cues: string[];
};

const PROFILES: Profile[] = [
  {
    id: "east-london",
    region: "Greater London",
    locality: "East London, England",
    country: "United Kingdom",
    terms: ["innit", "bruv", "mandem", "endz", "peng", "bare ", "allow it", "you get me", "wagwan", "safe ", "blud"],
    cues: ["MLE / inner-East London lexicon", "question tag innit", "bruv / mandem address"],
  },
  {
    id: "london",
    region: "Greater London",
    locality: "London, England",
    country: "United Kingdom",
    terms: ["mate", "bloody", "quid", "knackered", "cheers", "queue", "gutted", "proper", "lift", "lorry"],
    cues: ["Southern British vocabulary", "mate / bloody / quid"],
  },
  {
    id: "north-england",
    region: "Northern England",
    locality: "Manchester / Leeds belt, England",
    country: "United Kingdom",
    terms: ["nowt", "owt", "aye", "our kid", "ta ", "dead good", "mither", "ginnel"],
    cues: ["Northern English function words", "aye / nowt"],
  },
  {
    id: "scotland",
    region: "Scotland",
    locality: "Glasgow / Central Belt, Scotland",
    country: "United Kingdom",
    terms: ["wee ", "ken ", "bairn", "aye", "cannae", "dinnae", "bonnie", "lass", "messages"],
    cues: ["Scots lexicon", "wee / ken / cannae"],
  },
  {
    id: "ireland",
    region: "Ireland",
    locality: "Dublin, Ireland",
    country: "Ireland",
    terms: ["grand", "craic", "yer man", "yoke", "banter", "sure look", "cop on", "the jack"],
    cues: ["Irish English discourse markers", "grand / craic"],
  },
  {
    id: "nyc",
    region: "New York / New Jersey",
    locality: "East Brooklyn, New York City",
    country: "United States",
    terms: ["deadass", "youse", "bodega", "mad ", "on god", "the city", "schlep", "wait on line", "brick", "guap"],
    cues: ["NYC intensifiers and street lexicon", "deadass / bodega"],
  },
  {
    id: "boston",
    region: "New England",
    locality: "Boston, Massachusetts",
    country: "United States",
    terms: ["wicked", "bubbler", "packie", "the cape", "rotary", "bang a uey", "dunks", "southie", "pahk", "harvard yard"],
    cues: ["Eastern New England lexicon", "wicked as intensifier"],
  },
  {
    id: "south-florida",
    region: "American South",
    locality: "South Florida",
    country: "United States",
    terms: ["bro ", "miami", "the 305", "i-95", "cafecito", "the keys", "alligators", "hurricane"],
    cues: ["South Florida reference frame", "305 / cafecito"],
  },
  {
    id: "deep-south",
    region: "American South",
    locality: "Birmingham, Alabama",
    country: "United States",
    terms: ["y'all", "yall", "ain't", "fixin", "fixing to", "reckon", "yonder", "might could", "coke", "bless your heart", "over yonder"],
    cues: ["Southern American second-person and aspect", "y'all / fixin' to"],
  },
  {
    id: "texas",
    region: "American South",
    locality: "Houston / East Texas",
    country: "United States",
    terms: ["howdy", "y'all", "fixin", "coke", "the woodlands", "h-town", "bless your heart"],
    cues: ["Texas Southern address", "howdy / y'all"],
  },
  {
    id: "philly",
    region: "Mid-Atlantic US",
    locality: "Philadelphia, Pennsylvania",
    country: "United States",
    terms: ["jawn", "hoagie", "youse", "wooder", "the shore", "wit ", "wiz"],
    cues: ["Philadelphia lexicon", "jawn / hoagie"],
  },
  {
    id: "midwest",
    region: "US Midwest",
    locality: "Chicago, Illinois",
    country: "United States",
    terms: ["ope", "you betcha", "pop ", "gym shoes", "front room", "the lake", "da bears"],
    cues: ["Inland North / Midwest tells", "ope / pop"],
  },
  {
    id: "socal",
    region: "US West Coast",
    locality: "Los Angeles, California",
    country: "United States",
    terms: ["hella", "the 405", "the 101", "dude", "like totally", "freeway", "in-n-out"],
    cues: ["California freeway names and dude/hella"],
  },
  {
    id: "canada",
    region: "Canada",
    locality: "Toronto, Ontario",
    country: "Canada",
    terms: ["eh", "toque", "washroom", "double-double", "sorry", "ked", "loonie", "hydro"],
    cues: ["Canadian English markers", "eh / washroom / toque"],
  },
  {
    id: "australia",
    region: "Australia",
    locality: "Sydney, Australia",
    country: "Australia",
    terms: ["arvo", "yeah nah", "servo", "brekkie", "mate", "heaps", "reckon", "no worries", "ute"],
    cues: ["Australian clipping and yeah-nah"],
  },
  {
    id: "nz",
    region: "New Zealand",
    locality: "Auckland, New Zealand",
    country: "New Zealand",
    terms: ["chur", "sweet as", "jandals", "bach", "dairy", "bro"],
    cues: ["NZ English particles", "chur / sweet as"],
  },
  {
    id: "india",
    region: "Indian English",
    locality: "Mumbai / urban India",
    country: "India",
    terms: ["yaar", "na ", "only", "kindly", "do the needful", "prepone", "itself", "good name"],
    cues: ["Indian English discourse particles", "yaar / itself"],
  },
  {
    id: "singapore",
    region: "Singapore / Malaysia",
    locality: "Singapore",
    country: "Singapore",
    terms: ["lah", "lor", "leh", "already", "can or not", "shiok"],
    cues: ["Singlish particles", "lah / lor"],
  },
  {
    id: "nigeria",
    region: "West African English",
    locality: "Lagos, Nigeria",
    country: "Nigeria",
    terms: ["how far", "abeg", "oya", "wahala", "jare", "na wa"],
    cues: ["Nigerian English / Pidgin mix", "abeg / how far"],
  },
  {
    id: "jamaica",
    region: "Caribbean",
    locality: "Kingston, Jamaica",
    country: "Jamaica",
    terms: ["irie", "wah gwan", "bredren", "soon come", "yard", "ting"],
    cues: ["Jamaican English / Patois mix"],
  },
  {
    id: "sa",
    region: "South Africa",
    locality: "Johannesburg, South Africa",
    country: "South Africa",
    terms: ["lekker", "bru", "shame", "robot", "just now", "now now", "is it"],
    cues: ["South African English", "lekker / robot"],
  },
];

function normalize(text: string): string {
  return ` ${text.toLowerCase().replace(/['’]/g, "'")} `;
}

export function guessFromText(text: string): LexGuess {
  const hay = normalize(text);
  const scored = PROFILES.map((p) => {
    const hits = p.terms.filter((t) => hay.includes(t.toLowerCase()));
    return { p, hits, score: hits.length };
  }).sort((a, b) => b.score - a.score);

  const top = scored[0];
  if (!top || top.score === 0) {
    return {
      region: "General North American",
      locality: "Unspecified U.S. English",
      country: "United States",
      confidence: 0.28,
      cues: ["No strong regional lexicon — a general guess only."],
      hits: [],
    };
  }

  const second = scored[1]?.score ?? 0;
  const margin = top.score - second;
  const confidence = Math.min(0.82, 0.38 + top.score * 0.12 + margin * 0.08);

  return {
    region: top.p.region,
    locality: top.p.locality,
    country: top.p.country,
    confidence,
    cues: top.p.cues.slice(0, 3),
    hits: top.hits,
  };
}

export const DIAGNOSTIC_LINES = [
  "I can't park the car near the yard after a long bath, but I caught a lot of coffee downtown.",
  "Tell me what you had for breakfast and how you got here this morning.",
  "The thought of walking up there still makes me laugh, honestly.",
];
