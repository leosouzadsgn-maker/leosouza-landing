import { createClient } from '@supabase/supabase-js';
import { randomUUID } from 'node:crypto';

const SUPABASE_URL =
  'https://tjbzzkvdsnubsndqmzsd.supabase.co';

const SUPABASE_SERVICE_ROLE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY;

const RESEND_API_KEY =
  process.env.RESEND_API_KEY;

const SITE_URL =
  process.env.SITE_URL ||
  'https://leosouzadsgn.com';

const EMAIL_FROM =
  process.env.EMAIL_FROM ||
  'Central de Pagamentos <contato@leosouzadsgn.com>';

function json(res, status, body) {
  return res
    .status(status)
    .setHeader(
      'Content-Type',
      'application/json'
    )
    .json(body);
}

function money(value) {
  return Number(
    value || 0
  ).toLocaleString(
    'pt-BR',
    {
      style: 'currency',
      currency: 'BRL',
    }
  );
}

function paymentMethodLabel(
  captureMethod
) {
  if (
    captureMethod ===
    'credit_card'
  ) {
    return 'Cartão de crédito';
  }

  if (
    captureMethod ===
    'pix'
  ) {
    return 'Pix';
  }

  return (
    captureMethod ||
    'Pagamento'
  );
}

function normalizePaymentMethod(
  captureMethod
) {
  if (
    captureMethod ===
    'credit_card'
  ) {
    return 'cartao';
  }

  if (
    captureMethod ===
    'pix'
  ) {
    return 'pix';
  }

  return (
    captureMethod ||
    'outro'
  );
}

function createReceiptNumber() {
  const now =
    new Date();

  const date =
    [
      now.getFullYear(),
      String(
        now.getMonth() + 1
      ).padStart(2, '0'),
      String(
        now.getDate()
      ).padStart(2, '0'),
    ].join('');

  const suffix =
    randomUUID()
      .replace(
        /-/g,
        ''
      )
      .slice(
        0,
        8
      )
      .toUpperCase();

  return `REC-${date}-${suffix}`;
}

function createValidationCode() {
  return `KRV-${randomUUID()
    .replace(
      /-/g,
      ''
    )
    .slice(
      0,
      12
    )
    .toUpperCase()}`;
}

function buildEmailHtml({
  brandName,
  brandLogo,
  clientName,
  title,
  description,
  amount,
  paidAt,
  paymentMethod,
  installments,
  receiptNumber,
  validationCode,
  receiptUrl,
  infinitePayReceiptUrl,
  referenceCode,
}) {
  const formattedAmount =
    money(amount);

  const formattedDate =
    new Date(
      paidAt
    ).toLocaleString(
      'pt-BR',
      {
        dateStyle:
          'long',
        timeStyle:
          'short',
      }
    );

  return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta
    name="viewport"
    content="width=device-width, initial-scale=1.0"
  >
  <title>Pagamento confirmado</title>
</head>

<body
  style="
    margin:0;
    padding:0;
    background:#070707;
    font-family:Arial,Helvetica,sans-serif;
    color:#ffffff;
  "
>
  <div
    style="
      padding:40px 16px;
      background:
        radial-gradient(
          circle at top,
          rgba(239,43,53,.14),
          transparent 38%
        ),
        #070707;
    "
  >

    <div
      style="
        width:100%;
        max-width:620px;
        margin:0 auto;
      "
    >

      <div
        style="
          margin-bottom:18px;
          color:#ef2b35;
          font-size:11px;
          font-weight:800;
          letter-spacing:2px;
          text-transform:uppercase;
        "
      >
        CENTRAL DE PAGAMENTOS
      </div>

      <div
        style="
          overflow:hidden;
          border:1px solid #262626;
          border-radius:20px;
          background:#111111;
        "
      >

        <div
          style="
            padding:32px;
            border-bottom:1px solid #242424;
            background:
              linear-gradient(
                135deg,
                rgba(239,43,53,.13),
                transparent
              );
          "
        >

          ${
            brandLogo
              ? `
                <img
                  src="${brandLogo}"
                  alt="${brandName || 'Marca'}"
                  style="
                    display:block;
                    width:60px;
                    height:60px;
                    object-fit:contain;
                    margin-bottom:20px;
                    padding:8px;
                    border-radius:14px;
                    background:#ffffff;
                  "
                />
              `
              : ''
          }

          <div
            style="
              margin-bottom:8px;
              font-size:27px;
              font-weight:800;
              letter-spacing:-.8px;
            "
          >
            Pagamento confirmado
          </div>

          <div
            style="
              color:#999999;
              font-size:14px;
              line-height:1.6;
            "
          >
            Olá, ${
              clientName ||
              'cliente'
            }.
            Seu pagamento foi identificado
            e registrado com sucesso.
          </div>

        </div>

        <div
          style="
            padding:30px;
          "
        >

          <div
            style="
              margin-bottom:24px;
              padding:24px;
              border-radius:14px;
              background:#090909;
              border:1px solid #222222;
            "
          >

            <div
              style="
                margin-bottom:8px;
                color:#666666;
                font-size:10px;
                font-weight:800;
                letter-spacing:1.5px;
                text-transform:uppercase;
              "
            >
              Valor recebido
            </div>

            <div
              style="
                font-size:36px;
                font-weight:900;
                letter-spacing:-1px;
              "
            >
              ${formattedAmount}
            </div>

            <div
              style="
                margin-top:8px;
                color:#999999;
                font-size:13px;
              "
            >
              ${
                title ||
                'Pagamento'
              }
            </div>

            ${
              description
                ? `
                  <div
                    style="
                      margin-top:8px;
                      color:#6f6f6f;
                      font-size:12px;
                      line-height:1.5;
                    "
                  >
                    ${description}
                  </div>
                `
                : ''
            }

          </div>

          <table
            width="100%"
            cellpadding="0"
            cellspacing="0"
            style="
              margin-bottom:24px;
              border-collapse:collapse;
            "
          >

            <tr>
              <td
                style="
                  padding:12px 0;
                  border-bottom:1px solid #232323;
                  color:#707070;
                  font-size:12px;
                "
              >
                Marca / Projeto
              </td>

              <td
                align="right"
                style="
                  padding:12px 0;
                  border-bottom:1px solid #232323;
                  color:#ffffff;
                  font-size:12px;
                  font-weight:700;
                "
              >
                ${
                  brandName ||
                  'Central de Pagamentos'
                }
              </td>
            </tr>

            <tr>
              <td
                style="
                  padding:12px 0;
                  border-bottom:1px solid #232323;
                  color:#707070;
                  font-size:12px;
                "
              >
                Forma de pagamento
              </td>

              <td
                align="right"
                style="
                  padding:12px 0;
                  border-bottom:1px solid #232323;
                  color:#ffffff;
                  font-size:12px;
                  font-weight:700;
                "
              >
                ${
                  paymentMethodLabel(
                    paymentMethod
                  )
                }
              </td>
            </tr>

            <tr>
              <td
                style="
                  padding:12px 0;
                  border-bottom:1px solid #232323;
                  color:#707070;
                  font-size:12px;
                "
              >
                Parcelas
              </td>

              <td
                align="right"
                style="
                  padding:12px 0;
                  border-bottom:1px solid #232323;
                  color:#ffffff;
                  font-size:12px;
                  font-weight:700;
                "
              >
                ${
                  installments ||
                  1
                }x
              </td>
            </tr>

            <tr>
              <td
                style="
                  padding:12px 0;
                  border-bottom:1px solid #232323;
                  color:#707070;
                  font-size:12px;
                "
              >
                Data
              </td>

              <td
                align="right"
                style="
                  padding:12px 0;
                  border-bottom:1px solid #232323;
                  color:#ffffff;
                  font-size:12px;
                  font-weight:700;
                "
              >
                ${formattedDate}
              </td>
            </tr>

            <tr>
              <td
                style="
                  padding:12px 0;
                  color:#707070;
                  font-size:12px;
                "
              >
                Referência
              </td>

              <td
                align="right"
                style="
                  padding:12px 0;
                  color:#ffffff;
                  font-size:12px;
                  font-weight:700;
                "
              >
                ${
                  referenceCode ||
                  '—'
                }
              </td>
            </tr>

          </table>

          <div
            style="
              margin-bottom:20px;
              padding:20px;
              border-radius:14px;
              background:#0c1710;
              border:1px solid #1b432a;
            "
          >

            <div
              style="
                margin-bottom:8px;
                color:#22c55e;
                font-size:10px;
                font-weight:800;
                letter-spacing:1.5px;
                text-transform:uppercase;
              "
            >
              Comprovante exclusivo
            </div>

            <div
              style="
                margin-bottom:8px;
                color:#ffffff;
                font-size:18px;
                font-weight:800;
              "
            >
              Seu comprovante está disponível.
            </div>

            <div
              style="
                margin-bottom:16px;
                color:#8a8a8a;
                font-size:12px;
                line-height:1.6;
              "
            >
              Guarde o código abaixo para
              validação deste documento.
            </div>

            <div
              style="
                padding:14px;
                border-radius:10px;
                background:#080808;
                border:1px dashed #34513e;
                color:#ffffff;
                text-align:center;
                font-size:15px;
                font-weight:800;
                letter-spacing:1px;
              "
            >
              ${validationCode}
            </div>

          </div>

          <a
            href="${receiptUrl}"
            style="
              display:block;
              padding:16px;
              border-radius:12px;
              background:#ef2b35;
              color:#ffffff;
              text-align:center;
              text-decoration:none;
              font-size:13px;
              font-weight:800;
            "
          >
            VISUALIZAR MEU COMPROVANTE
          </a>

          ${
            infinitePayReceiptUrl
              ? `
                <a
                  href="${infinitePayReceiptUrl}"
                  style="
                    display:block;
                    margin-top:10px;
                    padding:14px;
                    border-radius:12px;
                    background:#171717;
                    border:1px solid #2b2b2b;
                    color:#cfcfcf;
                    text-align:center;
                    text-decoration:none;
                    font-size:12px;
                    font-weight:700;
                  "
                >
                  Ver comprovante da InfinitePay
                </a>
              `
              : ''
          }

        </div>

      </div>

      <div
        style="
          padding:20px 4px 0;
          color:#555555;
          text-align:center;
          font-size:10px;
          line-height:1.6;
        "
      >
        Este e-mail foi enviado automaticamente
        pela Central de Pagamentos.
        <br>
        Comprovante ${receiptNumber}
      </div>

    </div>

  </div>
</body>
</html>
`;
}

async function sendEmail({
  to,
  subject,
  html,
}) {
  if (
    !RESEND_API_KEY
  ) {
    console.warn(
      'RESEND_API_KEY não configurada.'
    );

    return {
      sent: false,
      reason:
        'RESEND_API_KEY_MISSING',
    };
  }

  const response =
    await fetch(
      'https://api.resend.com/emails',
      {
        method: 'POST',

        headers: {
          Authorization:
            `Bearer ${RESEND_API_KEY}`,

          'Content-Type':
            'application/json',
        },

        body: JSON.stringify({
          from:
            EMAIL_FROM,

          to: [
            to,
          ],

          subject,

          html,
        }),
      }
    );

  let data = null;

  try {
    data =
      await response.json();
  } catch {
    data = null;
  }

  if (
    !response.ok
  ) {
    console.error(
      'Erro Resend:',
      data
    );

    return {
      sent: false,
      reason:
        'RESEND_ERROR',
      response:
        data,
    };
  }

  return {
    sent: true,
    id:
      data?.id ||
      null,
  };
}

export default async function handler(
  req,
  res
) {
  if (
    req.method !== 'POST'
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

    const payload =
      req.body ||
      {};

    /*
     * Dados enviados pela InfinitePay
     */
    const invoiceSlug =
      payload.invoice_slug ||
      null;

    const orderNsu =
      payload.order_nsu ||
      null;

    const transactionNsu =
      payload.transaction_nsu ||
      null;

    const captureMethod =
      payload.capture_method ||
      null;

    const installments =
      Number(
        payload.installments ||
        1
      );

    if (
      !orderNsu
    ) {
      console.error(
        'Webhook sem order_nsu:',
        payload
      );

      return json(res, 400, {
        success: false,
        message:
          'order_nsu não informado.',
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

    /*
     * Localiza a cobrança pela referência
     * que nós mesmos enviamos para a InfinitePay.
     */
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
          status
        `)
        .eq(
          'reference_code',
          orderNsu
        )
        .maybeSingle();

    if (
      chargeError
    ) {
      console.error(
        'Erro ao localizar cobrança:',
        chargeError
      );

      return json(res, 500, {
        success: false,
        message:
          'Erro ao localizar cobrança.',
      });
    }

    if (
      !charge
    ) {
      console.error(
        'Cobrança não encontrada:',
        orderNsu
      );

      return json(res, 400, {
        success: false,
        message:
          'Pedido não encontrado.',
      });
    }

    /*
     * Idempotência:
     * evita registrar duas vezes o mesmo pagamento.
     */
    if (
      transactionNsu
    ) {
      const {
        data: existingPayment,
      } =
        await supabaseAdmin
          .from('payments')
          .select(`
            id,
            charge_id
          `)
          .eq(
            'gateway_transaction_id',
            transactionNsu
          )
          .maybeSingle();

      if (
        existingPayment
      ) {
        return json(res, 200, {
          success: true,
          duplicate: true,
          message:
            'Pagamento já processado.',
        });
      }
    }

    /*
     * Segunda proteção contra duplicidade.
     */
    const {
      data: existingOrderPayment,
    } =
      await supabaseAdmin
        .from('payments')
        .select(`
          id,
          charge_id,
          status
        `)
        .eq(
          'gateway',
          'infinitepay'
        )
        .eq(
          'gateway_order_id',
          orderNsu
        )
        .eq(
          'status',
          'paid'
        )
        .maybeSingle();

    if (
      existingOrderPayment
    ) {
      return json(res, 200, {
        success: true,
        duplicate: true,
        message:
          'Pagamento desse pedido já está registrado.',
      });
    }

    /*
     * A InfinitePay envia amount e paid_amount
     * em centavos.
     */
    const amountInCents =
      Number(
        payload.amount ||
        0
      );

    const paidAmountInCents =
      Number(
        payload.paid_amount ??
        payload.amount ??
        0
      );

    if (
      !Number.isFinite(
        amountInCents
      ) ||
      amountInCents <= 0
    ) {
      return json(res, 400, {
        success: false,
        message:
          'Valor do pagamento inválido.',
      });
    }

    const amount =
      amountInCents /
      100;

    const paidAmount =
      Number.isFinite(
        paidAmountInCents
      )
        ? paidAmountInCents /
          100
        : amount;

    /*
     * No fluxo atual, usamos o valor da cobrança
     * como valor bruto recebido.
     *
     * A diferença entre paid_amount e amount será
     * armazenada como taxa quando existir.
     */
    const feeAmount =
      Math.max(
        paidAmount -
          amount,
        0
      );

    const netAmount =
      Math.max(
        amount -
          feeAmount,
        0
      );

    const paidAt =
      new Date().toISOString();

    /*
     * Busca cliente.
     */
    const {
      data: client,
      error: clientError,
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

    if (
      clientError
    ) {
      console.warn(
        'Erro buscando cliente:',
        clientError
      );
    }

    /*
     * Busca marca.
     */
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
          email
        `)
        .eq(
          'id',
          charge.brand_id
        )
        .maybeSingle();

    /*
     * Registra o pagamento.
     */
    const {
      data: payment,
      error: paymentError,
    } =
      await supabaseAdmin
        .from('payments')
        .insert({
          owner_id:
            charge.owner_id,

          charge_id:
            charge.id,

          gateway:
            'infinitepay',

          gateway_transaction_id:
            transactionNsu,

          gateway_order_id:
            orderNsu,

          gateway_invoice_id:
            invoiceSlug,

          amount:
            amount,

          fee_amount:
            feeAmount,

          net_amount:
            netAmount,

          payment_method:
            normalizePaymentMethod(
              captureMethod
            ),

          installments:
            installments,

          status:
            'paid',

          paid_at:
            paidAt,

          created_at:
            paidAt,

          updated_at:
            paidAt,
        })
        .select(`
          id
        `)
        .single();

    if (
      paymentError ||
      !payment
    ) {
      console.error(
        'Erro registrando pagamento:',
        paymentError
      );

      return json(res, 500, {
        success: false,
        message:
          'Não foi possível registrar o pagamento.',
      });
    }

    /*
     * Atualiza a cobrança.
     */
    const {
      error: updateChargeError,
    } =
      await supabaseAdmin
        .from('charges')
        .update({
          status:
            'paid',

          paid_at:
            paidAt,

          gateway:
            'infinitepay',

          gateway_checkout_id:
            invoiceSlug,

          updated_at:
            paidAt,
        })
        .eq(
          'id',
          charge.id
        )
        .eq(
          'owner_id',
          charge.owner_id
        );

    if (
      updateChargeError
    ) {
      console.error(
        'Erro atualizando cobrança:',
        updateChargeError
      );

      return json(res, 500, {
        success: false,
        message:
          'Pagamento registrado, mas a cobrança não foi atualizada.',
      });
    }

    /*
     * Cria o comprovante.
     */
    let receipt = null;

    const {
      data: existingReceipt,
    } =
      await supabaseAdmin
        .from('receipts')
        .select(`
          id,
          receipt_number,
          validation_code
        `)
        .eq(
          'payment_id',
          payment.id
        )
        .maybeSingle();

    if (
      existingReceipt
    ) {
      receipt =
        existingReceipt;
    } else {
      const {
        data: newReceipt,
        error: receiptError,
      } =
        await supabaseAdmin
          .from('receipts')
          .insert({
            owner_id:
              charge.owner_id,

            payment_id:
              payment.id,

            receipt_number:
              createReceiptNumber(),

            validation_code:
              createValidationCode(),

            issued_at:
              paidAt,

            created_at:
              paidAt,
          })
          .select(`
            id,
            receipt_number,
            validation_code
          `)
          .single();

      if (
        receiptError ||
        !newReceipt
      ) {
        console.error(
          'Erro criando comprovante:',
          receiptError
        );

        return json(res, 500, {
          success: false,
          message:
            'Pagamento confirmado, mas o comprovante não pôde ser criado.',
        });
      }

      receipt =
        newReceipt;
    }

    /*
     * Registra o evento recebido.
     */
    const externalEventId =
      transactionNsu ||
      invoiceSlug ||
      orderNsu;

    const {
      data: existingEvent,
    } =
      await supabaseAdmin
        .from('payment_events')
        .select(`
          id
        `)
        .eq(
          'external_event_id',
          externalEventId
        )
        .eq(
          'gateway',
          'infinitepay'
        )
        .maybeSingle();

    if (
      !existingEvent
    ) {
      const {
        error: eventError,
      } =
        await supabaseAdmin
          .from('payment_events')
          .insert({
            owner_id:
              charge.owner_id,

            payment_id:
              payment.id,

            charge_id:
              charge.id,

            gateway:
              'infinitepay',

            event_type:
              'payment.approved',

            external_event_id:
              externalEventId,

            payload:
              payload,

            processed:
              true,

            processed_at:
              paidAt,

            created_at:
              paidAt,
          });

      if (
        eventError
      ) {
        console.warn(
          'Não foi possível salvar payment_event:',
          eventError
        );
      }
    }

    /*
     * URL pública do comprovante.
     */
    const receiptUrl =
      `${SITE_URL}/pagamentos/comprovante?code=${encodeURIComponent(
        receipt.validation_code
      )}`;

    /*
     * Envia e-mail.
     */
    let emailResult = {
      sent: false,
      reason:
        'CLIENT_EMAIL_MISSING',
    };

    if (
      client?.email
    ) {
      const html =
        buildEmailHtml({
          brandName:
            brand?.display_name ||
            brand?.name ||
            'Central de Pagamentos',

          brandLogo:
            brand?.logo_url ||
            null,

          clientName:
            client.name,

          title:
            charge.title,

          description:
            charge.description,

          amount:
            amount,

          paidAt:
            paidAt,

          paymentMethod:
            captureMethod,

          installments:
            installments,

          receiptNumber:
            receipt.receipt_number,

          validationCode:
            receipt.validation_code,

          receiptUrl:
            receiptUrl,

          infinitePayReceiptUrl:
            payload.receipt_url ||
            null,

          referenceCode:
            charge.reference_code,
        });

      emailResult =
        await sendEmail({
          to:
            client.email,

          subject:
            `Pagamento confirmado • ${money(
              amount
            )}`,

          html:
            html,
        });
    }

    console.log(
      'WEBHOOK PROCESSADO:',
      {
        chargeId:
          charge.id,

        paymentId:
          payment.id,

        orderNsu:
          orderNsu,

        transactionNsu:
          transactionNsu,

        amount:
          amount,

        paymentMethod:
          captureMethod,

        receipt:
          receipt.receipt_number,

        receiptUrl:
          receiptUrl,

        email:
          emailResult,
      }
    );

    /*
     * Resposta esperada pela InfinitePay.
     */
    return json(res, 200, {
      success: true,
      message: null,
      payment_id:
        payment.id,
      receipt_number:
        receipt.receipt_number,
      receipt_url:
        receiptUrl,
    });
  } catch (error) {
    console.error(
      'ERRO NO WEBHOOK INFINITEPAY:',
      error
    );

    return json(res, 500, {
      success: false,
      message:
        error?.message ||
        'Erro interno ao processar pagamento.',
    });
  }
}