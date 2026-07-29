const Lead = require('../models/Lead');
const Property = require('../models/Property');
const { createLeadSchema, updateLeadStatusSchema } = require('../validators/leadValidator');

const createLead = async (req, res) => {
  try {
    const { error, value } = createLeadSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ success: false, error: error.details[0].message });
    }

    const property = await Property.findById(value.propertyId);
    if (!property) {
      return res.status(404).json({ success: false, error: 'Property not found' });
    }

    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const duplicate = await Lead.findOne({
      propertyId: value.propertyId,
      customerId: req.user.userId,
      createdAt: { $gte: twentyFourHoursAgo },
    });

    if (duplicate) {
      duplicate.source = value.source;
      await duplicate.save();
      return res.status(200).json({ success: true, data: duplicate, message: 'Existing lead updated' });
    }

    const lead = await Lead.create({
      propertyId: value.propertyId,
      customerId: req.user.userId,
      assignedTo: property.agentId || property.ownerId,
      source: value.source,
    });

    res.status(201).json({ success: true, data: lead });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

const getLeads = async (req, res) => {
  try {
    const filter = req.user.role === 'admin' ? {} : { assignedTo: req.user.userId };
    if (req.query.status) {
      filter.status = req.query.status;
    }

    const leads = await Lead.find(filter)
      .populate('propertyId', 'title')
      .populate('customerId', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, data: leads });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

const updateLeadStatus = async (req, res) => {
  try {
    const { error, value } = updateLeadStatusSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ success: false, error: error.details[0].message });
    }

    const lead = await Lead.findById(req.params.id);
    if (!lead) {
      return res.status(404).json({ success: false, error: 'Lead not found' });
    }

    const isAssigned = lead.assignedTo && lead.assignedTo.toString() === req.user.userId;
    if (!isAssigned && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, error: 'Not authorized to update this lead' });
    }

    lead.status = value.status;
    await lead.save();

    res.status(200).json({ success: true, data: lead });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

const getLeadAnalytics = async (req, res) => {
  try {
    const counts = await Lead.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);

    const summary = { new: 0, contacted: 0, qualified: 0, converted: 0, lost: 0 };
    counts.forEach((c) => { summary[c._id] = c.count; });

    res.status(200).json({ success: true, data: summary });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

module.exports = { createLead, getLeads, updateLeadStatus, getLeadAnalytics };