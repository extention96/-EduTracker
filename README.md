# EduTracker - Class Homework & Notes Tracker

A modern, Firebase-powered web application designed to help students and teachers manage homework, notes, and class materials efficiently. Built with HTML, CSS, JavaScript, and Firebase for real-time data synchronization and secure authentication.

## 🌟 Features

### ✅ Core Features
- **User Authentication** - Secure login/signup with Firebase Auth
- **Class-Specific Content** - Students only see content for their class year (1st, 2nd, 3rd Year)
- **Role-Based Access** - Students view content, Admins upload content
- **Real-time Data** - Firebase Firestore for live updates
- **File Upload** - Upload and download PDFs, images, and documents
- **Search & Filter** - Find homework and notes by subject or keywords
- **Mobile Responsive** - Works perfectly on all devices

### 🎨 UI/UX Features
- **Dark Mode Toggle** - Switch between light and dark themes
- **Modern Design** - Clean, intuitive interface with smooth animations
- **Dashboard Statistics** - Quick overview of homework and notes
- **Progress Tracking** - Mark homework as completed
- **Real-time Notifications** - Success/error feedback
- **Loading States** - Smooth loading animations

### 📱 Mobile Features
- **Touch-friendly Interface** - Optimized for mobile devices
- **Responsive Design** - Adapts to any screen size
- **Mobile Navigation** - Collapsible hamburger menu
- **Touch Gestures** - Swipe and tap interactions

## 🚀 Getting Started

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Firebase project setup
- Basic knowledge of HTML, CSS, JavaScript

### Firebase Setup

1. **Create Firebase Project**
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Click "Add project"
   - Enter project name (e.g., "edutracker")
   - Follow setup wizard

2. **Enable Authentication**
   - In Firebase Console, go to Authentication
   - Click "Get started"
   - Enable Email/Password authentication
   - Add your domain to authorized domains

3. **Enable Firestore Database**
   - Go to Firestore Database
   - Click "Create database"
   - Choose "Start in test mode" (for development)
   - Select location closest to your users

4. **Enable Storage**
   - Go to Storage
   - Click "Get started"
   - Choose "Start in test mode"
   - Select location

5. **Get Firebase Config**
   - Go to Project Settings (gear icon)
   - Scroll to "Your apps"
   - Click "Add app" → Web
   - Copy the config object

6. **Update Configuration**
   - Open `script.js`
   - Replace the `firebaseConfig` object with your actual config

### Installation

1. **Clone or Download**
   ```bash
   git clone <repository-url>
   cd edutracker
   ```

2. **Update Firebase Config**
   - Open `script.js`
   - Replace the placeholder config with your Firebase config

3. **Deploy to Web Server**
   - Upload files to your web server
   - Or use Firebase Hosting (recommended)

### Firebase Hosting (Recommended)

1. **Install Firebase CLI**
   ```bash
   npm install -g firebase-tools
   ```

2. **Login to Firebase**
   ```bash
   firebase login
   ```

3. **Initialize Hosting**
   ```bash
   firebase init hosting
   ```

4. **Deploy**
   ```bash
   firebase deploy
   ```

## 📖 How to Use

### For Students

1. **Create Account**
   - Visit the application
   - Click "Sign up"
   - Enter your details and select your class year
   - Choose "Student" role

2. **Access Content**
   - Login with your credentials
   - View dashboard with today's homework
   - Browse all homework and notes
   - Search and filter content

3. **Track Progress**
   - Mark homework as completed
   - Download notes and files
   - View statistics

### For Admins

1. **Create Admin Account**
   - Sign up with admin role
   - Or contact system administrator

2. **Upload Content**
   - Navigate to Upload section
   - Select content type (homework/notes)
   - Choose target class year
   - Fill in details and upload files

3. **Manage Content**
   - Upload PDFs, images, documents
   - Set due dates for homework
   - Organize by subjects

## 🛠️ Technical Details

### Technologies Used
- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Backend**: Firebase (Authentication, Firestore, Storage)
- **Styling**: Modern CSS with Grid/Flexbox, CSS Variables
- **Icons**: Font Awesome
- **Typography**: Google Fonts (Inter)

### Firebase Services
- **Authentication**: User login/signup, password reset
- **Firestore**: Real-time database for homework and notes
- **Storage**: File upload and download
- **Hosting**: Web hosting (optional)

### Database Structure

#### Users Collection
```javascript
{
  name: "Student Name",
  email: "student@example.com",
  classYear: "1st", // "1st", "2nd", "3rd"
  role: "student", // "student" or "admin"
  createdAt: timestamp
}
```

#### Homework Collection
```javascript
{
  classYear: "1st",
  subject: "math",
  title: "Algebra Chapter 5",
  description: "Complete exercises 1-20",
  dueDate: "2024-12-20",
  completed: false,
  createdAt: timestamp,
  uploadedBy: "user_id"
}
```

#### Notes Collection
```javascript
{
  classYear: "1st",
  subject: "science",
  title: "Cell Biology Notes",
  description: "Comprehensive notes on cell structure",
  fileUrl: "https://storage.googleapis.com/...",
  fileName: "cell_biology.pdf",
  createdAt: timestamp,
  uploadedBy: "user_id"
}
```

## 🔧 Configuration

### Firebase Security Rules

#### Firestore Rules
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Users can read homework for their class year
    match /homework/{homeworkId} {
      allow read: if request.auth != null && 
        resource.data.classYear == get(/databases/$(database)/documents/users/$(request.auth.uid)).data.classYear;
      allow write: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == "admin";
    }
    
    // Users can read notes for their class year
    match /notes/{noteId} {
      allow read: if request.auth != null && 
        resource.data.classYear == get(/databases/$(database)/documents/users/$(request.auth.uid)).data.classYear;
      allow write: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == "admin";
    }
  }
}
```

#### Storage Rules
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /notes/{allPaths=**} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
        firestore.get(/databases/(default)/documents/users/$(request.auth.uid)).data.role == "admin";
    }
  }
}
```

## 🎨 Customization

### Adding New Subjects
Modify the subject options in the HTML and JavaScript:

```javascript
const subjectNames = {
    'math': 'Mathematics',
    'science': 'Science',
    'english': 'English',
    'history': 'History',
    'geography': 'Geography',
    'computer': 'Computer Science',
    'new-subject': 'New Subject' // Add here
};
```

### Styling Customization
The CSS uses CSS custom properties for easy theming:

```css
:root {
    --primary-color: #4f46e5;
    --accent-color: #06b6d4;
    --success-color: #10b981;
    /* Add more variables as needed */
}
```

### Adding New Features
The modular JavaScript structure makes it easy to add features:

- **Data Management**: Add new Firebase collections
- **UI Components**: Create new sections and cards
- **Authentication**: Add new user roles
- **File Handling**: Support new file types

## 📱 Mobile Experience

### Responsive Design
- Mobile-first approach
- Flexible grid layouts
- Touch-optimized controls
- Readable typography

### Mobile Navigation
- Hamburger menu for mobile
- Smooth slide animations
- Touch-friendly buttons
- Optimized for thumb navigation

## 🔮 Future Enhancements

### Planned Features
- **Real-time Notifications** - Browser notifications for new content
- **Calendar Integration** - Sync with Google Calendar
- **Progress Analytics** - Detailed student progress tracking
- **Chat System** - Student-teacher communication
- **Assignment Submissions** - Students can submit completed work
- **Grade Tracking** - Admin can assign and track grades

### Technical Improvements
- **PWA Support** - Progressive Web App capabilities
- **Offline Mode** - Work without internet connection
- **Advanced Search** - Full-text search with filters
- **Bulk Operations** - Upload multiple files at once
- **API Integration** - Connect with external educational tools
- **Multi-language Support** - Internationalization

## 🔒 Security Features

### Authentication
- Email/password authentication
- Password reset functionality
- Secure session management
- Role-based access control

### Data Security
- Firebase security rules
- Class-specific content isolation
- Admin-only upload permissions
- Secure file storage

### Privacy
- User data protection
- GDPR compliance ready
- Secure data transmission
- Regular security updates

## 🤝 Contributing

### Development Setup
1. Fork the repository
2. Create a feature branch
3. Set up Firebase project
4. Make your changes
5. Test thoroughly
6. Submit a pull request

### Code Style
- Use consistent indentation (2 spaces)
- Follow JavaScript ES6+ conventions
- Use semantic HTML elements
- Write clean, readable CSS
- Add comments for complex logic

## 📄 License

This project is open source and available under the MIT License.

## 🙏 Acknowledgments

- Firebase for backend services
- Font Awesome for icons
- Google Fonts for typography
- Modern CSS techniques and best practices
- The open-source community

## 📞 Support

For support and questions:
- Create an issue in the repository
- Check the Firebase documentation
- Review the code comments

---

**EduTracker** - Making education more organized and accessible! 📚✨

*Built with ❤️ using Firebase and modern web technologies* 