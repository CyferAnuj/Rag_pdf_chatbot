
from pypdf import PdfReader
from langchain_core.documents import Document


def load_pdf(file_path: str):
    reader = PdfReader(file_path)

    documents = []

    for page_number, page in enumerate(reader.pages, start=1):
        page_text = page.extract_text()

        if page_text and page_text.strip():
            doc = Document(
                page_content=page_text,
                metadata={
                    "source": file_path,
                    "page": page_number
                }
            )

            documents.append(doc)

    return documents
