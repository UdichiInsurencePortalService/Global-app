
import { useRef, useState } from 'react';
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
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const { width } = Dimensions.get('window');

const Car = () => {
  const [registrationNumber, setRegistrationNumber] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [carData, setCarData] = useState(null);
  const [error, setError] = useState('');

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
      Alert.alert('Error', 'Please enter both registration number and phone number');
      return;
    }

    animateButtonPress();
    setLoading(true);
    setError('');
    setCarData(null);

    try {
      const queryParams = new URLSearchParams({
        registration_number: registrationNumber.toUpperCase().trim(),
        mobile_number: phoneNumber.trim(),
      });
      
      const apiUrl = `http://192.168.1.4:8080/api/vehicle/getcardata?${queryParams.toString()}`;
      console.log('API URL:', apiUrl);

      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Full car data:', JSON.stringify(data, null, 2));

      if (data && (Array.isArray(data) ? data.length > 0 : Object.keys(data).length > 0)) {
        const vehicleData = Array.isArray(data) ? data[0] : data;
        setCarData(vehicleData);
        animateDataEntry();
        console.log('Vehicle found:', vehicleData);
      } else {
        setError('Data not found');
        console.log('No vehicle data found');
      }

    } catch (err) {
      console.error('API Error:', err);
      setError('Data not found');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('en-IN');
    } catch {
      return 'N/A';
    }
  };

  const formatCurrency = (amount) => {
    if (!amount) return 'N/A';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
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
          </Animated.View>
        )}
      </ScrollView>
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
    fontFamily: 'System',
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
});

export default Car;