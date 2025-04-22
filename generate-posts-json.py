import os
import json
from datetime import datetime
import hashlib

POSTS_DIR = './static/posts'
OUTPUT_FILE = './static/posts/postLists.json'

def parse_frontmatter(content):
    lines = content.splitlines()
    if not lines or lines[0].strip() != '---':
        return {}

    metadata = {}
    i = 1
    while i < len(lines) and lines[i].strip() != '---':
        line = lines[i]
        if ':' in line:
            key, value = line.split(':', 1)
            key = key.strip()
            value = value.strip().strip('"').strip("'")  # 去除前后的双引号和单引号

            if value.lower() == 'true':
                value = True
            elif value.lower() == 'false':
                value = False
            else:
                # 处理日期字段，确保它符合标准格式
                try:
                    # 先尝试将其转换为标准的 YYYY-MM-DD 格式
                    value = datetime.strptime(value, "%Y-%m-%d").date().isoformat()
                except ValueError:
                    pass  # 如果无法解析为日期，则保持原样
            
            metadata[key] = value
        i += 1

    return metadata

def generate_slug(post_metadata, filename):
    # Use file name as the title
    title = filename.split('.')[0]  # Remove file extension for the title
    description = post_metadata.get('description', '')
    date = post_metadata.get('date', '')
    
    # Create a unique string by combining the fields
    unique_string = f"{date}-{title}-{description}"
    
    # Generate a hash of the unique string to ensure uniqueness
    slug = hashlib.md5(unique_string.encode('utf-8')).hexdigest()
    
    return slug, title

def get_posts():
    posts = []
    for filename in os.listdir(POSTS_DIR):
        if filename.endswith('.md'):
            filepath = os.path.join(POSTS_DIR, filename)
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()
            meta = parse_frontmatter(content)
            if meta.get('published'):
                # Generate slug and title using the metadata and filename
                slug, title = generate_slug(meta, filename)
                meta['slug'] = slug
                meta['title'] = title
                posts.append(meta)

    posts.sort(key=lambda x: x.get('date', ''), reverse=True)
    return posts

def save_posts(posts):
    with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
        json.dump(posts, f, indent=2, ensure_ascii=False)

if __name__ == '__main__':
    posts = get_posts()
    save_posts(posts)
    print(f"✅ Generated {OUTPUT_FILE} with {len(posts)} posts.")
