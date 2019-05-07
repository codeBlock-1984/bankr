const profileTitle = document.querySelector('.profile__title');
const loader = document.getElementById('animated-loader');
const accountWrapper = document.querySelector('.account-wrapper');

loader.style.display = 'block';

profileTitle.innerHTML = '';
accountWrapper.innerHTML = '';

const noAccount = `<div class="no-record no-bot no-account">
                   <p>You don't have any accounts yet.
                   Want to quickly <a href="create-account.html">
                   create one</a>?
                   </p>
                   </div>`;

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
            status,
            createdon,
            accountnumber,
          } = account;

          const createdOnDate = new Date(createdon);
          const createdDate = createdOnDate.toString().slice(-61, -36);

          singleAccount = `<div class="account-box big-box">
                            <span class="account-detail__title">Account name</span>
                            <p class="account-detail account-name">${firstName} ${lastName}</p>
                            <span class="account-detail__title">Email</span>
                            <p class="account-detail account-email">${email}</p>
                            <span class="account-detail__title">Account type</span>
                            <p class="account-detail account-type">${type} Account</p>
                            <span class="account-detail__title">Account number</span>
                            <p class="account-detail account-number">A/C &nbsp;&nbsp; ${accountnumber}</p>
                            <span class="account-detail__title">Status</span>
                            <p class="account-detail account-status">${status}</p>
                            <span class="account-detail__title">Date created</span>
                            <p class="account-detail account-created-on">${createdDate}</p>
                            <span class="account-detail account-card"><img src="imgs/verve-logo.png" class="card-logo" alt="verve logo"> &nbsp;&nbsp;&nbsp;&nbsp;** 4355 8603</span>
                            <p class="account-detail account-balance account-red">${balance} &nbsp;ngn</p>
                            <p class="account-detail account-balance-desc">(Current balance)</p>
                            <a class="action-btn view-transactions-link" href="pages/transactions/1/transactions.html">view transactions</a>
                          </div>`;

          accountWrapper.innerHTML += singleAccount;
        });
      } else {
        accountWrapper.style.flexDirection = 'row';
        accountWrapper.innerHTML = noAccount;
      }
    } else {
      accountWrapper.style.flexDirection = 'row';
      accountWrapper.innerHTML = noAccount;
    }
    loader.style.display = 'none';
  })
  .catch((err) => {
    console.log(err);
  });
