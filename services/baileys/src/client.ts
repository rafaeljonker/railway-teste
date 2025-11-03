import makeWASocket, {
  DisconnectReason,
  useMultiFileAuthState,
  WASocket,
} from '@whiskeysockets/baileys';
import { Boom } from '@hapi/boom';
import pino from 'pino';
import qrcode from 'qrcode-terminal';

const logger = pino({ level: process.env.LOG_LEVEL || 'info' });

export class BaileysClient {
  private sock: WASocket | null = null;
  private userInfo: any = null;

  async connect(): Promise<WASocket> {
    const authPath = process.env.AUTH_PATH || './baileys_auth';
    const { state, saveCreds } = await useMultiFileAuthState(authPath);

    this.sock = makeWASocket({
      auth: state,
      printQRInTerminal: false,
      logger: pino({ level: 'silent' }),
    });

    // Handle QR code
    this.sock.ev.on('connection.update', async (update) => {
      const { connection, lastDisconnect, qr } = update;

      if (qr) {
        logger.info('📱 QR Code gerado - escaneie com seu WhatsApp:');
        qrcode.generate(qr, { small: true });
      }

      if (connection === 'close') {
        const shouldReconnect =
          (lastDisconnect?.error as Boom)?.output?.statusCode !==
          DisconnectReason.loggedOut;

        logger.info(
          { shouldReconnect },
          'Conexão fechada. Reconectando...'
        );

        if (shouldReconnect) {
          await this.connect();
        }
      } else if (connection === 'open') {
        logger.info('✅ Conectado ao WhatsApp com sucesso');
        this.userInfo = this.sock?.user;
      }
    });

    // Save credentials on update
    this.sock.ev.on('creds.update', saveCreds);

    return this.sock;
  }

  async sendMessage(to: string, text: string) {
    if (!this.sock) {
      throw new Error('WhatsApp client not connected');
    }

    return await this.sock.sendMessage(to, { text });
  }

  isConnected(): boolean {
    return this.sock !== null && this.userInfo !== null;
  }

  getUserInfo() {
    return this.userInfo;
  }

  getSocket(): WASocket | null {
    return this.sock;
  }
}
