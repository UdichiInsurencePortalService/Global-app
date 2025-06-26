import { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Claims = () => {
  const [activetabs, setactivetabs] = useState("claim");

  const popularOffers = [
    {
      id: 1,
      type: 'Step 1',
      title: 'Download the Global Health App using the QR code above or by clicking on the File Motor Claim button. Login and you\'ll be directed to the File Motor Claim page. Click on the policy card to start claim filing.',
      backgroundColor: '#E8F5E8',
    },
    {
      id: 2,
      type: 'Step 2',
      title: 'Fill all the details related to the accident and damages.',
      backgroundColor: '#D4F4DD',
    },
    {
      id: 3,
      type: 'Step 3',
      title: 'Update your personal details and click on the Register Claim button. That\'s it, your claim is successfully filed and you will receive the next steps on your email & whatsapp.',
      backgroundColor: '#E1F0FF',
    },
    {
      id: 4,
      type: 'Step 4',
      title: 'That\'s it! Your claim has been registered, it\'s that simple with the Digit App.',
      backgroundColor: '#FFF9E6',
    },
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
      <View style={styles.tabscontainer}>
        {/* Tab 1: Claim Process */}
        <TouchableOpacity
          style={[styles.tab, activetabs === "claim" && styles.activeTab]}
          onPress={() => setactivetabs("claim")}
        >
          <Text
            style={[
              styles.tabText,
              activetabs === "claim" && styles.activeTabText,
            ]}
          >
            Claim Process
          </Text>
        </TouchableOpacity>

        {/* Tab 2: Intimate Claim */}
        <TouchableOpacity
          style={[
            styles.tab,
            activetabs === "intimateclaim" && styles.activeTab,
          ]}
          onPress={() => setactivetabs("intimateclaim")}
        >
          <Text
            style={[
              styles.tabText,
              activetabs === "intimateclaim" && styles.activeTabText,
            ]}
          >
            Intimate Claim
          </Text>
        </TouchableOpacity>
      </View>

      {/* Tab content */}
      {activetabs === "claim" ? (
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          style={styles.scrollView}
        >
          <View style={styles.contentContainer}>
            <Text style={styles.claimtext}>File Global Motor Claims Online in Simple Steps</Text>

            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Follow the steps given below to file your motor claims instantly.</Text>
              </View>
              <View style={styles.offersGrid}>
                {popularOffers.map((offer, index) => (
                  <View 
                    key={offer.id} 
                    style={styles.offerCardWrapper}
                  >
                    <OfferCard offer={offer} />
                  </View>
                ))}
              </View>
            </View>
          </View>
        </ScrollView>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          style={styles.scrollView}
        >
          <View style={styles.contentContainer}>
            <Text style={styles.claimtext}>Intimate Claim Process</Text>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Contact our support team to intimate your claim.</Text>
              <View style={styles.intimateClaimCard}>
                <Text style={styles.intimateText}>
                  Call us at: 1800-258-4242{'\n'}
                  Email: claims@globalhealth.com{'\n'}
                  Available 24/7 for assistance
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

export default Claims;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    paddingHorizontal: 24,
    paddingVertical: 34,
  },
  tabscontainer: {
    flexDirection: "row",
    marginBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    backgroundColor: "#F8F9FA",
    borderRadius: 30,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 26,
  },
  activeTab: {
    backgroundColor: "#007aff",
  },
  tabText: {
    textAlign: "center",
    fontWeight: "500",
    color: "#6B7280",
    fontSize: 14,
  },
  activeTabText: {
    color: "white",
    fontWeight: "600",
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 20,
  },
  claimtext: {
    textAlign: "center",
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 20,
    color: "#333",
  },
  section: {
    paddingHorizontal: 8,
  },
  sectionHeader: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#555",
    textAlign: "center",
    lineHeight: 22,
  },
  offersGrid: {
    gap: 12,
  },
  offerCardWrapper: {
    width: '100%',
    marginBottom: 12,
  },
  offerCard: {
    padding: 16,
    borderRadius: 16,
    minHeight: 120,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  typeTag: {
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: '20%',
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  typeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  offerTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    lineHeight: 20,
  },
  offerSubtitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2E7D32',
    marginTop: 8,
  },
  intimateClaimCard: {
    backgroundColor: '#F0F9FF',
    padding: 20,
    borderRadius: 16,
    marginTop: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#007aff',
  },
  intimateText: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
    fontWeight: '500',
  },
});