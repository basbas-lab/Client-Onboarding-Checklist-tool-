document.addEventListener('DOMContentLoaded', () => {
    const checklistContainer = document.getElementById('checklists');
    const addChecklistButton = document.getElementById('add-checklist');

    // Event listener for adding a new checklist
    addChecklistButton.addEventListener('click', addChecklist);

    function addChecklist() {
        const checklistTemplate = document.getElementById('checklist-template');
        if (!checklistTemplate) {
            console.error("Checklist template not found");
            return;
        }
        const checklist = checklistTemplate.content.cloneNode(true);

        const addTaskButton = checklist.querySelector('.add-task');
        addTaskButton.addEventListener('click', addTask);

        checklistContainer.appendChild(checklist);
    }

    function addTask(event) {
        const checklist = event.target.closest('.checklist');
        const taskList = checklist.querySelector('.task-list');
        const taskTemplate = document.getElementById('task-template');
        if (!taskTemplate) {
            console.error("Task template not found");
            return;
        }
        const task = taskTemplate.content.cloneNode(true);

        // Add event listeners to task elements
        setupTaskEvents(task);

        taskList.appendChild(task);
    }

    function setupTaskEvents(task) {
        const deleteButton = task.querySelector('.delete-task');
        deleteButton.addEventListener('click', deleteTask);

        const taskStatus = task.querySelector('.task-status');
        taskStatus.addEventListener('change', updateTaskStatus);

        const taskDeadline = task.querySelector('.task-deadline');
        taskDeadline.addEventListener('change', setReminder);
    }

    function deleteTask(event) {
        const task = event.target.closest('.task');
        if (task) {
            task.remove();
            showNotification("Task deleted successfully.");
        }
    }

    function updateTaskStatus(event) {
        const task = event.target.closest('.task');
        const taskName = task.querySelector('.task-name');
        if (event.target.checked) {
            taskName.style.textDecoration = 'line-through';
        } else {
            taskName.style.textDecoration = 'none';
        }
    }

    function setReminder(event) {
        const task = event.target.closest('.task');
        const taskName = task.querySelector('.task-name').textContent;
        const deadline = moment(event.target.value);
        const today = moment();
        const daysUntilDeadline = deadline.diff(today, 'days');

        if (daysUntilDeadline > 0) {
            const reminderDate = deadline.subtract(1, 'days');
            const reminder = setTimeout(() => {
                showNotification(`Reminder: "${taskName}" is due tomorrow!`);
            }, reminderDate.diff(today));

            task.dataset.reminderId = reminder;
        }
    }

    function showNotification(message) {
        Toastify({
            text: message,
            duration: 3000,
            close: true,
            gravity: "top",
            position: "right",
            backgroundColor: "#4CAF50",
        }).showToast();
    }
});
