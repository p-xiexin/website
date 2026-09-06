import { base } from '$app/paths';
import { error } from '@sveltejs/kit';

const reports = {
  'icar-pd': {
    file: 'icar-pd.md',
    title: 'ICAR 视觉自主竞速系统工程报告',
    project: '第十八届全国大学生智能汽车竞赛完全模型组',
    role: '队长',
    result: '全国一等奖',
    repository: 'https://github.com/p-xiexin/icar-pd',
    video: 'https://www.bilibili.com/video/BV1ep421R7LV/'
  }
} as const;

export async function load({ params, fetch }) {
  const report = reports[params.slug as keyof typeof reports];
  if (!report) throw error(404, `Report ${params.slug} not found`);

  const response = await fetch(`${base}/reports/${report.file}`);
  if (!response.ok) throw error(404, `Could not fetch report ${params.slug}`);

  return {
    report,
    content: await response.text()
  };
}
