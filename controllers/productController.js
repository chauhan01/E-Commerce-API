const Product = require('../models/product')
const {StatusCodes} = require('http-status-codes')
const CustomError = require('../errors')
const path = require('path')
const { checkPermission } = require('../utils')

const addProduct = async(req, res)=>{
    req.body.user = req.user.userId
    const product = await Product.create(req.body)
    res.status(StatusCodes.CREATED).json({product})
}
const getAllProducts = async(req, res)=>{
    const products = await Product.find({})
    res.status(StatusCodes.OK).json({products, count:products.length})
}
const getSingleProduct = async(req, res)=>{
    const {id:productId} = req.params
    const product = await Product.findOne({_id:productId})
    if(!product){
        throw new CustomError.NotFoundError('No product found with this id')
    }
    res.status(StatusCodes.OK).json({product})
}
const updateProduct = async(req, res)=>{
    const {id:productId}=req.params
    const product = await Product.findOne({_id:productId})
    if(!product){
        throw new CustomError.NotFoundError('No product found with this id')
    }
    //only the seller who added the prodcut should be able to update it.
    //so cheking if the seller who is updating the product and the seller who added the product are same or not
    checkPermission(req.user, product.user)
    await Product.findOneAndUpdate({_id:productId}, req.body, {new:true, runValidators:true})
    res.status(StatusCodes.OK).json({product})
}
    

const deleteProduct = async(req, res)=>{
    const {id:productId}=req.params
    const product = await Product.findOne({_id:productId})
    if(!product){
        throw new CustomError.NotFoundError('No product found with this id')
    }
    //only the seller who added the prodcut should be able to delete it.
    //so cheking if the seller who is deleting the product and the seller who added the product is same or not
    checkPermission(req.user, product.user)
    await product.remove()
    res.status(StatusCodes.OK).json({msg:'Product deleted successfully'})
}

const uploadImage = async(req, res)=>{
    if(!req.files){
        throw new CustomError.BadRequestError('No file uploaded')
    }
    const productImage = req.files.image
    if(!productImage.mimetype.startsWith('image')){
        throw new CustomError.BadRequestError('No File uploaded')
    }


    const maxSize = 1024*1024
    if(productImage.size>maxSize){
        throw new CustomError.BadRequestError('Please upload image smaller than 1MB')
    }

    const imagePath = path.join(__dirname,'../public/uploads/'+`${productImage.name}`)
    await productImage.mv(imagePath)
    res.status(StatusCodes.OK).json({image:`/uploads/${productImage.name}`})
}


module.exports = {getAllProducts, getSingleProduct, addProduct, updateProduct, deleteProduct, uploadImage}