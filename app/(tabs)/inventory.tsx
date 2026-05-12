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

import { useInventoryStore } from "@/store/inventoryStore";

import {
  getInventorySnapshots,
  type InventorySnapshot,
} from "@/services/inventorySnapshotService";

export default function Inventory() {
  // create search
  const [searchText, setSearchText] = useState("");

  // craate view types
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // this would control how inventory is sorted
  const [sortBy, setSortBy] = useState<"name" | "price" | "quantity">("name");

  // this would be for sorting options for dropdown
  const [sortOpen, setSortOpen] = useState(false);

  // stores all historical inventory snapshots (1day, 1week, 1month, 3months, etc.)
  const [snapshots, setSnapShots] = useState<InventorySnapshot[]>([]);

  // check if open/click box
  const [changeModalOpen, setChangeModalOpen] = useState(false);
  const [selectedRange, setSelectedRange] = useState<
    "1D" | "1W" | "1M" | "6M" | "MAX"
  >("MAX");

  // updated inventory store with Zustand
  const inventory = useInventoryStore((state) => state.inventory);
  const loadInventory = useInventoryStore((state) => state.loadInventory);

  // this help change the % when quantity or price changes for FocusEffect
  // const inventorySignature = inventory
  //   .map((item) => `${item.cardId}-${item.quantity}-${item.marketPrice}`)
  //   .join("|");

  // HELPER FUNCTION FOR GRAPH AND TIME DATE
  function getRangeStartDate(range: "1D" | "1W" | "1M" | "6M" | "MAX") {
    const now = new Date();

    if (range === "1D") {
      now.setDate(now.getDate() - 1);
    }

    if (range === "1W") {
      now.setDate(now.getDate() - 7);
    }

    if (range === "1M") {
      now.setMonth(now.getDate() - 1);
    }

    if (range === "6M") {
      now.setMonth(now.getDate() - 6);
    }

    // return date
    return now;
  }

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

  useFocusEffect(
    useCallback(() => {
      async function loadData() {
        await loadInventory();

        // load saved inventory snapshots
        const savedSnapshots = await getInventorySnapshots();

        setSnapShots(savedSnapshots);
      }

      loadData();
    }, [loadInventory]),
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

  // sort snapshots
  const sortedSnapshots = [...snapshots].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
  );

  // this would be oldest saved snapshot (baseline = oldest)
  // const baselineSnapshot = snapshots.find(
  //   (snapshot) => snapshot.totalValue > 0,
  // );
  const baselineSnapshot =
    selectedRange === "MAX"
      ? sortedSnapshots.find((snapshot) => snapshot.totalValue > 0)
      : sortedSnapshots.find(
          (snapshot) =>
            new Date(snapshot.createdAt).getTime() >=
              getRangeStartDate(selectedRange).getTime() &&
            snapshot.totalValue > 0,
        );

  // original portfolio value
  const baselineValue = baselineSnapshot?.totalValue ?? 0;

  // dollar change
  const valueChange = totalValue - baselineValue;

  // CALCULATE percentage change
  const percentageChange =
    baselineValue > 0 ? (valueChange / baselineValue) * 100 : 0;

  // DETERMINES if change is green or red
  const isPositiveChange = valueChange >= 0;

  // console.log("Snapshots: ", snapshots);
  // console.log("Baseline:", baselineValue);
  // console.log("Total:", totalValue);
  // console.log("Change:", percentageChange);

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
            <Text
              style={styles.statValue}
              numberOfLines={1}
              adjustsFontSizeToFit
              minimumFontScale={0.65}
            >
              {totalCards}
            </Text>
            <Text style={styles.statLabel}> Cards </Text>
          </View>

          {/** TOTAL VALUE */}
          <View style={styles.statBox}>
            <Text style={styles.statLogo}>
              <AntDesign name="dollar-circle" size={24} color="#854FD5" />{" "}
            </Text>
            <Text
              style={styles.statValue}
              numberOfLines={1}
              adjustsFontSizeToFit
              minimumFontScale={0.55}
            >
              ${totalValue.toFixed(2)}
            </Text>
            <Text style={styles.statLabel}> Total Value </Text>
          </View>

          {/* <View style={styles.statBox}>
            <Text style={styles.statValue}>
              <FontAwesome5 name="chart-line" size={24} color="#854FD5" />
            </Text>
            <Text style={styles.statValue}> 12.4% </Text>
            <Text style={styles.statLabel}> Change </Text>
          </View> */}

          <Pressable
            style={styles.statBox}
            onPress={() => setChangeModalOpen(true)}
          >
            <Text style={styles.statValue}>
              <FontAwesome5 name="chart-line" size={24} color="#854FD5" />
            </Text>

            <Text
              style={[
                styles.statValue,
                {
                  color: isPositiveChange ? "#4ADE80" : "#FF6B6B",
                },
              ]}
              numberOfLines={1}
              adjustsFontSizeToFit
              minimumFontScale={0.55}
            >
              {isPositiveChange ? "+" : ""}
              {percentageChange.toFixed(1)}%
            </Text>

            <Text style={styles.statLabel}> Change </Text>

            <Text
              style={[
                styles.changeDollarText,
                {
                  color: isPositiveChange ? "#4ADE80" : "#FF6B6B",
                },
              ]}
              numberOfLines={1}
              adjustsFontSizeToFit
              minimumFontScale={0.7}
            >
              {isPositiveChange ? "+" : "-"}${Math.abs(valueChange).toFixed(2)}
            </Text>
          </Pressable>
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

        {/** THIS IS THE GRAPH SECTION OF THE PAGE */}
        {changeModalOpen && (
          <View style={styles.bottomSheetOverlay}>
            <Pressable
              style={styles.bottomSheetBackdrop}
              onPress={() => setChangeModalOpen(false)}
            />

            {/** POP UP SECTION TITLE AND BUTTONS */}
            <View style={styles.bottomSheet}>
              <Text style={styles.bottomSheetTitle}> Portfolio Change </Text>

              <View style={styles.rangeRow}>
                {(["1D", "1W", "1M", "6M", "MAX"] as const).map((range) => (
                  <Pressable
                    key={range}
                    style={[
                      styles.rangeButton,
                      selectedRange === range && styles.activeRangeButton,
                    ]}
                    onPress={() => setSelectedRange(range)}
                  >
                    <Text style={styles.rangeButtonText}>{range}</Text>
                  </Pressable>
                ))}
              </View>

              <Text
                style={[
                  styles.sheetChangeText,
                  { color: isPositiveChange ? "#4ADE80" : "#FF6B6B" },
                ]}
              >
                {isPositiveChange ? "+" : "-"} $
                {Math.abs(valueChange).toFixed(2)}{" "}
                {selectedRange === "MAX" ? "all time" : `in ${selectedRange}`}
              </Text>

              <Text
                style={[
                  styles.sheetPercentText,
                  { color: isPositiveChange ? "#4ADE80" : "#FF6B6B" },
                ]}
              >
                {isPositiveChange ? "+" : ""}
                {percentageChange.toFixed(1)}%
              </Text>
            </View>
          </View>
        )}
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
    borderColor: "rgba(133, 79, 213, 0.20)", // rgba(255, 255, 255, 0.1)
    backgroundColor: "rgba(38, 38, 38, 0.20)", // rgba(133, 79, 213, 0.28)
    borderRadius: 18,
    padding: 13, // change height
    borderWidth: 2,

    minHeight: 105,
    justifyContent: "center",
    alignItems: "center",
  },

  statLogo: {
    textAlign: "center",
  },

  statValue: {
    color: "#FFF",
    textAlign: "center",
    fontSize: 20,
    fontWeight: "800",
    width: "100%",
  },

  statLabel: {
    color: "rgba(158, 158, 158, 0.87)",
    textAlign: "center",
    fontWeight: "400",
    marginTop: 2,
  },

  changeDollarText: {
    fontSize: 12,
    fontWeight: "700",
    marginTop: 3,
    textAlign: "center",
    width: "100%",
  },

  // THIS WOULD BE FOR BOTTOM POP UP SECTION FOR GRAPH
  bottomSheetOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "flex-end",
    zIndex: 100,
  },

  bottomSheetBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.45)",
  },

  bottomSheet: {
    backgroundColor: "rgba(20, 20, 24, 0.98)",
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    padding: 22,
    borderWidth: 1,
    borderColor: "rgba(133, 79, 213, 0.35)",
  },

  bottomSheetTitle: {
    color: "#FFF",
    fontSize: 20,
    fontWeight: "800",
    textAlign: "center",
    marginBottom: 18,
  },

  rangeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 22,
  },

  rangeButton: {
    paddingVertical: 10,
    paddingHorizontal: 13,
    borderRadius: 14,
    backgroundColor: "rgba(255, 255, 255, 0.08)",
  },

  activeRangeButton: {
    backgroundColor: "#854FD5",
  },

  rangeButtonText: {
    color: "#FFF",
    fontSize: 13,
    fontWeight: "800",
  },

  sheetChangeText: {
    textAlign: "center",
    fontSize: 20,
    fontWeight: "800",
  },

  sheetPercentText: {
    textAlign: "center",
    fontSize: 34,
    fontWeight: "900",
    marginTop: 6,
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
