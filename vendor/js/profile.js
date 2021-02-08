document.addEventListener('DOMContentLoaded', () => {
  const profileBtnClass = 'navbar__profile';
  const profileBtn = document.querySelector(`.${profileBtnClass}`);

  profileBtn.onclick = () => {
    const profileMenuClass = 'profile-menu';
    const profileMenu = document.querySelector(`.${profileMenuClass}`);
    const contentContainer = document.querySelector('.main');

    profileMenu.classList.toggle(`${profileMenuClass}--opened`);
    profileBtn.classList.toggle(`${profileBtnClass}--opened`);
    contentContainer.classList.toggle('menu-opened');
  };
});
