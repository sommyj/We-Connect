import Businesses from '../models/business';

const businessesController = {

  create(req, res) {
    const Business = {
      businessId: `${Businesses.length + 1}`,
      businessName: req.body.businessName,
      userId: req.body.userId,
      reviews: req.body.reviews,
      location: req.body.location,
      category: req.body.category,
    };

    if (!req.body.businessName || !req.body.userId || !req.body.reviews || !req.body.location || !req.body.category) {
      return res.status(206).json({ message: 'Incomplete fields', error: true });
    }
    Businesses.push(Business);
    // Businesses.push(req.body);
    return res.status(201).json({ Businesses: Business, message: 'Success', error: false });
  },
  update(req, res) {
    for (const Business of Businesses) {
      if (Business.businessId === req.params.businessId) {
        Business.businessName = req.body.businessName;
        Business.userId = req.body.userId;
        Business.reviews = req.body.reviews;
        Business.location = req.body.location;
        Business.category = req.body.category;

        return res.json({ Businesses: Business, message: 'Bussiness updated!', error: false });
      }
    }
    return res.status(404).json({ message: 'Business not found', error: true });
  },
  destroy(req, res) {
    let i = 0;
    for (const Business of Businesses) {
      if (Business.businessId === req.params.businessId) {
        Businesses.splice(i, 1);
        return res.status(204).json({ Businesses, message: 'Business successfully deleted!', error: false });
      }
      i += 1;
    }
    return res.status(404).json({ message: 'Business not found', error: true });
  },
  retrieve(req, res) {
    for (const Business of Businesses) {
      if (Business.businessId === req.params.businessId) {
        return res.json({ Businesses: Business, message: 'Success', error: false });
      }
    }
    return res.status(404).json({ message: 'Business not found', error: true });
  },
  list(req, res) {
    if (!req.query.location && !req.query.category) {
      return res.json({ Businesses, message: 'Success', error: false });
    }
    if (req.query.location && !req.query.category) {
      const array = [];
      for (const Business of Businesses) {
        if (Business.location === req.query.location) { array.push(Business); }
      }
      if (array.length !== 0) { return res.json({ Businesses: array, message: 'Success', error: false }); }
    }
    if (req.query.category && !req.query.location) {
      const array = [];
      for (const Business of Businesses) {
        if (Business.category === req.query.category) { array.push(Business); }
      }
      if (array.length !== 0) { return res.json({ Businesses: array, message: 'Success', error: false }); }
    }
    if (req.query.location && req.query.category) {
      const array = [];
      for (const Business of Businesses) {
        if (Business.location === req.query.location && Business.category === req.query.category) {
          array.push(Business);
        }
      }
      if (array.length !== 0) { return res.json({ Businesses: array, message: 'Success', error: false }); }
    }
    return res.status(404).json({ message: 'Business not found', error: true });
  },
};

export default businessesController;
