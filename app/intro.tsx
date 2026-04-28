import AppButton from "@/components/AppButton";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import {
  ImageBackground,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

export default function Intro() {
  const offersList = [
    "Fast Card Scanning",
    "Inventory Management",
    "Sales & Payments",
    "Analytics & Reports",
  ];

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require("@/assets/images/Main_Login_BG.png")}
        resizeMode="cover"
        style={styles.imgBackground}
      >
        <Text style={styles.title}>
          Everything you need to run your table like pro.
        </Text>

        {/** Bullet points here (possible customization) */}
        {offersList.map((item, index) => (
          <View key={index} style={styles.listItem}>
            <Ionicons
              name="checkmark-done"
              size={24}
              color="#854FD5"
              style={styles.bullet}
            />

            <Text style={styles.listText}>{item}</Text>
          </View>
        ))}

        {/** BUTTON... USE PRESSABLE */}
        <AppButton
          title="Get Started"
          onPress={() => router.replace("/signUp")}
          buttonStyle={styles.button}
          textStyle={styles.buttonText}
        />

        {/** Sign Up Text */}
        <Text style={styles.signUpText}>
          Already have an account?
          <Pressable
            onPress={() => router.push("/logIn")}
            style={({ pressed }) => [pressed && { opacity: 0.7 }]}
          >
            <Text style={styles.signUpTextPurple}> Login In </Text>
          </Pressable>
        </Text>
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
    //alignItems: "center",
    paddingHorizontal: 28,
    paddingTop: 72,
  },

  title: {
    color: "#FFF",
    fontSize: 36,
    fontWeight: "700",
    letterSpacing: 4.32, // 2.5
    width: 342,
    marginTop: 42,
    marginBottom: 55,
  },

  listItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 40, // space between each bullet point
  },

  listText: {
    color: "#FFF",
    fontSize: 22,
    fontWeight: "500",
    letterSpacing: 1.2,
  },

  bullet: {
    marginRight: 20, // space between bullet point and text
  },

  button: {
    marginTop: 40,
    width: 350,
    height: 58,
    backgroundColor: "#854FD5",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },

  buttonText: {
    color: "#FFF",
    fontSize: 20,
    fontWeight: 700,
    lineHeight: 23.87,
    letterSpacing: 2.4,
  },

  signUpText: {
    fontSize: 15,
    fontWeight: 700,
    lineHeight: 17.906,
    letterSpacing: 1.8,
    color: "#FFFF",
    textAlign: "center",
    width: 350,
    marginTop: 30,
  },

  signUpTextPurple: {
    color: "#854FD5",
    fontSize: 15,
    fontWeight: 700,
    lineHeight: 17.906,
    letterSpacing: 1.8,
    textAlign: "center",
    width: 350,
  },
});
