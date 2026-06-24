import os
import re

directory = "d:/KULIAH/SEM 4/PA/TA Singkong/restoran-frontend/src/pages"

circle_pattern1 = re.compile(r'<div className="w-\[72px\] h-\[72px\] rounded-full border-2 border-red-600 flex items-center justify-center">\s*<span className="text-red-600 font-bold text-\[22px\] tracking-tight">D-9</span>\s*</div>')
circle_repl1 = r'<div className="w-[72px] h-[72px] rounded-full border-2 border-red-600 flex items-center justify-center overflow-hidden">\n              <img src="/logo.png" alt="Logo" className="w-full h-full object-cover" />\n            </div>'

circle_pattern2 = re.compile(r'<div className="w-\[72px\] h-\[72px\] rounded-full border-3 border-red-500 flex items-center justify-center mb-5">\s*<span className="text-red-500 text-\[22px\] font-bold tracking-tight">D-9</span>\s*</div>')
circle_repl2 = r'<div className="w-[72px] h-[72px] rounded-full border-3 border-red-500 flex items-center justify-center mb-5 overflow-hidden">\n            <img src="/logo.png" alt="Logo" className="w-full h-full object-cover" />\n          </div>'

circle_pattern3 = re.compile(r'<div className="w-17 h-17 rounded-full border-3 border-red-600 flex items-center justify-center">\s*<span className="text-red-600 font-bold text-3xl">D-9</span>\s*</div>')
circle_repl3 = r'<div className="w-17 h-17 rounded-full border-3 border-red-600 flex items-center justify-center overflow-hidden">\n              <img src="/logo.png" alt="Logo" className="w-full h-full object-cover" />\n            </div>'

sidebar_pattern = re.compile(r'(<h2 className="text-xl font-e?x?t?r?a?bold text-white(?: tracking-tight)?">Singkong Keju D9</h2>)')
sidebar_repl = r'<div className="flex items-center gap-3">\n            <img src="/logo.png" alt="Logo" className="w-8 h-8 object-contain rounded-full bg-white p-0.5" />\n            \1\n          </div>'

for filename in os.listdir(directory):
    if filename.endswith(".jsx"):
        filepath = os.path.join(directory, filename)
        with open(filepath, "r", encoding="utf-8") as f:
            content = f.read()

        new_content = circle_pattern1.sub(circle_repl1, content)
        new_content = circle_pattern2.sub(circle_repl2, new_content)
        new_content = circle_pattern3.sub(circle_repl3, new_content)
        new_content = sidebar_pattern.sub(sidebar_repl, new_content)

        if new_content != content:
            with open(filepath, "w", encoding="utf-8") as f:
                f.write(new_content)
            print(f"Updated {filename}")
