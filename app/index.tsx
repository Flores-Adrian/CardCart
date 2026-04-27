import { router } from "expo-router";
import { useEffect } from "react";
import { Image, ImageBackground, StyleSheet, Text, View } from "react-native";

export default function SplashScreen() {
  // THIS IS SAMPLE SPLASH SCREEN
  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace("/intro"); // this can later be changed to a different directory if needed
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  // this is the main background for splash screen
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
        />

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
