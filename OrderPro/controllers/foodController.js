import {
  createFoodService,
  getAllFoodsService,
  getFoodByIdService,
  updateFoodService,
  deleteFoodService,
  searchFoodService,
  getFoodByCategoryService,
} from "../services/foodService.js";

export const createFood = async (req, res) => {
  try {
    const food = await createFoodService(req.body);

    res.status(201).json({
      success: true,
      message: "Food added successfully",
      food,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const getAllFoods = async (req, res) => {
  try {
    const foods = await getAllFoodsService();

    res.status(200).json({
      success: true,
      count: foods.length,
      foods,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getFoodById = async (req, res) => {
  try {
    const food = await getFoodByIdService(req.params.id);

    res.status(200).json({
      success: true,
      food,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateFood = async (req, res) => {
  try {
    const food = await updateFoodService(req.params.id, req.body);

    res.status(200).json({
      success: true,
      message: "Food updated successfully",
      food,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteFood = async (req, res) => {
  try {
    await deleteFoodService(req.params.id);

    res.status(200).json({
      success: true,
      message: "Food deleted successfully",
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

export const searchFood = async (req, res) => {
  try {
    const foods = await searchFoodService(req.query.name);

    res.status(200).json({
      success: true,
      count: foods.length,
      foods,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getFoodByCategory = async (req, res) => {
  try {
    const foods = await getFoodByCategoryService(req.params.categoryId);

    res.status(200).json({
      success: true,
      count: foods.length,
      foods,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};