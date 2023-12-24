local QBCore = exports['qb-core']:GetCoreObject()

function DbSavePreset(playerId, presetData)
    local playerId, presetName = tonumber(playerId), tostring(presetData.presetName)

    -- First, check if a preset with the same name already exists
    exports['oxmysql']:execute('SELECT preset_name FROM presets WHERE player_id = ? AND preset_name = ?', { playerId, presetName }, function(result)
        if result and #result > 0 then
            print("[Presets] A preset with the same name already exists.")
        else
            -- If no preset with the same name exists, then proceed to save the new preset
            exports['oxmysql']:execute('INSERT INTO presets (player_id, preset_name, front_left_camber, front_right_camber, rear_left_camber, rear_right_camber, front_left_offset, front_right_offset, rear_left_offset, rear_right_offset, tire_width, ride_height) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', {playerId, presetName, presetData.frontLeftCamber, presetData.frontRightCamber, presetData.rearLeftCamber, presetData.rearRightCamber, presetData.frontLeftOffset, presetData.frontRightOffset, presetData.rearLeftOffset, presetData.rearRightOffset, presetData.tireWidth, presetData.rideHeight}, function(result)
                if result then
                    print("[Presets] Preset saved.")
                else
                    print("[Presets] Preset not saved.")
                end
            end)
        end
    end)
end





-- function loadPreset(playerId, vehicleModel, presetId, presetName)
--   -- APPLY PRESET ONTO CAR AND SAVE TO DB
-- end

function GetPresets(playerId, vehicleModel)
    local playerId, vehicleModel = tonumber(playerId), tostring(vehicleModel)

    local sql = [[
        SELECT
            id,
            preset_name
        FROM presets
        WHERE player_id = @playerId AND vehicle_model = @vehicleModel
    ]]
    local params = {
        ['@playerId'] = playerId,
        ['@vehicleModel'] = vehicleModel
    }

    exports['oxmysql']:fetchAll(sql, params, function(result)
        if result and #result > 0 then
            TriggerClientEvent('populatePresetsDropdown', playerId, result)
        else
            print("[Presets] No presets found.")
        end
    end)
end


RegisterNetEvent('getPresets', function(playerId, vehicleModel)
    print("[Presets] Server event 'getPresets' called.")
    GetPresets(playerId, vehicleModel)
end)

RegisterNetEvent('savePreset', function(playerId, presetData)
    DbSavePreset(playerId, presetData)
end)



-- TODO load presets onto vehicles....

-- RegisterNetEvent('loadPreset')
-- AddEventHandler('loadPreset', function(playerId, vehicleModel, presetId)
--     print("[Presets] Server event 'loadPreset' called.")
--     LoadPreset(playerId, vehicleModel, presetId)
-- end)

