// EduTracker - Simple Client-Side Application
// Data storage using localStorage

// Sample data for demonstration
let homeworkData = [
    {
        id: 1,
        title: "Mathematics Assignment",
        description: "Complete exercises 1-10 from Chapter 5",
        subject: "math",
        classYear: "1st",
        dueDate: "2024-01-15",
        completed: false,
        createdAt: "2024-01-10"
    },
    {
        id: 2,
        title: "Science Lab Report",
        description: "Write a report on the chemistry experiment",
        subject: "science",
        classYear: "1st",
        dueDate: "2024-01-18",
        completed: true,
        createdAt: "2024-01-08"
    },
    {
        id: 3,
        title: "English Essay",
        description: "Write a 500-word essay on Shakespeare",
        subject: "english",
        classYear: "2nd",
        dueDate: "2024-01-20",
        completed: false,
        createdAt: "2024-01-12"
    }
];

let notesData = [
    {
        id: 1,
        title: "Mathematics Notes - Chapter 5",
        description: "Comprehensive notes on calculus fundamentals",
        subject: "math",
        classYear: "1st",
        fileUrl: "#",
        createdAt: "2024-01-10"
    },
    {
        id: 2,
        title: "Physics Formulas",
        description: "Important formulas for mechanics and thermodynamics",
        subject: "science",
        classYear: "2nd",
        fileUrl: "#",
        createdAt: "2024-01-08"
    },
    {
        id: 3,
        title: "Literature Analysis Guide",
        description: "Guide for analyzing literary works",
        subject: "english",
        classYear: "3rd",
        fileUrl: "#",
        createdAt: "2024-01-05"
    }
];

// Current class year
let currentClassYear = "1st";

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    loadData();
    initializeNavigation();
    initializeTheme();
    loadDashboard();
    updateStats();
});

// Load data from localStorage or use sample data
function loadData() {
    const savedHomework = localStorage.getItem('edutracker_homework');
    const savedNotes = localStorage.getItem('edutracker_notes');
    
    if (savedHomework) {
        homeworkData = JSON.parse(savedHomework);
    } else {
        localStorage.setItem('edutracker_homework', JSON.stringify(homeworkData));
    }
    
    if (savedNotes) {
        notesData = JSON.parse(savedNotes);
    } else {
        localStorage.setItem('edutracker_notes', JSON.stringify(notesData));
    }
}

// Save data to localStorage
function saveData() {
    localStorage.setItem('edutracker_homework', JSON.stringify(homeworkData));
    localStorage.setItem('edutracker_notes', JSON.stringify(notesData));
}

// Navigation functionality
function initializeNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.section');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all links and sections
            navLinks.forEach(l => l.classList.remove('active'));
            sections.forEach(s => s.classList.remove('active'));
            
            // Add active class to clicked link
            this.classList.add('active');
            
            // Show corresponding section
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            if (targetSection) {
                targetSection.classList.add('active');
                loadSectionContent(targetId);
            }
        });
    });
    
    // Class selector functionality
    const classSelector = document.getElementById('classSelector');
    if (classSelector) {
        classSelector.addEventListener('change', function() {
            currentClassYear = this.value;
            loadDashboard();
            updateStats();
        });
    }
}

// Theme toggle functionality
function initializeTheme() {
    const themeToggle = document.getElementById('themeToggle');
    const savedTheme = localStorage.getItem('edutracker_theme') || 'light';
    
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);
    
    themeToggle.addEventListener('click', function() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('edutracker_theme', newTheme);
        updateThemeIcon(newTheme);
    });
}

function updateThemeIcon(theme) {
    const themeToggle = document.getElementById('themeToggle');
    const icon = themeToggle.querySelector('i');
    
    if (theme === 'dark') {
        icon.className = 'fas fa-sun';
    } else {
        icon.className = 'fas fa-moon';
    }
}

// Load section content
function loadSectionContent(sectionId) {
    switch(sectionId) {
        case 'dashboard':
            loadDashboard();
            break;
        case 'homework':
            loadHomework();
            break;
        case 'notes':
            loadNotes();
            break;
        case 'subjects':
            loadSubjects();
            break;
        case 'upload':
            // Upload section is static
            break;
    }
}

// Dashboard functionality
function loadDashboard() {
    loadTodayHomework();
    loadRecentNotes();
    updateStats();
}

function loadTodayHomework() {
    const today = new Date().toISOString().split('T')[0];
    const todayHomework = homeworkData.filter(hw => 
        hw.classYear === currentClassYear && 
        hw.dueDate === today
    );
    
    const container = document.getElementById('todayHomework');
    if (!container) return;
    
    if (todayHomework.length === 0) {
        container.innerHTML = '<p class="no-content">No homework due today!</p>';
        return;
    }
    
    container.innerHTML = todayHomework.map(hw => createHomeworkCard(hw)).join('');
}

function loadRecentNotes() {
    const recentNotes = notesData
        .filter(note => note.classYear === currentClassYear)
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 3);
    
    const container = document.getElementById('recentNotes');
    if (!container) return;
    
    if (recentNotes.length === 0) {
        container.innerHTML = '<p class="no-content">No notes available.</p>';
        return;
    }
    
    container.innerHTML = recentNotes.map(note => createNoteCard(note)).join('');
}

function updateStats() {
    const classHomework = homeworkData.filter(hw => hw.classYear === currentClassYear);
    const classNotes = notesData.filter(note => note.classYear === currentClassYear);
    
    document.getElementById('totalHomework').textContent = classHomework.length;
    document.getElementById('totalNotes').textContent = classNotes.length;
    document.getElementById('completedHomework').textContent = classHomework.filter(hw => hw.completed).length;
    document.getElementById('pendingHomework').textContent = classHomework.filter(hw => !hw.completed).length;
}

// Homework functionality
function loadHomework() {
    const container = document.getElementById('homeworkList');
    if (!container) return;
    
    const classHomework = homeworkData.filter(hw => hw.classYear === currentClassYear);
    
    if (classHomework.length === 0) {
        container.innerHTML = '<p class="no-content">No homework available.</p>';
        return;
    }
    
    container.innerHTML = classHomework.map(hw => createHomeworkItem(hw)).join('');
    
    // Add search and filter functionality
    setupSearchAndFilter('homework');
}

function createHomeworkCard(homework) {
    return `
        <div class="content-card">
            <h3>${homework.title}</h3>
            <p>${homework.description}</p>
            <div class="content-meta">
                <span class="subject">${getSubjectName(homework.subject)}</span>
                <span class="date">Due: ${formatDate(homework.dueDate)}</span>
            </div>
            <div class="content-actions">
                <button class="btn btn-small ${homework.completed ? 'btn-secondary' : 'btn-primary'}" 
                        onclick="toggleHomeworkComplete(${homework.id})">
                    <i class="fas ${homework.completed ? 'fa-check-circle' : 'fa-circle'}"></i>
                    ${homework.completed ? 'Completed' : 'Mark Complete'}
                </button>
            </div>
        </div>
    `;
}

function createHomeworkItem(homework) {
    return `
        <div class="homework-item">
            <h3>${homework.title}</h3>
            <p>${homework.description}</p>
            <div class="content-meta">
                <span class="subject">${getSubjectName(homework.subject)}</span>
                <span class="date">Due: ${formatDate(homework.dueDate)}</span>
            </div>
            <div class="content-actions">
                <button class="btn btn-small ${homework.completed ? 'btn-secondary' : 'btn-primary'}" 
                        onclick="toggleHomeworkComplete(${homework.id})">
                    <i class="fas ${homework.completed ? 'fa-check-circle' : 'fa-circle'}"></i>
                    ${homework.completed ? 'Completed' : 'Mark Complete'}
                </button>
            </div>
        </div>
    `;
}

function toggleHomeworkComplete(homeworkId) {
    const homework = homeworkData.find(hw => hw.id === homeworkId);
    if (homework) {
        homework.completed = !homework.completed;
        saveData();
        loadDashboard();
        updateStats();
        showNotification('Homework status updated!', 'success');
    }
}

// Notes functionality
function loadNotes() {
    const container = document.getElementById('notesList');
    if (!container) return;
    
    const classNotes = notesData.filter(note => note.classYear === currentClassYear);
    
    if (classNotes.length === 0) {
        container.innerHTML = '<p class="no-content">No notes available.</p>';
        return;
    }
    
    container.innerHTML = classNotes.map(note => createNoteItem(note)).join('');
    
    // Add search and filter functionality
    setupSearchAndFilter('notes');
}

function createNoteCard(note) {
    return `
        <div class="content-card">
            <h3>${note.title}</h3>
            <p>${note.description}</p>
            <div class="content-meta">
                <span class="subject">${getSubjectName(note.subject)}</span>
                <span class="date">${formatDate(note.createdAt)}</span>
            </div>
            <div class="content-actions">
                <button class="btn btn-small btn-primary" onclick="downloadNote(${note.id})">
                    <i class="fas fa-download"></i> Download
                </button>
            </div>
        </div>
    `;
}

function createNoteItem(note) {
    return `
        <div class="note-item">
            <h3>${note.title}</h3>
            <p>${note.description}</p>
            <div class="content-meta">
                <span class="subject">${getSubjectName(note.subject)}</span>
                <span class="date">${formatDate(note.createdAt)}</span>
            </div>
            <div class="content-actions">
                <button class="btn btn-small btn-primary" onclick="downloadNote(${note.id})">
                    <i class="fas fa-download"></i> Download
                </button>
            </div>
        </div>
    `;
}

function downloadNote(noteId) {
    const note = notesData.find(n => n.id === noteId);
    if (note) {
        showNotification('Download started!', 'success');
        // In a real app, this would trigger an actual download
    }
}

// Subjects functionality
function loadSubjects() {
    const container = document.getElementById('subjectsGrid');
    if (!container) return;
    
    const subjects = [
        { name: 'Mathematics', icon: 'fas fa-calculator', color: '#e74c3c' },
        { name: 'Science', icon: 'fas fa-flask', color: '#3498db' },
        { name: 'English', icon: 'fas fa-book-open', color: '#f39c12' },
        { name: 'History', icon: 'fas fa-landmark', color: '#9b59b6' },
        { name: 'Geography', icon: 'fas fa-globe', color: '#27ae60' },
        { name: 'Computer Science', icon: 'fas fa-laptop-code', color: '#e67e22' }
    ];
    
    container.innerHTML = subjects.map(subject => `
        <div class="subject-card" onclick="showSubjectContent('${subject.name.toLowerCase()}')">
            <i class="${subject.icon}"></i>
            <h3>${subject.name}</h3>
            <p>View all ${subject.name.toLowerCase()} content</p>
        </div>
    `).join('');
}

function showSubjectContent(subject) {
    // Navigate to homework section and filter by subject
    document.querySelector('a[href="#homework"]').click();
    document.getElementById('homeworkFilter').value = subject;
    // Trigger filter
    setTimeout(() => {
        const filterEvent = new Event('change');
        document.getElementById('homeworkFilter').dispatchEvent(filterEvent);
    }, 100);
}

// Upload functionality
function uploadContent() {
    const type = document.getElementById('uploadType').value;
    const classYear = document.getElementById('uploadClass').value;
    const subject = document.getElementById('uploadSubject').value;
    const title = document.getElementById('uploadTitle').value;
    const description = document.getElementById('uploadDescription').value;
    const dueDate = document.getElementById('uploadDueDate').value;
    const file = document.getElementById('uploadFile').files[0];
    
    if (!type || !classYear || !subject || !title || !description) {
        showNotification('Please fill in all required fields.', 'error');
        return;
    }
    
    if (type === 'homework' && !dueDate) {
        showNotification('Please select a due date for homework.', 'error');
        return;
    }
    
    const newItem = {
        id: Date.now(),
        title: title,
        description: description,
        subject: subject,
        classYear: classYear,
        createdAt: new Date().toISOString().split('T')[0]
    };
    
    if (type === 'homework') {
        newItem.dueDate = dueDate;
        newItem.completed = false;
        homeworkData.push(newItem);
    } else {
        newItem.fileUrl = file ? URL.createObjectURL(file) : '#';
        notesData.push(newItem);
    }
    
    saveData();
    clearUploadForm();
    showNotification(`${type === 'homework' ? 'Homework' : 'Note'} uploaded successfully!`, 'success');
    
    // Reload current section
    const activeSection = document.querySelector('.section.active');
    if (activeSection) {
        loadSectionContent(activeSection.id);
    }
}

function clearUploadForm() {
    document.getElementById('uploadType').value = '';
    document.getElementById('uploadClass').value = '';
    document.getElementById('uploadSubject').value = '';
    document.getElementById('uploadTitle').value = '';
    document.getElementById('uploadDescription').value = '';
    document.getElementById('uploadDueDate').value = '';
    document.getElementById('uploadFile').value = '';
}

// Search and filter functionality
function setupSearchAndFilter(type) {
    const searchInput = document.getElementById(`${type}Search`);
    const filterSelect = document.getElementById(`${type}Filter`);
    
    if (searchInput) {
        searchInput.addEventListener('input', () => filterContent(type));
    }
    
    if (filterSelect) {
        filterSelect.addEventListener('change', () => filterContent(type));
    }
}

function filterContent(type) {
    const searchTerm = document.getElementById(`${type}Search`).value.toLowerCase();
    const filterValue = document.getElementById(`${type}Filter`).value;
    
    let filteredData = type === 'homework' ? homeworkData : notesData;
    
    // Filter by class year
    filteredData = filteredData.filter(item => item.classYear === currentClassYear);
    
    // Filter by search term
    if (searchTerm) {
        filteredData = filteredData.filter(item => 
            item.title.toLowerCase().includes(searchTerm) ||
            item.description.toLowerCase().includes(searchTerm)
        );
    }
    
    // Filter by subject
    if (filterValue && filterValue !== 'all') {
        filteredData = filteredData.filter(item => item.subject === filterValue);
    }
    
    // Display filtered results
    const container = document.getElementById(`${type}List`);
    if (!container) return;
    
    if (filteredData.length === 0) {
        container.innerHTML = '<p class="no-content">No items found.</p>';
        return;
    }
    
    container.innerHTML = filteredData.map(item => 
        type === 'homework' ? createHomeworkItem(item) : createNoteItem(item)
    ).join('');
}

// Utility functions
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
    });
}

function getSubjectName(subjectCode) {
    const subjects = {
        'math': 'Mathematics',
        'science': 'Science',
        'english': 'English',
        'history': 'History',
        'geography': 'Geography',
        'computer': 'Computer Science'
    };
    return subjects[subjectCode] || subjectCode;
}

function showNotification(message, type = 'success') {
    const notification = document.getElementById('notification');
    const notificationText = document.getElementById('notificationText');
    
    notificationText.textContent = message;
    notification.className = `notification ${type} show`;
    
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

function closeNotification() {
    const notification = document.getElementById('notification');
    notification.classList.remove('show');
}

// Back button functionality
function goBack() {
    // Get the current active section
    const currentSection = document.querySelector('.section.active');
    if (!currentSection) return;
    
    // If we're not on dashboard, go to dashboard
    if (currentSection.id !== 'dashboard') {
        // Find and click the dashboard link
        const dashboardLink = document.querySelector('a[href="#dashboard"]');
        if (dashboardLink) {
            dashboardLink.click();
        }
    } else {
        // If we're on dashboard, show a message or do nothing
        showNotification('You are already on the main page', 'success');
    }
}

// Mobile menu functionality
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            hamburger.classList.toggle('active');
        });
    }
});
