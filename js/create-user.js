// Create User
const profileTitle = document.querySelector('.profile__title');
const loader = document.getElementById('animated-loader');
const messageBox = document.getElementById('message-box');
const newUserFirstName = document.getElementById('fname');
const newUserLastName = document.getElementById('lname');
const newUserEmail = document.getElementById('email');
const newUserRole = document.getElementById('role');

// loader.style.display = 'block';
profileTitle.innerHTML = '';


const authUser = JSON.parse(localStorage.getItem('authUser'));
const {
  firstName,
  lastName,
} = authUser;

profileTitle.innerHTML = `${firstName} ${lastName}`;

const token = localStorage.getItem('x-auth-token');
const createUserUrl = `https://bankr-server.herokuapp.com/api/v1/users`;
const validEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

function createUser() {
  messageBox.classList.remove('m-success');
  messageBox.classList.remove('m-error');
  const inputFields = [newUserFirstName, newUserLastName, newUserEmail, newUserRole];
  let checkValueFlag = false;

  inputFields.forEach((val) => {
    val.classList.remove('m-required');
    if (val.value === '' || val.value === 'select') {
      checkValueFlag = true;
      val.classList.add('m-required');
    }
  });

  if (checkValueFlag) {
    messageBox.classList.add('m-error');
    messageBox.innerHTML = 'Fill in the required fields!';
    return undefined;
  }

  if (!validEmail.test(String(newUserEmail.value).toLowerCase())) {
    messageBox.classList.add('m-error');
    messageBox.innerHTML = 'Invalid email address!';
    newUserEmail.classList.add('m-required');
    return false;
  }

  loader.style.display = 'block';
  messageBox.innerHTML = '';
  const fName = newUserFirstName.value;
  const lName = newUserLastName.value;
  const email = newUserEmail.value;
  const role = newUserRole.options[newUserRole.selectedIndex].value;

  const newUserDetails = {
    firstName: fName,
    lastName: lName,
    email,
    type: role,
  };

  const options = {
    method: 'POST',
    headers: new Headers({
      'Content-Type': 'application/json',
      'x-auth-token': token,
    }),
    body: JSON.stringify(newUserDetails)
  };

  // debugger;
  fetch(createUserUrl, options)
    .then(res => res.json())
    .then((res) => {
      // debugger;
      if (!res.error) {
        const { data } = res;

        loader.style.display = 'none';
        if (data[0]) {
          displaySuccessModal();
        } else {
          loader.style.display = 'none';
          // handle case !data[0]
        }
      } else {
        loader.style.display = 'none';
        // handle error
      }
      loader.style.display = 'none';
    })
    .catch((err) => {
      loader.style.display = 'none';
      console.log(err);
    });
}


const createUserBtn = document.getElementById('create-user-btn');
const cancelCreateUserBtn = document.getElementById('cancel-user-create-btn');
const createUserMessageDialog = document.getElementById('create-user-message-dialog');


createUserBtn.addEventListener('click', createUser);
cancelCreateUserBtn.addEventListener('click', cancelCreateUser);

function displaySuccessModal() {
  activeModal = createUserMessageDialog;
  createUserMessageDialog.style.display = 'block';
}
function cancelCreateUser() {
  document.getElementById('create-user-account-form').reset();
}
