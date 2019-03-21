const signinButton = document.getElementById('signin-button');
const messageBox = document.getElementById('message-box');

signinButton.addEventListener('click', (e) => {
  debugger;
  e.preventDefault();
  messageBox.innerHTML = '';
  const inputEmail = document.getElementById('email').value;
  const email = inputEmail.toLowerCase().trim();
  const inputPassword = document.getElementById('password').value;
  const password = inputPassword.toLowerCase().trim();

  if (!email || email === '' || !password || password === '') {
    messageBox.innerHTML = 'All fields are required!';
    return false;
  }
  if (email !== 'admin' && email !== 'staff' && email !== 'user') {
    messageBox.innerHTML = 'Email or password incorrect!';
    return false;
  }
  if (password !== 'demo') {
    messageBox.innerHTML = 'Email or password incorrect!';
    return false;
  }
  messageBox.innerHTML = 'Logging user in...';
  setTimeout(login(email), 10000);
  
});

function login(email){
  switch (email) {
    case 'admin':
    window.location.href = 'admin-dashboard.html';
    break;

    case 'staff':
    window.location.href = 'staff-dashboard.html';
    break;

    case 'user':
    window.location.href = 'user-dashboard.html';
    break;
  }
}