

import type React from "react"
import { useState, useRef } from "react"
import {
  Modal,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
  SafeAreaView,
  StatusBar,
} from "react-native"
import { useColorScheme } from "react-native"
import { Colors } from "@/constants/Colors"
import Feather from "react-native-vector-icons/Feather"
import * as Animatable from "react-native-animatable"
import SmartImage from "@/hooks/SmartImage/SmartImage"

const { width, height } = Dimensions.get("window")

interface GuideImage {
  id: number
  src: any // Para imágenes locales (require)
  title: string
  description: string
  instructions: string[]
}

interface VisualGuide {
  id: number
  title: string
  description: string
  category: string
  images: GuideImage[]
}

interface VisualGuideModalProps {
  visible: boolean
  guide: VisualGuide | null
  onClose: () => void
}

const VisualGuideModal: React.FC<VisualGuideModalProps> = ({ visible, guide, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const scrollViewRef = useRef<ScrollView>(null)
  const colorScheme = useColorScheme()
  const isDark = colorScheme === "dark"
  const colors = isDark ? Colors.dark : Colors.light

  const handleScroll = (event: any) => {
    const slideSize = width
    const index = Math.round(event.nativeEvent.contentOffset.x / slideSize)
    setCurrentIndex(index)
  }

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
    scrollViewRef.current?.scrollTo({
      x: index * width,
      animated: true,
    })
  }

  const goToPrevious = () => {
    if (guide && currentIndex > 0) {
      goToSlide(currentIndex - 1)
    }
  }

  const goToNext = () => {
    if (guide && currentIndex < guide.images.length - 1) {
      goToSlide(currentIndex + 1)
    }
  }

  if (!guide) return null

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="fullScreen" onRequestClose={onClose}>
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />

        {/* Header */}
        <View style={[styles.header, { backgroundColor: colors.primary }]}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Feather name="x" size={24} color="white" />
          </TouchableOpacity>

          <View style={styles.headerContent}>
            <Text allowFontScaling={false} style={styles.headerTitle}>{guide.title}</Text>
            <Text allowFontScaling={false} style={styles.headerSubtitle}>{guide.category}</Text>
          </View>

          <View style={styles.pageIndicator}>
            <Text allowFontScaling={false} style={styles.pageIndicatorText}>
              {currentIndex + 1} / {guide.images.length}
            </Text>
          </View>
        </View>

        {/* Image Carousel */}
        <View style={styles.carouselContainer}>
          <ScrollView
            ref={scrollViewRef}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={handleScroll}
            style={styles.carousel}
          >
            {guide.images.map((image, index) => (
              <View key={image.id} style={styles.slide}>
                <View style={styles.imageContainer}>
                  <SmartImage
                    src={image.src}
                    style={styles.image}
                    fallbackText="Imagen no disponible"
                    title={image.title}
                  />
                </View>
              </View>
            ))}
          </ScrollView>

          {/* Navigation Arrows */}
          {guide.images.length > 1 && (
            <>
              <TouchableOpacity
                style={[styles.navButton, styles.navButtonLeft]}
                onPress={goToPrevious}
                disabled={currentIndex === 0}
              >
                <Feather name="chevron-left" size={24} color={currentIndex === 0 ? "#ccc" : colors.primary} />
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.navButton, styles.navButtonRight]}
                onPress={goToNext}
                disabled={currentIndex === guide.images.length - 1}
              >
                <Feather
                  name="chevron-right"
                  size={24}
                  color={currentIndex === guide.images.length - 1 ? "#ccc" : colors.primary}
                />
              </TouchableOpacity>
            </>
          )}
        </View>

        {/* Content Section */}
        <ScrollView style={styles.contentContainer} showsVerticalScrollIndicator={false}>
          <Animatable.View
            key={currentIndex}
            animation="fadeInUp"
            duration={500}
            style={[styles.contentCard, { backgroundColor: isDark ? "#1e1e1e" : "#fff" }]}
          >
            {/* Image Title */}
            <Text allowFontScaling={false} style={[styles.imageTitle, { color: colors.text }]}>{guide.images[currentIndex].title}</Text>

            {/* Image Description */}
            <Text allowFontScaling={false} style={[styles.imageDescription, { color: isDark ? "#e0e0e0" : "#666" }]}>
              {guide.images[currentIndex].description}
            </Text>

            {/* Step-by-step Instructions */}
            <View style={styles.instructionsContainer}>
              <Text allowFontScaling={false} style={[styles.instructionsTitle, { color: colors.text }]}>Pasos a seguir:</Text>

              {guide.images[currentIndex].instructions.map((instruction, index) => (
                <View key={index} style={styles.instructionItem}>
                  <View style={[styles.stepNumber, { backgroundColor: colors.primary }]}>
                    <Text allowFontScaling={false} style={styles.stepNumberText}>{index + 1}</Text>
                  </View>
                  <Text allowFontScaling={false} style={[styles.instructionText, { color: colors.text }]}>{instruction}</Text>
                </View>
              ))}
            </View>
          </Animatable.View>

          {/* Thumbnail Navigation */}
          {guide.images.length > 1 && (
            <View style={styles.thumbnailContainer}>
              <Text allowFontScaling={false} style={[styles.thumbnailTitle, { color: colors.text }]}>Navegar por la guía:</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.thumbnailScroll}>
                {guide.images.map((image, index) => (
                  <TouchableOpacity
                    key={image.id}
                    style={[
                      styles.thumbnail,
                      {
                        borderColor: index === currentIndex ? colors.primary : "#ddd",
                        backgroundColor: isDark ? "#2a2a2a" : "#f5f5f5",
                      },
                    ]}
                    onPress={() => goToSlide(index)}
                  >
                    <SmartImage src={image.src} style={styles.thumbnailImage} fallbackText="" title={image.title} />
                    <Text allowFontScaling={false}
                      style={[styles.thumbnailText, { color: index === currentIndex ? colors.primary : colors.text }]}
                      numberOfLines={2}
                    >
                      {image.title}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </Modal>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  closeButton: {
    padding: 5,
  },
  headerContent: {
    flex: 1,
    marginLeft: 15,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
  },
  headerSubtitle: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.8)",
    marginTop: 2,
  },
  pageIndicator: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  pageIndicatorText: {
    color: "white",
    fontSize: 12,
    fontWeight: "600",
  },
  carouselContainer: {
    height: height * 0.4,
    position: "relative",
  },
  carousel: {
    flex: 1,
  },
  slide: {
    width: width,
    justifyContent: "center",
    alignItems: "center",
  },
  imageContainer: {
    width: width - 40,
    height: "90%",
    backgroundColor: "#f5f5f5",
    borderRadius: 12,
    overflow: "hidden",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  navButton: {
    position: "absolute",
    top: "50%",
    transform: [{ translateY: -20 }],
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  navButtonLeft: {
    left: 20,
  },
  navButtonRight: {
    right: 20,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  contentCard: {
    borderRadius: 12,
    padding: 20,
    marginVertical: 15,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  imageTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  imageDescription: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 20,
  },
  instructionsContainer: {
    marginTop: 10,
  },
  instructionsTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 15,
  },
  instructionItem: {
    flexDirection: "row",
    marginBottom: 15,
    alignItems: "flex-start",
  },
  stepNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
    marginTop: 2,
  },
  stepNumberText: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
  },
  instructionText: {
    flex: 1,
    fontSize: 15,
    lineHeight: 22,
  },
  thumbnailContainer: {
    marginVertical: 20,
  },
  thumbnailTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 15,
    paddingHorizontal: 5,
  },
  thumbnailScroll: {
    paddingHorizontal: 5,
  },
  thumbnail: {
    width: 120,
    marginRight: 15,
    borderRadius: 8,
    borderWidth: 2,
    overflow: "hidden",
    padding: 8,
  },
  thumbnailImage: {
    width: "100%",
    height: 60,
    borderRadius: 4,
    marginBottom: 8,
  },
  thumbnailText: {
    fontSize: 12,
    textAlign: "center",
    fontWeight: "500",
  },
})

export default VisualGuideModal
