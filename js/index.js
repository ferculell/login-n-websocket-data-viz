document.addEventListener('DOMContentLoaded', function() {
    let elems = document.querySelectorAll('.modal');
    let instances = M.Modal.init(elems);
});

const user = {username: 'Admin', password: 'admin'};  // Hardcoded authorized user
const btnLogin = document.querySelector('#login');
const btnReset = document.querySelector('#reset');
const url = './login';

const resetPass = () => {
  if (document.querySelector('#email').validity.valid) {
    document.querySelector('#modal1').innerHTML = `
    <div class="modal-content blue-grey darken-2">
        <h4 class="white-text">Reset Password</h4>
        <p class="grey-text text-lighten-2">The reset link have been sent to <b>${document.querySelector('#email').value}</b></p>
        <p class="grey-text text-lighten-2">Please check your inbox and follow the provided instructions.</p>
    </div>
    <div class="modal-footer blue-grey darken-2">
    <a href="#!" class="modal-close btn waves-effect waves-light blue-grey">Close</a>
    </div>
    `;
  }
}

const login = (username, password) => {
  const data = {username: username,
                password: password};
              
  // This POST request requires an appropriate backend implementation
  fetch(url, {
      method: 'POST',
      body: JSON.stringify(data),
      headers:{
        'Content-Type': 'application/json'
      }
    }).then(res => res.json())
    .catch(error => console.error('Error:', error))
    .then(response => {
      window.location.href = './success.html';
      console.log('Success:', response);
    });

  // Using Storage to simulate an authorized login
  sessionStorage.setItem('authorizedUser', true);
};


btnReset.addEventListener('click', resetPass);

btnLogin.addEventListener('click', (event) => {
  event.preventDefault();
  let username = document.querySelector('#username').value;
  let password = document.querySelector('#password').value;
  
  // This validation should be performed on the server
  if (user.username === username && user.password === password) {
    login(username, password);
  } else {
    document.querySelector('#error-message').innerText = 'Wrong username and/or password';
  }
});