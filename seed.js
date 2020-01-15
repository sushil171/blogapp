var mongoose=require("mongoose");
var campground=require("./model/campground");
var comment=require("./model/comment");

var data=[
  {
    name:"Mussorie",
    image:"https://images.pexels.com/photos/1687845/pexels-photo-1687845.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500",
    description:"this is a model image 1111",

  }
  ,
  {
    name:"BioDiversity IIITM",
    image:"https://images.pexels.com/photos/1061640/pexels-photo-1061640.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500",
    description:"this is a model image 222222",

  },
  {
    name:"Butterfly Conservatory",
    image:"https://images.pexels.com/photos/587976/pexels-photo-587976.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500",
    description:"this is a model i mage 33333",

  }
]

function seedDB(){

  //remove all allcampground
  campground.deleteMany({},function(err){
//     if(err)
//     console.log(err);
//     else {
//       data.forEach(function(seeddata)
//       {
//         campground.create(seeddata,function(err,data)
//         {
//           if(err)
//           console.log(err);
//           else
//           {
//             console.log("new campground created");
//             comment.create(
//               {
//                 text:"this place is great",
//                 author:"sushil"
//               },function(err,comment)
//                   {
//                       if(err)
//                       console.log(err);
//                       else
//                       {
//
//                        //  console.log(seeddata.comment);
//                         data.comment.push(comment);
//                         data.save();
//                         console.log("create new comment");
//                       }
//               });
//             }
//         });
//       });
//
// }
});
}

// data.forEach(function(seeddata)
// {
//   campground.create(seeddata,function(err,data){
//     if(err)
//     console.log(err);
//     else {
//       console.log("added image");
//     }
//   });
// });


module.exports=seedDB;
