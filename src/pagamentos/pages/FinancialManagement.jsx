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
  purple: '#a855f7',
};

const formatCurrency = (value) =>
  new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(Number(value || 0));

const formatDate = (value) => {
  if (!value) return '—';

  return new Intl.DateTimeFormat('pt-BR').format(
    new Date(`${value}T12:00:00`)
  );
};

const todayISO = () => {
  const now = new Date();
  const offset = now.getTimezoneOffset();

  return new Date(
    now.getTime() - offset * 60000
  )
    .toISOString()
    .slice(0, 10);
};

const normalize = (value) =>
  String(value || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

const movementTypeLabels = {
  income: 'Entrada',
  expense: 'Despesa',
  withdrawal: 'Retirada',
  transfer: 'Transferência',
};

const commonExpenseCategories = [
  'Casa',
  'Água',
  'Luz',
  'Internet',
  'Mercado',
  'Lazer',
  'Transporte',
  'Saúde',
  'Educação',
  'Assinaturas',
  'Software',
  'Marketing',
  'Impostos',
  'Fornecedores',
  'Equipamentos',
  'Outros',
];

const commonIncomeCategories = [
  'Receitas de serviços',
  'Vendas',
  'Outros recebimentos',
];

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
        <rect
          x="3"
          y="5"
          width="18"
          height="14"
          rx="2"
        />
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
        <rect
          x="2"
          y="5"
          width="20"
          height="14"
          rx="2"
        />
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

    down: (
      <>
        <path d="M12 5v14" />
        <path d="m19 12-7 7-7-7" />
      </>
    ),

    up: (
      <>
        <path d="M12 19V5" />
        <path d="m5 12 7-7 7 7" />
      </>
    ),

    plus: (
      <>
        <path d="M12 5v14" />
        <path d="M5 12h14" />
      </>
    ),

    close: (
      <>
        <path d="m6 6 12 12" />
        <path d="m18 6-12 12" />
      </>
    ),

    transfer: (
      <>
        <path d="M7 7h12l-3-3" />
        <path d="M17 17H5l3 3" />
        <path d="M19 7l-3 3" />
        <path d="M5 17l3-3" />
      </>
    ),

    user: (
      <>
        <circle cx="12" cy="8" r="4" />
        <path d="M4 21a8 8 0 0 1 16 0" />
      </>
    ),

    calendar: (
      <>
        <rect
          x="3"
          y="4"
          width="18"
          height="17"
          rx="2"
        />
        <path d="M16 2v4" />
        <path d="M8 2v4" />
        <path d="M3 10h18" />
      </>
    ),

    check: (
      <>
        <path d="m5 12 4 4L19 6" />
      </>
    ),

    trash: (
      <>
        <path d="M4 7h16" />
        <path d="M10 11v6" />
        <path d="M14 11v6" />
        <path d="M6 7l1 14h10l1-14" />
        <path d="M9 7V4h6v3" />
      </>
    ),
  };

  return <svg {...props}>{icons[name] || null}</svg>;
}

function Card({
  children,
  style = {},
  className = '',
}) {
  return (
    <div
      className={className}
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

function Modal({
  title,
  subtitle,
  onClose,
  children,
  wide = false,
}) {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 200,
        background: 'rgba(0,0,0,.78)',
        backdropFilter: 'blur(10px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
      }}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: wide ? 820 : 620,
          maxHeight: '90vh',
          overflowY: 'auto',
          background: '#0d0d0d',
          border: `1px solid ${COLORS.border}`,
          borderRadius: 20,
          boxShadow: '0 30px 100px rgba(0,0,0,.55)',
        }}
      >
        <div
          style={{
            padding: '20px 22px',
            borderBottom: `1px solid ${COLORS.border}`,
            display: 'flex',
            justifyContent: 'space-between',
            gap: 18,
          }}
        >
          <div>
            <div
              style={{
                color: COLORS.green,
                fontSize: 10,
                fontWeight: 800,
                letterSpacing: '.14em',
                textTransform: 'uppercase',
              }}
            >
              Gestor financeiro
            </div>

            <h2
              style={{
                margin: '5px 0 0',
                fontSize: 23,
                letterSpacing: '-.03em',
              }}
            >
              {title}
            </h2>

            {subtitle && (
              <div
                style={{
                  marginTop: 5,
                  color: COLORS.muted,
                  fontSize: 12,
                }}
              >
                {subtitle}
              </div>
            )}
          </div>

          <button
            onClick={onClose}
            style={iconButtonStyle}
            aria-label="Fechar"
          >
            <Icon name="close" size={18} />
          </button>
        </div>

        {children}
      </div>
    </div>
  );
}

const iconButtonStyle = {
  width: 40,
  height: 40,
  borderRadius: 11,
  border: `1px solid ${COLORS.border}`,
  background: COLORS.panel,
  color: COLORS.muted,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  flexShrink: 0,
};

const fieldLabelStyle = {
  display: 'block',
  color: '#888',
  fontSize: 11,
  fontWeight: 700,
  marginBottom: 7,
};

const fieldStyle = {
  width: '100%',
  height: 44,
  padding: '0 13px',
  borderRadius: 10,
  border: `1px solid ${COLORS.border}`,
  background: '#111',
  color: COLORS.white,
  outline: 'none',
  fontSize: 13,
};

function FinancialManagement() {
  const [user, setUser] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [transactions, setTransactions] = useState([]);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [saving, setSaving] = useState(false);

  const [mobileOpen, setMobileOpen] = useState(false);

  const [period, setPeriod] = useState('month');

  const [showMovementModal, setShowMovementModal] =
    useState(false);

  const [showAccountModal, setShowAccountModal] =
    useState(false);

  const [toast, setToast] = useState(null);

  const [movement, setMovement] = useState({
    type: 'expense',
    description: '',
    amount: '',
    accountId: '',
    destinationAccountId: '',
    categoryId: '',
    categoryName: '',
    date: todayISO(),
    notes: '',
  });

  const [newAccount, setNewAccount] = useState({
    name: '',
    type: 'personal',
    description: '',
    initialBalance: '',
  });

  const notify = (
    message,
    type = 'success'
  ) => {
    setToast({
      message,
      type,
    });

    window.setTimeout(() => {
      setToast(null);
    }, 3200);
  };

  const loadFinancialData = useCallback(
    async () => {
      setRefreshing(true);

      try {
        const {
          data: {
            user: authenticatedUser,
          },
          error: authError,
        } =
          await supabase.auth.getUser();

        if (authError) {
          throw authError;
        }

        if (!authenticatedUser) {
          window.location.href =
            '/pagamentos/admin';
          return;
        }

        setUser(authenticatedUser);

        const ownerId =
          authenticatedUser.id;

        const [
          accountsResponse,
          categoriesResponse,
          transactionsResponse,
        ] = await Promise.all([
          supabase
            .from(
              'financial_accounts'
            )
            .select('*')
            .eq(
              'owner_id',
              ownerId
            )
            .eq(
              'is_active',
              true
            )
            .order(
              'created_at',
              {
                ascending: true,
              }
            ),

          supabase
            .from(
              'financial_categories'
            )
            .select('*')
            .eq(
              'owner_id',
              ownerId
            )
            .eq(
              'is_active',
              true
            )
            .order(
              'name',
              {
                ascending: true,
              }
            ),

          supabase
            .from(
              'financial_transactions'
            )
            .select(`
              *,
              financial_accounts (
                id,
                name,
                type
              ),
              financial_categories (
                id,
                name,
                type
              )
            `)
            .eq(
              'owner_id',
              ownerId
            )
            .order(
              'transaction_date',
              {
                ascending: false,
              }
            )
            .order(
              'created_at',
              {
                ascending: false,
              }
            ),
        ]);

        if (
          accountsResponse.error
        ) {
          throw accountsResponse.error;
        }

        if (
          categoriesResponse.error
        ) {
          throw categoriesResponse.error;
        }

        if (
          transactionsResponse.error
        ) {
          throw transactionsResponse.error;
        }

        const loadedAccounts =
          accountsResponse.data ||
          [];

        setAccounts(
          loadedAccounts
        );

        setCategories(
          categoriesResponse.data ||
            []
        );

        setTransactions(
          transactionsResponse.data ||
            []
        );

        setMovement(
          (current) => ({
            ...current,

            accountId:
              current.accountId ||
              loadedAccounts.find(
                (
                  account
                ) =>
                  [
                    'business',
                    'caixa',
                    'operacional',
                    'cash',
                  ].includes(
                    normalize(
                      account.type
                    )
                  )
              )?.id ||
              loadedAccounts[0]
                ?.id ||
              '',

            destinationAccountId:
              current.destinationAccountId ||
              loadedAccounts.find(
                (
                  account
                ) =>
                  [
                    'personal',
                    'pessoal',
                  ].includes(
                    normalize(
                      account.type
                    )
                  )
              )?.id ||
              '',
          })
        );
      } catch (error) {
        console.error(
          'Erro ao carregar gestão financeira:',
          error
        );

        setAccounts([]);
        setCategories([]);
        setTransactions([]);

        notify(
          'Não foi possível carregar os dados financeiros.',
          'error'
        );
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    []
  );

  useEffect(() => {
    loadFinancialData();
  }, [
    loadFinancialData,
  ]);

  const businessAccount =
    useMemo(
      () =>
        accounts.find(
          (account) =>
            [
              'business',
              'caixa',
              'operacional',
              'cash',
            ].includes(
              normalize(
                account.type
              )
            )
        ),
      [accounts]
    );

  const reserveAccount =
    useMemo(
      () =>
        accounts.find(
          (account) =>
            [
              'reserve',
              'reserva',
            ].includes(
              normalize(
                account.type
              )
            )
        ),
      [accounts]
    );

  const investmentAccount =
    useMemo(
      () =>
        accounts.find(
          (account) =>
            [
              'investment',
              'investimento',
            ].includes(
              normalize(
                account.type
              )
            )
        ),
      [accounts]
    );

  const personalAccount =
    useMemo(
      () =>
        accounts.find(
          (account) =>
            [
              'personal',
              'pessoal',
            ].includes(
              normalize(
                account.type
              )
            )
        ),
      [accounts]
    );

  const getPeriodStart =
    useCallback(() => {
      const now =
        new Date();

      if (
        period ===
        'all'
      ) {
        return null;
      }

      if (
        period ===
        'year'
      ) {
        return `${now.getFullYear()}-01-01`;
      }

      if (
        period ===
        'previous'
      ) {
        const previous =
          new Date(
            now.getFullYear(),
            now.getMonth() -
              1,
            1
          );

        return `${previous.getFullYear()}-${String(
          previous.getMonth() + 1
        ).padStart(
          2,
          '0'
        )}-01`;
      }

      if (
        period ===
        '3months'
      ) {
        const start =
          new Date(
            now.getFullYear(),
            now.getMonth() -
              2,
            1
          );

        return `${start.getFullYear()}-${String(
          start.getMonth() + 1
        ).padStart(
          2,
          '0'
        )}-01`;
      }

      return `${now.getFullYear()}-${String(
        now.getMonth() + 1
      ).padStart(
        2,
        '0'
      )}-01`;
    }, [period]);

  const filteredTransactions =
    useMemo(() => {
      const start =
        getPeriodStart();

      if (!start) {
        return transactions;
      }

      if (
        period ===
        'previous'
      ) {
        const now =
          new Date();

        const end = `${now.getFullYear()}-${String(
          now.getMonth() + 1
        ).padStart(
          2,
          '0'
        )}-01`;

        return transactions.filter(
          (transaction) =>
            transaction.transaction_date >=
              start &&
            transaction.transaction_date <
              end
        );
      }

      return transactions.filter(
        (transaction) =>
          transaction.transaction_date >=
          start
      );
    }, [
      transactions,
      getPeriodStart,
      period,
    ]);

  const income =
    useMemo(
      () =>
        filteredTransactions
          .filter(
            (transaction) =>
              normalize(
                transaction.type
              ) ===
                'income' &&
              normalize(
                transaction.status
              ) !==
                'cancelled'
          )
          .reduce(
            (
              total,
              transaction
            ) =>
              total +
              Number(
                transaction.amount ||
                  0
              ),
            0
          ),
      [filteredTransactions]
    );

  const expenses =
    useMemo(
      () =>
        filteredTransactions
          .filter(
            (transaction) =>
              normalize(
                transaction.type
              ) ===
                'expense' &&
              normalize(
                transaction.status
              ) !==
                'cancelled'
          )
          .reduce(
            (
              total,
              transaction
            ) =>
              total +
              Number(
                transaction.amount ||
                  0
              ),
            0
          ),
      [filteredTransactions]
    );

  const withdrawals =
    useMemo(
      () =>
        filteredTransactions
          .filter(
            (transaction) =>
              [
                'withdrawal',
                'retirada',
                'pro-labore',
                'prolabore',
              ].includes(
                normalize(
                  transaction.type
                )
              ) &&
              normalize(
                transaction.status
              ) !==
                'cancelled'
          )
          .reduce(
            (
              total,
              transaction
            ) =>
              total +
              Number(
                transaction.amount ||
                  0
              ),
            0
          ),
      [filteredTransactions]
    );

  const totalAccountBalance =
    useMemo(
      () =>
        accounts.reduce(
          (
            total,
            account
          ) =>
            total +
            Number(
              account.current_balance ||
                0
            ),
          0
        ),
      [accounts]
    );

  const netResult =
    income -
    expenses -
    withdrawals;

  const availablePersonal =
    Number(
      personalAccount?.current_balance ||
        0
    );

  const expenseCategories =
    useMemo(() => {
      const map = {};

      filteredTransactions
        .filter(
          (transaction) =>
            normalize(
              transaction.type
            ) ===
            'expense'
        )
        .forEach(
          (transaction) => {
            const category =
              transaction
                .financial_categories
                ?.name ||
              'Sem categoria';

            map[category] =
              (map[
                category
              ] || 0) +
              Number(
                transaction.amount ||
                  0
              );
          }
        );

      return Object.entries(
        map
      )
        .map(
          ([
            name,
            amount,
          ]) => ({
            name,
            amount,
          })
        )
        .sort(
          (a, b) =>
            b.amount -
            a.amount
        );
    }, [
      filteredTransactions,
    ]);

  const latestTransactions =
    filteredTransactions.slice(
      0,
      10
    );

  const categoryOptions =
    useMemo(() => {
      const isIncome =
        movement.type ===
        'income';

      const available =
        categories.filter(
          (category) =>
            isIncome
              ? normalize(
                  category.type
                ) ===
                'income'
              : normalize(
                  category.type
                ) ===
                'expense'
        );

      const builtInNames =
        isIncome
          ? commonIncomeCategories
          : commonExpenseCategories;

      const names =
        new Set(
          available.map(
            (category) =>
              normalize(
                category.name
              )
          )
        );

      const virtualCategories =
        builtInNames
          .filter(
            (name) =>
              !names.has(
                normalize(
                  name
                )
              )
          )
          .map(
            (name) => ({
              id: `virtual:${name}`,
              name,
              type:
                isIncome
                  ? 'income'
                  : 'expense',
              virtual: true,
            })
          );

      return [
        ...available,
        ...virtualCategories,
      ];
    }, [
      categories,
      movement.type,
    ]);

  const getAccountLabel =
    (type) => {
      const normalized =
        normalize(type);

      if (
        [
          'business',
          'caixa',
          'operacional',
          'cash',
        ].includes(
          normalized
        )
      ) {
        return 'Empresa';
      }

      if (
        [
          'reserve',
          'reserva',
        ].includes(
          normalized
        )
      ) {
        return 'Reserva';
      }

      if (
        [
          'investment',
          'investimento',
        ].includes(
          normalized
        )
      ) {
        return 'Investimentos';
      }

      if (
        [
          'personal',
          'pessoal',
        ].includes(
          normalized
        )
      ) {
        return 'Pessoal';
      }

      return (
        type || 'Conta'
      );
    };

  const getTransactionLabel =
    (type) => {
      const normalized =
        normalize(type);

      if (
        normalized ===
        'income'
      ) {
        return 'Entrada';
      }

      if (
        normalized ===
        'expense'
      ) {
        return 'Despesa';
      }

      if (
        [
          'withdrawal',
          'retirada',
          'pro-labore',
          'prolabore',
        ].includes(
          normalized
        )
      ) {
        return 'Retirada';
      }

      if (
        [
          'transfer',
          'transfer_in',
          'transfer_out',
          'transferencia',
        ].includes(
          normalized
        )
      ) {
        return 'Transferência';
      }

      return (
        type ||
        'Movimentação'
      );
    };

  const getTransactionColor =
    (type) => {
      const normalized =
        normalize(type);

      if (
        normalized ===
        'income'
      ) {
        return COLORS.green;
      }

      if (
        normalized ===
        'expense'
      ) {
        return COLORS.red;
      }

      if (
        [
          'withdrawal',
          'retirada',
          'pro-labore',
          'prolabore',
        ].includes(
          normalized
        )
      ) {
        return COLORS.yellow;
      }

      if (
        [
          'transfer',
          'transfer_in',
          'transfer_out',
          'transferencia',
        ].includes(
          normalized
        )
      ) {
        return COLORS.blue;
      }

      return COLORS.muted;
    };

  const resetMovement =
    (type = 'expense') => {
      const defaultAccount =
        type === 'income'
          ? businessAccount?.id ||
            accounts[0]
              ?.id ||
            ''
          : accounts[0]
              ?.id ||
            '';

      setMovement({
        type,
        description: '',
        amount: '',
        accountId:
          defaultAccount,
        destinationAccountId:
          personalAccount?.id ||
          '',
        categoryId: '',
        categoryName: '',
        date: todayISO(),
        notes: '',
      });
    };

  const openMovement =
    (type = 'expense') => {
      resetMovement(type);
      setShowMovementModal(
        true
      );
    };

  const createCategoryIfNeeded =
    async () => {
      if (
        !movement.categoryName.trim()
      ) {
        return null;
      }

      const existing =
        categories.find(
          (category) =>
            normalize(
              category.name
            ) ===
            normalize(
              movement.categoryName
            )
        );

      if (existing) {
        return existing.id;
      }

      const categoryType =
        movement.type ===
        'income'
          ? 'income'
          : 'expense';

      const {
        data,
        error,
      } =
        await supabase
          .from(
            'financial_categories'
          )
          .insert({
            owner_id:
              user.id,
            name:
              movement.categoryName.trim(),
            type:
              categoryType,
            is_active:
              true,
          })
          .select('*')
          .single();

      if (error) {
        throw error;
      }

      setCategories(
        (current) =>
          [
            ...current,
            data,
          ].sort(
            (a, b) =>
              a.name.localeCompare(
                b.name
              )
          )
      );

      return data.id;
    };

  const saveMovement =
    async () => {
      const amount =
        Number(
          String(
            movement.amount
          ).replace(
            ',',
            '.'
          )
        );

      const description =
        movement.description.trim();

      if (!description) {
        notify(
          'Informe uma descrição para a movimentação.',
          'error'
        );
        return;
      }

      if (
        !Number.isFinite(
          amount
        ) ||
        amount <= 0
      ) {
        notify(
          'Informe um valor válido.',
          'error'
        );
        return;
      }

      if (
        !movement.accountId
      ) {
        notify(
          'Selecione a conta de origem.',
          'error'
        );
        return;
      }

      if (!movement.date) {
        notify(
          'Informe a data da movimentação.',
          'error'
        );
        return;
      }

      if (
        movement.type ===
          'transfer' &&
        !movement.destinationAccountId
      ) {
        notify(
          'Selecione a conta de destino.',
          'error'
        );
        return;
      }

      if (
        movement.type ===
          'transfer' &&
        movement.destinationAccountId ===
          movement.accountId
      ) {
        notify(
          'A conta de origem e destino precisam ser diferentes.',
          'error'
        );
        return;
      }

      setSaving(true);

      try {
        const categoryId =
          await createCategoryIfNeeded();

        const ownerId =
          user.id;

        if (
          movement.type ===
          'transfer'
        ) {
          const source =
            accounts.find(
              (account) =>
                account.id ===
                movement.accountId
            );

          const destination =
            accounts.find(
              (account) =>
                account.id ===
                movement.destinationAccountId
            );

          if (
            !source ||
            !destination
          ) {
            throw new Error(
              'Conta de origem ou destino não encontrada.'
            );
          }

          if (
            Number(
              source.current_balance ||
                0
            ) <
            amount
          ) {
            throw new Error(
              'Saldo insuficiente na conta de origem.'
            );
          }

          const transferDescription =
            description ||
            'Transferência entre contas';

          const {
            data:
              outTransaction,
            error:
              outError,
          } =
            await supabase
              .from(
                'financial_transactions'
              )
              .insert({
                owner_id:
                  ownerId,
                account_id:
                  source.id,
                type:
                  'transfer_out',
                amount,
                description:
                  transferDescription,
                transaction_date:
                  movement.date,
                status:
                  'confirmed',
                notes:
                  movement.notes ||
                  null,
              })
              .select('*')
              .single();

          if (outError) {
            throw outError;
          }

          const {
            error: inError,
          } =
            await supabase
              .from(
                'financial_transactions'
              )
              .insert({
                owner_id:
                  ownerId,
                account_id:
                  destination.id,
                type:
                  'transfer_in',
                amount,
                description:
                  transferDescription,
                transaction_date:
                  movement.date,
                status:
                  'confirmed',
                notes:
                  movement.notes ||
                  null,
              });

          if (inError) {
            await supabase
              .from(
                'financial_transactions'
              )
              .delete()
              .eq(
                'id',
                outTransaction.id
              );

            throw inError;
          }

          const {
            error:
              sourceBalanceError,
          } =
            await supabase
              .from(
                'financial_accounts'
              )
              .update({
                current_balance:
                  Number(
                    source.current_balance ||
                      0
                  ) -
                  amount,
                updated_at:
                  new Date().toISOString(),
              })
              .eq(
                'id',
                source.id
              )
              .eq(
                'owner_id',
                ownerId
              );

          if (
            sourceBalanceError
          ) {
            throw sourceBalanceError;
          }

          const {
            error:
              destinationBalanceError,
          } =
            await supabase
              .from(
                'financial_accounts'
              )
              .update({
                current_balance:
                  Number(
                    destination.current_balance ||
                      0
                  ) +
                  amount,
                updated_at:
                  new Date().toISOString(),
              })
              .eq(
                'id',
                destination.id
              )
              .eq(
                'owner_id',
                ownerId
              );

          if (
            destinationBalanceError
          ) {
            throw destinationBalanceError;
          }
        } else {
          const account =
            accounts.find(
              (item) =>
                item.id ===
                movement.accountId
            );

          if (!account) {
            throw new Error(
              'Conta selecionada não encontrada.'
            );
          }

          const currentBalance =
            Number(
              account.current_balance ||
                0
            );

          const delta =
            movement.type ===
            'income'
              ? amount
              : -amount;

          if (
            delta < 0 &&
            currentBalance <
              amount
          ) {
            throw new Error(
              'Saldo insuficiente para registrar esta despesa.'
            );
          }

          const {
            error:
              transactionError,
          } =
            await supabase
              .from(
                'financial_transactions'
              )
              .insert({
                owner_id:
                  ownerId,
                account_id:
                  account.id,
                category_id:
                  categoryId ||
                  null,
                type:
                  movement.type ===
                  'income'
                    ? 'income'
                    : movement.type,
                amount,
                description,
                transaction_date:
                  movement.date,
                status:
                  'confirmed',
                notes:
                  movement.notes ||
                  null,
              });

          if (
            transactionError
          ) {
            throw transactionError;
          }

          const {
            error:
              balanceError,
          } =
            await supabase
              .from(
                'financial_accounts'
              )
              .update({
                current_balance:
                  currentBalance +
                  delta,
                updated_at:
                  new Date().toISOString(),
              })
              .eq(
                'id',
                account.id
              )
              .eq(
                'owner_id',
                ownerId
              );

          if (
            balanceError
          ) {
            throw balanceError;
          }
        }

        notify(
          movement.type ===
            'income'
            ? 'Entrada registrada com sucesso.'
            : movement.type ===
                'expense'
              ? 'Despesa registrada com sucesso.'
              : movement.type ===
                  'transfer'
                ? 'Transferência registrada com sucesso.'
                : 'Retirada registrada com sucesso.'
        );

        setShowMovementModal(
          false
        );

        await loadFinancialData();
      } catch (error) {
        console.error(
          'Erro ao salvar movimentação:',
          error
        );

        notify(
          error?.message ||
            'Não foi possível salvar a movimentação.',
          'error'
        );
      } finally {
        setSaving(false);
      }
    };

  const saveAccount =
    async () => {
      const name =
        newAccount.name.trim();

      const initialBalance =
        Number(
          String(
            newAccount.initialBalance ||
              0
          ).replace(
            ',',
            '.'
          )
        ) || 0;

      if (!name) {
        notify(
          'Informe o nome da conta.',
          'error'
        );
        return;
      }

      if (
        initialBalance <
        0
      ) {
        notify(
          'O saldo inicial não pode ser negativo.',
          'error'
        );
        return;
      }

      setSaving(true);

      try {
        const {
          error,
        } =
          await supabase
            .from(
              'financial_accounts'
            )
            .insert({
              owner_id:
                user.id,
              name,
              type:
                newAccount.type,
              description:
                newAccount.description.trim() ||
                null,
              initial_balance:
                initialBalance,
              current_balance:
                initialBalance,
              is_active:
                true,
            });

        if (error) {
          throw error;
        }

        notify(
          'Conta criada com sucesso.'
        );

        setNewAccount({
          name: '',
          type: 'personal',
          description: '',
          initialBalance:
            '',
        });

        setShowAccountModal(
          false
        );

        await loadFinancialData();
      } catch (error) {
        console.error(
          'Erro criando conta:',
          error
        );

        notify(
          error?.message ||
            'Não foi possível criar a conta.',
          'error'
        );
      } finally {
        setSaving(false);
      }
    };

  const accountCards = [
    {
      label:
        'Caixa da empresa',
      account:
        businessAccount,
      color:
        COLORS.green,
      note:
        'Operação e despesas da empresa',
    },
    {
      label: 'Reserva',
      account:
        reserveAccount,
      color:
        COLORS.blue,
      note:
        'Segurança e imprevistos',
    },
    {
      label:
        'Investimentos',
      account:
        investmentAccount,
      color:
        COLORS.purple,
      note:
        'Patrimônio e crescimento',
    },
    {
      label: 'Pessoal',
      account:
        personalAccount,
      color:
        COLORS.yellow,
      note:
        'Casa, contas e lazer',
    },
  ];

  const styles = `
    * {
      box-sizing: border-box;
    }

    body {
      margin: 0;
      background: #070707;
    }

    button,
    input,
    select,
    textarea {
      font: inherit;
    }

    button:focus-visible,
    input:focus-visible,
    select:focus-visible,
    textarea:focus-visible {
      outline: 2px solid rgba(34,197,94,.45);
      outline-offset: 1px;
    }

    .fm-nav {
      transition: transform .2s ease;
    }

    .fm-mobile {
      display: none !important;
    }

    .fm-card {
      transition:
        border-color .2s ease,
        transform .2s ease;
    }

    .fm-card:hover {
      border-color:
        rgba(255,255,255,.15) !important;
    }

    .fm-action {
      transition:
        transform .15s ease,
        border-color .15s ease,
        background .15s ease;
    }

    .fm-action:hover {
      transform: translateY(-1px);
      border-color:
        rgba(255,255,255,.16) !important;
    }

    .fm-table-row:hover {
      background:
        rgba(255,255,255,.018);
    }

    @media (max-width: 1120px) {
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
        max-width: none !important;
      }

      .fm-mobile {
        display: flex !important;
      }

      .fm-grid-4 {
        grid-template-columns:
          repeat(2, 1fr) !important;
      }

      .fm-grid-2 {
        grid-template-columns:
          1fr !important;
      }

      .fm-action-grid {
        grid-template-columns:
          repeat(2, 1fr) !important;
      }
    }

    @media (max-width: 680px) {
      .fm-grid-4 {
        grid-template-columns:
          1fr !important;
      }

      .fm-main {
        padding:
          72px 16px 40px !important;
      }

      .fm-header {
        align-items:
          flex-start !important;
        flex-direction:
          column !important;
      }

      .fm-header-actions {
        width: 100%;
        flex-wrap: wrap;
      }

      .fm-action-grid {
        grid-template-columns:
          1fr !important;
      }

      .fm-periods {
        width: 100%;
        overflow-x: auto;
      }

      .fm-periods button {
        flex:
          0 0 auto;
      }
    }
  `;

  const periodLabels = {
    month:
      'Este mês',
    previous:
      'Mês anterior',
    '3months':
      '3 meses',
    year:
      'Este ano',
    all:
      'Todo o histórico',
  };

  if (loading) {
    return (
      <div
        style={{
          minHeight:
            '100vh',
          background:
            COLORS.bg,
          color:
            COLORS.white,
          display:
            'flex',
          alignItems:
            'center',
          justifyContent:
            'center',
          fontFamily:
            'Inter, Arial, sans-serif',
        }}
      >
        Carregando Gestor Financeiro...
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight:
          '100vh',
        background:
          COLORS.bg,
        color:
          COLORS.white,
        fontFamily:
          'Inter, Arial, sans-serif',
      }}
    >
      <style>{styles}</style>

      <button
        className="fm-mobile"
        onClick={() =>
          setMobileOpen(
            (value) =>
              !value
          )
        }
        style={{
          ...iconButtonStyle,
          position:
            'fixed',
          top: 15,
          left: 15,
          zIndex: 60,
        }}
      >
        <Icon
          name="menu"
        />
      </button>

      <aside
        className={`fm-nav ${
          mobileOpen
            ? 'open'
            : ''
        }`}
        style={{
          position:
            'fixed',
          top: 0,
          bottom: 0,
          left: 0,
          width: 245,
          background:
            '#090909',
          borderRight:
            `1px solid ${COLORS.border}`,
          padding: 22,
          display:
            'flex',
          flexDirection:
            'column',
        }}
      >
        <div
          style={{
            marginBottom:
              36,
          }}
        >
          <div
            style={{
              fontWeight:
                900,
              fontSize: 18,
              letterSpacing:
                '-.04em',
            }}
          >
            CENTRAL{' '}
            <span
              style={{
                color:
                  COLORS.red,
              }}
            >
              DE PAGAMENTOS
            </span>
          </div>

          <div
            style={{
              fontSize: 10,
              color: '#666',
              letterSpacing:
                '.14em',
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
            letterSpacing:
              '.14em',
            marginBottom:
              10,
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
        ].map(
          ([
            icon,
            label,
            path,
          ]) => {
            const active =
              path ===
              '/pagamentos/admin/financeiro';

            return (
              <div
                key={label}
                onClick={() => {
                  setMobileOpen(
                    false
                  );

                  window.location.href =
                    path;
                }}
                style={{
                  display:
                    'flex',
                  alignItems:
                    'center',
                  gap: 12,
                  padding:
                    '11px 12px',
                  borderRadius:
                    10,
                  marginBottom:
                    4,
                  color: active
                    ? COLORS.white
                    : '#888',
                  background:
                    active
                      ? 'rgba(239,43,53,.12)'
                      : 'transparent',
                  cursor:
                    'pointer',
                  fontSize: 13,
                  fontWeight: active
                    ? 700
                    : 500,
                }}
              >
                <Icon
                  name={
                    icon
                  }
                  size={
                    18
                  }
                />

                {label}
              </div>
            );
          }
        )}

        <div
          style={{
            marginTop:
              'auto',
            paddingTop:
              20,
            borderTop:
              `1px solid ${COLORS.border}`,
          }}
        >
          <div
            style={{
              fontSize: 11,
              color: '#777',
              overflow:
                'hidden',
              textOverflow:
                'ellipsis',
              whiteSpace:
                'nowrap',
              marginBottom:
                12,
            }}
          >
            {
              user?.email
            }
          </div>

          <button
            onClick={async () => {
              await supabase.auth.signOut();

              window.location.href =
                '/pagamentos/admin';
            }}
            style={{
              display:
                'flex',
              gap: 10,
              alignItems:
                'center',
              background:
                'none',
              border: 0,
              color:
                '#777',
              cursor:
                'pointer',
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
          padding:
            '30px 34px 60px',
          maxWidth:
            1560,
        }}
      >
        <header
          className="fm-header"
          style={{
            display:
              'flex',
            justifyContent:
              'space-between',
            alignItems:
              'center',
            gap: 20,
            marginBottom:
              22,
          }}
        >
          <div>
            <div
              style={{
                fontSize: 11,
                color: '#666',
                letterSpacing:
                  '.12em',
                textTransform:
                  'uppercase',
              }}
            >
              Gestor Financeiro
            </div>

            <h1
              style={{
                fontSize: 31,
                margin:
                  '7px 0 0',
                letterSpacing:
                  '-.04em',
              }}
            >
              Seu dinheiro,
              sob controle.
            </h1>

            <p
              style={{
                margin:
                  '7px 0 0',
                color: '#666',
                fontSize: 13,
              }}
            >
              Empresa, pessoal,
              reservas,
              investimentos
              e despesas em
              um só lugar.
            </p>
          </div>

          <div
            className="fm-header-actions"
            style={{
              display:
                'flex',
              alignItems:
                'center',
              gap: 9,
            }}
          >
            <button
              className="fm-action"
              onClick={() =>
                setShowAccountModal(
                  true
                )
              }
              style={{
                height: 42,
                padding:
                  '0 14px',
                borderRadius:
                  10,
                border:
                  `1px solid ${COLORS.border}`,
                background:
                  COLORS.panel,
                color:
                  '#aaa',
                display:
                  'flex',
                alignItems:
                  'center',
                gap: 8,
                cursor:
                  'pointer',
                fontSize: 12,
                fontWeight:
                  700,
              }}
            >
              <Icon
                name="wallet"
                size={16}
              />
              Nova conta
            </button>

            <button
              className="fm-action"
              onClick={() =>
                openMovement(
                  'expense'
                )
              }
              style={{
                height: 42,
                padding:
                  '0 15px',
                borderRadius:
                  10,
                border:
                  '1px solid rgba(239,43,53,.28)',
                background:
                  'rgba(239,43,53,.12)',
                color:
                  COLORS.white,
                display:
                  'flex',
                alignItems:
                  'center',
                gap: 8,
                cursor:
                  'pointer',
                fontSize: 12,
                fontWeight:
                  800,
              }}
            >
              <Icon
                name="plus"
                size={17}
              />
              Nova movimentação
            </button>

            <button
              onClick={
                loadFinancialData
              }
              disabled={
                refreshing
              }
              style={{
                ...iconButtonStyle,
                opacity:
                  refreshing
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

        <div
          className="fm-periods"
          style={{
            display:
              'flex',
            gap: 6,
            padding: 5,
            background:
              '#0c0c0c',
            border:
              `1px solid ${COLORS.border}`,
            borderRadius:
              13,
            width:
              'fit-content',
            marginBottom:
              20,
          }}
        >
          {Object.entries(
            periodLabels
          ).map(
            ([
              key,
              label,
            ]) => (
              <button
                key={key}
                onClick={() =>
                  setPeriod(
                    key
                  )
                }
                style={{
                  border: 0,
                  background:
                    period ===
                    key
                      ? COLORS.red
                      : 'transparent',
                  color:
                    period ===
                    key
                      ? COLORS.white
                      : '#777',
                  padding:
                    '8px 12px',
                  borderRadius:
                    9,
                  cursor:
                    'pointer',
                  fontSize: 11,
                  fontWeight:
                    period ===
                    key
                      ? 800
                      : 600,
                  whiteSpace:
                    'nowrap',
                }}
              >
                {
                  label
                }
              </button>
            )
          )}
        </div>

        <section
          className="fm-grid-4"
          style={{
            display:
              'grid',
            gridTemplateColumns:
              'repeat(4, 1fr)',
            gap: 14,
            marginBottom:
              14,
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
              Patrimônio financeiro
            </div>

            <div
              style={{
                fontSize: 27,
                fontWeight:
                  800,
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
                fontWeight:
                  800,
                marginTop: 10,
              }}
            >
              {formatCurrency(
                businessAccount?.current_balance ||
                  0
              )}
            </div>

            <div
              style={{
                color: '#555',
                fontSize: 11,
                marginTop: 6,
              }}
            >
              Operação
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
                fontWeight:
                  800,
                marginTop: 10,
              }}
            >
              {formatCurrency(
                reserveAccount?.current_balance ||
                  0
              )}
            </div>

            <div
              style={{
                color: '#555',
                fontSize: 11,
                marginTop: 6,
              }}
            >
              Proteção financeira
            </div>
          </Card>

          <Card
            className="fm-card"
            style={{
              padding: 20,
              borderLeft:
                `3px solid ${COLORS.yellow}`,
            }}
          >
            <div
              style={{
                color: '#777',
                fontSize: 12,
              }}
            >
              Pessoal disponível
            </div>

            <div
              style={{
                fontSize: 27,
                fontWeight:
                  800,
                marginTop: 10,
              }}
            >
              {formatCurrency(
                availablePersonal
              )}
            </div>

            <div
              style={{
                color: '#555',
                fontSize: 11,
                marginTop: 6,
              }}
            >
              {personalAccount
                ? 'Casa, contas e lazer'
                : 'Crie a conta pessoal'}
            </div>
          </Card>
        </section>

        <section
          className="fm-grid-4"
          style={{
            display:
              'grid',
            gridTemplateColumns:
              'repeat(4, 1fr)',
            gap: 14,
            marginBottom:
              18,
          }}
        >
          {[
            [
              'ENTRADAS',
              income,
              COLORS.green,
              'down',
            ],
            [
              'DESPESAS',
              expenses,
              COLORS.red,
              'up',
            ],
            [
              'RETIRADAS',
              withdrawals,
              COLORS.yellow,
              'up',
            ],
            [
              'RESULTADO',
              netResult,
              netResult >=
              0
                ? COLORS.green
                : COLORS.red,
              null,
            ],
          ].map(
            ([
              label,
              value,
              color,
              icon,
            ]) => (
              <Card
                key={
                  label
                }
                style={{
                  padding: 18,
                }}
              >
                <div
                  style={{
                    display:
                      'flex',
                    alignItems:
                      'center',
                    gap: 8,
                    color,
                    fontSize: 11,
                    fontWeight:
                      800,
                  }}
                >
                  {icon && (
                    <Icon
                      name={
                        icon
                      }
                      size={16}
                    />
                  )}

                  {
                    label
                  }
                </div>

                <strong
                  style={{
                    display:
                      'block',
                    fontSize: 22,
                    marginTop: 10,
                  }}
                >
                  {formatCurrency(
                    value
                  )}
                </strong>
              </Card>
            )
          )}
        </section>

        <Card
          style={{
            padding: 20,
            marginBottom:
              18,
          }}
        >
          <div
            style={{
              display:
                'flex',
              justifyContent:
                'space-between',
              alignItems:
                'flex-start',
              gap: 18,
              marginBottom:
                16,
            }}
          >
            <div>
              <h2
                style={{
                  margin: 0,
                  fontSize: 17,
                }}
              >
                O que você quer registrar?
              </h2>

              <div
                style={{
                  color: '#666',
                  fontSize: 12,
                  marginTop: 5,
                }}
              >
                Registre o dinheiro que
                entra, sai ou muda de conta.
              </div>
            </div>

            <div
              style={{
                color: '#666',
                fontSize: 11,
              }}
            >
              {
                periodLabels[
                  period
                ]
              }
            </div>
          </div>

          <div
            className="fm-action-grid"
            style={{
              display:
                'grid',
              gridTemplateColumns:
                'repeat(4, 1fr)',
              gap: 10,
            }}
          >
            {[
              [
                'income',
                'Nova entrada',
                'Pagamento, venda ou outro recebimento.',
                COLORS.green,
                'down',
              ],
              [
                'expense',
                'Nova despesa',
                'Casa, luz, internet, software e contas.',
                COLORS.red,
                'up',
              ],
              [
                'withdrawal',
                'Nova retirada',
                'Pró-labore, retirada ou uso pessoal.',
                COLORS.yellow,
                'up',
              ],
              [
                'transfer',
                'Transferir dinheiro',
                'Caixa, pessoal, reserva ou investimento.',
                COLORS.blue,
                'transfer',
              ],
            ].map(
              ([
                type,
                title,
                description,
                color,
                icon,
              ]) => (
                <button
                  key={
                    type
                  }
                  className="fm-action"
                  onClick={() =>
                    openMovement(
                      type
                    )
                  }
                  style={{
                    textAlign:
                      'left',
                    border:
                      `1px solid ${COLORS.border}`,
                    background:
                      '#0d0d0d',
                    borderRadius:
                      13,
                    padding: 15,
                    cursor:
                      'pointer',
                    color:
                      COLORS.white,
                  }}
                >
                  <div
                    style={{
                      width: 34,
                      height: 34,
                      borderRadius:
                        10,
                      display:
                        'flex',
                      alignItems:
                        'center',
                      justifyContent:
                        'center',
                      background:
                        `${color}16`,
                      color,
                    }}
                  >
                    <Icon
                      name={
                        icon
                      }
                      size={17}
                    />
                  </div>

                  <div
                    style={{
                      fontSize: 13,
                      fontWeight:
                        800,
                      marginTop: 11,
                    }}
                  >
                    {
                      title
                    }
                  </div>

                  <div
                    style={{
                      color:
                        '#666',
                      fontSize: 10,
                      lineHeight:
                        1.45,
                      marginTop: 5,
                    }}
                  >
                    {
                      description
                    }
                  </div>
                </button>
              )
            )}
          </div>
        </Card>

        <section
          className="fm-grid-2"
          style={{
            display:
              'grid',
            gridTemplateColumns:
              'minmax(0, 1.5fr) minmax(300px, 1fr)',
            gap: 18,
            marginBottom:
              18,
          }}
        >
          <Card
            style={{
              padding: 22,
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
                  20,
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
                    color:
                      '#666',
                    fontSize: 12,
                    marginTop: 5,
                  }}
                >
                  Quanto entrou e quanto saiu
                  no período.
                </div>
              </div>

              <div
                style={{
                  color:
                    '#555',
                  fontSize: 11,
                }}
              >
                {
                  periodLabels[
                    period
                  ]
                }
              </div>
            </div>

            {income === 0 &&
            expenses === 0 ? (
              <div
                style={{
                  height: 220,
                  display:
                    'flex',
                  alignItems:
                    'center',
                  justifyContent:
                    'center',
                  color:
                    '#666',
                  fontSize: 13,
                  border:
                    `1px dashed ${COLORS.border}`,
                  borderRadius:
                    12,
                }}
              >
                Nenhuma movimentação de
                entrada ou despesa neste período.
              </div>
            ) : (
              <div
                style={{
                  display:
                    'grid',
                  gap: 22,
                }}
              >
                {[
                  [
                    'Entradas',
                    income,
                    COLORS.green,
                  ],
                  [
                    'Despesas',
                    expenses,
                    COLORS.red,
                  ],
                ].map(
                  ([
                    label,
                    value,
                    color,
                  ]) => (
                    <div
                      key={
                        label
                      }
                    >
                      <div
                        style={{
                          display:
                            'flex',
                          justifyContent:
                            'space-between',
                          marginBottom:
                            8,
                          fontSize: 12,
                        }}
                      >
                        <span
                          style={{
                            color:
                              '#888',
                          }}
                        >
                          {
                            label
                          }
                        </span>

                        <strong>
                          {formatCurrency(
                            value
                          )}
                        </strong>
                      </div>

                      <div
                        style={{
                          height: 10,
                          background:
                            '#1d1d1d',
                          borderRadius:
                            20,
                          overflow:
                            'hidden',
                        }}
                      >
                        <div
                          style={{
                            height:
                              '100%',
                            width:
                              income +
                                expenses >
                              0
                                ? `${Math.min(
                                    100,
                                    (value /
                                      Math.max(
                                        income,
                                        expenses
                                      )) *
                                      100
                                  )}%`
                                : '0%',
                            background:
                              color,
                            borderRadius:
                              20,
                          }}
                        />
                      </div>
                    </div>
                  )
                )}
              </div>
            )}
          </Card>

          <Card
            style={{
              padding: 22,
            }}
          >
            <div
              style={{
                display:
                  'flex',
                justifyContent:
                  'space-between',
                alignItems:
                  'flex-start',
                gap: 12,
              }}
            >
              <div>
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
                    color:
                      '#666',
                    fontSize: 12,
                    marginTop: 5,
                  }}
                >
                  Onde seu dinheiro está agora.
                </div>
              </div>

              <button
                onClick={() =>
                  setShowAccountModal(
                    true
                  )
                }
                style={{
                  ...iconButtonStyle,
                  width: 34,
                  height: 34,
                }}
                title="Nova conta"
              >
                <Icon
                  name="plus"
                  size={16}
                />
              </button>
            </div>

            <div
              style={{
                marginTop:
                  15,
              }}
            >
              {accounts.length ===
              0 ? (
                <div
                  style={{
                    padding: 30,
                    textAlign:
                      'center',
                    color:
                      '#666',
                    fontSize: 13,
                  }}
                >
                  Nenhuma conta
                  cadastrada.
                </div>
              ) : (
                accounts.map(
                  (
                    account
                  ) => (
                    <div
                      key={
                        account.id
                      }
                      style={{
                        display:
                          'flex',
                        alignItems:
                          'center',
                        justifyContent:
                          'space-between',
                        gap: 12,
                        padding:
                          '13px 0',
                        borderBottom:
                          `1px solid ${COLORS.border}`,
                      }}
                    >
                      <div
                        style={{
                          display:
                            'flex',
                          alignItems:
                            'center',
                          gap: 10,
                          minWidth:
                            0,
                        }}
                      >
                        <div
                          style={{
                            width: 34,
                            height: 34,
                            borderRadius:
                              10,
                            background:
                              'rgba(255,255,255,.04)',
                            display:
                              'flex',
                            alignItems:
                              'center',
                            justifyContent:
                              'center',
                            color:
                              '#aaa',
                            flexShrink:
                              0,
                          }}
                        >
                          <Icon
                            name="wallet"
                            size={17}
                          />
                        </div>

                        <div
                          style={{
                            minWidth:
                              0,
                          }}
                        >
                          <div
                            style={{
                              fontSize: 13,
                              fontWeight:
                                800,
                              whiteSpace:
                                'nowrap',
                              overflow:
                                'hidden',
                              textOverflow:
                                'ellipsis',
                            }}
                          >
                            {
                              account.name
                            }
                          </div>

                          <div
                            style={{
                              color:
                                '#555',
                              fontSize: 10,
                              marginTop: 3,
                            }}
                          >
                            {
                              getAccountLabel(
                                account.type
                              )
                            }
                          </div>
                        </div>
                      </div>

                      <strong
                        style={{
                          fontSize: 13,
                          whiteSpace:
                            'nowrap',
                        }}
                      >
                        {formatCurrency(
                          account.current_balance
                        )}
                      </strong>
                    </div>
                  )
                )
              )}
            </div>
          </Card>
        </section>

        <section
          className="fm-grid-2"
          style={{
            display:
              'grid',
            gridTemplateColumns:
              'minmax(0, 1.5fr) minmax(300px, 1fr)',
            gap: 18,
          }}
        >
          <Card
            style={{
              padding: 22,
              overflow:
                'hidden',
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
                  18,
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
                    color:
                      '#666',
                    fontSize: 12,
                    marginTop: 5,
                  }}
                >
                  Tudo que aconteceu dentro do período.
                </div>
              </div>

              <div
                style={{
                  color:
                    '#555',
                  fontSize: 11,
                }}
              >
                {
                  filteredTransactions.length
                }{' '}
                registro(s)
              </div>
            </div>

            {latestTransactions.length ===
            0 ? (
              <div
                style={{
                  padding:
                    '42px 20px',
                  textAlign:
                    'center',
                  color:
                    '#666',
                  fontSize: 13,
                }}
              >
                Nenhuma movimentação registrada
                neste período.
              </div>
            ) : (
              <div
                style={{
                  overflowX:
                    'auto',
                }}
              >
                <table
                  style={{
                    width:
                      '100%',
                    borderCollapse:
                      'collapse',
                    minWidth:
                      650,
                  }}
                >
                  <thead>
                    <tr
                      style={{
                        color:
                          '#555',
                        fontSize: 10,
                        textTransform:
                          'uppercase',
                        textAlign:
                          'left',
                        letterSpacing:
                          '.08em',
                      }}
                    >
                      <th
                        style={{
                          padding:
                            '9px 7px',
                          borderBottom:
                            `1px solid ${COLORS.border}`,
                        }}
                      >
                        Movimento
                      </th>

                      <th
                        style={{
                          padding:
                            '9px 7px',
                          borderBottom:
                            `1px solid ${COLORS.border}`,
                        }}
                      >
                        Conta
                      </th>

                      <th
                        style={{
                          padding:
                            '9px 7px',
                          borderBottom:
                            `1px solid ${COLORS.border}`,
                        }}
                      >
                        Categoria
                      </th>

                      <th
                        style={{
                          padding:
                            '9px 7px',
                          borderBottom:
                            `1px solid ${COLORS.border}`,
                        }}
                      >
                        Data
                      </th>

                      <th
                        style={{
                          padding:
                            '9px 7px',
                          borderBottom:
                            `1px solid ${COLORS.border}`,
                          textAlign:
                            'right',
                        }}
                      >
                        Valor
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {latestTransactions.map(
                      (
                        transaction
                      ) => {
                        const color =
                          getTransactionColor(
                            transaction.type
                          );

                        const normalized =
                          normalize(
                            transaction.type
                          );

                        const isOutgoing =
                          [
                            'expense',
                            'withdrawal',
                            'retirada',
                            'pro-labore',
                            'prolabore',
                            'transfer_out',
                          ].includes(
                            normalized
                          );

                        const iconName =
                          normalized ===
                          'transfer_in'
                            ? 'down'
                            : normalized ===
                                'transfer_out'
                              ? 'up'
                              : isOutgoing
                                ? 'up'
                                : 'down';

                        return (
                          <tr
                            key={
                              transaction.id
                            }
                            className="fm-table-row"
                          >
                            <td
                              style={{
                                padding:
                                  '13px 7px',
                                borderBottom:
                                  `1px solid ${COLORS.border}`,
                              }}
                            >
                              <div
                                style={{
                                  display:
                                    'flex',
                                  alignItems:
                                    'center',
                                  gap: 9,
                                }}
                              >
                                <div
                                  style={{
                                    width: 30,
                                    height: 30,
                                    borderRadius:
                                      9,
                                    background:
                                      `${color}15`,
                                    color,
                                    display:
                                      'flex',
                                    alignItems:
                                      'center',
                                    justifyContent:
                                      'center',
                                    flexShrink:
                                      0,
                                  }}
                                >
                                  <Icon
                                    name={
                                      iconName
                                    }
                                    size={15}
                                  />
                                </div>

                                <div
                                  style={{
                                    minWidth:
                                      0,
                                  }}
                                >
                                  <div
                                    style={{
                                      fontSize: 12,
                                      fontWeight:
                                        800,
                                      whiteSpace:
                                        'nowrap',
                                      overflow:
                                        'hidden',
                                      textOverflow:
                                        'ellipsis',
                                      maxWidth: 360,
                                    }}
                                  >
                                    {transaction.description ||
                                      'Movimentação financeira'}
                                  </div>

                                  <div
                                    style={{
                                      fontSize: 10,
                                      color:
                                        '#555',
                                      marginTop: 3,
                                    }}
                                  >
                                    {
                                      getTransactionLabel(
                                        transaction.type
                                      )
                                    }
                                  </div>
                                </div>
                              </div>
                            </td>

                            <td
                              style={{
                                padding:
                                  '13px 7px',
                                borderBottom:
                                  `1px solid ${COLORS.border}`,
                                color:
                                  '#777',
                                fontSize: 11,
                              }}
                            >
                              {transaction
                                .financial_accounts
                                ?.name ||
                                '—'}
                            </td>

                            <td
                              style={{
                                padding:
                                  '13px 7px',
                                borderBottom:
                                  `1px solid ${COLORS.border}`,
                                color:
                                  '#777',
                                fontSize: 11,
                              }}
                            >
                              {transaction
                                .financial_categories
                                ?.name ||
                                '—'}
                            </td>

                            <td
                              style={{
                                padding:
                                  '13px 7px',
                                borderBottom:
                                  `1px solid ${COLORS.border}`,
                                color:
                                  '#777',
                                fontSize: 11,
                                whiteSpace:
                                  'nowrap',
                              }}
                            >
                              {formatDate(
                                transaction.transaction_date
                              )}
                            </td>

                            <td
                              style={{
                                padding:
                                  '13px 7px',
                                borderBottom:
                                  `1px solid ${COLORS.border}`,
                                textAlign:
                                  'right',
                                color,
                                fontWeight:
                                  800,
                                fontSize: 12,
                                whiteSpace:
                                  'nowrap',
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
                color:
                  '#666',
                fontSize: 12,
                marginTop: 5,
                marginBottom:
                  20,
              }}
            >
              Onde o dinheiro está saindo.
            </div>

            {expenseCategories.length ===
            0 ? (
              <div
                style={{
                  padding:
                    '40px 10px',
                  textAlign:
                    'center',
                  color:
                    '#666',
                  fontSize: 13,
                }}
              >
                Nenhuma despesa registrada.
              </div>
            ) : (
              expenseCategories
                .slice(
                  0,
                  10
                )
                .map(
                  (
                    category
                  ) => {
                    const percentage =
                      expenses >
                      0
                        ? (category.amount /
                            expenses) *
                          100
                        : 0;

                    return (
                      <div
                        key={
                          category.name
                        }
                        style={{
                          marginBottom:
                            17,
                        }}
                      >
                        <div
                          style={{
                            display:
                              'flex',
                            justifyContent:
                              'space-between',
                            marginBottom:
                              7,
                            fontSize: 12,
                          }}
                        >
                          <span
                            style={{
                              color:
                                '#aaa',
                            }}
                          >
                            {
                              category.name
                            }
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
                            background:
                              '#1d1d1d',
                            borderRadius:
                              20,
                            overflow:
                              'hidden',
                          }}
                        >
                          <div
                            style={{
                              width:
                                `${Math.min(
                                  100,
                                  percentage
                                )}%`,
                              height:
                                '100%',
                              background:
                                COLORS.red,
                              borderRadius:
                                20,
                            }}
                          />
                        </div>

                        <div
                          style={{
                            color:
                              '#555',
                            fontSize: 10,
                            marginTop: 4,
                          }}
                        >
                          {
                            percentage.toFixed(
                              1
                            )
                          }
                          %
                        </div>
                      </div>
                    );
                  }
                )
            )}
          </Card>
        </section>

        <Card
          style={{
            marginTop:
              18,
            padding: 20,
          }}
        >
          <div
            style={{
              display:
                'flex',
              justifyContent:
                'space-between',
              gap: 16,
              alignItems:
                'center',
            }}
          >
            <div>
              <div
                style={{
                  color:
                    COLORS.green,
                  fontSize: 10,
                  fontWeight:
                    800,
                  letterSpacing:
                    '.13em',
                  textTransform:
                    'uppercase',
                }}
              >
                Regra prática
              </div>

              <div
                style={{
                  fontSize: 15,
                  fontWeight:
                    800,
                  marginTop: 5,
                }}
              >
                Empresa paga a empresa.
                Pessoal paga sua vida.
              </div>

              <div
                style={{
                  color:
                    '#666',
                  fontSize: 12,
                  marginTop: 5,
                }}
              >
                Use Transferência para levar
                dinheiro da empresa para a conta
                pessoal e registre as contas da casa
                dentro da conta pessoal.
              </div>
            </div>

            {!personalAccount && (
              <button
                onClick={() => {
                  setNewAccount(
                    (
                      current
                    ) => ({
                      ...current,
                      type: 'personal',
                      name: 'Conta Pessoal',
                    })
                  );

                  setShowAccountModal(
                    true
                  );
                }}
                style={{
                  height: 42,
                  padding:
                    '0 14px',
                  borderRadius:
                    10,
                  border:
                    '1px solid rgba(245,158,11,.3)',
                  background:
                    'rgba(245,158,11,.08)',
                  color:
                    COLORS.yellow,
                  cursor:
                    'pointer',
                  fontSize: 11,
                  fontWeight:
                    800,
                  flexShrink:
                    0,
                }}
              >
                Criar conta pessoal
              </button>
            )}
          </div>
        </Card>
      </main>

      {toast && (
        <div
          style={{
            position:
              'fixed',
            right: 22,
            bottom: 22,
            zIndex: 300,
            maxWidth:
              380,
            padding:
              '13px 15px',
            borderRadius:
              12,
            border:
              `1px solid ${
                toast.type ===
                'error'
                  ? 'rgba(239,43,53,.35)'
                  : 'rgba(34,197,94,.35)'
              }`,
            background:
              toast.type ===
              'error'
                ? 'rgba(60,10,12,.96)'
                : 'rgba(8,32,17,.96)',
            color:
              COLORS.white,
            boxShadow:
              '0 18px 60px rgba(0,0,0,.4)',
            fontSize:
              12,
            fontWeight:
              700,
          }}
        >
          {
            toast.message
          }
        </div>
      )}

      {showMovementModal && (
        <Modal
          title={
            movement.type ===
            'income'
              ? 'Nova entrada'
              : movement.type ===
                  'expense'
                ? 'Nova despesa'
                : movement.type ===
                    'withdrawal'
                  ? 'Nova retirada'
                  : 'Transferir dinheiro'
          }
          subtitle={
            movement.type ===
            'income'
              ? 'Registre um valor que entrou na conta.'
              : movement.type ===
                  'expense'
                ? 'Registre uma conta, gasto ou compra.'
                : movement.type ===
                    'withdrawal'
                  ? 'Registre uma retirada da empresa ou outra saída pessoal.'
                  : 'Mova dinheiro entre duas contas sem alterar o resultado do mês.'
          }
          onClose={() =>
            setShowMovementModal(
              false
            )
          }
          wide
        >
          <div
            style={{
              padding: 22,
            }}
          >
            <div
              style={{
                display:
                  'grid',
                gridTemplateColumns:
                  'repeat(2, 1fr)',
                gap: 14,
              }}
            >
              <div
                style={{
                  gridColumn:
                    '1 / -1',
                }}
              >
                <label
                  style={
                    fieldLabelStyle
                  }
                >
                  TIPO
                </label>

                <div
                  style={{
                    display:
                      'grid',
                    gridTemplateColumns:
                      'repeat(4, 1fr)',
                    gap: 7,
                  }}
                >
                  {[
                    [
                      'income',
                      'Entrada',
                    ],
                    [
                      'expense',
                      'Despesa',
                    ],
                    [
                      'withdrawal',
                      'Retirada',
                    ],
                    [
                      'transfer',
                      'Transferência',
                    ],
                  ].map(
                    ([
                      type,
                      label,
                    ]) => (
                      <button
                        key={
                          type
                        }
                        onClick={() =>
                          resetMovement(
                            type
                          )
                        }
                        style={{
                          height:
                            42,
                          borderRadius:
                            10,
                          border:
                            `1px solid ${
                              movement.type ===
                              type
                                ? 'rgba(239,43,53,.42)'
                                : COLORS.border
                            }`,
                          background:
                            movement.type ===
                            type
                              ? 'rgba(239,43,53,.12)'
                              : '#111',
                          color:
                            movement.type ===
                            type
                              ? COLORS.white
                              : '#777',
                          cursor:
                            'pointer',
                          fontSize:
                            11,
                          fontWeight:
                            800,
                        }}
                      >
                        {
                          label
                        }
                      </button>
                    )
                  )}
                </div>
              </div>

              <div>
                <label
                  style={
                    fieldLabelStyle
                  }
                >
                  DESCRIÇÃO
                </label>

                <input
                  value={
                    movement.description
                  }
                  onChange={(
                    event
                  ) =>
                    setMovement(
                      (
                        current
                      ) => ({
                        ...current,
                        description:
                          event.target
                            .value,
                      })
                    )
                  }
                  placeholder={
                    movement.type ===
                    'expense'
                      ? 'Ex.: Internet'
                      : 'Ex.: Pagamento de cliente'
                  }
                  style={
                    fieldStyle
                  }
                />
              </div>

              <div>
                <label
                  style={
                    fieldLabelStyle
                  }
                >
                  VALOR
                </label>

                <input
                  value={
                    movement.amount
                  }
                  onChange={(
                    event
                  ) =>
                    setMovement(
                      (
                        current
                      ) => ({
                        ...current,
                        amount:
                          event.target
                            .value,
                      })
                    )
                  }
                  inputMode="decimal"
                  placeholder="0,00"
                  style={
                    fieldStyle
                  }
                />
              </div>

              <div>
                <label
                  style={
                    fieldLabelStyle
                  }
                >
                  {movement.type ===
                  'transfer'
                    ? 'CONTA DE ORIGEM'
                    : 'CONTA'}
                </label>

                <select
                  value={
                    movement.accountId
                  }
                  onChange={(
                    event
                  ) =>
                    setMovement(
                      (
                        current
                      ) => ({
                        ...current,
                        accountId:
                          event.target
                            .value,
                      })
                    )
                  }
                  style={
                    fieldStyle
                  }
                >
                  <option value="">
                    Selecione
                  </option>

                  {accounts.map(
                    (
                      account
                    ) => (
                      <option
                        key={
                          account.id
                        }
                        value={
                          account.id
                        }
                      >
                        {
                          account.name
                        }{' '}
                        —{' '}
                        {
                          getAccountLabel(
                            account.type
                          )
                        }
                      </option>
                    )
                  )}
                </select>
              </div>

              {movement.type ===
              'transfer' ? (
                <div>
                  <label
                    style={
                      fieldLabelStyle
                    }
                  >
                    CONTA DE DESTINO
                  </label>

                  <select
                    value={
                      movement.destinationAccountId
                    }
                    onChange={(
                      event
                    ) =>
                      setMovement(
                        (
                          current
                        ) => ({
                          ...current,
                          destinationAccountId:
                            event.target
                              .value,
                        })
                      )
                    }
                    style={
                      fieldStyle
                    }
                  >
                    <option value="">
                      Selecione
                    </option>

                    {accounts.map(
                      (
                        account
                      ) => (
                        <option
                          key={
                            account.id
                          }
                          value={
                            account.id
                          }
                        >
                          {
                            account.name
                          }{' '}
                          —{' '}
                          {
                            getAccountLabel(
                              account.type
                            )
                          }
                        </option>
                      )
                    )}
                  </select>
                </div>
              ) : (
                <div>
                  <label
                    style={
                      fieldLabelStyle
                    }
                  >
                    DATA
                  </label>

                  <input
                    type="date"
                    value={
                      movement.date
                    }
                    onChange={(
                      event
                    ) =>
                      setMovement(
                        (
                          current
                        ) => ({
                          ...current,
                          date:
                            event.target
                              .value,
                        })
                      )
                    }
                    style={
                      fieldStyle
                    }
                  />
                </div>
              )}

              {movement.type !==
              'transfer' && (
                <div>
                  <label
                    style={
                      fieldLabelStyle
                    }
                  >
                    CATEGORIA
                  </label>

                  <select
                    value={
                      movement.categoryId
                    }
                    onChange={(
                      event
                    ) => {
                      const value =
                        event.target
                          .value;

                      const virtual =
                        categoryOptions.find(
                          (
                            category
                          ) =>
                            category.id ===
                              value &&
                            category.virtual
                        );

                      setMovement(
                        (
                          current
                        ) => ({
                          ...current,
                          categoryId:
                            virtual
                              ? ''
                              : value,
                          categoryName:
                            virtual
                              ? virtual.name
                              : '',
                        })
                      );
                    }}
                    style={
                      fieldStyle
                    }
                  >
                    <option value="">
                      Sem categoria
                    </option>

                    {categoryOptions.map(
                      (
                        category
                      ) => (
                        <option
                          key={
                            category.id
                          }
                          value={
                            category.id
                          }
                        >
                          {
                            category.name
                          }
                          {category.virtual
                            ? ' (criar)'
                            : ''}
                        </option>
                      )
                    )}
                  </select>
                </div>
              )}

              {movement.type ===
              'transfer' ? (
                <div>
                  <label
                    style={
                      fieldLabelStyle
                    }
                  >
                    DATA
                  </label>

                  <input
                    type="date"
                    value={
                      movement.date
                    }
                    onChange={(
                      event
                    ) =>
                      setMovement(
                        (
                          current
                        ) => ({
                          ...current,
                          date:
                            event.target
                              .value,
                        })
                      )
                    }
                    style={
                      fieldStyle
                    }
                  />
                </div>
              ) : (
                <div>
                  <label
                    style={
                      fieldLabelStyle
                    }
                  >
                    NOVA CATEGORIA
                    (OPCIONAL)
                  </label>

                  <input
                    value={
                      movement.categoryName
                    }
                    onChange={(
                      event
                    ) =>
                      setMovement(
                        (
                          current
                        ) => ({
                          ...current,
                          categoryName:
                            event.target
                              .value,
                          categoryId:
                            '',
                        })
                      )
                    }
                    placeholder="Ex.: Prestação da casa"
                    style={
                      fieldStyle
                    }
                  />
                </div>
              )}

              <div
                style={{
                  gridColumn:
                    '1 / -1',
                }}
              >
                <label
                  style={
                    fieldLabelStyle
                  }
                >
                  OBSERVAÇÃO
                  (OPCIONAL)
                </label>

                <textarea
                  value={
                    movement.notes
                  }
                  onChange={(
                    event
                  ) =>
                    setMovement(
                      (
                        current
                      ) => ({
                        ...current,
                        notes:
                          event.target
                            .value,
                      })
                    )
                  }
                  placeholder="Detalhes, vencimento, forma de pagamento ou observações."
                  rows={3}
                  style={{
                    ...fieldStyle,
                    height:
                      'auto',
                    minHeight:
                      82,
                    paddingTop:
                      11,
                    resize:
                      'vertical',
                  }}
                />
              </div>
            </div>

            {movement.type ===
              'expense' && (
              <div
                style={{
                  marginTop:
                    15,
                  padding: 13,
                  borderRadius:
                    11,
                  background:
                    'rgba(239,43,53,.06)',
                  border:
                    '1px solid rgba(239,43,53,.12)',
                  color:
                    '#999',
                  fontSize: 11,
                  lineHeight:
                    1.5,
                }}
              >
                Despesas da empresa devem sair da
                conta da empresa. Despesas de casa
                e lazer devem sair da conta pessoal.
              </div>
            )}

            {movement.type ===
              'transfer' && (
              <div
                style={{
                  marginTop:
                    15,
                  padding: 13,
                  borderRadius:
                    11,
                  background:
                    'rgba(59,130,246,.06)',
                  border:
                    '1px solid rgba(59,130,246,.12)',
                  color:
                    '#999',
                  fontSize: 11,
                  lineHeight:
                    1.5,
                }}
              >
                Transferências apenas movem dinheiro
                entre contas. Elas não entram como
                receita ou despesa do período.
              </div>
            )}

            <div
              style={{
                display:
                  'flex',
                justifyContent:
                  'flex-end',
                gap: 9,
                marginTop:
                  20,
              }}
            >
              <button
                onClick={() =>
                  setShowMovementModal(
                    false
                  )
                }
                style={{
                  height: 44,
                  padding:
                    '0 15px',
                  borderRadius:
                    10,
                  border:
                    `1px solid ${COLORS.border}`,
                  background:
                    '#111',
                  color:
                    '#999',
                  cursor:
                    'pointer',
                  fontSize:
                    12,
                  fontWeight:
                    700,
                }}
              >
                Cancelar
              </button>

              <button
                onClick={
                  saveMovement
                }
                disabled={
                  saving
                }
                style={{
                  height: 44,
                  padding:
                    '0 18px',
                  borderRadius:
                    10,
                  border: 0,
                  background:
                    COLORS.green,
                  color:
                    '#041008',
                  cursor:
                    saving
                      ? 'default'
                      : 'pointer',
                  fontSize:
                    12,
                  fontWeight:
                    900,
                  opacity:
                    saving
                      ? 0.6
                      : 1,
                }}
              >
                {saving
                  ? 'Salvando...'
                  : 'Salvar movimentação'}
              </button>
            </div>
          </div>
        </Modal>
      )}

      {showAccountModal && (
        <Modal
          title="Nova conta financeira"
          subtitle="Crie a conta que vai representar onde seu dinheiro está guardado."
          onClose={() =>
            setShowAccountModal(
              false
            )
          }
        >
          <div
            style={{
              padding: 22,
            }}
          >
            <div
              style={{
                display:
                  'grid',
                gap: 14,
              }}
            >
              <div>
                <label
                  style={
                    fieldLabelStyle
                  }
                >
                  NOME DA CONTA
                </label>

                <input
                  value={
                    newAccount.name
                  }
                  onChange={(
                    event
                  ) =>
                    setNewAccount(
                      (
                        current
                      ) => ({
                        ...current,
                        name:
                          event.target
                            .value,
                      })
                    )
                  }
                  placeholder="Ex.: Conta Pessoal"
                  style={
                    fieldStyle
                  }
                />
              </div>

              <div>
                <label
                  style={
                    fieldLabelStyle
                  }
                >
                  TIPO
                </label>

                <select
                  value={
                    newAccount.type
                  }
                  onChange={(
                    event
                  ) =>
                    setNewAccount(
                      (
                        current
                      ) => ({
                        ...current,
                        type:
                          event.target
                            .value,
                      })
                    )
                  }
                  style={
                    fieldStyle
                  }
                >
                  <option value="personal">
                    Pessoal
                  </option>

                  <option value="business">
                    Empresa
                  </option>

                  <option value="reserve">
                    Reserva
                  </option>

                  <option value="investment">
                    Investimentos
                  </option>
                </select>
              </div>

              <div>
                <label
                  style={
                    fieldLabelStyle
                  }
                >
                  SALDO INICIAL
                </label>

                <input
                  value={
                    newAccount.initialBalance
                  }
                  onChange={(
                    event
                  ) =>
                    setNewAccount(
                      (
                        current
                      ) => ({
                        ...current,
                        initialBalance:
                          event.target
                            .value,
                      })
                    )
                  }
                  inputMode="decimal"
                  placeholder="0,00"
                  style={
                    fieldStyle
                  }
                />
              </div>

              <div>
                <label
                  style={
                    fieldLabelStyle
                  }
                >
                  DESCRIÇÃO
                  (OPCIONAL)
                </label>

                <textarea
                  value={
                    newAccount.description
                  }
                  onChange={(
                    event
                  ) =>
                    setNewAccount(
                      (
                        current
                      ) => ({
                        ...current,
                        description:
                          event.target
                            .value,
                      })
                    )
                  }
                  rows={3}
                  placeholder="Para que esta conta serve?"
                  style={{
                    ...fieldStyle,
                    height:
                      'auto',
                    minHeight:
                      82,
                    paddingTop:
                      11,
                    resize:
                      'vertical',
                  }}
                />
              </div>
            </div>

            <div
              style={{
                display:
                  'flex',
                justifyContent:
                  'flex-end',
                gap: 9,
                marginTop:
                  20,
              }}
            >
              <button
                onClick={() =>
                  setShowAccountModal(
                    false
                  )
                }
                style={{
                  height: 44,
                  padding:
                    '0 15px',
                  borderRadius:
                    10,
                  border:
                    `1px solid ${COLORS.border}`,
                  background:
                    '#111',
                  color:
                    '#999',
                  cursor:
                    'pointer',
                  fontSize:
                    12,
                  fontWeight:
                    700,
                }}
              >
                Cancelar
              </button>

              <button
                onClick={
                  saveAccount
                }
                disabled={
                  saving
                }
                style={{
                  height: 44,
                  padding:
                    '0 18px',
                  borderRadius:
                    10,
                  border: 0,
                  background:
                    COLORS.green,
                  color:
                    '#041008',
                  cursor:
                    saving
                      ? 'default'
                      : 'pointer',
                  fontSize:
                    12,
                  fontWeight:
                    900,
                  opacity:
                    saving
                      ? 0.6
                      : 1,
                }}
              >
                {saving
                  ? 'Criando...'
                  : 'Criar conta'}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

export default FinancialManagement;