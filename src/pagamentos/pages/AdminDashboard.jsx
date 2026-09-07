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
  panel2: '#141414',
  border: 'rgba(255,255,255,.09)',
  borderStrong: 'rgba(255,255,255,.14)',
  white: '#ffffff',
  text: '#eaeaea',
  muted: '#858585',
  muted2: '#555555',
  red: '#ef2b35',
  redSoft: 'rgba(239,43,53,.12)',
  green: '#22c55e',
  yellow: '#f59e0b',
  blue: '#3b82f6',
  cyan: '#22d3ee',
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

const formatTime = (value) => {
  if (!value) return '—';

  return new Intl.DateTimeFormat('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value));
};

const formatDateTime = (value) => {
  if (!value) return '—';

  const date = new Date(value);
  const now = new Date();

  const sameDay =
    date.toDateString() === now.toDateString();

  if (sameDay) {
    return `Hoje ${formatTime(value)}`;
  }

  const yesterday = new Date(now);
  yesterday.setDate(
    yesterday.getDate() - 1
  );

  if (
    date.toDateString() ===
    yesterday.toDateString()
  ) {
    return `Ontem ${formatTime(value)}`;
  }

  return formatDate(value);
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

  if (isPaidCharge(charge)) {
    return {
      label: 'Pago',
      color: COLORS.green,
      dot: COLORS.green,
    };
  }

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
    return {
      label: 'Cancelado',
      color: COLORS.red,
      dot: COLORS.red,
    };
  }

  if (
    [
      'overdue',
      'atrasado',
      'late',
    ].includes(status)
  ) {
    return {
      label: 'Atrasado',
      color: COLORS.red,
      dot: COLORS.red,
    };
  }

  return {
    label: 'Pendente',
    color: COLORS.red,
    dot: COLORS.red,
  };
};

const getPaymentMethod = (payment) => {
  const method = normalize(
    payment?.payment_method
  );

  if (method.includes('pix')) {
    return 'PIX';
  }

  if (
    method.includes('credit') ||
    method.includes('credito') ||
    method.includes('card') ||
    method.includes('cartao') ||
    method.includes('cartão')
  ) {
    return 'Cartão de crédito';
  }

  if (
    method.includes('debit') ||
    method.includes('debito')
  ) {
    return 'Cartão de débito';
  }

  if (method.includes('boleto')) {
    return 'Boleto';
  }

  return 'Outros';
};

function Icon({
  name,
  size = 20,
  strokeWidth = 1.8,
}) {
  const props = {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
  };

  const icons = {
    dashboard: (
      <>
        <rect
          x="3"
          y="3"
          width="7"
          height="7"
          rx="1"
        />
        <rect
          x="14"
          y="3"
          width="7"
          height="7"
          rx="1"
        />
        <rect
          x="3"
          y="14"
          width="7"
          height="7"
          rx="1"
        />
        <rect
          x="14"
          y="14"
          width="7"
          height="7"
          rx="1"
        />
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
        <circle
          cx="9"
          cy="7"
          r="4"
        />
        <path d="M2 21a7 7 0 0 1 14 0" />
        <path d="M16 11a4 4 0 1 0 0-8" />
        <path d="M17 14a6 6 0 0 1 5 6" />
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
        <circle
          cx="16.5"
          cy="7.5"
          r="1"
        />
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
        <circle
          cx="12"
          cy="12"
          r="3"
        />
        <path d="M19.4 15a1.7 1.7 0 0 0 .34 1.88l.06.06-1.7 1.7-.06-.06a1.7 1.7 0 0 0-1.88-.34 1.7 1.7 0 0 0-1.03 1.56V20h-2.4v-.2a1.7 1.7 0 0 0-1.03-1.56 1.7 1.7 0 0 0-1.88.34l-.06.06-1.7-1.7.06-.06A1.7 1.7 0 0 0 8.4 15a1.7 1.7 0 0 0-1.56-1.03H6v-2.4h.84A1.7 1.7 0 0 0 8.4 10a1.7 1.7 0 0 0-.34-1.88L8 8.06l1.7-1.7.06.06a1.7 1.7 0 0 0 1.88.34 1.7 1.7 0 0 0 1.03-1.56V5h2.4v.2a1.7 1.7 0 0 0 1.03 1.56 1.7 1.7 0 0 0 1.88-.34l.06-.06 1.7 1.7-.06.06A1.7 1.7 0 0 0 19.4 10a1.7 1.7 0 0 0 1.56 1.03h.84v2.4h-.84A1.7 1.7 0 0 0 19.4 15Z" />
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

    bell: (
      <>
        <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
        <path d="M10 21h4" />
      </>
    ),

    clock: (
      <>
        <circle
          cx="12"
          cy="12"
          r="9"
        />
        <path d="M12 7v5l3 2" />
      </>
    ),

    wallet: (
      <>
        <path d="M3 7.5A2.5 2.5 0 0 1 5.5 5H20v14H5.5A2.5 2.5 0 0 1 3 16.5z" />
        <path d="M3 8h14" />
        <path d="M17 11h5v5h-5a2.5 2.5 0 0 1 0-5Z" />
      </>
    ),

    info: (
      <>
        <circle
          cx="12"
          cy="12"
          r="9"
        />
        <path d="M12 11v5" />
        <path d="M12 8h.01" />
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

    more: (
      <>
        <circle
          cx="5"
          cy="12"
          r="1"
          fill="currentColor"
          stroke="none"
        />
        <circle
          cx="12"
          cy="12"
          r="1"
          fill="currentColor"
          stroke="none"
        />
        <circle
          cx="19"
          cy="12"
          r="1"
          fill="currentColor"
          stroke="none"
        />
      </>
    ),

    arrowUp: (
      <>
        <path d="M12 19V5" />
        <path d="m5 12 7-7 7 7" />
      </>
    ),

    arrowRight: (
      <>
        <path d="M5 12h14" />
        <path d="m13 6 6 6-6 6" />
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

  return (
    <svg {...props}>
      {icons[name]}
    </svg>
  );
}

function MetricCard({
  title,
  value,
  helper,
  icon,
  accent,
  footer,
}) {
  return (
    <div
      className="metric-card"
      style={{
        position: 'relative',
        padding: 20,
        minHeight: 143,
        borderRadius: 14,
        border: `1px solid ${COLORS.border}`,
        background:
          'linear-gradient(145deg, rgba(255,255,255,.025), rgba(255,255,255,.012))',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          bottom: 0,
          width: 2,
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
              gap: 7,
              color: '#d6d6d6',
              fontSize: 14,
              fontWeight: 600,
            }}
          >
            {title}

            <span
              style={{
                color: '#666',
                display: 'inline-flex',
              }}
            >
              <Icon
                name="info"
                size={13}
              />
            </span>
          </div>

          <div
            style={{
              marginTop: 10,
              fontSize: 30,
              fontWeight: 800,
              letterSpacing: '-.04em',
              color: COLORS.white,
            }}
          >
            {value}
          </div>
        </div>

        <div
          style={{
            width: 47,
            height: 47,
            borderRadius: 11,
            border: `1px solid ${accent}45`,
            background: `${accent}10`,
            color: accent,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Icon
            name={icon}
            size={25}
          />
        </div>
      </div>

      <div
        style={{
          marginTop: 14,
          minHeight: 20,
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          fontSize: 12,
        }}
      >
        {footer ? (
          footer
        ) : (
          <span
            style={{
              color: '#666',
            }}
          >
            {helper}
          </span>
        )}
      </div>
    </div>
  );
}

function EmptyBlock({
  children,
  minHeight = 180,
}) {
  return (
    <div
      style={{
        minHeight,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: `1px dashed ${COLORS.border}`,
        borderRadius: 11,
        color: '#666',
        fontSize: 13,
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

  const [period, setPeriod] = useState('today');
  const [mobileOpen, setMobileOpen] = useState(false);

  const loadDashboard = useCallback(
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
          paymentsResponse,
          clientsResponse,
        ] = await Promise.all([
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
            .eq(
              'owner_id',
              ownerId
            )
            .order(
              'created_at',
              {
                ascending: false,
              }
            ),

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
            .eq(
              'owner_id',
              ownerId
            )
            .order(
              'created_at',
              {
                ascending: false,
              }
            ),

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
            .eq(
              'owner_id',
              ownerId
            )
            .order(
              'created_at',
              {
                ascending: false,
              }
            ),
        ]);

        /*
         * Não mostramos erro vermelho na interface.
         * Cada módulo recebe [] caso o banco esteja
         * temporariamente bloqueando aquela tabela.
         */
        setCharges(
          chargesResponse.error
            ? []
            : chargesResponse.data || []
        );

        setPayments(
          paymentsResponse.error
            ? []
            : paymentsResponse.data || []
        );

        setClients(
          clientsResponse.error
            ? []
            : clientsResponse.data || []
        );

        if (
          chargesResponse.error ||
          paymentsResponse.error ||
          clientsResponse.error
        ) {
          console.error(
            'Erro ao carregar dados da Central:',
            {
              charges:
                chargesResponse.error,
              payments:
                paymentsResponse.error,
              clients:
                clientsResponse.error,
            }
          );
        }
      } catch (error) {
        console.error(
          'Erro ao carregar Dashboard:',
          error
        );

        setCharges([]);
        setPayments([]);
        setClients([]);
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    []
  );

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  const now = useMemo(
    () => new Date(),
    [charges.length, payments.length]
  );

  const rangeStart = useMemo(() => {
    const start = new Date(now);

    start.setHours(0, 0, 0, 0);

    if (period === 'today') {
      return start;
    }

    if (period === '7d') {
      start.setDate(
        start.getDate() - 6
      );
      return start;
    }

    if (period === '30d') {
      start.setDate(
        start.getDate() - 29
      );
      return start;
    }

    if (period === 'month') {
      start.setDate(1);
      return start;
    }

    if (period === '3m') {
      start.setMonth(
        start.getMonth() - 2,
        1
      );
      return start;
    }

    return start;
  }, [now, period]);

  const filteredCharges = useMemo(() => {
    return charges.filter((charge) => {
      if (!charge.created_at) {
        return false;
      }

      return (
        new Date(charge.created_at) >=
        rangeStart
      );
    });
  }, [charges, rangeStart]);

  const filteredPaidPayments =
    useMemo(() => {
      return payments.filter(
        (payment) => {
          if (!isPaidPayment(payment)) {
            return false;
          }

          if (!payment.paid_at) {
            return false;
          }

          return (
            new Date(payment.paid_at) >=
            rangeStart
          );
        }
      );
    }, [payments, rangeStart]);

  const billing = useMemo(() => {
    return filteredCharges.reduce(
      (total, charge) =>
        total +
        Number(charge.amount || 0),
      0
    );
  }, [filteredCharges]);

  const received = useMemo(() => {
    return filteredPaidPayments.reduce(
      (total, payment) =>
        total +
        Number(payment.amount || 0),
      0
    );
  }, [filteredPaidPayments]);

  const fees = useMemo(() => {
    return filteredPaidPayments.reduce(
      (total, payment) =>
        total +
        Number(
          payment.fee_amount || 0
        ),
      0
    );
  }, [filteredPaidPayments]);

  const net = useMemo(() => {
    return filteredPaidPayments.reduce(
      (total, payment) => {
        const amount = Number(
          payment.amount || 0
        );

        const fee = Number(
          payment.fee_amount || 0
        );

        const netValue =
          payment.net_amount !== null &&
          payment.net_amount !== undefined
            ? Number(
                payment.net_amount
              )
            : amount - fee;

        return total + netValue;
      },
      0
    );
  }, [filteredPaidPayments]);

  const paidChargeIds = useMemo(() => {
    return new Set(
      payments
        .filter(isPaidPayment)
        .map(
          (payment) =>
            payment.charge_id
        )
        .filter(Boolean)
    );
  }, [payments]);

  const pendingCharges = useMemo(() => {
    return filteredCharges.filter(
      (charge) => {
        if (isPaidCharge(charge)) {
          return false;
        }

        if (
          paidChargeIds.has(
            charge.id
          )
        ) {
          return false;
        }

        const status = normalize(
          charge.status
        );

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
          return false;
        }

        return true;
      }
    );
  }, [
    filteredCharges,
    paidChargeIds,
  ]);

  const pendingAmount = useMemo(
    () =>
      pendingCharges.reduce(
        (total, charge) =>
          total +
          Number(
            charge.amount || 0
          ),
        0
      ),
    [pendingCharges]
  );

  const paidChargesCount = useMemo(
    () =>
      filteredCharges.filter(
        (charge) =>
          isPaidCharge(charge) ||
          paidChargeIds.has(
            charge.id
          )
      ).length,
    [
      filteredCharges,
      paidChargeIds,
    ]
  );

  const activeClients =
    useMemo(
      () =>
        clients.filter(
          (client) =>
            client.is_active !== false
        ).length,
      [clients]
    );

  const newClientsThisPeriod =
    useMemo(() => {
      return clients.filter(
        (client) => {
          if (!client.created_at) {
            return false;
          }

          return (
            new Date(
              client.created_at
            ) >= rangeStart
          );
        }
      ).length;
    }, [clients, rangeStart]);

  const paymentMethods = useMemo(() => {
    const map = {};

    filteredPaidPayments.forEach(
      (payment) => {
        const name =
          getPaymentMethod(payment);

        if (!map[name]) {
          map[name] = {
            amount: 0,
            count: 0,
          };
        }

        map[name].amount += Number(
          payment.amount || 0
        );

        map[name].count += 1;
      }
    );

    const list = Object.entries(map)
      .map(
        ([name, values]) => ({
          name,
          ...values,
        })
      )
      .sort(
        (a, b) =>
          b.amount - a.amount
      );

    return list;
  }, [filteredPaidPayments]);

  const maxPaymentMethod =
    Math.max(
      ...paymentMethods.map(
        (item) => item.amount
      ),
      1
    );

  const chart = useMemo(() => {
    const points = [];

    let days = 7;

    if (period === 'today') {
      days = 7;
    }

    if (period === '7d') {
      days = 7;
    }

    if (period === '30d') {
      days = 14;
    }

    if (period === 'month') {
      days = Math.min(
        now.getDate(),
        31
      );
    }

    if (period === '3m') {
      days = 12;
    }

    if (period === '3m') {
      for (
        let i = 11;
        i >= 0;
        i -= 1
      ) {
        const monthStart =
          new Date(
            now.getFullYear(),
            now.getMonth() -
              i,
            1
          );

        const monthEnd =
          new Date(
            now.getFullYear(),
            now.getMonth() -
              i +
              1,
            1
          );

        const value =
          payments
            .filter(
              (payment) => {
                if (
                  !isPaidPayment(
                    payment
                  ) ||
                  !payment.paid_at
                ) {
                  return false;
                }

                const paidAt =
                  new Date(
                    payment.paid_at
                  );

                return (
                  paidAt >=
                    monthStart &&
                  paidAt <
                    monthEnd
                );
              }
            )
            .reduce(
              (total, payment) =>
                total +
                Number(
                  payment.amount ||
                    0
                ),
              0
            );

        points.push({
          label:
            monthStart.toLocaleDateString(
              'pt-BR',
              {
                month: 'short',
              }
            ),
          value,
        });
      }

      return points;
    }

    for (
      let i = days - 1;
      i >= 0;
      i -= 1
    ) {
      const current =
        new Date(now);

      current.setHours(
        0,
        0,
        0,
        0
      );

      current.setDate(
        current.getDate() -
          i
      );

      const next =
        new Date(current);

      next.setDate(
        next.getDate() + 1
      );

      const value =
        payments
          .filter(
            (payment) => {
              if (
                !isPaidPayment(
                  payment
                ) ||
                !payment.paid_at
              ) {
                return false;
              }

              const paidAt =
                new Date(
                  payment.paid_at
                );

              return (
                paidAt >= current &&
                paidAt < next
              );
            }
          )
          .reduce(
            (total, payment) =>
              total +
              Number(
                payment.amount ||
                  0
              ),
            0
          );

      points.push({
        label:
          current.toLocaleDateString(
            'pt-BR',
            {
              day: '2-digit',
              month: '2-digit',
            }
          ),
        value,
      });
    }

    return points;
  }, [
    now,
    payments,
    period,
  ]);

  const maxChartValue =
    Math.max(
      ...chart.map(
        (item) => item.value
      ),
      1
    );

  const clientMap = useMemo(
    () =>
      Object.fromEntries(
        clients.map(
          (client) => [
            client.id,
            client,
          ]
        )
      ),
    [clients]
  );

  const recentCharges =
    useMemo(() => {
      return [
        ...filteredCharges,
      ]
        .sort(
          (a, b) =>
            new Date(
              b.created_at
            ) -
            new Date(
              a.created_at
            )
        )
        .slice(0, 6);
    }, [filteredCharges]);

  const getGrowthFooter = (
    currentValue
  ) => {
    if (!currentValue) {
      return (
        <span
          style={{
            color: '#666',
          }}
        >
          Sem movimentações no período
        </span>
      );
    }

    return (
      <span
        style={{
          color: COLORS.green,
          display: 'flex',
          alignItems: 'center',
          gap: 5,
          fontWeight: 700,
        }}
      >
        <Icon
          name="arrowUp"
          size={13}
        />
        Dados reais
        <span
          style={{
            color: '#666',
            fontWeight: 400,
          }}
        >
          do sistema
        </span>
      </span>
    );
  };

  const navigate = (path) => {
    setMobileOpen(false);

    if (
      path !==
      window.location.pathname
    ) {
      window.location.href =
        path;
    }
  };

  const menuItems = [
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
    select {
      font: inherit;
    }

    .cp-page {
      min-height: 100vh;
      background:
        radial-gradient(
          circle at 76% 10%,
          rgba(239,43,53,.045),
          transparent 27%
        ),
        #070707;
      color: #fff;
    }

    .cp-sidebar {
      transition: transform .22s ease;
    }

    .cp-main {
      transition: padding .2s ease;
    }

    .cp-nav-item {
      transition:
        background .18s ease,
        color .18s ease,
        transform .18s ease;
    }

    .cp-nav-item:hover {
      background: rgba(255,255,255,.035) !important;
      color: #eee !important;
    }

    .cp-nav-item.active:hover {
      background: rgba(239,43,53,.12) !important;
    }

    .metric-card {
      transition:
        transform .18s ease,
        border-color .18s ease;
    }

    .metric-card:hover {
      transform: translateY(-1px);
      border-color: rgba(255,255,255,.15) !important;
    }

    .cp-row {
      transition: background .15s ease;
    }

    .cp-row:hover {
      background: rgba(255,255,255,.025);
    }

    .cp-period-button {
      border: 0;
      background: transparent;
      color: #b2b2b2;
      padding: 11px 18px;
      cursor: pointer;
      font-size: 12px;
      white-space: nowrap;
      transition:
        background .18s ease,
        color .18s ease;
    }

    .cp-period-button:hover {
      color: #fff;
    }

    .cp-period-button.active {
      background: #ef2b35;
      color: #fff;
      border-radius: 9px;
      box-shadow: 0 7px 20px rgba(239,43,53,.2);
    }

    .cp-table {
      width: 100%;
      border-collapse: collapse;
    }

    .cp-tooltip {
      opacity: 0;
      transform: translateY(4px);
      pointer-events: none;
      transition: .16s ease;
    }

    .cp-chart-point:hover .cp-tooltip {
      opacity: 1;
      transform: translateY(0);
    }

    .cp-mobile-button {
      display: none !important;
    }

    @media (max-width: 1150px) {
      .cp-sidebar {
        transform: translateX(-100%);
        z-index: 100;
        box-shadow: 20px 0 50px rgba(0,0,0,.45);
      }

      .cp-sidebar.open {
        transform: translateX(0);
      }

      .cp-main {
        margin-left: 0 !important;
        padding-left: 20px !important;
        padding-right: 20px !important;
      }

      .cp-mobile-button {
        display: flex !important;
      }

      .cp-grid-4 {
        grid-template-columns: repeat(2, minmax(0,1fr)) !important;
      }

      .cp-grid-main {
        grid-template-columns: 1fr !important;
      }

      .cp-right-column {
        grid-template-columns: repeat(2,minmax(0,1fr)) !important;
      }
    }

    @media (max-width: 760px) {
      .cp-topbar {
        align-items: flex-start !important;
        flex-direction: column !important;
      }

      .cp-user-area {
        width: 100%;
        justify-content: space-between !important;
      }

      .cp-header-row {
        align-items: flex-start !important;
        flex-direction: column !important;
      }

      .cp-periods {
        width: 100%;
        overflow-x: auto;
      }

      .cp-period-button {
        flex: 0 0 auto;
      }

      .cp-grid-4 {
        grid-template-columns: 1fr !important;
      }

      .cp-right-column {
        grid-template-columns: 1fr !important;
      }

      .cp-table {
        min-width: 680px;
      }

      .cp-main-title {
        font-size: 28px !important;
      }

      .cp-brand-name {
        display: none !important;
      }
    }

    @media (max-width: 520px) {
      .cp-main {
        padding: 78px 14px 30px !important;
      }

      .cp-period-button {
        padding: 10px 14px;
      }

      .cp-card {
        padding: 18px !important;
      }

      .cp-page-title {
        font-size: 24px !important;
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
          fontFamily:
            'Inter, Arial, sans-serif',
        }}
      >
        <div
          style={{
            textAlign: 'center',
          }}
        >
          <div
            style={{
              width: 42,
              height: 42,
              borderRadius: 12,
              background:
                COLORS.redSoft,
              border:
                `1px solid ${COLORS.red}40`,
              color:
                COLORS.red,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 14px',
            }}
          >
            LS
          </div>

          <div
            style={{
              color: '#aaa',
              fontSize: 14,
            }}
          >
            Carregando Central de Pagamentos...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cp-page">
      <style>
        {styles}
      </style>

      <button
        className="cp-mobile-button"
        onClick={() =>
          setMobileOpen(
            (value) => !value
          )
        }
        aria-label="Abrir menu"
        style={{
          position: 'fixed',
          top: 16,
          left: 16,
          zIndex: 120,
          width: 44,
          height: 44,
          borderRadius: 12,
          background:
            'rgba(10,10,10,.94)',
          border:
            `1px solid ${COLORS.borderStrong}`,
          color: '#fff',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          backdropFilter:
            'blur(10px)',
        }}
      >
        <Icon
          name="menu"
          size={20}
        />
      </button>

      <aside
        className={`cp-sidebar ${
          mobileOpen ? 'open' : ''
        }`}
        style={{
          position: 'fixed',
          inset: '0 auto 0 0',
          width: 258,
          background:
            'linear-gradient(180deg,#080808 0%,#090909 100%)',
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
            marginBottom: 21,
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
                width: 42,
                height: 48,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: COLORS.red,
                fontSize: 33,
                fontWeight: 800,
                lineHeight: 1,
              }}
            >
              ♛
            </div>

            <div>
              <div
                style={{
                  color: '#f3f3f3',
                  fontSize: 20,
                  fontWeight: 800,
                  letterSpacing: '-.05em',
                }}
              >
                LÉO SOUZA
              </div>

              <div
                style={{
                  fontSize: 11,
                  letterSpacing:
                    '.21em',
                  color: '#bbb',
                  marginTop: 4,
                }}
              >
                DESIGNER
              </div>
            </div>
          </div>

          <div
            style={{
              marginTop: 14,
              color: '#777',
              fontSize: 9,
              letterSpacing:
                '.16em',
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

        <nav>
          {menuItems.map(
            ([icon, label, path]) => {
              const active =
                path ===
                '/pagamentos/admin/dashboard';

              return (
                <div
                  key={path}
                  className={`cp-nav-item ${
                    active ? 'active' : ''
                  }`}
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
                    cursor:
                      'pointer',
                    color: active
                      ? '#fff'
                      : '#aaa',
                    background:
                      active
                        ? 'rgba(239,43,53,.12)'
                        : 'transparent',
                    fontSize: 14,
                    fontWeight:
                      active
                        ? 700
                        : 500,
                    borderLeft:
                      active
                        ? `2px solid ${COLORS.red}`
                        : '2px solid transparent',
                  }}
                >
                  <span
                    style={{
                      color: active
                        ? COLORS.red
                        : '#a0a0a0',
                      display: 'inline-flex',
                    }}
                  >
                    <Icon
                      name={icon}
                      size={19}
                    />
                  </span>

                  <span>
                    {label}
                  </span>
                </div>
              );
            }
          )}
        </nav>

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
              background: 'none',
              border: 0,
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
        className="cp-main"
        style={{
          marginLeft: 258,
          padding:
            '28px 30px 50px',
          maxWidth: 1600,
        }}
      >
        <div
          className="cp-topbar"
          style={{
            display: 'flex',
            justifyContent:
              'space-between',
            alignItems: 'center',
            gap: 20,
            paddingBottom: 23,
            borderBottom:
              `1px solid ${COLORS.border}`,
          }}
        >
          <div>
            <div
              style={{
                color: '#f4f4f4',
                fontSize: 29,
                fontWeight: 800,
                letterSpacing:
                  '-.045em',
              }}
            >
              Central de Pagamentos
            </div>

            <div
              style={{
                color: '#777',
                fontSize: 11,
                letterSpacing:
                  '.18em',
                marginTop: 7,
              }}
            >
              CONTROLE. EVOLUÇÃO. RESULTADOS.
            </div>
          </div>

          <div
            className="cp-user-area"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
            }}
          >
            <button
              style={{
                height: 44,
                padding:
                  '0 14px',
                display: 'flex',
                alignItems: 'center',
                gap: 11,
                borderRadius: 10,
                border:
                  `1px solid ${COLORS.border}`,
                background:
                  'rgba(255,255,255,.015)',
                color: '#ddd',
                cursor: 'default',
              }}
            >
              <Icon
                name="calendar"
                size={17}
              />

              <span>
                Hoje,{' '}
                {new Intl.DateTimeFormat(
                  'pt-BR',
                  {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                  }
                ).format(now)}
              </span>

              <span
                style={{
                  color: '#666',
                  fontSize: 10,
                }}
              >
                ▾
              </span>
            </button>

            <div
              style={{
                width: 45,
                height: 45,
                borderRadius: 12,
                border:
                  `1px solid ${COLORS.border}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position:
                  'relative',
                color: '#bbb',
              }}
            >
              <Icon
                name="bell"
                size={19}
              />

              <div
                style={{
                  position: 'absolute',
                  top: 4,
                  right: 5,
                  minWidth: 16,
                  height: 16,
                  padding: '0 4px',
                  borderRadius: 50,
                  background:
                    COLORS.red,
                  color: '#fff',
                  fontSize: 9,
                  display: 'flex',
                  alignItems:
                    'center',
                  justifyContent:
                    'center',
                  fontWeight: 800,
                }}
              >
                0
              </div>
            </div>

            <div
              style={{
                width: 1,
                height: 34,
                background:
                  COLORS.border,
              }}
            />

            <div
              style={{
                display: 'flex',
                alignItems:
                  'center',
                gap: 10,
                minWidth: 140,
              }}
            >
              <div
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: 50,
                  background:
                    'linear-gradient(145deg,#5a5a5a,#1e1e1e)',
                  border:
                    `1px solid ${COLORS.border}`,
                  display: 'flex',
                  alignItems:
                    'center',
                  justifyContent:
                    'center',
                  color: '#fff',
                  fontSize: 14,
                  fontWeight: 800,
                }}
              >
                LS
              </div>

              <div
                className="cp-brand-name"
              >
                <div
                  style={{
                    fontSize: 13,
                    fontWeight: 700,
                    color: '#eee',
                  }}
                >
                  Léo Souza
                </div>

                <div
                  style={{
                    fontSize: 10,
                    color: '#777',
                    marginTop: 2,
                  }}
                >
                  Administrador
                </div>
              </div>
            </div>
          </div>
        </div>

        <section
          className="cp-header-row"
          style={{
            marginTop: 20,
            display: 'flex',
            justifyContent:
              'space-between',
            alignItems: 'flex-end',
            gap: 20,
          }}
        >
          <div>
            <div
              style={{
                display: 'flex',
                alignItems:
                  'center',
                gap: 10,
              }}
            >
              <h1
                className="cp-page-title"
                style={{
                  margin: 0,
                  fontSize: 30,
                  fontWeight: 800,
                  letterSpacing:
                    '-.045em',
                }}
              >
                Bem-vindo, Léo!
              </h1>
            </div>

            <div
              style={{
                marginTop: 7,
                color: '#777',
                fontSize: 13,
              }}
            >
              Aqui está o resumo financeiro da sua operação.
            </div>
          </div>

          <div
            className="cp-periods"
            style={{
              display: 'flex',
              alignItems:
                'center',
              padding: 3,
              border:
                `1px solid ${COLORS.border}`,
              borderRadius: 10,
              background:
                'rgba(255,255,255,.012)',
            }}
          >
            {[
              ['today', 'Hoje'],
              ['7d', '7 dias'],
              ['30d', '30 dias'],
              ['month', 'Este mês'],
              [
                '3m',
                'Últimos 3 meses',
              ],
              [
                'custom',
                'Personalizado',
              ],
            ].map(
              ([value, label]) => (
                <button
                  key={value}
                  className={`cp-period-button ${
                    period === value
                      ? 'active'
                      : ''
                  }`}
                  onClick={() =>
                    setPeriod(value)
                  }
                >
                  {label}
                </button>
              )
            )}
          </div>
        </section>

        <section
          className="cp-grid-4"
          style={{
            display: 'grid',
            gridTemplateColumns:
              'repeat(4,minmax(0,1fr))',
            gap: 14,
            marginTop: 22,
          }}
        >
          <MetricCard
            title="Faturamento"
            value={formatCurrency(
              billing
            )}
            helper="Cobranças no período"
            icon="chart"
            accent={COLORS.red}
            footer={getGrowthFooter(
              billing
            )}
          />

          <MetricCard
            title="Recebido"
            value={formatCurrency(
              received
            )}
            helper="Pagamentos confirmados"
            icon="wallet"
            accent={COLORS.green}
            footer={
              received > 0 ? (
                <span
                  style={{
                    color:
                      COLORS.green,
                    display: 'flex',
                    alignItems:
                      'center',
                    gap: 5,
                    fontWeight: 700,
                  }}
                >
                  <Icon
                    name="arrowUp"
                    size={13}
                  />
                  Recebimentos confirmados
                </span>
              ) : (
                <span
                  style={{
                    color: '#666',
                  }}
                >
                  Nenhum pagamento confirmado
                </span>
              )
            }
          />

          <MetricCard
            title="A Receber"
            value={formatCurrency(
              pendingAmount
            )}
            helper="Cobranças pendentes"
            icon="clock"
            accent={COLORS.red}
            footer={
              <span
                style={{
                  color:
                    pendingAmount >
                    0
                      ? COLORS.red
                      : '#666',
                  display: 'flex',
                  alignItems:
                    'center',
                  gap: 6,
                }}
              >
                <Icon
                  name="clock"
                  size={13}
                />
                {pendingCharges.length}{' '}
                cobranças pendentes
              </span>
            }
          />

          <MetricCard
            title="Cobranças"
            value={
              filteredCharges.length
            }
            helper="Criadas no período"
            icon="receipt"
            accent={COLORS.red}
            footer={
              <span
                style={{
                  color: '#aaa',
                }}
              >
                <strong
                  style={{
                    color:
                      COLORS.green,
                  }}
                >
                  {paidChargesCount}
                </strong>{' '}
                pagas
                <span
                  style={{
                    color:
                      '#555',
                    margin:
                      '0 6px',
                  }}
                >
                  |
                </span>
                <strong
                  style={{
                    color:
                      COLORS.red,
                  }}
                >
                  {
                    pendingCharges.length
                  }
                </strong>{' '}
                pendentes
              </span>
            }
          />
        </section>

        <section
          className="cp-grid-main"
          style={{
            display: 'grid',
            gridTemplateColumns:
              'minmax(0,2fr) minmax(360px,1fr)',
            gap: 18,
            marginTop: 18,
          }}
        >
          <div
            className="cp-card"
            style={{
              background:
                COLORS.panel,
              border:
                `1px solid ${COLORS.border}`,
              borderRadius: 14,
              padding: 21,
              minWidth: 0,
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent:
                  'space-between',
                alignItems: 'center',
                marginBottom: 18,
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: 18,
                    fontWeight: 800,
                  }}
                >
                  Faturamento por dia{' '}
                  <span
                    style={{
                      color: '#666',
                      verticalAlign:
                        'middle',
                    }}
                  >
                    <Icon
                      name="info"
                      size={13}
                    />
                  </span>
                </div>

                <div
                  style={{
                    marginTop: 5,
                    color: '#666',
                    fontSize: 11,
                  }}
                >
                  Visão do valor efetivamente recebido
                </div>
              </div>

              <button
                style={{
                  height: 37,
                  padding:
                    '0 11px',
                  borderRadius: 9,
                  border:
                    `1px solid ${COLORS.border}`,
                  background:
                    COLORS.panel2,
                  color: '#ccc',
                  display: 'flex',
                  alignItems:
                    'center',
                  gap: 8,
                }}
              >
                {period === 'today'
                  ? 'Últimos 7 dias'
                  : period === '3m'
                  ? 'Últimos 3 meses'
                  : period === 'month'
                  ? 'Este mês'
                  : 'Período selecionado'}
                <span
                  style={{
                    color:
                      '#666',
                  }}
                >
                  ▾
                </span>
              </button>
            </div>

            {chart.length === 0 ||
            chart.every(
              (item) =>
                item.value === 0
            ) ? (
              <EmptyBlock minHeight={280}>
                Ainda não existem recebimentos para exibir.
              </EmptyBlock>
            ) : (
              <div
                style={{
                  position:
                    'relative',
                  height: 290,
                  padding:
                    '10px 20px 35px 55px',
                }}
              >
                <div
                  style={{
                    position:
                      'absolute',
                    left: 55,
                    right: 20,
                    top: 10,
                    bottom: 35,
                    display:
                      'flex',
                    flexDirection:
                      'column',
                    justifyContent:
                      'space-between',
                  }}
                >
                  {[4, 3, 2, 1, 0].map(
                    (line) => (
                      <div
                        key={line}
                        style={{
                          borderTop:
                            `1px solid ${COLORS.border}`,
                          width:
                            '100%',
                        }}
                      />
                    )
                  )}
                </div>

                <div
                  style={{
                    position:
                      'absolute',
                    left: 8,
                    top: 0,
                    bottom: 25,
                    width: 39,
                    display:
                      'flex',
                    flexDirection:
                      'column',
                    justifyContent:
                      'space-between',
                    color: '#666',
                    fontSize: 10,
                  }}
                >
                  {[4, 3, 2, 1, 0].map(
                    (line) => {
                      const max =
                        maxChartValue;

                      const value =
                        Math.round(
                          (max *
                            line) /
                            4
                        );

                      return (
                        <span
                          key={line}
                        >
                          {formatCurrency(
                            value
                          ).replace(
                            ',00',
                            ''
                          )}
                        </span>
                      );
                    }
                  )}
                </div>

                <div
                  style={{
                    position:
                      'absolute',
                    left: 55,
                    right: 20,
                    top: 10,
                    bottom: 35,
                    display:
                      'flex',
                    alignItems:
                      'flex-end',
                    gap: 4,
                  }}
                >
                  {chart.map(
                    (
                      point,
                      index
                    ) => {
                      const height =
                        point.value ===
                        0
                          ? 2
                          : Math.max(
                              4,
                              (point.value /
                                maxChartValue) *
                                100
                            );

                      return (
                        <div
                          key={`${point.label}-${index}`}
                          className="cp-chart-point"
                          style={{
                            flex: 1,
                            minWidth:
                              5,
                            height:
                              '100%',
                            position:
                              'relative',
                            display:
                              'flex',
                            alignItems:
                              'flex-end',
                          }}
                        >
                          <div
                            style={{
                              width:
                                '100%',
                              height: `${height}%`,
                              background:
                                `linear-gradient(180deg, ${COLORS.red} 0%, rgba(239,43,53,.42) 100%)`,
                              borderRadius:
                                '4px 4px 0 0',
                              boxShadow:
                                point.value >
                                0
                                  ? '0 0 20px rgba(239,43,53,.14)'
                                  : 'none',
                              minHeight:
                                2,
                            }}
                          />

                          <div
                            className="cp-tooltip"
                            style={{
                              position:
                                'absolute',
                              bottom:
                                `calc(${height}% + 10px)`,
                              left:
                                '50%',
                              transform:
                                'translateX(-50%)',
                              background:
                                '#171717',
                              border:
                                `1px solid ${COLORS.borderStrong}`,
                              borderRadius:
                                9,
                              padding:
                                '8px 10px',
                              whiteSpace:
                                'nowrap',
                              zIndex: 4,
                              boxShadow:
                                '0 15px 40px rgba(0,0,0,.4)',
                            }}
                          >
                            <div
                              style={{
                                color:
                                  '#777',
                                fontSize:
                                  10,
                              }}
                            >
                              {
                                point.label
                              }
                            </div>

                            <strong
                              style={{
                                display:
                                  'block',
                                marginTop:
                                  3,
                                fontSize:
                                  12,
                                color:
                                  '#fff',
                              }}
                            >
                              {formatCurrency(
                                point.value
                              )}
                            </strong>
                          </div>
                        </div>
                      );
                    }
                  )}
                </div>

                <div
                  style={{
                    position:
                      'absolute',
                    left: 55,
                    right: 20,
                    bottom: 6,
                    display:
                      'flex',
                    justifyContent:
                      'space-between',
                    color: '#666',
                    fontSize: 10,
                  }}
                >
                  <span>
                    {
                      chart[0]
                        ?.label
                    }
                  </span>

                  <span>
                    {
                      chart[
                        Math.floor(
                          chart.length /
                            2
                        )
                      ]?.label
                    }
                  </span>

                  <span>
                    {
                      chart[
                        chart.length - 1
                      ]?.label
                    }
                  </span>
                </div>
              </div>
            )}
          </div>

          <div
            className="cp-card"
            style={{
              background:
                COLORS.panel,
              border:
                `1px solid ${COLORS.border}`,
              borderRadius: 14,
              padding: 21,
            }}
          >
            <div
              style={{
                fontSize: 18,
                fontWeight: 800,
                marginBottom: 19,
              }}
            >
              Resumo Financeiro
            </div>

            {[
              [
                'Faturamento bruto',
                billing,
                '#fff',
              ],
              [
                'Recebido',
                received,
                COLORS.green,
              ],
              [
                'A receber',
                pendingAmount,
                COLORS.red,
              ],
              [
                'Taxas (InfinitePay)',
                fees > 0
                  ? -fees
                  : 0,
                fees > 0
                  ? COLORS.red
                  : '#666',
              ],
            ].map(
              (
                [label, value, color],
                index
              ) => (
                <div
                  key={label}
                  style={{
                    display: 'flex',
                    alignItems:
                      'center',
                    justifyContent:
                      'space-between',
                    padding:
                      '14px 0',
                    borderBottom:
                      `1px solid ${COLORS.border}`,
                  }}
                >
                  <span
                    style={{
                      color: '#aaa',
                      fontSize: 13,
                    }}
                  >
                    {label}
                  </span>

                  <strong
                    style={{
                      fontSize: 14,
                      color,
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
                display: 'flex',
                alignItems:
                  'center',
                justifyContent:
                  'space-between',
                padding:
                  '18px 0 0',
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: 15,
                    fontWeight: 800,
                  }}
                >
                  Líquido previsto{' '}
                  <span
                    style={{
                      color: '#666',
                      verticalAlign:
                        'middle',
                    }}
                  >
                    <Icon
                      name="info"
                      size={13}
                    />
                  </span>
                </div>
              </div>

              <strong
                style={{
                  fontSize: 22,
                  letterSpacing:
                    '-.03em',
                }}
              >
                {formatCurrency(
                  Math.max(
                    0,
                    received -
                      fees
                  )
                )}
              </strong>
            </div>
          </div>
        </section>

        <section
          className="cp-grid-main"
          style={{
            display: 'grid',
            gridTemplateColumns:
              'minmax(0,2fr) minmax(360px,1fr)',
            gap: 18,
            marginTop: 18,
          }}
        >
          <div
            className="cp-card"
            style={{
              background:
                COLORS.panel,
              border:
                `1px solid ${COLORS.border}`,
              borderRadius: 14,
              padding: 21,
              overflow:
                'hidden',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent:
                  'space-between',
                alignItems:
                  'center',
                marginBottom: 15,
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: 18,
                    fontWeight: 800,
                  }}
                >
                  Últimas cobranças{' '}
                  <span
                    style={{
                      color: '#666',
                      verticalAlign:
                        'middle',
                    }}
                  >
                    <Icon
                      name="info"
                      size={13}
                    />
                  </span>
                </div>
              </div>

              <button
                onClick={() =>
                  navigate(
                    '/pagamentos/admin/cobrancas'
                  )
                }
                style={{
                  border: 0,
                  background:
                    'transparent',
                  color:
                    COLORS.red,
                  cursor:
                    'pointer',
                  display: 'flex',
                  alignItems:
                    'center',
                  gap: 5,
                  fontSize: 12,
                  fontWeight: 700,
                }}
              >
                Ver todas
                <Icon
                  name="arrowRight"
                  size={14}
                />
              </button>
            </div>

            {recentCharges.length ===
            0 ? (
              <EmptyBlock minHeight={240}>
                Nenhuma cobrança criada ainda.
              </EmptyBlock>
            ) : (
              <div
                style={{
                  overflowX:
                    'auto',
                }}
              >
                <table className="cp-table">
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
                        (label) => (
                          <th
                            key={
                              label ||
                              'actions'
                            }
                            style={{
                              textAlign:
                                label ===
                                'Valor'
                                  ? 'right'
                                  : 'left',
                              padding:
                                '0 8px 11px',
                              color:
                                '#666',
                              fontSize:
                                10,
                              fontWeight:
                                600,
                              borderBottom:
                                `1px solid ${COLORS.border}`,
                              textTransform:
                                'uppercase',
                              letterSpacing:
                                '.07em',
                            }}
                          >
                            {label}
                          </th>
                        )
                      )}
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
                            key={
                              charge.id
                            }
                          >
                            <td
                              style={{
                                padding:
                                  '12px 8px',
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
                                    width: 34,
                                    height: 34,
                                    borderRadius:
                                      '50%',
                                    background:
                                      '#242424',
                                    border:
                                      `1px solid ${COLORS.border}`,
                                    display:
                                      'flex',
                                    alignItems:
                                      'center',
                                    justifyContent:
                                      'center',
                                    color:
                                      '#ddd',
                                    fontSize:
                                      11,
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
                                      (word) =>
                                        word[0]
                                    )
                                    .join('')
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
                                    {charge.title ||
                                      'Cobrança'}
                                  </div>
                                </div>
                              </div>
                            </td>

                            <td
                              style={{
                                padding:
                                  '12px 8px',
                                borderBottom:
                                  `1px solid ${COLORS.border}`,
                                color:
                                  '#aaa',
                                fontSize:
                                  11,
                              }}
                            >
                              {charge.title ||
                                'Serviço'}
                            </td>

                            <td
                              style={{
                                padding:
                                  '12px 8px',
                                borderBottom:
                                  `1px solid ${COLORS.border}`,
                                textAlign:
                                  'right',
                                color:
                                  '#eee',
                                fontSize:
                                  12,
                                fontWeight:
                                  700,
                              }}
                            >
                              {formatCurrency(
                                charge.amount
                              )}
                            </td>

                            <td
                              style={{
                                padding:
                                  '12px 8px',
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
                                    width: 7,
                                    height: 7,
                                    borderRadius:
                                      '50%',
                                    background:
                                      status.dot,
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
                                  '12px 8px',
                                borderBottom:
                                  `1px solid ${COLORS.border}`,
                                color:
                                  '#aaa',
                                fontSize:
                                  11,
                                whiteSpace:
                                  'nowrap',
                              }}
                            >
                              {formatDateTime(
                                charge.created_at
                              )}
                            </td>

                            <td
                              style={{
                                padding:
                                  '12px 8px',
                                borderBottom:
                                  `1px solid ${COLORS.border}`,
                                textAlign:
                                  'right',
                              }}
                            >
                              <button
                                onClick={() =>
                                  navigate(
                                    `/pagamentos/admin/cobrancas`
                                  )
                                }
                                style={{
                                  width: 28,
                                  height: 28,
                                  borderRadius:
                                    7,
                                  border: 0,
                                  background:
                                    'transparent',
                                  color:
                                    '#777',
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
                                  name="more"
                                  size={18}
                                />
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
          </div>

          <div
            className="cp-card"
            style={{
              background:
                COLORS.panel,
              border:
                `1px solid ${COLORS.border}`,
              borderRadius: 14,
              padding: 21,
            }}
          >
            <div
              style={{
                display:
                  'flex',
                alignItems:
                  'center',
                justifyContent:
                  'space-between',
                marginBottom:
                  16,
              }}
            >
              <div
                style={{
                  fontSize: 18,
                  fontWeight: 800,
                }}
              >
                Métodos de pagamento{' '}
                <span
                  style={{
                    color: '#666',
                    verticalAlign:
                      'middle',
                  }}
                >
                  <Icon
                    name="info"
                    size={13}
                  />
                </span>
              </div>
            </div>

            {paymentMethods.length ===
            0 ? (
              <EmptyBlock minHeight={230}>
                Nenhum pagamento confirmado.
              </EmptyBlock>
            ) : (
              <div>
                {paymentMethods.map(
                  (method) => {
                    const width =
                      Math.max(
                        4,
                        (method.amount /
                          maxPaymentMethod) *
                          100
                      );

                    const percentage =
                      received > 0
                        ? (method.amount /
                            received) *
                          100
                        : 0;

                    return (
                      <div
                        key={
                          method.name
                        }
                        style={{
                          marginBottom:
                            17,
                        }}
                      >
                        <div
                          style={{
                            display:
                              'grid',
                            gridTemplateColumns:
                              '1fr auto',
                            gap: 12,
                            alignItems:
                              'center',
                            marginBottom:
                              7,
                          }}
                        >
                          <div
                            style={{
                              display:
                                'flex',
                              alignItems:
                                'center',
                              gap: 9,
                              minWidth:
                                0,
                            }}
                          >
                            <div
                              style={{
                                width: 20,
                                height: 20,
                                borderRadius:
                                  5,
                                background:
                                  method.name ===
                                  'PIX'
                                    ? '#20c7ad'
                                    : '#303030',
                                color:
                                  '#fff',
                                display:
                                  'flex',
                                alignItems:
                                  'center',
                                justifyContent:
                                  'center',
                                fontSize:
                                  9,
                                fontWeight:
                                  900,
                              }}
                            >
                              {method.name ===
                              'PIX'
                                ? '◆'
                                : method.name ===
                                  'Cartão de crédito'
                                ? '▣'
                                : method.name ===
                                  'Cartão de débito'
                                ? '▤'
                                : method.name ===
                                  'Boleto'
                                ? '▥'
                                : '•'}
                            </div>

                            <span
                              style={{
                                color:
                                  '#bbb',
                                fontSize:
                                  12,
                                whiteSpace:
                                  'nowrap',
                                overflow:
                                  'hidden',
                                textOverflow:
                                  'ellipsis',
                              }}
                            >
                              {
                                method.name
                              }
                            </span>
                          </div>

                          <span
                            style={{
                              color:
                                '#ddd',
                              fontSize:
                                11,
                            }}
                          >
                            {percentage.toFixed(
                              0
                            )}
                            %
                          </span>
                        </div>

                        <div
                          style={{
                            height: 8,
                            background:
                              '#222',
                            borderRadius:
                              20,
                            overflow:
                              'hidden',
                          }}
                        >
                          <div
                            style={{
                              width: `${width}%`,
                              height: '100%',
                              background:
                                COLORS.red,
                              borderRadius:
                                20,
                            }}
                          />
                        </div>
                      </div>
                    );
                  }
                )}
              </div>
            )}
          </div>
        </section>

        <section
          className="cp-right-column"
          style={{
            display: 'grid',
            gridTemplateColumns:
              'repeat(2,minmax(0,1fr))',
            gap: 18,
            marginTop: 18,
          }}
        >
          <div
            className="cp-card"
            style={{
              background:
                COLORS.panel,
              border:
                `1px solid ${COLORS.border}`,
              borderRadius: 14,
              padding: 21,
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent:
                  'space-between',
                alignItems:
                  'center',
              }}
            >
              <div
                style={{
                  fontSize: 18,
                  fontWeight: 800,
                }}
              >
                Clientes{' '}
                <span
                  style={{
                    color: '#666',
                    verticalAlign:
                      'middle',
                  }}
                >
                  <Icon
                    name="info"
                    size={13}
                  />
                </span>
              </div>

              <button
                onClick={() =>
                  navigate(
                    '/pagamentos/admin/clientes'
                  )
                }
                style={{
                  border: 0,
                  background:
                    'transparent',
                  color:
                    COLORS.red,
                  cursor:
                    'pointer',
                  fontSize: 12,
                  fontWeight: 700,
                  display:
                    'flex',
                  alignItems:
                    'center',
                  gap: 5,
                }}
              >
                Ver todos
                <Icon
                  name="arrowRight"
                  size={14}
                />
              </button>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns:
                  '1fr 1fr 1fr',
                marginTop: 24,
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: 29,
                    fontWeight: 800,
                    letterSpacing:
                      '-.04em',
                  }}
                >
                  {clients.length}
                </div>

                <div
                  style={{
                    marginTop: 5,
                    color: '#666',
                    fontSize: 11,
                  }}
                >
                  Total de clientes
                </div>
              </div>

              <div
                style={{
                  paddingLeft: 20,
                  borderLeft:
                    `1px solid ${COLORS.border}`,
                }}
              >
                <div
                  style={{
                    display:
                      'flex',
                    alignItems:
                      'center',
                    gap: 7,
                  }}
                >
                  <div
                    style={{
                      fontSize: 29,
                      fontWeight: 800,
                      letterSpacing:
                        '-.04em',
                    }}
                  >
                    {
                      newClientsThisPeriod
                    }
                  </div>

                  {newClientsThisPeriod >
                  0 ? (
                    <span
                      style={{
                        color:
                          COLORS.green,
                      }}
                    >
                      <Icon
                        name="arrowUp"
                        size={16}
                      />
                    </span>
                  ) : null}
                </div>

                <div
                  style={{
                    marginTop: 5,
                    color: '#666',
                    fontSize: 11,
                  }}
                >
                  Novos no período
                </div>
              </div>

              <div
                style={{
                  paddingLeft: 20,
                  borderLeft:
                    `1px solid ${COLORS.border}`,
                }}
              >
                <div
                  style={{
                    fontSize: 29,
                    fontWeight: 800,
                    letterSpacing:
                      '-.04em',
                  }}
                >
                  {activeClients}
                </div>

                <div
                  style={{
                    marginTop: 5,
                    color: '#666',
                    fontSize: 11,
                  }}
                >
                  Clientes ativos
                </div>
              </div>
            </div>
          </div>

          <div
            className="cp-card"
            style={{
              background:
                COLORS.panel,
              border:
                `1px solid ${COLORS.border}`,
              borderRadius: 14,
              padding: 21,
            }}
          >
            <div
              style={{
                fontSize: 18,
                fontWeight: 800,
              }}
            >
              Atividade da operação
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns:
                  '1fr 1fr 1fr',
                gap: 12,
                marginTop: 20,
              }}
            >
              <div
                style={{
                  border:
                    `1px solid ${COLORS.border}`,
                  borderRadius: 11,
                  padding: 14,
                }}
              >
                <div
                  style={{
                    color:
                      '#666',
                    fontSize: 10,
                    textTransform:
                      'uppercase',
                    letterSpacing:
                      '.08em',
                  }}
                >
                  Cobranças
                </div>

                <div
                  style={{
                    fontSize: 22,
                    fontWeight: 800,
                    marginTop: 8,
                  }}
                >
                  {
                    filteredCharges.length
                  }
                </div>
              </div>

              <div
                style={{
                  border:
                    `1px solid ${COLORS.border}`,
                  borderRadius: 11,
                  padding: 14,
                }}
              >
                <div
                  style={{
                    color:
                      '#666',
                    fontSize: 10,
                    textTransform:
                      'uppercase',
                    letterSpacing:
                      '.08em',
                  }}
                >
                  Pagamentos
                </div>

                <div
                  style={{
                    fontSize: 22,
                    fontWeight: 800,
                    marginTop: 8,
                    color:
                      COLORS.green,
                  }}
                >
                  {
                    filteredPaidPayments.length
                  }
                </div>
              </div>

              <div
                style={{
                  border:
                    `1px solid ${COLORS.border}`,
                  borderRadius: 11,
                  padding: 14,
                }}
              >
                <div
                  style={{
                    color:
                      '#666',
                    fontSize: 10,
                    textTransform:
                      'uppercase',
                    letterSpacing:
                      '.08em',
                  }}
                >
                  Líquido
                </div>

                <div
                  style={{
                    fontSize: 22,
                    fontWeight: 800,
                    marginTop: 8,
                  }}
                >
                  {formatCurrency(
                    net
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        <div
          style={{
            marginTop: 20,
            display: 'flex',
            justifyContent:
              'flex-end',
          }}
        >
          <button
            onClick={loadDashboard}
            disabled={refreshing}
            style={{
              height: 38,
              padding:
                '0 13px',
              borderRadius: 9,
              border:
                `1px solid ${COLORS.border}`,
              background:
                COLORS.panel,
              color: '#888',
              display: 'flex',
              alignItems:
                'center',
              gap: 8,
              cursor: refreshing
                ? 'default'
                : 'pointer',
              opacity: refreshing
                ? 0.5
                : 1,
            }}
            title="Atualizar Dashboard"
          >
            <Icon
              name="refresh"
              size={16}
            />
            Atualizar
          </button>
        </div>
      </main>
    </div>
  );
}

export default AdminDashboard;