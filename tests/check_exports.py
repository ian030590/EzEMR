import csv
from io import StringIO
from pathlib import Path
import zipfile

import pymupdf
from pypdf import PdfReader

output = Path(__file__).resolve().parents[1] / '.tmp' / 'verification'
pdf = output / 'multi-page.pdf'
reader = PdfReader(pdf, strict=True)
assert len(reader.pages) >= 3
assert all(float(page.mediabox.width) > 590 for page in reader.pages)
doc = pymupdf.open(pdf)
doc[0].get_pixmap(matrix=pymupdf.Matrix(1.2, 1.2)).save(output / 'pdf-first-page.png')
doc[-1].get_pixmap().save(output / 'pdf-last-page.png')
assert all(len(page.get_images()) == 1 for page in doc)
with zipfile.ZipFile(output / 'session.zip') as archive:
    assert archive.testzip() is None
    names = archive.namelist()
    assert len(names) == 2
    assert {Path(name).suffix for name in names} == {'.csv', '.pdf'}
    assert all(name.startswith('TEST-甲/') for name in names)
    csv_name = next(name for name in names if name.endswith('.csv'))
    rows = list(csv.DictReader(StringIO(archive.read(csv_name).decode('utf-8-sig'), newline='')))
    assert any(row['field'] == '/subjective' and '中文 PDF' in row['value'] for row in rows)
    assert all(row['schema_version'] == '1' for row in rows)
print(f'PASS: independent PDF reader/render ({len(reader.pages)} A4 pages), ZIP CRC, UTF-8 paths and CSV data')
