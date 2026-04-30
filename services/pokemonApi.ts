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
};

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

  // BUILD THE ACTUAL URL RQUEST
  // q=name:pikachu* means find names that start with "pikachu"
  // pageSize=12 limits results to 12 cards
  const url = `${BASE_URL}/cards?q=name:${encodeURIComponent(query)}*&pageSize=20`;

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

  // we RETURN ONLY THE DATA ARRAY
  return result.data;
}
