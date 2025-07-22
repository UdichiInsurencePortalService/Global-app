import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Animated,
  Dimensions,
  Easing,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
const { width, height } = Dimensions.get("window");

import Icon from "react-native-vector-icons/Ionicons";
import Whatcoverd from "../Reusablecomponent/Whatcoverd";
import Whatis from "../Reusablecomponent/Whatis";

import OffersGrid from "../Reusablecomponent/OffersGrid";

// const { width } = Dimensions.get('window');

const Car = () => {
  const [selectedItems, setSelectedItems] = useState(null);
  const [modalVisibles, setModalVisibles] = useState(false);

  const coverage = [
    {
      id: "1",
      iconText: require("../assets/icons/car.png"),
      title: "Accidents",
      backgroundColor: "#FFF9E6",
      description:
        "Damages and losses that may arise out of accidents and collisions",
    },
    {
      id: "2",
      iconText: require("../assets/icons/theft.png"),
      title: "Theft",
      backgroundColor: "#E1F0FF",
      description:
        "Covers for the losses incurred when your car is unfortunately stolen",
    },
    {
      id: "3",
      iconText: require("../assets/icons/fire.png"),
      title: "Fire",
      backgroundColor: "#E8F5E8",
      description:
        "Damages and losses caused to your car due to an accidental fire",
    },
    {
      id: "4",
      iconText: require("../assets/icons/dia.png"),
      title: "Natural Disasters",
      backgroundColor: "#E1F0FF",
      description:
        "Damages and losses to your car in case of natural calamities such as floods, cyclones, etc.",
    },
    {
      id: "5",
      iconText: require("../assets/icons/acci.png"),
      title: "Personal Accident",
      backgroundColor: "#D4F4DD",
      display:"flex",
      justifyContent:"center",
      description:
        "If there is a car accident and unfortunately, it leads to death or disability of the owner",
    },
    {
      id: "6",
      iconText: require("../assets/icons/third.png"),
      title: "Third-Party Losses",
      backgroundColor: "#E1F0FF",
      description:
        "In cases where your car causes damages and losses to someone else, their car or property.",
    },
  ];
  //not covert setion content

  const exclusions = [
    {
      id: "1",
      iconText: require("../assets/icons/own1.png"),
      title: "Own Damages for Third-Party Policy Holder",
      backgroundColor: "#FFF9E6",
      description:
        "Damages to your own vehicle are not covered under third-party insurance policies. This type of policy only covers damages caused to other vehicles or property. If you want coverage for your own vehicle damages, you need a comprehensive insurance policy.",
    },
    {
      id: "2",
      iconText: require("../assets/icons/drunk2.png"),
      title: "Drunk Driving or without a Licence",
      backgroundColor: "#E1F0FF",
      description:
        "Insurance claims are automatically rejected if the driver was under the influence of alcohol or drugs at the time of the accident. This is considered a violation of traffic laws and insurance terms, making the policy void for such incidents.",
    },
    {
      id: "3",
      iconText: require("../assets/icons/driving3.png"),
      title: "Driving without a Valid Driving Licence Holder",
      backgroundColor: "#E8F5E8",
      description:
        "If the vehicle is driven by someone without a valid driving license or with an expired license, the insurance company will not honor any claims. A valid license is a fundamental requirement for insurance coverage.",
    },
    {
      id: "4",
      iconText: require("../assets/icons/consequential4.png"),
      title: "Consequential Damages",
      backgroundColor: "#E1F0FF",
      description:
        "Insurance policies typically exclude consequential or indirect damages such as loss of income, business interruption, or emotional distress. Only direct physical damages to the vehicle or property are usually covered.",
    },
    {
      id: "5",
      iconText: require("../assets/icons/contributory5.png"),
      title: "Contributory Negligence",
      backgroundColor: "#D4F4DD",
      description:
        "If the policyholder is found to be partially responsible for the accident due to negligent driving or violation of traffic rules, the insurance payout may be reduced proportionally or completely denied based on the degree of negligence.",
    },
    {
      id: "6",
      iconText: require("../assets/icons/add6.png"),
      title: "Add-Ons Not Bought",
      backgroundColor: "#E1F0FF",
      description:
        "Coverage for specific scenarios like engine damage, roadside assistance, or zero depreciation is only available if you have purchased these add-on covers. Without buying these extras, such damages are not covered under the basic policy.",
    },
  ];

  const Whyshould = [
    {
      id: "1",
      iconText: require("../assets/icons/repair.png"),
      title: "Cashless Repairs",
      backgroundColor: "#FFF9E6",
      description:
        "Access 9000+ cashless garages across India for a smooth, worry-free repair experience.",
    },
    {
      id: "2",
      iconText: require("../assets/icons/document.png"),
      title: "DIY Claim Inspection",
      backgroundColor: "#E1F0FF",
      description:
        "Use your smartphone to capture the damage – no lengthy surveys or inspections required.",
    },
    {
      id: "3",
      iconText: require("../assets/icons/gear.png"),
      title: "Lightning-Fast Claims",
      backgroundColor: "#E8F5E8",
      description:
        "We've settled 96% of car insurance claims – experience a process that's quick and hassle-free.",
    },
    {
      id: "4",
      iconText: require("../assets/icons/24-hours-support.png"),
      title: "24x7 Customer Care",
      backgroundColor: "#E1F0FF",
      description:
        "Have a query or need help? Our team is available around the clock, even on national holidays.",
    },
    {
      id: "5",
      iconText: require("../assets/icons/customization.png"),
      title: "Set Your Own Vehicle IDV",
      backgroundColor: "#D4F4DD",
      display:"flex",
      justifyContent:"center",
      description:
        "With Global Health, you have the freedom to decide your car's IDV based on your needs.",
    },
  ];

  // const popularOffers = [
  //   {
  //     id: 1,
  //     type: 'Customer First',
  //     title: 'Putting you first. Protecting what matters most.',
  //     backgroundColor: '#E8F5E8',
  //   },
  //   {
  //     id: 2,
  //     type: 'High Claim Settlement Ratio',
  //     title: 'Hassle-free claims with a smooth and quick process.',
  //     backgroundColor: '#D4F4DD',
  //   },
  //   {
  //     id: 3,
  //     type: 'Trustworthy & Dependable',
  //     title: 'Our team is always available to assist you anytime, anywhere.',
  //     backgroundColor: '#E1F0FF',
  //   },
  //   {
  //     id: 4,
  //     type: 'Customer Support',
  //     title: 'Our customer support team is here to assist you every step of the way.',
  //     backgroundColor: '#FFF9E6',
  //   }
  // ];

  const popularOffers = [
    {
      id: 1,
      type: "Step 1",
      title:
        "Enter your car number and mobile on the app or website, then tap 'Check Prices'.",
      backgroundColor: "#E8F5E8",
    },
    {
      id: 2,
      type: "Step 2",
      title: "Pick a plan, add extras, set IDV, and tap 'Next'.",
      backgroundColor: "#D4F4DD",
    },
    {
      id: 3,
      type: "Step 3",
      title:
        "Fill in your details, nominee info, and car details. Tap 'Pay Now'.",
      backgroundColor: "#E1F0FF",
    },
    {
      id: 4,
      type: "Step 4",
      title: "Make payment and complete KYC.",
      backgroundColor: "#FFF9E6",
    },
  ];

  const [registrationNumber, setRegistrationNumber] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [carData, setCarData] = useState(null);
  const [error, setError] = useState("");

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(300)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const buttonScaleAnim = useRef(new Animated.Value(1)).current;

  const animateDataEntry = () => {
    // Reset animations
    fadeAnim.setValue(0);
    slideAnim.setValue(300);
    scaleAnim.setValue(0.8);

    // Parallel animations for smooth entry
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
        easing: Easing.out(Easing.cubic),
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
        easing: Easing.out(Easing.back(1.2)),
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
        easing: Easing.out(Easing.cubic),
      }),
    ]).start();
  };

  const animateButtonPress = () => {
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
    ]).start();
  };

  const handleCheckDetails = async () => {
    if (!registrationNumber.trim() || !phoneNumber.trim()) {
      Alert.alert(
        "Error",
        "Please enter both registration number and phone number"
      );
      return;
    }

    animateButtonPress();
    setLoading(true);
    setError("");
    setCarData(null);

    try {
      const queryParams = new URLSearchParams({
        registration_number: registrationNumber.toUpperCase().trim(),
        mobile_number: phoneNumber.trim(),
      });

      const apiUrl = `http://192.168.1.4:8080/api/vehicle/getcardata?${queryParams.toString()}`;
      console.log("API URL:", apiUrl);

      const response = await fetch(apiUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Full car data:", JSON.stringify(data, null, 2));

      if (
        data &&
        (Array.isArray(data) ? data.length > 0 : Object.keys(data).length > 0)
      ) {
        const vehicleData = Array.isArray(data) ? data[0] : data;
        setCarData(vehicleData);
        animateDataEntry();
        console.log("Vehicle found:", vehicleData);
      } else {
        setError("Data not found");
        console.log("No vehicle data found");
      }
    } catch (err) {
      console.error("API Error:", err);
      setError("Data not found");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString("en-IN");
    } catch {
      return "N/A";
    }
  };

  const formatCurrency = (amount) => {
    if (!amount) return "N/A";
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const DataRow = ({ icon, label, value, iconColor = "#6366F1" }) => (
    <View style={styles.dataRow}>
      <View style={styles.dataRowHeader}>
        <Icon name={icon} size={20} color={iconColor} style={styles.dataIcon} />
        <Text style={styles.dataLabel}>{label}</Text>
      </View>
      <Text style={styles.dataValue}>{value}</Text>
    </View>
  );

  const [activeCard, setActiveCard] = useState(null);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const renderFeatureCard = (feature, index) => (
    <TouchableOpacity
      key={index}
      style={[
        styles.featureCard,
        activeCard === index && styles.activeFeatureCard,
      ]}
      onPress={() => setActiveCard(activeCard === index ? null : index)}
      activeOpacity={0.8}
    >
      <View style={[styles.iconContainer, { backgroundColor: feature.color }]}>
        <Text style={styles.iconText}>{feature.icon}</Text>
      </View>
      <Text style={styles.featureTitle}>{feature.title}</Text>
      <Text style={styles.featureDescription}>{feature.description}</Text>
      {activeCard === index && (
        <View style={styles.expandedContent}>
          <Text style={styles.expandedText}>
            This coverage ensures you're protected in various scenarios and
            helps maintain financial stability.
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Icon name="car-sport" size={40} color="#6366F1" />
          <Text style={styles.title}>Vehicle Lookup</Text>
          <Text style={styles.subtitle}>Find detailed vehicle information</Text>
        </View>
        {/* Form Container */}
        <View style={styles.formContainer}>
          <View style={styles.inputContainer}>
            <Icon
              name="car"
              size={20}
              color="#6366F1"
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.input}
              placeholder="Registration Number (e.g., 25BH0267B)"
              placeholderTextColor="#9CA3AF"
              value={registrationNumber}
              onChangeText={setRegistrationNumber}
              autoCapitalize="characters"
              editable={!loading}
            />
          </View>

          <View style={styles.inputContainer}>
            <Icon
              name="call"
              size={20}
              color="#6366F1"
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.input}
              placeholder="Phone Number (e.g., 9928151651)"
              placeholderTextColor="#9CA3AF"
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              keyboardType="phone-pad"
              maxLength={10}
              editable={!loading}
            />
          </View>

          <Animated.View
            style={[
              styles.buttonContainer,
              { transform: [{ scale: buttonScaleAnim }] },
            ]}
          >
            <TouchableOpacity
              style={[styles.button, loading && styles.buttonDisabled]}
              onPress={handleCheckDetails}
              disabled={loading}
              activeOpacity={0.8}
            >
              {loading ? (
                <View style={styles.buttonContent}>
                  <ActivityIndicator color="white" size="small" />
                  <Text style={styles.buttonText}>Searching...</Text>
                </View>
              ) : (
                <View style={styles.buttonContent}>
                  <Icon name="search" size={20} color="white" />
                  <Text style={styles.buttonText}>Find Vehicle</Text>
                </View>
              )}
            </TouchableOpacity>
          </Animated.View>
        </View>
        {/* Error Container */}
        {error && (
          <View style={styles.errorContainer}>
            <Icon name="alert-circle" size={24} color="#EF4444" />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}
        {/* Vehicle Data Container */}
        {carData && (
          <Animated.View
            style={[
              styles.dataContainer,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }, { scale: scaleAnim }],
              },
            ]}
          >
            <View style={styles.dataHeader}>
              <Icon name="checkmark-circle" size={32} color="#10B981" />
              <Text style={styles.dataTitle}>Vehicle Found!</Text>
            </View>

            <View style={styles.dataContent}>
              <DataRow
                icon="person"
                label="Owner Name"
                value={carData.owner_name || "N/A"}
                iconColor="#10B981"
              />

              <DataRow
                icon="car-sport"
                label="Registration Number"
                value={carData.registration_number || "N/A"}
                iconColor="#6366F1"
              />

              <DataRow
                icon="build"
                label="Maker & Model"
                value={carData.maker_model || "N/A"}
                iconColor="#F59E0B"
              />

              <DataRow
                icon="color-palette"
                label="Color"
                value={carData.color || "N/A"}
                iconColor="#EC4899"
              />

              <DataRow
                icon="flash"
                label="Fuel Type"
                value={carData.fuel_type || "N/A"}
                iconColor="#EF4444"
              />

              <DataRow
                icon="speedometer"
                label="Engine Capacity"
                value={
                  carData.engine_capacity
                    ? `${carData.engine_capacity} CC`
                    : "N/A"
                }
                iconColor="#8B5CF6"
              />

              <DataRow
                icon="call"
                label="Mobile Number"
                value={carData.mobile_number || "N/A"}
                iconColor="#06B6D4"
              />

              <DataRow
                icon="location"
                label="Address"
                value={carData.address || "N/A"}
                iconColor="#84CC16"
              />

              <DataRow
                icon="calendar"
                label="Registration Date"
                value={formatDate(carData.registration_date)}
                iconColor="#F97316"
              />

              <DataRow
                icon="calendar-outline"
                label="Purchase Date"
                value={formatDate(carData.purchase_date)}
                iconColor="#14B8A6"
              />

              <DataRow
                icon="cash"
                label="Ex-Showroom Price"
                value={formatCurrency(carData.exshowroom)}
                iconColor="#10B981"
              />

              <DataRow
                icon="shield-checkmark"
                label="Insurance Company"
                value={carData.insurance_company || "N/A"}
                iconColor="#3B82F6"
              />

              <DataRow
                icon="business"
                label="Financer"
                value={carData.financer || "N/A"}
                iconColor="#8B5CF6"
              />

              <DataRow
                icon="settings"
                label="Engine Number"
                value={carData.engine_number || "N/A"}
                iconColor="#6B7280"
              />

              <DataRow
                icon="barcode"
                label="Chassis Number"
                value={carData.chasi_number || "N/A"}
                iconColor="#374151"
              />

              <DataRow
                icon="location-outline"
                label="Registered At"
                value={carData.registered_at || "N/A"}
                iconColor="#059669"
              />
            </View>
          </Animated.View>
        )}

        <View>
          <Whatis
            title="What is Car Insurance?"
            cardTitle="Insurance Overview"
            icon="❤️"
            description=" Car Insurance, also known as auto or motor insurance, is a type of
              vehicle insurance policy that protects you and your car from any
              risks and damages caused by accidents, theft, or natural
              disasters."
            highlightText="In addition to that, it protects you from third-party
                liabilities, ensuring financial security in case of any
                unforeseen circumstances."
            bottomText=" Whether you want to legally comply with the law with basic
              third-party insurance or opt for comprehensive protection, you can
              customize your IDV and add-ons to suit your needs."
          />
        </View>

        <View>
          <Whatcoverd title="What is Covered Car Insurance?" data={coverage} />
        </View>

        <View>
          <Whatcoverd
            title="What is Not Covered Car Insurance?"
            data={exclusions}
          />
        </View>

        <View>
          <Whatcoverd
            title="Why Should You Buy Global Health Car Insurance?"
            data={Whyshould}
          />
        </View>

        <View> 
          <OffersGrid
            sectionTitle="How to Buy or Renew Car Insurance with Global Health"
            emoji="🚗"
            offers={popularOffers}
          />
        </View>
       
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  scrollContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    alignItems: "center",
    marginBottom: 30,
    paddingVertical: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "800",
    color: "#1F2937",
    marginTop: 12,
    fontFamily: "System",
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    color: "#6B7280",
    marginTop: 4,
    fontWeight: "500",
  },
  formContainer: {
    backgroundColor: "white",
    padding: 24,
    borderRadius: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#E5E7EB",
    borderRadius: 16,
    marginBottom: 20,
    backgroundColor: "#F9FAFB",
    paddingHorizontal: 16,
    paddingVertical: 4,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontWeight: "500",
    color: "#1F2937",
    paddingVertical: 16,
    fontFamily: "System",
  },
  buttonContainer: {
    marginTop: 8,
  },
  button: {
    backgroundColor: "#6366F1",
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: "center",
    shadowColor: "#6366F1",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  buttonDisabled: {
    backgroundColor: "#9CA3AF",
    shadowOpacity: 0.1,
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "700",
    marginLeft: 8,
    fontFamily: "System",
  },
  errorContainer: {
    flexDirection: "row",
    backgroundColor: "#FEF2F2",
    padding: 16,
    borderRadius: 16,
    marginBottom: 20,
    alignItems: "center",
    borderLeftWidth: 4,
    borderLeftColor: "#EF4444",
  },
  errorText: {
    color: "#DC2626",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 12,
    flex: 1,
  },
  dataContainer: {
    backgroundColor: "white",
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 10,
    overflow: "hidden",
  },
  dataHeader: {
    backgroundColor: "#F0FDF4",
    paddingVertical: 24,
    paddingHorizontal: 24,
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  dataTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: "#065F46",
    marginTop: 8,
    fontFamily: "System",
  },
  dataContent: {
    padding: 24,
  },
  dataRow: {
    marginBottom: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  dataRowHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  dataIcon: {
    marginRight: 8,
  },
  dataLabel: {
    fontSize: 14,
    color: "#6B7280",
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  dataValue: {
    fontSize: 17,
    color: "#1F2937",
    fontWeight: "600",
    marginLeft: 28,
    lineHeight: 24,
    fontFamily: "System",
  },
  headerSection: {
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 30,
  },
  headerIconContainer: {
    marginBottom: 20,
  },
  headerIcon: {
    fontSize: 60,
    backgroundColor: "#3B82F6",
    width: 100,
    height: 100,
    borderRadius: 50,
    textAlign: "center",
    lineHeight: 100,
    color: "white",
    shadowColor: "#3B82F6",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
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
    // marginHorizontal: 20,
    marginBottom: 30,
    borderRadius: 20,
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 8,
    overflow: "hidden",
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

  gridContainer: {
    paddingBottom: 20,
  },
  row: {
    justifyContent: "space-between",
    marginBottom: 16,
  },
  card: {
    width: (width - 48) / 2, // Account for padding and gap
    height: 130,
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    // shadowOffset: {
    //   width: 0,
    //   height: 2,
    // },
    // shadowOpacity: 0.1,
    // shadowRadius: 3.84,
    elevation: 5,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "rgba(255, 255, 255, 0.6)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  iconText: {
    fontSize: 24,
    textAlign: "center",
  },
  title: {
    fontSize: 14,
    fontWeight: "500",
    color: "#374151",
    textAlign: "center",
    lineHeight: 18,
  },
  // gridContainer: {
  //   paddingBottom: 20,
  // },
  // row: {
  //   justifyContent: "space-between",
  //   marginBottom: 16,
  // },
  // card: {
  //   width: (width - 48) / 2, // Account for padding and gap
  //   height: 140,
  //   borderRadius: 16,
  //   padding: 16,
  //   alignItems: "center",
  //   justifyContent: "center",
  //   shadowColor: "#000",
  //   shadowOffset: {
  //     width: 0,
  //     height: 2,
  //   },
  //   shadowOpacity: 0.1,
  //   shadowRadius: 3.84,
  //   elevation: 5,
  // },
  // iconContainer: {
  //   width: 64,
  //   height: 64,
  //   borderRadius: 32,
  //   backgroundColor: "rgba(255, 255, 255, 0.6)",
  //   alignItems: "center",
  //   justifyContent: "center",
  //   marginBottom: 12,
  // },
  // iconText: {
  //   fontSize: 24,
  //   textAlign: "center",
  // },
  // title: {
  //   fontSize: 14,
  //   fontWeight: "500",
  //   color: "#374151",
  //   textAlign: "center",
  //   lineHeight: 18,
  // },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 24,
    margin: 20,
    maxWidth: 350,
    width: "90%",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  closeButton: {
    position: "absolute",
    top: 10,
    right: 15,
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  closeButtonText: {
    fontSize: 24,
    color: "#666",
    fontWeight: "bold",
  },
  modalIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#F3F4F6",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
    marginBottom: 20,
  },
  modalIconText: {
    fontSize: 40,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1F2937",
    textAlign: "center",
    marginBottom: 16,
    lineHeight: 24,
  },
  modalDescription: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 24,
  },
  okButton: {
    backgroundColor: "#3B82F6",
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 8,
    minWidth: 100,
  },
  okButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
});

export default Car;
