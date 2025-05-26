document.addEventListener("DOMContentLoaded", () => {
  // Toggle completion status
  document.querySelectorAll(".Todo-Item").forEach(checkbox => {
    checkbox.addEventListener("change", async (e) => {
      const todoId = e.target.id.split("-")[1];
      const completed = e.target.checked;

      try {
        const response = await fetch(`/todos/${todoId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "CSRF-Token": getCookie("csrfToken"), // adjust if needed
          },
          body: JSON.stringify({ completed }),
        });

        if (!response.ok) {
          alert("Failed to update todo status");
          e.target.checked = !completed; // revert on failure
        }
      } catch (error) {
        alert("Error updating todo status");
        e.target.checked = !completed;
      }
    });
  });

  // Delete todo button
  document.querySelectorAll(".delete-btn").forEach(button => {
    button.addEventListener("click", async (e) => {
      const id = e.target.dataset.id;
      if (!confirm("Are you sure you want to delete this todo?")) return;

      try {
        const response = await fetch(`/todos/${id}`, {
          method: "DELETE",
          headers: {
            "CSRF-Token": getCookie("csrfToken"),
          }
        });

        if (response.ok) {
          window.location.reload();
        } else {
          alert("Failed to delete todo");
        }
      } catch (error) {
        alert("Error deleting todo");
      }
    });
  });
});

// Helper function to get cookie by name
function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
}
