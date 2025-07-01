import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Claims = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("claim");

  const [formData, setFormData] = useState({
    policyNumber: "",
    emailAddress: "",
    registerNumber: "",
    engineNumber: "",
    chassisNumber: "",
  });

  const [errors, setErrors] = useState({});

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const newErr = { ...prev };
        delete newErr[field];
        return newErr;
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.policyNumber.trim()) {
      newErrors.policyNumber = "Policy number is required";
    } else if (
      !/^GIC\/\d{4}-\d{2}\/\d{2}\/\d{4}$/.test(formData.policyNumber)
    ) {
      newErrors.policyNumber = "Format: GIC/2025-26/01/5244";
    }

    if (!formData.emailAddress.trim()) {
      newErrors.emailAddress = "Email address is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.emailAddress)) {
      newErrors.emailAddress = "Invalid email format";
    }

    if (!formData.registerNumber.trim()) {
      newErrors.registerNumber = "Register number required";
    } else if (formData.registerNumber.length < 6) {
      newErrors.registerNumber = "Min 6 characters";
    }

    if (!formData.engineNumber.trim()) {
      newErrors.engineNumber = "Engine number is required";
    }

    // if (!formData.chassisNumber.trim()) {
    //   newErrors.chassisNumber = "Chassis number is required";
    // } else if (formData.chassisNumber.length !== 17) {
    //   newErrors.chassisNumber = "Must be 17 characters";
    // }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleReset = () => {
    setFormData({
      policyNumber: "",
      emailAddress: "",
      registerNumber: "",
      engineNumber: "",
      chassisNumber: "",
    });
    setErrors({});
  };

  const handleNext = () => {
    if (validateForm()) {
      Alert.alert("Success", "Form validated successfully!");
      console.log("Form Data:", formData);
      router.push("../Accident");
    }
  };

  const FormField = ({
    label,
    value,
    onChangeText,
    placeholder,
    error,
    keyboardType = "default",
  }) => (
    <View style={styles.fieldContainer}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[styles.input, error && styles.inputError]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#999"
        keyboardType={keyboardType}
      />
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );

  const steps = [
    {
      id: 1,
      title: "Download the Global Health App and login to start claim filing.",
      icon: "📱",
      backgroundColor: "#E8F5E8",
    },
    {
      id: 2,
      title: "Fill all the details related to the accident and damages.",
      icon: "📝",
      backgroundColor: "#D4F4DD",
    },
    {
      id: 3,
      title: "Update your personal details and click Register Claim to file.",
      icon: "✅",
      backgroundColor: "#E1F0FF",
    },
    {
      id: 4,
      title: "That's it! Claim registered. Simple with the Digit App.",
      icon: "🎉",
      backgroundColor: "#FFF9E6",
    },
  ];

  const OfferCard = ({ step }) => (
    <View style={[styles.offerCard, { backgroundColor: step.backgroundColor }]}>
      <Text style={styles.stepIcon}>{step.icon}</Text>
      <Text style={styles.stepText}>{step.title}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === "claim" && styles.activeTab]}
          onPress={() => setActiveTab("claim")}
        >
          <Text
            style={
              activeTab === "claim" ? styles.activeText : styles.inactiveText
            }
          >
            Claim Process
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === "intimateclaim" && styles.activeTab,
          ]}
          onPress={() => setActiveTab("intimateclaim")}
        >
          <Text
            style={
              activeTab === "intimateclaim"
                ? styles.activeText
                : styles.inactiveText
            }
          >
            Intimate Claim
          </Text>
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
        >
          {activeTab === "claim" ? (
            <View>
              <Text style={styles.heading}>
                File Motor Claims in Simple Steps
              </Text>
              {steps.map((step) => (
                <OfferCard key={step.id} step={step} />
              ))}
            </View>
          ) : (
            <View style={styles.formSection}>
              <Text style={styles.heading}>Intimate Claim</Text>

              <View style={styles.fieldContainer}>
                <Text style={styles.label}>Policy Number</Text>
                <TextInput
                  style={[
                    styles.input,
                    errors.policyNumber && styles.inputError,
                  ]}
                  value={formData.policyNumber}
                  onChangeText={(value) =>
                    handleInputChange("policyNumber", value)
                  }
                  placeholder="GIC/2025-26/01/5244"
                  placeholderTextColor="#999"
                />
                {errors.policyNumber && (
                  <Text style={styles.errorText}>{errors.policyNumber}</Text>
                )}
              </View>

              <View style={styles.fieldContainer}>
                <Text style={styles.label}>Email Address</Text>
                <TextInput
                  style={[
                    styles.input,
                    errors.emailAddress && styles.inputError,
                  ]}
                  value={formData.emailAddress}
                  onChangeText={(value) =>
                    handleInputChange("emailAddress", value)
                  }
                  placeholder="Enter your email"
                  placeholderTextColor="#999"
                  keyboardType="email-address"
                />
                {errors.emailAddress && (
                  <Text style={styles.errorText}>{errors.emailAddress}</Text>
                )}
              </View>

              <View style={styles.fieldContainer}>
                <Text style={styles.label}>Register Number</Text>
                <TextInput
                  style={[
                    styles.input,
                    errors.registerNumber && styles.inputError,
                  ]}
                  value={formData.registerNumber}
                  onChangeText={(value) =>
                    handleInputChange("registerNumber", value)
                  }
                  placeholder="e.g. TN01AB1234"
                  placeholderTextColor="#999"
                />
                {errors.registerNumber && (
                  <Text style={styles.errorText}>{errors.registerNumber}</Text>
                )}
              </View>

              <View style={styles.fieldContainer}>
                <Text style={styles.label}>Engine Number</Text>
                <TextInput
                  style={[
                    styles.input,
                    errors.engineNumber && styles.inputError,
                  ]}
                  value={formData.engineNumber}
                  onChangeText={(value) =>
                    handleInputChange("engineNumber", value)
                  }
                  placeholder="Engine number"
                  placeholderTextColor="#999"
                />
                {errors.engineNumber && (
                  <Text style={styles.errorText}>{errors.engineNumber}</Text>
                )}
              </View>

              <View style={styles.fieldContainer}>
                <Text style={styles.label}>Chassis Number</Text>
                <TextInput
                  style={[
                    styles.input,
                    errors.chassisNumber && styles.inputError,
                  ]}
                  value={formData.chassisNumber}
                  onChangeText={(value) =>
                    handleInputChange("chassisNumber", value)
                  }
                  placeholder="17 character chassis number"
                  placeholderTextColor="#999"
                />
                {errors.chassisNumber && (
                  <Text style={styles.errorText}>{errors.chassisNumber}</Text>
                )}
              </View>

              <View style={styles.buttonRow}>
                <TouchableOpacity
                  style={styles.resetButton}
                  onPress={handleReset}
                >
                  <Text style={styles.resetText}>Reset</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.nextButton}
                  onPress={handleNext}
                >
                  <Text style={styles.nextText}>Move Next</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f0f2f5" },
  scroll: { padding: 20, paddingBottom: 60 },
  tabBar: {
    flexDirection: "row",
    margin: 16,
    backgroundColor: "#fff",
    borderRadius: 30,
    overflow: "hidden",
    elevation: 2,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
  },
  activeTab: {
    backgroundColor: "#007aff",
  },
  activeText: {
    color: "#fff",
    fontWeight: "bold",
  },
  inactiveText: {
    color: "#007aff",
  },
  heading: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#333",
  },
  offerCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  stepIcon: {
    fontSize: 28,
    marginBottom: 10,
  },
  stepText: {
    fontSize: 15,
    color: "#333",
  },
  formSection: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
    elevation: 2,
  },
  fieldContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 6,
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    borderRadius: 8,
    backgroundColor: "#fff",
  },
  inputError: {
    borderColor: "#ff4d4f",
    backgroundColor: "#fff0f0",
  },
  errorText: {
    color: "#ff4d4f",
    marginTop: 4,
    fontSize: 12,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  resetButton: {
    flex: 1,
    marginRight: 8,
    padding: 14,
    borderRadius: 8,
    backgroundColor: "#e2e8f0",
    alignItems: "center",
  },
  nextButton: {
    flex: 1,
    marginLeft: 8,
    padding: 14,
    borderRadius: 8,
    backgroundColor: "#007aff",
    alignItems: "center",
  },
  resetText: {
    color: "#333",
    fontWeight: "bold",
  },
  nextText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default Claims;
