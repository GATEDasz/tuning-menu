import React, { useState } from "react";
import { fetchNui } from "../utils/fetchNui";
import { useNuiEvent } from "../hooks/useNuiEvent";
import PresetsTab from "./PresetsTab"; 

const App: React.FC = () => {
  const [frontLeftCamber, setFrontLeftCamber] = useState(0);
  const [frontRightCamber, setFrontRightCamber] = useState(0);
  const [rearLeftCamber, setRearLeftCamber] = useState(0);
  const [rearRightCamber, setRearRightCamber] = useState(0);
  const [frontLeftOffset, setFrontLeftOffset] = useState(0);
  const [frontRightOffset, setFrontRightOffset] = useState(0);
  const [rearLeftOffset, setRearLeftOffset] = useState(0);
  const [rearRightOffset, setRearRightOffset] = useState(0);
  const [tireWidth, setTireWidth] = useState(0);
  const [rideHeight, setRideHeight] = useState(0);
  const [activeTab, setActiveTab] = useState("Camber");
  const [presetName, setPresetName] = useState("");
  const [showPresetNameInput, setShowPresetNameInput] = useState(false);
  

  let carSettings = [
    { min: -0.3, max: 0.3, label: 'Front Left Camber', value: frontLeftCamber, type: 'frontLeftCamber' },
    { min: -0.3, max: 0.3, label: 'Front Right Camber', value: frontRightCamber, type: 'frontRightCamber' },
    { min: -0.3, max: 0.3, label: 'Rear Left Camber', value: rearLeftCamber, type: 'rearLeftCamber' },
    { min: -0.3, max: 0.3, label: 'Rear Right Camber', value: rearRightCamber, type: 'rearRightCamber' },
    { min: -1.2, max: -0.6, label: 'Front Left Offset', value: frontLeftOffset, type: 'frontLeftOffset' },
    { min: 0.6, max: 1.2, label: 'Front Right Offset', value: frontRightOffset, type: 'frontRightOffset' },
    { min: -1.2, max: -0.6, label: 'Rear Left Offset', value: rearLeftOffset, type: 'rearLeftOffset' },
    { min: 0.6, max: 1.2, label: 'Rear Right Offset', value: rearRightOffset, type: 'rearRightOffset' },
    { min: 0.1, max: 1.35, label: 'Tire Width', value: tireWidth, type: 'tireWidth' },
    { min: -0.45, max: 0.34, label: 'Ride Height', value: rideHeight, type: 'rideHeight' },
  ];

  useNuiEvent('setValues', (data: any) => {
    for (let i = 0; i < carSettings.length; i++) {
      const element = carSettings[i];
      switch (element.type) {
        case 'frontLeftCamber':
          carSettings[i].value = data.frontLeftCamber
          setFrontLeftCamber(data.frontLeftCamber);
          break;
        case 'frontRightCamber':
          carSettings[i].value = data.frontRightCamber
          setFrontRightCamber(data.frontRightCamber);
          break;
        case 'rearLeftCamber':
          carSettings[i].value = data.rearLeftCamber
          setRearLeftCamber(data.rearLeftCamber);
          break;
        case 'rearRightCamber':
          carSettings[i].value = data.rearRightCamber
          setRearRightCamber(data.rearRightCamber);
          break;
        case 'frontLeftOffset':
          carSettings[i].value = data.frontLeftOffset
          setFrontLeftOffset(data.frontLeftOffset);
          break;
        case 'frontRightOffset':
          carSettings[i].value = data.frontRightOffset
          setFrontRightOffset(data.frontRightOffset);
          break;
        case 'rearLeftOffset':
          carSettings[i].value = data.rearLeftOffset
          setRearLeftOffset(data.rearLeftOffset);
          break;
        case 'rearRightOffset':
          carSettings[i].value = data.rearRightOffset
          setRearRightOffset(data.rearRightOffset);
          break;
        case 'tireWidth':
          carSettings[i].value = data.tireWidth
          setTireWidth(data.tireWidth);
          break;
        case 'rideHeight':
          carSettings[i].value = data.rideHeight
          setRideHeight(data.rideHeight);
          break;
        default:
          console.log(`Unknown type: ${element.type}`);
      }
    }
  })

  const handleSliderChange = (e: number, type: string) => {
    switch (type) {
      case 'frontLeftCamber':
        setFrontLeftCamber(e);
        break;
      case 'frontRightCamber':
        setFrontRightCamber(e);
        break;
      case 'rearLeftCamber':
        setRearLeftCamber(e);
        break;
      case 'rearRightCamber':
        setRearRightCamber(e);
        break;
      case 'frontLeftOffset':
        setFrontLeftOffset(e);
        break;
      case 'frontRightOffset':
        setFrontRightOffset(e);
        break;
      case 'rearLeftOffset':
        setRearLeftOffset(e);
        break;
      case 'rearRightOffset':
        setRearRightOffset(e);
        break;
      case 'tireWidth':
        setTireWidth(e);
        break;
      case 'rideHeight':
        setRideHeight(e);
        break;
      default:
        console.log(`Unknown type: ${type}`);
    }

    fetchNui('updateWheelSettings', {
      frontLeftCamber: frontLeftCamber,
      frontRightCamber: frontRightCamber,
      rearLeftCamber: rearLeftCamber,
      rearRightCamber: rearRightCamber,
      frontLeftOffset: frontLeftOffset,
      frontRightOffset: frontRightOffset,
      rearLeftOffset: rearLeftOffset,
      rearRightOffset: rearRightOffset,
      vehicleHeight: rideHeight,
      wheelWidth: tireWidth,
    });
    // Additional actions on slider change can be performed here
  };

  const sendWheelCamberData = () => {
    // Send wheel camber data to Lua script
    fetchNui('updateWheelSettings', {
      frontLeftCamber: frontLeftCamber,
      frontRightCamber: frontRightCamber,
      rearLeftCamber: rearLeftCamber,
      rearRightCamber: rearRightCamber,
      frontLeftOffset: frontLeftOffset,
      frontRightOffset: frontRightOffset,
      rearLeftOffset: rearLeftOffset,
      rearRightOffset: rearRightOffset,
      vehicleHeight: rideHeight,
      wheelWidth: tireWidth,
    });
  };

  const savePreset = () => {
    if (!showPresetNameInput) {
      // Toggle the visibility of preset name input field
      setShowPresetNameInput(true);
  
      // If the input field is visible, focus on it
      document.getElementById("presetNameInput")?.focus();
    } else {
      // Gather data from your NUI menu
      const presetData = {
        frontLeftCamber: frontLeftCamber,
        frontRightCamber: frontRightCamber,
        rearLeftCamber: rearLeftCamber,
        rearRightCamber: rearRightCamber,
        frontLeftOffset: frontLeftOffset,
        frontRightOffset: frontRightOffset,
        rearLeftOffset: rearLeftOffset,
        rearRightOffset: rearRightOffset,
        rideHeight: rideHeight, // Change "vehicleHeight" to "rideHeight"
        tireWidth: tireWidth,
        presetName: presetName.trim(),
      };
  
      // Trigger the NUI callback with presetData and presetName
      fetchNui('savePreset', { presetData, presetName });
  
      // Reset the presetName state to an empty string after saving the preset
      setPresetName("");
  
      // Toggle the visibility of preset name input field
      setShowPresetNameInput(false);
    }
  };
  

  const [selectedItem, setSelectedItem] = useState<string>("");

  return (
    <div style={{ userSelect: 'none' }}>
      <div>
        <div className="absolute bg-bg shadow-2xl rounded-lg right-8 top-16 w-96 p-4">
          <div className="text-3xl text-white w-full text-center mt-3 mb-3 font-bold">MDNT TUNER MENU</div>
          <div>
            {/* Tabs */}
            <div className="flex justify-center space-x-4 mt-4">
              <div
                className={`hover:bg-primary tab cursor-pointer py-2 px-4 font-bold rounded-md ${activeTab === "Camber" ? "bg-primary text-white" : "bg-fore text-white"}`}
                onClick={() => setActiveTab("Camber")}
              >
                Camber
              </div>
              <div
                className={`hover:bg-primary tab cursor-pointer py-2 font-bold px-4 rounded-md ${activeTab === "Presets" ? "bg-primary text-white" : "bg-fore text-white"}`}
                onClick={() => setActiveTab("Presets")}
              >
                Presets
              </div>
            </div>

            <div className="mt-6">
              {/* Conditionally render content based on activeTab */}
              {activeTab === "Camber" && (
                <>
                  {carSettings.map((setting) => (
                    <div className="mb-4" key={setting.type}>
                      <div className="flex text-white font-bold">
                        <div className="mr-2 pl-3">{setting.label}</div>
                        <div className="absolute right-0 pr-8 flex text-white font-bold">
                          {setting.value.toFixed(2)}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 mt-2 adjustment-input">
                        <input
                          type="range"
                          className="slider range w-full flex mr-2 ml-2 appearance-none bg-primary rounded"
                          style={{ height: 9}}
                          min={setting.min}
                          max={setting.max}
                          step={0.01}
                          value={setting.value}
                          onChange={(e) => handleSliderChange(Number(e.target.value), setting.type)}
                        />
                      </div>
                    </div>
                  ))}

                  {/* "Save" button inside the Camber tab */}
                  <div className="flex gap-4 justify-center">
                    <button
                      className={`flex hover:bg-primary tab cursor-pointer py-2 px-4 font-bold rounded-md mt-3 mb-3 bg-fore text-white`}
                      onClick={sendWheelCamberData}
                    >
                      Save Camber
                    </button>
                    <button
                        className={`flex hover:bg-primary tab cursor-pointer py-2 px-4 font-bold rounded-md mt-3 mb-3 bg-fore text-white`}
                        onClick={() => {
                          if (!showPresetNameInput) {
                            setShowPresetNameInput(true);
                          }
                        }}
                    >
                        Save Preset
                    </button>
                  </div>
                  {/* Input field for preset name (conditionally rendered) */}
                  {showPresetNameInput && (
                    <div className="mb-4">
                      <div className="flex text-white font-bold">
                        <div className="mr-2 pl-3">Preset Name</div>
                        <div className="text-sm text-gray-500 absolute right-0  mt-1 mr-8">(Press Enter to Save)</div>
                      </div>
                      <div className="flex items-center space-x-2 mt-2 adjustment-input">
                        <input
                          id="presetNameInput"
                          type="text"
                          className="input text-white w-full flex mr-2 ml-2 bg-primary rounded p-2 outline-none"
                          value={presetName}
                          onChange={(e) => setPresetName(e.target.value)}
                          onKeyUp={(e) => {
                            if (e.key === "Enter") {
                              savePreset();
                            }
                          }}
                        />
                      </div>
                    </div>
                  )}

                <div className="text-center text-white mt-1 mb-1 legend-text">
                  <span className="bg-primary p-1 rounded-md px-2 mr-1 shadow-lg font-bold">CTRL</span> to unfocus and look around.
                </div>
              </>
            )}
            {activeTab === "Presets" && (
              <PresetsTab onPresetLoad={(preset) => console.log(`Load Preset: ${preset}`)} />
            )}
          </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;