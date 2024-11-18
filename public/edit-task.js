document.addEventListener("DOMContentLoaded", () => {
  const taskIDElement = document.querySelector(".task-edit-id");
  const companyInput = document.querySelector(".task-edit-company");
  const positionInput = document.querySelector(".task-edit-position");
  const dateInput = document.querySelector(".task-edit-application-date");
  const statusSelect = document.querySelector(".task-edit-status");
  const notesTextarea = document.querySelector(".task-edit-notes");
  const form = document.querySelector(".single-task-form");
  const alert = document.querySelector(".form-alert");
  const token = localStorage.getItem("token"); // Ensure the token is saved in localStorage

  const params = new URLSearchParams(window.location.search);
  const jobId = params.get("id");

  // Fetch job details
  const fetchJobDetails = async () => {
    try {
      const { data } = await axios.get(`/api/v1/jobs/${jobId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const { company, position, applicationDate, applicationStatus, notes } = data.job;

      companyInput.value = company || "";
      positionInput.value = position || "";
      dateInput.value = applicationDate ? applicationDate.slice(0, 10) : "";
      statusSelect.value = applicationStatus || "Pending";
      notesTextarea.value = notes || "";
      // taskIDElement.textContent = jobId;
    } catch (error) {
      console.error("Error fetching job details:", error);
      alert.textContent = "Failed to load job details. Please check your authentication.";
      alert.style.display = "block";
    }
  };

  // Handle form submission
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const updatedJob = {
      companyName: companyInput.value.trim(),
      position: positionInput.value.trim(),
      applicationDate: dateInput.value,
      applicationStatus: statusSelect.value,
      notes: notesTextarea.value.trim(),
    };

    try {
      await axios.patch(`/api/v1/jobs/${jobId}`, updatedJob, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert.textContent = "Job updated successfully!";
      alert.style.color = "green";
      alert.style.display = "block";
    } catch (error) {
      console.error("Error updating job:", error);
      alert.textContent = "Error updating job. Ensure all fields are valid.";
      alert.style.color = "red";
      alert.style.display = "block";
    }
  });

  fetchJobDetails();
});
