import AppButton from "@/components/AppButton";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import {
    ImageBackground,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState("");

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require("@/assets/images/Main_Login_BG.png")}
        resizeMode="cover"
        style={styles.imgBackground}
      >
        <Pressable
          style={styles.backButton}
          onPress={() => router.replace("/logIn")}
        >
          <Ionicons name="chevron-back" size={28} color="#FFF" />
        </Pressable>

        <Text style={styles.title}> Forgot your Password? </Text>
        <Text style={styles.titleInstruction}> No worries! It happens. </Text>
        <Text style={styles.titleInstruction}>
          If the account exists for this email, you will receive a password
          reset link shortly.
        </Text>

        <Text style={styles.inputTitle}> Email </Text>

        <TextInput
          style={styles.textBox}
          placeholder="Enter Email..."
          placeholderTextColor="#676767"
          onChangeText={setEmail}
          value={email}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <AppButton
          title="Continue"
          onPress={() => router.replace("/(tabs)/mainMenu")}
        />
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

  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
  },

  title: {
    color: "#FFF",
    fontSize: 32,
    fontWeight: "700",
    textAlign: "center",
  },

  titleInstruction: {
    color: "rgba(158, 158, 158, 0.87)",
    fontSize: 15,
    fontWeight: "600",
    marginTop: 8,
    textAlign: "center",
    alignSelf: "center",
    width: 292,
  },

  inputTitle: {
    color: "#FFF",
    fontSize: 14,
    fontWeight: "700",
    marginTop: 20,
    marginLeft: 10,
    marginBottom: 8,
  },

  textBox: {
    width: "100%",
    height: 58,
    color: "#FFF",
    borderRadius: 18,
    backgroundColor: "rgba(52, 52, 52, 0.8)",
    paddingHorizontal: 18,
    fontSize: 16,
    marginBottom: 20,
  },
});
