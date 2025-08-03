document.addEventListener('DOMContentLoaded', () => {
        fetch('header.html')
        .then(res => res.text())
        .then(data => {
          document.getElementById('header-holder').innerHTML = data;
        });
      });
