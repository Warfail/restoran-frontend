import os
import re

directory = "d:/KULIAH/SEM 4/PA/TA Singkong/restoran-frontend/src/pages"

for filename in os.listdir(directory):
    if not filename.endswith(".jsx"): continue
    
    filepath = os.path.join(directory, filename)
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()
        
    if "alert(" not in content:
        continue
        
    # Replace alert(...) with toast.success or toast.error based on text
    def replacer(match):
        text = match.group(1)
        lower_text = text.lower()
        if "berhasil" in lower_text or "✅" in lower_text:
            return f"toast.success({text})"
        elif "gagal" in lower_text or "kesalahan" in lower_text or "kosong" in lower_text or "terlebih dahulu" in lower_text or "harus" in lower_text or "masukkan" in lower_text:
            return f"toast.error({text})"
        else:
            return f"toast({text})"
            
    new_content = re.sub(r'alert\((.*?)\)', replacer, content)
    
    # Add import toast if not exists
    if "import toast" not in new_content:
        # Find the last import statement
        imports = re.findall(r'^import .*?;?\n', new_content, re.MULTILINE)
        if imports:
            last_import = imports[-1]
            new_content = new_content.replace(last_import, last_import + 'import toast from "react-hot-toast";\n')
        else:
            new_content = 'import toast from "react-hot-toast";\n' + new_content
            
    with open(filepath, "w", encoding="utf-8") as f:
        f.write(new_content)
        
    print(f"Updated {filename}")
