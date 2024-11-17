const taskIDDOM = document.querySelector('.task-edit-id');
const taskNameDOM = document.querySelector('.task-edit-name');
const taskCompletedDOM = document.querySelector('.task-edit-completed');
const editFormDOM = document.querySelector('.single-task-form');
const editBtnDOM = document.querySelector('.task-edit-btn');
const formAlertDOM = document.querySelector('.form-alert');
const taskIDElement = document.querySelector(".task-edit-id");
const companyInput = document.querySelector('.task-edit-company');
const positionInput = document.querySelector('.task-edit-position');
const dateInput = document.querySelector('.task-edit-application-date');
const statusSelect = document.querySelector('.task-edit-status');
const notesTextarea = document.querySelector('.task-edit-notes');
const completedCheckbox = document.querySelector('.task-edit-completed');
const form = document.querySelector(".single-task-form");
const alert = document.querySelector(".form-alert");
const token = localStorage.getItem('token'); // Ensure token is stored

const params = new URLSearchParams(window.location.search);
const jobId = params.get("id");

// Fetch job details and populate the form
const fetchJobDetails = async () => {
  try {
    const { data } = await axios.get(`/api/v1/jobs/${jobId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    console.log(companyInput, positionInput, dateInput, statusSelect, notesTextarea, completedCheckbox);
    console.log(localStorage.getItem("token"));

    const { company, position, applicationDate, status, notes } = data.job;

    console.log(data); // Debugging: Log fetched data

    // Set the values for input fields (not placeholders)
    companyInput.value = company || "";
    positionInput.value = position || "";
    dateInput.value = applicationDate ? applicationDate.slice(0, 10) : "";
    statusSelect.value = status || "";
    notesTextarea.value = notes || "";
    taskIDElement.textContent = jobId;

    alert.style.display = "none"; // Hide error if data loads correctly
  } catch (error) {
    console.error(error);
    alert.textContent = "Failed to load task details. Please try again.";
    alert.style.display = "block";
  }
};


// Handle form submission
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const updatedJob = {
    companyName: companyInput?.value || '',
    position: positionInput?.value || '',
    applicationDate: dateInput?.value || '',
    applicationStatus: statusSelect?.value || '', 
    notes: notesTextarea?.value || '',
    completed: completedCheckbox?.checked || false,
  };
  
  console.log('Updated Job Payload:', updatedJob);
  

  try {
    await axios.patch(`/api/v1/jobs/${jobId}`, updatedJob, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    alert.textContent = "Job updated successfully!";
    alert.style.color = "green";
    alert.style.display = "block";
  } catch (error) {
    console.error(error);
    alert.textContent = "Error updating job.";
    alert.style.color = "red";
    alert.style.display = "block";
  }
});


fetchJobDetails();

// Extract task ID from URL
const taskID = new URLSearchParams(window.location.search).get('id');
console.log('Editing Job ID:', taskID);

let tempName; // Temporary storage for task name

// Fetch and display task details
const showTask = async () => {
  try {
    const response = await axios.get(`/api/v1/jobs/${taskID}`);
    const { _id, name, completed } = response.data.task;

    // Populate the form
    taskIDDOM.textContent = _id;
    taskNameDOM.value = name;
    tempName = name;
    taskCompletedDOM.checked = completed;
  } catch (error) {
    console.error('Error fetching task:', error);
    formAlertDOM.style.display = 'block';
    formAlertDOM.textContent = 'Failed to load task details. Please try again.';
    formAlertDOM.classList.add('text-danger');
  }
};

showTask();

// Handle form submission for editing task
editFormDOM.addEventListener('submit', async (e) => {
  e.preventDefault();
  editBtnDOM.textContent = 'Loading...';

  try {
    const updatedName = taskNameDOM.value;
    const updatedCompleted = taskCompletedDOM.checked;

    const response = await axios.patch(`/api/v1/jobs/${taskID}`, {
      name: updatedName,
      completed: updatedCompleted,
    });

    const { _id, name, completed } = response.data.task;

    // Update the form with new task data
    taskIDDOM.textContent = _id;
    taskNameDOM.value = name;
    tempName = name;
    taskCompletedDOM.checked = completed;

    formAlertDOM.style.display = 'block';
    formAlertDOM.textContent = 'Success, task updated!';
    formAlertDOM.classList.add('text-success');
  } catch (error) {
    console.error('Error updating task:', error);

    // Reset to previous name if error occurs
    taskNameDOM.value = tempName;
    formAlertDOM.style.display = 'block';
    formAlertDOM.textContent = 'Error updating task. Please try again.';
    formAlertDOM.classList.add('text-danger');
  } finally {
    editBtnDOM.textContent = 'Edit';
    setTimeout(() => {
      formAlertDOM.style.display = 'none';
      formAlertDOM.classList.remove('text-success', 'text-danger');
    }, 3000);
  }
});
