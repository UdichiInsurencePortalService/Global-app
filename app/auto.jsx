import { useRef, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  Easing,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

const { width } = Dimensions.get('window');

// Mock Icon component (replace with actual icon library in React Native)
const Icon = ({ name, size, color, style }) => (
  <View style={[{ width: size, height: size, backgroundColor: color, borderRadius: size/2 }, style]} />
);

const auto = () => {
  const [registrationNumber, setRegistrationNumber] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [autoData, setAutoData] = useState(null);
  const [error, setError] = useState('');
  const [showPremiumButton, setShowPremiumButton] = useState(false);

  // New state for expandable sections
  const [showCoverage, setShowCoverage] = useState(false);
  const [showDepreciation, setShowDepreciation] = useState(false);
  const [showThirdParty, setShowThirdParty] = useState(false);

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(300)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
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

  const handleCheckDetails = () => {
    if (!registrationNumber.trim() || !phoneNumber.trim()) {
      alert('Please enter both registration number and phone number');
      return;
    }

    setLoading(true);
    setError('');
    setAutoData(null);
    setShowPremiumButton(false);

    // Simulate API call
    setTimeout(() => {
      const mockData = {
        owner_name: 'Rajesh Kumar',
        registration_number: registrationNumber.toUpperCase(),
        maker_model: 'Bajaj RE Auto Rickshaw',
        color: 'Yellow',
        fuel_type: 'CNG',
        engine_capacity: '400',
        mobile_number: phoneNumber,
        address: 'Connaught Place, New Delhi',
        registration_date: '2020-05-15',
        purchase_date: '2020-05-15',
        insurance_company: 'ICICI Lombard',
        financer: 'N/A',
        engine_number: 'ENG123456',
        chasi_number: 'CHAS789012',
        registered_at: 'Delhi RTO',
        exshowroom: '250000',
      };

      setAutoData(mockData);
      setShowPremiumButton(true);
      setLoading(false);
      animateDataEntry();
      setTimeout(() => animatePremiumButton(), 800);
    }, 2000);
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
        <Text style={styles.expandIcon}>{isExpanded ? '▲' : '▼'}</Text>
      </TouchableOpacity>
      
      {isExpanded && (
        <View style={styles.expandableContent}>
          {children}
        </View>
      )}
    </View>
  );

  const CoverageItem = ({ icon, text, isCovered }) => (
    <View style={styles.coverageItem}>
      <Text style={styles.coverageIcon}>{isCovered ? '✓' : '✗'}</Text>
      <Icon name={icon} size={18} color="#6B7280" style={styles.coverageIconImg} />
      <Text style={[styles.coverageText, !isCovered && styles.notCoveredText]}>
        {text}
      </Text>
    </View>
  );

  const DepreciationRow = ({ age, rate }) => (
    <View style={styles.depreciationRow}>
      <Text style={styles.depreciationAge}>{age}</Text>
      <View style={styles.depreciationBarContainer}>
        <View style={[styles.depreciationBar, { width: `${rate}%` }]} />
      </View>
      <Text style={styles.depreciationRate}>{rate}%</Text>
    </View>
  );

  const ThirdPartyRow = ({ category, cc, amount }) => (
    <View style={styles.thirdPartyRow}>
      <View style={styles.thirdPartyLeft}>
        <Icon name="auto" size={18} color="#6366F1" />
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
        {/* Header */}
        <View style={styles.headerContainer}>
          <View style={styles.headerGradient}>
            <Icon name="auto" size={48} color="#FFFFFF" />
            <Text style={styles.title}>Auto Insurance Lookup</Text>
            <Text style={styles.subtitle}>Complete auto-rickshaw & insurance information</Text>
          </View>
        </View>
        
        {/* Form Container */}
        <View style={styles.formContainer}>
          <Text style={styles.formTitle}>Enter Auto Details</Text>
          
          <View style={styles.inputContainer}>
            <View style={styles.inputIconContainer}>
              <Icon name="auto" size={22} color="#6366F1" />
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
              <Icon name="phone" size={22} color="#6366F1" />
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
                <Text style={styles.buttonText}>Search Auto</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Error Container */}
        {error && (
          <View style={styles.errorContainer}>
            <Icon name="alert" size={24} color="#EF4444" />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        {/* Auto Data Container */}
        {autoData && (
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
              <Icon name="check" size={36} color="#10B981" />
              <Text style={styles.dataTitle}>Auto Found!</Text>
            </View>
            
            <View style={styles.dataContent}>
              <Text style={styles.sectionTitle}>🚗 Auto Information</Text>
              
              <DataRow 
                icon="person" 
                label="Owner Name" 
                value={autoData.owner_name || 'N/A'}
                iconColor="#10B981"
              />
              
              <DataRow 
                icon="auto" 
                label="Registration Number" 
                value={autoData.registration_number || 'N/A'}
                iconColor="#6366F1"
              />
              
              <DataRow 
                icon="build" 
                label="Maker & Model" 
                value={autoData.maker_model || 'N/A'}
                iconColor="#F59E0B"
              />
              
              <DataRow 
                icon="palette" 
                label="Color" 
                value={autoData.color || 'N/A'}
                iconColor="#EC4899"
              />
              
              <DataRow 
                icon="fuel" 
                label="Fuel Type" 
                value={autoData.fuel_type || 'N/A'}
                iconColor="#EF4444"
              />
              
              <DataRow 
                icon="speed" 
                label="Engine Capacity" 
                value={autoData.engine_capacity ? `${autoData.engine_capacity} CC` : 'N/A'}
                iconColor="#8B5CF6"
              />
              
              <DataRow 
                icon="phone" 
                label="Mobile Number" 
                value={autoData.mobile_number || 'N/A'}
                iconColor="#06B6D4"
              />
              
              <DataRow 
                icon="location" 
                label="Address" 
                value={autoData.address || 'N/A'}
                iconColor="#84CC16"
              />
              
              <DataRow 
                icon="calendar" 
                label="Registration Date" 
                value={formatDate(autoData.registration_date)}
                iconColor="#F97316"
              />
              
              <DataRow 
                icon="cash" 
                label="IDV (Insured Declared Value)" 
                value={formatCurrency(autoData.exshowroom)}
                iconColor="#10B981"
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
                  onPress={() => alert('Navigate to Premium Calculation')}
                  activeOpacity={0.8}
                >
                  <View style={styles.premiumButtonContent}>
                    <Text style={styles.premiumButtonText}>💎 Calculate Premium →</Text>
                  </View>
                </TouchableOpacity>
              </Animated.View>
            )}
          </Animated.View>
        )}

        {/* Expandable Information Sections */}
        <View style={styles.infoSectionsContainer}>
          {/* Auto Insurance Coverage Section */}
          <ExpandableSection
            title="What's Covered in Auto Insurance"
            icon="shield"
            isExpanded={showCoverage}
            onToggle={() => setShowCoverage(!showCoverage)}
            color="#10B981"
          >
            <Text style={styles.infoSubtitle}>Covered Items</Text>
            <CoverageItem icon="auto" text="Own Damage (Accident, Fire, Theft)" isCovered={true} />
            <CoverageItem icon="umbrella" text="Natural Calamities (Flood, Earthquake, Storm)" isCovered={true} />
            <CoverageItem icon="fire" text="Man-made Calamities (Riots, Strikes, Terrorism)" isCovered={true} />
            <CoverageItem icon="people" text="Third Party Liability (Bodily Injury/Death)" isCovered={true} />
            <CoverageItem icon="auto" text="Third Party Property Damage" isCovered={true} />
            <CoverageItem icon="medical" text="Personal Accident Cover (Owner-Driver)" isCovered={true} />
            <CoverageItem icon="tools" text="Damage to Electrical/Electronic Accessories" isCovered={true} />
            
            <Text style={[styles.infoSubtitle, { marginTop: 20 }]}>Not Covered Items</Text>
            <CoverageItem icon="wrench" text="Normal Wear and Tear" isCovered={false} />
            <CoverageItem icon="beer" text="Driving Under Influence (Alcohol/Drugs)" isCovered={false} />
            <CoverageItem icon="document" text="Driving Without Valid License/Permit" isCovered={false} />
            <CoverageItem icon="warning" text="Consequential Damage/Loss" isCovered={false} />
            <CoverageItem icon="settings" text="Mechanical/Electrical Breakdown" isCovered={false} />
            <CoverageItem icon="nuclear" text="War, Nuclear Perils" isCovered={false} />
            <CoverageItem icon="globe" text="Use Outside Geographical Area" isCovered={false} />
            <CoverageItem icon="tire" text="Depreciation of Parts (unless Zero Dep)" isCovered={false} />
            <CoverageItem icon="road" text="Damage to Tyres (unless external damage)" isCovered={false} />
          </ExpandableSection>

          {/* IRDAI Depreciation Rates */}
          <ExpandableSection
            title="IRDAI Depreciation Rates"
            icon="chart"
            isExpanded={showDepreciation}
            onToggle={() => setShowDepreciation(!showDepreciation)}
            color="#F59E0B"
          >
            <View style={styles.depreciationInfo}>
              <Icon name="info" size={18} color="#92400E" />
              <Text style={styles.depreciationInfoText}>
                Depreciation is applied on auto parts during claim settlement
              </Text>
            </View>
            
            <Text style={styles.depreciationTableTitle}>Vehicle Age vs Depreciation</Text>
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
                Zero Depreciation Cover eliminates depreciation deductions during claims
              </Text>
            </View>

            <Text style={[styles.depreciationTableTitle, { marginTop: 20 }]}>Parts Depreciation Rates</Text>
            <View style={styles.partsDepreciationContainer}>
              <View style={styles.partsDepreciationRow}>
                <Text style={styles.partsName}>Rubber, Plastic, Nylon Parts</Text>
                <Text style={styles.partsRate}>50%</Text>
              </View>
              <View style={styles.partsDepreciationRow}>
                <Text style={styles.partsName}>Fiber Glass Components</Text>
                <Text style={styles.partsRate}>30%</Text>
              </View>
              <View style={styles.partsDepreciationRow}>
                <Text style={styles.partsName}>Battery</Text>
                <Text style={styles.partsRate}>50%</Text>
              </View>
              <View style={styles.partsDepreciationRow}>
                <Text style={styles.partsName}>Tubes, Tyres, Seats</Text>
                <Text style={styles.partsRate}>50%</Text>
              </View>
              <View style={styles.partsDepreciationRow}>
                <Text style={styles.partsName}>Painting Charges</Text>
                <Text style={styles.partsRate}>50%</Text>
              </View>
              <View style={styles.partsDepreciationRow}>
                <Text style={styles.partsName}>Metal Parts</Text>
                <Text style={styles.partsRate}>Nil</Text>
              </View>
            </View>
          </ExpandableSection>

          {/* Third Party Premium Rates for Autos */}
          <ExpandableSection
            title="Third Party Premium Rates"
            icon="people"
            isExpanded={showThirdParty}
            onToggle={() => setShowThirdParty(!showThirdParty)}
            color="#6366F1"
          >
            <View style={styles.thirdPartyInfo}>
              <Icon name="info" size={18} color="#1E40AF" />
              <Text style={styles.thirdPartyInfoText}>
                Mandatory third party insurance rates for auto-rickshaws as per IRDAI (FY 2024-25)
              </Text>
            </View>
            
            <View style={styles.thirdPartyHeader}>
              <Text style={styles.thirdPartyHeaderText}>Vehicle Type</Text>
              <Text style={styles.thirdPartyHeaderText}>GVW/Seating</Text>
              <Text style={styles.thirdPartyHeaderText}>Premium</Text>
            </View>

            <ThirdPartyRow 
              category="Three Wheeler (Goods)" 
              cc="≤1000kg GVW" 
              amount="₹2,863"
            />
            <ThirdPartyRow 
              category="Three Wheeler (Goods)" 
              cc="1000-1500kg" 
              amount="₹4,170"
            />
            <ThirdPartyRow 
              category="Three Wheeler (Goods)" 
              cc=">1500kg" 
              amount="₹6,335"
            />
            
            <View style={styles.divider} />
            
            <ThirdPartyRow 
              category="Three Wheeler (Pass.)" 
              cc="≤6 passengers" 
              amount="₹4,944"
            />
            <ThirdPartyRow 
              category="Three Wheeler (Pass.)" 
              cc="7-10 passengers" 
              amount="₹7,417"
            />
            <ThirdPartyRow 
              category="Three Wheeler (Pass.)" 
              cc=">10 passengers" 
              amount="₹9,735"
            />

            <View style={styles.divider} />

            <ThirdPartyRow 
              category="E-Rickshaw/Cart" 
              cc="Passenger" 
              amount="₹1,424"
            />
            <ThirdPartyRow 
              category="E-Rickshaw/Cart" 
              cc="Goods Carrier" 
              amount="₹881"
            />

            <View style={styles.thirdPartyNote}>
              <Icon name="shield" size={20} color="#6366F1" />
              <Text style={styles.thirdPartyNoteText}>
                Personal Accident Cover (Owner-Driver): ₹15 Lakhs - Premium ₹750/year (Optional but recommended)
              </Text>
            </View>

            <View style={[styles.thirdPartyNote, { backgroundColor: '#FEF3C7', marginTop: 10 }]}>
              <Icon name="warning" size={20} color="#F59E0B" />
              <Text style={[styles.thirdPartyNoteText, { color: '#92400E' }]}>
                Penalty for driving without insurance: ₹2,000 fine and/or 3 months imprisonment (First offense)
              </Text>
            </View>

            <View style={[styles.thirdPartyNote, { backgroundColor: '#DBEAFE', marginTop: 10 }]}>
              <Icon name="info" size={20} color="#1E40AF" />
              <Text style={[styles.thirdPartyNoteText, { color: '#1E40AF' }]}>
                Note: Rates may vary based on geographical zone. Commercial permit holders may have different rates.
              </Text>
            </View>
          </ExpandableSection>
        </View>
      </ScrollView>
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
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FFFFFF',
    marginTop: 12,
    textAlign: 'center',
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
  },
  inputIconContainer: {
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 16,
    paddingVertical: 18,
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    color: '#1F2937',
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  button: {
    backgroundColor: '#6366F1',
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonDisabled: {
    backgroundColor: '#9CA3AF',
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
    overflow: 'hidden',
    marginBottom: 20,
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
  },
  dataValue: {
    fontSize: 16,
    color: '#1F2937',
    fontWeight: '600',
    marginLeft: 30,
  },
  premiumButtonContainer: {
    margin: 20,
  },
  premiumButton: {
    backgroundColor: '#1F2937',
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: 'center',
  },
  premiumButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  premiumButtonText: {
    color: '#FFD700',
    fontSize: 18,
    fontWeight: '700',
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
  expandIcon: {
    color: 'white',
    fontSize: 16,
    fontWeight: '700',
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
    fontSize: 18,
    marginRight: 8,
  },
  coverageIconImg: {
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
});

export default auto;