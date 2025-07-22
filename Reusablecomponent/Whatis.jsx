// components/InfoSection.js
import { useEffect, useRef } from "react";
import { Animated, StyleSheet, Text, View } from "react-native";

const Whatis = ({
  title,
  cardTitle,
  description,
  highlightText,
  bottomText,
  icon = "ℹ️",
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(40)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <View style={styles.container}>
      {/* Animated Header */}
      <Animated.View
        style={[
          styles.headerSection,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <Text style={styles.mainTitle}>{title}</Text>
        <View style={styles.titleUnderline} />
      </Animated.View>

      {/* Info Card */}
      <Animated.View
        style={[
          styles.mainCard,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <View style={styles.cardHeader}>
          <View style={styles.cardHeaderContent}>
            <Text style={styles.cardHeaderIcon}>{icon}</Text>
            <Text style={styles.cardHeaderTitle}>{cardTitle}</Text>
          </View>
        </View>

        <View style={styles.cardBody}>
          <Text style={styles.mainDescription}>{description}</Text>

          {highlightText ? (
            <View style={styles.highlightBox}>
              <Text style={styles.highlightText}>{highlightText}</Text>
            </View>
          ) : null}

          {bottomText ? (
            <Text style={styles.customizationText}>{bottomText}</Text>
          ) : null}
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // padding: 20,
    backgroundColor: "#f9f9f9",
    flex: 1,
  },
  headerSection: {
    alignItems: "center",
    paddingTop: 40,
    paddingBottom: 30,
  },
  mainTitle: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#1F2937",
    textAlign: "center",
    marginBottom: 5,
    lineHeight: 40,
  },
  titleUnderline: {
    width: 250,
    height: 4,
    backgroundColor: "#3B82F6",
    borderRadius: 2,
  },
  mainCard: {
    borderRadius: 20,
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 8,
    overflow: "hidden",
    marginBottom: 30,
  },
  cardHeader: {
    backgroundColor: "#3B82F6",
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  cardHeaderContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  cardHeaderIcon: {
    fontSize: 22,
    marginRight: 12,
  },
  cardHeaderTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "white",
  },
  cardBody: {
    padding: 20,
  },
  mainDescription: {
    fontSize: 16,
    lineHeight: 24,
    color: "#374151",
    marginBottom: 20,
    fontWeight: "500",
  },
  highlightBox: {
    backgroundColor: "#F0F9FF",
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: "#3B82F6",
    marginBottom: 20,
  },
  highlightText: {
    fontSize: 17,
    lineHeight: 24,
    color: "#1E40AF",
    fontWeight: "600",
  },
  customizationText: {
    fontSize: 16,
    lineHeight: 24,
    color: "#374151",
    fontWeight: "500",
  },
});

export default Whatis;
