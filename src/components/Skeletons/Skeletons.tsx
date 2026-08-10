export function StationListSkeleton() {
  return (
    <ul className="station-list" aria-hidden="true">
      {Array.from({ length: 4 }).map((_, i) => (
        <li key={i}>
          <div className="skeleton-card">
            <div className="skeleton-line skeleton-line--title" />
            <div className="skeleton-line skeleton-line--sub" />
          </div>
        </li>
      ))}
    </ul>
  );
}

export function ServicesPanelSkeleton() {
  return (
    <div className="services-panel__list" aria-hidden="true">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="skeleton-icon" />
      ))}
    </div>
  );
}
