var mongoose=require("mongoose");
var campgroundschema=new mongoose.Schema(
  {
    name:String,
    image:String,
    description:String,
    upload:{
      type:mongoose.Schema.Types.ObjectId,
      ref:"upload"
      },
    author:{
      id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user"
      },
    username:String,
    like: Number,
    dislike:Number
  },
  // // upload:{
  // //   id:{
  // //     type:mongoose.Schema.Types.ObjectId,
  // //     ref:"upload"
  // //   },
  // username:String
// },
    comment:[{
      type:mongoose.Schema.Types.ObjectId,
      ref:"comment"//comment is model here
    }]
  }
);
module.exports=mongoose.model("campground",campgroundschema);
