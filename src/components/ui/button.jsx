export function Button({ className = "", type = "button", ...props }) {
  return (
    <button
      type={type}
      className={`inline-flex items-center justify-center rounded-full px-5 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7939EF]/40 disabled:pointer-events-none disabled:opacity-50 ${className}`}
      {...props}
    />
  );
}
