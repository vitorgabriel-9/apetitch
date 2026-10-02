import mongoose from "mongoose";

const menuItemSchema = new mongoose.Schema(
  {
    id: {
      type: Number,
      required: true,
    },

    name: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      default: "",
    },

    price: {
      type: Number,
      required: true,
    },

    image: {
      type: String,
      default: "",
    },
  },
  { _id: false }
);

const openingHoursSchema = new mongoose.Schema(
  {
    day: {
      type: String,
      required: true,
    },

    hours: {
      type: String,
      required: true,
    },
  },
  { _id: false }
);

const addressSchema = new mongoose.Schema(
  {
    street: {
      type: String,
      default: "",
    },

    neighborhood: {
      type: String,
      default: "",
    },

    city: {
      type: String,
      default: "",
    },

    state: {
      type: String,
      default: "",
    },

    reference: {
      type: String,
    },
  },
  { _id: false }
);

const contactChannelSchema = new mongoose.Schema(
  {
    label: String,
    value: String,
    href: String,
  },
  { _id: false }
);

const feedbackSchema = new mongoose.Schema(
  {
    author: String,
    rating: Number,
    date: String,
    comment: String,
  },
  { _id: false }
);

const restaurantSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    category: {
      type: String,
      required: true,
    },

    secondaryCategory: {
      type: String,
    },

    rating: {
      type: Number,
      default: 0,
    },

    reviews: {
      type: Number,
      default: 0,
    },

    distance: {
      type: Number,
      default: 0,
    },

    waitTime: {
      type: String,
      default: "15 min",
    },

    deliveryTime: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      enum: ["Aberto", "Lotado", "Fechado"],
      default: "Aberto",
    },

    price: {
      type: String,
      default: "$$",
    },

    priceRange: {
      type: String,
      default: "R$ 30–60",
    },

    delivery: {
      type: Boolean,
      default: true,
    },

    latitude: {
      type: Number,
      required: true,
    },

    longitude: {
      type: Number,
      required: true,
    },

    image: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      default: "",
    },

    address: {
      type: String,
      default: "",
    },

    location: {
      type: addressSchema,
      default: {},
    },

    openingHours: {
      type: [openingHoursSchema],
      default: [],
    },

    contactChannels: {
      type: [contactChannelSchema],
      default: [],
    },

    orderMethods: {
      type: [String],
      default: [],
    },

    menu: {
      type: [menuItemSchema],
      default: [],
    },

    feedbacks: {
      type: [feedbackSchema],
      default: [],
    },
  },

  {
    timestamps: true,
  }
);

export const Restaurant = mongoose.model(
  "Restaurant",
  restaurantSchema
);