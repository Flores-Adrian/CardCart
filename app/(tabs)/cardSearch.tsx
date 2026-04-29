// Import API function + card type
import { searchPokemonCards, type PokemonCard } from "@/services/pokemonApi";

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

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require("@/assets/images/NEW_BACKDROP.png")}
        resizeMode="cover"
        style={styles.imgBackground}
      >
        <Text style={styles.title}> CARD SEARCH </Text>

        <TextInput
          style={styles.searchBox}
          placeholder="Search for any card!"
          placeholderTextColor="#777"
          value={searchText}
          onChangeText={setSearchText}
          autoCapitalize="none"
        />

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
                </Text>

                <Text style={styles.cardDetail}>#{card.number}</Text>
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

  searchButton: {
    height: 54,
    borderRadius: 18,
    backgroundColor: "#854FD5",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
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
    //flexDirection: "row",
    //flexWrap: "wrap",
  },

  cardItem: {
    //flexDirection: "column",
    flexDirection: "row",
    backgroundColor: "rgba(20, 20, 24, 0.75)",
    borderRadius: 18,
    padding: 12,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },

  cardImage: {
    width: 82,
    height: 115,
    marginRight: 14,
  },

  cardInfo: {
    flex: 1,
    justifyContent: "center",
  },

  cardName: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 6,
  },

  cardDetail: {
    color: "rgba(255, 255, 255, 0.7)",
    fontSize: 13,
    marginBottom: 3,
  },
});
