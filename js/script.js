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
window.addEventListener('click', function(event) {
    if (event.target == activeModal) {
      activeModal.style.display = "none";
      activeModal = null;
    }
});
function closeModal() {
  const modal = activeModal;
  modal.style.display = 'none';
  activeModal = null;
}



