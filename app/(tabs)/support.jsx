import { ChevronDown } from 'lucide-react-native';
import { useState } from 'react';
import { Alert, Linking, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const contactInfo = [
  {
    id: 1,
    type: 'WhatsApp',
    text: 'Connect with our self-serve chat bot support',
    value: '8069640455',
    icon: <FontAwesome name="whatsapp" size={24} color="#25D366" />,
    action: () => Linking.openURL(`whatsapp://send?phone=8069640455`),
  },
  {
    id: 2,
    type: 'Email',
    text: 'Write to us at',
    value: 'globalhealth235@gmail.com',
    icon: <FontAwesome name="envelope" size={24} color="#EA4335" />,
    action: () => Linking.openURL(`mailto:globalhealth235@gmail.com`),
  },
  {
    id: 3,
    type: 'Phone',
    text: 'Call us on',
    value: '8069640455',
    icon: <FontAwesome name="phone" size={24} color="#1E88E5" />,
    action: () => Linking.openURL(`tel:+918069640455`),
  },
];

const insuranceTypes = [
  { value: 'car', label: 'Car Insurance' },
  { value: 'bike', label: 'Bike Insurance' },
  { value: 'health', label: 'Health Insurance' },
  { value: 'auto', label: 'Auto Insurance' },
];

const timeSlots = [
  { value: 'morning', label: '9:00 AM - 12:00 PM' },
  { value: 'afternoon', label: '12:00 PM - 4:00 PM' },
  { value: 'evening', label: '4:00 PM - 8:00 PM' },
  { value: 'anytime', label: 'Anytime' },
];

const Support = () => {
  const [formData, setFormData] = useState({
    insuranceType: '',
    username: '',
    mobile: '',
    email: '',
    address: '',
    preferredTime: '',
  });

  const [showInsuranceDropdown, setShowInsuranceDropdown] = useState(false);
  const [showTimeDropdown, setShowTimeDropdown] = useState(false);
  const [activeTab, setActiveTab] = useState('callback');

  const handleContactPress = (item) => {
    try {
      item.action();
    } catch (error) {
      Alert.alert('Error', `Cannot open ${item.type}`);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = () => {
    const { insuranceType, username, mobile, email, address } = formData;
    if (!insuranceType || !username || !mobile || !email || !address) {
      Alert.alert('Validation Error', 'Please fill in all required fields');
      return;
    }
    Alert.alert('Success', 'Callback request submitted successfully!');
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Tab Buttons */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'callback' && styles.activeTab]}
          onPress={() => setActiveTab('callback')}
        >
          <Text style={[styles.tabText, activeTab === 'callback' && styles.activeTabText]}>
            Request a Callback
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'contact' && styles.activeTab]}
          onPress={() => setActiveTab('contact')}
        >
          <Text style={[styles.tabText, activeTab === 'contact' && styles.activeTabText]}>
            Service Request
          </Text>
        </TouchableOpacity>
      </View>

      {activeTab === 'callback' ? (
        <ScrollView 
          showsVerticalScrollIndicator={false} 
          keyboardShouldPersistTaps="handled"
          style={styles.scrollView}
        >
          {/* Username */}
          <Text style={styles.label}>* Username</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your full name"
            value={formData.username}
            onChangeText={text => handleInputChange('username', text)}
          />

          {/* Insurance Type Dropdown */}
          <Text style={styles.label}>* Insurance Type</Text>
          <TouchableOpacity
            onPress={() => {
              setShowInsuranceDropdown(!showInsuranceDropdown);
              setShowTimeDropdown(false);
            }}
            style={styles.dropdown}
          >
            <Text style={[styles.dropdownText, !formData.insuranceType && styles.placeholderText]}> 
              {formData.insuranceType
                ? insuranceTypes.find(type => type.value === formData.insuranceType)?.label
                : 'Select insurance type'}
            </Text>
            <ChevronDown size={18} color="#666" />
          </TouchableOpacity>
          {showInsuranceDropdown && (
            <View style={styles.dropdownList}>
              {insuranceTypes.map(type => (
                <TouchableOpacity
                  key={type.value}
                  onPress={() => {
                    handleInputChange('insuranceType', type.value);
                    setShowInsuranceDropdown(false);
                  }}
                  style={[
                    styles.dropdownItem,
                    formData.insuranceType === type.value && styles.selectedItem
                  ]}
                >
                  <Text style={styles.dropdownItemText}>{type.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {/* Mobile */}
          <Text style={styles.label}>* Mobile Number</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your mobile number"
            keyboardType="numeric"
            maxLength={10}
            value={formData.mobile}
            onChangeText={text => handleInputChange('mobile', text)}
          />

          {/* Email */}
          <Text style={styles.label}>* Email</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your email"
            keyboardType="email-address"
            value={formData.email}
            onChangeText={text => handleInputChange('email', text)}
          />

          {/* Address */}
          <Text style={styles.label}>* Address</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Enter your complete address"
            multiline
            numberOfLines={3}
            value={formData.address}
            onChangeText={text => handleInputChange('address', text)}
          />

          {/* Preferred Time Dropdown */}
          <Text style={styles.label}>Preferred Call Time (Optional)</Text>
          <TouchableOpacity
            onPress={() => {
              setShowTimeDropdown(!showTimeDropdown);
              setShowInsuranceDropdown(false);
            }}
            style={styles.dropdown}
          >
            <Text style={[styles.dropdownText, !formData.preferredTime && styles.placeholderText]}> 
              {formData.preferredTime
                ? timeSlots.find(slot => slot.value === formData.preferredTime)?.label
                : 'Select preferred time'}
            </Text>
            <ChevronDown size={18} color="#666" />
          </TouchableOpacity>
          {showTimeDropdown && (
            <View style={styles.dropdownList}>
              {timeSlots.map(slot => (
                <TouchableOpacity
                  key={slot.value}
                  onPress={() => {
                    handleInputChange('preferredTime', slot.value);
                    setShowTimeDropdown(false);
                  }}
                  style={[
                    styles.dropdownItem,
                    formData.preferredTime === slot.value && styles.selectedItem
                  ]}
                >
                  <Text style={styles.dropdownItemText}>{slot.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {/* Submit Button */}
          <TouchableOpacity
            onPress={handleSubmit}
            style={styles.submitButton}
          >
            <Text style={styles.submitButtonText}>Request Callback</Text>
          </TouchableOpacity>
        </ScrollView>
      ) : (
        <View style={styles.contactSection}>
          <Text style={styles.sectionTitle}>Need Help?</Text>
          <Text style={styles.contactDescription}>
            Get in touch with our support team for assistance
          </Text>

          <View style={styles.contactContainer}>
            {contactInfo.map(item => (
              <TouchableOpacity
                key={item.id}
                style={styles.contactCard}
                onPress={() => handleContactPress(item)}
                activeOpacity={0.7}
              >
                <View style={styles.contactIconContainer}>{item.icon}</View>
                <View style={styles.contactContent}>
                  <Text style={styles.contactType}>{item.type}</Text>
                  <Text style={styles.contactText}>{item.text}</Text>
                  <Text style={styles.contactValue}>{item.value}</Text>
                </View>
                <FontAwesome name="chevron-right" size={16} color="#999" />
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingHorizontal: 24,
    paddingVertical: 32,
  },
  tabContainer: {
    flexDirection: 'row',
    marginBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
  },
    activeTab: {
    // borderBottomWidth: 2,
    // borderBottomColor: '#2563EB',
    backgroundColor:"#007aff",
    borderRadius:40,

  },
  tabText: {
    textAlign: 'center',
    fontWeight: '500',
    color: '#6B7280',
  },
  activeTabText: {
    color: 'white',
  },
  scrollView: {
    flex: 1,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 6,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 16,
    fontSize: 14,
    backgroundColor: 'white',
  },
  textArea: {
    height: 72,
    textAlignVertical: 'top',
  },
  dropdown: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 6,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 8,
    backgroundColor: 'white',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dropdownText: {
    fontSize: 14,
    color: '#1F2937',
  },
  placeholderText: {
    color: '#9CA3AF',
  },
  dropdownList: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 6,
    marginBottom: 16,
    backgroundColor: 'white',
    overflow: 'hidden',
  },
  dropdownItem: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  selectedItem: {
    backgroundColor: '#EFF6FF',
  },
  dropdownItemText: {
    color: '#1F2937',
    fontSize: 14,
  },
  submitButton: {
    backgroundColor: '#2563EB',
    borderRadius: 6,
    paddingVertical: 16,
    marginBottom: 24,
  },
  submitButtonText: {
    textAlign: 'center',
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
  },
  contactSection: {
    flex: 1,
    paddingTop: 16,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  contactDescription: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 24,
  },
  contactContainer: {
    flex: 1,
  },
  contactCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  contactIconContainer: {
    marginRight: 16,
  },
  contactContent: {
    flex: 1,
  },
  contactType: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  contactText: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 2,
  },
  contactValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#2563EB',
  },
});

export default Support;