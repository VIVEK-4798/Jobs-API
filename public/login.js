document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
  
    try {
      const response = await axios.post('/api/v1/auth/login', { username, password });
      const { token } = response.data;
      localStorage.setItem('authToken', token); 
      window.location.href = 'index.html'; 
    } catch (error) {
      console.error('Login failed', error);
    }
  });
  