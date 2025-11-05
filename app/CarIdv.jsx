import AsyncStorage from '@react-native-async-storage/async-storage';
import Slider from '@react-native-community/slider';
import { useRouter } from "expo-router";
import { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Modal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const { width } = Dimensions.get('window');

const CarIdv = () => {
  const router = useRouter();
  
  const [loading, setLoading] = useState(true);
  const [vehicleData, setVehicleData] = useState(null);
  const [idv, setIdv] = useState(0);
  const [baseIdv, setBaseIdv] = useState(0);
  const [idvAdjustment, setIdvAdjustment] = useState(0);
  const [ownDamagePremium, setOwnDamagePremium] = useState(0);
  const [thirdPartyPremium, setThirdPartyPremium] = useState(0);
  const [totalPremium, setTotalPremium] = useState(0);
  const [gstAmount, setGstAmount] = useState(0);
  const [finalPremium, setFinalPremium] = useState(0);
  
  const [ncbPercentage, setNcbPercentage] = useState(0);
  const [ncbDiscount, setNcbDiscount] = useState(0);
  const [showNcbModal, setShowNcbModal] = useState(false);
  
  const [selectedAddOns, setSelectedAddOns] = useState({
    1: false,
    2: false,
    3: false,
    4: false,
    5: false,
  });

  const addOnsPrices = {
    2: 1200,
    3: 800,
    4: 1600,
    5: 600,
  };

  const NCB_OPTIONS = [
    { label: 'No Previous Policy / Claim Made', value: 0 },
    { label: '1 Year Claim Free', value: 20 },
    { label: '2 Years Claim Free', value: 25 },
    { label: '3 Years Claim Free', value: 35 },
    { label: '4 Years Claim Free', value: 45 },
    { label: '5+ Years Claim Free', value: 50 },
  ];

  const calculateVehicleAge = (registrationDate) => {
    if (!registrationDate || registrationDate === 'N/A') return 0;
    
    try {
      const regDate = new Date(registrationDate);
      const today = new Date();
      const diffTime = Math.abs(today - regDate);
      const diffYears = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 365));
      return diffYears;
    } catch (error) {
      console.error('Error calculating vehicle age:', error);
      return 0;
    }
  };

  const getReducedOwnDamageRate = (ageInYears) => {
    if (ageInYears >= 0 && ageInYears < 1) return 1.40;
    if (ageInYears >= 1 && ageInYears < 2) return 1.20;
    if (ageInYears >= 2 && ageInYears < 3) return 0.40;
    if (ageInYears >= 3 && ageInYears < 4) return 0.60;
    if (ageInYears >= 4 && ageInYears < 5) return 0.80;
    return 0.80;
  };

  const getReducedThirdPartyPremium = (engineCapacity) => {
    const capacity = parseInt(engineCapacity) || 1200;
    
    if (capacity <= 1000) return 1600;
    if (capacity <= 1500) return 10;
    // 3016
    return 6000;
  };

  const calculateZeroDepPrice = (odPremiumBeforeNCB) => {
    return Math.round(odPremiumBeforeNCB * 0.25);
  };

  useEffect(() => {
    loadVehicleData();
  }, []);

  useEffect(() => {
    if (baseIdv > 0) {
      const maxAdjustment = 15;
      const boundedAdjustment = Math.max(-maxAdjustment, Math.min(maxAdjustment, idvAdjustment));
      const adjustedIdv = baseIdv * (1 + boundedAdjustment / 100);
      setIdv(Math.round(adjustedIdv));
    }
  }, [baseIdv, idvAdjustment]);

  useEffect(() => {
    if (vehicleData && baseIdv > 0) {
      calculatePremiums();
    }
  }, [vehicleData, idv, ncbPercentage, selectedAddOns]);

  const loadVehicleData = async () => {
    try {
      setLoading(true);
      const storedData = await AsyncStorage.getItem('vehicleData');
      
      if (storedData) {
        const data = JSON.parse(storedData);
        setVehicleData(data);
        
        const exShowroomPrice = parseFloat(data.exShowroom) || 500000;
        setBaseIdv(exShowroomPrice);
        setIdv(exShowroomPrice);
        
        const vehicleAge = calculateVehicleAge(data.registrationDate);
        const claimFreeYears = Math.min(vehicleAge, 5);
        const ncbPercent = getStandardNCBPercentage(claimFreeYears);
        setNcbPercentage(ncbPercent);
      } else {
        Alert.alert('Error', 'No vehicle data found');
        router.back();
      }
    } catch (error) {
      console.error('Error loading vehicle data:', error);
      Alert.alert('Error', 'Failed to load vehicle data');
      router.back();
    } finally {
      setLoading(false);
    }
  };

  const getStandardNCBPercentage = (claimFreeYears) => {
    if (claimFreeYears >= 5) return 50;
    if (claimFreeYears === 4) return 45;
    if (claimFreeYears === 3) return 35;
    if (claimFreeYears === 2) return 25;
    if (claimFreeYears === 1) return 20;
    return 0;
  };

  const calculatePremiums = () => {
    if (!vehicleData) return;

    const vehicleAge = calculateVehicleAge(vehicleData.registrationDate);
    
    const reducedRate = getReducedOwnDamageRate(vehicleAge);
    const odPremiumBeforeNCB = Math.round(idv * (reducedRate / 100));
    
    const ncbDiscountAmount = Math.round(odPremiumBeforeNCB * (ncbPercentage / 100));
    setNcbDiscount(ncbDiscountAmount);
    
    const odPremiumAfterNCB = odPremiumBeforeNCB - ncbDiscountAmount;
    setOwnDamagePremium(odPremiumAfterNCB);

    const tpPremium = getReducedThirdPartyPremium(vehicleData.engineCapacity);
    setThirdPartyPremium(tpPremium);

    const zeroDepCharge = calculateZeroDepPrice(odPremiumBeforeNCB);

    let addOnsPremium = 0;
    const selectedAddOnsArray = [];
    
    Object.keys(selectedAddOns).forEach(addonId => {
      if (selectedAddOns[addonId]) {
        const id = parseInt(addonId);
        const addOnInfo = getAddOnInfo(id);
        const price = id === 1 ? zeroDepCharge : addOnsPrices[id];
        
        addOnsPremium += price;
        selectedAddOnsArray.push({
          id,
          name: addOnInfo.name,
          price
        });
      }
    });

    const total = odPremiumAfterNCB + tpPremium + addOnsPremium;
    setTotalPremium(total);

    const gst = Math.round(total * 0.18);
    setGstAmount(gst);

    const final = total + gst;
    setFinalPremium(final);

    // Save premium components for payment page
    savePremiumComponents({
      ownDamagePremium: odPremiumAfterNCB,
      ownDamagePremiumBeforeNCB: odPremiumBeforeNCB,
      thirdPartyPremium: tpPremium,
      ncbPercentage,
      ncbDiscount: ncbDiscountAmount,
      addOns: selectedAddOnsArray,
      addOnsPremium,
      zeroDepreciationCharge: zeroDepCharge,
      gst: gst,
      totalPremium: final,
      idv,
      baseIdv,
      vehicleAge,
    });
  };

  const savePremiumComponents = async (components) => {
    try {
      await AsyncStorage.setItem('premiumComponents', JSON.stringify(components));
      console.log('Premium components saved successfully');
    } catch (error) {
      console.error('Error saving premium components:', error);
    }
  };

  const toggleAddOn = (id) => {
    setSelectedAddOns(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const getAddOnInfo = (id) => {
    const addOnsInfo = {
      1: { 
        name: 'Zero Depreciation', 
        icon: 'shield-checkmark', 
        description: 'Get full claim amount without depreciation deduction',
        color: '#10B981'
      },
      2: { 
        name: 'Engine Protection', 
        icon: 'construct', 
        description: 'Covers engine damage due to water ingress',
        color: '#F59E0B'
      },
      3: { 
        name: 'Roadside Assistance', 
        icon: 'car-sport', 
        description: '24/7 emergency roadside support',
        color: '#3B82F6'
      },
      4: { 
        name: 'Return to Invoice', 
        icon: 'receipt', 
        description: 'Get full invoice value in case of total loss',
        color: '#8B5CF6'
      },
      5: { 
        name: 'PA Cover for Owner', 
        icon: 'person', 
        description: 'Personal accident cover for driver',
        color: '#EF4444'
      },
    };
    return addOnsInfo[id];
  };

  const zeroDepPrice = useMemo(() => {
    if (!vehicleData || baseIdv <= 0) return 0;
    const vehicleAge = calculateVehicleAge(vehicleData.registrationDate);
    const reducedRate = getReducedOwnDamageRate(vehicleAge);
    const odPremiumBeforeNCB = Math.round(idv * (reducedRate / 100));
    return calculateZeroDepPrice(odPremiumBeforeNCB);
  }, [vehicleData, idv, baseIdv]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount || 0);
  };

  const formatDate = (dateString) => {
    if (!dateString || dateString === 'N/A') return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      });
    } catch {
      return 'N/A';
    }
  };

  const handleCheckout = async () => {
    try {
      // Ensure all premium data is saved
      await savePremiumComponents({
        ownDamagePremium,
        thirdPartyPremium,
        ncbPercentage,
        ncbDiscount,
        addOns: Object.keys(selectedAddOns)
          .filter(key => selectedAddOns[key])
          .map(key => {
            const id = parseInt(key);
            const addOnInfo = getAddOnInfo(id);
            const price = id === 1 ? zeroDepPrice : addOnsPrices[id];
            return { id, name: addOnInfo.name, price };
          }),
        addOnsPremium: Object.keys(selectedAddOns)
          .filter(key => selectedAddOns[key])
          .reduce((sum, key) => {
            const id = parseInt(key);
            const price = id === 1 ? zeroDepPrice : addOnsPrices[id];
            return sum + price;
          }, 0),
        gst: gstAmount,
        totalPremium: finalPremium,
        idv,
        baseIdv,
      });

      // Navigate to Payment page
      router.push({
        pathname: '/Payment',
        params: {
          premium: finalPremium.toString()
        }
      });
    } catch (error) {
      console.error('Error navigating to payment:', error);
      Alert.alert('Error', 'Failed to proceed to payment');
    }
  };

  const getPremiumBreakdown = () => {
    const selectedAddOnsArray = Object.keys(selectedAddOns).filter(key => selectedAddOns[key]);
    
    let addOnsPremium = 0;
    selectedAddOnsArray.forEach(addonId => {
      const id = parseInt(addonId);
      if (id === 1) {
        addOnsPremium += zeroDepPrice;
      } else {
        addOnsPremium += addOnsPrices[id] || 0;
      }
    });
    
    return [
      { label: 'Own Damage Premium', amount: ownDamagePremium, color: '#6366F1' },
      { label: 'NCB Discount', amount: -ncbDiscount, color: '#10B981' },
      { label: 'Third Party Premium', amount: thirdPartyPremium, color: '#F59E0B' },
      ...(selectedAddOnsArray.length > 0 ? [{ label: 'Add-ons', amount: addOnsPremium, color: '#8B5CF6' }] : []),
      { label: 'GST (18%)', amount: gstAmount, color: '#EF4444' },
    ];
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#6366F1" />
          <Text style={styles.loadingText}>Loading vehicle details...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!vehicleData) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Icon name="alert-circle" size={64} color="#EF4444" />
          <Text style={styles.errorText}>No vehicle data available</Text>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const vehicleAge = calculateVehicleAge(vehicleData.registrationDate);
  const savingsPercentage = ncbDiscount > 0 ? Math.round((ncbDiscount / (finalPremium + ncbDiscount)) * 100) : 0;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.gradientHeader}>
          <TouchableOpacity 
            onPress={() => router.back()}
            style={styles.backIconButton}
          >
            <Icon name="arrow-back" size={24} color="#FFF" />
          </TouchableOpacity>
          <View style={styles.headerContent}>
            <Icon name="shield-checkmark" size={48} color="#FFF" />
            <Text style={styles.headerTitle}>Motor Insurance</Text>
            <Text style={styles.headerSubtitle}>Hello {vehicleData.ownerName}!</Text>
            <View style={styles.headerBadge}>
              <Text style={styles.headerBadgeText}>Premium Details Ready</Text>
            </View>
          </View>
        </View>

        {/* Vehicle Details Card */}
        <View style={styles.vehicleCard}>
          <View style={styles.cardIconHeader}>
            <Icon name="car-sport" size={32} color="#FFF" />
            <Text style={styles.cardIconTitle}>Vehicle Details</Text>
          </View>
          <View style={styles.verifiedBadge}>
            <Icon name="checkmark-circle" size={16} color="#10B981" />
            <Text style={styles.verifiedText}>Verified</Text>
          </View>
          <View style={styles.vehicleInfo}>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Registration</Text>
              <Text style={styles.infoValue}>{vehicleData.registrationNumber}</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Model</Text>
              <Text style={styles.infoValue}>{vehicleData.makerModel}</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Year</Text>
              <Text style={styles.infoValue}>
                {formatDate(vehicleData.registrationDate)} ({vehicleAge} years old)
              </Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Engine</Text>
              <Text style={styles.infoValue}>{vehicleData.engineCapacity} CC</Text>
            </View>
          </View>
        </View>

        {/* IDV Card with Slider */}
        <View style={styles.idvCard}>
          <View style={styles.idvHeader}>
            <Icon name="cash" size={32} color="#10B981" />
            <View style={styles.idvContent}>
              <Text style={styles.idvLabel}>Insured Declared Value (IDV)</Text>
              <Text style={styles.idvValue}>{formatCurrency(idv)}</Text>
              <TouchableOpacity style={styles.infoButton}>
                <Icon name="information-circle" size={16} color="#6B7280" />
                <Text style={styles.infoButtonText}>
                  Maximum claim amount for total loss/theft
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          
          <View style={styles.sliderContainer}>
            <Text style={styles.sliderLabel}>
              Adjust IDV: {idvAdjustment > 0 ? '+' : ''}{idvAdjustment.toFixed(0)}%
            </Text>
            <Slider
              style={styles.slider}
              minimumValue={-15}
              maximumValue={15}
              value={idvAdjustment}
              onValueChange={setIdvAdjustment}
              minimumTrackTintColor="#10B981"
              maximumTrackTintColor="#E5E7EB"
              thumbTintColor="#10B981"
              step={1}
            />
            <View style={styles.sliderMarks}>
              <Text style={styles.sliderMark}>-15%</Text>
              <Text style={styles.sliderMark}>0%</Text>
              <Text style={styles.sliderMark}>+15%</Text>
            </View>
            <Text style={styles.sliderNote}>
              You can adjust the IDV within ±15% of the calculated value
            </Text>
          </View>
        </View>

        {/* Premium Card */}
        <View style={styles.premiumCard}>
          <View style={styles.premiumHeader}>
            <Icon name="shield-checkmark" size={32} color="#FFF" />
            <View>
              <Text style={styles.premiumLabel}>Annual Premium</Text>
              <Text style={styles.premiumValue}>{formatCurrency(finalPremium)}</Text>
              <Text style={styles.premiumNote}>Including GST</Text>
            </View>
          </View>
          
          <View style={styles.premiumBadges}>
            <View style={styles.premiumBadge}>
              <Text style={styles.premiumBadgeText}>NCB: {ncbPercentage}%</Text>
            </View>
            {ncbDiscount > 0 && (
              <View style={[styles.premiumBadge, styles.savingsBadge]}>
                <Text style={styles.premiumBadgeText}>
                  Saved: {formatCurrency(ncbDiscount)}
                </Text>
              </View>
            )}
          </View>

          {savingsPercentage > 0 && (
            <View style={styles.savingsContainer}>
              <Text style={styles.savingsText}>You saved {savingsPercentage}%!</Text>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: `${savingsPercentage}%` }]} />
              </View>
            </View>
          )}
        </View>

        {/* Premium Breakdown */}
        <View style={styles.breakdownCard}>
          <View style={styles.breakdownHeader}>
            <Icon name="calculator" size={24} color="#6366F1" />
            <Text style={styles.breakdownTitle}>Premium Breakdown</Text>
          </View>
          {getPremiumBreakdown().map((item, index) => (
            <View key={index} style={styles.breakdownRow}>
              <View style={styles.breakdownLabel}>
                <View style={[styles.colorDot, { backgroundColor: item.color }]} />
                <Text style={styles.breakdownText}>{item.label}</Text>
              </View>
              <Text style={[
                styles.breakdownAmount,
                item.amount < 0 && styles.discountAmount
              ]}>
                {item.amount < 0 ? '-' : ''}{formatCurrency(Math.abs(item.amount))}
              </Text>
            </View>
          ))}
          <View style={styles.breakdownDivider} />
          <View style={styles.breakdownRow}>
            <Text style={styles.totalLabel}>Total Premium</Text>
            <Text style={styles.totalAmount}>{formatCurrency(finalPremium)}</Text>
          </View>
        </View>

        {/* Add-ons Section */}
        <View style={styles.addonsCard}>
          <View style={styles.addonsHeader}>
            <Icon name="add-circle" size={24} color="#8B5CF6" />
            <Text style={styles.addonsTitle}>Add-on Covers</Text>
          </View>
          <Text style={styles.addonsSubtitle}>
            Enhance your coverage with these premium add-ons
          </Text>
          {[1, 2, 3, 4, 5].map(id => {
            const addon = getAddOnInfo(id);
            const price = id === 1 ? zeroDepPrice : addOnsPrices[id];
            const isSelected = selectedAddOns[id];
            
            return (
              <TouchableOpacity
                key={id}
                style={[
                  styles.addonItem,
                  isSelected && styles.addonItemSelected
                ]}
                onPress={() => toggleAddOn(id)}
                activeOpacity={0.7}
              >
                <View style={styles.addonContent}>
                  <View style={styles.addonIconContainer}>
                    <Icon 
                      name={addon.icon} 
                      size={24} 
                      color={isSelected ? '#FFF' : addon.color} 
                    />
                  </View>
                  <View style={styles.addonInfo}>
                    <Text style={[
                      styles.addonName,
                      isSelected && styles.addonNameSelected
                    ]}>
                      {addon.name}
                    </Text>
                    <Text style={[
                      styles.addonDescription,
                      isSelected && styles.addonDescriptionSelected
                    ]}>
                      {addon.description}
                    </Text>
                    <Text style={[
                      styles.addonPrice,
                      isSelected && styles.addonPriceSelected
                    ]}>
                      {formatCurrency(price)}
                    </Text>
                  </View>
                </View>
                <View style={styles.addonToggle}>
                  {isSelected && (
                    <Icon name="checkmark-circle" size={28} color="#FCD34D" />
                  )}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Coverage Details */}
        <View style={styles.coverageSection}>
          <Text style={styles.coverageTitle}>Coverage Details</Text>
          <View style={styles.coverageGrid}>
            <View style={[styles.coverageCard, styles.coveredCard]}>
              <Icon name="checkmark-circle" size={24} color="#10B981" />
              <Text style={styles.coverageCardTitle}>What's Covered</Text>
              <View style={styles.coverageList}>
                <Text style={styles.coverageItem}>✓ Accidental damage</Text>
                <Text style={styles.coverageItem}>✓ Theft of vehicle</Text>
                <Text style={styles.coverageItem}>✓ Third-party liability</Text>
                <Text style={styles.coverageItem}>✓ Natural disasters</Text>
                <Text style={styles.coverageItem}>✓ Fire damage</Text>
              </View>
            </View>
            
            <View style={[styles.coverageCard, styles.notCoveredCard]}>
              <Icon name="close-circle" size={24} color="#EF4444" />
              <Text style={styles.coverageCardTitle}>What's Not Covered</Text>
              <View style={styles.coverageList}>
                <Text style={styles.coverageItem}>✗ Normal wear and tear</Text>
                <Text style={styles.coverageItem}>✗ Mechanical breakdown</Text>
                <Text style={styles.coverageItem}>✗ Drunk driving</Text>
                <Text style={styles.coverageItem}>✗ Invalid license</Text>
                <Text style={styles.coverageItem}>✗ Consequential damage</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Checkout Button */}
        <TouchableOpacity
          style={styles.checkoutButton}
          onPress={handleCheckout}
          activeOpacity={0.8}
        >
          <Icon name="card" size={24} color="#FFF" />
          <View style={styles.checkoutTextContainer}>
            <Text style={styles.checkoutText}>Proceed to Payment</Text>
            <Text style={styles.checkoutAmount}>{formatCurrency(finalPremium)}</Text>
          </View>
          <Icon name="arrow-forward" size={24} color="#FFF" />
        </TouchableOpacity>

        {/* Disclaimer */}
        <View style={styles.disclaimer}>
          <Icon name="information-circle" size={16} color="#6B7280" />
          <Text style={styles.disclaimerText}>
            Premiums calculated as per IRDAI guidelines. Actual premium may vary based on individual risk assessment. Policy terms and conditions apply.
          </Text>
        </View>

        {/* NCB Modal */}
        <Modal
          visible={showNcbModal}
          transparent
          animationType="fade"
          onRequestClose={() => setShowNcbModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Select NCB Discount</Text>
                <TouchableOpacity onPress={() => setShowNcbModal(false)}>
                  <Icon name="close" size={24} color="#6B7280" />
                </TouchableOpacity>
              </View>
              {NCB_OPTIONS.map(option => (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    styles.ncbOption,
                    ncbPercentage === option.value && styles.ncbOptionSelected
                  ]}
                  onPress={() => {
                    setNcbPercentage(option.value);
                    setShowNcbModal(false);
                  }}
                >
                  <Text style={[
                    styles.ncbOptionText,
                    ncbPercentage === option.value && styles.ncbOptionTextSelected
                  ]}>
                    {option.label}
                  </Text>
                  <Text style={[
                    styles.ncbOptionValue,
                    ncbPercentage === option.value && styles.ncbOptionValueSelected
                  ]}>
                    {option.value}%
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </Modal>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6B7280',
    fontWeight: '600',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    color: '#EF4444',
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 24,
  },
  backButton: {
    backgroundColor: '#6366F1',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  backButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  gradientHeader: {
    backgroundColor: '#6366F1',
    paddingTop: 20,
    paddingBottom: 40,
    paddingHorizontal: 20,
    position: 'relative',
  },
  backIconButton: {
    position: 'absolute',
    left: 20,
    top: 20,
    zIndex: 10,
    padding: 8,
  },
  headerContent: {
    alignItems: 'center',
    paddingTop: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FFF',
    marginTop: 12,
  },
  headerSubtitle: {
    fontSize: 18,
    color: '#FFF',
    marginTop: 8,
    opacity: 0.9,
  },
  headerBadge: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginTop: 12,
  },
  headerBadgeText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
  },
  vehicleCard: {
    backgroundColor: '#6366F1',
    marginHorizontal: 20,
    marginTop: -20,
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  cardIconHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardIconTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFF',
    marginLeft: 12,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginBottom: 16,
  },
  verifiedText: {
    color: '#10B981',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  vehicleInfo: {
    gap: 12,
  },
  infoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.2)',
  },
  infoLabel: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 15,
    color: '#FFF',
    fontWeight: '700',
  },
  idvCard: {
    backgroundColor: '#F0FDF4',
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 20,
    padding: 20,
    borderWidth: 2,
    borderColor: '#86EFAC',
  },
  idvHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  idvContent: {
    marginLeft: 16,
    flex: 1,
  },
  idvLabel: {
    fontSize: 14,
    color: '#065F46',
    fontWeight: '600',
    marginBottom: 4,
  },
  idvValue: {
    fontSize: 32,
    color: '#065F46',
    fontWeight: '800',
    marginBottom: 8,
  },
  infoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  infoButtonText: {
    fontSize: 12,
    color: '#6B7280',
  },
  sliderContainer: {
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#D1FAE5',
  },
  sliderLabel: {
    fontSize: 15,
    color: '#065F46',
    fontWeight: '600',
    marginBottom: 12,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  sliderMarks: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  sliderMark: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  sliderNote: {
    fontSize: 11,
    color: '#6B7280',
    marginTop: 8,
    textAlign: 'center',
  },
  premiumCard: {
    backgroundColor: '#10B981',
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 20,
    padding: 20,
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  premiumHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  premiumLabel: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    fontWeight: '600',
    marginLeft: 12,
  },
  premiumValue: {
    fontSize: 32,
    color: '#FFF',
    fontWeight: '800',
    marginLeft: 12,
  },
  premiumNote: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.8)',
    marginLeft: 12,
    marginTop: 4,
  },
  premiumBadges: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  premiumBadge: {
    backgroundColor: 'rgba(252, 211, 77, 0.9)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  savingsBadge: {
    backgroundColor: 'rgba(16, 185, 129, 0.9)',
  },
  premiumBadgeText: {
    color: '#1F2937',
    fontSize: 13,
    fontWeight: '700',
  },
  savingsContainer: {
    marginTop: 8,
  },
  savingsText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  progressBar: {
    height: 8,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#FCD34D',
    borderRadius: 4,
  },
  breakdownCard: {
    backgroundColor: '#FFF',
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  breakdownHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  breakdownTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginLeft: 12,
  },
  breakdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  breakdownLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  colorDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 10,
  },
  breakdownText: {
    fontSize: 15,
    color: '#374151',
    fontWeight: '500',
  },
  breakdownAmount: {
    fontSize: 16,
    color: '#1F2937',
    fontWeight: '700',
  },
  discountAmount: {
    color: '#10B981',
  },
  breakdownDivider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 8,
  },
  totalLabel: {
    fontSize: 18,
    color: '#1F2937',
    fontWeight: '700',
  },
  totalAmount: {
    fontSize: 20,
    color: '#6366F1',
    fontWeight: '800',
  },
  addonsCard: {
    backgroundColor: '#FFF',
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  addonsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  addonsTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginLeft: 12,
  },
  addonsSubtitle: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 16,
  },
  addonItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    backgroundColor: '#F9FAFB',
    borderWidth: 2,
    borderColor: '#F3F4F6',
    marginBottom: 12,
  },
  addonItemSelected: {
    backgroundColor: '#8B5CF6',
    borderColor: '#7C3AED',
  },
  addonContent: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'flex-start',
  },
  addonIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  addonInfo: {
    flex: 1,
  },
  addonName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  addonNameSelected: {
    color: '#FFF',
  },
  addonDescription: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 6,
    lineHeight: 16,
  },
  addonDescriptionSelected: {
    color: 'rgba(255,255,255,0.9)',
  },
  addonPrice: {
    fontSize: 16,
    fontWeight: '700',
    color: '#8B5CF6',
  },
  addonPriceSelected: {
    color: '#FCD34D',
  },
  addonToggle: {
    marginLeft: 12,
  },
  coverageSection: {
    marginHorizontal: 20,
    marginTop: 20,
  },
  coverageTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 16,
    textAlign: 'center',
  },
  coverageGrid: {
    gap: 16,
  },
  coverageCard: {
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  coveredCard: {
    backgroundColor: '#F0FDF4',
    borderWidth: 2,
    borderColor: '#86EFAC',
  },
  notCoveredCard: {
    backgroundColor: '#FEF2F2',
    borderWidth: 2,
    borderColor: '#FCA5A5',
  },
  coverageCardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
    marginTop: 8,
    marginBottom: 12,
  },
  coverageList: {
    gap: 8,
  },
  coverageItem: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '500',
    lineHeight: 20,
  },
  checkoutButton: {
    backgroundColor: '#6366F1',
    marginHorizontal: 20,
    marginTop: 30,
    borderRadius: 20,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  checkoutTextContainer: {
    flex: 1,
    marginHorizontal: 16,
  },
  checkoutText: {
    fontSize: 18,
    color: '#FFF',
    fontWeight: '700',
  },
  checkoutAmount: {
    fontSize: 14,
    color: '#E0E7FF',
    fontWeight: '600',
    marginTop: 2,
  },
  disclaimer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#F9FAFB',
    marginHorizontal: 20,
    marginTop: 20,
    padding: 16,
    borderRadius: 12,
  },
  disclaimerText: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 8,
    flex: 1,
    lineHeight: 18,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 20,
    width: width - 40,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
  },
  ncbOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#F9FAFB',
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#F3F4F6',
  },
  ncbOptionSelected: {
    backgroundColor: '#EEF2FF',
    borderColor: '#6366F1',
  },
  ncbOptionText: {
    fontSize: 15,
    color: '#374151',
    fontWeight: '500',
    flex: 1,
  },
  ncbOptionTextSelected: {
    color: '#6366F1',
    fontWeight: '700',
  },
  ncbOptionValue: {
    fontSize: 16,
    color: '#6B7280',
    fontWeight: '700',
  },
  ncbOptionValueSelected: {
    color: '#6366F1',
  },
});

export default CarIdv;