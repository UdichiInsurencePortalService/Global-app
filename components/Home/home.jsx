import { useRouter } from "expo-router";
import React, { useEffect, useRef } from "react";
import {
  Animated,
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
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Carousel from "react-native-reanimated-carousel";
import Whyinsurance from "../../components/Home/Whyinsurance";

const { width, height } = Dimensions.get("window");

import InsuranceBanner from "../../components/Home/Award";
import Healthadvantage from "../../components/Home/Healthadvantage";
import Needinsurance from "../../components/Home/Needinsurance";

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
    backgroundColor: "#FFE5B4",
    gradientColors: ["#FFD93D", "#FF6B6B"],
    route: "/car",
    animationDelay: 0,
  },
  {
    id: "2",
    img: require("../../assets/images/bike-icon.png"),
    Title: "Bike Insurance",
    backgroundColor: "#B8E6FF",
    gradientColors: ["#74C0FC", "#339AF0"],
    route: "/bike",
    animationDelay: 200,
  },
  {
    id: "3",
    img: require("../../assets/images/health-icon.png"),
    Title: "Health Insurance",
    backgroundColor: "#C8F7C5",
    gradientColors: ["#8CE99A", "#51CF66"],
    route: "/health",
    animationDelay: 400,
  },
  {
    id: "4",
    img: require("../../assets/images/rick.png"),
    Title: "Auto Insurance",
    backgroundColor: "#F3E5FF",
    gradientColors: ["#D0BFFF", "#9775FA"],
    route: "/auto",
    animationDelay: 600,
  },
  {
    id: "5",
    img: require("../../assets/images/home-icon.png"),
    Title: "Home Insurance",
    backgroundColor: "#FFE0E6",
    gradientColors: ["#FFA8CC", "#FF6B9D"],
    route: "/home",
    animationDelay: 800,
  },
];

// Animated Card Component
const AnimatedCard = ({ item, onPress }) => {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const bounceAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Initial entrance animation
    setTimeout(() => {
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        }),
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ]).start();
    }, item.animationDelay);

    // Continuous bounce animation
    const bounceAnimation = () => {
      Animated.sequence([
        Animated.timing(bounceAnim, {
          toValue: -5,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(bounceAnim, {
          toValue: 0,
          duration: 1500,
          useNativeDriver: true,
        }),
      ]).start(() => bounceAnimation());
    };
    
    setTimeout(() => bounceAnimation(), item.animationDelay + 1000);

    // Pulse animation for icon
    const pulseAnimation = () => {
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.2,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]).start(() => pulseAnimation());
    };
    
    setTimeout(() => pulseAnimation(), item.animationDelay + 2000);
  }, []);

  const handlePress = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start(() => onPress());
  };

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <TouchableOpacity onPress={handlePress} activeOpacity={0.8}>
      <Animated.View
        style={[
          styles.card,
          { backgroundColor: item.backgroundColor },
          {
            transform: [
              { scale: scaleAnim },
              { translateY: bounceAnim },
            ],
          },
        ]}
      >
        {/* Animated gradient overlay */}
        <View style={[styles.gradientOverlay, { backgroundColor: item.gradientColors[0] }]} />
        
        <Animated.View
          style={[
            styles.iconContainer,
            {
              backgroundColor: item.gradientColors[1],
              transform: [
                { rotate },
                { scale: pulseAnim },
              ],
            },
          ]}
        >
          <Animated.Image 
            source={item.img} 
            style={[
              styles.image,
              {
                transform: [{ scale: pulseAnim }],
              },
            ]} 
          />
        </Animated.View>
        
        <Text style={[styles.cardText, { color: item.gradientColors[1] }]}>
          {item.Title}
        </Text>
        
        {/* Floating particles effect */}
        <View style={styles.particleContainer}>
          <View style={[styles.particle, styles.particle1, { backgroundColor: item.gradientColors[0] }]} />
          <View style={[styles.particle, styles.particle2, { backgroundColor: item.gradientColors[1] }]} />
          <View style={[styles.particle, styles.particle3, { backgroundColor: item.gradientColors[0] }]} />
        </View>
      </Animated.View>
    </TouchableOpacity>
  );
};

// Floating Animation Component
const FloatingElement = ({ children, delay = 0 }) => {
  const floatAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const startFloating = () => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(floatAnim, {
            toValue: 1,
            duration: 3000,
            useNativeDriver: true,
          }),
          Animated.timing(floatAnim, {
            toValue: 0,
            duration: 3000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    };
    
    setTimeout(() => startFloating(), delay);
  }, []);

  const translateY = floatAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -10],
  });

  return (
    <Animated.View style={{ transform: [{ translateY }] }}>
      {children}
    </Animated.View>
  );
};

export default function Home() {
  const router = useRouter();
  const titleAnim = useRef(new Animated.Value(0)).current;
  const carouselAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Title animation
    Animated.timing(titleAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();

    // Carousel animation
    Animated.timing(carouselAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  // Create rows of 3 items each
  const createRows = () => {
    const rows = [];
    for (let i = 0; i < users.length; i += 3) {
      rows.push(users.slice(i, i + 3));
    }
    return rows;
  };

  const renderRow = (rowData, rowIndex) => {
    const isLastRow = rowIndex === Math.floor((users.length - 1) / 3);
    const itemsInRow = rowData.length;

    let rowStyle = [styles.row];

    if (isLastRow && itemsInRow < 3) {
      rowStyle.push(styles.centeredRow);
    }

    return (
      <View key={rowIndex} style={rowStyle}>
        {rowData.map((item) => (
          <AnimatedCard
            key={item.id}
            item={item}
            onPress={() => router.push(item.route)}
          />
        ))}
      </View>
    );
  };

  const titleOpacity = titleAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  const titleScale = titleAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.8, 1],
  });

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="rgb(240, 248, 255)"
        translucent={false}
      />
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        bounces={true}
      >


        
        <View style={styles.mainContent}>
          {/* Animated Carousel Section */}
          <FloatingElement delay={200}>
            <Animated.View 
              style={[
                styles.carouselContainer,
                {
                  opacity: carouselAnim,
                  transform: [
                    {
                      scale: carouselAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0.9, 1],
                      }),
                    },
                  ],
                },
              ]}
            >
              <Carousel
                loop
                autoPlay={true}
                autoPlayInterval={3000}
                width={width - 20}
                height={200}
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
                    <View style={styles.carouselOverlay}>
                      <View style={styles.shimmerEffect} />
                    </View>
                  </View>
                )}
              />
            </Animated.View>
          </FloatingElement>

          {/* Animated Insurance Options Section */}
          <View style={styles.insuranceSection}>
            <Animated.Text 
              style={[
                styles.sectionTitle,
                {
                  opacity: titleOpacity,
                  transform: [{ scale: titleScale }],
                },
              ]}
            >
              What to Protect Most Today:
            </Animated.Text>

            <View style={styles.gridContainer}>
              {createRows().map(renderRow)}
            </View>
          </View>
        </View>

        <FloatingElement delay={1000}>
          <View style={styles.container}>
            <InsuranceBanner />
          </View>
        </FloatingElement>

        <FloatingElement delay={1200}>
          <View>
            <GestureHandlerRootView style={{ flex: 1 }}>
              <Needinsurance/>
            </GestureHandlerRootView>
          </View>
        </FloatingElement>

        <FloatingElement delay={1400}>
          <View>
            <Whyinsurance />
          </View>
        </FloatingElement>

        <FloatingElement delay={1600}>
          <View>
            <Healthadvantage />
          </View>
        </FloatingElement>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgb(240, 248, 255)",
  },
  scrollView: {
    flex: 1,
  },
  mainContent: {
    backgroundColor: "rgb(240, 248, 255)",
    paddingBottom: 20,
  },
  carouselContainer: {
    alignItems: "center",
    paddingVertical: 20,
  },
  carousel: {
    borderRadius: 15,
    overflow: "hidden",
  },
  slide: {
    flex: 1,
    borderRadius: 15,
    overflow: "hidden",
    marginHorizontal: 5,
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    position: "relative",
  },
  carouselImage: {
    width: "100%",
    height: "100%",
  },
  carouselOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
  shimmerEffect: {
    position: "absolute",
    top: 0,
    left: -100,
    width: 100,
    height: "100%",
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    transform: [{ skewX: "-25deg" }],
  },
  insuranceSection: {
    paddingHorizontal: 15,
    marginTop: 10,
  },
  sectionTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: "#1a365d",
    marginBottom: 25,
    textAlign: "center",
    textShadowColor: "rgba(0, 0, 0, 0.1)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  gridContainer: {
    paddingBottom: 15,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
    paddingHorizontal: 5,
  },
  centeredRow: {
    justifyContent: "center",
    gap: 15,
  },
  card: {
    borderRadius: 20,
    width: (width - 70) / 3,
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 8,
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.3)",
    minHeight: 120,
    marginHorizontal: 3,
    position: "relative",
    overflow: "hidden",
  },
  gradientOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.1,
    borderRadius: 20,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  image: {
    width: 28,
    height: 28,
    resizeMode: "contain",
    tintColor: "white",
  },
  cardText: {
    fontSize: 12,
    fontWeight: "700",
    textAlign: "center",
    lineHeight: 16,
    textShadowColor: "rgba(0, 0, 0, 0.1)",
    textShadowOffset: { width: 0.5, height: 0.5 },
    textShadowRadius: 1,
  },
  particleContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    pointerEvents: "none",
  },
  particle: {
    position: "absolute",
    width: 4,
    height: 4,
    borderRadius: 2,
    opacity: 0.6,
  },
  particle1: {
    top: 10,
    left: 15,
    animationDelay: "0s",
  },
  particle2: {
    top: 25,
    right: 12,
    animationDelay: "1s",
  },
  particle3: {
    bottom: 15,
    left: 20,
    animationDelay: "2s",
  },
});