import { useNavigation } from '@react-navigation/native';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Animated,
  Dimensions,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

const { width } = Dimensions.get('window');

const Policy = () => {
  const [policyNumber, setPolicyNumber] = useState('');
  const [registrationNumber, setRegistrationNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [policyFound, setPolicyFound] = useState(false);
  const [userDetails, setUserDetails] = useState(null);

  // Animation references
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(-50)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const successAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  const navigation = useNavigation();

  useEffect(() => {
    // Initial entrance animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();

    // Pulse animation for button
    const pulse = () => {
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]).start(() => pulse());
    };
    pulse();
  }, []);

  useEffect(() => {
    if (policyFound) {
      Animated.spring(successAnim, {
        toValue: 1,
        tension: 100,
        friction: 8,
        useNativeDriver: true,
      }).start();
    } else {
      successAnim.setValue(0);
    }
  }, [policyFound]);

  // Address formatter
  const formatAddress = (address) => {
    if (typeof address !== 'string') return [];
    return address.split(',').map(line => line.trim());
  };

  const generateSimplePDF = (policyData) => {
  try {
    const doc = new jsPDF();
    const margin = 20;
    let yPos = margin;
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    const logoWidth = 40;
    const logoHeight = 35;

    // Helper function to format address
    const formatAddress = (address) => {
      if (!address) return ["Address not provided"];
      const lines = address.split('\n').filter(line => line.trim());
      return lines.length > 0 ? lines : ["Address not provided"];
    };

    // Helper function to add section header
    const addSectionHeader = (title, yPosition) => {
      doc.setFillColor(0, 102, 204);
      doc.setTextColor(255, 255, 255);
      doc.setFont(undefined, "bold");
      doc.setFontSize(12);
      doc.rect(margin, yPosition, pageWidth - margin * 2, 8, 'F');
      doc.text(title, pageWidth / 2, yPosition + 6, { align: "center" });
      doc.setFont(undefined, "normal");
      doc.setTextColor(0, 0, 0);
      return yPosition + 15;
    };

    // Helper function to add page footer
    const addPageFooter = (pageNumber, totalPages) => {
      doc.setFontSize(8);
      doc.setFont(undefined, "normal");
      doc.setTextColor(100, 100, 100);
      doc.text("Global Health & Allied Insurance Services", margin, pageHeight - 15);
      doc.text(`Page ${pageNumber} of ${totalPages}`, pageWidth - margin, pageHeight - 15, { align: "right" });
    };

    // PAGE 1 - POLICY CERTIFICATE
    // Header
    yPos += logoHeight + 8;
    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    doc.setFont(undefined, "bold");
    doc.text("Global Health & Allied Insurance Service", margin, yPos);
    yPos += 10;

    doc.setDrawColor(200, 200, 200);
    doc.line(margin, yPos, pageWidth - margin, yPos);
    yPos += 15;

    doc.setFontSize(14);
    doc.text("POLICY CERTIFICATE", margin, yPos);
    yPos += 15;

    // Address Block
    doc.setFontSize(11);
    doc.setFont(undefined, "normal");
    doc.text("To,", margin, yPos);
    yPos += 7;

    const ownerName = policyData?.username?.toUpperCase() || "CUSTOMER NAME";
    doc.setFont(undefined, "bold");
    doc.text(`MR. ${ownerName}`, margin, yPos);
    yPos += 7;

    const addressLines = formatAddress(policyData?.address || "");
    doc.setFont(undefined, "normal");
    addressLines.forEach(line => {
      doc.text(line, margin, yPos);
      yPos += 6;
    });
    yPos += 2;

    doc.text(`Contact Details: ${policyData?.mobile_number || ''}`, margin, yPos);
    yPos += 10;

    doc.text(`Policy number: ${policyData?.policy_number || ''}`, margin, yPos);
    yPos += 7;
    doc.text(`UserId: ${policyData?.userid || ''}`, margin, yPos);
    yPos += 7;
    doc.text(`CRN: ${policyData?.crn || 'ID'}`, margin, yPos);
    yPos += 10;

    doc.setFont(undefined, "bold");
    doc.text("Subject: Risk assumption for Car Secure", margin, yPos);
    yPos += 10;

    doc.text(`Dear MR. ${ownerName},`, margin, yPos);
    yPos += 10;
    doc.setFont(undefined, "normal");

    const lineSpacing = 6;
    const sectionSpacing = 8;

    const blocks = [
      "We welcome you to Global Health & Allied Insurance Service and thank you for choosing us as your preferred service provider.",
      "This is with reference to your above mentioned Policy issued under Car Secure.",
      "Enclosed please find the Policy Schedule outlining the details of your policy...",
      "We request you to carefully go through the same once again...",
      "Please note that the information provided by you will be verified at the time of claim...",
      "As a valued customer, we would like to provide regular updates on your policy..."
    ];

    blocks.forEach(paragraph => {
      const lines = doc.splitTextToSize(paragraph, pageWidth - margin * 2);
      doc.text(lines, margin, yPos);
      yPos += lines.length * lineSpacing + sectionSpacing;
    });

    // Page 1 Footer
    addPageFooter(1, 3);

    // PAGE 2 - POLICY DETAILS
    doc.addPage();
    yPos = margin;

    doc.setFontSize(11);
    doc.setFont(undefined, "bold");
    const center = pageWidth / 2;

    doc.text("Policy / Certificate No:", center - 50, yPos);
    doc.text(`${policyData?.policy_number || ''}`, center + 20, yPos);
    yPos += 15;

    doc.setFont(undefined, "normal");
    doc.text("For any assistance please call 1800 266 4545 or visit www.globalhealth.com", center, yPos, { align: "center" });
    yPos += 15;

    // INSURED DETAILS
    yPos = addSectionHeader("INSURED DETAILS", yPos);

    const insuredDetails = [
      ["Name", policyData?.username || "N/A"],
      ["Policy Issuing Office", policyData?.policyOffice || "Muscat, Oman (Headquarters)"],
      ["Address", policyData?.address || "N/A"],
      ["Period of Insurance", policyData?.period_of_insurance || "1 year from today"],
      ["Phone", policyData?.mobile_number || "N/A"],
      ["Type of Vehicle", policyData?.vehicleType || "Private Vehicle"],
      ["Mobile", policyData?.mobile_number || "N/A"],
      ["Hypothecated to", policyData?.financer || "N/A"],
      ["Email", policyData?.email || "N/A"]
    ];

    if (policyData?.gstin) {
      insuredDetails.push(["GSTIN", policyData.gstin]);
    }

    autoTable(doc, {
      startY: yPos,
      theme: 'grid',
      styles: { 
        fontSize: 10, 
        cellPadding: 4,
        lineColor: [200, 200, 200],
        lineWidth: 0.5
      },
      columnStyles: {
        0: { 
          cellWidth: 60, 
          fontStyle: 'bold',
          fillColor: [245, 245, 245]
        },
        1: { cellWidth: 110 }
      },
      body: insuredDetails,
      margin: { left: margin, right: margin }
    });

    yPos = doc.lastAutoTable.finalY + 10;

    // VEHICLE DETAILS
    yPos = addSectionHeader("VEHICLE DETAILS", yPos);

    const vehicleDetails = [
      ["Owner Name", policyData?.username || 'N/A'],
      ["Mobile Number", policyData?.mobile_number || 'N/A'],
      ["Registration Number", policyData?.registration_number || 'N/A'],
      ["Maker Model", policyData?.maker_model || 'N/A'],
      ["Variant", policyData?.variant || 'N/A'],
      ["Year", policyData?.year || 'N/A'],
      ["Engine No", policyData?.engine_number || 'N/A'],
      ["Chassis No", policyData?.chasis_number || 'N/A'],
      ["Cubic Capacity", policyData?.cubic_capacity || 'N/A'],
      ["Fuel Type", policyData?.fuel_type || 'N/A'],
      ["RTO", policyData?.register_at || 'N/A'],
      ["Financer", policyData?.financer || 'N/A']
    ];

    autoTable(doc, {
      startY: yPos,
      body: vehicleDetails,
      theme: 'grid',
      styles: { 
        fontSize: 10, 
        cellPadding: 4,
        lineColor: [200, 200, 200],
        lineWidth: 0.5
      },
      columnStyles: { 
        0: { 
          fontStyle: 'bold', 
          cellWidth: 60,
          fillColor: [245, 245, 245]
        },
        1: { cellWidth: 110 }
      },
      margin: { left: margin, right: margin }
    });

    yPos = doc.lastAutoTable.finalY + 10;

    // PREMIUM COMPUTATION TABLE
    yPos = addSectionHeader("PREMIUM TABLE", yPos);

    autoTable(doc, {
      startY: yPos,
      head: [[
        "Section I", "", "Section II", "", "Section III", ""
      ]],
      body: [
        ["Basic Own Damage", policyData?.own_damage_premium || "N/A", "Basic TP incl. TPPD", policyData?.third_party_premuin || "N/A", "", ""],
        ["Add Covers", policyData?.add_ons_premuim || "N/A", "Total Liability", policyData?.third_party_premuin || "N/A", "", ""],
        ["No Claim Bonus", policyData?.ncb_discount || "N/A", "", "", "", ""],
        ["No Claim Bonus Percentage %", policyData?.ncbPercentage || "N/A", "", "", "", ""],
        ["Insured Value (IDV)", policyData?.idv || "N/A", "", "", "", ""],
        ["IGST @ 18%", "", "", "", "", policyData?.gst || "N/A"],
        ["Total Premium", "", "", "", "", policyData?.total_premiun || "N/A"]
      ],
      theme: 'grid',
      styles: { 
        fontSize: 9, 
        cellPadding: 3,
        lineColor: [200, 200, 200],
        lineWidth: 0.5
      },
      headStyles: {
        fillColor: [0, 102, 204],
        textColor: [255, 255, 255],
        fontStyle: 'bold'
      },
      margin: { left: margin, right: margin }
    });

    yPos = doc.lastAutoTable.finalY + 10;

    // NOMINEE DETAILS
    yPos = addSectionHeader("NOMINEE DETAILS", yPos);

    autoTable(doc, {
      startY: yPos,
      body: [
        ["Nominee Name", policyData?.nominee_name || "N/A", "Nominee Relationship", policyData?.nominee_relation || "N/A", "Nominee Age", policyData?.nominee_age || "N/A"]
      ],
      theme: 'grid',
      styles: { 
        fontSize: 10, 
        cellPadding: 4,
        lineColor: [200, 200, 200],
        lineWidth: 0.5
      },
      columnStyles: { 
        0: { fontStyle: 'bold', cellWidth: 30, fillColor: [245, 245, 245] },
        1: { cellWidth: 30 },
        2: { fontStyle: 'bold', cellWidth: 40, fillColor: [245, 245, 245] },
        3: { cellWidth: 30 },
        4: { fontStyle: 'bold', cellWidth: 30, fillColor: [245, 245, 245] },
        5: { cellWidth: 20 }
      },
      margin: { left: margin, right: margin }
    });

    yPos = doc.lastAutoTable.finalY + 10;

    // CNG/LPG DECLARATION
    yPos = addSectionHeader("CUSTOMER DECLARATION FOR CNG/LPG KIT", yPos);

    doc.setTextColor(0, 0, 0);
    doc.setFont(undefined, "normal");
    doc.setFontSize(11);
    
    const declarationText = "I/We agree and undertake to immediately inform the Company in case of change on account of addition of CNG/LPG kit and obtain necessary endorsement in the Policy.";
    const declarationLines = doc.splitTextToSize(declarationText, pageWidth - margin * 2);
    doc.text(declarationLines, margin, yPos);
    yPos += declarationLines.length * 5 + 10;

    // DISCLAIMER
    yPos = addSectionHeader("DISCLAIMER", yPos);

    const disclaimerText = "For complete details on terms and conditions governing the coverage and NCB please read the Policy Wordings. This document is to be read with the Policy Wordings (which are also available on the Company website i.e. www.zurichkotak.com). Please refer to the claim form for necessary documents to be submitted for processing the claim.";
    const disclaimerLines = doc.splitTextToSize(disclaimerText, pageWidth - margin * 2);
    doc.text(disclaimerLines, margin, yPos);
    yPos += disclaimerLines.length * 5 + 10;

    // SPECIAL CONDITIONS
    yPos = addSectionHeader("SPECIAL CONDITIONS", yPos);

    const specialConditions = "Previous policy document is required at the time of claim verification. All type of pre-existing damages or cost of repair of such damage will be excluded at the time of claim settlement.";
    const specialConditionsLines = doc.splitTextToSize(specialConditions, pageWidth - margin * 2);
    doc.text(specialConditionsLines, margin, yPos);

    // Page 2 Footer
    addPageFooter(2, 3);

    // PAGE 3 - ADDITIONAL INFORMATION
    doc.addPage();
    yPos = margin;

    // NO CLAIM BONUS SCALE
    yPos = addSectionHeader("NO CLAIM BONUS SCALE", yPos);

    autoTable(doc, {
      startY: yPos,
      head: [["Description", "Discount"]],
      body: [
        ["No claim made or pending during the preceding full year of insurance", "20%"],
        ["No claim made or pending during the preceding 2 consecutive years of insurance", "25%"],
        ["No claim made or pending during the preceding 3 consecutive years of insurance", "35%"],
        ["No claim made or pending during the preceding 4 consecutive years of insurance", "45%"],
        ["No claim made or pending during the preceding 5 consecutive years of insurance", "50%"]
      ],
      theme: 'grid',
      styles: { 
        fontSize: 10, 
        cellPadding: 4,
        lineColor: [200, 200, 200],
        lineWidth: 0.5
      },
      headStyles: {
        fillColor: [0, 102, 204],
        textColor: [255, 255, 255],
        fontStyle: 'bold'
      },
      columnStyles: {
        0: { cellWidth: 140 },
        1: { cellWidth: 40, halign: 'center' }
      },
      margin: { left: margin, right: margin }
    });

    yPos = doc.lastAutoTable.finalY + 10;

    // DETAILS OF DEPRECIATION
    yPos = addSectionHeader("DETAILS OF DEPRECIATION", yPos);

    autoTable(doc, {
      startY: yPos,
      head: [["Description", "Discount"]],
      body: [
        ["Not exceeding 6 Months", "5%"],
        ["Exceeding 6 months but not exceeding 1 year", "15%"],
        ["Exceeding 1 year but not exceeding 2 years", "20%"],
        ["Exceeding 2 years but not exceeding 3 years", "30%"],
        ["Exceeding 3 years but not exceeding 4 years", "40%"],
        ["Exceeding 4 years but not exceeding 5 years", "50%"]
      ],
      theme: 'grid',
      styles: { 
        fontSize: 10, 
        cellPadding: 4,
        lineColor: [200, 200, 200],
        lineWidth: 0.5
      },
      headStyles: {
        fillColor: [0, 102, 204],
        textColor: [255, 255, 255],
        fontStyle: 'bold'
      },
      columnStyles: {
        0: { cellWidth: 140 },
        1: { cellWidth: 40, halign: 'center' }
      },
      margin: { left: margin, right: margin }
    });

    yPos = doc.lastAutoTable.finalY + 10;

    // TAX INVOICE
    yPos = addSectionHeader("TAX INVOICE", yPos);

    const taxInvoiceDetails = [
      ["Policy Number", policyData?.policy_number || 'N/A'],
      ["Owner Name", policyData?.username || 'N/A'],
      ["Mobile Number", policyData?.mobile_number || 'N/A'],
      ["Registration Number", policyData?.registration_number || 'N/A'],
      ["Company Name", "Global Health & Allied Insurance Service"],
      ["PAN Number", policyData?.pan_number || 'N/A'],
      ["Email", policyData?.email || 'N/A'],
      ["Maker Model", policyData?.maker_model || 'N/A'],
      ["Variant", policyData?.variant || 'N/A'],
      ["Year", policyData?.registration_date || 'N/A'],
      ["Engine No", policyData?.engine_number || 'N/A'],
      ["Chassis No", policyData?.chasis_number || 'N/A'],
      ["Cubic Capacity", policyData?.cubic_capacity || 'N/A'],
      ["Fuel Type", policyData?.fuel_type || 'N/A'],
      ["RTO", policyData?.register_at || 'N/A'],
      ["Financer", policyData?.financer || 'N/A'],
      ["IDV", policyData?.idv || 'N/A'],
      ["IGST @ 18%", policyData?.gst || 'N/A'],
      ["Total Invoice", policyData?.total_premiun || 'N/A']
    ];

    autoTable(doc, {
      startY: yPos,
      body: taxInvoiceDetails,
      theme: 'grid',
      styles: { 
        fontSize: 10, 
        cellPadding: 4,
        lineColor: [200, 200, 200],
        lineWidth: 0.5
      },
      columnStyles: { 
        0: { 
          fontStyle: 'bold', 
          cellWidth: 60,
          fillColor: [245, 245, 245]
        },
        1: { cellWidth: 110 }
      },
      margin: { left: margin, right: margin }
    });

    // Page 3 Footer
    addPageFooter(3, 3);

    return doc;

  } catch (error) {
    console.error("Error generating PDF:", error);
    throw error;
  }
};

  // Function to check if policy exists
  const checkPolicyExists = async (policyNum, regNum) => {
    try {
      const response = await fetch(
        `http://192.168.1.6:8080/api/policy?policyNumber=${encodeURIComponent(policyNum)}&registrationNumber=${encodeURIComponent(regNum)}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const text = await response.text();
        console.error("Non-JSON response:", text);
        throw new Error("Server returned non-JSON response");
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error("Error checking policy:", error);
      throw error;
    }
  };

  // Function to fetch complete user data
  const fetchAllUserData = async () => {
    try {
      const response = await fetch(
        `http://192.168.1.6:8080/api/getpaymentuserdata`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const text = await response.text();
        console.error("Non-JSON response:", text);
        throw new Error("Server returned non-JSON response");
      }

      const result = await response.json();
      return result.data || result;
    } catch (error) {
      console.error("Error fetching user data:", error);
      throw error;
    }
  };

  const handlePolicyCheck = async () => {
    if (!policyNumber.trim()) {
      Alert.alert("Error", "Please enter a policy number");
      return;
    }

    if (!registrationNumber.trim()) {
      Alert.alert("Error", "Please enter a registration number");
      return;
    }

    try {
      setLoading(true);
      setPolicyFound(false);
      setUserDetails(null);

      console.log("Checking policy:", policyNumber);

      // First check if policy exists
      const policyCheck = await checkPolicyExists(
        policyNumber.trim(),
        registrationNumber.trim()
      );

      if (!policyCheck.exists || !policyCheck.isValid) {
        Alert.alert("Error", policyCheck.message || "Policy validation failed");
        return;
      }

      // Fetch all user data to find the complete record
      const allUserData = await fetchAllUserData();

      // Find the specific policy in the data
      const userPolicyData = allUserData.find(
        (user) => user.policy_number === policyNumber.trim()
      );

      if (!userPolicyData) {
        Alert.alert("Error", "Complete policy data not found.");
        return;
      }

      // Set policy found and user details
      setPolicyFound(true);
      setUserDetails(userPolicyData);

      const ownerName =
        userPolicyData.username ||
        userPolicyData.owner ||
        userPolicyData.name ||
        "N/A";
      Alert.alert(
        "Success",
        `Policy ${policyNumber} found and verified! Owner: ${ownerName}. You can now download your policy document.`
      );
    } catch (error) {
      console.error("Error checking policy:", error);
      let errorMessage = "An error occurred while checking the policy.";

      if (error.message.includes("Policy not found")) {
        errorMessage = `Policy ${policyNumber} not found. Please check your policy number and try again.`;
      } else if (error.message.includes("Registration number does not match")) {
        errorMessage =
          "Registration number does not match the policy records. Please check and try again.";
      } else if (error.message.includes("Server returned non-JSON response")) {
        errorMessage =
          "Server error. Please try again later or contact support.";
      } else {
        errorMessage = `Error: ${error.message}`;
      }

      Alert.alert("Error", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = async () => {
    if (!userDetails) {
      Alert.alert("Error", "No user data available for PDF generation");
      return;
    }

    try {
      setLoading(true);
      
      console.log('Generating PDF with user details:', userDetails);
      
      // Generate simplified PDF
      const doc = generateSimplePDF(userDetails);
      
      // Convert to base64 string
      const pdfBase64 = doc.output('datauristring');
      
      // For React Native, we need to save to file system
      if (Platform.OS === 'web') {
        // For web platform, use the original download method
        const fileName = `Policy_${policyNumber.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`;
        doc.save(fileName);
        Alert.alert("Success", `Policy document downloaded successfully as ${fileName}!`);
      } else {
        // For mobile platforms, save to file system and share
        const fileName = `Policy_${policyNumber.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`;
        const fileUri = FileSystem.documentDirectory + fileName;
        
        // Remove data URI prefix to get just the base64 data
        const base64Data = pdfBase64.split(',')[1];
        
        await FileSystem.writeAsStringAsync(fileUri, base64Data, {
          encoding: FileSystem.EncodingType.Base64,
        });
        
        // Share the file
        if (await Sharing.isAvailableAsync()) {
          await Sharing.shareAsync(fileUri);
        } else {
          Alert.alert("Success", `Policy document saved to: ${fileUri}`);
        }
      }
      
    } catch (error) {
      console.error("Error generating PDF:", error);
      Alert.alert("Error", `Failed to generate PDF: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setPolicyFound(false);
    setUserDetails(null);
    setPolicyNumber("");
    setRegistrationNumber("");
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1a365d" />
      
      {/* Animated Header */}
      <Animated.View 
        style={[
          styles.header,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }]
          }
        ]}
      >
        <View style={styles.headerContent}>
          <Text style={styles.title}>Policy Verification</Text>
          <Text style={styles.subtitle}>Secure & Fast Verification</Text>
        </View>
        <View style={styles.headerDecoration} />
      </Animated.View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <Animated.View 
          style={[
            styles.formContainer,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }]
            }
          ]}
        >
          {/* Policy Number Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Policy Number</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                value={policyNumber}
                onChangeText={setPolicyNumber}
                placeholder="Enter your policy number"
                placeholderTextColor="#a0a0a0"
                autoCapitalize="none"
                editable={!loading}
              />
              <View style={styles.inputIcon}>
                <Text style={styles.iconText}>📋</Text>
              </View>
            </View>
          </View>

          {/* Registration Number Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Registration Number</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                value={registrationNumber}
                onChangeText={setRegistrationNumber}
                placeholder="Enter registration number"
                placeholderTextColor="#a0a0a0"
                autoCapitalize="characters"
                editable={!loading}
              />
              <View style={styles.inputIcon}>
                <Text style={styles.iconText}>🚗</Text>
              </View>
            </View>
          </View>

          {/* Verify Button */}
          <Animated.View
            style={[
              styles.buttonContainer,
              !policyFound && { transform: [{ scale: pulseAnim }] }
            ]}
          >
            <TouchableOpacity
              style={[
                styles.verifyButton,
                loading && styles.buttonDisabled
              ]}
              onPress={handlePolicyCheck}
              disabled={loading}
              activeOpacity={0.8}
            >
              {loading ? (
                <View style={styles.loadingContent}>
                  <ActivityIndicator color="#ffffff" size="small" />
                  <Text style={styles.buttonText}>Verifying...</Text>
                </View>
              ) : (
                <View style={styles.buttonContent}>
                  <Text style={styles.buttonText}>Verify Policy</Text>
                  <Text style={styles.buttonIcon}>✓</Text>
                </View>
              )}
            </TouchableOpacity>
          </Animated.View>

          {/* Success Container */}
          {policyFound && (
            <Animated.View
              style={[
                styles.successContainer,
                {
                  opacity: successAnim,
                  transform: [
                    { scale: successAnim },
                    { translateY: successAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [20, 0]
                    })}
                  ]
                }
              ]}
            >
              <View style={styles.successHeader}>
                <View style={styles.successIcon}>
                  <Text style={styles.successIconText}>✓</Text>
                </View>
                <Text style={styles.successTitle}>Policy Verified!</Text>
              </View>
              
              {userDetails && (
                <View style={styles.userInfoCard}>
                  <Text style={styles.userInfoTitle}>Policy Details</Text>
                  <View style={styles.userInfoRow}>
                    <Text style={styles.userInfoLabel}>Owner:</Text>
                    <Text style={styles.userInfoValue}>
                      {userDetails.username || userDetails.owner || 'N/A'}
                    </Text>
                  </View>
                  <View style={styles.userInfoRow}>
                    <Text style={styles.userInfoLabel}>Mobile:</Text>
                    <Text style={styles.userInfoValue}>
                      {userDetails.mobile_number || 'N/A'}
                    </Text>
                  </View>
                  <View style={styles.userInfoRow}>
                    <Text style={styles.userInfoLabel}>Policy:</Text>
                    <Text style={styles.userInfoValue}>{policyNumber}</Text>
                  </View>
                </View>
              )}
              
              {/* Download Button */}
              <TouchableOpacity
                style={[
                  styles.downloadButton,
                  loading && styles.buttonDisabled
                ]}
                onPress={handleDownloadPDF}
                disabled={loading}
                activeOpacity={0.8}
              >
                {loading ? (
                  <View style={styles.loadingContent}>
                    <ActivityIndicator color="#ffffff" size="small" />
                    <Text style={styles.buttonText}>Generating PDF...</Text>
                  </View>
                ) : (
                  <View style={styles.buttonContent}>
                    <Text style={styles.buttonText}>Download Policy PDF</Text>
                    <Text style={styles.buttonIcon}>📄</Text>
                  </View>
                )}
              </TouchableOpacity>
              
              {/* Reset Button */}
              <TouchableOpacity
                style={styles.resetButton}
                onPress={resetForm}
                activeOpacity={0.8}
              >
                <Text style={styles.resetButtonText}>Verify Another Policy</Text>
              </TouchableOpacity>
            </Animated.View>
          )}
        </Animated.View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    backgroundColor: '#1a365d',
    paddingTop: 50,
    paddingBottom: 30,
    paddingHorizontal: 20,
    position: 'relative',
    overflow: 'hidden',
  },
  headerContent: {
    alignItems: 'center',
    zIndex: 1,
  },
  headerDecoration: {
    position: 'absolute',
    top: -50,
    right: -50,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(66, 153, 225, 0.1)',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#e2e8f0',
    opacity: 0.9,
  },
  scrollView: {
    flex: 1,
  },
  formContainer: {
    padding: 20,
    paddingTop: 30,
  },
  inputGroup: {
    marginBottom: 25,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2d3748',
    marginBottom: 8,
  },
  inputWrapper: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    borderWidth: 2,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    backgroundColor: '#ffffff',
    color: '#2d3748',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  inputIcon: {
    position: 'absolute',
    right: 15,
    top: '50%',
    transform: [{ translateY: -10 }],
  },
  iconText: {
    fontSize: 20,
  },
  buttonContainer: {
    marginTop: 10,
    marginBottom: 20,
  },
  verifyButton: {
    backgroundColor: '#4299e1',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    shadowColor: '#4299e1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonDisabled: {
    backgroundColor: '#a0aec0',
    shadowOpacity: 0.1,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    marginHorizontal: 8,
  },
  buttonIcon: {
    color: '#ffffff',
    fontSize: 18,
    marginLeft: 8,
  },
  successContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 24,
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  successHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  successIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#48bb78',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  successIconText: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  successTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#48bb78',
  },
  userInfoCard: {
    backgroundColor: '#f7fafc',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  userInfoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2d3748',
    marginBottom: 12,
  },
  userInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  userInfoLabel: {
    fontSize: 14,
    color: '#718096',
    fontWeight: '500',
  },
  userInfoValue: {
    fontSize: 14,
    color: '#2d3748',
    fontWeight: '600',
  },
  downloadButton: {
    backgroundColor: '#48bb78',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    marginBottom: 12,
    shadowColor: '#48bb78',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  resetButton: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderWidth: 2,
    borderColor: '#4299e1',
    alignItems: 'center',
  },
  resetButtonText: {
    color: '#4299e1',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default Policy;