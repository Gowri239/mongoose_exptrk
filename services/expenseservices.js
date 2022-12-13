const getExpenses = (req) =>{
    return req.user.getExpenses(req)

}

module.exports = {
    getExpenses
}