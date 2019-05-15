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
let imageUploadLink;
let changePasswordLink;
let imageUploadTab;
let changePasswordTab;

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
  });
});

function displayImageTab() {
  changePasswordLink.classList.remove('active-tab');
  changePasswordTab.style.display = 'none';
  imageUploadLink.classList.add('active-tab');
  imageUploadTab.style.display = 'flex';

  const uploadBtn = document.getElementById('upload-button');
  uploadBtn.addEventListener('click', uploadImage);
}

function displayPasswordTab() {
  imageUploadLink.classList.remove('active-tab');
  imageUploadTab.style.display = 'none';
  changePasswordLink.classList.add('active-tab');
  changePasswordTab.style.display = 'flex';

  const changePasswordBtn = document.getElementById('change-password-button');
  changePasswordBtn.addEventListener('click', changePassword);
}

function uploadImage() {
  return undefined;
}

function changePassword() {
  return undefined;
}
