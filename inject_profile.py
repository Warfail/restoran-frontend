import os
import re

files_to_update = [
    "d:/KULIAH/SEM 4/PA/TA Singkong/restoran-frontend/src/pages/UserManagementpage.jsx",
    "d:/KULIAH/SEM 4/PA/TA Singkong/restoran-frontend/src/pages/UserListPage.jsx",
    "d:/KULIAH/SEM 4/PA/TA Singkong/restoran-frontend/src/pages/MenuManagementPage.jsx",
    "d:/KULIAH/SEM 4/PA/TA Singkong/restoran-frontend/src/pages/SalesReportPage.jsx",
    "d:/KULIAH/SEM 4/PA/TA Singkong/restoran-frontend/src/pages/InventoryPageNew.jsx",
    "d:/KULIAH/SEM 4/PA/TA Singkong/restoran-frontend/src/pages/InventoryPage.jsx",
    "d:/KULIAH/SEM 4/PA/TA Singkong/restoran-frontend/src/pages/CashierDashboard.jsx",
    "d:/KULIAH/SEM 4/PA/TA Singkong/restoran-frontend/src/pages/AddMenuPage.jsx",
    "d:/KULIAH/SEM 4/PA/TA Singkong/restoran-frontend/src/components/admin/Sidebar.jsx",
    "d:/KULIAH/SEM 4/PA/TA Singkong/restoran-frontend/src/pages/AdminDashboard.jsx",
    "d:/KULIAH/SEM 4/PA/TA Singkong/restoran-frontend/src/pages/KitchenDashboard.jsx"
]

header_replacement = '''<div className="text-right">
                <div className="text-gray-900 text-sm font-semibold">{currentUser?.fullName || currentUser?.username || "Loading..."}</div>
                <div className="text-gray-500 text-xs font-medium">{currentUser?.role?.toUpperCase() || "ROLE"}</div>
              </div>
              <div className="w-9 h-9 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold overflow-hidden shadow-sm border border-gray-200">
                {currentUser?.profilePicture ? (
                  <img src={currentUser.profilePicture} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  (currentUser?.fullName || currentUser?.username || "U").charAt(0).toUpperCase()
                )}
              </div>'''

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

for file_path in files_to_update:
    if not os.path.exists(file_path):
        continue
        
    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()

    # 1. Add SettingsModal import
    if "SettingsModal" not in content:
        import_path = "../components/SettingsModal"
        if "components/admin" in file_path:
            import_path = "../../components/SettingsModal"
        
        # Insert after last import
        imports = re.findall(r'^import .*?;?\n', content, re.MULTILINE)
        if imports:
            last_import = imports[-1]
            content = content.replace(last_import, last_import + f'import SettingsModal from "{import_path}";\n')

    # 2. Inject State
    if "const [currentUser" not in content:
        # Find export default function
        match = re.search(r'export default function\s+[A-Za-z0-9_]+\s*\([^)]*\)\s*{', content)
        if match:
            content = content[:match.end()] + state_injection + content[match.end():]
            
            # ensure useEffect and useState are imported
            if "useEffect" not in content:
                content = content.replace('import { useState }', 'import { useState, useEffect }')
                if 'import React, { useState }' in content:
                    content = content.replace('import React, { useState }', 'import React, { useState, useEffect }')

    # 3. Add onClick to Pengaturan button
    # We look for a button containing <Settings and <span>Pengaturan</span>
    btn_pattern = r'(<button[^>]*?)>(\s*<[^>]*Settings[^>]*>|<i[^>]*ti-settings[^>]*>)\s*(<span[^>]*>Pengaturan</span>)'
    content = re.sub(btn_pattern, r'\1 onClick={() => setIsSettingsOpen(true)}>\2\3', content)

    # 4. Replace Header Profile
    # The header has <div className="text-right"> ... </div> followed by avatar <img> or <div ... rounded-full bg-orange-500 ...>
    header_pattern = r'<div className="text-right">[\s\S]*?</div>\s*(?:<img src="https://placehold\.co/[^"]*"[^>]*/>|<div className="[^"]*w-9 h-9 rounded-full bg-orange-500[^"]*">.*?</div>)'
    content = re.sub(header_pattern, header_replacement, content)
    
    # Check AdminDashboard specifically for header, it just has <p className="text-gray-500 mt-1">Selamat datang, Admin</p>
    if "AdminDashboard.jsx" in file_path:
        content = re.sub(r'<p className="text-gray-500 mt-1">Selamat datang, Admin</p>', r'<p className="text-gray-500 mt-1">Selamat datang, {currentUser?.fullName || currentUser?.username || "Admin"}</p>', content)
        
    # 5. Add <SettingsModal> at the end
    if "<SettingsModal" not in content:
        # Find the last closing tag of the main component. This is tricky.
        # We can just insert it before the last </div> or </aside> or whatever is the last tag before }
        # Or simpler: replace `return (` with `return (\n    <>` and the very last `);` with `<SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} user={currentUser} onUpdate={(u) => setCurrentUser(u)} />\n    </>\n  );`
        # But some files don't end cleanly.
        # A simpler approach: replace `    </div>\n  );\n}` with `      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} user={currentUser} onUpdate={(u) => setCurrentUser(u)} />\n    </div>\n  );\n}`
        # Let's try replacing the last `  );\n}`
        
        modal_str = '\n      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} user={currentUser} onUpdate={(u) => setCurrentUser(u)} />'
        
        # reverse replace
        idx = content.rfind('  );\n}')
        if idx != -1:
            # check if it's returning a single element. We can inject right before `);` but it must be inside the element.
            # So we better inject right before the last closing tag `</div>\n  );\n}`
            # Let's use regex to find the last tag before `  );`
            last_tag_match = re.search(r'(</[A-Za-z0-9_]+>)\s*\);\s*}$', content)
            if last_tag_match:
                content = content[:last_tag_match.start()] + modal_str + '\n    ' + content[last_tag_match.start():]

    with open(file_path, "w", encoding="utf-8") as f:
        f.write(content)
        
    print(f"Updated {file_path}")
