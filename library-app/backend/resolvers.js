const { UserInputError } = require("@apollo/server");
const { PubSub } = require("graphql-subscriptions");
const Book = require("./models/book");
const Author = require("./models/author");
const User = require("./models/user");
const jwt = require("jsonwebtoken");
// const bookCountLoader = require("./loaders");
require("dotenv").config();

const pubsub = new PubSub();
const JWT_SECRET = process.env.JWT_SECRET;

const filterByAuthor = (books, author) =>
  books.filter((b) => b.author.name === author);

const filterByGenre = (books, genre) =>
  books.filter((b) => b.genres.find((g) => g === genre));

const resolvers = {
  Query: {
    bookCount: async () => Book.collection.countDocuments(),
    authorCount: async () => Author.collection.countDocuments(),
    allBooks: async (root, args) => {
      const books = await Book.find({}).populate("author");
      if (args.author && args.genre) {
        const byAuthor = filterByAuthor(books, args.author);
        const byGenre = filterByGenre(byAuthor, args.genre);
        return byGenre;
      } else if (args.author) {
        return filterByAuthor(books, args.author);
      } else if (args.genre) {
        return filterByGenre(books, args.genre);
      } else {
        return Book.find({});
      }
    },
    allAuthors: async () => Author.find({}),
    me: (root, args, context) => {
      return context.currentUser;
    },
  },
  Book: {
    author: async (root) => {
      const author = await Author.findOne({ _id: root.author });
      return {
        id: root.id,
        name: author.name,
        born: author.born,
      };
    },
  },
  Author: {
    bookCount: (root, args, context) => {
      return context.bookCountLoader.load(root._id);
    },
  },
  Mutation: {
    addBook: async (root, args, context) => {
      const currentUser = context.currentUser;
      if (!currentUser) {
        throw new AuthenticationError("not authenticated");
      }

      let author = await Author.findOne({ name: args.author });

      if (!author) {
        author = new Author({ name: args.author });
        try {
          await author.save();
        } catch (error) {
          throw new UserInputError(error.message, {
            invalidArgs: args.author,
          });
        }
      }
      const book = new Book({ ...args, author: author._id });
      try {
        await book.save();
      } catch (error) {
        throw new UserInputError(error.message, {
          invalidArgs: args,
        });
      }

      pubsub.publish("BOOK_ADDED", { bookAdded: book });

      return book;
    },
    editAuthor: async (root, args, context) => {
      const currentUser = context.currentUser;
      if (!currentUser) {
        throw new AuthenticationError("not authenticated");
      }

      const author = await Author.findOne({ name: args.name });
      author.born = args.setBornTo;

      try {
        await author.save();
      } catch (error) {
        throw new UserInputError("Year must be a number", {
          invalidArgs: args.setBornTo,
        });
      }
      return author;
    },
    createUser: async (root, args) => {
      const user = new User({
        username: args.username,
        favouriteGenre: args.favouriteGenre,
      });
      try {
        await user.save();
      } catch (error) {
        throw new UserInputError(error.message, {
          invalidArgs: args,
        });
      }
      return user;
    },
    login: async (root, args) => {
      const user = await User.findOne({ username: args.username });

      if (!user || args.password !== "secret") {
        throw new UserInputError("wrong credentials");
      }

      const userForToken = {
        username: user.username,
        id: user._id,
      };

      return { value: jwt.sign(userForToken, JWT_SECRET) };
    },
  },
  Subscription: {
    bookAdded: {
      subscribe: () => pubsub.asyncIterator("BOOK_ADDED"),
    },
  },
};

module.exports = resolvers;
