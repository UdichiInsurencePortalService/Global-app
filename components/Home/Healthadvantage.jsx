import React, { useState } from "react";
import { Dimensions, Image, StyleSheet, Text, View } from "react-native";
import Carousel from "react-native-reanimated-carousel";

const { width } = Dimensions.get("window");

export default function Healthadvantage() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const images = [
    {
      id: 1,
      url: require("../../assets/images/money.png"),
      title: "Affordable Plans",
      description: "One of the best prices in the market, guaranteed by Global Health and Allied Insurance.",
      color: "#4CAF50",
      bgColor: "#E8F5E8",
    },
    {
      id: 2,
      url: require("../../assets/images/guide.png"),
      title: "Honest Guidance",
      description: "Unbiased advice that always puts our customers first.",
      color: "#2196F3",
      bgColor: "#E3F2FD",
    },
    {
      id: 3,
      url: require("../../assets/images/agreement.png"),
      title: "Trusted & Regulated",
      description: "100% reliable and fully regulated by IRDAI.",
      color: "#FF9800",
      bgColor: "#FFF3E0",
    },
    {
      id: 4,
      url: require("../../assets/images/claim (1).png"),
      title: "Easy Claim Process",
      description: "Claims support made stress-free and simple.",
      color: "#9C27B0",
      bgColor: "#F3E5F5",
    },
  ];

  // Create pairs of items for 2x2 layout
  const createPairs = (data) => {
    const pairs = [];
    for (let i = 0; i < data.length; i += 2) {
      pairs.push({
        id: `pair-${i}`,
        items: data.slice(i, i + 2)
      });
    }
    return pairs;
  };

  const pairedData = createPairs(images);

  const renderCard = (item) => (
    <View key={item.id} style={[styles.card, { backgroundColor: item.bgColor }]}>
      <View style={[styles.iconContainer, { backgroundColor: item.color }]}>
        <Image source={item.url} style={styles.image} resizeMode="contain" />
      </View>
      <View style={styles.textContainer}>
        <Text style={[styles.cardTitle, { color: item.color }]}>
          {item.title}
        </Text>
        <Text style={styles.description}>{item.description}</Text>
      </View>
    </View>
  );

  const renderPair = ({ item }) => (
    <View style={styles.pairContainer}>
      <View style={styles.row}>
        {item.items.map((cardItem) => renderCard(cardItem))}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.mainTitle}>Global Health</Text>
        <Text style={styles.subtitle}>Advantage</Text>
        <View style={styles.divider} />
      </View>
      
      <View style={styles.carouselWrapper}>
        <Carousel
          loop={false}
          width={width}
          height={400}
          autoPlay={false}
          data={pairedData}
          scrollAnimationDuration={800}
          renderItem={renderPair}
          style={styles.carousel}
          onSnapToItem={(index) => setCurrentIndex(index)}
          panGestureHandlerProps={{
            activeOffsetX: [-10, 10],
          }}
        />
        
        {/* Page Indicator */}
        <View style={styles.pageIndicator}>
          <Text style={styles.pageIndicatorText}>
            {currentIndex + 1}/{pairedData.length}
          </Text>
        </View>
      </View>
      
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Swipe to explore all benefits →
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAFBFC",
  },
  headerContainer: {
    alignItems: "center",
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  mainTitle: {
    fontSize: 32,
    fontWeight: "800",
    color: "#1a1a1a",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 28,
    fontWeight: "600",
    color: "#4CAF50",
    textAlign: "center",
    marginTop: -5,
  },
  divider: {
    width: 60,
    height: 4,
    backgroundColor: "#4CAF50",
    borderRadius: 2,
    marginTop: 10,
  },
  carouselWrapper: {
    position: "relative",
  },
  carousel: {
    paddingVertical: 10,
  },
  pageIndicator: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  pageIndicatorText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "600",
  },
  pairContainer: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 15,
  },
  row: {
    flexDirection: "column",
    justifyContent: "space-between",
    gap: 15,
  },
  card: {
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 6,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.8)",
  },
  iconContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  image: {
    width: 40,
    height: 40,
    tintColor: "#FFFFFF",
  },
  textContainer: {
    alignItems: "center",
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 8,
  },
  description: {
    fontSize: 13,
    color: "#666",
    textAlign: "center",
    lineHeight: 18,
    fontWeight: "400",
  },
  footer: {
    alignItems: "center",
    paddingVertical: 15,
    paddingBottom: 30,
  },
  footerText: {
    fontSize: 14,
    color: "#888",
    fontWeight: "500",
  },
});