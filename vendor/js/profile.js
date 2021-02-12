document.addEventListener('DOMContentLoaded', () => {
  const profileBtn = document.querySelector('.navbar__profile');
  const DeleteUserBtn = document.querySelector('.profile-menu__delete');

  const deleteUser = () => {
    if (!confirm('Are u sure? Your urls will keep working')) return false;

    return fetch('/user', { method: 'DELETE' })
      .then(async (res) => {
        if (res.status === 200) {
          window.location.pathname = '/';
          return true;
        }

        // Return error
        throw new Error(await res.json());
      })
      .catch(console.error);
  };

  DeleteUserBtn.onclick = () => deleteUser();

  profileBtn.onclick = () => {
    const profileMenu = document.querySelector('.profile-menu');
    const contentContainer = document.querySelector('.main');

    profileMenu.classList.toggle('opened');
    profileBtn.classList.toggle('opened');
    contentContainer.classList.toggle('menu-opened');
  };
});
