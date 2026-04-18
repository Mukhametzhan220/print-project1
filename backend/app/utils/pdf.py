from io import BytesIO


def count_pdf_pages(data: bytes) -> int | None:
    try:
        from pypdf import PdfReader

        reader = PdfReader(BytesIO(data))
        return len(reader.pages)
    except Exception:
        return None
