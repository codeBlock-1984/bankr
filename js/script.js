// ---- Mobile menu --------
const mobileMenuLink = document.getElementById('mobile-menu-link');

mobileMenuLink.addEventListener('click', showMobileMenu);

function showMobileMenu() {
  const mobileMenu = document.getElementById('mobile-menu');

  if (mobileMenu.style.height === '400px') {
    mobileMenu.style.height = '0px';
  } else {
    mobileMenu.style.height = '400px';
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
    }
});
function closeModal() {
  const modal = activeModal;
  modal.style.display = 'none';
  activeModal = null;
}


// Delete confirmation modal
const brandModal = document.getElementById('del-confirm-dialog');
const delAccountBtns = document.querySelectorAll('.del-account-btn');
const deleteAccountBtn = document.getElementsByClassName('delete-account-btn')[0];

// Add eventlisteners
delAccountBtns.forEach((delAccountBtn) => {
  delAccountBtn.addEventListener('click', displayModal);
});
deleteAccountBtn.addEventListener('click', deleteAccount);

// Define callback functions
function displayModal() {
  activeModal = brandModal;
  brandModal.style.display = "block";
}
function deleteAccount() {
  const accountsTable = this.parentNode.parentNode.parentNode;
  const selectedRow = this.parentNode.parentNode;
  accountsTable.removeChild(selectedRow);
} 
