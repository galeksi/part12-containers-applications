const DataLoader = require("dataloader");
const Book = require("./models/book");

const bookCountLoader = new DataLoader(async (authorIds) => {
  const books = await Book.find({});
  return authorIds.map((id) => {
    const booksByAuthor = books.filter(
      (b) => JSON.stringify(b.author) === JSON.stringify(id)
    );
    return booksByAuthor.length;
  });
});

module.exports = bookCountLoader;
