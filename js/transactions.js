const profileTitle = document.querySelector('.profile__title');
const loader = document.getElementById('animated-loader');
const transTable = document.querySelector('.detail-table');

loader.style.display = 'block';
profileTitle.innerHTML = '';

// debugger;

const noTransaction = `<div class="no-trans-table-record no-record no-top no-trans">
                        <br>
                        <p>No transaction records to display</p>
                        <br>
                       <div>`;

const authUser = JSON.parse(localStorage.getItem('authUser'));
const { firstName, lastName } = authUser;
profileTitle.innerHTML = `${firstName} ${lastName}`;

const token = localStorage.getItem('x-auth-token');
const userAccountList = JSON.parse(localStorage.getItem('user-account-list'));
const { accountnumber: accountNumberParam } = userAccountList;

console.log(token);
const options = {
  method: 'GET',
  headers: new Headers({
    'Content-Type': 'application/json',
    'x-auth-token': token,
  }),
};

// debugger;
const getTransactionsUrl = `https://bankr-server.herokuapp.com/api/v1/accounts/${accountNumberParam}/transactions`;
let viewIconBtns;

fetch(getTransactionsUrl, options)
  .then(response => response.json())
  .then((response) => {
    if (!response.error) {
      const { data: transactionsData } = response;

      if (transactionsData[0]) {
        const userTransactions = transactionsData;
        let singleTransaction;

        userTransactions.forEach((transaction) => {
          const {
            type,
            amount,
            createdon,
            accountnumber,
            newbalance,
          } = transaction;

          const date = new Date(createdon).toString().slice(0, 24);
          console.log(date);
          singleTransaction = `<div class="detail-table__row">
                                <div class="detail-table__cell trans-tb-date">${date}</div>
                                <div class="detail-table__cell trans-tb-desc">${accountnumber}</div>
                                <div class="detail-table__cell trans-tb-type">${type}</div>
                                <div class="detail-table__cell trans-tb-amount">${amount}</div>
                                <div class="detail-table__cell trans-tb-balance">${newbalance}</div>
                                <div class="detail-table__cell trans-tb-icon">
                                  <i class="fas fa-eye action-icon view-trans-btn"></i>
                                </div>
                              </div>`;

          transTable.innerHTML += singleTransaction;
        });

        viewIconBtns = document.querySelectorAll('.view-trans-btn');
        viewIconBtns.forEach((icon) => {
          icon.addEventListener('click', displayModal);
        });
      } else {
        transTable.innerHTML += noTransaction;
      }
    } else {
      transTable.innerHTML += noTransaction;
    }
    loader.style.display = 'none';
  })
  .catch((err) => {
    transTable.innerHTML += noTransaction;
    console.log(err);
  });

//

const brandModal = document.getElementById('trans-view-box');
const brandModalMain = document.querySelector('.brand-modal-main');
const brandModalTitle = document.querySelector('.brand-modal-title');
// const mobileScreen = window.matchMedia('(max-width: 480px)');
// // const viewIconHead = document.querySelector('.trans-tb-balance-head');
// // const viewIconCells = document.querySelectorAll('.trans-tb-balance');
// // const viewIconBtns = document.querySelectorAll('.view-trans-btn');


// // debugger;
// displayViewIcons(mobileScreen);
// mobileScreen.addListener(displayViewIcons);

// // Define callback functions
// function displayViewIcons(screen) {
//   if (screen.matches) {
//     viewIconBtns.style.display = 'initial';
//     // viewIconBtns.forEach((icon) => {
//     //   icon.addEventListener('click', displayModal);
//     // });
//   }
// }

function displayModal() {
  const row = this.parentElement.parentElement;
  const cells = row.children;
  const date = cells[0].innerHTML;
  const description = cells[1].innerHTML;
  // const merchant = cells[2].innerHTML;
  const type = cells[2].innerHTML;
  const amount = cells[3].innerHTML;
  const balance = cells[4].innerHTML;

  const trans = `<p>Date:&nbsp;&nbsp;${date}</p><br>
                  <p>Description:&nbsp;&nbsp;${description}</p><br>
                  <p>Type:&nbsp;&nbsp;${type}</p><br>
                  <p>Amount:&nbsp;&nbsp;${amount}</p><br>
                  <p>Balance:&nbsp;&nbsp;${balance}</p><br>`;

  brandModalTitle.innerHTML = description;
  brandModalMain.innerHTML = trans;
  activeModal = brandModal;
  brandModal.style.display = 'block';
}
