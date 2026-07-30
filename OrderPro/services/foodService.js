
import Food from "../models/Food.js";

export const createFoodService = async (foodData) => {
  return await Food.create(foodData);
};

export const getAllFoodsService = async () => {
  return await Food.find().populate("category");
};

export const getFoodByIdService = async (id) => {
  const food = await Food.findById(id).populate("category");

  if (!food) {
    throw new Error("Food not found");
  }

  return food;
};

export const updateFoodService = async (id, updateData) => {
  const food = await Food.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  });

  if (!food) {
    throw new Error("Food not found");
  }

  return food;
};

export const deleteFoodService = async (id) => {
  const food = await Food.findByIdAndDelete(id);

  if (!food) {
    throw new Error("Food not found");
  }

  return food;
};

export const searchFoodService = async (name) => {
  return await Food.find({
    name: { $regex: name, $options: "i" },
  }).populate("category");
};

export const getFoodByCategoryService = async (categoryId) => {
  return await Food.find({
    category: categoryId,
  }).populate("category");
};