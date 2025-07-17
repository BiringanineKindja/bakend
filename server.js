import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import mongoose from 'mongoose';

dotenv.config();
mongoose.connect(process.env.MONGODB_URL)
    .then(() => console.log('database successful connected'))
    .catch(err => console.error('database connection error:', err));

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const booksSchema = new mongoose.Schema({
    id: String,
    title: String,
    pages: Number,
    author: String,
});
const Book = mongoose.model('books', booksSchema);

app.get('/', (req, res) => {
    res.send('Welcome to the Book');
});

app.get('/books', async (req, res) => {
  try {
    const books = await Book.find();
    res.json(books);
  } catch (error) {
    console.error('Error fetching books:', error);
    
  }
});



//post
app.post('/books', async (req, res) => {
  try {
    const { id, title, pages, author } = req.body;
    const newBook = new Book({ id, title, pages, author });
    await newBook.save();
    res.json("New book created",newBook);
    
  } catch (error) {
    console.error('Error creating book:', error);
    
  }
})

//get by id
app.get('/books/:id', async (req, res) => {
  try {
    const id = req.params.id;

    const newBook = await Book.findById(id);
    res.json(newBook);
  } catch (error) {
    console.error('Error fetching book by ID:', error);
    
  }
}
)



app.put('/books/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const { title, pages, author } = req.body;

    const updatedBook = await Book.findByIdAndUpdate(
        id,
        { title, pages, author },
     
        ); 
   res.status(202).json(updatedBook);

  } catch (error) {     
 res.status(400).json('Error updating book:', error);
    
  }         
});       
app.delete('/books/:id', async(req,res) =>{
  try{
    const id = req.params.id;
    const deleteBook = await Book.findByIdAndDelete(id);
    res.status(202).json("succesful delete book",deleteBook)
    

  }
  catch(err){
    res.status(400).json("cannot delete",err)
  }
})

app.listen(4000, () => {
    console.log('Server is running on port 4000');
} );