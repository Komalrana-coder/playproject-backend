import mongoose, {model,Schema,ObjectId} from "mongoose";


interface venue {
 name: string;
  address: string;
  city:string;
  state:string;
 games:[string];
  courts:string[];
  status:string;
  facilities:[string];
  employee:ObjectId;
 timings:[string];
  description:string;
  image:string;
   }

const venueSchema = new Schema<venue>({
  name: {
    type: String,
    required: true,
    unique: true
  },
 address: {
    type: String,
    required: true,
    
  }, 
  image:{
    type:String,
   
  },
  city:{
    type:String, 
},
 description:{
  type:String
 },

   state:{
    type:String,
    },

  games:[{
    type:String
  }
  ],

     status:{
    type:String,
    
  },

  courts: [
  {
    name: String,
    status: String,
    image:String,
  }
],

  facilities:{
    type:[String],
  },
  
  employee:[{
    type:Schema.Types.ObjectId,
    ref:"employee"
  }],
  timings:{type:mongoose.Schema.Types.Mixed,
  default: {},}
   
   
  
});
const Venue = model<venue>("Venue", venueSchema);

export default Venue;  

