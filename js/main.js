document.addEventListener('DOMContentLoaded', function() {
    const enterBtn = document.getElementById('enterBtn');
    if (enterBtn) {
      enterBtn.addEventListener('click', function() {
        window.location.href = 'home.html';
      });
    }
  });


  const header = document.querySelector('.site-header');

  window.addEventListener('scroll', () => {
    if (window.pageYOffset <= 100) {
      header.classList.remove('hide');
    } else {
      header.classList.add('hide');
    }
  });


  document.addEventListener('contextmenu', function(event) {

    event.preventDefault();

});