const forgetPass = document.getElementById('forgetPassword-form');

forgetPass.addEventListener('submit' , sendEmail);

async function sendEmail(e){
    e.preventDefault();
    
    const userDetails = {
        email: e.target.email.value
    }
    console.log(userDetails);

    try {
        let response = await axios.post('http://localhost:3000/password/forgotpassword' , userDetails)
        if(response.status === 202){
            alert(response.data.message)
            window.location.href = "../login/login.html"
        }else {
            throw new Error('Something went wrong!!!')
        }
    } catch (err) {
        document.body.innerHTML += `<div style="color:red;text-align:center;margin-top:70px;">${err} <div>`;
    }
}

