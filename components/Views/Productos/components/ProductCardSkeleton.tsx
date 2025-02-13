import type React from "react"
import { View, StyleSheet } from "react-native"

const ProductCardSkeleton: React.FC = () => {
  return (
    <View style={styles.container}>
      <View style={styles.card}>
      
          <View style={styles.image} />
     
        <View style={styles.content}>
          <View style={styles.title} />
          <View style={styles.description} />
          <View style={styles.price} />
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({

  container: {
    backgroundColor: "#fff",
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    margin: 10,
    padding: 5,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    height: 100,
    borderRadius: 8,

    marginVertical: 8,
    marginHorizontal: 10,
  
    

    // borderRadius: 8,

    // marginVertical: 8,
    // marginHorizontal: 10,
    // flexDirection: "row",
    // overflow: "hidden",
    // height: 140,
    // width: "95%",
  },
  imageContainer: {
    width: 100,
    height: 100,
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
    marginRight: 15,
  },
  image: {
    flex: 1,
    backgroundColor: "#e0e0e0",
    width: 100,
    height: 100,
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
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

    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    flex: 1,
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

