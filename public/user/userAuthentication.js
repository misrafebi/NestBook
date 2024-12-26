document.getElementById('user-login-form').addEventListener('submit', function (event) {
    event.preventDefault();

    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();
    const name = document.getElementById('name').value.trim()
    
    const confirmPassword =  document.getElementById('confirmPassword').value.trim()

    if (!name || !email || !password) {
        return res.status(400).send('All fields are required.');
    }
    

    if(confirmPassword != password){
        alert('Passwords do not match')
        return false
    }

    this.submit();
});
