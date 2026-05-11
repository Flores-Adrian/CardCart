// Import API function + card type
import {
  formatCardName,
  searchPokemonCards,
  type PokemonCard,
} from "@/services/pokemonApi";

// updated inventory using ZUSTAND
import { useInventoryStore } from "../store/inventoryStore";

import { FontAwesome6, Ionicons } from "@expo/vector-icons";

// React hook for storing live data
import { useCallback, useState } from "react";

import { router, useFocusEffect } from "expo-router";

import {
  ActivityIndicator,
  Image,
  ImageBackground,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

export default function CardSearch() {
  // stores current inventory
  //const [inventory, setInventory] = useState<InventoryItem[]>([]);

  // This is for what users type in search box
  const [searchText, setSearchText] = useState("");

  // Store cards from API
  const [cards, setCards] = useState<PokemonCard[]>([]);

  // Loading spinner state
  const [loading, setLoading] = useState(false);

  // Error Message status
  const [errorMessage, setErrorMessage] = useState("");

  // update using inventory STORAGE USING Zustand
  const inventory = useInventoryStore((state) => state.inventory);
  const loadInventory = useInventoryStore((state) => state.loadInventory);
  const addCard = useInventoryStore((state) => state.addCard);
  const getQuantity = useInventoryStore((state) => state.getQuantity);

  // reload inventory every time screen is focused
  // useFocusEffect(
  //   useCallback(() => {
  //     async function loadInventory() {
  //       const savedInventory = await getInventory();

  //       setInventory(savedInventory);
  //     }

  //     loadInventory();
  //   }, []),
  // );

  // updated focusEffect using zustand storage --------------
  useFocusEffect(
    useCallback(() => {
      loadInventory();
    }, []),
  );

  const handleAddToInventory = async (card: PokemonCard) => {
    await addCard(card);
  };

  // get quantity of specific card in inventory
  // function getCardQuantity(cardId: string) {
  //   // check if current cardId matches with cardid from inventory
  //   const inventoryCard = inventory.find((item) => item.cardId === cardId);

  //   return inventoryCard?.quantity ?? 0;
  // }

  // this is to check if addInventory works and debug
  // const handleAddToInventory = async (card: PokemonCard) => {
  //   try {
  //     // save updated inventory
  //     const updatedInventory = await addCardToInventory(card);

  //     // immediately update UI
  //     setInventory(updatedInventory);

  //     // await addCardToInventory(card);
  //     // console.log(`${card.name} added to inventory`);
  //   } catch (error) {
  //     console.log("Failed to add card: ", error);
  //   }
  // };

  // create function for when the user clicks the search button
  const handleSearch = async () => {
    //  make try catch just to prevent from being in a loop forever/crash
    try {
      // show loading spinner
      setLoading(true);

      // Clear previous errors
      setErrorMessage("");

      // Call API helper function we made
      const results = await searchPokemonCards(searchText);

      // save returned cards into a state
      setCards(results);
    } catch (error) {
      // IF WE GET AN ERROR, show this message
      setErrorMessage("Could not load cards. Try Again!");
      console.log("Search error:", error);
    } finally {
      // Turn laoding spinner off no matter what!
      setLoading(false);
    }
  };

  // Create function TO GET PRICING OF CARD
  const getMarketPrice = (card: PokemonCard) => {
    const prices = card.tcgplayer?.prices;

    return (
      prices?.holofoil?.market ??
      prices?.normal?.market ??
      prices?.["1stEditionHolofoil"]?.market ??
      prices?.["1stEditionNormal"]?.market ??
      prices?.reverseHolofoil?.market ??
      null
    );
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require("@/assets/images/NEW_BACKDROP.png")}
        resizeMode="cover"
        style={styles.imgBackground}
      >
        {/* <View style={styles.searchBoxWithGlass}> */}
        <View style={styles.searchBox}>
          <TextInput
            style={styles.searchBoxInput}
            placeholder="Search for any card!"
            placeholderTextColor="#777"
            value={searchText}
            onChangeText={setSearchText}
            autoCapitalize="none"
          />
          <Pressable onPress={handleSearch}>
            <Ionicons name={"search"} size={24} color={"#FFF"} />
          </Pressable>
        </View>

        <View style={styles.searchOptions}>
          <Pressable style={styles.searchOptionsButton}>
            <Text style={styles.searchOptionsButtonText}>
              <Ionicons name="star" size={14} color="#FFF" /> Favorites
            </Text>
          </Pressable>
          <Pressable style={styles.searchOptionsButton}>
            <Text style={styles.searchOptionsButtonText}>
              <Ionicons name="filter" size={14} color="#FFF" /> Filter
            </Text>
          </Pressable>
          <Pressable style={styles.searchOptionsButton}>
            <Text style={styles.searchOptionsButtonText}>
              <FontAwesome6 name="sort" size={14} color="#FFF" /> Sort
            </Text>
          </Pressable>
        </View>

        {/** Search Button */}
        {/* <Pressable style={styles.searchButton} onPress={handleSearch}>
          <Text style={styles.searchButtonText}> Search </Text>
        </Pressable> */}

        {/** create loading spinner */}
        {loading && <ActivityIndicator size="large" color="#854FD5" />}

        {/** Get the error message */}
        {errorMessage ? (
          <Text style={styles.errorText}>{errorMessage}</Text>
        ) : null}

        <ScrollView
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.cardList}
        >
          {/** Now LOOP THROUGH EACH CARD THAT IS RETURNED */}
          {cards.map((card) => (
            <View key={card.id} style={styles.cardItem}>
              {/** Card Image, click to expand */}
              <Pressable
                key={card.id}
                onPress={() => router.push(`/card/${card.id}`)}
                style={({ pressed }) => [pressed && { opacity: 0.7 }]}
              >
                {card.images?.small && (
                  <Image
                    source={{ uri: card.images.small }}
                    style={styles.cardImage}
                    resizeMode="contain"
                  />
                )}
              </Pressable>

              {/** GET CARD INFO */}
              <View style={styles.cardInfo}>
                <Text style={styles.cardName}>{formatCardName(card.name)}</Text>

                <Text style={styles.cardDetail}>{card.set?.name}</Text>

                <Text style={styles.cardDetail}>
                  {card.rarity ?? "No rarity listed"}
                  <Text style={styles.cardDetail}> • #{card.number}</Text>
                </Text>

                {/* <Text style={styles.cardDetail}>
                  {card.subtypes?.join(", ") ?? "No subtype listed"}
                </Text> */}

                <Text style={styles.cardPriceStats}>
                  $
                  {card.tcgplayer?.prices?.holofoil?.market ??
                    card.tcgplayer?.prices?.reverseHolofoil?.market ??
                    card.tcgplayer?.prices?.normal?.market ??
                    card.tcgplayer?.prices?.["1stEditionHolofoil"]?.market ??
                    card.tcgplayer?.prices?.["1stEditionNormal"]?.market ??
                    "missing"}
                  <Text> QNTY: {getQuantity(card.id)}</Text>
                </Text>

                {/** BUTTON TO ADD TO COLLECTION */}
                <Pressable
                  style={[
                    styles.addToCollectionButton,

                    // if quantity > 0 -> GLOW PURPLE
                    getQuantity(card.id) > 0 && styles.activeCollectionButton,
                  ]}
                  onPress={() => handleAddToInventory(card)}
                >
                  <Text style={styles.addToCollectionButtonText}>
                    <Ionicons name="add" size={20} color="#FFF" />
                  </Text>
                </Pressable>
              </View>
            </View>
          ))}
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
    paddingTop: 70,
  },

  // title: {
  //   color: "#FFF",
  //   fontSize: 30,
  //   fontWeight: "700",
  //   textAlign: "center",
  //   marginBottom: 24,
  // },

  searchBox: {
    width: "100%",
    height: 58,
    borderRadius: 18,
    backgroundColor: "rgba(52, 52, 52, 0.85)",
    paddingHorizontal: 18,
    flexDirection: "row",
    alignItems: "center",
    fontSize: 16,
    marginBottom: 14,
  },

  searchBoxInput: {
    flex: 1,
    color: "#FFF",
    fontSize: 16,
  },

  // searchBox: {
  //   flex: 1,
  //   color: "#FFF",
  //   fontSize: 16,
  // },

  searchOptions: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 15,
  },

  searchOptionsButton: {
    height: 30,
    width: "33%",
    borderRadius: 10,
    backgroundColor: "transparent",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    borderColor: "white",
    borderWidth: 1,
  },

  searchOptionsButtonText: {
    color: "#FFF",
    fontWeight: "700",
  },

  addToCollectionButton: {
    // backgroundColor: "#2e2d32",
    backgroundColor: "transparent",
    borderColor: "#2e2d32",
    borderWidth: 1,
    marginTop: 5, // whatever is below this, KEEP AND DON'T ALTER FOR BUTTON
    height: 30,
    width: 175,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    // borderWidth: 1,
  },

  addToCollectionButtonText: {
    // borderWidth: 2,
  },

  activeCollectionButton: {
    backgroundColor: "#854FD5",

    shadowColor: "#854FD5",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.9,
    shadowRadius: 8,

    elevation: 10,
  },

  searchButtonText: {
    color: "#FFF",
    fontSize: 20,
    fontWeight: "700",
  },

  errorText: {
    color: "#FF6B6B",
    textAlign: "center",
    marginBottom: 12,
    fontWeight: "600",
  },

  cardList: {
    paddingBottom: 40,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 1, // how big we make each card (including background, img, etc.)
  },

  cardItem: {
    //flexDirection: "column-reverse",
    width: "49%", // gap  between cards (left-right)
    backgroundColor: "rgba(20, 20, 24, 0.75)",
    borderRadius: 18,
    padding: 6, // sizing of picture (less = bigger)
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
    alignItems: "center", // center image
  },

  cardImage: {
    width: "100%", // before -> 82
    aspectRatio: 2 / 3,
    borderRadius: 8,
  },

  cardInfo: {
    // justifyContent: "center",
    width: "100%", // makes sure text doesn't overflow
    alignItems: "flex-start",
  },

  cardName: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 4,
  },

  cardDetail: {
    color: "rgba(255, 255, 255, 0.7)",
    fontSize: 12,
    marginBottom: 4,
  },

  cardPriceStats: {
    color: "rgba(255, 255, 255, 0.7)",
    fontSize: 10,
    fontWeight: "500",
    marginBottom: 2,
    marginTop: 10,
    textAlign: "center",
    alignSelf: "center",
  },
});
