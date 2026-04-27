// components/MainMenu.tsx
import { Button } from "@react-navigation/elements";
import { StyleSheet, Text, View } from "react-native";

export default function MainMenu() {
  return (
    <View>
      <Text style={styles.description}>
        {" "}
        Everything you need to run your table like pro.{" "}
      </Text>
      <Text style={styles.description}> Fast Card Scanning </Text>
      <Text style={styles.description}> Inventory Managemnt </Text>
      <Button> get started </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  description: {
    color: "#FFF",
  },
});
