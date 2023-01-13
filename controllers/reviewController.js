const CustomError = require('../errors')
const {StatusCodes} = require('http-status-codes')
const Review = require('../models/review')
const Product = require('../models/product')
const { checkPermission } = require('../utils')


const addReview = async(req, res)=>{
    const {product:product_id} = req.body
    const isvalidProduct = await Product.findOne({_id:product_id})

    if(!isvalidProduct){
        throw new CustomError.NotFoundError('No product found with this id')
    }
    req.body.user = req.user.userId
    const review = await Review.create(req.body)
    res.status(StatusCodes.CREATED).json({review})
}
const getAllReviews = async(req, res)=>{
    const reviews = await Review.find({})
    res.status(StatusCodes.OK).json({reviews})
}

const getSingleReview = async(req, res)=>{
    const{id:reviewId} = req.params
    const review = await Review.findOne({_id:reviewId})
    if(!review){
        throw new CustomError.NotFoundError('No review with this id')
    }
    res.status(StatusCodes.OK).json({review})
}

const updateReview = async(req, res)=>{
    const{id:reviewId} = req.params
    const {rating, title, comment} = req.body
    const review = await Review.findOne({_id:reviewId}) 
    if(!review){
        throw new CustomError.NotFoundError('No review with this id')
    }
    checkPermission(req.user, review.user)
    review.rating = rating
    review.title = title
    review.comment  =comment
    await review.save()
    res.status(StatusCodes.OK).json({review})
}

const deleteReview = async(req, res)=>{
    const{id:reviewId} = req.params
    const review = await Review.findOne({_id:reviewId}) 
    if(!review){
        throw new CustomError.NotFoundError('No review with this id')
    }
    checkPermission(req.user, review.user)
    
    await review.remove()
    res.status(StatusCodes.OK).json({msg:'review deleted successfully'})
}

const getSingleProductReview = async(req, res)=>{
    const {id:productId} = req.params
    const reviews = await Review.find({product:productId})
    res.status(StatusCodes.OK).json({reviews, count:reviews.length})
}



module.exports = {addReview, deleteReview, updateReview, getAllReviews, getSingleProductReview, getSingleReview}