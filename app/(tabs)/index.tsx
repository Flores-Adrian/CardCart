import { Image, ImageBackground, StyleSheet, Text, View } from "react-native";

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <ImageBackground
        source={require("@/assets/images/Main_Login_BG.png")}
        resizeMode="cover"
        style={styles.imgBackground}
      >
        <Image
          source={require("@/assets/images/Main_Logo.png")}
          style={styles.logo}
          resizeMode="contain"
        ></Image>
        <Text style={styles.title}>
          Card
          <Text style={styles.purpleTitle}>Cart</Text>
        </Text>
        <Text style={styles.subtitle}> Run your table like a pro! </Text>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  imgBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  logo: {
    alignItems: "center",
    width: 79.418,
    height: 73.581,
  },
  container: {
    flex: 1,
    backgroundColor: "black",
    color: "#FFF",
  },
  title: {
    color: "#FEFDFE",
    textAlign: "center",
    fontFamily: "SF Pro Rounded",
    fontSize: 40,
    fontWeight: "700",
    lineHeight: 47.729,
    letterSpacing: 4.8,
  },
  purpleTitle: {
    color: "#854FD5",
  },
  subtitle: {
    color: "#FFF",
    textAlign: "center",
    fontSize: 30,
    fontWeight: "500",
    lineHeight: 38.199,
    letterSpacing: 3.84,
    width: 261,
    height: 82,
    marginTop: 12,
  },
});
