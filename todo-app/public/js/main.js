// public/js/main.js
document.addEventListener("DOMContentLoaded", () => {
  const csrfToken = document.querySelector('input[name="_csrf"]').value;

  // Toggle completion status
  document.querySelectorAll('input[type="checkbox"][data-id]').forEach((checkbox) => {
    checkbox.addEventListener("change", async (event) => {
      const todoId = event.target.getAttribute("data-id");
      const completed = event.target.checked;

      try {
        const response = await fetch(`/todos/${todoId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "CSRF-Token": csrfToken,
          },
          body: JSON.stringify({ completed }),
        });

        if (!response.ok) {
          alert("Failed to update todo status.");
          event.target.checked = !completed; // revert checkbox on error
        } else {
          // Optionally reload or update UI dynamically here
          location.reload();
        }
      } catch (error) {
        console.error("Error updating todo:", error);
        alert("Error updating todo");
        event.target.checked = !completed;
      }
    });
  });

  // Delete todo on clicking delete button
  document.querySelectorAll(".delete-btn").forEach((btn) => {
    btn.addEventListener("click", async (event) => {
      const todoId = event.target.getAttribute("data-id");
      if (!confirm("Are you sure you want to delete this todo?")) return;

      try {
        const response = await fetch(`/todos/${todoId}`, {
          method: "DELETE",
          headers: {
            "CSRF-Token": csrfToken,
          },
        });

        const data = await response.json();
        if (data === true) {
          // Optionally remove item from DOM instead of reload
          location.reload();
        } else {
          alert("Failed to delete todo");
        }
      } catch (error) {
        console.error("Error deleting todo:", error);
        alert("Error deleting todo");
      }
    });
  });
});
