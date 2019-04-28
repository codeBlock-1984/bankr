const brandModalBox = document.getElementById('transact-modal');
const transactBtn = document.querySelector('.transact-link');
// const transactSendBtn = document.getElementsByClassName('delete-account-btn')[0];

// Add eventlisteners
transactBtn.addEventListener('click', (e) => {
  e.preventDefault();
  activeModal = brandModalBox;
  brandModalBox.style.display = 'block';
});

// function displayModal
// // function sendTransaction() {
//   const accountsTable = this.parentNode.parentNode.parentNode;
//   const selectedRow = this.parentNode.parentNode;
//   accountsTable.removeChild(selectedRow);
// }
