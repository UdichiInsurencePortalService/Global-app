// components/OffersGrid.js
import { useEffect, useRef } from 'react';
import {
  Animated,
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const { width } = Dimensions.get('window');

const OffersGrid = ({
  sectionTitle = 'Popular offers',
  emoji = '⭐',
  offers = [],
}) => {
  const fadeAnimRefs = useRef(offers.map(() => new Animated.Value(0))).current;
  const translateYRefs = useRef(offers.map(() => new Animated.Value(30))).current;
  const scaleRefs = useRef(offers.map(() => new Animated.Value(0.9))).current;

  useEffect(() => {
    const animations = offers.map((_, index) => {
      return Animated.parallel([
        Animated.timing(fadeAnimRefs[index], {
          toValue: 1,
          duration: 500,
          delay: index * 120,
          useNativeDriver: true,
        }),
        Animated.spring(translateYRefs[index], {
          toValue: 0,
          tension: 80,
          friction: 8,
          delay: index * 120,
          useNativeDriver: true,
        }),
        Animated.spring(scaleRefs[index], {
          toValue: 1,
          tension: 80,
          friction: 8,
          delay: index * 120,
          useNativeDriver: true,
        }),
      ]);
    });

    Animated.stagger(80, animations).start();
  }, [offers]);

  const OfferCard = ({ offer, index }) => {
    const pressAnim = useRef(new Animated.Value(1)).current;

    const handlePressIn = () => {
      Animated.spring(pressAnim, {
        toValue: 0.95,
        useNativeDriver: true,
      }).start();
    };

    const handlePressOut = () => {
      Animated.spring(pressAnim, {
        toValue: 1,
        useNativeDriver: true,
      }).start();
    };

    return (
      <Animated.View
        style={{
          opacity: fadeAnimRefs[index],
          transform: [
            { translateY: translateYRefs[index] },
            { scale: scaleRefs[index] },
          ],
        }}
      >
        <TouchableOpacity
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          activeOpacity={0.9}
        >
          <Animated.View
            style={[
              styles.offerCard,
              { 
                backgroundColor: offer.backgroundColor,
                transform: [{ scale: pressAnim }],
              }
            ]}
          >
            {/* Gradient overlay effect */}
            <View style={styles.gradientOverlay} />
            
            {/* Decorative elements */}
            <View style={[styles.decorativeCircle, styles.circle1]} />
            <View style={[styles.decorativeCircle, styles.circle2]} />
            
            <View style={styles.cardContent}>
              <View style={styles.typeTag}>
                <Text style={styles.typeText}>{offer.type}</Text>
                <View style={styles.typeDot} />
              </View>
              
              <View style={styles.titleContainer}>
                <Text style={styles.offerTitle}>{offer.title}</Text>
                {offer.subtitle && (
                  <Text style={styles.offerSubtitle}>{offer.subtitle}</Text>
                )}
              </View>
              
              {/* Action indicator */}
              {/* <View style={styles.actionIndicator}>
                <Text style={styles.actionText}>Tap to explore</Text>
                <View style={styles.arrow}>
                  <Text style={styles.arrowText}>→</Text>
                </View>
              </View> */}
            </View>
          </Animated.View>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.sectionHeader}>
        <View style={styles.headerContent}>
          <View style={styles.emojiContainer}>
            <Text style={styles.emoji}>{emoji}</Text>
          </View>
          <Text style={styles.sectionTitle}>{sectionTitle}</Text>
        </View>
        <View style={styles.headerLine} />
      </View>
      
      <View style={styles.offersGrid}>
        {offers.map((offer, index) => (
          <View
            key={offer.id}
            style={[
              styles.offerCardWrapper,
              index % 2 === 0 ? styles.leftCard : styles.rightCard,
            ]}
          >
            <OfferCard offer={offer} index={index} />
          </View>
        ))}
      </View>
    </View>
  );
};

export default OffersGrid;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  sectionHeader: {
    marginBottom: 24,
    textAlign:"center"
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  emojiContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F8F9FA',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  emoji: {
    fontSize: 18,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1A1A1A',
    letterSpacing: -0.5,
  },
  // headerLine: {
  //   height: 3,
  //   width: 60,
  //   backgroundColor: '#007AFF',
  //   borderRadius: 2,
  //   marginLeft: 48,
  // },
  offersGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  offerCardWrapper: {
    width: '48%',
    marginBottom: 16,
  },
  leftCard: {
    // marginRight: '1%',
  },
  rightCard: {
    marginLeft: '1%',
  },
  offerCard: {
    borderRadius: 20,
    minHeight: 220,
    position: 'relative',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  gradientOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  decorativeCircle: {
    position: 'absolute',
    borderRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  circle1: {
    width: 80,
    height: 80,
    top: -40,
    right: -40,
  },
  circle2: {
    width: 40,
    height: 40,
    bottom: 20,
    left: -20,
  },
  cardContent: {
    flex: 1,
    padding: 20,
    justifyContent: 'space-between',
  },
  typeTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  typeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  typeDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#00FF88',
    marginLeft: 6,
  },
  titleContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  offerTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1C1C1E',
    lineHeight: 24,
    marginBottom: 8,
    letterSpacing: -0.2,
    textShadowColor: 'rgba(255, 255, 255, 0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  offerSubtitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#2E7D32',
    letterSpacing: -0.1,
    textShadowColor: 'rgba(255, 255, 255, 0.6)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
  },
  actionIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  actionText: {
    fontSize: 12,
    fontWeight: '500',
    color: 'rgba(0, 0, 0, 0.6)',
    letterSpacing: 0.3,
  },
  arrow: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  arrowText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#007AFF',
  },
});