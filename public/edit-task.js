const taskIDDOM = document.querySelector('.task-edit-id');
const taskNameDOM = document.querySelector('.task-edit-name');
const taskCompletedDOM = document.querySelector('.task-edit-completed');
const editFormDOM = document.querySelector('.single-task-form');
const editBtnDOM = document.querySelector('.task-edit-btn');
const formAlertDOM = document.querySelector('.form-alert');
const taskIDElement = document.querySelector(".task-edit-id");
const companyInput = document.querySelector(".task-edit-company");
const positionInput = document.querySelector(".task-edit-position");
const dateInput = document.querySelector(".task-edit-application-date");
const statusSelect = document.querySelector(".task-edit-status");
const notesTextarea = document.querySelector(".task-edit-notes");
const form = document.querySelector(".single-task-form");
const alert = document.querySelector(".form-alert");

const params = new URLSearchParams(window.location.search);
const jobId = params.get("id");

// Fetch job details and populate the form
const fetchJobDetails = async () => {
  try {
    const { data } = await axios.get(`/api/v1/jobs/${jobId}`);
    const { company, position, applicationDate, status, notes } = data.job;

    console.log(data);

    taskIDElement.textContent = jobId;
    companyInput.value = company;
    positionInput.value = position;
    dateInput.value = applicationDate ? applicationDate.slice(0, 10) : ""; // Format date
    statusSelect.value = status;
    notesTextarea.value = notes;
  } catch (error) {
    console.error(error);
    alert.textContent = "Error fetching job details.";
    alert.style.display = "block";
  }
};

// Handle form submission
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  try {
    const updatedJob = {
      company: companyInput.value,
      position: positionInput.value,
      applicationDate: dateInput.value,
      status: statusSelect.value,
      notes: notesTextarea.value,
    };

    await axios.patch(`/api/v1/jobs/${jobId}`, updatedJob);
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
