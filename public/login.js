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
    console.log('Response:', data); 

    if (response.ok && data.token) {
        localStorage.setItem('token', data.token); 
        window.location.href = './index.html'; 
    } else {
        console.log('Login failed:', data.error);
        errorMessage.textContent = data.error || 'Login failed. Please try again.';
    }
} catch (error) {
    console.error('Fetch error:', error);
    errorMessage.textContent = 'An error occurred. Please try again later.';
}

});
