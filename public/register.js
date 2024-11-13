document.getElementById('register-form').addEventListener('submit', async (e) => {
  e.preventDefault();

  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const errorMessage = document.getElementById('error-message') || document.createElement('p');
  errorMessage.id = 'error-message';
  errorMessage.style.color = 'red';

  try {
    const response = await axios.post('/api/v1/auth/register', { name, email, password });
    console.log('Registration successful:', response.data);

    window.location.href = './login.html'; // Redirect to login on success
  } catch (error) {
    console.error('Registration failed:', error);

    if (error.response && error.response.status === 409) {
      errorMessage.textContent = 'User already exists. Please log in.';
    } else {
      errorMessage.textContent = 'Registration failed. Please try again later.';
    }

    const formContainer = document.querySelector('.form-container');
    if (!document.getElementById('error-message')) {
      formContainer.appendChild(errorMessage);
    }
  }
});
