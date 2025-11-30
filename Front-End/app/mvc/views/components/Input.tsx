import React from "react";
import { TextInput, StyleSheet, TextInputProps } from "react-native";

type Props = {
  placeholder?: string;
  value?: string;
  onChangeText?: (text: string) => void;
  style?: any;
  color?: string; 
  textColor?: string;
  placeholderColor?: string;
  secure?: boolean;
  testID?: string;
} & Partial<TextInputProps>;

export function Input({ placeholder, value, onChangeText, style, color, secure, testID }: Props) {
  // Determine typed text color: prefer inline style.color, then `color` prop, then default to black
  const typedColor = (style && style.color) || color || "#000";

  return (
    <TextInput
      placeholder={placeholder}
      value={value}
      onChangeText={onChangeText}
      style={[
        styles.input,
        style,
        { color: typedColor, fontSize: 15 },
      ]}
      secureTextEntry={!!secure}
      placeholderTextColor={color || "rgba(255,255,255,0.6)"}
      testID={testID}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: "#ffffff",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    fontFamily: "TenorSans",
    borderRadius: 50,
    minWidth: "80%",
    minHeight: "13%",
    paddingLeft: "5%",
    justifyContent: "center",
  },
  
});