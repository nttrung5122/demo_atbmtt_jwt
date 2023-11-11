// Example POST method implementation:

  
  
const form = document.getElementById('login-form');
form.addEventListener('submit', (e)=>{
    e.preventDefault();
    const formData = new FormData(form);
    const username = formData.get('username');
    const password = formData.get('password');
    // console.log(username, password);
    const url = './auth/login';
    
    const data = {
            username: username,
            password: password
    }

    postData(url, data).then((response)=>{
        console.log(response);
    })

})

