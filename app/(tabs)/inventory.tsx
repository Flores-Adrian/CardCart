import { getInventory, type InventoryItem } from "@/services/inventoryService";
import { AntDesign, Feather, FontAwesome5, Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import {
  Image,
  ImageBackground,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

export default function Inventory() {
  // stores all cards saved in local inventory
  const [inventory, setInventory] = useState<InventoryItem[]>([]);

  // create search
  const [searchText, setSearchText] = useState("");

  // craate view types
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // this would control how inventory is sorted
  const [sortBy, setSortBy] = useState<"name" | "price" | "quantity">("name");

  // this would be for sorting options for dropdown
  const [sortOpen, setSortOpen] = useState(false);

  // makes sorting easier for dropdown with this
  const sortOptions: {
    label: string;
    value: "name" | "price" | "quantity";
  }[] = [
    { label: "Name A-Z", value: "name" },
    { label: "Highest Price", value: "price" },
    { label: "Highest Quantity", value: "quantity" },
  ];

  const getSortLabel = (value: "name" | "price" | "quantity") => {
    return (
      sortOptions.find((option) => option.value === value)?.label ?? "Name A-Z"
    );
  };

  // this would run everytime the user opens this tab/screen
  useFocusEffect(
    useCallback(() => {
      async function loadInventory() {
        const savedInventory = await getInventory();
        setInventory(savedInventory);
      }

      loadInventory();
    }, []),
  );

  // this would filter inventory based on search input
  const filteredInventory = inventory.filter((item) =>
    item.name.toLowerCase().includes(searchText.toLowerCase()),
  );

  // this would SORT FILTERED INVENTORY
  const sortedInventory = [...filteredInventory].sort((a, b) => {
    // specificy the types of sorts we have as the options
    if (sortBy === "name") {
      return a.name.localeCompare(b.name);
    }

    if (sortBy === "price") {
      return (b.marketPrice ?? 0) - (a.marketPrice ?? 0);
    }

    if (sortBy === "quantity") {
      return b.quantity - a.quantity;
    }

    return 0;
  });

  // this is to get TOTAL NUMBER OF CARDS including quantities
  const totalCards = inventory.reduce((sum, item) => sum + item.quantity, 0);

  // GET TOTAL INVENTORY VALUE
  const totalValue = inventory.reduce(
    (sum, item) => sum + (item.marketPrice ?? 0) * item.quantity,
    0,
  );

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require("@/assets/images/Main_Login_BG.png")}
        resizeMode="cover"
        style={styles.imgBackground}
      >
        <Text style={styles.title}> Inventory </Text>
        <Text style={styles.titleDescription}> Manage your cards! </Text>

        {/** SEARCH INVENTORY */}
        <TextInput
          style={styles.searchBox}
          placeholder="Search your inventory..."
          placeholderTextColor="#777"
          value={searchText}
          onChangeText={setSearchText}
          autoCapitalize="none"
        />

        {/** INVENTORY STATS */}
        <View style={styles.statsRow}>
          {/** TOTAL CARDS */}
          <View style={styles.statBox}>
            <Text style={styles.statLogo}>
              <FontAwesome5 name="box-open" size={24} color="#854FD5" />
            </Text>
            <Text style={styles.statValue}> {totalCards} </Text>
            <Text style={styles.statLabel}> Cards </Text>
          </View>

          {/** TOTAL VALUE */}
          <View style={styles.statBox}>
            <Text style={styles.statLogo}>
              <AntDesign name="dollar-circle" size={24} color="#854FD5" />{" "}
            </Text>
            <Text style={styles.statValue}> ${totalValue.toFixed(2)}</Text>
            <Text style={styles.statLabel}> Total Value </Text>
          </View>

          <View style={styles.statBox}>
            <Text style={styles.statValue}>
              <FontAwesome5 name="chart-line" size={24} color="#854FD5" />
            </Text>
            <Text style={styles.statValue}> 12.4% </Text>
            <Text style={styles.statLabel}> Change </Text>
          </View>
        </View>

        {/** SORT BUTTONS WITH GRID/LIST VIEW */}
        <View style={styles.controlRow}>
          <View style={styles.dropdownWrapper}>
            <Pressable
              style={styles.dropdownButton}
              onPress={() => setSortOpen(!sortOpen)}
            >
              <Text style={styles.dropdownText}>
                Sort by: {getSortLabel(sortBy)}
              </Text>
              <Ionicons
                name={sortOpen ? "chevron-up" : "chevron-down"}
                size={20}
                color="#FFF"
              />
            </Pressable>

            {/** add options available */}
            {sortOpen && (
              <View style={styles.dropdownMenu}>
                {sortOptions.map((option) => (
                  <Pressable
                    key={option.value}
                    style={styles.dropdownItem}
                    onPress={() => {
                      setSortBy(option.value);
                      setSortOpen(false);
                    }}
                  >
                    <Text style={styles.dropdownItemText}>{option.label}</Text>
                  </Pressable>
                ))}
              </View>
            )}
          </View>

          {/** Grid/List toggle */}
          <View style={styles.viewToggle}>
            <Pressable
              style={[
                styles.iconButton,
                viewMode === "grid" && styles.activeIconButton,
              ]}
              onPress={() => setViewMode("grid")}
            >
              <Feather name="grid" size={24} color="white" />
            </Pressable>

            <Pressable
              style={[
                styles.iconButton,
                viewMode === "list" && styles.activeIconButton,
              ]}
              onPress={() => setViewMode("list")}
            >
              <AntDesign name="unordered-list" size={24} color="#FFF" />
            </Pressable>
          </View>
        </View>

        {/** SORT BUTTONS */}
        {/* 
        <View style={styles.sortRow}>
          <Pressable
            style={[styles.sortButton, sortBy === "name" && styles.activeSort]}
            onPress={() => setSortBy("name")}
          >
            <Text style={styles.sortText}> Name A-Z </Text>
          </Pressable>

          <Pressable
            style={[styles.sortButton, sortBy === "price" && styles.activeSort]}
            onPress={() => setSortBy("price")}
          >
            <Text style={styles.sortText}> Price</Text>
          </Pressable>

          <Pressable
            style={[
              styles.sortButton,
              sortBy === "quantity" && styles.activeSort,
            ]}
            onPress={() => setSortBy("quantity")}
          >
            <Text style={styles.sortText}> QTY </Text>
          </Pressable>
        </View> */}

        {/** Grid/List toggle */}
        {/* <View style={styles.toggleRow}>
          <Pressable
            style={[
              styles.toggleButton,
              viewMode === "grid" && styles.activeToggle,
            ]}
            onPress={() => setViewMode("grid")}
          >
            <Feather name="grid" size={24} color="white" />
          </Pressable>

          <Pressable
            style={[
              styles.toggleButton,
              viewMode === "list" && styles.activeToggle,
            ]}
            onPress={() => setViewMode("list")}
          >
            <AntDesign name="unordered-list" size={24} color="#FFF" />
          </Pressable>
        </View> */}

        {/** DISPLAY CARD INFORMATION */}
        <ScrollView showsVerticalScrollIndicator={false}>
          {/** change view types for grid/list */}
          <View style={viewMode === "grid" ? styles.grid : undefined}>
            {sortedInventory.map((item) => (
              <View
                key={item.id}
                style={viewMode === "grid" ? styles.gridItem : styles.listItem}
              >
                <Image
                  source={{ uri: item.imageUrl }}
                  style={
                    viewMode === "grid" ? styles.gridImage : styles.listImage
                  }
                  resizeMode="contain"
                />

                <View style={viewMode === "list" ? styles.listInfo : undefined}>
                  <Text style={styles.cardName}>{item.name}</Text>
                  <Text style={styles.cardDetail}>{item.setName}</Text>
                  <Text style={styles.cardDetail}>Qty: {item.quantity} </Text>
                  <Text style={styles.cardPrice}>
                    ${(item.marketPrice ?? 0).toFixed(2)}
                  </Text>
                </View>
                <Pressable style={styles.addToTransactionButton}>
                  <Text style={styles.addToTransactionButtonText}>
                    <Ionicons name="add" size={20} color="#FFF" />
                  </Text>
                </Pressable>
              </View>
            ))}
          </View>
        </ScrollView>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  imgBackground: {
    flex: 1,
    paddingHorizontal: 20,
    padding: 70,
  },

  title: {
    color: "#FFF",
    textAlign: "center",
    fontSize: 32,
    fontWeight: 800,
  },

  titleDescription: {
    color: "rgba(158, 158, 158, 0.67)",
    textAlign: "center",
    fontSize: 12,
    fontWeight: "400",
    marginBottom: 10,
  },

  searchBox: {
    height: 50, //56
    borderRadius: 18,
    backgroundColor: "transparent",
    color: "#FFF",
    paddingHorizontal: 18,
    fontSize: 16,
    marginBottom: 15,
    borderWidth: 2,
    borderColor: "rgba(133, 79, 213, 0.20)",
  },

  statsRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 18,
  },

  statBox: {
    flex: 1,
    //backgroundColor: "rgba(133, 79, 213, 0.28)",
    // experimental_backgroundImage:
    //   "radial-gradient(50% 50% at 50% 50%, rgba(61, 59, 59, 0.15) 0%, rgba(102, 102, 102, 0.02) 100%)",
    borderColor: "rgba(133, 79, 213, 0.20)",
    backgroundColor: "rgba(38, 38, 38, 0.20)",
    borderRadius: 18,
    padding: 13, // change height
    borderWidth: 2,
    // borderColor: "rgba(255, 255, 255, 0.1)",
  },

  statLogo: {
    textAlign: "center",
  },

  statValue: {
    color: "#FFF",
    textAlign: "center",
    fontSize: 20,
    fontWeight: "800",
  },

  statLabel: {
    color: "rgba(158, 158, 158, 0.87)",
    textAlign: "center",
    fontWeight: "400",
  },

  // this is for drop down
  controlRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    marginBottom: 18,
    zIndex: 10,
  },

  dropdownWrapper: {
    flex: 1,
    position: "relative",
    zIndex: 20,
  },

  dropdownButton: {
    height: 46,
    borderRadius: 16,
    backgroundColor: "rgba(38, 38, 38, 0.20)",
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "rgba(133, 79, 213, 0.20)", //rgba(255, 255, 255, 0.12)
  },

  dropdownText: {
    color: "rgba(158, 158, 158, 0.87)",
    fontSize: 14,
    fontWeight: "700",
  },

  dropdownMenu: {
    position: "absolute",
    top: 52,
    left: 0,
    right: 0,
    backgroundColor: "rgba(38, 38, 38, 0.90)",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(133, 79, 213, 0.20)",
    overflow: "hidden",
    zIndex: 99,
  },

  dropdownItem: {
    paddingVertical: 14,
    paddingHorizontal: 16,
  },

  dropdownItemText: {
    color: "rgba(158, 158, 158, 0.87)",
    fontSize: 14,
    fontWeight: "700",
  },

  // this is for grid/llist
  viewToggle: {
    flexDirection: "row",
    backgroundColor: "rgba(20, 20, 24, 0.7)",
    borderRadius: 16,
    padding: 4,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.12)",
    marginBottom: 10,
  },

  iconButton: {
    width: 38,
    height: 38,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },

  activeIconButton: {
    backgroundColor: "#854FD5",
  },

  sortRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 12,
  },

  sortButton: {
    flex: 1,
    height: 38,
    borderRadius: 14,
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    justifyContent: "center",
    alignContent: "center",
  },

  activeSort: {
    backgroundColor: "#854FD5",
  },

  sortText: {
    color: "#FFF",
    fontSize: 12,
    fontWeight: "700",
    textAlign: "center",
  },

  toggleRow: {
    flexDirection: "row",
    backgroundColor: "rgba(20, 20, 24, 0.7)",
    borderRadius: 18,
    padding: 5,
    marginBottom: 18,
  },

  toggleButton: {
    flex: 1,
    height: 42,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },

  activeToggle: {
    backgroundColor: "#854FD5",
  },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },

  gridItem: {
    width: "48%",
    //backgroundColor: "rgba(20, 20, 24, 0.75)",
    backgroundColor: "transparent",
    borderColor: "rgba(255, 255, 255, 0.1)",
    borderWidth: 1,
    borderRadius: 18,
    padding: 10,
    marginBottom: 14,
    alignItems: "center",
  },

  gridImage: {
    width: 120,
    height: 170,
  },

  listItem: {
    flexDirection: "row",
    // backgroundColor: "rgba(20, 20, 25, 0.75)",
    backgroundColor: "transparent",
    borderColor: "rgba(255, 255, 255, 0.1)",
    borderWidth: 1,
    borderRadius: 18,
    padding: 12,
    marginBottom: 14,
  },

  listImage: {
    width: 78,
    height: 110,
    marginRight: 14,
  },

  listInfo: {
    flex: 1,
    justifyContent: "center",
  },

  cardName: {
    color: "#FFF",
    fontSize: 13, //15
    fontWeight: "800",
    textAlign: "center",
    marginTop: 10,
  },

  cardDetail: {
    color: "rgba(255, 255, 255, 0.7)",
    fontSize: 12,
    textAlign: "center",
    marginTop: 10,
  },

  cardPrice: {
    color: "#854FD5",
    fontSize: 15,
    fontWeight: "800",
    textAlign: "center",
    marginTop: 10,
  },

  addToTransactionButton: {
    backgroundColor: "#854FD5",
    height: 40,
    width: 40,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
  },

  addToTransactionButtonText: {
    // alignContent: "center",
  },
});
