import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

const Payment = () => {
  const { premium } = useLocalSearchParams();
  const router = useRouter();
  
  // State for premium components
  const [premiumComponents, setPremiumComponents] = useState(null);
  const [vehicleData, setVehicleData] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    age: '',
    mobile: '',
    panNumber: '',
    aadharNumber: '',
    nomineeName: '',
    nomineeAge: '',
    nomineeRelation: '',
    registrationNumber: '',
    address: ''
  });

  // Refs for TextInputs
  const inputRefs = useRef({});

  // Load data from AsyncStorage
  useEffect(() => {
    loadStoredData();
  }, []);

  const loadStoredData = async () => {
    try {
      const premiumData = await AsyncStorage.getItem('premiumComponents');
      const vehicleInfo = await AsyncStorage.getItem('vehicleData');
      const savedPaymentDetails = await AsyncStorage.getItem('paymentDetails');
      
      if (premiumData) {
        setPremiumComponents(JSON.parse(premiumData));
      }
      
      if (vehicleInfo) {
        const parsedVehicleData = JSON.parse(vehicleInfo);
        setVehicleData(parsedVehicleData);
        
        // Auto-fill form with vehicle data
        setFormData(prev => ({
          ...prev,
          username: parsedVehicleData.ownerName || '',
          registrationNumber: parsedVehicleData.registrationNumber || '',
          address: parsedVehicleData.registered_at || ''
        }));
      }

      // Load saved payment details if available
      if (savedPaymentDetails) {
        const parsedPaymentDetails = JSON.parse(savedPaymentDetails);
        setFormData(prev => ({
          ...prev,
          ...parsedPaymentDetails
        }));
      }
      console.log("your form details>>>>><<<",savedPaymentDetails)
    } catch (error) {
      console.error('Error loading stored data:', error);
    }
  };

  // Save payment details to AsyncStorage
  const savePaymentDetails = async (paymentData) => {
    try {
      await AsyncStorage.setItem('paymentDetails', JSON.stringify(paymentData));
      console.log('Payment details saved successfully');
    } catch (error) {
      console.error('Error saving payment details:', error);
    }
  };

  // Save complete payment transaction data
  const savePaymentTransaction = async (transactionData) => {
    try {
      const existingTransactions = await AsyncStorage.getItem('paymentTransactions');
      const transactions = existingTransactions ? JSON.parse(existingTransactions) : [];
      
      transactions.push({
        ...transactionData,
        timestamp: new Date().toISOString(),
        transactionId: `TXN_${Date.now()}`
      });
      
      await AsyncStorage.setItem('paymentTransactions', JSON.stringify(transactions));
      console.log('Payment transaction saved successfully');
    } catch (error) {
      console.error('Error saving payment transaction:', error);
    }
  };

  const handleInputChange = useCallback((field, value) => {
    const updatedFormData = {
      ...formData,
      [field]: value
    };
    
    setFormData(updatedFormData);
    
    // Auto-save payment details as user types (debounced)
    clearTimeout(handleInputChange.timeoutId);
    handleInputChange.timeoutId = setTimeout(() => {
      savePaymentDetails(updatedFormData);
    }, 1000);
  }, [formData]);

  const validateForm = () => {
    const requiredFields = [
      'username', 'email', 'age', 'mobile', 'panNumber', 
      'aadharNumber', 'nomineeName', 'nomineeAge', 'nomineeRelation',
      'registrationNumber', 'address'
    ];
    
    for (let field of requiredFields) {
      if (!formData[field].trim()) {
        Alert.alert('Error', `Please fill in ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`);
        return false;
      }
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return false;
    }
    
    // Mobile validation
    if (formData.mobile.length !== 10) {
      Alert.alert('Error', 'Please enter a valid 10-digit mobile number');
      return false;
    }
    
    // PAN validation
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    if (!panRegex.test(formData.panNumber)) {
      Alert.alert('Error', 'Please enter a valid PAN number (Format: ABCDE1234F)');
      return false;
    }
    
    // Aadhar validation
    if (formData.aadharNumber.length !== 12) {
      Alert.alert('Error', 'Please enter a valid 12-digit Aadhar number');
      return false;
    }
    
    return true;
  };

  const createRazorpayOrder = async (amount) => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000);

      const endpoint = 'http://192.168.1.6:8080/api/payment/createorder';
      
      console.log(`Creating order for amount: ${amount}`);
      
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: amount,
          currency: 'INR',
          receipt: `insurance_${Date.now()}`,
          notes: {
            premium_type: 'vehicle_insurance',
            customer_name: formData.username,
            vehicle_registration: formData.registrationNumber,
            payment_category: 'insurance_premium'
          }
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Server error: ${response.status} - ${errorText}`);
        throw new Error(`Server error: ${response.status} - ${errorText}`);
      }

      const orderData = await response.json();
      console.log('Order created successfully:', orderData);
      return orderData;
    } catch (error) {
      if (error.name === 'AbortError') {
        throw new Error('Request timeout. Please check your internet connection and try again.');
      }
      console.error('Error creating Razorpay order:', error);
      throw new Error(error.message || 'Failed to create payment order');
    }
  };

  const handlePayment = async () => {
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const amount = premiumComponents?.totalPremium || Number(premium);
      if (amount <= 0) {
        throw new Error("Invalid premium amount");
      }
      
      console.log('Processing payment for amount:', amount);
      
      // Save payment details before processing
      await savePaymentDetails(formData);
      
      const orderData = await createRazorpayOrder(amount);
      
      if (orderData.id || orderData.orderId) {
        // Save complete transaction data
        const transactionData = {
          orderData,
          paymentDetails: formData,
          premiumComponents,
          vehicleData,
          amount,
          status: 'initiated',
          paymentMethod: 'razorpay'
        };
        
        await savePaymentTransaction(transactionData);
        
        // Navigate to WebView screen with order data
        router.push({
          pathname: ('../RazorpayWebViewScreen'),
          params: {
            orderData: JSON.stringify(orderData),
            formData: JSON.stringify(formData),
            amount: amount.toString()
          }
        });
      } else {
        throw new Error('Failed to create payment order');
      }
    } catch (error) {
      console.error('Error in payment process:', error);
      Alert.alert('Payment Error', error.message || 'Payment failed to initiate');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Clear saved payment details
  const clearSavedDetails = async () => {
    try {
      await AsyncStorage.removeItem('paymentDetails');
      setFormData({
        username: vehicleData?.ownerName || '',
        email: '',
        age: '',
        mobile: '',
        panNumber: '',
        aadharNumber: '',
        nomineeName: '',
        nomineeAge: '',
        nomineeRelation: '',
        registrationNumber: vehicleData?.registrationNumber || '',
        address: vehicleData?.registered_at || ''
      });
      Alert.alert('Success', 'Saved payment details cleared');
    } catch (error) {
      console.error('Error clearing saved details:', error);
      Alert.alert('Error', 'Failed to clear saved details');
    }
  };

  const PremiumCard = ({ icon, title, amount, color = '#007bff' }) => (
    <View style={styles.premiumItem}>
      <Ionicons name={icon} size={20} color={color} />
      <Text style={styles.premiumLabel}>{title}</Text>
      <Text style={[styles.premiumAmount, { color }]}>₹{amount?.toLocaleString()}</Text>
    </View>
  );

  const FormInput = useCallback(({ 
    icon, 
    placeholder, 
    value, 
    onChangeText, 
    keyboardType = 'default', 
    maxLength,
    field
  }) => (
    <View style={styles.inputContainer}>
      <Ionicons name={icon} size={20} color="#666" style={styles.inputIcon} />
      <TextInput
        ref={(ref) => { inputRefs.current[field] = ref; }}
        style={styles.input}
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
        maxLength={maxLength}
        placeholderTextColor="#999"
        autoCorrect={false}
        autoCapitalize={field === 'email' ? 'none' : 'sentences'}
      />
    </View>
  ), []);

  const totalAmount = premiumComponents?.totalPremium || Number(premium);

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
          {/* Premium Details Card */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Ionicons name="card" size={24} color="#007bff" />
              <Text style={styles.cardTitle}>Premium Breakdown</Text>
            </View>
            
            {premiumComponents ? (
              <View style={styles.premiumBreakdown}>
                <PremiumCard 
                  icon="shield-checkmark" 
                  title="Own Damage Premium" 
                  amount={premiumComponents.ownDamagePremium}
                  color="#28a745"
                />
                <PremiumCard 
                  icon="people" 
                  title="Third Party Premium" 
                  amount={premiumComponents.thirdPartyPremium}
                  color="#ffc107"
                />
                <PremiumCard 
                  icon="add-circle" 
                  title="Add-ons Premium" 
                  amount={premiumComponents.addOnsPremium}
                  color="#17a2b8"
                />
                <PremiumCard 
                  icon="receipt" 
                  title="GST" 
                  amount={premiumComponents.gst}
                  color="#dc3545"
                />
                <PremiumCard 
                  icon="trending-down" 
                  title="NCB Discount" 
                  amount={premiumComponents.ncbDiscount}
                  color="#6f42c1"
                />
                <View style={styles.totalPremium}>
                  <Ionicons name="cash" size={24} color="#28a745" />
                  <Text style={styles.totalLabel}>Total Premium</Text>
                  <Text style={styles.totalAmount}>₹{premiumComponents.totalPremium?.toLocaleString()}</Text>
                </View>
              </View>
            ) : (
              <View style={styles.totalPremium}>
                <Ionicons name="cash" size={24} color="#28a745" />
                <Text style={styles.totalLabel}>Premium Amount</Text>
                <Text style={styles.totalAmount}>₹{Number(premium).toLocaleString()}</Text>
              </View>
            )}
          </View>

          {/* Vehicle Details Card */}
          {vehicleData && (
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Ionicons name="car" size={24} color="#007bff" />
                <Text style={styles.cardTitle}>Vehicle Details</Text>
              </View>
              <View style={styles.vehicleInfo}>
                <Text style={styles.vehicleDetail}>
                  <Text style={styles.vehicleLabel}>Model: </Text>
                  {vehicleData.makerModel}
                </Text>
                <Text style={styles.vehicleDetail}>
                  <Text style={styles.vehicleLabel}>Engine: </Text>
                  {vehicleData.engineCapacity}
                </Text>
                <Text style={styles.vehicleDetail}>
                  <Text style={styles.vehicleLabel}>Fuel: </Text>
                  {vehicleData.fueltype}
                </Text>
              </View>
            </View>
          )}

          {/* Payment Form */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Ionicons name="person" size={24} color="#007bff" />
              <Text style={styles.cardTitle}>Payment Details</Text>
              <TouchableOpacity 
                style={styles.clearButton}
                onPress={clearSavedDetails}
              >
                <Ionicons name="refresh" size={20} color="#dc3545" />
                <Text style={styles.clearButtonText}>Clear</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.formSection}>
              <Text style={styles.sectionTitle}>Personal Information</Text>
              
              <FormInput
                icon="person-outline"
                placeholder="Full Name"
                value={formData.username}
                onChangeText={(value) => handleInputChange('username', value)}
                field="username"
              />
              
              <FormInput
                icon="mail-outline"
                placeholder="Email Address"
                value={formData.email}
                onChangeText={(value) => handleInputChange('email', value)}
                keyboardType="email-address"
                field="email"
              />
              
              <FormInput
                icon="calendar-outline"
                placeholder="Age"
                value={formData.age}
                onChangeText={(value) => handleInputChange('age', value)}
                keyboardType="numeric"
                maxLength={2}
                field="age"
              />
              
              <FormInput
                icon="call-outline"
                placeholder="Mobile Number"
                value={formData.mobile}
                onChangeText={(value) => handleInputChange('mobile', value)}
                keyboardType="phone-pad"
                maxLength={10}
                field="mobile"
              />
            </View>

            <View style={styles.formSection}>
              <Text style={styles.sectionTitle}>Identity Documents</Text>
              
              <FormInput
                icon="card-outline"
                placeholder="PAN Number"
                value={formData.panNumber}
                onChangeText={(value) => handleInputChange('panNumber', value.toUpperCase())}
                maxLength={10}
                field="panNumber"
              />
              
              <FormInput
                icon="finger-print-outline"
                placeholder="Aadhar Number"
                value={formData.aadharNumber}
                onChangeText={(value) => handleInputChange('aadharNumber', value)}
                keyboardType="numeric"
                maxLength={12}
                field="aadharNumber"
              />
            </View>

            <View style={styles.formSection}>
              <Text style={styles.sectionTitle}>Nominee Details</Text>
              
              <FormInput
                icon="person-add-outline"
                placeholder="Nominee Name"
                value={formData.nomineeName}
                onChangeText={(value) => handleInputChange('nomineeName', value)}
                field="nomineeName"
              />
              
              <FormInput
                icon="calendar-outline"
                placeholder="Nominee Age"
                value={formData.nomineeAge}
                onChangeText={(value) => handleInputChange('nomineeAge', value)}
                keyboardType="numeric"
                maxLength={2}
                field="nomineeAge"
              />
              
              <FormInput
                icon="heart-outline"
                placeholder="Nominee Relation"
                value={formData.nomineeRelation}
                onChangeText={(value) => handleInputChange('nomineeRelation', value)}
                field="nomineeRelation"
              />
            </View>

            <View style={styles.formSection}>
              <Text style={styles.sectionTitle}>Vehicle & Address</Text>
              
              <FormInput
                icon="car-outline"
                placeholder="Registration Number"
                value={formData.registrationNumber}
                onChangeText={(value) => handleInputChange('registrationNumber', value.toUpperCase())}
                field="registrationNumber"
              />
              
              <View style={styles.inputContainer}>
                <Ionicons name="location-outline" size={20} color="#666" style={styles.inputIcon} />
                <TextInput
                  ref={(ref) => { inputRefs.current.address = ref; }}
                  style={[styles.input, styles.textArea]}
                  placeholder="Address"
                  value={formData.address}
                  onChangeText={(value) => handleInputChange('address', value)}
                  multiline
                  numberOfLines={3}
                  textAlignVertical="top"
                  placeholderTextColor="#999"
                />
              </View>
            </View>

            <TouchableOpacity 
              style={[styles.payButton, isSubmitting && styles.payButtonDisabled]} 
              onPress={handlePayment}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <Ionicons name="card" size={24} color="#fff" />
              )}
              <Text style={styles.payButtonText}>
                {isSubmitting ? 'Processing...' : `Pay Now - ₹${totalAmount.toLocaleString()}`}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  card: {
    backgroundColor: '#fff',
    margin: 16,
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 8,
    color: '#333',
    flex: 1,
  },
  clearButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderRadius: 6,
    backgroundColor: '#f8f9fa',
  },
  clearButtonText: {
    color: '#dc3545',
    fontSize: 12,
    marginLeft: 4,
    fontWeight: '500',
  },
  premiumBreakdown: {
    gap: 12,
  },
  premiumItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 8,
  },
  premiumLabel: {
    flex: 1,
    marginLeft: 8,
    fontSize: 14,
    color: '#666',
  },
  premiumAmount: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  totalPremium: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e8f5e8',
    padding: 16,
    borderRadius: 8,
    marginTop: 8,
  },
  totalLabel: {
    flex: 1,
    marginLeft: 8,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#28a745',
  },
  totalAmount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#28a745',
  },
  vehicleInfo: {
    gap: 8,
  },
  vehicleDetail: {
    fontSize: 14,
    color: '#666',
  },
  vehicleLabel: {
    fontWeight: 'bold',
    color: '#333',
  },
  formSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    marginBottom: 12,
    paddingHorizontal: 12,
  },
  inputIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: '#333',
  },
  textArea: {
    paddingTop: 12,
    minHeight: 80,
  },
  payButton: {
    backgroundColor: '#28a745',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 8,
    marginTop: 16,
  },
  payButtonDisabled: {
    backgroundColor: '#6c757d',
    opacity: 0.6,
  },
  payButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
  },
});

export default Payment;