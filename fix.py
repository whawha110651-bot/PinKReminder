import sys
sys.stdout.reconfigure(encoding='utf-8')
import re

with open('src/pages/Login.jsx', 'r', encoding='utf-8') as f:
    lines = f.read().split('\n')

correct = 'แอคเคาต์'

# Better approach: match "แอค" + specific non-standard chars (Devanagari U+09xx) or wrong Thai combos
# We want to capture only the misspelled portion, not trailing Thai words like เดี๋ยวนี้/ได้เลย/ของคุณ/etc.

def fix_line(line):
    # Find all occurrences of words starting with แอค
    result = line
    offset = 0
    while True:
        pos = result.find('แอค', offset)
        if pos == -1:
            break

        # Read forward char by char until whitespace or HTML tag start
        end = pos + 3  # start after "แอค"
        word_chars = []
        while end < len(result) and result[end] not in (' ', '\n', '<', '>', '&'):
            ch = result[end]
            o = ord(ch)
            # Check for Devanagari (U+0900-U+097F) or NIKHAHIT (U+0E4C)
            if (0x0900 <= o <= 0x097F) or ch == '์':  # Thai NIKHAHIT
                # This is a typo - find where devanagari/nikhahit ends
                word_chars.append(ch)
                end += 1
                continue
            elif 0x0E00 <= o <= 0x0E7F:
                # Standard Thai char - if we've seen bad chars before, stop here
                if word_chars:
                    break
                word_chars.append(ch)
                end += 1
            else:
                # Unknown - stop
                break

        if word_chars:
            # Found a word with mixed Devanagari/Thai chars
            bad_word_start = pos
            bad_word_end = end
            print(f'  Line {result[:pos].count(chr(10))+1}: fixing "{result[bad_word_start:bad_word_end]}" → "{correct}"')
            result = result[:bad_word_start] + correct + result[bad_word_end:]
            offset = bad_word_start + len(correct)
        else:
            offset = pos + 1

    return result

new_lines = []
fixes = 0
for i, line in enumerate(lines):
    new_line = fix_line(line)
    if new_line != line:
        fixes += 1
    new_lines.append(new_line)

if fixes > 0:
    with open('src/pages/Login.jsx', 'w', encoding='utf-8') as f:
        f.write('\n'.join(new_lines))
    print(f'\nFixed {fixes} lines!')
else:
    print('No typos found (maybe already fixed?)')
