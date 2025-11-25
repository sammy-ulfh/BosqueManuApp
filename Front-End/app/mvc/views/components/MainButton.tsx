import React from "react";
import { TouchableOpacity, StyleSheet, Text } from "react-native";

type Props = {
  onPress?: () => void;
  style?: any;
  text?: string;
  color?: string;
  testID?: string;
  children?: React.ReactNode;
};

export function MainButton({ onPress, style, text, color, testID, children }: Props) {
  return (
    <TouchableOpacity
      style={[{ height: "80%", width: "80%" }, styles.button, style]}
      onPress={onPress}
      testID={testID}
    >
      {children ? (
        children
      ) : (
        <Text style={[{ color: color ? color : "white" }, styles.Text, { fontSize: 19 }]}>{text}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  totalWidth: {
    width: "100%",
  },
  totalHeight: {
    height: "100%",
  },
  Text: {
    color: "#ffffff",
    fontSize: 20,
    fontFamily: "TenorSans",
  },
  button: {
    borderRadius: 50,
    borderWidth: 1,
    borderColor: "white",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(166, 166, 166, 0.2)",
  },
});