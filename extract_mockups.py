import fitz

pdf_path = "/Users/tavarus/.gemini/antigravity/brain/cf55fa11-5b7a-4177-94a0-c97b3fb39087/.user_uploaded/media_1787925471853.pdf"
doc = fitz.open(pdf_path)

for i in [2, 3]:
    page = doc.load_page(i)
    pix = page.get_pixmap()
    pix.save(f"priscilla_mockup_{i}.png")
    print(f"Saved priscilla_mockup_{i}.png")

