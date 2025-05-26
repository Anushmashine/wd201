document.addEventListener("DOMContentLoaded", () => {
  // Toggle completion
  document.querySelectorAll(".Todo-Item").forEach(checkbox => {
    checkbox.addEventListener("change", async (e) => {
      const todoId = e.target.id.split("-")[1];
      const completed = e.target.checked;

      try {
        const res = await fetch(`/todos/${todoId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "CSRF-Token": getCookie("csrfToken") || "", // Adjust as per your CSRF setup
          },
          body: JSON.stringify({ completed }),
        });

        if (!res.ok) {
          alert("Failed to update todo status");
          e.target.checked = !completed;
        } else {
          window.location.reload(); // Refresh UI on success
        }
      } catch (err) {
        alert("Error updating todo status");
        e.target.checked = !completed;
      }
    });
  });

  // Delete todo
  document.querySelectorAll(".delete-btn").forEach(button => {
    button.addEventListener("click", async (e) => {
      const id = e.target.dataset.id;
      if (!confirm("Are you sure you want to delete this todo?")) return;

      try {
        const res = await fetch(`/todos/${id}`, {
          method: "DELETE",
          headers: {
            "CSRF-Token": getCookie("csrfToken") || "",
          },
        });

        if (res.ok) {
          window.location.reload();
        } else {
          alert("Failed to delete todo");
        }
      } catch (err) {
        alert("Error deleting todo");
      }
    });
  });
});

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
}
