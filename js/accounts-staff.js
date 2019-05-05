// --- Accounts staff -----
// const activateAccountBtns = document.querySelectorAll('.activate-account-btn');
// const deactivateAccountBtns = document.querySelectorAll('.deactivate-account-btn');

// activateAccountBtns.forEach((activateAccountBtn) => {
//   activateAccountBtn.addEventListener('click', activateAccount);
// });
// deactivateAccountBtns.forEach((deactivateAccountBtn) => {
//   deactivateAccountBtn.addEventListener('click', deactivateAccount);
// });

// function activateAccount() {
//   const statusCell = this.parentNode.parentNode.childNodes[11];
//   statusCell.innerHTML = 'Active';
//   this.classList.remove('fa-toggle-off');
//   this.classList.remove('activate-accout-btn');
//   this.classList.add('fa-toggle-on');
//   this.classList.add('deactivate-account-btn');
//   this.removeEventListener('click', activateAccount);
//   this.addEventListener('click', deactivateAccount);
// }
// function deactivateAccount() {
//   const statusCell = this.parentNode.parentNode.childNodes[11];
//   statusCell.innerHTML = 'Dormant';
//   this.classList.remove('fa-toggle-on');
//   this.classList.remove('deactivate-account-btn');
//   this.classList.add('fa-toggle-off');
//   this.classList.add('activate-account-btn');
//   this.removeEventListener('click', deactivateAccount);
//   this.addEventListener('click', activateAccount);
// }
