const express = require('express')

const router = express.Router()

const {addReview, deleteReview, updateReview, getAllReviews, getSingleReview} = require('../controllers/reviewController')
const {authenticateUser} = require('../middlewares/authenticate')

router.route('/').post(authenticateUser, addReview).get(getAllReviews)

router.route('/:id')
        .get(getSingleReview)
        .patch(authenticateUser, updateReview)
        .delete(authenticateUser,deleteReview)



module.exports = router