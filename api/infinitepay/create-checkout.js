import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL =
  process.env.SUPABASE_URL ||
  process.env.VITE_SUPABASE_URL;

const SUPABASE_PUBLIC_KEY =
  process.env.VITE_SUPABASE_ANON_KEY;

const INFINITEPAY_HANDLE =
  process.env.INFINITEPAY_HANDLE;

const SITE_URL =
  process.env.SITE_URL ||
  'https://leosouzadsgn.com';

function json(res, status, body) {
  return res
    .status(status)
    .setHeader(
      'Content-Type',
      'application/json'
    )
    .json(body);
}

function onlyDigits(value) {
  return String(value || '').replace(
    /\D/g,
    ''
  );
}

function normalizePhone(value) {
  const digits = onlyDigits(value);

  if (!digits) {
    return null;
  }

  if (
    digits.startsWith('55') &&
    digits.length >= 12
  ) {
    return `+${digits}`;
  }

  if (
    digits.length >= 10 &&
    digits.length <= 11
  ) {
    return `+55${digits}`;
  }

  return value;
}

export default async function handler(
  req,
  res
) {
  if (req.method !== 'POST') {
    return json(res, 405, {
      success: false,
      code: 'METHOD_NOT_ALLOWED',
      message: 'Método não permitido.',
    });
  }

  try {
    /*
    =====================================================
    CONFIGURAÇÃO DO SERVIDOR
    =====================================================
    Para esta função usamos a chave pública do Supabase
    + o JWT do usuário autenticado.

    O RLS continua protegendo charges e clients.
    =====================================================
    */

    if (!SUPABASE_URL) {
      return json(res, 500, {
        success: false,
        code: 'MISSING_SUPABASE_URL',
        message:
          'SUPABASE_URL ou VITE_SUPABASE_URL não está disponível no servidor.',
      });
    }

    if (!SUPABASE_PUBLIC_KEY) {
      return json(res, 500, {
        success: false,
        code: 'MISSING_SUPABASE_PUBLIC_KEY',
        message:
          'VITE_SUPABASE_ANON_KEY não está disponível no servidor.',
      });
    }

    if (!INFINITEPAY_HANDLE) {
      return json(res, 500, {
        success: false,
        code: 'MISSING_INFINITEPAY_HANDLE',
        message:
          'INFINITEPAY_HANDLE não configurado.',
      });
    }

    /*
    =====================================================
    SESSÃO DO ADMINISTRADOR
    =====================================================
    */

    const authorization =
      req.headers.authorization || '';

    const token =
      authorization.startsWith(
        'Bearer '
      )
        ? authorization.slice(7)
        : '';

    if (!token) {
      return json(res, 401, {
        success: false,
        code: 'MISSING_SESSION',
        message:
          'Sessão administrativa não encontrada.',
      });
    }

    /*
    =====================================================
    CLIENTE SUPABASE COM JWT DO USUÁRIO
    =====================================================
    */

    const supabaseUser =
      createClient(
        SUPABASE_URL,
        SUPABASE_PUBLIC_KEY,
        {
          auth: {
            autoRefreshToken: false,
            persistSession: false,
          },
          global: {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          },
        }
      );

    /*
    =====================================================
    CONFIRMA USUÁRIO
    =====================================================
    */

    const {
      data: userData,
      error: userError,
    } =
      await supabaseUser.auth.getUser(
        token
      );

    if (
      userError ||
      !userData?.user
    ) {
      console.error(
        'Sessão inválida:',
        userError
      );

      return json(res, 401, {
        success: false,
        code: 'INVALID_SESSION',
        message:
          'Sessão administrativa inválida.',
      });
    }

    const ownerId =
      userData.user.id;

    /*
    =====================================================
    COBRANÇA
    =====================================================
    */

    const chargeId =
      req.body?.charge_id;

    if (!chargeId) {
      return json(res, 400, {
        success: false,
        code: 'MISSING_CHARGE_ID',
        message:
          'charge_id é obrigatório.',
      });
    }

    const {
      data: charge,
      error: chargeError,
    } =
      await supabaseUser
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
          gateway_checkout_url
        `)
        .eq(
          'id',
          chargeId
        )
        .eq(
          'owner_id',
          ownerId
        )
        .single();

    if (
      chargeError ||
      !charge
    ) {
      console.error(
        'Erro ao localizar cobrança:',
        chargeError
      );

      return json(res, 404, {
        success: false,
        code: 'CHARGE_NOT_FOUND',
        message:
          'Cobrança não encontrada.',
      });
    }

    /*
    =====================================================
    REUTILIZA CHECKOUT EXISTENTE
    =====================================================
    */

    if (
      charge.gateway_checkout_url
    ) {
      return json(res, 200, {
        success: true,
        reused: true,
        url:
          charge.gateway_checkout_url,
      });
    }

    /*
    =====================================================
    NÃO GERAR PARA CANCELADA
    =====================================================
    */

    if (
      charge.status ===
        'cancelled' ||
      charge.status ===
        'canceled'
    ) {
      return json(res, 400, {
        success: false,
        code: 'CHARGE_CANCELLED',
        message:
          'Não é possível gerar checkout para uma cobrança cancelada.',
      });
    }

    /*
    =====================================================
    CLIENTE
    =====================================================
    */

    const {
      data: client,
      error: clientError,
    } =
      await supabaseUser
        .from('clients')
        .select(`
          id,
          owner_id,
          name,
          email,
          phone,
          is_active
        `)
        .eq(
          'id',
          charge.client_id
        )
        .eq(
          'owner_id',
          ownerId
        )
        .single();

    if (
      clientError ||
      !client
    ) {
      console.error(
        'Erro ao localizar cliente:',
        clientError
      );

      return json(res, 400, {
        success: false,
        code: 'CLIENT_NOT_FOUND',
        message:
          'O cliente da cobrança não foi encontrado.',
      });
    }

    /*
    =====================================================
    VALOR
    =====================================================
    */

    const amount =
      Number(
        charge.amount || 0
      );

    const amountInCents =
      Math.round(
        amount * 100
      );

    if (
      !Number.isFinite(amount) ||
      amountInCents <= 0
    ) {
      return json(res, 400, {
        success: false,
        code: 'INVALID_AMOUNT',
        message:
          'Valor da cobrança inválido.',
      });
    }

    /*
    =====================================================
    FORMAS DE PAGAMENTO
    =====================================================
    InfinitePay usa o checkout da conta para Pix/cartão.
    Os campos abaixo ficam registrados na nossa cobrança.
    =====================================================
    */

    if (
      charge.pix_enabled === false &&
      charge.card_enabled === false
    ) {
      return json(res, 400, {
        success: false,
        code: 'NO_PAYMENT_METHOD',
        message:
          'A cobrança precisa ter pelo menos uma forma de pagamento habilitada.',
      });
    }

    /*
    =====================================================
    PAYLOAD INFINITEPAY
    =====================================================
    */

    const payload = {
      handle:
        INFINITEPAY_HANDLE,

      order_nsu:
        charge.reference_code,

      redirect_url:
        `${SITE_URL}/pagamentos/confirmado?charge_id=${encodeURIComponent(
          charge.id
        )}`,

      webhook_url:
        `${SITE_URL}/api/webhooks/infinitepay`,

      items: [
        {
          quantity: 1,
          price:
            amountInCents,
          description:
            charge.title,
        },
      ],
    };

    /*
    =====================================================
    DADOS DO CLIENTE
    =====================================================
    */

    if (
      client.name ||
      client.email ||
      client.phone
    ) {
      payload.customer = {};

      if (client.name) {
        payload.customer.name =
          client.name;
      }

      if (client.email) {
        payload.customer.email =
          client.email;
      }

      const normalizedPhone =
        normalizePhone(
          client.phone
        );

      if (normalizedPhone) {
        payload.customer.phone_number =
          normalizedPhone;
      }

      if (
        Object.keys(
          payload.customer
        ).length === 0
      ) {
        delete payload.customer;
      }
    }

    /*
    =====================================================
    LOG SEGURO
    =====================================================
    */

    console.log(
      'InfinitePay create-checkout:',
      {
        chargeId:
          charge.id,
        referenceCode:
          charge.reference_code,
        amountInCents,
        authenticated:
          Boolean(ownerId),
        hasSupabaseUrl:
          Boolean(
            SUPABASE_URL
          ),
        hasSupabasePublicKey:
          Boolean(
            SUPABASE_PUBLIC_KEY
          ),
        hasInfinitePayHandle:
          Boolean(
            INFINITEPAY_HANDLE
          ),
      }
    );

    /*
    =====================================================
    CHAMADA À INFINITEPAY
    =====================================================
    */

    const infinitePayResponse =
      await fetch(
        'https://api.checkout.infinitepay.io/links',
        {
          method: 'POST',

          headers: {
            'Content-Type':
              'application/json',
          },

          body: JSON.stringify(
            payload
          ),
        }
      );

    let infinitePayData = null;

    try {
      infinitePayData =
        await infinitePayResponse.json();
    } catch {
      infinitePayData =
        null;
    }

    /*
    =====================================================
    ERRO DA INFINITEPAY
    =====================================================
    */

    if (
      !infinitePayResponse.ok ||
      !infinitePayData?.url
    ) {
      console.error(
        'Erro InfinitePay:',
        {
          status:
            infinitePayResponse.status,
          response:
            infinitePayData,
        }
      );

      return json(res, 502, {
        success: false,
        code: 'INFINITEPAY_CHECKOUT_ERROR',
        message:
          infinitePayData?.message ||
          'A InfinitePay não retornou um checkout válido.',
      });
    }

    /*
    =====================================================
    SALVA URL DO CHECKOUT
    =====================================================
    */

    const {
      error: updateError,
    } =
      await supabaseUser
        .from('charges')
        .update({
          gateway:
            'infinitepay',

          gateway_checkout_url:
            infinitePayData.url,

          updated_at:
            new Date().toISOString(),
        })
        .eq(
          'id',
          charge.id
        )
        .eq(
          'owner_id',
          ownerId
        );

    if (updateError) {
      console.error(
        'Erro ao salvar checkout:',
        updateError
      );

      return json(res, 500, {
        success: false,
        code: 'SAVE_CHECKOUT_ERROR',
        message:
          'Checkout criado, mas não foi possível salvar o link na cobrança.',
        url:
          infinitePayData.url,
      });
    }

    /*
    =====================================================
    SUCESSO
    =====================================================
    */

    return json(res, 200, {
      success: true,
      reused: false,
      url:
        infinitePayData.url,
    });
  } catch (error) {
    console.error(
      'Erro create-checkout:',
      error
    );

    return json(res, 500, {
      success: false,
      code: 'INTERNAL_ERROR',
      message:
        error?.message ||
        'Erro interno ao gerar checkout.',
    });
  }
}