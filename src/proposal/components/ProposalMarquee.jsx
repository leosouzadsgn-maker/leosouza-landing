import React from 'react';
import './proposal-marquee.css';

function ProposalMarquee({
  company = 'EMPRESA TESTE',
  section = 'CONTEXTO',
  number = '02',
  reverse = false,
}) {
  const items = Array.from({ length: 8 });

  return (
    <div
      className={`proposal-marquee ${
        reverse ? 'proposal-marquee--reverse' : ''
      }`}
      aria-hidden="true"
    >
      <div className="proposal-marquee__viewport">
        <div className="proposal-marquee__track">
          {items.map((_, index) => (
            <div
              className="proposal-marquee__item"
              key={index}
            >
              <span className="proposal-marquee__number">
                {number}
              </span>

              <span className="proposal-marquee__company">
                {company}
              </span>

              <span className="proposal-marquee__separator">
                /
              </span>

              <span className="proposal-marquee__section">
                {section}
              </span>

              <span className="proposal-marquee__star">
                ✦
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ProposalMarquee;