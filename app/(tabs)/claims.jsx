
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  Animated,
  Dimensions,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const API_BASE_URL = 'http://192.168.1.4:8080/api';

const { width } = Dimensions.get('window');

const Claims = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showPolicyModal, setShowPolicyModal] = useState(false);
  const [policyData, setPolicyData] = useState(null);

  const checkPolicyExists = async (policyNumber) => {
    try {
      console.log('checking if policyNumber exist', policyNumber);
      const response = await fetch(`${API_BASE_URL}/policy?policyNumber=${encodeURIComponent(policyNumber)}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      console.log('policy checked response status', response.status);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Policy verification failed');
      }
      
      // Check if policy is expired from API response
      if (data.exists && data.isValid === false) {
        return {
          success: false,
          expired: true,
          data: data.policyData || null,
          message: data.message || 'Your policy has expired. Please renew it to continue.'
        };
      }
      
      return {
        success: data.exists && data.isValid !== false,
        data: data.policyData || null,
        message: data.exists ? 'Policy found and valid' : 'Policy not found'
      };
      
    } catch (error) {
      console.error('Error checking policy existence:', error);
      return { 
        success: false, 
        message: error.message || 'Unable to verify policy number. Please check and try again.' 
      };
    }
  };

  // Helper function to format period of insurance
  const formatPeriodOfInsurance = (periodOfInsurance) => {
    if (!periodOfInsurance) {
      return 'Not specified';
    }

    // If it's an object with startDate and endDate
    if (typeof periodOfInsurance === 'object' && periodOfInsurance.startDate && periodOfInsurance.endDate) {
      const startDate = new Date(periodOfInsurance.startDate).toLocaleDateString();
      const endDate = new Date(periodOfInsurance.endDate).toLocaleDateString();
      return `${startDate} to ${endDate}`;
    }

    // If it's a string, return as is
    if (typeof periodOfInsurance === 'string') {
      return periodOfInsurance;
    }

    return 'Not specified';
  };

  // Step 2: Check period of insurance from policy data
  const checkPolicyPeriod = (policyData) => {
    try {
      console.log('Checking policy period from policy data:', policyData);
      
      if (!policyData) {
        return {
          success: false,
          message: 'No policy data provided'
        };
      }
      
      // Get the period of insurance from policy data
      const periodOfInsurance = policyData.period_of_insurance || policyData.periodOfInsurance;
      
      console.log('Period of insurance found:', periodOfInsurance);
      
      // Check if period is null or undefined
      if (periodOfInsurance === null || periodOfInsurance === undefined || periodOfInsurance === '') {
        return {
          success: false,
          nullPeriod: true,
          message: 'Policy has null period of insurance'
        };
      }
      
      // Check if policy is expired
      const isExpired = isPolicyExpired(periodOfInsurance);
      
      return {
        success: !isExpired,
        expired: isExpired,
        periodOfInsurance: periodOfInsurance,
        policyData: policyData,
        message: isExpired ? 'Policy has expired' : 'Policy is valid'
      };
      
    } catch (error) {
      console.error('Error checking policy period:', error);
      return { 
        success: false, 
        message: error.message || 'Unable to verify policy period. Please try again.' 
      };
    }
  };

  // Enhanced policy expiration check - supports multiple formats
  const isPolicyExpired = (periodData, policyNumber) => {
    try {
      const currentDate = new Date();
      const currentDateStr = currentDate.toISOString().split('T')[0];
      console.log('=== POLICY EXPIRATION CHECK ===');
      console.log('Current Date:', currentDateStr);
      console.log('Current Year:', currentDate.getFullYear());
      console.log('Period String received:', periodData);

      // Handle object format with startDate and endDate
      if (typeof periodData === 'object' && periodData.startDate && periodData.endDate) {
        const startDate = new Date(periodData.startDate);
        const endDate = new Date(periodData.endDate);

        console.log('Parsed Start Date:', startDate.toISOString().split('T')[0]);
        console.log('Parsed End Date:', endDate.toISOString().split('T')[0]);

        const isExpired = currentDate > endDate;
        console.log('Date Comparison: Current > End Date?', isExpired);

        if (isExpired) {
          console.log('🚨 POLICY EXPIRED - Current date is after end date');
          return true;
        }
        return false;
      }

      // Format: [2023-05-20,2024-04-20)
      if (typeof periodData === 'string' && periodData.includes('[') && periodData.includes(',')) {
        const cleanPeriod = periodData.replace(/[\[\]()]/g, '');
        const [startDateStr, endDateStr] = cleanPeriod.split(',');

        if (startDateStr && endDateStr) {
          const startDate = new Date(startDateStr.trim());
          const endDate = new Date(endDateStr.trim());

          console.log('Parsed Start Date:', startDate.toISOString().split('T')[0]);
          console.log('Parsed End Date:', endDate.toISOString().split('T')[0]);

          const isExpired = currentDate > endDate;
          console.log('Date Comparison: Current > End Date?', isExpired);

          if (isExpired) {
            console.log('🚨 POLICY EXPIRED - Current date is after end date');
            return true;
          }
          return false;
        }
      }

      // Format: "20 May 2024 to 19 May 2025" or "2024-01-01 to 2025-01-01"
      if (typeof periodData === 'string' && periodData.toLowerCase().includes('to')) {
        const dateParts = periodData.split(/\s+to\s+/i);
        if (dateParts.length === 2) {
          const startDate = new Date(dateParts[0].trim());
          const endDate = new Date(dateParts[1].trim());

          console.log('Parsed Start Date:', startDate.toISOString().split('T')[0]);
          console.log('Parsed End Date:', endDate.toISOString().split('T')[0]);

          const isExpired = currentDate > endDate;
          console.log('Date Comparison: Current > End Date?', isExpired);

          if (isExpired) {
            console.log('🚨 POLICY EXPIRED - Current date is after end date');
            return true;
          }
          return false;
        }
      }

      // ✅ Fallback: check using policy number year
      console.log('Checking policy number for year validation...');
      if (policyNumber) {
        const yearMatch = policyNumber.match(/\/([0-9]{4}-[0-9]{2})\//);
        if (yearMatch && yearMatch[1]) {
          const [startYearStr, endYearStr] = yearMatch[1].split('-');
          const policyStartYear = parseInt(startYearStr);
          const policyEndYear = parseInt('20' + endYearStr);
          const currentYear = currentDate.getFullYear();

          console.log('Policy Year from Number:', yearMatch[1]);
          console.log('Policy Start Year:', policyStartYear);
          console.log('Policy End Year:', policyEndYear);
          console.log('Current Year:', currentYear);

          if (currentYear > policyEndYear) {
            console.log('🚨 POLICY EXPIRED - Current year is after policy end year');
            return true;
          }

          console.log('Policy number year check: Policy appears valid based on number year');
        }
      }

      // Extra fallback: period contains only old years
      if (typeof periodData === 'string') {
        const yearMatches = periodData.match(/202[0-9]/g);
        if (yearMatches && yearMatches.length > 0) {
          const latestYear = Math.max(...yearMatches.map(y => parseInt(y)));
          const currentYear = currentDate.getFullYear();

          console.log('Latest year found in period:', latestYear);
          console.log('Current year:', currentYear);

          if (currentYear - latestYear > 1) {
            console.log('🚨 POLICY EXPIRED - Period contains years too far in the past');
            return true;
          }
        }
      }

      console.log('✅ Policy appears to be valid');
      return false;

    } catch (error) {
      console.error('Error checking policy expiration:', error);
      console.log('🚨 ERROR - Assuming policy is expired for safety');
      return true;
    }
  };

  // UPDATED: Combined policy verification function
  const verifyPolicy = async (policyNumber) => {
    try {
      setIsLoading(true);
      
      // Step 1: Check if policy exists and get policy data
      const existsCheck = await checkPolicyExists(policyNumber);
      
      // Handle expired policy from API response first
      if (existsCheck.expired) {
        Alert.alert(
          "Policy Expired",
          existsCheck.message || 'Your policy has expired. Please renew it to continue.',
          [{ text: "OK" }]
        );
        return {
          success: false,
          expired: true,
          message: existsCheck.message || 'Your policy has expired. Please renew it to continue.'
        };
      }
      
      if (!existsCheck.success) {
        Alert.alert(
          "Policy Not Found",
          existsCheck.message || 'Policy not found. Please check your policy number and try again.',
          [{ text: "OK" }]
        );
        return {
          success: false,
          message: existsCheck.message || 'Policy not found. Please check your policy number and try again.'
        };
      }
      
      console.log('Policy exists and is valid from API, now checking period from policy data...');
      
      // Step 2: Check policy period from the policy data we already have
      const periodCheck = checkPolicyPeriod(existsCheck.data);
      
      if (!periodCheck.success) {
        if (periodCheck.nullPeriod) {
          Alert.alert(
            "Policy Error",
            'Error: Policy has null period of insurance. Please contact customer support.',
            [{ text: "OK" }]
          );
          return {
            success: false,
            nullPeriod: true,
            message: 'Error: Policy has null period of insurance. Please contact customer support.'
          };
        }
        
        if (periodCheck.expired) {
          Alert.alert(
            "Policy Expired",
            'Your policy has expired. Please renew it to continue.',
            [{ text: "OK" }]
          );
          return {
            success: false,
            expired: true,
            message: 'Your policy has expired. Please renew it to continue.',
            periodOfInsurance: periodCheck.periodOfInsurance
          };
        }
        
        Alert.alert(
          "Verification Error",
          periodCheck.message || 'Unable to verify policy period.',
          [{ text: "OK" }]
        );
        return {
          success: false,
          message: periodCheck.message || 'Unable to verify policy period.'
        };
      }
      
      // Pre-populate form data if available
      if (existsCheck.data) {
        setFormData(prevData => ({
          ...prevData,
          emailAddress: existsCheck.data.email || prevData.emailAddress,
          registerNumber: existsCheck.data.registrationNumber || existsCheck.data.registration_number || prevData.registerNumber
        }));
      }
      
      // Show policy information modal
      setPolicyData({
        policyNumber: policyNumber,
        periodOfInsurance: periodCheck.periodOfInsurance,
        ...existsCheck.data
      });
      setShowPolicyModal(true);
      
      return {
        success: true,
        data: existsCheck.data,
        message: 'Policy verified successfully. Proceeding with claim.'
      };
      
    } catch (error) {
      console.error('Policy verification error:', error);
      Alert.alert(
        "Verification Error",
        error.message || 'Unable to verify policy. Please try again.',
        [{ text: "OK" }]
      );
      return {
        success: false,
        message: error.message || 'Unable to verify policy. Please try again.'
      };
    } finally {
      setIsLoading(false);
    }
  };

  const router = useRouter();
  const [activeTab, setActiveTab] = useState("claim");

  // Animation values for step cards
  const [cardAnimations] = useState([
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
  ]);

  const [formData, setFormData] = useState({
    policyNumber: "",
    emailAddress: "",
    registerNumber: "",
    engineNumber: "",
    chassisNumber: "",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (activeTab === "claim") {
      // Animate cards with staggered timing
      cardAnimations.forEach((anim, index) => {
        Animated.timing(anim, {
          toValue: 1,
          duration: 600,
          delay: index * 150,
          useNativeDriver: true,
        }).start();
      });
    }
  }, [activeTab]);

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
    setPolicyData(null);
    setShowPolicyModal(false);
  };

  const handleNext = async () => {
    if (validateForm()) {
      // First verify the policy
      const verificationResult = await verifyPolicy(formData.policyNumber);
      
      if (!verificationResult.success) {
        // Error already shown in verifyPolicy function
        return;
      }
      
      // If policy is verified successfully, the modal will be shown
      // User can then proceed from the modal
    }
  };

  const handleProceedFromModal = () => {
    setShowPolicyModal(false);
    console.log("Form Data:", formData);
    console.log("Policy Data:", policyData);
    router.push("../Accident");
  };

  const PolicyModal = () => (
    <Modal
      visible={showPolicyModal}
      transparent={true}
      animationType="slide"
      onRequestClose={() => setShowPolicyModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Policy Verification Success</Text>
            <Text style={styles.modalSubtitle}>✅ Policy details verified</Text>
          </View>
          
          <View style={styles.modalContent}>
            <View style={styles.policyInfoCard}>
              <Text style={styles.policyLabel}>Policy Number</Text>
              <Text style={styles.policyValue}>{policyData?.policyNumber}</Text>
            </View>
            
            <View style={styles.policyInfoCard}>
              <Text style={styles.policyLabel}>Period of Insurance</Text>
              <Text style={styles.policyValue}>
                {formatPeriodOfInsurance(policyData?.periodOfInsurance)}
              </Text>
            </View>
            
            {policyData?.email && (
              <View style={styles.policyInfoCard}>
                <Text style={styles.policyLabel}>Email</Text>
                <Text style={styles.policyValue}>{policyData.email}</Text>
              </View>
            )}
            
            {(policyData?.registrationNumber || policyData?.registration_number) && (
              <View style={styles.policyInfoCard}>
                <Text style={styles.policyLabel}>Registration Number</Text>
                <Text style={styles.policyValue}>
                  {policyData.registrationNumber || policyData.registration_number}
                </Text>
              </View>
            )}
          </View>
          
          <View style={styles.modalButtons}>
            <TouchableOpacity
              style={styles.modalCancelButton}
              onPress={() => setShowPolicyModal(false)}
            >
              <Text style={styles.modalCancelText}>Cancel</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.modalProceedButton}
              onPress={handleProceedFromModal}
            >
              <Text style={styles.modalProceedText}>Proceed Next</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  const steps = [
    {
      id: 1,
      title: "Download the Global Health App and login to start claim filing.",
      icon: "📱",
      color: "#667eea",
      bgColor: "#f0f4ff",
    },
    {
      id: 2,
      title: "Fill all the details related to the accident and damages.",
      icon: "📝",
      color: "#f093fb",
      bgColor: "#fef0ff",
    },
    {
      id: 3,
      title: "Update your personal details and click Register Claim to file.",
      icon: "✅",
      color: "#4facfe",
      bgColor: "#f0faff",
    },
    {
      id: 4,
      title: "That's it! Claim registered. Simple with the Digit App.",
      icon: "🎉",
      color: "#43e97b",
      bgColor: "#f0fff4",
    },
  ];

  const ModernStepCard = ({ step, index }) => {
    const [scaleAnim] = useState(new Animated.Value(1));

    const handlePress = () => {
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 0.95,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 100,
          useNativeDriver: true,
        }),
      ]).start();
    };

    return (
      <Animated.View
        style={[
          styles.modernCard,
          {
            backgroundColor: step.bgColor,
            opacity: cardAnimations[index],
            transform: [
              {
                translateY: cardAnimations[index].interpolate({
                  inputRange: [0, 1],
                  outputRange: [50, 0],
                }),
              },
              { scale: scaleAnim },
            ],
          },
        ]}
      >
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={handlePress}
          style={styles.cardContent}
        >
          <View style={styles.stepHeader}>
            <View style={[styles.iconContainer, { backgroundColor: step.color }]}>
              <Text style={styles.stepIcon}>{step.icon}</Text>
            </View>
            <View style={styles.stepBadge}>
              <Text style={[styles.stepBadgeText, { color: step.color }]}>
                STEP {step.id}
              </Text>
            </View>
          </View>
          <Text style={styles.modernStepText}>{step.title}</Text>
          <View style={[styles.progressBar, { backgroundColor: step.color }]} />
        </TouchableOpacity>
      </Animated.View>
    );
  };

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
          showsVerticalScrollIndicator={false}
        >
          {activeTab === "claim" ? (
            <View style={styles.claimSection}>
              {/* Modern Header */}
              <View style={styles.headerContainer}>
                <View style={styles.headerBadge}>
                  <Text style={styles.headerBadgeText}>✨ MOTOR CLAIMS</Text>
                </View>
                <Text style={styles.modernHeading}>
                  File Claims in Simple Steps
                </Text>
                <Text style={styles.headerSubtext}>
                  Follow our streamlined process to file your motor insurance claim quickly and efficiently
                </Text>
              </View>

              {/* Animated Step Cards */}
              {steps.map((step, index) => (
                <ModernStepCard key={step.id} step={step} index={index} />
              ))}

              {/* Call to Action */}
              <Animated.View
                style={[
                  styles.ctaContainer,
                  {
                    opacity: cardAnimations[3],
                    transform: [
                      {
                        translateY: cardAnimations[3].interpolate({
                          inputRange: [0, 1],
                          outputRange: [30, 0],
                        }),
                      },
                    ],
                  },
                ]}
              >
                <TouchableOpacity
                  style={styles.ctaButton}
                  onPress={() => setActiveTab("intimateclaim")}
                  activeOpacity={0.8}
                >
                  <Text style={styles.ctaText}>🚀 Start Your Claim Journey</Text>
                  <Text style={styles.ctaSubtext}>Tap to begin filing your claim</Text>
                </TouchableOpacity>
              </Animated.View>
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
                  autoCapitalize="characters"
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
                  style={[styles.nextButton, isLoading && styles.disabledButton]}
                  onPress={handleNext}
                  disabled={isLoading}
                >
                  <Text style={styles.nextText}>
                    {isLoading ? "Verifying..." : "Verify & Next"}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>

      <PolicyModal />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8fafc" },
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
  
  // Modern Claim Section Styles
  claimSection: {
    flex: 1,
  },
  headerContainer: {
    alignItems: "center",
    marginBottom: 32,
    paddingHorizontal: 20,
  },
  headerBadge: {
    backgroundColor: "#667eea",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 16,
  },
  headerBadgeText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
    letterSpacing: 1,
  },
  modernHeading: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1e293b",
    textAlign: "center",
    marginBottom: 12,
  },
  headerSubtext: {
    fontSize: 16,
    color: "#64748b",
    textAlign: "center",
    lineHeight: 24,
  },
  
  modernCard: {
    marginBottom: 20,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  cardContent: {
    padding: 24,
  },
  stepHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  stepIcon: {
    fontSize: 24,
  },
  stepBadge: {
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.1)",
  },
  stepBadgeText: {
    fontSize: 11,
    fontWeight: "bold",
    letterSpacing: 0.5,
  },
  modernStepText: {
    fontSize: 16,
    color: "#334155",
    lineHeight: 24,
    fontWeight: "500",
    marginBottom: 16,
  },
  progressBar: {
    height: 4,
    borderRadius: 2,
    width: "100%",
    opacity: 0.3,
  },
  
  ctaContainer: {
    marginTop: 24,
  },
  ctaButton: {
    backgroundColor: "#ff6b6b",
    borderRadius: 20,
    padding: 24,
    alignItems: "center",
    shadowColor: "#ff6b6b",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  ctaText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
  },
  ctaSubtext: {
    color: "rgba(255, 255, 255, 0.9)",
    fontSize: 14,
  },

  // Keep existing form styles
  heading: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)', // dim background
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: width * 0.9,
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingVertical: 20,
    paddingHorizontal: 16,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  modalHeader: {
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e1e1e',
    marginBottom: 4,
  },
  modalSubtitle: {
    fontSize: 14,
    color: 'green',
  },
  modalContent: {
    marginBottom: 20,
  },
  policyInfoCard: {
    backgroundColor: '#f6f6f6',
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  policyLabel: {
    fontSize: 13,
    color: '#888',
    marginBottom: 4,
  },
  policyValue: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  modalCancelButton: {
    flex: 1,
    paddingVertical: 12,
    backgroundColor: '#f44336',
    borderRadius: 10,
    marginRight: 8,
    alignItems: 'center',
  },
  modalCancelText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  modalProceedButton: {
    flex: 1,
    paddingVertical: 12,
    backgroundColor: '#2196f3',
    borderRadius: 10,
    marginLeft: 8,
    alignItems: 'center',
  },
  modalProceedText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default Claims;

