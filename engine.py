# engine.py
import sys
import json
from pdf2docx import Converter
from docx2pdf import convert as word2pdf
from pypdf import PdfWriter

def main():
    try:
        cmd = sys.argv[1]
        if cmd == "pdf2word":
            cv = Converter(sys.argv[2])
            cv.convert(sys.argv[3])
            cv.close()
        elif cmd == "word2pdf":
            word2pdf(sys.argv[2], sys.argv[3])
        elif cmd == "merge":
            merger = PdfWriter()
            for pdf in sys.argv[2:-1]:
                merger.append(pdf)
            merger.write(sys.argv[-1])
            merger.close()
        print(json.dumps({"success": True}))
    except Exception as e:
        print(json.dumps({"success": False, "error": str(e)}))

if __name__ == "__main__":
    main()