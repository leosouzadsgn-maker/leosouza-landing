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
  white: '#ffffff',
  text: '#eeeeee',
  muted: '#888888',
  muted2: '#5d5d5d',
  red: '#ef2b35',
  green: '#22c55e',
  yellow: '#f59e0b',
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

    edit: (
      <>
        <path d="M12 20h9" />
        <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4Z" />
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

    phone: (
      <>
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12.9.33 1.77.62 2.61a2 2 0 0 1-.45 2.11L8 9.72a16 16 0 0 0 6 6l1.28-1.28a2 2 0 0 1 2.11-.45c.84.29 1.71.5 2.61.62A2 2 0 0 1 22 16.92Z" />
      </>
    ),

    mail: (
      <>
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="m3 7 9 6 9-6" />
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
      {icons[name]}
    </svg>
  );
}

function Input({
  style = {},
  ...props
}) {
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
        ...style,
      }}
    />
  );
}

function Textarea({
  style = {},
  ...props
}) {
  return (
    <textarea
      {...props}
      style={{
        width: '100%',
        minHeight: 110,
        padding: 13,
        borderRadius: 10,
        border:
          `1px solid ${COLORS.border}`,
        background: '#0b0b0b',
        color: '#eee',
        outline: 'none',
        fontSize: 13,
        resize: 'vertical',
        ...style,
      }}
    />
  );
}

function Field({
  label,
  required = false,
  children,
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

function Clients() {
  const [user, setUser] = useState(null);

  const [clients, setClients] =
    useState([]);

  const [brands, setBrands] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [refreshing, setRefreshing] =
    useState(false);

  const [saving, setSaving] =
    useState(false);

  const [search, setSearch] =
    useState('');

  const [modal, setModal] =
    useState(null);

  const [selectedClient, setSelectedClient] =
    useState(null);

  const [message, setMessage] =
    useState('');

  const [mobileOpen, setMobileOpen] =
    useState(false);

  const [form, setForm] = useState({
    name: '',
    document: '',
    email: '',
    phone: '',
    brand_id: '',
    notes: '',
    is_active: true,
  });

  const navigate = (path) => {
    setMobileOpen(false);
    window.location.href = path;
  };

  const resetForm = () => {
    setForm({
      name: '',
      document: '',
      email: '',
      phone: '',
      brand_id: '',
      notes: '',
      is_active: true,
    });
  };

  const loadData = useCallback(
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

        setUser(
          authenticatedUser
        );

        const [
          clientsResponse,
          brandsResponse,
        ] = await Promise.all([
          supabase
            .from('clients')
            .select(`
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
            `)
            .eq(
              'owner_id',
              authenticatedUser.id
            )
            .order(
              'created_at',
              {
                ascending: false,
              }
            ),

          supabase
            .from('brands')
            .select(`
              id,
              owner_id,
              name,
              display_name,
              is_active
            `)
            .eq(
              'owner_id',
              authenticatedUser.id
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
        ]);

        if (
          clientsResponse.error
        ) {
          throw clientsResponse.error;
        }

        if (
          brandsResponse.error
        ) {
          throw brandsResponse.error;
        }

        setClients(
          clientsResponse.data || []
        );

        setBrands(
          brandsResponse.data || []
        );
      } catch (error) {
        console.error(
          'Erro ao carregar clientes:',
          error
        );

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

  const filteredClients = useMemo(
    () => {
      const query =
        normalize(search);

      if (!query) {
        return clients;
      }

      return clients.filter(
        (client) =>
          normalize(
            [
              client.name,
              client.document,
              client.email,
              client.phone,
              client.notes,
              brandMap[
                client.brand_id
              ]?.name,
              brandMap[
                client.brand_id
              ]?.display_name,
            ].join(' ')
          ).includes(query)
      );
    },
    [
      clients,
      search,
      brandMap,
    ]
  );

  const activeClients =
    useMemo(
      () =>
        clients.filter(
          (client) =>
            client.is_active !==
            false
        ).length,
      [clients]
    );

  const clientsWithBrand =
    useMemo(
      () =>
        clients.filter(
          (client) =>
            !!client.brand_id
        ).length,
      [clients]
    );

  const openNew = () => {
    resetForm();
    setSelectedClient(null);
    setMessage('');

    setModal('form');
  };

  const openEdit = (
    client
  ) => {
    setSelectedClient(
      client
    );

    setMessage('');

    setForm({
      name:
        client.name || '',
      document:
        client.document || '',
      email:
        client.email || '',
      phone:
        client.phone || '',
      brand_id:
        client.brand_id || '',
      notes:
        client.notes || '',
      is_active:
        client.is_active !== false,
    });

    setModal('form');
  };

  const saveClient =
    async (event) => {
      event.preventDefault();

      setMessage('');

      if (
        !form.name.trim()
      ) {
        setMessage(
          'Informe o nome do cliente.'
        );
        return;
      }

      if (
        form.email.trim() &&
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
          form.email.trim()
        )
      ) {
        setMessage(
          'Informe um e-mail válido.'
        );
        return;
      }

      try {
        setSaving(true);

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

        const payload = {
          name:
            form.name.trim(),
          document:
            form.document.trim() ||
            null,
          email:
            form.email.trim() ||
            null,
          phone:
            form.phone.trim() ||
            null,
          brand_id:
            form.brand_id ||
            null,
          notes:
            form.notes.trim() ||
            null,
          is_active:
            form.is_active,
          updated_at:
            new Date().toISOString(),
        };

        if (
          selectedClient
        ) {
          const {
            error,
          } =
            await supabase
              .from('clients')
              .update(
                payload
              )
              .eq(
                'id',
                selectedClient.id
              )
              .eq(
                'owner_id',
                authenticatedUser.id
              );

          if (error) {
            throw error;
          }
        } else {
          const {
            error,
          } =
            await supabase
              .from('clients')
              .insert({
                ...payload,
                owner_id:
                  authenticatedUser.id,
              });

          if (error) {
            throw error;
          }
        }

        setModal(null);
        setSelectedClient(
          null
        );
        resetForm();

        await loadData();
      } catch (error) {
        console.error(
          'Erro ao salvar cliente:',
          error
        );

        setMessage(
          error?.message ||
            'Não foi possível salvar o cliente.'
        );
      } finally {
        setSaving(false);
      }
    };

  const toggleClient =
    async (client) => {
      try {
        setSaving(true);

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

        const {
          error,
        } =
          await supabase
            .from('clients')
            .update({
              is_active:
                !client.is_active,
              updated_at:
                new Date().toISOString(),
            })
            .eq(
              'id',
              client.id
            )
            .eq(
              'owner_id',
              authenticatedUser.id
            );

        if (error) {
          throw error;
        }

        await loadData();
      } catch (error) {
        console.error(
          'Erro ao alterar status do cliente:',
          error
        );

        setMessage(
          error?.message ||
            'Não foi possível alterar o status do cliente.'
        );
      } finally {
        setSaving(false);
      }
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

    .clients-sidebar {
      transition: transform .22s ease;
    }

    .clients-nav {
      transition:
        background .16s ease,
        color .16s ease;
    }

    .clients-nav:hover {
      background: rgba(255,255,255,.035) !important;
      color: #fff !important;
    }

    .client-card {
      transition:
        transform .18s ease,
        border-color .18s ease;
    }

    .client-card:hover {
      transform: translateY(-1px);
      border-color: rgba(255,255,255,.14) !important;
    }

    .clients-mobile {
      display: none !important;
    }

    .clients-modal-backdrop {
      position: fixed;
      inset: 0;
      z-index: 200;
      background: rgba(0,0,0,.74);
      backdrop-filter: blur(8px);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
    }

    .clients-modal {
      width: min(700px, 100%);
      max-height: 92vh;
      overflow-y: auto;
      background: #101010;
      border: 1px solid rgba(255,255,255,.12);
      border-radius: 18px;
      box-shadow: 0 30px 90px rgba(0,0,0,.55);
    }

    .client-avatar {
      width: 58px;
      height: 58px;
      border-radius: 14px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      background: #171717;
      border: 1px solid rgba(255,255,255,.1);
      color: #ddd;
      font-size: 17px;
      font-weight: 800;
    }

    @media (max-width: 1120px) {
      .clients-sidebar {
        transform: translateX(-100%);
        z-index: 150;
      }

      .clients-sidebar.open {
        transform: translateX(0);
      }

      .clients-main {
        margin-left: 0 !important;
        padding-left: 20px !important;
        padding-right: 20px !important;
      }

      .clients-mobile {
        display: flex !important;
      }
    }

    @media (max-width: 760px) {
      .clients-header {
        flex-direction: column !important;
        align-items: flex-start !important;
      }

      .clients-actions {
        width: 100%;
      }

      .clients-actions button {
        flex: 1;
      }

      .clients-grid {
        grid-template-columns: 1fr !important;
      }

      .clients-form-grid {
        grid-template-columns: 1fr !important;
      }
    }
  `;

  if (loading) {
    return (
      <div
        style={{
          minHeight: '100vh',
          background:
            COLORS.bg,
          color: '#fff',
          display: 'flex',
          alignItems:
            'center',
          justifyContent:
            'center',
          fontFamily:
            'Inter, Arial, sans-serif',
        }}
      >
        Carregando Clientes...
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
      }}
    >
      <style>
        {styles}
      </style>

      <button
        className="clients-mobile"
        onClick={() =>
          setMobileOpen(
            (value) => !value
          )
        }
        style={{
          position:
            'fixed',
          top: 15,
          left: 15,
          zIndex: 160,
          width: 44,
          height: 44,
          borderRadius: 12,
          border:
            `1px solid ${COLORS.border}`,
          background:
            '#101010',
          color:
            '#fff',
          alignItems:
            'center',
          justifyContent:
            'center',
          cursor:
            'pointer',
        }}
      >
        <Icon
          name="menu"
          size={20}
        />
      </button>

      <aside
        className={`clients-sidebar ${
          mobileOpen
            ? 'open'
            : ''
        }`}
        style={{
          position:
            'fixed',
          inset:
            '0 auto 0 0',
          width:
            258,
          background:
            COLORS.sidebar,
          borderRight:
            `1px solid ${COLORS.border}`,
          padding:
            '30px 18px 18px',
          display:
            'flex',
          flexDirection:
            'column',
          overflowY:
            'auto',
        }}
      >
        <div
          style={{
            padding:
              '0 18px 28px',
            borderBottom:
              `1px solid ${COLORS.border}`,
            marginBottom:
              20,
          }}
        >
          <div
            style={{
              color:
                '#f3f3f3',
              fontSize:
                19,
              fontWeight:
                800,
              letterSpacing:
                '-.04em',
            }}
          >
            LÉO SOUZA
          </div>

          <div
            style={{
              marginTop:
                4,
              fontSize:
                10,
              color:
                '#aaa',
              letterSpacing:
                '.22em',
            }}
          >
            DESIGNER
          </div>

          <div
            style={{
              marginTop:
                14,
              color:
                '#666',
              fontSize:
                9,
              letterSpacing:
                '.13em',
            }}
          >
            ESTRATÉGIA · IMAGEM · RESULTADOS
          </div>
        </div>

        <div
          style={{
            color:
              '#666',
            fontSize:
              10,
            letterSpacing:
              '.14em',
            margin:
              '0 18px 10px',
          }}
        >
          MENU
        </div>

        {menu.map(
          ([
            icon,
            label,
            path,
          ]) => {
            const active =
              path ===
              '/pagamentos/admin/clientes';

            return (
              <div
                key={
                  path
                }
                className="clients-nav"
                onClick={() =>
                  navigate(
                    path
                  )
                }
                style={{
                  display:
                    'flex',
                  alignItems:
                    'center',
                  gap:
                    13,
                  padding:
                    '12px 16px',
                  borderRadius:
                    10,
                  marginBottom:
                    4,
                  color:
                    active
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
                  cursor:
                    'pointer',
                  fontSize:
                    14,
                  fontWeight:
                    active
                      ? 700
                      : 500,
                }}
              >
                <span
                  style={{
                    color:
                      active
                        ? COLORS.red
                        : '#999',
                    display:
                      'inline-flex',
                  }}
                >
                  <Icon
                    name={
                      icon
                    }
                    size={
                      19
                    }
                  />
                </span>

                {label}
              </div>
            );
          }
        )}

        <div
          style={{
            marginTop:
              'auto',
            padding:
              '18px 18px 3px',
            borderTop:
              `1px solid ${COLORS.border}`,
          }}
        >
          <div
            style={{
              color:
                '#777',
              fontSize:
                10,
              marginBottom:
                10,
              overflow:
                'hidden',
              whiteSpace:
                'nowrap',
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
              display:
                'flex',
              alignItems:
                'center',
              gap:
                9,
              border:
                0,
              background:
                'transparent',
              color:
                '#aaa',
              padding:
                0,
              cursor:
                'pointer',
              fontSize:
                13,
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
        className="clients-main"
        style={{
          marginLeft:
            258,
          padding:
            '28px 30px 50px',
          maxWidth:
            1600,
        }}
      >
        <header
          className="clients-header"
          style={{
            display:
              'flex',
            alignItems:
              'center',
            justifyContent:
              'space-between',
            gap:
              20,
            paddingBottom:
              23,
            borderBottom:
              `1px solid ${COLORS.border}`,
          }}
        >
          <div>
            <div
              style={{
                fontSize:
                  11,
                color:
                  '#666',
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
                fontSize:
                  31,
                letterSpacing:
                  '-.045em',
              }}
            >
              Clientes
            </h1>

            <div
              style={{
                marginTop:
                  6,
                color:
                  '#777',
                fontSize:
                  13,
              }}
            >
              Cadastre e organize os clientes das suas operações.
            </div>
          </div>

          <div
            className="clients-actions"
            style={{
              display:
                'flex',
              alignItems:
                'center',
              gap:
                9,
            }}
          >
            <button
              onClick={
                loadData
              }
              disabled={
                refreshing
              }
              title="Atualizar"
              style={{
                width:
                  42,
                height:
                  42,
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
                opacity:
                  refreshing
                    ? .5
                    : 1,
              }}
            >
              <Icon
                name="refresh"
                size={18}
              />
            </button>

            <button
              onClick={
                openNew
              }
              style={{
                height:
                  42,
                padding:
                  '0 16px',
                borderRadius:
                  10,
                border:
                  0,
                background:
                  COLORS.red,
                color:
                  '#fff',
                display:
                  'flex',
                alignItems:
                  'center',
                justifyContent:
                  'center',
                gap:
                  8,
                cursor:
                  'pointer',
                fontSize:
                  13,
                fontWeight:
                  800,
                boxShadow:
                  '0 10px 25px rgba(239,43,53,.18)',
              }}
            >
              <Icon
                name="plus"
                size={17}
              />

              Novo cliente
            </button>
          </div>
        </header>

        <section
          className="clients-grid"
          style={{
            display:
              'grid',
            gridTemplateColumns:
              'repeat(3,minmax(0,1fr))',
            gap:
              14,
            marginTop:
              20,
          }}
        >
          <div
            style={{
              padding:
                20,
              borderRadius:
                14,
              background:
                COLORS.panel,
              border:
                `1px solid ${COLORS.border}`,
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
              Total de clientes
            </div>

            <div
              style={{
                marginTop:
                  10,
                fontSize:
                  27,
                fontWeight:
                  800,
              }}
            >
              {clients.length}
            </div>
          </div>

          <div
            style={{
              padding:
                20,
              borderRadius:
                14,
              background:
                COLORS.panel,
              border:
                `1px solid ${COLORS.border}`,
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
              Clientes ativos
            </div>

            <div
              style={{
                marginTop:
                  10,
                fontSize:
                  27,
                fontWeight:
                  800,
                color:
                  COLORS.green,
              }}
            >
              {activeClients}
            </div>
          </div>

          <div
            style={{
              padding:
                20,
              borderRadius:
                14,
              background:
                COLORS.panel,
              border:
                `1px solid ${COLORS.border}`,
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
              Com marca vinculada
            </div>

            <div
              style={{
                marginTop:
                  10,
                fontSize:
                  27,
                fontWeight:
                  800,
              }}
            >
              {clientsWithBrand}
            </div>
          </div>
        </section>

        <section
          style={{
            marginTop:
              18,
          }}
        >
          <div
            style={{
              position:
                'relative',
            }}
          >
            <div
              style={{
                position:
                  'absolute',
                left:
                  13,
                top: 0,
                bottom: 0,
                display:
                  'flex',
                alignItems:
                  'center',
                color:
                  '#555',
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
              value={
                search
              }
              onChange={(
                event
              ) =>
                setSearch(
                  event
                    .target
                    .value
                )
              }
              placeholder="Pesquisar cliente, documento, telefone ou marca..."
              style={{
                paddingLeft:
                  42,
              }}
            />
          </div>
        </section>

        <section
          className="clients-grid"
          style={{
            display:
              'grid',
            gridTemplateColumns:
              'repeat(2,minmax(0,1fr))',
            gap:
              16,
            marginTop:
              18,
          }}
        >
          {filteredClients.length ===
          0 ? (
            <div
              style={{
                gridColumn:
                  '1 / -1',
                padding:
                  '75px 20px',
                borderRadius:
                  15,
                border:
                  `1px solid ${COLORS.border}`,
                background:
                  COLORS.panel,
                textAlign:
                  'center',
              }}
            >
              <div
                style={{
                  width:
                    56,
                  height:
                    56,
                  margin:
                    '0 auto 15px',
                  borderRadius:
                    15,
                  background:
                    'rgba(255,255,255,.035)',
                  display:
                    'flex',
                  alignItems:
                    'center',
                  justifyContent:
                    'center',
                  color:
                    '#666',
                }}
              >
                <Icon
                  name="clients"
                  size={26}
                />
              </div>

              <div
                style={{
                  color:
                    '#aaa',
                  fontSize:
                    14,
                  fontWeight:
                    700,
                }}
              >
                Nenhum cliente cadastrado
              </div>

              <div
                style={{
                  color:
                    '#555',
                  marginTop:
                    7,
                  fontSize:
                    12,
                }}
              >
                Cadastre seu primeiro cliente para começar a emitir cobranças.
              </div>

              <button
                onClick={
                  openNew
                }
                style={{
                  marginTop:
                    18,
                  height:
                    40,
                  padding:
                    '0 16px',
                  border:
                    0,
                  borderRadius:
                    9,
                  background:
                    COLORS.red,
                  color:
                    '#fff',
                  cursor:
                    'pointer',
                  fontSize:
                    12,
                  fontWeight:
                    800,
                }}
              >
                + Novo cliente
              </button>
            </div>
          ) : (
            filteredClients.map(
              (client) => {
                const brand =
                  brandMap[
                    client.brand_id
                  ];

                const initials =
                  String(
                    client.name ||
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
                      (part) =>
                        part[0]
                    )
                    .join(
                      ''
                    )
                    .toUpperCase();

                return (
                  <div
                    key={
                      client.id
                    }
                    className="client-card"
                    style={{
                      background:
                        COLORS.panel,
                      border:
                        `1px solid ${COLORS.border}`,
                      borderRadius:
                        15,
                      padding:
                        20,
                    }}
                  >
                    <div
                      style={{
                        display:
                          'flex',
                        alignItems:
                          'flex-start',
                        justifyContent:
                          'space-between',
                        gap:
                          14,
                      }}
                    >
                      <div
                        style={{
                          display:
                            'flex',
                          alignItems:
                            'center',
                          gap:
                            13,
                          minWidth:
                            0,
                        }}
                      >
                        <div className="client-avatar">
                          {initials}
                        </div>

                        <div
                          style={{
                            minWidth:
                              0,
                          }}
                        >
                          <div
                            style={{
                              color:
                                '#eee',
                              fontSize:
                                16,
                              fontWeight:
                                800,
                              overflow:
                                'hidden',
                              whiteSpace:
                                'nowrap',
                              textOverflow:
                                'ellipsis',
                            }}
                          >
                            {
                              client.name
                            }
                          </div>

                          <div
                            style={{
                              marginTop:
                                5,
                              color:
                                '#666',
                              fontSize:
                                11,
                            }}
                          >
                            {brand?.display_name ||
                              brand?.name ||
                              'Sem marca vinculada'}
                          </div>
                        </div>
                      </div>

                      <span
                        style={{
                          display:
                            'inline-flex',
                          alignItems:
                            'center',
                          gap:
                            6,
                          color:
                            client.is_active
                              ? COLORS.green
                              : '#666',
                          fontSize:
                            10,
                          fontWeight:
                            800,
                          flexShrink:
                            0,
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
                              client.is_active
                                ? COLORS.green
                                : '#555',
                          }}
                        />

                        {client.is_active
                          ? 'ATIVO'
                          : 'INATIVO'}
                      </span>
                    </div>

                    <div
                      style={{
                        display:
                          'grid',
                        gap:
                          8,
                        marginTop:
                          18,
                      }}
                    >
                      {client.email && (
                        <div
                          style={{
                            display:
                              'flex',
                            alignItems:
                              'center',
                            gap:
                              8,
                            color:
                              '#777',
                            fontSize:
                              11,
                          }}
                        >
                          <Icon
                            name="mail"
                            size={14}
                          />
                          {
                            client.email
                          }
                        </div>
                      )}

                      {client.phone && (
                        <div
                          style={{
                            display:
                              'flex',
                            alignItems:
                              'center',
                            gap:
                              8,
                            color:
                              '#777',
                            fontSize:
                              11,
                          }}
                        >
                          <Icon
                            name="phone"
                            size={14}
                          />
                          {
                            client.phone
                          }
                        </div>
                      )}

                      {client.document && (
                        <div
                          style={{
                            color:
                              '#666',
                            fontSize:
                              10,
                          }}
                        >
                          Documento:{' '}
                          {
                            client.document
                          }
                        </div>
                      )}
                    </div>

                    {client.notes && (
                      <div
                        style={{
                          marginTop:
                            15,
                          padding:
                            12,
                          borderRadius:
                            9,
                          background:
                            '#0b0b0b',
                          border:
                            `1px solid ${COLORS.border}`,
                          color:
                            '#777',
                          fontSize:
                            11,
                          lineHeight:
                            1.5,
                        }}
                      >
                        {
                          client.notes
                        }
                      </div>
                    )}

                    <div
                      style={{
                        display:
                          'flex',
                        justifyContent:
                          'space-between',
                        alignItems:
                          'center',
                        marginTop:
                          18,
                        paddingTop:
                          15,
                        borderTop:
                          `1px solid ${COLORS.border}`,
                      }}
                    >
                      <button
                        onClick={() =>
                          toggleClient(
                            client
                          )
                        }
                        disabled={
                          saving
                        }
                        style={{
                          height:
                            35,
                          padding:
                            '0 11px',
                          borderRadius:
                            8,
                          border:
                            `1px solid ${COLORS.border}`,
                          background:
                            'transparent',
                          color:
                            client.is_active
                              ? '#777'
                              : COLORS.green,
                          cursor:
                            'pointer',
                          fontSize:
                            10,
                          fontWeight:
                            700,
                        }}
                      >
                        {client.is_active
                          ? 'Desativar'
                          : 'Ativar'}
                      </button>

                      <button
                        onClick={() =>
                          openEdit(
                            client
                          )
                        }
                        style={{
                          width:
                            35,
                          height:
                            35,
                          borderRadius:
                            8,
                          border:
                            `1px solid ${COLORS.border}`,
                          background:
                            '#151515',
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
                        title="Editar cliente"
                      >
                        <Icon
                          name="edit"
                          size={15}
                        />
                      </button>
                    </div>
                  </div>
                );
              }
            )
          )}
        </section>
      </main>

      {modal ===
        'form' && (
        <div
          className="clients-modal-backdrop"
          onMouseDown={(
            event
          ) => {
            if (
              event.target ===
              event.currentTarget
            ) {
              setModal(null);
            }
          }}
        >
          <div className="clients-modal">
            <div
              style={{
                padding:
                  '21px 22px',
                borderBottom:
                  `1px solid ${COLORS.border}`,
                display:
                  'flex',
                alignItems:
                  'center',
                justifyContent:
                  'space-between',
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
                      '.13em',
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
                  {selectedClient
                    ? 'Editar cliente'
                    : 'Novo cliente'}
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
                saveClient
              }
            >
              <div
                style={{
                  padding:
                    22,
                  display:
                    'grid',
                  gap:
                    17,
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
                        '#ff9ca2',
                      fontSize:
                        12,
                    }}
                  >
                    {message}
                  </div>
                )}

                <div
                  className="clients-form-grid"
                  style={{
                    display:
                      'grid',
                    gridTemplateColumns:
                      '1fr 1fr',
                    gap:
                      14,
                  }}
                >
                  <Field
                    label="Nome completo"
                    required
                  >
                    <Input
                      value={
                        form.name
                      }
                      onChange={(
                        event
                      ) =>
                        setForm(
                          (
                            current
                          ) => ({
                            ...current,
                            name:
                              event
                                .target
                                .value,
                          })
                        )
                      }
                      placeholder="Ex.: João Silva"
                    />
                  </Field>

                  <Field label="CPF / CNPJ">
                    <Input
                      value={
                        form.document
                      }
                      onChange={(
                        event
                      ) =>
                        setForm(
                          (
                            current
                          ) => ({
                            ...current,
                            document:
                              event
                                .target
                                .value,
                          })
                        )
                      }
                      placeholder="CPF ou CNPJ"
                    />
                  </Field>
                </div>

                <div
                  className="clients-form-grid"
                  style={{
                    display:
                      'grid',
                    gridTemplateColumns:
                      '1fr 1fr',
                    gap:
                      14,
                  }}
                >
                  <Field label="E-mail">
                    <Input
                      type="email"
                      value={
                        form.email
                      }
                      onChange={(
                        event
                      ) =>
                        setForm(
                          (
                            current
                          ) => ({
                            ...current,
                            email:
                              event
                                .target
                                .value,
                          })
                        )
                      }
                      placeholder="cliente@email.com"
                    />
                  </Field>

                  <Field label="Telefone / WhatsApp">
                    <Input
                      value={
                        form.phone
                      }
                      onChange={(
                        event
                      ) =>
                        setForm(
                          (
                            current
                          ) => ({
                            ...current,
                            phone:
                              event
                                .target
                                .value,
                          })
                        )
                      }
                      placeholder="(38) 99999-9999"
                    />
                  </Field>
                </div>

                <Field label="Marca / Projeto">
                  <select
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
                    style={{
                      width:
                        '100%',
                      height:
                        44,
                      padding:
                        '0 13px',
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
                      fontSize:
                        13,
                    }}
                  >
                    <option
                      value=""
                    >
                      Sem marca vinculada
                    </option>

                    {brands.map(
                      (
                        brand
                      ) => (
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
                  </select>
                </Field>

                <Field label="Observações">
                  <Textarea
                    value={
                      form.notes
                    }
                    onChange={(
                      event
                    ) =>
                      setForm(
                        (
                          current
                        ) => ({
                          ...current,
                          notes:
                            event
                              .target
                              .value,
                        })
                      )
                    }
                    placeholder="Informações importantes sobre o cliente..."
                  />
                </Field>

                <label
                  style={{
                    display:
                      'flex',
                    alignItems:
                      'center',
                    gap:
                      10,
                    color:
                      '#aaa',
                    fontSize:
                      12,
                    cursor:
                      'pointer',
                  }}
                >
                  <input
                    type="checkbox"
                    checked={
                      form.is_active
                    }
                    onChange={(
                      event
                    ) =>
                      setForm(
                        (
                          current
                        ) => ({
                          ...current,
                          is_active:
                            event
                              .target
                              .checked,
                        })
                      )
                    }
                  />

                  Cliente ativo
                </label>
              </div>

              <div
                style={{
                  padding:
                    '15px 22px',
                  borderTop:
                    `1px solid ${COLORS.border}`,
                  display:
                    'flex',
                    justifyContent:
                      'flex-end',
                    gap:
                      9,
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
                    border:
                      0,
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
                        ? .6
                        : 1,
                  }}
                >
                  {saving
                    ? 'Salvando...'
                    : selectedClient
                    ? 'Salvar alterações'
                    : 'Salvar cliente'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Clients;