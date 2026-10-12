 import { useEffect, useState } from 'react';
 import { Loader2 } from 'lucide-react';
 import ReactMarkdown from "react-markdown";
 import { jsPDF } from "jspdf";
import {
  Stethoscope,
  Activity,
  Upload,
  FileText,
  Heart,
  Thermometer,
  User,
  Send,
  Hospital,
  Calendar,
  Pill,
  CheckCircle2,
  AlertTriangle,
  ImageIcon,
  Sparkles,
  MapPin,
  ExternalLink,
  ShieldCheck,
  Mic,
  Volume2,
  Globe,
  Download,
  AlertOctagon,
  CheckSquare,
  Square,
  TrendingUp,
  TrendingDown,
  Clock,
  X,
  ClipboardList,
  Layers,
  Zap,
  Bone,
  Dna,
  ChevronDown,
  LocateFixed,
  AlertCircle,
  Phone,
  Navigation,
  Plus,
} from 'lucide-react';
import Anatomy3DCanvas from '../components/Anatomy3DCanvas';

interface Medicine {
  id: number;
  name: string;
  time: string;
  completed: boolean;
  status: string;
}

type BodyLayer = 'organs' | 'skeletal' | 'muscular' | 'nervous' | 'skin';

export default function HealthcareWorkspace() {
  const [activeTab, setActiveTab] = useState<string>('symptom');
  const [inputMessage, setInputMessage] = useState<string>('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [language, setLanguage] = useState<'EN' | 'MR'>('EN');
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [showSosAlert, setShowSosAlert] = useState<boolean>(false);
  const [showSosConfirm, setShowSosConfirm] = useState(false);
  const [healthTips, setHealthTips] = useState<any[]>([]);
const [tipsLoading, setTipsLoading] = useState(false);
const [tipsError, setTipsError] = useState("");
const [tipSearch, setTipSearch] = useState("");
const [tipCategory, setTipCategory] = useState("All");
const [sosLoading, setSosLoading] = useState(false);
  const [selectedBodyPart, setSelectedBodyPart] = useState<string | null>(null);
  const [predictions, setPredictions] = useState<any[]>([]);
const [matchedSymptoms, setMatchedSymptoms] = useState<string[]>([]);
const [unknownSymptoms, setUnknownSymptoms] = useState<string[]>([]);
const [analyzing, setAnalyzing] = useState(false);
const [submittedMessage, setSubmittedMessage] = useState<string>("");
const [medicineName, setMedicineName] = useState("");
const [medicineInfo, setMedicineInfo] = useState<any>(null);
const [medicineLoading, setMedicineLoading] = useState(false);
const [medicineError, setMedicineError] = useState("");
const [reportFile, setReportFile] = useState<File | null>(null);
const [reportLoading, setReportLoading] = useState(false);
const [reportResult, setReportResult] = useState<any>(null);
const [reportError, setReportError] = useState("");
const [hospitals, setHospitals] = useState<any[]>([]);
const [hospitalLoading, setHospitalLoading] = useState(false);
const [hospitalError, setHospitalError] = useState("");
const [userLocation, setUserLocation] = useState<{
  latitude: number;
  longitude: number;
} | null>(null);
// Emergency Contact State
const [emergencyContact, setEmergencyContact] = useState<{
  name: string;
  phone: string;
  relation: string;
} | null>(null);

const [showEmergencyContact, setShowEmergencyContact] = useState(false);

const [contactForm, setContactForm] = useState({
  name: "",
  phone: "",
  relation: "",
});

  // BioDigital Active Layer State
  const [activeLayer, setActiveLayer] = useState<BodyLayer>('organs');

  // Health Vitals State
  const [vitals, setVitals] = useState<any[]>([]);
  const [vitalsLoading, setVitalsLoading] = useState(false);
  const [vitalsError, setVitalsError] = useState("");
  // Live Vitals Graph State
const [showVitalsGraph, setShowVitalsGraph] = useState(false);
const [selectedVitalName, setSelectedVitalName] = useState("");

  // Medication Checklist State
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [medicineListLoading, setMedicineListLoading] = useState(false);
  const [medicineListError, setMedicineListError] = useState("");
  const [showAddMedicine, setShowAddMedicine] = useState(false);
  const [addMedicineLoading, setAddMedicineLoading] = useState(false);
  const [addMedicineError, setAddMedicineError] = useState("");
  const [newMedicine, setNewMedicine] = useState({
    medicine_name: "",
    dosage: "",
    frequency: "Once daily",
    time: "",
    start_date: "",
    end_date: "",
  });

  // JWT authentication helper
  const getAuthHeaders = (): Record<string, string> => {
    const token = localStorage.getItem("token");
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  const requireAuthToken = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setMedicineListError("Please login to continue.");
      return false;
    }
    return true;
  };

    // =========================================================
  // HEALTH INSIGHTS CALCULATION
  // =========================================================
  const getVitalInsights = (vitalName: string) => {
    const records = vitals
      .filter(
        (v) =>
          String(v?.vital_name || "").toLowerCase().trim() ===
            String(vitalName || "").toLowerCase().trim() &&
          Number.isFinite(Number(v?.value))
      )
      .slice()
      .sort(
        (a, b) =>
          new Date(a.recorded_at).getTime() -
          new Date(b.recorded_at).getTime()
      );

    if (records.length === 0) {
      return null;
    }

    const values = records.map((v) => Number(v.value));

    const latest = values[values.length - 1];
    const previous = values.length > 1 ? values[values.length - 2] : null;

    const minimum = Math.min(...values);
    const maximum = Math.max(...values);

    const average =
      values.reduce((sum, value) => sum + value, 0) / values.length;

    const difference =
      previous !== null ? latest - previous : null;

    const percentageChange =
      previous !== null && previous !== 0
        ? (difference! / previous) * 100
        : null;

    let trend: "Increasing" | "Decreasing" | "Stable" = "Stable";

    if (difference !== null) {
      if (difference > 0) {
        trend = "Increasing";
      } else if (difference < 0) {
        trend = "Decreasing";
      }
    }

    return {
      latest,
      previous,
      minimum,
      maximum,
      average,
      difference,
      percentageChange,
      trend,
      unit: records[records.length - 1]?.unit || "",
      recordsCount: records.length,
      latestDate: records[records.length - 1]?.recorded_at,
    };
  };
  // =========================================================
// EXPORT COMPLETE HEALTH SUMMARY AS PDF
// =========================================================
const exportHealthSummaryPDF = () => {
  const doc = new jsPDF();

  let y = 20;

  const addTitle = (title: string) => {
    if (y > 270) {
      doc.addPage();
      y = 20;
    }

    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text(title, 15, y);
    y += 9;
  };

  const addText = (label: string, value: string) => {
    if (y > 280) {
      doc.addPage();
      y = 20;
    }

    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text(`${label}:`, 15, y);

    doc.setFont("helvetica", "normal");

    const lines = doc.splitTextToSize(
      value || "Not available",
      170
    );

    doc.text(lines, 50, y);
    y += Math.max(7, lines.length * 5);
  };

  // ---------------------------------------------------------
  // HEADER
  // ---------------------------------------------------------
  doc.setFontSize(20);
  doc.setFont("helvetica", "bold");
  doc.text("PATIENT HEALTH SUMMARY", 15, y);

  y += 8;

  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.text(
    `Generated on: ${new Date().toLocaleString()}`,
    15,
    y
  );

  y += 15;

  // ---------------------------------------------------------
  // CONSULTATION SUMMARY
  // ---------------------------------------------------------
  addTitle("1. Consultation Summary");

  addText(
    "Symptoms",
    matchedSymptoms.length > 0
      ? matchedSymptoms
          .map((symptom) => symptom.replaceAll("_", " "))
          .join(", ")
      : submittedMessage.trim() || "No symptom analysis yet"
  );

  addText(
    "Analysis",
    predictions.length > 0
      ? `${predictions.length} possible condition${
          predictions.length > 1 ? "s" : ""
        } identified by the symptom model`
      : reportResult?.summary?.message ||
          "No analysis available"
  );

  addText(
    "Follow-up",
    submittedMessage.trim() || reportResult
      ? "Review the results with a qualified healthcare professional."
      : "No follow-up information available."
  );

  y += 5;

  // ---------------------------------------------------------
  // HEALTH VITALS
  // ---------------------------------------------------------
  addTitle("2. Health Vitals");

  if (vitals.length === 0) {
    addText("Status", "No health vitals recorded.");
  } else {
    const sortedVitals = vitals
      .slice()
      .sort(
        (a, b) =>
          new Date(b.recorded_at).getTime() -
          new Date(a.recorded_at).getTime()
      );

    sortedVitals.forEach((vital) => {
      addText(
        vital.vital_name || "Vital",
        `${vital.value} ${vital.unit || ""} | ${new Date(
          vital.recorded_at
        ).toLocaleString()} | Source: ${
          vital.source || "manual"
        }`
      );
    });
  }

  y += 5;

  // ---------------------------------------------------------
  // HEALTH INSIGHTS
  // ---------------------------------------------------------
  addTitle("3. Health Insights");

  const availableVitals = Array.from(
    new Set(
      vitals
        .filter(
          (v) =>
            v?.vital_name &&
            Number.isFinite(Number(v?.value))
        )
        .map((v) => String(v.vital_name))
    )
  );

  if (availableVitals.length === 0) {
    addText(
      "Status",
      "No numeric health data available for insights."
    );
  } else {
    availableVitals.forEach((vitalName) => {
      const insights = getVitalInsights(vitalName);

      if (!insights) return;

      addText("Vital", vitalName);
      addText(
        "Latest",
        `${insights.latest} ${insights.unit || ""}`
      );
      addText(
        "Average",
        `${insights.average.toFixed(2)} ${
          insights.unit || ""
        }`
      );
      addText(
        "Minimum",
        `${insights.minimum} ${insights.unit || ""}`
      );
      addText(
        "Maximum",
        `${insights.maximum} ${insights.unit || ""}`
      );
      addText("Trend", insights.trend);

      if (insights.difference !== null) {
        addText(
          "Change",
          `${insights.difference > 0 ? "+" : ""}${insights.difference.toFixed(
            2
          )} ${
            insights.unit || ""
          }`
        );
      }

      if (insights.percentageChange !== null) {
        addText(
          "Percentage Change",
          `${insights.percentageChange > 0 ? "+" : ""}${insights.percentageChange.toFixed(
            1
          )}%`
        );
      }

      y += 4;
    });
  }

  // ---------------------------------------------------------
  // MEDICAL REPORT
  // ---------------------------------------------------------
  addTitle("4. Medical Report Analysis");

  if (!reportResult) {
    addText(
      "Status",
      "No medical report has been analyzed."
    );
  } else {
    if (reportResult.summary) {
      addText(
        "Normal",
        String(reportResult.summary.normal ?? 0)
      );

      addText(
        "High",
        String(reportResult.summary.high ?? 0)
      );

      addText(
        "Low",
        String(reportResult.summary.low ?? 0)
      );

      addText(
        "Summary",
        reportResult.summary.message || "Not available"
      );
    }

    if (
      Array.isArray(reportResult.parameters) &&
      reportResult.parameters.length > 0
    ) {
      reportResult.parameters.forEach((parameter: any) => {
        addText(
          parameter.name || "Parameter",
          `${parameter.value ?? ""} ${
            parameter.unit || ""
          } | Status: ${
            parameter.status || "unknown"
          } | Reference: ${
            parameter.reference_range || "N/A"
          }`
        );
      });
    }
  }

  y += 5;

  // ---------------------------------------------------------
  // MEDICATIONS
  // ---------------------------------------------------------
  addTitle("5. Medications");

  if (medicines.length === 0) {
    addText("Status", "No medications recorded.");
  } else {
    medicines.forEach((medicine) => {
      addText(
        medicine.name,
        `${medicine.time || "Time not specified"} | Status: ${
          medicine.completed ? "Taken" : "Due"
        }`
      );
    });
  }

  y += 8;

  // ---------------------------------------------------------
  // DISCLAIMER
  // ---------------------------------------------------------
  addTitle("Important Note");

  addText(
    "Disclaimer",
    "This document summarizes information recorded in the healthcare dashboard. It is not a medical diagnosis or a substitute for professional medical advice."
  );

  // ---------------------------------------------------------
  // DOWNLOAD
  // ---------------------------------------------------------
  doc.save(
    `Health_Summary_${new Date()
      .toISOString()
      .slice(0, 10)}.pdf`
  );
};

const fetchHealthTips = async () => {
  try {
    setTipsLoading(true);
    setTipsError("");

    const response = await fetch(
      "http://127.0.0.1:5000/api/health/health-tips"
    );

    const data = await response.json();

    if (!response.ok || data.status !== "success") {
      throw new Error(data.message || "Failed to fetch health tips");
    }

    setHealthTips(data.tips || []);

  } catch (error) {
    console.error("Health Tips Error:", error);

    setTipsError(
      error instanceof Error
        ? error.message
        : "Failed to load health tips"
    );

  } finally {
    setTipsLoading(false);
  }
};

  const loadVitals = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setVitalsError("Please login to view your health vitals.");
      return;
    }

    try {
      setVitalsLoading(true);
      setVitalsError("");

      const response = await fetch(
        "http://127.0.0.1:5000/api/health/vitals",
        {
          headers: getAuthHeaders(),
        }
      );

      const data = await response.json();

      if (!response.ok || data.status !== "success") {
        throw new Error(data.message || "Unable to load health vitals");
      }

      setVitals(Array.isArray(data.vitals) ? data.vitals : []);
    } catch (error: any) {
      console.error("VITALS FETCH ERROR:", error);
      setVitalsError(error.message || "Unable to load health vitals");
      setVitals([]);
    } finally {
      setVitalsLoading(false);
    }
  };

  const loadMedications = async () => {
    if (!requireAuthToken()) return;

    try {
      setMedicineListLoading(true);
      setMedicineListError("");

      const response = await fetch(
        "http://127.0.0.1:5000/api/health/medications",
        {
          headers: getAuthHeaders(),
        }
      );

      const data = await response.json();

      if (!response.ok || data.status !== "success") {
        throw new Error(data.message || "Unable to load medications");
      }

      const mappedMedicines: Medicine[] = (data.medications || []).map((med: any) => ({
        id: med.id,
        name: med.dosage ? `${med.medicine_name} ${med.dosage}` : med.medicine_name,
        time: med.time || "Not scheduled",
        completed: Boolean(med.completed),
        status: med.status || (med.completed ? "Done" : "Upcoming"),
      }));

      setMedicines(mappedMedicines);
    } catch (error: any) {
      console.error("MEDICATION FETCH ERROR:", error);
      setMedicineListError(error.message || "Unable to load medications");
    } finally {
      setMedicineListLoading(false);
    }
  };

  useEffect(() => {
  loadMedications();
  loadVitals();

  const savedContact = localStorage.getItem("emergencyContact");

  if (savedContact) {
    try {
      setEmergencyContact(JSON.parse(savedContact));
    } catch (error) {
      console.error("EMERGENCY CONTACT LOAD ERROR:", error);
      localStorage.removeItem("emergencyContact");
    }
  }
}, []);

  const addMedication = async () => {
    if (!newMedicine.medicine_name.trim() || !newMedicine.time) {
      setAddMedicineError("Medicine name and time are required.");
      return;
    }

    try {
      setAddMedicineLoading(true);
      setAddMedicineError("");

      const response = await fetch(
        "http://127.0.0.1:5000/api/health/medications",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...getAuthHeaders(),
          },
          body: JSON.stringify({
            medicine_name: newMedicine.medicine_name.trim(),
            dosage: newMedicine.dosage.trim(),
            frequency: newMedicine.frequency,
            time: newMedicine.time,
            start_date: newMedicine.start_date || null,
            end_date: newMedicine.end_date || null,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || data.status !== "success") {
        throw new Error(data.message || "Unable to add medication");
      }

      setNewMedicine({
        medicine_name: "",
        dosage: "",
        frequency: "Once daily",
        time: "",
        start_date: "",
        end_date: "",
      });
      setShowAddMedicine(false);
      await loadMedications();
    } catch (error: any) {
      console.error("ADD MEDICATION ERROR:", error);
      setAddMedicineError(error.message || "Unable to add medication");
    } finally {
      setAddMedicineLoading(false);
    }
  };

  const toggleMedicine = async (id: number) => {
    const medicine = medicines.find((m) => m.id === id);
    if (!medicine) return;

    const newCompleted = !medicine.completed;

    // Optimistic UI update
    setMedicines((current) =>
      current.map((m) =>
        m.id === id
          ? {
              ...m,
              completed: newCompleted,
              status: newCompleted ? "Done" : "Upcoming",
            }
          : m
      )
    );

    try {
      const response = await fetch(
        `http://127.0.0.1:5000/api/health/medications/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            ...getAuthHeaders(),
          },
          body: JSON.stringify({
            completed: newCompleted,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || data.status !== "success") {
        throw new Error(data.message || "Unable to update medication");
      }
    } catch (error: any) {
      console.error("MEDICATION UPDATE ERROR:", error);

      // Roll back if backend update failed
      setMedicines((current) =>
        current.map((m) =>
          m.id === id
            ? {
                ...m,
                completed: medicine.completed,
                status: medicine.status,
              }
            : m
        )
      );

      setMedicineListError(error.message || "Unable to update medication");
    }
  };

  const navItems = [
    { id: 'symptom', line1: 'Symptom', line2: 'Checker', icon: Stethoscope },
    { id: 'image', line1: 'Image', line2: 'Analyzer', icon: ImageIcon },
    { id: 'report', line1: 'Report', line2: 'Analyzer', icon: FileText },
    { id: 'medicine', line1: 'Medicine', line2: 'Info', icon: Pill },
    { id: 'hospitals', line1: 'Find', line2: 'Hospitals', icon: Hospital },
    { id: 'appointment', line1: 'Book', line2: 'Appointment', icon: Calendar },
    { id: 'tips', line1: 'Health', line2: 'Tips', icon: Heart },
  ];

  const handleBodyPartClick = (partName: string, defaultSymptom: string) => {
    setSelectedBodyPart(partName);
    setInputMessage((prev) => prev ? `${prev}, ${defaultSymptom}` : `${defaultSymptom}`);
  };

   const analyzeSymptoms = async () => {
  if (!inputMessage.trim()) return;

  setSubmittedMessage(inputMessage);

  try {
    setAnalyzing(true);

    const symptoms = inputMessage
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    const response = await fetch(
      "http://127.0.0.1:5000/api/health/symptom-check",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeaders(),
        },
        body: JSON.stringify({
          symptoms,
        }),
      }
    );

    const data = await response.json();

    console.log("HEALTHCARE RESPONSE:", data);

    if (!response.ok) {
      console.error(data);
      return;
    }

    setPredictions(data.predictions?.predictions || []);
    setMatchedSymptoms(data.predictions?.matched_symptoms || []);
    setUnknownSymptoms(data.predictions?.unknown_symptoms || []);

  } catch (error) {
    console.error("Symptom analysis error:", error);
  } finally {
    setAnalyzing(false);
  }
};

const searchMedicine = async () => {
  if (!medicineName.trim()) return;

  try {
    setMedicineLoading(true);
    setMedicineError("");
    setMedicineInfo(null);

    const response = await fetch(
      "http://127.0.0.1:5000/api/health/medicine-info",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeaders(),
        },
        body: JSON.stringify({
          medicine: medicineName.trim(),
        }),
      }
    );

    const data = await response.json();

    console.log("MEDICINE RESPONSE:", data);

    if (!response.ok) {
      setMedicineError(
        data.message || "Medicine information not found"
      );
      return;
    }

    setMedicineInfo(data.medicine);

  } catch (error) {
    console.error("Medicine API error:", error);

    setMedicineError(
      "Unable to connect to healthcare server."
    );
  } finally {
    setMedicineLoading(false);
  }
};

const analyzeReport = async () => {
  if (!reportFile) {
    setReportError("Please select a report first.");
    return;
  }

  try {
    setReportLoading(true);
    setReportError("");
    setReportResult(null);

    const formData = new FormData();
    formData.append("file", reportFile);

    const response = await fetch(
      "http://127.0.0.1:5000/api/health/report-analyze",
      {
        method: "POST",
        headers: getAuthHeaders(),
        body: formData,
      }
    );

    const data = await response.json();

    console.log("REPORT RESPONSE:", data);

    if (!response.ok) {
      setReportError(
        data.message || "Unable to analyze report."
      );
      return;
    }

    setReportResult(data);

  } catch (error) {
    console.error("Report analysis error:", error);

    setReportError(
      "Unable to connect to healthcare server."
    );
  } finally {
    setReportLoading(false);
  }
};

// =========================================================
// HOSPITAL SEARCH
// =========================================================

const findNearbyHospitals = async () => {
  try {
    setHospitalLoading(true);
    setHospitalError("");
    setHospitals([]);

    // Get user's current location
    if (!navigator.geolocation) {
      setHospitalError(
        "Geolocation is not supported by your browser."
      );
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;

          setUserLocation({ latitude, longitude });

          console.log("USER LOCATION:");
          console.log("Latitude:", latitude);
          console.log("Longitude:", longitude);
          console.log("LOCATION ACCURACY:", position.coords.accuracy, "meters");
console.log(
  "GOOGLE MAPS:",
  `https://www.google.com/maps?q=${latitude},${longitude}`
);

          const response = await fetch(
            `http://127.0.0.1:5000/api/health/hospitals?latitude=${latitude}&longitude=${longitude}&radius=5000`,
            {
              headers: getAuthHeaders(),
            }
          );

          const data = await response.json();

          console.log("HOSPITAL RESPONSE:", data);

          if (!response.ok || data.status !== "success") {
            throw new Error(
              data.message || "Unable to find hospitals"
            );
          }

          setHospitals(data.hospitals || []);

          if (!data.hospitals || data.hospitals.length === 0) {
            setHospitalError(
              "No hospitals found near your location."
            );
          }

        } catch (error: any) {

          console.error(
            "HOSPITAL SEARCH ERROR:",
            error
          );

          setHospitalError(
            error.message ||
            "Failed to find nearby hospitals."
          );

        } finally {
          setHospitalLoading(false);
        }
      },

      (error) => {

        console.error(
          "LOCATION ERROR:",
          error
        );

        setHospitalLoading(false);

        if (error.code === 1) {
          setHospitalError(
            "Location permission denied. Please allow location access."
          );
        } else if (error.code === 2) {
          setHospitalError(
            "Unable to determine your location."
          );
        } else {
          setHospitalError(
            "Location request timed out."
          );
        }
      },

      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );

  } catch (error: any) {

    console.error(
      "HOSPITAL ERROR:",
      error
    );

    setHospitalLoading(false);

    setHospitalError(
      error.message ||
      "Something went wrong."
    );
  }
};
// =========================================================
// EMERGENCY CONTACT
// =========================================================

const saveEmergencyContact = () => {
  if (!contactForm.name.trim() || !contactForm.phone.trim()) {
    alert("Please enter contact name and phone number.");
    return;
  }

  const contact = {
    name: contactForm.name.trim(),
    phone: contactForm.phone.trim(),
    relation: contactForm.relation.trim(),
  };

  localStorage.setItem(
    "emergencyContact",
    JSON.stringify(contact)
  );

  setEmergencyContact(contact);
  setShowEmergencyContact(false);

  setContactForm({
    name: "",
    phone: "",
    relation: "",
  });
};

const deleteEmergencyContact = () => {
  localStorage.removeItem("emergencyContact");
  setEmergencyContact(null);
};

const editEmergencyContact = () => {
  if (!emergencyContact) return;

  setContactForm({
    name: emergencyContact.name,
    phone: emergencyContact.phone,
    relation: emergencyContact.relation,
  });

  setShowEmergencyContact(true);
};

const shareEmergencyLocation = () => {
  if (!userLocation) {
    alert("Please get your current location first.");
    return;
  }

  const locationUrl =
    `https://www.google.com/maps?q=${userLocation.latitude},${userLocation.longitude}`;

  if (navigator.share) {
    navigator.share({
      title: "Emergency Location",
      text: "My current emergency location:",
      url: locationUrl,
    }).catch((error) => {
      console.log("Share cancelled:", error);
    });
  } else if (navigator.clipboard) {
    navigator.clipboard.writeText(locationUrl);
    alert("Location link copied to clipboard.");
  } else {
    alert(locationUrl);
  }
};
  // BioDigital Layer Items Config
  const layersList = [
    { id: 'organs', label: 'Organs & Vascular', icon: Heart, color: 'text-rose-400' },
    { id: 'skeletal', label: 'Skeletal System', icon: Bone, color: 'text-cyan-400' },
    { id: 'muscular', label: 'Muscular System', icon: Activity, color: 'text-amber-400' },
    { id: 'nervous', label: 'Nervous System', icon: Zap, color: 'text-yellow-400' },
    { id: 'skin', label: 'Outer Surface', icon: Dna, color: 'text-blue-400' },
  ];

  const activeLayerInfo = layersList.find((l) => l.id === activeLayer) ?? layersList[0];
  const ActiveLayerIcon = activeLayerInfo.icon;

  useEffect(() => {
  if (activeTab === "tips") {
    fetchHealthTips();
  }
}, [activeTab]);

  return (
    <div className="min-h-screen bg-[#141b2e] bg-[radial-gradient(ellipse_80%80%_at_50%-20%,rgba(120,119,198,0.18),rgba(255,255,255,0))] text-slate-200 p-4 md:p-6 font-sans">
      <div className="max-w-[1600px] mx-auto flex flex-col gap-6">
        
        {/* ================= HEADER ================= */}
        <header className="flex flex-wrap items-center justify-between bg-[#121826]/70 backdrop-blur-xl border border-blue-500/30 rounded-2xl p-4 shadow-[0_0_20px_rgba(59,130,246,0.1)] gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-400/40 flex items-center justify-center text-blue-400 shadow-[0_0_10px_rgba(59,130,246,0.2)]">
              <Stethoscope className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white tracking-wide">Healthcare Agent</h1>
              <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-0.5">
                <span>AI Medical Assistant</span>
                <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <button 
              onClick={() => setLanguage(language === 'EN' ? 'MR' : 'EN')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#1A2234]/80 border border-blue-500/30 hover:border-blue-400 text-slate-300 text-xs font-medium transition"
            >
              <Globe className="w-3.5 h-3.5 text-blue-400" />
              <span>{language === 'EN' ? 'English' : 'मराठी'}</span>
            </button>

             <button
  type="button"
  onClick={exportHealthSummaryPDF}
  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#1A2234]/80 border border-blue-500/30 hover:border-blue-400 text-slate-300 text-xs font-medium transition"
>
  <Download className="w-3.5 h-3.5 text-blue-400" />
  <span>Export Summary</span>
</button>

            <button 
              onClick={() => setShowSosConfirm(true)}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-rose-600/20 border border-rose-500/60 hover:bg-rose-600 text-rose-300 hover:text-white text-xs font-bold transition shadow-[0_0_15px_rgba(244,63,94,0.3)] animate-pulse"
            >
              <AlertOctagon className="w-4 h-4 text-rose-400" />
              <span>EMERGENCY SOS</span>
            </button>
          </div>
        </header>
        {/* ================= EMERGENCY SOS CONFIRMATION ================= */}
{showSosConfirm && (
  <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">

    <div className="w-full max-w-md bg-[#121826] border border-rose-500/50 rounded-2xl p-6 shadow-[0_0_35px_rgba(244,63,94,0.35)]">

      <div className="flex items-center gap-3 mb-5">

        <div className="w-11 h-11 rounded-xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center">
          <AlertOctagon className="w-6 h-6 text-rose-400" />
        </div>

        <div>
          <h3 className="text-sm font-bold text-white">
            Emergency SOS
          </h3>

          <p className="text-[11px] text-slate-400 mt-1">
            Emergency assistance is about to be activated.
          </p>
        </div>

      </div>

      <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 mb-5">

        <p className="text-xs text-rose-200 leading-relaxed">
          This action is intended for emergencies. You will be given
          the option to contact emergency services.
        </p>

      </div>

      <div className="flex gap-3">

        <button
          type="button"
          onClick={() => setShowSosConfirm(false)}
          className="flex-1 py-2.5 rounded-xl bg-slate-700/50 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition"
        >
          Cancel
        </button>

        <button
          type="button"
          onClick={() => {
  setShowSosConfirm(false);
  setShowSosAlert(true);

  if (!navigator.geolocation) {
    return;
  }

  setSosLoading(true);

  navigator.geolocation.getCurrentPosition(
    (position) => {
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;

      setUserLocation({
        latitude,
        longitude,
      });

      console.log("SOS LOCATION:");
      console.log("Latitude:", latitude);
      console.log("Longitude:", longitude);

      setSosLoading(false);
    },
    (error) => {
      console.error("SOS LOCATION ERROR:", error);
      setSosLoading(false);
    },
    {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0,
    }
  );
}}
          className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition"
        >
          Continue
        </button>

      </div>

    </div>

  </div>
)}

        {/* ================= SOS EMERGENCY PANEL ================= */}
{showSosAlert && (
  <div className="bg-rose-950/80 border border-rose-500/60 backdrop-blur-md rounded-2xl p-5 text-rose-100 shadow-[0_0_25px_rgba(244,63,94,0.4)]">

    <div className="flex items-start justify-between gap-4">

      <div className="flex items-start gap-3">

        <div className="w-11 h-11 rounded-xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center shrink-0">
          <AlertOctagon className="w-6 h-6 text-rose-400" />
        </div>

        <div>
          <h4 className="font-bold text-sm text-white">
            Emergency SOS Activated
          </h4>

          <p className="text-xs text-rose-300 mt-1">
            Emergency assistance options are ready.
          </p>
        </div>

      </div>

      <button
        type="button"
        onClick={() => setShowSosAlert(false)}
        className="p-1.5 rounded-lg hover:bg-rose-800/50"
      >
        <X className="w-4 h-4" />
      </button>

    </div>


    {/* Emergency Actions */}
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-5">

      {/* CALL 108 */}
      <button
        type="button"
        onClick={() => {
          window.location.href = "tel:108";
        }}
        className="flex items-center justify-center gap-2 py-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition"
      >
        <Phone className="w-4 h-4" />
        <span>Call 108 Ambulance</span>
      </button>


      {/* GET LOCATION */}
      <button
        type="button"
        onClick={() => {

          if (!navigator.geolocation) {
            return;
          }

          setSosLoading(true);

          navigator.geolocation.getCurrentPosition(
            (position) => {

              const latitude = position.coords.latitude;
              const longitude = position.coords.longitude;

              setUserLocation({
                latitude,
                longitude,
              });

              console.log("SOS LOCATION:", {
                latitude,
                longitude,
              });

              setSosLoading(false);
            },

            (error) => {

              console.error("SOS LOCATION ERROR:", error);

              setSosLoading(false);
            },

            {
              enableHighAccuracy: true,
              timeout: 10000,
              maximumAge: 0,
            }
          );
        }}
        disabled={sosLoading}
        className="flex items-center justify-center gap-2 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition disabled:opacity-50"
      >
        <MapPin className="w-4 h-4" />

        <span>
          {sosLoading
            ? "Getting Location..."
            : "Get Current Location"}
        </span>

      </button>

    </div>


    {/* LOCATION RESULT */}
    {userLocation && (
      <div className="mt-4 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30">

        <div className="flex items-center gap-2 mb-2">

          <MapPin className="w-4 h-4 text-emerald-400" />

          <span className="text-xs font-bold text-emerald-300">
            Current Location Detected
          </span>

        </div>

        <p className="text-[11px] text-slate-300">
          Latitude: {userLocation.latitude.toFixed(6)}
        </p>

        <p className="text-[11px] text-slate-300">
          Longitude: {userLocation.longitude.toFixed(6)}
        </p>


        <button
          type="button"
          onClick={() => {
            const mapsUrl =
              `https://www.google.com/maps?q=${userLocation.latitude},${userLocation.longitude}`;

            window.open(
              mapsUrl,
              "_blank",
              "noopener,noreferrer"
            );
          }}
          className="mt-3 w-full py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition"
        >
          <span>🗺️ Open Location in Google Maps</span>
        </button>

      </div>
    )}
    {/* ================= EMERGENCY CONTACT ================= */}

<div className="mt-4 p-4 rounded-xl bg-[#121826]/80 border border-rose-500/20">

  {/* HEADER */}
  <div className="flex items-center justify-between gap-3 mb-3">

    <div>
      <h4 className="text-xs font-bold text-white">
        Emergency Contact
      </h4>

      <p className="text-[10px] text-slate-500 mt-1">
        Trusted person for emergency assistance
      </p>
    </div>

    {!emergencyContact && (
      <button
        type="button"
        onClick={() => setShowEmergencyContact(true)}
        className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-[10px] font-bold transition"
      >
        <Plus className="w-3.5 h-3.5" />
        Add Contact
      </button>
    )}

  </div>


  {/* ================= SAVED CONTACT ================= */}

  {emergencyContact && (
    <div className="p-3 rounded-xl bg-[#161D2F] border border-blue-500/20">

      <div className="flex items-center justify-between gap-3">

        <div className="min-w-0">

          <p className="text-xs font-bold text-white">
            {emergencyContact.name}
          </p>

          {emergencyContact.relation && (
            <p className="text-[10px] text-slate-400 mt-0.5">
              {emergencyContact.relation}
            </p>
          )}

          <p className="text-[11px] text-blue-400 mt-1">
            {emergencyContact.phone}
          </p>

        </div>


        {/* CONTACT ACTIONS */}

        <div className="flex items-center gap-1.5">

          {/* CALL */}

          <button
            type="button"
            onClick={() => {
              window.location.href =
                `tel:${emergencyContact.phone}`;
            }}
            className="p-2 rounded-lg bg-emerald-600/20 hover:bg-emerald-600 text-emerald-400 hover:text-white transition"
            title="Call Contact"
          >
            <Phone className="w-3.5 h-3.5" />
          </button>


          {/* EDIT */}

          <button
            type="button"
            onClick={editEmergencyContact}
            className="p-2 rounded-lg bg-blue-600/20 hover:bg-blue-600 text-blue-400 hover:text-white transition"
            title="Edit Contact"
          >
            <ClipboardList className="w-3.5 h-3.5" />
          </button>


          {/* DELETE */}

          <button
            type="button"
            onClick={deleteEmergencyContact}
            className="p-2 rounded-lg bg-rose-600/20 hover:bg-rose-600 text-rose-400 hover:text-white transition"
            title="Delete Contact"
          >
            <X className="w-3.5 h-3.5" />
          </button>

        </div>

      </div>


      {/* SHARE LOCATION */}

      <button
        type="button"
        onClick={shareEmergencyLocation}
        disabled={!userLocation}
        className="w-full mt-3 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-bold transition disabled:opacity-40 disabled:cursor-not-allowed"
      >
        📍 Share Emergency Location
      </button>

    </div>
  )}


  {/* ================= ADD / EDIT FORM ================= */}

  {showEmergencyContact && (
    <div className="mt-3 p-3 rounded-xl bg-[#161D2F] border border-blue-500/20">

      <div className="space-y-3">

        {/* NAME */}

        <div>
          <label className="block text-[10px] text-slate-400 mb-1">
            Contact Name
          </label>

          <input
            type="text"
            value={contactForm.name}
            onChange={(e) =>
              setContactForm({
                ...contactForm,
                name: e.target.value,
              })
            }
            placeholder="Enter contact name"
            className="w-full bg-[#121826] border border-blue-500/20 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 outline-none focus:border-blue-400"
          />
        </div>


        {/* PHONE */}

        <div>
          <label className="block text-[10px] text-slate-400 mb-1">
            Phone Number
          </label>

          <input
            type="tel"
            value={contactForm.phone}
            onChange={(e) =>
              setContactForm({
                ...contactForm,
                phone: e.target.value,
              })
            }
            placeholder="Enter phone number"
            className="w-full bg-[#121826] border border-blue-500/20 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 outline-none focus:border-blue-400"
          />
        </div>


        {/* RELATION */}

        <div>
          <label className="block text-[10px] text-slate-400 mb-1">
            Relation
          </label>

          <input
            type="text"
            value={contactForm.relation}
            onChange={(e) =>
              setContactForm({
                ...contactForm,
                relation: e.target.value,
              })
            }
            placeholder="Father / Mother / Brother"
            className="w-full bg-[#121826] border border-blue-500/20 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 outline-none focus:border-blue-400"
          />
        </div>


        {/* BUTTONS */}

        <div className="flex gap-2 pt-1">

          <button
            type="button"
            onClick={() => {
              setShowEmergencyContact(false);

              setContactForm({
                name: "",
                phone: "",
                relation: "",
              });
            }}
            className="flex-1 py-2 rounded-lg bg-slate-700/50 hover:bg-slate-700 text-slate-300 text-[10px] font-semibold transition"
          >
            Cancel
          </button>


          <button
            type="button"
            onClick={saveEmergencyContact}
            className="flex-1 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-bold transition"
          >
            Save Contact
          </button>

        </div>

      </div>

    </div>
  )}

</div>


    <p className="text-[10px] text-slate-500 mt-4">
      Location access requires browser permission.
      Calling 108 depends on device/browser telephone support.
    </p>

  </div>
)}

        {/* ================= TOP NAVIGATION TABS ================= */}
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-3">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-3 p-3 rounded-xl border backdrop-blur-md text-left transition-all ${
                  isActive
                    ? 'bg-blue-600/20 border-blue-400 text-white shadow-[0_0_18px_rgba(59,130,246,0.3)]'
                    : 'bg-[#121826]/50 border-blue-500/20 text-slate-400 hover:text-slate-200 hover:border-blue-400/50 hover:bg-[#161D2F]/60'
                }`}
              >
                <div className={ `p-2 rounded-lg shrink-0 ${isActive ? 'bg-blue-600 text-white shadow-[0_0_10px_rgba(59,130,246,0.5)]' : 'bg-slate-800/60 text-slate-400'}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex flex-col text-xs leading-tight font-medium">
                  <span>{item.line1}</span>
                  <span>{item.line2}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* ================= MAIN 3-COLUMN LAYOUT ================= */}
         <div
  className={
    activeTab === "symptom"
      ? "grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch"
      : "w-full flex justify-center"
  }
>
          
          {/* ================= LEFT COLUMN: BIODIGITAL 3D LAYERED BODY MAP (3 COLS) ================= */}
           {activeTab === "symptom" && (
  <div className="lg:col-span-3 flex flex-col gap-6">
            
            {/* BioDigital Interactive Viewer */}
            <div className="bg-[#121826]/60 backdrop-blur-xl border border-blue-500/30 rounded-2xl p-5 shadow-[0_0_20px_rgba(59,130,246,0.1)] flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-white flex items-center gap-2">
                  <Layers className="w-4 h-4 text-blue-400" />
                  BioDigital 3D Viewer
                </h3>
                <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20 font-mono">
                  3D Engine
                </span>
              </div>

              {/* Layer Selection Dropdown */}
              <div className="flex flex-col gap-1.5">
                <p className="text-[10px] text-slate-400 font-medium px-1">Select Anatomy Layer:</p>
                <div className="relative">
                  <select
                    value={activeLayer}
                    onChange={(e) => setActiveLayer(e.target.value as BodyLayer)}
                    className="w-full appearance-none bg-[#161D2F]/70 border border-blue-500/30 focus:border-blue-400 text-white text-xs font-medium rounded-xl pl-9 pr-9 py-2.5 outline-none transition cursor-pointer shadow-[0_0_10px_rgba(59,130,246,0.1)]"
                  >
                    {layersList.map((layer) => (
                      <option key={layer.id} value={layer.id} className="bg-[#161D2F] text-white">
                        {layer.label}
                      </option>
                    ))}
                  </select>
                  <ActiveLayerIcon className={`w-3.5 h-3.5 ${activeLayerInfo.color} absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none`} />
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* ==== 3D Canvas: real GLB skeleton for 'skeletal' layer, procedural model for the rest ==== */}
              <Anatomy3DCanvas activeLayer={activeLayer} onSelectPart={handleBodyPartClick} />

              <p className="text-[11px] text-slate-400 text-center">
                {selectedBodyPart ? `Active Focus: ${selectedBodyPart}` : 'Tap interactive hotspots to select symptoms'}
              </p>
            </div>

            {/* Quick Upload Card */}
            <div className="bg-[#121826]/60 backdrop-blur-xl border border-blue-500/30 rounded-2xl p-5 shadow-[0_0_20px_rgba(59,130,246,0.1)] flex flex-col gap-4">
              <h3 className="text-xs font-bold text-white flex items-center gap-2">
                <Upload className="w-4 h-4 text-blue-400" /> Quick File Upload
              </h3>

              <div className="border border-dashed border-blue-500/35 rounded-xl p-4 flex flex-col items-center justify-center text-center gap-2 bg-[#161D2F]/30 backdrop-blur-md hover:border-blue-400 transition group cursor-pointer">
                <div className="w-9 h-9 rounded-full bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-400 group-hover:scale-110 transition">
                  <Upload className="w-4 h-4" />
                </div>
                <p className="text-xs text-slate-300 font-medium">Upload Report / Image</p>
                <p className="text-[10px] text-slate-500">PDF, PNG, JPG up to 10MB</p>
              </div>

              <label className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold text-center cursor-pointer transition shadow-[0_0_12px_rgba(59,130,246,0.3)] active:scale-95">
                Choose File
                <input
                  type="file"
                  className="hidden"
                  onChange={(e) => setSelectedFile(e.target.files ? e.target.files[0] : null)}
                />
              </label>
              {selectedFile && (
                <p className="text-[10px] text-blue-400 text-center font-mono truncate">
                  {selectedFile.name}
                </p>
              )}
            </div>

          </div>
        )}

          {/* ================= CENTER COLUMN: CHAT WORKSPACE (6 COLS) ================= */}
            <div
  className={
    activeTab === "symptom"
      ? "lg:col-span-6 flex flex-col gap-6"
      : "w-[92%] max-w-[1200px] mx-auto flex flex-col gap-6"
  }
>

            

            {/* ================= MEDICINE INFO ================= */}
{activeTab === "medicine" && (
  <div className="min-h-[620px] bg-[#121826]/60 backdrop-blur-xl border border-blue-500/30 rounded-2xl p-5 shadow-[0_0_25px_rgba(59,130,246,0.12)] flex flex-col">

    <div className="flex items-center gap-3 mb-5">
      <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center">
        <Pill className="w-5 h-5 text-blue-400" />
      </div>

      <div>
        <h2 className="text-sm font-bold text-white">
          Medicine Information
        </h2>

        <p className="text-xs text-slate-400 mt-1">
          Search official medicine information
        </p>
      </div>
    </div>

    {/* Search */}
    <div className="flex gap-3">

      <input
        type="text"
        value={medicineName}
        onChange={(e) => setMedicineName(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            searchMedicine();
          }
        }}
        placeholder="Enter medicine name..."
        className="flex-1 bg-[#161D2F]/70 border border-blue-500/30 focus:border-blue-400 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 outline-none"
      />

      <button
        onClick={searchMedicine}
        disabled={medicineLoading || !medicineName.trim()}
        className="px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold disabled:opacity-50"
      >
        {medicineLoading ? "Searching..." : "Search"}
      </button>

    </div>

    {/* Error */}
    {medicineError && (
      <div className="mt-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
        {medicineError}
      </div>
    )}

    {/* Result */}
    {medicineInfo && (
       <div className="mt-5 max-h-[400px] overflow-y-auto pr-2 space-y-4 custom-scrollbar flex-1">

        {/* Medicine */}
        <div className="p-4 rounded-xl bg-[#161D2F]/70 border border-blue-500/25">
          <p className="text-[10px] text-slate-400">
            Medicine
          </p>

          <h3 className="text-base font-bold text-white mt-1">
            {medicineInfo.name}
          </h3>

          {medicineInfo.generic_name && (
            <p className="text-xs text-slate-400 mt-1">
              Generic: {medicineInfo.generic_name}
            </p>
          )}

          {medicineInfo.manufacturer && (
            <p className="text-xs text-slate-400 mt-1">
              Manufacturer: {medicineInfo.manufacturer}
            </p>
          )}
        </div>

        {/* Purpose */}
        {medicineInfo.purpose && (
          <div className="p-4 rounded-xl bg-[#161D2F]/60 border border-blue-500/20">
            <h4 className="text-xs font-bold text-blue-400 mb-2">
              Purpose
            </h4>

            <p className="text-xs text-slate-300 leading-relaxed">
              {medicineInfo.purpose}
            </p>
          </div>
        )}

        {/* Uses */}
        {medicineInfo.indications && (
          <div className="p-4 rounded-xl bg-[#161D2F]/60 border border-emerald-500/20">
            <h4 className="text-xs font-bold text-emerald-400 mb-2">
              Uses / Indications
            </h4>

            <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-line">
              {medicineInfo.indications}
            </p>
          </div>
        )}

        {/* Warnings */}
        {medicineInfo.warnings && (
          <div className="p-4 rounded-xl bg-rose-950/30 border border-rose-500/30">
            <h4 className="text-xs font-bold text-rose-400 mb-2 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              Warnings
            </h4>

            <p className="text-xs text-rose-200 leading-relaxed whitespace-pre-line">
              {medicineInfo.warnings}
            </p>
          </div>
        )}

        {/* Side Effects */}
        {medicineInfo.adverse_reactions && (
          <div className="p-4 rounded-xl bg-[#161D2F]/60 border border-amber-500/20">
            <h4 className="text-xs font-bold text-amber-400 mb-2">
              Adverse Reactions
            </h4>

            <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-line">
              {medicineInfo.adverse_reactions}
            </p>
          </div>
        )}

        {/* Contraindications */}
        {medicineInfo.contraindications && (
          <div className="p-4 rounded-xl bg-[#161D2F]/60 border border-rose-500/20">
            <h4 className="text-xs font-bold text-rose-400 mb-2">
              Contraindications
            </h4>

            <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-line">
              {medicineInfo.contraindications}
            </p>
          </div>
        )}

        {/* Disclaimer */}
        <div className="flex items-start gap-2 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
          <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />

          <p className="text-[10px] text-amber-300 leading-relaxed">
            This information is provided for informational purposes only.
            Consult a qualified healthcare professional before taking any medicine.
          </p>
        </div>

      </div>
    )}

  </div>
)}

{activeTab === "tips" && (
  <div className="w-full space-y-6 rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 p-6 min-h-full">

    {/* Header */}
    <div>
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-100">
          <Heart className="h-6 w-6 text-green-600" />
        </div>

        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Health Tips
          </h1>

          <p className="text-sm text-gray-500">
            Evidence-based tips for a healthier lifestyle
          </p>
        </div>
      </div>
    </div>

    {/* Search */}
    <div className="relative">
      <input
        type="text"
        value={tipSearch}
        onChange={(e) => setTipSearch(e.target.value)}
        placeholder="Search health tips..."
        className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-11 pr-4 text-sm outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
      />

      <svg
        className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M21 21l-4.35-4.35m2.35-5.65a8 8 0 11-16 0 8 8 0 0116 0z"
        />
      </svg>
    </div>

    {/* Categories */}
    <div className="flex gap-2 overflow-x-auto pb-1">
      {[
        "All",
        "Nutrition",
        "Fitness",
        "Sleep",
        "Mental Health",
        "Preventive Care",
        "Lifestyle",
      ].map((category) => (
        <button
          key={category}
          onClick={() => setTipCategory(category)}
          className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition ${
            tipCategory === category
              ? "bg-green-600 text-white shadow-sm"
              : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
          }`}
        >
          {category}
        </button>
      ))}
    </div>

    {/* Loading */}
    {tipsLoading && (
      <div className="flex items-center justify-center rounded-2xl bg-white p-12 shadow-sm">
        <div className="text-center">
          <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-green-600" />

          <p className="text-sm text-gray-500">
            Loading health tips...
          </p>
        </div>
      </div>
    )}

    {/* Error */}
    {!tipsLoading && tipsError && (
      <div className="rounded-xl border border-red-200 bg-red-50 p-4">
        <p className="font-medium text-red-700">
          Unable to load health tips
        </p>

        <p className="mt-1 text-sm text-red-600">
          {tipsError}
        </p>

        <button
          onClick={fetchHealthTips}
          className="mt-3 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
        >
          Try Again
        </button>
      </div>
    )}

    {/* Tips */}
    {!tipsLoading && !tipsError && (
      <>
        {healthTips
          .filter((tip) => {
            const matchesCategory =
              tipCategory === "All" ||
              tip.category?.toLowerCase() === tipCategory.toLowerCase();

            const searchText = tipSearch.toLowerCase().trim();

            const matchesSearch =
              !searchText ||
              tip.title?.toLowerCase().includes(searchText) ||
              tip.short_description?.toLowerCase().includes(searchText) ||
              tip.category?.toLowerCase().includes(searchText);

            return matchesCategory && matchesSearch;
          })
          .length === 0 ? (
          <div className="rounded-2xl bg-white p-12 text-center shadow-sm">
            <Heart className="mx-auto h-12 w-12 text-gray-300" />

            <h3 className="mt-4 text-lg font-semibold text-gray-800">
              No health tips found
            </h3>

            <p className="mt-1 text-sm text-gray-500">
              Try another search or category.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {healthTips
              .filter((tip) => {
                const matchesCategory =
                  tipCategory === "All" ||
                  tip.category?.toLowerCase() === tipCategory.toLowerCase();

                const searchText = tipSearch.toLowerCase().trim();

                const matchesSearch =
                  !searchText ||
                  tip.title?.toLowerCase().includes(searchText) ||
                  tip.short_description?.toLowerCase().includes(searchText) ||
                  tip.category?.toLowerCase().includes(searchText);

                return matchesCategory && matchesSearch;
              })
              .map((tip) => (
                 <div
  key={tip.id}
  className={`
    group relative overflow-hidden rounded-3xl p-[1px]
    transition-all duration-500
    hover:-translate-y-2
    ${
      tip.category?.toLowerCase() === "nutrition"
        ? "bg-gradient-to-br from-emerald-400 via-teal-400 to-cyan-500 shadow-[0_0_25px_rgba(16,185,129,0.35)] hover:shadow-[0_0_45px_rgba(16,185,129,0.65)]"
        : tip.category?.toLowerCase() === "fitness"
        ? "bg-gradient-to-br from-cyan-400 via-blue-500 to-indigo-500 shadow-[0_0_25px_rgba(6,182,212,0.35)] hover:shadow-[0_0_45px_rgba(6,182,212,0.65)]"
        : tip.category?.toLowerCase() === "mental health"
        ? "bg-gradient-to-br from-pink-400 via-fuchsia-500 to-purple-500 shadow-[0_0_25px_rgba(236,72,153,0.35)] hover:shadow-[0_0_45px_rgba(236,72,153,0.65)]"
        : tip.category?.toLowerCase() === "lifestyle"
        ? "bg-gradient-to-br from-cyan-300 via-teal-400 to-emerald-400 shadow-[0_0_25px_rgba(45,212,191,0.35)] hover:shadow-[0_0_45px_rgba(45,212,191,0.65)]"
        : "bg-gradient-to-br from-amber-300 via-orange-400 to-pink-400 shadow-[0_0_25px_rgba(251,146,60,0.35)] hover:shadow-[0_0_45px_rgba(251,146,60,0.65)]"
    }
  `}
>
  {/* Glass Card */}
  <div
    className="
      relative h-full overflow-hidden rounded-[23px]
      border border-white/10
      bg-slate-900/75
      p-5
      backdrop-blur-2xl
    "
  >

    {/* Background Glow */}
    <div
      className={`
        pointer-events-none absolute -right-16 -top-16
        h-40 w-40 rounded-full blur-3xl opacity-30
        ${
          tip.category?.toLowerCase() === "nutrition"
            ? "bg-emerald-400"
            : tip.category?.toLowerCase() === "fitness"
            ? "bg-cyan-400"
            : tip.category?.toLowerCase() === "mental health"
            ? "bg-fuchsia-400"
            : tip.category?.toLowerCase() === "lifestyle"
            ? "bg-teal-400"
            : "bg-orange-400"
        }
      `}
    />

    {/* Card Header */}
    <div className="relative flex items-start justify-between gap-4">

      <div className="flex items-center gap-3">

        {/* Icon */}
        <div
          className={`
            flex h-12 w-12 shrink-0 items-center justify-center
            rounded-2xl border border-white/20
            backdrop-blur-xl
            transition-all duration-500
            group-hover:scale-110
            ${
              tip.category?.toLowerCase() === "nutrition"
                ? "bg-emerald-400/20 shadow-[0_0_20px_rgba(16,185,129,0.45)]"
                : tip.category?.toLowerCase() === "fitness"
                ? "bg-cyan-400/20 shadow-[0_0_20px_rgba(6,182,212,0.45)]"
                : tip.category?.toLowerCase() === "mental health"
                ? "bg-pink-400/20 shadow-[0_0_20px_rgba(236,72,153,0.45)]"
                : "bg-teal-400/20 shadow-[0_0_20px_rgba(45,212,191,0.45)]"
            }
          `}
        >
          <Heart className="h-6 w-6 text-white" />
        </div>

        {/* Category + Title */}
        <div className="min-w-0">

          <span
            className={`
              text-[11px] font-bold uppercase tracking-[0.18em]
              ${
                tip.category?.toLowerCase() === "nutrition"
                  ? "text-emerald-300"
                  : tip.category?.toLowerCase() === "fitness"
                  ? "text-cyan-300"
                  : tip.category?.toLowerCase() === "mental health"
                  ? "text-pink-300"
                  : "text-teal-300"
              }
            `}
          >
            {tip.category}
          </span>

          <h3 className="mt-1 line-clamp-2 text-lg font-bold leading-tight text-white">
            {tip.title}
          </h3>

        </div>
      </div>

      {/* Featured */}
      {tip.is_featured && (
        <span
          className="
            flex shrink-0 items-center gap-1
            rounded-full
            border border-amber-300/40
            bg-amber-400/10
            px-2.5 py-1
            text-[10px] font-bold
            text-amber-300
            shadow-[0_0_12px_rgba(251,191,36,0.25)]
          "
        >
          <span>★</span>
          Featured
        </span>
      )}

    </div>

    {/* Description */}
    <p className="relative mt-5 text-sm leading-6 text-slate-300">
      {tip.short_description}
    </p>

    {/* Divider */}
    <div className="relative my-5 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

    {/* Why It Matters */}
    {tip.why_it_matters && (
      <div
        className="
          relative rounded-2xl
          border border-white/10
          bg-white/[0.04]
          p-4
          backdrop-blur-xl
        "
      >
        <div className="flex items-center gap-2">

          <div
            className="
              flex h-7 w-7 items-center justify-center
              rounded-lg
              bg-yellow-400/10
              text-yellow-300
            "
          >
            💡
          </div>

          <p className="text-[11px] font-bold uppercase tracking-widest text-yellow-300">
            Why it matters
          </p>

        </div>

        <p className="mt-2 text-sm leading-6 text-slate-300">
          {tip.why_it_matters}
        </p>
      </div>
    )}

    {/* Quick Action */}
    {tip.quick_action && (
      <div className="relative mt-4">

        <div className="flex items-center gap-2">

          <div
            className="
              flex h-7 w-7 items-center justify-center
              rounded-lg
              bg-cyan-400/10
              text-cyan-300
            "
          >
            ⚡
          </div>

          <p className="text-[11px] font-bold uppercase tracking-widest text-cyan-300">
            Quick action
          </p>

        </div>

        <p className="mt-2 text-sm font-medium leading-6 text-slate-200">
          {tip.quick_action}
        </p>

      </div>
    )}

    {/* Bottom */}
    {tip.source_name && (
      <div
        className="
          relative mt-5 flex items-center
          justify-between
          border-t border-white/10
          pt-4
        "
      >

        {/* Source */}
        <div className="flex items-center gap-2">

          <div
            className="
              flex h-8 w-8 items-center justify-center
              rounded-lg
              border border-white/10
              bg-white/5
            "
          >
            🔗
          </div>

          <div>
            <p className="text-[10px] uppercase tracking-wider text-slate-500">
              Source
            </p>

            <p className="text-sm font-semibold text-slate-200">
              {tip.source_name}
            </p>
          </div>

        </div>

        {/* Read Source */}
        {tip.source_url && (
          <a
            href={tip.source_url}
            target="_blank"
            rel="noopener noreferrer"
            className="
              group/source
              flex items-center gap-2
              rounded-xl
              border border-white/20
              bg-white/5
              px-4 py-2
              text-xs font-bold text-white
              backdrop-blur-xl
              transition-all duration-300
              hover:bg-white/10
              hover:border-white/40
              hover:shadow-[0_0_20px_rgba(255,255,255,0.15)]
            "
          >
            Read Source

            <svg
              className="h-4 w-4 transition-transform group-hover/source:translate-x-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M14 5l7 7m0 0l-7 7m7-7H3"
              />
            </svg>

          </a>
        )}

      </div>
    )}

    {/* Decorative Glow Line */}
    <div
      className="
        pointer-events-none absolute
        bottom-0 left-8 right-8
        h-px
        bg-gradient-to-r
        from-transparent
        via-white/30
        to-transparent
        opacity-50
      "
    />

  </div>
</div>
              ))}
          </div>
        )}
      </>
    )}

  </div>
)}

{/* =========================================================
    FIND HOSPITAL
========================================================= */}

{activeTab === "hospitals" && (

  <div className="w-full min-h-[580px] bg-[#121826]/60 backdrop-blur-xl border border-blue-500/30 rounded-2xl p-6 shadow-[0_0_25px_rgba(59,130,246,0.12)]">

    {/* ================= HEADER ================= */}

    <div className="flex items-center justify-between mb-6">

      <div className="flex items-center gap-3">

        <div className="w-11 h-11 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center">

          <Hospital className="w-5 h-5 text-blue-400" />

        </div>

        <div>

          <h2 className="text-base font-bold text-white">
            Find Nearby Hospitals
          </h2>

          <p className="text-xs text-slate-400 mt-1">
            Find hospitals near your current location
          </p>

        </div>

      </div>

      <div className="hidden sm:flex items-center gap-2 text-[10px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-full">

        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />

        Location Based

      </div>

    </div>


    {/* ================= SEARCH AREA ================= */}

    <div className="p-4 rounded-2xl bg-[#161D2F]/60 border border-blue-500/20 mb-6">

      <div className="flex flex-col md:flex-row gap-3">

        <button
          onClick={findNearbyHospitals}
          disabled={hospitalLoading}
          className="flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
        >

          {hospitalLoading ? (

            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Finding Hospitals...
            </>

          ) : (

            <>
              <LocateFixed className="w-4 h-4" />
              Find Nearby Hospitals
            </>

          )}

        </button>

      </div>

      <div className="flex items-center gap-2 mt-3 text-[10px] text-slate-500">

        <MapPin className="w-3.5 h-3.5 text-blue-400" />

        <span>
          Your location is used only to find nearby hospitals.
        </span>

      </div>

    </div>


    {/* ================= ERROR ================= */}

    {hospitalError && (

      <div className="mb-5 p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-start gap-3">

        <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />

        <div>

          <p className="text-xs font-semibold text-rose-300">
            Hospital Search Failed
          </p>

          <p className="text-[11px] text-rose-400 mt-1">
            {hospitalError}
          </p>

        </div>

      </div>

    )}


    {/* ================= RESULTS HEADER ================= */}

    {hospitals.length > 0 && (

      <div className="flex items-center justify-between mb-4">

        <div>

          <h3 className="text-xs font-bold text-white">
            Nearby Hospitals
          </h3>

          <p className="text-[10px] text-slate-500 mt-1">
            {hospitals.length} hospitals found
          </p>

        </div>

        <span className="text-[10px] text-blue-400 bg-blue-500/10 border border-blue-500/20 px-2.5 py-1 rounded-lg">
          Nearest First
        </span>

      </div>

    )}


    {/* ================= HOSPITAL CARDS ================= */}

    {hospitals.length > 0 && (

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">

        {hospitals.map((hospital: any) => (

          <div
            key={`${hospital.id}-${hospital.latitude}-${hospital.longitude}`}
            className="group bg-[#161D2F]/70 border border-blue-500/20 hover:border-blue-400/50 rounded-2xl p-4 transition-all hover:shadow-[0_0_18px_rgba(59,130,246,0.12)]"
          >

            {/* Hospital Icon + Name */}

            <div className="flex items-start gap-3">

              <div className="w-10 h-10 rounded-xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center shrink-0">

                <Hospital className="w-4.5 h-4.5 text-blue-400" />

              </div>

              <div className="min-w-0">

                <h4 className="text-xs font-bold text-white leading-relaxed">

                  {hospital.name}

                </h4>

                <div className="flex items-center gap-1.5 mt-1">

                  <MapPin className="w-3 h-3 text-blue-400 shrink-0" />

                  <span className="text-[10px] text-blue-400">

                    {hospital.distance_km} km away

                  </span>

                </div>

              </div>

            </div>


            {/* Address */}

            {hospital.address && (

              <div className="flex items-start gap-2 mt-4">

                <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0 mt-0.5" />

                <p className="text-[10px] text-slate-400 leading-relaxed">

                  {hospital.address}

                </p>

              </div>

            )}


            {/* Emergency */}

            {hospital.emergency === "yes" && (

              <div className="flex items-center gap-2 mt-3">

                <span className="text-[9px] font-semibold text-rose-400 bg-rose-500/10 border border-rose-500/20 px-2 py-1 rounded-lg">

                  Emergency Available

                </span>

              </div>

            )}


            {/* Phone */}

            {hospital.phone && (

              <div className="flex items-center gap-2 mt-3">

                <Phone className="w-3.5 h-3.5 text-emerald-400" />

                <span className="text-[10px] text-slate-300">

                  {hospital.phone}

                </span>

              </div>

            )}


            {/* Actions */}

            <div className="grid grid-cols-2 gap-2 mt-4">

              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${hospital.latitude},${hospital.longitude}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-blue-600/10 hover:bg-blue-600/20 border border-blue-500/20 text-blue-400 text-[10px] font-semibold transition"
              >

                <Navigation className="w-3.5 h-3.5" />

                Directions

              </a>


              {hospital.phone ? (

                <a
                  href={`tel:${hospital.phone}`}
                  className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 text-emerald-400 text-[10px] font-semibold transition"
                >

                  <Phone className="w-3.5 h-3.5" />

                  Call

                </a>

              ) : (

                <button
                  disabled
                  className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800/40 border border-slate-700/30 text-slate-600 text-[10px] font-semibold cursor-not-allowed"
                >

                  <Phone className="w-3.5 h-3.5" />

                  No Phone

                </button>

              )}

            </div>


            {/* Website */}

            {hospital.website && (

              <a
                href={hospital.website}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-1.5 mt-2 py-2 text-[10px] text-slate-400 hover:text-blue-400 transition"
              >

                <Globe className="w-3 h-3" />

                Visit Website

                <ExternalLink className="w-3 h-3" />

              </a>

            )}

          </div>

        ))}

      </div>

    )}


    {/* ================= EMPTY STATE ================= */}

    {!hospitalLoading &&
      !hospitalError &&
      hospitals.length === 0 && (

      <div className="py-16 text-center">

        <div className="w-16 h-16 mx-auto rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-4">

          <Hospital className="w-7 h-7 text-blue-400" />

        </div>

        <h3 className="text-sm font-semibold text-white">
          Find Hospitals Near You
        </h3>

        <p className="text-xs text-slate-500 mt-2 max-w-sm mx-auto">
          Click the button above to use your current location
          and find nearby hospitals.
        </p>

      </div>

    )}

  </div>

)}


{activeTab === "report" && (
  <div className="min-h-[620px] bg-[#121826]/60 backdrop-blur-xl border border-blue-500/30 rounded-2xl p-5 shadow-[0_0_25px_rgba(59,130,246,0.12)] flex flex-col">

    {/* Header */}

    <div className="flex items-center gap-3 mb-5">

      <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center">
        <FileText className="w-5 h-5 text-blue-400" />
      </div>

      <div>
        <h2 className="text-sm font-bold text-white">
          Medical Report Analyzer
        </h2>

        <p className="text-xs text-slate-400 mt-1">
          Upload a PDF or image health report
        </p>
      </div>

    </div>


    {/* Upload */}

    <label className="block border border-dashed border-blue-500/40 rounded-2xl p-8 text-center cursor-pointer hover:border-blue-400 hover:bg-blue-500/5 transition">

      <Upload className="w-8 h-8 text-blue-400 mx-auto mb-3" />

      <p className="text-sm text-white font-medium">
        {reportFile
          ? reportFile.name
          : "Choose your health report"}
      </p>

      <p className="text-[11px] text-slate-500 mt-2">
        PDF, PNG, JPG or JPEG
      </p>

      <input
        type="file"
        accept=".pdf,.png,.jpg,.jpeg"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0] || null;

          setReportFile(file);
          setReportResult(null);
          setReportError("");
        }}
      />

    </label>


    {/* Analyze Button */}

    <button
      onClick={analyzeReport}
      disabled={reportLoading || !reportFile}
      className="w-full mt-4 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition disabled:opacity-50"
    >
      {reportLoading
        ? "Analyzing Report..."
        : "Analyze Report"}
    </button>


    {/* Error */}

    {reportError && (
      <div className="mt-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
        {reportError}
      </div>
    )}


    {/* Results */}
    {reportResult && (
      <div className="mt-6 max-h-[420px] overflow-y-auto pr-2 custom-scrollbar">

        <div className="flex items-center justify-between mb-3">

          <h3 className="text-xs font-bold text-white">
            Report Analysis
          </h3>

          <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-full border border-emerald-500/20">
            Analysis Complete
          </span>

        </div>

       {/* Report Summary */}

{reportResult.summary && (
  <div className="mb-5">

    <h3 className="text-xs font-bold text-white mb-3">
      Report Summary
    </h3>

    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">

      {/* Total */}

      <div className="p-3 rounded-xl bg-[#161D2F]/60 border border-blue-500/20">
        <p className="text-[10px] text-slate-400">
          Detected
        </p>

        <p className="text-lg font-bold text-white mt-1">
          {reportResult.summary.total}
        </p>
      </div>


      {/* Normal */}

      <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
        <p className="text-[10px] text-emerald-400">
          Normal
        </p>

        <p className="text-lg font-bold text-emerald-300 mt-1">
          {reportResult.summary.normal}
        </p>
      </div>


      {/* High */}

      <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20">
        <p className="text-[10px] text-rose-400">
          High
        </p>

        <p className="text-lg font-bold text-rose-300 mt-1">
          {reportResult.summary.high}
        </p>
      </div>


      {/* Low */}

      <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
        <p className="text-[10px] text-amber-400">
          Low
        </p>

        <p className="text-lg font-bold text-amber-300 mt-1">
          {reportResult.summary.low}
        </p>
      </div>

    </div>


    {/* Summary Message */}

    <div className="mt-3 p-3 rounded-xl bg-[#161D2F]/60 border border-blue-500/20">

      <p className="text-xs text-slate-300 leading-relaxed">
        {reportResult.summary.message}
      </p>

    </div>

  </div>
)}
        {/* Parameters */}

        <div className="space-y-3">

          {reportResult.parameters?.map(
            (parameter: any, index: number) => (

              <div
                key={`${parameter.name}-${index}`}
                className="p-4 rounded-xl bg-[#161D2F]/60 border border-blue-500/20"
              >

                <div className="flex items-center justify-between gap-3">

                  <div>

                    <p className="text-xs font-semibold text-white">
                      {parameter.name}
                    </p>

                    <p className="text-[10px] text-slate-500 mt-1">
                      Reference: {parameter.reference_range}
                    </p>

                  </div>


                  <div className="text-right">

                    <p className="text-sm font-bold text-white">
                      {parameter.value}{" "}
                      <span className="text-[10px] text-slate-400">
                        {parameter.unit}
                      </span>
                    </p>

                    <span
                      className={`inline-block mt-1 text-[10px] px-2 py-0.5 rounded-full border ${
                        parameter.status === "normal"
                          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                          : parameter.status === "high"
                          ? "bg-rose-500/10 text-rose-400 border-rose-500/20"
                          : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                      }`}
                    >
                      {parameter.status.toUpperCase()}
                    </span>

                  </div>

                </div>

              </div>

            )
          )}

        </div>


        {/* No parameters */}

        {(!reportResult.parameters ||
          reportResult.parameters.length === 0) && (

          <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs">
            No supported medical parameters were detected in this report.
          </div>

        )}

        {/* AI Report Explanation */}

{reportResult?.ai_explanation && (
  <div className="mt-6">

    <div className="flex items-center gap-2 mb-3">
      <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
        <Sparkles className="w-4 h-4 text-cyan-400" />
      </div>

      <div>
        <h3 className="text-xs font-bold text-white">
          AI Report Explanation
        </h3>

        <p className="text-[10px] text-slate-500">
          AI-generated informational explanation
        </p>
      </div>
    </div>

     <div className="max-h-[420px] overflow-y-auto pr-3 custom-scrollbar">

      <div className="p-5 rounded-2xl bg-[#161D2F]/60 border border-cyan-500/20">

        <ReactMarkdown
  components={{
    h3: ({ children }) => (
      <h3 className="text-sm font-bold text-white mt-5 mb-2 first:mt-0">
        {children}
      </h3>
    ),

    p: ({ children }) => (
      <p className="text-xs text-slate-300 leading-6 mb-3">
        {children}
      </p>
    ),

    ul: ({ children }) => (
      <ul className="list-disc ml-5 space-y-2 mb-4">
        {children}
      </ul>
    ),

    li: ({ children }) => (
      <li className="text-xs text-slate-300 leading-5">
        {children}
      </li>
    ),

    strong: ({ children }) => (
      <strong className="font-semibold text-white">
        {children}
      </strong>
    ),

    hr: () => (
      <hr className="border-blue-500/10 my-4" />
    ),
  }}
>
  {reportResult.ai_explanation}
</ReactMarkdown>

      </div>

    </div>

    <div className="mt-3 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20">

      <p className="text-[10px] text-amber-300 leading-relaxed">
        ⚠ This AI explanation is for informational purposes only.
        It is not a medical diagnosis. Please consult a qualified
        healthcare professional for medical interpretation.
      </p>

    </div>

  </div>
)}


        

      </div>
    )}

  </div>
)}
            {activeTab === "symptom" && (
            <div className="bg-[#121826]/60 backdrop-blur-xl border border-blue-500/30 rounded-2xl p-5 flex flex-col justify-between min-h-[500px] shadow-[0_0_25px_rgba(59,130,246,0.12)]">
              
              {/* Chat Message Box */}
               <div className="space-y-9 overflow-y-auto pr-1 flex-1">
                {/* User Message */}
 {submittedMessage.trim() && (
  <div className="flex items-start gap-3">

    <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center shrink-0 text-white">
      <User className="w-4 h-4" />
    </div>

    <div className="flex-1">

      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-bold text-white">
          You
        </span>

        <span className="text-[11px] text-slate-500">
          Now
        </span>
      </div>

      <p className="text-xs text-slate-200 bg-[#161D2F]/80 p-3.5 rounded-2xl border border-blue-500/25 inline-block leading-relaxed">
        {submittedMessage}
      </p>

    </div>

  </div>
)}

  {/* AI Response Block */}
  <div className="flex items-start gap-3 pt-3">

    <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-400 flex items-center justify-center shrink-0 text-white shadow-[0_0_12px_rgba(59,130,246,0.4)]">
      <Sparkles className="w-4 h-4" />
    </div>

    <div className="flex-1 space-y-5">

      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-bold text-white text-sm">
            Healthcare AI
          </h3>

          <p className="text-xs text-slate-400 mt-1">
            Analysis based on reported symptoms:
          </p>
        </div>

        <button
          onClick={() => setIsPlayingAudio(!isPlayingAudio)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs transition ${
            isPlayingAudio
              ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300 animate-pulse'
              : 'bg-[#161D2F]/80 border-blue-500/30 text-slate-300 hover:border-blue-400'
          }`}
        >
          <Volume2 className="w-3.5 h-3.5" />

          <span>
            {isPlayingAudio ? 'Playing...' : 'Listen Audio'}
          </span>
        </button>
      </div>


      {/* ML Predictions */}
      <div className="space-y-3">

        <h4 className="text-xs font-bold text-white">
          Possible Conditions
        </h4>

        {analyzing ? (

          <div className="text-xs text-blue-400 animate-pulse">
            Analyzing symptoms...
          </div>

        ) : predictions.length > 0 ? (

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">

            {predictions.map((prediction, index) => (

              <div
                key={index}
                className="bg-[#161D2F]/70 backdrop-blur-md border border-blue-500/30 rounded-xl p-3.5 flex flex-col justify-between gap-3"
              >

                <div className="space-y-2">

                  <div className="w-7 h-7 rounded-lg bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
                    <Activity className="w-3.5 h-3.5" />
                  </div>

                  <h4 className="font-bold text-white text-xs">
                    {prediction.disease}
                  </h4>

                </div>

                <p className="text-xs font-bold text-blue-400">
                  Model score: {prediction.confidence}%
                </p>

              </div>

            ))}

          </div>

        ) : (

          <p className="text-xs text-slate-500">
            Enter symptoms and press Send to analyze.
          </p>

        )}

      </div>


      {/* Matched Symptoms */}
      {matchedSymptoms.length > 0 && (
        <div>

          <p className="text-[11px] text-slate-400 mb-2">
            Symptoms detected:
          </p>

          <div className="flex flex-wrap gap-2">

            {matchedSymptoms.map((symptom) => (

              <span
                key={symptom}
                className="px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px]"
              >
                ✓ {symptom.replaceAll("_", " ")}
              </span>

            ))}

          </div>

        </div>
      )}


      {/* Unknown Symptoms */}
      {unknownSymptoms.length > 0 && (
        <div>

          <p className="text-[11px] text-amber-400 mb-2">
            Symptoms not recognized:
          </p>

          <div className="flex flex-wrap gap-2">

            {unknownSymptoms.map((symptom) => (

              <span
                key={symptom}
                className="px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[10px]"
              >
                {symptom}
              </span>

            ))}

          </div>

        </div>
      )}


      {/* Recommendations */}
      <div className="space-y-2.5 pt-1">

        <h4 className="text-xs font-bold text-white">
          Recommendations
        </h4>

        <ul className="space-y-2.5 text-xs text-slate-300">

          <li className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />
            <span>
              Rest well and stay hydrated.
            </span>
          </li>

          <li className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />
            <span>
              Consult a qualified healthcare professional
              for medical advice.
            </span>
          </li>

        </ul>

      </div>

    </div>
  </div>

</div>

              {/* Input Control Box */}
              <div className="mt-6 pt-4 border-t border-blue-500/20">
                <div className="relative flex items-center">
                  <button 
                    onClick={() => setIsRecording(!isRecording)}
                    className={`absolute left-4 p-2.5 rounded-xl transition ${
                      isRecording 
                        ? 'bg-rose-500 text-white animate-pulse' 
                        : 'bg-slate-800/80 text-slate-400 hover:text-white'
                    }`}
                    title="Voice Input"
                  >
                    <Mic className="w-5 h-5" />
                  </button>

                  <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder={isRecording ? 'Listening to your voice...' : 'Type or select symptoms from BioDigital Map...'}
                    className="w-full bg-[#161D2F]/70 backdrop-blur-md border border-blue-500/40 focus:border-blue-400 rounded-2xl pl-14 pr-16 py-5 text-sm text-white placeholder-slate-500 focus:outline-none transition shadow-[inset_0_2px_4px_rgba(0,0,0,0.4)]"
                  />

                   <button
  type="button"
  onClick={analyzeSymptoms}
  disabled={analyzing || !inputMessage.trim()}
  className="absolute right-3 p-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white transition shadow-[0_0_10px_rgba(59,130,246,0.4)] active:scale-95 disabled:opacity-50"
>
  {analyzing ? (
    <Loader2 className="w-5 h-5 animate-spin" />
  ) : (
    <Send className="w-5 h-5" />
  )}
</button>
                </div>
                
                
                <div className="flex items-center gap-2 mt-3 text-[11px] text-slate-500">
                  <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                  <p>Disclaimer: AI provides assistance only. Consult a physician for accurate diagnosis.</p>
                </div>
              </div>

            </div> )}

          </div> 

          {/* ================= RIGHT COLUMN: SPACIOUS CARDS (3 COLS) ================= */}
           {activeTab === "symptom" && (
  <div className="lg:col-span-3 flex flex-col gap-8">
            
            {/* 1. Medication Reminder */}
            <div className="bg-[#121826]/60 backdrop-blur-xl border border-blue-500/30 rounded-2xl p-5 shadow-[0_0_20px_rgba(59,130,246,0.1)] flex flex-col gap-5">
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-xs font-bold text-white flex items-center gap-2">
                  <Pill className="w-4 h-4 text-blue-400" /> Medication Reminder
                </h3>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-blue-400 font-mono bg-blue-500/10 px-2.5 py-1 rounded-full border border-blue-500/20">
                    {medicines.filter(m => !m.completed).length} Pending
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setAddMedicineError("");
                      setShowAddMedicine(true);
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-semibold transition"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Medicine
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                {medicineListLoading ? (
                  <div className="py-8 text-center text-xs text-blue-400 animate-pulse">
                    Loading medications...
                  </div>
                ) : medicineListError ? (
                  <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
                    {medicineListError}
                    <button
                      type="button"
                      onClick={loadMedications}
                      className="block mt-2 text-blue-400 hover:text-blue-300 font-semibold"
                    >
                      Retry
                    </button>
                  </div>
                ) : medicines.length === 0 ? (
                  <div className="py-8 text-center text-xs text-slate-500">
                    No medications found.
                  </div>
                ) : (
                  medicines.map((med) => (
                  <div 
                    key={med.id}
                    onClick={() => toggleMedicine(med.id)}
                    className={`flex items-center justify-between p-4 rounded-xl border transition cursor-pointer ${
                      med.completed 
                        ? 'bg-[#161D2F]/20 border-blue-500/10 opacity-60' 
                        : 'bg-[#161D2F]/70 border-blue-500/30 hover:border-blue-400/60'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {med.completed ? (
                        <CheckSquare className="w-4.5 h-4.5 text-emerald-400 shrink-0" />
                      ) : (
                        <Square className="w-4.5 h-4.5 text-slate-500 shrink-0" />
                      )}
                      <div className="space-y-1.5">
                        <p className={`text-xs font-medium ${med.completed ? 'line-through text-slate-400' : 'text-white'}`}>
                          {med.name}
                        </p>
                        <p className="text-[11px] text-slate-400 flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-slate-500" /> {med.time}
                        </p>
                      </div>
                    </div>
                    
                    <span className={`text-[10px] px-2.5 py-1 rounded-lg border font-semibold ${
                      med.completed 
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                        : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                    }`}>
                      {med.completed ? 'Taken' : 'Due'}
                    </span>
                  </div>
                  ))
                )}
              </div>
            </div>

            {showAddMedicine && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                <div className="w-full max-w-md bg-[#121826] border border-blue-500/30 rounded-2xl p-5 shadow-2xl">
                  <div className="flex items-center justify-between mb-5">
                    <div>
                      <h3 className="text-sm font-bold text-white">Add Medicine</h3>
                      <p className="text-[10px] text-slate-400 mt-1">Add a medicine to your reminder list.</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowAddMedicine(false)}
                      className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-[10px] text-slate-400 mb-1.5">Medicine Name *</label>
                      <input
                        type="text"
                        value={newMedicine.medicine_name}
                        onChange={(e) => setNewMedicine({ ...newMedicine, medicine_name: e.target.value })}
                        placeholder="e.g. Paracetamol"
                        className="w-full bg-[#161D2F] border border-blue-500/20 focus:border-blue-400 rounded-xl px-3 py-2.5 text-xs text-white placeholder-slate-600 outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] text-slate-400 mb-1.5">Dosage</label>
                        <input
                          type="text"
                          value={newMedicine.dosage}
                          onChange={(e) => setNewMedicine({ ...newMedicine, dosage: e.target.value })}
                          placeholder="e.g. 500mg"
                          className="w-full bg-[#161D2F] border border-blue-500/20 focus:border-blue-400 rounded-xl px-3 py-2.5 text-xs text-white placeholder-slate-600 outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] text-slate-400 mb-1.5">Frequency</label>
                        <select
                          value={newMedicine.frequency}
                          onChange={(e) => setNewMedicine({ ...newMedicine, frequency: e.target.value })}
                          className="w-full bg-[#161D2F] border border-blue-500/20 focus:border-blue-400 rounded-xl px-3 py-2.5 text-xs text-white outline-none"
                        >
                          <option>Once daily</option>
                          <option>Twice daily</option>
                          <option>Three times daily</option>
                          <option>As needed</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] text-slate-400 mb-1.5">Time *</label>
                      <input
                        type="time"
                        value={newMedicine.time}
                        onChange={(e) => setNewMedicine({ ...newMedicine, time: e.target.value })}
                        className="w-full bg-[#161D2F] border border-blue-500/20 focus:border-blue-400 rounded-xl px-3 py-2.5 text-xs text-white outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] text-slate-400 mb-1.5">Start Date</label>
                        <input
                          type="date"
                          value={newMedicine.start_date}
                          onChange={(e) => setNewMedicine({ ...newMedicine, start_date: e.target.value })}
                          className="w-full bg-[#161D2F] border border-blue-500/20 focus:border-blue-400 rounded-xl px-3 py-2.5 text-xs text-white outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] text-slate-400 mb-1.5">End Date</label>
                        <input
                          type="date"
                          value={newMedicine.end_date}
                          onChange={(e) => setNewMedicine({ ...newMedicine, end_date: e.target.value })}
                          className="w-full bg-[#161D2F] border border-blue-500/20 focus:border-blue-400 rounded-xl px-3 py-2.5 text-xs text-white outline-none"
                        />
                      </div>
                    </div>

                    {addMedicineError && (
                      <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-[11px]">
                        {addMedicineError}
                      </div>
                    )}

                    <div className="flex gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => setShowAddMedicine(false)}
                        className="flex-1 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={addMedication}
                        disabled={addMedicineLoading}
                        className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition disabled:opacity-50"
                      >
                        {addMedicineLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                        {addMedicineLoading ? "Adding..." : "Add Medicine"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 2. Vitals Trends */}
            <div className="bg-[#121826]/60 backdrop-blur-xl border border-blue-500/30 rounded-2xl p-5 shadow-[0_0_20px_rgba(59,130,246,0.1)] flex flex-col gap-5">
              <h3 className="text-xs font-bold text-white flex items-center gap-2">
                <Activity className="w-4 h-4 text-blue-400" /> Vitals & Health Trends
              </h3>

              {vitalsLoading ? (
                <div className="py-8 text-center text-xs text-blue-400 animate-pulse">
                  Loading health vitals...
                </div>
              ) : vitalsError ? (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
                  {vitalsError}
                  <button
                    type="button"
                    onClick={loadVitals}
                    className="block mt-2 text-blue-400 hover:text-blue-300 font-semibold"
                  >
                    Retry
                  </button>
                </div>
              ) : vitals.length === 0 ? (
                <div className="py-8 text-center text-xs text-slate-500">
                  No health vitals recorded yet. Upload a medical report or add a vital to see it here.
                </div>
              ) : (
                <div className="space-y-4">
                  {(() => {
                    const normalizedName = (name: string) => name.toLowerCase().trim();
                    const glucoseNames = new Set([
                      "fasting blood glucose",
                      "fasting blood sugar",
                      "fasting blood glucose level",
                    ]);
                    const glucoseVitals = vitals.filter((v) =>
                      glucoseNames.has(normalizedName(String(v.vital_name || "")))
                    );
                    const bpVitals = vitals.filter((v) => {
                      const name = normalizedName(String(v.vital_name || ""));
                      return name === "blood pressure" || name === "bp";
                    });

                    const renderVital = (label: string, items: any[], fallbackUnit = "") => {
                      const latest = items[0];
                      const previous = items[1];
                      const latestValue = latest?.value;
                      const unit = latest?.unit || fallbackUnit;
                      const difference =
                        latest && previous && Number.isFinite(Number(latest.value)) && Number.isFinite(Number(previous.value))
                          ? Number(latest.value) - Number(previous.value)
                          : null;

                      return (
                        <div className="p-4 rounded-xl bg-[#161D2F]/60 border border-blue-500/25 flex items-center justify-between">
                          <div className="space-y-1.5">
                            <p className="text-[11px] text-slate-400">{label}</p>
                            <p className="text-xs font-bold text-white">
                              {latestValue !== undefined && latestValue !== null
                                ? `${latestValue}${unit ? ` ${unit}` : ""}`
                                : "Not recorded"}
                            </p>
                          </div>
                          {difference !== null ? (
                            <div className={`flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-lg border ${
                              difference <= 0
                                ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
                                : "text-amber-400 bg-amber-500/10 border-amber-500/20"
                            }`}>
                              {difference <= 0 ? (
                                <TrendingDown className="w-3.5 h-3.5" />
                              ) : (
                                <TrendingUp className="w-3.5 h-3.5" />
                              )}
                              <span>{difference > 0 ? "+" : ""}{difference}</span>
                            </div>
                          ) : (
                            <span className="text-[10px] text-slate-500 bg-slate-500/10 px-2.5 py-1 rounded-lg border border-slate-500/20">
                              Latest
                            </span>
                          )}
                        </div>
                      );
                    };

                    return (
                      <>
                        {renderVital("Fasting Blood Sugar", glucoseVitals, "mg/dL")}
                        {renderVital("Blood Pressure", bpVitals, "mmHg")}
                      </>
                    );
                  })()}
                </div>
              )}

               <button
  type="button"
  onClick={() => {
    if (vitals.length === 0) {
      loadVitals();
      return;
    }

    const firstVital = vitals.find(
      (v) =>
        v?.vital_name &&
        Number.isFinite(Number(v?.value))
    );

    if (firstVital) {
      setSelectedVitalName(firstVital.vital_name);
    }

    setShowVitalsGraph(true);
  }}
  className="flex items-center justify-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 pt-1 transition font-medium"
>
  <span>View Live Health Graph</span>
  <TrendingUp className="w-3.5 h-3.5" />
</button>
            </div>
            {/* =========================================================
    LIVE VITALS GRAPH MODAL
========================================================= */}

{showVitalsGraph && (
  <div className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">

    <div className="w-full max-w-4xl bg-[#121826] border border-blue-500/30 rounded-2xl shadow-[0_0_40px_rgba(59,130,246,0.2)] overflow-hidden">

      {/* Header */}
      <div className="flex items-center justify-between p-5 border-b border-blue-500/20">

        <div>
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <Activity className="w-5 h-5 text-blue-400" />
            Live Health Vitals Graph
          </h2>

          <p className="text-[11px] text-slate-400 mt-1">
            Based on your recorded health data
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowVitalsGraph(false)}
          className="p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition"
        >
          <X className="w-5 h-5" />
        </button>

      </div>


      {/* Content */}
      <div className="p-5">

        {/* Vital Selector */}
        <div className="mb-5">

          <label className="text-[11px] text-slate-400 mb-2 block">
            Select Vital
          </label>

          <select
            value={selectedVitalName}
            onChange={(e) => setSelectedVitalName(e.target.value)}
            className="w-full md:w-80 bg-[#161D2F] border border-blue-500/30 focus:border-blue-400 rounded-xl px-4 py-2.5 text-xs text-white outline-none"
          >
            {Array.from(
              new Set(
                vitals
                  .filter(
                    (v) =>
                      v?.vital_name &&
                      Number.isFinite(Number(v?.value))
                  )
                  .map((v) => v.vital_name)
              )
            ).map((name) => (
              <option
                key={name}
                value={name}
                className="bg-[#161D2F]"
              >
                {name}
              </option>
            ))}
          </select>

        </div>


        {/* Graph */}
        {(() => {

          const graphVitals = vitals
            .filter(
              (v) =>
                v?.vital_name === selectedVitalName &&
                Number.isFinite(Number(v?.value))
            )
            .slice()
            .sort(
              (a, b) =>
                new Date(a.recorded_at).getTime() -
                new Date(b.recorded_at).getTime()
            );

          if (graphVitals.length === 0) {
            return (
              <div className="h-72 flex items-center justify-center rounded-xl bg-[#161D2F]/50 border border-blue-500/20">
                <p className="text-xs text-slate-500">
                  No numeric data available for this vital.
                </p>
              </div>
            );
          }

          const values = graphVitals.map((v) => Number(v.value));

          const minValue = Math.min(...values);
          const maxValue = Math.max(...values);

          const padding = 40;

          const graphWidth = 760;
          const graphHeight = 300;

          const range =
            maxValue - minValue === 0
              ? 1
              : maxValue - minValue;

          const points = graphVitals.map((v, index) => {

            const x =
              graphVitals.length === 1
                ? graphWidth / 2
                : padding +
                  (index / (graphVitals.length - 1)) *
                    (graphWidth - padding * 2);

            const y =
              graphHeight -
              padding -
              ((Number(v.value) - minValue) / range) *
                (graphHeight - padding * 2);

            return {
              x,
              y,
              value: Number(v.value),
              date: new Date(v.recorded_at),
              unit: v.unit || "",
            };
          });

          const averageValue = values.reduce((sum, value) => sum + value, 0) / values.length;
          const latestValue = values[values.length - 1];
          const firstValue = values[0];
          const valueChange = latestValue - firstValue;
          const changePercent = firstValue !== 0 ? (valueChange / firstValue) * 100 : 0;

          // Smooth cubic curve through all points.
          let curvePath = `M ${points[0].x} ${points[0].y}`;
          for (let i = 0; i < points.length - 1; i++) {
            const current = points[i];
            const next = points[i + 1];
            const midX = (current.x + next.x) / 2;
            curvePath += ` C ${midX} ${current.y}, ${midX} ${next.y}, ${next.x} ${next.y}`;
          }

          const areaPath =
            points.length > 1
              ? `${curvePath} L ${points[points.length - 1].x} ${graphHeight - padding} L ${points[0].x} ${graphHeight - padding} Z`
              : `M ${points[0].x} ${points[0].y} L ${points[0].x} ${graphHeight - padding} L ${points[0].x} ${graphHeight - padding} Z`;

          const yTicks = Array.from({ length: 5 }, (_, index) => {
            const value = maxValue - ((maxValue - minValue) * index) / 4;
            const y = padding + (index / 4) * (graphHeight - padding * 2);
            return { value, y };
          });

          return (
            <div>

              {/* Summary */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
                {[
                  { label: "Latest", value: latestValue, extra: graphVitals[graphVitals.length - 1]?.unit || "" },
                  { label: "Average", value: averageValue, extra: graphVitals[0]?.unit || "" },
                  { label: "Minimum", value: minValue, extra: graphVitals[0]?.unit || "" },
                  { label: "Maximum", value: maxValue, extra: graphVitals[0]?.unit || "" },
                ].map((item) => (
                  <div key={item.label} className="rounded-xl border border-blue-500/20 bg-[#161D2F]/70 px-4 py-3">
                    <p className="text-[10px] uppercase tracking-wide text-slate-500">{item.label}</p>
                    <p className="mt-1 text-lg font-bold text-white">
                      {Number(item.value).toFixed(item.label === "Latest" ? 0 : 1)}
                      <span className="ml-1 text-[10px] font-medium text-slate-400">{item.extra}</span>
                    </p>
                  </div>
                ))}
              </div>

              {/* Current value / trend */}
              <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                <div>
                  <p className="text-[10px] text-slate-400">{selectedVitalName}</p>
                  <div className="flex items-end gap-3">
                    <p className="text-2xl font-bold text-white">
                      {latestValue}
                      {graphVitals[graphVitals.length - 1]?.unit ? ` ${graphVitals[graphVitals.length - 1].unit}` : ""}
                    </p>
                    <span className={`mb-1 text-[10px] font-semibold ${valueChange >= 0 ? "text-amber-400" : "text-emerald-400"}`}>
                      {valueChange > 0 ? "+" : ""}{valueChange.toFixed(1)} ({changePercent > 0 ? "+" : ""}{changePercent.toFixed(1)}%)
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[10px] text-slate-500">Records</p>
                  <p className="text-sm font-semibold text-blue-400">{graphVitals.length}</p>
                </div>
              </div>


              {/* SVG Graph */}
              <div className="w-full overflow-x-auto rounded-xl bg-[#0d1422] border border-blue-500/20 p-3">

                <svg
                  viewBox={`0 0 ${graphWidth} ${graphHeight}`}
                  className="w-full min-w-[650px] h-[300px]"
                  preserveAspectRatio="none"
                >
                  <defs>
                    <linearGradient id="vitalsAreaGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#60A5FA" stopOpacity="0.30" />
                      <stop offset="100%" stopColor="#60A5FA" stopOpacity="0.02" />
                    </linearGradient>
                    <filter id="vitalsGlow" x="-20%" y="-20%" width="140%" height="140%">
                      <feGaussianBlur stdDeviation="3" result="blur" />
                      <feMerge>
                        <feMergeNode in="blur" />
                        <feMergeNode in="SourceGraphic" />
                      </feMerge>
                    </filter>
                  </defs>

                  {/* Y-axis grid and labels */}
                  {yTicks.map((tick, index) => (
                    <g key={`y-${index}`}>
                      <line
                        x1={padding}
                        y1={tick.y}
                        x2={graphWidth - padding}
                        y2={tick.y}
                        stroke="#263247"
                        strokeWidth="1"
                        strokeDasharray="4 5"
                      />
                      <text
                        x={padding - 8}
                        y={tick.y + 4}
                        textAnchor="end"
                        fontSize="10"
                        fill="#64748B"
                      >
                        {tick.value.toFixed(values.some((v) => !Number.isInteger(v)) ? 1 : 0)}
                      </text>
                    </g>
                  ))}

                  {/* Filled trend area */}
                  <path d={areaPath} fill="url(#vitalsAreaGradient)" />

                  {/* Smooth trend line */}
                  <path
                    d={curvePath}
                    fill="none"
                    stroke="#60A5FA"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    filter="url(#vitalsGlow)"
                  />

                  {/* Data points */}
                  {points.map((point, index) => (
                    <g key={index}>
                      <title>
                        {point.date.toLocaleString()} — {point.value} {point.unit}
                      </title>
                      <circle cx={point.x} cy={point.y} r="8" fill="#60A5FA" opacity="0.12" />
                      <circle cx={point.x} cy={point.y} r="4.5" fill="#0D1422" stroke="#60A5FA" strokeWidth="2.5" />
                      <text
                        x={point.x}
                        y={point.y - 12}
                        textAnchor="middle"
                        fontSize="10"
                        fontWeight="600"
                        fill="#CBD5E1"
                      >
                        {point.value}
                      </text>
                    </g>
                  ))}

                  {/* X-axis dates */}
                  {points.map((point, index) => (
                    <text
                      key={`date-${index}`}
                      x={point.x}
                      y={graphHeight - 10}
                      textAnchor="middle"
                      fontSize="9"
                      fill="#64748B"
                    >
                      {point.date.toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                    </text>
                  ))}
                </svg>

              </div>


              {/* Data table */}
              <div className="mt-5 max-h-40 overflow-y-auto rounded-xl border border-blue-500/20">

                <div className="grid grid-cols-3 px-4 py-2 bg-[#161D2F] text-[10px] text-slate-400 font-semibold">
                  <span>Date</span>
                  <span>Value</span>
                  <span>Source</span>
                </div>

                {graphVitals
                  .slice()
                  .reverse()
                  .map((v) => (

                    <div
                      key={v.id}
                      className="grid grid-cols-3 px-4 py-2.5 border-t border-blue-500/10 text-[10px] text-slate-300"
                    >

                      <span>
                        {new Date(v.recorded_at).toLocaleString()}
                      </span>

                      <span className="font-semibold text-white">
                        {v.value} {v.unit || ""}
                      </span>

                      <span className="text-blue-400 capitalize">
                        {v.source || "manual"}
                      </span>

                    </div>

                  ))}

              </div>

            </div>
          );

        })()}

      </div>

    </div>

  </div>
)}
            {/* =========================================================
                HEALTH INSIGHTS
            ========================================================= */}
            {vitals.length > 0 && (
              <div className="bg-[#121826]/60 backdrop-blur-xl border border-blue-500/30 rounded-2xl p-5 shadow-[0_0_20px_rgba(59,130,246,0.1)]">

                <div className="flex items-center justify-between mb-5">
                  <div>
                    <h3 className="text-xs font-bold text-white flex items-center gap-2">
                      <Activity className="w-4 h-4 text-blue-400" />
                      Health Insights
                    </h3>

                    <p className="text-[10px] text-slate-500 mt-1">
                      Based on your recorded health measurements
                    </p>
                  </div>
                </div>

                {(() => {
                  /*
                   * Use the selected graph vital when available.
                   * Otherwise use the first numeric vital from the database.
                   */
                  const availableVitals = Array.from(
                    new Set(
                      vitals
                        .filter(
                          (v) =>
                            v?.vital_name &&
                            Number.isFinite(Number(v?.value))
                        )
                        .map((v) => String(v.vital_name))
                    )
                  );

                  const insightVital =
                    selectedVitalName &&
                    availableVitals.includes(selectedVitalName)
                      ? selectedVitalName
                      : availableVitals[0];

                  const insights = insightVital
                    ? getVitalInsights(insightVital)
                    : null;

                  if (!insights) {
                    return (
                      <div className="py-6 text-center text-xs text-slate-500">
                        No numeric health data available for insights.
                      </div>
                    );
                  }

                  const trendColor =
                    insights.trend === "Increasing"
                      ? "text-amber-400"
                      : insights.trend === "Decreasing"
                      ? "text-emerald-400"
                      : "text-blue-400";

                  const trendBg =
                    insights.trend === "Increasing"
                      ? "bg-amber-500/10 border-amber-500/20"
                      : insights.trend === "Decreasing"
                      ? "bg-emerald-500/10 border-emerald-500/20"
                      : "bg-blue-500/10 border-blue-500/20";

                  const trendIcon =
                    insights.trend === "Increasing"
                      ? (
                        <TrendingUp className="w-4 h-4" />
                      )
                      : insights.trend === "Decreasing"
                      ? (
                        <TrendingDown className="w-4 h-4" />
                      )
                      : (
                        <Activity className="w-4 h-4" />
                      );

                  return (
                    <div className="space-y-4">

                      {/* Vital Name */}
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-[10px] text-slate-500 uppercase tracking-wider">
                            Selected Vital
                          </p>

                          <p className="text-sm font-semibold text-white mt-1">
                            {insightVital}
                          </p>
                        </div>

                        <span className="text-[10px] text-slate-500 bg-slate-500/10 border border-slate-500/20 px-2.5 py-1 rounded-lg">
                          {insights.recordsCount} record
                          {insights.recordsCount !== 1 ? "s" : ""}
                        </span>
                      </div>

                      {/* Summary Cards */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">

                        {/* Latest */}
                        <div className="p-4 rounded-xl bg-[#161D2F]/60 border border-blue-500/20">
                          <p className="text-[10px] text-slate-500 mb-1">
                            Latest
                          </p>

                          <p className="text-lg font-bold text-white">
                            {insights.latest}
                          </p>

                          <p className="text-[10px] text-slate-500 mt-1">
                            {insights.unit || "value"}
                          </p>
                        </div>

                        {/* Average */}
                        <div className="p-4 rounded-xl bg-[#161D2F]/60 border border-blue-500/20">
                          <p className="text-[10px] text-slate-500 mb-1">
                            Average
                          </p>

                          <p className="text-lg font-bold text-white">
                            {insights.average.toFixed(2)}
                          </p>

                          <p className="text-[10px] text-slate-500 mt-1">
                            {insights.unit || "value"}
                          </p>
                        </div>

                        {/* Minimum */}
                        <div className="p-4 rounded-xl bg-[#161D2F]/60 border border-blue-500/20">
                          <p className="text-[10px] text-slate-500 mb-1">
                            Minimum
                          </p>

                          <p className="text-lg font-bold text-white">
                            {insights.minimum}
                          </p>

                          <p className="text-[10px] text-slate-500 mt-1">
                            Recorded
                          </p>
                        </div>

                        {/* Maximum */}
                        <div className="p-4 rounded-xl bg-[#161D2F]/60 border border-blue-500/20">
                          <p className="text-[10px] text-slate-500 mb-1">
                            Maximum
                          </p>

                          <p className="text-lg font-bold text-white">
                            {insights.maximum}
                          </p>

                          <p className="text-[10px] text-slate-500 mt-1">
                            Recorded
                          </p>
                        </div>

                      </div>

                      {/* Trend */}
                      <div
                        className={`flex items-center justify-between gap-4 p-4 rounded-xl border ${trendBg}`}
                      >

                        <div className="flex items-center gap-3">

                          <div className={trendColor}>
                            {trendIcon}
                          </div>

                          <div>
                            <p className={`text-xs font-semibold ${trendColor}`}>
                              {insights.trend} trend
                            </p>

                            <p className="text-[10px] text-slate-400 mt-1">
                              {insights.previous !== null
                                ? `Latest reading compared with the previous recorded reading.`
                                : `Only one recorded measurement is available.`}
                            </p>
                          </div>

                        </div>

                        {insights.difference !== null && (
                          <div className="text-right">

                            <p
                              className={`text-sm font-bold ${
                                insights.difference > 0
                                  ? "text-amber-400"
                                  : insights.difference < 0
                                  ? "text-emerald-400"
                                  : "text-blue-400"
                              }`}
                            >
                              {insights.difference > 0 ? "+" : ""}
                              {insights.difference.toFixed(2)}
                            </p>

                            {insights.percentageChange !== null && (
                              <p className="text-[10px] text-slate-500 mt-1">
                                {insights.percentageChange > 0 ? "+" : ""}
                                {insights.percentageChange.toFixed(1)}%
                              </p>
                            )}

                          </div>
                        )}

                      </div>

                      {/* Latest Reading Time */}
                      {insights.latestDate && (
                        <p className="text-[10px] text-slate-500">
                          Latest measurement:{" "}
                          <span className="text-slate-400">
                            {new Date(
                              insights.latestDate
                            ).toLocaleString()}
                          </span>
                        </p>
                      )}

                    </div>
                  );
                })()}

              </div>
            )}

            {/* 3. Consultation Summary Card */}
            <div className="bg-[#121826]/60 backdrop-blur-xl border border-blue-500/30 rounded-2xl p-5 shadow-[0_0_20px_rgba(59,130,246,0.1)] flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-white flex items-center gap-2">
                  <ClipboardList className="w-4 h-4 text-blue-400" /> Consultation Summary
                </h3>
                <span className={`text-[10px] px-2.5 py-0.5 rounded-full border font-semibold ${
                  (submittedMessage.trim() || reportResult)
                    ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
                    : "text-slate-400 bg-slate-500/10 border-slate-500/20"
                }`}>
                  {(submittedMessage.trim() || reportResult) ? "Active" : "No Analysis"}
                </span>
              </div>

              <div className="text-xs text-slate-300 space-y-3 bg-[#161D2F]/50 p-4 rounded-xl border border-blue-500/20 leading-relaxed">
                <p>
                  <span className="text-slate-400">Symptoms:</span>{" "}
                  {matchedSymptoms.length > 0
                    ? matchedSymptoms.map((symptom) => symptom.replaceAll("_", " ")).join(", ")
                    : submittedMessage.trim()
                      ? submittedMessage
                      : "No symptom analysis yet"}
                </p>

                <p>
                  <span className="text-slate-400">Analysis:</span>{" "}
                  {predictions.length > 0
                    ? `${predictions.length} possible condition${predictions.length > 1 ? "s" : ""} identified by the symptom model`
                    : reportResult?.summary?.message
                      ? reportResult.summary.message
                      : "No analysis available yet"}
                </p>

                <p>
                  <span className="text-slate-400">Follow-up:</span>{" "}
                  {(submittedMessage.trim() || reportResult)
                    ? "Review the results with a qualified healthcare professional."
                    : "Run a symptom analysis or upload a medical report to generate a summary."}
                </p>
              </div>
            </div>

            {/* 4. Nearby Hospitals */}
            <div className="bg-[#121826]/60 backdrop-blur-xl border border-blue-500/30 rounded-2xl p-5 shadow-[0_0_20px_rgba(59,130,246,0.1)] flex items-center justify-between">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0">
                  <MapPin className="w-4.5 h-4.5" />
                </div>
                <div className="space-y-1 min-w-0">
                  <h4 className="text-xs font-bold text-white">Nearby Hospitals</h4>
                  {hospitals.length > 0 ? (
                    <p className="text-[11px] text-slate-400 truncate">
                      {hospitals.length} hospitals found nearby
                    </p>
                  ) : (
                    <p className="text-[11px] text-slate-400">Search to find nearby hospitals</p>
                  )}
                  {hospitals.length > 0 && hospitals[0]?.name && (
                    <p className="text-[10px] text-blue-400 truncate max-w-[220px]">
                      Nearest: {hospitals[0].name} · {hospitals[0].distance_km} km
                    </p>
                  )}
                </div>
              </div>
              <button
                type="button"
                onClick={() => setActiveTab("hospitals")}
                className="px-3 py-1.5 rounded-xl bg-blue-600/30 border border-blue-400 text-blue-300 text-xs hover:bg-blue-600 transition font-medium shrink-0"
              >
                Map
              </button>
            </div>

          </div>
           )}

        </div>

      </div>
    </div>
  );
}