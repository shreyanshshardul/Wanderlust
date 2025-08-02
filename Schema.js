const Joi = require('joi');

// ✅ Listing Schema
module.exports.listingSchema = Joi.object({
  listing: Joi.object({
    title: Joi.string().required().messages({
      'string.empty': 'Title is required.',
    }),
    description: Joi.string().required().messages({
      'string.empty': 'Description is required.',
    }),
    price: Joi.number().required().min(0).messages({
      'number.base': 'Price must be a number.',
      'number.min': 'Price cannot be negative.',
    }),
    location: Joi.string().required().messages({
      'string.empty': 'Location is required.',
    }),
    country: Joi.string().required().messages({
      'string.empty': 'Country is required.',
    }),
    image: Joi.object({
      url: Joi.string()
        .uri()
        .allow('')
        .default('https://icons.veryicon.com/png/o/education-technology/alibaba-cloud-iot-business-department/image-load-failed.png')
        .messages({
          'string.uri': 'Image URL must be a valid URI.',
        }),
      filename: Joi.string().optional() // ✅ Added this line to allow filename
    }).required()
  }).required()
});


// ✅ Review Schema
module.exports.reviewSchema = Joi.object({
  review: Joi.object({
    rating: Joi.number().required().min(1).max(5).messages({
      'number.base': 'Rating must be a number.',
      'number.min': 'Rating must be at least 1.',
      'number.max': 'Rating cannot be more than 5.',
    }),
    comment: Joi.string().required().messages({
      'string.empty': 'Comment is required.',
    }),
  }).required()
});
