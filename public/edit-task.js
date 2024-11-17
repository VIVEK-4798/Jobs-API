document.addEventListener("DOMContentLoaded", () => {
  const companyInput = document.querySelector(".task-edit-company");
  const positionInput = document.querySelector(".task-edit-position");
  const dateInput = document.querySelector(".task-edit-application-date");
  const statusSelect = document.querySelector(".task-edit-status");
  const notesTextarea = document.querySelector(".task-edit-notes");
  const form = document.querySelector(".single-task-form");
  const alert = document.querySelector(".form-alert");
  const token = localStorage.getItem("token");
  const params = new URLSearchParams(window.location.search);
  const jobId = params.get("id");

  if (!token) {
    alert("Authentication token missing. Please log in.");
    return;
  }

  const fetchJobDetails = async () => {
    try {
      const { data } = await axios.get(`/api/v1/jobs/${jobId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const { company, position, applicationDate, status, notes } = data.job;

      if (companyInput) companyInput.value = company || "";
      if (positionInput) positionInput.value = position || "";
      if (dateInput) dateInput.value = applicationDate ? applicationDate.slice(0, 10) : "";
      if (statusSelect) statusSelect.value = status || "";
      if (notesTextarea) notesTextarea.value = notes || "";
    } catch (error) {
      console.error("Error fetching job details:", error);
      alert.textContent = "Failed to load task details. Please try again.";
      alert.style.display = "block";
    }
  };

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const updatedJob = {
      companyName: companyInput?.value || "",
      position: positionInput?.value || "",
      applicationDate: dateInput?.value || "",
      applicationStatus: statusSelect?.value || "",
      notes: notesTextarea?.value || "",
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
      alert.textContent = "Error updating job. Please try again.";
      alert.style.color = "red";
      alert.style.display = "block";
    }
  });

  fetchJobDetails();
});
