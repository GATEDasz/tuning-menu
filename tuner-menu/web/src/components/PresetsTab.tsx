import React, { useState, useEffect } from "react";
import { fetchNui } from "../utils/fetchNui";
import { useNuiEvent } from "../hooks/useNuiEvent";

interface PresetsTabProps {
  onPresetLoad: (presetId: number) => void;
}

interface Preset {
  id: number;
  name: string;
}

const PresetsTab: React.FC<PresetsTabProps> = ({ onPresetLoad }) => {
  const [selectedItem, setSelectedItem] = useState<number | null>(null);
  const [presets, setPresets] = useState<Preset[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Use NUI event to trigger fetching presets when the server sends them
  useNuiEvent("receivePresets", (receivedPresets: Preset[]) => {
    setPresets(receivedPresets || []);
    setError(null);
  });

  // Function to handle applying a preset
  const applyPreset = () => {
    if (selectedItem !== null) {
      // Trigger NUI callback to load and apply the preset
      fetchNui('loadPreset', { presetId: selectedItem });
      // You can also notify the parent component about the preset load
      onPresetLoad(selectedItem);
    }
  };

  return (
    <div className="mb-4">
  
      {/* Dropdown menu for presets */}
      <div className="flex justify-center mt-3">
        <select
          className="hover:bg-primary tab cursor-pointer py-2 px-4 font-bold rounded-md mt-3 bg-fore text-white"
          onChange={(e) => setSelectedItem(Number(e.target.value))}
          value={selectedItem || ""}
          style={{
            width: "60%", // Set the width to 100% to match the length of the box
            textAlign: "center", // Center align the text
          }}
        >
          <option value="" disabled>Select a preset</option>
          {presets.map((preset) => (
            <option key={preset.id} value={preset.id}>
              {preset.name}
            </option>
          ))}
        </select>
      </div>

      {/* "Apply Preset" button */}
      <div className="flex justify-center mt-3">
        <button
          className="hover:bg-primary tab cursor-pointer py-2 px-4 font-bold rounded-md mt-3 bg-fore text-white"
          onClick={applyPreset}
          disabled={selectedItem === null}
        >
          Apply Preset
        </button>
      </div>
    </div>
  );
};

export default PresetsTab;
