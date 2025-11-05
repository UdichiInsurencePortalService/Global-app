import {
  Activity,
  AlertCircle,
  Ambulance,
  ArrowLeft,
  Baby,
  Check,
  Heart,
  Hospital,
  Phone,
  Pill,
  Shield,
  Stethoscope,
  User,
  Users,
  X,
} from 'lucide-react-native';
import { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

const health = () => {
  const [currentView, setCurrentView] = useState('selection');
  const [formData, setFormData] = useState({
    fullName: '',
    mobileNumber: '',
    city: '',
    age: '',
    preExistingIllness: '',
    coverageAmount: '',
    wifeAge: '',
    sonAge1: '',
    sonAge2: '',
    daughterAge1: '',
    daughterAge2: '',
    fatherAge: '',
    motherAge: '',
  });

  const handleSelection = (type) => {
    if (type === 'myself') {
      setCurrentView('individual');
    } else if (type === 'family') {
      setCurrentView('family');
    }
  };

  const handleBack = () => {
    setCurrentView('selection');
    setFormData({
      fullName: '',
      mobileNumber: '',
      city: '',
      age: '',
      preExistingIllness: '',
      coverageAmount: '',
      wifeAge: '',
      sonAge1: '',
      sonAge2: '',
      daughterAge1: '',
      daughterAge2: '',
      fatherAge: '',
      motherAge: '',
    });
  };

  const preExistingOptions = [
    'Diabetes',
    'Hypertension',
    'Heart Disease',
    'Asthma',
    'Thyroid',
  ];

  const individualCoverageOptions = [
    '₹3 Lakh',
    '₹4 Lakh',
    '₹5 Lakh',
    '₹7.5 Lakh',
    '₹10 Lakh',
  ];

  const familyCoverageOptions = ['₹3 Lakh', '₹5 Lakh', '₹7.5 Lakh'];

  const handlePreExistingSelect = (option) => {
    setFormData({ ...formData, preExistingIllness: option });
  };

  const handleCoverageSelect = (option) => {
    setFormData({ ...formData, coverageAmount: option });
  };

  const handleCalculatePremium = () => {
    console.log('Form Data:', formData);
    alert('Premium calculation submitted! Check console for details.');
  };

  const WhybuyHealth = [
    {
      id: '1',
      icon: Shield,
      iconColor: '#10b981',
      title: 'Save More with Tax Benefits',
      backgroundColor: '#d1fae5',
      description:
        'Under Section 80D of the Income Tax Act, you can claim deductions on health insurance premiums for yourself and your parents.',
    },
    {
      id: '2',
      icon: Heart,
      iconColor: '#f59e0b',
      title: 'Protection Against Serious Illnesses',
      backgroundColor: '#fef3c7',
      description:
        'Health insurance offers a safety net against life-threatening conditions like cancer and heart disease.',
    },
    {
      id: '3',
      icon: Activity,
      iconColor: '#3b82f6',
      title: 'Experience Peace of Mind',
      backgroundColor: '#dbeafe',
      description:
        'Focus on recovery instead of worrying about medical expenses during emergencies.',
    },
    {
      id: '4',
      icon: Stethoscope,
      iconColor: '#8b5cf6',
      title: 'Maintain Financial Stability',
      backgroundColor: '#ede9fe',
      description:
        'Cover unexpected costs and earn no-claim bonuses for long-term savings.',
    },
    {
      id: '5',
      icon: Hospital,
      iconColor: '#ec4899',
      title: 'Manage High Medical Costs',
      backgroundColor: '#fce7f3',
      description:
        'Health insurance eases the burden by covering costly treatments in private hospitals.',
    },
    {
      id: '6',
      icon: AlertCircle,
      iconColor: '#06b6d4',
      title: 'Get Timely Medical Care',
      backgroundColor: '#cffafe',
      description:
        "Don't delay treatment due to cost. Get medical help exactly when you need it.",
    },
  ];

  const whatCoveredData = [
    {
      id: '1',
      icon: Hospital,
      iconColor: '#10b981',
      title: 'Hospitalization Coverage',
      backgroundColor: '#d1fae5',
      description:
        'Room rent, ICU charges, and medical procedures during hospitalization.',
    },
    {
      id: '2',
      icon: Ambulance,
      iconColor: '#f59e0b',
      title: 'Emergency Ambulance',
      backgroundColor: '#fef3c7',
      description: 'Emergency ambulance services for quick medical transport.',
    },
    {
      id: '3',
      icon: Stethoscope,
      iconColor: '#3b82f6',
      title: 'Doctor Consultations',
      backgroundColor: '#dbeafe',
      description: 'Pre and post-hospitalization doctor consultations covered.',
    },
    {
      id: '4',
      icon: Pill,
      iconColor: '#8b5cf6',
      title: 'Medicine & Pharmacy',
      backgroundColor: '#ede9fe',
      description: 'Coverage for prescribed medicines and pharmacy expenses.',
    },
    {
      id: '5',
      icon: Activity,
      iconColor: '#ec4899',
      title: 'Diagnostic Tests',
      backgroundColor: '#fce7f3',
      description:
        'Lab tests, X-rays, MRI, CT scans and other diagnostic procedures.',
    },
    {
      id: '6',
      icon: Baby,
      iconColor: '#06b6d4',
      title: 'Maternity Coverage',
      backgroundColor: '#cffafe',
      description:
        'Maternity expenses including delivery and newborn baby care.',
    },
  ];

  const whatNotCovered = [
    {
      id: '1',
      icon: X,
      title: 'Cosmetic Procedures',
      description:
        'Cosmetic surgeries, aesthetic treatments, and beauty procedures.',
    },
    {
      id: '2',
      icon: X,
      title: 'Pre-existing Conditions',
      description:
        'Illnesses diagnosed before policy start (waiting period applies).',
    },
    {
      id: '3',
      icon: X,
      title: 'Self-Inflicted Injuries',
      description:
        'Injuries from suicide attempts, substance abuse, or self-harm.',
    },
    {
      id: '4',
      icon: X,
      title: 'War & Nuclear Risks',
      description:
        'Injuries from war, nuclear radiation, or similar catastrophic events.',
    },
    {
      id: '5',
      icon: X,
      title: 'Experimental Treatments',
      description:
        'Non-approved or experimental medical procedures and treatments.',
    },
    {
      id: '6',
      icon: X,
      title: 'Dental Procedures',
      description: 'Routine dental treatments unless requiring hospitalization.',
    },
  ];

  // Individual Health Insurance Form
  if (currentView === 'individual') {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" />
        <ScrollView style={styles.scrollView}>
          <View style={styles.container}>
            {/* Header */}
            <View style={styles.headerCard}>
              <View style={styles.headerContent}>
                <Text style={styles.headerTitle}>Individual Health Insurance</Text>
                <View style={styles.stepIndicator}>
                  <View style={styles.stepBadge}>
                    <Text style={styles.stepNumber}>1</Text>
                  </View>
                  <Text style={styles.stepLabel}>Information</Text>
                </View>
              </View>
            </View>

            {/* Personal Information Section */}
            <View style={styles.card}>
              <View style={styles.sectionHeader}>
                <View style={[styles.iconContainer, { backgroundColor: '#dbeafe' }]}>
                  <User color="#3b82f6" size={24} />
                </View>
                <Text style={styles.sectionTitle}>Personal Information</Text>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Full Name *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your full name"
                  value={formData.fullName}
                  onChangeText={(text) =>
                    setFormData({ ...formData, fullName: text })
                  }
                />
              </View>

              <View style={styles.row}>
                <View style={styles.halfWidth}>
                  <Text style={styles.label}>Mobile Number *</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter mobile"
                    value={formData.mobileNumber}
                    keyboardType="phone-pad"
                    onChangeText={(text) =>
                      setFormData({ ...formData, mobileNumber: text })
                    }
                  />
                </View>

                <View style={styles.halfWidth}>
                  <Text style={styles.label}>City *</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter city"
                    value={formData.city}
                    onChangeText={(text) =>
                      setFormData({ ...formData, city: text })
                    }
                  />
                </View>
              </View>
            </View>

            {/* Self Information Section */}
            <View style={styles.card}>
              <View style={styles.sectionHeader}>
                <View style={[styles.iconContainer, { backgroundColor: '#d1fae5' }]}>
                  <Activity color="#10b981" size={24} />
                </View>
                <Text style={styles.sectionTitle}>Self Information</Text>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Your Age *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your age"
                  value={formData.age}
                  keyboardType="numeric"
                  onChangeText={(text) =>
                    setFormData({ ...formData, age: text })
                  }
                />
              </View>
            </View>

            {/* Health Information Section */}
            <View style={styles.card}>
              <View style={styles.sectionHeader}>
                <View style={[styles.iconContainer, { backgroundColor: '#ede9fe' }]}>
                  <Heart color="#8b5cf6" size={24} />
                </View>
                <Text style={styles.sectionTitle}>Health Information</Text>
              </View>

              <View style={styles.subsection}>
                <Text style={styles.subsectionTitle}>Pre-existing Illnesses</Text>
                <Text style={styles.subsectionDescription}>
                  Select any pre-existing medical conditions
                </Text>

                <View style={styles.optionsContainer}>
                  {preExistingOptions.map((option) => (
                    <TouchableOpacity
                      key={option}
                      onPress={() => handlePreExistingSelect(option)}
                      style={[
                        styles.optionButton,
                        formData.preExistingIllness === option &&
                          styles.optionButtonSelected,
                      ]}
                    >
                      <Text
                        style={[
                          styles.optionText,
                          formData.preExistingIllness === option &&
                            styles.optionTextSelected,
                        ]}
                      >
                        {option}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.subsection}>
                <Text style={styles.subsectionTitle}>Coverage Amount</Text>
                <Text style={styles.subsectionDescription}>
                  Choose your desired insurance coverage
                </Text>

                <View style={styles.optionsContainer}>
                  {individualCoverageOptions.map((option) => (
                    <TouchableOpacity
                      key={option}
                      onPress={() => handleCoverageSelect(option)}
                      style={[
                        styles.coverageButton,
                        formData.coverageAmount === option &&
                          styles.coverageButtonSelected,
                      ]}
                    >
                      <Text
                        style={[
                          styles.coverageText,
                          formData.coverageAmount === option &&
                            styles.coverageTextSelected,
                        ]}
                      >
                        {option}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </View>

            {/* Action Buttons */}
            <View style={styles.actionButtons}>
              <TouchableOpacity
                onPress={handleBack}
                style={styles.backButton}
              >
                <ArrowLeft color="#374151" size={20} />
                <Text style={styles.backButtonText}>Back</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleCalculatePremium}
                style={styles.primaryButton}
              >
                <Text style={styles.primaryButtonText}>Calculate Premium</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // Family Health Insurance Form
  if (currentView === 'family') {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" />
        <ScrollView style={styles.scrollView}>
          <View style={styles.container}>
            {/* Header */}
            <View style={styles.headerCard}>
              <View style={styles.headerContent}>
                <Text style={styles.headerTitle}>Family Health Insurance</Text>
                <View style={styles.stepIndicator}>
                  <View style={[styles.stepBadge, { backgroundColor: '#10b981' }]}>
                    <Text style={styles.stepNumber}>2</Text>
                  </View>
                  <Text style={styles.stepLabel}>Information</Text>
                </View>
              </View>
            </View>

            {/* Personal Information Section */}
            <View style={styles.card}>
              <View style={styles.sectionHeader}>
                <View style={[styles.iconContainer, { backgroundColor: '#dbeafe' }]}>
                  <User color="#3b82f6" size={24} />
                </View>
                <Text style={styles.sectionTitle}>Personal Information</Text>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Full Name *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your full name"
                  value={formData.fullName}
                  onChangeText={(text) =>
                    setFormData({ ...formData, fullName: text })
                  }
                />
              </View>

              <View style={styles.row}>
                <View style={styles.halfWidth}>
                  <Text style={styles.label}>Mobile Number *</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter mobile"
                    value={formData.mobileNumber}
                    keyboardType="phone-pad"
                    onChangeText={(text) =>
                      setFormData({ ...formData, mobileNumber: text })
                    }
                  />
                </View>

                <View style={styles.halfWidth}>
                  <Text style={styles.label}>City *</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter city"
                    value={formData.city}
                    onChangeText={(text) =>
                      setFormData({ ...formData, city: text })
                    }
                  />
                </View>
              </View>
            </View>

            {/* Self Information Section */}
            <View style={styles.card}>
              <View style={styles.sectionHeader}>
                <View style={[styles.iconContainer, { backgroundColor: '#d1fae5' }]}>
                  <Activity color="#10b981" size={24} />
                </View>
                <Text style={styles.sectionTitle}>Self Information</Text>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Your Age *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your age"
                  value={formData.age}
                  keyboardType="numeric"
                  onChangeText={(text) =>
                    setFormData({ ...formData, age: text })
                  }
                />
              </View>
            </View>

            {/* Family Members Section */}
            <View style={styles.card}>
              <View style={styles.sectionHeader}>
                <View style={[styles.iconContainer, { backgroundColor: '#ede9fe' }]}>
                  <Users color="#8b5cf6" size={24} />
                </View>
                <Text style={styles.sectionTitle}>Family Members</Text>
              </View>

              <View style={styles.row}>
                <View style={styles.halfWidth}>
                  <Text style={styles.label}>Wife's Age</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter age"
                    value={formData.wifeAge}
                    keyboardType="numeric"
                    onChangeText={(text) =>
                      setFormData({ ...formData, wifeAge: text })
                    }
                  />
                </View>

                <View style={styles.halfWidth}>
                  <Text style={styles.label}>Son 1 Age</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter age"
                    value={formData.sonAge1}
                    keyboardType="numeric"
                    onChangeText={(text) =>
                      setFormData({ ...formData, sonAge1: text })
                    }
                  />
                </View>
              </View>

              <View style={styles.row}>
                <View style={styles.halfWidth}>
                  <Text style={styles.label}>Son 2 Age</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter age"
                    value={formData.sonAge2}
                    keyboardType="numeric"
                    onChangeText={(text) =>
                      setFormData({ ...formData, sonAge2: text })
                    }
                  />
                </View>

                <View style={styles.halfWidth}>
                  <Text style={styles.label}>Daughter 1 Age</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter age"
                    value={formData.daughterAge1}
                    keyboardType="numeric"
                    onChangeText={(text) =>
                      setFormData({ ...formData, daughterAge1: text })
                    }
                  />
                </View>
              </View>

              <View style={styles.row}>
                <View style={styles.halfWidth}>
                  <Text style={styles.label}>Daughter 2 Age</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter age"
                    value={formData.daughterAge2}
                    keyboardType="numeric"
                    onChangeText={(text) =>
                      setFormData({ ...formData, daughterAge2: text })
                    }
                  />
                </View>

                <View style={styles.halfWidth}>
                  <Text style={styles.label}>Father's Age</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter age"
                    value={formData.fatherAge}
                    keyboardType="numeric"
                    onChangeText={(text) =>
                      setFormData({ ...formData, fatherAge: text })
                    }
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Mother's Age</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter age"
                  value={formData.motherAge}
                  keyboardType="numeric"
                  onChangeText={(text) =>
                    setFormData({ ...formData, motherAge: text })
                  }
                />
              </View>
            </View>

            {/* Coverage Information Section */}
            <View style={styles.card}>
              <View style={styles.sectionHeader}>
                <View style={[styles.iconContainer, { backgroundColor: '#fef3c7' }]}>
                  <Shield color="#f59e0b" size={24} />
                </View>
                <Text style={styles.sectionTitle}>Coverage Information</Text>
              </View>

              <View style={styles.subsection}>
                <Text style={styles.subsectionTitle}>Coverage Amount</Text>
                <Text style={styles.coverageAmount}>₹5,00,000</Text>
                <Text style={styles.subsectionDescription}>
                  Choose your family coverage amount
                </Text>

                <View style={styles.optionsContainer}>
                  {familyCoverageOptions.map((option) => (
                    <TouchableOpacity
                      key={option}
                      onPress={() => handleCoverageSelect(option)}
                      style={[
                        styles.coverageButton,
                        formData.coverageAmount === option &&
                          styles.coverageButtonSelected,
                      ]}
                    >
                      <Text
                        style={[
                          styles.coverageText,
                          formData.coverageAmount === option &&
                            styles.coverageTextSelected,
                        ]}
                      >
                        {option}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </View>

            {/* Action Buttons */}
            <View style={styles.actionButtons}>
              <TouchableOpacity
                onPress={handleBack}
                style={styles.backButton}
              >
                <ArrowLeft color="#374151" size={20} />
                <Text style={styles.backButtonText}>Back</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleCalculatePremium}
                style={[styles.primaryButton, { backgroundColor: '#10b981' }]}
              >
                <Text style={styles.primaryButtonText}>Calculate Premium</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // Selection Screen
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />
      <ScrollView style={styles.scrollView}>
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.selectionHeader}>
            <Text style={styles.mainTitle}>
              We are more than just your health insurance provider
            </Text>
            <Text style={styles.mainDescription}>
              We are by your side regardless of your situation. Choose yourself or
              your loved ones with health covers that suit your needs.
            </Text>
          </View>

          {/* Selection Cards */}
          <View style={styles.selectionCards}>
            <TouchableOpacity
              onPress={() => handleSelection('myself')}
              style={styles.selectionCard}
            >
              <View style={[styles.selectionIcon, { backgroundColor: '#3b82f6' }]}>
                <User color="#ffffff" size={48} />
              </View>
              <Text style={styles.selectionCardTitle}>For Myself</Text>
              <Text style={styles.selectionCardSubtitle}>Individual Coverage</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => handleSelection('family')}
              style={styles.selectionCard}
            >
              <View style={[styles.selectionIcon, { backgroundColor: '#10b981' }]}>
                <Users color="#ffffff" size={48} />
              </View>
              <Text style={styles.selectionCardTitle}>For Myself & Family</Text>
              <Text style={styles.selectionCardSubtitle}>Family Coverage</Text>
            </TouchableOpacity>
          </View>

          {/* What's Covered Section */}
          <View style={styles.infoSection}>
            <View style={styles.infoBadge}>
              <Check color="#10b981" size={20} />
              <Text style={styles.infoBadgeText}>What's Covered</Text>
            </View>
            <Text style={styles.infoTitle}>Comprehensive Health Coverage</Text>
            <Text style={styles.infoDescription}>
              Your health insurance covers a wide range of medical expenses and
              treatments
            </Text>

            <View style={styles.infoCards}>
              {whatCoveredData.map((item) => {
                const IconComponent = item.icon;
                return (
                  <View key={item.id} style={styles.infoCard}>
                    <View
                      style={[
                        styles.infoCardIcon,
                        { backgroundColor: item.backgroundColor },
                      ]}
                    >
                      <IconComponent color={item.iconColor} size={28} />
                    </View>
                    <Text style={styles.infoCardTitle}>{item.title}</Text>
                    <Text style={styles.infoCardDescription}>
                      {item.description}
                    </Text>
                  </View>
                );
              })}
            </View>
          </View>

          {/* What's NOT Covered Section */}
          <View style={styles.infoSection}>
            <View style={[styles.infoBadge, { backgroundColor: '#fee2e2' }]}>
              <X color="#dc2626" size={20} />
              <Text style={[styles.infoBadgeText, { color: '#991b1b' }]}>
                What's Not Covered
              </Text>
            </View>
            <Text style={styles.infoTitle}>Important Exclusions</Text>
            <Text style={styles.infoDescription}>
              Understanding what's not covered helps you make informed decisions
            </Text>

            <View style={styles.infoCards}>
              {whatNotCovered.map((item) => {
                const IconComponent = item.icon;
                return (
                  <View
                    key={item.id}
                    style={[styles.infoCard, { borderColor: '#fecaca' }]}
                  >
                    <View
                      style={[
                        styles.infoCardIcon,
                        { backgroundColor: '#fee2e2' },
                      ]}
                    >
                      <IconComponent color="#dc2626" size={28} />
                    </View>
                    <Text style={styles.infoCardTitle}>{item.title}</Text>
                    <Text style={styles.infoCardDescription}>
                      {item.description}
                    </Text>
                  </View>
                );
              })}
            </View>
          </View>

          {/* Why Buy Health Insurance Section */}
          <View style={styles.infoSection}>
            <View style={[styles.infoBadge, { backgroundColor: '#f3e8ff' }]}>
              <Heart color="#9333ea" size={20} />
              <Text style={[styles.infoBadgeText, { color: '#6b21a8' }]}>
                Why Choose Us
              </Text>
            </View>
            <Text style={styles.infoTitle}>Why Buy Health Insurance?</Text>
            <Text style={styles.infoDescription}>
              Protect yourself and your family with comprehensive health coverage
            </Text>

            <View style={styles.infoCards}>
              {WhybuyHealth.map((item) => {
                const IconComponent = item.icon;
                return (
                  <View key={item.id} style={styles.infoCard}>
                    <View
                      style={[
                        styles.infoCardIcon,
                        { backgroundColor: item.backgroundColor },
                      ]}
                    >
                      <IconComponent color={item.iconColor} size={28} />
                    </View>
                    <Text style={styles.infoCardTitle}>{item.title}</Text>
                    <Text style={styles.infoCardDescription}>
                      {item.description}
                    </Text>
                  </View>
                );
              })}
            </View>
          </View>

          {/* Contact CTA */}
          <View style={styles.ctaCard}>
            <Phone color="#ffffff" size={40} />
            <Text style={styles.ctaTitle}>Need Help Choosing?</Text>
            <Text style={styles.ctaDescription}>
              Our experts are here to guide you to the perfect health insurance plan
            </Text>
            <TouchableOpacity style={styles.ctaButton}>
              <Text style={styles.ctaButtonText}>Contact Us Now</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f9fafb',
    paddingTop:'40',
  },
  scrollView: {
    flex: 1,
  },
  container: {
    padding: 16,
  },
  headerCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 24,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    flex: 1,
  },
  stepIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#3b82f6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepNumber: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  stepLabel: {
    color: '#6b7280',
    fontWeight: '500',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    gap: 12,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1f2937',
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    borderWidth: 2,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    color: '#1f2937',
  },
  row: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  halfWidth: {
    flex: 1,
  },
  subsection: {
    marginBottom: 24,
  },
  subsectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 8,
  },
  subsectionDescription: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 16,
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  optionButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 24,
    backgroundColor: '#f3f4f6',
  },
  optionButtonSelected: {
    backgroundColor: '#3b82f6',
  },
  optionText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  optionTextSelected: {
    color: '#ffffff',
  },
  coverageButton: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 12,
    backgroundColor: '#f3f4f6',
  },
  coverageButtonSelected: {
    backgroundColor: '#10b981',
  },
  coverageText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
  coverageTextSelected: {
    color: '#ffffff',
  },
  coverageAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#10b981',
    marginBottom: 8,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
    marginBottom: 24,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#d1d5db',
    backgroundColor: '#ffffff',
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
  primaryButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    backgroundColor: '#3b82f6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
  selectionHeader: {
    alignItems: 'center',
    marginBottom: 32,
    paddingHorizontal: 16,
  },
  mainTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1f2937',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 36,
  },
  mainDescription: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 24,
  },
  selectionCards: {
    gap: 16,
    marginBottom: 40,
  },
  selectionCard: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 32,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  selectionIcon: {
    width: 80,
    height: 80,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  selectionCardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
  },
  selectionCardSubtitle: {
    fontSize: 16,
    color: '#6b7280',
  },
  infoSection: {
    marginBottom: 40,
  },
  infoBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: '#d1fae5',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 24,
    gap: 8,
    marginBottom: 16,
  },
  infoBadgeText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#065f46',
  },
  infoTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#1f2937',
    textAlign: 'center',
    marginBottom: 12,
  },
  infoDescription: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  infoCards: {
    gap: 16,
  },
  infoCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#f3f4f6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  infoCardIcon: {
    width: 56,
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoCardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
  },
  infoCardDescription: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
  },
  ctaCard: {
    backgroundColor: '#3b82f6',
    borderRadius: 24,
    padding: 32,
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 6,
  },
  ctaTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginTop: 16,
    marginBottom: 12,
  },
  ctaDescription: {
    fontSize: 16,
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 24,
    opacity: 0.9,
    lineHeight: 24,
  },
  ctaButton: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 24,
  },
  ctaButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#3b82f6',
  },
});

export default health;