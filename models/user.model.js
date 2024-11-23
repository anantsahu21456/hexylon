const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema(
    {
        name: {
             type: String, 
             required: true 
            },
        email: {
             type: String, 
             required: true, 
             unique: true 
            },
        password: {
             type: String,
              required: true 
            },
        board: { 
            type: String, 
            required: true 
            },
        field: {
             type: String,
              required: true
             },
        standard: {
             type: String,
              required: true
             },
        dob: { 
            type: Date, 
            required: true 
        },
        age: { 
            type: Number,
             required: true
             },
},
    {timestamps:true}
);

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;
