document.addEventListener('DOMContentLoaded', () => {
    const taskForm = document.getElementById('task-form');
    const taskInput = document.getElementById('task-input');
    const taskDate = document.getElementById('task-date');
    const taskCategory = document.getElementById('task-category');
    const filterCategory = document.getElementById('filter-category');
    const filterStatus = document.getElementById('filter-status');
    const taskList = document.getElementById('task-list');
    const navbarToggler = document.getElementById('navbar-toggler');
    const navbarLinks = document.getElementById('navbar-links');
    const homeSection = document.getElementById('home');
    const aboutSection = document.getElementById('about');
    const contactSection = document.getElementById('contact');

    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    function saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function renderTasks() {
        taskList.innerHTML = '';
        tasks.forEach((task, index) => {
            if ((filterCategory.value === 'All' || task.category === filterCategory.value) &&
                (filterStatus.value === 'All' || (filterStatus.value === 'Completed' && task.completed) || (filterStatus.value === 'Uncompleted' && !task.completed))) {
                const li = document.createElement('li');
                li.className = `task-item ${task.completed ? 'completed' : ''}`;
                li.dataset.index = index;
                li.innerHTML = `
                    <span class="task-text">${task.text}</span>
                    <span class="task-date">${task.date}</span>
                    <span class="task-category">${task.category}</span>
                    <div class="task-buttons">
                        <button class="edit-btn">Edit</button>
                        <button class="delete-btn">Delete</button>
                        <button class="complete-btn">${task.completed ? 'Uncomplete' : 'Complete'}</button>
                    </div>
                `;
                taskList.appendChild(li);
            }
        });
    }

    taskForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const newTask = {
            text: taskInput.value,
            date: taskDate.value,
            category: taskCategory.value,
            completed: false,
        };
        tasks.push(newTask);
        saveTasks();
        renderTasks();
        taskInput.value = '';
        taskDate.value = '';
    });

    taskList.addEventListener('click', (e) => {
        if (e.target.classList.contains('edit-btn')) {
            const index = e.target.closest('.task-item').dataset.index;
            const task = tasks[index];
            taskInput.value = task.text;
            taskDate.value = task.date;
            taskCategory.value = task.category;
            tasks.splice(index, 1);
            saveTasks();
            renderTasks();
        } else if (e.target.classList.contains('delete-btn')) {
            const index = e.target.closest('.task-item').dataset.index;
            tasks.splice(index, 1);
            saveTasks();
            renderTasks();
        } else if (e.target.classList.contains('complete-btn')) {
            const index = e.target.closest('.task-item').dataset.index;
            tasks[index].completed = !tasks[index].completed;
            saveTasks();
            renderTasks();
        }
    });

    filterCategory.addEventListener('change', renderTasks);
    filterStatus.addEventListener('change', renderTasks);

    navbarToggler.addEventListener('click', () => {
        navbarLinks.classList.toggle('show');
    });

    document.querySelectorAll('.navbar-links a').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            document.querySelectorAll('.container').forEach(container => {
                container.style.display = 'none';
            });
            const target = document.querySelector(e.target.getAttribute('href'));
            if (target) {
                target.style.display = 'block';
            }
            navbarLinks.classList.remove('show');
        });
    });

    renderTasks();
});
