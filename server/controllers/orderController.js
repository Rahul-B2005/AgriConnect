const Order = require('../models/Order');
const Crop = require('../models/Crop');

exports.placeOrder = async (req, res) => {
  try {
    const { cropId, quantity, deliveryAddress } = req.body;
    const crop = await Crop.findById(cropId);
    if (!crop || crop.status !== 'available') {
      return res.status(400).json({ message: 'Crop not available' });
    }
    if (quantity > crop.quantityAvailable) {
      return res.status(400).json({ message: 'Requested quantity exceeds available stock' });
    }

    const order = await Order.create({
      buyer: req.user._id,
      crop: crop._id,
      farmer: crop.farmer,
      quantity,
      totalPrice: quantity * crop.pricePerUnit,
      deliveryAddress,
    });

    crop.quantityAvailable -= quantity;
    if (crop.quantityAvailable <= 0) crop.status = 'sold_out';
    await crop.save();

    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.myOrders = async (req, res) => {
  try {
    const orders = await Order.find({ buyer: req.user._id })
      .populate('crop', 'name unit imageEmoji')
      .populate('farmer', 'name district')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.incomingOrders = async (req, res) => {
  try {
    const orders = await Order.find({ farmer: req.user._id })
      .populate('crop', 'name unit imageEmoji')
      .populate('buyer', 'name phone')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateStatus = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    if (order.farmer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not your order to update' });
    }
    order.status = req.body.status;
    await order.save();
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
