import { TextInput, StyleSheet } from "react-native";

export function Input({ placeholder, value, onChangeText, style }) {
  return (
    <TextInput
      placeholder={placeholder}
      value={value}
      onChangeText={onChangeText}
      style={[
        styles.input,
        styles.whiteText,
        { color: "white", fontSize: 15 },
        style,
      ]}
      placeholderTextColor="white"
    />
  );
}

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: "#ffffff",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: 50,
    minWidth: "80%",
    minHeight: "13%",
    paddingLeft: "5%",
    justifyContent: "center",
  },
  whiteText: {
    color: "#ffffff",
    fontSize: 20,
    fontFamily: "TenorSans",
  },
});
