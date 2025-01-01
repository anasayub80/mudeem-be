import SuccessHandler from '../../utils/successHandler';
import ErrorHandler from '../../utils/errorHandler';
import { RequestHandler } from 'express';
import { IOrder, IProduct, IVariant } from '../../types/models/shop';
import Product from '../../models/shop/product.model';
import Variant from '../../models/shop/variant.model';
import Address from '../../models/user/address.model';
import Order from '../../models/shop/order.model';
import User from '../../models/user/user.model';

const checkout: RequestHandler = async (req, res) => {
  // #swagger.tags = ['order']
  try {
    const { cart } = req.body;
    // Logic to checkout the cart
    Promise.all(
      cart.map(async (item: any) => {
        // Validate product availability
        const product: IProduct | null = await Product.findOne({
          _id: item.product,
          isActive: true
        });
        if (!product) {
          throw new Error(`Product with id ${item.product} not found`);
        }
        if (!product.stock) {
          throw new Error(`Product with id ${item.product} is out of stock`);
        }

        // Validate variant availability and get the price
        const variant: IVariant | null = await Variant.findOne({
          _id: item.variant,
          isActive: true
        });
        if (!variant) {
          throw new Error(`Variant with id ${item.variant} not found`);
        }
        if (!variant.colors.includes(item.color)) {
          throw new Error(
            `Color ${item.color} not available for variant with id ${item.variant}`
          );
        }
        if (!variant.sizes.includes(item.size)) {
          throw new Error(
            `Size ${item.size} not available for variant with id ${item.variant}`
          );
        }

        return {
          product: product,
          variant: variant,
          price: variant.price,
          color: item.color,
          size: item.size,
          quantity: item.quantity,
          total: variant.price * item.quantity,
          greenPoints: product.greenPointsPerUnit * item.quantity
        };
      })
    ).then(async (items) => {
      const orderAmount: number = items.reduce(
        (acc, item) => acc + item.total,
        0
      );
      const deliveryCharge: number = 50;
      const totalAmount: number = orderAmount + deliveryCharge;
      const totalGreenPoints: number = items.reduce(
        (acc, item) => acc + item.greenPoints,
        0
      );
      if (req.body.address) {
        const exAddress = await Address.findOne({
          user: req.user?._id
        });
        if (!exAddress) {
          await Address.create({
            user: req.user?._id,
            ...req.body.address
          });
        } else {
          await Address.updateOne(
            {
              user: req.user?._id
            },
            {
              $set: req.body.address
            }
          );
        }
      }
      return SuccessHandler({
        res,
        data: {
          items,
          orderAmount,
          deliveryCharge,
          totalAmount,
          totalGreenPoints
        },
        statusCode: 200
      });
    });
  } catch (error) {
    return ErrorHandler({
      message: (error as Error).message,
      statusCode: 500,
      req,
      res
    });
  }
};

const createOrder: RequestHandler = async (req, res) => {
  // #swagger.tags = ['order']
  try {
    const { items, deliveryCharge, totalAmount, totalGreenPoints } = req.body;
    if (req.user?.greenPoints && req.user?.greenPoints < totalAmount) {
      return ErrorHandler({
        message: 'Insufficient green points',
        statusCode: 400,
        req,
        res
      });
    }
    // Logic to create order
    const order: IOrder | null = await Order.create({
      user: req.user?._id,
      items,
      totalAmount,
      deliveryCharge,
      address: await Address.findOne({
        user: req.user?._id
      }),
      status: 'confirmed',
      totalGreenPoints
    });

    req.user?.greenPoints &&
      (await User.updateOne(
        {
          _id: req.user?._id
        },
        {
          $set: {
            greenPoints: req.user.greenPoints - totalAmount + totalGreenPoints
          }
        }
      ));
    return SuccessHandler({
      res,
      data: {
        message: 'Order created successfully',
        order
      },
      statusCode: 200
    });
  } catch (error) {
    return ErrorHandler({
      message: (error as Error).message,
      statusCode: 500,
      req,
      res
    });
  }
};

const getOrders: RequestHandler = async (req, res) => {
  // #swagger.tags = ['order']
  try {
    const role = req.user?.role;

    let orders: IOrder[] = [];
    if (role === 'admin') {
      orders = await Order.find()
        .populate('user')
        .populate('items.product')
        .populate('items.variant')
        .populate('vendor');
    } else if (role === 'vendor') {
      orders = await Order.find({
        vendor: req.user?._id
      })
        .populate('user')
        .populate('items.product')
        .populate('items.variant');
    } else {
      orders = await Order.find({
        user: req.user?._id
      })
        .populate('items.product')
        .populate('items.variant')
        .populate('vendor');
    }
    return SuccessHandler({
      res,
      data: orders,
      statusCode: 200
    });
  } catch (error) {
    return ErrorHandler({
      message: (error as Error).message,
      statusCode: 500,
      req,
      res
    });
  }
};

const updateOrderStatus: RequestHandler = async (req, res) => {
  // #swagger.tags = ['order']
  try {
    const { orderId, status } = req.body;
    const order: IOrder | null = await Order.findOne({
      _id: orderId
    });
    if (!order) {
      throw new Error(`Order with id ${orderId} not found`);
    }
    await Order.updateOne(
      {
        _id: orderId
      },
      {
        $set: {
          status
        }
      }
    );
    return SuccessHandler({
      res,
      data: {
        message: 'Order status updated successfully'
      },
      statusCode: 200
    });
  } catch (error) {
    return ErrorHandler({
      message: (error as Error).message,
      statusCode: 500,
      req,
      res
    });
  }
};

export { checkout, createOrder, getOrders, updateOrderStatus };
