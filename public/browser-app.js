const jobsDOM = document.querySelector('.tasks');
const loadingDOM = document.querySelector('.loading-text');
const formDOM = document.querySelector('.task-form'); 
const companyInputDOM = document.querySelector('.task-input[name="company"]');
const positionInputDOM = document.querySelector('.task-input[name="position"]');
const dateInputDOM = document.querySelector('.task-input[name="applicationDate"]');
const statusInputDOM = document.querySelector('.task-input[name="status"]');
const notesInputDOM = document.querySelector('.task-input[name="notes"]'); 
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

    const allJobs = jobs
      .map((job) => {
        const { completed, _id: jobID, company, position, applicationDate, status, notes } = job;
        const formattedDate = new Date(applicationDate).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        });
        return `
        <div class="single-job ${completed ? 'job-completed' : ''}">
        <h5>${company}</h5>
        <p><strong>Position:</strong> ${position}</p>
        <p><strong>Application Date:</strong> ${formattedDate}</p>
        <p><strong>Status:</strong> ${status}</p>
        <p><strong>Notes:</strong> ${notes}</p>
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
        <hr class="job-divider" />
      </div>`;
      })
      .join('');

    jobsDOM.innerHTML = allJobs;
  } catch (error) {
    console.error('Error fetching jobs:', error); 
    jobsDOM.innerHTML = '<h5 class="empty-list">There was an error, please try later....</h5>';
  }

  loadingDOM.style.visibility = 'hidden';
};

const authToken = localStorage.getItem('token');
if (!authToken || isSessionExpired()) {
  clearSession();
} else {
  // Update session start time on valid activity
  localStorage.setItem('sessionStartTime', new Date().getTime());
  console.log('Session valid. Proceeding...');
  axios.defaults.headers.common['Authorization'] = `Bearer ${authToken}`;
  showJobs(); 
}

// Event listener for deleting a job
jobsDOM.addEventListener('click', async (e) => {
  const el = e.target;

  if (el.parentElement.classList.contains('delete-btn')) {
    loadingDOM.style.visibility = 'visible';
    const id = el.parentElement.dataset.id; // Get the job ID
    console.log('Deleting job with ID:', id);

    try {
      // Send DELETE request to the backend
      await axios.delete(`/api/v1/jobs/${id}`);
      
      // Refresh the job list after deletion
      showJobs();
    } catch (error) {
      console.error('Error deleting job:', error);
    }

    // Hide the loading spinner
    loadingDOM.style.visibility = 'hidden';
  }
});


// Event listener for form submission
formDOM.addEventListener('submit', async (e) => {
  e.preventDefault();

  const company = companyInputDOM.value;
  const position = positionInputDOM.value;
  const applicationDate = dateInputDOM.value;
  const status = statusInputDOM.value;
  const notes = notesInputDOM.value;

  console.log('Form submitted with job details:', { company, position, applicationDate, status, notes });

  try {
    await axios.post('/api/v1/jobs', { company, position, applicationDate, status, notes });
    showJobs(); 
    companyInputDOM.value = ''; 
    positionInputDOM.value = ''; 
    dateInputDOM.value = ''; 
    statusInputDOM.value = '';
    notesInputDOM.value = ''; 
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
