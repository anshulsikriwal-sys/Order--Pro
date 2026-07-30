import { getProfile } from "../services/profileService.js";

export const profile = async (req, res) => {
  try {
    const user = await getProfile(req.user.id);

    res.status(200).json({
      success: true,
      user,
    });
  } catch (err) {
    res.status(404).json({
      success: false,
      message: err.message,
    });
  }
};