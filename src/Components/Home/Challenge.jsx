import { useEffect, useState } from "react";
import axios from "axios";
import "./Challenge.css";

const Challenge = () => {
  const [challenge, setChallenge] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [books, setBooks] = useState([]);
  const [selectedBooks, setSelectedBooks] = useState([]);
  const [loadingBooks, setLoadingBooks] = useState(false);

  const [form, setForm] = useState({
    durationType: "days",
    duration: 1,
    goalType: "pages",
    goalValue: 10,
  });

  const fetchChallenge = async () => {
    try {
      const res = await axios.get("http://localhost:3001/reading-challenge", {
        withCredentials: true,
      });
      setChallenge(res.data);
    } catch {
      console.log("No existing challenge.");
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
    fetchChallenge();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleBookToggle = (bookId) => {
    setSelectedBooks((prev) =>
      prev.includes(bookId)
        ? prev.filter((id) => id !== bookId)
        : [...prev, bookId]
    );
  };

  const handleStartClick = () => {
    setShowForm(true);
    fetchBooks();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Calculate start and end dates
    const now = new Date();
    const startDate = now.toISOString();

    let end = new Date(now);
    const duration = parseInt(form.duration, 10);

    switch (form.durationType) {
      case "days":
        end.setDate(end.getDate() + duration);
        break;
      case "weeks":
        end.setDate(end.getDate() + duration * 7);
        break;
      case "months":
        end.setMonth(end.getMonth() + duration);
        break;
      default:
        console.error("Invalid durationType");
    }

    const endDate = end.toISOString();

    try {
      await axios.post(
        "http://localhost:3001/reading-challenge",
        {
          ...form,
          selectedBooks,
          startDate,
          endDate,
        },
        { withCredentials: true }
      );
      fetchChallenge();
      setShowForm(false);
    } catch (err) {
      console.error("Error starting challenge:", err);
    }
  };

  return (
    <div className="challenge-container">
  <h2 className="challenge-title">📚 Reading Challenge</h2>

  {!challenge && !showForm && (
    <div className="text-center">
      <p className="mb-4">You don't have an active challenge.</p>
      <button onClick={handleStartClick} className="btn btn-blue">
        Get Started
      </button>
    </div>
  )}

  {showForm && (
    <form onSubmit={handleSubmit} className="challenge-form">
      <div>
        <label>Duration Type</label>
        <select name="durationType" value={form.durationType} onChange={handleChange}>
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
        <select name="goalType" value={form.goalType} onChange={handleChange}>
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
                  onChange={() => handleBookToggle(book._id)}
                />
                <span>{book.title}</span>
              </label>
            ))
          )}
        </div>
      </div>

      <button type="submit" className="btn btn-green">
        Start Challenge
      </button>
    </form>
  )}

  {challenge && (
    <div className="challenge-summary">
      <h3>🎯 Current Challenge</h3>
      <p>
        Duration: {challenge.duration} {challenge.durationType}
      </p>
      <p>
        Goal: {challenge.goalValue} {challenge.goalType}
      </p>
      <p>
        Ends on: {new Date(challenge.endDate).toLocaleDateString()}
      </p>

      {challenge.selectedBooks?.length > 0 && (
        <div>
          <p>📚 Books in Challenge:</p>
          <ul>
            {challenge.selectedBooks.map((book) => (
              <li key={book._id}>{book.title}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )}
</div>

  );
};

export default Challenge;
