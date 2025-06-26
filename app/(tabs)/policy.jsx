import { FontAwesome } from '@expo/vector-icons';
import { useState } from 'react';
import {
  Alert,
  Linking,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const Policy = () => {
  const [policyNumber, setPolicyNumber] = useState('');
  const [email, setEmail] = useState('');

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

  const handleSubmit = () => {
    if (!policyNumber.trim() || !email.trim()) {
      Alert.alert('Validation Error', 'Please fill in all the fields');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Validation Error', 'Please enter a valid email address');
      return;
    }

    Alert.alert(
      'Form Submitted Successfully', 
      `Policy Number: ${policyNumber}\nEmail: ${email}`,
      [{ text: 'OK', onPress: () => {
        setPolicyNumber('');
        setEmail('');
      }}]
    );
  };

  const handleContactPress = (item) => {
    try {
      item.action();
    } catch (error) {
      Alert.alert('Error', `Cannot open ${item.type}`);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="#F8FAFF"
        translucent={false}
      />
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        bounces={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header Section */}
        <View style={styles.header}>
          <FontAwesome name="shield" size={32} color="#007AFF" />
          <Text style={styles.heading}>Policy Management</Text>
          <Text style={styles.subheading}>
            Check your policy details and download documents
          </Text>
        </View>

        {/* Form Section */}
        <View style={styles.formContainer}>
          <Text style={styles.sectionTitle}>Policy Information</Text>
          
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Policy Number</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your policy number"
              value={policyNumber}
              onChangeText={setPolicyNumber}
              autoCapitalize="characters"
              placeholderTextColor="#999"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email Address</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your email address"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              placeholderTextColor="#999"
            />
          </View>

          <TouchableOpacity 
            style={[
              styles.submitButton,
              (!policyNumber.trim() || !email.trim()) && styles.submitButtonDisabled
            ]} 
            onPress={handleSubmit}
            activeOpacity={0.8}
          >
            <FontAwesome name="search" size={16} color="#fff" style={styles.buttonIcon} />
            <Text style={styles.submitButtonText}>Check Policy</Text>
          </TouchableOpacity>
        </View>

        {/* Contact Section */}
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
                <View style={styles.contactIconContainer}>
                  {item.icon}
                </View>
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
      </ScrollView>
    </SafeAreaView>
  );
};

export default Policy;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFF',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  header: {
    alignItems: 'center',
    paddingVertical: 30,
    paddingHorizontal: 20,
  },
  heading: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1A1A1A',
    textAlign: 'center',
    marginTop: 12,
    marginBottom: 8,
  },
  subheading: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
  },
  formContainer: {
    backgroundColor: '#fff',
    padding: 24,
    borderRadius: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 20,
    textAlign:"center"
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    color: '#333',
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E1E5E9',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    backgroundColor: '#FAFBFC',
    color: '#1A1A1A',
  },
  submitButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 8,
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  submitButtonDisabled: {
    backgroundColor: '#B0B0B0',
    shadowOpacity: 0.1,
  },
  buttonIcon: {
    marginRight: 8,
  },
  submitButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  contactSection: {
    backgroundColor: '#fff',
    padding: 24,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  contactDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
    lineHeight: 20,
  },
  contactContainer: {
    gap: 12,
  },
  contactCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#F8FAFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E8F0FE',
  },
  contactIconContainer: {
    width: 48,
    height: 48,
    backgroundColor: '#fff',
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  contactContent: {
    flex: 1,
  },
  contactType: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 2,
  },
  contactText: {
    fontSize: 13,
    color: '#666',
    marginBottom: 2,
  },
  contactValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#007AFF',
  },
});