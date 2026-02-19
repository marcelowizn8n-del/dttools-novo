import nodemailer from "nodemailer";

function getFrontendBaseUrl(): string {
  const configured = (process.env.FRONTEND_URL || "")
    .split(",")
    .map((url) => url.trim())
    .filter(Boolean);

  const first = configured[0] || "https://www.dttools.app";
  return first.replace(/\/$/, "");
}

// Create reusable transporter
function createTransporter() {
  const host = process.env.SMTP_HOST || "smtp.gmail.com";
  const port = parseInt(process.env.SMTP_PORT || "587");
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!user || !pass) {
    console.warn("⚠️ SMTP_USER or SMTP_PASS not configured — emails will not be sent");
    return null;
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });
}

let transporter: nodemailer.Transporter | null = null;

function getTransporter() {
  if (!transporter) {
    transporter = createTransporter();
  }
  return transporter;
}

const FROM_NAME = "Design Thinking Tools";
const FROM_EMAIL = process.env.SMTP_FROM || process.env.SMTP_USER || "noreply@dttools.app";

export async function sendInviteEmail(params: {
  to: string;
  inviterName: string;
  projectName: string;
  role: string;
  token: string;
}): Promise<boolean> {
  const t = getTransporter();
  if (!t) {
    console.warn("⚠️ Email transporter not available — skipping invite email to", params.to);
    return false;
  }

  const frontendBaseUrl = getFrontendBaseUrl();
  const acceptUrl = `${frontendBaseUrl}/invite/accept?token=${params.token}`;
  const rolePt = params.role === "editor" ? "Editor" : "Visualizador";

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background:#f4f4f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f5;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);">
          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#6366f1,#8b5cf6);padding:32px 40px;text-align:center;">
              <h1 style="margin:0;color:#ffffff;font-size:24px;font-weight:700;">Design Thinking Tools</h1>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding:40px;">
              <h2 style="margin:0 0 16px;color:#18181b;font-size:20px;">Você foi convidado para colaborar!</h2>
              <p style="margin:0 0 24px;color:#52525b;font-size:16px;line-height:1.6;">
                <strong>${params.inviterName}</strong> convidou você para participar do projeto
                <strong>"${params.projectName}"</strong> como <strong>${rolePt}</strong>.
              </p>
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="padding:8px 0 32px;">
                    <a href="${acceptUrl}" style="display:inline-block;background:linear-gradient(135deg,#6366f1,#8b5cf6);color:#ffffff;text-decoration:none;padding:14px 40px;border-radius:8px;font-size:16px;font-weight:600;">
                      Aceitar Convite
                    </a>
                  </td>
                </tr>
              </table>
              <p style="margin:0 0 8px;color:#71717a;font-size:14px;">
                Se o botão não funcionar, copie e cole este link no navegador:
              </p>
              <p style="margin:0 0 24px;color:#6366f1;font-size:13px;word-break:break-all;">
                ${acceptUrl}
              </p>
              <hr style="border:none;border-top:1px solid #e4e4e7;margin:24px 0;">
              <p style="margin:0;color:#a1a1aa;font-size:12px;">
                Este convite expira em 7 dias. Se você não reconhece este convite, pode ignorar este e-mail.
              </p>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="background:#fafafa;padding:20px 40px;text-align:center;">
              <p style="margin:0;color:#a1a1aa;font-size:12px;">
                &copy; ${new Date().getFullYear()} Design Thinking Tools &mdash;
                <a href="${frontendBaseUrl}" style="color:#6366f1;text-decoration:none;">dttools.app</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  try {
    await t.sendMail({
      from: `"${FROM_NAME}" <${FROM_EMAIL}>`,
      to: params.to,
      subject: `${params.inviterName} convidou você para o projeto "${params.projectName}" — DTTools`,
      html,
    });
    console.log(`✅ Invite email sent to ${params.to}`);
    return true;
  } catch (error) {
    console.error("❌ Failed to send invite email:", error);
    return false;
  }
}
