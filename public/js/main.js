// In this file, you must perform all client-side validation for every single form input (and the role dropdown) on your pages. The constraints for those fields are the same as they are for the data functions and routes. Using client-side JS, you will intercept the form's submit event when the form is submitted and If there is an error in the user's input or they are missing fields, you will not allow the form to submit to the server and will display an error on the page to the user informing them of what was incorrect or missing.  You must do this for ALL fields for the register form as well as the login form. If the form being submitted has all valid data, then you will allow it to submit to the server for processing. Don't forget to check that password and confirm password match on the registration form!

let loginForm = document.getElementById('login-form');
let registrationForm = document.getElementById('registration-form');

if (loginForm) {
  loginForm.addEventListener('submit', (event) => {
    console.log('Login Form submission fired');
    event.preventDefault();
    let emailAddress = document.getElementById('emailAddressInput');
    let password = document.getElementById('passwordInput');
    let errorDiv = document.getElementById('loginErrors');

    if (emailAddress.value.trim() === '') {
      errorDiv.hidden = false;
      errorDiv.innerHTML = 'You must enter a value for username';
      return false;
    }

    if (password.value.trim() === '') {
      errorDiv.hidden = false;
      errorDiv.innerHTML = 'You must enter a value for password';
      return false;
    }

    event.target.submit();
  });


}

if(registrationForm){
  registrationForm.addEventListener('submit', (event) => {
    console.log('Registration Form submission fired');
    event.preventDefault();
    let errorDiv = document.getElementById('registerErrors');
    let emailAddress = document.getElementById('emailAddressInput');
    let firstName = document.getElementById('firstNameInput');
    let lastName = document.getElementById('lastNameInput');
    let password = document.getElementById('passwordInput');
    let comfirmPassword = document.getElementById('confirmPasswordInput');
    let role = document.getElementById('roleInput');


    if (emailAddress.value.trim() === '') {
      errorDiv.hidden = false;
      errorDiv.innerHTML = 'You must enter a value for username';
      return false;
    }

    if (firstName.value.trim() === '') {
      errorDiv.hidden = false;
      errorDiv.innerHTML = 'Error: You must enter a value for firstName';
      return false;
    }

    if (lastName.value.trim() === '') {
      errorDiv.hidden = false;
      errorDiv.innerHTML = 'Error: You must enter a value for lastName';
      return false;
    }

    if (password.value.trim() === '') {
      errorDiv.hidden = false;
      errorDiv.innerHTML = 'Error: You must enter a value for password';
      return false;
    }

    if (comfirmPassword.value.trim() === '') {
      errorDiv.hidden = false;
      errorDiv.innerHTML = 'Error: You must enter a value for comfirmPassword';
      return false;
    }    

    if (role.value.trim() === '') {
      errorDiv.hidden = false;
      errorDiv.innerHTML = 'Error: You must enter a value for role';
      return false;
    }

    if (role.value.trim() !== 'admin' && role.value.trim() !== 'user') {
      errorDiv.hidden = false;
      errorDiv.innerHTML = 'Error: You must select a valid role';
      return false;
    }

    if(password.value.trim() !== comfirmPassword.value.trim()){
      errorDiv.hidden = false;
      errorDiv.innerHTML = 'Error: password and confirm password MUST match!';
      return false;
    }

    event.target.submit();

  });

}