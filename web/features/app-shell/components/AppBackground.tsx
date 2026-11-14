/** AtlasRush owns its lightweight backdrop; no upstream scene images are fetched. */
export function AppBackground({ blurred = false }: { blurred?: boolean }) {
  return <div aria-hidden="true" className={`atlas-background pointer-events-none fixed inset-0 z-base overflow-hidden${blurred ? " ar-background-blurred" : ""}`} />;
}
