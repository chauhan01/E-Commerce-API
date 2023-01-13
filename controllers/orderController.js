const CustomError = require('../errors')
const {StatusCodes} = require('http-status-codes')
const Order = require('../models/order')
const Product = require('../models/product')
const { checkPermission } = require('../utils')



const fakeStripeAPI = async({amount, currency})=>{
    const client_Secret = 'RandomValue'
    return { client_Secret, amount}
}

const createOrder = async(req, res)=>{
    const {items:cartItems, shippingFee, tax} =req.body
    if(!cartItems || cartItems.length<1) {
        throw new CustomError.BadRequestError('No cart items provided')
    }
    if(!tax || !shippingFee){
        throw new CustomError.BadRequestError('Please provide tax and shipping fee')
    }

    let orderItems=[]
    let subTotal=0
    for(const item of cartItems){
        const dbProduct = await Product.findOne({_id:item.product})
        if(!dbProduct){
            throw new CustomError.NotFoundError(`No product with this id ${item.Product}`)
        }
        const {name, price, image, _id} = dbProduct
        const singleOrderItem = {
            amount:item.amount,
            name,
            price,
            image,
            Product:_id
        }
        //adding item to order
        orderItems = [...orderItems, singleOrderItem]
        //calculating subtotal
        subTotal +=item.amount*price
    }
    //calculating total
    const total = tax+shippingFee+subTotal
    //get Client Secret
    const paymentIntent = await fakeStripeAPI({
        amount:total,
        currency:'INR'
    })
    const order = await Order.create({
        orderItems, total, subTotal, tax, shippingFee, clientSecret:paymentIntent.client_Secret, user:req.user.userId
    })
    res.status(StatusCodes.CREATED).json({order, clientSecret:order.clientSecret})
}
const updateOrder = async(req, res)=>{
    const {id:orderId} = req.params
    const {paymentIntentId} = req.body
    const order = await Order.findOne({_id:orderId})
    if(!order){
        throw new CustomError.NotFoundError('No order found with this id')
    }
    checkPermission(req.user, order.user)
    order.paymentIntentId = paymentIntentId
    order.status = 'Paid'
    await order.save()
    res.status(StatusCodes.OK).json({order})
}
const getAllOrders = async(req, res)=>{
    const orders = await Order.find({})
    res.status(StatusCodes.OK).json({orders, count:orders.length})
}
const getSingleOrder = async(req, res)=>{
    const {id:orderId} = req.params
    const order = await Order.findOne({_id:orderId})
    if(!order){
        throw new CustomError.NotFoundError('No order found with this id')
    }
    checkPermission(req.user, order.user)
    res.status(StatusCodes.OK).json({order})
}
const getCurrentUserOrders = async(req, res)=>{
    const orders = await Order.find({user:req.user.userId})
    res.status(StatusCodes.OK).json({orders, count:orders.length})
}



module.exports = {createOrder, updateOrder, getAllOrders, getCurrentUserOrders, getSingleOrder}