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
};

const formatCurrency = (value) =>
  new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(Number(value || 0));

const formatDate = (value) => {
  if (!value) return '—';

  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(value));
};

const formatDateTime = (value) => {
  if (!value) return '—';

  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value));
};

const normalize = (value) =>
  String(value || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

const isPaidPayment = (payment) => {
  const status = normalize(payment?.status);

  return [
    'paid',
    'pago',
    'approved',
    'aprovado',
    'completed',
    'complete',
    'succeeded',
    'success',
    'confirmed',
    'confirmado',
    'captured',
    'capturado',
  ].includes(status);
};

const isPaidCharge = (charge) => {
  const status = normalize(charge?.status);

  return [
    'paid',
    'pago',
    'approved',
    'aprovado',
    'completed',
    'complete',
    'succeeded',
    'success',
    'confirmed',
    'confirmado',
    'captured',
    'capturado',
  ].includes(status);
};

const getChargeStatus = (charge) => {
  const status = normalize(charge?.status);

  if ([
    'paid',
    'pago',
    'approved',
    'aprovado',
    'completed',
    'complete',
    'succeeded',
    'success',
    'confirmed',
    'confirmado',
    'captured',
    'capturado',
  ].includes(status)) {
    return {
      label: 'Pago',
      color: COLORS.green,
      background: 'rgba(34,197,94,.10)',
    };
  }

  if ([
    'cancelled',
    'canceled',
    'cancelado',
    'expired',
    'expirada',
    'expirado',
  ].includes(status)) {
    return {
      label: 'Cancelado',
      color: COLORS.red,
      background: 'rgba(239,43,53,.10)',
    };
  }

  if ([
    'overdue',
    'atrasado',
    'late',
  ].includes(status)) {
    return {
      label: 'Atrasado',
      color: COLORS.red,
      background: 'rgba(239,43,53,.10)',
    };
  }

  return {
    label: 'Pendente',
    color: COLORS.yellow,
    background: 'rgba(245,158,11,.10)',
  };
};

const getPaymentMethod = (payment) => {
  const method = normalize(payment?.payment_method);

  if (method.includes('pix')) return 'PIX';

  if (
    method.includes('credit') ||
    method.includes('credito') ||
    method.includes('card') ||
    method.includes('cartao') ||
    method.includes('cartão')
  ) {
    return 'Cartão';
  }

  if (method.includes('debit') || method.includes('debito')) {
    return 'Débito';
  }

  if (!method) return 'Não informado';

  return String(payment.payment_method)
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
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

    refresh: (
      <>
        <path d="M20 11a8.1 8.1 0 0 0-14.8-4L3 10" />
        <path d="M3 4v6h6" />
        <path d="M4 13a8.1 8.1 0 0 0 14.8 4L21 14" />
        <path d="M21 20v-6h-6" />
      </>
    ),

    wallet: (
      <>
        <path d="M3 7.5A2.5 2.5 0 0 1 5.5 5H20v14H5.5A2.5 2.5 0 0 1 3 16.5z" />
        <path d="M3 8h14" />
        <path d="M17 11h5v5h-5a2.5 2.5 0 0 1 0-5Z" />
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

  return <svg {...props}>{icons[name] || icons.info}</svg>;
}

function MetricCard({
  title,
  value,
  description,
  icon,
  accent = COLORS.red,
}) {
  return (
    <div
      style={{
        position: 'relative',
        minHeight: 145,
        padding: 22,
        borderRadius: 16,
        border: `1px solid ${COLORS.border}`,
        background:
          'linear-gradient(145deg,rgba(255,255,255,.045),rgba(255,255,255,.018))',
        boxShadow: '0 18px 45px rgba(0,0,0,.18)',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: '0 auto 0 0',
          width: 3,
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
              color: '#c7c7c7',
              fontSize: 14,
              fontWeight: 600,
            }}
          >
            {title}
          </div>

          <div
            style={{
              marginTop: 12,
              fontSize: 29,
              fontWeight: 800,
              letterSpacing: '-.03em',
            }}
          >
            {value}
          </div>
        </div>

        <div
          style={{
            width: 42,
            height: 42,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 12,
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
          left: 22,
          bottom: 18,
          color: '#777',
          fontSize: 12,
        }}
      >
        {description}
      </div>
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

function AdminDashboard() {
  const [user, setUser] = useState(null);
  const [charges, setCharges] = useState([]);
  const [payments, setPayments] = useState([]);
  const [clients, setClients] = useState([]);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  const [period, setPeriod] = useState('month');
  const [mobileOpen, setMobileOpen] = useState(false);

  const loadDashboard = useCallback(async () => {
    setError('');
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

      const [chargesResponse, paymentsResponse, clientsResponse] =
        await Promise.all([
          supabase
            .from('charges')
            .select(
              `
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
              `
            )
            .eq('owner_id', ownerId)
            .order('created_at', { ascending: false }),

          supabase
            .from('payments')
            .select(
              `
                id,
                owner_id,
                charge_id,
                gateway,
                gateway_transaction_id,
                gateway_order_id,
                gateway_invoice_id,
                amount,
                fee_amount,
                net_amount,
                payment_method,
                installments,
                status,
                paid_at,
                created_at,
                updated_at
              `
            )
            .eq('owner_id', ownerId)
            .order('created_at', { ascending: false }),

          supabase
            .from('clients')
            .select(
              `
                id,
                owner_id,
                brand_id,
                name,
                document,
                email,
                phone,
                notes,
                is_active,
                created_at,
                updated_at
              `
            )
            .eq('owner_id', ownerId)
            .order('created_at', { ascending: false }),
        ]);

      if (chargesResponse.error) {
        throw chargesResponse.error;
      }

      if (paymentsResponse.error) {
        throw paymentsResponse.error;
      }

      if (clientsResponse.error) {
        throw clientsResponse.error;
      }

      setCharges(chargesResponse.data || []);
      setPayments(paymentsResponse.data || []);
      setClients(clientsResponse.data || []);
    } catch (err) {
      console.error('Erro ao carregar dashboard:', err);

      setError(
        err?.message ||
          'Não foi possível carregar os dados do dashboard.'
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  const clientMap = useMemo(() => {
    return Object.fromEntries(
      clients.map((client) => [client.id, client])
    );
  }, [clients]);

  const rangeStart = useMemo(() => {
    const now = new Date();

    if (period === 'today') {
      now.setHours(0, 0, 0, 0);
      return now;
    }

    if (period === '7d') {
      now.setHours(0, 0, 0, 0);
      now.setDate(now.getDate() - 6);
      return now;
    }

    if (period === 'month') {
      now.setHours(0, 0, 0, 0);
      now.setDate(1);
      return now;
    }

    now.setHours(0, 0, 0, 0);
    now.setMonth(0, 1);

    return now;
  }, [period]);

  const filteredCharges = useMemo(() => {
    return charges.filter((charge) => {
      if (!charge.created_at) return false;

      return new Date(charge.created_at) >= rangeStart;
    });
  }, [charges, rangeStart]);

  const filteredPayments = useMemo(() => {
    return payments.filter((payment) => {
      if (!isPaidPayment(payment)) return false;
      if (!payment.paid_at) return false;

      return new Date(payment.paid_at) >= rangeStart;
    });
  }, [payments, rangeStart]);

  const billing = useMemo(() => {
    return filteredCharges.reduce(
      (total, charge) => total + Number(charge.amount || 0),
      0
    );
  }, [filteredCharges]);

  const received = useMemo(() => {
    return filteredPayments.reduce(
      (total, payment) => total + Number(payment.amount || 0),
      0
    );
  }, [filteredPayments]);

  const fees = useMemo(() => {
    return filteredPayments.reduce(
      (total, payment) => total + Number(payment.fee_amount || 0),
      0
    );
  }, [filteredPayments]);

  const net = useMemo(() => {
    return filteredPayments.reduce((total, payment) => {
      const amount = Number(payment.amount || 0);
      const fee = Number(payment.fee_amount || 0);

      const paymentNet =
        payment.net_amount !== null &&
        payment.net_amount !== undefined
          ? Number(payment.net_amount)
          : amount - fee;

      return total + paymentNet;
    }, 0);
  }, [filteredPayments]);

  const pending = useMemo(() => {
    const paidChargeIds = new Set(
      payments
        .filter(isPaidPayment)
        .map((payment) => payment.charge_id)
        .filter(Boolean)
    );

    return filteredCharges.reduce((total, charge) => {
      if (isPaidCharge(charge)) {
        return total;
      }

      if (paidChargeIds.has(charge.id)) {
        return total;
      }

      const status = normalize(charge.status);

      if (
        [
          'cancelled',
          'canceled',
          'cancelado',
          'expired',
          'expirada',
          'expirado',
        ].includes(status)
      ) {
        return total;
      }

      return total + Number(charge.amount || 0);
    }, 0);
  }, [filteredCharges, payments]);

  const paymentMethods = useMemo(() => {
    const result = {};

    filteredPayments.forEach((payment) => {
      const method = getPaymentMethod(payment);

      if (!result[method]) {
        result[method] = {
          count: 0,
          amount: 0,
        };
      }

      result[method].count += 1;
      result[method].amount += Number(payment.amount || 0);
    });

    return Object.entries(result)
      .sort((a, b) => b[1].amount - a[1].amount)
      .map(([name, values]) => ({
        name,
        ...values,
      }));
  }, [filteredPayments]);

  const chart = useMemo(() => {
    const now = new Date();

    let numberOfDays = 7;

    if (period === 'today') {
      numberOfDays = 1;
    }

    if (period === '7d') {
      numberOfDays = 7;
    }

    if (period === 'month') {
      numberOfDays = now.getDate();
    }

    if (period === 'year') {
      numberOfDays = 12;
    }

    const days = [];

    if (period === 'year') {
      for (let i = 11; i >= 0; i -= 1) {
        const current = new Date(
          now.getFullYear(),
          now.getMonth() - i,
          1
        );

        const next = new Date(
          current.getFullYear(),
          current.getMonth() + 1,
          1
        );

        const value = filteredPayments
          .filter((payment) => {
            const paidAt = new Date(payment.paid_at);

            return paidAt >= current && paidAt < next;
          })
          .reduce(
            (total, payment) => total + Number(payment.amount || 0),
            0
          );

        days.push({
          label: current.toLocaleDateString('pt-BR', {
            month: 'short',
          }),
          value,
        });
      }

      return days;
    }

    for (let i = numberOfDays - 1; i >= 0; i -= 1) {
      const current = new Date(now);
      current.setHours(0, 0, 0, 0);
      current.setDate(current.getDate() - i);

      const next = new Date(current);
      next.setDate(next.getDate() + 1);

      const value = filteredPayments
        .filter((payment) => {
          const paidAt = new Date(payment.paid_at);

          return paidAt >= current && paidAt < next;
        })
        .reduce(
          (total, payment) => total + Number(payment.amount || 0),
          0
        );

      days.push({
        label: current.toLocaleDateString('pt-BR', {
          day: '2-digit',
          month: '2-digit',
        }),
        value,
      });
    }

    return days;
  }, [filteredPayments, period]);

  const maxChartValue = Math.max(
    ...chart.map((item) => item.value),
    1
  );

  const recentCharges = filteredCharges.slice(0, 6);

  const styles = `
    * {
      box-sizing: border-box;
    }

    body {
      margin: 0;
    }

    .cp-nav {
      transition: transform .2s ease;
    }

    .cp-row:hover {
      background: rgba(255,255,255,.025);
    }

    .cp-mobile {
      display: none !important;
    }

    @media (max-width: 1000px) {
      .cp-nav {
        transform: translateX(-100%);
        position: fixed !important;
        z-index: 30;
      }

      .cp-nav.open {
        transform: translateX(0);
      }

      .cp-main {
        margin-left: 0 !important;
      }

      .cp-mobile {
        display: flex !important;
      }

      .cp-grid {
        grid-template-columns: repeat(2, 1fr) !important;
      }

      .cp-wide {
        grid-template-columns: 1fr !important;
      }
    }

    @media (max-width: 620px) {
      .cp-grid {
        grid-template-columns: 1fr !important;
      }

      .cp-main {
        padding: 72px 18px 40px !important;
      }

      .cp-header {
        align-items: flex-start !important;
      }

      .cp-title {
        font-size: 25px !important;
      }

      .cp-user {
        display: none !important;
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
        Carregando Central de Pagamentos...
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
        className="cp-mobile"
        onClick={() => setMobileOpen((value) => !value)}
        style={{
          position: 'fixed',
          top: 15,
          left: 15,
          zIndex: 40,
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
        className={`cp-nav ${mobileOpen ? 'open' : ''}`}
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
  ['dashboard', 'Dashboard'],
  ['charges', 'Cobranças'],
  ['clients', 'Clientes'],
  ['payments', 'Pagamentos'],
  ['chart', 'Faturamento'],
  ['wallet', 'Gestão Financeira'],
  ['receipt', 'Comprovantes'],
  ['tag', 'Marcas / Projetos'],
  ['reports', 'Relatórios'],
  ['settings', 'Configurações'],
].map(([icon, label], index) => (
          <div
            key={label}
            onClick={() => {
              if (index === 0) {
                setMobileOpen(false);
              }
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: '11px 12px',
              borderRadius: 10,
              marginBottom: 4,
              color:
                index === 0 ? COLORS.white : '#888',
              background:
                index === 0
                  ? 'rgba(239,43,53,.12)'
                  : 'transparent',
              cursor: 'pointer',
              fontSize: 13,
              fontWeight: index === 0 ? 700 : 500,
            }}
          >
            <Icon name={icon} size={18} />
            {label}
          </div>
        ))}

        <div
          style={{
            marginTop: 'auto',
            paddingTop: 20,
            borderTop: `1px solid ${COLORS.border}`,
          }}
        >
          <div
            className="cp-user"
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
              window.location.href = '/pagamentos/admin';
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
            <Icon name="logout" size={17} />
            Sair
          </button>
        </div>
      </aside>

      <main
        className="cp-main"
        style={{
          marginLeft: 245,
          padding: '30px 34px 50px',
          maxWidth: 1500,
        }}
      >
        <header
          className="cp-header"
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 30,
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
              className="cp-title"
              style={{
                fontSize: 30,
                margin: '7px 0 0',
                letterSpacing: '-.04em',
              }}
            >
              Visão geral
            </h1>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
            }}
          >
            <select
              value={period}
              onChange={(event) =>
                setPeriod(event.target.value)
              }
              style={{
                height: 40,
                padding: '0 12px',
                borderRadius: 10,
                border: `1px solid ${COLORS.border}`,
                background: COLORS.panel,
                color: '#ddd',
                outline: 'none',
              }}
            >
              <option value="today">Hoje</option>
              <option value="7d">Últimos 7 dias</option>
              <option value="month">Este mês</option>
              <option value="year">Este ano</option>
            </select>

            <button
              onClick={loadDashboard}
              disabled={refreshing}
              title="Atualizar dados"
              style={{
                width: 40,
                height: 40,
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
                opacity: refreshing ? 0.5 : 1,
              }}
            >
              <Icon name="refresh" size={18} />
            </button>

            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 12,
                background: COLORS.red,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
              }}
            >
              LS
            </div>
          </div>
        </header>

        {error && (
          <div
            style={{
              padding: 14,
              marginBottom: 20,
              borderRadius: 12,
              border:
                '1px solid rgba(239,43,53,.35)',
              background:
                'rgba(239,43,53,.08)',
              color: '#ff9da3',
              fontSize: 13,
            }}
          >
            Não foi possível carregar os dados:{' '}
            {error}
          </div>
        )}

        <section
          className="cp-grid"
          style={{
            display: 'grid',
            gridTemplateColumns:
              'repeat(4, 1fr)',
            gap: 14,
            marginBottom: 18,
          }}
        >
          <MetricCard
            title="Faturamento"
            value={formatCurrency(billing)}
            description="Cobranças criadas no período"
            icon="chart"
          />

          <MetricCard
            title="Recebido"
            value={formatCurrency(received)}
            description="Pagamentos confirmados"
            icon="wallet"
            accent={COLORS.green}
          />

          <MetricCard
            title="A receber"
            value={formatCurrency(pending)}
            description="Cobranças ainda pendentes"
            icon="charges"
            accent={COLORS.yellow}
          />

          <MetricCard
            title="Cobranças"
            value={filteredCharges.length}
            description="Criadas no período"
            icon="receipt"
          />
        </section>

        <section
          className="cp-wide"
          style={{
            display: 'grid',
            gridTemplateColumns:
              'minmax(0, 2fr) minmax(300px, 1fr)',
            gap: 18,
            marginBottom: 18,
          }}
        >
          <div
            style={{
              background: COLORS.panel,
              border: `1px solid ${COLORS.border}`,
              borderRadius: 16,
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
                    fontSize: 17,
                    margin: 0,
                  }}
                >
                  Receita recebida
                </h2>

                <div
                  style={{
                    fontSize: 12,
                    color: '#666',
                    marginTop: 5,
                  }}
                >
                  Pagamentos confirmados no período
                </div>
              </div>

              <strong
                style={{
                  fontSize: 20,
                }}
              >
                {formatCurrency(received)}
              </strong>
            </div>

            {chart.every(
              (item) => item.value === 0
            ) ? (
              <EmptyState>
                Sem movimentações no período.
              </EmptyState>
            ) : (
              <>
                <div
                  style={{
                    height: 250,
                    display: 'flex',
                    alignItems: 'flex-end',
                    gap: 6,
                    borderBottom: `1px solid ${COLORS.border}`,
                    padding: '15px 0 0',
                  }}
                >
                  {chart.map((item, index) => (
                    <div
                      key={`${item.label}-${index}`}
                      title={`${item.label} · ${formatCurrency(
                        item.value
                      )}`}
                      style={{
                        flex: 1,
                        height: '100%',
                        display: 'flex',
                        alignItems: 'flex-end',
                        minWidth: 2,
                      }}
                    >
                      <div
                        style={{
                          width: '100%',
                          height: `${Math.max(
                            3,
                            (item.value /
                              maxChartValue) *
                              100
                          )}%`,
                          background:
                            COLORS.red,
                          borderRadius:
                            '5px 5px 0 0',
                          opacity: 0.9,
                        }}
                      />
                    </div>
                  ))}
                </div>

                <div
                  style={{
                    display: 'flex',
                    justifyContent:
                      'space-between',
                    color: '#555',
                    fontSize: 10,
                    marginTop: 8,
                  }}
                >
                  <span>{chart[0]?.label}</span>
                  <span>
                    {chart[chart.length - 1]?.label}
                  </span>
                </div>
              </>
            )}
          </div>

          <div
            style={{
              background: COLORS.panel,
              border: `1px solid ${COLORS.border}`,
              borderRadius: 16,
              padding: 22,
            }}
          >
            <h2
              style={{
                fontSize: 17,
                margin: '0 0 20px',
              }}
            >
              Resumo financeiro
            </h2>

            {[
              ['Faturamento bruto', billing],
              ['Recebido', received],
              ['A receber', pending],
              ['Taxas InfinitePay', fees],
              ['Líquido recebido', net],
            ].map(([label, value], index) => (
              <div
                key={label}
                style={{
                  display: 'flex',
                  justifyContent:
                    'space-between',
                  padding: '12px 0',
                  borderBottom:
                    index === 4
                      ? 'none'
                      : `1px solid ${COLORS.border}`,
                  fontSize: 13,
                }}
              >
                <span
                  style={{
                    color: '#777',
                  }}
                >
                  {label}
                </span>

                <strong>
                  {formatCurrency(value)}
                </strong>
              </div>
            ))}
          </div>
        </section>

        <section
          className="cp-wide"
          style={{
            display: 'grid',
            gridTemplateColumns:
              'minmax(0, 2fr) minmax(300px, 1fr)',
            gap: 18,
          }}
        >
          <div
            style={{
              background: COLORS.panel,
              border: `1px solid ${COLORS.border}`,
              borderRadius: 16,
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
                    fontSize: 17,
                    margin: 0,
                  }}
                >
                  Últimas cobranças
                </h2>

                <div
                  style={{
                    fontSize: 12,
                    color: '#666',
                    marginTop: 5,
                  }}
                >
                  Dados reais do sistema
                </div>
              </div>

              <span
                style={{
                  fontSize: 12,
                  color: '#666',
                }}
              >
                {filteredCharges.length}{' '}
                no período
              </span>
            </div>

            {recentCharges.length === 0 ? (
              <EmptyState>
                Nenhuma cobrança criada ainda.
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
                    borderCollapse:
                      'collapse',
                    minWidth: 650,
                  }}
                >
                  <thead>
                    <tr
                      style={{
                        color: '#555',
                        fontSize: 10,
                        textTransform:
                          'uppercase',
                        letterSpacing: '.08em',
                        textAlign: 'left',
                      }}
                    >
                      {[
                        'Cliente',
                        'Cobrança',
                        'Valor',
                        'Status',
                        'Data',
                      ].map((heading) => (
                        <th
                          key={heading}
                          style={{
                            padding:
                              '10px 8px',
                            borderBottom: `1px solid ${COLORS.border}`,
                          }}
                        >
                          {heading}
                        </th>
                      ))}
                    </tr>
                  </thead>

                  <tbody>
                    {recentCharges.map(
                      (charge) => {
                        const client =
                          clientMap[
                            charge.client_id
                          ];

                        const status =
                          getChargeStatus(
                            charge
                          );

                        return (
                          <tr
                            className="cp-row"
                            key={charge.id}
                          >
                            <td
                              style={{
                                padding:
                                  '13px 8px',
                                borderBottom: `1px solid ${COLORS.border}`,
                                fontSize: 13,
                              }}
                            >
                              {client?.name ||
                                'Cliente não informado'}
                            </td>

                            <td
                              style={{
                                padding:
                                  '13px 8px',
                                borderBottom: `1px solid ${COLORS.border}`,
                                fontSize: 13,
                              }}
                            >
                              <div>
                                {charge.title ||
                                  'Cobrança'}
                              </div>

                              <small
                                style={{
                                  color:
                                    '#555',
                                }}
                              >
                                {
                                  charge.reference_code
                                }
                              </small>
                            </td>

                            <td
                              style={{
                                padding:
                                  '13px 8px',
                                borderBottom: `1px solid ${COLORS.border}`,
                                fontWeight: 700,
                              }}
                            >
                              {formatCurrency(
                                charge.amount
                              )}
                            </td>

                            <td
                              style={{
                                padding:
                                  '13px 8px',
                                borderBottom: `1px solid ${COLORS.border}`,
                              }}
                            >
                              <span
                                style={{
                                  padding:
                                    '5px 8px',
                                  borderRadius:
                                    20,
                                  fontSize: 11,
                                  background:
                                    status.background,
                                  color:
                                    status.color,
                                }}
                              >
                                {
                                  status.label
                                }
                              </span>
                            </td>

                            <td
                              style={{
                                padding:
                                  '13px 8px',
                                borderBottom: `1px solid ${COLORS.border}`,
                                color:
                                  '#777',
                                fontSize: 12,
                              }}
                            >
                              {formatDateTime(
                                charge.created_at
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
          </div>

          <div
            style={{
              background: COLORS.panel,
              border: `1px solid ${COLORS.border}`,
              borderRadius: 16,
              padding: 22,
            }}
          >
            <h2
              style={{
                fontSize: 17,
                margin: '0 0 18px',
              }}
            >
              Meios de pagamento
            </h2>

            {paymentMethods.length === 0 ? (
              <EmptyState>
                Nenhum pagamento confirmado.
              </EmptyState>
            ) : (
              <div>
                {paymentMethods.map(
                  (method) => {
                    const percentage =
                      received > 0
                        ? (method.amount /
                            received) *
                          100
                        : 0;

                    return (
                      <div
                        key={method.name}
                        style={{
                          marginBottom: 18,
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
                            marginBottom: 7,
                          }}
                        >
                          <span
                            style={{
                              fontSize: 13,
                              color:
                                '#bbb',
                            }}
                          >
                            {method.name}
                          </span>

                          <strong
                            style={{
                              fontSize: 13,
                            }}
                          >
                            {formatCurrency(
                              method.amount
                            )}
                          </strong>
                        </div>

                        <div
                          style={{
                            height: 7,
                            borderRadius: 20,
                            background:
                              '#1c1c1c',
                            overflow:
                              'hidden',
                          }}
                        >
                          <div
                            style={{
                              width: `${percentage}%`,
                              height: '100%',
                              background:
                                COLORS.red,
                              borderRadius:
                                20,
                            }}
                          />
                        </div>

                        <div
                          style={{
                            marginTop: 5,
                            fontSize: 10,
                            color:
                              '#555',
                          }}
                        >
                          {method.count}{' '}
                          pagamento
                          {method.count !== 1
                            ? 's'
                            : ''}{' '}
                          ·{' '}
                          {percentage.toFixed(
                            1
                          )}
                          %
                        </div>
                      </div>
                    );
                  }
                )}

                <div
                  style={{
                    marginTop: 24,
                    paddingTop: 18,
                    borderTop: `1px solid ${COLORS.border}`,
                    fontSize: 12,
                    color: '#777',
                  }}
                >
                  Taxas registradas:{' '}
                  <strong
                    style={{
                      color: '#ddd',
                    }}
                  >
                    {formatCurrency(fees)}
                  </strong>
                </div>
              </div>
            )}
          </div>
        </section>

        <section
          style={{
            marginTop: 18,
            display: 'grid',
            gridTemplateColumns:
              'repeat(3, 1fr)',
            gap: 14,
          }}
        >
          <div
            style={{
              padding: 18,
              background: COLORS.panel,
              border: `1px solid ${COLORS.border}`,
              borderRadius: 16,
            }}
          >
            <div
              style={{
                color: '#666',
                fontSize: 11,
                textTransform:
                  'uppercase',
                letterSpacing: '.08em',
              }}
            >
              Clientes
            </div>

            <strong
              style={{
                display: 'block',
                marginTop: 8,
                fontSize: 25,
              }}
            >
              {clients.length}
            </strong>

            <div
              style={{
                marginTop: 5,
                color: '#555',
                fontSize: 11,
              }}
            >
              clientes cadastrados
            </div>
          </div>

          <div
            style={{
              padding: 18,
              background: COLORS.panel,
              border: `1px solid ${COLORS.border}`,
              borderRadius: 16,
            }}
          >
            <div
              style={{
                color: '#666',
                fontSize: 11,
                textTransform:
                  'uppercase',
                letterSpacing: '.08em',
              }}
            >
              Pagamentos
            </div>

            <strong
              style={{
                display: 'block',
                marginTop: 8,
                fontSize: 25,
              }}
            >
              {filteredPayments.length}
            </strong>

            <div
              style={{
                marginTop: 5,
                color: '#555',
                fontSize: 11,
              }}
            >
              confirmados no período
            </div>
          </div>

          <div
            style={{
              padding: 18,
              background: COLORS.panel,
              border: `1px solid ${COLORS.border}`,
              borderRadius: 16,
            }}
          >
            <div
              style={{
                color: '#666',
                fontSize: 11,
                textTransform:
                  'uppercase',
                letterSpacing: '.08em',
              }}
            >
              Líquido
            </div>

            <strong
              style={{
                display: 'block',
                marginTop: 8,
                fontSize: 25,
              }}
            >
              {formatCurrency(net)}
            </strong>

            <div
              style={{
                marginTop: 5,
                color: '#555',
                fontSize: 11,
              }}
            >
              após taxas registradas
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default AdminDashboard;