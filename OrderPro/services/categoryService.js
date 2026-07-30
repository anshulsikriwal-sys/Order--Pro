import Category from "../models/Category.js";

export const createCategoryServices = async (categoryData) => {
  const { name, description } = categoryData;

  const existingCategory = await Category.findOne({ name });

  if (existingCategory) {
    throw new Error("Category already exists");
  }

  const category = await Category.create({name,description,});
  
  return category;
};

export const getAllCategoriesServices = async () => {
  const categories = await Category.find();

  return categories;
};

export const getCategoryByIdServices = async (id) => {
  const category = await Category.findById(id);

  if (!category) {
    throw new Error("Category is not found");
  }

  return category;
};

export const updateCategoryServices = async (id, updateData) => {
  const category = await Category.findByIdAndUpdate(id,updateData,{new: true,runValidators: true,});

  if (!category) {
    throw new Error("Category is not found");
  }

  return category;
};

export const deleteCategoryServices = async (id) => {
  const category = await Category.findByIdAndDelete(id);

  if (!category) {
    throw new Error("Category not found");
  }

  return category;
};