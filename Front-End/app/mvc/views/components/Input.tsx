import React from "react";
import { TextInput, StyleSheet, TextInputProps } from "react-native";

type Props = {
  placeholder?: string;
  value?: string;
  onChangeText?: (text: string) => void;
  style?: any;
  color?: string;
  secure?: boolean;
  testID?: string;
} & Partial<TextInputProps>;

export function Input({ placeholder, value, onChangeText, style, color, secure, testID }: Props) {
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
      secureTextEntry={!!secure}
      placeholderTextColor={color}
      testID={testID}
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
