import { useMemo } from "react";

/**
 * Header 组件：标题栏 + 分类统计图表
 */
export default function Header({ total, categories, courses }) {
  const stats = useMemo(() => {
    const map = {};
    categories.forEach((c) => {
      map[c.value] = { count: courses.filter((cc) => cc.category === c.value).length, ...c };
    });
    return map;
  }, [courses, categories]);

  return (
    <header className="header">
      <div className="header-top">
        <h1>📚 课程管理系统</h1>
        <span className="badge">共 {total} 门课程</span>
      </div>

      {total > 0 && (
        <div className="stats-bar">
          {categories.map((cat) => (
            <div key={cat.value} className="stat-item">
              <span
                className="stat-dot"
                style={{ background: cat.color }}
              />
              <span className="stat-label">{cat.label}</span>
              <span className="stat-count">{stats[cat.value]?.count || 0}</span>
            </div>
          ))}
        </div>
      )}
    </header>
  );
}
