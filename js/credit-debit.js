const profileTitle = document.querySelector('.profile__title');
const loader = document.getElementById('animated-loader');
const accountSearchBtn = document.getElementById('account-search-btn');
const accountSearchInput = document.getElementById('account-search-input');
const searchResultBox = document.querySelector('.selected-account-detail-box');
const messageBox = document.querySelector('.message-box');
let accountsArray;
let searchFlag = false;
let amountFlag = false;
let transactFlag = false;
let transactionAccount;
let transactionAmount;
let transactionBalance;
let transactionType;

loader.style.display = 'block';
accountSearchBtn.addEventListener('click', searchAccount);

profileTitle.innerHTML = '';

const authUser = JSON.parse(localStorage.getItem('authUser'));
const { firstName, lastName } = authUser;

profileTitle.innerHTML = `${firstName} ${lastName}`;

const token = localStorage.getItem('x-auth-token');
getAccountsUrl = `https://bankr-server.herokuapp.com/api/v1/accounts`;

options = {
  method: 'GET',
  headers: new Headers({
    'Content-Type': 'application/json',
    'x-auth-token': token,
  }),
};

// debugger;
fetch(getAccountsUrl, options)
  .then(res => res.json())
  .then((res) => {
    if (!res.error) {
      const { data } = res;
      accountsArray = data;

      loader.style.display = 'none';
    } else {
      loader.style.display = 'none';
      console.log(res.error);
    }
  })
  .catch((err) => {
    loader.style.display = 'none';
    console.log(err);
  });

function searchAccount() {
  messageBox.style.display = 'none';
  // debugger;
  const query = parseInt(accountSearchInput.value);
  const searchResult = accountsArray.find(account => account.accountnumber === query);

  if (searchResult) {
    const {
      accountnumber,
      balance,
      status,
      type,
    } = searchResult;

    searchFlag = true;
    transactionAccount = accountnumber;
    transactionBalance = balance;

    searchResultBox.innerHTML = `<p class="selected-account-number">Account number: ${accountnumber}</p>
                                 <p class="selected-account-name">Status: ${status}</p>
                                 <p class="selected-account-name">Type: ${type}</p>
                                 <p class="selected-account-balance">Balance: ${balance}</p>`;
  } else {
    searchResultBox.innerHTML = `<p>No records found for the given account number</p>`;
  }

  searchResultBox.style.display = 'initial';
}
//

// ---- Transactions ------
const transactionSendBtn = document.getElementById('transaction-send-btn');
const transactionCancelBtn = document.getElementById('transaction-cancel-btn');
const selectType = document.getElementById('transaction-type');

// const transactionMessageDialog = document.getElementById('transaction-message-dialog');

transactionSendBtn.addEventListener('click', displayTransactionConfirmModal);
transactionCancelBtn.addEventListener('click', cancelTransaction);

function displayTransactionConfirmModal() {
  // debugger;
  messageBox.style.display = 'none';

  transactionType = selectType.options[selectType.selectedIndex].value;
  transactionAmount = document.getElementById('transaction-amount').value;
  const debitConfirmModal = document.getElementById('debit-confirm-dialog');
  const creditConfirmModal = document.getElementById('credit-confirm-dialog');

  const validAmount = /(([0-9]){1,7})$/;
  amountFlag = validAmount.test(parseInt(transactionAmount));
  if (transactionType && amountFlag && searchFlag) {
    transactFlag = true;
  }

  if (transactFlag) {
    if (transactionType === 'credit') {
      activeModal = creditConfirmModal;
      creditConfirmModal.style.display = 'block';
      const creditSendBtn = document.getElementsByClassName('credit-account-btn')[0];
      creditSendBtn.addEventListener('click', sendCredit);
    } else if (transactionType === 'debit') {
      if (transactionBalance < transactionAmount) {
        messageBox.innerHTML = `<p>Insufficient funds!</p>`;
        messageBox.style.display = 'block';
      } else {
        activeModal = debitConfirmModal;
        debitConfirmModal.style.display = 'block';
        const debitSendBtn = document.getElementsByClassName('debit-account-btn')[0];
        debitSendBtn.addEventListener('click', sendDebit);
      }
    }
  } else {
    messageBox.innerHTML = `<p>Empty or invalid input!</p>`;
    messageBox.style.display = 'block';
  }
}


function cancelTransaction() {
  document.getElementsByClassName('transaction-form')[0].reset();
}
function sendCredit() {
  // debugger;
  const amount = transactionAmount;
  const transactionData = { amount };

  const transactionOptions = {
    method: 'POST',
    headers: new Headers({
      'Content-Type': 'application/json',
      'x-auth-token': token,
    }),
    body: JSON.stringify(transactionData),
  };

  creditUrl = `https://bankr-server.herokuapp.com/api/v1/transactions/${transactionAccount}/credit`;

  fetch(creditUrl, transactionOptions)
    .then(res => res.json())
    .then((res) => {
      // debugger;
      if (!res.error) {
        const { data } = res;
        if (data[0]) {
          const successHeader = this.parentNode.parentNode.children[0].children[0];
          const successMessage = this.parentNode.parentNode.children[1].children[0];
          successHeader.innerHTML = `Transaction successful`;
          successMessage.innerHTML = `Successfully credited ${transactionAccount} with ${transactionAmount}`;
        }
      }
    })
    .catch((err) => {
      console.log(err);
    });

  closeModal();
  // transactionMessageDialog.style.display = 'block';
}
function sendDebit() {
  loader.style.display = 'block';
  // debugger;
  const amount = transactionAmount;
  const transactionData = { amount };

  const transactionOptions = {
    method: 'POST',
    headers: new Headers({
      'Content-Type': 'application/json',
      'x-auth-token': token,
    }),
    body: JSON.stringify(transactionData),
  };


  debitUrl = `https://bankr-server.herokuapp.com/api/v1/transactions/${transactionAccount}/debit`;

  fetch(debitUrl, transactionOptions)
    .then(res => res.json())
    .then((res) => {
      // debugger;
      if (!res.error) {
        const { data } = res;
        if (data[0]) {
          const successHeader = this.parentNode.parentNode.children[0].children[0];
          const successMessage = this.parentNode.parentNode.children[1].children[0];
          successHeader.innerHTML = `Transaction successful`;
          successMessage.innerHTML = `Successfully credited ${transactionAccount} with ${transactionAmount}`;
        }
      }
      loader.style.display = 'none';
    })
    .catch((err) => {
      loader.style.display = 'none';
      console.log(err);
    });

  closeModal();
  // transactionMessageDialog.style.display = 'block';
}
