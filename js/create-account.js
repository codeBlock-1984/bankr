const profileTitle = document.querySelector('.profile__title');
const loader = document.getElementById('animated-loader');
const selectType = document.getElementById('type');
const createAccountBtn = document.getElementById('create-account-button');
const newAccountBox = document.querySelector('.new-account-box');

loader.style.display = 'block';
profileTitle.innerHTML = '';

const authUser = JSON.parse(localStorage.getItem('authUser'));
const { firstName, lastName } = authUser;
profileTitle.innerHTML = `${firstName} ${lastName}`;

loader.style.display = 'none';

const token = localStorage.getItem('x-auth-token');
const createAccountUrl = `https://bankr-server.herokuapp.com/api/v1/accounts`;

createAccountBtn.addEventListener('click', createAccount);

function createAccount() {
  loader.style.display = 'block';
  const accountType = selectType.options[selectType.selectedIndex].value;
  const newAccountData = { type: accountType };

  console.log(token);
  const options = {
    method: 'POST',
    headers: new Headers({
      'Content-Type': 'application/json',
      'x-auth-token': token,
    }),
    body: JSON.stringify(newAccountData)
  };

  // debugger;
  fetch(createAccountUrl, options)
    .then(res => res.json())
    .then((res) => {
      // debugger;
      if (!res.error) {
        const { data, message } = res;

        if (data[0]) {
          // debugger;
          const newAccount = data[0];
          console.log(newAccount[0], 'new');

          const {
            type,
            openingBalance,
            accountNumber,
          } = newAccount;
          const newUserAccount = `<div class="account-box new-account-box__inner">
                            <p class="success-msg">${message}</p>
                            <br>
                            <span class="account-detail__title">Account type</span>
                            <p class="account-detail account-type">${type}</p>
                            <span class="account-detail__title">Account number</span>
                            <p class="account-detail account-number">A/C &nbsp;&nbsp; ${accountNumber}</p>
                            <span class="account-detail__title">Opening balance</span>
                            <p class="account-detail account-number account-red">${openingBalance} &nbsp;ngn</p>
                          </div>`;

          newAccountBox.innerHTML = newUserAccount;
        } else {
          loader.style.display = 'none';
          console.log('Unable to create account');
        }
      } else {
        loader.style.display = 'none';
        console.log(res.error);
      }
      loader.style.display = 'none';
    })
    .catch((err) => {
      loader.style.display = 'none';
      console.log(err);
    });
}
