const profileTitle = document.querySelector('.profile__title');
const loader = document.getElementById('animated-loader');
const transBox = document.querySelector('.trans-box');
const accountWrapper = document.querySelector('.account-wrapper');
let accountNumberParam;

loader.style.display = 'block';

profileTitle.innerHTML = '';
accountWrapper.innerHTML = '';
transBox.innerHTML = '';

const noAccount = `<div class="no-record no-bot no-account">
                   <p>You don't have any accounts yet.
                   Want to quickly <a href="create-account.html">
                   create one</a>?
                   </p>
                   </div>`;

const noTransaction = `<div class="no-record no-top no-trans">
                       <p>No recent transactions to display</p>
                       <div>`;

const authUser = JSON.parse(localStorage.getItem('authUser'));
const { firstName, lastName, email } = authUser;
profileTitle.innerHTML = `${firstName} ${lastName}`;

const token = localStorage.getItem('x-auth-token');
const getAccountsUrl = `https://bankr-server.herokuapp.com/api/v1/users/${email}/accounts`;

console.log(token);
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
        const trimmedAccounts = data.splice(0, 2);
        console.log(trimmedAccounts[0], 'trimmed');
        const userAccountList = trimmedAccounts[0];
        localStorage.setItem('user-account-list', JSON.stringify(userAccountList));
        accountNumberParam = trimmedAccounts[0].accountnumber;
        let singleAccount;
        accountWrapper.innerHTML = '';
        trimmedAccounts.forEach((account) => {
          const {
            type,
            balance,
            accountnumber,
          } = account;
          singleAccount = `<div class="account-box big-box">
                            <span class="account-detail__title">Account type</span>
                            <p class="account-detail account-type">${type}</p>
                            <span class="account-detail__title">Account number</span>
                            <p class="account-detail account-number">A/C &nbsp;&nbsp; ${accountnumber}</p>
                            <span class="account-detail account-card"><img src="imgs/verve-logo.png" class="card-logo" alt="verve logo"> &nbsp;&nbsp;&nbsp;&nbsp;** 4355 8603</span>
                            <p class="account-detail account-balance account-red">${balance} &nbsp;ngn</p>
                            <p class="account-detail account-balance-desc">Current balance</p>
                          </div>`;

          accountWrapper.innerHTML += singleAccount;
        });

        const getTransactionsUrl = `https://bankr-server.herokuapp.com/api/v1/accounts/${accountNumberParam}/transactions`;

        fetch(getTransactionsUrl, options)
          .then(response => response.json())
          .then((response) => {
            if (!response.error) {
              const { data: transactionsData } = response;

              if (transactionsData[0]) {
                const trimmedTransactions = transactionsData.splice(0, 4);
                let singleTransaction;
                console.log(data[0]);
                transBox.innerHTML = '';

                trimmedTransactions.forEach((transaction) => {
                  const {
                    type,
                    amount,
                    createdon,
                    accountnumber,
                  } = transaction;

                  const date = new Date(createdon).toString().slice(0, 24);
                  console.log(date);
                  singleTransaction = `<div class="single-box">
                                        <p class="trans-detail trans-title">${type}</p>
                                        <p class="trans-detail trans-date-time">${date}</p>
                                        <p class="trans-detail trans-vendor">${accountnumber}</p>
                                        <p class="trans-detail trans-amount">${amount} &nbsp;ngn</p>
                                      </div>`;
                  transBox.innerHTML += singleTransaction;
                });
              } else {
                transBox.innerHTML = noTransaction;
              }
            }
            loader.style.display = 'none';
          })
          .catch((err) => {
            accountWrapper.style.flexDirection = 'row';
            accountWrapper.innerHTML = noAccount;
            transBox.innerHTML = noTransaction;
            console.log(err);
          });
      } else {
        accountWrapper.style.flexDirection = 'row';
        accountWrapper.innerHTML = noAccount;
        transBox.appendChild(noTransaction);
      }
    } else {
      accountWrapper.style.flexDirection = 'row';
      accountWrapper.innerHTML = noAccount;
      transBox.innerHTML = noTransaction;
    }
    loader.style.display = 'none';
  })
  .catch((err) => {
    console.log(err);
  });
