import os
import glob

html_files = glob.glob('*.html')

for file in html_files:
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Check if already added
    if 'sevkiyat.html' in content and 'Sevkiyat Yönetimi' in content and file != 'sevkiyat.html':
        continue
        
    # We want to insert Sevkiyat right after Sipariş Oluştur
    # Pattern to search: <a href="siparis.html" class="nav-item"><i class="fa-solid fa-cart-plus"></i> Sipariş Oluştur</a>
    # Note: It might be formatted differently, so let's use string replace on a known part
    
    if '<a href="siparis.html"' in content:
        # Find the end of the siparis link
        parts = content.split('<a href="siparis.html"')
        if len(parts) > 1:
            part2 = parts[1]
            end_idx = part2.find('</a>')
            if end_idx != -1:
                end_idx += 4
                new_link = '\n                <a href="sevkiyat.html" class="nav-item">\n                    <i class="fa-solid fa-truck-fast"></i>\n                    Sevkiyat Yönetimi\n                </a>'
                
                # Check for inline format
                if 'Sipariş Oluştur</a>' in part2[:end_idx]:
                    new_link = '\n                <a href="sevkiyat.html" class="nav-item"><i class="fa-solid fa-truck-fast"></i> Sevkiyat Yönetimi</a>'
                
                new_content = parts[0] + '<a href="siparis.html"' + part2[:end_idx] + new_link + part2[end_idx:]
                
                with open(file, 'w', encoding='utf-8') as f:
                    f.write(new_content)
                print(f"Updated {file}")

print("Done!")
