import React from 'react';
import '../styles/proposal-ticker.css';

function ProposalTicker({
  company = 'MARECHAL',
  section = 'PROPOSTA',
  number = '01',
}) {
  const items = [
    `${company} / ${section}`,
    `${company} / ${section}`,
    `${company} / ${section}`,
    `${company} / ${section}`,
    `${company} / ${section}`,
    `${company} / ${section}`,
  ];

  return (
    <div
      className="proposal-section-ticker"
      aria-label={`${company} / ${section}`}
    >
      <div className="proposal-section-ticker__viewport">
        <div className="proposal-section-ticker__track">
          <div className="proposal-section-ticker__group">
            {items.map((item, index) => (
              <React.Fragment key={`ticker-a-${index}`}>
                <span
                  className={
                    index === 0
                      ? 'proposal-section-ticker__item proposal-section-ticker__item--active'
                      : 'proposal-section-ticker__item'
                  }
                >
                  {item}
                </span>

                <span className="proposal-section-ticker__dot">
                  •
                </span>
              </React.Fragment>
            ))}
          </div>

          <div
            className="proposal-section-ticker__group"
            aria-hidden="true"
          >
            {items.map((item, index) => (
              <React.Fragment key={`ticker-b-${index}`}>
                <span
                  className={
                    index === 0
                      ? 'proposal-section-ticker__item proposal-section-ticker__item--active'
                      : 'proposal-section-ticker__item'
                  }
                >
                  {item}
                </span>

                <span className="proposal-section-ticker__dot">
                  •
                </span>
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      <div className="proposal-section-ticker__number">
        {number}
      </div>
    </div>
  );
}

export default ProposalTicker;