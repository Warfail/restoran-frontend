import os
import re

files_with_helpers = [
    "d:/KULIAH/SEM 4/PA/TA Singkong/restoran-frontend/src/pages/SalesReportPage.jsx",
    "d:/KULIAH/SEM 4/PA/TA Singkong/restoran-frontend/src/pages/MenuManagementPage.jsx",
    "d:/KULIAH/SEM 4/PA/TA Singkong/restoran-frontend/src/pages/KitchenDashboard.jsx"
]

modal_str = '\n      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} user={currentUser} onUpdate={(u) => setCurrentUser(u)} />'

for file_path in files_with_helpers:
    if not os.path.exists(file_path):
        continue
    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()

    # remove modal_str if it exists anywhere
    content = content.replace(modal_str, "")
    
    # Also remove it if it has different indentation
    content = re.sub(r'\s*<SettingsModal isOpen={isSettingsOpen} onClose={\(\) => setIsSettingsOpen\(false\)} user={currentUser} onUpdate={\(u\) => setCurrentUser\(u\)} />\s*', '', content)
    
    # inject state if missing
    state_injection = '''
  const [currentUser, setCurrentUser] = useState(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      try { setCurrentUser(JSON.parse(userStr)); } catch(e) {}
    }
  }, []);
'''
    if "const [currentUser" not in content:
        match = re.search(r'export default function\s+[A-Za-z0-9_]+\s*\([^)]*\)\s*{', content)
        if match:
            content = content[:match.end()] + state_injection + content[match.end():]
            
            if "useEffect" not in content:
                content = content.replace('import { useState }', 'import { useState, useEffect }')
                if 'import React, { useState }' in content:
                    content = content.replace('import React, { useState }', 'import React, { useState, useEffect }')

    # Find the end of the main component which is export default function ...
    # We can just look for </main> to be safe, since all pages use <main>
    # Find the last </main> inside the file
    main_match = list(re.finditer(r'</main>', content))
    if main_match:
        last_main_end = main_match[-1].start()
        content = content[:last_main_end] + modal_str + '\n      ' + content[last_main_end:]
    
    with open(file_path, "w", encoding="utf-8") as f:
        f.write(content)
    print("Fixed SettingsModal in", file_path)

# Fix UserManagementpage.jsx import issue
user_mgt_path = "d:/KULIAH/SEM 4/PA/TA Singkong/restoran-frontend/src/pages/UserManagementpage.jsx"
if os.path.exists(user_mgt_path):
    with open(user_mgt_path, "r", encoding="utf-8") as f:
        content = f.read()
    
    # Check if there is broken import
    if "import { \nimport SettingsModal" in content or "import {\nimport" in content or "import toast from" in content:
        # We will extract all proper imports, remove broken ones, and rebuild the top
        # Actually, let's just find the exact broken text and fix it
        broken_pattern = r'import \{ \s*import SettingsModal from "\.\./components/SettingsModal";\s*'
        content = re.sub(broken_pattern, 'import { \n  ', content)
        
        # move import SettingsModal to top
        content = content.replace('import SettingsModal from "../components/SettingsModal";', '')
        content = 'import SettingsModal from "../components/SettingsModal";\n' + content
        
        # move toast to top
        content = content.replace('import toast from "react-hot-toast";\n', '')
        content = 'import toast from "react-hot-toast";\n' + content

        # Just to be safe, let's fix any `import { \n  import ` that might remain
        content = re.sub(r'import\s+\{\s*import', 'import {\n  ', content)
        
    with open(user_mgt_path, "w", encoding="utf-8") as f:
        f.write(content)
    print("Fixed imports in UserManagementpage.jsx")

# Fix UserListPage set state in effect warning
user_list_path = "d:/KULIAH/SEM 4/PA/TA Singkong/restoran-frontend/src/pages/UserListPage.jsx"
if os.path.exists(user_list_path):
    with open(user_list_path, "r", encoding="utf-8") as f:
        content = f.read()
        
    # we can ignore the warning or fix the fetchUsers order
    # It says fetchUsers is accessed before declared
    # Let's move the fetchUsers function above useEffect
    match_fetch = re.search(r'const fetchUsers = async \(\) => \{[\s\S]*?\n  \};', content)
    match_effect = re.search(r'useEffect\(\(\) => \{\s*fetchUsers\(\);\s*\}, \[\]\);', content)
    
    if match_fetch and match_effect and match_fetch.start() > match_effect.start():
        fetch_str = match_fetch.group(0)
        content = content[:match_fetch.start()] + content[match_fetch.end():]
        content = content[:match_effect.start()] + fetch_str + '\n\n  ' + content[match_effect.start():]
        
    with open(user_list_path, "w", encoding="utf-8") as f:
        f.write(content)
    print("Fixed fetchUsers in UserListPage.jsx")
