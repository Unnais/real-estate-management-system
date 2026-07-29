const Property = require('../models/Property');
const { createPropertySchema, updatePropertySchema, searchPropertySchema } = require('../validators/propertyValidator');

const createProperty = async (req, res) => {
  try {
    const { error, value } = createPropertySchema.validate(req.body);
    if (error) {
      return res.status(400).json({ success: false, error: error.details[0].message });
    }

    const property = await Property.create({
      title: value.title,
      ownerId: req.user.userId,
      type: value.type,
      price: value.price,
      areaSqft: value.areaSqft,
      location: {
        type: 'Point',
        coordinates: [value.location.lng, value.location.lat],
      },
      amenities: value.amenities,
      images: value.images,
    });

    res.status(201).json({ success: true, data: { id: property._id, status: property.status } });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

const getProperties = async (req, res) => {
  try {
    const properties = await Property.find({ status: 'approved' }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: properties });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

const getPropertyById = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) {
      return res.status(404).json({ success: false, error: 'Property not found' });
    }
    res.status(200).json({ success: true, data: property });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

const updateProperty = async (req, res) => {
  try {
    const { error, value } = updatePropertySchema.validate(req.body);
    if (error) {
      return res.status(400).json({ success: false, error: error.details[0].message });
    }

    const property = await Property.findById(req.params.id);
    if (!property) {
      return res.status(404).json({ success: false, error: 'Property not found' });
    }

    const isOwner = property.ownerId.toString() === req.user.userId;
    const isAgent = property.agentId && property.agentId.toString() === req.user.userId;
    if (!isOwner && !isAgent && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, error: 'Not authorized to edit this property' });
    }

    if (value.location) {
      value.location = { type: 'Point', coordinates: [value.location.lng, value.location.lat] };
    }

    Object.assign(property, value);
    await property.save();

    res.status(200).json({ success: true, data: property });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

const deleteProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) {
      return res.status(404).json({ success: false, error: 'Property not found' });
    }

    const isOwner = property.ownerId.toString() === req.user.userId;
    if (!isOwner && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, error: 'Not authorized to delete this property' });
    }

    await property.deleteOne();
    res.status(200).json({ success: true, data: { id: req.params.id } });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

const updatePropertyStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!['approved', 'rejected', 'inactive', 'pending'].includes(status)) {
      return res.status(400).json({ success: false, error: 'Invalid status' });
    }

    const property = await Property.findById(req.params.id);
    if (!property) {
      return res.status(404).json({ success: false, error: 'Property not found' });
    }

    property.status = status;
    await property.save();

    res.status(200).json({ success: true, data: { id: property._id, status: property.status } });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

const searchProperties = async (req, res) => {
  try {
    const { error, value } = searchPropertySchema.validate(req.query);
    if (error) {
      return res.status(400).json({ success: false, error: error.details[0].message });
    }

    if (value.minPrice && value.maxPrice && value.minPrice > value.maxPrice) {
      return res.status(400).json({ success: false, error: 'minPrice cannot be greater than maxPrice' });
    }

    const filter = { status: 'approved' };

    if (value.keyword) {
      filter.title = { $regex: value.keyword, $options: 'i' };
    }
    if (value.type) {
      filter.type = value.type;
    }
    if (value.minPrice || value.maxPrice) {
      filter.price = {};
      if (value.minPrice) filter.price.$gte = value.minPrice;
      if (value.maxPrice) filter.price.$lte = value.maxPrice;
    }
    if (value.amenities) {
      const amenitiesArray = Array.isArray(value.amenities) ? value.amenities : [value.amenities];
      filter.amenities = { $all: amenitiesArray };
    }

    const skip = (value.page - 1) * value.limit;

    const [properties, total] = await Promise.all([
      Property.find(filter).sort({ createdAt: -1 }).skip(skip).limit(value.limit),
      Property.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      data: properties,
      pagination: { page: value.page, limit: value.limit, total, pages: Math.ceil(total / value.limit) },
    });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

module.exports = {
  createProperty,
  getProperties,
  getPropertyById,
  updateProperty,
  deleteProperty,
  updatePropertyStatus,
  searchProperties,
};