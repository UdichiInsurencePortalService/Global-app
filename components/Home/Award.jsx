import { useRouter } from "expo-router";
import { Animated, Linking } from "react-native";


import { useEffect, useRef, useState } from "react";
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";

// Mock icon components
const Award = ({ size = 24, color = "#fff" }) => (
  <View style={[styles.iconPlaceholder, { width: size, height: size }]}>
    <Text style={[styles.iconText, { color, fontSize: size * 0.5 }]}>🏆</Text>
  </View>
);

const MapPin = ({ size = 24, color = "#fff" }) => (
  <View style={[styles.iconPlaceholder, { width: size, height: size }]}>
    <Text style={[styles.iconText, { color, fontSize: size * 0.5 }]}>📍</Text>
  </View>
);

const Users = ({ size = 24, color = "#fff" }) => (
  <View style={[styles.iconPlaceholder, { width: size, height: size }]}>
    <Text style={[styles.iconText, { color, fontSize: size * 0.5 }]}>👥</Text>
  </View>
);

const Star = ({ size = 24, color = "#fff" }) => (
  <View style={[styles.iconPlaceholder, { width: size, height: size }]}>
    <Text style={[styles.iconText, { color, fontSize: size * 0.5 }]}>⭐</Text>
  </View>
);

const Sparkles = ({ size = 24, color = "#fff" }) => (
  <View style={[styles.iconPlaceholder, { width: size, height: size }]}>
    <Text style={[styles.iconText, { color, fontSize: size * 0.5 }]}>✨</Text>
  </View>
);

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");
const isTablet = screenWidth >= 768;

const InsuranceBanner = () => {
  const router = useRouter();
  const [isPressed, setIsPressed] = useState(false);

  // Simplified animations for better mobile performance
  const floatingAnim = useRef(new Animated.Value(0)).current;
  const buttonScaleAnim = useRef(new Animated.Value(1)).current;
  const sparkleAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Subtle floating animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatingAnim, {
          toValue: 1,
          duration: 4000,
          useNativeDriver: true,
        }),
        Animated.timing(floatingAnim, {
          toValue: 0,
          duration: 4000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Sparkle animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(sparkleAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(sparkleAnim, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const handleBannerPress = () => {
    console.log("Navigate to awards page");
  };


const handleButtonPress = () => {
  // Button press animation
  Animated.sequence([
    Animated.timing(buttonScaleAnim, {
      toValue: 0.95,
      duration: 100,
      useNativeDriver: true,
    }),
    Animated.timing(buttonScaleAnim, {
      toValue: 1,
      duration: 100,
      useNativeDriver: true,
    }),
  ]).start(() => {
    // Open the URL after animation completes
    Linking.openURL("http://localhost:5173/Award").catch((err) =>
      console.error("Failed to open URL:", err)
    );
  });

  // Optional: any custom logic you already had
  handleBannerPress?.();
};


  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      bounces={false}
    >
      <View style={styles.bannerContainer}>
        {/* Background Decorations */}
        <View style={styles.backgroundDecorations}>
          <Animated.View
            style={[
              styles.floatingElement,
              styles.floatingElement1,
              {
                transform: [
                  {
                    translateY: floatingAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, -15],
                    }),
                  },
                ],
                opacity: sparkleAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.3, 0.8],
                }),
              },
            ]}
          >
            <Sparkles size={12} color="rgba(255, 255, 255, 0.4)" />
          </Animated.View>

          <Animated.View
            style={[
              styles.floatingElement,
              styles.floatingElement2,
              {
                transform: [
                  {
                    translateY: floatingAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, 10],
                    }),
                  },
                ],
                opacity: sparkleAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.8, 0.3],
                }),
              },
            ]}
          >
            <Sparkles size={10} color="rgba(255, 215, 0, 0.6)" />
          </Animated.View>
        </View>

        {/* Main Content */}
        <View style={styles.content}>
          {/* Header Badge */}

          {/* Title Section */}
          <View style={styles.titleSection}>
            <Text style={styles.mainTitle}>Looking for</Text>
            <View style={styles.highlightContainer}>
              <Text style={styles.highlightText}>Medical Excellence?</Text>
              <View style={styles.highlightUnderline} />
            </View>
          </View>

          {/* Subtitle */}
          <Text style={styles.subtitle}>
            Join us for the most prestigious medical award ceremony of the year
          </Text>

          {/* Award Image Container */}
          {/* <Animated.View 
            style={[
              styles.awardImageContainer,
              {
                transform: [{
                  translateY: floatingAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, -8],
                  }),
                }],
              }
            ]}
          >
            <Award size={80} color="#ffd700" />
            <View style={styles.awardGlow} />
          </Animated.View> */}

          {/* Info Card */}
          {/* <View style={styles.infoCard}>
            <View style={styles.infoItem}>
              <View style={styles.infoIconContainer}>
                <MapPin size={20} color="#ffd700" />
              </View>
              <View style={styles.infoTextContainer}>
                <Text style={styles.infoLabel}>Venue</Text>
                <Text style={styles.infoValue}>President Complex, New Delhi</Text>
              </View>
            </View>
          </View> */}

          {/* CTA Button */}
          <Animated.View style={{ transform: [{ scale: buttonScaleAnim }] }}>
            <TouchableOpacity
              style={styles.ctaButton}
              onPress={handleButtonPress}
              activeOpacity={0.8}
            >
              <Text style={styles.buttonText}>Dr. Bidhan Chandra Awards</Text>
              <Text style={styles.buttonSubtext}>Click here</Text>
              <View style={styles.buttonIcon}>
                <Star size={18} color="#fff" />
              </View>
            </TouchableOpacity>
          </Animated.View>
        </View>

        {/* Footer */}
        {/* <View style={styles.footer}>
          <View style={styles.organizerInfo}>
            <Users size={16} color="#666" />
            <Text style={styles.organizerText}>
              Global Health and Allied Insurance Service{'\n'}
              In Association with Udichi Group of Companies
            </Text>
          </View>
          <View style={styles.ratingStars}>
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={12} color="#0066cc" />
            ))}
          </View>
        </View> */}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  bannerContainer: {
    backgroundColor: "#4d9fc5",
    marginHorizontal: 16,
    marginVertical: 20,
    borderRadius: 20,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
    position: "relative",
  },
  backgroundDecorations: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
  },
  floatingElement: {
    position: "absolute",
  },
  floatingElement1: {
    top: "15%",
    right: "10%",
  },
  floatingElement2: {
    top: "70%",
    left: "15%",
  },
  content: {
    padding: 24,
    zIndex: 2,
    alignItems: "center",
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  badgeText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 8,
  },
  titleSection: {
    alignItems: "center",
    marginBottom: 16,
  },
  mainTitle: {
    fontSize: isTablet ? 36 : 28,
    fontWeight: "800",
    color: "#fff",
    textAlign: "center",
    lineHeight: isTablet ? 44 : 34,
  },
  highlightContainer: {
    position: "relative",
    alignItems: "center",
  },
  highlightText: {
    fontSize: isTablet ? 36 : 28,
    fontWeight: "800",
    color: "#ffd700",
    textAlign: "center",
    lineHeight: isTablet ? 44 : 34,
  },
  highlightUnderline: {
    position: "absolute",
    bottom: -4,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: "#ffd700",
    borderRadius: 2,
  },
  subtitle: {
    color: "rgba(255, 255, 255, 0.9)",
    fontSize: isTablet ? 18 : 16,
    textAlign: "center",
    lineHeight: isTablet ? 26 : 24,
    marginBottom: 32,
    paddingHorizontal: 16,
  },
  awardImageContainer: {
    width: 120,
    height: 120,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.2)",
    position: "relative",
  },
  awardGlow: {
    position: "absolute",
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: "rgba(255, 215, 0, 0.1)",
    top: -10,
    left: -10,
  },
  infoCard: {
    width: "100%",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 16,
    padding: 16,
    marginBottom: 32,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  infoIconContainer: {
    backgroundColor: "rgba(255, 215, 0, 0.2)",
    padding: 10,
    borderRadius: 12,
    marginRight: 16,
  },
  infoTextContainer: {
    flex: 1,
  },
  infoLabel: {
    color: "rgba(255, 255, 255, 0.7)",
    fontSize: 12,
    fontWeight: "500",
    marginBottom: 2,
  },
  infoValue: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  ctaButton: {
    backgroundColor: "#ff6b6b",
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 25,
    shadowColor: "#ff6b6b",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    minWidth: 280,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
    textAlign: "center",
  },
  buttonSubtext: {
    color: "rgba(255, 255, 255, 0.9)",
    fontSize: 12,
    marginLeft: 4,
    marginRight: 8,
  },
  buttonIcon: {
    marginLeft: 8,
  },
  footer: {
    backgroundColor: "#f8fafc",
    paddingHorizontal: 24,
    paddingVertical: 16,
    alignItems: "center",
  },
  organizerInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  organizerText: {
    color: "#666",
    fontSize: 12,
    fontWeight: "600",
    marginLeft: 8,
    textAlign: "center",
    lineHeight: 16,
  },
  ratingStars: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconPlaceholder: {
    alignItems: "center",
    justifyContent: "center",
  },
  iconText: {
    textAlign: "center",
  },
});

export default InsuranceBanner;
