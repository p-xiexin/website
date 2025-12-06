import os
import json
from datetime import datetime
import hashlib
import yaml
import re

POSTS_DIR = './static/posts'
OUTPUT_FILE = './static/posts/postLists.json'

def parse_frontmatter(content):
    lines = content.splitlines()
    if not lines:
        return {}

    # tolerate BOM and require opening ---
    first_line = lines[0].lstrip('\ufeff').strip()
    if first_line != '---':
        return {}

    # find closing ---
    end_index = None
    for idx, line in enumerate(lines[1:], start=1):
        if line.strip() == '---':
            end_index = idx
            break
    if end_index is None:
        return {}

    frontmatter_str = '\n'.join(lines[1:end_index])
    try:
        metadata = yaml.safe_load(frontmatter_str) or {}
    except yaml.YAMLError:
        metadata = {}

    # normalize date
    if 'date' in metadata:
        try:
            metadata['date'] = datetime.strptime(str(metadata['date']), "%Y-%m-%d").date().isoformat()
        except ValueError:
            pass

    # Ensure published is always a boolean for downstream consumers
    metadata['published'] = bool(metadata.get('published', False))

    column = metadata.get('column')
    if isinstance(column, str):
        metadata['column'] = {'name': column}
    elif isinstance(column, dict):
        normalized_column = {}
        name = column.get('name') or column.get('title')
        if name:
            normalized_column['name'] = name
        if 'order' in column:
            normalized_column['order'] = column.get('order')
        if 'description' in column:
            normalized_column['description'] = column.get('description')
        if normalized_column:
            metadata['column'] = normalized_column
        else:
            metadata.pop('column', None)

    return metadata

def extract_title(content, filename):
    """
    Return the first level-1 heading (# ) as title; fallback to filename (sans extension).
    """
    lines = content.splitlines()
    if lines and lines[0].strip() == '---':
        try:
            end_index = lines.index('---', 1)
            lines = lines[end_index + 1 :]
        except ValueError:
            # Unclosed frontmatter; fall through with original lines
            pass

    heading_pattern = re.compile(r'^\s*#\s+(.*)')
    fence_pattern = re.compile(r'^\s*(```|~~~)')
    in_fence = False
    for line in lines:
        if fence_pattern.match(line):
            in_fence = not in_fence
            continue
        if in_fence:
            continue
        match = heading_pattern.match(line)
        if match:
            heading = match.group(1).strip()
            # Strip markdown links, keep link text
            heading = re.sub(r'\[([^\]]+)\]\([^)]+\)', r'\1', heading)
            if heading:
                return heading

    return os.path.splitext(filename)[0]

def generate_slug(post_metadata, title):
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
            title = extract_title(content, filename)
            # Generate slug and title using the metadata and filename
            slug, title = generate_slug(meta, title)
            meta['slug'] = slug
            meta['title'] = title
            meta['file'] = filename
            posts.append(meta)

    posts.sort(key=lambda x: x.get('date', ''), reverse=True)
    return posts

def save_posts(posts):
    with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
        json.dump(posts, f, indent=2, ensure_ascii=False)

if __name__ == '__main__':
    posts = get_posts()
    save_posts(posts)
    print(f"✔Generated {OUTPUT_FILE} with {len(posts)} posts.")
