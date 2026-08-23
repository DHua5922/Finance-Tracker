export default function NavigationIcon({ path }: { path: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="w-6 h-6 fill-none stroke-current stroke-2"
    >
      <path strokeLinecap="round" d={path} />
    </svg>
  );
}
