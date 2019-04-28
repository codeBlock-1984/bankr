const brandModal = document.getElementById('trans-view-box');
const brandModalMain = document.querySelector('.brand-modal-main');
const brandModalTitle = document.querySelector('.brand-modal-title');
const mobileScreen = window.matchMedia('(max-width: 480px)');
// const viewIconHead = document.querySelector('.trans-tb-balance-head');
// const viewIconCells = document.querySelectorAll('.trans-tb-balance');
const viewIconBtns = document.querySelectorAll('.view-trans-btn');


// debugger;
displayViewIcons(mobileScreen);
mobileScreen.addListener(displayViewIcons);

// Define callback functions
function displayViewIcons(screen) {
  if (screen.matches) {
    viewIconBtns.forEach((icon) => {
      icon.addEventListener('click', displayModal);
    });
  }
}

function displayModal() {
  const row = this.parentElement.parentElement;
  const cells = row.children;
  const date = cells[0].innerHTML;
  const description = cells[1].innerHTML;
  const merchant = cells[2].innerHTML;
  const type = cells[3].innerHTML;
  const amount = cells[4].innerHTML;
  const balance = cells[5].innerHTML;

  const trans = `<p>Date:&nbsp;&nbsp;${date}</p><br>
                  <p>Merchant:&nbsp;&nbsp;${merchant}</p><br>
                  <p>Type:&nbsp;&nbsp;${type}</p><br>
                  <p>Amount:&nbsp;&nbsp;${amount}</p><br>
                  <p>Balance:&nbsp;&nbsp;${balance}</p><br>`;

  brandModalTitle.innerHTML = description;
  brandModalMain.innerHTML = trans;
  activeModal = brandModal;
  brandModal.style.display = 'block';
}
