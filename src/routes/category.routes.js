const express = require('express');
const router = express.Router();
const prodCtrl = require('../controllers/product.controller');
const authenticate = require('../middlewares/auth');
const roleCheck = require('../middlewares/roleCheck');

router.get('/', prodCtrl.listProducts);
router.get('/:id', prodCtrl.getProduct);

//Seller only
router.post('/', authenticate, roleCheck(['seller']), prodCtrl.createProduct);
router.put('/:id', authenticate, roleCheck(['seller']), prodCtrl.updateProduct);
router.delete('/:id', authenticate, roleCheck(['seller']), prodCtrl.deleteProduct);

module.exports = router;