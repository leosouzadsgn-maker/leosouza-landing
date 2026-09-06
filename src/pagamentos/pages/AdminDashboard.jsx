import React, { useMemo, useState } from 'react';

const COLORS = {
  bg: '#070707',
  panel: '#101010',
  panel2: '#141414',
  border: 'rgba(255,255,255,0.09)',
  white: '#ffffff',
  muted: '#858585',
  muted2: '#555555',
  red: '#ef2b35',
  redDark: '#a9151d',
  green: '#22c55e',
};

const charges = [
  {
    id: 1,
    initials: 'FV',
    client: 'Fernando Veiga',
    service: 'Identidade visual',
    amount: 850,
    status: 'Pago',
    date: 'Hoje, 10:42',
  },
  {
    id: 2,
    initials: 'JS',
    client: 'João Silva',
    service: 'Gestão de imagem',
    amount: 450,
    status: 'Pendente',
    date: 'Hoje, 09:18',
  },
  {
    id: 3,
    initials: 'KS',
    client: 'Kreative Sports',
    service: 'Pacote mensal',
    amount: 1200,
    status: 'Pago',
    date: 'Ontem, 18:27',
  },
  {
    id: 4,
    initials: 'MC',
    client: 'Marcos Costa',
    service: 'Artes para jogo',
    amount: 300,
    status: 'Pendente',
    date: 'Ontem, 16:12',
  },
  {
    id: 5,
    initials: 'LR',
    client: 'Lucas Ribeiro',
    service: 'Consultoria',
    amount: 600,
    status: 'Pago',
    date: '04/09/2026',
  },
];

const revenueData = [
  { day: '01/09', value: 520 },
  { day: '02/09', value: 650 },
  { day: '03/09', value: 520 },
  { day: '04/09', value: 820 },
  { day: '05/09', value: 1480 },
  { day: '06/09', value: 1850 },
  { day: '07/09', value: 1100 },
];

function formatCurrency(value) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

function Icon({ name, size = 20 }) {
  const common = {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.8,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
  };

  const icons = {
    dashboard: (
      <>
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      </>
    ),

    charges: (
      <>
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="M3 10h18" />
        <path d="M7 15h4" />
      </>
    ),

    clients: (
      <>
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </>
    ),

    payments: (
      <>
        <rect x="2" y="5" width="20" height="14" rx="2" />
        <path d="M2 10h20" />
        <path d="M6 15h4" />
      </>
    ),

    chart: (
      <>
        <path d="M3 3v18h18" />
        <path d="m7 16 4-5 3 3 6-8" />
      </>
    ),

    receipt: (
      <>
        <path d="M6 2h12v20l-3-2-3 2-3-2-3 2z" />
        <path d="M9 7h6" />
        <path d="M9 11h6" />
        <path d="M9 15h3" />
      </>
    ),

    tag: (
      <>
        <path d="M20.59 13.41 13.41 20.59a2 2 0 0 1-2.82 0L3.41 13.41a2 2 0 0 1 0-2.82l7.18-7.18A2 2 0 0 1 12 2.82H20a2 2 0 0 1 2 2v8a2 2 0 0 1-.59.59Z" />
        <circle cx="16.5" cy="7.5" r="1" />
      </>
    ),

    reports: (
      <>
        <path d="M4 19V5" />
        <path d="M4 19h17" />
        <path d="M8 16v-5" />
        <path d="M12 16V8" />
        <path d="M16 16v-3" />
        <path d="M20 16V6" />
      </>
    ),

    settings: (
      <>
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.7 1.7 0 0 0 .34 1.88l.06.06-1.7 1.7-.06-.06a1.7 1.7 0 0 0-1.88-.34 1.7 1.7 0 0 0-1.03 1.56V20h-2.4v-.2a1.7 1.7 0 0 0-1.03-1.56 1.7 1.7 0 0 0-1.88.34l-.06.06-1.7-1.7.06-.06A1.7 1.7 0 0 0 8.4 15a1.7 1.7 0 0 0-1.56-1.03H6v-2.4h.84A1.7 1.7 0 0 0 8.4 10a1.7 1.7 0 0 0-.34-1.88L8 8.06l1.7-1.7.06.06a1.7 1.7 0 0 0 1.88.34 1.7 1.7 0 0 0 1.03-1.56V5h2.4v.2a1.7 1.7 0 0 0 1.03 1.56 1.7 1.7 0 0 0 1.88-.34l.06-.06 1.7 1.7-.06.06A1.7 1.7 0 0 0 19.4 10a1.7 1.7 0 0 0 1.56 1.03h.84v2.4h-.84A1.7 1.7 0 0 0 19.4 15Z" />
      </>
    ),

    bell: (
      <>
        <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
        <path d="M10 21h4" />
      </>
    ),

    chevron: (
      <>
        <path d="m6 9 6 6 6-6" />
      </>
    ),

    arrowUp: (
      <>
        <path d="M12 19V5" />
        <path d="m6 11 6-6 6 6" />
      </>
    ),

    arrowRight: (
      <>
        <path d="M5 12h14" />
        <path d="m13 6 6 6-6 6" />
      </>
    ),

    wallet: (
      <>
        <path d="M3 7.5A2.5 2.5 0 0 1 5.5 5H20v14H5.5A2.5 2.5 0 0 1 3 16.5z" />
        <path d="M3 8h14" />
        <path d="M17 11h5v5h-5a2.5 2.5 0 0 1 0-5Z" />
        <circle cx="17.5" cy="13.5" r=".5" />
      </>
    ),

    clock: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 2" />
      </>
    ),

    menu: (
      <>
        <path d="M4 7h16" />
        <path d="M4 12h16" />
        <path d="M4 17h16" />
      </>
    ),

    logout: (
      <>
        <path d="M10 17l5-5-5-5" />
        <path d="M15 12H3" />
        <path d="M21 19V5a2 2 0 0 0-2-2h-5" />
      </>
    ),

    info: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 11v5" />
        <path d="M12 8h.01" />
      </>
    ),
  };

  return <svg {...common}>{icons[name] || icons.info}</svg>;
}

function MetricCard({
  title,
  value,
  description,
  icon,
  accent = COLORS.red,
  positive,
}) {
  return (
    <div
      style={{
        position: 'relative',
        overflow: 'hidden',
        minHeight: '155px',
        padding: '22px',
        borderRadius: '16px',
        border: `1px solid ${COLORS.border}`,
        background:
          'linear-gradient(145deg, rgba(255,255,255,0.045), rgba(255,255,255,0.018))',
        boxShadow: '0 18px 45px rgba(0,0,0,0.18)',
      }}
    >
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          bottom: 0,
          width: '3px',
          background: accent,
        }}
      />

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
        }}
      >
        <div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '7px',
              color: '#c7c7c7',
              fontSize: '14px',
              fontWeight: 600,
            }}
          >
            {title}
            <span style={{ color: COLORS.muted2 }}>
              <Icon name="info" size={14} />
            </span>
          </div>

          <div
            style={{
              marginTop: '12px',
              fontSize: '29px',
              lineHeight: 1,
              fontWeight: 800,
              letterSpacing: '-0.03em',
            }}
          >
            {value}
          </div>
        </div>

        <div
          style={{
            width: '42px',
            height: '42px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '12px',
            color: accent,
            background: `${accent}14`,
            border: `1px solid ${accent}30`,
          }}
        >
          <Icon name={icon} size={22} />
        </div>
      </div>

      <div
        style={{
          position: 'absolute',
          left: '22px',
          right: '22px',
          bottom: '20px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          color: '#777',
          fontSize: '12px',
        }}
      >
        {positive && (
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '3px',
              color: COLORS.green,
              fontWeight: 700,
            }}
          >
            <Icon name="arrowUp" size={13} />
            {positive}
          </span>
        )}

        <span>{description}</span>
      </div>
    </div>
  );
}

function RevenueChart() {
  const width = 760;
  const height = 270;
  const paddingX = 30;
  const paddingTop = 28;
  const paddingBottom = 42;

  const max = Math.max(...revenueData.map((item) => item.value));
  const min = 0;

  const points = revenueData.map((item, index) => {
    const x =
      paddingX +
      (index / (revenueData.length - 1)) *
        (width - paddingX * 2);

    const y =
      paddingTop +
      (1 - (item.value - min) / (max - min)) *
        (height - paddingTop - paddingBottom);

    return { ...item, x, y };
  });

  const linePath = points
    .map((point, index) => {
      if (index === 0) {
        return `M ${point.x} ${point.y}`;
      }

      const previous = points[index - 1];

      const controlX1 =
        previous.x + (point.x - previous.x) / 2;

      const controlX2 =
        point.x - (point.x - previous.x) / 2;

      return `C ${controlX1} ${previous.y}, ${controlX2} ${point.y}, ${point.x} ${point.y}`;
    })
    .join(' ');

  const areaPath = `${linePath} L ${points[points.length - 1].x} ${
    height - paddingBottom
  } L ${points[0].x} ${
    height - paddingBottom
  } Z`;

  return (
    <div style={{ width: '100%', overflow: 'hidden' }}>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        style={{
          width: '100%',
          height: '280px',
          minWidth: '520px',
          display: 'block',
        }}
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient
            id="revenueFill"
            x1="0"
            y1="0"
            x2="0"
            y2="1"
          >
            <stop
              offset="0%"
              stopColor={COLORS.red}
              stopOpacity="0.32"
            />
            <stop
              offset="100%"
              stopColor={COLORS.red}
              stopOpacity="0"
            />
          </linearGradient>
        </defs>

        {[0, 1, 2, 3].map((row) => {
          const y =
            paddingTop +
            row *
              ((height - paddingTop - paddingBottom) /
                3);

          return (
            <line
              key={row}
              x1={paddingX}
              x2={width - paddingX}
              y1={y}
              y2={y}
              stroke="rgba(255,255,255,0.07)"
              strokeWidth="1"
            />
          );
        })}

        <path
          d={areaPath}
          fill="url(#revenueFill)"
        />

        <path
          d={linePath}
          fill="none"
          stroke={COLORS.red}
          strokeWidth="3"
          strokeLinecap="round"
        />

        {points.map((point) => (
          <g key={point.day}>
            <circle
              cx={point.x}
              cy={point.y}
              r="6"
              fill={COLORS.red}
            />
            <circle
              cx={point.x}
              cy={point.y}
              r="2.5"
              fill="#ffffff"
            />

            <text
              x={point.x}
              y={height - 13}
              textAnchor="middle"
              fill="#707070"
              fontSize="12"
            >
              {point.day}
            </text>
          </g>
        ))}

        {[2000, 1500, 1000, 500, 0].map(
          (value, index) => {
            const y =
              paddingTop +
              index *
                ((height -
                  paddingTop -
                  paddingBottom) /
                  4);

            return (
              <text
                key={value}
                x="0"
                y={y + 4}
                fill="#666"
                fontSize="11"
              >
                {formatCurrency(value).replace(
                  ',00',
                  ''
                )}
              </text>
            );
          }
        )}
      </svg>
    </div>
  );
}

function AdminDashboard() {
  const [activeMenu, setActiveMenu] = useState(
    'Dashboard'
  );

  const [period, setPeriod] = useState('Hoje');

  const totalRevenue = 12850;
  const received = 9420;
  const pending = 3430;
  const fees = 380;
  const net = received - fees;

  const menuItems = useMemo(
    () => [
      {
        label: 'Dashboard',
        icon: 'dashboard',
      },
      {
        label: 'Cobranças',
        icon: 'charges',
      },
      {
        label: 'Clientes',
        icon: 'clients',
      },
      {
        label: 'Pagamentos',
        icon: 'payments',
      },
      {
        label: 'Faturamento',
        icon: 'chart',
      },
      {
        label: 'Comprovantes',
        icon: 'receipt',
      },
      {
        label: 'Marcas / Projetos',
        icon: 'tag',
      },
      {
        label: 'Relatórios',
        icon: 'reports',
      },
      {
        label: 'Configurações',
        icon: 'settings',
      },
    ],
    []
  );

  return (
    <div
      style={{
        minHeight: '100vh',
        background: COLORS.bg,
        color: COLORS.white,
        fontFamily:
          'Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      }}
    >
      <style>
        {`
          * {
            box-sizing: border-box;
          }

          body {
            margin: 0;
            background: #070707;
          }

          button,
          input,
          select {
            font: inherit;
          }

          button {
            -webkit-tap-highlight-color: transparent;
          }

          .dashboard-layout {
            display: flex;
            min-height: 100vh;
          }

          .dashboard-sidebar {
            position: fixed;
            z-index: 20;
            left: 0;
            top: 0;
            bottom: 0;
            width: 258px;
            background:
              radial-gradient(circle at 30% 85%, rgba(239,43,53,0.08), transparent 28%),
              #090909;
            border-right: 1px solid rgba(255,255,255,0.08);
            display: flex;
            flex-direction: column;
          }

          .dashboard-content {
            width: calc(100% - 258px);
            margin-left: 258px;
            min-width: 0;
          }

          .dashboard-main {
            max-width: 1500px;
            margin: 0 auto;
            padding: 0 30px 50px;
          }

          .metrics-grid {
            display: grid;
            grid-template-columns: repeat(4, minmax(0, 1fr));
            gap: 18px;
          }

          .middle-grid {
            display: grid;
            grid-template-columns: minmax(0, 2fr) minmax(300px, 0.9fr);
            gap: 18px;
          }

          .bottom-grid {
            display: grid;
            grid-template-columns: minmax(0, 2fr) minmax(300px, 0.9fr);
            gap: 18px;
          }

          .right-stack {
            display: grid;
            gap: 18px;
          }

          .responsive-table {
            overflow-x: auto;
          }

          @media (max-width: 1200px) {
            .metrics-grid {
              grid-template-columns: repeat(2, minmax(0, 1fr));
            }

            .middle-grid,
            .bottom-grid {
              grid-template-columns: 1fr;
            }
          }

          @media (max-width: 820px) {
            .dashboard-sidebar {
              width: 76px;
            }

            .dashboard-sidebar .brand-text,
            .dashboard-sidebar .menu-label,
            .dashboard-sidebar .admin-info,
            .dashboard-sidebar .logout-label {
              display: none;
            }

            .dashboard-sidebar .brand {
              justify-content: center;
            }

            .dashboard-sidebar .menu-button {
              justify-content: center;
              padding-left: 0;
              padding-right: 0;
            }

            .dashboard-content {
              width: calc(100% - 76px);
              margin-left: 76px;
            }

            .dashboard-main {
              padding: 0 18px 35px;
            }

            .metrics-grid {
              grid-template-columns: 1fr;
            }

            .header-date {
              display: none;
            }
          }

          @media (max-width: 600px) {
            .top-header {
              padding: 18px;
            }

            .dashboard-main {
              padding: 0 14px 30px;
            }

            .welcome-row {
              align-items: flex-start !important;
              flex-direction: column;
            }

            .period-selector {
              width: 100%;
              overflow-x: auto;
            }

            .period-selector button {
              white-space: nowrap;
            }

            .chart-card,
            .panel-card {
              border-radius: 14px !important;
            }
          }
        `}
      </style>

      <div className="dashboard-layout">
        {/* SIDEBAR */}
        <aside className="dashboard-sidebar">
          <div
            className="brand"
            style={{
              minHeight: '92px',
              padding: '20px',
              display: 'flex',
              alignItems: 'center',
              gap: '13px',
              borderBottom:
                '1px solid rgba(255,255,255,0.07)',
            }}
          >
            <div
              style={{
                width: '38px',
                height: '38px',
                flexShrink: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '11px',
                background: COLORS.red,
                color: '#fff',
                fontWeight: 900,
                fontSize: '18px',
                boxShadow:
                  '0 10px 30px rgba(239,43,53,0.22)',
              }}
            >
              LS
            </div>

            <div className="brand-text">
              <div
                style={{
                  fontSize: '15px',
                  fontWeight: 900,
                  letterSpacing: '0.08em',
                }}
              >
                LÉO SOUZA
              </div>

              <div
                style={{
                  marginTop: '3px',
                  fontSize: '10px',
                  color: '#777',
                  letterSpacing: '0.18em',
                  fontWeight: 700,
                }}
              >
                DESIGNER
              </div>
            </div>
          </div>

          <div
            className="menu-label"
            style={{
              padding:
                '25px 20px 10px',
              color: '#4f4f4f',
              fontSize: '10px',
              fontWeight: 800,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
            }}
          >
            Central
          </div>

          <nav
            style={{
              padding: '0 10px',
              flex: 1,
            }}
          >
            {menuItems.map((item) => {
              const active =
                activeMenu === item.label;

              return (
                <button
                  key={item.label}
                  className="menu-button"
                  onClick={() =>
                    setActiveMenu(item.label)
                  }
                  style={{
                    width: '100%',
                    height: '47px',
                    marginBottom: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '14px',
                    padding: '0 12px',
                    border: '1px solid transparent',
                    borderRadius: '9px',
                    background: active
                      ? 'linear-gradient(90deg, rgba(239,43,53,0.17), rgba(239,43,53,0.05))'
                      : 'transparent',
                    color: active
                      ? '#ffffff'
                      : '#858585',
                    cursor: 'pointer',
                    textAlign: 'left',
                    position: 'relative',
                  }}
                >
                  {active && (
                    <span
                      style={{
                        position: 'absolute',
                        left: '-10px',
                        top: '7px',
                        bottom: '7px',
                        width: '3px',
                        borderRadius:
                          '0 4px 4px 0',
                        background:
                          COLORS.red,
                      }}
                    />
                  )}

                  <span
                    style={{
                      display: 'flex',
                      color: active
                        ? COLORS.red
                        : '#707070',
                    }}
                  >
                    <Icon
                      name={item.icon}
                      size={19}
                    />
                  </span>

                  <span
                    className="menu-label"
                    style={{
                      fontSize: '13px',
                      fontWeight: active
                        ? 700
                        : 500,
                    }}
                  >
                    {item.label}
                  </span>
                </button>
              );
            })}
          </nav>

          <div
            style={{
              padding: '15px 12px',
              borderTop:
                '1px solid rgba(255,255,255,0.07)',
            }}
          >
            <button
              onClick={() => {
                window.location.href =
                  '/pagamentos/admin';
              }}
              style={{
                width: '100%',
                height: '43px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                border: 0,
                borderRadius: '9px',
                background: 'transparent',
                color: '#666',
                cursor: 'pointer',
              }}
            >
              <Icon name="logout" size={18} />

              <span className="logout-label">
                Sair da Central
              </span>
            </button>
          </div>
        </aside>

        {/* CONTEÚDO */}
        <section className="dashboard-content">
          {/* HEADER */}
          <header
            className="top-header"
            style={{
              height: '92px',
              padding: '0 30px',
              display: 'flex',
              alignItems: 'center',
              justifyContent:
                'space-between',
              borderBottom:
                '1px solid rgba(255,255,255,0.07)',
              background:
                'rgba(7,7,7,0.86)',
              backdropFilter:
                'blur(20px)',
              position: 'sticky',
              top: 0,
              zIndex: 10,
            }}
          >
            <div>
              <div
                style={{
                  color: '#777',
                  fontSize: '11px',
                  fontWeight: 700,
                  letterSpacing:
                    '0.18em',
                  textTransform:
                    'uppercase',
                }}
              >
                Central de Pagamentos
              </div>

              <div
                style={{
                  marginTop: '6px',
                  fontSize: '20px',
                  fontWeight: 800,
                }}
              >
                Controle. Evolução. Resultados.
              </div>
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
              }}
            >
              <div
                className="header-date"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '9px',
                  height: '42px',
                  padding: '0 14px',
                  border:
                    '1px solid rgba(255,255,255,0.09)',
                  borderRadius: '10px',
                  color: '#aaa',
                  fontSize: '12px',
                }}
              >
                06 de Setembro de 2026
                <Icon
                  name="chevron"
                  size={15}
                />
              </div>

              <button
                style={{
                  position: 'relative',
                  width: '42px',
                  height: '42px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border:
                    '1px solid rgba(255,255,255,0.09)',
                  borderRadius: '10px',
                  background:
                    'rgba(255,255,255,0.025)',
                  color: '#aaa',
                  cursor: 'pointer',
                }}
              >
                <Icon name="bell" size={18} />

                <span
                  style={{
                    position: 'absolute',
                    top: '7px',
                    right: '7px',
                    width: '7px',
                    height: '7px',
                    borderRadius:
                      '50%',
                    background:
                      COLORS.red,
                    boxShadow:
                      '0 0 0 3px #070707',
                  }}
                />
              </button>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding:
                    '5px 10px 5px 5px',
                  border:
                    '1px solid rgba(255,255,255,0.09)',
                  borderRadius: '11px',
                }}
              >
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '9px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background:
                      'linear-gradient(145deg,#444,#1b1b1b)',
                    fontWeight: 800,
                    fontSize: '11px',
                  }}
                >
                  LS
                </div>

                <div className="admin-info">
                  <div
                    style={{
                      fontSize: '12px',
                      fontWeight: 700,
                    }}
                  >
                    Léo Souza
                  </div>

                  <div
                    style={{
                      marginTop: '2px',
                      color: '#666',
                      fontSize: '10px',
                    }}
                  >
                    Administrador
                  </div>
                </div>

                <Icon
                  name="chevron"
                  size={14}
                />
              </div>
            </div>
          </header>

          <main className="dashboard-main">
            {/* BOAS-VINDAS */}
            <div
              className="welcome-row"
              style={{
                padding:
                  '32px 0 24px',
                display: 'flex',
                alignItems: 'flex-end',
                justifyContent:
                  'space-between',
                gap: '20px',
              }}
            >
              <div>
                <h1
                  style={{
                    margin: 0,
                    fontSize:
                      'clamp(28px, 4vw, 42px)',
                    lineHeight: 1,
                    letterSpacing:
                      '-0.04em',
                  }}
                >
                  Bem-vindo, Léo.
                </h1>

                <p
                  style={{
                    margin:
                      '10px 0 0',
                    color: '#777',
                    fontSize: '14px',
                  }}
                >
                  Aqui está o resumo financeiro
                  da sua operação.
                </p>
              </div>

              <div
                className="period-selector"
                style={{
                  display: 'flex',
                  padding: '4px',
                  border:
                    '1px solid rgba(255,255,255,0.08)',
                  borderRadius: '10px',
                  background:
                    'rgba(255,255,255,0.025)',
                }}
              >
                {[
                  'Hoje',
                  '7 dias',
                  '30 dias',
                  'Este mês',
                  '3 meses',
                  'Personalizado',
                ].map((item) => (
                  <button
                    key={item}
                    onClick={() =>
                      setPeriod(item)
                    }
                    style={{
                      height: '34px',
                      padding:
                        '0 12px',
                      border: 0,
                      borderRadius: '7px',
                      background:
                        period === item
                          ? COLORS.red
                          : 'transparent',
                      color:
                        period === item
                          ? '#fff'
                          : '#777',
                      fontSize: '11px',
                      fontWeight:
                        period === item
                          ? 800
                          : 500,
                      cursor:
                        'pointer',
                    }}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            {/* CARDS */}
            <section className="metrics-grid">
              <MetricCard
                title="Faturamento"
                value={formatCurrency(
                  totalRevenue
                )}
                description="em relação ao mês anterior"
                positive="+18,4%"
                icon="chart"
                accent={COLORS.red}
              />

              <MetricCard
                title="Recebido"
                value={formatCurrency(
                  received
                )}
                description="em relação ao mês anterior"
                positive="+12,8%"
                icon="wallet"
                accent={COLORS.green}
              />

              <MetricCard
                title="A receber"
                value={formatCurrency(
                  pending
                )}
                description="8 cobranças pendentes"
                icon="clock"
                accent={COLORS.red}
              />

              <MetricCard
                title="Cobranças"
                value="27"
                description="21 pagas · 8 pendentes"
                icon="receipt"
                accent={COLORS.red}
              />
            </section>

            <div style={{ height: '18px' }} />

            {/* GRÁFICO + RESUMO */}
            <section className="middle-grid">
              <div
                className="chart-card"
                style={{
                  minWidth: 0,
                  padding: '22px',
                  border:
                    '1px solid rgba(255,255,255,0.09)',
                  borderRadius: '16px',
                  background:
                    'linear-gradient(145deg, rgba(255,255,255,0.035), rgba(255,255,255,0.012))',
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent:
                      'space-between',
                    alignItems:
                      'center',
                    gap: '10px',
                    marginBottom:
                      '8px',
                  }}
                >
                  <div>
                    <h2
                      style={{
                        margin: 0,
                        fontSize:
                          '19px',
                        fontWeight: 800,
                      }}
                    >
                      Faturamento por período
                    </h2>

                    <div
                      style={{
                        marginTop:
                          '5px',
                        color:
                          '#626262',
                        fontSize:
                          '11px',
                      }}
                    >
                      Acompanhe a evolução
                      das suas receitas.
                    </div>
                  </div>

                  <select
                    defaultValue="7"
                    style={{
                      height: '36px',
                      padding:
                        '0 10px',
                      border:
                        '1px solid rgba(255,255,255,0.1)',
                      borderRadius:
                        '8px',
                      outline: 'none',
                      background:
                        '#121212',
                      color: '#aaa',
                      fontSize:
                        '11px',
                    }}
                  >
                    <option value="7">
                      Últimos 7 dias
                    </option>
                    <option value="30">
                      Últimos 30 dias
                    </option>
                    <option value="90">
                      Últimos 3 meses
                    </option>
                  </select>
                </div>

                <RevenueChart />
              </div>

              <div
                className="panel-card"
                style={{
                  padding: '22px',
                  border:
                    '1px solid rgba(255,255,255,0.09)',
                  borderRadius: '16px',
                  background:
                    'linear-gradient(145deg, rgba(255,255,255,0.035), rgba(255,255,255,0.012))',
                }}
              >
                <h2
                  style={{
                    margin:
                      '0 0 22px',
                    fontSize:
                      '19px',
                    fontWeight: 800,
                  }}
                >
                  Resumo financeiro
                </h2>

                {[
                  [
                    'Faturamento bruto',
                    totalRevenue,
                    '#fff',
                  ],
                  [
                    'Recebido',
                    received,
                    COLORS.green,
                  ],
                  [
                    'A receber',
                    pending,
                    COLORS.red,
                  ],
                  [
                    'Taxas InfinitePay',
                    -fees,
                    COLORS.red,
                  ],
                ].map(
                  ([label, value, color]) => (
                    <div
                      key={label}
                      style={{
                        display:
                          'flex',
                        alignItems:
                          'center',
                        justifyContent:
                          'space-between',
                        gap: '10px',
                        padding:
                          '14px 0',
                        borderBottom:
                          '1px solid rgba(255,255,255,0.07)',
                      }}
                    >
                      <span
                        style={{
                          color:
                            '#777',
                          fontSize:
                            '12px',
                        }}
                      >
                        {label}
                      </span>

                      <strong
                        style={{
                          color,
                          fontSize:
                            '13px',
                        }}
                      >
                        {formatCurrency(
                          value
                        )}
                      </strong>
                    </div>
                  )
                )}

                <div
                  style={{
                    display:
                      'flex',
                    alignItems:
                      'flex-end',
                    justifyContent:
                      'space-between',
                    paddingTop:
                      '20px',
                  }}
                >
                  <div>
                    <div
                      style={{
                        color:
                          '#666',
                        fontSize:
                          '11px',
                      }}
                    >
                      Líquido recebido
                    </div>

                    <div
                      style={{
                        marginTop:
                          '6px',
                        fontSize:
                          '25px',
                        fontWeight:
                          900,
                      }}
                    >
                      {formatCurrency(
                        net
                      )}
                    </div>
                  </div>

                  <div
                    style={{
                      color:
                        COLORS.green,
                      fontSize:
                        '11px',
                      fontWeight:
                        800,
                    }}
                  >
                    +12,8%
                  </div>
                </div>
              </div>
            </section>

            <div style={{ height: '18px' }} />

            {/* COBRANÇAS + LADO DIREITO */}
            <section className="bottom-grid">
              <div
                className="panel-card"
                style={{
                  minWidth: 0,
                  padding: '22px',
                  border:
                    '1px solid rgba(255,255,255,0.09)',
                  borderRadius: '16px',
                  background:
                    'linear-gradient(145deg, rgba(255,255,255,0.035), rgba(255,255,255,0.012))',
                }}
              >
                <div
                  style={{
                    display:
                      'flex',
                    justifyContent:
                      'space-between',
                    alignItems:
                      'center',
                    marginBottom:
                      '18px',
                  }}
                >
                  <div>
                    <h2
                      style={{
                        margin: 0,
                        fontSize:
                          '19px',
                        fontWeight:
                          800,
                      }}
                    >
                      Últimas cobranças
                    </h2>

                    <div
                      style={{
                        marginTop:
                          '5px',
                        color:
                          '#626262',
                        fontSize:
                          '11px',
                      }}
                    >
                      Movimentações mais recentes.
                    </div>
                  </div>

                  <button
                    style={{
                      display:
                        'flex',
                      alignItems:
                        'center',
                      gap: '5px',
                      border: 0,
                      background:
                        'transparent',
                      color:
                        COLORS.red,
                      fontSize:
                        '11px',
                      fontWeight:
                        800,
                      cursor:
                        'pointer',
                    }}
                  >
                    Ver todas
                    <Icon
                      name="arrowRight"
                      size={14}
                    />
                  </button>
                </div>

                <div className="responsive-table">
                  <table
                    style={{
                      width:
                        '100%',
                      minWidth:
                        '650px',
                      borderCollapse:
                        'collapse',
                    }}
                  >
                    <thead>
                      <tr>
                        {[
                          'Cliente',
                          'Serviço',
                          'Valor',
                          'Status',
                          'Data',
                          '',
                        ].map(
                          (head) => (
                            <th
                              key={head}
                              style={{
                                padding:
                                  '0 10px 12px',
                                textAlign:
                                  'left',
                                color:
                                  '#555',
                                fontSize:
                                  '10px',
                                fontWeight:
                                  800,
                                letterSpacing:
                                  '0.08em',
                                textTransform:
                                  'uppercase',
                                borderBottom:
                                  '1px solid rgba(255,255,255,0.07)',
                              }}
                            >
                              {head}
                            </th>
                          )
                        )}
                      </tr>
                    </thead>

                    <tbody>
                      {charges.map(
                        (charge) => (
                          <tr
                            key={
                              charge.id
                            }
                          >
                            <td
                              style={{
                                padding:
                                  '13px 10px',
                                borderBottom:
                                  '1px solid rgba(255,255,255,0.05)',
                              }}
                            >
                              <div
                                style={{
                                  display:
                                    'flex',
                                  alignItems:
                                    'center',
                                  gap: '10px',
                                }}
                              >
                                <div
                                  style={{
                                    width:
                                      '31px',
                                    height:
                                      '31px',
                                    flexShrink:
                                      0,
                                    display:
                                      'flex',
                                    alignItems:
                                      'center',
                                    justifyContent:
                                      'center',
                                    borderRadius:
                                      '9px',
                                    background:
                                      charge.client ===
                                      'Kreative Sports'
                                        ? COLORS.red
                                        : '#252525',
                                    color:
                                      '#fff',
                                    fontSize:
                                      '9px',
                                    fontWeight:
                                      900,
                                  }}
                                >
                                  {
                                    charge.initials
                                  }
                                </div>

                                <div>
                                  <div
                                    style={{
                                      fontSize:
                                        '12px',
                                      fontWeight:
                                        700,
                                    }}
                                  >
                                    {
                                      charge.client
                                    }
                                  </div>

                                  <div
                                    style={{
                                      marginTop:
                                        '2px',
                                      color:
                                        '#555',
                                      fontSize:
                                        '10px',
                                    }}
                                  >
                                    Cliente
                                  </div>
                                </div>
                              </div>
                            </td>

                            <td
                              style={{
                                padding:
                                  '13px 10px',
                                color:
                                  '#777',
                                fontSize:
                                  '11px',
                                borderBottom:
                                  '1px solid rgba(255,255,255,0.05)',
                              }}
                            >
                              {
                                charge.service
                              }
                            </td>

                            <td
                              style={{
                                padding:
                                  '13px 10px',
                                fontSize:
                                  '11px',
                                fontWeight:
                                  700,
                                borderBottom:
                                  '1px solid rgba(255,255,255,0.05)',
                              }}
                            >
                              {formatCurrency(
                                charge.amount
                              )}
                            </td>

                            <td
                              style={{
                                padding:
                                  '13px 10px',
                                borderBottom:
                                  '1px solid rgba(255,255,255,0.05)',
                              }}
                            >
                              <span
                                style={{
                                  display:
                                    'inline-flex',
                                  alignItems:
                                    'center',
                                  gap: '6px',
                                  color:
                                    charge.status ===
                                    'Pago'
                                      ? COLORS.green
                                      : COLORS.red,
                                  fontSize:
                                    '10px',
                                  fontWeight:
                                    800,
                                }}
                              >
                                <span
                                  style={{
                                    width:
                                      '6px',
                                    height:
                                      '6px',
                                    borderRadius:
                                      '50%',
                                    background:
                                      'currentColor',
                                  }}
                                />

                                {
                                  charge.status
                                }
                              </span>
                            </td>

                            <td
                              style={{
                                padding:
                                  '13px 10px',
                                color:
                                  '#666',
                                fontSize:
                                  '10px',
                                borderBottom:
                                  '1px solid rgba(255,255,255,0.05)',
                              }}
                            >
                              {
                                charge.date
                              }
                            </td>

                            <td
                              style={{
                                padding:
                                  '13px 10px',
                                textAlign:
                                  'right',
                                color:
                                  '#555',
                                fontSize:
                                  '18px',
                                borderBottom:
                                  '1px solid rgba(255,255,255,0.05)',
                              }}
                            >
                              ⋮
                            </td>
                          </tr>
                        )
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="right-stack">
                {/* MÉTODOS */}
                <div
                  className="panel-card"
                  style={{
                    padding: '22px',
                    border:
                      '1px solid rgba(255,255,255,0.09)',
                    borderRadius:
                      '16px',
                    background:
                      'linear-gradient(145deg, rgba(255,255,255,0.035), rgba(255,255,255,0.012))',
                  }}
                >
                  <h2
                    style={{
                      margin:
                        '0 0 20px',
                      fontSize:
                        '18px',
                      fontWeight:
                        800,
                    }}
                  >
                    Métodos de pagamento
                  </h2>

                  {[
                    ['Pix', 58],
                    ['Cartão de crédito', 28],
                    ['Cartão de débito', 8],
                    ['Boleto', 4],
                    ['Outros', 2],
                  ].map(
                    ([label, value]) => (
                      <div
                        key={label}
                        style={{
                          marginBottom:
                            '13px',
                        }}
                      >
                        <div
                          style={{
                            display:
                              'flex',
                            justifyContent:
                              'space-between',
                            marginBottom:
                              '6px',
                          }}
                        >
                          <span
                            style={{
                              color:
                                '#858585',
                              fontSize:
                                '11px',
                            }}
                          >
                            {label}
                          </span>

                          <strong
                            style={{
                              fontSize:
                                '10px',
                              color:
                                '#aaa',
                            }}
                          >
                            {value}%
                          </strong>
                        </div>

                        <div
                          style={{
                            height:
                              '5px',
                            overflow:
                              'hidden',
                            borderRadius:
                              '10px',
                            background:
                              '#242424',
                          }}
                        >
                          <div
                            style={{
                              width: `${value}%`,
                              height:
                                '100%',
                              borderRadius:
                                '10px',
                              background:
                                `linear-gradient(90deg, ${COLORS.red}, #ff5a61)`,
                            }}
                          />
                        </div>
                      </div>
                    )
                  )}
                </div>

                {/* CLIENTES */}
                <div
                  className="panel-card"
                  style={{
                    padding: '22px',
                    border:
                      '1px solid rgba(255,255,255,0.09)',
                    borderRadius:
                      '16px',
                    background:
                      'linear-gradient(145deg, rgba(255,255,255,0.035), rgba(255,255,255,0.012))',
                  }}
                >
                  <div
                    style={{
                      display:
                        'flex',
                      justifyContent:
                        'space-between',
                      alignItems:
                        'center',
                      marginBottom:
                        '20px',
                    }}
                  >
                    <h2
                      style={{
                        margin: 0,
                        fontSize:
                          '18px',
                        fontWeight:
                          800,
                      }}
                    >
                      Clientes
                    </h2>

                    <span
                      style={{
                        color:
                          COLORS.red,
                        fontSize:
                          '10px',
                        fontWeight:
                          800,
                      }}
                    >
                      Ver todos →
                    </span>
                  </div>

                  <div
                    style={{
                      display:
                        'grid',
                      gridTemplateColumns:
                        'repeat(3, 1fr)',
                    }}
                  >
                    {[
                      [
                        '48',
                        'Total de clientes',
                      ],
                      [
                        '6',
                        'Novos este mês',
                      ],
                      [
                        '32',
                        'Clientes ativos',
                      ],
                    ].map(
                      ([value, label], index) => (
                        <div
                          key={label}
                          style={{
                            padding:
                              '0 12px',
                            borderRight:
                              index <
                              2
                                ? '1px solid rgba(255,255,255,0.07)'
                                : 0,
                          }}
                        >
                          <div
                            style={{
                              fontSize:
                                '23px',
                              fontWeight:
                                900,
                            }}
                          >
                            {value}
                          </div>

                          <div
                            style={{
                              marginTop:
                                '5px',
                              color:
                                '#5f5f5f',
                              fontSize:
                                '9px',
                              lineHeight:
                                1.4,
                            }}
                          >
                            {label}
                          </div>
                        </div>
                      )
                    )}
                  </div>
                </div>
              </div>
            </section>

            {/* RODAPÉ DO DASHBOARD */}
            <div
              style={{
                marginTop:
                  '28px',
                padding:
                  '18px 0 0',
                borderTop:
                  '1px solid rgba(255,255,255,0.06)',
                display:
                  'flex',
                justifyContent:
                  'space-between',
                alignItems:
                  'center',
                gap: '15px',
                color: '#444',
                fontSize: '10px',
              }}
            >
              <span>
                CENTRAL DE PAGAMENTOS · LÉO SOUZA DESIGNER
              </span>

              <span>
                Sistema administrativo
              </span>
            </div>
          </main>
        </section>
      </div>
    </div>
  );
}

export default AdminDashboard;