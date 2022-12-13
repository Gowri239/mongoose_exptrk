
const form = document.getElementById('expense-form')
const expenseDiv = document.getElementById('expense-div');
const leaderboardDiv = document.getElementById('right'); 
const pagination = document.getElementById('pagination');
const perpage = document.getElementById('perpage');

let itemsPerPage = Number(localStorage.getItem('itemsperpage')) ;

let token = localStorage.getItem('token');
window.addEventListener('DOMContentLoaded' , loadScreen);

async function loadScreen(e){

    e.preventDefault();
         
    localStorage.removeItem('clickedUser')
    let usertype = localStorage.getItem('user');
    console.log(usertype == "true")
    if(usertype == "true"){
        changetheme()
        getPremiumLeaderboard()
    }
        
    let page = 1  ;
    itemsPerPage = 2;
           
    getLoadExpenses(page,itemsPerPage) ;
            
}

async function getLoadExpenses(page,itemsPerPage){
    try {
        console.log(page)
        let response = await axios.post(`http://localhost:3000/expense/${page}` , {itemsPerPage:itemsPerPage},{headers:{"Authorization" : token}})
        console.log(response.data)
        showExpenseOnScreen(response.data.data)
        showPagination(response.data.info)
        } catch (error) {
            console.log(error);
        }
}

function showExpenseOnScreen(data){

    expenseDiv.innerHTML =''
                
    data.map(data=>{ 
        const child = `<li class="list" id=${data.id}>
                        <span class="expense-info"> ₹ ${data.exp_amt} -${data.disc} - ${data.ctg}</span>
                        <span class="btns">
                            <button style="background: red;" onclick="remove('${data.id}')">Delete</button>
                            <button onclick="edit('${data.exp_amt}','${data.disc}','${data.ctg}','${data.id}')">Edit</button>
                        </span>
                      </li>`
                
        expenseDiv.innerHTML += child
    })
}

perpage.addEventListener('submit' , (e)=>{
    e.preventDefault();
    localStorage.setItem('itemsperpage' , +e.target.itemsPerPage.value )
    itemsPerPage = localStorage.getItem('itemsperpage')
    getLoadExpenses(1 , +e.target.itemsPerPage.value);
})

function showPagination({currentPage,hasNextPage,hasPreviousPage,nextPage,previousPage,lastPage}){
    
    pagination.innerHTML ='';
    
    if(hasPreviousPage){
        const button1 = document.createElement('button');
        button1.innerHTML = previousPage ;
        button1.addEventListener('click' , ()=>getLoadExpenses(previousPage,itemsPerPage))
        pagination.appendChild(button1)
    }
    
    const button2 = document.createElement('button');
    button2.classList.add('active')
    button2.innerHTML = currentPage ;
    button2.addEventListener('click' , ()=>getLoadExpenses(currentPage,itemsPerPage))
    pagination.appendChild(button2)

    if(hasNextPage){
        const button3 = document.createElement('button');
        button3.innerHTML = nextPage ;
        button3.addEventListener('click' , ()=>getLoadExpenses(nextPage,itemsPerPage))
        pagination.appendChild(button3)
    }

    if( currentPage!=lastPage && nextPage!=lastPage && lastPage != 0){
        const button3 = document.createElement('button');
        button3.innerHTML = lastPage ;
        button3.addEventListener('click' , ()=>getLoadExpenses(lastPage,itemsPerPage))
        pagination.appendChild(button3)
    }
}

form.addEventListener('submit' , addExpense)


async function addExpense(e){
    try{
        e.preventDefault()
        const obj = {
            exp_amt: e.target.expenseamount.value,
            disc: e.target.discription.value,
            ctg: e.target.category.value,
            userId: 1
        }
        const response  = await axios.post("http://localhost:3000/expense/add-expense",obj,{headers: {"Authorization": token}})
        if(response.status===201){
            addExpenseOnscreen(response.data.data)
        }
    }
    catch(err){
        document.body.innerHTML += `<div style="color:red;">${err.message}</div>`
    } 
}

function addExpenseOnscreen(data){
    const child = `<li class="list" id=${data.id}>
        <span class="expense-info"> ₹ ${data.exp_amt} -${data.disc} - ${data.ctg}</span>
        <span class="btns">
            <button style="background: red;" onclick="remove('${data.id}')">Delete</button>
            <button onclick="edit('${data.exp_amt}','${data.disc}','${data.ctg}','${data.id}')">Edit</button>
        </span>
    </li>`

    expenseDiv.innerHTML += child ;
}

async function remove (id){
    try {
        await axios.delete(`http://localhost:3000/expense/delete-expense/${id}` , {headers : {'Authorization': token}} )
        removeFromScreen(id)
    } catch (error) {
        console.log(error);
    }
}

function removeFromScreen(id){
    let child = document.getElementById(id);
    if(child){
        expenseDiv.removeChild(child);
    }
}

function edit(exp_amt,disc,ctg,id){
    document.getElementById('expenseamount').value = exp_amt
    document.getElementById('discription').value = disc
    document.getElementById('category').value = ctg
    remove(id)

}

async function getPremiumLeaderboard(){
    try {
        const response = await axios.get('http://localhost:3000/expense/premium-leaderboard', {headers : {'Authorization': token}} )
        
        if(response.data.success){
            if(response.data.data.length>0){
                response.data.data.sort((a,b)=>{
                    return b.totalExpense - a.totalExpense;
                });
                
                response.data.data.map((user , id)=>{
                    showLeaderboard(user , id);
                })
                
            }
        }
        
    } catch (err) {
        console.log(err)
    }
    
}

function showLeaderboard(user , id){
    let child = `<li class="leaderboardList">
            <p class="sno">${id+1} </p>
            <p class="name" id="user" onclick="openUserExpenses('${user.user.id}')">${user.user.name}</p>
            <p class="name">${user.totalExpense}</p>
    </li>`
    
    leaderboardDiv.innerHTML += child
}

function openUserExpenses(user){
    console.log(user)
    localStorage.setItem('clickedUser' , user)
    window.location.href = '../leaderboard/leaderboard.html'
}

document.getElementById('premium').onclick = async function (e) {
    const token = localStorage.getItem('token')
    const response  = await axios.get('http://localhost:3000/purchase/premiummembership', { headers: {"Authorization" : token} });
    console.log(response);
    var options =
    {
     "key": response.data.key_id, // Enter the Key ID generated from the Dashboard
     "name": "Asmi Company",
     "order_id": response.data.order.id, // For one time payment
     "prefill": {
       "name": "Gowri",
       "email": "gowrimopuru14@gmail.com",
       "contact": "8978630542"
     },
     "theme": {
      "color": "#3399cc"
     },
     // This handler function will handle the success payment
     "handler": function (response) {
         console.log(response);
         axios.post('http://localhost:3000/purchase/updatetransactionstatus',{
             order_id: options.order_id,
             payment_id: response.razorpay_payment_id,
         }, { headers: {"Authorization" : token} }).then(() => {
             alert('You are a Premium User Now')
             localStorage.setItem('user' , "true")
             changetheme();
             getPremiumLeaderboard()
         }).catch(() => {
             alert('Something went wrong. Try Again!!!')
         })
         
     },
  };
  const rzp1 = new Razorpay(options);
  rzp1.open();
  e.preventDefault();

  rzp1.on('payment.failed', function (response){
  alert(response.error.code);
  alert(response.error.description);
  alert(response.error.source);
  alert(response.error.step);
  alert(response.error.reason);
  alert(response.error.metadata.order_id);
  alert(response.error.metadata.payment_id);
 });
}

function changetheme(){
    document.body.classList.remove('light');
    document.body.classList.add('dark');
    document.getElementsByClassName('center')[0].classList.remove('light');
    document.getElementsByClassName('center')[0].classList.add('dark');
    document.getElementById('expense-div').classList.remove('light');
    document.getElementById('expense-div').classList.add('dark');
    document.getElementById('left').classList.remove('light');
    document.getElementById('left').classList.add('dark');
    document.getElementsByTagName('input')[0].classList.add('dark');
    document.getElementById('right').style = 'display:block'
    document.getElementById('premium').style = 'display:none'
    document.getElementById('download').style = 'display:block'
}


document.getElementById('download').onclick = function(e){
    
    let usertype = localStorage.getItem('user');
    console.log(usertype == "true")
    if(usertype == "true"){
        window.location.href = '../downloadreports/downloads.html'
    }
}

document.getElementById('logout').onclick = function(e){
    window.location.href = '../login/login.html'
}