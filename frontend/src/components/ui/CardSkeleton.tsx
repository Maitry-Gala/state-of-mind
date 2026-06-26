export function CardSkeleton() {
  return (
    <div className="p-4 w-72 bg-white rounded-md border border-gray-200 shadow-sm animate-pulse">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-gray-200" />
          <div className="w-32 h-3 rounded bg-gray-200" />
        </div>
        <div className="flex gap-2">
          <div className="w-4 h-4 rounded bg-gray-200" />
          <div className="w-4 h-4 rounded bg-gray-200" />
        </div>
      </div>
      {/* Content */}
      <div className="mt-4 space-y-2">
        <div className="w-full h-34 rounded-md bg-gray-200" />
        <div className="w-3/4 h-3 rounded bg-gray-200" />
        <div className="w-1/2 h-3 rounded bg-gray-200" />
      </div>
    </div>
  );
}