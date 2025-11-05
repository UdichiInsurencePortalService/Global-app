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

// Environment variables
const SUREPASS_URL = "https://kyc-api.surepass.io/api/v1/rc/rc-full";
const SUREPASS_TOKEN = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmcmVzaCI6ZmFsc2UsImlhdCI6MTc1MTYxMDYzMSwianRpIjoiZGJlY2QzMDgtYjdlMy00ZDcxLWE2MzktNWUwMmM4ZGU1YmY4IiwidHlwZSI6ImFjY2VzcyIsImlkZW50aXR5IjoiZGV2Lmt1bmFsc2hhcm1hQHN1cmVwYXNzLmlvIiwibmJmIjoxNzUxNjEwNjMxLCJleHAiOjIzODIzMzA2MzEsImVtYWlsIjoia3VuYWxzaGFybWFAc3VyZXBhc3MuaW8iLCJ0ZW5hbnRfaWQiOiJtYWluIiwidXNlcl9jbGFpbXMiOnsic2NvcGVzIjpbInVzZXIiXX19.gayl4BaEfs63zxO-an3lKB1AFJuiv2BYc9mDW2Om6sU";
const LOCALHOST_CAR_API = "http://192.168.1.6:8080/api/vehicle";

const bike = () => {
  const router = useRouter();

  const [registrationNumber, setRegistrationNumber] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [carData, setCarData] = useState(null);
  const [error, setError] = useState('');
  const [dataSource, setDataSource] = useState('');
  const [showPremiumButton, setShowPremiumButton] = useState(false);
  const [showManualEntryModal, setShowManualEntryModal] = useState(false);
  const [manualData, setManualData] = useState({
    registration_date: '',
    exshowroom: '800',
    maker_model: '',
  });
  const [incompleteData, setIncompleteData] = useState(null);
  const [savingManualData, setSavingManualData] = useState(false);

  // New state for expandable sections
  const [showCoverage, setShowCoverage] = useState(false);
  const [showDepreciation, setShowDepreciation] = useState(false);
  const [showThirdParty, setShowThirdParty] = useState(false);

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(300)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const buttonScaleAnim = useRef(new Animated.Value(1)).current;
  const premiumButtonAnim = useRef(new Animated.Value(0)).current;

  const animateDataEntry = () => {
    fadeAnim.setValue(0);
    slideAnim.setValue(300);
    scaleAnim.setValue(0.8);

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
        enginenumber: vehicleData.engine_number || 'N/A',
        chasinumber: vehicleData.chasi_number || 'N/A',
        registered_at: vehicleData.registered_at || 'N/A',
        financer: vehicleData.financer || 'N/A',
        fueltype: vehicleData.fuel_type || 'N/A',
        color: vehicleData.color || 'N/A',
        address: vehicleData.address || 'N/A',
        mobileNumber: vehicleData.mobile_number || 'N/A',
        insuranceCompany: vehicleData.insurance_company || 'N/A',
        purchaseDate: vehicleData.purchase_date || 'N/A',
      };

      await AsyncStorage.setItem('vehicleData', JSON.stringify(dataToStore));
      console.log('Vehicle data stored successfully:', dataToStore);
      return true;
    } catch (error) {
      console.error('Error storing vehicle data:', error);
      Alert.alert('Error', 'Failed to store vehicle data');
      return false;
    }
  };

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

  const checkMissingFields = (data) => {
    const criticalFields = ['registration_date', 'exshowroom', 'maker_model'];
    const missingFields = criticalFields.filter(field => 
      !data[field] || data[field] === 'N/A' || data[field] === ''
    );
    return missingFields;
  };

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
          exshowroom: data.data.ex_showroom_price || data.data.exshowroom_price || '800',
        };

        console.log('Mapped data:', JSON.stringify(mappedData, null, 2));

        if (isAllFieldsNull(mappedData)) {
          console.log('All fields are N/A from SurePass, not saving to database');
          setError('Server is not working properly. Please try again after some time.');
          return false;
        }

        console.log('Some fields have data, saving to database');
        await saveToDatabase(mappedData);

        const missingFields = checkMissingFields(mappedData);
        console.log('Missing fields:', missingFields);

        if (missingFields.length > 0) {
          setCarData(mappedData);
          setIncompleteData(mappedData);
          setDataSource('surepass');
          animateDataEntry();
          
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
          source: 'surepass'
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

  const handleManualDataSubmit = async () => {
    setSavingManualData(true);
    
    try {
      const updatedData = {
        ...incompleteData,
        registration_date: manualData.registration_date || incompleteData.registration_date,
        exshowroom: manualData.exshowroom || '800',
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
      const foundInDatabase = await checkDatabaseFirst();
      
      if (!foundInDatabase) {
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
      console.log('Attempting to store vehicle data and navigate...');
      
      const stored = await storeVehicleData(carData);
      
      if (stored) {
        console.log('Vehicle data stored successfully, attempting navigation...');
        
        try {
          router.push('/Idv');
        } catch (navError1) {
          console.log('Navigation approach 1 failed, trying approach 2...', navError1);
          
          try {
            router.push('/(app)/CarIdv');
          } catch (navError2) {
            console.log('Navigation approach 2 failed, trying approach 3...', navError2);
            
            try {
              router.replace('/CarIdv');
            } catch (navError3) {
              console.log('Navigation approach 3 failed, trying approach 4...', navError3);
              router.push('CarIdv');
            }
          }
        }
        
        console.log('Navigation command executed successfully');
      } else {
        throw new Error('Failed to store vehicle data');
      }
    } catch (error) {
      console.error('Error in handleShowPremium:', error);
      Alert.alert(
        'Navigation Error', 
        `Failed to navigate to premium page. Error: ${error.message}\n\nPlease ensure the CarIdv page exists in your project.`
      );
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

  // Expandable Section Component
  const ExpandableSection = ({ title, icon, isExpanded, onToggle, children, color }) => (
    <View style={styles.expandableContainer}>
      <TouchableOpacity 
        style={[styles.expandableHeader, { backgroundColor: color }]}
        onPress={onToggle}
        activeOpacity={0.8}
      >
        <View style={styles.expandableHeaderLeft}>
          <Icon name={icon} size={24} color="white" />
          <Text style={styles.expandableTitle}>{title}</Text>
        </View>
        <Icon 
          name={isExpanded ? 'chevron-up' : 'chevron-down'} 
          size={24} 
          color="white" 
        />
      </TouchableOpacity>
      
      {isExpanded && (
        <View style={styles.expandableContent}>
          {children}
        </View>
      )}
    </View>
  );

  // Coverage Item Component
  const CoverageItem = ({ icon, text, isCovered }) => (
    <View style={styles.coverageItem}>
      <Icon 
        name={isCovered ? 'checkmark-circle' : 'close-circle'} 
        size={20} 
        color={isCovered ? '#10B981' : '#EF4444'} 
      />
      <Icon name={icon} size={18} color="#6B7280" style={styles.coverageIcon} />
      <Text style={[styles.coverageText, !isCovered && styles.notCoveredText]}>
        {text}
      </Text>
    </View>
  );

  // Depreciation Row Component
  const DepreciationRow = ({ age, rate }) => (
    <View style={styles.depreciationRow}>
      <Text style={styles.depreciationAge}>{age}</Text>
      <View style={styles.depreciationBarContainer}>
        <View style={[styles.depreciationBar, { width: `${rate}%` }]} />
      </View>
      <Text style={styles.depreciationRate}>{rate}%</Text>
    </View>
  );

  // Third Party Row Component
  const ThirdPartyRow = ({ category, cc, amount }) => (
    <View style={styles.thirdPartyRow}>
      <View style={styles.thirdPartyLeft}>
        <Icon name="bicycle" size={18} color="#6366F1" />
        <Text style={styles.thirdPartyCategory}>{category}</Text>
      </View>
      <Text style={styles.thirdPartyCc}>{cc}</Text>
      <Text style={styles.thirdPartyAmount}>{amount}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Modern Header with Gradient Effect */}
        <View style={styles.headerContainer}>
          <View style={styles.headerGradient}>
            <Icon name="bicycle" size={48} color="#FFFFFF" />
            <Text style={styles.title}>Bike Insurance Lookup</Text>
            <Text style={styles.subtitle}>Complete two-wheeler insurance information</Text>
          </View>
        </View>
        
        {/* Enhanced Form Container */}
        <View style={styles.formContainer}>
          <Text style={styles.formTitle}>Enter Bike Details</Text>
          
          <View style={styles.inputContainer}>
            <View style={styles.inputIconContainer}>
              <Icon name="bicycle" size={22} color="#6366F1" />
            </View>
            <TextInput
              style={styles.input}
              placeholder="Registration Number"
              placeholderTextColor="#9CA3AF"
              value={registrationNumber}
              onChangeText={setRegistrationNumber}
              autoCapitalize="characters"
              editable={!loading}
            />
          </View>

          <View style={styles.inputContainer}>
            <View style={styles.inputIconContainer}>
              <Icon name="call" size={22} color="#6366F1" />
            </View>
            <TextInput
              style={styles.input}
              placeholder="Phone Number"
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
                  <Icon name="search" size={22} color="white" />
                  <Text style={styles.buttonText}>Search Bike</Text>
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
              <Icon name="checkmark-circle" size={36} color="#10B981" />
              <Text style={styles.dataTitle}>Bike Found!</Text>
              <DataSourceBadge source={dataSource} />
            </View>
            
            <View style={styles.dataContent}>
              <Text style={styles.sectionTitle}>
                <Icon name="information-circle" size={20} color="#6366F1" /> Bike Information
              </Text>
              
              <DataRow 
                icon="person" 
                label="Owner Name" 
                value={carData.owner_name || 'N/A'}
                iconColor="#10B981"
              />
              
              <DataRow 
                icon="bicycle" 
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
                label="IDV (Insured Declared Value)" 
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

            {/* Premium Button - MOVED HERE BEFORE EXPANDABLE SECTIONS */}
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
                    <Icon name="diamond" size={24} color="#FFD700" />
                    <Text style={styles.premiumButtonText}>Calculate Premium</Text>
                    <Icon name="arrow-forward" size={20} color="#FFD700" />
                  </View>
                </TouchableOpacity>
              </Animated.View>
            )}
          </Animated.View>
        )}

        {/* EXPANDABLE SECTIONS MOVED AFTER DATA CONTAINER */}
        <View style={styles.infoSectionsContainer}>
          {/* Insurance Coverage Section - BIKE SPECIFIC */}
          <ExpandableSection
            title="What's Covered in Bike Insurance"
            icon="shield-checkmark"
            isExpanded={showCoverage}
            onToggle={() => setShowCoverage(!showCoverage)}
            color="#10B981"
          >
            <Text style={styles.infoSubtitle}>Covered Items</Text>
            <CoverageItem icon="bicycle" text="Own Damage (Accident, Fire, Theft)" isCovered={true} />
            <CoverageItem icon="umbrella" text="Natural Calamities (Flood, Cyclone, Earthquake)" isCovered={true} />
            <CoverageItem icon="flame" text="Man-made Calamities (Riots, Strikes, Terrorism)" isCovered={true} />
            <CoverageItem icon="people" text="Third Party Liability (Bodily Injury/Death)" isCovered={true} />
            <CoverageItem icon="car" text="Third Party Property Damage (Up to ₹7.5 Lakhs)" isCovered={true} />
            <CoverageItem icon="medical" text="Personal Accident Cover (Owner-Rider)" isCovered={true} />
            <CoverageItem icon="construct" text="Accessories Cover (If Added)" isCovered={true} />
            <CoverageItem icon="notifications" text="Roadside Assistance (Optional Add-on)" isCovered={true} />
            
            <Text style={[styles.infoSubtitle, { marginTop: 20 }]}>Not Covered Items</Text>
            <CoverageItem icon="speedometer" text="Normal Wear and Tear" isCovered={false} />
            <CoverageItem icon="beer" text="Riding Under Influence (Alcohol/Drugs)" isCovered={false} />
            <CoverageItem icon="document-text" text="Riding Without Valid License/Documents" isCovered={false} />
            <CoverageItem icon="close-circle" text="Consequential/Indirect Damage" isCovered={false} />
            <CoverageItem icon="construct" text="Mechanical/Electrical Breakdown" isCovered={false} />
            <CoverageItem icon="speedometer" text="Depreciation (Unless Zero Dep Cover)" isCovered={false} />
            <CoverageItem icon="nuclear" text="War, Nuclear Perils" isCovered={false} />
            <CoverageItem icon="ban" text="Use for Racing/Speed Testing" isCovered={false} />
            <CoverageItem icon="water" text="Damage to Consumables (Engine Oil, Coolant)" isCovered={false} />
            <CoverageItem icon="leaf" text="Tyre Damage (Standalone)" isCovered={false} />
          </ExpandableSection>

          {/* IRDAI Depreciation Rates - BIKE SPECIFIC */}
          <ExpandableSection
            title="IRDAI Depreciation Rates for Bikes"
            icon="trending-down"
            isExpanded={showDepreciation}
            onToggle={() => setShowDepreciation(!showDepreciation)}
            color="#F59E0B"
          >
            <View style={styles.depreciationInfo}>
              <Icon name="information-circle" size={18} color="#6B7280" />
              <Text style={styles.depreciationInfoText}>
                Depreciation applied on bike parts during claim settlement
              </Text>
            </View>
            
            <Text style={styles.depreciationTableTitle}>Bike Age vs Depreciation</Text>
            <DepreciationRow age="Less than 6 months" rate={0} />
            <DepreciationRow age="6 months - 1 year" rate={5} />
            <DepreciationRow age="1 year - 2 years" rate={10} />
            <DepreciationRow age="2 years - 3 years" rate={15} />
            <DepreciationRow age="3 years - 4 years" rate={25} />
            <DepreciationRow age="4 years - 5 years" rate={35} />
            <DepreciationRow age="Above 5 years" rate={50} />
            
            <View style={styles.depreciationNote}>
              <Icon name="bulb" size={20} color="#F59E0B" />
              <Text style={styles.depreciationNoteText}>
                Zero Depreciation Cover eliminates depreciation deductions on parts during claims
              </Text>
            </View>

            <Text style={[styles.depreciationTableTitle, { marginTop: 20 }]}>Parts Depreciation Rates</Text>
            <View style={styles.partsDepreciationContainer}>
              <View style={styles.partsDepreciationRow}>
                <Text style={styles.partsName}>Rubber Parts (Tyres, Tubes, Mudguards)</Text>
                <Text style={styles.partsRate}>50%</Text>
              </View>
              <View style={styles.partsDepreciationRow}>
                <Text style={styles.partsName}>Plastic Parts (Panels, Fairings)</Text>
                <Text style={styles.partsRate}>50%</Text>
              </View>
              <View style={styles.partsDepreciationRow}>
                <Text style={styles.partsName}>Nylon Parts (Cable, Rope)</Text>
                <Text style={styles.partsRate}>50%</Text>
              </View>
              <View style={styles.partsDepreciationRow}>
                <Text style={styles.partsName}>Battery</Text>
                <Text style={styles.partsRate}>50%</Text>
              </View>
              <View style={styles.partsDepreciationRow}>
                <Text style={styles.partsName}>Fiber Glass Components</Text>
                <Text style={styles.partsRate}>30%</Text>
              </View>
              <View style={styles.partsDepreciationRow}>
                <Text style={styles.partsName}>Metal Parts (Chain, Sprocket)</Text>
                <Text style={styles.partsRate}>As per age</Text>
              </View>
              <View style={styles.partsDepreciationRow}>
                <Text style={styles.partsName}>Painting Charges</Text>
                <Text style={styles.partsRate}>50%</Text>
              </View>
            </View>
          </ExpandableSection>

          {/* Third Party Premium Rates - BIKE SPECIFIC */}
          <ExpandableSection
            title="Third Party Premium Rates (Two-Wheelers)"
            icon="people"
            isExpanded={showThirdParty}
            onToggle={() => setShowThirdParty(!showThirdParty)}
            color="#6366F1"
          >
            <View style={styles.thirdPartyInfo}>
              <Icon name="information-circle" size={18} color="#6B7280" />
              <Text style={styles.thirdPartyInfoText}>
                Mandatory third party insurance rates for two-wheelers as per IRDAI (FY 2024-25)
              </Text>
            </View>
            
            <View style={styles.thirdPartyHeader}>
              <Text style={styles.thirdPartyHeaderText}>Category</Text>
              <Text style={styles.thirdPartyHeaderText}>CC Range</Text>
              <Text style={styles.thirdPartyHeaderText}>Premium</Text>
            </View>

            <ThirdPartyRow 
              category="Two Wheeler" 
              cc="Up to 75cc" 
              amount="₹482"
            />
            <ThirdPartyRow 
              category="Two Wheeler" 
              cc="75cc - 150cc" 
              amount="₹752"
            />
            <ThirdPartyRow 
              category="Two Wheeler" 
              cc="150cc - 350cc" 
              amount="₹1,193"
            />
            <ThirdPartyRow 
              category="Two Wheeler" 
              cc="Above 350cc" 
              amount="₹2,323"
            />
            
            <View style={styles.divider} />
            
            <View style={styles.additionalInfoBox}>
              <Icon name="star" size={18} color="#F59E0B" />
              <Text style={styles.additionalInfoText}>
                <Text style={{ fontWeight: '700' }}>Long-term Policy:</Text> You can opt for 3-year or 5-year third party insurance for cost savings
              </Text>
            </View>

            <View style={styles.thirdPartyNote}>
              <Icon name="shield-checkmark" size={20} color="#6366F1" />
              <Text style={styles.thirdPartyNoteText}>
                <Text style={{ fontWeight: '700' }}>Personal Accident Cover (Owner-Rider):</Text> ₹15 Lakhs coverage - Premium ₹750/year (Mandatory for new policies)
              </Text>
            </View>

            <View style={[styles.thirdPartyNote, { backgroundColor: '#FEF3C7', marginTop: 10 }]}>
              <Icon name="warning" size={20} color="#F59E0B" />
              <Text style={[styles.thirdPartyNoteText, { color: '#92400E' }]}>
                <Text style={{ fontWeight: '700' }}>Penalty:</Text> Riding without insurance - ₹2,000 fine and/or 3 months imprisonment (First offense)
              </Text>
            </View>

            <View style={[styles.thirdPartyNote, { backgroundColor: '#DBEAFE', marginTop: 10 }]}>
              <Icon name="information-circle" size={20} color="#1E40AF" />
              <Text style={[styles.thirdPartyNoteText, { color: '#1E40AF' }]}>
                <Text style={{ fontWeight: '700' }}>Coverage Limit:</Text> Third party property damage covered up to ₹7.5 Lakhs
              </Text>
            </View>
          </ExpandableSection>
        </View>
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
                  placeholder="e.g., Honda Activa 6G"
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
                    <Text style={styles.saveButtonText}>Save Data</Text>
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
    backgroundColor: '#F3F4F6',
  },
  scrollContainer: {
    paddingBottom: 40,
  },
  headerContainer: {
    marginBottom: 20,
  },
  headerGradient: {
    backgroundColor: '#6366F1',
    paddingVertical: 40,
    paddingHorizontal: 20,
    alignItems: 'center',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FFFFFF',
    marginTop: 12,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 15,
    color: '#E0E7FF',
    marginTop: 8,
    fontWeight: '500',
    textAlign: 'center',
  },
  formContainer: {
    backgroundColor: 'white',
    marginHorizontal: 20,
    padding: 24,
    borderRadius: 24,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 8,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 20,
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderRadius: 16,
    marginBottom: 16,
    backgroundColor: '#F9FAFB',
    overflow: 'hidden',
  },
  inputIconContainer: {
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 16,
    paddingVertical: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    color: '#1F2937',
    paddingVertical: 16,
    paddingHorizontal: 16,
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
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
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
    marginLeft: 10,
  },
  errorContainer: {
    flexDirection: 'row',
    backgroundColor: '#FEE2E2',
    marginHorizontal: 20,
    padding: 16,
    borderRadius: 16,
    marginBottom: 20,
    alignItems: 'center',
    borderLeftWidth: 4,
    borderLeftColor: '#EF4444',
  },
  errorText: {
    color: '#DC2626',
    fontSize: 15,
    fontWeight: '600',
    marginLeft: 12,
    flex: 1,
  },
  dataContainer: {
    backgroundColor: 'white',
    marginHorizontal: 20,
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 10,
    overflow: 'hidden',
  },
  dataHeader: {
    backgroundColor: '#ECFDF5',
    paddingVertical: 28,
    paddingHorizontal: 24,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#D1FAE5',
  },
  dataTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#065F46',
    marginTop: 12,
    marginBottom: 12,
  },
  sourceBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
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
    fontSize: 13,
    fontWeight: '600',
    marginLeft: 6,
  },
  dataContent: {
    padding: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 20,
    paddingBottom: 12,
    borderBottomWidth: 2,
    borderBottomColor: '#E5E7EB',
  },
  dataRow: {
    marginBottom: 18,
    paddingBottom: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  dataRowHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  dataIcon: {
    marginRight: 10,
  },
  dataLabel: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  dataValue: {
    fontSize: 16,
    color: '#1F2937',
    fontWeight: '600',
    marginLeft: 30,
    lineHeight: 22,
  },
  premiumButtonContainer: {
    margin: 20,
  },
  premiumButton: {
    backgroundColor: '#1F2937',
    paddingVertical: 18,
    paddingHorizontal: 24,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
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
  },
  infoSectionsContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  expandableContainer: {
    marginTop: 20,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  expandableHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 18,
  },
  expandableHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  expandableTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: 'white',
    marginLeft: 12,
  },
  expandableContent: {
    backgroundColor: '#FFFFFF',
    padding: 20,
  },
  infoSubtitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 12,
  },
  coverageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: '#F9FAFB',
    borderRadius: 10,
    marginBottom: 8,
  },
  coverageIcon: {
    marginLeft: 8,
    marginRight: 8,
  },
  coverageText: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '500',
    flex: 1,
  },
  notCoveredText: {
    color: '#6B7280',
    textDecorationLine: 'line-through',
  },
  depreciationInfo: {
    flexDirection: 'row',
    backgroundColor: '#FEF3C7',
    padding: 12,
    borderRadius: 10,
    marginBottom: 16,
    alignItems: 'center',
  },
  depreciationInfoText: {
    fontSize: 13,
    color: '#92400E',
    marginLeft: 8,
    flex: 1,
    fontWeight: '500',
  },
  depreciationTableTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 12,
    marginTop: 8,
  },
  depreciationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  depreciationAge: {
    fontSize: 13,
    color: '#374151',
    fontWeight: '600',
    width: 130,
  },
  depreciationBarContainer: {
    flex: 1,
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    marginHorizontal: 12,
    overflow: 'hidden',
  },
  depreciationBar: {
    height: '100%',
    backgroundColor: '#F59E0B',
    borderRadius: 4,
  },
  depreciationRate: {
    fontSize: 14,
    color: '#1F2937',
    fontWeight: '700',
    width: 40,
    textAlign: 'right',
  },
  depreciationNote: {
    flexDirection: 'row',
    backgroundColor: '#FEF3C7',
    padding: 14,
    borderRadius: 10,
    marginTop: 16,
    alignItems: 'center',
  },
  depreciationNoteText: {
    fontSize: 13,
    color: '#92400E',
    marginLeft: 10,
    flex: 1,
    fontWeight: '500',
    lineHeight: 18,
  },
  partsDepreciationContainer: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 12,
  },
  partsDepreciationRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  partsName: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '500',
    flex: 1,
  },
  partsRate: {
    fontSize: 15,
    color: '#EF4444',
    fontWeight: '700',
  },
  thirdPartyInfo: {
    flexDirection: 'row',
    backgroundColor: '#DBEAFE',
    padding: 12,
    borderRadius: 10,
    marginBottom: 16,
    alignItems: 'center',
  },
  thirdPartyInfoText: {
    fontSize: 13,
    color: '#1E40AF',
    marginLeft: 8,
    flex: 1,
    fontWeight: '500',
  },
  thirdPartyHeader: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
  },
  thirdPartyHeaderText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#374151',
    flex: 1,
    textAlign: 'center',
  },
  thirdPartyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  thirdPartyLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  thirdPartyCategory: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '600',
    marginLeft: 8,
  },
  thirdPartyCc: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '500',
    flex: 1,
    textAlign: 'center',
  },
  thirdPartyAmount: {
    fontSize: 15,
    color: '#10B981',
    fontWeight: '700',
    flex: 1,
    textAlign: 'right',
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 12,
  },
  additionalInfoBox: {
    flexDirection: 'row',
    backgroundColor: '#FEF3C7',
    padding: 14,
    borderRadius: 10,
    marginTop: 16,
    alignItems: 'center',
  },
  additionalInfoText: {
    fontSize: 13,
    color: '#92400E',
    marginLeft: 10,
    flex: 1,
    lineHeight: 18,
  },
  thirdPartyNote: {
    flexDirection: 'row',
    backgroundColor: '#DBEAFE',
    padding: 14,
    borderRadius: 10,
    marginTop: 16,
    alignItems: 'center',
  },
  thirdPartyNoteText: {
    fontSize: 13,
    color: '#1E40AF',
    marginLeft: 10,
    flex: 1,
    fontWeight: '500',
    lineHeight: 18,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: 'white',
    borderRadius: 24,
    width: width * 0.9,
    maxHeight: '80%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 15,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
  },
  closeButton: {
    padding: 4,
  },
  modalContent: {
    padding: 20,
  },
  modalInputContainer: {
    marginBottom: 20,
  },
  modalLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  modalInput: {
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    color: '#1F2937',
    backgroundColor: '#F9FAFB',
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginHorizontal: 6,
  },
  cancelButton: {
    backgroundColor: '#F3F4F6',
  },
  cancelButtonText: {
    color: '#6B7280',
    fontSize: 16,
    fontWeight: '600',
  },
  saveButton: {
    backgroundColor: '#6366F1',
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default bike;