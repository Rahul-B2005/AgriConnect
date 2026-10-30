const Crop = require('../models/Crop');

exports.listCrops = async (req, res) => {
  try {
    const { district, category, search } = req.query;
    const filter = { status: 'available' };
    if (district) filter.district = new RegExp(district, 'i');
    if (category) filter.category = new RegExp(category, 'i');
    if (search) filter.name = new RegExp(search, 'i');

    const crops = await Crop.find(filter)
      .populate('farmer', 'name district phone')
      .sort({ createdAt: -1 });
    res.json(crops);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getCrop = async (req, res) => {
  try {
    const crop = await Crop.findById(req.params.id).populate('farmer', 'name district phone');
    if (!crop) return res.status(404).json({ message: 'Crop not found' });
    res.json(crop);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createCrop = async (req, res) => {
  try {
    const { name, category, pricePerUnit, unit, quantityAvailable, district, harvestDate, imageEmoji } = req.body;
    const crop = await Crop.create({
      farmer: req.user._id,
      name,
      category,
      pricePerUnit,
      unit,
      quantityAvailable,
      district,
      harvestDate,
      imageEmoji,
    });
    res.status(201).json(crop);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.myCrops = async (req, res) => {
  try {
    const crops = await Crop.find({ farmer: req.user._id }).sort({ createdAt: -1 });
    res.json(crops);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateCrop = async (req, res) => {
  try {
    const crop = await Crop.findById(req.params.id);
    if (!crop) return res.status(404).json({ message: 'Crop not found' });
    if (crop.farmer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not your listing' });
    }
    Object.assign(crop, req.body);
    await crop.save();
    res.json(crop);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteCrop = async (req, res) => {
  try {
    const crop = await Crop.findById(req.params.id);
    if (!crop) return res.status(404).json({ message: 'Crop not found' });
    if (crop.farmer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not your listing' });
    }
    await crop.deleteOne();
    res.json({ message: 'Listing removed' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
