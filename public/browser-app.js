const jobsDOM = document.querySelector('.tasks');
const loadingDOM = document.querySelector('.loading-text');
const formDOM = document.querySelector('.job-form');
const jobInputDOM = document.querySelector('.job-input');
const formAlertDOM = document.querySelector('.form-alert');

// Timeout duration (in milliseconds)
const SESSION_TIMEOUT = 30 * 60 * 1000; // Example: 30 minutes

// Function to check session timeout
const isSessionExpired = () => {
  const sessionStartTime = localStorage.getItem('sessionStartTime');
  if (!sessionStartTime) return true;

  const currentTime = new Date().getTime();
  return currentTime - sessionStartTime > SESSION_TIMEOUT;
};

// Function to clear session
const clearSession = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('sessionStartTime');
  console.log('Session expired. Redirecting to login page.');
  window.location.href = './login.html'; // Redirect to login
};

// Function to load jobs from /api/v1/jobs
const showJobs = async () => {
  console.log('Attempting to load jobs...');
  loadingDOM.style.visibility = 'visible';
  
  try {
    const response = await axios.get('/api/v1/jobs');
    console.log('Jobs response:', response);

    const { jobs } = response.data;
    if (!jobs || jobs.length < 1) {
      jobsDOM.innerHTML = '<h5 class="empty-list">No jobs in your list</h5>';
      loadingDOM.style.visibility = 'hidden';
      return;
    }

    // Generate HTML for jobs
    const allJobs = jobs
      .map((job) => {
        const { completed, _id: jobID, name } = job;
        return `
          <div class="single-job ${completed ? 'job-completed' : ''}">
            <h5>${name}</h5>
            <div class="job-links">
              <!-- Edit Button -->
              <a href="job.html?id=${jobID}" class="edit-link">
                <i class="fas fa-edit"></i>
              </a>
              <!-- Delete Button -->
              <button type="button" class="delete-btn" data-id="${jobID}">
                <i class="fas fa-trash"></i>
              </button>
            </div>
          </div>`;
      })
      .join('');

    // Insert the jobs into the DOM
    jobsDOM.innerHTML = allJobs;
  } catch (error) {
    console.error('Error fetching jobs:', error); // Log error details
    jobsDOM.innerHTML = '<h5 class="empty-list">There was an error, please try later....</h5>';
  }

  // Hide loading spinner
  loadingDOM.style.visibility = 'hidden';
};


// Check if user is authenticated and session is valid
const authToken = localStorage.getItem('token');
if (!authToken || isSessionExpired()) {
  clearSession();
} else {
  // Update session start time on valid activity
  localStorage.setItem('sessionStartTime', new Date().getTime());
  console.log('Session valid. Proceeding...');
  axios.defaults.headers.common['Authorization'] = `Bearer ${authToken}`;
  showJobs(); // Load jobs
}




// Event listener for deleting a job
jobsDOM.addEventListener('click', async (e) => {
  const el = e.target;
  if (el.parentElement.classList.contains('delete-btn')) {
    loadingDOM.style.visibility = 'visible';
    const id = el.parentElement.dataset.id;
    console.log('Deleting job with ID:', id);
    try {
      await axios.delete(`/api/v1/jobs/${id}`);
      showJobs(); // Reload jobs after deletion
    } catch (error) {
      console.error('Error deleting job:', error);
    }
    loadingDOM.style.visibility = 'hidden';
  }
});

// Event listener for form submission
formDOM.addEventListener('submit', async (e) => {
  e.preventDefault();
  const name = jobInputDOM.value;
  console.log('Form submitted with job name:', name);

  try {
    await axios.post('/api/v1/jobs', { name });
    showJobs(); // Reload jobs after adding a new one
    jobInputDOM.value = ''; // Clear input field
    formAlertDOM.style.display = 'block';
    formAlertDOM.textContent = `Success, job added!`;
    formAlertDOM.classList.add('text-success');
  } catch (error) {
    console.error('Error adding job:', error);
    formAlertDOM.style.display = 'block';
    formAlertDOM.textContent = `Error, please try again.`;
  }

  setTimeout(() => {
    formAlertDOM.style.display = 'none';
    formAlertDOM.classList.remove('text-success');
  }, 3000);
});
