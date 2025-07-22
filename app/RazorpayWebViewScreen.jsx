import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { WebView } from 'react-native-webview';


const RazorpayWebViewScreen = () => {
  const { orderData, formData, amount } = useLocalSearchParams();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Parse the JSON strings
  const parsedOrderData = JSON.parse(orderData);
  const parsedFormData = JSON.parse(formData);

  useEffect(() => {
    setIsLoading(true);
  }, []);

  // Helper function to sanitize filename
  const sanitizeFilename = (filename) => {
    return filename
      .replace(/[/\\:*?"<>|]/g, '_')
      .replace(/\s+/g, '_')
      .replace(/_+/g, '_')
      .replace(/^_|_$/g, '')
      .substring(0, 100);
  };

// 
  const [premiumComponents, setPremiumComponents] = useState(null);
  const [vehicleData, setVehicleData] = useState(null);
  const [paymentDetails, setPaymentDetails] = useState(null);

  useEffect(() => {
    getStoredInsuranceData();
  }, []);

  const getStoredInsuranceData = async () => {
    try {
      const premiumData = await AsyncStorage.getItem('premiumComponents');
      const vehicleInfo = await AsyncStorage.getItem('vehicleData');
      const savedPaymentDetails = await AsyncStorage.getItem('paymentDetails');

      if (premiumData) {
        setPremiumComponents(JSON.parse(premiumData));
      }

      if (vehicleInfo) {
        setVehicleData(JSON.parse(vehicleInfo));
      }

      if (savedPaymentDetails) {
        setPaymentDetails(JSON.parse(savedPaymentDetails));
      }

      console.log("Loaded Premium:>>>>>>>><<<<<", premiumData);
      console.log("Loaded Vehicle:>>>>><<<<<", vehicleInfo);
      console.log("Loaded Payment:>>>><<<<", savedPaymentDetails);
    } catch (error) {
      console.error('Error retrieving insurance data:', error);
    }
  };


  // Generate PDF with only username
 // Address formatter
  const formatAddress = (address) => {
    if (typeof address !== 'string') return [];
    return address.split(',').map(line => line.trim());
  };
const generatePaymentReceiptPDF = async (username, premiumComponents, vehicleData, paymentDetails) => {
  try {
    console.log("Vehicle details inside generatePDF:", vehicleData, "User info:", paymentDetails, "Premium components:", premiumComponents);

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

    const ownerName = vehicleData?.username?.toUpperCase() || username?.toUpperCase() || "CUSTOMER NAME";
    doc.setFont(undefined, "bold");
    doc.text(`MR. ${ownerName}`, margin, yPos);
    yPos += 7;

    const addressLines = formatAddress(vehicleData?.address || "");
    doc.setFont(undefined, "normal");
    addressLines.forEach(line => {
      doc.text(line, margin, yPos);
      yPos += 6;
    });
    yPos += 2;

    doc.text(`Contact Details: ${vehicleData?.mobile_number || ''}`, margin, yPos);
    yPos += 10;

    doc.text(`Policy number: ${vehicleData?.policy_number || ''}`, margin, yPos);
    yPos += 7;
    doc.text(`UserId: ${vehicleData?.userid || ''}`, margin, yPos);
    yPos += 7;
    doc.text(`CRN: ${vehicleData?.crn || 'ID'}`, margin, yPos);
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
    doc.text(`${vehicleData?.policy_number || ''}`, center + 20, yPos);
    yPos += 15;

    doc.setFont(undefined, "normal");
    doc.text("For any assistance please call 1800 266 4545 or visit www.globalhealth.com", center, yPos, { align: "center" });
    yPos += 15;

    // INSURED DETAILS
    yPos = addSectionHeader("INSURED DETAILS", yPos);

    const insuredDetails = [
      ["Name", vehicleData?.username || username || "N/A"],
      ["Policy Issuing Office", vehicleData?.policyOffice || "Muscat, Oman (Headquarters)"],
      ["Address", vehicleData?.address || "N/A"],
      ["Period of Insurance", vehicleData?.period_of_insurance || "1 year from today"],
      ["Phone", vehicleData?.mobile_number || "N/A"],
      ["Type of Vehicle", vehicleData?.vehicleType || "Private Vehicle"],
      ["Mobile", vehicleData?.mobile_number || "N/A"],
      ["Hypothecated to", vehicleData?.financer || "N/A"],
      ["Email", vehicleData?.email || "N/A"]
    ];

    if (vehicleData?.gstin) {
      insuredDetails.push(["GSTIN", vehicleData.gstin]);
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
      ["Owner Name", vehicleData?.username || username || 'N/A'],
      ["Mobile Number", vehicleData?.mobile_number || 'N/A'],
      ["Registration Number", vehicleData?.registration_number || 'N/A'],
      ["Maker Model", vehicleData?.maker_model || 'N/A'],
      ["Variant", vehicleData?.variant || 'N/A'],
      ["Year", vehicleData?.year || 'N/A'],
      ["Engine No", vehicleData?.engine_number || 'N/A'],
      ["Chassis No", vehicleData?.chasis_number || 'N/A'],
      ["Cubic Capacity", vehicleData?.cubic_capacity || 'N/A'],
      ["Fuel Type", vehicleData?.fuel_type || 'N/A'],
      ["RTO", vehicleData?.register_at || 'N/A'],
      ["Financer", vehicleData?.financer || 'N/A']
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
        ["Basic Own Damage", premiumComponents?.own_damage_premium || "N/A", "Basic TP incl. TPPD", premiumComponents?.third_party_premuin || "N/A", "", ""],
        ["Add Covers", premiumComponents?.add_ons_premuim || "N/A", "Total Liability", premiumComponents?.third_party_premuin || "N/A", "", ""],
        ["No Claim Bonus", premiumComponents?.ncb_discount || "N/A", "", "", "", ""],
        ["No Claim Bonus Percentage %", premiumComponents?.ncbPercentage || "N/A", "", "", "", ""],
        ["Insured Value (IDV)", premiumComponents?.idv || "N/A", "", "", "", ""],
        ["IGST @ 18%", "", "", "", "", premiumComponents?.gst || "N/A"],
        ["Total Premium", "", "", "", "", premiumComponents?.total_premiun || "N/A"]
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
        ["Nominee Name", paymentDetails?.nominee_name || "N/A", "Nominee Relationship", paymentDetails?.nominee_relation || "N/A", "Nominee Age", paymentDetails?.nominee_age || "N/A"]
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
      ["Policy Number", paymentDetails?.policy_number || vehicleData?.policy_number || 'N/A'],
      ["Owner Name", paymentDetails?.username || vehicleData?.username || username || 'N/A'],
      ["Mobile Number", paymentDetails?.mobile_number || vehicleData?.mobile_number || 'N/A'],
      ["Registration Number", paymentDetails?.registration_number || vehicleData?.registration_number || 'N/A'],
      ["Company Name", "Global Health & Allied Insurance Service"],
      ["PAN Number", paymentDetails?.pan_number || 'N/A'],
      ["Email", paymentDetails?.email || vehicleData?.email || 'N/A'],
      ["Maker Model", paymentDetails?.maker_model || vehicleData?.maker_model || 'N/A'],
      ["Variant", paymentDetails?.variant || vehicleData?.variant || 'N/A'],
      ["Year", paymentDetails?.registration_date || vehicleData?.year || 'N/A'],
      ["Engine No", paymentDetails?.engine_number || vehicleData?.engine_number || 'N/A'],
      ["Chassis No", paymentDetails?.chasis_number || vehicleData?.chasis_number || 'N/A'],
      ["Cubic Capacity", paymentDetails?.cubic_capacity || vehicleData?.cubic_capacity || 'N/A'],
      ["Fuel Type", paymentDetails?.fuel_type || vehicleData?.fuel_type || 'N/A'],
      ["RTO", paymentDetails?.register_at || vehicleData?.register_at || 'N/A'],
      ["Financer", paymentDetails?.financer || vehicleData?.financer || 'N/A'],
      ["IDV", premiumComponents?.idv || paymentDetails?.idv || 'N/A'],
      ["IGST @ 18%", premiumComponents?.gst || paymentDetails?.gst || 'N/A'],
      ["Total Invoice", premiumComponents?.total_premiun || paymentDetails?.total_premiun || 'N/A']
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

    // Generate filename with timestamp
    const timestamp = new Date().toISOString().slice(0, 19).replace(/[-:]/g, '');
    const filename = `Insurance_Receipt_${username || 'Policy'}_${timestamp}.pdf`;
    
    // Save the PDF (this will trigger download)
    doc.save(filename);
    
    console.log(`PDF generated successfully: ${filename}`);
    return doc;

  } catch (error) {
    console.error("Error generating PDF:", error);
    throw error;
  }
};


  // 

  // Generate HTML content for Razorpay checkout
  const generateRazorpayHTML = () => {
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
        <title>Razorpay Payment</title>
        <script src="https://checkout.razorpay.com/v1/checkout.js"></script>
        <style>
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }
            
            body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                min-height: 100vh;
                display: flex;
                justify-content: center;
                align-items: center;
                padding: 20px;
            }
            
            .container {
                background: rgba(255, 255, 255, 0.98);
                backdrop-filter: blur(15px);
                padding: 40px;
                border-radius: 20px;
                box-shadow: 0 25px 50px rgba(0,0,0,0.15);
                text-align: center;
                width: 100%;
                max-width: 400px;
                animation: slideUp 0.8s ease-out;
            }
            
            @keyframes slideUp {
                from {
                    opacity: 0;
                    transform: translateY(50px) scale(0.95);
                }
                to {
                    opacity: 1;
                    transform: translateY(0) scale(1);
                }
            }
            
            .logo {
                font-size: 28px;
                font-weight: bold;
                color: #4a90e2;
                margin-bottom: 10px;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 10px;
            }
            
            .subtitle {
                color: #666;
                font-size: 16px;
                margin-bottom: 30px;
            }
            
            .user-info {
                background: #f8f9fa;
                padding: 20px;
                border-radius: 12px;
                margin-bottom: 20px;
                border: 2px solid #e9ecef;
            }
            
            .user-label {
                font-size: 14px;
                color: #666;
                margin-bottom: 8px;
            }
            
            .user-name {
                font-size: 20px;
                font-weight: bold;
                color: #333;
            }
            
            .amount-section {
                margin: 25px 0;
                padding: 25px;
                background: linear-gradient(135deg, #4a90e2, #357abd);
                border-radius: 15px;
                color: white;
            }
            
            .amount-label {
                font-size: 16px;
                margin-bottom: 10px;
                opacity: 0.9;
            }
            
            .amount {
                font-size: 36px;
                font-weight: bold;
                margin: 0;
            }
            
            .pay-button {
                background: linear-gradient(135deg, #28a745, #20c997);
                color: white;
                border: none;
                padding: 18px 30px;
                font-size: 16px;
                font-weight: bold;
                border-radius: 50px;
                cursor: pointer;
                width: 100%;
                margin-top: 20px;
                transition: all 0.3s ease;
                box-shadow: 0 6px 20px rgba(40, 167, 69, 0.4);
            }
            
            .pay-button:hover {
                transform: translateY(-2px);
                box-shadow: 0 8px 25px rgba(40, 167, 69, 0.5);
            }
            
            .pay-button:disabled {
                opacity: 0.7;
                cursor: not-allowed;
                transform: none;
            }
            
            .loading {
                display: flex;
                justify-content: center;
                align-items: center;
                height: 80px;
                flex-direction: column;
                gap: 10px;
            }
            
            .spinner {
                width: 30px;
                height: 30px;
                border: 3px solid #f3f3f3;
                border-top: 3px solid #4a90e2;
                border-radius: 50%;
                animation: spin 1s linear infinite;
            }
            
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
            
            .loading-text {
                color: #666;
                font-size: 14px;
            }
            
            .secure-badge {
                margin-top: 20px;
                color: #888;
                font-size: 12px;
                padding: 10px;
                background: rgba(74, 144, 226, 0.1);
                border-radius: 8px;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="logo">
                🛡️ Global Health Insurance
            </div>
            <div class="subtitle">Secure Payment Gateway</div>
            
            <div class="user-info">
                <div class="user-label">Customer Name</div>
                <div class="user-name">${parsedFormData.username}</div>
            </div>
            
            <div class="amount-section">
                <div class="amount-label">Amount to Pay</div>
                <div class="amount">₹${Number(amount).toLocaleString()}</div>
            </div>
            
            <button class="pay-button" onclick="startPayment()" id="payButton">
                🔒 Pay Now with Razorpay
            </button>
            
            <div class="secure-badge">
                🔐 256-bit SSL Encrypted • Secure Payment
            </div>
            
            <div id="loading" class="loading" style="display: none;">
                <div class="spinner"></div>
                <div class="loading-text">Processing payment...</div>
            </div>
        </div>

        <script>
            function startPayment() {
                const payButton = document.getElementById('payButton');
                const loading = document.getElementById('loading');
                
                payButton.disabled = true;
                payButton.innerHTML = '🔄 Processing...';
                loading.style.display = 'flex';
                
                const options = {
                    key: 'rzp_live_4GMG4265FQmj65',
                    amount: ${parsedOrderData.amount},
                    currency: '${parsedOrderData.currency || 'INR'}',
                    name: 'Global Health Insurance',
                    description: 'Payment for ${parsedFormData.username}',
                    order_id: '${parsedOrderData.id || parsedOrderData.orderId}',
                    prefill: {
                        name: '${parsedFormData.username}',
                        email: '${parsedFormData.email || ''}',
                        contact: '${parsedFormData.mobile || ''}'
                    },
                    theme: {
                        color: '#4a90e2'
                    },
                    modal: {
                        backdrop_close: false,
                        escape: false,
                        handleback: false,
                        confirm_close: true,
                        ondismiss: function() {
                            resetButton();
                        }
                    },
                    handler: function(response) {
                        console.log('Payment Success:', response);
                        
                        // Show success message
                        const container = document.querySelector('.container');
                        container.innerHTML = \`
                            <div style="text-align: center; padding: 30px;">
                                <div style="font-size: 60px; margin-bottom: 20px; animation: bounce 1s ease-in-out;">✅</div>
                                <h2 style="color: #28a745; margin-bottom: 15px; font-size: 24px;">Payment Successful!</h2>
                                <p style="color: #666; margin-bottom: 20px;">Customer: ${parsedFormData.username}</p>
                                <div style="background: #d4edda; padding: 20px; border-radius: 12px; border: 1px solid #c3e6cb;">
                                    <strong style="color: #155724; font-size: 18px;">Amount Paid: ₹${Number(amount).toLocaleString()}</strong>
                                </div>
                            </div>
                        \`;
                        
                        // Add bounce animation
                        const style = document.createElement('style');
                        style.textContent = \`
                            @keyframes bounce {
                                0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
                                40% { transform: translateY(-10px); }
                                60% { transform: translateY(-5px); }
                            }
                        \`;
                        document.head.appendChild(style);
                        
                        // Send success to React Native
                        setTimeout(() => {
                            window.ReactNativeWebView.postMessage(JSON.stringify({
                                success: true,
                                paymentId: response.razorpay_payment_id,
                                orderId: response.razorpay_order_id,
                                signature: response.razorpay_signature,
                                username: '${parsedFormData.username}'
                            }));
                        }, 2000);
                    }
                };

                try {
                    const razorpayInstance = new Razorpay(options);
                    
                    razorpayInstance.on('payment.failed', function(response) {
                        console.log('Payment Failed:', response);
                        resetButton();
                        
                        window.ReactNativeWebView.postMessage(JSON.stringify({
                            success: false,
                            error: response.error.description || 'Payment failed'
                        }));
                    });
                    
                    razorpayInstance.on('payment.cancel', function() {
                        console.log('Payment Cancelled');
                        resetButton();
                        
                        window.ReactNativeWebView.postMessage(JSON.stringify({
                            success: false,
                            error: 'Payment cancelled by user',
                            cancelled: true
                        }));
                    });
                    
                    setTimeout(() => {
                        loading.style.display = 'none';
                        razorpayInstance.open();
                    }, 1000);
                    
                } catch (error) {
                    console.error('Error opening Razorpay:', error);
                    resetButton();
                    
                    window.ReactNativeWebView.postMessage(JSON.stringify({
                        success: false,
                        error: 'Failed to initialize payment gateway'
                    }));
                }
            }

            function resetButton() {
                const payButton = document.getElementById('payButton');
                const loading = document.getElementById('loading');
                
                payButton.disabled = false;
                payButton.innerHTML = '🔒 Pay Now with Razorpay';
                loading.style.display = 'none';
            }
        </script>
    </body>
    </html>
    `;
  };

 const handleMessage = (event) => {
  try {
    const data = JSON.parse(event.nativeEvent.data);
    console.log('Received message from WebView:', data);
    
    if (data.success) {
      // Show success alert with PDF download option
      Alert.alert(
        '🎉 Payment Successful!',
        `Payment completed for ${data.username}\nAmount: ₹${Number(amount).toLocaleString()}\nPayment ID: ${data.paymentId}`,
        [
          {
            text: 'Download Receipt',
            onPress: async () => {
              try {
                // Generate and download PDF when user chooses to
                await generatePaymentReceiptPDF(
                  data.username,
                  premiumComponents,
                  vehicleData,
                  paymentDetails
                );
                
                // Show download success message
                Alert.alert(
                  'Receipt Downloaded',
                  'Your payment receipt has been downloaded successfully.',
                  [
                    {
                      text: 'OK',
                      onPress: () => router.push('../SuccessScreen')
                    }
                  ]
                );
              } catch (error) {
                console.error('PDF generation error:', error);
                Alert.alert(
                  'Download Error',
                  'Failed to generate receipt. You can download it later from your policy details.',
                  [
                    {
                      text: 'OK',
                      onPress: () => router.push('../SuccessScreen')
                    }
                  ]
                );
              }
            }
          },
          {
            text: 'Continue',
            onPress: () => {
              router.push('../SuccessScreen');
            },
            style: 'default'
          }
        ],
        { cancelable: false }
      );
    } else {
      const errorTitle = data.cancelled ? '⚠️ Payment Cancelled' : '❌ Payment Failed';
      const errorMessage = data.cancelled 
        ? 'Payment was cancelled. You can try again anytime.'
        : (data.error || 'Payment was not completed. Please try again.');
      
      Alert.alert(
        errorTitle,
        errorMessage,
        [
          {
            text: 'Try Again',
            onPress: () => {
              setError(null);
              setIsLoading(true);
            }
          },
          {
            text: 'Cancel',
            onPress: () => router.back(),
            style: 'cancel'
          }
        ]
      );
    }
  } catch (error) {
    console.error('Error parsing message:', error);
    Alert.alert('Error', 'Something went wrong. Please try again.');
  }
};
  const handleError = (syntheticEvent) => {
    const { nativeEvent } = syntheticEvent;
    console.error('WebView error:', nativeEvent);
    setError('Failed to load payment page');
    setIsLoading(false);
  };

  const handleLoadEnd = () => {
    setIsLoading(false);
  };

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#dc3545" />
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={60} color="#dc3545" />
          <Text style={styles.errorTitle}>Something went wrong</Text>
          <Text style={styles.errorMessage}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={() => {
            setError(null);
            setIsLoading(true);
          }}>
            <Text style={styles.retryButtonText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#4a90e2" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Payment</Text>
        <View style={styles.headerRight} />
      </View>

      {/* Loading Overlay */}
      {isLoading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#4a90e2" />
          <Text style={styles.loadingText}>Loading payment gateway...</Text>
        </View>
      )}

      {/* WebView */}
      <WebView
        source={{ html: generateRazorpayHTML() }}
        style={styles.webview}
        onMessage={handleMessage}
        onError={handleError}
        onLoadEnd={handleLoadEnd}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        startInLoadingState={true}
        scalesPageToFit={true}
        mixedContentMode="compatibility"
        allowsInlineMediaPlayback={true}
        mediaPlaybackRequiresUserAction={false}
        renderLoading={() => (
          <View style={styles.webviewLoading}>
            <ActivityIndicator size="large" color="#4a90e2" />
          </View>
        )}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#4a90e2',
    paddingHorizontal: 16,
    paddingVertical: 12,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  headerRight: {
    width: 40,
  },
  webview: {
    flex: 1,
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
    zIndex: 1000,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  webviewLoading: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#dc3545',
    marginTop: 20,
    marginBottom: 10,
  },
  errorMessage: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
  },
  retryButton: {
    backgroundColor: '#4a90e2',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 25,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default RazorpayWebViewScreen;