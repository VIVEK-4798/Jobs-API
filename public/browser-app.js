const jobsDOM = document.querySelector('.jobs');
const loadingDOM = document.querySelector('.loading-text');
const formDOM = document.querySelector('.job-form');
const jobInputDOM = document.querySelector('.job-input');
const formAlertDOM = document.querySelector('.form-alert');

// Check for authentication and set the Authorization header if token is present
const authToken = localStorage.getItem('token');

if (!authToken) {
  console.log('No authToken found, redirecting to login page.');
  window.location.href = './login.html'; // Redirect to login if not authenticated
} else {
  console.log('Auth token found:', authToken);
  axios.defaults.headers.common['Authorization'] = `Bearer ${authToken}`;
  showJobs(); // Load jobs if authenticated
}

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

    const allJobs = jobs
      .map((job) => {
        const { completed, _id: jobID, name } = job;
        return `<div class="single-job ${completed && 'job-completed'}">
          <h5><span><i class="far fa-check-circle"></i></span>${name}</h5>
          <div class="job-links">
            <a href="job.html?id=${jobID}" class="edit-link">
              <i class="fas fa-edit"></i>
            </a>
            <button type="button" class="delete-btn" data-id="${jobID}">
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </div>`;
      })
      .join('');
    jobsDOM.innerHTML = allJobs;
  } catch (error) {
    console.error('Error fetching jobs:', error); // Detailed error logging
    jobsDOM.innerHTML = '<h5 class="empty-list">There was an error, please try later....</h5>';
  }
  loadingDOM.style.visibility = 'hidden';
};

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
