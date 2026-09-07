import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { supabase } from '../lib/supabase';

const COLORS = {
  bg: '#070707',
  sidebar: '#090909',
  panel: '#101010',
  panel2: '#151515',
  border: 'rgba(255,255,255,.09)',
  borderStrong: 'rgba(255,255,255,.14)',
  white: '#fff',
  text: '#ececec',
  muted: '#888',
  muted2: '#5e5e5e',
  red: '#ef2b35',
  green: '#22c55e',
  yellow: '#f59e0b',
};

const money = (value) =>
  new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(Number(value || 0));

const dateBR = (value) => {
  if (!value) return '—';

  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(value));
};

const normalize = (value) =>
  String(value || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

const isPaid = (charge) =>
  [
    'paid',
    'pago',
    'approved',
    'aprovado',
    'completed',
    'complete',
    'confirmed',
    'confirmado',
    'success',
    'succeeded',
    'captured',
    'capturado',
  ].includes(normalize(charge?.status));

const isCancelled = (charge) =>
  [
    'cancelled',
    'canceled',
    'cancelado',
    'expired',
    'expirada',
    'expirado',
  ].includes(normalize(charge?.status));

const isOverdue = (charge) => {
  if (isPaid(charge) || isCancelled(charge)) {
    return false;
  }

  if (!charge?.due_date) {
    return false;
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const due = new Date(`${charge.due_date}T00:00:00`);
  due.setHours(0, 0, 0, 0);

  return due < today;
};

const getStatus = (charge) => {
  if (isPaid(charge)) {
    return {
      key: 'paid',
      label: 'Pago',
      color: COLORS.green,
    };
  }

  if (isCancelled(charge)) {
    return {
      key: 'cancelled',
      label: 'Cancelado',
      color: COLORS.red,
    };
  }

  if (isOverdue(charge)) {
    return {
      key: 'overdue',
      label: 'Atrasado',
      color: COLORS.red,
    };
  }

  return {
    key: 'pending',
    label: 'Pendente',
    color: COLORS.yellow,
  };
};

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
        <circle cx="9" cy="7" r="4" />
        <path d="M2 21a7 7 0 0 1 14 0" />
        <path d="M16 11a4 4 0 1 0 0-8" />
        <path d="M17 14a6 6 0 0 1 5 6" />
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

    plus: (
      <>
        <path d="M12 5v14" />
        <path d="M5 12h14" />
      </>
    ),

    search: (
      <>
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-4-4" />
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

    copy: (
      <>
        <rect x="9" y="9" width="11" height="11" rx="2" />
        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
      </>
    ),

    external: (
      <>
        <path d="M14 3h7v7" />
        <path d="M10 14 21 3" />
        <path d="M21 14v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5" />
      </>
    ),

    close: (
      <>
        <path d="m6 6 12 12" />
        <path d="m18 6-12 12" />
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
  };

  return <svg {...props}>{icons[name]}</svg>;
}

function Field({
  label,
  children,
  required = false,
}) {
  return (
    <div>
      <label
        style={{
          display: 'block',
          marginBottom: 8,
          fontSize: 12,
          color: '#aaa',
          fontWeight: 700,
        }}
      >
        {label}
        {required && (
          <span
            style={{
              color: COLORS.red,
              marginLeft: 3,
            }}
          >
            *
          </span>
        )}
      </label>

      {children}
    </div>
  );
}

function Input(props) {
  return (
    <input
      {...props}
      style={{
        width: '100%',
        height: 44,
        padding: '0 13px',
        borderRadius: 10,
        border:
          `1px solid ${COLORS.border}`,
        background: '#0b0b0b',
        color: '#eee',
        outline: 'none',
        fontSize: 13,
        ...props.style,
      }}
    />
  );
}

function Select(props) {
  return (
    <select
      {...props}
      style={{
        width: '100%',
        height: 44,
        padding: '0 13px',
        borderRadius: 10,
        border:
          `1px solid ${COLORS.border}`,
        background: '#0b0b0b',
        color: '#eee',
        outline: 'none',
        fontSize: 13,
        ...props.style,
      }}
    />
  );
}

function Charges() {
  const [user, setUser] = useState(null);

  const [charges, setCharges] = useState([]);
  const [clients, setClients] = useState([]);
  const [brands, setBrands] = useState([]);

 const [loading, setLoading] = useState(true);
const [refreshing, setRefreshing] = useState(false);

const [mobileOpen, setMobileOpen] = useState(false);

const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] =
    useState('all');

  const [modal, setModal] = useState(null);

  const [selectedCharge, setSelectedCharge] =
    useState(null);

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const [form, setForm] = useState({
    brand_id: '',
    client_id: '',
    title: '',
    description: '',
    amount: '',
    due_date: '',
    pix_enabled: true,
    card_enabled: true,
    max_installments: 12,
    fee_payer: 'merchant',
  });

  const navigate = (path) => {
    window.location.href = path;
  };

  const loadData = useCallback(
    async () => {
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
          window.location.href =
            '/pagamentos/admin';
          return;
        }

        setUser(authenticatedUser);

        const ownerId =
          authenticatedUser.id;

        const [
          chargesResponse,
          clientsResponse,
          brandsResponse,
        ] = await Promise.all([
          supabase
            .from('charges')
            .select(`
              id,
              owner_id,
              brand_id,
              client_id,
              reference_code,
              title,
              description,
              amount,
              currency,
              due_date,
              status,
              pix_enabled,
              card_enabled,
              max_installments,
              fee_payer,
              gateway,
              gateway_checkout_id,
              gateway_checkout_url,
              paid_at,
              created_at,
              updated_at
            `)
            .eq('owner_id', ownerId)
            .order('created_at', {
              ascending: false,
            }),

          supabase
            .from('clients')
            .select(`
              id,
              owner_id,
              brand_id,
              name,
              email,
              phone,
              is_active
            `)
            .eq('owner_id', ownerId)
            .eq('is_active', true)
            .order('name', {
              ascending: true,
            }),

          supabase
            .from('brands')
            .select(`
              id,
              owner_id,
              name,
              display_name,
              is_active
            `)
            .eq('owner_id', ownerId)
            .eq('is_active', true)
            .order('name', {
              ascending: true,
            }),
        ]);

        if (chargesResponse.error) {
          throw chargesResponse.error;
        }

        if (clientsResponse.error) {
          throw clientsResponse.error;
        }

        if (brandsResponse.error) {
          throw brandsResponse.error;
        }

        setCharges(
          chargesResponse.data || []
        );

        setClients(
          clientsResponse.data || []
        );

        setBrands(
          brandsResponse.data || []
        );
      } catch (error) {
        console.error(
          'Erro ao carregar cobranças:',
          error
        );

        setCharges([]);
        setClients([]);
        setBrands([]);
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    []
  );

  useEffect(() => {
    loadData();
  }, [loadData]);

  const clientMap = useMemo(
    () =>
      Object.fromEntries(
        clients.map((client) => [
          client.id,
          client,
        ])
      ),
    [clients]
  );

  const brandMap = useMemo(
    () =>
      Object.fromEntries(
        brands.map((brand) => [
          brand.id,
          brand,
        ])
      ),
    [brands]
  );

  const filteredCharges = useMemo(() => {
    const query =
      normalize(search);

    return charges.filter((charge) => {
      const status =
        getStatus(charge);

      if (
        statusFilter !== 'all' &&
        status.key !== statusFilter
      ) {
        return false;
      }

      if (!query) {
        return true;
      }

      const client =
        clientMap[charge.client_id];

      const brand =
        brandMap[charge.brand_id];

      const text = normalize(
        [
          charge.reference_code,
          charge.title,
          charge.description,
          client?.name,
          client?.email,
          brand?.name,
          brand?.display_name,
        ].join(' ')
      );

      return text.includes(query);
    });
  }, [
    charges,
    search,
    statusFilter,
    clientMap,
    brandMap,
  ]);

  const summary = useMemo(() => {
    const total = charges.reduce(
      (sum, charge) =>
        sum + Number(charge.amount || 0),
      0
    );

    const paid = charges
      .filter(isPaid)
      .reduce(
        (sum, charge) =>
          sum + Number(charge.amount || 0),
        0
      );

    const pending = charges
      .filter((charge) => {
        const status =
          getStatus(charge);

        return (
          status.key === 'pending' ||
          status.key === 'overdue'
        );
      })
      .reduce(
        (sum, charge) =>
          sum + Number(charge.amount || 0),
        0
      );

    return {
      count: charges.length,
      total,
      paid,
      pending,
      paidCount:
        charges.filter(isPaid).length,
      pendingCount:
        charges.filter((charge) => {
          const key =
            getStatus(charge).key;

          return (
            key === 'pending' ||
            key === 'overdue'
          );
        }).length,
    };
  }, [charges]);

  const openNewCharge = () => {
    setMessage('');

    setForm({
      brand_id:
        brands[0]?.id || '',
      client_id: '',
      title: '',
      description: '',
      amount: '',
      due_date: '',
      pix_enabled: true,
      card_enabled: true,
      max_installments: 12,
      fee_payer: 'merchant',
    });

    setModal('new');
  };

  const createCharge = async (
    event
  ) => {
    event.preventDefault();

    setMessage('');

    if (!form.client_id) {
      setMessage(
        'Selecione o cliente da cobrança.'
      );
      return;
    }

    if (!form.brand_id) {
      setMessage(
        'Selecione a marca ou projeto.'
      );
      return;
    }

    if (!form.title.trim()) {
      setMessage(
        'Informe o título da cobrança.'
      );
      return;
    }

    const amount = Number(
      String(form.amount)
        .replace(/\./g, '')
        .replace(',', '.')
    );

    if (!amount || amount <= 0) {
      setMessage(
        'Informe um valor válido.'
      );
      return;
    }

    if (
      !form.pix_enabled &&
      !form.card_enabled
    ) {
      setMessage(
        'Ative pelo menos uma forma de pagamento.'
      );
      return;
    }

    try {
      setSaving(true);

      const {
        data: { user: authenticatedUser },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError) {
        throw authError;
      }

      if (!authenticatedUser) {
        window.location.href =
          '/pagamentos/admin';
        return;
      }

      const referenceCode =
        `CP-${new Date()
          .toISOString()
          .slice(0, 10)
          .replace(/-/g, '')}-${Math.random()
          .toString(36)
          .slice(2, 8)
          .toUpperCase()}`;

      const { data: charge, error } =
        await supabase
          .from('charges')
          .insert({
            owner_id:
              authenticatedUser.id,
            brand_id:
              form.brand_id,
            client_id:
              form.client_id,
            reference_code:
              referenceCode,
            title:
              form.title.trim(),
            description:
              form.description.trim() ||
              null,
            amount,
            currency: 'BRL',
            due_date:
              form.due_date || null,
            status: 'pending',
            pix_enabled:
              form.pix_enabled,
            card_enabled:
              form.card_enabled,
            max_installments:
              Number(
                form.max_installments
              ),
            fee_payer:
              form.fee_payer,
            gateway:
              'infinitepay',
          })
          .select()
          .single();

      if (error) {
        throw error;
      }

      const sessionResponse =
        await supabase.auth.getSession();

      const accessToken =
        sessionResponse?.data?.session
          ?.access_token;

      if (!accessToken) {
        throw new Error(
          'Sessão administrativa não encontrada.'
        );
      }

      const checkoutResponse =
        await fetch(
          '/api/infinitepay/create-checkout',
          {
            method: 'POST',
            headers: {
              'Content-Type':
                'application/json',
              Authorization:
                `Bearer ${accessToken}`,
            },
            body: JSON.stringify({
              charge_id: charge.id,
            }),
          }
        );

      const checkoutData =
        await checkoutResponse.json();

      if (!checkoutResponse.ok) {
        throw new Error(
          checkoutData?.message ||
            'Não foi possível gerar o checkout InfinitePay.'
        );
      }

      setModal(null);

      await loadData();

      setSelectedCharge({
        ...charge,
        gateway_checkout_url:
          checkoutData.url,
        gateway_checkout_id:
          checkoutData.slug ||
          null,
      });

      setModal('success');
    } catch (error) {
      console.error(
        'Erro ao criar cobrança:',
        error
      );

      setMessage(
        error?.message ||
          'Não foi possível criar a cobrança.'
      );
    } finally {
      setSaving(false);
    }
  };

  const copyLink = async (charge) => {
    if (!charge?.gateway_checkout_url) {
      return;
    }

    try {
      await navigator.clipboard.writeText(
        charge.gateway_checkout_url
      );

      setMessage(
        'Link copiado para a área de transferência.'
      );

      setTimeout(() => {
        setMessage('');
      }, 2200);
    } catch {
      setMessage(
        'Não foi possível copiar automaticamente o link.'
      );
    }
  };

  const shareWhatsApp = (
    charge
  ) => {
    if (!charge?.gateway_checkout_url) {
      return;
    }

    const client =
      clientMap[charge.client_id];

    const text = [
      `Olá, ${client?.name || ''}!`,
      '',
      `Sua cobrança está disponível.`,
      '',
      `Serviço: ${charge.title}`,
      `Valor: ${money(charge.amount)}`,
      charge.due_date
        ? `Vencimento: ${dateBR(charge.due_date)}`
        : '',
      '',
      `Pagamento seguro:`,
      charge.gateway_checkout_url,
    ]
      .filter(Boolean)
      .join('\n');

    window.open(
      `https://wa.me/?text=${encodeURIComponent(
        text
      )}`,
      '_blank',
      'noopener,noreferrer'
    );
  };

  const cancelCharge = async (
    charge
  ) => {
    const confirmed =
      window.confirm(
        'Deseja cancelar esta cobrança?'
      );

    if (!confirmed) {
      return;
    }

    try {
      setSaving(true);

      const {
        error,
      } = await supabase
        .from('charges')
        .update({
          status: 'cancelled',
          updated_at:
            new Date().toISOString(),
        })
        .eq('id', charge.id)
        .eq(
          'owner_id',
          user.id
        );

      if (error) {
        throw error;
      }

      setSelectedCharge(null);
      setModal(null);

      await loadData();
    } catch (error) {
      setMessage(
        error?.message ||
          'Não foi possível cancelar a cobrança.'
      );
    } finally {
      setSaving(false);
    }
  };

  const openCharge = (
    charge
  ) => {
    setMessage('');
    setSelectedCharge(charge);
    setModal('details');
  };

  const menu = [
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
  ];

  const styles = `
    * {
      box-sizing: border-box;
    }

    html,
    body,
    #root {
      margin: 0;
      min-height: 100%;
      background: #070707;
    }

    body {
      font-family: Inter, Arial, sans-serif;
    }

    button,
    input,
    select,
    textarea {
      font: inherit;
    }

    .charges-sidebar {
      transition: transform .22s ease;
    }

    .charges-nav {
      transition: background .16s ease, color .16s ease;
    }

    .charges-nav:hover {
      background: rgba(255,255,255,.035) !important;
      color: #fff !important;
    }

    .charges-row:hover {
      background: rgba(255,255,255,.025);
    }

    .charges-mobile {
      display: none !important;
    }

    .charges-modal-backdrop {
      position: fixed;
      inset: 0;
      z-index: 200;
      background: rgba(0,0,0,.72);
      backdrop-filter: blur(8px);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 22px;
    }

    .charges-modal {
      width: min(760px, 100%);
      max-height: 92vh;
      overflow-y: auto;
      background: #101010;
      border: 1px solid rgba(255,255,255,.12);
      border-radius: 18px;
      box-shadow: 0 30px 90px rgba(0,0,0,.55);
    }

    .charge-option {
      border: 1px solid rgba(255,255,255,.1);
      background: #0b0b0b;
      border-radius: 12px;
      padding: 15px;
      cursor: pointer;
      transition: border-color .16s ease, background .16s ease;
    }

    .charge-option.selected {
      border-color: rgba(239,43,53,.6);
      background: rgba(239,43,53,.06);
    }

    @media (max-width: 1120px) {
      .charges-sidebar {
        transform: translateX(-100%);
        z-index: 150;
      }

      .charges-sidebar.open {
        transform: translateX(0);
      }

      .charges-main {
        margin-left: 0 !important;
        padding-left: 20px !important;
        padding-right: 20px !important;
      }

      .charges-mobile {
        display: flex !important;
      }

      .charges-summary {
        grid-template-columns: repeat(2, 1fr) !important;
      }
    }

    @media (max-width: 760px) {
      .charges-summary {
        grid-template-columns: 1fr !important;
      }

      .charges-header {
        flex-direction: column !important;
        align-items: flex-start !important;
      }

      .charges-actions {
        width: 100%;
      }

      .charges-actions button {
        flex: 1;
      }

      .charges-filter {
        flex-direction: column !important;
        align-items: stretch !important;
      }

      .charges-table {
        min-width: 850px;
      }
    }
  `;

  if (loading) {
    return (
      <div
        style={{
          minHeight: '100vh',
          background: COLORS.bg,
          color: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        Carregando Cobranças...
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        background: COLORS.bg,
        color: COLORS.white,
      }}
    >
      <style>{styles}</style>

      <button
        className="charges-mobile"
        onClick={() =>
          setMobileOpen(
            (value) => !value
          )
        }
        style={{
          position: 'fixed',
          top: 15,
          left: 15,
          zIndex: 160,
          width: 44,
          height: 44,
          borderRadius: 12,
          border:
            `1px solid ${COLORS.border}`,
          background: '#101010',
          color: '#fff',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Icon
          name="menu"
          size={20}
        />
      </button>

      <aside
        className={`charges-sidebar ${
          mobileOpen ? 'open' : ''
        }`}
        style={{
          position: 'fixed',
          inset: '0 auto 0 0',
          width: 258,
          background: COLORS.sidebar,
          borderRight:
            `1px solid ${COLORS.border}`,
          padding:
            '30px 18px 18px',
          display: 'flex',
          flexDirection: 'column',
          overflowY: 'auto',
        }}
      >
        <div
          style={{
            padding:
              '0 18px 28px',
            borderBottom:
              `1px solid ${COLORS.border}`,
            marginBottom: 20,
          }}
        >
          <div
            style={{
              color: '#f3f3f3',
              fontSize: 19,
              fontWeight: 800,
              letterSpacing: '-.04em',
            }}
          >
            LÉO SOUZA
          </div>

          <div
            style={{
              marginTop: 4,
              fontSize: 10,
              color: '#aaa',
              letterSpacing:
                '.22em',
            }}
          >
            DESIGNER
          </div>

          <div
            style={{
              marginTop: 14,
              color: '#666',
              fontSize: 9,
              letterSpacing:
                '.13em',
            }}
          >
            ESTRATÉGIA · IMAGEM · RESULTADOS
          </div>
        </div>

        <div
          style={{
            color: '#666',
            fontSize: 10,
            letterSpacing:
              '.14em',
            margin:
              '0 18px 10px',
          }}
        >
          MENU
        </div>

        {menu.map(
          ([icon, label, path]) => {
            const active =
              path ===
              '/pagamentos/admin/cobrancas';

            return (
              <div
                key={path}
                className="charges-nav"
                onClick={() =>
                  navigate(path)
                }
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 13,
                  padding:
                    '12px 16px',
                  borderRadius: 10,
                  marginBottom: 4,
                  color: active
                    ? '#fff'
                    : '#aaa',
                  background:
                    active
                      ? 'rgba(239,43,53,.12)'
                      : 'transparent',
                  borderLeft:
                    active
                      ? `2px solid ${COLORS.red}`
                      : '2px solid transparent',
                  cursor: 'pointer',
                  fontSize: 14,
                  fontWeight:
                    active ? 700 : 500,
                }}
              >
                <span
                  style={{
                    color: active
                      ? COLORS.red
                      : '#999',
                  }}
                >
                  <Icon
                    name={icon}
                    size={19}
                  />
                </span>

                {label}
              </div>
            );
          }
        )}

        <div
          style={{
            marginTop: 'auto',
            padding:
              '18px 18px 3px',
            borderTop:
              `1px solid ${COLORS.border}`,
          }}
        >
          <div
            style={{
              color: '#777',
              fontSize: 10,
              marginBottom: 10,
              overflow: 'hidden',
              whiteSpace: 'nowrap',
              textOverflow:
                'ellipsis',
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
              alignItems: 'center',
              gap: 9,
              border: 0,
              background:
                'transparent',
              color: '#aaa',
              padding: 0,
              cursor: 'pointer',
              fontSize: 13,
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
        className="charges-main"
        style={{
          marginLeft: 258,
          padding:
            '28px 30px 50px',
          maxWidth: 1600,
        }}
      >
        <header
          className="charges-header"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent:
              'space-between',
            gap: 20,
            paddingBottom: 23,
            borderBottom:
              `1px solid ${COLORS.border}`,
          }}
        >
          <div>
            <div
              style={{
                fontSize: 11,
                color: '#666',
                letterSpacing:
                  '.13em',
                textTransform:
                  'uppercase',
              }}
            >
              Central de Pagamentos
            </div>

            <h1
              style={{
                margin:
                  '7px 0 0',
                fontSize: 31,
                letterSpacing:
                  '-.045em',
              }}
            >
              Cobranças
            </h1>

            <div
              style={{
                marginTop: 6,
                color: '#777',
                fontSize: 13,
              }}
            >
              Crie, envie e acompanhe suas cobranças.
            </div>
          </div>

          <div
            className="charges-actions"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 9,
            }}
          >
            <button
              onClick={loadData}
              disabled={refreshing}
              style={{
                width: 42,
                height: 42,
                borderRadius: 10,
                border:
                  `1px solid ${COLORS.border}`,
                background:
                  COLORS.panel,
                color: '#aaa',
                display: 'flex',
                alignItems:
                  'center',
                justifyContent:
                  'center',
                cursor:
                  'pointer',
                opacity:
                  refreshing
                    ? .5
                    : 1,
              }}
              title="Atualizar"
            >
              <Icon
                name="refresh"
                size={18}
              />
            </button>

            <button
              onClick={openNewCharge}
              style={{
                height: 42,
                padding:
                  '0 16px',
                borderRadius: 10,
                border: 0,
                background:
                  COLORS.red,
                color: '#fff',
                display: 'flex',
                alignItems:
                  'center',
                justifyContent:
                  'center',
                gap: 8,
                cursor: 'pointer',
                fontSize: 13,
                fontWeight: 800,
                boxShadow:
                  '0 10px 25px rgba(239,43,53,.18)',
              }}
            >
              <Icon
                name="plus"
                size={17}
              />
              Nova cobrança
            </button>
          </div>
        </header>

        <section
          className="charges-summary"
          style={{
            display: 'grid',
            gridTemplateColumns:
              'repeat(4,minmax(0,1fr))',
            gap: 14,
            marginTop: 20,
          }}
        >
          {[
            [
              'Cobranças',
              summary.count,
              'Total registrado',
              COLORS.white,
            ],
            [
              'Faturado',
              money(summary.total),
              'Valor das cobranças',
              COLORS.white,
            ],
            [
              'Recebido',
              money(summary.paid),
              `${summary.paidCount} cobranças pagas`,
              COLORS.green,
            ],
            [
              'A receber',
              money(summary.pending),
              `${summary.pendingCount} pendentes`,
              COLORS.red,
            ],
          ].map(
            ([
              title,
              value,
              description,
              accent,
            ]) => (
              <div
                key={title}
                style={{
                  position: 'relative',
                  padding: 20,
                  minHeight: 125,
                  background:
                    COLORS.panel,
                  border:
                    `1px solid ${COLORS.border}`,
                  borderRadius: 14,
                  overflow:
                    'hidden',
                }}
              >
                <div
                  style={{
                    position:
                      'absolute',
                    left: 0,
                    top: 0,
                    bottom: 0,
                    width: 3,
                    background:
                      accent,
                  }}
                />

                <div
                  style={{
                    color: '#777',
                    fontSize: 12,
                  }}
                >
                  {title}
                </div>

                <div
                  style={{
                    marginTop: 10,
                    fontSize: 25,
                    fontWeight: 800,
                    letterSpacing:
                      '-.035em',
                  }}
                >
                  {value}
                </div>

                <div
                  style={{
                    marginTop: 7,
                    color: '#5f5f5f',
                    fontSize: 10,
                  }}
                >
                  {description}
                </div>
              </div>
            )
          )}
        </section>

        <section
          className="charges-filter"
          style={{
            marginTop: 18,
            display: 'flex',
            alignItems: 'center',
            gap: 10,
          }}
        >
          <div
            style={{
              position:
                'relative',
              flex: 1,
            }}
          >
            <div
              style={{
                position:
                  'absolute',
                left: 13,
                top: 0,
                bottom: 0,
                display:
                  'flex',
                alignItems:
                  'center',
                color: '#555',
                pointerEvents:
                  'none',
              }}
            >
              <Icon
                name="search"
                size={17}
              />
            </div>

            <Input
              value={search}
              onChange={(event) =>
                setSearch(
                  event.target.value
                )
              }
              placeholder="Pesquisar cliente, cobrança ou código..."
              style={{
                paddingLeft: 42,
              }}
            />
          </div>

          <div
            style={{
              display: 'flex',
              padding: 3,
              border:
                `1px solid ${COLORS.border}`,
              borderRadius: 10,
              background:
                'rgba(255,255,255,.01)',
            }}
          >
            {[
              ['all', 'Todas'],
              ['pending', 'Pendentes'],
              ['paid', 'Pagas'],
              ['overdue', 'Atrasadas'],
              ['cancelled', 'Canceladas'],
            ].map(
              ([value, label]) => (
                <button
                  key={value}
                  onClick={() =>
                    setStatusFilter(
                      value
                    )
                  }
                  style={{
                    height: 36,
                    padding:
                      '0 12px',
                    border: 0,
                    borderRadius: 8,
                    background:
                      statusFilter ===
                      value
                        ? '#222'
                        : 'transparent',
                    color:
                      statusFilter ===
                      value
                        ? '#fff'
                        : '#777',
                    cursor:
                      'pointer',
                    fontSize:
                      11,
                    fontWeight:
                      statusFilter ===
                      value
                        ? 700
                        : 500,
                  }}
                >
                  {label}
                </button>
              )
            )}
          </div>
        </section>

        <section
          style={{
            marginTop: 18,
            background:
              COLORS.panel,
            border:
              `1px solid ${COLORS.border}`,
            borderRadius: 15,
            overflow:
              'hidden',
          }}
        >
          <div
            style={{
              padding:
                '20px 21px',
              display: 'flex',
              alignItems:
                'center',
              justifyContent:
                'space-between',
              borderBottom:
                `1px solid ${COLORS.border}`,
            }}
          >
            <div>
              <div
                style={{
                  fontSize: 17,
                  fontWeight: 800,
                }}
              >
                Todas as cobranças
              </div>

              <div
                style={{
                  marginTop: 4,
                  color: '#666',
                  fontSize: 11,
                }}
              >
                Dados reais da Central
              </div>
            </div>

            <div
              style={{
                color: '#666',
                fontSize: 11,
              }}
            >
              {filteredCharges.length}{' '}
              resultado
              {filteredCharges.length !==
              1
                ? 's'
                : ''}
            </div>
          </div>

          {filteredCharges.length ===
          0 ? (
            <div
              style={{
                padding: 75,
                textAlign:
                  'center',
              }}
            >
              <div
                style={{
                  width: 52,
                  height: 52,
                  margin:
                    '0 auto 15px',
                  borderRadius: 14,
                  background:
                    'rgba(255,255,255,.035)',
                  display: 'flex',
                  alignItems:
                    'center',
                  justifyContent:
                    'center',
                  color: '#666',
                }}
              >
                <Icon
                  name="charges"
                  size={24}
                />
              </div>

              <div
                style={{
                  color: '#aaa',
                  fontSize: 14,
                  fontWeight: 700,
                }}
              >
                Nenhuma cobrança encontrada
              </div>

              <div
                style={{
                  marginTop: 7,
                  color: '#555',
                  fontSize: 12,
                }}
              >
                Crie sua primeira cobrança para começar.
              </div>

              <button
                onClick={openNewCharge}
                style={{
                  marginTop: 17,
                  height: 40,
                  padding:
                    '0 15px',
                  border: 0,
                  borderRadius: 9,
                  background:
                    COLORS.red,
                  color: '#fff',
                  cursor:
                    'pointer',
                  fontSize:
                    12,
                  fontWeight:
                    800,
                }}
              >
                + Criar cobrança
              </button>
            </div>
          ) : (
            <div
              style={{
                overflowX:
                  'auto',
              }}
            >
              <table
                className="charges-table"
                style={{
                  width:
                    '100%',
                  borderCollapse:
                    'collapse',
                }}
              >
                <thead>
                  <tr>
                    {[
                      'Código',
                      'Cliente',
                      'Serviço',
                      'Valor',
                      'Vencimento',
                      'Status',
                      '',
                    ].map(
                      (title) => (
                        <th
                          key={
                            title ||
                            'actions'
                          }
                          style={{
                            padding:
                              '12px 14px',
                            borderBottom:
                              `1px solid ${COLORS.border}`,
                            color:
                              '#5f5f5f',
                            fontSize:
                              10,
                            fontWeight:
                              700,
                            textAlign:
                              title ===
                              'Valor'
                                ? 'right'
                                : 'left',
                            textTransform:
                              'uppercase',
                            letterSpacing:
                              '.07em',
                          }}
                        >
                          {title}
                        </th>
                      )
                    )}
                  </tr>
                </thead>

                <tbody>
                  {filteredCharges.map(
                    (charge) => {
                      const client =
                        clientMap[
                          charge.client_id
                        ];

                      const brand =
                        brandMap[
                          charge.brand_id
                        ];

                      const status =
                        getStatus(
                          charge
                        );

                      return (
                        <tr
                          key={
                            charge.id
                          }
                          className="charges-row"
                          onClick={() =>
                            openCharge(
                              charge
                            )
                          }
                          style={{
                            cursor:
                              'pointer',
                          }}
                        >
                          <td
                            style={{
                              padding:
                                '15px 14px',
                              borderBottom:
                                `1px solid ${COLORS.border}`,
                            }}
                          >
                            <div
                              style={{
                                color:
                                  '#ddd',
                                fontSize:
                                  11,
                                fontWeight:
                                  700,
                              }}
                            >
                              {
                                charge.reference_code
                              }
                            </div>
                          </td>

                          <td
                            style={{
                              padding:
                                '15px 14px',
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
                              }}
                            >
                              <div
                                style={{
                                  width:
                                    32,
                                  height:
                                    32,
                                  borderRadius:
                                    '50%',
                                  background:
                                    '#252525',
                                  display:
                                    'flex',
                                  alignItems:
                                    'center',
                                  justifyContent:
                                    'center',
                                  color:
                                    '#ddd',
                                  fontSize:
                                    10,
                                  fontWeight:
                                    800,
                                }}
                              >
                                {String(
                                  client?.name ||
                                    'C'
                                )
                                  .trim()
                                  .split(
                                    /\s+/
                                  )
                                  .slice(
                                    0,
                                    2
                                  )
                                  .map(
                                    (
                                      part
                                    ) =>
                                      part[0]
                                  )
                                  .join(
                                    ''
                                  )
                                  .toUpperCase()}
                              </div>

                              <div>
                                <div
                                  style={{
                                    color:
                                      '#eee',
                                    fontSize:
                                      12,
                                    fontWeight:
                                      700,
                                  }}
                                >
                                  {client?.name ||
                                    'Cliente não informado'}
                                </div>

                                <div
                                  style={{
                                    marginTop:
                                      3,
                                    color:
                                      '#666',
                                    fontSize:
                                      10,
                                  }}
                                >
                                  {brand?.display_name ||
                                    brand?.name ||
                                    'Sem marca'}
                                </div>
                              </div>
                            </div>
                          </td>

                          <td
                            style={{
                              padding:
                                '15px 14px',
                              borderBottom:
                                `1px solid ${COLORS.border}`,
                              color:
                                '#aaa',
                              fontSize:
                                12,
                            }}
                          >
                            {charge.title}
                          </td>

                          <td
                            style={{
                              padding:
                                '15px 14px',
                              borderBottom:
                                `1px solid ${COLORS.border}`,
                              textAlign:
                                'right',
                              fontSize:
                                12,
                              fontWeight:
                                800,
                            }}
                          >
                            {money(
                              charge.amount
                            )}
                          </td>

                          <td
                            style={{
                              padding:
                                '15px 14px',
                              borderBottom:
                                `1px solid ${COLORS.border}`,
                              color:
                                isOverdue(
                                  charge
                                )
                                  ? COLORS.red
                                  : '#aaa',
                              fontSize:
                                11,
                            }}
                          >
                            {charge.due_date
                              ? dateBR(
                                  charge.due_date
                                )
                              : 'Sem vencimento'}
                          </td>

                          <td
                            style={{
                              padding:
                                '15px 14px',
                              borderBottom:
                                `1px solid ${COLORS.border}`,
                            }}
                          >
                            <span
                              style={{
                                display:
                                  'inline-flex',
                                alignItems:
                                  'center',
                                gap: 7,
                                color:
                                  status.color,
                                fontSize:
                                  11,
                                fontWeight:
                                  700,
                              }}
                            >
                              <span
                                style={{
                                  width:
                                    7,
                                  height:
                                    7,
                                  borderRadius:
                                    '50%',
                                  background:
                                    status.color,
                                }}
                              />

                              {
                                status.label
                              }
                            </span>
                          </td>

                          <td
                            style={{
                              padding:
                                '15px 14px',
                              borderBottom:
                                `1px solid ${COLORS.border}`,
                              textAlign:
                                'right',
                            }}
                          >
                            <button
                              onClick={(
                                event
                              ) => {
                                event.stopPropagation();
                                openCharge(
                                  charge
                                );
                              }}
                              style={{
                                width:
                                  31,
                                height:
                                  31,
                                border:
                                  `1px solid ${COLORS.border}`,
                                borderRadius:
                                  8,
                                background:
                                  '#141414',
                                color:
                                  '#999',
                                cursor:
                                  'pointer',
                              }}
                            >
                              •••
                            </button>
                          </td>
                        </tr>
                      );
                    }
                  )}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>

      {modal === 'new' && (
        <div
          className="charges-modal-backdrop"
          onMouseDown={(event) => {
            if (
              event.target ===
              event.currentTarget
            ) {
              setModal(null);
            }
          }}
        >
          <div className="charges-modal">
            <div
              style={{
                padding:
                  '21px 22px',
                borderBottom:
                  `1px solid ${COLORS.border}`,
                display: 'flex',
                justifyContent:
                  'space-between',
                alignItems:
                  'center',
              }}
            >
              <div>
                <div
                  style={{
                    color:
                      COLORS.red,
                    fontSize:
                      10,
                    fontWeight:
                      800,
                    letterSpacing:
                      '.12em',
                    textTransform:
                      'uppercase',
                  }}
                >
                  Central de Pagamentos
                </div>

                <div
                  style={{
                    marginTop:
                      5,
                    fontSize:
                      21,
                    fontWeight:
                      800,
                  }}
                >
                  Nova cobrança
                </div>
              </div>

              <button
                onClick={() =>
                  setModal(null)
                }
                style={{
                  width:
                    36,
                  height:
                    36,
                  borderRadius:
                    9,
                  border:
                    `1px solid ${COLORS.border}`,
                  background:
                    'transparent',
                  color:
                    '#aaa',
                  cursor:
                    'pointer',
                  display:
                    'flex',
                  alignItems:
                    'center',
                  justifyContent:
                    'center',
                }}
              >
                <Icon
                  name="close"
                  size={17}
                />
              </button>
            </div>

            <form
              onSubmit={
                createCharge
              }
            >
              <div
                style={{
                  padding:
                    22,
                  display:
                    'grid',
                  gap: 18,
                }}
              >
                {message && (
                  <div
                    style={{
                      padding:
                        '11px 13px',
                      borderRadius:
                        10,
                      background:
                        'rgba(239,43,53,.08)',
                      border:
                        '1px solid rgba(239,43,53,.25)',
                      color:
                        '#ffb0b5',
                      fontSize:
                        12,
                    }}
                  >
                    {message}
                  </div>
                )}

                <div
                  style={{
                    display:
                      'grid',
                    gridTemplateColumns:
                      '1fr 1fr',
                    gap: 14,
                  }}
                >
                  <Field
                    label="Marca / Projeto"
                    required
                  >
                    <Select
                      value={
                        form.brand_id
                      }
                      onChange={(
                        event
                      ) =>
                        setForm(
                          (
                            current
                          ) => ({
                            ...current,
                            brand_id:
                              event
                                .target
                                .value,
                          })
                        )
                      }
                    >
                      <option value="">
                        Selecione
                      </option>

                      {brands.map(
                        (brand) => (
                          <option
                            key={
                              brand.id
                            }
                            value={
                              brand.id
                            }
                          >
                            {brand.display_name ||
                              brand.name}
                          </option>
                        )
                      )}
                    </Select>
                  </Field>

                  <Field
                    label="Cliente"
                    required
                  >
                    <Select
                      value={
                        form.client_id
                      }
                      onChange={(
                        event
                      ) =>
                        setForm(
                          (
                            current
                          ) => ({
                            ...current,
                            client_id:
                              event
                                .target
                                .value,
                          })
                        )
                      }
                    >
                      <option value="">
                        Selecione o cliente
                      </option>

                      {clients.map(
                        (client) => (
                          <option
                            key={
                              client.id
                            }
                            value={
                              client.id
                            }
                          >
                            {client.name}
                          </option>
                        )
                      )}
                    </Select>
                  </Field>
                </div>

                <Field
                  label="Serviço / Título"
                  required
                >
                  <Input
                    value={
                      form.title
                    }
                    onChange={(
                      event
                    ) =>
                      setForm(
                        (
                          current
                        ) => ({
                          ...current,
                          title:
                            event
                              .target
                              .value,
                        })
                      )
                    }
                    placeholder="Ex.: Gestão de imagem"
                  />
                </Field>

                <Field label="Descrição">
                  <textarea
                    value={
                      form.description
                    }
                    onChange={(
                      event
                    ) =>
                      setForm(
                        (
                          current
                        ) => ({
                          ...current,
                          description:
                            event
                              .target
                              .value,
                        })
                      )
                    }
                    placeholder="Descreva o serviço ou o que está sendo cobrado."
                    rows={4}
                    style={{
                      width:
                        '100%',
                      padding:
                        13,
                      borderRadius:
                        10,
                      border:
                        `1px solid ${COLORS.border}`,
                      background:
                        '#0b0b0b',
                      color:
                        '#eee',
                      outline:
                        'none',
                      resize:
                        'vertical',
                      fontSize:
                        13,
                    }}
                  />
                </Field>

                <div
                  style={{
                    display:
                      'grid',
                    gridTemplateColumns:
                      '1fr 1fr',
                    gap: 14,
                  }}
                >
                  <Field
                    label="Valor"
                    required
                  >
                    <Input
                      value={
                        form.amount
                      }
                      onChange={(
                        event
                      ) =>
                        setForm(
                          (
                            current
                          ) => ({
                            ...current,
                            amount:
                              event
                                .target
                                .value,
                          })
                        )
                      }
                      inputMode="decimal"
                      placeholder="R$ 0,00"
                    />
                  </Field>

                  <Field label="Vencimento">
                    <Input
                      type="date"
                      value={
                        form.due_date
                      }
                      onChange={(
                        event
                      ) =>
                        setForm(
                          (
                            current
                          ) => ({
                            ...current,
                            due_date:
                              event
                                .target
                                .value,
                          })
                        )
                      }
                    />
                  </Field>
                </div>

                <div>
                  <div
                    style={{
                      fontSize:
                        12,
                      color:
                        '#aaa',
                      fontWeight:
                        700,
                      marginBottom:
                        9,
                    }}
                  >
                    Formas de pagamento
                  </div>

                  <div
                    style={{
                      display:
                        'grid',
                      gridTemplateColumns:
                        '1fr 1fr',
                      gap:
                        10,
                    }}
                  >
                    <div
                      className={`charge-option ${
                        form.pix_enabled
                          ? 'selected'
                          : ''
                      }`}
                      onClick={() =>
                        setForm(
                          (
                            current
                          ) => ({
                            ...current,
                            pix_enabled:
                              !current.pix_enabled,
                          })
                        )
                      }
                    >
                      <div
                        style={{
                          color:
                            '#20c7ad',
                          fontSize:
                            12,
                          fontWeight:
                            800,
                        }}
                      >
                        PIX
                      </div>

                      <div
                        style={{
                          marginTop:
                            4,
                          color:
                            '#777',
                          fontSize:
                            10,
                        }}
                      >
                        Pagamento instantâneo
                      </div>
                    </div>

                    <div
                      className={`charge-option ${
                        form.card_enabled
                          ? 'selected'
                          : ''
                      }`}
                      onClick={() =>
                        setForm(
                          (
                            current
                          ) => ({
                            ...current,
                            card_enabled:
                              !current.card_enabled,
                          })
                        )
                      }
                    >
                      <div
                        style={{
                          color:
                            '#ddd',
                          fontSize:
                            12,
                          fontWeight:
                            800,
                        }}
                      >
                        CARTÃO
                      </div>

                      <div
                        style={{
                          marginTop:
                            4,
                          color:
                            '#777',
                          fontSize:
                            10,
                        }}
                      >
                        Crédito com parcelamento
                      </div>
                    </div>
                  </div>
                </div>

                <div
                  style={{
                    display:
                      'grid',
                    gridTemplateColumns:
                      '1fr 1fr',
                    gap: 14,
                  }}
                >
                  <Field label="Parcelamento máximo">
                    <Select
                      value={
                        form.max_installments
                      }
                      onChange={(
                        event
                      ) =>
                        setForm(
                          (
                            current
                          ) => ({
                            ...current,
                            max_installments:
                              Number(
                                event
                                  .target
                                  .value
                              ),
                          })
                        )
                      }
                      disabled={
                        !form.card_enabled
                      }
                    >
                      {[
                        1, 2, 3,
                        4, 5, 6,
                        7, 8, 9,
                        10, 11, 12,
                      ].map(
                        (value) => (
                          <option
                            key={
                              value
                            }
                            value={
                              value
                            }
                          >
                            {value}x
                          </option>
                        )
                      )}
                    </Select>
                  </Field>

                  <Field label="Taxa do cartão">
                    <Select
                      value={
                        form.fee_payer
                      }
                      onChange={(
                        event
                      ) =>
                        setForm(
                          (
                            current
                          ) => ({
                            ...current,
                            fee_payer:
                              event
                                .target
                                .value,
                          })
                        )
                      }
                    >
                      <option value="merchant">
                        Empresa assume
                      </option>

                      <option value="customer">
                        Cliente assume
                      </option>
                    </Select>
                  </Field>
                </div>
              </div>

              <div
                style={{
                  padding:
                    '17px 22px',
                  borderTop:
                    `1px solid ${COLORS.border}`,
                  display:
                    'flex',
                  justifyContent:
                    'flex-end',
                  gap: 10,
                }}
              >
                <button
                  type="button"
                  onClick={() =>
                    setModal(null)
                  }
                  style={{
                    height:
                      42,
                    padding:
                      '0 15px',
                    borderRadius:
                      9,
                    border:
                      `1px solid ${COLORS.border}`,
                    background:
                      'transparent',
                    color:
                      '#aaa',
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
                  type="submit"
                  disabled={
                    saving
                  }
                  style={{
                    height:
                      42,
                    padding:
                      '0 18px',
                    borderRadius:
                      9,
                    border: 0,
                    background:
                      COLORS.red,
                    color:
                      '#fff',
                    cursor:
                      saving
                        ? 'wait'
                        : 'pointer',
                    fontSize:
                      12,
                    fontWeight:
                      800,
                    opacity:
                      saving
                        ? .65
                        : 1,
                  }}
                >
                  {saving
                    ? 'Gerando cobrança...'
                    : 'Gerar cobrança'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {modal === 'success' &&
        selectedCharge && (
          <div
            className="charges-modal-backdrop"
          >
            <div
              className="charges-modal"
              style={{
                width:
                  'min(540px,100%)',
              }}
            >
              <div
                style={{
                  padding:
                    28,
                  textAlign:
                    'center',
                }}
              >
                <div
                  style={{
                    width:
                      58,
                    height:
                      58,
                    margin:
                      '0 auto 15px',
                    borderRadius:
                      '50%',
                    background:
                      'rgba(34,197,94,.1)',
                    border:
                      `1px solid rgba(34,197,94,.25)`,
                    color:
                      COLORS.green,
                    display:
                      'flex',
                    alignItems:
                      'center',
                    justifyContent:
                      'center',
                    fontSize:
                      24,
                  }}
                >
                  ✓
                </div>

                <div
                  style={{
                    fontSize:
                      22,
                    fontWeight:
                      800,
                  }}
                >
                  Cobrança gerada
                </div>

                <div
                  style={{
                    marginTop:
                      7,
                    color:
                      '#777',
                    fontSize:
                      12,
                  }}
                >
                  O checkout da InfinitePay foi criado.
                </div>

                <div
                  style={{
                    marginTop:
                      24,
                    padding:
                      18,
                    border:
                      `1px solid ${COLORS.border}`,
                    borderRadius:
                      12,
                    textAlign:
                      'left',
                    background:
                      '#0b0b0b',
                  }}
                >
                  <div
                    style={{
                      color:
                        '#777',
                      fontSize:
                        11,
                    }}
                  >
                    {selectedCharge.reference_code}
                  </div>

                  <div
                    style={{
                      marginTop:
                        7,
                      fontSize:
                        15,
                      fontWeight:
                        700,
                    }}
                  >
                    {
                      selectedCharge.title
                    }
                  </div>

                  <div
                    style={{
                      marginTop:
                        7,
                      fontSize:
                        22,
                      fontWeight:
                        800,
                    }}
                  >
                    {money(
                      selectedCharge.amount
                    )}
                  </div>

                  <div
                    style={{
                      marginTop:
                        16,
                      color:
                        '#666',
                      fontSize:
                        10,
                    }}
                  >
                    LINK DE PAGAMENTO
                  </div>

                  <div
                    style={{
                      marginTop:
                        6,
                      padding:
                        10,
                      borderRadius:
                        8,
                      background:
                        '#111',
                      color:
                        '#aaa',
                      fontSize:
                        10,
                      wordBreak:
                        'break-all',
                    }}
                  >
                    {
                      selectedCharge.gateway_checkout_url
                    }
                  </div>
                </div>

                <div
                  style={{
                    display:
                      'grid',
                    gridTemplateColumns:
                      '1fr 1fr',
                    gap:
                      9,
                    marginTop:
                      18,
                  }}
                >
                  <button
                    onClick={() =>
                      copyLink(
                        selectedCharge
                      )
                    }
                    style={{
                      height:
                        42,
                      borderRadius:
                        9,
                      border:
                        `1px solid ${COLORS.border}`,
                      background:
                        '#151515',
                      color:
                        '#ddd',
                      cursor:
                        'pointer',
                      display:
                        'flex',
                      alignItems:
                        'center',
                      justifyContent:
                        'center',
                      gap:
                        7,
                      fontWeight:
                        700,
                      fontSize:
                        12,
                    }}
                  >
                    <Icon
                      name="copy"
                      size={16}
                    />
                    Copiar link
                  </button>

                  <button
                    onClick={() =>
                      window.open(
                        selectedCharge.gateway_checkout_url,
                        '_blank',
                        'noopener,noreferrer'
                      )
                    }
                    style={{
                      height:
                        42,
                      borderRadius:
                        9,
                      border: 0,
                      background:
                        COLORS.red,
                      color:
                        '#fff',
                      cursor:
                        'pointer',
                      display:
                        'flex',
                      alignItems:
                        'center',
                      justifyContent:
                        'center',
                      gap:
                        7,
                      fontWeight:
                        800,
                      fontSize:
                        12,
                    }}
                  >
                    <Icon
                      name="external"
                      size={16}
                    />
                    Abrir checkout
                  </button>
                </div>

                <button
                  onClick={() =>
                    shareWhatsApp(
                      selectedCharge
                    )
                  }
                  style={{
                    width:
                      '100%',
                    height:
                      42,
                    marginTop:
                      9,
                    borderRadius:
                      9,
                    border:
                      `1px solid rgba(34,197,94,.25)`,
                    background:
                      'rgba(34,197,94,.08)',
                    color:
                      COLORS.green,
                    cursor:
                      'pointer',
                    fontSize:
                      12,
                    fontWeight:
                      800,
                  }}
                >
                  Enviar pelo WhatsApp
                </button>
              </div>

              <div
                style={{
                  padding:
                    '14px 22px',
                  borderTop:
                    `1px solid ${COLORS.border}`,
                  textAlign:
                    'right',
                }}
              >
                <button
                  onClick={() =>
                    setModal(null)
                  }
                  style={{
                    height:
                      38,
                    padding:
                      '0 14px',
                    borderRadius:
                      8,
                    border:
                      `1px solid ${COLORS.border}`,
                    background:
                      'transparent',
                    color:
                      '#aaa',
                    cursor:
                      'pointer',
                    fontSize:
                      12,
                  }}
                >
                  Fechar
                </button>
              </div>
            </div>
          </div>
        )}

      {modal === 'details' &&
        selectedCharge && (
          <div
            className="charges-modal-backdrop"
            onMouseDown={(event) => {
              if (
                event.target ===
                event.currentTarget
              ) {
                setModal(null);
              }
            }}
          >
            <div
              className="charges-modal"
              style={{
                width:
                  'min(650px,100%)',
              }}
            >
              {(() => {
                const client =
                  clientMap[
                    selectedCharge
                      .client_id
                  ];

                const brand =
                  brandMap[
                    selectedCharge
                      .brand_id
                  ];

                const status =
                  getStatus(
                    selectedCharge
                  );

                return (
                  <>
                    <div
                      style={{
                        padding:
                          '21px 22px',
                        borderBottom:
                          `1px solid ${COLORS.border}`,
                        display:
                          'flex',
                        justifyContent:
                          'space-between',
                        alignItems:
                          'center',
                      }}
                    >
                      <div>
                        <div
                          style={{
                            color:
                              '#666',
                            fontSize:
                              10,
                          }}
                        >
                          {
                            selectedCharge.reference_code
                          }
                        </div>

                        <div
                          style={{
                            marginTop:
                              5,
                            fontSize:
                              21,
                            fontWeight:
                              800,
                          }}
                        >
                          Detalhes da cobrança
                        </div>
                      </div>

                      <button
                        onClick={() =>
                          setModal(
                            null
                          )
                        }
                        style={{
                          width:
                            36,
                          height:
                            36,
                          borderRadius:
                            9,
                          border:
                            `1px solid ${COLORS.border}`,
                          background:
                            'transparent',
                          color:
                            '#aaa',
                          cursor:
                            'pointer',
                        }}
                      >
                        <Icon
                          name="close"
                          size={17}
                        />
                      </button>
                    </div>

                    <div
                      style={{
                        padding:
                          22,
                        display:
                          'grid',
                        gap:
                          18,
                      }}
                    >
                      <div
                        style={{
                          display:
                            'grid',
                          gridTemplateColumns:
                            '1fr 1fr',
                          gap:
                            12,
                        }}
                      >
                        {[
                          [
                            'Cliente',
                            client?.name ||
                              'Não informado',
                          ],
                          [
                            'Marca',
                            brand?.display_name ||
                              brand?.name ||
                              'Não informada',
                          ],
                          [
                            'Serviço',
                            selectedCharge.title,
                          ],
                          [
                            'Valor',
                            money(
                              selectedCharge.amount
                            ),
                          ],
                          [
                            'Vencimento',
                            selectedCharge.due_date
                              ? dateBR(
                                  selectedCharge.due_date
                                )
                              : 'Sem vencimento',
                          ],
                          [
                            'Status',
                            status.label,
                          ],
                        ].map(
                          ([label, value]) => (
                            <div
                              key={
                                label
                              }
                              style={{
                                padding:
                                  14,
                                border:
                                  `1px solid ${COLORS.border}`,
                                borderRadius:
                                  10,
                              }}
                            >
                              <div
                                style={{
                                  color:
                                    '#666',
                                  fontSize:
                                    10,
                                  textTransform:
                                    'uppercase',
                                }}
                              >
                                {label}
                              </div>

                              <div
                                style={{
                                  marginTop:
                                    6,
                                  color:
                                    label ===
                                    'Status'
                                      ? status.color
                                      : '#eee',
                                  fontSize:
                                    13,
                                  fontWeight:
                                    700,
                                }}
                              >
                                {value}
                              </div>
                            </div>
                          )
                        )}
                      </div>

                      {selectedCharge.description && (
                        <div
                          style={{
                            padding:
                              14,
                            border:
                              `1px solid ${COLORS.border}`,
                            borderRadius:
                              10,
                          }}
                        >
                          <div
                            style={{
                              color:
                                '#666',
                              fontSize:
                                10,
                            }}
                          >
                            DESCRIÇÃO
                          </div>

                          <div
                            style={{
                              marginTop:
                                7,
                              color:
                                '#aaa',
                              fontSize:
                                12,
                              lineHeight:
                                1.6,
                            }}
                          >
                            {
                              selectedCharge.description
                            }
                          </div>
                        </div>
                      )}

                      <div
                        style={{
                          padding:
                            16,
                          border:
                            `1px solid ${COLORS.border}`,
                          borderRadius:
                            11,
                          background:
                            '#0b0b0b',
                        }}
                      >
                        <div
                          style={{
                            color:
                              '#666',
                            fontSize:
                              10,
                          }}
                        >
                          LINK DE PAGAMENTO
                        </div>

                        <div
                          style={{
                            marginTop:
                              7,
                            color:
                              selectedCharge.gateway_checkout_url
                                ? '#aaa'
                                : '#555',
                            fontSize:
                              11,
                            wordBreak:
                              'break-all',
                          }}
                        >
                          {selectedCharge.gateway_checkout_url ||
                            'Checkout ainda não gerado.'}
                        </div>

                        {selectedCharge.gateway_checkout_url && (
                          <div
                            style={{
                              display:
                                'flex',
                              gap:
                                8,
                              marginTop:
                                13,
                            }}
                          >
                            <button
                              onClick={() =>
                                copyLink(
                                  selectedCharge
                                )
                              }
                              style={{
                                height:
                                  38,
                                padding:
                                  '0 12px',
                                borderRadius:
                                  8,
                                border:
                                  `1px solid ${COLORS.border}`,
                                background:
                                  '#151515',
                                color:
                                  '#ddd',
                                cursor:
                                  'pointer',
                                display:
                                  'flex',
                                alignItems:
                                  'center',
                                gap:
                                  7,
                                fontSize:
                                  11,
                                fontWeight:
                                  700,
                              }}
                            >
                              <Icon
                                name="copy"
                                size={15}
                              />
                              Copiar
                            </button>

                            <button
                              onClick={() =>
                                window.open(
                                  selectedCharge.gateway_checkout_url,
                                  '_blank',
                                  'noopener,noreferrer'
                                )
                              }
                              style={{
                                height:
                                  38,
                                padding:
                                  '0 12px',
                                borderRadius:
                                  8,
                                border: 0,
                                background:
                                  COLORS.red,
                                color:
                                  '#fff',
                                cursor:
                                  'pointer',
                                display:
                                  'flex',
                                alignItems:
                                  'center',
                                gap:
                                  7,
                                fontSize:
                                  11,
                                fontWeight:
                                  800,
                              }}
                            >
                              <Icon
                                name="external"
                                size={15}
                              />
                              Abrir
                            </button>

                            <button
                              onClick={() =>
                                shareWhatsApp(
                                  selectedCharge
                                )
                              }
                              style={{
                                height:
                                  38,
                                padding:
                                  '0 12px',
                                borderRadius:
                                  8,
                                border:
                                  `1px solid rgba(34,197,94,.25)`,
                                background:
                                  'rgba(34,197,94,.08)',
                                color:
                                  COLORS.green,
                                cursor:
                                  'pointer',
                                fontSize:
                                  11,
                                fontWeight:
                                  800,
                              }}
                            >
                              WhatsApp
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    <div
                      style={{
                        padding:
                          '14px 22px',
                        borderTop:
                          `1px solid ${COLORS.border}`,
                        display:
                          'flex',
                        justifyContent:
                          'space-between',
                        gap:
                          9,
                      }}
                    >
                      <div>
                        {!isPaid(
                          selectedCharge
                        ) &&
                          !isCancelled(
                            selectedCharge
                          ) && (
                            <button
                              onClick={() =>
                                cancelCharge(
                                  selectedCharge
                                )
                              }
                              disabled={
                                saving
                              }
                              style={{
                                height:
                                  38,
                                padding:
                                  '0 12px',
                                borderRadius:
                                  8,
                                border:
                                  `1px solid rgba(239,43,53,.25)`,
                                background:
                                  'rgba(239,43,53,.06)',
                                color:
                                  '#ff8b92',
                                cursor:
                                  'pointer',
                                fontSize:
                                  11,
                                fontWeight:
                                  700,
                              }}
                            >
                              Cancelar cobrança
                            </button>
                          )}
                      </div>

                      <button
                        onClick={() =>
                          setModal(
                            null
                          )
                        }
                        style={{
                          height:
                            38,
                          padding:
                            '0 14px',
                          borderRadius:
                            8,
                          border:
                            `1px solid ${COLORS.border}`,
                          background:
                            'transparent',
                          color:
                            '#aaa',
                          cursor:
                            'pointer',
                          fontSize:
                            11,
                          fontWeight:
                            700,
                        }}
                      >
                        Fechar
                      </button>
                    </div>
                  </>
                );
              })()}
            </div>
          </div>
        )}
    </div>
  );
}

export default Charges;