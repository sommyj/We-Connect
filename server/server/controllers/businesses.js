const business = require('../models/business');

module.exports = {
  create(req, res) {
    if (!req.body.businessName || !req.body.reviews || !req.body.location || !req.body.category) {
      return res.status(206).json({
        message: 'Incomplete fields',
        error: true
      });
    }
    business.push(req.body);
    return res.json({
      business,
      message: 'Success',
      error: false
    });
  },
  update(req, res) {
    for (let i = 0; i < business.length; i += 1) {
      if (business[i].businessId === req.params.businessId) {
        business[i].businessName = req.body.businessName;
        business[i].userId = req.body.userId;
        business[i].reviews = req.body.reviews;
        business[i].location = req.body.location;
        business[i].category = req.body.category;

        return res.json({
          business: business[i],
          message: 'Bussiness updated!',
          error: false
        });
      }
    }
    return res.status(404).json({
      message: 'Business not found',
      error: true
    });
  },
  destroy(req, res) {
    for (let i = 0; i < business.length; i += 1) {
      if (business[i].businessId === req.params.businessId) {
        business.splice(i, 1);

        return res.status(404).json({
          business,
          message: 'Business successfully deleted!',
          error: false
        });
      }
    }

    return res.status(404).json({
      message: 'Business not found',
      error: true
    });
  },
  retrieve(req, res) {
    for (let i = 0; i < business.length; i += 1) {
      if (business[i].businessId === req.params.businessId) {
        return res.json({
          business: business[i],
          error: false
        });
      }
    }

    return res.status(404).json({
      message: 'Business not found',
      error: true
    });
  },
  list(req, res) {
    if (!req.query.location && !req.query.category) {
      return res.json({
        business,
        error: false
      });
    }
    if (req.query.location && !req.query.category) {
      const array = [];
      for (let i = 0; i < business.length; i += 1) {
        if (business[i].location === req.query.location) {
          array.push(business[i]);
        }
      }
      if (array.length !== 0) {
        return res.json({
          business: array,
          error: false
        });
      }
    }
    if (req.query.category && !req.query.location) {
      const array = [];
      for (let i = 0; i < business.length; i += 1) {
        if (business[i].category === req.query.category) {
          array.push(business[i]);
        }
      }
      if (array.length !== 0) {
        return res.json({
          business: array,
          error: false
        });
      }
    }
    if (req.query.location && req.query.category) {
      const array = [];
      for (let i = 0; i < business.length; i += 1) {
        if (business[i].location === req.query.location &&
         business[i].category === req.query.category) {
          array.push(business[i]);
        }
      }
      if (array.length !== 0) {
        return res.json({
          business: array,
          error: false
        });
      }
    }
    return res.status(404).json({
      message: 'Business not found',
      error: true
    });
  },
};
