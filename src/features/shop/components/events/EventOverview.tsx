'use client';

interface EventOverviewProps {
  overview: string;
  whatYouWillLearn?: string[];
  whoIsItFor?: string[];
}

export function EventOverview({
  overview,
  whatYouWillLearn,
  whoIsItFor,
}: EventOverviewProps) {
  return (
    <div className="space-y-8">
      {/* Overview */}
      <section>
        <h2 className="text-xl font-semibold text-[var(--shop-text)] mb-4">
          About This Event
        </h2>
        <p className="text-[var(--shop-text-muted)] leading-relaxed">
          {overview}
        </p>
      </section>

      {/* What You'll Learn */}
      {whatYouWillLearn && whatYouWillLearn.length > 0 && (
        <section>
          <h2 className="text-xl font-semibold text-[var(--shop-text)] mb-4">
            What You&apos;ll Learn
          </h2>
          <ul className="space-y-3">
            {whatYouWillLearn.map((item, index) => (
              <li key={index} className="flex items-start gap-3">
                <svg
                  className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-[var(--shop-text-muted)]">{item}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Who It's For */}
      {whoIsItFor && whoIsItFor.length > 0 && (
        <section>
          <h2 className="text-xl font-semibold text-[var(--shop-text)] mb-4">
            Who Is This For?
          </h2>
          <ul className="space-y-3">
            {whoIsItFor.map((item, index) => (
              <li key={index} className="flex items-start gap-3">
                <svg
                  className="w-5 h-5 text-primary-500 flex-shrink-0 mt-0.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                <span className="text-[var(--shop-text-muted)]">{item}</span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
