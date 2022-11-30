document.addEventListener("DOMContentLoaded", function() {
  const tabs = document.querySelectorAll('[role="tab"]')
  const panels = document.querySelectorAll('[role="tabpanel"]')

   const toggleActiveTab = (e) => {
    tabs.forEach((tab) => {
      tab.classList.remove('active')
    })
    e.target.classList.add('active')
    if(e.target.id==='engineering-tab') {
      panels[0].classList.remove('is-hidden')
      panels[1].classList.add('is-hidden')
    }
    else if(e.target.id==='diving-tab') {
      panels[1].classList.remove('is-hidden')
      panels[0].classList.add('is-hidden')
    }
  }

  if(tabs && panels) {
    tabs.forEach((tab) => {
      tab.addEventListener('click', toggleActiveTab)
    })
  }
});
