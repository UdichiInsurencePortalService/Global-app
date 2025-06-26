import React from "react";
import {
  Dimensions,
  Image,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import Carousel from "react-native-reanimated-carousel";
import Whyinsurance from "../../components/Home/Whyinsurance";

const { width } = Dimensions.get("window");

import InsuranceBanner from "../../components/Home/Award";
import Healthadvantage from "../../components/Home/Healthadvantage";

const images = [
  { src: require("../../assets/images/benefits-insurance.jpg") },
  { src: require("../../assets/images/benefits-insurance.jpg") },
  { src: require("../../assets/images/benefits-insurance.jpg") },
];

const users = [
  {
    id: "1",
    img: require("../../assets/images/car-icons.png"),
    Title: "Car Insurance",
    backgroundColor: "#FFF9E6",
  },
  {
    id: "2",
    img: require("../../assets/images/bike-icon.png"),
    Title: "Bike Insurance",
    backgroundColor: "#E1F0FF",
  },
  {
    id: "3",
    img: require("../../assets/images/health-icon.png"),
    Title: "Health Insurance",
    backgroundColor: "#E8F5E8",
  },
  {
    id: "4",
    img: require("../../assets/images/rick.png"),
    Title: "Auto Insurance",
    backgroundColor: "#E1F0FF",
  },
  {
    id: "5",
    img: require("../../assets/images/home-icon.png"),
    Title: "Home Insurance",
    backgroundColor: "#D4F4DD",
  },
];

export default function Home() {
  // Create rows of 3 items each
  const createRows = () => {
    const rows = [];
    for (let i = 0; i < users.length; i += 3) {
      rows.push(users.slice(i, i + 3));
    }
    return rows;
  };

  const renderCard = (item) => (
    <TouchableOpacity
      key={item.id}
      style={[styles.card, { backgroundColor: item.backgroundColor }]}
    >
      <View style={styles.iconContainer}>
        <Image source={item.img} style={styles.image} />
      </View>
      <Text style={styles.cardText}>{item.Title}</Text>
    </TouchableOpacity>
  );

  const renderRow = (rowData, rowIndex) => {
    const isLastRow = rowIndex === Math.floor((users.length - 1) / 3);
    const itemsInRow = rowData.length;

    let rowStyle = [styles.row];

    // Center the last row if it has fewer than 3 items
    if (isLastRow && itemsInRow < 3) {
      rowStyle.push(styles.centeredRow);
    }

    return (
      <View key={rowIndex} style={rowStyle}>
        {rowData.map(renderCard)}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="rgb(245, 250, 255)"
        translucent={false}
      />
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        <View style={styles.mainContent}>
          {/* Carousel Section */}
          <View style={styles.carouselContainer}>
            <Carousel
              loop
              autoPlay={true}
              autoPlayInterval={3000}
              width={width - 20}
              height={180}
              data={images}
              scrollAnimationDuration={1000}
              style={styles.carousel}
              renderItem={({ item }) => (
                <View style={styles.slide}>
                  <Image
                    source={item.src}
                    style={styles.carouselImage}
                    resizeMode="cover"
                  />
                </View>
              )}
            />
          </View>

          {/* Insurance Options Section */}
          <View style={styles.insuranceSection}>
            <Text style={styles.sectionTitle}>What to Protect Most Today:</Text>

            <View style={styles.gridContainer}>
              {createRows().map(renderRow)}
            </View>
          </View>
          
        </View>

        <View style={styles.container}>
          <InsuranceBanner />
        </View>
        <View>
          <Whyinsurance />
        </View>
        <View>
          <Healthadvantage />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgb(245, 250, 255)",
  },
  scrollView: {
    flex: 1,
  },
  mainContent: {
    backgroundColor: "rgb(245, 250, 255)",
    paddingBottom: 20,
  },
  carouselContainer: {
    alignItems: "center",
    paddingVertical: 15,
  },
  carousel: {
    borderRadius: 12,
  },
  slide: {
    flex: 1,
    borderRadius: 12,
    overflow: "hidden",
    marginHorizontal: 5,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  carouselImage: {
    width: "100%",
    height: "100%",
  },
  insuranceSection: {
    paddingHorizontal: 15,
    marginTop: 5,
  },
  sectionTitle: {
    display: "flex",
    justifyContent: "center",
    alignSelf: "center",
    fontSize: 27,
    fontWeight: "700",
    color: "#1a1a1a",
    marginBottom: 20,
    textAlign: "center",
  },
  gridContainer: {
    paddingBottom: 10,
    // backgroundColor: '#E8F5E8',
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
    paddingHorizontal: 5,
  },
  centeredRow: {
    justifyContent: "center",
    gap: 10, // Add spacing between centered items
  },
  card: {
    backgroundColor: "white",
    borderRadius: 12,
    width: (width - 60) / 3, // Adjusted for 3 columns
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 6,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.12,
    shadowRadius: 2.5,
    borderWidth: 0.5,
    borderColor: "rgba(0,0,0,0.08)",
    minHeight: 100,
    marginHorizontal: 2,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(59, 130, 246, 0.15)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  image: {
    width: 24,
    height: 24,
    resizeMode: "contain",
  },
  cardText: {
    fontSize: 11,
    color: "#2d3748",
    fontWeight: "600",
    textAlign: "center",
    lineHeight: 14,
  },
  additionalContent: {
    paddingHorizontal: 15,
    paddingVertical: 20,
    marginTop: 10,
  },
  additionalText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    fontStyle: "italic",
  },
});
