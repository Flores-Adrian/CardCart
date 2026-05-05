import {
  formatCardName,
  getPokemonCardById,
  type PokemonCard,
} from "@/services/pokemonApi";
import { Ionicons } from "@expo/vector-icons";

import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  ImageBackground,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

export default function CardExpansion() {
  // this allows us to get the dynamic route parameter
  // from (/card/[id])
  const { id } = useLocalSearchParams<{ id: string }>();

  // stroe the data fetched from card
  const [card, setCard] = useState<PokemonCard | null>(null);

  // loading state for spinner
  const [loading, setLoading] = useState(true);

  // this would run when the component loads OR [id] changes
  useEffect(() => {
    async function loadCard() {
      if (!id) return;

      try {
        // Call API to fetch full card deatils with unique ID
        const result = await getPokemonCardById(id);

        // save card into state
        setCard(result);
      } catch (error) {
        console.log("Card detail screen error", error);
        setCard(null);
      } finally {
        // Stop the loading spinner
        setLoading(false);
      }
    }

    // show card
    loadCard();
  }, [id]);

  // CREATE SPINNER (while loading -> show spinner)
  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#854FD5" />
      </View>
    );
  }

  // CHECK if something went wrong
  if (!card) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}> Card not found. </Text>
      </View>
    );
  }

  // this is to allow us to get market price
  const marketPrice =
    card.tcgplayer?.prices?.holofoil?.market ??
    card.tcgplayer?.prices?.reverseHolofoil?.market ??
    card.tcgplayer?.prices?.normal?.market ??
    card.tcgplayer?.prices?.["1stEditionHolofoil"]?.market ??
    card.tcgplayer?.prices?.["1stEditionNormal"]?.market ?? // MAYBE erase this and the one above
    null;

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require("@/assets/images/NEW_BACKDROP.png")}
        resizeMode="cover"
        style={styles.imgBackground}
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          {/** BACK BUTTON */}
          <Pressable
            style={styles.backButton}
            onPress={() => router.back()} // goes back to previous screen (card search)
          >
            <Ionicons name="chevron-back" size={30} color="#FFF" />
          </Pressable>
          {/** LARD CARD IMAGE */}
          <View style={styles.cardImageBorder}>
            <Image
              source={{ uri: card.images?.large ?? card.images?.small }}
              style={styles.largeCardImage}
              resizeMode="contain"
            />
          </View>

          <View style={styles.titleNumBox}>
            <Text style={styles.cardName}>{formatCardName(card.name)}</Text>
            <Text style={styles.cardNumber}>#{card.number ?? "N/A"}</Text>
          </View>

          <View style={styles.type_set_amount_box}>
            <Text style={styles.cardDetailsText}>
              {card.rarity ?? "N/A"} •{" "}
              <Text style={styles.cardDetailsText}>
                {card.set?.name ?? "N/A"}
              </Text>
            </Text>

            <Text style={styles.cardQuantityText}>In Stock: 0</Text>
          </View>

          <View style={styles.cardQuantity}>
            <Text style={styles.cardQuantityText}>In Stock: 0</Text>
          </View>

          {/** CARD STATS */}
          <View style={styles.statBox}>
            <Text style={styles.statText}>
              Market Price:{" "}
              {marketPrice !== null
                ? `$${marketPrice.toFixed(2)}`
                : "Not Found"}
            </Text>

            {/* <Text style={styles.statText}>
              Price Updated: {card.tcgplayer?.updatedAt ?? "N/A"}
            </Text> */}
          </View>

          {/** PLACEHOLDER FOR FUTURE GRAPH */}
          {/* <View style={styles.placeholderBox}>
            <Text style={styles.placeholderTitle}> Price Graph Coming Soon</Text>
            <Text style={styles.placeholderText}>
              Later, this can be 1M / 3M / 1Y price history.
            </Text>
          </View> */}

          {/** PLACEHOLDER FOR MARKET DATA */}
          <View style={styles.placeholderBox}>
            <Text style={styles.placeholderTitle}>Listings/ Recents Sales</Text>

            <Text style={styles.placeholderText}>
              TCGplayer listings + eBay sales will require additional THINGS.
              ADD HERE:
            </Text>
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
    paddingTop: 72,
  },

  backButton: {
    width: 44,
    height: 44,
    justifyContent: "center",
    marginBottom: 10,
  },

  cardImageBorder: {
    borderWidth: 0.2,
    borderColor: "#854FD5",
    padding: 20,
    borderRadius: 30,
  },

  largeCardImage: {
    width: "100%",
    height: 300,
    alignSelf: "center",
    // borderWidth: 1,
    // borderColor: "white",
  },

  // this is the loading spinner
  centered: {
    flex: 1,
    backgroundColor: "#111",
    justifyContent: "center",
    alignItems: "center",
  },

  titleNumBox: {
    flexDirection: "row",
    justifyContent: "flex-start",
    gap: 10,
    alignItems: "baseline", // or "baseline" to touch floor
    //padding: 10,
    marginTop: 10,
    marginBottom: 2.5,
  },

  cardName: {
    color: "#FFF",
    fontSize: 25,
    fontWeight: "800",
    textAlign: "left",
  },
  cardNumber: {
    color: "#854FD5",
    fontSize: 15,
    fontWeight: "700",
  },

  type_set_amount_box: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
    marginBottom: 2.5,
  },

  cardDetailsText: {
    color: "rgba(158, 158, 158, 0.87)",
    textAlign: "center",
    fontSize: 15,
    fontWeight: "500",
  },

  cardQuantity: {
    flexDirection: "row",
    justifyContent: "flex-start",
    // gap: 10, ////only add if you add more to this line
    alignItems: "baseline",
  },

  cardQuantityText: {
    color: "#00CF30",
    fontSize: 12,
    fontWeight: "400",
  },

  statBox: {
    backgroundColor: "rgba(20, 20, 24, 0.75)",
    borderColor: "rgba(133, 79, 213, 0.20)",
    borderWidth: 3,
    borderRadius: 18,
    padding: 18,
    marginBottom: 18,
    marginTop: 15,
    alignItems: "center",
  },

  statText: {
    color: "#FFF",
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 8,
  },

  placeholderBox: {
    color: "rgba(52, 52, 52, 0.65)",
    borderRadius: 18,
    padding: 18,
    marginBottom: 18,
  },

  placeholderTitle: {
    color: "#FFF",
    fontSize: 17,
    fontWeight: "800",
    marginBottom: 8,
  },

  placeholderText: {
    color: "rgba(255, 255, 255, 0.75)",
    fontSize: 14,
    lineHeight: 20,
  },

  errorText: {
    color: "#FF6B6B",
    fontSize: 16,
    fontWeight: "700",
  },
});
