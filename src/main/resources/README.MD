## DocumentSplitters Explained
What is DocumentSplitters?
- DocumentSplitters is a utility/factory class in LangChain4j.
- It provides static methods to create different types of DocumentSplitter objects.
- You never use DocumentSplitter directly; you always get an instance from DocumentSplitters.

## Why Use It?
- Splitting large documents into smaller chunks is essential for processing with LLMs and embedding models.
- Different splitting strategies are needed for different use cases (by sentence, by paragraph, recursive, etc.).
- DocumentSplitters hides the complexity and lets you easily choose the strategy you want.

// Recursive splitting (with overlap)
- DocumentSplitter splitter = DocumentSplitters.recursive(1000, 200);
  public class RecursiveDocumentSplitter extends DocumentSplitter {
    // Stores maxSegmentSize and overlap

    @Override
    public List<TextSegment> split(Document document) {
        // Logic to split document.text() into overlapping chunks
        // Returns a list of TextSegment objects
    }
}

// By sentence
- DocumentSplitter splitter = DocumentSplitters.bySentence();
 public static DocumentSplitter bySentence() {
        return new SentenceDocumentSplitter();
    }

// By paragraph
- DocumentSplitter splitter = DocumentSplitters.byParagraph();

- Each method returns a DocumentSplitter instance with the chosen strategy.
- You then call split(doc) on the splitter to get your chunks.

## What’s Under the Hood?
- The actual splitting logic is implemented in hidden classes (like RecursiveDocumentSplitter).
- You don’t need to know the details—just use the factory method that fits your needs.

Summary:

Always use DocumentSplitters.<strategy>() to get a splitter.
The returned splitter knows how to break your document into chunks.
This pattern keeps your code simple and lets you swap strategies easily.


## What does .builder() do?
It returns a builder object for the class.
The builder lets you set up (configure) all the options you want, step by step, using method chaining.
When you’re done, you call .build() to create the final object.