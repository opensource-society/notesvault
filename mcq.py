import docx
import PyPDF2
import re

# ---------------- Read Notes ---------------- #

def read_txt(path):
    with open(path, "r", encoding="utf-8") as f:
        return f.read()

def read_docx(path):
    doc = docx.Document(path)
    return "\n".join([p.text for p in doc.paragraphs])

def read_pdf(path):
    text = ""
    with open(path, "rb") as f:
        reader = PyPDF2.PdfReader(f)
        for page in reader.pages:
            page_text = page.extract_text()
            if page_text:
                text += page_text + "\n"
    return text

# ---------------- Process Text ---------------- #

def clean_text(text):
    """Combine lines into paragraphs and remove extra spaces."""
    # Remove multiple spaces
    text = re.sub(r'\s+', ' ', text)
    # Replace multiple newlines with period + space
    text = re.sub(r'\n+', '. ', text)
    return text

def extract_questions(text):
    """
    Convert cleaned notes into question-like sentences.
    Skips headings, tables, and very short or fragment lines.
    """
    questions = []
    # Split by periods to get sentences
    sentences = [s.strip() for s in text.split(".") if len(s.strip()) > 20]

    for sentence in sentences:
        # Skip lines that look like tables or headings
        if re.match(r'^[A-Z ]+$', sentence):
            continue
        if sentence.lower().startswith("table"):
            continue
        # Convert to question-like format
        if ":" in sentence:
            part = sentence.split(":")[0]
            questions.append(f"What is {part.strip()}?")
        else:
            questions.append(f"What does the following mean? {sentence.strip()}")
    return questions

# ---------------- Main Program ---------------- #

if __name__ == "__main__":
    path = input("Enter your notes file (TXT, PDF, DOCX): ").strip()

    while True:
        try:
            num = int(input("How many questions do you want? (5-20, avg 15 recommended): "))
            if 5 <= num <= 20:
                break
            print("Please choose a number between 5 and 20.")
        except ValueError:
            print("Enter a valid number.")

    # Read the file
    if path.endswith(".txt"):
        text = read_txt(path)
    elif path.endswith(".docx"):
        text = read_docx(path)
    elif path.endswith(".pdf"):
        text = read_pdf(path)
    else:
        print("Unsupported file type!")
        exit()

    # Clean and process text
    text = clean_text(text)
    questions = extract_questions(text)

    if len(questions) < num:
        print(f"Only {len(questions)} suitable questions found. Generating that many.")
        num = len(questions)

    # Print questions
    print("\n--- Your Questions ---\n")
    for i, q in enumerate(questions[:num], 1):
        print(f"{i}. {q}\n")
