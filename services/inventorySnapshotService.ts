import AsyncStorage from "@react-native-async-storage/async-storage";
import type { InventoryItem } from "./inventoryService";

// storage key for all inventory snapshots
const INVENTORY_SNAPSHOTS_KEY = "cardcart_inventory_snapshots";

// Shape of each inventory snapshot
export type InventorySnapshot = {
  id: string;
  createdAt: string;
  totalValue: number;
  totalCards: number;
};

// CALCULATE total inventory VALUE
export function calculateInventoryValue(inventory: InventoryItem[]) {
  return inventory.reduce(
    (sum, item) => sum + (item.marketPrice ?? 0) * item.quantity,
    0,
  );
}

// Calculate total card quantity
export function calculateTotalCards(inventory: InventoryItem[]) {
  return inventory.reduce((sum, item) => sum + item.quantity, 0);
}

// LOAD ALL saved snapshots
export async function getInventorySnapshots(): Promise<InventorySnapshot[]> {
  // get snapshot
  const storedSnapshot = await AsyncStorage.getItem(INVENTORY_SNAPSHOTS_KEY);

  if (!storedSnapshot) {
    return [];
  }

  return JSON.parse(storedSnapshot);
}

// SAVE ALL snapshots
export async function saveInventorySnapshots(snapshots: InventorySnapshot[]) {
  await AsyncStorage.setItem(
    INVENTORY_SNAPSHOTS_KEY,
    JSON.stringify(snapshots),
  );
}

// CREATE A NEW snapshot from current inventory
export async function createInventorySnapshot(inventory: InventoryItem[]) {
  // get snapshots
  const snapshots = await getInventorySnapshots();

  // create snapshot
  const newSnapshot: InventorySnapshot = {
    id: `${Date.now()}`,
    createdAt: new Date().toISOString(),
    totalValue: calculateInventoryValue(inventory),
    totalCards: calculateTotalCards(inventory),
  };

  // update
  const updatedSnapshots = [...snapshots, newSnapshot];

  await saveInventorySnapshots(updatedSnapshots);

  return updatedSnapshots;
}
