import os
import glob
import re

directories = [
    "d:/KULIAH/SEM 4/PA/TA Singkong/restoran-frontend/src/pages",
    "d:/KULIAH/SEM 4/PA/TA Singkong/restoran-frontend/src/components"
]

for directory in directories:
    for root, _, files in os.walk(directory):
        for file in files:
            if not file.endswith(".jsx"):
                continue
            
            filepath = os.path.join(root, file)
            with open(filepath, "r", encoding="utf-8") as f:
                content = f.read()
                
            original_content = content
            
            # Check for broken pattern: import { \n import SettingsModal from ...
            broken_pattern = r'import\s+\{\s*import\s+SettingsModal\s+from\s+"([^"]+)";'
            if re.search(broken_pattern, content):
                match = re.search(broken_pattern, content)
                import_path = match.group(1)
                
                # Replace the broken part with just `import { \n`
                content = re.sub(broken_pattern, 'import {\n  ', content)
                
                # Remove any existing clean SettingsModal imports just in case
                content = re.sub(r'import\s+SettingsModal\s+from\s+"[^"]+";\n?', '', content)
                
                # Prepend the correct import at the top
                content = f'import SettingsModal from "{import_path}";\n' + content
                
            # Another common break: `import { \nimport toast from ...`
            broken_toast = r'import\s+\{\s*import\s+toast\s+from\s+"([^"]+)";'
            if re.search(broken_toast, content):
                match = re.search(broken_toast, content)
                import_path = match.group(1)
                content = re.sub(broken_toast, 'import {\n  ', content)
                content = re.sub(r'import\s+toast\s+from\s+"[^"]+";\n?', '', content)
                content = f'import toast from "{import_path}";\n' + content

            if content != original_content:
                with open(filepath, "w", encoding="utf-8") as f:
                    f.write(content)
                print(f"Fixed {filepath}")
