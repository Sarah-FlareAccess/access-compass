"""
Convert all-modules-questions.tsv (with embedded raw newlines inside cells)
into a properly quoted CSV for Google Sheets.

Logic: a logical row has EXACTLY 40 tab-separated fields (39 tabs).
We accumulate physical lines until tab-count == 39, then emit one record.
Embedded newlines inside the last field of a logical row become " / "
within the cell so Sheets keeps everything on one row.
"""
import csv
from pathlib import Path

SRC = Path(r"C:\Users\Nebula PC\access-compass\exports\all-modules-questions.tsv")
DST = Path(r"C:\Users\Nebula PC\access-compass\exports\all-modules-questions.csv")

EXPECTED_COLS = 40

with SRC.open("r", encoding="utf-8", newline="") as f:
    raw = f.read()

# Normalise line endings
raw = raw.replace("\r\n", "\n").replace("\r", "\n")
physical_lines = raw.split("\n")

records = []
buffer = ""
for line in physical_lines:
    if buffer:
        # Continuation of the previous logical row: join with newline placeholder.
        # The newline belongs INSIDE the last field of the previous buffer.
        buffer = buffer + "\n" + line
    else:
        buffer = line

    if buffer.count("\t") >= EXPECTED_COLS - 1:
        fields = buffer.split("\t")
        # If too many fields (would mean over-merge), don't auto-split — just keep as is
        if len(fields) > EXPECTED_COLS:
            # Merge extras into the last field
            fields = fields[:EXPECTED_COLS - 1] + ["\t".join(fields[EXPECTED_COLS - 1:])]
        # Replace embedded newlines with " / " so Sheets cells render cleanly on one visual line.
        # If you'd prefer literal newlines kept inside the cell, change "\n" -> "\n" below.
        cleaned = [field.replace("\n", " / ") for field in fields]
        records.append(cleaned)
        buffer = ""

# If anything left in buffer at end (incomplete row), flush it
if buffer.strip():
    fields = buffer.split("\t")
    while len(fields) < EXPECTED_COLS:
        fields.append("")
    cleaned = [field.replace("\n", " / ") for field in fields]
    records.append(cleaned)

with DST.open("w", encoding="utf-8", newline="") as f:
    writer = csv.writer(f, quoting=csv.QUOTE_MINIMAL, lineterminator="\n")
    for row in records:
        writer.writerow(row)

print(f"Wrote {len(records)} rows ({len(records) - 1} data rows) to {DST}")
