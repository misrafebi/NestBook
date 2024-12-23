document.getElementById('user-login-form').addEventListener('submit', function (event) {
    event.preventDefault();

    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();
    const lastName = document.getElementById('lastName').value.trim()
    const firstName = document.getElementById('firstName').value.trim()
    const confirmPassword =  document.getElementById('confirmPassword').value.trim()

    if (!firstName || !lastName || !email || !password) {
        return res.status(400).send('All fields are required.');
    }
    

    if(confirmPassword != password){
        alert('Passwords do not match')
        return false
    }

    this.submit();
});
