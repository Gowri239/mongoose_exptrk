const express = require('express')
const router = express.Router()

const purchaseController = require('../controllers/purchase')
const userAuthentication = require('../middleware/auth')

router.get('/premiummembership',userAuthentication.authenticate,purchaseController.purchasepremium)
router.post('/updatetransactionstatus',userAuthentication.authenticate,purchaseController.updateTransactionStatus)

module.exports = router 