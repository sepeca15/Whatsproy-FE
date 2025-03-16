import React from "react";
import { View, StyleSheet } from "react-native";

const ProductCardSkeleton: React.FC = () => {
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.image} />

        <View style={styles.content}>
          <View style={styles.headerSkeleton}>
            <View style={styles.titleSkeleton} />
            <View style={styles.moreButtonSkeleton} />
          </View>

          <View style={styles.priceSkeleton} />

          <View style={styles.descriptionSkeleton} />
        </View>
      </View>
    </View>
  );
};

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
  },
  image: {
    width: 100,
    height: 100,
    backgroundColor: "#e0e0e0",
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
    marginRight: 15,
  },
  content: {
    flex: 1,
    paddingVertical: 16,
  },
  headerSkeleton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  titleSkeleton: {
    height: 24,
    backgroundColor: "#e0e0e0",
    width: "80%",
    borderRadius: 4,
  },
  moreButtonSkeleton: {
    width: 20,
    height: 20,
    backgroundColor: "#e0e0e0",
    borderRadius: 10,
  },
  priceSkeleton: {
    height: 20,
    backgroundColor: "#e0e0e0",
    width: "40%",
    marginBottom: 8,
    borderRadius: 4,
  },
  descriptionSkeleton: {
    height: 16,
    backgroundColor: "#e0e0e0",
    width: "60%",
    borderRadius: 4,
  },
});

export default ProductCardSkeleton;
