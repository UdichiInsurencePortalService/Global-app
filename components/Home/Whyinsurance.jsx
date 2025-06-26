import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

const WhyInsurance = () => {
  const popularOffers = [
    {
      id: 1,
      type: 'Customer First',
      title: 'Putting you first. Protecting what matters most.',
      backgroundColor: '#E8F5E8',
    },
    {
      id: 2,
      type: 'High Claim Settlement Ratio',
      title: 'Hassle-free claims with a smooth and quick process.',
      backgroundColor: '#D4F4DD',
    },
    {
      id: 3,
      type: 'Trustworthy & Dependable',
      title: 'Our team is always available to assist you anytime, anywhere.',
      backgroundColor: '#E1F0FF',
    },
    {
      id: 4,
      type: 'Customer Support',
      title: 'Our customer support team is here to assist you every step of the way.',
      backgroundColor: '#FFF9E6',
    }
  ];

  const OfferCard = ({ offer }) => (
    <TouchableOpacity style={[styles.offerCard, { backgroundColor: offer.backgroundColor }]}>
      <View style={styles.typeTag}>
        <Text style={styles.typeText}>{offer.type}</Text>
      </View>
      <Text style={styles.offerTitle}>{offer.title}</Text>
      {offer.subtitle && (
        <Text style={styles.offerSubtitle}>{offer.subtitle}</Text>
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.starIcon}>⭐</Text>
            <Text style={styles.sectionTitle}>Popular offers</Text>
          </View>
          <View style={styles.offersGrid}>
            {popularOffers.map((offer, index) => (
              <View 
                key={offer.id} 
                style={[
                  styles.offerCardWrapper,
                  index % 2 === 0 ? styles.leftCard : styles.rightCard
                ]}
              >
                <OfferCard offer={offer} />
              </View>
            ))}
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
  section: {
    padding: 16,
    paddingBottom: 8,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  starIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  offersGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  offerCardWrapper: {
    width: '48%',
    marginBottom: 12,
  },
  leftCard: {
    marginRight: '2%',
  },
  rightCard: {
    marginLeft: '2%',
  },
  offerCard: {
    padding: 16,
    borderRadius: 16,
    minHeight: 140,
    position: 'relative',
  },
  typeTag: {
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  typeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '500',
  },
  offerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
    lineHeight: 20,
    marginBottom: 4,
  },
  offerSubtitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2E7D32',
  }
});

export default WhyInsurance;
