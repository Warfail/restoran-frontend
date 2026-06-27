import os

target_dir = r'd:\KULIAH\SEM 4\PA\TA Singkong\restoran-frontend\src'

def process_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    original = content
    keys = ['"token"', '"role"', '"user"', "'token'", "'role'", "'user'"]
    for key in keys:
        content = content.replace(f'localStorage.getItem({key})', f'sessionStorage.getItem({key})')
        content = content.replace(f'localStorage.setItem({key}', f'sessionStorage.setItem({key}')
        content = content.replace(f'localStorage.removeItem({key})', f'sessionStorage.removeItem({key})')

    if content != original:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f'Updated {filepath}')

for root, _, files in os.walk(target_dir):
    for file in files:
        if file.endswith('.js') or file.endswith('.jsx'):
            process_file(os.path.join(root, file))
print('Migration to sessionStorage completed!')
