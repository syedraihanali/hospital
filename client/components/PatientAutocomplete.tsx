"use client";

import React, { useState, useEffect, useRef } from "react";
import { Input, Card, CardBody } from "@heroui/react";
import { Search, User } from "lucide-react";

import { patientsAPI } from "@/lib/api";
import { Patient } from "@/types";
import { useI18n } from "@/contexts/I18nContext";

interface PatientAutocompleteProps {
  value: string;
  onSelect: (patient: Patient) => void;
  placeholder?: string;
  label?: string;
  isRequired?: boolean;
  errorMessage?: string;
}

export default function PatientAutocomplete({
  value,
  onSelect,
  placeholder = "Search patients...",
  label = "Select Patient",
  isRequired = false,
  errorMessage = "",
}: PatientAutocompleteProps) {
  const { t } = useI18n();
  const [searchTerm, setSearchTerm] = useState(value);
  const [suggestions, setSuggestions] = useState<Patient[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [isPatientSelected, setIsPatientSelected] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Debounce search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchTerm.trim().length >= 2 && !isPatientSelected) {
        searchPatients(searchTerm.trim());
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, isPatientSelected]);

  const searchPatients = async (query: string) => {
    setIsLoading(true);
    try {
      const response = await patientsAPI.search(query, 10);

      setSuggestions(response.data || []);
      setShowSuggestions(true);
      setSelectedIndex(-1);
    } catch {
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setIsPatientSelected(false); // Reset selection state when user types
  };

  const handlePatientSelect = (patient: Patient) => {
    const firstName = patient.firstName || patient.first_name || "";
    const lastName = patient.lastName || patient.last_name || "";
    const tcNumber = patient.tcNumber || patient.tc_number || "";
    const displayName = `${firstName} ${lastName} (ID: ${tcNumber})`;

    setSearchTerm(displayName);
    setShowSuggestions(false);
    setSuggestions([]); // Clear suggestions to prevent "not found" message
    setSelectedIndex(-1);
    setIsPatientSelected(true); // Mark as patient selected
    onSelect(patient);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions || suggestions.length === 0) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < suggestions.length - 1 ? prev + 1 : 0,
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev > 0 ? prev - 1 : suggestions.length - 1,
        );
        break;
      case "Enter":
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
          handlePatientSelect(suggestions[selectedIndex]);
        }
        break;
      case "Escape":
        setShowSuggestions(false);
        setSelectedIndex(-1);
        break;
    }
  };

  const handleBlur = () => {
    // Delay hiding suggestions to allow for click events
    setTimeout(() => {
      setShowSuggestions(false);
      setSelectedIndex(-1);
      // Don't clear suggestions immediately to prevent flicker
    }, 200);
  };

  const calculateAge = (dateOfBirth: string): number => {
    if (!dateOfBirth) return 0;
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    return Math.max(0, age);
  };

  return (
    <div className="relative w-full">
      <Input
        ref={inputRef}
        description={
          searchTerm.length < 2
            ? t("patients.search_hint", {
                minimum: "2",
              }) || "Enter at least 2 characters"
            : ""
        }
        errorMessage={errorMessage}
        isRequired={isRequired}
        label={label}
        placeholder={t("patients.search_placeholder") || placeholder}
        startContent={<Search className="text-gray-400" size={16} />}
        value={searchTerm}
        onBlur={handleBlur}
        onChange={handleInputChange}
        onFocus={() => {
          if (suggestions.length > 0) {
            setShowSuggestions(true);
          }
        }}
        onKeyDown={handleKeyDown}
      />

      {showSuggestions && suggestions.length > 0 && (
        <Card className="absolute top-full left-0 right-0 z-50 mt-1 max-h-60 overflow-y-auto">
          <CardBody className="p-0">
            {suggestions.map((patient, index) => {
              const firstName = patient.firstName || patient.first_name || "";
              const lastName = patient.lastName || patient.last_name || "";
              const tcNumber = patient.tcNumber || patient.tc_number || "";
              const age =
                patient.age ||
                calculateAge(
                  patient.dateOfBirth || patient.date_of_birth || "",
                );

              return (
                <button
                  key={patient.patient_id || patient._id}
                  className={`p-3 w-full text-left border-b border-gray-100 last:border-b-0 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${
                    index === selectedIndex ? "bg-blue-50" : ""
                  }`}
                  type="button"
                  onClick={() => handlePatientSelect(patient)}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <User className="text-blue-600" size={16} />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-gray-900 truncate">
                          {firstName} {lastName}
                        </p>
                        {age > 0 && (
                          <span className="text-xs text-gray-500">
                            {age} yrs
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span>ID: {tcNumber}</span>
                        {patient.phone && <span>{patient.phone}</span>}
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </CardBody>
        </Card>
      )}

      {showSuggestions &&
        suggestions.length === 0 &&
        searchTerm.length >= 2 &&
        !isLoading &&
        !isPatientSelected && (
          <Card className="absolute top-full left-0 right-0 z-50 mt-1">
            <CardBody className="p-4 text-center text-gray-500">
              No patients found
            </CardBody>
          </Card>
        )}
    </div>
  );
}
