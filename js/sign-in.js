const signinButton = document.getElementById('signin-button');
const messageBox = document.getElementById('message-box');
const loader = document.getElementById('animated-loader');

signinButton.addEventListener('click', (e) => {
  e.preventDefault();
  // debugger;
  messageBox.innerHTML = '';
  const email = document.getElementById('email');
  // const email = inputEmail.value.toLowerCase().trim();
  const password = document.getElementById('password');
  const validEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  messageBox.classList.remove('m-success');
  messageBox.classList.remove('m-error');
  const inputFields = [email, password];
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
  // if (email === '') {
  //   messageBox.innerHTML = 'Email is required!';
  //   email.focus();
  //   return false;
  // }
  if (!validEmail.test(String(email.value).toLowerCase())) {
    messageBox.classList.add('m-error');
    messageBox.innerHTML = 'Invalid email address!';
    email.classList.add('m-required');
    return false;
  }
  // if (!validEmail.test(String(email).toLowerCase())) {
  //   messageBox.innerHTML = 'Invalid email address!';
  //   email.focus();
  //   return false;
  // }

  // if (password === '') {
  //   messageBox.innerHTML = 'Password is required!';
  //   password.focus();
  //   return false;
  // }
  const loginDetails = {
    email: email.value,
    password: password.value,
  };
  messageBox.innerHTML = '';
  // messageBox.innerHTML = `Logging user in as ${email}...`;
  login(loginDetails);
});

function login(loginData) {
  const fetchData = {
    method: 'POST',
    body: JSON.stringify(loginData),
    headers: { 'Content-Type': 'application/json' },
  };
  const url = 'https://bankr-server.herokuapp.com/api/v1/auth/signin';

  loader.style.display = 'block';
  fetch(url, fetchData)
    .then(res => res.json())
    .then((res) => {
      loader.style.display = 'none';

      if (res.error) {
        // debugger;
        messageBox.classList.add('m-error');
        messageBox.innerHTML = 'Email or password incorrect!';
      } else {
        const { data } = res;
        const { token, ...user } = data[0];

        messageBox.classList.add('m-success');
        messageBox.innerHTML = 'logging user in...';

        localStorage.setItem('x-auth-token', token);
        localStorage.setItem('authUser', JSON.stringify(user));
        const { type } = user;
        setTimeout(() => {
          switch (type) {
            case 'admin':
              window.location.href = 'admin-dashboard.html';
              break;

            case 'cashier':
              window.location.href = 'staff-dashboard.html';
              break;

            case 'client':
              window.location.href = 'user-dashboard.html';
              break;

            default:
              break;
          }
        }, 300);
      }
    })
    .catch((err) => {
      messageBox.innerHTML = err;
    });
}
