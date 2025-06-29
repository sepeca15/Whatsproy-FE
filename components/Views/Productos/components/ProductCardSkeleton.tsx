"use client"

import { View, StyleSheet } from "react-native"
import Animated, { useSharedValue, useAnimatedStyle } from "react-native-reanimated"

const ProductCardSkeleton = () => {
  const opacity = useSharedValue(0.3)

  const shimmerStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }))

  return (
    <View style={styles.container}>
      <View style={styles.cardTouchable}>
        <View style={styles.card}>
          <View style={styles.imageContainer}>
            <Animated.View style={[styles.imageSkeleton, shimmerStyle]} />
            <Animated.View style={[styles.statusIndicatorSkeleton, shimmerStyle]} />
          </View>

          <View style={styles.content}>
            <View style={styles.header}>
              <View style={styles.titleContainer}>
                <Animated.View style={[styles.titleSkeleton, shimmerStyle]} />
                <Animated.View style={[styles.titleSkeletonSecond, shimmerStyle]} />
              </View>
              <Animated.View style={[styles.moreButtonSkeleton, shimmerStyle]} />
            </View>

            <View style={styles.priceContainer}>
              <Animated.View style={[styles.priceSkeleton, shimmerStyle]} />
              <Animated.View style={[styles.currencySkeleton, shimmerStyle]} />
            </View>

            <View style={styles.descriptionContainer}>
              <Animated.View style={[styles.descriptionSkeleton, shimmerStyle]} />
              <Animated.View style={[styles.descriptionSkeletonSecond, shimmerStyle]} />
            </View>
          </View>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    marginHorizontal: 4,
  },
  cardTouchable: {
    borderRadius: 16,
    backgroundColor: "#ffffff",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  card: {
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "#ffffff",
  },
  imageContainer: {
    position: "relative",
    height: 180,
    backgroundColor: "#f9fafb",
  },
  imageSkeleton: {
    width: "100%",
    height: "100%",
    backgroundColor: "#e5e7eb",
  },
  statusIndicatorSkeleton: {
    position: "absolute",
    top: 12,
    right: 12,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#d1d5db",
  },
  content: {
    padding: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  titleContainer: {
    flex: 1,
    marginRight: 8,
  },
  titleSkeleton: {
    height: 18,
    backgroundColor: "#e5e7eb",
    borderRadius: 4,
    marginBottom: 4,
    width: "85%",
  },
  titleSkeletonSecond: {
    height: 18,
    backgroundColor: "#e5e7eb",
    borderRadius: 4,
    width: "60%",
  },
  moreButtonSkeleton: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: "#e5e7eb",
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "baseline",
    marginBottom: 8,
  },
  priceSkeleton: {
    height: 20,
    backgroundColor: "#e5e7eb",
    borderRadius: 4,
    width: 80,
    marginRight: 8,
  },
  currencySkeleton: {
    height: 14,
    backgroundColor: "#e5e7eb",
    borderRadius: 4,
    width: 30,
  },
  descriptionContainer: {
    gap: 4,
  },
  descriptionSkeleton: {
    height: 16,
    backgroundColor: "#e5e7eb",
    borderRadius: 4,
    width: "90%",
  },
  descriptionSkeletonSecond: {
    height: 16,
    backgroundColor: "#e5e7eb",
    borderRadius: 4,
    width: "70%",
  },
})

export default ProductCardSkeleton
