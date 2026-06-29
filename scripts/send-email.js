require('dotenv').config();

const nodemailer = require('nodemailer');

const {
  NOTIFY_EMAIL,
  SMTP_HOST = 'localhost',
  SMTP_PORT = '1025',
  SMTP_SECURE,
  SMTP_USER,
  SMTP_PASSWORD,
  BUILD_NUMBER = 'local',
  BUILD_STATUS = 'finalizado',
  JOB_NAME = 'biblioteca-np3',
  BUILD_URL = '',
} = process.env;

if (!NOTIFY_EMAIL) {
  console.error('Variavel NOTIFY_EMAIL nao configurada.');
  process.exit(1);
}

if ((SMTP_USER && !SMTP_PASSWORD) || (!SMTP_USER && SMTP_PASSWORD)) {
  console.error('Configure SMTP_USER e SMTP_PASSWORD juntos, ou remova os dois para usar MailHog.');
  process.exit(1);
}

const smtpPort = Number(SMTP_PORT);
const smtpSecure = SMTP_SECURE ? SMTP_SECURE === 'true' : smtpPort === 465;
const from = process.env.MAIL_FROM || SMTP_USER || 'jenkins@biblioteca-np3.local';
const subject = `[Biblioteca NP3] Pipeline ${BUILD_STATUS}`;
const body = [
  `Projeto: ${JOB_NAME}`,
  `Build: ${BUILD_NUMBER}`,
  `Status: ${BUILD_STATUS}`,
  BUILD_URL ? `URL: ${BUILD_URL}` : null,
  '',
  'Mensagem enviada pelo pipeline usando variaveis de ambiente.',
].filter(Boolean).join('\n');

async function sendEmail() {
  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: smtpPort,
    secure: smtpSecure,
    auth: SMTP_USER && SMTP_PASSWORD
      ? {
          user: SMTP_USER,
          pass: SMTP_PASSWORD,
        }
      : undefined,
  });

  await transporter.sendMail({
    from,
    to: NOTIFY_EMAIL,
    subject,
    text: body,
  });

  console.log(`Notificacao enviada para ${NOTIFY_EMAIL}`);
}

sendEmail().catch((error) => {
  console.error(`Falha ao enviar notificacao: ${error.message}`);
  process.exit(1);
});
