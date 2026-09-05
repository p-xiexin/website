import { createHash } from 'node:crypto';
import { readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const postsDir = path.resolve('static/posts');
const outputFile = path.join(postsDir, 'postLists.json');

function parseScalar(value) {
	const trimmed = value.trim();
	if (
		(trimmed.startsWith("'") && trimmed.endsWith("'")) ||
		(trimmed.startsWith('"') && trimmed.endsWith('"'))
	) {
		return trimmed.slice(1, -1);
	}
	if (trimmed === 'true') return true;
	if (trimmed === 'false') return false;
	if (/^-?\d+(?:\.\d+)?$/.test(trimmed)) return Number(trimmed);
	return trimmed;
}

function normalizeDate(value) {
	const match = String(value ?? '').match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
	if (!match) return value;
	return `${match[1]}-${match[2].padStart(2, '0')}-${match[3].padStart(2, '0')}`;
}

function parseFrontmatter(content) {
	const lines = content.replace(/^\uFEFF/, '').split(/\r?\n/);
	if (lines[0]?.trim() !== '---') return {};

	const endIndex = lines.slice(1).findIndex((line) => line.trim() === '---');
	if (endIndex < 0) return {};

	const metadata = {};
	let activeKey = null;
	for (const line of lines.slice(1, endIndex + 1)) {
		const listMatch = line.match(/^\s+-\s+(.+)$/);
		if (listMatch && activeKey) {
			if (!Array.isArray(metadata[activeKey])) metadata[activeKey] = [];
			metadata[activeKey].push(parseScalar(listMatch[1]));
			continue;
		}

		const nestedMatch = line.match(/^\s{2,}([\w-]+):\s*(.*)$/);
		if (nestedMatch && activeKey) {
			if (!metadata[activeKey] || Array.isArray(metadata[activeKey])) metadata[activeKey] = {};
			metadata[activeKey][nestedMatch[1]] = parseScalar(nestedMatch[2]);
			continue;
		}

		const fieldMatch = line.match(/^([\w-]+):\s*(.*)$/);
		if (!fieldMatch) continue;
		activeKey = fieldMatch[1];
		metadata[activeKey] = fieldMatch[2] ? parseScalar(fieldMatch[2]) : null;
	}

	if ('date' in metadata) metadata.date = normalizeDate(metadata.date);
	metadata.published = Boolean(metadata.published ?? false);

	if (typeof metadata.column === 'string') {
		metadata.column = { name: metadata.column };
	} else if (metadata.column && typeof metadata.column === 'object') {
		const column = {};
		const name = metadata.column.name || metadata.column.title;
		if (name) column.name = name;
		if ('order' in metadata.column) column.order = metadata.column.order;
		if ('description' in metadata.column) column.description = metadata.column.description;
		if (Object.keys(column).length) metadata.column = column;
		else delete metadata.column;
	}

	return metadata;
}

function extractTitle(content, filename) {
	let lines = content.replace(/^\uFEFF/, '').split(/\r?\n/);
	if (lines[0]?.trim() === '---') {
		const endIndex = lines.slice(1).findIndex((line) => line.trim() === '---');
		if (endIndex >= 0) lines = lines.slice(endIndex + 2);
	}

	let inFence = false;
	for (const line of lines) {
		if (/^\s*(```|~~~)/.test(line)) {
			inFence = !inFence;
			continue;
		}
		if (inFence) continue;
		const match = line.match(/^\s*#\s+(.*)/);
		if (match) {
			const title = match[1].trim().replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');
			if (title) return title;
		}
	}
	return path.parse(filename).name;
}

function beijingDate() {
	return new Intl.DateTimeFormat('en-CA', {
		timeZone: 'Asia/Shanghai',
		year: 'numeric',
		month: '2-digit',
		day: '2-digit'
	}).format(new Date());
}

const filenames = (await readdir(postsDir)).filter((filename) => filename.endsWith('.md'));
const today = beijingDate();
let scheduled = 0;
const posts = [];

for (const filename of filenames) {
	const content = await readFile(path.join(postsDir, filename), 'utf8');
	const metadata = parseFrontmatter(content);
	const title = extractTitle(content, filename);
	const uniqueString = `${metadata.date ?? ''}-${title}-${metadata.description ?? ''}`;
	metadata.slug = createHash('md5').update(uniqueString, 'utf8').digest('hex');
	metadata.title = title;
	metadata.file = filename;

	if (metadata.date && /^\d{4}-\d{2}-\d{2}$/.test(metadata.date) && metadata.date > today) {
		metadata.published = false;
		scheduled += 1;
	}
	posts.push(metadata);
}

posts.sort((left, right) => String(right.date ?? '').localeCompare(String(left.date ?? '')));
const published = posts.filter((post) => post.published).length;
await writeFile(outputFile, `${JSON.stringify(posts, null, 2)}\n`, 'utf8');

console.log(`Generated ${path.relative(process.cwd(), outputFile)} with ${posts.length} posts.`);
console.log(`Published: ${published} | Unpublished: ${posts.length - published} | Scheduled: ${scheduled}`);
