// debugger;
const userToken = localStorage.getItem('x-auth-token');

const clientPages = ['user-dashboard.html', 'accounts.html', 'transactions.html', 'create-account.html'];
const cashierPages = ['staff-dashboard.html', 'accounts-staff.html', 'credit-debit.html'];
const adminPages = ['admin-dashboard.html', 'accounts-admin.html', 'users.html', 'create-user.html'];

// console.log(window.location.pathname);
const pagePath = window.location.pathname;
let pageUrl;

if (window.location.protocol === 'file:') {
  pageUrl = pagePath.slice(49, pagePath.length);
} else {
  pageUrl = pagePath.slice(7, pagePath.length);
}

function checkAuth(token) {
  if (!token) {
    window.location.href = 'sign-in.html';
  } else {
    const currentUser = JSON.parse(localStorage.getItem('authUser'));
    const { type } = currentUser;

    if (type === 'client' && !(clientPages.find(page => page === pageUrl))) {
      window.location.href = 'sign-in.html';
    }
    if (type === 'cashier' && !(cashierPages.find(page => page === pageUrl))) {
      window.location.href = 'sign-in.html';
    }
    if (type === 'admin' && !(adminPages.find(page => page === pageUrl))) {
      window.location.href = 'sign-in.html';
    }
  }
}

checkAuth(userToken);
