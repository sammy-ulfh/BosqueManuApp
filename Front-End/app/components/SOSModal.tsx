import React from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ImageSourcePropType,
} from "react-native";

type Props = {
  visible: boolean;
  onClose: () => void;
  imageSource?: ImageSourcePropType;
  size?: number;
};

export default function SOSModal({ visible, onClose, imageSource, size = 180 }: Props) {
  const img = imageSource ?? require("@/assets/images/SOSboton.png");

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={[styles.modalContainer, { width: size + 40 }]}>
          <Image
            source={img}
            style={[styles.sosImage, { width: size, height: size, borderRadius: size / 2 }]}
            resizeMode="cover"
          />

          <TouchableOpacity accessibilityRole="button" style={styles.cancelButton} onPress={onClose}>
            <Text style={styles.cancelText}>CANCELAR</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)", // semi-transparent grey overlay
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    backgroundColor: "transparent",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 12,
  },
  sosImage: {
    // circular image handled inline via borderRadius
    marginBottom: 18,
    borderWidth: 4,
    borderColor: "rgba(255,255,255,0.9)",
    backgroundColor: "#fff",
  },
  cancelButton: {
    backgroundColor: "#ffffff",
    paddingVertical: 10,
    paddingHorizontal: 22,
    borderRadius: 24,
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },
  cancelText: {
    color: "#2D2A24",
    fontWeight: "700",
    fontSize: 16,
  },
});
