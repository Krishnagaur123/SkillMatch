import fs from 'fs';

const filesToFix = [
  {
    path: 'src/components/common/Badge.module.css',
    fixes: [
      { from: /rgba\(244, 63, 94, 0\.1\)/g, to: 'color-mix(in srgb, var(--color-error) 10%, transparent)' },
      { from: /rgba\(244, 63, 94, 0\.2\)/g, to: 'color-mix(in srgb, var(--color-error) 20%, transparent)' },
      { from: /rgba\(148, 163, 184, 0\.1\)/g, to: 'color-mix(in srgb, var(--text-secondary) 10%, transparent)' },
      { from: /rgba\(148, 163, 184, 0\.2\)/g, to: 'color-mix(in srgb, var(--text-secondary) 20%, transparent)' },
      { from: /rgba\(59, 130, 246, 0\.1\)/g, to: 'color-mix(in srgb, var(--color-brand) 10%, transparent)' },
      { from: /rgba\(59, 130, 246, 0\.2\)/g, to: 'color-mix(in srgb, var(--color-brand) 20%, transparent)' }
    ]
  },
  {
    path: 'src/components/common/ConfirmationDialog.module.css',
    fixes: [
      { from: /oklch\(0\.48 0\.18 20\)/g, to: 'var(--color-error)' }
    ]
  },
  {
    path: 'src/components/common/Form.module.css',
    fixes: [
      { from: /oklch\(1 0 0 \/ 0\.3\)/g, to: 'color-mix(in srgb, var(--surface-primary) 30%, transparent)' }
    ]
  },
  {
    path: 'src/components/common/RemovableSkillBadge.module.css',
    fixes: [
      { from: /var\(--color-danger-100, oklch\(0\.94 0\.04 25\)\)/g, to: 'color-mix(in srgb, var(--color-error) 15%, transparent)' },
      { from: /var\(--color-danger-700, oklch\(0\.45 0\.16 25\)\)/g, to: 'var(--color-error)' }
    ]
  },
  {
    path: 'src/features/analytics/gaps/SkillGapSection.module.css',
    fixes: [
      { from: /#fef2f2/g, to: 'color-mix(in srgb, var(--color-error) 10%, transparent)' },
      { from: /#fecaca/g, to: 'color-mix(in srgb, var(--color-error) 20%, transparent)' },
      { from: /#fffbeb/g, to: 'color-mix(in srgb, var(--color-warning) 10%, transparent)' },
      { from: /#fde68a/g, to: 'color-mix(in srgb, var(--color-warning) 20%, transparent)' },
      { from: /#f0fdf4/g, to: 'color-mix(in srgb, var(--color-success) 10%, transparent)' },
      { from: /#bbf7d0/g, to: 'color-mix(in srgb, var(--color-success) 20%, transparent)' }
    ]
  },
  {
    path: 'src/features/analytics/insights/CareerInsights.module.css',
    fixes: [
      { from: /#f0fdf4/g, to: 'color-mix(in srgb, var(--color-success) 10%, transparent)' },
      { from: /#eff6ff/g, to: 'color-mix(in srgb, var(--color-brand) 10%, transparent)' },
      { from: /#3b82f6/g, to: 'var(--color-brand)' },
      { from: /rgba\(59, 130, 246, 0\.1\)/g, to: 'color-mix(in srgb, var(--color-brand) 10%, transparent)' }
    ]
  },
  {
    path: 'src/features/analytics/overview/CareerAssessment.module.css',
    fixes: [
      { from: /rgba\(59, 130, 246, 0\.1\)/g, to: 'color-mix(in srgb, var(--color-brand) 10%, transparent)' },
      { from: /rgba\(59, 130, 246, 0\.2\)/g, to: 'color-mix(in srgb, var(--color-brand) 20%, transparent)' }
    ]
  },
  {
    path: 'src/features/analytics/overview/CoverageHero.module.css',
    fixes: [
      { from: /#3b82f6/g, to: 'var(--color-brand)' },
      { from: /#fffbeb/g, to: 'color-mix(in srgb, var(--color-warning) 10%, transparent)' },
      { from: /#d97706/g, to: 'var(--color-warning)' },
      { from: /#fbbf24/g, to: 'var(--color-warning)' }
    ]
  },
  {
    path: 'src/features/analytics/recommendation/OverallRecommendation.module.css',
    fixes: [
      { from: /#f0fdf4/g, to: 'color-mix(in srgb, var(--color-success) 10%, transparent)' },
      { from: /#bbf7d0/g, to: 'color-mix(in srgb, var(--color-success) 20%, transparent)' },
      { from: /#fffbeb/g, to: 'color-mix(in srgb, var(--color-warning) 10%, transparent)' },
      { from: /#fde68a/g, to: 'color-mix(in srgb, var(--color-warning) 20%, transparent)' },
      { from: /#eff6ff/g, to: 'color-mix(in srgb, var(--color-brand) 10%, transparent)' },
      { from: /#bfdbfe/g, to: 'color-mix(in srgb, var(--color-brand) 20%, transparent)' },
      { from: /rgba\(59, 130, 246, 0\.05\)/g, to: 'color-mix(in srgb, var(--color-brand) 5%, transparent)' },
      { from: /rgba\(59, 130, 246, 0\.2\)/g, to: 'color-mix(in srgb, var(--color-brand) 20%, transparent)' },
      { from: /#3b82f6/g, to: 'var(--color-brand)' },
      { from: /rgba\(59, 130, 246, 0\.1\)/g, to: 'color-mix(in srgb, var(--color-brand) 10%, transparent)' }
    ]
  },
  {
    path: 'src/features/analytics/resume/ResumeSuggestions.module.css',
    fixes: [
      { from: /#f0fdf4/g, to: 'color-mix(in srgb, var(--color-success) 10%, transparent)' },
      { from: /#bbf7d0/g, to: 'color-mix(in srgb, var(--color-success) 20%, transparent)' },
      { from: /#fffbeb/g, to: 'color-mix(in srgb, var(--color-warning) 10%, transparent)' },
      { from: /#fde68a/g, to: 'color-mix(in srgb, var(--color-warning) 20%, transparent)' }
    ]
  },
  {
    path: 'src/features/analytics/roadmap/LearningRoadmap.module.css',
    fixes: [
      { from: /#fef2f2/g, to: 'color-mix(in srgb, var(--color-error) 10%, transparent)' },
      { from: /#fecaca/g, to: 'color-mix(in srgb, var(--color-error) 20%, transparent)' },
      { from: /#fffbeb/g, to: 'color-mix(in srgb, var(--color-warning) 10%, transparent)' },
      { from: /#fde68a/g, to: 'color-mix(in srgb, var(--color-warning) 20%, transparent)' },
      { from: /#f0fdf4/g, to: 'color-mix(in srgb, var(--color-success) 10%, transparent)' },
      { from: /#bbf7d0/g, to: 'color-mix(in srgb, var(--color-success) 20%, transparent)' }
    ]
  },
  {
    path: 'src/features/applications/components/NextAction.module.css',
    fixes: [
      { from: /rgba\(59, 130, 246, 0\.05\)/g, to: 'color-mix(in srgb, var(--color-brand) 5%, transparent)' },
      { from: /rgba\(59, 130, 246, 0\.2\)/g, to: 'color-mix(in srgb, var(--color-brand) 20%, transparent)' }
    ]
  },
  {
    path: 'src/features/applications/components/NotesEditor.module.css',
    fixes: [
      { from: /rgba\(var\(--primary-rgb\), 0\.1\)/g, to: 'color-mix(in srgb, var(--color-brand) 10%, transparent)' }
    ]
  },
  {
    path: 'src/features/applications/components/StatusProgress.module.css',
    fixes: [
      { from: /rgba\(59, 130, 246, 0\.2\)/g, to: 'color-mix(in srgb, var(--color-brand) 20%, transparent)' },
      { from: /rgba\(59, 130, 246, 0\)/g, to: 'transparent' },
      { from: /rgba\(59, 130, 246, 0\.1\)/g, to: 'color-mix(in srgb, var(--color-brand) 10%, transparent)' },
      { from: /rgba\(244, 63, 94, 0\.1\)/g, to: 'color-mix(in srgb, var(--color-error) 10%, transparent)' },
      { from: /rgba\(244, 63, 94, 0\.2\)/g, to: 'color-mix(in srgb, var(--color-error) 20%, transparent)' },
      { from: /rgba\(148, 163, 184, 0\.1\)/g, to: 'color-mix(in srgb, var(--text-secondary) 10%, transparent)' },
      { from: /rgba\(148, 163, 184, 0\.2\)/g, to: 'color-mix(in srgb, var(--text-secondary) 20%, transparent)' }
    ]
  },
  {
    path: 'src/pages/dashboard/DashboardPage.tsx',
    fixes: [
      { from: /oklch\(0\.62 0\.17 145\)/g, to: 'var(--color-brand)' }
    ]
  }
];

filesToFix.forEach(fileInfo => {
  if (fs.existsSync(fileInfo.path)) {
    let content = fs.readFileSync(fileInfo.path, 'utf-8');
    fileInfo.fixes.forEach(fix => {
      content = content.replace(fix.from, fix.to);
    });
    fs.writeFileSync(fileInfo.path, content, 'utf-8');
    console.log(`Fixed ${fileInfo.path}`);
  }
});
