import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const Accident = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    placeOfAccident: "",
    accidentDate: new Date(),
    timeOfAccident: new Date(),
    weatherCondition: "",
    accidentDescription: "",
    policeComplaintFiled: null,
    policeComplaintDetails: "",
  });

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [dateSelected, setDateSelected] = useState(false);
  const [timeSelected, setTimeSelected] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const weatherOptions = [
    { label: "Select weather condition", value: "" },
    { label: "☀️ Clear", value: "clear" },
    { label: "🌧️ Rainy", value: "rainy" },
    { label: "☁️ Cloudy", value: "cloudy" },
    { label: "🌫️ Foggy", value: "foggy" },
    { label: "🌨️ Snowy", value: "snowy" },
    { label: "⛈️ Stormy", value: "stormy" },
    { label: "💨 Windy", value: "windy" },
  ];

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (event.type === "set" && selectedDate) {
      setFormData((prev) => ({
        ...prev,
        accidentDate: selectedDate,
      }));
      setDateSelected(true);
    }
  };

  const handleTimeChange = (event, selectedTime) => {
    setShowTimePicker(false);
    if (event.type === "set" && selectedTime) {
      setFormData((prev) => ({
        ...prev,
        timeOfAccident: selectedTime,
      }));
      setTimeSelected(true);
    }
  };

  const formatDate = (date) => {
    return date.toLocaleDateString("en-GB");
  };

  const formatTime = (time) => {
    return time.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  // Format date for API (YYYY-MM-DD format)
  const formatDateForAPI = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // Format time for API (ISO format)
  const formatTimeForAPI = (date, time) => {
    const combinedDateTime = new Date(date);
    combinedDateTime.setHours(time.getHours());
    combinedDateTime.setMinutes(time.getMinutes());
    combinedDateTime.setSeconds(0);
    combinedDateTime.setMilliseconds(0);
    return combinedDateTime.toISOString();
  };

  // Capitalize first letter of weather condition
  const capitalizeWeather = (weather) => {
    return weather.charAt(0).toUpperCase() + weather.slice(1);
  };

  const submitToAPI = async (apiData) => {
    try {
      const response = await fetch("http://192.168.1.4:8080/api/accidentform", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(apiData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log("API Response:", result);
      return result;
    } catch (error) {
      console.error("API Error:", error);
      throw error;
    }
  };

  const handleSubmit = async () => {
    // Validate required fields
    if (
      !formData.placeOfAccident ||
      !dateSelected ||
      !timeSelected ||
      !formData.weatherCondition ||
      !formData.accidentDescription ||
      formData.policeComplaintFiled === null
    ) {
      Alert.alert("Error", "Please fill in all required fields");
      return;
    }

    // Validate police complaint details if complaint was filed
    if (
      formData.policeComplaintFiled === true &&
      !formData.policeComplaintDetails
    ) {
      Alert.alert("Error", "Please provide police complaint details");
      return;
    }

    setIsSubmitting(true);

    try {
      // Prepare data for API
      const apiData = {
        accident_place: formData.placeOfAccident,
        accident_date: formatDateForAPI(formData.accidentDate),
        time_accident: formatTimeForAPI(
          formData.accidentDate,
          formData.timeOfAccident
        ),
        weather_condition: capitalizeWeather(formData.weatherCondition),
        describe_accident: formData.accidentDescription,
        police_complaint_filed: formData.policeComplaintFiled ? "yes" : "no",
        police_complaint_details: formData.policeComplaintDetails || "",
      };

      console.log("Submitting data:", apiData);

      // Submit to API
      const result = await submitToAPI(apiData);

      // Success alert
      Alert.alert("Success", "Accident report submitted successfully!", [
        {
          text: "OK",
          onPress: () => {
            // Reset form after successful submission
            setFormData({
              placeOfAccident: "",
              accidentDate: new Date(),
              timeOfAccident: new Date(),
              weatherCondition: "",
              accidentDescription: "",
              policeComplaintFiled: null,
              policeComplaintDetails: "",
            });
            setDateSelected(false);
            setTimeSelected(false);
          },
        },
      ]);
    } catch (error) {
      console.error("Submission error:", error);
      Alert.alert(
        "Error",
        "Failed to submit accident report. Please check your internet connection and try again.",
        [{ text: "OK" }]
      );
    } finally {
      setIsSubmitting(false);
      router.push("../Documentupload");
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.formContainer}>
        <Text style={styles.title}>🚨 Accident Details Report</Text>

        {/* Place of Accident */}
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>📍 Place of Accident *</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter place of accident"
            value={formData.placeOfAccident}
            onChangeText={(text) => handleInputChange("placeOfAccident", text)}
            editable={!isSubmitting}
          />
        </View>

        {/* Accident Date */}
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>📅 Accident Date *</Text>
          <TouchableOpacity
            style={styles.input}
            onPress={() => setShowDatePicker(true)}
            disabled={isSubmitting}
          >
            <Text
              style={[styles.inputText, !dateSelected && styles.placeholder]}
            >
              {dateSelected
                ? formatDate(formData.accidentDate)
                : "Select accident date"}
            </Text>
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={formData.accidentDate}
              mode="date"
              display="default"
              onChange={handleDateChange}
            />
          )}
        </View>

        {/* Time of Accident */}
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>🕐 Time of Accident *</Text>
          <TouchableOpacity
            style={styles.input}
            onPress={() => setShowTimePicker(true)}
            disabled={isSubmitting}
          >
            <Text
              style={[styles.inputText, !timeSelected && styles.placeholder]}
            >
              {timeSelected
                ? formatTime(formData.timeOfAccident)
                : "Select accident time"}
            </Text>
          </TouchableOpacity>
          {showTimePicker && (
            <DateTimePicker
              value={formData.timeOfAccident}
              mode="time"
              display="default"
              onChange={handleTimeChange}
            />
          )}
        </View>

        {/* Weather Condition */}
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>🌤️ Weather Condition *</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={formData.weatherCondition}
              onValueChange={(itemValue) =>
                handleInputChange("weatherCondition", itemValue)
              }
              style={styles.picker}
              enabled={!isSubmitting}
            >
              {weatherOptions.map((option, index) => (
                <Picker.Item
                  key={index}
                  label={option.label}
                  value={option.value}
                />
              ))}
            </Picker>
          </View>
        </View>

        {/* Describe the Accident */}
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>📝 Describe the Accident *</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Provide detailed description of the accident..."
            value={formData.accidentDescription}
            onChangeText={(text) =>
              handleInputChange("accidentDescription", text)
            }
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            editable={!isSubmitting}
          />
        </View>

        {/* Police Complaint Information */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>
            🚔 Police Complaint Information
          </Text>
          <Text style={styles.questionText}>
            Was a police complaint filed? *
          </Text>

          <View style={styles.radioContainer}>
            <TouchableOpacity
              style={[
                styles.radioOption,
                formData.policeComplaintFiled === true && styles.radioSelected,
              ]}
              onPress={() => handleInputChange("policeComplaintFiled", true)}
              disabled={isSubmitting}
            >
              <Text style={styles.radioText}>✅ Yes, complaint was filed</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.radioOption,
                formData.policeComplaintFiled === false && styles.radioSelected,
              ]}
              onPress={() => handleInputChange("policeComplaintFiled", false)}
              disabled={isSubmitting}
            >
              <Text style={styles.radioText}>
                ❌ No, complaint was not filed
              </Text>
            </TouchableOpacity>
          </View>

          {/* Police Complaint Details - Show only if complaint was filed */}
          {formData.policeComplaintFiled === true && (
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>📝 Police Complaint Details *</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Provide police complaint details, FIR number, station name, etc..."
                value={formData.policeComplaintDetails}
                onChangeText={(text) =>
                  handleInputChange("policeComplaintDetails", text)
                }
                multiline
                numberOfLines={4}
                textAlignVertical="top"
                editable={!isSubmitting}
              />
            </View>
          )}
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          style={[
            styles.submitButton,
            isSubmitting && styles.submitButtonDisabled,
          ]}
          onPress={handleSubmit}
          disabled={isSubmitting}
        >
          <Text style={styles.submitButtonText}>
            {isSubmitting ? "Submitting..." : "Submit Report"}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  formContainer: {
    padding: 20,
    paddingBottom: 150,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    marginBottom: 30,
    paddingVertical: 15,
    backgroundColor: "#fff",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  fieldContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  inputText: {
    fontSize: 16,
    color: "#333",
  },
  placeholder: {
    color: "#999",
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  picker: {
    height: 50,
  },
  sectionContainer: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 15,
  },
  questionText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 15,
  },
  radioContainer: {
    marginTop: 10,
  },
  radioOption: {
    padding: 15,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    marginBottom: 10,
    backgroundColor: "#f9f9f9",
  },
  radioSelected: {
    backgroundColor: "#e3f2fd",
    borderColor: "#2196f3",
  },
  radioText: {
    fontSize: 16,
    color: "#333",
    fontWeight: "500",
  },
  submitButton: {
    backgroundColor: "#4CAF50",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  submitButtonDisabled: {
    backgroundColor: "#888",
    opacity: 0.7,
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default Accident;
