// File: app/razorpay.jsx
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Asset } from 'expo-asset';
import * as FileSystem from 'expo-file-system';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as Sharing from 'expo-sharing';
import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, Text, View } from 'react-native';
import { WebView } from 'react-native-webview';
import logo from '../assets/images/global-main-logo.png';

const Razorpay = () => {
  const { orderData, amount } = useLocalSearchParams();
  const router = useRouter();
  const webViewRef = useRef(null);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [premiumComponents, setPremiumComponents] = useState(null);
  const [vehicleData, setVehicleData] = useState(null);
  const [paymentDetails, setPaymentDetails] = useState(null);
  const [logoBase64, setLogoBase64] = useState(null);

  const razorpayKeyId = 'rzp_live_4GMG4265FQmj65';

  useEffect(() => {
    loadAllData();
    loadLogo();
  }, []);

  const loadLogo = async () => {
    try {
      const asset = Asset.fromModule(logo);
      await asset.downloadAsync();
      const base64 = await FileSystem.readAsStringAsync(asset.localUri, {
        encoding: FileSystem.EncodingType.Base64,
      });
      setLogoBase64(base64);
    } catch (error) {
      console.error('Error loading logo:', error);
    }
  };

  const loadAllData = async () => {
    try {
      const [premiumData, vehicleInfo, savedPaymentDetails] = await Promise.all([
        AsyncStorage.getItem('premiumComponents'),
        AsyncStorage.getItem('vehicleData'),
        AsyncStorage.getItem('paymentDetails')
      ]);

      if (premiumData) setPremiumComponents(JSON.parse(premiumData));
      if (vehicleInfo) setVehicleData(JSON.parse(vehicleInfo));
      if (savedPaymentDetails) setPaymentDetails(JSON.parse(savedPaymentDetails));
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const generatePolicyNumber = async () => {
    try {
      // Get current year and calculate next year
      const currentYear = new Date().getFullYear();
      const nextYear = currentYear + 1;
      const yearPart = `${currentYear}-${nextYear.toString().slice(-2)}`;

      // Get the last policy number from storage
      const lastPolicyData = await AsyncStorage.getItem('lastPolicyNumber');
      let lastNumber = 4102; // Start from 4102, so first policy will be 4103

      if (lastPolicyData) {
        const parsed = JSON.parse(lastPolicyData);
        // Check if it's the same year, if not reset to 4102
        if (parsed.year === yearPart) {
          lastNumber = parsed.number;
        }
      }

      // Increment the number
      const newNumber = lastNumber + 1;
      const policyNumber = `GIC/${yearPart}/01/${newNumber}`;

      // Save the new policy number
      await AsyncStorage.setItem('lastPolicyNumber', JSON.stringify({
        year: yearPart,
        number: newNumber
      }));

      return policyNumber;
    } catch (error) {
      console.error('Error generating policy number:', error);
      // Fallback policy number
      const currentYear = new Date().getFullYear();
      const nextYear = currentYear + 1;
      return `GIC/${currentYear}-${nextYear.toString().slice(-2)}/01/4103`;
    }
  };

  const generatePDF = async (paymentId) => {
    try {
      setIsGeneratingPDF(true);

      if (!vehicleData || !premiumComponents) {
        Alert.alert('Error', 'Missing required data for PDF generation');
        setIsGeneratingPDF(false);
        return;
      }

      const paymentDate = new Date();
      const policyStartDate = new Date(paymentDate);
      const policyEndDate = new Date(paymentDate);
      policyEndDate.setFullYear(policyEndDate.getFullYear() + 1);
      policyEndDate.setDate(policyEndDate.getDate() - 1);

      // Generate policy number
      const policyNumber = await generatePolicyNumber();

      const completePaymentDetails = {
        ...paymentDetails,
        payment_id: paymentId,
        policy_number: policyNumber,
        payment_date: paymentDate.toLocaleDateString('en-IN', {
          day: '2-digit',
          month: 'short',
          year: 'numeric'
        }),
        payment_time: paymentDate.toLocaleTimeString('en-IN', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true
        }),
        policy_start_date: policyStartDate.toLocaleDateString('en-IN', {
          day: '2-digit',
          month: 'short',
          year: 'numeric'
        }),
        policy_end_date: policyEndDate.toLocaleDateString('en-IN', {
          day: '2-digit',
          month: 'short',
          year: 'numeric'
        }),
        amount_paid: amount
      };

      const pdfHTML = createEnhancedPDFHTML(
        vehicleData,
        premiumComponents,
        completePaymentDetails,
        logoBase64
      );

      const pdfGenerationScript = `${pdfHTML} true;`;
      webViewRef.current?.injectJavaScript(pdfGenerationScript);

      setTimeout(() => {
        webViewRef.current?.injectJavaScript(`
          window.ReactNativeWebView.postMessage(JSON.stringify({ 
            status: 'pdf_ready',
            pdfBase64: window.generatedPDFBase64 
          }));
          true;
        `);
      }, 3000);

    } catch (error) {
      console.error('Error generating PDF:', error);
      Alert.alert('PDF Generation Failed', 'Could not generate the payment receipt.');
      setIsGeneratingPDF(false);
    }
  };
const sendPDFEmail = async (fileUri, filename) => {
  try {
    const customerEmail = paymentDetails?.email || vehicleData?.email;
    
    if (!customerEmail) {
      console.log('No email address found, skipping email send');
      return;
    }

    // Read the PDF file as base64
    const pdfBase64 = await FileSystem.readAsStringAsync(fileUri, {
      encoding: FileSystem.EncodingType.Base64,
    });

    // Send as JSON instead of FormData
    const response = await fetch('http://192.168.1.5:8080/api/send-pdf-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: customerEmail,
        pdfBase64: pdfBase64,
        filename: filename,
      }),
    });

    const responseData = await response.json();
    
    if (response.ok) {
      console.log('PDF email sent successfully');
    } else {
      console.error('Failed to send PDF email:', response.status, responseData);
    }
  } catch (error) {
    console.error('Error sending PDF email:', error.message);
  }
};

  const savePDFToDevice = async (base64Data) => {
    try {
      const timestamp = new Date().toISOString().slice(0, 19).replace(/[-:]/g, '');
      const customerName = vehicleData?.ownerName || paymentDetails?.username || 'Customer';
      const filename = `Insurance_Receipt_${customerName.replace(/\s+/g, '_')}_${timestamp}.pdf`;
      const fileUri = `${FileSystem.documentDirectory}${filename}`;

      await FileSystem.writeAsStringAsync(fileUri, base64Data, {
        encoding: FileSystem.EncodingType.Base64,
      });

      // Send PDF via email
      await sendPDFEmail(fileUri, filename);

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(fileUri, {
          mimeType: 'application/pdf',
          dialogTitle: 'Download Insurance Receipt',
          UTI: 'com.adobe.pdf'
        });
      }

      // Redirect to PaymentSuccess page
      router.replace('/SuccessScreen');

    } catch (error) {
      console.error('Error saving PDF:', error);
      Alert.alert('Download Failed', 'Could not download the receipt.');
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const optionsScript = `
    const options = {
      "key": "${razorpayKeyId}",
      "amount": ${amount} * 100,
      "currency": "INR",
      "name": "Global Health & Allied Insurance",
      "description": "Insurance Premium Payment",
      "order_id": "${JSON.parse(orderData).id || JSON.parse(orderData).orderId}",
      "handler": function(response){
        window.ReactNativeWebView.postMessage(JSON.stringify({ 
          status: 'success', 
          paymentId: response.razorpay_payment_id 
        }));
      },
      "modal": {
        "ondismiss": function() {
          window.ReactNativeWebView.postMessage(JSON.stringify({ status: 'dismiss' }));
        }
      },
      "prefill": {
        "name": "${paymentDetails?.username || vehicleData?.ownerName || ''}",
        "email": "${paymentDetails?.email || ''}",
        "contact": "${paymentDetails?.mobile || vehicleData?.mobile || ''}"
      },
      "theme": {
        "color": "#0066CC"
      }
    };
    var rzp = new Razorpay(options);
    rzp.open();
  `;

  const injectedJavaScript = `
    (function() {
      var jspdfScript = document.createElement('script');
      jspdfScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
      jspdfScript.onload = function() {
        var autotableScript = document.createElement('script');
        autotableScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.5.31/jspdf.plugin.autotable.min.js';
        autotableScript.onload = function() {
          var razorpayScript = document.createElement('script');
          razorpayScript.src = 'https://checkout.razorpay.com/v1/checkout.js';
          razorpayScript.onload = function() {
            ${optionsScript}
          };
          document.body.appendChild(razorpayScript);
        };
        document.body.appendChild(autotableScript);
      };
      document.body.appendChild(jspdfScript);
    })();
  `;

  const handleMessage = async (event) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);

      if (data.status === 'success') {
        await generatePDF(data.paymentId);
      } else if (data.status === 'pdf_ready') {
        if (data.pdfBase64) {
          await savePDFToDevice(data.pdfBase64);
        }
      } else if (data.status === 'dismiss') {
        Alert.alert('Payment Cancelled', 'You dismissed the payment window.', [
          { text: 'OK', onPress: () => router.back() }
        ]);
      }
    } catch (error) {
      console.error('Error parsing message from WebView:', error);
      Alert.alert('Error', 'Something went wrong. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      {isGeneratingPDF && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#0066CC" />
          <Text style={styles.loadingText}>Generating Receipt...</Text>
        </View>
      )}
      <WebView
        ref={webViewRef}
        originWhitelist={['*']}
        source={{ html: '<html><body></body></html>' }}
        injectedJavaScript={injectedJavaScript}
        onMessage={handleMessage}
        javaScriptEnabled
        domStorageEnabled
        automaticallyAdjustContentInsets={false}
        startInLoadingState
      />
    </View>
  );
};

const createEnhancedPDFHTML = (vehicleData, premiumComponents, paymentDetails, logoBase64) => {
  const escapeString = (str) => {
    if (!str) return '';
    return String(str).replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/"/g, '\\"').replace(/\n/g, '\\n');
  };

  const vd = vehicleData || {};
  const pc = premiumComponents || {};
  const pd = paymentDetails || {};
  const logoData = logoBase64 ? `data:image/png;base64,${logoBase64}` : '';

  return `
    (function() {
      const { jsPDF } = window.jspdf;
      const doc = new jsPDF();
      const margin = 15;
      let yPos = margin;
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const centerX = pageWidth / 2;

      const primaryColor = [0, 102, 204];
      const lightBg = [245, 248, 252];
      const borderColor = [220, 230, 240];
      const textColor = [40, 40, 40];
      const headerBg = [0, 51, 102];
      const successGreen = [76, 175, 80];

      const formatCurrency = (value) => {
        if (!value) return '₹0';
        return '₹' + parseFloat(value).toLocaleString('en-IN', { 
          minimumFractionDigits: 2, 
          maximumFractionDigits: 2 
        });
      };

      const addCard = (x, y, width, height, fillColor) => {
        doc.setFillColor(...fillColor);
        doc.roundedRect(x, y, width, height, 3, 3, 'F');
        doc.setDrawColor(...borderColor);
        doc.setLineWidth(0.3);
        doc.roundedRect(x, y, width, height, 3, 3, 'S');
      };

      const addTableInCard = (startY, data, cardTitle) => {
        const cardWidth = pageWidth - margin * 2;
        const cardX = margin;
        let currentY = startY;

        // Card title
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(11);
        doc.setTextColor(...primaryColor);
        doc.text(cardTitle, centerX, currentY, { align: 'center' });
        currentY += 8;

        // Calculate card height
        const rowHeight = 7;
        const cardHeight = data.length * rowHeight + 10;

        // Draw card background
        addCard(cardX, currentY, cardWidth, cardHeight, lightBg);
        currentY += 5;

        // Draw table rows
        data.forEach((row, index) => {
          const isEven = index % 2 === 0;
          const rowY = currentY + (index * rowHeight);

          if (!isEven) {
            doc.setFillColor(255, 255, 255);
            doc.rect(cardX + 2, rowY - 1, cardWidth - 4, rowHeight, 'F');
          }

          doc.setFont('helvetica', 'normal');
          doc.setFontSize(9);
          doc.setTextColor(...textColor);
          doc.text(row.label, cardX + 5, rowY + 4);

          doc.setFont('helvetica', 'bold');
          doc.setTextColor(...primaryColor);
          doc.text(String(row.value), cardX + cardWidth - 5, rowY + 4, { align: 'right' });
        });

        return currentY + cardHeight + 8;
      };

      const addFooter = () => {
        const footerY = pageHeight - 25;
        
        doc.setFillColor(...headerBg);
        doc.rect(0, footerY, pageWidth, 25, 'F');
        
        doc.setTextColor(255, 255, 255);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(9);
        doc.text('For any queries, contact us:', centerX, footerY + 8, { align: 'center' });
        
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8);
        doc.text('Email: info@globalhealthandalliedservices.com | Phone: 0806940922', centerX, footerY + 15, { align: 'center' });
      };

      // ==================== PAGE 1 ====================
      
      // Header with logo placeholder
      doc.setFillColor(...headerBg);
      doc.rect(0, 0, pageWidth, 45, 'F');
      
      // Add actual logo if available
      if ('${escapeString(logoData)}') {
        try {
          doc.addImage('${escapeString(logoData)}', 'PNG', centerX - 12, 6, 24, 24);
        } catch (e) {
          // Fallback to placeholder if image fails
          doc.setFillColor(255, 255, 255);
          doc.circle(centerX, 18, 12, 'F');
          doc.setTextColor(...headerBg);
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(10);
          doc.text('LOGO', centerX, 20, { align: 'center' });
        }
      } else {
        // Logo placeholder
        doc.setFillColor(255, 255, 255);
        doc.circle(centerX, 18, 12, 'F');
        doc.setTextColor(...headerBg);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(10);
        doc.text('LOGO', centerX, 20, { align: 'center' });
      }
      
      // Company name
      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(16);
      doc.text('GLOBAL HEALTH & ALLIED', centerX, 33, { align: 'center' });
      doc.setFontSize(12);
      doc.text('INSURANCE SERVICES', centerX, 40, { align: 'center' });
      
      yPos = 55;

      // Payment Success Badge
      doc.setFillColor(...successGreen);
      doc.roundedRect(margin + 20, yPos, pageWidth - margin * 2 - 40, 12, 3, 3, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.text('PAYMENT SUCCESSFUL', centerX, yPos + 8, { align: 'center' });
      
      yPos += 20;

      // Welcome message block
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(...textColor);
      
      const blocks = [
        "We welcome you to Global Health & Allied Insurance Service and thank you for choosing us as your preferred service provider.",
        "This is with reference to your above mentioned Policy issued under Car Secure.",
        "Enclosed please find the Policy Schedule outlining the details of your policy.",
        "We request you to carefully go through the same once again.",
        "Please note that the information provided by you will be verified at the time of claim.",
        "As a valued customer, we would like to provide regular updates on your policy."
      ];

      const welcomeCard = margin + 5;
      const welcomeWidth = pageWidth - margin * 2 - 10;
      let welcomeHeight = 5;

      blocks.forEach(block => {
        const lines = doc.splitTextToSize(block, welcomeWidth - 10);
        welcomeHeight += lines.length * 4.5 + 3;
      });

      addCard(welcomeCard, yPos, welcomeWidth, welcomeHeight, [255, 255, 255]);
      yPos += 5;

      blocks.forEach(block => {
        const lines = doc.splitTextToSize(block, welcomeWidth - 10);
        doc.text(lines, centerX, yPos, { align: 'center', maxWidth: welcomeWidth - 10 });
        yPos += lines.length * 4.5 + 3;
      });

      yPos += 8;

      // Payment Information
      const paymentData = [
        { label: 'Payment ID', value: '${escapeString(pd.payment_id || 'N/A')}' },
        { label: 'Payment Date', value: '${escapeString(pd.payment_date || 'N/A')}' },
        { label: 'Payment Time', value: '${escapeString(pd.payment_time || 'N/A')}' },
        { label: 'Amount Paid', value: formatCurrency('${escapeString(pd.amount_paid || pc.total_premiun || '0')}') },
        { label: 'Payment Method', value: 'Razorpay' }
      ];
      
      yPos = addTableInCard(yPos, paymentData, 'PAYMENT INFORMATION');

      // Policy Period
      const policyData = [
        { label: 'Policy Start Date', value: '${escapeString(pd.policy_start_date || 'N/A')}' },
        { label: 'Policy End Date', value: '${escapeString(pd.policy_end_date || 'N/A')}' },
        { label: 'Period of Insurance', value: '1 Year' },
        { label: 'Policy Type', value: '${escapeString(vd.policyType || 'Comprehensive')}' }
      ];
      
      yPos = addTableInCard(yPos, policyData, 'POLICY PERIOD');

      addFooter();

      // ==================== PAGE 4: TAX INVOICE ====================
      doc.addPage();
      yPos = margin + 10;

      // Tax Invoice Header
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(14);
      doc.setTextColor(...primaryColor);
      doc.text('TAX INVOICE', centerX, yPos, { align: 'center' });
      yPos += 10;

      // Tax Invoice Details
      const taxInvoiceData = [
        { label: 'Policy Number', value: '${escapeString(pd.policy_number || vd.policy_number || 'N/A')}' },
        { label: 'Owner Name', value: '${escapeString(pd.username || vd.ownerName || vd.username || 'N/A')}' },
        { label: 'Mobile Number', value: '${escapeString(pd.mobile || vd.mobile || 'N/A')}' },
        { label: 'Registration Number', value: '${escapeString(vd.registrationNumber || pd.registrationNumber || 'N/A')}' },
        { label: 'Company Name', value: 'Global Health & Allied Insurance Service' },
        { label: 'PAN Number', value: '${escapeString(pd.panNumber || vd.panNumber || 'N/A')}' },
        { label: 'Email', value: '${escapeString(pd.email || vd.email || 'N/A')}' },
        { label: 'Maker Model', value: '${escapeString(vd.makerModel || vd.maker_model || pd.makerModel || 'N/A')}' },
        { label: 'Variant', value: '${escapeString(vd.variant || pd.variant || 'N/A')}' },
        { label: 'Year', value: '${escapeString(vd.registrationDate || vd.year || pd.year || 'N/A')}' },
        { label: 'Engine No', value: '${escapeString(vd.enginenumber || pd.enginenumber || 'N/A')}' },
        { label: 'Chassis No', value: '${escapeString(vd.chasinumber || pd.chasinumber || 'N/A')}' },
        { label: 'Cubic Capacity', value: '${escapeString(vd.engineCapacity || pd.engineCapacity || 'N/A')} CC' },
        { label: 'Fuel Type', value: '${escapeString(vd.fueltype || pd.fueltype || 'N/A')}' },
        { label: 'RTO', value: '${escapeString(vd.registered_at || pd.register_at || 'N/A')}' },
        { label: 'Financer', value: '${escapeString(vd.financer || pd.financer || 'N/A')}' },
        { label: 'IDV', value: formatCurrency('${escapeString(pc.idv || pd.idv || '0')}') },
        { label: 'IGST @ 18%', value: formatCurrency('${escapeString(pc.gst || pd.gst || '0')}') },
        { label: 'Total Invoice', value: formatCurrency('${escapeString(pc.total_premiun || pd.total_premiun || '0')}') }
      ];
      
      yPos = addTableInCard(yPos, taxInvoiceData, 'TAX INVOICE DETAILS');

      // Tax Invoice Total Highlight
      const taxTotalCard = margin;
      const taxTotalWidth = pageWidth - margin * 2;
      doc.setFillColor(...successGreen);
      doc.roundedRect(taxTotalCard, yPos, taxTotalWidth, 15, 3, 3, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.setTextColor(255, 255, 255);
      doc.text('TOTAL INVOICE AMOUNT', taxTotalCard + 10, yPos + 10);
      doc.text(formatCurrency('${escapeString(pc.total_premiun || pd.total_premiun || '0')}'), taxTotalCard + taxTotalWidth - 10, yPos + 10, { align: 'right' });

      addFooter();

      // ==================== PAGE 2 ====================
      doc.addPage();
      yPos = margin + 10;

      // Customer Details
      const customerData = [
        { label: 'Name', value: '${escapeString(pd.username || vd.ownerName || 'N/A')}' },
        { label: 'Mobile Number', value: '${escapeString(pd.mobile || vd.mobile || 'N/A')}' },
        { label: 'Email', value: '${escapeString(pd.email || vd.email || 'N/A')}' },
        { label: 'PAN Number', value: '${escapeString(pd.panNumber || 'N/A')}' },
        { label: 'GSTIN', value: '${escapeString(pd.gst || vd.gst || 'N/A')}' }
      ];
      
      yPos = addTableInCard(yPos, customerData, 'CUSTOMER DETAILS');

      // Policy Details
      const policyDetailsData = [
        { label: 'Registration Number', value: '${escapeString(vd.registrationNumber || pd.registrationNumber || 'N/A')}' },
        { label: 'Policy Number', value: '${escapeString(pd.policy_number || vd.policy_number || 'N/A')}' },
        { label: 'CRN', value: '${escapeString(vd.crn || 'N/A')}' },
        { label: 'User ID', value: '${escapeString(vd.userid || 'N/A')}' }
      ];
      
      yPos = addTableInCard(yPos, policyDetailsData, 'POLICY DETAILS');

      // Vehicle Information
      const vehicleData = [
        { label: 'Registration Number', value: '${escapeString(vd.registrationNumber || pd.registrationNumber || 'N/A')}' },
        { label: 'Maker & Model', value: '${escapeString(vd.makerModel || vd.maker_model || pd.makerModel || 'N/A')}' },
        { label: 'Manufacturing Year', value: '${escapeString(vd.year || vd.manufacturingYear || pd.year || 'N/A')}' },
        { label: 'Registration Date', value: '${escapeString(vd.registrationDate || pd.registrationDate || 'N/A')}' },
        { label: 'Vehicle Type', value: '${escapeString(vd.vehicleType || 'Private Car')}' },
        { label: 'Fuel Type', value: '${escapeString(vd.fueltype || pd.fueltype || 'N/A')}' },
        { label: 'Engine Number', value: '${escapeString(vd.enginenumber || pd.enginenumber || 'N/A')}' },
        { label: 'Chassis Number', value: '${escapeString(vd.chasinumber || pd.chasinumber || 'N/A')}' },
        { label: 'Engine Capacity', value: '${escapeString(vd.engineCapacity || pd.engineCapacity || 'N/A')} CC' },
        { label: 'RTO', value: '${escapeString(vd.registered_at || 'N/A')}' },
        { label: 'Color', value: '${escapeString(vd.color || 'N/A')}' },
        { label: 'Ex-Showroom Price', value: formatCurrency('${escapeString(vd.exShowroom || vd.exShowroomPrice || '0')}') }
      ];
      
      yPos = addTableInCard(yPos, vehicleData, 'VEHICLE INFORMATION');

      addFooter();

      // ==================== PAGE 3 ====================
      doc.addPage();
      yPos = margin + 10;

      // Premium Breakdown
      const premiumData = [
        { label: 'Own Damage Premium', value: formatCurrency('${escapeString(pc.own_damage_premium || pc.ownDamagePremium || '0')}') },
        { label: 'Third Party Premium', value: formatCurrency('${escapeString(pc.third_party_premuin || pc.thirdPartyPremium || '0')}') },
        { label: 'Add-ons Premium', value: formatCurrency('${escapeString(pc.add_ons_premuim || pc.addOnsPremium || '0')}') },
        { label: 'NCB Discount (' + '${escapeString(pc.ncbPercentage || '0')}' + '%)', value: '- ' + formatCurrency('${escapeString(pc.ncb_discount || pc.ncbDiscount || '0')}') },
        { label: 'IDV (Insured Declared Value)', value: formatCurrency('${escapeString(pc.idv || '0')}') },
        { label: 'Net Premium', value: formatCurrency('${escapeString(pc.netPremium || '0')}') },
        { label: 'GST @ 18%', value: formatCurrency('${escapeString(pc.gst || '0')}') }
      ];
      
      yPos = addTableInCard(yPos, premiumData, 'PREMIUM BREAKDOWN');

      // Total Premium highlight
      const totalCard = margin;
      const totalWidth = pageWidth - margin * 2;
      doc.setFillColor(...primaryColor);
      doc.roundedRect(totalCard, yPos, totalWidth, 15, 3, 3, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.setTextColor(255, 255, 255);
      doc.text('TOTAL PREMIUM', totalCard + 10, yPos + 10);
      doc.text(formatCurrency('${escapeString(pc.total_premiun || pc.totalPremium || '0')}'), totalCard + totalWidth - 10, yPos + 10, { align: 'right' });
      
      yPos += 23;

      // Important Notes
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.setTextColor(...primaryColor);
      doc.text('IMPORTANT INFORMATION', centerX, yPos, { align: 'center' });
      yPos += 8;

      const notesCardY = yPos;
      const notes = [
        'This is a computer-generated receipt and does not require a signature.',
        'Please keep this receipt for your records and future reference.',
        'Your policy is active from the start date mentioned above.',
        'Complete policy documents will be sent to your registered email within 24 hours.',
        'For any claims, please contact our 24/7 helpline.',
        'In case of vehicle inspection requirement, our team will contact you within 48 hours.'
      ];

      let notesHeight = 5;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      notes.forEach(note => {
        const lines = doc.splitTextToSize(note, pageWidth - margin * 2 - 15);
        notesHeight += lines.length * 4.5 + 2;
      });

      addCard(margin, notesCardY, pageWidth - margin * 2, notesHeight, [255, 255, 255]);
      yPos = notesCardY + 5;

      doc.setTextColor(...textColor);
      notes.forEach(note => {
        const lines = doc.splitTextToSize(note, pageWidth - margin * 2 - 15);
        doc.text(lines, margin + 7, yPos);
        yPos += lines.length * 4.5 + 2;
      });

      addFooter();

      // Generate PDF
      const pdfOutput = doc.output('datauristring');
      const base64 = pdfOutput.split(',')[1];
      window.generatedPDFBase64 = base64;
    })();
  `;
};

const styles = StyleSheet.create({
  container: { 
    flex: 1,
    backgroundColor: '#ffffff'
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000
  },
  loadingText: {
    marginTop: 15,
    fontSize: 16,
    color: '#0066CC',
    fontWeight: '600'
  }
});

export default Razorpay;