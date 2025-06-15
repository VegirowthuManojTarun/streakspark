// Simple in‐session scheduler using setTimeout.
// In a real PWA you'd use service‐workers/chrome.alarms.
export function scheduleNotifications(tasks) {
  if (!("Notification" in window)) return;
  Notification.requestPermission();

  // Clear any existing timeouts
  window._taskTimers?.forEach(clearTimeout);
  window._taskTimers = [];

  tasks.forEach((task) => {
    const [hh, mm] = task.notificationTime.split(":").map(Number);
    const now = new Date();
    let next = new Date();
    next.setHours(hh, mm, 0, 0);
    if (next <= now) next.setDate(next.getDate() + 1);

    const delay = next - now;
    const id = setTimeout(() => {
      new Notification(`Time for “${task.name}”`, {
        body: `Keep your streak going! 🔥`,
      });
    }, delay);
    window._taskTimers.push(id);
  });
}
