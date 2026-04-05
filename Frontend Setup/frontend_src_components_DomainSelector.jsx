export default function DomainSelector({ domains, onSelect }) {
  return (
    <div className="domain-selector">
      {domains.map((domain) => (
        <button
          key={domain.id}
          onClick={() => onSelect(domain.id)}
          className="domain-button"
        >
          {domain.name}
        </button>
      ))}
    </div>
  );
}