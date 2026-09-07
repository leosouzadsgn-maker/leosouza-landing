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
  white: '#ffffff',
  text: '#eeeeee',
  muted: '#888888',
  muted2: '#5d5d5d',
  red: '#ef2b35',
  green: '#22c55e',
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

    plus: (
      <>
        <path d="M12 5v14" />
        <path d="M5 12h14" />
      </>
    ),

    search: (
      <>
        <circle
          cx="11"
          cy="11"
          r="7"
        />
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

    external: (
      <>
        <path d="M14 3h7v7" />
        <path d="M10 14 21 3" />
        <path d="M21 14v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5" />
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
        minHeight: 105,
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

function Brands() {
  const [user, setUser] = useState(null);

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

  const [selectedBrand, setSelectedBrand] =
    useState(null);

  const [message, setMessage] =
    useState('');

  const [mobileOpen, setMobileOpen] =
    useState(false);

  const [form, setForm] = useState({
    name: '',
    display_name: '',
    description: '',
    logo_url: '',
    primary_color: '#EF2B35',
    secondary_color: '#FFFFFF',
    email: '',
    phone: '',
    document: '',
    website: '',
    is_active: true,
  });

  const navigate = (path) => {
    setMobileOpen(false);
    window.location.href = path;
  };

  const resetForm = () => {
    setForm({
      name: '',
      display_name: '',
      description: '',
      logo_url: '',
      primary_color: '#EF2B35',
      secondary_color: '#FFFFFF',
      email: '',
      phone: '',
      document: '',
      website: '',
      is_active: true,
    });
  };

  const loadBrands = useCallback(
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

        const {
          data,
          error,
        } =
          await supabase
            .from('brands')
            .select(`
              id,
              owner_id,
              name,
              display_name,
              description,
              logo_url,
              primary_color,
              secondary_color,
              email,
              phone,
              document,
              website,
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
            );

        if (error) {
          throw error;
        }

        setBrands(data || []);
      } catch (error) {
        console.error(
          'Erro ao carregar marcas:',
          error
        );

        setBrands([]);
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    []
  );

  useEffect(() => {
    loadBrands();
  }, [loadBrands]);

  const filteredBrands =
    useMemo(() => {
      const query =
        normalize(search);

      if (!query) {
        return brands;
      }

      return brands.filter(
        (brand) =>
          normalize(
            [
              brand.name,
              brand.display_name,
              brand.description,
              brand.email,
              brand.website,
            ].join(' ')
          ).includes(query)
      );
    }, [brands, search]);

  const activeBrands =
    useMemo(
      () =>
        brands.filter(
          (brand) =>
            brand.is_active !==
            false
        ).length,
      [brands]
    );

  const openNew = () => {
    resetForm();
    setMessage('');
    setSelectedBrand(null);
    setModal('form');
  };

  const openEdit = (brand) => {
    setSelectedBrand(
      brand
    );

    setMessage('');

    setForm({
      name: brand.name || '',
      display_name:
        brand.display_name || '',
      description:
        brand.description || '',
      logo_url:
        brand.logo_url || '',
      primary_color:
        brand.primary_color ||
        '#EF2B35',
      secondary_color:
        brand.secondary_color ||
        '#FFFFFF',
      email:
        brand.email || '',
      phone:
        brand.phone || '',
      document:
        brand.document || '',
      website:
        brand.website || '',
      is_active:
        brand.is_active !== false,
    });

    setModal('form');
  };

  const saveBrand =
    async (event) => {
      event.preventDefault();

      setMessage('');

      if (
        !form.name.trim()
      ) {
        setMessage(
          'Informe o nome da marca/projeto.'
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
          name: form.name.trim(),
          display_name:
            form.display_name.trim() ||
            null,
          description:
            form.description.trim() ||
            null,
          logo_url:
            form.logo_url.trim() ||
            null,
          primary_color:
            form.primary_color ||
            null,
          secondary_color:
            form.secondary_color ||
            null,
          email:
            form.email.trim() ||
            null,
          phone:
            form.phone.trim() ||
            null,
          document:
            form.document.trim() ||
            null,
          website:
            form.website.trim() ||
            null,
          is_active:
            form.is_active,
          updated_at:
            new Date().toISOString(),
        };

        if (selectedBrand) {
          const {
            error,
          } =
            await supabase
              .from('brands')
              .update(payload)
              .eq(
                'id',
                selectedBrand.id
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
              .from('brands')
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
        setSelectedBrand(null);
        resetForm();

        await loadBrands();
      } catch (error) {
        console.error(
          'Erro ao salvar marca:',
          error
        );

        setMessage(
          error?.message ||
            'Não foi possível salvar a marca.'
        );
      } finally {
        setSaving(false);
      }
    };

  const toggleBrand =
    async (brand) => {
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
            .from('brands')
            .update({
              is_active:
                !brand.is_active,
              updated_at:
                new Date().toISOString(),
            })
            .eq(
              'id',
              brand.id
            )
            .eq(
              'owner_id',
              authenticatedUser.id
            );

        if (error) {
          throw error;
        }

        await loadBrands();
      } catch (error) {
        console.error(
          'Erro ao alterar status da marca:',
          error
        );

        setMessage(
          error?.message ||
            'Não foi possível alterar o status.'
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

    .brands-sidebar {
      transition: transform .22s ease;
    }

    .brands-nav {
      transition:
        background .16s ease,
        color .16s ease;
    }

    .brands-nav:hover {
      background: rgba(255,255,255,.035) !important;
      color: #fff !important;
    }

    .brand-card {
      transition:
        transform .18s ease,
        border-color .18s ease;
    }

    .brand-card:hover {
      transform: translateY(-1px);
      border-color: rgba(255,255,255,.14) !important;
    }

    .brands-mobile {
      display: none !important;
    }

    .brands-modal-backdrop {
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

    .brands-modal {
      width: min(760px, 100%);
      max-height: 92vh;
      overflow-y: auto;
      background: #101010;
      border: 1px solid rgba(255,255,255,.12);
      border-radius: 18px;
      box-shadow: 0 30px 90px rgba(0,0,0,.55);
    }

    @media (max-width: 1120px) {
      .brands-sidebar {
        transform: translateX(-100%);
        z-index: 150;
      }

      .brands-sidebar.open {
        transform: translateX(0);
      }

      .brands-main {
        margin-left: 0 !important;
        padding-left: 20px !important;
        padding-right: 20px !important;
      }

      .brands-mobile {
        display: flex !important;
      }
    }

    @media (max-width: 760px) {
      .brands-header {
        flex-direction: column !important;
        align-items: flex-start !important;
      }

      .brands-actions {
        width: 100%;
      }

      .brands-actions button {
        flex: 1;
      }

      .brands-grid {
        grid-template-columns: 1fr !important;
      }

      .brands-form-grid {
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
        Carregando Marcas / Projetos...
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
        className="brands-mobile"
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
          color: '#fff',
          alignItems:
            'center',
          justifyContent:
            'center',
        }}
      >
        <Icon
          name="menu"
          size={20}
        />
      </button>

      <aside
        className={`brands-sidebar ${
          mobileOpen
            ? 'open'
            : ''
        }`}
        style={{
          position:
            'fixed',
          inset:
            '0 auto 0 0',
          width: 258,
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
              '/pagamentos/admin/marcas';

            return (
              <div
                key={
                  path
                }
                className="brands-nav"
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
                  gap: 13,
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
              gap: 9,
              border: 0,
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
        className="brands-main"
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
          className="brands-header"
          style={{
            display:
              'flex',
            alignItems:
              'center',
            justifyContent:
              'space-between',
            gap: 20,
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
              Marcas / Projetos
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
              Organize as operações que recebem suas cobranças.
            </div>
          </div>

          <div
            className="brands-actions"
            style={{
              display:
                'flex',
              alignItems:
                'center',
              gap: 9,
            }}
          >
            <button
              onClick={
                loadBrands
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
                border: 0,
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
                gap: 8,
                cursor:
                  'pointer',
                fontSize:
                  13,
                fontWeight:
                  800,
              }}
            >
              <Icon
                name="plus"
                size={17}
              />

              Nova marca
            </button>
          </div>
        </header>

        <section
          className="brands-grid"
          style={{
            display:
              'grid',
            gridTemplateColumns:
              'repeat(3,minmax(0,1fr))',
            gap: 14,
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
              Total de marcas
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
              {brands.length}
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
              Marcas ativas
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
              {activeBrands}
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
              Resultados
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
              {
                filteredBrands.length
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
              após a pesquisa
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
                left: 13,
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
              placeholder="Pesquisar marca, projeto ou cliente..."
              style={{
                paddingLeft:
                  42,
              }}
            />
          </div>
        </section>

        <section
          className="brands-grid"
          style={{
            display:
              'grid',
            gridTemplateColumns:
              'repeat(2,minmax(0,1fr))',
            gap: 16,
            marginTop:
              18,
          }}
        >
          {filteredBrands.length ===
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
                  name="tag"
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
                Nenhuma marca ou projeto cadastrado
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
                Cadastre a primeira operação da sua Central.
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
                + Nova marca
              </button>
            </div>
          ) : (
            filteredBrands.map(
              (brand) => (
                <div
                  key={
                    brand.id
                  }
                  className="brand-card"
                  style={{
                    position:
                      'relative',
                    background:
                      COLORS.panel,
                    border:
                      `1px solid ${COLORS.border}`,
                    borderRadius:
                      15,
                    padding:
                      20,
                    overflow:
                      'hidden',
                  }}
                >
                  <div
                    style={{
                      position:
                        'absolute',
                      top: 0,
                      left: 0,
                      width:
                        '100%',
                      height:
                        2,
                      background:
                        brand.primary_color ||
                        COLORS.red,
                    }}
                  />

                  <div
                    style={{
                      display:
                        'flex',
                      alignItems:
                        'flex-start',
                      justifyContent:
                        'space-between',
                      gap: 15,
                    }}
                  >
                    <div
                      style={{
                        display:
                          'flex',
                        alignItems:
                          'center',
                        gap: 13,
                        minWidth:
                          0,
                      }}
                    >
                      <div
                        style={{
                          width:
                            58,
                          height:
                            58,
                          borderRadius:
                            14,
                          background:
                            '#171717',
                          border:
                            `1px solid ${COLORS.border}`,
                          display:
                            'flex',
                          alignItems:
                            'center',
                          justifyContent:
                            'center',
                          overflow:
                            'hidden',
                          flexShrink:
                            0,
                        }}
                      >
                        {brand.logo_url ? (
                          <img
                            src={
                              brand.logo_url
                            }
                            alt={
                              brand.display_name ||
                              brand.name
                            }
                            style={{
                              width:
                                '100%',
                              height:
                                '100%',
                              objectFit:
                                'contain',
                            }}
                          />
                        ) : (
                          <span
                            style={{
                              fontSize:
                                18,
                              fontWeight:
                                800,
                              color:
                                brand.primary_color ||
                                COLORS.red,
                            }}
                          >
                            {String(
                              brand.display_name ||
                                brand.name ||
                                'M'
                            )
                              .trim()
                              .slice(
                                0,
                                2
                              )
                              .toUpperCase()}
                          </span>
                        )}
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
                          {brand.display_name ||
                            brand.name}
                        </div>

                        <div
                          style={{
                            color:
                              '#666',
                            fontSize:
                              11,
                            marginTop:
                              5,
                          }}
                        >
                          {
                            brand.name
                          }
                        </div>
                      </div>
                    </div>

                    <span
                      style={{
                        flexShrink:
                          0,
                        display:
                          'inline-flex',
                        alignItems:
                          'center',
                        gap: 6,
                        color:
                          brand.is_active
                            ? COLORS.green
                            : '#666',
                        fontSize:
                          10,
                        fontWeight:
                          800,
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
                            brand.is_active
                              ? COLORS.green
                              : '#555',
                        }}
                      />

                      {brand.is_active
                        ? 'ATIVA'
                        : 'INATIVA'}
                    </span>
                  </div>

                  <div
                    style={{
                      marginTop:
                        17,
                      minHeight:
                        39,
                      color:
                        '#777',
                      fontSize:
                        12,
                      lineHeight:
                        1.55,
                    }}
                  >
                    {brand.description ||
                      'Sem descrição cadastrada.'}
                  </div>

                  <div
                    style={{
                      display:
                        'flex',
                      flexWrap:
                        'wrap',
                      gap: 8,
                      marginTop:
                        15,
                    }}
                  >
                    {brand.email && (
                      <span
                        style={{
                          padding:
                            '6px 8px',
                          borderRadius:
                            7,
                          background:
                            '#151515',
                          color:
                            '#777',
                          fontSize:
                            10,
                        }}
                      >
                        {
                          brand.email
                        }
                      </span>
                    )}

                    {brand.website && (
                      <span
                        style={{
                          padding:
                            '6px 8px',
                          borderRadius:
                            7,
                          background:
                            '#151515',
                          color:
                            '#777',
                          fontSize:
                            10,
                        }}
                      >
                        {
                          brand.website
                        }
                      </span>
                    )}
                  </div>

                  <div
                    style={{
                      display:
                        'flex',
                      justifyContent:
                        'space-between',
                      alignItems:
                        'center',
                      gap: 8,
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
                        toggleBrand(
                          brand
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
                          brand.is_active
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
                      {brand.is_active
                        ? 'Desativar'
                        : 'Ativar'}
                    </button>

                    <div
                      style={{
                        display:
                          'flex',
                        gap: 7,
                      }}
                    >
                      {brand.website && (
                        <button
                          onClick={() => {
                            const url =
                              brand.website.startsWith(
                                'http'
                              )
                                ? brand.website
                                : `https://${brand.website}`;

                            window.open(
                              url,
                              '_blank',
                              'noopener,noreferrer'
                            );
                          }}
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
                              '#888',
                            cursor:
                              'pointer',
                            display:
                              'flex',
                            alignItems:
                              'center',
                            justifyContent:
                              'center',
                          }}
                          title="Abrir site"
                        >
                          <Icon
                            name="external"
                            size={15}
                          />
                        </button>
                      )}

                      <button
                        onClick={() =>
                          openEdit(
                            brand
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
                        title="Editar"
                      >
                        <Icon
                          name="edit"
                          size={15}
                        />
                      </button>
                    </div>
                  </div>
                </div>
              )
            )
          )}
        </section>
      </main>

      {modal ===
        'form' && (
        <div
          className="brands-modal-backdrop"
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
          <div className="brands-modal">
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
                  {selectedBrand
                    ? 'Editar marca'
                    : 'Nova marca / projeto'}
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
                saveBrand
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
                  className="brands-form-grid"
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
                    label="Nome"
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
                      placeholder="Ex.: Kreative Sports"
                    />
                  </Field>

                  <Field label="Nome de exibição">
                    <Input
                      value={
                        form.display_name
                      }
                      onChange={(
                        event
                      ) =>
                        setForm(
                          (
                            current
                          ) => ({
                            ...current,
                            display_name:
                              event
                                .target
                                .value,
                          })
                        )
                      }
                      placeholder="Como aparecerá na Central"
                    />
                  </Field>
                </div>

                <Field label="Descrição">
                  <Textarea
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
                    placeholder="Explique brevemente o que é esta marca ou projeto."
                  />
                </Field>

                <Field label="URL da logo">
                  <Input
                    value={
                      form.logo_url
                    }
                    onChange={(
                      event
                    ) =>
                      setForm(
                        (
                          current
                        ) => ({
                          ...current,
                          logo_url:
                            event
                              .target
                              .value,
                        })
                      )
                    }
                    placeholder="https://..."
                  />
                </Field>

                <div
                  className="brands-form-grid"
                  style={{
                    display:
                      'grid',
                    gridTemplateColumns:
                      '1fr 1fr',
                    gap:
                      14,
                  }}
                >
                  <Field label="Cor principal">
                    <div
                      style={{
                        display:
                          'flex',
                        gap:
                          8,
                      }}
                    >
                      <Input
                        value={
                          form.primary_color
                        }
                        onChange={(
                          event
                        ) =>
                          setForm(
                            (
                              current
                            ) => ({
                              ...current,
                              primary_color:
                                event
                                  .target
                                  .value,
                            })
                          )
                        }
                        placeholder="#EF2B35"
                      />

                      <input
                        type="color"
                        value={
                          form.primary_color ||
                          '#EF2B35'
                        }
                        onChange={(
                          event
                        ) =>
                          setForm(
                            (
                              current
                            ) => ({
                              ...current,
                              primary_color:
                                event
                                  .target
                                  .value,
                            })
                          )
                        }
                        style={{
                          width:
                            44,
                          height:
                            44,
                          borderRadius:
                            9,
                          border:
                            `1px solid ${COLORS.border}`,
                          background:
                            'transparent',
                          padding:
                            3,
                          cursor:
                            'pointer',
                        }}
                      />
                    </div>
                  </Field>

                  <Field label="Cor secundária">
                    <div
                      style={{
                        display:
                          'flex',
                        gap:
                          8,
                      }}
                    >
                      <Input
                        value={
                          form.secondary_color
                        }
                        onChange={(
                          event
                        ) =>
                          setForm(
                            (
                              current
                            ) => ({
                              ...current,
                              secondary_color:
                                event
                                  .target
                                  .value,
                            })
                          )
                        }
                        placeholder="#FFFFFF"
                      />

                      <input
                        type="color"
                        value={
                          form.secondary_color ||
                          '#FFFFFF'
                        }
                        onChange={(
                          event
                        ) =>
                          setForm(
                            (
                              current
                            ) => ({
                              ...current,
                              secondary_color:
                                event
                                  .target
                                  .value,
                            })
                          )
                        }
                        style={{
                          width:
                            44,
                          height:
                            44,
                          borderRadius:
                            9,
                          border:
                            `1px solid ${COLORS.border}`,
                          background:
                            'transparent',
                          padding:
                            3,
                          cursor:
                            'pointer',
                        }}
                      />
                    </div>
                  </Field>
                </div>

                <div
                  className="brands-form-grid"
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
                      placeholder="contato@..."
                    />
                  </Field>

                  <Field label="Telefone">
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

                <div
                  className="brands-form-grid"
                  style={{
                    display:
                      'grid',
                    gridTemplateColumns:
                      '1fr 1fr',
                    gap:
                      14,
                  }}
                >
                  <Field label="Documento">
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

                  <Field label="Site">
                    <Input
                      value={
                        form.website
                      }
                      onChange={(
                        event
                      ) =>
                        setForm(
                          (
                            current
                          ) => ({
                            ...current,
                            website:
                              event
                                .target
                                .value,
                          })
                        )
                      }
                      placeholder="https://..."
                    />
                  </Field>
                </div>

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

                  Marca / projeto ativo
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
                        ? .6
                        : 1,
                  }}
                >
                  {saving
                    ? 'Salvando...'
                    : selectedBrand
                    ? 'Salvar alterações'
                    : 'Salvar marca'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Brands;