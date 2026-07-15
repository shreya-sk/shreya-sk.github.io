
```dataviewjs
const timeAgo = (mtime) => {
  const diff = dv.luxon.DateTime.now().diff(mtime, ["days", "hours", "minutes"]).toObject();
  if (diff.days >= 1) return Math.floor(diff.days) + "d ago";
  if (diff.hours >= 1) return Math.floor(diff.hours) + "h ago";
  return Math.max(1, Math.floor(diff.minutes)) + "m ago";
};

const pages = dv.pages().sort(p => p.file.mtime, "desc").limit(10);

dv.table(["File", "Date", "Time", "Time Ago"], pages.map(p => [
  p.file.link,
  p.file.mtime.toFormat("MMM d, yyyy"),
  p.file.mtime.toFormat("HH:mm"),
  timeAgo(p.file.mtime)
]));
```
