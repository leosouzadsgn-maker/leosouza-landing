import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
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

const commonExpenseCategories = [
  'Água',
  'Luz',
  'Internet',
  'Aluguel',
  'Prestação',
  'Mercado',
  'Transporte',
  'Software',
  'Assinaturas',
  'Marketing',
  'Impostos',
  'Fornecedores',
  'Equipamentos',
  'Manutenção',
  'Lazer',
  'Outros',
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

    up: (
      <>
        <path d="M12 19V5" />
        <path d="m5 12 7-7 7 7" />
      </>
    ),

    down: (
      <>
        <path d="M12 5v14" />
        <path d="m19 12-7 7-7-7" />
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

    check: (
      <>
        <path d="m5 12 4 4L19 6" />
      </>
    ),
  };

  return (
    <svg {...props}>
      {icons[name] || null}
    </svg>
  );
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
          maxWidth: 680,
          maxHeight: '90vh',
          overflowY: 'auto',
          background: '#0d0d0d',
          border: `1px solid ${COLORS.border}`,
          borderRadius: 20,
          boxShadow:
            '0 30px 100px rgba(0,0,0,.55)',
        }}
      >
        <div
          style={{
            padding: '20px 22px',
            borderBottom:
              `1px solid ${COLORS.border}`,
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
                  lineHeight: 1.5,
                }}
              >
                {subtitle}
              </div>
            )}
          </div>

          <button
            onClick={onClose}
            style={{
              width: 40,
              height: 40,
              borderRadius: 11,
              border:
                `1px solid ${COLORS.border}`,
              background: COLORS.panel,
              color: COLORS.muted,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              flexShrink: 0,
            }}
          >
            <Icon
              name="close"
              size={18}
            />
          </button>
        </div>

        {children}
      </div>
    </div>
  );
}

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
  border:
    `1px solid ${COLORS.border}`,
  background: '#111',
  color: COLORS.white,
  outline: 'none',
  fontSize: 13,
};

function FinancialManagement() {
  const [user, setUser] =
    useState(null);

  const [accounts, setAccounts] =
    useState([]);

  const [categories, setCategories] =
    useState([]);

  const [transactions, setTransactions] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [refreshing, setRefreshing] =
    useState(false);

  const [saving, setSaving] =
    useState(false);

  const [mobileOpen, setMobileOpen] =
    useState(false);

  const [period, setPeriod] =
    useState('month');

  const [showExpenseModal, setShowExpenseModal] =
    useState(false);

  const [showTransferModal, setShowTransferModal] =
    useState(false);

  const [showAccountModal, setShowAccountModal] =
    useState(false);

  const [toast, setToast] =
    useState(null);

  const [expenseForm, setExpenseForm] =
    useState({
      description: '',
      amount: '',
      categoryId: '',
      categoryName: '',
      date: todayISO(),
      notes: '',
    });

  const [transferForm, setTransferForm] =
    useState({
      sourceAccountId: '',
      destinationAccountId: '',
      amount: '',
      date: todayISO(),
      notes: '',
    });

  const [newAccount, setNewAccount] =
    useState({
      name: '',
      type: 'reserve',
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

  const loadFinancialData =
    useCallback(async () => {
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

        setUser(
          authenticatedUser
        );

        const ownerId =
          authenticatedUser.id;

        const [
          accountsResponse,
          categoriesResponse,
          transactionsResponse,
        ] =
          await Promise.all([
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
                  ascending:
                    true,
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
                  ascending:
                    true,
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
                  ascending:
                    false,
                }
              )
              .order(
                'created_at',
                {
                  ascending:
                    false,
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

        setAccounts(
          accountsResponse.data ||
            []
        );

        setCategories(
          categoriesResponse.data ||
            []
        );

        setTransactions(
          transactionsResponse.data ||
            []
        );

        const loadedAccounts =
          accountsResponse.data ||
          [];

        const cash =
          loadedAccounts.find(
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
          );

        const otherAccount =
          loadedAccounts.find(
            (account) =>
              account.id !==
                cash?.id
          );

        setExpenseForm(
          (current) => ({
            ...current,
          })
        );

        setTransferForm(
          (current) => ({
            ...current,
            sourceAccountId:
              current.sourceAccountId ||
              cash?.id ||
              '',
            destinationAccountId:
              current.destinationAccountId ||
              otherAccount?.id ||
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
        setLoading(
          false
        );
        setRefreshing(
          false
        );
      }
    }, []);

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

  const getPeriodStart =
    useCallback(() => {
      const now =
        new Date();

      if (
        period === 'all'
      ) {
        return null;
      }

      if (
        period === 'year'
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

  const availableCash =
    Number(
      businessAccount?.current_balance ||
        0
    );

  const reserveBalance =
    Number(
      reserveAccount?.current_balance ||
        0
    );

  const investmentBalance =
    Number(
      investmentAccount?.current_balance ||
        0
    );

  const totalAccountBalance =
    availableCash +
    reserveBalance +
    investmentBalance;

  const netResult =
    income - expenses;

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
            const name =
              transaction
                .financial_categories
                ?.name ||
              'Sem categoria';

            map[name] =
              (map[name] ||
                0) +
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

  const availableExpenseCategories =
    useMemo(() => {
      const realCategories =
        categories.filter(
          (category) =>
            normalize(
              category.type
            ) ===
            'expense'
        );

      const existing =
        new Set(
          realCategories.map(
            (category) =>
              normalize(
                category.name
              )
          )
        );

      const virtual =
        commonExpenseCategories
          .filter(
            (name) =>
              !existing.has(
                normalize(
                  name
                )
              )
          )
          .map(
            (name) => ({
              id:
                `virtual:${name}`,
              name,
              type:
                'expense',
              virtual:
                true,
            })
          );

      return [
        ...realCategories,
        ...virtual,
      ];
    }, [
      categories,
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
        return 'Caixa da empresa';
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

      return (
        type ||
        'Conta'
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
        return 'Entrada automática';
      }

      if (
        normalized ===
        'expense'
      ) {
        return 'Despesa';
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

  const openExpenseModal =
    () => {
      setExpenseForm({
        description: '',
        amount: '',
        categoryId: '',
        categoryName: '',
        date: todayISO(),
        notes: '',
      });

      setShowExpenseModal(
        true
      );
    };

  const openTransferModal =
    () => {
      setTransferForm({
        sourceAccountId:
          businessAccount?.id ||
          accounts[0]
            ?.id ||
          '',
        destinationAccountId:
          reserveAccount?.id ||
          investmentAccount?.id ||
          accounts.find(
            (account) =>
              account.id !==
              businessAccount?.id
          )?.id ||
          '',
        amount: '',
        date: todayISO(),
        notes: '',
      });

      setShowTransferModal(
        true
      );
    };

  const createExpenseCategory =
    async () => {
      if (
        !expenseForm.categoryName.trim()
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
              expenseForm.categoryName
            ) &&
            normalize(
              category.type
            ) ===
              'expense'
        );

      if (existing) {
        return existing.id;
      }

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
              expenseForm.categoryName.trim(),
            type:
              'expense',
            is_active:
              true,
          })
          .select('*')
          .single();

      if (error) {
        throw error;
      }

      setCategories(
        (
          current
        ) => [
          ...current,
          data,
        ]
      );

      return data.id;
    };

  const saveExpense =
    async () => {
      const amount =
        Number(
          String(
            expenseForm.amount
          ).replace(
            ',',
            '.'
          )
        );

      const description =
        expenseForm.description.trim();

      if (!description) {
        notify(
          'Informe a descrição da despesa.',
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
        !businessAccount
      ) {
        notify(
          'A conta Caixa da Empresa ainda não foi configurada.',
          'error'
        );
        return;
      }

      if (
        availableCash <
        amount
      ) {
        notify(
          'Saldo insuficiente no Caixa da Empresa.',
          'error'
        );
        return;
      }

      setSaving(true);

      try {
        const categoryId =
          await createExpenseCategory();

        const currentBalance =
          Number(
            businessAccount.current_balance ||
              0
          );

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
                user.id,
              account_id:
                businessAccount.id,
              category_id:
                categoryId ||
                null,
              type:
                'expense',
              amount,
              description,
              transaction_date:
                expenseForm.date,
              status:
                'confirmed',
              notes:
                expenseForm.notes.trim() ||
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
                currentBalance -
                amount,
              updated_at:
                new Date().toISOString(),
            })
            .eq(
              'id',
              businessAccount.id
            )
            .eq(
              'owner_id',
              user.id
            );

        if (balanceError) {
          throw balanceError;
        }

        notify(
          'Despesa registrada no Caixa da Empresa.'
        );

        setShowExpenseModal(
          false
        );

        await loadFinancialData();
      } catch (error) {
        console.error(
          'Erro ao registrar despesa:',
          error
        );

        notify(
          error?.message ||
            'Não foi possível registrar a despesa.',
          'error'
        );
      } finally {
        setSaving(false);
      }
    };

  const saveTransfer =
    async () => {
      const amount =
        Number(
          String(
            transferForm.amount
          ).replace(
            ',',
            '.'
          )
        );

      if (
        !transferForm.sourceAccountId
      ) {
        notify(
          'Selecione a conta de origem.',
          'error'
        );
        return;
      }

      if (
        !transferForm.destinationAccountId
      ) {
        notify(
          'Selecione a conta de destino.',
          'error'
        );
        return;
      }

      if (
        transferForm.sourceAccountId ===
        transferForm.destinationAccountId
      ) {
        notify(
          'As contas precisam ser diferentes.',
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

      const source =
        accounts.find(
          (account) =>
            account.id ===
            transferForm.sourceAccountId
        );

      const destination =
        accounts.find(
          (account) =>
            account.id ===
            transferForm.destinationAccountId
        );

      if (
        !source ||
        !destination
      ) {
        notify(
          'Conta de origem ou destino não encontrada.',
          'error'
        );
        return;
      }

      const sourceBalance =
        Number(
          source.current_balance ||
            0
        );

      if (
        sourceBalance <
        amount
      ) {
        notify(
          'Saldo insuficiente na conta de origem.',
          'error'
        );
        return;
      }

      setSaving(true);

      try {
        const description =
          transferForm.notes.trim() ||
          `Transferência de ${source.name} para ${destination.name}`;

        const {
          data:
            outgoingTransaction,
          error:
            outgoingError,
        } =
          await supabase
            .from(
              'financial_transactions'
            )
            .insert({
              owner_id:
                user.id,
              account_id:
                source.id,
              type:
                'transfer_out',
              amount,
              description,
              transaction_date:
                transferForm.date,
              status:
                'confirmed',
              notes:
                transferForm.notes.trim() ||
                null,
            })
            .select('*')
            .single();

        if (
          outgoingError
        ) {
          throw outgoingError;
        }

        const {
          error:
            incomingError,
        } =
          await supabase
            .from(
              'financial_transactions'
            )
            .insert({
              owner_id:
                user.id,
              account_id:
                destination.id,
              type:
                'transfer_in',
              amount,
              description,
              transaction_date:
                transferForm.date,
              status:
                'confirmed',
              notes:
                transferForm.notes.trim() ||
                null,
            });

        if (incomingError) {
          await supabase
            .from(
              'financial_transactions'
            )
            .delete()
            .eq(
              'id',
              outgoingTransaction.id
            );

          throw incomingError;
        }

        const {
          error:
            sourceError,
        } =
          await supabase
            .from(
              'financial_accounts'
            )
            .update({
              current_balance:
                sourceBalance -
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
              user.id
            );

        if (sourceError) {
          throw sourceError;
        }

        const {
          error:
            destinationError,
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
              user.id
            );

        if (
          destinationError
        ) {
          throw destinationError;
        }

        notify(
          'Transferência registrada com sucesso.'
        );

        setShowTransferModal(
          false
        );

        await loadFinancialData();
      } catch (error) {
        console.error(
          'Erro ao transferir dinheiro:',
          error
        );

        notify(
          error?.message ||
            'Não foi possível realizar a transferência.',
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
          type: 'reserve',
          description: '',
          initialBalance: '',
        });

        setShowAccountModal(
          false
        );

        await loadFinancialData();
      } catch (error) {
        console.error(
          'Erro ao criar conta:',
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

  const periodLabels = {
    month: 'Este mês',
    previous: 'Mês anterior',
    '3months': '3 meses',
    year: 'Este ano',
    all: 'Todo o histórico',
  };

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
          width: 42,
          height: 42,
          borderRadius:
            12,
          border:
            `1px solid ${COLORS.border}`,
          background:
            COLORS.panel,
          color:
            COLORS.white,
          alignItems:
            'center',
          justifyContent:
            'center',
          cursor:
            'pointer',
          position:
            'fixed',
          top: 15,
          left: 15,
          zIndex: 60,
        }}
      >
        <Icon
          name="menu"
          size={20}
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
              fontSize:
                18,
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
              color:
                '#666',
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
            color:
              '#555',
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
                key={
                  label
                }
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
                  color:
                    active
                      ? COLORS.white
                      : '#888',
                  background:
                    active
                      ? 'rgba(239,43,53,.12)'
                      : 'transparent',
                  cursor:
                    'pointer',
                  fontSize: 13,
                  fontWeight:
                    active
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
              color:
                '#777',
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
            {user?.email}
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
                color:
                  '#666',
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
                color:
                  '#666',
                fontSize: 13,
              }}
            >
              Acompanhe o dinheiro recebido,
              distribua automaticamente e
              controle suas despesas.
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
              onClick={
                openExpenseModal
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
              Nova despesa
            </button>

            <button
              className="fm-action"
              onClick={
                openTransferModal
              }
              style={{
                height: 42,
                padding:
                  '0 15px',
                borderRadius:
                  10,
                border:
                  '1px solid rgba(59,130,246,.28)',
                background:
                  'rgba(59,130,246,.10)',
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
                name="transfer"
                size={17}
              />
              Transferir
            </button>

            <button
              onClick={
                loadFinancialData
              }
              disabled={
                refreshing
              }
              style={{
                width: 42,
                height: 42,
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
                justifyContent:
                  'center',
                cursor:
                  refreshing
                    ? 'default'
                    : 'pointer',
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
                key={
                  key
                }
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
                {label}
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
                color:
                  '#777',
                fontSize:
                  12,
              }}
            >
              Patrimônio financeiro
            </div>

            <div
              style={{
                fontSize:
                  27,
                fontWeight:
                  800,
                marginTop:
                  10,
              }}
            >
              {formatCurrency(
                totalAccountBalance
              )}
            </div>

            <div
              style={{
                color:
                  '#555',
                fontSize:
                  11,
                marginTop:
                  6,
              }}
            >
              Caixa + reserva + investimentos
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
                color:
                  '#777',
                fontSize:
                  12,
              }}
            >
              Caixa da empresa
            </div>

            <div
              style={{
                fontSize:
                  27,
                fontWeight:
                  800,
                marginTop:
                  10,
              }}
            >
              {formatCurrency(
                availableCash
              )}
            </div>

            <div
              style={{
                color:
                  '#555',
                fontSize:
                  11,
                marginTop:
                  6,
              }}
            >
              Onde as despesas saem
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
                color:
                  '#777',
                fontSize:
                  12,
              }}
            >
              Reserva
            </div>

            <div
              style={{
                fontSize:
                  27,
                fontWeight:
                  800,
                marginTop:
                  10,
              }}
            >
              {formatCurrency(
                reserveBalance
              )}
            </div>

            <div
              style={{
                color:
                  '#555',
                fontSize:
                  11,
                marginTop:
                  6,
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
                `3px solid ${COLORS.purple}`,
            }}
          >
            <div
              style={{
                color:
                  '#777',
                fontSize:
                  12,
              }}
            >
              Investimentos
            </div>

            <div
              style={{
                fontSize:
                  27,
                fontWeight:
                  800,
                marginTop:
                  10,
              }}
            >
              {formatCurrency(
                investmentBalance
              )}
            </div>

            <div
              style={{
                color:
                  '#555',
                fontSize:
                  11,
                marginTop:
                  6,
              }}
            >
              Patrimônio investido
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
          <Card
            style={{
              padding:
                18,
            }}
          >
            <div
              style={{
                display:
                  'flex',
                alignItems:
                  'center',
                gap: 8,
                color:
                  COLORS.green,
                fontSize:
                  11,
                fontWeight:
                  800,
              }}
            >
              <Icon
                name="down"
                size={16}
              />
              ENTRADAS
            </div>

            <strong
              style={{
                display:
                  'block',
                fontSize:
                  22,
                marginTop:
                  10,
              }}
            >
              {formatCurrency(
                income
              )}
            </strong>

            <div
              style={{
                color:
                  '#555',
                fontSize:
                  10,
                marginTop:
                  5,
              }}
            >
              Vindas da Central de Pagamentos
            </div>
          </Card>

          <Card
            style={{
              padding:
                18,
            }}
          >
            <div
              style={{
                display:
                  'flex',
                alignItems:
                  'center',
                gap: 8,
                color:
                  COLORS.red,
                fontSize:
                  11,
                fontWeight:
                  800,
              }}
            >
              <Icon
                name="up"
                size={16}
              />
              DESPESAS
            </div>

            <strong
              style={{
                display:
                  'block',
                fontSize:
                  22,
                marginTop:
                  10,
              }}
            >
              {formatCurrency(
                expenses
              )}
            </strong>

            <div
              style={{
                color:
                  '#555',
                fontSize:
                  10,
                marginTop:
                  5,
              }}
            >
              Saídas do Caixa da Empresa
            </div>
          </Card>

          <Card
            style={{
              padding:
                18,
            }}
          >
            <div
              style={{
                display:
                  'flex',
                alignItems:
                  'center',
                gap: 8,
                color:
                  COLORS.blue,
                fontSize:
                  11,
                fontWeight:
                  800,
              }}
            >
              <Icon
                name="transfer"
                size={16}
              />
              TRANSFERÊNCIAS
            </div>

            <strong
              style={{
                display:
                  'block',
                fontSize:
                  22,
                marginTop:
                  10,
              }}
            >
              {formatCurrency(
                filteredTransactions
                  .filter(
                    (
                      transaction
                    ) =>
                      [
                        'transfer_in',
                        'transfer_out',
                      ].includes(
                        normalize(
                          transaction.type
                        )
                      )
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
                  ) /
                  2
              )}
            </strong>

            <div
              style={{
                color:
                  '#555',
                fontSize:
                  10,
                marginTop:
                  5,
              }}
            >
              Movimentações entre contas
            </div>
          </Card>

          <Card
            style={{
              padding:
                18,
            }}
          >
            <div
              style={{
                display:
                  'flex',
                alignItems:
                  'center',
                gap: 8,
                color:
                  netResult >=
                  0
                    ? COLORS.green
                    : COLORS.red,
                fontSize:
                  11,
                fontWeight:
                  800,
              }}
            >
              RESULTADO
            </div>

            <strong
              style={{
                display:
                  'block',
                fontSize:
                  22,
                marginTop:
                  10,
              }}
            >
              {formatCurrency(
                netResult
              )}
            </strong>

            <div
              style={{
                color:
                  '#555',
                fontSize:
                  10,
                marginTop:
                  5,
              }}
            >
              Entradas menos despesas
            </div>
          </Card>
        </section>

        <Card
          style={{
            padding:
              20,
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
                'center',
              gap:
                18,
              marginBottom:
                15,
            }}
          >
            <div>
              <h2
                style={{
                  margin: 0,
                  fontSize:
                    17,
                }}
              >
                Distribuição automática
              </h2>

              <div
                style={{
                  color:
                    '#666',
                  fontSize:
                    12,
                  marginTop:
                    5,
                }}
              >
                Todo pagamento recebido pela Central
                é distribuído conforme a regra financeira.
              </div>
            </div>

            <div
              style={{
                color:
                  COLORS.green,
                fontSize:
                  11,
                fontWeight:
                  800,
                whiteSpace:
                  'nowrap',
              }}
            >
              100% distribuído
            </div>
          </div>

          <div
            style={{
              display:
                'grid',
              gridTemplateColumns:
                'repeat(3, 1fr)',
              gap:
                10,
            }}
          >
            <div
              style={{
                padding:
                  16,
                borderRadius:
                  12,
                background:
                  'rgba(34,197,94,.06)',
                border:
                  '1px solid rgba(34,197,94,.14)',
              }}
            >
              <div
                style={{
                  color:
                    COLORS.green,
                  fontSize:
                    10,
                  fontWeight:
                    800,
                }}
              >
                CAIXA
              </div>

              <div
                style={{
                  marginTop:
                    7,
                  fontSize:
                    22,
                  fontWeight:
                    900,
                }}
              >
                60%
              </div>

              <div
                style={{
                  color:
                    '#666',
                  fontSize:
                    10,
                  marginTop:
                    4,
                }}
              >
                Operação e despesas
              </div>
            </div>

            <div
              style={{
                padding:
                  16,
                borderRadius:
                  12,
                background:
                  'rgba(59,130,246,.06)',
                border:
                  '1px solid rgba(59,130,246,.14)',
              }}
            >
              <div
                style={{
                  color:
                    COLORS.blue,
                  fontSize:
                    10,
                  fontWeight:
                    800,
                }}
              >
                RESERVA
              </div>

              <div
                style={{
                  marginTop:
                    7,
                  fontSize:
                    22,
                  fontWeight:
                    900,
                }}
              >
                25%
              </div>

              <div
                style={{
                  color:
                    '#666',
                  fontSize:
                    10,
                  marginTop:
                    4,
                }}
              >
                Segurança financeira
              </div>
            </div>

            <div
              style={{
                padding:
                  16,
                borderRadius:
                  12,
                background:
                  'rgba(168,85,247,.06)',
                border:
                  '1px solid rgba(168,85,247,.14)',
              }}
            >
              <div
                style={{
                  color:
                    COLORS.purple,
                  fontSize:
                    10,
                  fontWeight:
                    800,
                }}
              >
                INVESTIMENTOS
              </div>

              <div
                style={{
                  marginTop:
                    7,
                  fontSize:
                    22,
                  fontWeight:
                    900,
                }}
              >
                15%
              </div>

              <div
                style={{
                  color:
                    '#666',
                  fontSize:
                    10,
                  marginTop:
                    4,
                }}
              >
                Crescimento e patrimônio
              </div>
            </div>
          </div>
        </Card>

        <section
          className="fm-grid-2"
          style={{
            display:
              'grid',
            gridTemplateColumns:
              'minmax(0, 1.5fr) minmax(300px, 1fr)',
            gap:
              18,
            marginBottom:
              18,
          }}
        >
          <Card
            style={{
              padding:
                22,
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
                    fontSize:
                      17,
                  }}
                >
                  Fluxo financeiro
                </h2>

                <div
                  style={{
                    color:
                      '#666',
                    fontSize:
                      12,
                    marginTop:
                      5,
                  }}
                >
                  Quanto entrou e quanto saiu em{' '}
                  {
                    periodLabels[
                      period
                    ]
                  .toLowerCase()}
                  .
                </div>
              </div>
            </div>

            {income ===
              0 &&
            expenses ===
              0 ? (
              <div
                style={{
                  height:
                    220,
                  display:
                    'flex',
                  alignItems:
                    'center',
                  justifyContent:
                    'center',
                  color:
                    '#666',
                  fontSize:
                    13,
                  border:
                    `1px dashed ${COLORS.border}`,
                  borderRadius:
                    12,
                }}
              >
                Nenhuma entrada ou despesa registrada neste período.
              </div>
            ) : (
              <div
                style={{
                  display:
                    'grid',
                  gap:
                    22,
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
                          fontSize:
                            12,
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
                          height:
                            10,
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
              padding:
                22,
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
                gap:
                  12,
              }}
            >
              <div>
                <h2
                  style={{
                    margin: 0,
                    fontSize:
                      17,
                  }}
                >
                  Contas financeiras
                </h2>

                <div
                  style={{
                    color:
                      '#666',
                    fontSize:
                      12,
                    marginTop:
                      5,
                  }}
                >
                  Os três destinos do seu dinheiro.
                </div>
              </div>

              <button
                onClick={() =>
                  setShowAccountModal(
                    true
                  )
                }
                style={{
                  width:
                    34,
                  height:
                    34,
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
                  justifyContent:
                    'center',
                  cursor:
                    'pointer',
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
                    padding:
                      30,
                    textAlign:
                      'center',
                    color:
                      '#666',
                    fontSize:
                      13,
                  }}
                >
                  Nenhuma conta cadastrada.
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
                        gap:
                          12,
                        padding:
                          '14px 0',
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
                          gap:
                            10,
                        }}
                      >
                        <div
                          style={{
                            width:
                              36,
                            height:
                              36,
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
                          }}
                        >
                          <Icon
                            name="wallet"
                            size={
                              17
                            }
                          />
                        </div>

                        <div>
                          <div
                            style={{
                              fontSize:
                                13,
                              fontWeight:
                                800,
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
                              fontSize:
                                10,
                              marginTop:
                                3,
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
                          fontSize:
                            13,
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
            gap:
              18,
          }}
        >
          <Card
            style={{
              padding:
                22,
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
                    fontSize:
                      17,
                  }}
                >
                  Últimas movimentações
                </h2>

                <div
                  style={{
                    color:
                      '#666',
                    fontSize:
                      12,
                    marginTop:
                      5,
                  }}
                >
                  Entradas automáticas, despesas e transferências.
                </div>
              </div>

              <div
                style={{
                  color:
                    '#555',
                  fontSize:
                    11,
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
                  fontSize:
                    13,
                }}
              >
                Nenhuma movimentação registrada neste período.
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
                        fontSize:
                          10,
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
                        const normalized =
                          normalize(
                            transaction.type
                          );

                        const isOutgoing =
                          [
                            'expense',
                            'transfer_out',
                          ].includes(
                            normalized
                          );

                        const color =
                          getTransactionColor(
                            transaction.type
                          );

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
                                  gap:
                                    9,
                                }}
                              >
                                <div
                                  style={{
                                    width:
                                      30,
                                    height:
                                      30,
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
                                      isOutgoing
                                        ? 'up'
                                        : 'down'
                                    }
                                    size={
                                      15
                                    }
                                  />
                                </div>

                                <div>
                                  <div
                                    style={{
                                      fontSize:
                                        12,
                                      fontWeight:
                                        800,
                                      maxWidth:
                                        330,
                                      whiteSpace:
                                        'nowrap',
                                      overflow:
                                        'hidden',
                                      textOverflow:
                                        'ellipsis',
                                    }}
                                  >
                                    {
                                      transaction.description
                                    }
                                  </div>

                                  <div
                                    style={{
                                      fontSize:
                                        10,
                                      color:
                                        '#555',
                                      marginTop:
                                        3,
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
                                fontSize:
                                  11,
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
                                fontSize:
                                  11,
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
                                fontSize:
                                  11,
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
                                fontSize:
                                  12,
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
              padding:
                22,
            }}
          >
            <h2
              style={{
                margin:
                  0,
                fontSize:
                  17,
              }}
            >
              Despesas por categoria
            </h2>

            <div
              style={{
                color:
                  '#666',
                fontSize:
                  12,
                marginTop:
                  5,
                marginBottom:
                  20,
              }}
            >
              Veja onde o Caixa da Empresa está sendo utilizado.
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
                  fontSize:
                    13,
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
                            fontSize:
                              12,
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
                            height:
                              6,
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
                            fontSize:
                              10,
                            marginTop:
                              4,
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
      </main>

      {toast && (
        <div
          style={{
            position:
              'fixed',
            right:
              22,
            bottom:
              22,
            zIndex:
              300,
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

      {showExpenseModal && (
        <Modal
          title="Nova despesa"
          subtitle="Toda despesa registrada aqui sai do Caixa da Empresa."
          onClose={() =>
            setShowExpenseModal(
              false
            )
          }
        >
          <div
            style={{
              padding:
                22,
            }}
          >
            <div
              style={{
                padding:
                  14,
                marginBottom:
                  16,
                borderRadius:
                  12,
                background:
                  'rgba(34,197,94,.05)',
                border:
                  '1px solid rgba(34,197,94,.12)',
              }}
            >
              <div
                style={{
                  color:
                    COLORS.green,
                  fontSize:
                    10,
                  fontWeight:
                    800,
                  letterSpacing:
                    '.12em',
                }}
              >
                CONTA DE SAÍDA
              </div>

              <div
                style={{
                  marginTop:
                    6,
                  fontSize:
                    14,
                  fontWeight:
                    800,
                }}
              >
                Caixa da Empresa
              </div>

              <div
                style={{
                  marginTop:
                    3,
                  color:
                    '#666',
                  fontSize:
                    11,
                }}
              >
                Saldo disponível:{' '}
                {formatCurrency(
                  availableCash
                )}
              </div>
            </div>

            <div
              style={{
                display:
                  'grid',
                gap:
                  14,
              }}
            >
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
                    expenseForm.description
                  }
                  onChange={(
                    event
                  ) =>
                    setExpenseForm(
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
                  placeholder="Ex.: Internet"
                  style={
                    fieldStyle
                  }
                />
              </div>

              <div
                style={{
                  display:
                    'grid',
                  gridTemplateColumns:
                    '1fr 1fr',
                  gap:
                    14,
                }}
              >
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
                      expenseForm.amount
                    }
                    onChange={(
                      event
                    ) =>
                      setExpenseForm(
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
                    DATA
                  </label>

                  <input
                    type="date"
                    value={
                      expenseForm.date
                    }
                    onChange={(
                      event
                    ) =>
                      setExpenseForm(
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
              </div>

              <div
                style={{
                  display:
                    'grid',
                  gridTemplateColumns:
                    '1fr 1fr',
                  gap:
                    14,
                }}
              >
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
                      expenseForm.categoryId
                    }
                    onChange={(
                      event
                    ) => {
                      const value =
                        event.target
                          .value;

                      const selected =
                        availableExpenseCategories.find(
                          (
                            item
                          ) =>
                            item.id ===
                            value
                        );

                      setExpenseForm(
                        (
                          current
                        ) => ({
                          ...current,
                          categoryId:
                            selected?.virtual
                              ? ''
                              : value,
                          categoryName:
                            selected?.virtual
                              ? selected.name
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

                    {availableExpenseCategories.map(
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
                      expenseForm.categoryName
                    }
                    onChange={(
                      event
                    ) =>
                      setExpenseForm(
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
                    placeholder="Ex.: Prestação"
                    style={
                      fieldStyle
                    }
                  />
                </div>
              </div>

              <div>
                <label
                  style={
                    fieldLabelStyle
                  }
                >
                  OBSERVAÇÃO
                </label>

                <textarea
                  value={
                    expenseForm.notes
                  }
                  onChange={(
                    event
                  ) =>
                    setExpenseForm(
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
                  rows={
                    3
                  }
                  placeholder="Observações da despesa."
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
                gap:
                  9,
                marginTop:
                  20,
              }}
            >
              <button
                onClick={() =>
                  setShowExpenseModal(
                    false
                  )
                }
                style={{
                  height:
                    44,
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
                  saveExpense
                }
                disabled={
                  saving
                }
                style={{
                  height:
                    44,
                  padding:
                    '0 18px',
                  borderRadius:
                    10,
                  border: 0,
                  background:
                    COLORS.red,
                  color:
                    COLORS.white,
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
                  : 'Salvar despesa'}
              </button>
            </div>
          </div>
        </Modal>
      )}

      {showTransferModal && (
        <Modal
          title="Transferir dinheiro"
          subtitle="Mova dinheiro entre Caixa, Reserva e Investimentos sem registrar receita ou despesa."
          onClose={() =>
            setShowTransferModal(
              false
            )
          }
        >
          <div
            style={{
              padding:
                22,
            }}
          >
            <div
              style={{
                display:
                  'grid',
                gap:
                  14,
              }}
            >
              <div
                style={{
                  display:
                    'grid',
                  gridTemplateColumns:
                    '1fr 1fr',
                  gap:
                    14,
                }}
              >
                <div>
                  <label
                    style={
                      fieldLabelStyle
                    }
                  >
                    DE
                  </label>

                  <select
                    value={
                      transferForm.sourceAccountId
                    }
                    onChange={(
                      event
                    ) =>
                      setTransferForm(
                        (
                          current
                        ) => ({
                          ...current,
                          sourceAccountId:
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

                <div>
                  <label
                    style={
                      fieldLabelStyle
                    }
                  >
                    PARA
                  </label>

                  <select
                    value={
                      transferForm.destinationAccountId
                    }
                    onChange={(
                      event
                    ) =>
                      setTransferForm(
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
              </div>

              <div
                style={{
                  display:
                    'grid',
                  gridTemplateColumns:
                    '1fr 1fr',
                  gap:
                    14,
                }}
              >
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
                      transferForm.amount
                    }
                    onChange={(
                      event
                    ) =>
                      setTransferForm(
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
                    DATA
                  </label>

                  <input
                    type="date"
                    value={
                      transferForm.date
                    }
                    onChange={(
                      event
                    ) =>
                      setTransferForm(
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
              </div>

              <div>
                <label
                  style={
                    fieldLabelStyle
                  }
                >
                  OBSERVAÇÃO
                </label>

                <textarea
                  value={
                    transferForm.notes
                  }
                  onChange={(
                    event
                  ) =>
                    setTransferForm(
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
                  rows={
                    3
                  }
                  placeholder="Ex.: reforço da reserva."
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
                marginTop:
                  15,
                padding:
                  13,
                borderRadius:
                  11,
                background:
                  'rgba(59,130,246,.06)',
                border:
                  '1px solid rgba(59,130,246,.12)',
                color:
                  '#999',
                fontSize:
                  11,
                lineHeight:
                  1.5,
              }}
            >
              Transferência não altera o resultado. Ela apenas
              muda onde o dinheiro está guardado.
            </div>

            <div
              style={{
                display:
                  'flex',
                justifyContent:
                  'flex-end',
                gap:
                  9,
                marginTop:
                  20,
              }}
            >
              <button
                onClick={() =>
                  setShowTransferModal(
                    false
                  )
                }
                style={{
                  height:
                    44,
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
                  saveTransfer
                }
                disabled={
                  saving
                }
                style={{
                  height:
                    44,
                  padding:
                    '0 18px',
                  borderRadius:
                    10,
                  border: 0,
                  background:
                    COLORS.blue,
                  color:
                    COLORS.white,
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
                  ? 'Transferindo...'
                  : 'Confirmar transferência'}
              </button>
            </div>
          </div>
        </Modal>
      )}

      {showAccountModal && (
        <Modal
          title="Nova conta financeira"
          subtitle="Use somente para criar uma nova conta de Caixa, Reserva ou Investimentos."
          onClose={() =>
            setShowAccountModal(
              false
            )
          }
        >
          <div
            style={{
              padding:
                22,
            }}
          >
            <div
              style={{
                display:
                  'grid',
                gap:
                  14,
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
                  placeholder="Ex.: Reserva"
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
                  <option value="business">
                    Caixa da Empresa
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
                  rows={
                    3
                  }
                  placeholder="Para que essa conta serve?"
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
                gap:
                  9,
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
                  height:
                    44,
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
                  height:
                    44,
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