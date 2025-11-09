"use client"

import { horizontalScale as hs, moderateScale as ms, verticalScale as vs } from "@/utils/scale"
import { MaterialCommunityIcons } from "@expo/vector-icons"
import { CameraType, CameraView, useCameraPermissions } from "expo-camera"
import * as ImagePicker from "expo-image-picker"
import { useRouter } from "expo-router"
import { useEffect, useRef, useState } from "react"
import { ActivityIndicator, Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"

export default function DiagnosisCamera() {
  const router = useRouter()
  const insets = useSafeAreaInsets()
  const [permission, requestPermission] = useCameraPermissions()
  const [facing, setFacing] = useState<CameraType>("back")
  const [flash, setFlash] = useState<"off" | "on">("off")
  const [capturedImage, setCapturedImage] = useState<string | null>(null)
  const cameraRef = useRef<CameraView>(null)

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()
    if (status !== "granted") {
      Alert.alert("Permission needed", "Please grant permission to access your photos")
      return
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    })

    if (!result.canceled && result.assets[0]) {
      handleImageSelected(result.assets[0].uri)
    }
  }

  const takePicture = async () => {
    if (!cameraRef.current) return

    try {
      const photo = await cameraRef.current.takePictureAsync()
      if (photo?.uri) {
        handleImageSelected(photo.uri)
      }
    } catch (error) {
      Alert.alert("Error", "Failed to take picture")
    }
  }

  const handleImageSelected = (uri: string) => {
    setCapturedImage(uri)
    // Navigate to loading/diagnosis page
    router.push({
      pathname: "/diagnosisResult",
      params: { imageUri: uri },
    })
  }

  const toggleCameraFacing = () => {
    setFacing((current) => (current === "back" ? "front" : "back"))
  }

  const toggleFlash = () => {
    setFlash((current) => (current === "off" ? "on" : "off"))
  }

  // Auto-request permission when component mounts if not granted
  useEffect(() => {
    if (permission && !permission.granted) {
      requestPermission()
    }
  }, [permission])

  if (!permission) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
    )
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={toggleFlash} style={styles.headerButton}>
          <MaterialCommunityIcons 
            name={flash === "off" ? "flash-off" : "flash"} 
            size={24} 
            color="#fff" 
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Identify the plant</Text>
        <TouchableOpacity onPress={() => router.back()} style={styles.headerButton}>
          <MaterialCommunityIcons name="close" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Camera View */}
      <CameraView
        ref={cameraRef}
        style={styles.camera}
        facing={facing}
        flash={flash}
      >
      </CameraView>

      {/* Bottom Controls */}
      <View style={[styles.controls, { paddingBottom: insets.bottom + vs(20) }]}>
        <TouchableOpacity style={styles.controlButton} onPress={pickImage}>
          <View style={styles.galleryThumbnail}>
            <MaterialCommunityIcons name="image" size={20} color="#999" />
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.captureButton} onPress={takePicture}>
          <View style={styles.captureButtonInner} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.controlButton} onPress={toggleCameraFacing}>
          <MaterialCommunityIcons name="camera-flip" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Permission Dialog Overlay */}
      {!permission.granted && (
        <View style={styles.permissionOverlay}>
          <View style={styles.permissionDialog}>
            <View style={styles.permissionIconContainer}>
              <MaterialCommunityIcons name="folder" size={48} color="#2196F3" />
            </View>
            <Text style={styles.permissionText}>
              Allow APP to access photos,{'\n'}media, and files on your{'\n'}device?
            </Text>
            <View style={styles.permissionDivider} />
            <TouchableOpacity 
              style={styles.permissionButton} 
              onPress={requestPermission}
              activeOpacity={0.7}
            >
              <Text style={styles.permissionButtonText}>Allow</Text>
            </TouchableOpacity>
            <View style={styles.permissionDivider} />
            <TouchableOpacity 
              style={styles.permissionButton} 
              onPress={() => router.back()}
              activeOpacity={0.7}
            >
              <Text style={styles.permissionButtonText}>Deny</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  centerContent: {
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: hs(20),
  },
  permissionOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: hs(20),
    zIndex: 1000,
  },
  permissionDialog: {
    backgroundColor: "#fff",
    borderRadius: ms(12),
    borderWidth: 1,
    borderColor: "#E0E0E0",
    width: "100%",
    maxWidth: hs(320),
    overflow: "hidden",
  },
  permissionIconContainer: {
    alignItems: "center",
    paddingTop: vs(24),
    paddingBottom: vs(16),
  },
  permissionText: {
    fontSize: ms(16),
    color: "#000",
    textAlign: "center",
    paddingHorizontal: hs(20),
    paddingBottom: vs(20),
    lineHeight: ms(22),
  },
  permissionDivider: {
    height: 1,
    backgroundColor: "#E0E0E0",
  },
  permissionButton: {
    width: "100%",
    paddingVertical: vs(16),
    alignItems: "center",
    justifyContent: "center",
  },
  permissionButtonText: {
    fontSize: ms(16),
    color: "#2196F3",
    fontWeight: "400",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: hs(20),
    paddingVertical: vs(15),
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  headerButton: {
    width: hs(40),
    height: vs(40),
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: ms(18),
    fontWeight: "600",
    color: "#fff",
  },
  camera: {
    flex: 1,
  },
  guideLine: {
    position: "absolute",
    top: "50%",
    left: 0,
    right: 0,
    height: 1,
    borderTopWidth: 1,
    borderTopColor: "#fff",
    borderStyle: "dashed",
    opacity: 0.5,
  },
  controls: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingHorizontal: hs(20),
    paddingTop: vs(20),
    backgroundColor: "rgba(0, 0, 0, 0.3)",
  },
  controlButton: {
    width: hs(50),
    height: hs(50),
    justifyContent: "center",
    alignItems: "center",
  },
  galleryThumbnail: {
    width: hs(40),
    height: vs(40),
    borderRadius: ms(8),
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  captureButton: {
    width: hs(70),
    height: hs(70),
    borderRadius: ms(35),
    borderWidth: 3,
    borderColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
  },
  captureButtonInner: {
    width: hs(58),
    height: hs(58),
    borderRadius: ms(30),
    backgroundColor: "#fff",
  },
})

