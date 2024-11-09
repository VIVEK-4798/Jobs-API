document.getElementById('register-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
  
    try {
      await axios.post('/api/v1/auth/register', { username, password });
      window.location.href = 'login.html'; 
    } catch (error) {
      console.error('Registration failed', error);
    }
  });
  