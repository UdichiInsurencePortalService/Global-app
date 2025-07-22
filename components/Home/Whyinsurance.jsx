import React from 'react';
import {
  Dimensions,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

const { width: screenWidth } = Dimensions.get('window');

const Whyinsurance = () => {
  const popularOffers = [
    {
      id: 1,
      type: 'Customer First',
      title: 'Putting you First Protection What matters most',
      backgroundColor: '#E8F7F0',
      gradientColors: ['#E8F7F0', '#D1F2E3'],
      icon: '🔒',
      decorativeEmoji: '💰',
      description: 'Annual tax savings',
      tagColor: '#2D5A3D'
    },
    {
      id: 2,
      type: 'High Claim Settlement Ratio',
      title: 'Hassie-free claims with a smooth and quick process',
      backgroundColor: '#E8F5E8',
      gradientColors: ['#E8F5E8', '#D4F4DD'],
      icon: '☂️',
      decorativeEmoji: '🛡️',
      tagColor: '#2D5A3D'
    },
    {
      id: 3,
      type: 'Trustworthy & Dependable ',
      title: 'Our team is always available to assists you anytime anywhere ',
      backgroundColor: '#E3F2FD',
      gradientColors: ['#E3F2FD', '#BBDEFB'],
      icon: '💙',
      decorativeEmoji: '🏥',
      tagColor: '#1565C0'
    },
    {
      id: 4,
      type: 'Get Insured in a Flash',
      title: 'Skip the wait—secure your insurance in under a minute, anytime, anywhere',
      backgroundColor: '#FFF9E6',
      gradientColors: ['#FFF9E6', '#FFF3C4'],
      icon: '⚡',
      decorativeEmoji: '🕐',
      tagColor: '#F57C00'
    },
    {
      id: 5,
      type: 'Customer Support',
      title: 'Our Customer support team is here to assist you every step of the way',
      backgroundColor: '#FCE4EC',
      gradientColors: ['#FCE4EC', '#F8BBD9'],
      icon: '👨‍👩‍👧‍👦',
      decorativeEmoji: '📈',
      description: 'Trusted plans',
      tagColor: '#C2185B'
    },
    {
      id: 6,
      type: 'Health Insurance',
      title: 'Get Cashless Treatment Anywhere',
      backgroundColor: '#E0F2F1',
      gradientColors: ['#E0F2F1', '#B2DFDB'],
      icon: '💚',
      decorativeEmoji: '🏥',
      description: 'Treatment anywhere',
      tagColor: '#00695C'
    }
  ];

  const OfferCard = ({ offer, isLarge = false }) => (
    <TouchableOpacity 
      style={[
        styles.offerCard, 
        { backgroundColor: offer.backgroundColor },
        isLarge ? styles.largeCard : styles.regularCard
      ]}
      activeOpacity={0.85}
    >
      {/* Background decorative circles */}
      <View style={[styles.decorativeCircle1, { backgroundColor: 'rgba(255, 255, 255, 0.15)' }]} />
      <View style={[styles.decorativeCircle2, { backgroundColor: 'rgba(255, 255, 255, 0.1)' }]} />
      
      {/* Header with icon */}
      <View style={styles.cardHeader}>
        <View style={styles.iconContainer}>
          <Text style={styles.cardIcon}>{offer.icon}</Text>
        </View>
      </View>
      
      {/* Type tag */}
      <View style={[styles.typeTag, { backgroundColor: offer.tagColor }]}>
        <Text style={styles.typeText}>{offer.type}</Text>
      </View>
      
      {/* Title */}
      <Text style={styles.offerTitle}>{offer.title}</Text>
      
      {/* Highlight section */}
      <View style={styles.highlightSection}>
        <Text style={styles.highlightText}>{offer.highlight}</Text>
        <Text style={styles.descriptionText}>{offer.description}</Text>
      </View>
      
      {/* Decorative element at bottom right */}
      <View style={styles.decorativeBottom}>
        <Text style={styles.decorativeEmoji}>{offer.decorativeEmoji}</Text>
      </View>
      
      {/* Floating coins/elements */}
      <View style={[styles.floatingElement1, { backgroundColor: 'rgba(255, 193, 7, 0.3)' }]} />
      <View style={[styles.floatingElement2, { backgroundColor: 'rgba(255, 152, 0, 0.2)' }]} />
      <View style={[styles.floatingElement3, { backgroundColor: 'rgba(255, 235, 59, 0.25)' }]} />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        style={styles.scrollView} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header Section */}
        <View style={styles.headerSection}>
          <View style={styles.sectionHeader}>
            <View style={styles.headerIconContainer}>
              <Text style={styles.starIcon}>⭐</Text>
            </View>
            <Text style={styles.sectionTitle}>Popular offers</Text>
          </View>
        </View>

        {/* Cards Grid Section */}
        <View style={styles.cardsSection}>
          <View style={styles.offersGrid}>
            {/* First row - 2 cards */}
            <View style={styles.row}>
              <View style={styles.cardWrapper}>
                <OfferCard offer={popularOffers[0]} />
              </View>
              <View style={styles.cardWrapper}>
                <OfferCard offer={popularOffers[1]} isLarge />
              </View>
            </View>
            
            {/* Second row - 2 cards */}
            <View style={styles.row}>
              <View style={styles.cardWrapper}>
                <OfferCard offer={popularOffers[2]} isLarge />
              </View>
              <View style={styles.cardWrapper}>
                <OfferCard offer={popularOffers[3]} />
              </View>
            </View>
            
            {/* Third row - 2 cards */}
            <View style={styles.row}>
              <View style={styles.cardWrapper}>
                <OfferCard offer={popularOffers[4]} />
              </View>
              <View style={styles.cardWrapper}>
                <OfferCard offer={popularOffers[5]} />
              </View>
            </View>
          </View>
        </View>

       
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    // Removed paddingBottom: 100
  },
  headerSection: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
    backgroundColor: '#FFFFFF',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerIconContainer: {
    backgroundColor: '#4A90E2',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  starIcon: {
    fontSize: 16,
    color: '#FFFFFF',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#4A4A4A',
    flex: 1,
  },
  cardsSection: {
    paddingHorizontal: 16,
  },
  offersGrid: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 12,
    gap: 8,
  },
  cardWrapper: {
    flex: 1,
  },
  offerCard: {
    borderRadius: 20,
    padding: 16,
    position: 'relative',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  regularCard: {
    minHeight: 160,
  },
  largeCard: {
    minHeight: 200,
  },
  cardHeader: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  iconContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  cardIcon: {
    fontSize: 16,
  },
  typeTag: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  typeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  offerTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#2C2C2C',
    lineHeight: 18,
    marginBottom: 12,
  },
  highlightSection: {
    marginBottom: 8,
  },
  highlightText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 2,
  },
  descriptionText: {
    fontSize: 11,
    color: '#666',
    fontWeight: '500',
  },
  decorativeBottom: {
    position: 'absolute',
    right: 12,
    bottom: 12,
  },
  decorativeEmoji: {
    fontSize: 24,
    opacity: 0.7,
  },
  decorativeCircle1: {
    position: 'absolute',
    width: 60,
    height: 60,
    borderRadius: 30,
    top: -20,
    right: -20,
  },
  decorativeCircle2: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderRadius: 20,
    bottom: -15,
    left: -15,
  },
  floatingElement1: {
    position: 'absolute',
    width: 12,
    height: 12,
    borderRadius: 6,
    top: 30,
    right: 20,
  },
  floatingElement2: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
    top: 50,
    right: 35,
  },
  floatingElement3: {
    position: 'absolute',
    width: 10,
    height: 10,
    borderRadius: 5,
    bottom: 40,
    right: 25,
  },

});

export default Whyinsurance;