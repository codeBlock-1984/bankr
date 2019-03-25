const mobileMenuLink = document.getElementById('mobile-menu-link');

mobileMenuLink.addEventListener('click', showMobileMenu);

function showMobileMenu() {
  const mobileMenu = document.getElementById('mobile-menu');

  if (mobileMenu.style.height === "400px") {
    mobileMenu.style.height = "0px";
  } else {
    mobileMenu.style.height = "400px";
  }
}
