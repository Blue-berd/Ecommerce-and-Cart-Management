const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    fname: { type: String, required: "Please provide fullname", trim: true },
    lname: { type: String, required: "Please provide last name", trim: true },
    email: { type: String, required: "Please provide email", trim: true, unique:true },
    profileImage: { type: String, required: "Please upload image" },
    phone: {
      type: Number,
      required: "Please provide mobile number",
      trim: true,
      unique:true
    },
    password: { type: String, required: "Please provide password", trim: true},
    address: {
      shipping: {
        street: {
          type: String,
          required: "Please provide street name",
        },
        city: {
          type: String,
          required: "Please provide valid city",
        },
        pincode: {
          type: String,
          required: "Please provide pincode",
          trim: true,
        },
      },
      billing: {
        street: {
          type: String,
          required: "Please provide street name",
        },
        city: {
          type: String,
          required: "Please provide valid city",
        },
        pincode: {
          type: String,
          required: "Please provide pincode",
          trim: true,
        },
      },
    },
    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date, default: null },
  },
  {
    timestamps: true,
  }
);

// {
//     fname: {string, mandatory},
//     lname: {string, mandatory},
//     email: {string, mandatory, valid email, unique},
//     profileImage: {string, mandatory}, // s3 link
//     phone: {string, mandatory, unique, valid Indian mobile number},
//     password: {string, mandatory, minLen 8, maxLen 15}, // encrypted password
//     address: {
//       shipping: {
//         street: {string, mandatory},
//         city: {string, mandatory},
//         pincode: {string, mandatory}
//       },
//       billing: {
//         street: {string, mandatory},
//         city: {string, mandatory},
//         pincode: {string, mandatory}
//       }
//     },
//     createdAt: {timestamp},
//     updatedAt: {timestamp}
//   }


module.exports = mongoose.model("User",userSchema)
