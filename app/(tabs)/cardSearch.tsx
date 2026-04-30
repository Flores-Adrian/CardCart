// Import API function + card type
import { searchPokemonCards, type PokemonCard } from "@/services/pokemonApi";
import { Ionicons } from "@expo/vector-icons";

// React hook for storing live data
import { useState } from "react";

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
  // This is for what users type in search box
  const [searchText, setSearchText] = useState("");

  // Store cards from API
  const [cards, setCards] = useState<PokemonCard[]>([]);

  // Loading spinner state
  const [loading, setLoading] = useState(false);

  // Error Message status
  const [errorMessage, setErrorMessage] = useState("");

  // create function for when the user clicks the search button
  const handleSearch = async () => {
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
        <Text style={styles.title}> CARD SEARCH </Text>

        {/* <View style={styles.searchBoxWithGlass}> */}
        <TextInput
          style={styles.searchBox}
          placeholder="Search for any card!"
          placeholderTextColor="#777"
          value={searchText}
          onChangeText={setSearchText}
          autoCapitalize="none"
        />

        {/* * Serach Button
          <Pressable onPress={handleSearch}>
            <Ionicons name={"search"} size={24} color={"#FFF"} />
          </Pressable>
        </View> */}

        {/** Search Button */}
        <Pressable style={styles.searchButton} onPress={handleSearch}>
          <Text style={styles.searchButtonText}> Search </Text>
        </Pressable>

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
              {/** Card Image */}
              {card.images?.small && (
                <Image
                  source={{ uri: card.images.small }}
                  style={styles.cardImage}
                  resizeMode="contain"
                />
              )}

              {/** GET CARD INFO */}
              <View style={styles.cardInfo}>
                <Text style={styles.cardName}>{card.name}</Text>

                <Text style={styles.cardDetail}>{card.set?.name}</Text>

                <Text style={styles.cardDetail}>
                  {card.rarity ?? "No rarity listed"}
                  <Text style={styles.cardDetail}> • #{card.number}</Text>
                </Text>

                <Text style={styles.cardPriceStats}>
                  $
                  {card.tcgplayer?.prices?.holofoil?.market ??
                    card.tcgplayer?.prices?.reverseHolofoil?.market ??
                    card.tcgplayer?.prices?.normal?.market ??
                    card.tcgplayer?.prices?.["1stEditionHolofoil"]?.market ??
                    card.tcgplayer?.prices?.["1stEditionNormal"]?.market ??
                    "missing"}
                  <Text> QNTY: 0 </Text>
                </Text>

                {/** BUTTON TO ADD TO COLLECTION */}
                <Pressable style={styles.addToCollectionButton}>
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

  title: {
    color: "#FFF",
    fontSize: 30,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 24,
  },

  searchBoxWithGlass: {
    width: "100%",
    height: 58,
    borderRadius: 18,
    backgroundColor: "rgba(52, 52, 52, 0.8)",
    paddingHorizontal: 4,
    flexDirection: "row",
    alignItems: "center",
  },

  searchBox: {
    width: "100%",
    height: 56,
    borderRadius: 18,
    backgroundColor: "rgba(52, 52, 52, 0.85)",
    color: "#FFF",
    paddingHorizontal: 18,
    fontSize: 16,
    marginBottom: 14,
  },

  // searchBox: {
  //   flex: 1,
  //   color: "#FFF",
  //   fontSize: 16,
  // },

  searchButton: {
    height: 54,
    borderRadius: 18,
    backgroundColor: "#854FD5",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
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
    marginBottom: 2,
    marginTop: 10,
    textAlign: "center",
    alignSelf: "center",
  },
});
