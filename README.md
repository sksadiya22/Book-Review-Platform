📚 Book Review Platform

A full-stack MERN application for users to browse, add, and review books. This platform demonstrates modern authentication, CRUD operations, review management, pagination, search & filter, and a polished responsive UI with dark/light mode and toast notifications.

This project is built as part of an internship selection assignment to showcase practical skills in MERN stack development.

🌟 Features
Core Features

User Authentication:

Signup with name, email, and password (hashed with bcrypt)

Login with JWT-based authentication

Protected routes for logged-in users

Book Management:

Add, edit, and delete books (only by the creator)

Paginated book list (5 books per page)

View book details

Review System:

Add, edit, delete reviews

Ratings (1-5 stars) and review text

Dynamic average rating display

Search & Filter:

Search books by title or author

Filter books by genre

Modern UI:

Card-based layout

Gradient buttons and navbar

Dark/light mode toggle

Responsive design

Bonus Features

Toast notifications for success/error messages

User profile page showing added books and written reviews

Future support for charts and sorting

🛠️ Tech Stack
Layer	Technology
Frontend	React, React Router, Axios
Backend	Node.js, Express.js
Database	MongoDB Atlas
Authentication	JWT, bcrypt
Styling	Custom CSS (Modern UI)
Tooling	Vite, Postman (API testing)
📂 Project Structure
book-review-platform/
│
├─ backend/
│  ├─ models/          # Mongoose models (User, Book, Review)
│  ├─ routes/          # API routes (auth, books, reviews)
│  ├─ controllers/     # Request handlers
│  └─ server.js        # Express server
│
├─ frontend/
│  ├─ src/
│  │  ├─ components/   # Navbar, Toast, ToastContainer
│  │  ├─ context/      # AuthContext, ThemeContext
│  │  ├─ pages/        # Login, Signup, Home, BookDetails, AddBook, Profile
│  │  ├─ index.css     # Manual modern CSS
│  │  └─ main.jsx      # React entry point
│  └─ package.json
└─ README.md

⚙️ Setup Instructions
Backend

Navigate to the backend folder:

cd backend


Install dependencies:

npm install


Create a .env file with:

MONGO_URI=<Your MongoDB Atlas URI>
JWT_SECRET=<Your JWT Secret>
PORT=5000


Run the server:

npm run dev

Frontend

Navigate to the frontend folder:

cd frontend


Install dependencies:

npm install


Run the frontend:

npm run dev


Open the app in your browser (usually http://localhost:5173).

🔗 API Endpoints
Authentication
Endpoint	Method	Description
/api/auth/signup	POST	Register new user
/api/auth/login	POST	Login user, return JWT token
Books
Endpoint	Method	Description
/api/books	GET	Get all books (with pagination)
/api/books	POST	Add new book (authenticated)
/api/books/:id	GET	Get book details
/api/books/:id	PUT	Update book (creator only)
/api/books/:id	DELETE	Delete book (creator only)
Reviews
Endpoint	Method	Description
/api/reviews	POST	Add review (authenticated)
/api/reviews/:id	PUT	Update review (owner only)
/api/reviews/:id	DELETE	Delete review (owner only)
🎨 Screenshots

(Replace with actual screenshots from your app)

Home Page	Book Details

	
Add Book	Profile Page

	
💡 Notes

Ensure MongoDB Atlas is properly configured and accessible.

JWT token is stored in localStorage and used for all authenticated requests.

Dark/light mode can be toggled via the navbar button.

Toast notifications appear for success/error actions like login, signup, book added, or review submitted.

📌 License

This project is open-source and free to use for learning and internship purposes.
