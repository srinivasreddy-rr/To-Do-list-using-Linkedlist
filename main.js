// Backend Logic (Data Management)
class TaskNode {
    constructor(taskName) {
        this.taskName = taskName;
        this.done = false;
        this.next = null;
        this.id = Date.now() + Math.random(); // Unique identifier
    }
}

class ToDoList {
    constructor() {
        this.head = null;
        this.loadFromStorage();
    }

    addTask(taskName) {
        if (!taskName || taskName.trim() === '') {
            return { success: false, message: 'Task name cannot be empty.' };
        }

        const newTask = new TaskNode(taskName.trim());
        
        if (this.head === null) {
            this.head = newTask;
        } else {
            let current = this.head;
            while (current.next !== null) {
                current = current.next;
            }
            current.next = newTask;
        }

        this.saveToStorage();
        return { success: true, message: `Task '${taskName}' added successfully.` };
    }

    deleteTask(taskName) {
        let current = this.head;
        let prev = null;
        while (current !== null) {
            if (current.taskName === taskName) {
                if (prev === null) {
                    this.head = current.next;
                } else {
                    prev.next = current.next;
                }
                this.size--; // Decrement size
                this.saveToStorage();
                return { success: true, message: `Task '${taskName}' deleted successfully.` };
            }
            prev = current;
            current = current.next;
        }
        return { success: false, message: `Task '${taskName}' not found.` };
    }

    deleteTaskById(id) {
        let current = this.head;
        let prev = null;
        while (current !== null) {
            if (current.id === id) {
                if (prev === null) {
                    this.head = current.next;
                } else {
                    prev.next = current.next;
                }
                this.saveToStorage();
                return { success: true, message: `Task deleted successfully.` };
            }
            prev = current;
            current = current.next;
        }
        return { success: false, message: 'Task not found.' };
    }

    markDone(taskName) {
        let current = this.head;
        while (current !== null) {
            if (current.taskName === taskName) {
                current.done = true;
                this.saveToStorage();
                return { success: true, message: `Task '${taskName}' marked as done.` };
            }
            current = current.next;
        }
        return { success: false, message: `Task '${taskName}' not found.` };
    }

    markDoneById(id) {
        let current = this.head;
        while (current !== null) {
            if (current.id === id) {
                current.done = !current.done;
                this.saveToStorage();
                return { 
                    success: true, 
                    message: `Task ${current.done ? 'completed' : 'marked as pending'}.` 
                };
            }
            current = current.next;
        }
        return { success: false, message: 'Task not found.' };
    }

    getAllTasks() {
        const tasks = [];
        let current = this.head;
        while (current !== null) {
            tasks.push({
                id: current.id,
                taskName: current.taskName,
                done: current.done
            });
            current = current.next;
        }
        return tasks;
    }

    getStats() {
        const tasks = this.getAllTasks();
        const total = tasks.length;
        const completed = tasks.filter(task => task.done).length;
        const pending = total - completed;
        
        return { total, completed, pending };
    }

    clearCompleted() {
        let current = this.head;
        let prev = null;
        let deletedCount = 0;
        while (current !== null) {
            if (current.done) {
                if (prev === null) {
                    this.head = current.next;
                    current = this.head;
                } else {
                    prev.next = current.next;
                    current = current.next;
                }
                deletedCount++;
            } else {
                prev = current;
                current = current.next;
            }
        }
        this.saveToStorage();
        return { 
            success: true, 
            message: `${deletedCount} completed task${deletedCount !== 1 ? 's' : ''} cleared.` 
        };
    }

    saveToStorage() {
        const tasks = this.getAllTasks();
        localStorage.setItem('todoTasks', JSON.stringify(tasks));
    }

    loadFromStorage() {
        try {
            const savedTasks = localStorage.getItem('todoTasks');
            if (savedTasks) {
                const tasks = JSON.parse(savedTasks);
                this.head = null;
                tasks.forEach(taskData => {
                    const task = new TaskNode(taskData.taskName);
                    task.done = taskData.done;
                    task.id = taskData.id;
                    if (this.head === null) {
                        this.head = task;
                    } else {
                        let current = this.head;
                        while (current.next !== null) {
                            current = current.next;
                        }
                        current.next = task;
                    }
                });
            }
        } catch (error) {
            console.error('Error loading tasks from storage:', error);
        }
    }
}

// Frontend Logic (UI Management)
const todoList = new ToDoList();

function showMessage(message, type = 'success') {
    const messageContainer = document.getElementById('messageContainer');
    messageContainer.innerHTML = `
        <div class="message ${type}">
            ${message}
        </div>
    `;
    setTimeout(() => {
        messageContainer.innerHTML = '';
    }, 3000);
}

function updateStats() {
    const stats = todoList.getStats();
    document.getElementById('totalTasks').textContent = stats.total;
    document.getElementById('completedTasks').textContent = stats.completed;
    document.getElementById('pendingTasks').textContent = stats.pending;
}

function renderTasks() {
    const taskListElement = document.getElementById('taskList');
    const emptyState = document.getElementById('emptyState');
    const tasks = todoList.getAllTasks();
    if (tasks.length === 0) {
        taskListElement.innerHTML = `
            <div class="empty-state">
                <h3>No tasks yet!</h3>
                <p>Add your first task above to get started.</p>
            </div>
        `;
    } else {
        taskListElement.innerHTML = tasks.map(task => `
            <div class="task-item">
                <div class="task-info">
                    <div class="task-name ${task.done ? 'done' : ''}">${task.taskName}</div>
                    <span class="task-status ${task.done ? 'status-done' : 'status-pending'}">
                        ${task.done ? 'Done' : 'Pending'}
                    </span>
                </div>
                <div class="task-actions">
                    <button class="btn ${task.done ? 'btn-secondary' : 'btn-success'} btn-small" 
                            onclick="toggleTask('${task.id}')">
                        ${task.done ? 'Undo' : 'Complete'}
                    </button>
                    <button class="btn btn-danger btn-small" onclick="deleteTask('${task.id}')">
                        Delete
                    </button>
                </div>
            </div>
        `).join('');
    }
    updateStats();
}

function addTask() {
    const taskInput = document.getElementById('taskInput');
    const taskName = taskInput.value.trim();
    const result = todoList.addTask(taskName);
    if (result.success) {
        taskInput.value = '';
        showMessage(result.message, 'success');
        renderTasks();
    } else {
        showMessage(result.message, 'error');
    }
}

function deleteTask(taskId) {
    const result = todoList.deleteTaskById(parseFloat(taskId));
    showMessage(result.message, result.success ? 'success' : 'error');
    renderTasks();
}

function toggleTask(taskId) {
    const result = todoList.markDoneById(parseFloat(taskId));
    showMessage(result.message, result.success ? 'success' : 'error');
    renderTasks();
}

function clearCompleted() {
    const result = todoList.clearCompleted();
    showMessage(result.message, 'success');
    renderTasks();
}

function handleKeyPress(event) {
    if (event.key === 'Enter') {
        addTask();
    }
}

document.addEventListener('DOMContentLoaded', function() {
    renderTasks();
});
