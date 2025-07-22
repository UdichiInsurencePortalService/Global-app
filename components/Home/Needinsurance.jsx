import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useRef, useState } from 'react';
import {
    Animated,
    Dimensions,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

const { width: screenWidth } = Dimensions.get('window');

const Needinsurance = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollViewRef = useRef(null);
  const scrollX = useRef(new Animated.Value(0)).current;

  // Insurance data with different topics and icons
  const insuranceData = [
    {
      id: 1,
      title: 'Affordable Plans',
      description: 'One of the best prices in the market, guaranteed by Global Health and Allied Insurance',
      icon: '💚',
      gradient: ['#667eea', '#764ba2'],
    },
    {
      id: 2,
      title: 'Honest Guidance',
      description: 'Unbiased advice that always puts our customers first..',
      icon: '🛡️',
      gradient: ['#43e97b', '#38f9d7'],
    },
    {
      id: 3,
      title: 'Trusted & Regulated',
      description: '100% reliable and fully regulated by IRDAI.',
      icon: '🚗',
      gradient: ['#fa709a', '#fee140'],
    },
    {
      id: 4,
      title: 'Easy Claim Process',
      description: 'Claims support made stress-free and simple..',
      icon: '🏠',
      gradient: ['#a8edea', '#fed6e3'],
    },
  ];

  // Auto-scroll functionality
  useEffect(() => {
    const interval = setInterval(() => {
      const nextIndex = (currentIndex + 1) % insuranceData.length;
      setCurrentIndex(nextIndex);
      scrollViewRef.current?.scrollTo({
        x: nextIndex * screenWidth,
        animated: true,
      });
    }, 3000); // Change slide every 3 seconds

    return () => clearInterval(interval);
  }, [currentIndex]);

  const onScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
    {
      useNativeDriver: false,
      listener: (event) => {
        const slideSize = screenWidth;
        const index = Math.round(event.nativeEvent.contentOffset.x / slideSize);
        setCurrentIndex(index);
      },
    }
  );

  const scrollToIndex = (index) => {
    scrollViewRef.current?.scrollTo({
      x: index * screenWidth,
      animated: true,
    });
    setCurrentIndex(index);
  };

  const renderInsuranceCard = (item, index) => (
    <View key={item.id} style={styles.slideContainer}>
      <View style={styles.card}>
        <LinearGradient
          colors={[...item.gradient, 'transparent']}
          style={styles.gradientBackground}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />
        
        {/* Card Content */}
        <View style={styles.cardContent}>
          {/* Icon and Title Section */}
          <View style={styles.headerSection}>
            <View style={styles.iconContainer}>
              <LinearGradient
                colors={item.gradient}
                style={styles.iconGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Text style={styles.iconText}>{item.icon}</Text>
              </LinearGradient>
            </View>
            <View style={styles.titleContainer}>
              <Text style={styles.cardTitle}>{item.title}</Text>
            </View>
          </View>
          
          {/* Description */}
          <Text style={styles.cardDescription}>{item.description}</Text>
          
          {/* Learn More Button */}
          <TouchableOpacity style={styles.buttonContainer}>
            <LinearGradient
              colors={item.gradient}
              style={styles.learnMoreButton}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Text style={styles.buttonText}>Learn More</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
        
        {/* Decorative Elements */}
        <View style={styles.decorativeCircle1} />
        <View style={styles.decorativeCircle2} />
      </View>
    </View>
  );

  const PaginationDots = () => (
    <View style={styles.paginationContainer}>
      {insuranceData.map((_, index) => {
        const opacity = scrollX.interpolate({
          inputRange: [
            (index - 1) * screenWidth,
            index * screenWidth,
            (index + 1) * screenWidth,
          ],
          outputRange: [0.3, 1, 0.3],
          extrapolate: 'clamp',
        });

        const scale = scrollX.interpolate({
          inputRange: [
            (index - 1) * screenWidth,
            index * screenWidth,
            (index + 1) * screenWidth,
          ],
          outputRange: [0.8, 1.2, 0.8],
          extrapolate: 'clamp',
        });

        return (
          <TouchableOpacity
            key={index}
            onPress={() => scrollToIndex(index)}
          >
            <Animated.View
              style={[
                styles.paginationDot,
                {
                  opacity,
                  transform: [{ scale }],
                },
              ]}
            />
          </TouchableOpacity>
        );
      })}
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Main Heading */}
      <View style={styles.headerContainer}>
        <Text style={styles.mainTitle}>Why You Need Insurance</Text>
        <Text style={styles.mainSubtitle}>
          Protect yourself, your family, and your assets with the right insurance coverage.
        </Text>
      </View>

      {/* Carousel */}
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
        decelerationRate="fast"
        style={styles.scrollView}
      >
        {insuranceData.map((item, index) => renderInsuranceCard(item, index))}
      </ScrollView>

      <PaginationDots />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f8f9fa',
    paddingVertical: 30,
  },
  headerContainer: {
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  mainTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1a202c',
    textAlign: 'center',
    marginBottom: 12,
  },
  mainSubtitle: {
    fontSize: 16,
    color: '#4a5568',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 10,
  },
  scrollView: {
    height: 300,
  },
  slideContainer: {
    width: screenWidth,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  card: {
    width: screenWidth - 40,
    height: 260,
    backgroundColor: '#ffffff',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    overflow: 'hidden',
    position: 'relative',
  },
  gradientBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.1,
  },
  cardContent: {
    padding: 24,
    flex: 1,
    justifyContent: 'space-between',
    zIndex: 2,
  },
  headerSection: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  iconContainer: {
    marginRight: 16,
  },
  iconGradient: {
    width: 60,
    height: 60,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  iconText: {
    fontSize: 28,
  },
  titleContainer: {
    flex: 1,
    paddingTop: 4,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1a202c',
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#4a5568',
    fontWeight: '500',
  },
  cardDescription: {
    fontSize: 14,
    color: '#2d3748',
    lineHeight: 20,
    marginBottom: 20,
  },
  buttonContainer: {
    alignSelf: 'flex-start',
  },
  learnMoreButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  decorativeCircle1: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 40,
    height: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 20,
  },
  decorativeCircle2: {
    position: 'absolute',
    bottom: 16,
    right: 24,
    width: 20,
    height: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 10,
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    paddingHorizontal: 20,
  },
  paginationDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#667eea',
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 2,
  },
});

export default Needinsurance;