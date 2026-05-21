import { useMemo } from "react";
import CourseCard from "./CourseCard";

/**
 * CourseList 组件：课程列表
 * useMemo 缓存搜索 + 分类过滤结果
 */
export default function CourseList({
  courses,
  searchKeyword,
  filterCategory,
  onLearn,
  onDelete,
  onEdit,
}) {
  const filteredCourses = useMemo(() => {
    let result = courses;

    // 分类过滤
    if (filterCategory && filterCategory !== "all") {
      result = result.filter((c) => c.category === filterCategory);
    }

    // 搜索过滤
    if (searchKeyword.trim()) {
      const kw = searchKeyword.trim().toLowerCase();
      result = result.filter((c) => c.name.toLowerCase().includes(kw));
    }

    return result;
  }, [courses, searchKeyword, filterCategory]);

  return (
    <section className="course-list-section">
      {courses.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📝</div>
          <p className="empty-title">暂无课程</p>
          <p className="empty-desc">在上方添加第一门课程吧！</p>
        </div>
      ) : filteredCourses.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🔍</div>
          <p className="empty-title">没有匹配的课程</p>
          <p className="empty-desc">
            {searchKeyword && filterCategory !== "all"
              ? `未找到分类中包含"${searchKeyword}"的课程`
              : searchKeyword
              ? `未找到包含"${searchKeyword}"的课程`
              : "当前分类下暂无课程"}
          </p>
        </div>
      ) : (
        <div className="course-grid">
          {filteredCourses.map((course) => (
            <CourseCard
              key={course.id}
              course={course}
              onLearn={onLearn}
              onDelete={onDelete}
              onEdit={onEdit}
            />
          ))}
        </div>
      )}
    </section>
  );
}
