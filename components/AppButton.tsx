import { Pressable, StyleSheet, Text } from "react-native";

export default function AppButton({
  title,
  onPress,
  buttonStyle,
  textStyle,
}: any) {
  // reusable versin of button
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        buttonStyle,
        pressed && { opacity: 0.85, transform: [{ scale: 0.97 }] },
      ]}
    >
      <Text style={[styles.text, textStyle]}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 58,
    borderRadius: 18,
    backgroundColor: "#854FD5",
    justifyContent: "center",
    alignItems: "center",
  },

  text: {
    color: "#FFF",
    fontSize: 20,
    fontWeight: "700",
  },
});
