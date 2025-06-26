import React from "react";
import { Dimensions, Image, StyleSheet, Text, View } from "react-native";
import Carousel from "react-native-reanimated-carousel";

const { width } = Dimensions.get("window");

export default function Healthadvantage() {
  const images = [
    {
      id: 1,
      url: require("../../assets/images/money.png"),
      title: "Affordable Plans",
      description:
        "One of the best prices in the market, guaranteed by Global Health and Allied Insurance.",
    },
    {
      id: 2, // Fixed: Changed from 1 to 2
      url: require("../../assets/images/guide.png"),
      title: "Honest Guidance",
      description: "Unbiased advice that always puts our customers first.",
    },
    {
      id: 3, // Fixed: Changed from 1 to 3
      url: require("../../assets/images/agreement.png"),
      title: "Trusted & Regulated",
      description: "100% reliable and fully regulated by IRDAI.",
    },
    {
      id: 4, // Fixed: Changed from 1 to 4
      url: require("../../assets/images/claim (1).png"),
      title: "Easy Claim Process",
      description: "Claims support made stress-free and simple.",
    },
  ];

  const renderItem = ({ item }) => (
    <View style={styles.carouselItem}>
      <Image source={item.url} style={styles.image} resizeMode="contain" />
      <View style={styles.textContainer}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.description}>{item.description}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title1}>Global Health Advantage:</Text>
      <Carousel
        loop
        width={width}
        height={300} // Added proper height
        autoPlay={true}
        data={images}
        scrollAnimationDuration={1000}
        renderItem={renderItem}
        mode="parallax"
        modeConfig={{
          parallaxScrollingScale: 0.9,
          parallaxScrollingOffset: 50,
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  carouselItem: {
    flex: 1,
    backgroundColor: "#f8f9fa",
    borderRadius: 12,
    padding: 20,
    marginHorizontal: 10,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  image: {
    width: 80,
    height: 80,
    marginBottom: 15,
  },
  textContainer: {
    alignItems: "center",
    paddingHorizontal: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    lineHeight: 20,
  },
  title1: {
    display: "flex",
    justifyContent: "center",
    alignSelf: "center",
    fontSize: 27,
    fontWeight: "700",
    color: "#1a1a1a",
    marginBottom: 5,
    // textAlign: "left",
    marginTop: 10,
  },
});
