import React, { useState } from 'react';
import { supabase } from '../lib/supabase';


function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');


  async function handleSubmit(event) {
    event.preventDefault();

    setError('');
    setLoading(true);

    const { error: loginError } =
      await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

    if (loginError) {
      setError(
        'E-mail ou senha incorretos. Verifique seus dados e tente novamente.'
      );

      setLoading(false);
      return;
    }

    window.location.href = '/pagamentos/admin/dashboard';
  }


  return (
    <main
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        background:
          'linear-gradient(135deg, #080808 0%, #111111 50%, #181818 100%)',
        color: '#ffffff',
        fontFamily:
          'Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      }}
    >
      <section
        style={{
          width: '100%',
          maxWidth: '430px',
          padding: '40px',
          borderRadius: '24px',
          background: 'rgba(255, 255, 255, 0.06)',
          border: '1px solid rgba(255, 255, 255, 0.10)',
          boxShadow: '0 24px 80px rgba(0, 0, 0, 0.45)',
          backdropFilter: 'blur(20px)',
        }}
      >
        <div style={{ marginBottom: '32px' }}>
          <div
            style={{
              fontSize: '13px',
              fontWeight: 700,
              letterSpacing: '0.16em',
              textTransform: 'uppercase',
              opacity: 0.55,
              marginBottom: '12px',
            }}
          >
            Central de Pagamentos
          </div>

          <h1
            style={{
              margin: 0,
              fontSize: '32px',
              lineHeight: 1.1,
              fontWeight: 800,
            }}
          >
            Acesso administrativo
          </h1>

          <p
            style={{
              marginTop: '12px',
              marginBottom: 0,
              color: 'rgba(255, 255, 255, 0.60)',
              lineHeight: 1.6,
              fontSize: '15px',
            }}
          >
            KREATIVE SPORTS / LÉO SOUZA DESIGNER
          </p>
        </div>


        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '18px' }}>
            <label
              htmlFor="email"
              style={{
                display: 'block',
                marginBottom: '8px',
                fontSize: '14px',
                fontWeight: 600,
              }}
            >
              E-mail
            </label>

            <input
              id="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="seu@email.com"
              autoComplete="email"
              required
              style={{
                width: '100%',
                boxSizing: 'border-box',
                padding: '14px 16px',
                borderRadius: '12px',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                background: 'rgba(255, 255, 255, 0.06)',
                color: '#ffffff',
                outline: 'none',
                fontSize: '15px',
              }}
            />
          </div>


          <div style={{ marginBottom: '18px' }}>
            <label
              htmlFor="password"
              style={{
                display: 'block',
                marginBottom: '8px',
                fontSize: '14px',
                fontWeight: 600,
              }}
            >
              Senha
            </label>

            <input
              id="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Sua senha"
              autoComplete="current-password"
              required
              style={{
                width: '100%',
                boxSizing: 'border-box',
                padding: '14px 16px',
                borderRadius: '12px',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                background: 'rgba(255, 255, 255, 0.06)',
                color: '#ffffff',
                outline: 'none',
                fontSize: '15px',
              }}
            />
          </div>


          {error && (
            <div
              style={{
                marginBottom: '18px',
                padding: '12px 14px',
                borderRadius: '10px',
                background: 'rgba(220, 38, 38, 0.12)',
                border: '1px solid rgba(248, 113, 113, 0.25)',
                color: '#fca5a5',
                fontSize: '14px',
                lineHeight: 1.5,
              }}
            >
              {error}
            </div>
          )}


          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '15px 18px',
              border: 'none',
              borderRadius: '12px',
              background: '#ffffff',
              color: '#090909',
              fontSize: '15px',
              fontWeight: 800,
              cursor: loading ? 'wait' : 'pointer',
              opacity: loading ? 0.65 : 1,
              transition: 'all 0.2s ease',
            }}
          >
            {loading ? 'Entrando...' : 'Entrar na Central'}
          </button>
        </form>


        <div
          style={{
            marginTop: '28px',
            paddingTop: '20px',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            textAlign: 'center',
            color: 'rgba(255, 255, 255, 0.38)',
            fontSize: '12px',
          }}
        >
          Ambiente administrativo protegido
        </div>
      </section>
    </main>
  );
}


export default AdminLogin;