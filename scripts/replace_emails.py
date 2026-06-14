import os

REPLACEMENTS = {
    "info@shopfastapparel.com": "info@shopfastapparel.com",
    "info@shopfastapparel.com": "info@shopfastapparel.com",
    "info@shopfastapparel.com": "info@shopfastapparel.com"
}

def replace_in_file(filepath):
    try:
        with open(filepath, 'r') as f:
            content = f.read()
            
        new_content = content
        for old_str, new_str in REPLACEMENTS.items():
            new_content = new_content.replace(old_str, new_str)
            
        if new_content != content:
            with open(filepath, 'w') as f:
                f.write(new_content)
            print(f"Updated {filepath}")
    except Exception as e:
        print(f"Skipping {filepath}: {e}")

def process_dir(directory):
    for root, dirs, files in os.walk(directory):
        for file in files:
            if file.endswith('.ts') or file.endswith('.tsx') or file.endswith('.py') or file.endswith('.sql'):
                replace_in_file(os.path.join(root, file))

if __name__ == "__main__":
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    process_dir(os.path.join(base_dir, 'src'))
    process_dir(os.path.join(base_dir, 'scripts'))
    process_dir(os.path.join(base_dir, 'supabase'))
