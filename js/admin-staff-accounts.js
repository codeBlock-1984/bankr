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