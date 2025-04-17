"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addOrUpdateDeviceInfoForUser = void 0;
const data_source_1 = require("../data-source");
const DeviceInfo_1 = require("../entities/DeviceInfo");
const User_1 = require("../entities/User");
// Add or update device information for a specific user
const addOrUpdateDeviceInfoForUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const deviceInfoRepo = data_source_1.AppDataSource.getRepository(DeviceInfo_1.DeviceInfo);
    const userRepo = data_source_1.AppDataSource.getRepository(User_1.User);
    try {
        const { name, model, manufacturer, version, brand, fingerprint, serial_number, device_id, IMEI, latitude, longitude, } = req.body;
        // Extract user ID from request params
        const userId = req.params.userId;
        // Find the user
        const user = yield userRepo.findOne({
            where: { id: Number(userId) },
            relations: ["device_info"], // Ensure we load the device_info relation
        });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found.",
                data: null,
            });
        }
        let deviceInfo = user.device_info || null;
        if (deviceInfo) {
            // If device info exists, update it
            deviceInfo.name = name || deviceInfo.name;
            deviceInfo.model = model || deviceInfo.model;
            deviceInfo.manufacturer = manufacturer || deviceInfo.manufacturer;
            deviceInfo.version = version || deviceInfo.version;
            deviceInfo.brand = brand || deviceInfo.brand;
            deviceInfo.fingerprint = fingerprint || deviceInfo.fingerprint;
            deviceInfo.serial_number = serial_number || deviceInfo.serial_number;
            deviceInfo.device_id = device_id || deviceInfo.device_id;
            deviceInfo.IMEI = IMEI || deviceInfo.IMEI;
            deviceInfo.latitude = latitude || deviceInfo.latitude;
            deviceInfo.longitude = longitude || deviceInfo.longitude;
            deviceInfo.updatedAt = new Date();
            yield deviceInfoRepo.save(deviceInfo);
            return res.status(200).json({
                success: true,
                message: "Device information updated successfully for user.",
                data: deviceInfo,
            });
        }
        else {
            // If no device info exists, create a new one
            deviceInfo = deviceInfoRepo.create({
                name,
                model,
                manufacturer,
                version,
                brand,
                fingerprint,
                serial_number,
                device_id,
                IMEI,
                latitude,
                longitude,
                createdAt: new Date(),
                updatedAt: new Date(),
            });
            yield deviceInfoRepo.save(deviceInfo);
            // Link the new device info to the user
            user.device_info = deviceInfo;
            yield userRepo.save(user);
            return res.status(201).json({
                success: true,
                message: "Device information added and linked to user successfully.",
                data: deviceInfo,
            });
        }
    }
    catch (error) {
        console.error("Error in adding/updating device information for user:", error);
        return res.status(500).json({
            success: false,
            message: "An unexpected error occurred.",
            data: null,
        });
    }
});
exports.addOrUpdateDeviceInfoForUser = addOrUpdateDeviceInfoForUser;
