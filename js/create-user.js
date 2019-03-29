// Create User
const createUserBtn = document.getElementById('create-user-btn');
const cancelCreateUserBtn = document.getElementById('cancel-user-create-btn');
const createUserMessageDialog = document.getElementById('create-user-message-dialog');

createUserBtn.addEventListener('click', displaySuccessModal);
cancelCreateUserBtn.addEventListener('click', cancelCreateUser);

function displaySuccessModal() {
  activeModal = createUserMessageDialog;
  createUserMessageDialog.style.display = 'block';
}
function cancelCreateUser() {
  document.getElementById('create-user-account-form').reset();
}