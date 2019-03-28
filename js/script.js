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
// Brand modal
const brandModal = document.getElementById('del-confirm-dialog');
const delAccountBtns = document.querySelectorAll('.del-account-btn');
const brandModalClose = document.getElementsByClassName('brand-modal-close')[0];
const deleteAccountBtn = document.getElementsByClassName('delete-account-btn')[0];
const cancelDeleteBtn = document.getElementsByClassName('cancel-delete-btn')[0];

// Add eventlisteners
delAccountBtns.forEach((delAccountBtn) => {
  delAccountBtn.addEventListener('click', displayModal);
});
brandModalClose.addEventListener('click', closeModal);
window.addEventListener('click', function(event) {
    if (event.target == brandModal) {
      brandModal.style.display = "none";
    }
});
deleteAccountBtn.addEventListener('click', deleteAccount);
cancelDeleteBtn.addEventListener('click', cancelDelete);

// Define callback functions
function displayModal() {
  brandModal.style.display = "block";
}
function closeModal() {
  brandModal.style.display = "none";
}
function deleteAccount() {
  //debugger;
  const accountsTable = this.parentNode.parentNode.parentNode;
  const selectedRow = this.parentNode.parentNode;
  accountsTable.removeChild(selectedRow);
} 
function cancelDelete() {
  brandModal.style.display = "none";
}
