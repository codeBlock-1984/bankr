// Delete confirmation modal
const brandModal = document.getElementById('del-confirm-dialog');
const delAccountBtns = document.querySelectorAll('.del-account-btn');
const deleteAccountBtn = document.getElementsByClassName('delete-account-btn')[0];

const deactivateAccountButtons = document.querySelectorAll('.deactivate-account-btn');
const activateAccountButtons = document.querySelectorAll('.activate-account-btn');
const viewAccountBtns = document.querySelectorAll('.view-account-btn');

// Add eventlisteners
delAccountBtns.forEach((delAccountBtn) => {
  delAccountBtn.addEventListener('click', displayModal);
  delAccountBtn.addEventListener('mouseover', displayTooltip);
  delAccountBtn.addEventListener('mouseout', hideTooltip);
});
deleteAccountBtn.addEventListener('click', deleteAccount);

deactivateAccountButtons.forEach((deactivateAccountButton) => {
  deactivateAccountButton.addEventListener('mouseover', displayTooltip);
  deactivateAccountButton.addEventListener('mouseout', hideTooltip);
});

activateAccountButtons.forEach((activateAccountButton) => {
  activateAccountButton.addEventListener('mouseover', displayTooltip);
  activateAccountButton.addEventListener('mouseout', hideTooltip);
});

viewAccountBtns.forEach((viewAccountBtn) => {
  viewAccountBtn.addEventListener('mouseover', displayTooltip);
  viewAccountBtn.addEventListener('mouseout', hideTooltip);
});

// Define callback functions
function displayModal() {
  activeModal = brandModal;
  brandModal.style.display = 'block';
}
function deleteAccount() {
  const accountsTable = this.parentNode.parentNode.parentNode;
  const selectedRow = this.parentNode.parentNode;
  accountsTable.removeChild(selectedRow);
}
function displayTooltip() {
  if (this.classList.contains('deactivate-account-btn')) {
    this.innerHTML = `<span class="action-icon-hint" id="tool-tip">deactivate account</span>`;
  } else if (this.classList.contains('del-account-btn')) {
    this.innerHTML = `<span class="action-icon-hint" id="tool-tip">delete account</span>`;
  } else if (this.classList.contains('activate-account-btn')) {
    this.innerHTML = `<span class="action-icon-hint" id="tool-tip">activate account</span>`;
  } else if (this.classList.contains('view-account-btn')) {
    this.innerHTML = `<span class="action-icon-hint" id="tool-tip">view account</span>`;
  }
}
function hideTooltip() {
  this.innerHTML = '';
}
