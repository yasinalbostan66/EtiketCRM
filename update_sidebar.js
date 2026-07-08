const fs = require('fs');
const path = require('path');

const dir = './';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

files.forEach(file => {
    if (file === 'iadeler.html') return; // Zaten doğru
    const filePath = path.join(dir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Find the block:
    // <a href="odeme_takibi.html" class="nav-item">
    //     <i class="fa-solid fa-money-bill-transfer"></i>
    //     Ödeme Takibi & Cari
    // </a>
    // We will use a regex to match it, including "nav-item active" variations.
    
    const regex = /(<a href="odeme_takibi\.html" class="nav-item(?: active)?">\s*<i class="fa-solid fa-money-bill-transfer"><\/i>\s*Ödeme Takibi & Cari\s*<\/a>)/g;
    
    if (regex.test(content)) {
        const replacement = `$1\n                <a href="iadeler.html" class="nav-item">\n                    <i class="fa-solid fa-rotate-left"></i>\n                    İade Yönetimi\n                </a>`;
        content = content.replace(regex, replacement);
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Updated ${file}`);
    } else {
        console.log(`Could not match regex in ${file}`);
    }
});
