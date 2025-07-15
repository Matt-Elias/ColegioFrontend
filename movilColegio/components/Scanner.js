import { CameraView, useCameraPermissions } from "expo-camera";
import React, { useState } from "react";
import { Button, StyleSheet, Text, TouchableOpacity, View, Alert } from "react-native";

export default function Scanner() {
  const [facing, setFacing] = useState("back");
  const [scanned, setScanned] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(true);
  const [permission, requestPermission] = useCameraPermissions();

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="Grant Permission" />
      </View>
    );
  }

  function toggleCameraFacing() {
    setFacing((current) => (current === "back" ? "front" : "back"));
  }

  function handleBarCodeScanned({ type, data }) {
    if (!scanned) {
      setScanned(true);
      setIsCameraActive(false); // Apagar la cámara después de escanear
      Alert.alert("Código Escaneado", `Tipo: ${type}\nDato: ${data}`, [
        { text: "OK", onPress: () => setIsCameraActive(true) }, // Volver a encender la cámara
      ]);
    }
  }

  return (
    <View style={styles.container}>
      {isCameraActive && (
        <CameraView
          style={styles.camera}
          facing={facing}
          barcodeScannerSettings={{
            barcodeTypes: ["qr", "ean13", "ean8", "upc_a", "upc_e", "code128", "code39", "code93", "itf14", "pdf417"],
          }}
          onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
        >
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
              <Text style={styles.text}>Flip Camera</Text>
            </TouchableOpacity>
          </View>
        </CameraView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  message: {
    textAlign: "center",
    paddingBottom: 10,
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "transparent",
    margin: 64,
  },
  button: {
    flex: 1,
    alignSelf: "flex-end",
    alignItems: "center",
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
});