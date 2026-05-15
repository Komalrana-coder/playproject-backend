import mongoose from "mongoose";

interface Employee {
  name:string;
  email: string;
  password?: string;
  otp:Number | null;
  phoneNumber:Number;
  status:string;
  otpExpiry: Date | null;
  image:string;
}

const employeeSchema = new mongoose.Schema<Employee>({

    name:{
    type: String,
    required: true,
  },
  email:{
    type: String,
    required: true,
    unique: true
  },
   image: {
  type: String,
  
},
  password: {
    type: String,
    required: true
  },
  otp:{
    type:Number,
  },
  otpExpiry:{
    type:Date
  },
  phoneNumber:{
    type:Number
  },
  status:{
    type:String
  }
});


const Employee  =  mongoose.model<Employee>("Employee", employeeSchema);

export default mongoose.model("employee", employeeSchema);