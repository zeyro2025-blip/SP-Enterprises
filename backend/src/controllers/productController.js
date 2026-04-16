const Product = require("../models/Product");
const createSlug = require("../utils/createSlug");
const asyncHandler = require("../utils/asyncHandler");

const getProducts = asyncHandler(async (req, res) => {
  const { search = "", category = "", sort = "latest" } = req.query;

  const filter = {};
  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
      { category: { $regex: search, $options: "i" } },
    ];
  }

  if (category) {
    filter.category = category;
  }

  const sortMap = {
    latest: { createdAt: -1 },
    priceAsc: { price: 1 },
    priceDesc: { price: -1 },
    rating: { rating: -1 },
    name: { name: 1 },
  };

  const products = await Product.find(filter).sort(sortMap[sort] || sortMap.latest);
  const categories = await Product.distinct("category");

  res.json({ products, categories });
});

const getFeaturedProducts = asyncHandler(async (_req, res) => {
  const products = await Product.find({ featured: true }).sort({ createdAt: -1 }).limit(6);
  res.json({ products });
});

const getProductBySlug = asyncHandler(async (req, res) => {
  const product = await Product.findOne({ slug: req.params.slug }).populate(
    "reviews.user",
    "name"
  );

  if (!product) {
    const error = new Error("Product not found");
    error.statusCode = 404;
    throw error;
  }

  res.json({ product });
});

const createProduct = asyncHandler(async (req, res) => {
  const { name, category, description, price, stock, featured } = req.body;

  if (!req.file) {
    const error = new Error("Product image is required");
    error.statusCode = 400;
    throw error;
  }

  const slug = createSlug(name);
  const existingProduct = await Product.findOne({ slug });
  if (existingProduct) {
    const error = new Error("A product with this name already exists");
    error.statusCode = 409;
    throw error;
  }

  const product = await Product.create({
    name,
    slug,
    category,
    description,
    price: Number(price),
    stock: Number(stock),
    featured: featured === "true" || featured === true,
    image: `/uploads/${req.file.filename}`,
  });

  res.status(201).json({ message: "Product created", product });
});

const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    const error = new Error("Product not found");
    error.statusCode = 404;
    throw error;
  }

  const { name, category, description, price, stock, featured } = req.body;

  if (name && name !== product.name) {
    product.slug = createSlug(name);
  }

  product.name = name || product.name;
  product.category = category || product.category;
  product.description = description || product.description;
  product.price = price !== undefined ? Number(price) : product.price;
  product.stock = stock !== undefined ? Number(stock) : product.stock;
  product.featured =
    featured !== undefined ? featured === "true" || featured === true : product.featured;

  if (req.file) {
    product.image = `/uploads/${req.file.filename}`;
  }

  await product.save();

  res.json({ message: "Product updated", product });
});

const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    const error = new Error("Product not found");
    error.statusCode = 404;
    throw error;
  }

  await product.deleteOne();
  res.json({ message: "Product deleted" });
});

const addReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;
  const product = await Product.findById(req.params.id);

  if (!product) {
    const error = new Error("Product not found");
    error.statusCode = 404;
    throw error;
  }

  const existingReview = product.reviews.find(
    (review) => review.user.toString() === req.user._id.toString()
  );

  if (existingReview) {
    const error = new Error("You have already reviewed this product");
    error.statusCode = 400;
    throw error;
  }

  product.reviews.push({
    user: req.user._id,
    name: req.user.name,
    rating: Number(rating),
    comment,
  });

  product.numReviews = product.reviews.length;
  product.rating =
    product.reviews.reduce((acc, review) => acc + review.rating, 0) / product.reviews.length;

  await product.save();
  res.status(201).json({ message: "Review added" });
});

module.exports = {
  getProducts,
  getFeaturedProducts,
  getProductBySlug,
  createProduct,
  updateProduct,
  deleteProduct,
  addReview,
};
