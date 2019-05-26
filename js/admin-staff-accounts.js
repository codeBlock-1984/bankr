const profileTitle = document.querySelector('.profile__title');
const loader = document.getElementById('animated-loader');
const detailTable = document.querySelector('.detail-table');
let allAccounts;

loader.style.display = 'block';

profileTitle.innerHTML = '';
// detailTable.innerHTML = '';

const noAccount = `<div class="detail-table__row">
                    <p>
                     No account records to display
                    </p>
                   </div>`;

const authUser = JSON.parse(localStorage.getItem('authUser'));
const { firstName, lastName } = authUser;
profileTitle.innerHTML = `${firstName} ${lastName}`;

const token = localStorage.getItem('x-auth-token');
const getAccountsUrl = `https://bankr-server.herokuapp.com/api/v1/accounts`;

// console.log(token);
const options = {
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
    // debugger;
    if (!res.error) {
      const { data } = res;

      if (data[0]) {
        // debugger;
        allAccounts = data;
        let singleAccount;
        let serialNumber = 1;
        // detailTable.innerHTML = '';

        allAccounts.forEach((account) => {
          const {
            firstname,
            lastname,
            type,
            status,
            balance,
            accountnumber,
          } = account;

          let statusIconClass = 'fa-toggle-off activate-account-btn';
          if (status === 'active') {
            statusIconClass = 'fa-toggle-on deactivate-account-btn';
          }

          singleAccount = `<div class="detail-table__row">
                            <div class="detail-table__cell">${serialNumber}</div>
                            <div class="detail-table__cell m-sentence-case">${firstname} ${lastname}</div>
                            <div class="detail-table__cell">${type}</div>
                            <div class="detail-table__cell">${accountnumber}</div>
                            <div class="detail-table__cell"> ${balance}</div>
                            <div class="detail-table__cell">${status}</div>
                            <div class="detail-table__cell action-cell">
                              <i class="fas fa-eye action-icon view-account-btn"></i>
                              <i class="fas fa-trash-alt action-icon del-account-btn"></i>
                              <i class="fas ${statusIconClass} action-icon"></i>
                            </div>
                          </div>`;

          serialNumber += 1;
          detailTable.innerHTML += singleAccount;
        });

        //
        // Delete confirmation modal
        const delAccountBtns = document.querySelectorAll('.del-account-btn');

        const deactivateAccountButtons = document.querySelectorAll('.deactivate-account-btn');
        const activateAccountButtons = document.querySelectorAll('.activate-account-btn');
        const viewAccountBtns = document.querySelectorAll('.view-account-btn');

        // Add eventlisteners
        delAccountBtns.forEach((delAccountBtn) => {
          delAccountBtn.addEventListener('click', displayModal);
          delAccountBtn.addEventListener('mouseover', displayTooltip);
          delAccountBtn.addEventListener('mouseout', hideTooltip);
        });

        deactivateAccountButtons.forEach((deactivateAccountButton) => {
          deactivateAccountButton.addEventListener('mouseover', displayTooltip);
          deactivateAccountButton.addEventListener('mouseout', hideTooltip);
        });

        activateAccountButtons.forEach((activateAccountButton) => {
          activateAccountButton.addEventListener('mouseover', displayTooltip);
          activateAccountButton.addEventListener('mouseout', hideTooltip);
        });

        viewAccountBtns.forEach((viewAccountBtn) => {
          viewAccountBtn.addEventListener('click', displayAccountModal);
          viewAccountBtn.addEventListener('mouseover', displayTooltip);
          viewAccountBtn.addEventListener('mouseout', hideTooltip);
        });

        const activateAccountBtns = document.querySelectorAll('.activate-account-btn');
        const deactivateAccountBtns = document.querySelectorAll('.deactivate-account-btn');

        activateAccountBtns.forEach((activateAccountBtn) => {
          activateAccountBtn.addEventListener('click', activateAccount);
        });
        deactivateAccountBtns.forEach((deactivateAccountBtn) => {
          deactivateAccountBtn.addEventListener('click', deactivateAccount);
        });
      } else {
        // detailTable.style.flexDirection = 'row';
        detailTable.innerHTML += noAccount;
      }
    } else {
      // detailTable.style.flexDirection = 'row';
      detailTable.innerHTML += noAccount;
    }
    loader.style.display = 'none';
  })
  .catch((err) => {
    console.log(err);
  });

// End server functions
//
const brandModal = document.getElementById('del-confirm-dialog');
const accountViewModal = document.getElementById('account-view-modal');
const accountViewModalTitle = document.getElementById('account-view-modal__title');
const accountViewModalMain = document.getElementById('account-view-modal__main');

// Define callback functions
const deleteAccountBtn = document.getElementsByClassName('delete-account-btn')[0];
deleteAccountBtn.addEventListener('click', deleteAccount);
let deletedAccount;
let deleteAccountNumber;
let accountsTable;

function displayModal() {
  // debugger;
  accountsTable = this.parentNode.parentNode.parentNode;
  deletedAccount = this.parentNode.parentNode;
  deleteAccountNumber = this.parentNode.parentNode.childNodes[7].innerHTML;

  activeModal = brandModal;
  brandModal.style.display = 'block';
}

function displayAccountModal() {
  // debugger;
  const row = this.parentElement.parentElement;
  const cells = row.children;
  const accountIndex = parseInt(cells[0].innerHTML) - 1;
  const account = allAccounts[accountIndex];

  const {
    firstname,
    lastname,
    accountnumber,
    status,
    balance,
    type,
    photourl: accountPhotoUrl,
    createdon,
  } = account;

  const date = new Date(createdon).toString().slice(0, 15);
  const imageUrl = accountPhotoUrl || 'imgs/user_image.png';

  const singleAccount = `<div class="single-account-table-wrapper">
                          <div class="account-image-box">
                            <img class="account-image" src=${imageUrl} alt="${firstname} ${lastname}">
                            <div class="account-signature-box">
                              <img class="account-signature" src="https://fontmeme.com/permalink/190322/2cc138d160c63c622e3def7fc6cdd417.png" alt="Customer signature">
                              <h2 class="account-signature-title">Customer signature</h2>
                            </div>
                          </div>
                          <div class="detail-table single-account-table">
                            <div class="detail-table__row single-account-row">
                              <div class="detail-table__head single-detail">Account type :</div>
                              <div class="detail-table__cell single-detail__value">${type}</div>
                            </div>
                            <div class="detail-table__row single-account-row">
                              <div class="detail-table__head single-detail">Account number :</div>
                              <div class="detail-table__cell single-detail__value">${accountnumber}</div>
                            </div>
                            <div class="detail-table__row single-account-row">
                              <div class="detail-table__head single-detail">Current balance :</div>
                              <div class="detail-table__cell single-detail__value">${balance} NGN</div>
                            </div>
                            <div class="detail-table__row single-account-row">
                              <div class="detail-table__head single-detail">Created :</div>
                              <div class="detail-table__cell single-detail__value">${date}</div>
                            </div>
                            <div class="detail-table__row single-account-row">
                              <div class="detail-table__head single-detail">Status :</div>
                              <div class="detail-table__cell single-detail__value">${status}</div>
                            </div>
                          </div>
                        </div>`;

  activeModal = accountViewModal;
  accountViewModalTitle.innerHTML = `${firstname} ${lastname}`;
  accountViewModalMain.innerHTML = singleAccount;
  accountViewModal.style.display = 'block';
}

function deleteAccount() {
  // debugger;
  loader.style.display = 'block';
  deleteUrl = `https://bankr-server.herokuapp.com/api/v1/accounts/${deleteAccountNumber}`;

  deleteOptions = {
    method: 'DELETE',
    headers: new Headers({
      'Content-Type': 'application/json',
      'x-auth-token': token,
    }),
  };

  fetch(deleteUrl, deleteOptions)
    .then(res => res.json())
    .then((res) => {
      if (!res.error) {
        const { message } = res;

        if (message) {
          accountsTable.removeChild(deletedAccount);
        }
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


function activateAccount() {
  // debugger;
  loader.style.display = 'block';
  const patchAccountNumber = this.parentNode.parentNode.childNodes[7].innerHTML;
  const patchUrl = `https://bankr-server.herokuapp.com/api/v1/accounts/${patchAccountNumber}`;

  const patchData = { status: 'active' };

  const patchOptions = {
    method: 'PATCH',
    headers: new Headers({
      'Content-Type': 'application/json',
      'x-auth-token': token,
    }),
    body: JSON.stringify(patchData),
  };

  fetch(patchUrl, patchOptions)
    .then(res => res.json())
    .then((res) => {
      if (!res.error) {
        const { data } = res;

        if (data[0]) {
          const statusCell = this.parentNode.parentNode.childNodes[11];
          statusCell.innerHTML = 'Active';
          this.classList.remove('fa-toggle-off');
          this.classList.remove('activate-accout-btn');
          this.classList.add('fa-toggle-on');
          this.classList.add('deactivate-account-btn');
          this.removeEventListener('click', activateAccount);
          this.addEventListener('click', deactivateAccount);
          loader.style.display = 'none';
        } else {
          loader.style.display = 'none';
          console.log(res.error);
        }
      } else {
        loader.style.display = 'none';
        console.log(res.error);
      }
    })
    .catch((err) => {
      loader.style.display = 'none';
      console.log(err);
    });
}

function deactivateAccount() {
  loader.style.display = 'block';
  const patchAccountNumber = this.parentNode.parentNode.childNodes[7].innerHTML;
  const patchUrl = `https://bankr-server.herokuapp.com/api/v1/accounts/${patchAccountNumber}`;

  const patchData = { status: 'dormant' };

  const patchOptions = {
    method: 'PATCH',
    headers: new Headers({
      'Content-Type': 'application/json',
      'x-auth-token': token,
    }),
    body: JSON.stringify(patchData),
  };

  fetch(patchUrl, patchOptions)
    .then(res => res.json())
    .then((res) => {
      if (!res.error) {
        const { data } = res;

        if (data[0]) {
          const statusCell = this.parentNode.parentNode.childNodes[11];
          statusCell.innerHTML = 'Dormant';
          this.classList.remove('fa-toggle-on');
          this.classList.remove('deactivate-account-btn');
          this.classList.add('fa-toggle-off');
          this.classList.add('activate-account-btn');
          this.removeEventListener('click', deactivateAccount);
          this.addEventListener('click', activateAccount);
          loader.style.display = 'none';
        } else {
          loader.style.display = 'none';
          console.log(res.error);
        }
      } else {
        loader.style.display = 'none';
        console.log(res.error);
      }
    })
    .catch((err) => {
      loader.style.display = 'none';
      console.log(err);
    });
}
