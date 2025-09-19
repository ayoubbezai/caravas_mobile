import React, { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Save,
  Car,
  User,
  MapPin,
  FileText,
} from "lucide-react";

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
  sketch: string; // URL or base64 for sketch
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
    country: "",
    description: "",
  });

  const [details, setDetails] = useState<AccidentDetails>({
    date: "",
    time: "",
    description: "",
    damages: [],
    witnesses: [],
    sketch: "",
  });

  // Mock data for autocomplete - in a real app, this would come from a database
  const insuranceCompanies = [
    "AXA",
    "MAIF",
    "Allianz",
    "Groupama",
    "Matmut",
    "GAN",
    "Generali",
  ];
  const vehicleMakes = [
    "Renault",
    "Peugeot",
    "Citroën",
    "Volkswagen",
    "BMW",
    "Mercedes",
    "Audi",
    "Toyota",
  ];
  const vehicleModels = {
    Renault: ["Clio", "Mégane", "Scénic", "Kadjar", "Captur"],
    Peugeot: ["208", "308", "3008", "5008", "2008"],
    Citroën: ["C3", "C4", "C5", "C4 Picasso"],
    Volkswagen: ["Golf", "Polo", "Passat", "Tiguan"],
    BMW: ["Série 1", "Série 3", "X1", "X3"],
    Mercedes: ["Classe A", "Classe C", "GLC", "GLE"],
    Audi: ["A1", "A3", "A4", "Q3", "Q5"],
    Toyota: ["Yaris", "Corolla", "RAV4", "C-HR"],
  };

  const nextStep = () => {
    if (step < 4) setStep(step + 1);
  };

  const prevStep = () => {
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
    value: string | string[]
  ) => {
    setDetails({ ...details, [field]: value });
  };

  const handleDamageToggle = (damage: string) => {
    const updatedDamages = details.damages.includes(damage)
      ? details.damages.filter((d) => d !== damage)
      : [...details.damages, damage];
    handleDetailsChange("damages", updatedDamages);
  };

  const handleWitnessAdd = () => {
    const newWitness = prompt("Nom et coordonnées du témoin:");
    if (newWitness) {
      handleDetailsChange("witnesses", [...details.witnesses, newWitness]);
    }
  };

  const handleSubmit = () => {
    // In a real app, this would submit the form data to your backend
    console.log("Form submitted:", { drivers, vehicles, location, details });
    alert("Constat enregistré avec succès!");
  };

  // Step 1: Driver Information
  const renderStep1 = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold flex items-center gap-2">
        <User size={20} /> Informations des conducteurs
      </h2>

      {drivers.map((driver, index) => (
        <div key={driver.id} className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-medium mb-4">Conducteur {index + 1}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nom complet
              </label>
              <input
                type="text"
                value={driver.name}
                onChange={(e) =>
                  handleDriverChange(index, "name", e.target.value)
                }
                className="w-full p-2 border border-gray-300 rounded-md"
                placeholder="Nom et prénom"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Numéro de permis
              </label>
              <input
                type="text"
                value={driver.licenseNumber}
                onChange={(e) =>
                  handleDriverChange(index, "licenseNumber", e.target.value)
                }
                className="w-full p-2 border border-gray-300 rounded-md"
                placeholder="N° de permis"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Adresse
              </label>
              <input
                type="text"
                value={driver.address}
                onChange={(e) =>
                  handleDriverChange(index, "address", e.target.value)
                }
                className="w-full p-2 border border-gray-300 rounded-md"
                placeholder="Adresse complète"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Téléphone
              </label>
              <input
                type="tel"
                value={driver.phone}
                onChange={(e) =>
                  handleDriverChange(index, "phone", e.target.value)
                }
                className="w-full p-2 border border-gray-300 rounded-md"
                placeholder="Numéro de téléphone"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Assurance
              </label>
              <select
                title="company"
                value={driver.insuranceCompany}
                onChange={(e) =>
                  handleDriverChange(index, "insuranceCompany", e.target.value)
                }
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="">Sélectionnez une compagnie</option>
                {insuranceCompanies.map((company) => (
                  <option key={company} value={company}>
                    {company}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Numéro de police
              </label>
              <input
                type="text"
                value={driver.policyNumber}
                onChange={(e) =>
                  handleDriverChange(index, "policyNumber", e.target.value)
                }
                className="w-full p-2 border border-gray-300 rounded-md"
                placeholder="N° de police d'assurance"
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  // Step 2: Vehicle Information
  const renderStep2 = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold flex items-center gap-2">
        <Car size={20} /> Informations des véhicules
      </h2>

      {vehicles.map((vehicle, index) => (
        <div key={vehicle.id} className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-medium mb-4">Véhicule {index + 1}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Marque
              </label>
              <select
                title="select"
                value={vehicle.make}
                onChange={(e) =>
                  handleVehicleChange(index, "make", e.target.value)
                }
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="">Sélectionnez une marque</option>
                {vehicleMakes.map((make) => (
                  <option key={make} value={make}>
                    {make}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Modèle
              </label>
              <select
                title="modal"
                value={vehicle.model}
                onChange={(e) =>
                  handleVehicleChange(index, "model", e.target.value)
                }
                className="w-full p-2 border border-gray-300 rounded-md"
                disabled={!vehicle.make}
              >
                <option value="">Sélectionnez un modèle</option>
                {vehicle.make &&
                  vehicleModels[
                    vehicle.make as keyof typeof vehicleModels
                  ]?.map((model) => (
                    <option key={model} value={model}>
                      {model}
                    </option>
                  ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Année
              </label>
              <input
                title="year"
                type="number"
                min="1950"
                max={new Date().getFullYear()}
                value={vehicle.year}
                onChange={(e) =>
                  handleVehicleChange(index, "year", parseInt(e.target.value))
                }
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Plaque d'immatriculation
              </label>
              <input
                type="text"
                value={vehicle.licensePlate}
                onChange={(e) =>
                  handleVehicleChange(index, "licensePlate", e.target.value)
                }
                className="w-full p-2 border border-gray-300 rounded-md"
                placeholder="AA-123-AA"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Numéro de série (VIN)
              </label>
              <input
                type="text"
                value={vehicle.vin}
                onChange={(e) =>
                  handleVehicleChange(index, "vin", e.target.value)
                }
                className="w-full p-2 border border-gray-300 rounded-md"
                placeholder="Numéro d'identification du véhicule"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Couleur
              </label>
              <input
                type="text"
                value={vehicle.color}
                onChange={(e) =>
                  handleVehicleChange(index, "color", e.target.value)
                }
                className="w-full p-2 border border-gray-300 rounded-md"
                placeholder="Couleur du véhicule"
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  // Step 3: Accident Location
  const renderStep3 = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold flex items-center gap-2">
        <MapPin size={20} /> Lieu de l'accident
      </h2>

      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Adresse
            </label>
            <input
              type="text"
              value={location.address}
              onChange={(e) => handleLocationChange("address", e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
              placeholder="Adresse exacte de l'accident"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ville
            </label>
            <input
              type="text"
              value={location.city}
              onChange={(e) => handleLocationChange("city", e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
              placeholder="Ville"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Code postal
            </label>
            <input
              type="text"
              value={location.zipCode}
              onChange={(e) => handleLocationChange("zipCode", e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
              placeholder="Code postal"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Pays
            </label>
            <input
              type="text"
              value={location.country}
              onChange={(e) => handleLocationChange("country", e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
              placeholder="Pays"
              defaultValue="France"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description détaillée du lieu
            </label>
            <textarea
              value={location.description}
              onChange={(e) =>
                handleLocationChange("description", e.target.value)
              }
              className="w-full p-2 border border-gray-300 rounded-md"
              rows={3}
              placeholder="Décrivez l'endroit précis de l'accident (carrefour, parking, etc.)"
            />
          </div>
        </div>
      </div>
    </div>
  );

  // Step 4: Accident Details
  const renderStep4 = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold flex items-center gap-2">
        <FileText size={20} /> Détails de l'accident
      </h2>

      <div className="bg-gray-50 p-4 rounded-lg space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date de l'accident
            </label>
            <input
              title="date"
              type="date"
              value={details.date}
              onChange={(e) => handleDetailsChange("date", e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Heure de l'accident
            </label>
            <input
              title="time"
              type="time"
              value={details.time}
              onChange={(e) => handleDetailsChange("time", e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description de l'accident
          </label>
          <textarea
            value={details.description}
            onChange={(e) => handleDetailsChange("description", e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
            rows={4}
            placeholder="Décrivez en détail le déroulement de l'accident"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Dégâts constatés
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {[
              "Avant droit",
              "Avant gauche",
              "Arrière droit",
              "Arrière gauche",
              "Portière conducteur",
              "Portière passager",
              "Rétroviseur droit",
              "Rétroviseur gauche",
              "Pare-chocs avant",
              "Pare-chocs arrière",
              "Phares avant",
              "Feux arrière",
            ].map((damage) => (
              <label key={damage} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={details.damages.includes(damage)}
                  onChange={() => handleDamageToggle(damage)}
                  className="rounded border-gray-300 text-blue-600"
                />
                <span className="text-sm">{damage}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Témoins
          </label>
          <div className="space-y-2">
            {details.witnesses.map((witness, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-2 bg-white rounded border"
              >
                <span>{witness}</span>
                <button
                  type="button"
                  onClick={() =>
                    handleDetailsChange(
                      "witnesses",
                      details.witnesses.filter((_, i) => i !== index)
                    )
                  }
                  className="text-red-500 hover:text-red-700"
                >
                  ×
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={handleWitnessAdd}
              className="mt-2 text-sm text-blue-600 hover:text-blue-800"
            >
              + Ajouter un témoin
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto p-4 bg-white shadow-lg rounded-lg">
      <h1 className="text-2xl font-bold text-center mb-6">
        CONSTAT AMIABLE D'ACCIDENT AUTOMOBILE
      </h1>

      {/* Progress bar */}
      <div className="mb-6">
        <div className="flex justify-between mb-2">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                step >= i
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-500"
              }`}
            >
              {i}
            </div>
          ))}
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full"
            style={{ width: `${(step / 4) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Form steps */}
      <div className="mb-6">
        {step === 1 && renderStep1()}
        {step === 2 && renderStep2()}
        {step === 3 && renderStep3()}
        {step === 4 && renderStep4()}
      </div>

      {/* Navigation buttons */}
      <div className="flex justify-between">
        <button
          type="button"
          onClick={prevStep}
          disabled={step === 1}
          className={`flex items-center px-4 py-2 rounded-md ${
            step === 1
              ? "bg-gray-300 text-gray-500"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          <ChevronLeft size={16} className="mr-1" /> Précédent
        </button>

        {step < 4 ? (
          <button
            type="button"
            onClick={nextStep}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Suivant <ChevronRight size={16} className="ml-1" />
          </button>
        ) : (
          <button
            type="button"
            onClick={handleSubmit}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            <Save size={16} className="mr-1" /> Enregistrer le constat
          </button>
        )}
      </div>
    </div>
  );
};

export default ConstatForm;
