import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL =
  'https://tjbzzkvdsnubsndqmzsd.supabase.co';

const SUPABASE_SERVICE_ROLE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY;

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
    if (!SUPABASE_SERVICE_ROLE_KEY) {
      return json(res, 500, {
        success: false,
        code:
          'MISSING_SUPABASE_SERVICE_ROLE_KEY',
        message:
          'SUPABASE_SERVICE_ROLE_KEY não está disponível no servidor.',
      });
    }

    if (!INFINITEPAY_HANDLE) {
      return json(res, 500, {
        success: false,
        code:
          'MISSING_INFINITEPAY_HANDLE',
        message:
          'INFINITEPAY_HANDLE não configurado.',
      });
    }

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

    const supabaseAdmin =
      createClient(
        SUPABASE_URL,
        SUPABASE_SERVICE_ROLE_KEY,
        {
          auth: {
            autoRefreshToken: false,
            persistSession: false,
          },
        }
      );

    const {
      data: userData,
      error: userError,
    } =
      await supabaseAdmin.auth.getUser(
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
      await supabaseAdmin
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
     * IMPORTANTE:
     * Neste teste estamos enviando somente os campos
     * do checkout que já foram validados pela API:
     *
     * - handle
     * - redirect_url
     * - webhook_url
     * - order_nsu
     * - items
     *
     * O bloco "customer" foi removido temporariamente
     * para isolar o erro do checkout.
     */
    const payload = {
      handle:
        INFINITEPAY_HANDLE,

      redirect_url:
        `${SITE_URL}/pagamentos/confirmado?charge_id=${encodeURIComponent(
          charge.id
        )}`,

      webhook_url:
        `${SITE_URL}/api/webhooks/infinitepay`,

      order_nsu:
        charge.reference_code,

      items: [
        {
          quantity: 1,
          price:
            amountInCents,
          description:
            charge.title ||
            'Cobrança',
        },
      ],
    };

    console.log(
      'Criando checkout InfinitePay:',
      {
        chargeId:
          charge.id,
        referenceCode:
          charge.reference_code,
        amount:
          amount,
        amountInCents:
          amountInCents,
        payload: {
          ...payload,
          handle:
            INFINITEPAY_HANDLE,
        },
      }
    );

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

    console.log(
      'Resposta InfinitePay:',
      {
        status:
          infinitePayResponse.status,
        ok:
          infinitePayResponse.ok,
        data:
          infinitePayData,
      }
    );

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
        code:
          'INFINITEPAY_CHECKOUT_ERROR',
        message:
          infinitePayData?.message ||
          'A InfinitePay não retornou um checkout válido.',
        gateway_status:
          infinitePayResponse.status,
      });
    }

    const {
      error: updateError,
    } =
      await supabaseAdmin
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
        code:
          'SAVE_CHECKOUT_ERROR',
        message:
          'Checkout criado, mas não foi possível salvar o link na cobrança.',
        url:
          infinitePayData.url,
      });
    }

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