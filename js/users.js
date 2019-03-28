// --- Users -----
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