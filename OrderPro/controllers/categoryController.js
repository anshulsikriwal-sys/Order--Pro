import {
  createCategoryServices,
  getAllCategoriesServices,
  getCategoryByIdServices,
  updateCategoryServices,
  deleteCategoryServices,
} from "../services/categoryService.js";

// Create Category
export const createCategory = async (req, res) => {
  try {
    const category = await createCategoryServices(req.body);

    res.status(201).json({
      success: true,
      message: "Category created successfully",
      category,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// Get All Categories
export const getAllCategories = async (req, res) => {
  try {
    const categories = await getAllCategoriesServices();

    res.status(200).json({
      success: true,
      count: categories.length,
      categories,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get Category By ID
export const getCategoryById = async (req, res) => {
  try {
    const category = await getCategoryByIdServices(req.params.id);

    res.status(200).json({
      success: true,
      category,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

// Update Category
export const updateCategory = async (req, res) => {
  try {
    const category = await updateCategoryServices(
      req.params.id,
      req.body
    );

    res.status(200).json({
      success: true,
      message: "Category updated successfully",
      category,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete Category
export const deleteCategory = async (req, res) => {
  try {
    await deleteCategoryServices(req.params.id);

    res.status(200).json({
      success: true,
      message: "Category deleted successfully",
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};