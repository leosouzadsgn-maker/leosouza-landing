import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL =
  process.env.SUPABASE_URL;

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
      message: 'Método não permitido.',
    });
  }

  try {
    if (
      !SUPABASE_URL ||
      !SUPABASE_SERVICE_ROLE_KEY
    ) {
      return json(res, 500, {
        success: false,
        message:
          'Configuração do Supabase no servidor não encontrada.',
      });
    }

    if (!INFINITEPAY_HANDLE) {
      return json(res, 500, {
        success: false,
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
      return json(res, 401, {
        success: false,
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
          gateway_checkout_url
        `)
        .eq('id', chargeId)
        .eq('owner_id', ownerId)
        .single();

    if (
      chargeError ||
      !charge
    ) {
      return json(res, 404, {
        success: false,
        message:
          'Cobrança não encontrada.',
      });
    }

    if (
      charge.gateway_checkout_url
    ) {
      return json(res, 200, {
        success: true,
        url:
          charge.gateway_checkout_url,
      });
    }

    const {
      data: client,
    } =
      await supabaseAdmin
        .from('clients')
        .select(`
          id,
          name,
          email,
          phone
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

    const amountInCents =
      Math.round(
        Number(
          charge.amount || 0
        ) * 100
      );

    if (
      !amountInCents ||
      amountInCents <= 0
    ) {
      return json(res, 400, {
        success: false,
        message:
          'Valor da cobrança inválido.',
      });
    }

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
          price: amountInCents,
          description:
            charge.title,
        },
      ],
    };

    if (client?.name) {
      payload.customer = {
        name: client.name,
      };

      if (client.email) {
        payload.customer.email =
          client.email;
      }

      if (client.phone) {
        payload.customer.phone_number =
          client.phone;
      }
    }

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

    const infinitePayData =
      await infinitePayResponse.json();

    if (
      !infinitePayResponse.ok ||
      !infinitePayData?.url
    ) {
      console.error(
        'Erro InfinitePay:',
        infinitePayData
      );

      return json(res, 502, {
        success: false,
        message:
          infinitePayData?.message ||
          'A InfinitePay não retornou um checkout válido.',
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
        .eq('id', charge.id)
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
        message:
          'Checkout criado, mas não foi possível salvar o link na cobrança.',
        url:
          infinitePayData.url,
      });
    }

    return json(res, 200, {
      success: true,
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
      message:
        error?.message ||
        'Erro interno ao gerar checkout.',
    });
  }
}