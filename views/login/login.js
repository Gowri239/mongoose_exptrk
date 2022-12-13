const form = document.getElementById('login-form');
const errorDiv = document.getElementById('error')
const forgetPass = document.querySelector('.pass');

form.addEventListener('submit' , login)
forgetPass.addEventListener('click' , forgetPassword)

async function login(e){
    e.preventDefault()
    try{
    const loginDetails = {
        email: e.target.email.value,
        password: e.target.password.value
    }
    const response = await axios.post("http://localhost:3000/user/login",loginDetails)
    if(response.status === 200){
        alert(response.data.message)
        localStorage.setItem('user',response.data.ispremiumuser)
        localStorage.setItem('token',response.data.token)
        window.location.href = "../expense/expense.html"
    } 
    
    } 
    catch(err){
        errorDiv.innerHTML = `${err.response.data.message}`
      }

}

function forgetPassword(e){
        e.preventDefault();
        window.location.href = '../forgotpassword/forgotpassword.html'
    }

