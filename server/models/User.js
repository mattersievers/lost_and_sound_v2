const { Schema, model } = require('mongoose');
const bcrypt = require('bcrypt');

// import schema from Equipment.js
const equipmentSchema = require('./Equipment');

const userSchema =  new Schema(
    {
      firstName: {
        type: String,
        required: true,
        unique: true,
      },
      lastName: {
        type: String,
        required: true,
        unique: true,
      },
      email: {
        type: String,
        required: true,
        unique: true,
        match: [/.+@.+\..+/, 'Must use a valid email address'],
      },
      password: {
        type: String,
        required: true,
      },
      // set savedBooks to be an array of data that adheres to the bookSchema
      savedEquipment: [equipmentSchema],
    },
    // set this to use virtual below
    {
      toJSON: {
        virtuals: true,
      },
    }
  );
  
  // hash user password
  userSchema.pre('save', async function (next) {
    if (this.isNew || this.isModified('password')) {
      const saltRounds = 10;
      this.password = await bcrypt.hash(this.password, saltRounds);
    }
  
    next();
  });
  
  // custom method to compare and validate password for logging in
  userSchema.methods.isCorrectPassword = async function (password) {
    return bcrypt.compare(password, this.password);
  };
  
 
  userSchema.virtual('hasLost').get(function () {
    let check = false
    this.savedEquipment.forEach(instrument => {if(instrument.lost){check = true}})
    return check;
  });
  
  const User = model('User', userSchema);
  
  module.exports = User;
  