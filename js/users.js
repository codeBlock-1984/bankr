const profileTitle = document.querySelector('.profile__title');
const loader = document.getElementById('animated-loader');
const usersTable = document.querySelector('.users-table');
let allUsers;

loader.style.display = 'block';

profileTitle.innerHTML = '';
// usersTable.innerHTML = '';

const noUser = `<div class="detail-table__row">
                  <p>
                    No account records to display
                  </p>
                </div>`;


const authUser = JSON.parse(localStorage.getItem('authUser'));
const {
  firstName,
  lastName,
} = authUser;

profileTitle.innerHTML = `${firstName} ${lastName}`;

const token = localStorage.getItem('x-auth-token');
const getUsersUrl = `https://bankr-server.herokuapp.com/api/v1/users`;

console.log(token);
const options = {
  method: 'GET',
  headers: new Headers({
    'Content-Type': 'application/json',
    'x-auth-token': token,
  }),
};

// debugger;
fetch(getUsersUrl, options)
  .then(res => res.json())
  .then((res) => {
    // debugger;
    if (!res.error) {
      const { data } = res;

      if (data[0]) {
        // debugger;
        allUsers = data;
        let singleUser;
        let serialNumber = 1;
        // detailTable.innerHTML = '';

        allUsers.forEach((account) => {
          const {
            email,
            firstname,
            lastname,
            type,
          } = account;

          singleUser = `<div class="detail-table__row">
                            <div class="detail-table__cell">${serialNumber}</div>
                            <div class="detail-table__cell">${firstname} ${lastname}</div>
                            <div class="detail-table__cell">${email}</div>
                            <div class="detail-table__cell">${type}</div>        
                            <div class="detail-table__cell action-cell">
                              <i class="fas fa-eye action-icon view-user-btn"></i>
                              <i class="fas fa-trash-alt action-icon del-user-btn"></i>
                            </div>
                          </div>`;

          serialNumber += 1;
          usersTable.innerHTML += singleUser;
        });

        const delUserBtns = document.querySelectorAll('.del-user-btn');
        const viewUserBtns = document.querySelectorAll('.view-user-btn');

        delUserBtns.forEach((delUserBtn) => {
          delUserBtn.addEventListener('click', displayModal);
          delUserBtn.addEventListener('mouseover', displayTooltip);
          delUserBtn.addEventListener('mouseout', hideTooltip);
        });

        viewUserBtns.forEach((viewUserBtn) => {
          viewUserBtn.addEventListener('click', displayUserModal);
          viewUserBtn.addEventListener('mouseover', displayTooltip);
          viewUserBtn.addEventListener('mouseout', hideTooltip);
        });
      } else {
        loader.style.display = 'none';
        usersTable.innerHTML += noUser;
      }
    } else {
      loader.style.display = 'none';
      usersTable.innerHTML += noUser;
    }
    loader.style.display = 'none';
  })
  .catch((err) => {
    loader.style.display = 'none';
    console.log(err);
  });


//

// --- Users -----
const brandModal = document.getElementById('del-confirm-dialog');
const userViewModal = document.getElementById('user-view-modal');
const userViewModalTitle = document.getElementById('user-view-modal__title');
const userViewModalMain = document.getElementById('user-view-modal__main');
const deleteAccountBtn = document.getElementsByClassName('delete-account-btn')[0];

deleteAccountBtn.addEventListener('click', deleteAccount);

function displayModal() {
  activeModal = brandModal;
  brandModal.style.display = 'block';
}

function displayUserModal() {
  // debugger;
  const row = this.parentElement.parentElement;
  const cells = row.children;
  const userIndex = parseInt(cells[0].innerHTML) - 1;
  const user = allUsers[userIndex];

  const {
    firstname,
    lastname,
    email,
    type,
    createdon,
  } = user;

  const date = new Date(createdon).toString().slice(0, 15);

  const singleUser = `
                <div class="single-user-table-wrapper">
                  <div class="account-image-box user-image-box">
                    <img class="account-image user-image" src="http://i.pravatar.cc/150?img=64" alt="Auwal Mohammed">
                  </div>
                  <div class="single-user-table">
                    <div class="detail-table__row single-account-row">
                      <div class="detail-table__head single-detail">Email :</div>
                      <div class="detail-table__cell single-detail__value">${email}</div>
                    </div>
                    <div class="detail-table__row single-account-row">
                      <div class="detail-table__head single-detail">Role :</div>
                      <div class="detail-table__cell single-detail__value">${type}</div>
                    </div>
                    <div class="detail-table__row single-account-row">
                      <div class="detail-table__head single-detail">Created :</div>
                      <div class="detail-table__cell single-detail__value">${date}</div>
                    </div>
                  </div>
                </div>`;

  activeModal = userViewModal;
  userViewModalTitle.innerHTML = `${firstname} ${lastname}`;
  userViewModalMain.innerHTML = singleUser;
  userViewModal.style.display = 'block';
}

function deleteAccount() {
  const accountsTable = this.parentNode.parentNode.parentNode;
  const selectedRow = this.parentNode.parentNode;
  accountsTable.removeChild(selectedRow);
}


const activateUserBtns = document.querySelectorAll('.activate-user-btn');
const deactivateUserBtns = document.querySelectorAll('.deactivate-user-btn');

activateUserBtns.forEach((activateUserBtn) => {
  activateUserBtn.addEventListener('click', activateUser);
});
deactivateUserBtns.forEach((deactivateUserBtn) => {
  deactivateUserBtn.addEventListener('click', deactivateUser);
});

function activateUser() {
  const isActiveCell = this.parentNode.parentNode.childNodes[7];
  isActiveCell.innerHTML = 'Yes';
  this.classList.remove('fa-toggle-off');
  this.classList.remove('activate-user-btn');
  this.classList.add('fa-toggle-on');
  this.classList.add('deactivate-user-btn');
  this.removeEventListener('click', activateUser);
  this.addEventListener('click', deactivateUser);
}
function deactivateUser() {
  const isActiveCell = this.parentNode.parentNode.childNodes[7];
  isActiveCell.innerHTML = 'No';
  this.classList.remove('fa-toggle-on');
  this.classList.remove('deactivate-user-btn');
  this.classList.add('fa-toggle-off');
  this.classList.add('activate-user-btn');
  this.removeEventListener('click', deactivateUser);
  this.addEventListener('click', activateUser);
}

function displayTooltip() {
  // debugger;
  if (this.classList.contains('del-user-btn')) {
    // console.log(this);
    this.innerHTML = `<span class="action-icon-hint" id="tool-tip">delete user</span>`;
  } else if (this.classList.contains('view-user-btn')) {
    this.innerHTML = `<span class="action-icon-hint" id="tool-tip">view user</span>`;
  }
}
function hideTooltip() {
  this.innerHTML = '';
}
