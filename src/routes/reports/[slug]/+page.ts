import { base } from '$app/paths';
import { error } from '@sveltejs/kit';

type ReportDefinition = {
  file: string;
  title: string;
  project: string;
  result: string;
  role?: string;
  backAnchor: string;
  resources: { label: string; href: string }[];
};

const reports: Record<string, ReportDefinition> = {
  'icar-pd': {
    file: 'icar-pd.md',
    title: 'ICAR 视觉自主竞速系统工程报告',
    project: '第十八届全国大学生智能汽车竞赛完全模型组',
    role: '队长',
    result: '全国一等奖',
    backAnchor: 'competition-smart-car',
    resources: [
      { label: 'GitHub', href: 'https://github.com/p-xiexin/icar-pd' },
      { label: 'Video', href: 'https://www.bilibili.com/video/BV1ep421R7LV/' }
    ]
  },
  'wheel-leg': {
    file: 'wheel-leg.md',
    title: 'RoboMaster 轮腿步兵机器人控制系统工程报告',
    project: 'RoboMaster 2023 机甲大师高校联盟赛',
    result: '上海站二等奖',
    backAnchor: 'competition-robomaster',
    resources: [
      { label: 'Firmware', href: 'https://github.com/leancamel/RM/tree/main/Wheel_Leg_Infantry' },
      { label: 'Simulation', href: 'https://github.com/p-xiexin/WheelLeg_sim' },
      { label: 'Video', href: 'https://www.bilibili.com/video/BV1hx4y1r7qY/' }
    ]
  }
};

export async function load({ params, fetch }) {
  const report = reports[params.slug];
  if (!report) throw error(404, `Report ${params.slug} not found`);

  const response = await fetch(`${base}/reports/${report.file}`);
  if (!response.ok) throw error(404, `Could not fetch report ${params.slug}`);

  return {
    report,
    content: await response.text()
  };
}
