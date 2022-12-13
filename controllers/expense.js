const Expense = require('../models/expense')
const User = require('../models/users')
const Downloadurl = require('../models/downloadurls')
const AWS = require('aws-sdk');
const UserServices = require('../services/userservices');
const S3services = require('../services/S3services')

const addExpense = async (req,res) => {
    try{
        const {exp_amt,disc,ctg} = req.body
        if(exp_amt === undefined || disc === undefined || ctg === undefined){
            console.log(disc)
            return res.status(400).json({message:"Enter all details",success:false})
        }
        const expense = await Expense.create({exp_amt,disc,ctg,userId:req.user.id})
        console.log(expense)
        res.status(201).json({data:expense,message:"Expense added successfully",success:true})
    }
    catch(err){
        res.status(500).json({error:err,success:false})
    }
         
}

const getExpenses = async(req,res) => {
    let page = req.params.pageno || 1

    let limit_items = +(req.body.itemsPerPage) || 2;

    let totalItems 

    try {

        let count = await Expense.count({where:{userId:req.user.id}})
        totalItems = count ; 

        // let data = await req.user.getExpenses({offset:(page-1)*limit_items , limit:limit_items})
        let data = await Expense.find({userId: req.user.id}).skip((page-1)*limit_items).limit(limit_items)
        res.status(200).json({data ,
            info: {
              currentPage: page,
              hasNextPage: totalItems > page * limit_items,
              hasPreviousPage: page > 1,
              nextPage: +page + 1,
              previousPage: +page - 1,
              lastPage: Math.ceil(totalItems / limit_items),
            }})
    } catch (error) {
        res.status(500).json({message:'unable to get expense'})
    }


    
    // try{
    //     const expenses = await Expense.findAll({where:{userId:req.user.id}})
    //     console.log(expenses)
    //     res.status(200).json({data:expenses,success:true})
    // }
    // catch(err){
    //     res.status(500).json({error:err,success:false})
    // }
}

const getAllUserExpenses = async(req,res,next)=>{
    try {
        console.log("123")
        if(req.user.ispremiumuser){
            console.log("123")
            let leaderboard = [];
            // let users = await User.findAll({attributes: ['id', 'name', 'email']})
            let users = await User.find().select("id name email")

            for(let i = 0 ;i<users.length ; i++){
                console.log(users[i])
                let expenses = await  Expense.find({userId:users[i]._id});
                let totalExpense = 0;
                for(let j = 0 ;j<expenses.length ; j++){
                    totalExpense += expenses[j].exp_amt
                }
                let userObj = {
                    user:users[i],
                    expenses,
                    totalExpense
                }
                leaderboard.push(userObj);
            }
           return res.status(200).json({success : true, data : leaderboard});
        }

        return res.status(400).json({message : 'user is not premium user' });

    } catch (error) {
        res.status(500).json({success : false, data : error});
    }
}

const getLeaderboardUserExpense = async(req,res,next)=>{
    try {
        if(req.user.ispremiumuser){
            let userId = req.params.loadUserId;
            console.log(userId)
            //let user = await User.findOne({where:{id:userId}})
            const expenses = await Expense.find({userId:userId}); 

           return res.status(200).json({success:true , data: expenses })
        }else{
            return res.status(400).json({message : 'user is not premium user' });
        }
        
    } catch (error) {
        res.status(500).json({success : false, data : error});
    }
}

const deleteExpense = async (req,res) => {
    try {
        const expenseId = req.params.expenseid ;
        let expense = await Expense.findById(expenseId)
        // console.log(expense)
        if(!expense){
            return res.status(404).json({message:'expense not found'})
        }
        if(expense.userId.toString() !== req.user._id.toString()){
            return res.status(401).json("Not Allowed");
        }
        await Expense.findByIdAndRemove(expenseId)
        res.status(200).json({message:'deleted sucessfully'})

    } catch (error) {
        res.status(500).json({message:'unable to delete expwnse'})
    }
    
}

const downloadExpenses = async (req,res) =>{
    try{
        
        

        const userId = req.user._id
        const expenses = await Expense.find({userId})
        const stringifyExpenses = JSON.stringify(expenses)

        const filename = `expenses${userId}/${new Date()}.txt`
        const fileURL = await S3services.uploadToS3(stringifyExpenses,filename)

        const downloadUrlData = await Downloadurl.create({
            fileUrl:fileURL,
            fileName: filename,
            userId:req.user._id
        })

        res.status(200).json({fileURL,downloadUrlData,success:true})

    }
    catch(err){
        res.status(500).json({fileURL:'',success:false,err:err})
    }
    
}

const downloadAllUrl = async(req,res,next) => {
    try {
        let urls = await Downloadurl.find({userId:req.user._id});
        if(!urls){
            res.status(404).json({ message:'no urls found with this user' , success: false});
        }
        res.status(200).json({ urls , success: true })
    } catch (err) {
        res.status(500).json({ err})
    }
}


module.exports = {
    addExpense,
    getExpenses,
    getAllUserExpenses,
    getLeaderboardUserExpense,
    deleteExpense,
    downloadExpenses,
    downloadAllUrl
}