import { useState, useEffect } from "react";

/**
 * 自定义 Hook：防抖
 * @param {any} value 需要防抖的值
 * @param {number} delay 延迟毫秒数
 */
export function useDebounce(value, delay = 300) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}
