import Product from "../models/Product.js";

export const newProduct = async (req, res) => {
  const { name, description, price, category, stock } = req.body;
  const user = req.user;
  try {
    const product = new Product({
      name,
      description,
      price,
      category,
      stock,
      user: user,
    });
    await product.save();
    res.status(201).json({
      success: true,
      message: `Congratulations ${product.name} listed Successfully `,
      product,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      success: false,
      message: `there is error `,
      error,
    });
  }
};

export const getProducts = async (req, res) => {
  const products = await Product.find();
  if (!products) {
    res.status(200).json({
      success: true,
      message: `There are no products found `,
    });
  } else {
    res.status(200).json({
      success: true,
      message: `All products `,
      products,
    });
  }
};

export const getProduct = async (req, res) => {
  const id = req.params.id;

  const product = await Product.findById(id);
  if (product) {
    return res.status(200).json({
      success: true,
      message: `${product.name} is here `,
      product,
    });
  } else {
    return next(new Error("Product not found", 404));
  }
};
