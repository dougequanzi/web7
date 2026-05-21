import { useState, useEffect } from "react";

/**
 * 自定义 Hook：将状态与 localStorage 同步
 * @param {string} key localStorage 的键名
 * @param {any} initialValue 初始值
 */
export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.error("保存到 localStorage 失败", e);
    }
  }, [key, value]);

  return [value, setValue];
}
