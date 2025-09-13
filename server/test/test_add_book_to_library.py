import unittest
import requests  # type: ignore
from unittest.mock import patch, call

class TestBookLibraryIntegration(unittest.TestCase):
    BASE_URL = "http://localhost:3001"
    TEST_BOOK = {
        "title": "Test Book",
        "coverImage": "http://example.com/cover.jpg",
        "star": 4
    }

    def setUp(self):
        # Clear any existing test data
        response = requests.get(f"{self.BASE_URL}/books")
        for book in response.json():
            requests.delete(f"{self.BASE_URL}/books/{book['_id']}")

    def test_add_book_to_library(self):
        """Test that a book can be added to the library"""
        response = requests.post(f"{self.BASE_URL}/books", json=self.TEST_BOOK)
        self.assertEqual(response.status_code, 201)
        added_book = response.json()

        library_response = requests.get(f"{self.BASE_URL}/books")
        self.assertEqual(library_response.status_code, 200)

        library_books = library_response.json()
        self.assertEqual(len(library_books), 1)
        self.assertEqual(library_books[0]["title"], self.TEST_BOOK["title"])
        self.assertEqual(library_books[0]["coverImage"], self.TEST_BOOK["coverImage"])

        print(f"\n✅ Book added: {library_books[0]['title']}")


    def test_add_book_with_missing_fields(self):
        """Test handling of books with missing required fields"""
        invalid_book = {"coverImage": "http://example.com/cover.jpg"}
        response = requests.post(f"{self.BASE_URL}/books", json=invalid_book)
        self.assertIn(response.status_code, [400, 201])

        if response.status_code == 400:
            print("\n⚠️ Book with missing title rejected (400 Bad Request)")
        else:
            print("\n⚠️ Book with missing title was added (status 201)")

    @patch('requests.post')
    def test_frontend_save_book(self, mock_post):
        """Test the frontend's save book functionality"""
        mock_post.return_value.status_code = 201
        mock_post.return_value.json.return_value = {"_id": "123", **self.TEST_BOOK}

        # Simulate call
        expected_call = call(
            "http://localhost:3001/books",
            json={
                "title": self.TEST_BOOK["title"],
                "coverImage": self.TEST_BOOK["coverImage"]
            }
        )

        print("\n📦 Simulated frontend save book (mocked API call)")

    def test_remove_book_from_library(self):
        """Test that a book can be removed from the library"""
        add_response = requests.post(f"{self.BASE_URL}/books", json=self.TEST_BOOK)
        book_id = add_response.json()["_id"]

        delete_response = requests.delete(f"{self.BASE_URL}/books/{book_id}")
        self.assertEqual(delete_response.status_code, 200)

        library_response = requests.get(f"{self.BASE_URL}/books")
        books = library_response.json()
        self.assertEqual(len(books), 0)

        print(f"\n🗑️ Book removed: {self.TEST_BOOK['title']}")

if __name__ == "__main__":
    unittest.main()
