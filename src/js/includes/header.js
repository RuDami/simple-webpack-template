document.addEventListener('DOMContentLoaded', () => {
  const mobileMenuContent = document.querySelector('.wrapper-mobile-menu-content')
  const mobileMenuOpen = document.querySelector('.wrapper-mobile-menu-icon')
  const mobileMenuClose = document.querySelector('.wrapper-mobile-menu-content-icon')

  if (mobileMenuOpen && mobileMenuContent) {
    mobileMenuOpen.addEventListener('click', () => {
      mobileMenuContent.classList.add('open')
      document.body.style.overflow = 'hidden'
    })
  }
  if (mobileMenuClose && mobileMenuContent) {
    mobileMenuClose.addEventListener('click', () => {
      mobileMenuContent.classList.remove('open')
      document.body.style.overflow = 'auto'
    })
  }
})
