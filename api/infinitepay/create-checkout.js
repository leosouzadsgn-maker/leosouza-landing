import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL =
  'https://tjbzzkvdsnubsndqmzsd.supabase.co';

const SUPABASE_ANON_KEY =
  process.env.SUPABASE_ANON_KEY ||
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

function normalizePhone(value) {
  const digits = String(
    value || ''
  ).replace(/\D/g, '');

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
      message:
        'Método não permitido.',
    });
  }

  try {
    /*
    =====================================================
    CONFIGURAÇÃO
    =====================================================
    */

    if (!SUPABASE_ANON_KEY) {
      return json(res, 500, {
        success: false,
        code: 'MISSING_SUPABASE_ANON_KEY',
        message:
          'A chave pública do Supabase não está disponível no servidor.',
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
    SESSÃO
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
    SUPABASE
    =====================================================
    */

    const supabase =
      createClient(
        SUPABASE_URL,
        SUPABASE_ANON_KEY,
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
    USUÁRIO AUTENTICADO
    =====================================================
    */

    const {
      data: userData,
      error: userError,
    } =
      await supabase.auth.getUser(
        token
      );

    if (
      userError ||
      !userData?.user
    ) {
      console.error(
        'Erro ao validar sessão:',
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
      await supabase
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
    CHECKOUT JÁ EXISTENTE
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
    COBRANÇA CANCELADA
    =====================================================
    */

    if (
      charge.status === 'cancelled' ||
      charge.status === 'canceled'
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
      await supabase
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
    CLIENTE NO CHECKOUT
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

      const phone =
        normalizePhone(
          client.phone
        );

      if (phone) {
        payload.customer.phone_number =
          phone;
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
      'Criando checkout InfinitePay:',
      {
        chargeId:
          charge.id,
        referenceCode:
          charge.reference_code,
        amountInCents,
        supabaseConfigured:
          Boolean(
            SUPABASE_ANON_KEY
          ),
        infinitePayConfigured:
          Boolean(
            INFINITEPAY_HANDLE
          ),
      }
    );

    /*
    =====================================================
    INFINITEPAY API
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
    ERRO INFINITEPAY
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
    SALVA CHECKOUT
    =====================================================
    */

    const {
      error: updateError,
    } =
      await supabase
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