import type React from "react"
import { View, StyleSheet } from "react-native"

const ProductCardSkeleton: React.FC = () => {
  return (
    <View style={styles.card}>
      <View style={styles.imageContainer}>
        <View style={styles.image} />
      </View>
      <View style={styles.content}>
        <View style={styles.title} />
        <View style={styles.description} />
        <View style={styles.price} />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  card: {

    borderRadius: 8,

    marginVertical: 8,
    marginHorizontal: 10,
    flexDirection: "row",
    overflow: "hidden",
    height: 140,
    width: "95%",
  },
  imageContainer: {
    width: 130,
    height: "100%",
  },
  image: {
    flex: 1,
    backgroundColor: "#e0e0e0",
  },
  content: {
    flex: 1,
    padding: 16,
  },
  title: {
    height: 24,
    backgroundColor: "#e0e0e0",
    marginBottom: 8,
    width: "80%",
  },
  description: {
    height: 16,
    backgroundColor: "#e0e0e0",
    marginBottom: 8,
    width: "60%",
  },
  price: {
    height: 20,
    backgroundColor: "#e0e0e0",
    width: "40%",
  },
})

export default ProductCardSkeleton

