import fs from 'fs';
import path from 'path';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkMath from 'remark-math';
import remarkGfm from 'remark-gfm';
import remarkRehype from 'remark-rehype';
import rehypeKatex from 'rehype-katex';
import rehypeHighlight from 'rehype-highlight';
import rehypeSlug from 'rehype-slug';
import rehypeStringify from 'rehype-stringify';
import GitHubSlugger from 'github-slugger';
import "katex/dist/katex.min.css";

interface CatalogItem {
  title: string;
  slug: string;
  children?: CatalogItem[];
}

// 递归获取所有 index.md 文件
function findMarkdownFiles(dir: string): string[] {
  const files: string[] = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...findMarkdownFiles(fullPath));
    } else if (entry.isFile() && entry.name === 'index.md') {
      files.push(fullPath);
    }
  }
  return files;
}

// 提取目录（## 和 ###）
function generateCatalog(content: string): CatalogItem[] {
  const headings: CatalogItem[] = [];
  const slugger = new GitHubSlugger();
  const regex = /^(##+)\s+(.+)$/gm;
  let match;
  while ((match = regex.exec(content)) !== null) {
    const level = match[1].length;
    const title = match[2].trim();
    const slug = slugger.slug(title);
    if (level === 2) {
      headings.push({ title, slug, children: [] });
    } else if (level === 3 && headings.length > 0) {
      headings[headings.length - 1].children!.push({ title, slug });
    }
  }
  return headings;
}

// 替换图片路径 ./res/... → /notes/<slug>/res/...
function preprocessImageLinks(content: string, slugPath: string): string {
  const basePath = `/notes/${slugPath}/res`;
  content = content.replace(/!\[([^\]]*)\]\((\.?\/?res\/[^)]+)\)/g, (_m, alt, imgPath) => {
    const filename = imgPath.replace(/^\.?\/?res\//, '');
    return `![${alt}](${basePath}/${filename})`;
  });
  content = content.replace(/<img\s+([^>]*?)src=["']\.?\/?res\/([^"']+)["']([^>]*?)>/g,
    (_m, before, filename, after) => `<img ${before}src="${basePath}/${filename}"${after}>`);
  return content;
}

// 构建主函数
async function build() {
  const mdRoot = path.resolve('./static/notes');
  const outRoot = path.resolve('./static/generated');
  const files = findMarkdownFiles(mdRoot);

  for (const fullPath of files) {
    const relativePath = path.relative(mdRoot, fullPath); // e.g. Git/index.md
    const dirSlug = path.dirname(relativePath);           // e.g. Git
    const slug = dirSlug.replace(/\\/g, '/');             // 跨平台路径处理

    const outDir = path.join(outRoot, dirSlug);
    fs.mkdirSync(outDir, { recursive: true });

    const raw = fs.readFileSync(fullPath, 'utf-8');
    const content = preprocessImageLinks(raw, slug);

    const result = await unified()
      .use(remarkParse)
      .use(remarkMath)
      .use(remarkGfm)
      .use(remarkRehype, { allowDangerousHtml: true })
      .use(rehypeKatex)
      .use(rehypeHighlight)
      .use(rehypeSlug)
      .use(rehypeStringify, { allowDangerousHtml: true })
      .process(content);

    const html = String(result);
    const catalog = generateCatalog(content);

    fs.writeFileSync(path.join(outDir, `index.html`), html, 'utf-8');
    fs.writeFileSync(path.join(outDir, `index.toc.json`), JSON.stringify(catalog, null, 2), 'utf-8');

    console.log(`✅ Built: ${slug}`);
  }

  console.log(`🎉 All done. Total ${files.length} files.`);
}

build().catch(err => {
  console.error('❌ Build failed:', err);
  process.exit(1);
});
