const express = require('express')
const router = express.Router()

const expenseController = require('../controllers/expense')
const userAuthentication = require('../middleware/auth')

router.post('/add-expense',userAuthentication.authenticate,expenseController.addExpense)
// router.get('/getexpenses',userAuthentication.authenticate,expenseController.getExpenses)
router.post('/:pageno',userAuthentication.authenticate,expenseController.getExpenses)
router.delete('/delete-expense/:expenseId',userAuthentication.authenticate,expenseController.deleteExpense)
router.get('/premium-leaderboard',userAuthentication.authenticate,expenseController.getAllUserExpenses)
router.get('/getInfo/:loadUserId',userAuthentication.authenticate,expenseController.getLeaderboardUserExpense)
router.get('/download',userAuthentication.authenticate,expenseController.downloadExpenses)
router.get('/getAllDownloadUrl',userAuthentication.authenticate,expenseController.downloadAllUrl)

module.exports = router