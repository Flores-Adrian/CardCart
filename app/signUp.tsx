import AppButton from "@/components/AppButton";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import {
    ImageBackground,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";

export default function SignUpScreen() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [hidePassword, setHidePassword] = useState(true);
  const [hideConfirmPassword, setHideConfirmPassword] = useState(true);

  // create validation for userName
  const usernameRegex = /^[a-zA-Z0-9_-]*$/;
  const handleUsernameChange = (text: string) => {
    if (usernameRegex.test(text)) {
      setUsername(text);
    }
  };

  // create password validation
  const passwordRules = {
    hasUpperCase: /[A-Z]/.test(password),
    hasNumber: /\d/.test(password),
    hasSpecial: /[^A-Za-z0-9]/.test(password),
    isLongEnough: password.length >= 8,
  };

  const passwordMatch =
    confirmPassword.length === 0 || password === confirmPassword;

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require("@/assets/images/Main_Login_BG.png")}
        resizeMode="cover"
        style={styles.imgBackground}
      >
        <ScrollView showsHorizontalScrollIndicator={false}>
          {/** CREATE BACK BUTTON */}
          <Pressable
            style={styles.backButton}
            onPress={() => router.replace("/intro")}
          >
            <Ionicons name="chevron-back" size={28} color="#FFF" />
          </Pressable>

          <Text style={styles.title}> Create your Account </Text>
          <Text style={styles.titleInstruction}>
            Join CardCart and begin managing your table like pro!
          </Text>

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
          {/** Textbox for username */}
          <Text style={styles.inputTitle}> Username </Text>
          <TextInput
            style={styles.textBox}
            placeholder="Enter Username..."
            placeholderTextColor="#676767"
            onChangeText={handleUsernameChange}
            value={username}
            keyboardType="default"
            autoCapitalize="none"
          />

          {/** Original Password Input */}

          <Text style={styles.inputTitle}> Password </Text>

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

          {/** PASSWORD VALIDATION */}
          {password.length > 0 && !passwordRules.isLongEnough && (
            <Text style={styles.errorText}>
              Password must be at least 8 characters.
            </Text>
          )}
          {password.length > 0 && !passwordRules.hasUpperCase && (
            <Text style={styles.errorText}>
              Password must contain at least 1 uppercase letter.
            </Text>
          )}
          {password.length > 0 && !passwordRules.hasNumber && (
            <Text style={styles.errorText}>
              Password must contain at least 1 number.
            </Text>
          )}
          {password.length > 0 && !passwordRules.hasSpecial && (
            <Text style={styles.errorText}>
              Password must include at least 1 special chracter.
            </Text>
          )}

          {/** Comfirm Password Input Box */}
          <Text style={styles.inputTitle}> Confirm Password </Text>
          <View style={styles.passwordBox}>
            <TextInput
              style={styles.passwordInput}
              placeholder="Enter Password..."
              placeholderTextColor="#676767"
              onChangeText={setConfirmPassword}
              value={confirmPassword}
              secureTextEntry={hideConfirmPassword}
            />

            <Pressable
              onPress={() => setHideConfirmPassword(!hideConfirmPassword)}
            >
              <Ionicons
                name={hideConfirmPassword ? "eye-off" : "eye"}
                size={24}
                color="#FFF"
              />
            </Pressable>
          </View>

          {/** password aren't the SAME */}
          {!passwordMatch && (
            <Text style={styles.errorText}> Passwords do not match. </Text>
          )}

          <Text style={styles.termsText}>
            CardCart values your privacy. This Privacy Policy explains how we
            collect, use, and protect your information when you use our app. By
            using CardCart, you agree to this policy.
          </Text>

          <AppButton
            title="Sign Up"
            onPress={() => router.replace("/(tabs)/mainMenu")}
          />

          <Text style={styles.continueText}> or continue with </Text>

          {/** view component for social buttons */}
          <View style={styles.socialRow}>
            <Pressable style={styles.socialButton}>
              <FontAwesome name="google" size={38} color="#FFF" />
            </Pressable>

            <Pressable style={styles.socialButton}>
              <FontAwesome name="apple" size={38} color="#FFF" />
            </Pressable>

            <Pressable style={styles.socialButton}>
              <FontAwesome name="facebook-official" size={38} color="#FFF" />
            </Pressable>
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

  errorText: {
    color: "#FF6B6B",
    fontSize: 12,
    fontWeight: "600",
    marginTop: 6,
    marginLeft: 10,
  },

  termsText: {
    color: "#FFF",
    marginTop: 24,
    textAlign: "center",
    fontSize: 8,
    fontWeight: "700",
    marginBottom: 12,
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
});
