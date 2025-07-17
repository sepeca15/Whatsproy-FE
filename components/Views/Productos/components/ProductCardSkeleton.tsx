"use client"

import { View, StyleSheet } from "react-native"
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withTiming } from "react-native-reanimated"
import { useEffect } from "react"

const ProductCardSkeleton = () => {
  const opacity = useSharedValue(0.3)

  useEffect(() => {
    opacity.value = withRepeat(
      withTiming(0.8, { duration: 1000 }),
      -1,
      true
    )
  }, [])

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
    marginBottom: 12,
    marginHorizontal: 0,
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
    flexDirection: "row",
    minHeight: 120,
  },
  imageContainer: {
    position: "relative",
    width: 120,
    height: 120,
    backgroundColor: "#f9fafb",
    flexShrink: 0,
  },
  imageSkeleton: {
    width: "100%",
    height: "100%",
    backgroundColor: "#e5e7eb",
  },
  statusIndicatorSkeleton: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#d1d5db",
    borderWidth: 1.5,
    borderColor: "#ffffff",
  },
  content: {
    flex: 1,
    padding: 12,
    justifyContent: "space-between",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 6,
  },
  titleContainer: {
    flex: 1,
    marginRight: 8,
  },
  titleSkeleton: {
    height: 16,
    backgroundColor: "#e5e7eb",
    borderRadius: 4,
    marginBottom: 4,
    width: "85%",
  },
  titleSkeletonSecond: {
    height: 16,
    backgroundColor: "#e5e7eb",
    borderRadius: 4,
    width: "60%",
  },
  moreButtonSkeleton: {
    padding: 3,
    borderRadius: 6,
    backgroundColor: "#e5e7eb",
    width: 24,
    height: 24,
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "baseline",
    marginBottom: 6,
  },
  priceSkeleton: {
    height: 18,
    backgroundColor: "#e5e7eb",
    borderRadius: 4,
    width: 70,
    marginRight: 3,
  },
  currencySkeleton: {
    height: 12,
    backgroundColor: "#e5e7eb",
    borderRadius: 4,
    width: 25,
  },
  descriptionContainer: {
    gap: 4,
  },
  descriptionSkeleton: {
    height: 14,
    backgroundColor: "#e5e7eb",
    borderRadius: 4,
    width: "90%",
  },
  descriptionSkeletonSecond: {
    height: 14,
    backgroundColor: "#e5e7eb",
    borderRadius: 4,
    width: "70%",
  },
})

export default ProductCardSkeleton
