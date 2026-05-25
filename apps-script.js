// ============================================
// SEVEN PERFORMANCE — Google Apps Script v2
// 1. Acesse script.google.com
// 2. Substitua TODO o código pelo conteúdo abaixo
// 3. Clique em "Implantar" → "Gerenciar implantações"
// 4. Edite a implantação existente (lápis) → Nova versão → Implantar
// ============================================

const EMAIL_RECEBE = 'eliade@sevenperformance.com.br';
const SHEET_NAME   = 'Leads Seven Performance';

function doPost(e) {
  try {
    // Aceita tanto JSON quanto form-data
    let data = {};
    if (e.postData && e.postData.type === 'application/json') {
      data = JSON.parse(e.postData.contents);
    } else if (e.postData && e.postData.contents) {
      // tenta JSON mesmo sem content-type correto
      try { data = JSON.parse(e.postData.contents); } catch(ex) {}
    }
    // fallback: parâmetros de query
    if (e.parameter) {
      Object.keys(e.parameter).forEach(k => { if (!data[k]) data[k] = e.parameter[k]; });
    }

    salvarNaPlanilha(data);
    enviarEmail(data);

    return ContentService
      .createTextOutput(JSON.stringify({ status: 'ok' }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    Logger.log('Erro: ' + err.message);
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'erro', msg: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Permite testar via GET no browser
function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({ status: 'online', msg: 'Apps Script Seven Performance ativo' }))
    .setMimeType(ContentService.MimeType.JSON);
}

function salvarNaPlanilha(data) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);

  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    const headers = ['Data/Hora','Nome','Empresa','WhatsApp','E-mail','Foco','Momento','Prazo','Faturamento','Desafio'];
    sheet.appendRow(headers);
    const hr = sheet.getRange(1, 1, 1, headers.length);
    hr.setFontWeight('bold').setBackground('#042698').setFontColor('#ffffff');
    sheet.setFrozenRows(1);
    sheet.setColumnWidth(1, 160);
    sheet.setColumnWidth(10, 320);
  }

  sheet.appendRow([
    new Date().toLocaleString('pt-BR'),
    data.nome        || '',
    data.empresa     || '',
    data.whatsapp    || '',
    data.email       || '',
    data.foco        || '',
    data.momento     || '',
    data.prazo       || '',
    data.faturamento || '',
    data.desafio     || ''
  ]);
}

function enviarEmail(data) {
  const nome     = data.nome        || 'Não informado';
  const empresa  = data.empresa     || 'Não informado';
  const whatsapp = data.whatsapp    || '';
  const email    = data.email       || '';
  const foco     = data.foco        || 'Não informado';
  const momento  = data.momento     || 'Não informado';
  const prazo    = data.prazo       || 'Não informado';
  const fat      = data.faturamento || 'Não informado';
  const desafio  = data.desafio     || 'Não informado';
  const waNum    = whatsapp.replace(/\D/g, '');
  const waLink   = waNum ? `https://wa.me/55${waNum}` : '#';

  const assunto = `Novo lead: ${nome} — ${empresa}`;

  const corpo = `
<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;background:#f0f2f5;font-family:Arial,sans-serif">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f0f2f5;padding:32px 0">
  <tr><td align="center">
    <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,.10)">

      <!-- HEADER -->
      <tr>
        <td style="background:#050F26;padding:28px 32px">
          <p style="margin:0;color:#116CF8;font-size:11px;font-weight:700;letter-spacing:.16em;text-transform:uppercase">Seven Performance</p>
          <h1 style="margin:8px 0 0;color:#ffffff;font-size:26px;font-weight:700">Novo lead recebido</h1>
          <p style="margin:6px 0 0;color:rgba(255,255,255,.55);font-size:13px">${new Date().toLocaleString('pt-BR')}</p>
        </td>
      </tr>

      <!-- DESTAQUE -->
      <tr>
        <td style="background:#116CF8;padding:20px 32px">
          <p style="margin:0;color:rgba(255,255,255,.75);font-size:11px;text-transform:uppercase;letter-spacing:.12em">Quem entrou em contato</p>
          <p style="margin:4px 0 0;color:#ffffff;font-size:22px;font-weight:700">${nome} &mdash; ${empresa}</p>
        </td>
      </tr>

      <!-- DADOS -->
      <tr>
        <td style="background:#ffffff;padding:28px 32px">
          <table width="100%" cellpadding="0" cellspacing="0">
            ${whatsapp ? `
            <tr>
              <td style="padding:10px 0;border-bottom:1px solid #f0f0f0;color:#888;font-size:12px;text-transform:uppercase;letter-spacing:.08em;width:140px">WhatsApp</td>
              <td style="padding:10px 0;border-bottom:1px solid #f0f0f0"><a href="${waLink}" style="color:#116CF8;font-weight:700;text-decoration:none">${whatsapp}</a></td>
            </tr>` : ''}
            ${email ? `
            <tr>
              <td style="padding:10px 0;border-bottom:1px solid #f0f0f0;color:#888;font-size:12px;text-transform:uppercase;letter-spacing:.08em">E-mail</td>
              <td style="padding:10px 0;border-bottom:1px solid #f0f0f0"><a href="mailto:${email}" style="color:#116CF8;text-decoration:none">${email}</a></td>
            </tr>` : ''}
            <tr>
              <td style="padding:10px 0;border-bottom:1px solid #f0f0f0;color:#888;font-size:12px;text-transform:uppercase;letter-spacing:.08em">Foco</td>
              <td style="padding:10px 0;border-bottom:1px solid #f0f0f0;color:#0D1117">${foco}</td>
            </tr>
            <tr>
              <td style="padding:10px 0;border-bottom:1px solid #f0f0f0;color:#888;font-size:12px;text-transform:uppercase;letter-spacing:.08em">Momento</td>
              <td style="padding:10px 0;border-bottom:1px solid #f0f0f0;color:#0D1117">${momento}</td>
            </tr>
            <tr>
              <td style="padding:10px 0;border-bottom:1px solid #f0f0f0;color:#888;font-size:12px;text-transform:uppercase;letter-spacing:.08em">Prazo</td>
              <td style="padding:10px 0;border-bottom:1px solid #f0f0f0;color:#0D1117">${prazo}</td>
            </tr>
            <tr>
              <td style="padding:10px 0;border-bottom:1px solid #f0f0f0;color:#888;font-size:12px;text-transform:uppercase;letter-spacing:.08em">Faturamento</td>
              <td style="padding:10px 0;border-bottom:1px solid #f0f0f0;color:#0D1117">${fat}</td>
            </tr>
            <tr>
              <td style="padding:10px 0;color:#888;font-size:12px;text-transform:uppercase;letter-spacing:.08em;vertical-align:top">Desafio</td>
              <td style="padding:10px 0;color:#0D1117;line-height:1.6">${desafio}</td>
            </tr>
          </table>

          ${waNum ? `
          <div style="margin-top:24px;text-align:center">
            <a href="${waLink}?text=Ol%C3%A1%20${encodeURIComponent(nome)}%2C%20recebi%20seu%20contato%20pelo%20site%20da%20Seven%20Performance!"
               style="display:inline-block;background:#25D366;color:#fff;padding:14px 32px;border-radius:999px;text-decoration:none;font-weight:700;font-size:15px">
              Responder no WhatsApp
            </a>
          </div>` : ''}
        </td>
      </tr>

      <!-- FOOTER -->
      <tr>
        <td style="background:#f8f8f8;padding:16px 32px;border-top:1px solid #eee">
          <p style="margin:0;color:#aaa;font-size:12px">Seven Performance &middot; sevenperformance.com.br</p>
        </td>
      </tr>

    </table>
  </td></tr>
</table>
</body>
</html>`;

  GmailApp.sendEmail(EMAIL_RECEBE, assunto, '', {
    htmlBody: corpo,
    name: 'Seven Performance Site'
  });
}
