// ============================================
// SEVEN PERFORMANCE — Google Apps Script
// 1. Acesse script.google.com
// 2. Crie novo projeto (+ Novo projeto)
// 3. Cole todo este código
// 4. Clique em "Implantar" → "Nova implantação"
// 5. Tipo: App da Web
// 6. Executar como: Eu (io.tiagopace@gmail.com)
// 7. Quem tem acesso: Qualquer pessoa
// 8. Clique em Implantar e copie a URL gerada
// ============================================

const EMAIL_RECEBE = 'eliade@sevenperformance.com.br';
const SHEET_NAME   = 'Leads Seven Performance';

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    salvarNaPlanilha(data);
    enviarEmail(data);
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'ok' }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'erro', msg: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function salvarNaPlanilha(data) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);

  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    const headers = ['Data/Hora','Nome','Empresa','WhatsApp','E-mail','Foco','Momento','Prazo','Faturamento','Desafio'];
    sheet.appendRow(headers);
    const headerRange = sheet.getRange(1, 1, 1, headers.length);
    headerRange.setFontWeight('bold').setBackground('#042698').setFontColor('#ffffff');
    sheet.setFrozenRows(1);
    sheet.setColumnWidth(1, 160);
    sheet.setColumnWidth(10, 300);
  }

  sheet.appendRow([
    new Date().toLocaleString('pt-BR'),
    data.nome       || '',
    data.empresa    || '',
    data.whatsapp   || '',
    data.email      || '',
    data.foco       || '',
    data.momento    || '',
    data.prazo      || '',
    data.faturamento|| '',
    data.desafio    || ''
  ]);
}

function enviarEmail(data) {
  const assunto = `🎯 Novo lead: ${data.nome} — ${data.empresa}`;

  const corpo = `
<div style="font-family:Arial,sans-serif;max-width:620px;margin:0 auto;border-radius:12px;overflow:hidden;border:1px solid #ddd">
  <div style="background:#042698;padding:28px 32px">
    <img src="https://sevenperformance.vercel.app/assets/logo_v1.png" height="36" alt="Seven Performance" style="display:block">
    <p style="color:rgba(255,255,255,.75);margin:12px 0 0;font-size:14px">Novo lead recebido via site</p>
  </div>
  <div style="background:#ffffff;padding:28px 32px">
    <table style="width:100%;border-collapse:collapse;font-size:15px">
      <tr style="border-bottom:1px solid #f0f0f0">
        <td style="padding:12px 0;color:#888;width:140px;font-size:13px;text-transform:uppercase;letter-spacing:.04em">Nome</td>
        <td style="padding:12px 0;font-weight:600;color:#0D1117">${data.nome || '—'}</td>
      </tr>
      <tr style="border-bottom:1px solid #f0f0f0">
        <td style="padding:12px 0;color:#888;font-size:13px;text-transform:uppercase;letter-spacing:.04em">Empresa</td>
        <td style="padding:12px 0;color:#0D1117">${data.empresa || '—'}</td>
      </tr>
      <tr style="border-bottom:1px solid #f0f0f0">
        <td style="padding:12px 0;color:#888;font-size:13px;text-transform:uppercase;letter-spacing:.04em">WhatsApp</td>
        <td style="padding:12px 0">
          <a href="https://wa.me/55${(data.whatsapp || '').replace(/\D/g, '')}" style="color:#116CF8;font-weight:600">${data.whatsapp || '—'}</a>
        </td>
      </tr>
      <tr style="border-bottom:1px solid #f0f0f0">
        <td style="padding:12px 0;color:#888;font-size:13px;text-transform:uppercase;letter-spacing:.04em">E-mail</td>
        <td style="padding:12px 0"><a href="mailto:${data.email}" style="color:#116CF8">${data.email || '—'}</a></td>
      </tr>
      <tr style="border-bottom:1px solid #f0f0f0">
        <td style="padding:12px 0;color:#888;font-size:13px;text-transform:uppercase;letter-spacing:.04em">Foco</td>
        <td style="padding:12px 0;color:#0D1117">${data.foco || '—'}</td>
      </tr>
      <tr style="border-bottom:1px solid #f0f0f0">
        <td style="padding:12px 0;color:#888;font-size:13px;text-transform:uppercase;letter-spacing:.04em">Momento</td>
        <td style="padding:12px 0;color:#0D1117">${data.momento || '—'}</td>
      </tr>
      <tr style="border-bottom:1px solid #f0f0f0">
        <td style="padding:12px 0;color:#888;font-size:13px;text-transform:uppercase;letter-spacing:.04em">Prazo</td>
        <td style="padding:12px 0;color:#0D1117">${data.prazo || '—'}</td>
      </tr>
      <tr style="border-bottom:1px solid #f0f0f0">
        <td style="padding:12px 0;color:#888;font-size:13px;text-transform:uppercase;letter-spacing:.04em">Faturamento</td>
        <td style="padding:12px 0;color:#0D1117">${data.faturamento || 'Não informado'}</td>
      </tr>
      <tr>
        <td style="padding:12px 0;color:#888;font-size:13px;text-transform:uppercase;letter-spacing:.04em;vertical-align:top">Desafio</td>
        <td style="padding:12px 0;color:#0D1117;line-height:1.6">${data.desafio || '—'}</td>
      </tr>
    </table>

    <div style="margin-top:24px">
      <a href="https://wa.me/55${(data.whatsapp || '').replace(/\D/g, '')}?text=Ol%C3%A1%20${encodeURIComponent(data.nome || '')}%2C%20vi%20sua%20mensagem%20no%20site%20da%20Seven%20Performance!"
         style="display:inline-block;background:#116CF8;color:#fff;padding:14px 28px;border-radius:999px;text-decoration:none;font-weight:700;font-size:14px">
        Responder via WhatsApp →
      </a>
    </div>
  </div>
  <div style="background:#f8f8f8;padding:16px 32px;font-size:12px;color:#aaa;border-top:1px solid #eee">
    Enviado em ${new Date().toLocaleString('pt-BR')} via sevenperformance.com.br
  </div>
</div>`;

  GmailApp.sendEmail(EMAIL_RECEBE, assunto, '', { htmlBody: corpo, name: 'Seven Performance Site' });
}
