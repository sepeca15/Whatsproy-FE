import type React from "react"
import { Modal, View, Image, TouchableOpacity, Text, Dimensions, StatusBar, SafeAreaView } from "react-native"
import Icon from "react-native-vector-icons/FontAwesome"
import { FormattedMessage } from "react-intl"

interface ImagePreviewModalProps {
  visible: boolean
  imageUri: string | null
  onClose: () => void
  title?: string
}

const { width: screenWidth, height: screenHeight } = Dimensions.get("window")

const ImagePreviewModal: React.FC<ImagePreviewModalProps> = ({ visible, imageUri, onClose, title }) => {
  if (!imageUri) return null

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      statusBarTranslucent={true}
      onRequestClose={onClose}
    >
      <StatusBar backgroundColor="rgba(0,0,0,0.9)" barStyle="light-content" />
      <SafeAreaView style={styles.modalContainer}>
        <View style={styles.modalContent as any}>
          <View style={styles.modalHeader}>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Icon name="times" size={24} color="#fff" />
            </TouchableOpacity>
            {title && (
              <Text style={styles.modalTitle} numberOfLines={1}>
                {title}
              </Text>
            )}
            <View style={styles.headerSpacer} />
          </View>

          <View style={styles.imageContainer}>
            <Image source={{ uri: imageUri }} style={styles.fullImage} resizeMode="contain" />
          </View>

          <View style={styles.modalFooter}>
            <TouchableOpacity style={styles.closeButtonBottom} onPress={onClose}>
              <Text style={styles.closeButtonText}>
                <FormattedMessage id="close" defaultMessage="Cerrar" />
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  )
}

const styles = {
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.9)",
  },
  modalContent: {
    flex: 1,
    justifyContent: "space-between",
  },
  modalHeader: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    justifyContent: "space-between" as const,
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  closeButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
  modalTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600" as const,
    flex: 1,
    textAlign: "center" as const,
    marginHorizontal: 20,
  },
  headerSpacer: {
    width: 40,
  },
  imageContainer: {
    flex: 1,
    justifyContent: "center" as const,
    alignItems: "center" as const,
    paddingHorizontal: 20,
  },
  fullImage: {
    width: screenWidth - 40,
    height: screenHeight * 0.7,
    borderRadius: 8,
  },
  modalFooter: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    alignItems: "center" as const,
  },
  closeButtonBottom: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  closeButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600" as const,
  },
}

export default ImagePreviewModal
