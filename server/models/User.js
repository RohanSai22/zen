const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name:{
    required:true,
    type:String,
    trim:true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim:true,
    validate:
      {
        validator: (value) =>{
          return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(value);
        },
        message:"Please enter a valid email address",
      }
    
  },
  password: {
    type: String,
    required: true,
    validate:{
      validator:(value)=>{
          return value.length>=8;
      },
        message:"Enter a highly secure and long password",
      }
  },
  phone: {
    type: String,
    required: true,
  },
  type: {
    type:String,
    default:"user",
  }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
