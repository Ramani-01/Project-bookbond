import { useEffect, useState } from "react";
import axios from "axios";
import "./Challenge.css";

const Challenge = () => {
  const [challenges, setChallenges] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [books, setBooks] = useState([]);
  const [selectedBooks, setSelectedBooks] = useState([]);
  const [loadingBooks, setLoadingBooks] = useState(false);

  const [form, setForm] = useState({
    title: "",
    durationType: "days",
    duration: 1,
    goalType: "pages",
    goalValue: 10,
  });

  const fetchChallenges = async () => {
    try {
      const res = await axios.get("http://localhost:3001/reading-challenge", {
        withCredentials: true,
      });
      setChallenges(res.data || []);
    } catch {
      console.log("No challenges yet.");
    }
  };

  const fetchBooks = async () => {
    setLoadingBooks(true);
    try {
      const res = await axios.get("http://localhost:3001/books");
      setBooks(res.data);
    } catch {
      console.log("Error fetching books.");
    } finally {
      setLoadingBooks(false);
    }
  };

  useEffect(() => {
    fetchChallenges();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleBookToggle = (bookId, title) => {
    setSelectedBooks((prev) =>
      prev.includes(bookId)
        ? prev.filter((id) => id !== bookId)
        : [...prev, bookId]
    );

    if (selectedBooks.length === 0) {
      setForm((prev) => ({ ...prev, title }));
    }
  };

  const handleStartClick = () => {
    setShowForm(true);
    fetchBooks();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        "http://localhost:3001/reading-challenge",
        {
          ...form,
          selectedBooks,
        },
        { withCredentials: true }
      );
      fetchChallenges();
      setShowForm(false);
      setSelectedBooks([]);
      setForm({
        title: "",
        durationType: "days",
        duration: 1,
        goalType: "pages",
        goalValue: 10,
      });
    } catch (err) {
      console.error("Error starting challenge:", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3001/reading-challenge/${id}`, {
        withCredentials: true,
      });
      fetchChallenges();
    } catch (err) {
      console.error("Error deleting challenge:", err);
    }
  };

  const getDaysLeft = (endDate) => {
    if (!endDate) return 0;
    const diff = new Date(endDate) - new Date();
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  };

  return (
    <div className="challenge-container">
      <h2 className="challenge-title">📚 Reading Challenges</h2>

      <button onClick={handleStartClick} className="btn btn-blue">
        ➕ Add New Challenge
      </button>

      {showForm && (
        <form onSubmit={handleSubmit} className="challenge-form card">
          <div>
            <label>Challenge Title</label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Enter a title (or select a book)"
              required
            />
          </div>

          <div>
            <label>Duration Type</label>
            <select
              name="durationType"
              value={form.durationType}
              onChange={handleChange}
            >
              <option value="days">Days</option>
              <option value="weeks">Weeks</option>
              <option value="months">Months</option>
            </select>
          </div>

          <div>
            <label>Duration</label>
            <input
              type="number"
              name="duration"
              value={form.duration}
              onChange={handleChange}
              min="1"
            />
          </div>

          <div>
            <label>Goal Type</label>
            <select
              name="goalType"
              value={form.goalType}
              onChange={handleChange}
            >
              <option value="books">Books</option>
              <option value="pages">Pages</option>
            </select>
          </div>

          <div>
            <label>Goal Value</label>
            <input
              type="number"
              name="goalValue"
              value={form.goalValue}
              onChange={handleChange}
              min="1"
            />
          </div>

          <div>
            <label>📘 Select Books</label>
            <div className="book-list">
              {loadingBooks ? (
                <p>Loading books...</p>
              ) : books.length === 0 ? (
                <p>No books available.</p>
              ) : (
                books.map((book) => (
                  <label key={book._id} className="book-item">
                    <input
                      type="checkbox"
                      checked={selectedBooks.includes(book._id)}
                      onChange={() => handleBookToggle(book._id, book.title)}
                    />
                    <span className="checkmark"></span>
                    <span className="book-title">📖 {book.title}</span>
                  </label>
                ))
              )}
            </div>
          </div>

          <button type="submit" className="btn btn-green">
            ✅ Start Challenge
          </button>
        </form>
      )}

      {challenges.length === 0 && !showForm && (
        <p className="text-center">No challenges yet. Start one!</p>
      )}

      {challenges.map((ch) => {
        const progress = Math.min(
          100,
          Math.floor(Math.random() * 80) + 10 // dummy progress
        );

        return (
          <div key={ch._id} className="challenge-summary card">
            <h3>🎯 {ch.title}</h3>
            <p>
              Duration: {ch.duration} {ch.durationType}
            </p>
            <p>
              Goal: {ch.goalValue} {ch.goalType}
            </p>
            <p>Ends on: {new Date(ch.endDate).toLocaleDateString()}</p>

            <p className="countdown">⏳ {getDaysLeft(ch.endDate)} days left</p>

            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <p>Progress: {progress}%</p>

            <div className="badges">
              {progress >= 10 && <span className="badge">🏅 Beginner</span>}
              {progress >= 50 && <span className="badge">🔥 Halfway</span>}
              {progress >= 100 && <span className="badge">🏆 Champion</span>}
            </div>

            {ch.selectedBooks?.length > 0 && (
              <div>
                <p>📚 Books in Challenge:</p>
                <ul className="book-grid">
                  {ch.selectedBooks.map((book) => (
                    <li key={book._id}>{book.title}</li>
                  ))}
                </ul>
              </div>
            )}

            <button
              onClick={() => handleDelete(ch._id)}
              className="btn btn-red"
            >
              ❌ Delete Challenge
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default Challenge;
