"use client"

import { horizontalScale as hs, moderateScale as ms, verticalScale as vs } from "@/utils/scale"
import { useState } from "react"
import { Image, Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, type ImageSourcePropType } from "react-native"
import JournalCard, { type JournalEntry } from "@/components/JournalCard"
import ImageViewing from "react-native-image-viewing"

type JournalTabProps = {
  showNewEntry?: boolean
  setShowNewEntry?: (show: boolean) => void
}

export default function JournalTab({ showNewEntry: propShowNewEntry, setShowNewEntry: propSetShowNewEntry }: JournalTabProps = {}) {
  const [entries, setEntries] = useState<JournalEntry[]>([
    {
      id: "1",
      date: "31 Oct",
      height: "55cm",
      notes: "every few days need to harvest and water, and then should be okay alr",
      images: [
        require("../../assets/images/dummy/chilli_padi.jpg"),
        require("../../assets/images/dummy/chilli_padi.jpg"),
        require("../../assets/images/dummy/chilli_padi.jpg"),
        require("../../assets/images/dummy/chilli_padi.jpg"),
        require("../../assets/images/dummy/chilli_padi.jpg"),
      ],
    },
    {
      id: "2",
      date: "28 Oct",
      height: "55cm",
      notes: "every few days need to harvest and water, and then should be okay alr",
      images: [
        require("../../assets/images/dummy/chilli_padi.jpg"),
        require("../../assets/images/dummy/chilli_padi.jpg"),
      ],
    },
    {
      id: "3",
      date: "25 Oct",
      height: "50cm",
      notes: "Single photo entry",
      images: [
        require("../../assets/images/dummy/chilli_padi.jpg"),
      ],
    },
  ])

  const [internalShowNewEntry, setInternalShowNewEntry] = useState(false)
  const showNewEntry = propShowNewEntry !== undefined ? propShowNewEntry : internalShowNewEntry
  const setShowNewEntry = propSetShowNewEntry || setInternalShowNewEntry
  const [newEntry, setNewEntry] = useState("")
  const [imageViewerVisible, setImageViewerVisible] = useState(false)
  const [imageViewerIndex, setImageViewerIndex] = useState(0)
  const [currentEntryImages, setCurrentEntryImages] = useState<ImageSourcePropType[]>([])

  const openImageViewer = (images: ImageSourcePropType[], startIndex: number) => {
    setCurrentEntryImages(images)
    setImageViewerIndex(startIndex)
    setImageViewerVisible(true)
  }

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {entries.map((entry) => (
          <JournalCard
            key={entry.id}
            entry={entry}
            onImagePress={openImageViewer}
          />
        ))}
      </ScrollView>


      {/* Image Viewer */}
      <ImageViewing
        images={currentEntryImages.map(img => {
          if (typeof img === 'number') {
            const resolved = Image.resolveAssetSource(img)
            return { uri: resolved.uri }
          }
          return { uri: (img as any).uri || '' }
        })}
        imageIndex={imageViewerIndex}
        visible={imageViewerVisible}
        onRequestClose={() => setImageViewerVisible(false)}
        presentationStyle="overFullScreen"
        animationType="fade"
      />

      {/* New Entry Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showNewEntry}
        onRequestClose={() => setShowNewEntry(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <TouchableOpacity onPress={() => setShowNewEntry(false)}>
                <Text style={styles.closeBtn}>✕</Text>
              </TouchableOpacity>
              <Text style={styles.modalTitle}>New Entry</Text>
              <TouchableOpacity>
                <Text style={styles.saveBtn}>Save</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.formContainer}>
              <TouchableOpacity style={styles.imageUploadBox}>
                <Text style={styles.uploadIcon}>📷</Text>
                <Text style={styles.uploadText}>Add Photos</Text>
              </TouchableOpacity>

              <TextInput
                style={styles.noteInput}
                placeholder="Write your journal entry..."
                multiline
                numberOfLines={5}
                value={newEntry}
                onChangeText={setNewEntry}
              />
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative",
  },
  scrollContent: {
    paddingBottom: vs(100),
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
  },
  modalContent: {
    flex: 1,
    backgroundColor: "#fff",
    marginTop: vs(50),
    borderTopLeftRadius: ms(20),
    borderTopRightRadius: ms(20),
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: hs(20),
    paddingVertical: vs(15),
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  closeBtn: {
    fontSize: ms(20),
    color: "#999",
  },
  modalTitle: {
    fontSize: ms(16),
    fontWeight: "700",
    color: "#1a1a1a",
  },
  saveBtn: {
    fontSize: ms(14),
    fontWeight: "600",
    color: "#4CAF50",
  },
  formContainer: {
    padding: hs(20),
  },
  imageUploadBox: {
    borderWidth: 2,
    borderStyle: "dashed",
    borderColor: "#ddd",
    borderRadius: ms(12),
    paddingVertical: vs(30),
    alignItems: "center",
    marginBottom: vs(20),
  },
  uploadIcon: {
    fontSize: ms(40),
    marginBottom: vs(8),
  },
  uploadText: {
    fontSize: ms(14),
    color: "#999",
  },
  noteInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: ms(8),
    padding: ms(12),
    fontSize: ms(14),
    textAlignVertical: "top",
  },
})
