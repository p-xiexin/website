<script lang="ts">
  import { base } from '$app/paths';
  import MarkdownRender from '$lib/components/MarkdownRender.svelte';

  let { data } = $props();

  const processedContent = $derived(
    data.content.replace(
      /!\[([^\]]*)\]\(\.\/([^)]+)\)/g,
      (_match: string, alt: string, path: string) => `![${alt}](${base}/reports/${path})`
    )
  );
</script>

<svelte:head>
  <title>{data.report.title}</title>
  <meta name="description" content={`${data.report.project}技术方案与工程实现报告`} />
</svelte:head>

<div class="report-shell">
  <a class="back-link" href={`${base}/#${data.report.backAnchor}`}>← 返回项目</a>
  <article>
    <header class="report-meta">
      <span>{data.report.project}</span>
      {#if data.report.role}<span>{data.report.role}</span>{/if}
      <strong>{data.report.result}</strong>
      <nav aria-label="Project resources">
        {#each data.report.resources as resource}
          <a href={resource.href} target="_blank" rel="noreferrer">{resource.label} ↗</a>
        {/each}
      </nav>
    </header>
    <div class="report-content">
      <MarkdownRender content={processedContent} />
    </div>
  </article>
</div>

<style>
  .report-shell { width: min(920px, calc(100% - 32px)); margin: 0 auto; padding: 24px 0 48px; }
  .back-link { display: inline-block; margin-bottom: 16px; color: #0969da; font-size: 12px; font-weight: 500; text-decoration: none; }
  .back-link:hover { text-decoration: underline; }
  .report-meta { display: flex; flex-wrap: wrap; align-items: center; gap: 7px 16px; padding: 10px 14px; border: 1px solid #d0d7de; border-radius: 6px 6px 0 0; color: #59636e; background: #f6f8fa; font-size: 12px; }
  .report-meta strong { color: #9a6700; font-size: 11px; }
  .report-meta nav { display: flex; flex-wrap: wrap; gap: 14px; margin-left: auto; }
  .report-meta a { color: #0969da; font-size: 11px; font-weight: 600; text-decoration: none; }
  .report-meta a:hover { text-decoration: underline; }
  .report-content { padding: 28px 32px 36px; border: 1px solid #d0d7de; border-top: 0; border-radius: 0 0 6px 6px; background: hsl(var(--background)); }
  :global(.video-embed) { position: relative; width: 100%; margin: 18px 0 8px; padding-top: 56.25%; overflow: hidden; border: 1px solid #d0d7de; border-radius: 6px; background: #0d1117; }
  :global(.video-embed iframe) { position: absolute; inset: 0; width: 100%; height: 100%; border: 0; }
  :global(.report-table) { max-width: 100%; margin-bottom: 16px; overflow-x: auto; }
  :global(.report-table table) { display: table; width: 100%; min-width: 620px; margin-bottom: 0; }
  :global(.dark) .report-meta { border-color: #3d444d; color: #9198a1; background: #151b23; }
  :global(.dark) .report-meta strong { color: #d29922; }
  :global(.dark) .report-meta a, :global(.dark) .back-link { color: #4493f8; }
  :global(.dark) .report-content, :global(.dark .video-embed) { border-color: #3d444d; }

  @media (min-width: 1180px) {
    .report-shell { width: min(900px, calc(100vw - 290px)); margin-right: 0; margin-left: max(30px, calc((100vw - 1120px) / 2)); }
  }

  @media (max-width: 640px) {
    .report-shell { width: calc(100% - 20px); padding-top: 16px; }
    .report-meta { padding: 9px 11px; }
    .report-meta nav { width: 100%; margin-left: 0; }
    .report-content { padding: 20px 14px 28px; }
  }
</style>
