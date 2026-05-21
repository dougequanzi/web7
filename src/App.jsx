import { useState, useCallback, useRef } from "react";
import Header from "./components/Header";
import CourseList from "./components/CourseList";
import Footer from "./components/Footer";
import Toast from "./components/Toast";
import { useLocalStorage } from "./hooks/useLocalStorage";
import { useDebounce } from "./hooks/useDebounce";
import "./App.css";

/** 课程分类选项 */
const CATEGORIES = [
  { value: "frontend", label: "前端开发", color: "#667eea" },
  { value: "backend", label: "后端开发", color: "#38b2ac" },
  { value: "ai", label: "人工智能", color: "#9f7aea" },
  { value: "database", label: "数据库", color: "#ed8936" },
  { value: "design", label: "设计", color: "#f56565" },
  { value: "other", label: "其他", color: "#a0aec0" },
];

export default function App() {
  // ─── 持久化状态 ────────────────────────────────────
  const [courses, setCourses] = useLocalStorage("courses", []);
  const [filterCategory, setFilterCategory] = useLocalStorage("filterCategory", "all");

  // ─── 局部表单状态 ──────────────────────────────────
  const [inputValue, setInputValue] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("frontend");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [editingCourse, setEditingCourse] = useState(null);

  // ─── Toast 通知 ────────────────────────────────────
  const [toast, setToast] = useState(null);

  const showToast = useCallback((message, type = "info") => {
    setToast({ message, type });
  }, []);

  const closeToast = useCallback(() => {
    setToast(null);
  }, []);

  // ─── useRef：添加课程后自动聚焦 ─────────────────────
  const inputRef = useRef(null);

  // ─── 防抖搜索 ──────────────────────────────────────
  const debouncedSearch = useDebounce(searchKeyword, 300);

  // ─── useCallback：事件处理函数 ──────────────────────

  const handleLearn = useCallback((course) => {
    showToast(`▶ 正在学习：${course.name}`, "success");
  }, [showToast]);

  const handleAddCourse = useCallback(() => {
    if (!inputValue.trim()) {
      showToast("课程名称不能为空！", "error");
      inputRef.current?.focus();
      return;
    }

    if (editingCourse) {
      setCourses((prev) =>
        prev.map((c) =>
          c.id === editingCourse.id
            ? {
                ...c,
                name: inputValue.trim(),
                description: description.trim(),
                category: category || "other",
              }
            : c
        )
      );
      setEditingCourse(null);
      showToast("✓ 课程修改已保存", "success");
    } else {
      const newCourse = {
        id: Date.now(),
        name: inputValue.trim(),
        description: description.trim(),
        category: category || "other",
      };
      setCourses((prev) => [...prev, newCourse]);
      showToast(`✓ 已添加课程：${inputValue.trim()}`, "success");
    }

    setInputValue("");
    setDescription("");
    setCategory("frontend");
    inputRef.current?.focus();
  }, [inputValue, description, category, editingCourse, setCourses, showToast]);

  const handleDeleteCourse = useCallback((id) => {
    setCourses((prev) => {
      const deleted = prev.find((c) => c.id === id);
      if (deleted) showToast(`✕ 已删除课程：${deleted.name}`, "info");
      return prev.filter((c) => c.id !== id);
    });
  }, [setCourses, showToast]);

  const handleEditCourse = useCallback((course) => {
    setInputValue(course.name);
    setDescription(course.description || "");
    setCategory(course.category || "other");
    setEditingCourse(course);
    setTimeout(() => inputRef.current?.focus(), 0);
  }, []);

  const handleCancelEdit = useCallback(() => {
    setEditingCourse(null);
    setInputValue("");
    setDescription("");
    setCategory("frontend");
  }, []);

  return (
    <div className="app">
      {/* Toast 通知层 */}
      {toast && <Toast message={toast.message} type={toast.type} onClose={closeToast} />}

      {/* 页面标题 + 统计 */}
      <Header total={courses.length} categories={CATEGORIES} courses={courses} />

      <main className="main-content">
        {/* ─── 添加 / 编辑区域 ─── */}
        <section className="input-section">
          <h2>
            <span className="section-icon">{editingCourse ? "✎" : "＋"}</span>
            {editingCourse ? "编辑课程" : "添加课程"}
          </h2>
          <div className="form-row">
            <input
              ref={inputRef}
              type="text"
              className="input-name"
              placeholder="课程名称（必填）"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
            <input
              type="text"
              className="input-desc"
              placeholder="课程简介"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <select
              className="input-select"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {CATEGORIES.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
            <button className="btn-add" onClick={handleAddCourse}>
              {editingCourse ? "✓ 保存修改" : "＋ 添加课程"}
            </button>
            {editingCourse && (
              <button className="btn-cancel" onClick={handleCancelEdit}>
                ✕ 取消
              </button>
            )}
          </div>
        </section>

        {/* ─── 搜索 + 分类筛选栏 ─── */}
        <section className="filter-bar">
          <div className="search-wrapper">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              className="input-search"
              placeholder="搜索课程名称..."
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
            />
            {searchKeyword && (
              <button className="search-clear" onClick={() => setSearchKeyword("")}>
                ✕
              </button>
            )}
          </div>

          <div className="category-tabs">
            <button
              className={`cat-tab ${filterCategory === "all" ? "active" : ""}`}
              onClick={() => setFilterCategory("all")}
            >
              全部
            </button>
            {CATEGORIES.map((cat) => (
              <button
                key={cat.value}
                className={`cat-tab ${filterCategory === cat.value ? "active" : ""}`}
                style={{
                  "--cat-color": cat.color,
                  borderColor: filterCategory === cat.value ? cat.color : "transparent",
                  background: filterCategory === cat.value ? `${cat.color}15` : "transparent",
                  color: filterCategory === cat.value ? cat.color : "#666",
                }}
                onClick={() => setFilterCategory(cat.value)}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </section>

        {/* ─── 课程列表 ─── */}
        <CourseList
          courses={courses}
          searchKeyword={debouncedSearch}
          filterCategory={filterCategory}
          onLearn={handleLearn}
          onDelete={handleDeleteCourse}
          onEdit={handleEditCourse}
          categories={CATEGORIES}
        />
      </main>

      <Footer />
    </div>
  );
}
