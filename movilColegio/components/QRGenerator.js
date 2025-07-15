import React, { useState } from "react";
import { View, TextInput, Button, StyleSheet } from "react-native";
import QRCode from "react-native-qrcode-svg";

export default function QRGenerator() {
  const [text, setText] = useState("");

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Introduce texto para generar QR"
        onChangeText={setText}
        value={text}
      />
      {text ? <QRCode value={text} size={200} /> : null}
      <Button title="Limpiar QR" onPress={() => setText("")} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center" },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 20,
    width: "80%",
    textAlign: "center",
  },
});