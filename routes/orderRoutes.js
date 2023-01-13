const express = require('express')

const router = express.Router()
const {createOrder, updateOrder, getAllOrders, getCurrentUserOrders, getSingleOrder} = require('../controllers/orderController')
const {authenticateUser, authorizePermission} = require('../middlewares/authenticate')

router.route('/')
      .post(authenticateUser, createOrder)
      .get(authenticateUser, authorizePermission, getAllOrders)

router.route('/showMyOrders').get(authenticateUser, getCurrentUserOrders)

router.route('/:id')
      .get(authenticateUser, getSingleOrder)
      .patch(authenticateUser,updateOrder)

module.exports = router