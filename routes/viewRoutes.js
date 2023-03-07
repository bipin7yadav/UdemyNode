const express = require('express');
const viewsController = require('../controllers/viewsController');
const authController = require('../controllers/authController');
const bookingController =require('../controllers/bookingController')
const router = express.Router();

// router.get("/",(req,res)=>{
//   res.status(200).render("base")
// })

// router.get("/tour",(req,res)=>{
//   res.status(200).render("tour")
// })

// router.get("/overView",(req,res)=>{
//   res.status(200).render("overview")
// })

// router.get('/',  viewsController.getOverview);
// router.get('/tour/:slug',viewsController.getTour);
// router.get('/login',  viewsController.getLoginForm);
// router.get('/me',authController.protect, viewsController.getAccount);
router.get('/',bookingController.createBooking, authController.isLoggedIn, viewsController.getOverview);
router.get('/tour/:slug', authController.isLoggedIn, viewsController.getTour);
router.get('/login', authController.isLoggedIn, viewsController.getLoginForm);
router.get('/me', authController.protect, viewsController.getAccount);
router.get('/my-tours', authController.protect, viewsController.getMyTours);
router.post(
  '/submit-user-data',
  authController.protect,
  viewsController.updateUserData
);

module.exports = router;
