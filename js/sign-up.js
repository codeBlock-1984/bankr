/* eslint-disable no-useless-escape */
window.oncontextmenu = () => false;
const signUp = document.getElementById('signup-button');
const firstName = document.getElementById('firstname');
const lastName = document.getElementById('lastname');
const email = document.getElementById('email');
const password = document.getElementById('password');
const messageBox = document.getElementById('message-box');
const loader = document.getElementById('animated-loader');


// Credit: https://stackoverflow.com/questions/46155/how-to-validate-an-email-address-in-javascript
const validEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const signUpUser = (userData) => {
  const fetchData = {
    method: 'POST',
    body: userData,
    headers: { 'Content-Type': 'application/json' },
  };
  const url = 'https://bankr-server.herokuapp.com/api/v1/auth/signup';
  fetch(url, fetchData)
    .then(res => res.json())
    .then((result) => {
      loader.style.display = 'none';

      if (result.error) {
        messageBox.innerHTML = result.error;
        return false;
      }

      const { data } = result;
      console.log(data);
      const { token, ...user } = data[0];
      messageBox.innerHTML = result.message;

      localStorage.setItem('x-auth-token', token);
      localStorage.setItem('authUser', JSON.stringify(user));
      setTimeout(() => {
        (window.location.href = 'sign-in.html');
      }, 3000);
    })
    .catch((err) => {
      messageBox.innerHTML = err;
    });
};

signUp.addEventListener('click', (e) => {
  e.preventDefault();

  if (firstName.value === '') {
    messageBox.innerHTML = 'First name is required!';
    firstName.focus();
    return false;
  }

  if (lastName.value === '') {
    messageBox.innerHTML = 'Last name is required!';
    lastName.focus();
    return false;
  }

  if (email.value === '') {
    messageBox.innerHTML = 'Email is required!';
    email.focus();
    return false;
  }

  if (!validEmail.test(String(email.value).toLowerCase())) {
    messageBox.innerHTML = 'Invalid email address!';
    email.focus();
    return false;
  }


  if (password.value === '') {
    messageBox.innerHTML = 'Password is required!';
    password.focus();
    return false;
  }

  if (password.value.length < 6) {
    messageBox.innerHTML = 'The password must be at least 6 characters long';
    password.focus();
    return false;
  }

  loader.style.display = 'block';
  const userData = {
    firstName: firstName.value,
    lastName: lastName.value,
    email: email.value,
    password: password.value,
    type: 'client',
  };
  const body = JSON.stringify(userData);
  signUpUser(body);
});
