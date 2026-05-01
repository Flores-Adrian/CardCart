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

// helps simplify/normalize  user input (charizard-ex => charizard ex FOR SEARCH)
function normalizeSearchInput(input: string) {
  return input
    .toLowerCase()
    .replace(/-/g, " ")
    .replace(/gold star/g, "★")
    .replace(/star/g, "★")
    .replace(/\s+/g, " ")
    .trim();
}

// function to create "smarter" queries (more variaty when getting card outputs)
function buildNameSearchQuery(query: string) {
  const normalized = normalizeSearchInput(query);

  // return query while separating each individual word to it ("Pikachu ex") -> name: pikachu* name: ex*
  return normalized
    .split(" ")
    .map((word) => `name:${word}*`)
    .join(" ");
}

// FORMAT CARD NAMES HERE:
export function formatCardName(name: string) {
  return name
    .replace(/-/g, " ")
    .replace(/★/g, "Gold Star")
    .replace(/δ/g, "(Delta Species)")
    .trim();
}

// serach only main pokemon name (ex. pikachu), once results are returned, we filter locally by the formatted display name
function matchesFormattedName(cardName: string, userQuery: string) {
  //lowercase card name
  const formattedName = formatCardName(cardName).toLowerCase();
  //get user input
  const normalizedQuery = userQuery.toLowerCase().replace(/-/g, " ").trim();

  //check if card name has what user searched up
  return (
    formattedName.includes(normalizedQuery) ||
    normalizedQuery.includes(formattedName)
  );
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

  // give more results and try to sorter by higherpriced/popular cards first (allows us to search for ex, gx, etc.)
  const url = `${BASE_URL}/cards?q=${encodeURIComponent(
    searchQuery,
  )}&pageSize=50&orderBy=-tcgplayer.prices.holofoil.market`;

  // const url = `${BASE_URL}/cards?q=${encodeURIComponent(
  //   searchQuery,
  // )}&pageSize=50`;

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
