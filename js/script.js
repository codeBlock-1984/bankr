// ---- Mobile menu --------
const mobileMenuLink = document.getElementById('mobile-menu-link');

mobileMenuLink.addEventListener('click', showMobileMenu);

function showMobileMenu() {
  const mobileMenu = document.getElementById('mobile-menu');

  if (mobileMenu.style.height === '230px') {
    mobileMenu.style.height = '0px';
  } else {
    mobileMenu.style.height = '230px';
  }
}

// ---- User profile panel -------
const userPanelLink = document.getElementById('user-panel-link');
let userPanel;

userPanelLink.addEventListener('click', showUserPanel);

function showUserPanel() {
  userPanel = document.getElementById('user-panel');

  if (userPanel.style.height === '80px') {
    userPanel.style.height = '0px';
  } else {
    userPanel.style.height = '80px';
  }
}

// ---- Modal globals -------
let activeModal;
const brandModalCloseBtns = document.querySelectorAll('.brand-modal-close');
const cancelDeleteBtns = document.querySelectorAll('.modal-cancel-btn');
brandModalCloseBtns.forEach((brandModalCloseBtn) => {
  brandModalCloseBtn.addEventListener('click', closeModal);
});
cancelDeleteBtns.forEach((cancelDeleteBtn) => {
  cancelDeleteBtn.addEventListener('click', closeModal);
});
window.addEventListener('click', (event) => {
  if (event.target === activeModal) {
    activeModal.style.display = 'none';
    activeModal = null;
  }
});
function closeModal() {
  const modal = activeModal;
  modal.style.display = 'none';
  activeModal = null;
}

// User Logout

const logoutLinks = document.querySelectorAll('.logout');
const animatedLoader = document.getElementById('animated-loader');

logoutLinks.forEach((logoutLink) => {
  logoutLink.addEventListener('click', (e) => {
    // debugger;
    e.preventDefault();

    animatedLoader.style.display = 'block';

    localStorage.removeItem('x-auth-token');
    localStorage.removeItem('authUser');

    setTimeout(() => {
      window.location = 'sign-in.html';
    }, 300);
  });
});

// User settings modal

const settingsLinks = document.querySelectorAll('.settings');
const currentUserToken = localStorage.getItem('x-auth-token');
const msgBox = document.createElement('p');
msgBox.classList.add('alert-message', 'm-text-center');
msgBox.setAttribute('id', 'message-box');
msgBox.style.marginBottom = '10px';

const imagePreview = document.createElement('img');

const oldPassword = document.getElementById('old-password');
const newPassword = document.getElementById('new-password');
const confirmPassword = document.getElementById('confirm-password');
const inputFields = [oldPassword, newPassword, confirmPassword];

const photoUrlField = document.getElementById('image-url');

let imageUploadLink;
let changePasswordLink;
let imageUploadTab;
let changePasswordTab;
let checkFlag;

settingsLinks.forEach((settingsLink) => {
  settingsLink.addEventListener('click', (e) => {
    e.preventDefault();
    const userSettingsModal = document.getElementById('user-settings-modal');
    activeModal = userSettingsModal;
    userSettingsModal.style.display = 'block';

    imageUploadLink = document.getElementById('image-upload-link');
    changePasswordLink = document.getElementById('change-password-link');
    imageUploadTab = document.querySelector('.image-upload');
    changePasswordTab = document.querySelector('.change-password');

    imageUploadLink.addEventListener('click', displayImageTab);
    changePasswordLink.addEventListener('click', displayPasswordTab);

    imageUploadTab.insertBefore(msgBox, imageUploadTab.childNodes[0]);
    msgBox.innerHTML = '';
    msgBox.classList.remove('m-success');
    msgBox.classList.remove('m-error');

    photoUrlField.classList.remove('m-required');
    photoUrlField.value = '';
    const uploadBtn = document.getElementById('upload-button');
    uploadBtn.addEventListener('click', uploadImage);
  });
});

function displayImageTab() {
  imageUploadTab.insertBefore(msgBox, imageUploadTab.childNodes[0]);
  msgBox.innerHTML = '';
  msgBox.classList.remove('m-success');
  msgBox.classList.remove('m-error');

  photoUrlField.classList.remove('m-required');
  photoUrlField.value = '';

  changePasswordLink.classList.remove('active-tab');
  changePasswordTab.style.display = 'none';
  imageUploadLink.classList.add('active-tab');
  imageUploadTab.style.display = 'flex';

  // const uploadBtn = document.getElementById('upload-button');
  // uploadBtn.addEventListener('click', uploadImage);
}

function displayPasswordTab() {
  changePasswordTab.insertBefore(msgBox, changePasswordTab.childNodes[0]);
  msgBox.innerHTML = '';
  msgBox.classList.remove('m-success');
  msgBox.classList.remove('m-error');

  inputFields.forEach((val) => {
    val.classList.remove('m-required');
    val.value = '';
  });

  imageUploadLink.classList.remove('active-tab');
  imageUploadTab.style.display = 'none';
  changePasswordLink.classList.add('active-tab');
  changePasswordTab.style.display = 'flex';

  const changePasswordBtn = document.getElementById('change-password-button');
  changePasswordBtn.addEventListener('click', changePassword);
}

function uploadImage() {
  // debugger;
  msgBox.classList.remove('m-success');
  msgBox.classList.remove('m-error');
  checkFlag = false;

  photoUrlField.classList.remove('m-required');
  if (photoUrlField.value === '') {
    checkFlag = true;
    photoUrlField.classList.add('m-required');
  }


  if (checkFlag) {
    msgBox.classList.add('m-error');
    msgBox.innerHTML = 'Photo url is required!';
    return undefined;
  }

  try {
    imagePreview.src = photoUrlField.value;
    if (imagePreview.height < 1) {
      msgBox.classList.add('m-error');
      msgBox.innerHTML = 'Could not load image. Invalid url.';
      return false;
    }
    // imageUploadTab.insertBefore(imagePreview, imagePreview.childNodes[1]);
    // return false;
  } catch (error) {
    msgBox.classList.add('m-error');
    msgBox.innerHTML = 'Could not load image. Invalid url.';
    return false;
  }

  // imagePreview.setAttribute('onload', imageOnload());
  // imagePreview.setAttribute('onerror', imageOnerror());

  loader.style.display = 'block';
  msgBox.innerHTML = '';

  const imageUploadData = {
    photoUrl: photoUrlField.value,
  };

  const imageUploadOptions = {
    method: 'PATCH',
    headers: new Headers({
      'Content-Type': 'application/json',
      'x-auth-token': currentUserToken,
    }),
    body: JSON.stringify(imageUploadData),
  };

  imageUploadUrl = `https://bankr-server.herokuapp.com/api/v1/users/photo`;

  fetch(imageUploadUrl, imageUploadOptions)
    .then(res => res.json())
    .then((res) => {
      // debugger;
      if (!res.error) {
        const { message } = res;
        if (message) {
          msgBox.classList.add('m-success');
          msgBox.innerHTML = message;

          photoUrlField.value = '';
        } else {
          loader.style.display = 'none';
        }
      } else {
        loader.style.display = 'none';
        const { error } = res;
        msgBox.classList.add('m-error');
        msgBox.innerHTML = error;
      }
      loader.style.display = 'none';
    })
    .catch((err) => {
      loader.style.display = 'none';
      console.log(err);
    });
}

// function imageOnload() {
//   debugger;
//   imageUploadTab.insertBefore(imagePreview, imagePreview.childNodes[1]);
//   return false;
// }
// function imageOnerror() {
//   msgBox.classList.add('m-error');
//   msgBox.innerHTML = 'Could not load image. Try another url.';
//   return false;
// }

function changePassword() {
  msgBox.classList.remove('m-success');
  msgBox.classList.remove('m-error');
  checkFlag = false;

  inputFields.forEach((val) => {
    val.classList.remove('m-required');
    if (val.value === '' || val.value === 'select') {
      checkFlag = true;
      val.classList.add('m-required');
    }
  });

  if (checkFlag) {
    msgBox.classList.add('m-error');
    msgBox.innerHTML = 'Fill in the required fields!';
    return undefined;
  }

  if (newPassword.value !== confirmPassword.value) {
    msgBox.classList.add('m-error');
    msgBox.innerHTML = 'Password and confirm password do not match!';
    newPassword.classList.add('m-required');
    confirmPassword.classList.add('m-required');
    return false;
  }

  loader.style.display = 'block';
  msgBox.innerHTML = '';

  const passwordChangeData = {
    oldPassword: oldPassword.value,
    newPassword: newPassword.value,
  };

  const passwordChangeOptions = {
    method: 'PATCH',
    headers: new Headers({
      'Content-Type': 'application/json',
      'x-auth-token': currentUserToken,
    }),
    body: JSON.stringify(passwordChangeData),
  };

  passwordChangeUrl = `https://bankr-server.herokuapp.com/api/v1/users/password`;

  fetch(passwordChangeUrl, passwordChangeOptions)
    .then(res => res.json())
    .then((res) => {
      // debugger;
      if (!res.error) {
        const { message } = res;
        if (message) {
          msgBox.classList.add('m-success');
          msgBox.innerHTML = message;

          inputFields.forEach((val) => {
            val.value = '';
          });
        } else {
          loader.style.display = 'none';
        }
      } else {
        loader.style.display = 'none';
        const { error } = res;
        msgBox.classList.add('m-error');
        msgBox.innerHTML = error;
      }
      loader.style.display = 'none';
    })
    .catch((err) => {
      loader.style.display = 'none';
      console.log(err);
    });
}
