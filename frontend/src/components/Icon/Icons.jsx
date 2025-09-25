// Icons.js

export const ArrowUpIcon = () => (
  <span className="text-green-500 text-lg font-bold select-none">▲</span>
);

export const ArrowDownIcon = () => (
  <span className="text-red-500 text-lg font-bold select-none">▼</span>
);

export const GroupIcon = () => (
  <div className="bg-blue-100 text-blue-600 rounded-full p-2 text-xl">👥</div>
);

export const BoxIconLine = () => (
  <div className="bg-purple-100 text-purple-600 rounded-full p-2 text-xl">
    📦
  </div>
);

export const MoreDotIcon = () => (
  <svg
    className="w-6 h-6 fill-current"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="5" cy="12" r="2" />
    <circle cx="12" cy="12" r="2" />
    <circle cx="19" cy="12" r="2" />
  </svg>
);

export default {
  ArrowUpIcon,
  ArrowDownIcon,
  GroupIcon,
  BoxIconLine,
  MoreDotIcon,
};
