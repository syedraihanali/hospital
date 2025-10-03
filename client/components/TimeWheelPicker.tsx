"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  useDisclosure,
} from "@heroui/react";

interface TimeWheelPickerProps {
  label?: string;
  value?: string;
  onChange?: (value: string) => void;
  isRequired?: boolean;
  errorMessage?: string;
  description?: string;
  min?: string;
  max?: string;
  className?: string;
}

const TimeWheelPicker: React.FC<TimeWheelPickerProps> = ({
  label = "Time",
  value = "",
  onChange,
  isRequired = false,
  errorMessage = "",
  description = "",
  min = "00:00",
  max = "23:59",
  className = "",
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedHour, setSelectedHour] = useState(9);
  const [selectedMinute, setSelectedMinute] = useState(0);
  const hourRef = useRef<HTMLDivElement>(null);
  const minuteRef = useRef<HTMLDivElement>(null);

  // Parse min and max times
  const [minHour] = min.split(":").map(Number);
  const [maxHour] = max.split(":").map(Number);

  // Generate hour and minute options
  const hours = Array.from(
    { length: maxHour - minHour + 1 },
    (_, i) => minHour + i,
  );
  const minutes = Array.from({ length: 4 }, (_, i) => i * 15); // 0, 15, 30, 45

  // Initialize values from props
  useEffect(() => {
    if (value) {
      const [hour, minute] = value.split(":").map(Number);

      setSelectedHour(hour);
      setSelectedMinute(minute);
    }
  }, [value]);

  // Scroll to selected item
  const scrollToSelected = (
    containerRef: React.RefObject<HTMLDivElement>,
    index: number,
  ) => {
    if (containerRef.current) {
      const container = containerRef.current;
      const itemHeight = 48; // Height of each item
      const scrollTop =
        index * itemHeight - container.clientHeight / 2 + itemHeight / 2;

      container.scrollTo({ top: scrollTop, behavior: "smooth" });
    }
  };

  // Open modal and scroll to current values
  const handleOpen = () => {
    onOpen();
    setTimeout(() => {
      const hourIndex = hours.findIndex((h) => h === selectedHour);
      const minuteIndex = minutes.findIndex((m) => m === selectedMinute);

      scrollToSelected(hourRef, hourIndex);
      scrollToSelected(minuteRef, minuteIndex);
    }, 100);
  };

  // Handle wheel item click
  const handleHourClick = (hour: number) => {
    setSelectedHour(hour);
    const hourIndex = hours.findIndex((h) => h === hour);

    scrollToSelected(hourRef, hourIndex);
  };

  const handleMinuteClick = (minute: number) => {
    setSelectedMinute(minute);
    const minuteIndex = minutes.findIndex((m) => m === minute);

    scrollToSelected(minuteRef, minuteIndex);
  };

  // Confirm selection
  const handleConfirm = () => {
    const timeString = `${selectedHour.toString().padStart(2, "0")}:${selectedMinute.toString().padStart(2, "0")}`;

    onChange?.(timeString);
    onClose();
  };

  // Format display value
  const displayValue = value ? value : "";

  return (
    <>
      <Input
        readOnly
        className={`${className} cursor-pointer`}
        classNames={{
          input: ["cursor-pointer"],
          inputWrapper: ["cursor-pointer"],
        }}
        description={description}
        errorMessage={errorMessage}
        isRequired={isRequired}
        label={label}
        value={displayValue}
        onClick={handleOpen}
      />

      <Modal
        classNames={{
          base: "bg-white dark:bg-gray-900",
          body: "py-6",
          header: "border-b border-gray-200 dark:border-gray-700",
          footer: "border-t border-gray-200 dark:border-gray-700",
        }}
        isOpen={isOpen}
        placement="center"
        size="sm"
        onClose={onClose}
      >
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">
            <h3 className="text-lg font-semibold">Select Time</h3>
            <p className="text-sm text-gray-500">{description}</p>
          </ModalHeader>
          <ModalBody>
            <div className="flex justify-center items-center gap-4">
              {/* Hour Wheel */}
              <div className="flex flex-col items-center">
                <div className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
                  Hour
                </div>
                <div
                  ref={hourRef}
                  className="h-48 w-16 overflow-y-auto relative"
                  style={{
                    scrollbarWidth: "none",
                    msOverflowStyle: "none",
                  }}
                >
                  <div className="py-20">
                    {hours.map((hour) => (
                      <button
                        key={hour}
                        className={`h-12 w-full flex items-center justify-center cursor-pointer transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 rounded-lg ${
                          hour === selectedHour
                            ? "bg-blue-500 text-white scale-105 font-semibold"
                            : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                        }`}
                        type="button"
                        onClick={() => handleHourClick(hour)}
                      >
                        {hour.toString().padStart(2, "0")}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Separator */}
              <div className="text-2xl font-bold text-gray-400 self-center pt-6">
                :
              </div>

              {/* Minute Wheel */}
              <div className="flex flex-col items-center">
                <div className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-2">
                  Minute
                </div>
                <div
                  ref={minuteRef}
                  className="h-48 w-16 overflow-y-auto relative"
                  style={{
                    scrollbarWidth: "none",
                    msOverflowStyle: "none",
                  }}
                >
                  <div className="py-20">
                    {minutes.map((minute) => (
                      <button
                        key={minute}
                        className={`h-12 w-full flex items-center justify-center cursor-pointer transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 rounded-lg ${
                          minute === selectedMinute
                            ? "bg-blue-500 text-white scale-105 font-semibold"
                            : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                        }`}
                        type="button"
                        onClick={() => handleMinuteClick(minute)}
                      >
                        {minute.toString().padStart(2, "0")}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Selected Time Display */}
            <div className="mt-4 text-center">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {selectedHour.toString().padStart(2, "0")}:
                {selectedMinute.toString().padStart(2, "0")}
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button color="danger" variant="light" onPress={onClose}>
              Cancel
            </Button>
            <Button color="primary" onPress={handleConfirm}>
              Select
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default TimeWheelPicker;
