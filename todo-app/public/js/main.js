document.addEventListener("DOMContentLoaded", () => {
  const csrfToken = document.querySelector('input[name="_csrf"]')?.value;

  // ✅ Helper to find the parent item (LI or TR)
  const findTodoElement = (el) => el.closest("li") || el.closest("tr");

  // ✅ Toggle completion status
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
          event.target.checked = !completed; // revert checkbox
        } else {
          const todoElement = findTodoElement(event.target);
          // Optional: animate removal
          todoElement.style.transition = "opacity 0.3s";
          todoElement.style.opacity = 0;
          setTimeout(() => {
            todoElement.remove();
            updateCounts();
          }, 300);
        }
      } catch (error) {
        console.error("Error updating todo:", error);
        alert("Error updating todo");
        event.target.checked = !completed;
      }
    });
  });

  // ✅ Delete todo
  document.querySelectorAll(".delete-btn").forEach((btn) => {
    btn.addEventListener("click", async (event) => {
      event.preventDefault();
      const todoId = btn.getAttribute("data-id");
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
          const todoElement = findTodoElement(btn);
          todoElement.style.transition = "opacity 0.3s";
          todoElement.style.opacity = 0;
          setTimeout(() => {
            todoElement.remove();
            updateCounts();
          }, 300);
        } else {
          alert("Failed to delete todo");
        }
      } catch (error) {
        console.error("Error deleting todo:", error);
        alert("Error deleting todo");
      }
    });
  });

  // ✅ Update count spans dynamically
  function updateCounts() {
    const sections = [
      { selector: "#count-overdue", container: "Overdue" },
      { selector: "#count-due-today", container: "Due Today" },
      { selector: "#count-due-later", container: "Due Later" },
      { selector: "#count-completed", container: "Completed" },
      { selector: "#overdue", container: "Overdue" },
      { selector: "#due-today", container: "Due Today" },
      { selector: "#due-later", container: "Due Later" },
      { selector: "#completed", container: "Completed" },
    ];

    sections.forEach((section) => {
      const countElem = document.querySelector(section.selector);
      if (countElem) {
        const sectionText = section.container.toLowerCase();
        const items = Array.from(document.querySelectorAll("section, ul"))
          .find((el) => el.textContent?.toLowerCase().includes(sectionText));
        if (items) {
          const listItems = items.querySelectorAll("li, tr");
          countElem.textContent = listItems.length;
        }
      }
    });
  }
});
