// PERSONAL NOTE: ZUSTAND?
// - it's a shared storage box that all screens are using separate routes so it
// would be better than passing props around
// (STILL NEED TO SWTICH asyncStorage to Supbase/Firebase)

// import zustand
import { create } from "zustand";

import type { PokemonCard } from "@/services/pokemonApi";

import {
    addCardToInventory,
    decreaseCardQuantity,
    getInventory,
    increaseCardQuantity,
    type InventoryItem,
} from "@/services/inventoryService";

// create values for Zustand and what we will be retreiving
type InventoryStore = {
  inventory: InventoryItem[];
  loadInventory: () => Promise<void>;
  addCard: (card: PokemonCard) => Promise<void>;
  increaseCard: (card: string) => Promise<void>;
  decreaseCard: (card: string) => Promise<void>;
  getQuantity: (cardId: string) => number;
};

// create function to be able to give a value for each object in InventoryStore
export const useInventoryStore = create<InventoryStore>((set, get) => ({
  // create inventory
  inventory: [],

  loadInventory: async () => {
    const saveInventory = await getInventory();
    set({ inventory: saveInventory });
  },

  addCard: async (card) => {
    const updatedInventory = await addCardToInventory(card);
    set({ inventory: updatedInventory });
  },

  increaseCard: async (cardId) => {
    const updatedInventory = await increaseCardQuantity(cardId);
    set({ inventory: updatedInventory });
  },

  decreaseCard: async (cardId) => {
    const updatedInventory = await decreaseCardQuantity(cardId);
    set({ inventory: updatedInventory });
  },

  getQuantity: (cardId) => {
    const item = get().inventory.find((card) => card.cardId === cardId);
    return item?.quantity ?? 0;
  },
}));
