import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { DeviceInfo } from "../entities/DeviceInfo";
import { User } from "../entities/User";

// Add or update device information for a specific user
export const addOrUpdateDeviceInfoForUser = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const deviceInfoRepo = AppDataSource.getRepository(DeviceInfo);
  const userRepo = AppDataSource.getRepository(User);

  try {
    const {
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
    } = req.body;

    // Extract user ID from request params
    const userId = req.params.userId;

    // Find the user
    const user = await userRepo.findOne({
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

    let deviceInfo: DeviceInfo | null = user.device_info || null;

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

      await deviceInfoRepo.save(deviceInfo);

      return res.status(200).json({
        success: true,
        message: "Device information updated successfully for user.",
        data: deviceInfo,
      });
    } else {
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

      await deviceInfoRepo.save(deviceInfo);

      // Link the new device info to the user
      user.device_info = deviceInfo;
      await userRepo.save(user);

      return res.status(201).json({
        success: true,
        message: "Device information added and linked to user successfully.",
        data: deviceInfo,
      });
    }
  } catch (error: any) {
    console.error(
      "Error in adding/updating device information for user:",
      error
    );
    return res.status(500).json({
      success: false,
      message: "An unexpected error occurred.",
      data: null,
    });
  }
};
