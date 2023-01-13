const mongoose = require('mongoose')

const ProductSchema = new mongoose.Schema({
    name:{
        type: String,
        required:[true, 'Please provide product name'],
        minlength:2,
        maxlength:[100, 'Name cannot be more than 100 characters']
    },
    category:{
        type:String,
        required:[true, 'Please provide product category'],
        enum:['office', 'home', 'electronics','fashion']
    },
    price:{
        type:Number,
        required:[true, 'Please provide product price'],
        default:0
    },
    description:{
        type:String,
        required:[true, 'Please provide product description'],
        maxlenght:1000
    },
    image:{
        type:String,
        default:'/uploads/example.jpeg'
    },
    brand:{
        type:String,
        required:[true, 'Please provide product brand'],
        enum:{
            values:['ikea', 'liddy', 'marcos'],
            message:'{VALUE} is not supported'
        }
    },
    colour:{
        type:[String],
        required:true
    },
    featured:{
        type:Boolean,
        default:false
    },
    shippingType:{
        type:String,
        required:true,
        enum:['free', 'paid'],
        default:'free'
    },
    inventory:{
        type:Number,
        required:true,
        default:0
    },
    averageRating:{
        type:Number,
        default:0
    },
    numOfReviews:{
        type:Number,
        default:0
    },
    user:{
        type:mongoose.Types.ObjectId,
        ref:'User',
        required:true
    }
},
{
    timestamps:true, 
}
)

ProductSchema.pre('remove', async function(next){
    await this.model('Review').deleteMany({product:this._id})
})

module.exports = mongoose.model('Product', ProductSchema)