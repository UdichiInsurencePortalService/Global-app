import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from "expo-router";
import { useEffect, useState } from 'react';

const { height } = Dimensions.get('window');

import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Modal,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import AntIcon from 'react-native-vector-icons/AntDesign';
import FeatherIcon from 'react-native-vector-icons/Feather';
import Icon from 'react-native-vector-icons/MaterialIcons';

const { width } = Dimensions.get('window');

const CarIdv = () => {
      const router = useRouter();

  const [vehicleData, setVehicleData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [showBreakdown, setShowBreakdown] = useState(false);
  
  // IDV calculation states
  const [idv, setIdv] = useState(0);
  const [baseIdv, setBaseIdv] = useState(0);
  const [idvAdjustment, setIdvAdjustment] = useState(0);
  const [premium, setPremium] = useState(0);
  const [ncbDiscount, setNcbDiscount] = useState(0);
  const [ncbPercentage, setNcbPercentage] = useState(0);
  
  // Add-on states (using the same structure as React web component)
  const [addOns, setAddOns] = useState([
    { id: 1, name: 'Zero Depreciation', selected: false, price: 1500, icon: 'shield', description: 'Full claim without depreciation' },
    { id: 2, name: 'Engine Protection', selected: false, price: 800, icon: 'build', description: 'Covers engine damage' },
    { id: 3, name: 'Roadside Assistance', selected: false, price: 500, icon: 'car-repair', description: '24/7 emergency support' },
    { id: 4, name: 'Return to Invoice', selected: false, price: 1200, icon: 'receipt', description: 'Full invoice value coverage' },
    { id: 5, name: 'PA Cover for Owner Driver', selected: false, price: 330, icon: 'person', description: '₹15 Lakh personal accident cover' },
  ]);



  // Calculate vehicle age in years
  const calculateVehicleAge = (dateOfBuy) => {
    const currentYear = new Date().getFullYear();
    const purchaseYear = new Date(dateOfBuy).getFullYear();
    return currentYear - purchaseYear;
  };

  // Calculate IDV based on depreciation (using React web component logic)
  const calculateIDV = (vehicleDetails) => {
    const currentYear = new Date().getFullYear();
    const purchaseYear = new Date(vehicleDetails.date_of_buy || vehicleDetails.registrationDate).getFullYear();
    const ageInYears = currentYear - purchaseYear;
    
    // Parse ex-showroom price
    let baseValue = vehicleDetails.ex_showroom_price || vehicleDetails.exShowroom;
    if (typeof baseValue === 'string') {
      baseValue = parseFloat(baseValue.replace(/,/g, ''));
    }

    let depreciationRate;
    if (ageInYears <= 0.5) {
      depreciationRate = 0.05;
    } else if (ageInYears <= 1) {
      depreciationRate = 0.15;
    } else if (ageInYears <= 2) {
      depreciationRate = 0.20;
    } else if (ageInYears <= 3) {
      depreciationRate = 0.30;
    } else if (ageInYears <= 4) {
      depreciationRate = 0.40;
    } else if (ageInYears <= 5) {
      depreciationRate = 0.50;
    } else if (ageInYears <= 7) {
      depreciationRate = 0.60;
    } else if (ageInYears <= 10) {
      depreciationRate = 0.70;
    } else if (ageInYears <= 15) {
      depreciationRate = 0.80;
    } else {
      depreciationRate = 0.90;
    }

    const calculatedIDV = baseValue * (1 - depreciationRate);
    setBaseIdv(Math.round(calculatedIDV));
    setIdv(Math.round(calculatedIDV));
    return Math.round(calculatedIDV);
  };

  // Get third-party premium (using React web component logic)
  const getThirdPartyPremium = (vehicleDetails) => {
    const engineCC = vehicleDetails?.cubic_capacity || vehicleDetails?.engineCapacity || 0;
    const isVehicleType = vehicleDetails.vehicle_type?.toLowerCase() || '';
    const isBike = isVehicleType === 'bike' || engineCC <= 350;

    // Parse engine capacity if it's a string
    let cc = engineCC;
    if (typeof cc === 'string') {
      cc = parseFloat(cc.replace(/[^0-9]/g, ''));
    }

    // Latest IRDAI rates for third-party premiums
    if (isBike) {
      // Two-wheelers
      if (cc <= 75) return 538;
      if (cc <= 150) return 714;
      if (cc <= 350) return 1366;
      return 2804;
    } else {
      // Private cars
      if (cc <= 1000) return 2094;
      if (cc <= 1500) return 3416;
      return 7;
      // 7744
    }
  };

  // Calculate premium (using React web component logic)
  const calculatePremium = () => {
    if (!vehicleData || !idv) return;

    const currentYear = new Date().getFullYear();
    const purchaseYear = new Date(vehicleData.date_of_buy || vehicleData.registrationDate).getFullYear();
    const ageInYears = currentYear - purchaseYear;

    // Base premium rates based on vehicle age
    let basePremiumRate;
    if (ageInYears <= 3) {
      basePremiumRate = 0.008; // 0.8% of IDV
    } else if (ageInYears <= 7) {
      basePremiumRate = 0.009; // 0.9% of IDV
    } else if (ageInYears <= 10) {
      basePremiumRate = 0.011; // 1.1% of IDV
    } else {
      basePremiumRate = 0.013; // 1.3% of IDV
    }

    // Calculate own damage premium before NCB
    const ownDamagePremium = idv * basePremiumRate;
    
    // Apply NCB discount to own damage premium
    const ncbDiscount = ownDamagePremium * (ncbPercentage / 100);
    setNcbDiscount(Math.round(ncbDiscount));
    
    // Calculate final own damage premium after NCB
    const finalOwnDamagePremium = ownDamagePremium - ncbDiscount;
    
    // Get third-party premium
    const thirdPartyPremium = getThirdPartyPremium(vehicleData);
    
    // Calculate add-ons premium
    const addOnsPremium = addOns
      .filter((addon) => addon.selected)
      .reduce((total, addon) => total + addon.price, 0);

    // Calculate subtotal (before GST)
    const subtotal = finalOwnDamagePremium + thirdPartyPremium + addOnsPremium;
    
    // Calculate GST (18% of subtotal)
    const gst = subtotal * 0.18;
    
    // Calculate total premium (subtotal + GST)
    const totalPremium = subtotal + gst;

    setPremium(Math.round(totalPremium));
    
    // Store premium components
    const premiumComponents = {
      totalPremium: Math.round(totalPremium),
      ownDamagePremium: Math.round(ownDamagePremium),
      thirdPartyPremium: thirdPartyPremium,
      addOnsPremium: addOnsPremium,
      gst: Math.round(gst),
      ncbDiscount: Math.round(ncbDiscount),
      ncbPercentage: ncbPercentage,
      idv: idv,
      selectedAddOns: addOns.filter(addon => addon.selected)
    };

    AsyncStorage.setItem('premiumComponents', JSON.stringify(premiumComponents));
    console.log("premiun componenets>>>>><<<<<<<<",premiumComponents)
  };

  // Load stored vehicle data from AsyncStorage
  const loadVehicleData = async () => {
    try {
      setLoading(true);
      setError(null);

      const storedData = await AsyncStorage.getItem('vehicleData');
      
      if (storedData) {
        const parsedData = JSON.parse(storedData);
        setVehicleData(parsedData);
        
        // Calculate IDV
        calculateIDV(parsedData);
        
        // Set NCB based on vehicle age
        const currentYear = new Date().getFullYear();
        const purchaseYear = new Date(parsedData.date_of_buy || parsedData.registrationDate).getFullYear();
        const ageInYears = currentYear - purchaseYear;
        
        // Apply NCB based on age
        if (ageInYears >= 5) {
          setNcbPercentage(50);
        } else if (ageInYears === 4) {
          setNcbPercentage(45);
        } else if (ageInYears === 3) {
          setNcbPercentage(35);
        } else if (ageInYears === 2) {
          setNcbPercentage(25);
        } else if (ageInYears === 1) {
          setNcbPercentage(20);
        } else {
          setNcbPercentage(0);
        }
      } else {
        // Sample data for testing
        const sampleData = {
          owner: 'John Doe',
          vehicle_no: 'DL-01-AB-1234',
          maker_model: 'Honda City 2020',
          fuel_type: 'Petrol',
          cubic_capacity: 1498,
          date_of_buy: '2020-01-15',
          ex_showroom_price: 1250000,
          vehicle_type: 'car'
        };
        
        await AsyncStorage.setItem('vehicleData', JSON.stringify(sampleData));
        setVehicleData(sampleData);
        calculateIDV(sampleData);
        setNcbPercentage(35); // 3 years old
      }
    } catch (error) {
      console.error('Error loading vehicle data:', error);
      setError('Failed to load vehicle data');
    } finally {
      setLoading(false);
    }
  };

  // Toggle add-on selection
  const toggleAddOn = (id) => {
    setAddOns((prevAddOns) =>
      prevAddOns.map((addon) =>
        addon.id === id ? { ...addon, selected: !addon.selected } : addon
      )
    );
  };

  // Refresh function
  const onRefresh = async () => {
    setRefreshing(true);
    await loadVehicleData();
    setRefreshing(false);
  };

  // Effects
  useEffect(() => {
    loadVehicleData();
  }, []);

  useEffect(() => {
    if (idv > 0 && vehicleData) {
      calculatePremium();
    }
  }, [idv, addOns, ncbPercentage, vehicleData]);

  // Get premium breakdown
  const getPremiumBreakdown = () => {
    if (!vehicleData || !idv) return [];

    const currentYear = new Date().getFullYear();
    const purchaseYear = new Date(vehicleData.date_of_buy || vehicleData.registrationDate).getFullYear();
    const ageInYears = currentYear - purchaseYear;

    let basePremiumRate;
    if (ageInYears <= 3) {
      basePremiumRate = 0.008;
    } else if (ageInYears <= 7) {
      basePremiumRate = 0.009;
    } else if (ageInYears <= 10) {
      basePremiumRate = 0.011;
    } else {
      basePremiumRate = 0.013;
    }

    const ownDamagePremium = Math.round(idv * basePremiumRate);
    const thirdPartyPremium = getThirdPartyPremium(vehicleData);
    const addOnsPremium = addOns
      .filter((addon) => addon.selected)
      .reduce((total, addon) => total + addon.price, 0);
    const subtotal = ownDamagePremium - ncbDiscount + thirdPartyPremium + addOnsPremium;
    const gst = Math.round(subtotal * 0.18);

    return [
      { key: '1', component: 'Own Damage Premium', amount: ownDamagePremium, icon: 'directions-car' },
      { key: '2', component: 'NCB Discount', amount: -ncbDiscount, icon: 'star', isDiscount: true },
      { key: '3', component: 'Third-Party Premium', amount: thirdPartyPremium, icon: 'group' },
      { key: '4', component: 'Add-Ons', amount: addOnsPremium, icon: 'add-circle' },
      { key: '5', component: 'GST (18%)', amount: gst, icon: 'receipt' },
    ];
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Handle buy insurance
  const handleBuyInsurance = () => {
  Alert.alert(
    'Proceed to Payment',
    `Total Premium: ${formatCurrency(premium)}\n\nWould you like to proceed with the payment?`,
    [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Proceed',
        onPress: async () => {
          try {
            // Optionally store data if needed (like premium or user info)

            // Navigate to payment page
            router.push('../Payment'); // 🔁 Update path if needed
          } catch (error) {
            console.error('Navigation error:', error);
            Alert.alert('Error', 'Something went wrong while proceeding to payment.');
          }
        },
      },
    ]
  );
};

  // Loading component
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6366f1" />
        <Text style={styles.loadingText}>Loading vehicle data...</Text>
      </View>
    );
  }

  // Error component
  if (error) {
    return (
      <View style={styles.errorContainer}>
        <AntIcon name="exclamationcircle" size={48} color="#ef4444" />
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={loadVehicleData}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const premiumBreakdown = getPremiumBreakdown();
  const vehicleAge = calculateVehicleAge(vehicleData.date_of_buy || vehicleData.registrationDate);




  return (
    <ScrollView 
      style={styles.container}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={['#6366f1']}
          tintColor="#6366f1"
        />
      }
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Hello {vehicleData?.ownerName || 'User'}</Text>
        <Text style={styles.headerSubtitle}>Your Premium Details</Text>
      </View>

      {/* Vehicle Information Card */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.cardHeaderLeft}>
            <Icon name="directions-car" size={24} color="#6366f1" />
            <Text style={styles.cardTitle}>Vehicle Details</Text>
          </View>
          <View style={styles.verifiedBadge}>
            <AntIcon name="checkcircle" size={16} color="#ffffff" />
            <Text style={styles.badgeText}>Verified</Text>
          </View>
        </View>
        
        <View style={styles.cardContent}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Registration:</Text>
            <Text style={styles.detailValue}>{vehicleData?.registrationNumber}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Model:</Text>
            <Text style={styles.detailValue}>{vehicleData?.makerModel || 'N/A'}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Age:</Text>
            <Text style={styles.detailValue}>{vehicleData?.registrationDate} years old</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Fuel Type:</Text>
            <Text style={styles.detailValue}>{vehicleData?.fuelType || 'N/A'} </Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Engine:</Text>
            <Text style={styles.detailValue}>{vehicleData?.engineCapacity} cc</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Ex-Showroom Price:</Text>
            <Text style={styles.priceValue}>{formatCurrency(vehicleData?.exShowroom)}</Text>
          </View>
        </View>
      </View>

      {/* IDV Card */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.cardHeaderLeft}>
            <Icon name="shield" size={24} color="#10b981" />
            <View>
              <Text style={styles.cardTitle}>Insured Declared Value (IDV)</Text>
              <Text style={styles.cardSubtitle}>Maximum claimable amount</Text>
            </View>
          </View>
        </View>
        
        <View style={styles.idvContent}>
          <Text style={styles.idvValue}>{formatCurrency(idv)}</Text>
          <Text style={styles.idvDescription}>
            Based on {vehicleAge} years depreciation and market value
          </Text>
        </View>
      </View>

      {/* Premium Card */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.cardHeaderLeft}>
            <Icon name="payment" size={24} color="#f59e0b" />
            <Text style={styles.cardTitle}>Final Premium</Text>
          </View>
        </View>
        
        <View style={styles.premiumContent}>
          <Text style={styles.premiumValue}>{formatCurrency(premium)}</Text>
          <Text style={styles.premiumDescription}>Annual premium including GST</Text>
          
          <View style={styles.ncbInfo}>
            <View style={styles.ncbBadge}>
              <AntIcon name="star" size={16} color="#ffffff" />
              <Text style={styles.ncbText}>NCB: {ncbPercentage}%</Text>
            </View>
            <Text style={styles.ncbSavings}>Savings: {formatCurrency(ncbDiscount)}</Text>
          </View>
        </View>
      </View>

      {/* Add-ons Card */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.cardHeaderLeft}>
            <Icon name="add-circle" size={24} color="#8b5cf6" />
            <Text style={styles.cardTitle}>Add-on Covers</Text>
          </View>
        </View>
        
        <View style={styles.addOnsContent}>
          <Text style={styles.addOnsSubtitle}>Enhance your coverage with these add-ons:</Text>
          
          {addOns.map(addon => (
            <TouchableOpacity
              key={addon.id}
              style={[styles.addOnItem, addon.selected && styles.addOnItemSelected]}
              onPress={() => toggleAddOn(addon.id)}
            >
              <View style={styles.addOnLeft}>
                <Icon name={addon.icon} size={20} color={addon.selected ? "#6366f1" : "#64748b"} />
                <View style={styles.addOnInfo}>
                  <Text style={[styles.addOnName, addon.selected && styles.addOnNameSelected]}>
                    {addon.name}
                  </Text>
                  <Text style={styles.addOnDescription}>{addon.description}</Text>
                </View>
              </View>
              <View style={styles.addOnRight}>
                <Text style={[styles.addOnPrice, addon.selected && styles.addOnPriceSelected]}>
                  {formatCurrency(addon.price)}
                </Text>
                <View style={[styles.checkbox, addon.selected && styles.checkboxSelected]}>
                  {addon.selected && <AntIcon name="check" size={16} color="#ffffff" />}
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Premium Breakdown Card */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.cardHeaderLeft}>
            <Icon name="list" size={24} color="#ef4444" />
            <Text style={styles.cardTitle}>Premium Breakdown</Text>
          </View>
        </View>
        
        <View style={styles.breakdownContent}>
          {premiumBreakdown.map(item => (
            <View key={item.key} style={styles.breakdownItem}>
              <View style={styles.breakdownLeft}>
                <Icon name={item.icon} size={20} color="#64748b" />
                <Text style={styles.breakdownLabel}>{item.component}</Text>
              </View>
              <Text style={[
                styles.breakdownAmount,
                item.isDiscount && styles.breakdownDiscount
              ]}>
                {item.isDiscount ? '-' : ''}{formatCurrency(Math.abs(item.amount))}
              </Text>
            </View>
          ))}
          
          <View style={styles.breakdownDivider} />
          
          <View style={styles.breakdownTotal}>
            <Text style={styles.breakdownTotalLabel}>Total Premium</Text>
            <Text style={styles.breakdownTotalAmount}>{formatCurrency(premium)}</Text>
          </View>
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        <TouchableOpacity 
          style={styles.breakdownButton}
          onPress={() => setShowBreakdown(true)}
        >
          <FeatherIcon name="eye" size={20} color="#6366f1" />
          <Text style={styles.breakdownButtonText}>View Details</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.buyButton}
          onPress={handleBuyInsurance}
        >
          <Icon name="payment" size={20} color="#ffffff" />
          <Text style={styles.buyButtonText}>Buy Insurance</Text>
        </TouchableOpacity>
      </View>

      {/* Breakdown Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showBreakdown}
        onRequestClose={() => setShowBreakdown(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Premium Calculation Details</Text>
              <Pressable onPress={() => setShowBreakdown(false)}>
                <AntIcon name="close" size={24} color="#64748b" />
              </Pressable>
            </View>
            
            <ScrollView style={styles.modalBody}>
              <View style={styles.modalSection}>
                <Text style={styles.modalSectionTitle}>Vehicle Information</Text>
                <Text style={styles.modalItem}>Ex-Showroom Price: {formatCurrency(vehicleData?.exShowroom)}</Text>
                <Text style={styles.modalItem}>Vehicle Age: {vehicleData?.registrationDate}</Text>
                <Text style={styles.modalItem}>IDV: {formatCurrency(idv)}</Text>
                <Text style={styles.modalItem}>NCB Percentage: {ncbPercentage}%</Text>
              </View>
              
              <View style={styles.modalSection}>
                <Text style={styles.modalSectionTitle}>Premium Components</Text>
                {premiumBreakdown.map(item => (
                  <View key={item.key} style={styles.modalBreakdownItem}>
                    <Text style={styles.modalItem}>{item.component}</Text>
                    <Text style={[styles.modalAmount, item.isDiscount && styles.modalDiscount]}>
                      {item.isDiscount ? '-' : ''}{formatCurrency(Math.abs(item.amount))}
                    </Text>
                  </View>
                ))}
                <View style={styles.modalDivider} />
                <View style={styles.modalBreakdownItem}>
                  <Text style={styles.modalTotalLabel}>Total Premium</Text>
                  <Text style={styles.modalTotalAmount}>{formatCurrency(premium)}</Text>
                </View>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#64748b',
    fontWeight: '500',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#ef4444',
    textAlign: 'center',
    marginVertical: 16,
  },
  retryButton: {
    backgroundColor: '#6366f1',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  header: {
    backgroundColor: '#6366f1',
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 24,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#e0e7ff',
    fontWeight: '500',
  },
  card: {
    backgroundColor: '#ffffff',
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1e293b',
    marginLeft: 12,
  },
  cardSubtitle: {
    fontSize: 12,
    color: '#64748b',
    marginLeft: 12,
  },
  verifiedBadge: {
    backgroundColor: '#10b981',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  badgeText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  cardContent: {
    gap: 12,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 15,
    color: '#64748b',
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 15,
    color: '#1e293b',
    fontWeight: '600',
  },
  priceValue: {
    fontSize: 15,
    color: '#6366f1',
    fontWeight: '700',
  },
  idvContent: {
    alignItems: 'center',
  },
  idvValue: {
    fontSize: 32,
    fontWeight: '700',
    color: '#10b981',
    marginBottom: 8,
  },
  idvDescription: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
  },
  premiumContent: {
    alignItems: 'center',
  },
  premiumValue: {
    fontSize: 32,
    fontWeight: '700',
    color: '#f59e0b',
    marginBottom: 8,
  },
  premiumDescription: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 16,
  },
  ncbInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  ncbBadge: {
    backgroundColor: '#10b981',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
  },
    card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginLeft: 8,
  },
  addOnsContent: {
    flex: 1,
  },
  addOnsSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 16,
    lineHeight: 20,
  },
  addOnItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    backgroundColor: '#ffffff',
  },
  addOnItemSelected: {
    borderColor: '#6366f1',
    backgroundColor: '#f8faff',
  },
  addOnLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  addOnInfo: {
    marginLeft: 12,
    flex: 1,
  },
  addOnName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1f2937',
    marginBottom: 4,
  },
  addOnNameSelected: {
    color: '#6366f1',
  },
  addOnDescription: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 18,
  },
  addOnRight: {
    alignItems: 'flex-end',
  },
  addOnPrice: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 8,
  },
  addOnPriceSelected: {
    color: '#6366f1',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#d1d5db',
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxSelected: {
    borderColor: '#6366f1',
    backgroundColor: '#6366f1',
  },
  breakdownContent: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    elevation: 3, // Android shadow
    shadowColor: '#000', // iOS shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    marginBottom: 20,
  },
  breakdownItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  breakdownLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  breakdownLabel: {
    fontSize: 16,
    color: '#334155', // Slate-800
    marginLeft: 8,
  },
  breakdownAmount: {
    fontSize: 16,
    color: '#1e293b', // Slate-900
    fontWeight: '600',
  },
  breakdownDiscount: {
    color: '#ef4444', // Red-500 for discounts
  },
  breakdownDivider: {
    height: 1,
    backgroundColor: '#e2e8f0', // Light gray line
    marginVertical: 12,
  },
  breakdownTotal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  breakdownTotalLabel: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0f172a', // Slate-900
  },
  breakdownTotalAmount: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2563eb', // Blue-600
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    gap: 12, // if using React Native 0.71+, otherwise use margin
  },
  breakdownButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#6366f1', // Indigo-500
    borderWidth: 1.5,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginRight: 8, // for spacing if `gap` unsupported
    backgroundColor: '#eef2ff', // light indigo background
  },
  breakdownButtonText: {
    color: '#6366f1',
    fontSize: 15,
    fontWeight: '600',
    marginLeft: 8,
  },
  buyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#10b981', // Green-500
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  buyButtonText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '600',
    marginLeft: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)', // semi-transparent black
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modalContent: {
    width: '100%',
    maxHeight: height * 0.85,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    overflow: 'hidden',
    paddingBottom: 12,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderColor: '#e2e8f0',
    backgroundColor: '#f8fafc',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1e293b',
  },
  modalBody: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  modalSection: {
    marginBottom: 20,
  },
  modalSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#475569',
    marginBottom: 10,
  },
  modalItem: {
    fontSize: 15,
    color: '#334155',
    marginBottom: 6,
  },
  modalBreakdownItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  modalAmount: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1e293b',
  },
  modalDiscount: {
    color: '#dc2626', // red for discounts
  },
  modalDivider: {
    height: 1,
    backgroundColor: '#e2e8f0',
    marginVertical: 12,
  },
  modalTotalLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0f172a',
  },
  modalTotalAmount: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2563eb',
  },
});

export default CarIdv;