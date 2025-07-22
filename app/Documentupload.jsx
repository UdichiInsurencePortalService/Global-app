import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const Documentupload = () => {
    const router = useRouter();
  const [formdata, setformdata] = useState({
    FullName: "",
    Email: "",
    phonenumber: "",
    VehicleRegistrationNumber: "",
  });

  const [uploadedFiles, setUploadedFiles] = useState({
    aadhaarImages: [], // Changed from aadhaarFront to aadhaarImages array
    accidentImages: [],
    expenditureBills: []
  });

  const [loading, setLoading] = useState(false);

  const handleInputChange = (field, value) => {
    setformdata(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const pickDocument = async (type) => {
    try {
      let result = await DocumentPicker.getDocumentAsync({
        type: ['image/*', 'application/pdf'],
        copyToCacheDirectory: true,
      });

      if (!result.canceled) {
        const file = result.assets[0];
        
        // Check file size (5MB limit for Aadhaar, 10MB for others)
        const maxSize = type.includes('aadhaar') ? 5 * 1024 * 1024 : 10 * 1024 * 1024;
        if (file.size > maxSize) {
          Alert.alert('Error', `File size exceeds ${type.includes('aadhaar') ? '5MB' : '10MB'} limit`);
          return;
        }

        if (type === 'aadhaarImages') {
          if (uploadedFiles.aadhaarImages.length >= 2) {
            Alert.alert('Error', 'Maximum 2 images allowed for Aadhaar (front and back)');
            return;
          }
          setUploadedFiles(prev => ({ 
            ...prev, 
            aadhaarImages: [...prev.aadhaarImages, file] 
          }));
        } else if (type === 'expenditureBills') {
          if (uploadedFiles.expenditureBills.length >= 10) {
            Alert.alert('Error', 'Maximum 10 files allowed for expenditure bills');
            return;
          }
          setUploadedFiles(prev => ({ 
            ...prev, 
            expenditureBills: [...prev.expenditureBills, file] 
          }));
        }
      }
    } catch (err) {
      console.error('Error picking document:', err);
      Alert.alert('Error', 'Failed to pick document');
    }
  };

  const pickImage = async (type) => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        const image = result.assets[0];
        
        if (type === 'aadhaarImages') {
          if (uploadedFiles.aadhaarImages.length >= 2) {
            Alert.alert('Error', 'Maximum 2 images allowed for Aadhaar (front and back)');
            return;
          }
          setUploadedFiles(prev => ({ 
            ...prev, 
            aadhaarImages: [...prev.aadhaarImages, image] 
          }));
        } else if (type === 'accidentImages') {
          if (uploadedFiles.accidentImages.length >= 5) {
            Alert.alert('Error', 'Maximum 5 images allowed for accident photos');
            return;
          }
          setUploadedFiles(prev => ({ 
            ...prev, 
            accidentImages: [...prev.accidentImages, image] 
          }));
        }
      }
    } catch (err) {
      console.error('Error picking image:', err);
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  const removeFile = (type, index = null) => {
    if (type === 'aadhaarImages' && index !== null) {
      setUploadedFiles(prev => ({ 
        ...prev, 
        aadhaarImages: prev.aadhaarImages.filter((_, i) => i !== index) 
      }));
    } else if (type === 'accidentImages' && index !== null) {
      setUploadedFiles(prev => ({ 
        ...prev, 
        accidentImages: prev.accidentImages.filter((_, i) => i !== index) 
      }));
    } else if (type === 'expenditureBills' && index !== null) {
      setUploadedFiles(prev => ({ 
        ...prev, 
        expenditureBills: prev.expenditureBills.filter((_, i) => i !== index) 
      }));
    }
  };

  const validateForm = () => {
    if (!formdata.FullName.trim()) {
      Alert.alert('Error', 'Please enter your full name');
      return false;
    }
    if (!formdata.Email.trim()) {
      Alert.alert('Error', 'Please enter your email address');
      return false;
    }
    if (!formdata.phonenumber.trim()) {
      Alert.alert('Error', 'Please enter your phone number');
      return false;
    }
    if (!formdata.VehicleRegistrationNumber.trim()) {
      Alert.alert('Error', 'Please enter vehicle registration number');
      return false;
    }
    if (uploadedFiles.aadhaarImages.length < 2) {
      Alert.alert('Error', 'Please upload both front and back images of Aadhaar card');
      return false;
    }
    if (uploadedFiles.accidentImages.length === 0) {
      Alert.alert('Error', 'Please upload at least one accident image');
      return false;
    }
    if (uploadedFiles.expenditureBills.length === 0) {
      Alert.alert('Error', 'Please upload at least one expenditure bill');
      return false;
    }
    return true;
  };

  const handleBackToAccidentDetails = () => {
    router.push("../Accident");
  };

  const handleSubmitClaim = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      // Here you would typically upload files to your server
      // and submit the claim data
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      Alert.alert(
        'Success', 
        'Your claim has been submitted successfully! You will receive a confirmation email shortly.',
        [
          {
            text: 'OK',
            onPress: () => {
              // Navigate to success screen or home
              console.log('Claim submitted successfully');
            }
          }
        ]
      );
    } catch (error) {
      console.error('Error submitting claim:', error);
      Alert.alert('Error', 'Failed to submit claim. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const FileUploadCard = ({ title, icon, onPress, files, type, maxFiles, fileType }) => (
    <View className="bg-white rounded-lg p-4 mb-4 shadow-sm border border-gray-200">
      <View className="flex-row items-center mb-3">
        <Text className="text-lg mr-2">{icon}</Text>
        <Text className="text-lg font-semibold text-gray-800">{title}</Text>
      </View>
      
      <TouchableOpacity 
        onPress={onPress}
        className="bg-blue-50 border-2 border-dashed border-blue-300 rounded-lg p-6 items-center justify-center mb-3"
      >
        <Text className="text-4xl text-blue-400 mb-2">+</Text>
        <Text className="text-blue-600 font-medium">Upload {fileType}</Text>
        <Text className="text-gray-500 text-sm mt-1">{fileType} (max {maxFiles} files)</Text>
      </TouchableOpacity>

      {/* Display uploaded files */}
      {files && files.length > 0 && (
        <View className="mt-3">
          <Text className="font-medium text-gray-700 mb-2">Uploaded Files:</Text>
          {files.map((file, index) => (
            <View key={index} className="flex-row justify-between items-center bg-gray-50 p-2 rounded mb-1">
              <Text className="flex-1 text-sm text-gray-600" numberOfLines={1}>
                {file.name || `${type === 'aadhaarImages' ? (index === 0 ? 'Front Side' : 'Back Side') : `File ${index + 1}`}`}
              </Text>
              <TouchableOpacity 
                onPress={() => removeFile(type, index)}
                className="ml-2 bg-red-500 px-2 py-1 rounded"
              >
                <Text className="text-white text-xs">Remove</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}
    </View>
  );

  return (
    <ScrollView className="bg-gray-100 flex-1">
    <SafeAreaView>
      <View className="p-5 pb-[150px]">
        <Text className="text-center text-[25px] font-bold text-gray-800 mb-2">
          📋 Upload Documents & Personal Details
        </Text>
        
        <Text className="text-center text-[16px] text-gray-600 mb-6">
          Please provide your details and upload required documents
        </Text>

        {/* Personal Information Section */}
        <View className="bg-white rounded-lg p-5 mb-6 shadow-sm">
          <View className="flex-row items-center mb-4">
            <Text className="text-lg mr-2">👤</Text>
            <Text className="text-xl font-semibold text-gray-800">Personal Information</Text>
          </View>

          <View className="mb-4">
            <Text className="text-gray-700 font-medium mb-2">Full Name *</Text>
            <TextInput
              placeholder="Enter your full name"
              className="w-full p-3 border border-gray-300 rounded-md bg-gray-50"
              value={formdata.FullName}
              onChangeText={(text) => handleInputChange('FullName', text)}
            />
          </View>

          <View className="mb-4">
            <Text className="text-gray-700 font-medium mb-2">Email Address *</Text>
            <TextInput
              placeholder="Enter your email address"
              className="w-full p-3 border border-gray-300 rounded-md bg-gray-50"
              value={formdata.Email}
              onChangeText={(text) => handleInputChange('Email', text)}
              keyboardType="email-address"
            />
          </View>

          <View className="mb-4">
            <Text className="text-gray-700 font-medium mb-2">Phone Number *</Text>
            <TextInput
              placeholder="Enter 10-digit phone number"
              className="w-full p-3 border border-gray-300 rounded-md bg-gray-50"
              value={formdata.phonenumber}
              onChangeText={(text) => handleInputChange('phonenumber', text)}
              keyboardType="phone-pad"
              maxLength={10}
            />
          </View>

          <View className="mb-4">
            <Text className="text-gray-700 font-medium mb-2">Vehicle Registration Number *</Text>
            <TextInput
              placeholder="Enter vehicle registration number"
              className="w-full p-3 border border-gray-300 rounded-md bg-gray-50"
              value={formdata.VehicleRegistrationNumber}
              onChangeText={(text) => handleInputChange('VehicleRegistrationNumber', text)}
            />
          </View>
        </View>

        {/* Required Documents Section */}
        <View className="bg-orange-50 rounded-lg p-5 mb-6 border-l-4 border-orange-400">
          <View className="flex-row items-center mb-4">
            <Text className="text-lg mr-2">📎</Text>
            <Text className="text-xl font-semibold text-gray-800">Required Documents Upload</Text>
          </View>

          {/* Aadhaar Card Upload */}
          <FileUploadCard
            title="Aadhaar Card"
            icon="🆔"
            onPress={() => {
              Alert.alert(
                'Choose Upload Method',
                'Select how you want to upload Aadhaar images',
                [
                    {
                    text: 'Cancel',
                    style: 'cancel'
                  },
                  {
                    text: 'Take Photo',
                    onPress: () => pickImage('aadhaarImages')
                  },
                  {
                    text: 'Pick from Files',
                    onPress: () => pickDocument('aadhaarImages')
                  },
                  
                ]
              );
            }}
            files={uploadedFiles.aadhaarImages}
            type="aadhaarImages"
            maxFiles="2"
            fileType="Front and Back Side"
          />

          {/* Accident Images */}
          <FileUploadCard
            title="Accident Images"
            icon="📸"
            onPress={() => pickImage('accidentImages')}
            files={uploadedFiles.accidentImages}
            type="accidentImages"
            maxFiles="5"
            fileType="Images"
          />

          {/* Expenditure Bills */}
          <FileUploadCard
            title="Expenditure Bills"
            icon="🧾"
            onPress={() => pickDocument('expenditureBills')}
            files={uploadedFiles.expenditureBills}
            type="expenditureBills"
            maxFiles="10"
            fileType="Bills"
          />
        </View>

        {/* Navigation Buttons */}
        <View className="flex-row justify-between gap-4 mt-6">
          <TouchableOpacity
            onPress={handleBackToAccidentDetails}
            className="flex-1 bg-gray-500 py-4 rounded-lg"
          >
            <Text className="text-white text-center font-semibold text-lg">
              ← Back to Accident Details
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleSubmitClaim}
            disabled={loading}
            className={`flex-1 py-4 rounded-lg ${loading ? 'bg-gray-400' : 'bg-green-600'}`}
          >
            <Text className="text-white text-center font-semibold text-lg">
              {loading ? 'Submitting...' : 'Submit Complete Claim ✓'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ SafeAreaView>
    </ScrollView>
  );
};

export default Documentupload;