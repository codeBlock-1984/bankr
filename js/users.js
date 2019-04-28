// --- Users -----
const brandModal = document.getElementById('del-confirm-dialog');
const delUserButtons = document.querySelectorAll('.del-user-btn');
const deleteAccountBtn = document.getElementsByClassName('delete-account-btn')[0];

// Add eventlisteners
delUserButtons.forEach((delUserBtn) => {
  delUserBtn.addEventListener('click', displayModal);
});

deleteAccountBtn.addEventListener('click', deleteAccount);

function displayModal() {
  activeModal = brandModal;
  brandModal.style.display = 'block';
}
function deleteAccount() {
  const accountsTable = this.parentNode.parentNode.parentNode;
  const selectedRow = this.parentNode.parentNode;
  accountsTable.removeChild(selectedRow);
}


const activateUserBtns = document.querySelectorAll('.activate-user-btn');
const deactivateUserBtns = document.querySelectorAll('.deactivate-user-btn');

activateUserBtns.forEach((activateUserBtn) => {
  activateUserBtn.addEventListener('click', activateUser);
});
deactivateUserBtns.forEach((deactivateUserBtn) => {
  deactivateUserBtn.addEventListener('click', deactivateUser);
});

function activateUser() {
  const isActiveCell = this.parentNode.parentNode.childNodes[7];
  isActiveCell.innerHTML = 'Yes';
  this.classList.remove('fa-toggle-off');
  this.classList.remove('activate-user-btn');
  this.classList.add('fa-toggle-on');
  this.classList.add('deactivate-user-btn');
  this.removeEventListener('click', activateUser);
  this.addEventListener('click', deactivateUser);
}
function deactivateUser() {
  const isActiveCell = this.parentNode.parentNode.childNodes[7];
  isActiveCell.innerHTML = 'No';
  this.classList.remove('fa-toggle-on');
  this.classList.remove('deactivate-user-btn');
  this.classList.add('fa-toggle-off');
  this.classList.add('activate-user-btn');
  this.removeEventListener('click', deactivateUser);
  this.addEventListener('click', activateUser);
}

const delUserBtns = document.querySelectorAll('.del-user-btn');
const viewUserBtns = document.querySelectorAll('.view-user-btn');

delUserBtns.forEach((delUserBtn) => {
  delUserBtn.addEventListener('mouseover', displayTooltip);
  delUserBtn.addEventListener('mouseout', hideTooltip);
});

viewUserBtns.forEach((viewUserBtn) => {
  viewUserBtn.addEventListener('mouseover', displayTooltip);
  viewUserBtn.addEventListener('mouseout', hideTooltip);
});

function displayTooltip() {
  if (this.classList.contains('del-user-btn')) {
    this.innerHTML = `<span class="action-icon-hint" id="tool-tip">delete user</span>`;
  } else if (this.classList.contains('view-user-btn')) {
    this.innerHTML = `<span class="action-icon-hint" id="tool-tip">view user</span>`;
  }
}
function hideTooltip() {
  this.innerHTML = '';
}
