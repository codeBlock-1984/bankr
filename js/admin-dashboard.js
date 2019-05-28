const profileTitle = document.querySelector('.profile__title');
const loader = document.getElementById('animated-loader');
const actionBox = document.querySelector('.trans-box');
const accountWrapper = document.querySelector('.account-wrapper');

loader.style.display = 'block';

profileTitle.innerHTML = '';
accountWrapper.innerHTML = '';
actionBox.innerHTML = '';

const noAccount = `<div class="no-record no-bot no-account">
                   <p>You don't have any accounts yet.
                   Want to quickly <a href="create-account.html">
                   create one</a>?
                   </p>
                   </div>`;

const noAction = `<div class="no-record no-top no-trans">
                       <p>No recent actions to display</p>
                       <div>`;

const authUser = JSON.parse(localStorage.getItem('authUser'));
const {
  firstName,
  lastName,
  email,
  id,
} = authUser;

profileTitle.innerHTML = `${firstName} ${lastName}`;

const token = localStorage.getItem('x-auth-token');
const getCashierUrl = `https://bankr-server.herokuapp.com/api/v1/users/${id}`;

console.log(token);
const options = {
  method: 'GET',
  headers: new Headers({
    'Content-Type': 'application/json',
    'x-auth-token': token,
  }),
};

// debugger;
fetch(getCashierUrl, options)
  .then(res => res.json())
  .then((res) => {
    // debugger;
    if (!res.error) {
      const { data } = res;

      if (data[0]) {
        // debugger;
        const cashier = data[0];
        accountWrapper.innerHTML = '';

        const { createdOn } = cashier;
        const createdOnDate = new Date(createdOn);
        createdOnDate.toString();
        const singleUser = `<div class="account-box user-box">
                          <span class="account-detail__title user-title">Full name</span>
                          <p class="account-detail user-detail account-type">${firstName} ${lastName}</p>
                          <span class="account-detail__title user-title">Role</span>
                          <p class="account-detail user-detail account-number">Staff</p>
                          <span class="account-detail__title user-title">Email</span>
                          <p class="account-detail user-detail">${email}</p>
                          <span class="account-detail__title user-title">Created on</span>
                          <p class="account-detail user-detail account-balance-desc">${createdOnDate}</p>
                        </div>`;

        accountWrapper.innerHTML = singleUser;

        const getActionsUrl = `https://bankr-server.herokuapp.com/api/v1/actions`;

        fetch(getActionsUrl, options)
          .then(response => response.json())
          .then((response) => {
            if (!response.error) {
              const { data: actionsData } = response;

              if (actionsData[0]) {
                const trimmedActions = actionsData.splice(0, 4);
                let singleAction;
                console.log(data[0]);
                actionBox.innerHTML = '';

                trimmedActions.forEach((action) => {
                  const {
                    type,
                    firstname,
                    lastname,
                    createdon: actionDate,
                    email: userEmail,
                  } = action;

                  const date = new Date(actionDate).toString().slice(0, 24);
                  console.log(date);
                  singleAction = `<div class="single-box">
                                        <p class="trans-detail trans-title">${type}</p>
                                        <p class="trans-detail trans-vendor sentence">${firstname} ${lastname}</p>
                                        <p class="trans-detail trans-amount lower">${userEmail}</p>
                                        <p class="trans-detail trans-date-time">${date}</p>
                                      </div>`;
                  actionBox.innerHTML += singleAction;
                });
              } else {
                actionBox.innerHTML = noAction;
              }
            } else {
              actionBox.innerHTML = noAction;
            }
            loader.style.display = 'none';
          })
          .catch((err) => {
            accountWrapper.style.flexDirection = 'row';
            accountWrapper.innerHTML = noAccount;
            actionBox.innerHTML = noAction;
            console.log(err);
          });
      } else {
        accountWrapper.style.flexDirection = 'row';
        accountWrapper.innerHTML = noAccount;
        actionBox.innerHTML = noAction;
      }
    } else {
      accountWrapper.style.flexDirection = 'row';
      accountWrapper.innerHTML = noAccount;
      actionBox.innerHTML = noAction;
    }
    loader.style.display = 'none';
  })
  .catch((err) => {
    console.log(err);
  });
