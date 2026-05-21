/**
 * CourseCard 组件：单门课程卡片
 * 展示课程名称、简介、分类标签、操作按钮
 */
const CATEGORY_MAP = {
  frontend: { label: "前端开发", color: "#667eea" },
  backend: { label: "后端开发", color: "#38b2ac" },
  ai: { label: "人工智能", color: "#9f7aea" },
  database: { label: "数据库", color: "#ed8936" },
  design: { label: "设计", color: "#f56565" },
  other: { label: "其他", color: "#a0aec0" },
};

export default function CourseCard({ course, onLearn, onDelete, onEdit }) {
  const cat = CATEGORY_MAP[course.category] || CATEGORY_MAP.other;

  return (
    <div className="course-card" style={{ borderLeft: `4px solid ${cat.color}` }}>
      <div className="course-info">
        <div className="course-name-row">
          <h3 className="course-name">{course.name}</h3>
          <span
            className="course-cat-badge"
            style={{ background: `${cat.color}18`, color: cat.color }}
          >
            {cat.label}
          </span>
        </div>
        <p className="course-desc">{course.description || "暂无简介"}</p>
      </div>
      <div className="course-actions">
        <button className="btn btn-learn" onClick={() => onLearn(course)}>
          ▶ 学习
        </button>
        <button className="btn btn-edit" onClick={() => onEdit(course)}>
          ✎ 编辑
        </button>
        <button className="btn btn-delete" onClick={() => onDelete(course.id)}>
          ✕ 删除
        </button>
      </div>
    </div>
  );
}
