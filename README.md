
# To-Do List Using Linked List

This project is a simple and modern To-Do List web application built using HTML, CSS, and JavaScript. The core logic for managing tasks is implemented using a singly linked list data structure in JavaScript, making it a great demonstration of DSA (Data Structures and Algorithms) concepts in a real-world application.

## Features
- Add, complete, and delete tasks
- Clear all completed tasks
- Task statistics (total, completed, pending)
- Responsive and modern UI
- Data persistence using browser localStorage

## How It Works

### Linked List Implementation
- Each task is represented as a node (`TaskNode`) in a singly linked list.
- The `ToDoList` class manages the linked list, providing methods to add, delete, mark as done/undone, and clear completed tasks.
- All operations (add, delete, toggle, clear) are performed by traversing and manipulating the linked list.
- The list is saved to and loaded from `localStorage` so your tasks persist between sessions.

### File Structure
```
html/
  index.html         # Main HTML file
css/
  style.css          # Stylesheet
js/
  main.js            # JavaScript logic (linked list)
```

### How to Use
1. Open `html/index.html` in your browser.
2. Enter a new task and click **Add Task**.
3. Mark tasks as complete, delete them, or clear all completed tasks.
4. Your tasks and their status are saved automatically.

## Why Linked List?
- Demonstrates DSA concepts in a practical app.
- Each task is a node, and the list is managed without using arrays for core operations.
- Useful for learning how data structures can be applied in frontend projects.

## For DSA Projects
This project is ideal for demonstrating:
- Implementation of a singly linked list in JavaScript
- Real-world use of data structures
- Clean separation of logic (data, UI, storage)

## Author
- Dhruv Malu and Srinivas Reddy
- GitHub: [To-Do-list-using-Linkedlist](https://github.com/yourusername/To-Do-list-using-Linkedlist)

---
Feel free to fork, use, and improve this project for your own DSA learning or portfolio!
