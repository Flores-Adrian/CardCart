// components/MainMenu.tsx
import AppButton from "@/components/AppButton";
import { router } from "expo-router";
import { ImageBackground, StyleSheet, View } from "react-native";

export default function MainMenu() {
  return (
    <View style={styles.container}>
      <ImageBackground
        source={require("@/assets/images/Main_Login_BG.png")}
        resizeMode="cover"
        style={styles.imgBackground}
      >
        <AppButton
          title="Dashboard"
          onPress={() => router.replace("/logIn")}
          buttonStyle={styles.loginButton}
          textStyle={styles.loginButtonText}
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
    paddingTop: 72,
  },
});
