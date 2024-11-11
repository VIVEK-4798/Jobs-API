document.getElementById('login-form').addEventListener('submit', async (event) => {
  event.preventDefault();

  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const errorMessage = document.getElementById('error-message');

  try {
      const response = await fetch('/api/v1/auth/login', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (response.ok) {
          // If login is successful, redirect to index.html
          localStorage.setItem('token', data.token); // Store JWT in localStorage if needed
          window.location.href = './index.html';
      } else {
          // If login fails, display an error message
          errorMessage.textContent = data.error || 'Login failed. Please try again.';
      }
  } catch (error) {
      console.error('Error:', error);
      errorMessage.textContent = 'An error occurred. Please try again later.';
  }
});
