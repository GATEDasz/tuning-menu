local QBCore = exports['qb-core']:GetCoreObject()

-- NUI Focus state
local isNuiFocused = true
local veh = nil

-- Function to toggle the NUI frame visibility
local function toggleNuiFrame(shouldShow, vehicle)
    SetNuiFocus(shouldShow, shouldShow)
    SendReactMessage('setVisible', shouldShow)
    if vehicle ~= nil then
        print("Found this vehilce cunt: ", veh)
        SendReactMessage('setValues', {
            frontLeftOffset= GetVehicleWheelXOffset(vehicle, 0),
            frontRightOffset = GetVehicleWheelXOffset(vehicle, 1),
            rearLeftOffset = GetVehicleWheelXOffset(vehicle, 2),
            rearRightOffset = GetVehicleWheelXOffset(vehicle, 3),
            frontLeftCamber = GetVehicleWheelYRotation(vehicle, 0),
            frontRightCamber  = GetVehicleWheelYRotation(vehicle, 1),
            rearLeftCamber  = GetVehicleWheelYRotation(vehicle, 2),
            rearRightCamber  = GetVehicleWheelYRotation(vehicle, 3),
            tireWidth = GetVehicleWheelWidth(vehicle),
            tireSize = 0.0,
            rideHeight = GetVehicleSuspensionHeight(vehicle),
        })
    end
end

function DrawText3D(x, y, z, text)
    local onScreen, _x, _y = World3dToScreen2d(x, y, z)
    local px, py, pz = table.unpack(GetGameplayCamCoords())

    SetTextScale(0.35, 0.35)
    SetTextFont(4)
    SetTextProportional(1)
    SetTextColour(255, 255, 255, 215)
    SetTextEntry("STRING")
    SetTextCentre(1)
    AddTextComponentString(text)
    DrawText(_x, _y)
end

Citizen.CreateThread(function()
    while true do
        Citizen.Wait(0)
        local player = PlayerId()
        local vehicle = GetVehiclePedIsIn(GetPlayerPed(player), false)
        if vehicle and vehicle ~= 0 then
            local numWheels = GetVehicleNumberOfWheels(vehicle)
            for i = 0, numWheels - 1 do
                local wheelBoneName = "wheel_" .. (i < 4 and {"lf", "rf", "lr", "rr"}) [i + 1] or tostring(i)
                local wheelBoneIndex = GetEntityBoneIndexByName(vehicle, wheelBoneName)
                if wheelBoneIndex ~= -1 then
                    local wheelPos = GetWorldPositionOfEntityBone(vehicle, wheelBoneIndex)
                    DrawText3D(wheelPos.x, wheelPos.y, wheelPos.z, tostring(i + 1))
                end
            end
        end
    end
end)

-- Function to toggle NUI focus
local function toggleNuiFocus()
    isNuiFocused = not isNuiFocused
    SetNuiFocus(isNuiFocused, isNuiFocused)
    SendReactMessage('setFocus', isNuiFocused)
end

-- Callback to handle NUI focus toggle from React
RegisterNUICallback('setFocus', function(data, cb)
    toggleNuiFocus()
    cb({ success = true })
end)

-- NUI callback to hide the frame
RegisterNUICallback('hideFrame', function(_, cb)
    toggleNuiFrame(false)
    debugPrint('Hide NUI frame')
    exports['okokTextUI']:Open(('[E] Stance Vehicle'), 'darkblue', 'right')
    cb({})
end)

-- Variables for zone and keypress handling
local waitingForKeyPress = false
local Zone = nil
local inZone = false

function KeyPressThread()
    waitingForKeyPress = true
    CreateThread(function() 
        while waitingForKeyPress do
            Wait(0)
            if inZone then
                if IsControlJustPressed(0, 38) then
                    toggleNuiFrame(true, veh)
                    exports['okokTextUI']:Close(('[E] Stance Vehicle'), 'darkblue', 'right')
                end
                if IsControlJustReleased(0, 36) then
                    toggleNuiFocus()
                end
            end
        end
    end)
end



function HandleInZone()
    inZone = true
 
    CreateThread(function()
        while inZone do
            Wait(500)
            veh = GetVehiclePedIsIn(PlayerPedId(), false)
            if veh ~= 0 and not waitingForKeyPress then
                KeyPressThread()
            end
            if veh == 0 and waitingForKeyPress then
                waitingForKeyPress = false
                exports['okokTextUI']:Close()
            end
        end
    end)
end

-- Function to check vehicle and display UI
function CheckVehicleAndDisplayUI()
    local veh = GetVehiclePedIsIn(PlayerPedId(), false)
    if veh ~= 0 and not waitingForKeyPress and inZone then
        exports['okokTextUI']:Open(('[E] Stance Vehicle'), 'darkblue', 'right')
    elseif veh == 0 and waitingForKeyPress then
        waitingForKeyPress = false
        exports['okokTextUI']:Close()
    end
end

-- Main loop to continuously check for vehicle and UI display
-- This loop is now inside the PolyZone
CreateThread(function()
    while true do
        Wait(500)
        if inZone then
            CheckVehicleAndDisplayUI()
        end
    end
end)

-- Create the zone
CreateThread(function()
    Zone = BoxZone:Create(vector3(139.98, -3035.32, 7.04), 30, 20, {
        name = "MdntShop",
        heading = 0,
        minZ = 5.00,
        maxZ = 8.50,
        debugPoly = false
    })
    
    -- Handle player in/out of the zone
    Zone:onPlayerInOut(function(isPointInside)
        if isPointInside then
            local veh = GetVehiclePedIsIn(PlayerPedId(), false)
            if veh ~= 0 then
                HandleInZone()
                exports['okokTextUI']:Open(('[E] Stance Vehicle'), 'darkblue', 'right')
            end
        else
            exports['okokTextUI']:Close()
            waitingForKeyPress = false
            inZone = false  -- Set inZone to false when outside the zone
        end
    end)
end)



-- Define essential variables
local wheelSettings = {}
local isBusy = false

-- Function to camber the wheels
function SetWheelCamber(vehicle, frontLeftCamber, frontRightCamber, rearLeftCamber, rearRightCamber)
    SetVehicleHandlingFloat(vehicle, 'CCarHandlingData', 'fCamberFrontLeft', frontLeftCamber)
    SetVehicleHandlingFloat(vehicle, 'CCarHandlingData', 'fCamberFrontRight', frontRightCamber)
    SetVehicleHandlingFloat(vehicle, 'CCarHandlingData', 'fCamberRearLeft', rearLeftCamber)
    SetVehicleHandlingFloat(vehicle, 'CCarHandlingData', 'fCamberRearRight', rearRightCamber)
end

-- Function to set wheel offset
function SetWheelOffset(vehicle, wheelIndex, offset)
    SetVehicleWheelXOffset(vehicle, wheelIndex, offset)
end

-- Function to set vehicle height
function SetVehicleHeight(vehicle, height)
    SetVehicleSuspensionHeight(vehicle, height)
end

-- NUI callback to update wheel settings
RegisterNUICallback('updateWheelSettings', function(data, cb)
    local vehicle = GetVehiclePedIsIn(PlayerPedId(), false)
    if vehicle ~= nil and vehicle ~= 0 then

        local frontLeftCamber = tonumber(data.frontLeftCamber) or 0.0
        local frontRightCamber = tonumber(data.frontRightCamber) or 0.0
        local rearLeftCamber = tonumber(data.rearLeftCamber) or 0.0
        local rearRightCamber = tonumber(data.rearRightCamber) or 0.0
        local frontLeftOffset = tonumber(data.frontLeftOffset) or 0.0
        local frontRightOffset = tonumber(data.frontRightOffset) or 0.0
        local rearLeftOffset = tonumber(data.rearLeftOffset) or 0.0
        local rearRightOffset = tonumber(data.rearRightOffset) or 0.0
        local vehicleHeight = tonumber(data.vehicleHeight) or 0.0
        local wheelWidth = tonumber(data.wheelWidth) or 0.0

        -- Update wheel settings
        SetVehicleWheelYRotation(vehicle, 0, frontLeftCamber)
        SetVehicleWheelYRotation(vehicle, 1, frontRightCamber)
        SetVehicleWheelYRotation(vehicle, 2, rearLeftCamber)
        SetVehicleWheelYRotation(vehicle, 3, rearRightCamber)
        SetVehicleWheelXOffset(vehicle, 0, frontLeftOffset)
        SetVehicleWheelXOffset(vehicle, 1, frontRightOffset)
        SetVehicleWheelXOffset(vehicle, 2, rearLeftOffset)
        SetVehicleWheelXOffset(vehicle, 3, rearRightOffset)
        SetVehicleSuspensionHeight(vehicle, vehicleHeight)
        SetVehicleWheelWidth(vehicle, wheelWidth)

        -- Print all the settings
        print("Front Left Camber:", frontLeftCamber)
        print("Front Right Camber:", frontRightCamber)
        print("Rear Left Camber:", rearLeftCamber)
        print("Rear Right Camber:", rearRightCamber)
        print("Front Left Offset:", frontLeftOffset)
        print("Front Right Offset:", frontRightOffset)
        print("Rear Left Offset:", rearLeftOffset)
        print("Rear Right Offset:", rearRightOffset)
        print("Vehicle Height:", vehicleHeight)
        print("Wheel Width:", wheelWidth)
    end
    cb({})
end)


-- -- NUI callback to load and apply a preset
-- RegisterNUICallback('loadPreset', function(data, cb)
--     local playerId = PlayerId()
--     local vehicle = GetVehiclePedIsIn(PlayerPedId(), false)

--     if vehicle ~= nil and vehicle ~= 0 then
--         local presetId = tonumber(data.presetId) or 0

--         -- Trigger server event to load the preset
--         TriggerServerEvent('loadPreset', playerId, GetEntityModel(vehicle), presetId)
--         print('Presets loaded')
--     end
--     cb(true)
-- end)

RegisterNUICallback('savePreset', function(data, cb)
    local playerId = GetPlayerServerId(PlayerId())
    local vehicle = GetVehiclePedIsIn(PlayerPedId(), false)
    if vehicle ~= nil and vehicle ~= 0 then
        local presetName = data.presetName

        if presetName and string.len(presetName) >= 3 then
            local presetData = data.presetData

            print('Preset saved with name: ' .. presetName)

            -- Save the preset immediately
            TriggerServerEvent('savePreset', playerId, presetData, presetName)
        else
            print('Invalid preset name. Please enter at least 3 characters.')
        end
    end
    cb({})
end)

