import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from "expo-router";
import { useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Animated,
  Dimensions,
  Easing,
  Modal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';






const { width } = Dimensions.get('window');

// Environment variables (replace with your actual values)
const SUREPASS_URL = "https://kyc-api.surepass.io/api/v1/rc/rc-full";
const SUREPASS_TOKEN = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmcmVzaCI6ZmFsc2UsImlhdCI6MTc1MTYxMDYzMSwianRpIjoiZGJlY2QzMDgtYjdlMy00ZDcxLWE2MzktNWUwMmM4ZGU1YmY4IiwidHlwZSI6ImFjY2VzcyIsImlkZW50aXR5IjoiZGV2Lmt1bmFsc2hhcm1hQHN1cmVwYXNzLmlvIiwibmJmIjoxNzUxNjEwNjMxLCJleHAiOjIzODIzMzA2MzEsImVtYWlsIjoia3VuYWxzaGFybWFAc3VyZXBhc3MuaW8iLCJ0ZW5hbnRfaWQiOiJtYWluIiwidXNlcl9jbGFpbXMiOnsic2NvcGVzIjpbInVzZXIiXX19.gayl4BaEfs63zxO-an3lKB1AFJuiv2BYc9mDW2Om6sU";
const LOCALHOST_CAR_API = "http://192.168.1.6:8080/api/vehicle";

const Car = () => {
    const router = useRouter();

  const [registrationNumber, setRegistrationNumber] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [carData, setCarData] = useState(null);
  const [error, setError] = useState('');
  const [dataSource, setDataSource] = useState(''); // 'database' or 'surepass'
  const [showPremiumButton, setShowPremiumButton] = useState(false);
  const [showManualEntryModal, setShowManualEntryModal] = useState(false);
  const [manualData, setManualData] = useState({
    registration_date: '',
    exshowroom: '800', // Default value
    maker_model: '',
  });
  const [incompleteData, setIncompleteData] = useState(null);
  const [savingManualData, setSavingManualData] = useState(false);

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(300)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const buttonScaleAnim = useRef(new Animated.Value(1)).current;
  const premiumButtonAnim = useRef(new Animated.Value(0)).current;

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

  const animatePremiumButton = () => {
    Animated.spring(premiumButtonAnim, {
      toValue: 1,
      tension: 100,
      friction: 8,
      useNativeDriver: true,
    }).start();
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


  const storeVehicleData = async (vehicleData) => {
    try {
      const dataToStore = {
        ownerName: vehicleData.owner_name || 'N/A',
        registrationNumber: vehicleData.registration_number || 'N/A',
        makerModel: vehicleData.maker_model || 'N/A',
        engineCapacity: vehicleData.engine_capacity || 'N/A',
        registrationDate: vehicleData.registration_date || 'N/A',
        exShowroom: vehicleData.exshowroom || '800',
        enginenumber:vehicleData.engine_number || 'N/A',
        chasinumber:vehicleData.chasi_number || 'N/A',
        registered_at:vehicleData.registered_at || 'N/A',
        financer:vehicleData.financer ||'N/A',
        registrationDate:vehicleData.registration_date || 'N/A',
        fueltype:vehicleData.fuel_type || 'N/A',
        makerModel:vehicleData.maker_model || 'N/A',
      };

      await AsyncStorage.setItem('vehicleData', JSON.stringify(dataToStore));
      console.log('Vehicle data stored successfully:>>>>>><<<<<<<', dataToStore);
      return true;
    } catch (error) {
      console.error('Error storing vehicle data:', error);
      Alert.alert('Error', 'Failed to store vehicle data');
      return false;
    }
  };

  // Check if all fields are null or empty
  const isAllFieldsNull = (data) => {
    const importantFields = [
      'owner_name', 'maker_model', 'color', 'fuel_type', 
      'registration_date', 'exshowroom', 'address', 'engine_capacity'
    ];
    
    return importantFields.every(field => 
      !data[field] || 
      data[field] === 'N/A' || 
      data[field] === '' || 
      data[field] === null || 
      data[field] === undefined
    );
  };

  // Check if data has missing critical fields
  const checkMissingFields = (data) => {
    const criticalFields = ['registration_date', 'exshowroom', 'maker_model'];
    const missingFields = criticalFields.filter(field => 
      !data[field] || data[field] === 'N/A' || data[field] === ''
    );
    return missingFields;
  };

  // Check database first with N/A validation
  const checkDatabaseFirst = async () => {
    try {
      const queryParams = new URLSearchParams({
        registration_number: registrationNumber.toUpperCase().trim(),
        mobile_number: phoneNumber.trim(),
      });
      
      const apiUrl = `http://192.168.1.6:8080/api/vehicle/getcardata?${queryParams.toString()}`;
      console.log('Checking database first:', apiUrl);

      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Database response:', data);

        if (data && (Array.isArray(data) ? data.length > 0 : Object.keys(data).length > 0)) {
          const vehicleData = Array.isArray(data) ? data[0] : data;
          
          // Check if all fields are N/A in database response
          if (isAllFieldsNull(vehicleData)) {
            console.log('All fields are N/A in database response');
            setError('Server is not working properly. Please try again after some time.');
            return false;
          }
          
          setCarData(vehicleData);
          setDataSource('database');
          setShowPremiumButton(true);
          animateDataEntry();
          setTimeout(() => animatePremiumButton(), 800);
          return true;
        }
      }
      return false;
    } catch (error) {
      console.error('Database check error:', error);
      return false;
    }
  };

  // Call SurePass API with better error handling and N/A validation
  const callSurePassAPI = async () => {
    try {
      console.log('Calling SurePass API...');
      
      const requestBody = {
        id_number: registrationNumber.toUpperCase().trim(),
      };

      const response = await fetch(SUREPASS_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': SUREPASS_TOKEN,
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('SurePass API error response:', errorText);
        throw new Error(`SurePass API error: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log('SurePass API full response:', JSON.stringify(data, null, 2));

      if (data.success && data.data) {
        // More comprehensive mapping with fallback values
        const mappedData = {
          owner_name: data.data.owner_name || data.data.owner || 'N/A',
          registration_number: data.data.registration_number || registrationNumber.toUpperCase().trim(),
          maker_model: data.data.maker_description || data.data.maker_model || data.data.vehicle_class_description || 'N/A',
          color: data.data.color || 'N/A',
          fuel_type: data.data.fuel_type || 'N/A',
          engine_capacity: data.data.cubic_capacity || data.data.engine_capacity || 'N/A',
          mobile_number: phoneNumber.trim(),
          address: data.data.permanent_address || data.data.present_address || data.data.address || 'N/A',
          registration_date: data.data.registration_date || data.data.reg_date || 'N/A',
          purchase_date: data.data?.registration_date || 'N/A',
          insurance_company: data.data.insurance_company || 'N/A',
          financer: data.data.financer || 'N/A',
          engine_number: data.data.vehicle_engine_number || data.data.engine_number || 'N/A',
          chasi_number: data.data.vehicle_chasi_number || data.data.chassis_number || 'N/A',
          registered_at: data.data.registered_at || data.data.rto_name || 'N/A',
          exshowroom: data.data.ex_showroom_price || data.data.exshowroom_price || '800', // Default 800
        };

        console.log('Mapped data:', JSON.stringify(mappedData, null, 2));

        // Check if all important fields are null - DO NOT SAVE to database
        if (isAllFieldsNull(mappedData)) {
          console.log('All fields are N/A from SurePass, not saving to database');
          setError('Server is not working properly. Please try again after some time.');
          return false;
        }

        // If some fields have data, save to database regardless of missing fields
        console.log('Some fields have data, saving to database');
        await saveToDatabase(mappedData);

        // Check for missing critical fields for manual entry option
        const missingFields = checkMissingFields(mappedData);
        console.log('Missing fields:', missingFields);

        if (missingFields.length > 0) {
          // Show data but also show manual entry option
          setCarData(mappedData);
          setIncompleteData(mappedData);
          setDataSource('surepass');
          animateDataEntry();
          
          // Show alert asking if user wants to fill missing data
          setTimeout(() => {
            Alert.alert(
              'Incomplete Data',
              `Some fields are missing: ${missingFields.join(', ')}. Would you like to fill them manually?`,
              [
                { text: 'Skip', onPress: () => {
                  setShowPremiumButton(true);
                  setTimeout(() => animatePremiumButton(), 300);
                }},
                { text: 'Fill Missing Data', onPress: () => {
                  setShowManualEntryModal(true);
                  // Pre-fill existing data
                  setManualData({
                    registration_date: mappedData.registration_date === 'N/A' ? '' : mappedData.registration_date,
                    exshowroom: mappedData.exshowroom === 'N/A' ? '800' : mappedData.exshowroom,
                    maker_model: mappedData.maker_model === 'N/A' ? '' : mappedData.maker_model,
                  });
                }},
              ]
            );
          }, 1000);
        } else {
          // Complete data, show with premium button
          setCarData(mappedData);
          setDataSource('surepass');
          setShowPremiumButton(true);
          animateDataEntry();
          setTimeout(() => animatePremiumButton(), 800);
        }
        
        return true;
      } else {
        console.error('SurePass API returned unsuccessful response:', data);
        return false;
      }
    } catch (error) {
      console.error('SurePass API error:', error);
      throw error;
    }
  };

  // Enhanced save to database function with PostgreSQL support
  const saveToDatabase = async (vehicleData) => {
    try {
      console.log('Attempting to save to PostgreSQL database:', JSON.stringify(vehicleData, null, 2));
      
      const response = await fetch(`${LOCALHOST_CAR_API}/carData`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          registrationNumber: registrationNumber.toUpperCase().trim(),
          mobileNumber: phoneNumber.trim(),
          vehicleData: vehicleData,
          source: 'surepass' // Track data source
        }),
      });

      const responseText = await response.text();
      console.log('PostgreSQL database save response:', response.status, responseText);

      if (response.ok) {
        console.log('Data saved to PostgreSQL database successfully');
        return true;
      } else {
        console.error('Failed to save data to PostgreSQL database:', response.status, responseText);
        return false;
      }
    } catch (error) {
      console.error('PostgreSQL database save error:', error);
      return false;
    }
  };

  // Handle manual data submission
  const handleManualDataSubmit = async () => {
    setSavingManualData(true);
    
    try {
      // Merge manual data with existing data
      const updatedData = {
        ...incompleteData,
        registration_date: manualData.registration_date || incompleteData.registration_date,
        exshowroom: manualData.exshowroom || '800', // Ensure default 800
        maker_model: manualData.maker_model || incompleteData.maker_model,
      };

      console.log('Saving updated data with manual entries:', JSON.stringify(updatedData, null, 2));

      const saved = await saveToDatabase(updatedData);
      
      if (saved) {
        setCarData(updatedData);
        setShowManualEntryModal(false);
        setShowPremiumButton(true);
        setTimeout(() => animatePremiumButton(), 300);
        
        Alert.alert('Success', 'Vehicle data saved successfully to PostgreSQL database!');
      } else {
        Alert.alert('Error', 'Failed to save data to database. Please try again.');
      }
    } catch (error) {
      console.error('Manual data save error:', error);
      Alert.alert('Error', 'An error occurred while saving data to PostgreSQL database.');
    } finally {
      setSavingManualData(false);
    }
  };

  const handleCheckDetails = async () => {
    if (!registrationNumber.trim() || !phoneNumber.trim()) {
      Alert.alert('Error', 'Please enter both registration number and phone number');
      return;
    }

    animateButtonPress();
    setLoading(true);
    setError('');
    setCarData(null);
    setDataSource('');
    setShowPremiumButton(false);
    setIncompleteData(null);
    premiumButtonAnim.setValue(0);

    try {
      // Step 1: Check database first
      const foundInDatabase = await checkDatabaseFirst();
      
      if (!foundInDatabase) {
        // Step 2: Call SurePass API if not found in database
        try {
          const foundInSurePass = await callSurePassAPI();
          
          if (!foundInSurePass) {
            setError('Vehicle data not found in SurePass API');
          }
        } catch (surePassError) {
          console.error('SurePass API failed:', surePassError);
          setError('Server error: Unable to fetch vehicle data from SurePass. Please try again later.');
        }
      }

    } catch (err) {
      console.error('General error:', err);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

   const handleShowPremium = async () => {
     if (!carData) {
       Alert.alert('Error', 'No vehicle data available');
       return;
     }
 
     try {
       // Store vehicle data in AsyncStorage
       const stored = await storeVehicleData(carData);
       
       if (stored) {
         // Navigate to CarIdv page
         router.push("../CarIdv");
       }
     } catch (error) {
       console.error('Error in handleShowPremium:', error);
       Alert.alert('Error', 'Failed to store vehicle data. Please try again.');
     }
   };
 

  const formatDate = (dateString) => {
    if (!dateString || dateString === 'N/A') return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('en-IN');
    } catch {
      return 'N/A';
    }
  };

  const formatCurrency = (amount) => {
    if (!amount || amount === 'N/A') return 'N/A';
    const numericAmount = typeof amount === 'string' ? parseFloat(amount.replace(/[^\d.]/g, '')) : amount;
    if (isNaN(numericAmount)) return 'N/A';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(numericAmount);
  };

  const DataRow = ({ icon, label, value, iconColor = '#6366F1' }) => (
    <View style={styles.dataRow}>
      <View style={styles.dataRowHeader}>
        <Icon name={icon} size={20} color={iconColor} style={styles.dataIcon} />
        <Text style={styles.dataLabel}>{label}</Text>
      </View>
      <Text style={styles.dataValue}>{value}</Text>
    </View>
  );

  const DataSourceBadge = ({ source }) => (
    <View style={[styles.sourceBadge, source === 'database' ? styles.databaseBadge : styles.surepassBadge]}>
      <Icon 
        name={source === 'database' ? 'server' : 'cloud'} 
        size={16} 
        color="white" 
      />
      <Text style={styles.sourceText}>
        {source === 'database' ? 'From Database' : 'From SurePass'}
      </Text>
    </View>
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
            <Icon name="car" size={20} color="#6366F1" style={styles.inputIcon} />
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
            <Icon name="call" size={20} color="#6366F1" style={styles.inputIcon} />
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

          <Animated.View style={[styles.buttonContainer, { transform: [{ scale: buttonScaleAnim }] }]}>
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
                transform: [
                  { translateY: slideAnim },
                  { scale: scaleAnim }
                ]
              }
            ]}
          >
            <View style={styles.dataHeader}>
              <Icon name="checkmark-circle" size={32} color="#10B981" />
              <Text style={styles.dataTitle}>Vehicle Found!</Text>
              <DataSourceBadge source={dataSource} />
            </View>
            
            <View style={styles.dataContent}>
              <DataRow 
                icon="person" 
                label="Owner Name" 
                value={carData.owner_name || 'N/A'}
                iconColor="#10B981"
              />
              
              <DataRow 
                icon="car-sport" 
                label="Registration Number" 
                value={carData.registration_number || 'N/A'}
                iconColor="#6366F1"
              />
              
              <DataRow 
                icon="build" 
                label="Maker & Model" 
                value={carData.maker_model || 'N/A'}
                iconColor="#F59E0B"
              />
              
              <DataRow 
                icon="color-palette" 
                label="Color" 
                value={carData.color || 'N/A'}
                iconColor="#EC4899"
              />
              
              <DataRow 
                icon="flash" 
                label="Fuel Type" 
                value={carData.fuel_type || 'N/A'}
                iconColor="#EF4444"
              />
              
              <DataRow 
                icon="speedometer" 
                label="Engine Capacity" 
                value={carData.engine_capacity ? `${carData.engine_capacity} CC` : 'N/A'}
                iconColor="#8B5CF6"
              />
              
              <DataRow 
                icon="call" 
                label="Mobile Number" 
                value={carData.mobile_number || 'N/A'}
                iconColor="#06B6D4"
              />
              
              <DataRow 
                icon="location" 
                label="Address" 
                value={carData.address || 'N/A'}
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
                value={carData.insurance_company || 'N/A'}
                iconColor="#3B82F6"
              />
              
              <DataRow 
                icon="business" 
                label="Financer" 
                value={carData.financer || 'N/A'}
                iconColor="#8B5CF6"
              />
              
              <DataRow 
                icon="settings" 
                label="Engine Number" 
                value={carData.engine_number || 'N/A'}
                iconColor="#6B7280"
              />
              
              <DataRow 
                icon="barcode" 
                label="Chassis Number" 
                value={carData.chasi_number || 'N/A'}
                iconColor="#374151"
              />
              
              <DataRow 
                icon="location-outline" 
                label="Registered At" 
                value={carData.registered_at || 'N/A'}
                iconColor="#059669"
              />
            </View>

            {/* Premium Button */}
            {showPremiumButton && (
              <Animated.View
                style={[
                  styles.premiumButtonContainer,
                  {
                    opacity: premiumButtonAnim,
                    transform: [{ scale: premiumButtonAnim }]
                  }
                ]}
              >
                <TouchableOpacity
                  style={styles.premiumButton}
                  onPress={handleShowPremium}
                  activeOpacity={0.8}
                >
                  <View style={styles.premiumButtonContent}>
                    <Icon name="diamond" size={20} color="#FFD700" />
                    <Text style={styles.premiumButtonText}>Check Premium</Text>
                    <Icon name="arrow-forward" size={16} color="#FFD700" />
                  </View>
                </TouchableOpacity>
              </Animated.View>
            )}
          </Animated.View>
        )}
      </ScrollView>

      {/* Manual Data Entry Modal */}
      <Modal
        visible={showManualEntryModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowManualEntryModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Complete Missing Data</Text>
              <TouchableOpacity 
                onPress={() => setShowManualEntryModal(false)}
                style={styles.closeButton}
              >
                <Icon name="close" size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalContent}>
              <View style={styles.modalInputContainer}>
                <Text style={styles.modalLabel}>Registration Date</Text>
                <TextInput
                  style={styles.modalInput}
                  placeholder="DD/MM/YYYY"
                  value={manualData.registration_date}
                  onChangeText={(text) => setManualData({...manualData, registration_date: text})}
                />
              </View>

              <View style={styles.modalInputContainer}>
                <Text style={styles.modalLabel}>Ex-Showroom Price</Text>
                <TextInput
                  style={styles.modalInput}
                  placeholder="₹ 800 (Default)"
                  value={manualData.exshowroom}
                  onChangeText={(text) => setManualData({...manualData, exshowroom: text || '800'})}
                  keyboardType="numeric"
                />
              </View>

              <View style={styles.modalInputContainer}>
                <Text style={styles.modalLabel}>Maker & Model</Text>
                <TextInput
                  style={styles.modalInput}
                  placeholder="e.g., Maruti Suzuki Swift"
                  value={manualData.maker_model}
                  onChangeText={(text) => setManualData({...manualData, maker_model: text})}
                />
              </View>

              <View style={styles.modalButtonContainer}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.cancelButton]}
                  onPress={() => setShowManualEntryModal(false)}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.modalButton, styles.saveButton]}
                  onPress={handleManualDataSubmit}
                  disabled={savingManualData}
                >
                  {savingManualData ? (
                    <ActivityIndicator color="white" size="small" />
                  ) : (
                    <Text style={styles.saveButtonText}>Save to PostgreSQL</Text>
                  )}
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
    paddingVertical: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#1F2937',
    marginTop: 12,
    fontFamily: 'System',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    marginTop: 4,
    fontWeight: '500',
  },
 
formContainer: {
    backgroundColor: 'white',
    padding: 24,
    borderRadius: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderRadius: 16,
    marginBottom: 20,
    backgroundColor: '#F9FAFB',
    paddingHorizontal: 16,
    paddingVertical: 4,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    color: '#1F2937',
    paddingVertical: 16,
    fontFamily: 'System',
  },
  buttonContainer: {
    marginTop: 8,
  },
  button: {
    backgroundColor: '#6366F1',
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  buttonDisabled: {
    backgroundColor: '#9CA3AF',
    shadowOpacity: 0.1,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '700',
    marginLeft: 8,
    fontFamily: 'System',
  },

  errorContainer: {
    flexDirection: 'row',
    backgroundColor: '#FEF2F2',
    padding: 16,
    borderRadius: 16,
    marginBottom: 20,
    alignItems: 'center',
    borderLeftWidth: 4,
    borderLeftColor: '#EF4444',
  },
  errorText: {
    color: '#DC2626',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 12,
    flex: 1,
  },
  dataContainer: {
    backgroundColor: 'white',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 10,
    overflow: 'hidden',
  },
  dataHeader: {
    backgroundColor: '#F0FDF4',
    paddingVertical: 24,
    paddingHorizontal: 24,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  dataTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#065F46',
    marginTop: 8,
    marginBottom: 12,
    fontFamily: 'System',
  },
  sourceBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginTop: 8,
  },
  databaseBadge: {
    backgroundColor: '#3B82F6',
  },
  surepassBadge: {
    backgroundColor: '#10B981',
  },
  sourceText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 6,
  },
  dataContent: {
    padding: 24,
  },
  dataRow: {
    marginBottom: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  dataRowHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  dataIcon: {
    marginRight: 8,
  },
  dataLabel: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  dataValue: {
    fontSize: 17,
    color: '#1F2937',
    fontWeight: '600',
    marginLeft: 28,
    lineHeight: 24,
    fontFamily: 'System',
  },
  premiumButtonContainer: {
    margin: 20,
  },
  premiumButton: {
    backgroundColor: '#1F2937',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  premiumButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  premiumButtonText: {
    color: '#FFD700',
    fontSize: 18,
    fontWeight: '700',
    marginHorizontal: 12,
    fontFamily: 'System',
  },
});

export default Car;