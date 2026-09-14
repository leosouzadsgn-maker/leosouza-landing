import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL =
  'https://tjbzzkvdsnubsndqmzsd.supabase.co';

const SUPABASE_SERVICE_ROLE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY;

function json(res, status, body) {
  return res
    .status(status)
    .setHeader(
      'Content-Type',
      'application/json'
    )
    .json(body);
}

function paymentMethodLabel(value) {
  if (
    value === 'pix'
  ) {
    return 'Pix';
  }

  if (
    value === 'cartao' ||
    value === 'credit_card'
  ) {
    return 'Cartão de crédito';
  }

  return value || 'Pagamento';
}

export default async function handler(
  req,
  res
) {
  if (
    req.method !== 'GET'
  ) {
    return json(res, 405, {
      success: false,
      message:
        'Método não permitido.',
    });
  }

  try {
    if (
      !SUPABASE_SERVICE_ROLE_KEY
    ) {
      return json(res, 500, {
        success: false,
        message:
          'SUPABASE_SERVICE_ROLE_KEY não configurada.',
      });
    }

    const code =
      String(
        req.query?.code ||
        ''
      ).trim();

    const chargeId =
      String(
        req.query?.charge_id ||
        ''
      ).trim();

    if (
      !code &&
      !chargeId
    ) {
      return json(res, 400, {
        success: false,
        message:
          'Código ou cobrança não informado.',
      });
    }

    const supabaseAdmin =
      createClient(
        SUPABASE_URL,
        SUPABASE_SERVICE_ROLE_KEY,
        {
          auth: {
            autoRefreshToken:
              false,
            persistSession:
              false,
          },
        }
      );

    let receipt = null;

    if (code) {
      const {
        data,
        error,
      } =
        await supabaseAdmin
          .from('receipts')
          .select(`
            id,
            receipt_number,
            validation_code,
            issued_at,
            payment_id,
            owner_id
          `)
          .eq(
            'validation_code',
            code
          )
          .maybeSingle();

      if (error) {
        console.error(
          'Erro buscando comprovante:',
          error
        );
      }

      receipt =
        data || null;
    }

    if (
      !receipt &&
      chargeId
    ) {
      const {
        data: chargeForReceipt,
      } =
        await supabaseAdmin
          .from('charges')
          .select(`
            id,
            owner_id
          `)
          .eq(
            'id',
            chargeId
          )
          .maybeSingle();

      if (
        chargeForReceipt
      ) {
        const {
          data,
          error,
        } =
          await supabaseAdmin
            .from('payments')
            .select(`
              id
            `)
            .eq(
              'charge_id',
              chargeId
            )
            .eq(
              'status',
              'paid'
            )
            .order(
              'paid_at',
              {
                ascending:
                  false,
              }
            )
            .limit(1)
            .maybeSingle();

        if (
          error
        ) {
          console.error(
            'Erro buscando pagamento:',
            error
          );
        }

        if (data) {
          const {
            data: receiptData,
          } =
            await supabaseAdmin
              .from('receipts')
              .select(`
                id,
                receipt_number,
                validation_code,
                issued_at,
                payment_id,
                owner_id
              `)
              .eq(
                'payment_id',
                data.id
              )
              .maybeSingle();

          receipt =
            receiptData ||
            null;
        }
      }
    }

    if (!receipt) {
      if (chargeId) {
        const {
          data: pendingCharge,
        } =
          await supabaseAdmin
            .from('charges')
            .select(`
              id,
              status
            `)
            .eq(
              'id',
              chargeId
            )
            .maybeSingle();

        if (
          pendingCharge
        ) {
          return json(res, 200, {
            success: true,
            pending: true,
            charge_status:
              pendingCharge.status,
          });
        }
      }

      return json(res, 404, {
        success: false,
        message:
          'Comprovante não encontrado.',
      });
    }

    const {
      data: payment,
      error: paymentError,
    } =
      await supabaseAdmin
        .from('payments')
        .select(`
          id,
          charge_id,
          amount,
          payment_method,
          installments,
          status,
          paid_at,
          gateway,
          gateway_transaction_id,
          gateway_invoice_id
        `)
        .eq(
          'id',
          receipt.payment_id
        )
        .single();

    if (
      paymentError ||
      !payment
    ) {
      return json(res, 404, {
        success: false,
        message:
          'Pagamento relacionado ao comprovante não foi encontrado.',
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
          status,
          paid_at
        `)
        .eq(
          'id',
          payment.charge_id
        )
        .eq(
          'owner_id',
          receipt.owner_id
        )
        .single();

    if (
      chargeError ||
      !charge
    ) {
      return json(res, 404, {
        success: false,
        message:
          'Cobrança relacionada ao comprovante não foi encontrada.',
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
        .maybeSingle();

    const {
      data: brand,
    } =
      await supabaseAdmin
        .from('brands')
        .select(`
          id,
          name,
          display_name,
          logo_url,
          primary_color,
          secondary_color,
          website,
          email
        `)
        .eq(
          'id',
          charge.brand_id
        )
        .maybeSingle();

    return json(res, 200, {
      success: true,

      receipt: {
        id:
          receipt.id,

        receipt_number:
          receipt.receipt_number,

        validation_code:
          receipt.validation_code,

        issued_at:
          receipt.issued_at,
      },

      payment: {
        amount:
          Number(
            payment.amount ||
              0
          ),

        payment_method:
          paymentMethodLabel(
            payment.payment_method
          ),

        installments:
          Number(
            payment.installments ||
              1
          ),

        status:
          payment.status,

        paid_at:
          payment.paid_at,

        gateway:
          payment.gateway,

        transaction:
          payment.gateway_transaction_id,

        invoice:
          payment.gateway_invoice_id,

        charge_title:
          charge.title,
      },

      charge: {
        id:
          charge.id,

        reference_code:
          charge.reference_code,

        title:
          charge.title,

        description:
          charge.description,

        status:
          charge.status,

        paid_at:
          charge.paid_at,
      },

      client: {
        name:
          client?.name ||
          null,

        email:
          client?.email ||
          null,
      },

      brand: {
        name:
          brand?.display_name ||
          brand?.name ||
          'Central de Pagamentos',

        logo_url:
          brand?.logo_url ||
          null,

        primary_color:
          brand?.primary_color ||
          '#ef2b35',

        secondary_color:
          brand?.secondary_color ||
          '#101010',

        website:
          brand?.website ||
          null,
      },
    });
  } catch (error) {
    console.error(
      'Erro view receipt:',
      error
    );

    return json(res, 500, {
      success: false,
      message:
        error?.message ||
        'Erro interno ao carregar comprovante.',
    });
  }
}