const express = require('express')

const router = express.Router()
const {getAllProducts,
    getSingleProduct,
    addProduct,
    updateProduct,
    deleteProduct,
    uploadImage} = require('../controllers/productController')
const {authenticateUser, authorizePermission} = require('../middlewares/authenticate')
const {getSingleProductReview} = require('../controllers/reviewController')
router.get('/getAllProducts', getAllProducts)
router.post('/addProduct', authenticateUser,authorizePermission('admin', 'seller'),  addProduct)
router.post('/uploadImage', authenticateUser,authorizePermission('admin', 'seller'),  uploadImage)
router.route('/:id').get(getSingleProduct)
                    .patch(authenticateUser,authorizePermission('admin', 'seller'),  updateProduct)
                    .delete(authenticateUser,authorizePermission('admin', 'seller'),  deleteProduct)
                    
router.route('/:id/reviews').get(getSingleProductReview)

module.exports = router
