import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  Platform,
  Animated,
  Easing,
  Dimensions,
} from "react-native";
import Sketch from "@/components/Sketch"
import {
  ChevronLeft,
  ChevronRight,
  Save,
  Car,
  User,
  MapPin,
  FileText,
  X,
  Calendar,
  Clock,
  AlertCircle,
  CheckCircle,
  Search,
  ChevronDown,
} from "lucide-react-native";

const { width } = Dimensions.get("window");

// Types for our data
interface Driver {
  id: string;
  name: string;
  licenseNumber: string;
  address: string;
  phone: string;
  insuranceCompany: string;
  policyNumber: string;
}

interface Vehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  licensePlate: string;
  vin: string;
  color: string;
}

interface AccidentLocation {
  address: string;
  city: string;
  zipCode: string;
  country: string;
  description: string;
}

interface AccidentDetails {
  date: string;
  time: string;
  description: string;
  damages: string[];
  witnesses: string[];
  sketch: string;
  responsibleParty: "A" | "B" | null;
}

const ConstatForm: React.FC = () => {
  const [step, setStep] = useState(1);
  const [drivers, setDrivers] = useState<Driver[]>([
    {
      id: "1",
      name: "",
      licenseNumber: "",
      address: "",
      phone: "",
      insuranceCompany: "",
      policyNumber: "",
    },
    {
      id: "2",
      name: "",
      licenseNumber: "",
      address: "",
      phone: "",
      insuranceCompany: "",
      policyNumber: "",
    },
  ]);

  const [vehicles, setVehicles] = useState<Vehicle[]>([
    {
      id: "1",
      make: "",
      model: "",
      year: new Date().getFullYear(),
      licensePlate: "",
      vin: "",
      color: "",
    },
    {
      id: "2",
      make: "",
      model: "",
      year: new Date().getFullYear(),
      licensePlate: "",
      vin: "",
      color: "",
    },
  ]);

  const [location, setLocation] = useState<AccidentLocation>({
    address: "",
    city: "",
    zipCode: "",
    country: "France",
    description: "",
  });

  const [details, setDetails] = useState<AccidentDetails>({
    date: "",
    time: "",
    description: "",
    damages: [],
    witnesses: [],
    sketch: "",
    responsibleParty: null,
  });

  // Animation values
  const fadeAnim = useState(new Animated.Value(0))[0];
  const slideAnim = useState(new Animated.Value(50))[0];

  React.useEffect(() => {
    // Animate on step change
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 400,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
  }, [step]);

  const nextStep = () => {
    // Reset animations
    fadeAnim.setValue(0);
    slideAnim.setValue(50);

    if (step < 4) setStep(step + 1);
  };

  const prevStep = () => {
    // Reset animations
    fadeAnim.setValue(0);
    slideAnim.setValue(50);

    if (step > 1) setStep(step - 1);
  };

  const handleDriverChange = (
    index: number,
    field: keyof Driver,
    value: string
  ) => {
    const updatedDrivers = [...drivers];
    updatedDrivers[index] = { ...updatedDrivers[index], [field]: value };
    setDrivers(updatedDrivers);
  };

  const handleVehicleChange = (
    index: number,
    field: keyof Vehicle,
    value: string | number
  ) => {
    const updatedVehicles = [...vehicles];
    updatedVehicles[index] = { ...updatedVehicles[index], [field]: value };
    setVehicles(updatedVehicles);
  };

  const handleLocationChange = (
    field: keyof AccidentLocation,
    value: string
  ) => {
    setLocation({ ...location, [field]: value });
  };

  const handleDetailsChange = (
    field: keyof AccidentDetails,
    value: string | string[] | "A" | "B" | null
  ) => {
    setDetails({ ...details, [field]: value });
  };

  const handleDamageSelect = (damage: string, vehicle: "A" | "B") => {
    // Remove any existing selection for this damage
    const updatedDamages = details.damages.filter((d) => !d.includes(damage));

    // Add the new selection
    updatedDamages.push(`${vehicle}: ${damage}`);
    handleDetailsChange("damages", updatedDamages);
  };

  const handleWitnessAdd = () => {
    Alert.prompt(
      "Témoin",
      "Nom et coordonnées du témoin:",
      [
        {
          text: "Annuler",
          style: "cancel",
        },
        {
          text: "Ajouter",
          onPress: (newWitness?: string) => {
            if (newWitness) {
              handleDetailsChange("witnesses", [
                ...details.witnesses,
                newWitness,
              ]);
            }
          },
        },
      ],
      "plain-text"
    );
  };

  const handleSubmit = () => {
    console.log("Form submitted:", { drivers, vehicles, location, details });
    Alert.alert("Succès", "Constat enregistré avec succès!");
  };

  // Step 1: General Accident Information
  const renderStep1 = () => (
    <Animated.View
      style={[
        styles.stepContainer,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <View style={styles.sectionHeader}>
        <View style={styles.iconCircle}>
          <AlertCircle size={20} color="#4b76b2" />
        </View>
        <Text style={styles.sectionTitle}>Informations Générales</Text>
      </View>

      <View style={styles.formSection}>
        <View style={styles.inputRow}>
          <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
            <Text style={styles.label}>Date</Text>
            <View style={styles.inputWithIcon}>
              <Calendar size={18} color="#6b7280" style={styles.inputIcon} />
              <TextInput
                style={[styles.input, { paddingLeft: 40 }]}
                value={details.date}
                onChangeText={(value) => handleDetailsChange("date", value)}
                placeholder="JJ/MM/AAAA"
              />
            </View>
          </View>
          <View style={[styles.inputGroup, { flex: 1 }]}>
            <Text style={styles.label}>Heure</Text>
            <View style={styles.inputWithIcon}>
              <Clock size={18} color="#6b7280" style={styles.inputIcon} />
              <TextInput
                style={[styles.input, { paddingLeft: 40 }]}
                value={details.time}
                onChangeText={(value) => handleDetailsChange("time", value)}
                placeholder="HH:MM"
              />
            </View>
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Responsable selon vous</Text>
          <View style={styles.responsibilityContainer}>
            <TouchableOpacity
              style={[
                styles.responsibilityButton,
                details.responsibleParty === "A" &&
                  styles.responsibilityButtonSelected,
              ]}
              onPress={() => handleDetailsChange("responsibleParty", "A")}
            >
              <Text
                style={[
                  styles.responsibilityButtonText,
                  details.responsibleParty === "A" &&
                    styles.responsibilityButtonTextSelected,
                ]}
              >
                Véhicule A
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.responsibilityButton,
                details.responsibleParty === "B" &&
                  styles.responsibilityButtonSelected,
              ]}
              onPress={() => handleDetailsChange("responsibleParty", "B")}
            >
              <Text
                style={[
                  styles.responsibilityButtonText,
                  details.responsibleParty === "B" &&
                    styles.responsibilityButtonTextSelected,
                ]}
              >
                Véhicule B
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Description</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={details.description}
            onChangeText={(value) => handleDetailsChange("description", value)}
            placeholder="Décrivez le déroulement de l'accident"
            multiline
            textAlignVertical="top"
          />
        </View>
        <Sketch/>
      </View>
    </Animated.View>
  );

  // Step 2: Driver Information
  const renderStep2 = () => (
    <Animated.View
      style={[
        styles.stepContainer,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <View style={styles.sectionHeader}>
        <View style={styles.iconCircle}>
          <User size={20} color="#4b76b2" />
        </View>
        <Text style={styles.sectionTitle}>Conducteurs</Text>
      </View>

      {drivers.map((driver, index) => (
        <View
          key={driver.id}
          style={[
            styles.formSection,
            index === 0 ? styles.carASection : styles.carBSection,
            { marginBottom: 16 },
          ]}
        >
          <View style={styles.sectionLabel}>
            <Text
              style={[
                styles.subSectionTitle,
                index === 0 ? styles.carATitle : styles.carBTitle,
              ]}
            >
              Véhicule {index === 0 ? "A" : "B"}
            </Text>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Nom complet</Text>
            <TextInput
              style={styles.input}
              value={driver.name}
              onChangeText={(value) => handleDriverChange(index, "name", value)}
              placeholder="Nom et prénom"
            />
          </View>

          <View style={styles.inputRow}>
            <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
              <Text style={styles.label}>N° de permis</Text>
              <TextInput
                style={styles.input}
                value={driver.licenseNumber}
                onChangeText={(value) =>
                  handleDriverChange(index, "licenseNumber", value)
                }
                placeholder="N° de permis"
              />
            </View>
            <View style={[styles.inputGroup, { flex: 1 }]}>
              <Text style={styles.label}>Téléphone</Text>
              <TextInput
                style={styles.input}
                value={driver.phone}
                onChangeText={(value) =>
                  handleDriverChange(index, "phone", value)
                }
                placeholder="Numéro"
                keyboardType="phone-pad"
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Adresse</Text>
            <TextInput
              style={styles.input}
              value={driver.address}
              onChangeText={(value) =>
                handleDriverChange(index, "address", value)
              }
              placeholder="Adresse complète"
            />
          </View>

          <View style={styles.inputRow}>
            <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
              <Text style={styles.label}>Assurance</Text>
              <View style={styles.inputWithIcon}>
                <Search size={18} color="#6b7280" style={styles.inputIcon} />
                <TextInput
                  style={[styles.input, { paddingLeft: 40 }]}
                  value={driver.insuranceCompany}
                  onChangeText={(value) =>
                    handleDriverChange(index, "insuranceCompany", value)
                  }
                  placeholder="Compagnie"
                />
              </View>
            </View>
            <View style={[styles.inputGroup, { flex: 1 }]}>
              <Text style={styles.label}>N° de police</Text>
              <TextInput
                style={styles.input}
                value={driver.policyNumber}
                onChangeText={(value) =>
                  handleDriverChange(index, "policyNumber", value)
                }
                placeholder="N° de police"
              />
            </View>
          </View>
        </View>
      ))}
    </Animated.View>
  );

  // Step 3: Vehicle Information
  const renderStep3 = () => (
    <Animated.View
      style={[
        styles.stepContainer,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <View style={styles.sectionHeader}>
        <View style={styles.iconCircle}>
          <Car size={20} color="#4b76b2" />
        </View>
        <Text style={styles.sectionTitle}>Véhicules</Text>
      </View>

      {vehicles.map((vehicle, index) => (
        <View
          key={vehicle.id}
          style={[
            styles.formSection,
            index === 0 ? styles.carASection : styles.carBSection,
            { marginBottom: 16 },
          ]}
        >
          <View style={styles.sectionLabel}>
            <Text
              style={[
                styles.subSectionTitle,
                index === 0 ? styles.carATitle : styles.carBTitle,
              ]}
            >
              Véhicule {index === 0 ? "A" : "B"}
            </Text>
          </View>

          <View style={styles.inputRow}>
            <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
              <Text style={styles.label}>Marque</Text>
              <View style={styles.inputWithIcon}>
                <Search size={18} color="#6b7280" style={styles.inputIcon} />
                <TextInput
                  style={[styles.input, { paddingLeft: 40 }]}
                  value={vehicle.make}
                  onChangeText={(value) =>
                    handleVehicleChange(index, "make", value)
                  }
                  placeholder="Marque"
                />
              </View>
            </View>
            <View style={[styles.inputGroup, { flex: 1 }]}>
              <Text style={styles.label}>Modèle</Text>
              <View style={styles.inputWithIcon}>
                <ChevronDown
                  size={18}
                  color="#6b7280"
                  style={styles.inputIcon}
                />
                <TextInput
                  style={[styles.input, { paddingLeft: 40 }]}
                  value={vehicle.model}
                  onChangeText={(value) =>
                    handleVehicleChange(index, "model", value)
                  }
                  placeholder="Modèle"
                />
              </View>
            </View>
          </View>

          <View style={styles.inputRow}>
            <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
              <Text style={styles.label}>Année</Text>
              <TextInput
                style={styles.input}
                value={vehicle.year.toString()}
                onChangeText={(value) =>
                  handleVehicleChange(
                    index,
                    "year",
                    parseInt(value) || new Date().getFullYear()
                  )
                }
                keyboardType="numeric"
                placeholder="Année"
              />
            </View>
            <View style={[styles.inputGroup, { flex: 1 }]}>
              <Text style={styles.label}>Plaque</Text>
              <TextInput
                style={styles.input}
                value={vehicle.licensePlate}
                onChangeText={(value) =>
                  handleVehicleChange(index, "licensePlate", value)
                }
                placeholder="AA-123-AA"
              />
            </View>
          </View>

          <View style={styles.inputRow}>
            <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
              <Text style={styles.label}>VIN</Text>
              <TextInput
                style={styles.input}
                value={vehicle.vin}
                onChangeText={(value) =>
                  handleVehicleChange(index, "vin", value)
                }
                placeholder="N° d'identification"
              />
            </View>
            <View style={[styles.inputGroup, { flex: 1 }]}>
              <Text style={styles.label}>Couleur</Text>
              <TextInput
                style={styles.input}
                value={vehicle.color}
                onChangeText={(value) =>
                  handleVehicleChange(index, "color", value)
                }
                placeholder="Couleur"
              />
            </View>
          </View>
        </View>
      ))}
    </Animated.View>
  );

  // Step 4: Accident Location and Details
  const renderStep4 = () => (
    <Animated.View
      style={[
        styles.stepContainer,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <View style={styles.sectionHeader}>
        <View style={styles.iconCircle}>
          <MapPin size={20} color="#4b76b2" />
        </View>
        <Text style={styles.sectionTitle}>Lieu et Détails</Text>
      </View>

      <View style={[styles.formSection, { marginBottom: 16 }]}>
        <Text style={styles.subSectionTitle}>Lieu de l'accident</Text>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Adresse</Text>
          <TextInput
            style={styles.input}
            value={location.address}
            onChangeText={(value) => handleLocationChange("address", value)}
            placeholder="Adresse exacte"
          />
        </View>

        <View style={styles.inputRow}>
          <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
            <Text style={styles.label}>Ville</Text>
            <TextInput
              style={styles.input}
              value={location.city}
              onChangeText={(value) => handleLocationChange("city", value)}
              placeholder="Ville"
            />
          </View>
          <View style={[styles.inputGroup, { flex: 1 }]}>
            <Text style={styles.label}>Code postal</Text>
            <TextInput
              style={styles.input}
              value={location.zipCode}
              onChangeText={(value) => handleLocationChange("zipCode", value)}
              placeholder="Code postal"
              keyboardType="numeric"
            />
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Pays</Text>
          <TextInput
            style={styles.input}
            value={location.country}
            onChangeText={(value) => handleLocationChange("country", value)}
            placeholder="Pays"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Description du lieu</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={location.description}
            onChangeText={(value) => handleLocationChange("description", value)}
            placeholder="Décrivez l'endroit précis"
            multiline
            textAlignVertical="top"
          />
        </View>
      </View>

      <View style={[styles.formSection, { marginBottom: 16 }]}>
        <Text style={styles.subSectionTitle}>Dégâts constatés</Text>
        <View style={styles.damageContainer}>
          <Text style={styles.damageInstruction}>
            Sélectionnez les zones endommagées:
          </Text>

          <View style={styles.damageSelection}>
            {[
              "Avant droit",
              "Avant gauche",
              "Arrière droit",
              "Arrière gauche",
              "Portière conducteur",
              "Portière passager",
              "Rétroviseur droit",
              "Rétroviseur gauche",
            ].map((damage) => {
              const vehicleA = details.damages.includes(`A: ${damage}`);
              const vehicleB = details.damages.includes(`B: ${damage}`);

              return (
                <View key={damage} style={styles.damageRow}>
                  <Text style={styles.damageLabel}>{damage}</Text>
                  <View style={styles.damageButtons}>
                    <TouchableOpacity
                      style={[
                        styles.damageButton,
                        vehicleA && styles.damageButtonSelectedA,
                        { marginRight: 8 },
                      ]}
                      onPress={() => handleDamageSelect(damage, "A")}
                    >
                      <Text
                        style={[
                          styles.damageButtonText,
                          vehicleA && styles.damageButtonTextSelected,
                        ]}
                      >
                        A
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[
                        styles.damageButton,
                        vehicleB && styles.damageButtonSelectedB,
                      ]}
                      onPress={() => handleDamageSelect(damage, "B")}
                    >
                      <Text
                        style={[
                          styles.damageButtonText,
                          vehicleB && styles.damageButtonTextSelected,
                        ]}
                      >
                        B
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })}
          </View>
        </View>
      </View>

      <View style={styles.formSection}>
        <Text style={styles.subSectionTitle}>Témoins</Text>
        <View style={styles.witnessContainer}>
          {details.witnesses.map((witness, index) => (
            <View key={index} style={styles.witnessItem}>
              <Text style={styles.witnessText}>{witness}</Text>
              <TouchableOpacity
                onPress={() =>
                  handleDetailsChange(
                    "witnesses",
                    details.witnesses.filter((_, i) => i !== index)
                  )
                }
              >
                <X size={16} color="#dc2626" />
              </TouchableOpacity>
            </View>
          ))}
          <TouchableOpacity
            style={styles.addWitnessButton}
            onPress={handleWitnessAdd}
          >
            <Text style={styles.addWitnessText}>+ Ajouter un témoin</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Animated.View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>CONSTAT AMIABLE</Text>
        <Text style={styles.subtitle}>Accident Automobile</Text>
      </View>

      {/* Progress bar */}
      <View style={styles.progressContainer}>
        <View style={styles.progressSteps}>
          {[1, 2, 3, 4].map((i) => (
            <View key={i} style={styles.progressStepContainer}>
              <View
                style={[
                  styles.progressStep,
                  step >= i
                    ? styles.progressStepActive
                    : styles.progressStepInactive,
                  step === i && styles.progressStepCurrent,
                ]}
              >
                {step > i ? (
                  <CheckCircle size={16} color="white" />
                ) : (
                  <Text
                    style={
                      step >= i
                        ? styles.progressStepTextActive
                        : styles.progressStepTextInactive
                    }
                  >
                    {i}
                  </Text>
                )}
              </View>
              <Text style={styles.progressStepLabel}>
                {i === 1
                  ? "Général"
                  : i === 2
                  ? "Conducteurs"
                  : i === 3
                  ? "Véhicules"
                  : "Détails"}
              </Text>
            </View>
          ))}
        </View>
        <View style={styles.progressBar}>
          <View
            style={[styles.progressBarFill, { width: `${(step / 4) * 100}%` }]}
          />
        </View>
      </View>

      {/* Form steps */}
      <ScrollView style={styles.formContainer}>
        {step === 1 && renderStep1()}
        {step === 2 && renderStep2()}
        {step === 3 && renderStep3()}
        {step === 4 && renderStep4()}
      </ScrollView>

      {/* Navigation buttons */}
      <View style={styles.navigationButtons}>
        <TouchableOpacity
          onPress={prevStep}
          disabled={step === 1}
          style={[
            styles.navButton,
            step === 1 ? styles.navButtonDisabled : styles.navButtonPrev,
          ]}
        >
          <ChevronLeft size={16} color={step === 1 ? "#9ca3af" : "#374151"} />
          <Text
            style={[
              styles.navButtonText,
              step === 1 && styles.navButtonTextDisabled,
            ]}
          >
            Précédent
          </Text>
        </TouchableOpacity>

        <View style={styles.stepIndicator}>
          <Text style={styles.stepIndicatorText}>Étape {step} sur 4</Text>
        </View>

        {step < 4 ? (
          <TouchableOpacity
            onPress={nextStep}
            style={[styles.navButton, styles.navButtonNext]}
          >
            <Text style={[styles.navButtonText, { color: "white" }]}>
              Suivant
            </Text>
            <ChevronRight size={16} color="white" />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={handleSubmit}
            style={[styles.navButton, styles.navButtonSubmit]}
          >
            <Save size={16} color="white" />
            <Text style={[styles.navButtonText, { color: "white" }]}>
              Enregistrer
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  header: {
    backgroundColor: "#1e3a8a",
    padding: 16,
    paddingTop: Platform.OS === "ios" ? 50 : 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    zIndex: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 12,
    color: "white",
    opacity: 0.9,
    marginTop: 4,
  },
  progressContainer: {
    backgroundColor: "white",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  progressSteps: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  progressStepContainer: {
    alignItems: "center",
    flex: 1,
  },
  progressStep: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 6,
    borderWidth: 2,
    borderColor: "transparent",
  },
  progressStepActive: {
    backgroundColor: "#1e3a8a",
  },
  progressStepInactive: {
    backgroundColor: "#e5e7eb",
  },
  progressStepCurrent: {
    borderColor: "#93c5fd",
  },
  progressStepTextActive: {
    color: "white",
    fontWeight: "bold",
    fontSize: 14,
  },
  progressStepTextInactive: {
    color: "#6b7280",
    fontSize: 14,
  },
  progressStepLabel: {
    fontSize: 10,
    color: "#64748b",
    textAlign: "center",
  },
  progressBar: {
    width: "100%",
    height: 4,
    backgroundColor: "#e5e7eb",
    borderRadius: 2,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: "#1e3a8a",
    borderRadius: 2,
  },
  formContainer: {
    flex: 1,
    padding: 16,
  },
  stepContainer: {
    gap: 16,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 8,
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#dbeafe",
    justifyContent: "center",
    alignItems: "center",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1e293b",
  },
  formSection: {
    backgroundColor: "white",
    padding: 16,
    borderRadius: 10,
    gap: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  carASection: {
    borderLeftWidth: 4,
    borderLeftColor: "#3b82f6",
  },
  carBSection: {
    borderLeftWidth: 4,
    borderLeftColor: "#ef4444",
  },
  sectionLabel: {
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  subSectionTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1e293b",
  },
  carATitle: {
    color: "#3b82f6",
  },
  carBTitle: {
    color: "#ef4444",
  },
  inputRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  inputGroup: {
    marginBottom: 12,
  },
  label: {
    fontSize: 13,
    fontWeight: "500",
    color: "#374151",
    marginBottom: 4,
  },
  input: {
    backgroundColor: "#f8fafc",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 6,
    padding: 10,
    fontSize: 14,
    color: "#1e293b",
    minHeight: 44,
  },
  textArea: {
    height: 80,
    textAlignVertical: "top",
  },
  inputWithIcon: {
    position: "relative",
  },
  inputIcon: {
    position: "absolute",
    left: 10,
    top: 13,
    zIndex: 1,
  },
  responsibilityContainer: {
    flexDirection: "row",
    gap: 10,
  },
  responsibilityButton: {
    flex: 1,
    padding: 12,
    borderRadius: 6,
    backgroundColor: "#f1f5f9",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "transparent",
  },
  responsibilityButtonSelected: {
    backgroundColor: "#1e40af",
    borderColor: "#1e40af",
  },
  responsibilityButtonText: {
    fontWeight: "500",
    color: "#64748b",
    fontSize: 13,
  },
  responsibilityButtonTextSelected: {
    color: "white",
  },
  damageContainer: {
    gap: 12,
  },
  damageInstruction: {
    fontSize: 13,
    color: "#64748b",
    textAlign: "center",
    marginBottom: 8,
  },
  damageSelection: {
    gap: 8,
  },
  damageRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  damageLabel: {
    fontSize: 13,
    color: "#374151",
    flex: 1,
  },
  damageButtons: {
    flexDirection: "row",
  },
  damageButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#d1d5db",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
  damageButtonSelectedA: {
    backgroundColor: "#3b82f6",
    borderColor: "#3b82f6",
  },
  damageButtonSelectedB: {
    backgroundColor: "#ef4444",
    borderColor: "#ef4444",
  },
  damageButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
  },
  damageButtonTextSelected: {
    color: "white",
  },
  witnessContainer: {
    gap: 10,
  },
  witnessItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#f8fafc",
    padding: 10,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  witnessText: {
    fontSize: 13,
    color: "#374151",
    flex: 1,
  },
  addWitnessButton: {
    padding: 14,
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderStyle: "dashed",
    borderRadius: 6,
    alignItems: "center",
  },
  addWitnessText: {
    color: "#6b7280",
    fontSize: 13,
  },
  navigationButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    backgroundColor: "white",
    borderTopWidth: 1,
    borderTopColor: "#e2e8f0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  navButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 6,
    gap: 6,
  },
  navButtonPrev: {
    backgroundColor: "#f3f4f6",
  },
  navButtonNext: {
    backgroundColor: "#1e40af",
  },
  navButtonSubmit: {
    backgroundColor: "#059669",
  },
  navButtonDisabled: {
    backgroundColor: "#f9fafb",
  },
  navButtonText: {
    fontWeight: "600",
    fontSize: 13,
  },
  navButtonTextDisabled: {
    color: "#9ca3af",
  },
  stepIndicator: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: "#f1f5f9",
    borderRadius: 14,
  },
  stepIndicatorText: {
    fontSize: 11,
    fontWeight: "500",
    color: "#64748b",
  },
});

export default ConstatForm;
