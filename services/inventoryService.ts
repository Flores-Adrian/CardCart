// import async storage
import AsyncStorage from "@react-native-async-storage/async-storage";
// import pokemon card type
import type { PokemonCard } from "@/services/pokemonApi";

// this is the key name that is used to save inventory in local phone storage
const INVENTORY_KEY = "cardcart_inventory";

// shape of each saved inventory item
export type InventoryItem = {
  id: string;
  cardId: string;
  name: string;
  imageUrl?: string;
  setName?: string;
  rarity?: string;
  marketPrice?: number;
  quantity: number;
};

// get best available current market price for the card
function getMarketPrice(card: PokemonCard) {
  return (
    card.tcgplayer?.prices?.holofoil?.market ??
    card.tcgplayer?.prices?.reverseHolofoil?.market ??
    card.tcgplayer?.prices?.normal?.market ??
    card.tcgplayer?.prices?.["1stEditionHolofoil"]?.market ??
    card.tcgplayer?.prices?.["1stEditionNormal"]?.market ??
    0
  );
}

// Load inventory from local storage
export async function getInventory(): Promise<InventoryItem[]> {
  const storedInventory = await AsyncStorage.getItem(INVENTORY_KEY);

  // if inventory empty then we just return empty array
  if (!storedInventory) {
    return [];
  }

  // return json inventory
  return JSON.parse(storedInventory);
}

// save full inventory array to local storage
export async function saveInventory(items: InventoryItem[]) {
  await AsyncStorage.setItem(INVENTORY_KEY, JSON.stringify(items));
}

// Add card to inventory
export async function addCardToInventory(card: PokemonCard) {
  // get saved inventory
  const inventory = await getInventory();

  // check if the card that we're adding is already in our inventory
  const existingCard = inventory.find((item) => item.cardId === card.id);

  // if card DOES EXIST
  if (existingCard) {
    // increase card quantity by 1
    const updatedInventory = inventory.map((item) =>
      item.cardId === card.id ? { ...item, quantity: item.quantity + 1 } : item,
    );

    // save udpated quantity
    await saveInventory(updatedInventory);
    return updatedInventory;
  }

  // if card DOESN'T EXIST YET, create new inventory item
  const newItem: InventoryItem = {
    id: `${card.id} - ${Date.now()}`,
    cardId: card.id,
    name: card.name,
    imageUrl: card.images?.small,
    setName: card.set?.name,
    rarity: card.rarity,
    marketPrice: getMarketPrice(card),
    quantity: 1,
  };

  // update inventory with new card we  made
  const updatedInventory = [...inventory, newItem];

  await saveInventory(updatedInventory);

  return updatedInventory;
}
