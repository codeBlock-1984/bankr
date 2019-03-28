// ---- Transactions ------
const transactionSendBtn = document.getElementById('transaction-send-btn');
const transactionCancelBtn = document.getElementById('transaction-cancel-btn');
const selectType = document.getElementById('transaction-type');

const transactionMessageDialog = document.getElementById('transaction-message-dialog');

transactionSendBtn.addEventListener('click', displayTransactionConfirmModal);
transactionCancelBtn.addEventListener('click', cancelTransaction);

function displayTransactionConfirmModal() {
  // debugger;
  const transactionType = selectType.options[selectType.selectedIndex].value;
  const debitConfirmModal = document.getElementById('debit-confirm-dialog');
  const creditConfirmModal = document.getElementById('credit-confirm-dialog');
  if (transactionType === 'credit') {
    activeModal = creditConfirmModal;
    creditConfirmModal.style.display = 'block';
    const creditSendBtn = document.getElementsByClassName('credit-account-btn')[0];
    creditSendBtn.addEventListener('click', sendCredit);
  } else if (transactionType === 'debit') {
    activeModal = debitConfirmModal;
    debitConfirmModal.style.display = 'block';
    const debitSendBtn = document.getElementsByClassName('debit-account-btn')[0];
    debitSendBtn.addEventListener('click', sendDebit);
  } else return undefined;
}

function cancelTransaction() {
  document.getElementsByClassName('transaction-form')[0].reset();
}
function sendCredit() {
  closeModal();
  // transactionMessageDialog.style.display = 'block';
}
function sendDebit() {
  closeModal();
  // transactionMessageDialog.style.display = 'block';
}