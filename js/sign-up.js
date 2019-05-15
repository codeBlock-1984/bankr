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
        messageBox.classList.add('m-error');
        messageBox.innerHTML = result.error;
        return false;
      }

      const { data } = result;
      console.log(data);
      const { token, ...user } = data[0];

      messageBox.classList.add('m-success');
      messageBox.innerHTML = result.message;

      localStorage.setItem('x-auth-token', token);
      localStorage.setItem('authUser', JSON.stringify(user));
      setTimeout(() => {
        (window.location.href = 'user-dashboard.html');
      }, 3000);
    })
    .catch((err) => {
      loader.style.display = 'none';
      messageBox.classList.add('m-error');
      messageBox.innerHTML = 'Unable to complete request';
    });
};

signUp.addEventListener('click', (e) => {
  e.preventDefault();
  messageBox.classList.remove('m-success');
  messageBox.classList.remove('m-error');
  const inputFields = [firstName, lastName, email, password];
  let checkValueFlag = false;

  inputFields.forEach((val) => {
    val.classList.remove('m-required');
    if (val.value === '') {
      checkValueFlag = true;
      val.classList.add('m-required');
    }
  });

  if (checkValueFlag) {
    messageBox.classList.add('m-error');
    messageBox.innerHTML = 'Fill in the required fields!';
    return undefined;
  }

  if (!validEmail.test(String(email.value).toLowerCase())) {
    messageBox.classList.add('m-error');
    messageBox.innerHTML = 'Invalid email address!';
    email.classList.add('m-required');
    return false;
  }

  if (password.value.length < 6) {
    messageBox.classList.add('m-error');
    messageBox.innerHTML = 'Password must be at least 6 characters long';
    password.classList.add('m-required');
    return false;
  }

  loader.style.display = 'block';
  messageBox.innerHTML = '';
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
