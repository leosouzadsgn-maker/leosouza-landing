import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { supabase } from '../lib/supabase';

const COLORS = {
  bg: '#070707',
  panel: '#101010',
  panel2: '#141414',
  border: 'rgba(255,255,255,0.09)',
  white: '#ffffff',
  muted: '#858585',
  muted2: '#555555',
  red: '#ef2b35',
  green: '#22c55e',
  yellow: '#f59e0b',
  blue: '#3b82f6',
};

const formatCurrency = (value) =>
  new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(Number(value || 0));

const formatDate = (value) => {
  if (!value) return '—';

  return new Intl.DateTimeFormat('pt-BR').format(
    new Date(value)
  );
};

const normalize = (value) =>
  String(value || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

function Icon({ name, size = 20 }) {
  const props = {
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

    wallet: (
      <>
        <path d="M3 7.5A2.5 2.5 0 0 1 5.5 5H20v14H5.5A2.5 2.5 0 0 1 3 16.5z" />
        <path d="M3 8h14" />
        <path d="M17 11h5v5h-5a2.5 2.5 0 0 1 0-5Z" />
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

    refresh: (
      <>
        <path d="M20 11a8.1 8.1 0 0 0-14.8-4L3 10" />
        <path d="M3 4v6h6" />
        <path d="M4 13a8.1 8.1 0 0 0 14.8 4L21 14" />
        <path d="M21 20v-6h-6" />
      </>
    ),

    logout: (
      <>
        <path d="M10 17l5-5-5-5" />
        <path d="M15 12H3" />
        <path d="M21 19V5a2 2 0 0 0-2-2h-5" />
      </>
    ),

    menu: (
      <>
        <path d="M4 7h16" />
        <path d="M4 12h16" />
        <path d="M4 17h16" />
      </>
    ),

    arrowDown: (
      <>
        <path d="M12 5v14" />
        <path d="m19 12-7 7-7-7" />
      </>
    ),

    arrowUp: (
      <>
        <path d="M12 19V5" />
        <path d="m5 12 7-7 7 7" />
      </>
    ),
  };

  return <svg {...props}>{icons[name]}</svg>;
}

function Card({ children, style = {} }) {
  return (
    <div
      style={{
        background: COLORS.panel,
        border: `1px solid ${COLORS.border}`,
        borderRadius: 16,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function EmptyState({ children }) {
  return (
    <div
      style={{
        padding: '42px 20px',
        textAlign: 'center',
        color: COLORS.muted,
        fontSize: 14,
      }}
    >
      {children}
    </div>
  );
}

function FinancialManagement() {
  const [user, setUser] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [transactions, setTransactions] = useState([]);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [mobileOpen, setMobileOpen] = useState(false);

  const loadFinancialData = useCallback(async () => {
    setRefreshing(true);

    try {
      const {
        data: { user: authenticatedUser },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError) {
        throw authError;
      }

      if (!authenticatedUser) {
        window.location.href = '/pagamentos/admin';
        return;
      }

      setUser(authenticatedUser);

      const ownerId = authenticatedUser.id;

      const [
        accountsResponse,
        categoriesResponse,
        transactionsResponse,
      ] = await Promise.all([
        supabase
          .from('financial_accounts')
          .select('*')
          .eq('owner_id', ownerId)
          .eq('is_active', true)
          .order('created_at', {
            ascending: true,
          }),

        supabase
          .from('financial_categories')
          .select('*')
          .eq('owner_id', ownerId)
          .eq('is_active', true)
          .order('name', {
            ascending: true,
          }),

        supabase
          .from('financial_transactions')
          .select(`
            *,
            financial_accounts (
              id,
              name,
              account_type
            ),
            financial_categories (
              id,
              name,
              category_type
            )
          `)
          .eq('owner_id', ownerId)
          .order('transaction_date', {
            ascending: false,
          })
          .order('created_at', {
            ascending: false,
          }),
      ]);

      setAccounts(
        accountsResponse.error
          ? []
          : accountsResponse.data || []
      );

      setCategories(
        categoriesResponse.error
          ? []
          : categoriesResponse.data || []
      );

      setTransactions(
        transactionsResponse.error
          ? []
          : transactionsResponse.data || []
      );
    } catch (err) {
      console.error(
        'Erro ao carregar gestão financeira:',
        err
      );

      setAccounts([]);
      setCategories([]);
      setTransactions([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadFinancialData();
  }, [loadFinancialData]);

  const income = useMemo(
    () =>
      transactions
        .filter(
          (transaction) =>
            normalize(transaction.type) === 'income' &&
            normalize(transaction.status) !== 'cancelled'
        )
        .reduce(
          (total, transaction) =>
            total + Number(transaction.amount || 0),
          0
        ),
    [transactions]
  );

  const expenses = useMemo(
    () =>
      transactions
        .filter(
          (transaction) =>
            normalize(transaction.type) === 'expense' &&
            normalize(transaction.status) !== 'cancelled'
        )
        .reduce(
          (total, transaction) =>
            total + Number(transaction.amount || 0),
          0
        ),
    [transactions]
  );

  const withdrawals = useMemo(
    () =>
      transactions
        .filter(
          (transaction) =>
            [
              'withdrawal',
              'retirada',
              'pro-labore',
              'prolabore',
            ].includes(normalize(transaction.type)) &&
            normalize(transaction.status) !== 'cancelled'
        )
        .reduce(
          (total, transaction) =>
            total + Number(transaction.amount || 0),
          0
        ),
    [transactions]
  );

  const totalAccountBalance = useMemo(
    () =>
      accounts.reduce(
        (total, account) =>
          total + Number(account.current_balance || 0),
        0
      ),
    [accounts]
  );

  const businessAccount = useMemo(
    () =>
      accounts.find((account) =>
        [
          'business',
          'caixa',
          'operacional',
          'cash',
        ].includes(
          normalize(account.account_type)
        )
      ),
    [accounts]
  );

  const reserveAccount = useMemo(
    () =>
      accounts.find(
        (account) =>
          normalize(account.account_type) === 'reserve'
      ),
    [accounts]
  );

  const investmentAccount = useMemo(
    () =>
      accounts.find(
        (account) =>
          normalize(account.account_type) === 'investment'
      ),
    [accounts]
  );

  const netResult =
    income - expenses - withdrawals;

  const expenseCategories = useMemo(() => {
    const map = {};

    transactions
      .filter(
        (transaction) =>
          normalize(transaction.type) === 'expense'
      )
      .forEach((transaction) => {
        const category =
          transaction.financial_categories?.name ||
          'Sem categoria';

        map[category] =
          (map[category] || 0) +
          Number(transaction.amount || 0);
      });

    return Object.entries(map)
      .map(([name, amount]) => ({
        name,
        amount,
      }))
      .sort(
        (a, b) => b.amount - a.amount
      );
  }, [transactions]);

  const latestTransactions =
    transactions.slice(0, 10);

  const getTransactionColor = (type) => {
    const normalized = normalize(type);

    if (normalized === 'income') {
      return COLORS.green;
    }

    if (normalized === 'expense') {
      return COLORS.red;
    }

    if (
      ['reserve', 'reserva'].includes(
        normalized
      )
    ) {
      return COLORS.blue;
    }

    if (
      ['investment', 'investimento'].includes(
        normalized
      )
    ) {
      return '#a855f7';
    }

    if (
      [
        'withdrawal',
        'retirada',
        'pro-labore',
        'prolabore',
      ].includes(normalized)
    ) {
      return COLORS.yellow;
    }

    return COLORS.muted;
  };

  const getTransactionLabel = (type) => {
    const normalized = normalize(type);

    if (normalized === 'income') {
      return 'Entrada';
    }

    if (normalized === 'expense') {
      return 'Despesa';
    }

    if (
      ['reserve', 'reserva'].includes(
        normalized
      )
    ) {
      return 'Reserva';
    }

    if (
      ['investment', 'investimento'].includes(
        normalized
      )
    ) {
      return 'Investimento';
    }

    if (
      [
        'withdrawal',
        'retirada',
        'pro-labore',
        'prolabore',
      ].includes(normalized)
    ) {
      return 'Retirada';
    }

    if (
      [
        'transfer_in',
        'transfer_out',
        'transferencia',
      ].includes(normalized)
    ) {
      return 'Transferência';
    }

    return type || 'Movimentação';
  };

  const navigate = (path) => {
    window.location.href = path;
  };

  const styles = `
    * {
      box-sizing: border-box;
    }

    body {
      margin: 0;
    }

    .fm-nav {
      transition: transform .2s ease;
    }

    .fm-mobile {
      display: none !important;
    }

    .fm-card {
      transition: border-color .2s ease, transform .2s ease;
    }

    .fm-card:hover {
      border-color: rgba(255,255,255,.15) !important;
    }

    @media (max-width: 1050px) {
      .fm-nav {
        transform: translateX(-100%);
        position: fixed !important;
        z-index: 50;
      }

      .fm-nav.open {
        transform: translateX(0);
      }

      .fm-main {
        margin-left: 0 !important;
      }

      .fm-mobile {
        display: flex !important;
      }

      .fm-grid-4 {
        grid-template-columns: repeat(2, 1fr) !important;
      }

      .fm-grid-2 {
        grid-template-columns: 1fr !important;
      }
    }

    @media (max-width: 650px) {
      .fm-grid-4 {
        grid-template-columns: 1fr !important;
      }

      .fm-main {
        padding: 72px 18px 40px !important;
      }

      .fm-header-actions {
        flex-wrap: wrap;
      }
    }
  `;

  if (loading) {
    return (
      <div
        style={{
          minHeight: '100vh',
          background: COLORS.bg,
          color: COLORS.white,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'Arial, sans-serif',
        }}
      >
        Carregando Gestão Financeira...
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        background: COLORS.bg,
        color: COLORS.white,
        fontFamily: 'Inter, Arial, sans-serif',
      }}
    >
      <style>{styles}</style>

      <button
        className="fm-mobile"
        onClick={() =>
          setMobileOpen((value) => !value)
        }
        style={{
          position: 'fixed',
          top: 15,
          left: 15,
          zIndex: 60,
          width: 42,
          height: 42,
          borderRadius: 12,
          border: `1px solid ${COLORS.border}`,
          background: COLORS.panel,
          color: COLORS.white,
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
        }}
      >
        <Icon name="menu" />
      </button>

      <aside
        className={`fm-nav ${
          mobileOpen ? 'open' : ''
        }`}
        style={{
          position: 'fixed',
          top: 0,
          bottom: 0,
          left: 0,
          width: 245,
          background: '#090909',
          borderRight: `1px solid ${COLORS.border}`,
          padding: 22,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <div
          style={{
            fontWeight: 900,
            fontSize: 18,
            letterSpacing: '-.04em',
            marginBottom: 36,
          }}
        >
          CENTRAL{' '}
          <span style={{ color: COLORS.red }}>
            DE PAGAMENTOS
          </span>

          <div
            style={{
              fontSize: 10,
              color: '#666',
              letterSpacing: '.14em',
              marginTop: 5,
            }}
          >
            KREATIVE SPORTS / LÉO SOUZA
          </div>
        </div>

        <div
          style={{
            fontSize: 10,
            color: '#555',
            letterSpacing: '.14em',
            marginBottom: 10,
          }}
        >
          MENU
        </div>

        {[
          [
            'dashboard',
            'Dashboard',
            '/pagamentos/admin/dashboard',
          ],
          [
            'charges',
            'Cobranças',
            '/pagamentos/admin/cobrancas',
          ],
          [
            'clients',
            'Clientes',
            '/pagamentos/admin/clientes',
          ],
          [
            'payments',
            'Pagamentos',
            '/pagamentos/admin/pagamentos',
          ],
          [
            'chart',
            'Faturamento',
            '/pagamentos/admin/faturamento',
          ],
          [
            'wallet',
            'Gestão Financeira',
            '/pagamentos/admin/financeiro',
          ],
          [
            'receipt',
            'Comprovantes',
            '/pagamentos/admin/comprovantes',
          ],
          [
            'tag',
            'Marcas / Projetos',
            '/pagamentos/admin/marcas',
          ],
          [
            'reports',
            'Relatórios',
            '/pagamentos/admin/relatorios',
          ],
          [
            'settings',
            'Configurações',
            '/pagamentos/admin/configuracoes',
          ],
        ].map(([icon, label, path]) => {
          const active =
            path ===
            '/pagamentos/admin/financeiro';

          return (
            <div
              key={label}
              onClick={() => {
                setMobileOpen(false);
                navigate(path);
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '11px 12px',
                borderRadius: 10,
                marginBottom: 4,
                color: active
                  ? COLORS.white
                  : '#888',
                background: active
                  ? 'rgba(239,43,53,.12)'
                  : 'transparent',
                cursor: 'pointer',
                fontSize: 13,
                fontWeight: active
                  ? 700
                  : 500,
              }}
            >
              <Icon
                name={icon}
                size={18}
              />

              {label}
            </div>
          );
        })}

        <div
          style={{
            marginTop: 'auto',
            paddingTop: 20,
            borderTop: `1px solid ${COLORS.border}`,
          }}
        >
          <div
            style={{
              fontSize: 11,
              color: '#777',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              marginBottom: 12,
            }}
          >
            {user?.email}
          </div>

          <button
            onClick={async () => {
              await supabase.auth.signOut();
              window.location.href =
                '/pagamentos/admin';
            }}
            style={{
              display: 'flex',
              gap: 10,
              alignItems: 'center',
              background: 'none',
              border: 0,
              color: '#777',
              cursor: 'pointer',
              padding: 0,
            }}
          >
            <Icon
              name="logout"
              size={17}
            />
            Sair
          </button>
        </div>
      </aside>

      <main
        className="fm-main"
        style={{
          marginLeft: 245,
          padding: '30px 34px 60px',
          maxWidth: 1500,
        }}
      >
        <header
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 30,
            gap: 20,
          }}
        >
          <div>
            <div
              style={{
                fontSize: 11,
                color: '#666',
                letterSpacing: '.12em',
                textTransform: 'uppercase',
              }}
            >
              Central de Pagamentos
            </div>

            <h1
              style={{
                fontSize: 30,
                margin: '7px 0 0',
                letterSpacing: '-.04em',
              }}
            >
              Gestão Financeira
            </h1>

            <p
              style={{
                margin: '7px 0 0',
                color: '#666',
                fontSize: 13,
              }}
            >
              Controle o dinheiro da empresa,
              despesas, reservas e investimentos.
            </p>
          </div>

          <div
            className="fm-header-actions"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 9,
            }}
          >
            <button
              onClick={loadFinancialData}
              disabled={refreshing}
              style={{
                width: 42,
                height: 42,
                borderRadius: 10,
                border: `1px solid ${COLORS.border}`,
                background: COLORS.panel,
                color: '#aaa',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: refreshing
                  ? 'default'
                  : 'pointer',
                opacity: refreshing
                  ? 0.5
                  : 1,
              }}
              title="Atualizar dados"
            >
              <Icon
                name="refresh"
                size={18}
              />
            </button>
          </div>
        </header>

        <section
          className="fm-grid-4"
          style={{
            display: 'grid',
            gridTemplateColumns:
              'repeat(4, 1fr)',
            gap: 14,
            marginBottom: 18,
          }}
        >
          <Card
            className="fm-card"
            style={{
              padding: 20,
              borderLeft:
                `3px solid ${COLORS.white}`,
            }}
          >
            <div
              style={{
                color: '#777',
                fontSize: 12,
              }}
            >
              Saldo total
            </div>

            <div
              style={{
                fontSize: 27,
                fontWeight: 800,
                marginTop: 10,
              }}
            >
              {formatCurrency(
                totalAccountBalance
              )}
            </div>

            <div
              style={{
                color: '#555',
                fontSize: 11,
                marginTop: 6,
              }}
            >
              Todas as contas
            </div>
          </Card>

          <Card
            className="fm-card"
            style={{
              padding: 20,
              borderLeft:
                `3px solid ${COLORS.green}`,
            }}
          >
            <div
              style={{
                color: '#777',
                fontSize: 12,
              }}
            >
              Caixa da empresa
            </div>

            <div
              style={{
                fontSize: 27,
                fontWeight: 800,
                marginTop: 10,
              }}
            >
              {formatCurrency(
                businessAccount?.current_balance || 0
              )}
            </div>

            <div
              style={{
                color: '#555',
                fontSize: 11,
                marginTop: 6,
              }}
            >
              Disponível para operação
            </div>
          </Card>

          <Card
            className="fm-card"
            style={{
              padding: 20,
              borderLeft:
                `3px solid ${COLORS.blue}`,
            }}
          >
            <div
              style={{
                color: '#777',
                fontSize: 12,
              }}
            >
              Reserva
            </div>

            <div
              style={{
                fontSize: 27,
                fontWeight: 800,
                marginTop: 10,
              }}
            >
              {formatCurrency(
                reserveAccount?.current_balance || 0
              )}
            </div>

            <div
              style={{
                color: '#555',
                fontSize: 11,
                marginTop: 6,
              }}
            >
              Segurança financeira
            </div>
          </Card>

          <Card
            className="fm-card"
            style={{
              padding: 20,
              borderLeft:
                '3px solid #a855f7',
            }}
          >
            <div
              style={{
                color: '#777',
                fontSize: 12,
              }}
            >
              Investimentos
            </div>

            <div
              style={{
                fontSize: 27,
                fontWeight: 800,
                marginTop: 10,
              }}
            >
              {formatCurrency(
                investmentAccount?.current_balance || 0
              )}
            </div>

            <div
              style={{
                color: '#555',
                fontSize: 11,
                marginTop: 6,
              }}
            >
              Patrimônio investido
            </div>
          </Card>
        </section>

        <section
          className="fm-grid-4"
          style={{
            display: 'grid',
            gridTemplateColumns:
              'repeat(4, 1fr)',
            gap: 14,
            marginBottom: 18,
          }}
        >
          <Card
            style={{
              padding: 18,
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 9,
                color: COLORS.green,
                fontSize: 12,
                fontWeight: 700,
              }}
            >
              <Icon
                name="arrowDown"
                size={17}
              />
              ENTRADAS
            </div>

            <strong
              style={{
                display: 'block',
                fontSize: 22,
                marginTop: 10,
              }}
            >
              {formatCurrency(income)}
            </strong>
          </Card>

          <Card
            style={{
              padding: 18,
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 9,
                color: COLORS.red,
                fontSize: 12,
                fontWeight: 700,
              }}
            >
              <Icon
                name="arrowUp"
                size={17}
              />
              DESPESAS
            </div>

            <strong
              style={{
                display: 'block',
                fontSize: 22,
                marginTop: 10,
              }}
            >
              {formatCurrency(expenses)}
            </strong>
          </Card>

          <Card
            style={{
              padding: 18,
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 9,
                color: COLORS.yellow,
                fontSize: 12,
                fontWeight: 700,
              }}
            >
              <Icon
                name="wallet"
                size={17}
              />
              RETIRADAS
            </div>

            <strong
              style={{
                display: 'block',
                fontSize: 22,
                marginTop: 10,
              }}
            >
              {formatCurrency(withdrawals)}
            </strong>
          </Card>

          <Card
            style={{
              padding: 18,
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 9,
                color:
                  netResult >= 0
                    ? COLORS.green
                    : COLORS.red,
                fontSize: 12,
                fontWeight: 700,
              }}
            >
              RESULTADO
            </div>

            <strong
              style={{
                display: 'block',
                fontSize: 22,
                marginTop: 10,
                color:
                  netResult >= 0
                    ? COLORS.white
                    : COLORS.red,
              }}
            >
              {formatCurrency(netResult)}
            </strong>
          </Card>
        </section>

        <section
          className="fm-grid-2"
          style={{
            display: 'grid',
            gridTemplateColumns:
              'minmax(0, 1.5fr) minmax(300px, 1fr)',
            gap: 18,
            marginBottom: 18,
          }}
        >
          <Card
            style={{
              padding: 22,
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 20,
              }}
            >
              <div>
                <h2
                  style={{
                    margin: 0,
                    fontSize: 17,
                  }}
                >
                  Fluxo financeiro
                </h2>

                <div
                  style={{
                    color: '#666',
                    fontSize: 12,
                    marginTop: 5,
                  }}
                >
                  Visão geral do dinheiro movimentado
                </div>
              </div>
            </div>

            {income === 0 && expenses === 0 ? (
              <div
                style={{
                  height: 220,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#666',
                  fontSize: 13,
                  border:
                    `1px dashed ${COLORS.border}`,
                  borderRadius: 12,
                }}
              >
                Ainda não existem movimentações financeiras.
              </div>
            ) : (
              <div
                style={{
                  display: 'grid',
                  gap: 20,
                }}
              >
                <div>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      marginBottom: 8,
                      fontSize: 12,
                    }}
                  >
                    <span
                      style={{
                        color: '#888',
                      }}
                    >
                      Entradas
                    </span>

                    <strong>
                      {formatCurrency(income)}
                    </strong>
                  </div>

                  <div
                    style={{
                      height: 10,
                      background: '#1d1d1d',
                      borderRadius: 20,
                      overflow: 'hidden',
                    }}
                  >
                    <div
                      style={{
                        height: '100%',
                        width:
                          income + expenses > 0
                            ? `${Math.min(
                                100,
                                (income /
                                  Math.max(
                                    income,
                                    expenses
                                  )) *
                                  100
                              )}%`
                            : '0%',
                        background: COLORS.green,
                        borderRadius: 20,
                      }}
                    />
                  </div>
                </div>

                <div>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      marginBottom: 8,
                      fontSize: 12,
                    }}
                  >
                    <span
                      style={{
                        color: '#888',
                      }}
                    >
                      Despesas
                    </span>

                    <strong>
                      {formatCurrency(expenses)}
                    </strong>
                  </div>

                  <div
                    style={{
                      height: 10,
                      background: '#1d1d1d',
                      borderRadius: 20,
                      overflow: 'hidden',
                    }}
                  >
                    <div
                      style={{
                        height: '100%',
                        width:
                          income + expenses > 0
                            ? `${Math.min(
                                100,
                                (expenses /
                                  Math.max(
                                    income,
                                    expenses
                                  )) *
                                  100
                              )}%`
                            : '0%',
                        background: COLORS.red,
                        borderRadius: 20,
                      }}
                    />
                  </div>
                </div>
              </div>
            )}
          </Card>

          <Card
            style={{
              padding: 22,
            }}
          >
            <h2
              style={{
                margin: 0,
                fontSize: 17,
              }}
            >
              Contas financeiras
            </h2>

            <div
              style={{
                color: '#666',
                fontSize: 12,
                marginTop: 5,
                marginBottom: 18,
              }}
            >
              Onde seu dinheiro está
            </div>

            {accounts.length === 0 ? (
              <div
                style={{
                  color: '#666',
                  textAlign: 'center',
                  padding: 30,
                  fontSize: 13,
                }}
              >
                Nenhuma conta cadastrada.
              </div>
            ) : (
              accounts.map((account) => (
                <div
                  key={account.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '13px 0',
                    borderBottom:
                      `1px solid ${COLORS.border}`,
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                    }}
                  >
                    <div
                      style={{
                        width: 34,
                        height: 34,
                        borderRadius: 10,
                        background:
                          'rgba(255,255,255,.04)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#aaa',
                      }}
                    >
                      <Icon
                        name="wallet"
                        size={17}
                      />
                    </div>

                    <div>
                      <div
                        style={{
                          fontSize: 13,
                          fontWeight: 700,
                        }}
                      >
                        {account.name}
                      </div>

                      <div
                        style={{
                          color: '#555',
                          fontSize: 10,
                          marginTop: 3,
                        }}
                      >
                        {account.account_type ||
                          'Conta'}
                      </div>
                    </div>
                  </div>

                  <strong
                    style={{
                      fontSize: 13,
                    }}
                  >
                    {formatCurrency(
                      account.current_balance
                    )}
                  </strong>
                </div>
              ))
            )}
          </Card>
        </section>

        <section
          className="fm-grid-2"
          style={{
            display: 'grid',
            gridTemplateColumns:
              'minmax(0, 1.5fr) minmax(300px, 1fr)',
            gap: 18,
          }}
        >
          <Card
            style={{
              padding: 22,
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 18,
              }}
            >
              <div>
                <h2
                  style={{
                    margin: 0,
                    fontSize: 17,
                  }}
                >
                  Últimas movimentações
                </h2>

                <div
                  style={{
                    color: '#666',
                    fontSize: 12,
                    marginTop: 5,
                  }}
                >
                  Movimentações geradas pelo sistema
                </div>
              </div>
            </div>

            {latestTransactions.length === 0 ? (
              <EmptyState>
                Nenhuma movimentação registrada.
              </EmptyState>
            ) : (
              <div
                style={{
                  overflowX: 'auto',
                }}
              >
                <table
                  style={{
                    width: '100%',
                    borderCollapse: 'collapse',
                    minWidth: 580,
                  }}
                >
                  <thead>
                    <tr
                      style={{
                        color: '#555',
                        fontSize: 10,
                        textTransform: 'uppercase',
                        textAlign: 'left',
                        letterSpacing: '.08em',
                      }}
                    >
                      <th
                        style={{
                          padding: '9px 7px',
                          borderBottom:
                            `1px solid ${COLORS.border}`,
                        }}
                      >
                        Movimento
                      </th>

                      <th
                        style={{
                          padding: '9px 7px',
                          borderBottom:
                            `1px solid ${COLORS.border}`,
                        }}
                      >
                        Categoria
                      </th>

                      <th
                        style={{
                          padding: '9px 7px',
                          borderBottom:
                            `1px solid ${COLORS.border}`,
                        }}
                      >
                        Data
                      </th>

                      <th
                        style={{
                          padding: '9px 7px',
                          borderBottom:
                            `1px solid ${COLORS.border}`,
                          textAlign: 'right',
                        }}
                      >
                        Valor
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {latestTransactions.map(
                      (transaction) => {
                        const color =
                          getTransactionColor(
                            transaction.type
                          );

                        const normalized =
                          normalize(
                            transaction.type
                          );

                        const isOutgoing = [
                          'expense',
                          'withdrawal',
                          'retirada',
                          'pro-labore',
                          'prolabore',
                          'reserve',
                          'reserva',
                          'investment',
                          'investimento',
                          'transfer_out',
                        ].includes(
                          normalized
                        );

                        return (
                          <tr
                            key={transaction.id}
                          >
                            <td
                              style={{
                                padding: '13px 7px',
                                borderBottom:
                                  `1px solid ${COLORS.border}`,
                              }}
                            >
                              <div
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: 9,
                                }}
                              >
                                <div
                                  style={{
                                    width: 30,
                                    height: 30,
                                    borderRadius: 9,
                                    background:
                                      `${color}15`,
                                    color,
                                    display: 'flex',
                                    alignItems:
                                      'center',
                                    justifyContent:
                                      'center',
                                  }}
                                >
                                  <Icon
                                    name={
                                      isOutgoing
                                        ? 'arrowUp'
                                        : 'arrowDown'
                                    }
                                    size={15}
                                  />
                                </div>

                                <div>
                                  <div
                                    style={{
                                      fontSize: 12,
                                      fontWeight: 700,
                                    }}
                                  >
                                    {transaction.description ||
                                      'Movimentação financeira'}
                                  </div>

                                  <div
                                    style={{
                                      fontSize: 10,
                                      color: '#555',
                                      marginTop: 3,
                                    }}
                                  >
                                    {getTransactionLabel(
                                      transaction.type
                                    )}
                                  </div>
                                </div>
                              </div>
                            </td>

                            <td
                              style={{
                                padding: '13px 7px',
                                borderBottom:
                                  `1px solid ${COLORS.border}`,
                                color: '#777',
                                fontSize: 11,
                              }}
                            >
                              {transaction
                                .financial_categories
                                ?.name || '—'}
                            </td>

                            <td
                              style={{
                                padding: '13px 7px',
                                borderBottom:
                                  `1px solid ${COLORS.border}`,
                                color: '#777',
                                fontSize: 11,
                              }}
                            >
                              {formatDate(
                                transaction.transaction_date
                              )}
                            </td>

                            <td
                              style={{
                                padding: '13px 7px',
                                borderBottom:
                                  `1px solid ${COLORS.border}`,
                                textAlign: 'right',
                                color,
                                fontWeight: 800,
                                fontSize: 12,
                              }}
                            >
                              {isOutgoing
                                ? '- '
                                : '+ '}

                              {formatCurrency(
                                transaction.amount
                              )}
                            </td>
                          </tr>
                        );
                      }
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </Card>

          <Card
            style={{
              padding: 22,
            }}
          >
            <h2
              style={{
                margin: 0,
                fontSize: 17,
              }}
            >
              Despesas por categoria
            </h2>

            <div
              style={{
                color: '#666',
                fontSize: 12,
                marginTop: 5,
                marginBottom: 20,
              }}
            >
              Onde o dinheiro está saindo
            </div>

            {expenseCategories.length === 0 ? (
              <div
                style={{
                  padding: '40px 10px',
                  textAlign: 'center',
                  color: '#666',
                  fontSize: 13,
                }}
              >
                Nenhuma despesa registrada.
              </div>
            ) : (
              expenseCategories
                .slice(0, 8)
                .map((category) => {
                  const percentage =
                    expenses > 0
                      ? (category.amount /
                          expenses) *
                        100
                      : 0;

                  return (
                    <div
                      key={category.name}
                      style={{
                        marginBottom: 17,
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          justifyContent:
                            'space-between',
                          marginBottom: 7,
                          fontSize: 12,
                        }}
                      >
                        <span
                          style={{
                            color: '#aaa',
                          }}
                        >
                          {category.name}
                        </span>

                        <strong>
                          {formatCurrency(
                            category.amount
                          )}
                        </strong>
                      </div>

                      <div
                        style={{
                          height: 6,
                          background: '#1d1d1d',
                          borderRadius: 20,
                          overflow: 'hidden',
                        }}
                      >
                        <div
                          style={{
                            width: `${percentage}%`,
                            height: '100%',
                            background:
                              COLORS.red,
                            borderRadius: 20,
                          }}
                        />
                      </div>

                      <div
                        style={{
                          color: '#555',
                          fontSize: 10,
                          marginTop: 4,
                        }}
                      >
                        {percentage.toFixed(1)}%
                      </div>
                    </div>
                  );
                })
            )}
          </Card>
        </section>
      </main>
    </div>
  );
}

export default FinancialManagement;