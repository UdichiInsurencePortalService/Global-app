import { useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons"; // Make sure this is installed
import Whatcoverd from "../Reusablecomponent/Whatcoverd";
import Whatis from "../Reusablecomponent/Whatis";

export default function BikeScreen() {
  const [registrationNumber, setRegistrationNumber] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [loading, setLoading] = useState(false);

  const buttonScaleAnim = useRef(new Animated.Value(1)).current;

  const handleCheckDetails = () => {
    setLoading(true);
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

    setTimeout(() => {
      setLoading(false);
      alert("Vehicle details found!");
    }, 2000);
  };

  const whybuybike = [
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
      description:
        "With Global Health, you have the freedom to decide your car's IDV based on your needs.",
    },
  ];

  const bikeInsuranceSteps = [
  {
    id: 1,
    iconText: require("../assets/images/number-one.png"),
    title: "Step 1",
    backgroundColor: "#E8F5E8",
    description:
      "On the Global Health App or website, enter bike’s registration number, select the policy status and click on ‘View Prices’.",
  },
  {
    id: 2,
    iconText: require("../assets/images/two.png"),
    title: "Step 2",
    backgroundColor: "#FFF3E0",
    description:
      "Select the plan, add-ons and click on ‘Continue.’",
  },
  {
    id: 3,
    iconText: require("../assets/images/number-3.png"),
    title: "Step 3",
    backgroundColor: "#E3F2FD",
    description:
      "Enter your personal, nominee and vehicle details and click on ‘Pay Now.’",
  },
  {
    id: 4,
    iconText: require("../assets/images/number-four.png"),
    title: "Step 4",
    backgroundColor: "#F3E5F5",
    description:
      "Complete the payment and mandatory KYC verification process.",
  },
  {
    id: 5,
    iconText: require("../assets/images/number-5.png"),
    title: "Step 5",
    backgroundColor: "#FBE9E7",
    description:
      "You’re done! You’ll receive the policy document via email, SMS and WhatsApp. Also, you can access it 24X7 on the Global Health App.",
  },
];


  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Icon name="bicycle" size={40} color="#6366F1" />
          <Text style={styles.title}>Bike Lookup</Text>
          <Text style={styles.subtitle}>Find detailed bike information</Text>
        </View>

        {/* Form */}
        <View style={styles.formContainer}>
          <View style={styles.inputContainer}>
            <Icon
              name="key-outline"
              size={20}
              color="#6366F1"
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.input}
              placeholder="Registration No: (e.g., RJ25BH0267)"
              placeholderTextColor="#9CA3AF"
              value={registrationNumber}
              onChangeText={setRegistrationNumber}
              autoCapitalize="characters"
              editable={!loading}
            />
          </View>

          <View style={styles.inputContainer}>
            <Icon
              name="call-outline"
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
                  <Icon name="search-outline" size={20} color="white" />
                  <Text style={styles.buttonText}>Find Bike</Text>
                </View>
              )}
            </TouchableOpacity>
          </Animated.View>
        </View>
        <View>
          <Whatis
            title="What is Bike Insurance?"
            cardTitle="Insurance Overview"
            icon="🏍️"
            description="Bike Insurance is a type of vehicle insurance that provides coverage for two-wheelers against accidents, theft, natural disasters, and damages."
            highlightText="It also offers third-party liability protection, ensuring you're financially secure if your bike causes injury or damage to others."
            bottomText="You can choose from third-party or comprehensive policies and enhance your coverage with add-ons like zero depreciation, roadside assistance, and more."
          />
        </View>
        <View>
          <Whatcoverd
            title="Why Should You Buy Global Health & Allied Insurance Service Bike Insurance?"
            data={whybuybike}
          />
        </View>

        <View>
          <Whatcoverd
            title="How to Buy/Renew Two-Wheeler Insurance with Global Health?"
            // emoji="🚗"
            data={bikeInsuranceSteps}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  scrollContainer: {
    padding: 20,
    paddingBottom: 60,
  },
  header: {
    marginTop: 15,
    alignItems: "center",
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#111827",
    marginTop: 10,
  },
  subtitle: {
    fontSize: 14,
    color: "#6B7280",
    marginTop: 4,
  },
  formContainer: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 20,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F3F4F6",
    borderRadius: 12,
    marginBottom: 16,
    paddingHorizontal: 15,
  },
  inputIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    height: 48,
    color: "#111827",
    fontSize: 16,
  },
  buttonContainer: {
    marginTop: 10,
  },
  button: {
    backgroundColor: "#6366F1",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
});
