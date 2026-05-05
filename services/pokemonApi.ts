const API_KEY = process.env.EXPO_PUBLIC_POKEMON_TCG_API_KEY;
// main website for Pokemon TCG API
const BASE_URL = "https://api.pokemontcg.io/v2";

// Create blueprint for each cardprice TYPE FOR TCGPLAYER, check docs what they mean
export type CardPrice = {
  low?: number;
  mid?: number;
  high?: number;
  market?: number;
  directlow?: number;
};

// create blueprint for each card object (this WILL HELP WITH AUTOCOMPLETE + CLEANER CODE)
export type PokemonCard = {
  // unique card id
  id: string;
  //card name
  name: string;

  // specify possible image sizes
  images?: {
    small: string;
    large: string;
  };

  // get set name (crown zenith, evolving skies, etc.)
  set?: {
    name: string;
  };

  // ex: rare, holo rare, common, etc.
  rarity?: string;

  // card number set
  number?: string;

  // artist of card
  tcgplayer?: {
    url?: string;
    updatedAt?: string;
    prices?: {
      normal?: CardPrice;
      holofoil?: CardPrice;
      reverseHolofoil?: CardPrice;
      "1stEditionHolofoil"?: CardPrice;
      "1stEditionNormal"?: CardPrice;
    };
  };

  // LIST OF SUBTYPES (basic, ex, mega, etc.)
  subtypes?: string[];
};

// allows us to FETCH A SINGLE CARD BY ID
export async function getPokemonCardById(id: string): Promise<PokemonCard> {
  // build API URL with UNIQUE ID
  const url = `${BASE_URL}/cards/${id}`;

  // Send request
  const response = await fetch(url, {
    headers: {
      "X-Api-Key": API_KEY ?? "",
    },
  });

  // handle API error
  if (!response.ok) {
    throw new Error("Failed to fetch card details.");
  }

  // convert response to JSON
  const result = await response.json();

  // ONLY return the card object
  return result.data;
}

// helps simplify/normalize  user input (charizard-ex => charizard ex FOR SEARCH)
// CONVERT user input into simple searchable words
function normalizeSearchInput(input: string) {
  return input.toLowerCase().replace(/-/g, " ").trim();
}

// check whether the user is searching for gold star cards
function isGoldStarSearch(input: string) {
  const normalized = normalizeSearchInput(input);

  return (
    normalized.includes("gold star") ||
    normalized.includes("★") ||
    normalized === "star"
  );
}

// this is just to get the pokemon names that are in the API
// EX: "pikachu gold star" -> "pikachu"
// EX: "gold star" -> ""
function getBasePokemonSearch(input: string) {
  return normalizeSearchInput(input)
    .replace(/gold star/g, "")
    .replace(/star/g, "")
    .replace(/★/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

// function to create "smarter" queries (more variaty when getting card outputs)
// this helps build a safe API query without special symbols
// "charizard ex" -> "name: charizard* name:ex*"
// "pikachu gold star" -> "pikachu"
// "gold star" -> "supertype: pokemon"
function buildNameSearchQuery(query: string) {
  const goldStarSerach = isGoldStarSearch(query);
  const baseSearch = goldStarSerach
    ? getBasePokemonSearch(query)
    : normalizeSearchInput(query);

  if (!baseSearch) {
    return "supertype:pokemon";
  }
  // return query while separating each individual word to it ("Pikachu ex") -> name: pikachu* name: ex*
  return baseSearch
    .split(" ")
    .map((word) => `name:${word}*`)
    .join(" ");
}

// FORMAT CARD NAMES HERE:
export function formatCardName(name: string) {
  return name
    .replace(/-/g, " ")
    .replace(/★/g, "Gold Star")
    .replace(/δ/g, "Delta Species")
    .replace(/\s+/g, " ")
    .trim();
}

// we filter locally by the formatted display name
// API fetches safe results first, then this filters the results locally.
function matchesFormattedName(cardName: string, userQuery: string) {
  //lowercase card name
  const formattedName = formatCardName(cardName).toLowerCase();
  //get user input
  const normalizedQuery = normalizeSearchInput(userQuery);

  if (isGoldStarSearch(userQuery)) {
    const baseSearch = getBasePokemonSearch(userQuery);

    // if user searches 'gold star' return any card with ★
    if (!baseSearch) {
      return cardName.includes("★");
    }

    // if user searches "pikachu gold star", match both pikachu and ★
    return formattedName.includes(baseSearch) && cardName.includes("★");
  }

  return formattedName.includes(normalizedQuery);
}

// export function that is reusable that can MAKE CARDS SEARCHABLE
// query = what user typed ("charizard")
export async function searchPokemonCards(
  query: string,
): Promise<PokemonCard[]> {
  // base case
  // if user enters nothing, then we return nothing
  if (!query.trim()) {
    return [];
  }

  // get our custom query
  const searchQuery = buildNameSearchQuery(query);

  // BUILD THE ACTUAL URL RQUEST
  // q=name:pikachu* means find names that start with "pikachu"
  // pageSize=12 limits results to 12 cards

  // TEMP URL
  const url = `${BASE_URL}/cards?q=${encodeURIComponent(
    searchQuery,
  )}&pageSize=250`;

  // give more results and try to sorter by higherpriced/popular cards first (allows us to search for ex, gx, etc.)
  // const url = `${BASE_URL}/cards?q=${encodeURIComponent(
  //   searchQuery,
  // )}&pageSize=50&orderBy=-tcgplayer.prices.holofoil.market`;

  // DEBUG PURPOSES, ERASE LATER
  console.log("Search Query: ", searchQuery);
  console.log("URL: ", url);

  // Make GET request to API
  const response = await fetch(url, {
    headers: {
      // Send API key in request header
      "X-Api-Key": API_KEY ?? "",
    },
  });

  // error case
  if (!response.ok) {
    const errorText = await response.text();
    console.log("API Error:", response.status, errorText);
    throw new Error("Failed to fetch Pokemon cards");
  }

  // Convert response JSON into Javascript object
  const result = await response.json();

  // get results to filter and match the formatted names, store in array (num of results we get)
  const cards = result.data as PokemonCard[];

  const filteredCards = cards.filter((card) =>
    matchesFormattedName(card.name, query),
  );

  // if the filtering works then we return results
  if (filteredCards.length > 0) {
    return filteredCards;
  }

  return cards;

  // we RETURN ONLY THE DATA ARRAY
  // return result.data;
}
