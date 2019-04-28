const signinButton = document.getElementById('signin-button');
const messageBox = document.getElementById('message-box');
const loader = document.getElementById('animated-loader');

signinButton.addEventListener('click', (e) => {
  e.preventDefault();
  messageBox.innerHTML = '';
  const inputEmail = document.getElementById('email').value;
  const email = inputEmail.toLowerCase().trim();
  const inputPassword = document.getElementById('password').value;
  const password = inputPassword.toLowerCase().trim();
  const validEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  if (email === '') {
    messageBox.innerHTML = 'Email is required!';
    email.focus();
    return false;
  }
  if (!validEmail.test(String(email).toLowerCase())) {
    messageBox.innerHTML = 'Invalid email address!';
    email.focus();
    return false;
  }

  if (password === '') {
    messageBox.innerHTML = 'Password is required!';
    password.focus();
    return false;
  }
  const loginDetails = {
    email,
    password,
  };
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
        messageBox.innerHTML = res.error;
      } else {
        const { data } = res;
        const { token, ...user } = data[0];

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
        }, 3000);
      }
    })
    .catch((err) => {
      messageBox.innerHTML = err;
    });
}
