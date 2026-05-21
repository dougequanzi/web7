import { useEffect } from "react";

/**
 * Toast 通知组件
 * 自动 3 秒后消失，支持不同类型（info / success / error）
 */
const ICON_MAP = {
  success: "✅",
  error: "❌",
  info: "💡",
};

export default function Toast({ message, type = "info", onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`toast toast-${type}`}>
      <span className="toast-icon">{ICON_MAP[type] || ICON_MAP.info}</span>
      <span className="toast-message">{message}</span>
      <button className="toast-close" onClick={onClose}>
        ✕
      </button>
    </div>
  );
}
