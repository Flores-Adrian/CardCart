import AppButton from "@/components/AppButton";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
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

export default function LogInScreen() {
  // create setter for adding text
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [hidePassword, setHidePassword] = useState(true);

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require("@/assets/images/Main_Login_BG.png")}
        resizeMode="cover"
        style={styles.imgBackground}
      >
        <Text style={styles.title}>Welcome Back!</Text>
        <Text style={styles.titleInstruction}> Log in to your account</Text>

        <Text style={styles.inputTitle}> Email </Text>

        {/** TextBox for email */}
        <TextInput
          style={styles.textBox}
          placeholder="Enter Email..."
          placeholderTextColor="#676767"
          onChangeText={setEmail}
          value={email}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <Text style={styles.inputTitle}> Password </Text>

        {/** View Component for password */}
        <View style={styles.passwordBox}>
          <TextInput
            style={styles.passwordInput}
            placeholder="Enter Password..."
            placeholderTextColor="#676767"
            onChangeText={setPassword}
            value={password}
            secureTextEntry={hidePassword}
          />

          <Pressable onPress={() => setHidePassword(!hidePassword)}>
            <Ionicons
              name={hidePassword ? "eye-off" : "eye"}
              size={24}
              color="#FFF"
            />
          </Pressable>
        </View>

        <Pressable onPress={() => router.push("/forgotPassword")}>
          <Text style={styles.forgotPassword}> Forgot password? </Text>
        </Pressable>

        <AppButton
          title="Log In"
          onPress={() => router.replace("/(tabs)/mainMenu")}
          buttonStyle={styles.loginButton}
          textStyle={styles.loginButtonText}
        />

        <Text style={styles.continueText}>or continue with</Text>

        {/** view component for social buttons */}
        <View style={styles.socialRow}>
          <Pressable style={styles.socialButton}>
            <FontAwesome name="google" size={34} color="#FFF" />
          </Pressable>

          <Pressable style={styles.socialButton}>
            <FontAwesome name="apple" size={38} color="#FFF" />
          </Pressable>

          <Pressable style={styles.socialButton}>
            <FontAwesome name="facebook-official" size={37} color="#FFF" />
          </Pressable>
        </View>

        {/** bottom sign up  directory */}
        <Text style={styles.signUpText}>
          Don&apos;t have an account?{" "}
          <Text
            style={styles.signUpTextPurple}
            onPress={() => router.push("/signup")}
          >
            Sign Up
          </Text>
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
    paddingHorizontal: 20,
    paddingTop: 72,
  },

  title: {
    marginTop: 60,
    color: "#FFF",
    fontSize: 38,
    fontWeight: "700",
  },
  titleInstruction: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 45,
  },

  inputTitle: {
    color: "#FFF",
    fontSize: 14,
    fontWeight: "700",
    marginTop: 40,
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
    marginBottom: 32,
  },

  passwordBox: {
    width: "100%",
    height: 58,
    borderRadius: 18,
    backgroundColor: "rgba(52, 52, 52, 0.8)",
    paddingHorizontal: 18,
    flexDirection: "row",
    alignItems: "center",
  },

  passwordInput: {
    flex: 1,
    color: "#FFF",
    fontSize: 16,
  },

  forgotPassword: {
    color: "#854FD5",
    fontSize: 14,
    fontWeight: "700",
    textAlign: "right",
    marginTop: 8,
    marginBottom: 28,
  },

  loginButton: {
    height: 58,
    borderRadius: 18,
    backgroundColor: "#854FD5",
    justifyContent: "center",
    alignItems: "center",
  },

  loginButtonText: {
    color: "#FFF",
    fontSize: 20,
    fontWeight: "700",
  },

  continueText: {
    color: "#FFF",
    textAlign: "center",
    fontSize: 15,
    fontWeight: "700",
    marginVertical: 18,
  },

  socialRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 26,
  },

  socialButton: {
    width: 65,
    height: 65,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(20, 20, 24, 0.4)",
  },

  signUpText: {
    color: "#FFFF",
    fontWeight: "700",
    fontSize: 14,
    textAlign: "center",
    marginTop: 95,
  },

  signUpTextPurple: {
    color: "#854FD5",
  },
});
