const express = require('express');
const { authMiddleware } = require('../middleware/authMiddleware');
const usercontroller = require('../controllers/usercontroller');
const router = express.Router();

router.get('/test', (req, res) => {
  res.send('Test route');
});
// User Registration
router.post("/user/register",usercontroller.registerUser);
router.post("/user/login", usercontroller.loginUser);



module.exports = router;
