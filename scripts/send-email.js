const net = require('net');

const {
  NOTIFY_EMAIL,
  SMTP_HOST = 'localhost',
  SMTP_PORT = '1025',
  BUILD_NUMBER = 'local',
  BUILD_STATUS = 'finalizado',
  JOB_NAME = 'biblioteca-np3',
  BUILD_URL = '',
} = process.env;

if (!NOTIFY_EMAIL) {
  console.error('Variavel NOTIFY_EMAIL nao configurada.');
  process.exit(1);
}

const from = process.env.MAIL_FROM || 'jenkins@biblioteca-np3.local';
const subject = `[Biblioteca NP3] Pipeline ${BUILD_STATUS}`;
const body = [
  `Projeto: ${JOB_NAME}`,
  `Build: ${BUILD_NUMBER}`,
  `Status: ${BUILD_STATUS}`,
  BUILD_URL ? `URL: ${BUILD_URL}` : null,
  '',
  'Mensagem enviada pelo pipeline usando variaveis de ambiente.',
].filter(Boolean).join('\n');

function waitForResponse(socket, expectedCode) {
  return new Promise((resolve, reject) => {
    let buffer = '';

    const onData = (chunk) => {
      buffer += chunk.toString('utf8');
      const lines = buffer.split(/\r?\n/).filter(Boolean);
      const lastLine = lines[lines.length - 1] || '';

      if (/^\d{3} /.test(lastLine)) {
        socket.off('data', onData);

        if (lastLine.startsWith(`${expectedCode} `)) {
          resolve(lastLine);
        } else {
          reject(new Error(`Resposta SMTP inesperada: ${lastLine}`));
        }
      }
    };

    socket.on('data', onData);
  });
}

async function sendCommand(socket, command, expectedCode) {
  const response = waitForResponse(socket, expectedCode);
  socket.write(`${command}\r\n`);
  return response;
}

async function sendEmail() {
  const socket = net.createConnection(Number(SMTP_PORT), SMTP_HOST);

  await new Promise((resolve, reject) => {
    socket.once('connect', resolve);
    socket.once('error', reject);
  });

  await waitForResponse(socket, 220);
  await sendCommand(socket, 'HELO biblioteca-np3.local', 250);
  await sendCommand(socket, `MAIL FROM:<${from}>`, 250);
  await sendCommand(socket, `RCPT TO:<${NOTIFY_EMAIL}>`, 250);
  await sendCommand(socket, 'DATA', 354);

  const message = [
    `From: ${from}`,
    `To: ${NOTIFY_EMAIL}`,
    `Subject: ${subject}`,
    'Content-Type: text/plain; charset=utf-8',
    '',
    body,
    '.',
  ].join('\r\n');

  const dataResponse = waitForResponse(socket, 250);
  socket.write(`${message}\r\n`);
  await dataResponse;
  await sendCommand(socket, 'QUIT', 221);
  socket.end();

  console.log(`Notificacao enviada para ${NOTIFY_EMAIL}`);
}

sendEmail().catch((error) => {
  console.error(`Falha ao enviar notificacao: ${error.message}`);
  process.exit(1);
});
