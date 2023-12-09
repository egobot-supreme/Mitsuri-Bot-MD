process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';
import './config.js';
import './api.js';
import {createRequire} from 'module';
import path, {join} from 'path';
import {fileURLToPath, pathToFileURL} from 'url';
import {platform} from 'process';
import * as ws from 'ws';
import {readdirSync, statSync, unlinkSync, existsSync, readFileSync, rmSync, watch} from 'fs';
import yargs from 'yargs';
import {spawn} from 'child_process';
import lodash from 'lodash';
import chalk from 'chalk';
import syntaxerror from 'syntax-error';
import {tmpdir} from 'os';
import {format} from 'util';
import P from 'pino';
import pino from 'pino';
import Pino from 'pino';
import {Boom} from '@hapi/boom';
import {makeWASocket, protoType, serialize} from './lib/simple.js';
import {Low, JSONFile} from 'lowdb';
import {mongoDB, mongoDBV2} from './lib/mongoDB.js';
import store from './lib/store.js';
const {proto} = (await import('@whiskeysockets/baileys')).default;
const {DisconnectReason, useMultiFileAuthState, MessageRetryMap, fetchLatestBaileysVersion, makeCacheableSignalKeyStore, jidNormalizedUser, PHONENUMBER_MCC} = await import('@whiskeysockets/baileys');
import readline from 'readline';
import NodeCache from 'node-cache';
const {CONNECTING} = ws;
const {chain} = lodash;
const PORT = process.env.PORT || process.env.SERVER_PORT || 3000;

protoType();
serialize();

global.__filename = function filename(pathURL = import.meta.url, rmPrefix = platform !== 'win32') {
  return rmPrefix ? /file:\/\/\//.test(pathURL) ? fileURLToPath(pathURL) : pathURL : pathToFileURL(pathURL).toString();
}; global.__dirname = function dirname(pathURL) {
  return path.dirname(global.__filename(pathURL, true));
}; global.__require = function require(dir = import.meta.url) {
  return createRequire(dir);
};

global.API = (name, path = '/', query = {}, apikeyqueryname) => (name in global.APIs ? global.APIs[name] : name) + path + (query || apikeyqueryname ? '?' + new URLSearchParams(Object.entries({...query, ...(apikeyqueryname ? {[apikeyqueryname]: global.APIKeys[name in global.APIs ? global.APIs[name] : name]} : {})})) : '');

global.timestamp = {start: new Date};
global.videoList = [];
global.videoListXXX = [];

const __dirname = global.__dirname(import.meta.url);

global.opts = new Object(yargs(process.argv.slice(2)).exitProcess(false).parse());
global.prefix = new RegExp('^[' + (opts['prefix'] || '*/i!#$%+£¢€¥^°=¶∆×÷π√✓©®:;?&.\\-.@').replace(/[|\\{}()[\]^$+*?.\-\^]/g, '\\$&') + ']');

global.db = new Low(/https?:\/\//.test(opts['db'] || '') ? new cloudDBAdapter(opts['db']) : new JSONFile(`${opts._[0] ? opts._[0] + '_' : ''}database.json`));

global.DATABASE = global.db; 
global.loadDatabase = async function loadDatabase() {
  if (global.db.READ) {
    return new Promise((resolve) => setInterval(async function() {
      if (!global.db.READ) {
        clearInterval(this);
        resolve(global.db.data == null ? global.loadDatabase() : global.db.data);
      }
    }, 1 * 1000));
  }
  if (global.db.data !== null) return;
  global.db.READ = true;
  await global.db.read().catch(console.error);
  global.db.READ = null;
  global.db.data = {
    users: {},
    chats: {},
    stats: {},
    msgs: {},
    sticker: {},
    settings: {},
    ...(global.db.data || {}),
  };
  global.db.chain = chain(global.db.data);
};
loadDatabase();

/* Creditos a Otosaka (https://wa.me/51993966345) */

global.chatgpt = new Low(new JSONFile(path.join(__dirname, '/db/chatgpt.json')));
global.loadChatgptDB = async function loadChatgptDB() {
  if (global.chatgpt.READ) {
    return new Promise((resolve) =>
      setInterval(async function() {
        if (!global.chatgpt.READ) {
          clearInterval(this);
          resolve( global.chatgpt.data === null ? global.loadChatgptDB() : global.chatgpt.data );
        }
      }, 1 * 1000));
  }
  if (global.chatgpt.data !== null) return;
  global.chatgpt.READ = true;
  await global.chatgpt.read().catch(console.error);
  global.chatgpt.READ = null;
  global.chatgpt.data = {
    users: {},
    ...(global.chatgpt.data || {}),
  };
  global.chatgpt.chain = lodash.chain(global.chatgpt.data);
};
loadChatgptDB();

/* ------------------------------------------------*/

global.authFile = `MitsuriSession`;
const {state, saveState, saveCreds} = await useMultiFileAuthState(global.authFile);
const msgRetryCounterMap = (MessageRetryMap) => { };
const msgRetryCounterCache = new NodeCache()
const {version} = await fetchLatestBaileysVersion();
let phoneNumber = global.botnumber

/*
const pairingCode = !!phoneNumber || process.argv.includes("--pairing-code")
const useMobile = process.argv.includes("--mobile")
const rl = readline.createInterface({ input: process.stdin, output: process.stdout })
const question = (texto) => new Promise((resolver) => rl.question(texto, resolver))

const connectionOptions = {
        logger: pino({ level: 'silent' }),
        printQRInTerminal: !pairingCode, 
        mobile: useMobile, 
        browser: ['Chrome (Linux)', '', ''],
        auth: {
            creds: state.creds,
            keys: makeCacheableSignalKeyStore(state.keys, Pino({ level: "fatal" }).child({ level: "fatal" })),
        },
        markOnlineOnConnect: true, 
        generateHighQualityLinkPreview: true, 
        getMessage: async (clave) => {
            let jid = jidNormalizedUser(clave.remoteJid)
            let msg = await store.loadMessage(jid, clave.id)
            return msg?.message || ""
        },
        msgRetryCounterCache,
        defaultQueryTimeoutMs: undefined,   
        version
};

global.conn = makeWASocket(connectionOptions);

    if (pairingCode && !conn.authState.creds.registered) {
        if (useMobile) throw new Error('No se puede usar un código de emparejamiento con la API móvil')

        let numeroTelefono
        if (!!phoneNumber) {
            numeroTelefono = phoneNumber.replace(/[^0-9]/g, '')

            if (!Object.keys(PHONENUMBER_MCC).some(v => numeroTelefono.startsWith(v))) {
                console.log(chalk.bgBlack(chalk.redBright("Comience con el código de país de su número de WhatsApp, Ejemplo: +5219992095479")))
                process.exit(0)
            }
        } else {
            numeroTelefono = await question(chalk.bgBlack(chalk.greenBright(`Por favor, escriba su número de WhatsApp 😍\nPor ejemplo: +5219992095479 : `)))
            numeroTelefono = numeroTelefono.replace(/[^0-9]/g, '')
            if (!Object.keys(PHONENUMBER_MCC).some(v => numeroTelefono.startsWith(v))) {
                console.log(chalk.bgBlack(chalk.redBright("Comience con el código de país de su número de WhatsApp, Ejemplo: +5219992095479")))

                numeroTelefono = await question(chalk.bgBlack(chalk.greenBright(`Por favor, escriba su número de WhatsApp 😍\nPor ejemplo: +5219992095479 : `)))
                numeroTelefono = numeroTelefono.replace(/[^0-9]/g, '')
                rl.close()
            }
        }

        setTimeout(async () => {
            let codigo = await conn.requestPairingCode(numeroTelefono)
            codigo = codigo?.match(/.{1,4}/g)?.join("-") || codigo
            console.log(chalk.black(chalk.bgGreen(`Su código de emparejamiento: `)), chalk.black(chalk.white(codigo)))
        }, 3000)
    }
*/

const connectionOptions = {
  printQRInTerminal: true,
  patchMessageBeforeSending: (message) => {
    const requiresPatch = !!( message.buttonsMessage || message.templateMessage || message.listMessage );
    if (requiresPatch) {
      message = {viewOnceMessage: {message: {messageContextInfo: {deviceListMetadataVersion: 2, deviceListMetadata: {}}, ...message}}};
    }
    return message;
  },
  getMessage: async (key) => {
    if (store) {
      const msg = await store.loadMessage(key.remoteJid, key.id);
      return conn.chats[key.remoteJid] && conn.chats[key.remoteJid].messages[key.id] ? conn.chats[key.remoteJid].messages[key.id].message : undefined;
    }
    return proto.Message.fromObject({});
  },
  msgRetryCounterMap,
  logger: pino({level: 'silent'}),
  auth: {
    creds: state.creds,
    keys: makeCacheableSignalKeyStore(state.keys, pino({level: 'silent'})),
  },
  browser: ['MitsuriBot', 'Safari', '1.0.0'],
  version,
  defaultQueryTimeoutMs: undefined,
};

global.conn = makeWASocket(connectionOptions);
conn.isInit = false;
conn.well = false;
conn.logger.info(`✅ 𝗜𝗻𝗶𝗰𝗶𝗮𝗻𝗱𝗼 𝗠𝗶𝘁𝘀𝘂𝗿𝗶 𝗠𝗗. . .\n`);

if (!opts['test']) {
  if (global.db) {
    setInterval(async () => {
      if (global.db.data) await global.db.write();
      if (opts['autocleartmp'] && (global.support || {}).find) (tmp = [os.tmpdir(), 'tmp', 'jadibts'], tmp.forEach((filename) => cp.spawn('find', [filename, '-amin', '3', '-type', 'f', '-delete'])));
    }, 30 * 1000);
  }
}

if (opts['server']) (await import('./server.js')).default(global.conn, PORT);

function clearTmp() {
  const tmp = [tmpdir(), join(__dirname, './tmp')];
  const filename = [];
  tmp.forEach((dirname) => readdirSync(dirname).forEach((file) => filename.push(join(dirname, file))));
  return filename.map((file) => {
    const stats = statSync(file);
    if (stats.isFile() && (Date.now() - stats.mtimeMs >= 1000 * 60 * 3)) return unlinkSync(file); // 3 minutes
    return false;
  });
}

function purgeSession() {
let prekey = []
let directorio = readdirSync("./MitsuriSession")
let filesFolderPreKeys = directorio.filter(file => {
return file.startsWith('pre-key-') /*|| file.startsWith('session-') || file.startsWith('sender-') || file.startsWith('app-') */
})
prekey = [...prekey, ...filesFolderPreKeys]
filesFolderPreKeys.forEach(files => {
unlinkSync(`./MitsuriSession/${files}`)
})
} 

function purgeSessionSB() {
try {
let listaDirectorios = readdirSync('./jadibts/');
let SBprekey = []
listaDirectorios.forEach(directorio => {
if (statSync(`./jadibts/${directorio}`).isDirectory()) {
let DSBPreKeys = readdirSync(`./jadibts/${directorio}`).filter(fileInDir => {
return fileInDir.startsWith('pre-key-') /*|| fileInDir.startsWith('app-') || fileInDir.startsWith('session-')*/
})
SBprekey = [...SBprekey, ...DSBPreKeys]
DSBPreKeys.forEach(fileInDir => {
unlinkSync(`./jadibts/${directorio}/${fileInDir}`)
})
}
})
if (SBprekey.length === 0) return; //console.log(chalk.cyanBright(`=> No hay archivos por eliminar.`))
} catch (err) {
console.log(chalk.bold.red(`=> Algo salio mal durante la eliminación, archivos no eliminados`))
}}

function purgeOldFiles() {
const directories = ['./MitsuriSession/', './jadibts/']
const oneHourAgo = Date.now() - (60 * 60 * 1000)
directories.forEach(dir => {
readdirSync(dir, (err, files) => {
if (err) throw err
files.forEach(file => {
const filePath = path.join(dir, file)
stat(filePath, (err, stats) => {
if (err) throw err;
if (stats.isFile() && stats.mtimeMs < oneHourAgo && file !== 'creds.json') { 
unlinkSync(filePath, err => {  
if (err) throw err
console.log(chalk.bold.green(`Archivo ${file} borrado con éxito`))
})
} else {  
console.log(chalk.bold.red(`Archivo ${file} no borrado` + err))
} }) }) }) })
}

async function connectionUpdate(update) {
  const {connection, lastDisconnect, isNewLogin} = update;
  global.stopped = connection;
  if (isNewLogin) conn.isInit = true;
  const code = lastDisconnect?.error?.output?.statusCode || lastDisconnect?.error?.output?.payload?.statusCode;
  if (code && code !== DisconnectReason.loggedOut && conn?.ws.socket == null) {
    await global.reloadHandler(true).catch(console.error);
    //console.log(await global.reloadHandler(true).catch(console.error));
    global.timestamp.connect = new Date;
  }
  if (global.db.data == null) loadDatabase();
  if (update.qr != 0 && update.qr != undefined) {
    console.log(chalk.yellow('👑 Por favor, escanea el QR, se expirara en 60 minutos, y hazlo rapido coño, no tengo todo el tiempo del mundo >:v'));
  }
  if (connection == 'open') {
    console.log(chalk.yellow('▣──────────────────────────────···\n│\n│❧ 𝙲𝙾𝙽𝙴𝙲𝚃𝙰𝙳𝙾 𝙲𝙾𝚁𝚁𝙴𝙲𝚃𝙰𝙼𝙴𝙽𝚃𝙴 𝙰𝙻 𝚆𝙷𝙰𝚃𝚂𝙰𝙿𝙿 ✅\n│\n▣──────────────────────────────···'));
  }
let reason = new Boom(lastDisconnect?.error)?.output?.statusCode;
if (connection === 'close') {
    if (reason === DisconnectReason.badSession) {
        conn.logger.error(`[ ❌ ] Sesión incorrecta, por favor elimina la carpeta ${global.authFile} y escanea nuevamente.`);
        //process.exit();
    } else if (reason === DisconnectReason.connectionClosed) {
        conn.logger.warn(`[ ❌ ] Conexión cerrada, reconectando...`);
        await global.reloadHandler(true).catch(console.error);
    } else if (reason === DisconnectReason.connectionLost) {
        conn.logger.warn(`[ ❌ ] Conexión perdida con el servidor, reconectando...`);
        await global.reloadHandler(true).catch(console.error);
    } else if (reason === DisconnectReason.connectionReplaced) {
        conn.logger.error(`[ ❌ ] Conexión reemplazada, se ha abierto otra nueva sesión. Por favor, cierra la sesión actual primero.`);
        //process.exit();
    } else if (reason === DisconnectReason.loggedOut) {
        conn.logger.error(`[ ❌ ] Conexion cerrada, por favor elimina la carpeta ${global.authFile} y escanea nuevamente.`);
        //process.exit();
    } else if (reason === DisconnectReason.restartRequired) {
        conn.logger.info(`[ ❌ ] Reinicio necesario, reinicie el servidor si presenta algún problema.`);
        await global.reloadHandler(true).catch(console.error);
    } else if (reason === DisconnectReason.timedOut) {
        conn.logger.warn(`[ ❌ ] Tiempo de conexión agotado, reconectando...`);
        await global.reloadHandler(true).catch(console.error);
    } else {
        conn.logger.warn(`[ ❌ ] Razón de desconexión desconocida. ${reason || ''}: ${connection || ''}`);
        await global.reloadHandler(true).catch(console.error);
    }
}
  /*if (connection == 'close') {
    console.log(chalk.yellow(`⛔ㅤConexion cerrada, por favor borre la carpeta ${global.authFile} y reescanee el codigo QR`));
  }*/
}

process.on('uncaughtException', console.error);

let isInit = true;
let handler = await import('./handler.js');
global.reloadHandler = async function(restatConn) {
  try {
    const Handler = await import(`./handler.js?update=${Date.now()}`).catch(console.error);
    if (Object.keys(Handler || {}).length) handler = Handler;
  } catch (e) {
    console.error(e);
  }
  if (restatConn) {
    const oldChats = global.conn.chats;
    try {
      global.conn.ws.close();
    } catch { }
    conn.ev.removeAllListeners();
    global.conn = makeWASocket(connectionOptions, {chats: oldChats});
    isInit = true;
  }
  if (!isInit) {
    conn.ev.off('messages.upsert', conn.handler);
    conn.ev.off('group-participants.update', conn.participantsUpdate);
    conn.ev.off('groups.update', conn.groupsUpdate);
    conn.ev.off('message.delete', conn.onDelete);
    conn.ev.off('call', conn.onCall);
    conn.ev.off('connection.update', conn.connectionUpdate);
    conn.ev.off('creds.update', conn.credsUpdate);
  }

  conn.welcome = '*╭═━━━━━▢✧ 𝐔𝐬𝐞𝐫 𝐖𝐞𝐥𝐜𝐨𝐦𝐞 ✧▢━━━━━═╮*\n*╟⟤➤ @subject*\n*╰═━━━━━▢✧ 𝐔𝐬𝐞𝐫 𝐖𝐞𝐥𝐜𝐨𝐦𝐞 ✧▢━━━━━═╯*\n\n🎉 𝙎𝙀𝘼 𝘽𝙄𝙀𝙉𝙑𝙀𝙉𝙄𝘿𝙊/𝘼 𝘼𝙇 𝙂𝙍𝙐𝙋𝙊 🎉\n\n*⟅❬👤❭⟆ 𝐔𝐒𝐔𝐀𝐑𝐈𝐎/𝐀:*\n*✧➣ @user* 👑\n*Se unio al grupo.!*\n\n⟅❬🚀❭⟆ 𝐍𝐎𝐑𝐌𝐀𝐒 𝐍𝐄𝐂𝐄𝐒𝐀𝐑𝐈𝐀𝐒:\n𝗟𝗲𝗲𝗿 𝗹𝗮 𝗱𝗲𝘀𝗰𝗿𝗶𝗽𝗰𝗶𝗼𝗻 𝗱𝗲𝗹 𝗴𝗿𝘂𝗽𝗼.\n\n⟅❬🥏❭⟆ 𝐃𝐄𝐒𝐂𝐑𝐈𝐏𝐂𝐈𝐎𝐍 𝐃𝐄𝐋 𝐆𝐑𝐔𝐏𝐎:\n\n@desc\n\n⟅❬🎉❭⟆ 𝐄𝐒𝐏𝐄𝐑𝐀𝐌𝐎𝐒 𝐘 𝐓𝐄 𝐀𝐆𝐑𝐀𝐃𝐄 𝐄𝐋 𝐆𝐑𝐔𝐏𝐎!.\n\n⟅❬👑❭⟆ *Para comenzar, puedes usar el menu o otros comandos, aqui te dejo unos ejemplos :3*\n\n#Menu ➣ *Ver el menu completo*\n#play ➣ *¿Quieres descargar musicas?, este es el comando para descargarlo :3*\n#reg ➣ *Este comando sirve para que te puedas registrsr y usar algunos comandos se necesitan registro :3*\n#Perfil ➣ *puedes ver tu perfil con este comando :3*\n#levelup ➣ *Puedes ver tu nivel de puntuacion con este comando :3*\n\n𝑀𝑖𝑡𝑠𝑢𝑟𝑖-𝐵𝑜𝑡-𝑀𝐷';
  conn.bye = '*╭═━━━━━▢✧ 𝐔𝐬𝐞𝐫 𝐁𝐲𝐞/𝐀𝐝𝐢𝐨𝐬 ✧▢━━━━━═╮*\n*╟⟤➤ @subject*\n*╰═━━━━━▢✧ 𝐔𝐬𝐞𝐫 𝐁𝐲𝐞/𝐀𝐝𝐢𝐨𝐬 ✧▢━━━━━═╯*\n\n👋🏻 𝙎𝙀 𝙉𝙊𝙎 𝙁𝙐𝙀 𝙐𝙉 𝙄𝙉𝙏𝙀𝙂𝙍𝘼𝙉𝙏𝙀 👋🏻\n\n⟅❬👤❭⟆ 𝐄𝐋/𝐋𝐀 𝐔𝐒𝐔𝐀𝐑𝐈𝐎/𝐀:\n*✧➣ @user*\n*Salio del grupo, espero y no vuelva.*\n\n𝗜𝗴𝗻𝗼𝗿𝗲𝗺𝗼𝘀 𝗲𝘀𝘁𝗲 𝘀𝘂𝗰𝗲𝘀𝗼, 𝗰𝗼𝗺𝗲𝗻𝘇𝗮𝗺𝗼𝘀 𝗻𝘂𝗲𝘃𝗮𝗺𝗲𝗻𝘁𝗲 𝗰𝗼𝗻 𝗹𝗮𝘀 𝗿𝗲𝗴𝗹𝗮𝘀 𝗷𝗮𝗷𝗮:\n\n⟅❬🥏❭⟆ 𝐃𝐄𝐒𝐂𝐑𝐈𝐏𝐂𝐈𝐎𝐍 𝐃𝐄𝐋 𝐆𝐑𝐔𝐏𝐎:\n\n@desc\n\n⟅❬💎❭⟆ 𝐄𝐒𝐏𝐄𝐑𝐀𝐌𝐎𝐒 𝐘 𝐒𝐄 𝐑𝐄𝐕𝐄𝐋𝐄𝐍 𝐌𝐀𝐒 𝐅𝐀𝐍𝐓𝐀𝐒𝐌𝐀𝐒!.\n\n⟅❬👑❭⟆ *Para comenzar, puedes usar el menu o otros comandos, aqui te dejo unos ejemplos :3*\n\n#Menu ➣ *Ver el menu completo*\n#play ➣ *¿Quieres descargar musicas?, este es el comando para descargarlo :3*\n#reg ➣ *Este comando sirve para que te puedas registrsr y usar algunos comandos se necesitan registro :3*\n#Perfil ➣ *puedes ver tu perfil con este comando :3*\n#levelup ➣ *Puedes ver tu nivel de puntuacion con este comando :3*\n\n𝑀𝑖𝑡𝑠𝑢𝑟𝑖-𝐵𝑜𝑡-𝑀𝐷';
  conn.spromote = '*╭═━━━━━▢✧ 𝐔𝐬𝐞𝐫 𝐍𝐞𝐰𝐀𝐝𝐦𝐢𝐧 ✧▢━━━━━═╮*\n*╟⟤➤ @subject*\n*╰═━━━━━▢✧ 𝐔𝐬𝐞𝐫 𝐍𝐞𝐰𝐀𝐝𝐦𝐢𝐧 ✧▢━━━━━═╯*\n\n👑 𝙉𝙐𝙀𝙑𝙊/𝘼 𝘼𝘿𝙈𝙄𝙉 𝘼𝙎𝙄𝙂𝙉𝘼𝘿𝙊 👑\n\n*⟅❬👤❭⟆ 𝐄𝐋/𝐋𝐀 𝐔𝐒𝐔𝐀𝐑𝐈𝐎/𝐀:\n*✧➣ @user*\n*🎉 Ahora es admin del grupo, aprecienlo/a y ignorenlo/a :v 🎉*\n\n⟅❬🏆❭⟆ 𝐍𝐎𝐑𝐌𝐀𝐒 𝐍𝐄𝐂𝐄𝐒𝐀𝐑𝐈𝐀𝐒:\n\n1️⃣: *Ser buen admin xd\n2️⃣: *No abusar del poder de ser admin :v*\n3️⃣: *Compartir el enlace del grupo xd*\n4️⃣: *Ser activo, no se requiere admins flojos :v*\n5️⃣: *Me elimimas y te elimino >:v xd*\n\n𝑀𝑖𝑡𝑠𝑢𝑟𝑖-𝐵𝑜𝑡-𝑀𝐷';
  conn.sdemote = '*╭═━━━━━▢✧ 𝐔𝐬𝐞𝐫 𝐍𝐨𝐀𝐝𝐦𝐢𝐧 >:v ✧▢━━━━━═╮*\n*╟⟤➤ @subject*\n*╰═━━━━━▢✧ 𝐔𝐬𝐞𝐫 𝐍𝐨𝐀𝐝𝐦𝐢𝐧 >:v ✧▢━━━━━═╯*\n\n🏆 𝙇𝙀 𝙌𝙐𝙄𝙏𝘼𝙍𝙊𝙉 𝙀𝙇 𝙏𝙍𝙊𝙉𝙊 𝘼 𝙐𝙉 𝘼𝘿𝙈𝙄𝙉 🏆\n𝙤 𝙨𝙖𝙡𝙞𝙤 𝙩𝙖𝙡 𝙫𝙚𝙯\n\n⟅❬👤❭⟆ 𝐄𝐋/𝐋𝐀 𝐔𝐒𝐔𝐀𝐑𝐈𝐎/𝐀:\n*✧➣ @user*\n*Nos dejo ese/a wey, funenlo/a >:v*\n\n*Sin nada mas que decir, ignoremos este caso jaja*\n\n⟅❬🥏❭⟆ 𝐃𝐄𝐒𝐂𝐑𝐈𝐏𝐂𝐈𝐎𝐍 𝐃𝐄𝐋 𝐆𝐑𝐔𝐏𝐎:\n\n@desc\n\n⟅❬🐻❭⟆ 𝐄𝐒𝐏𝐄𝐑𝐄𝐌𝐎𝐒 𝐘 𝐄𝐋/𝐋𝐀 𝐏𝐑𝐎𝐗𝐈𝐌𝐀 𝐀𝐃𝐌𝐈𝐍 𝐍𝐎𝐒 𝐑𝐄𝐆𝐀𝐋𝐄 𝐏𝐋𝐀𝐓𝐀!.\n\n⟅❬👑❭⟆ *Para comenzar, puedes usar el menu o otros comandos, aqui te dejo unos ejemplos :3*\n\n#Menu ➣ *Ver el menu completo*\n#play ➣ *¿Quieres descargar musicas?, este es el comando para descargarlo :3*\n#reg ➣ *Este comando sirve para que te puedas registrsr y usar algunos comandos se necesitan registro :3*\n#Perfil ➣ *puedes ver tu perfil con este comando :3*\n#levelup ➣ *Puedes ver tu nivel de puntuacion con este comando :3*\n\n𝑀𝑖𝑡𝑠𝑢𝑟𝑖-𝐵𝑜𝑡-𝑀𝐷';
  conn.sDesc = '*╭═━━━━━▢✧ 𝐍𝐮𝐞𝐯𝐚 𝐃𝐞𝐬𝐜𝐫𝐢𝐩𝐜𝐢𝐨𝐧 ✧▢━━━━━═╮*\n*╟⟤➤ @subject*\n*╰═━━━━━▢✧ 𝐍𝐮𝐞𝐯𝐚 𝐃𝐞𝐬𝐜𝐫𝐢𝐩𝐜𝐢𝐨𝐧 ✧▢━━━━━═╯*\n\n💎 𝙉𝙐𝙀𝙑𝘼 𝘿𝙀𝙎𝘾𝙍𝙄𝙋𝘾𝙄𝙊𝙉 𝘿𝙀𝙇 𝙂𝙍𝙐𝙋𝙊 💎\n\n*⟅❬💬❭⟆ Se ha cambiado esta vaina de la descripcion*\n\n\n*⟅❬🥏❭⟆ 𝐃𝐄𝐒𝐂𝐑𝐈𝐏𝐂𝐈𝐎𝐍 𝐃𝐄𝐋 𝐆𝐑𝐔𝐏𝐎:*\n\n@desc\n\n*Mucho texto, mejor no lean xd :v*\nᶜʳᵉᵒ ᵠᵘᵉ ᵐᵉ ᵛᵃⁿ ᵃ ᶠᵘⁿᵃʳ ᵖᵒʳ ᵈᵉᶜⁱʳ ʷᵉᵇᵃᵈᵃˢ\n\n𝑀𝑖𝑡𝑠𝑢𝑟𝑖-𝐵𝑜𝑡-𝑀𝐷';
  conn.sSubject = '*╭═━━━━━▢✧ 𝐍𝐮𝐞𝐯𝐨 𝐍𝐨𝐦𝐛𝐫𝐞 ✧▢━━━━━═╮*\n*╟⟤➤ @subject*\n*╰═━━━━━▢✧ 𝐍𝐮𝐞𝐯𝐨 𝐍𝐨𝐦𝐛𝐫𝐞 ✧▢━━━━━═╯*\n\n🌎 𝙉𝙐𝙀𝙑𝙊 𝙉𝙊𝙈𝘽𝙍𝙀 𝘿𝙀𝙇 𝙂𝙍𝙐𝙋𝙊 🌎\n(no me gusta el nuevo name) :v\n\n⟅❬🥏❭⟆ *Nuevo nombre del grupo, clasico pero chido :v*\n\n*⟅❬💬❭⟆ Este es el nuevo nombre del grupo:*\n✧➣ @subject\n\n⟅❬🥏❭⟆ 𝐃𝐄𝐒𝐂𝐑𝐈𝐏𝐂𝐈𝐎𝐍 𝐃𝐄𝐋 𝐆𝐑𝐔𝐏𝐎:\n\n@desc\n\n⟅❬🥇❭⟆ 𝐄𝐒𝐏𝐄𝐑𝐄𝐌𝐎𝐒 𝐘 𝐍𝐎 𝐌𝐄 𝐅𝐔𝐍𝐄𝐍 :v\n\n⟅❬👑❭⟆ *Para comenzar, puedes usar el menu o otros comandos, aqui te dejo unos ejemplos :3*\n\n#Menu ➣ *Ver el menu completo*\n#play ➣ *¿Quieres descargar musicas?, este es el comando para descargarlo :3*\n#reg ➣ *Este comando sirve para que te puedas registrsr y usar algunos comandos se necesitan registro :3*\n#Perfil ➣ *puedes ver tu perfil con este comando :3*\n#levelup ➣ *Puedes ver tu nivel de puntuacion con este comando :3*\n\n𝑀𝑖𝑡𝑠𝑢𝑟𝑖-𝐵𝑜𝑡-𝑀𝐷';
  conn.sIcon = '*╭═━━━━━▢✧ 𝐍𝐮𝐞𝐯𝐚 𝐅𝐨𝐭𝐨 ✧▢━━━━━═╮*\n*╟⟤➤ @subject*\n*╰═━━━━━▢✧ 𝐍𝐮𝐞𝐯𝐚 𝐅𝐨𝐭𝐨 ✧▢━━━━━═╯*\n\n🏞️ 𝙎𝙀 𝙃𝘼 𝘾𝘼𝙈𝘽𝙄𝘼𝘿𝙊 𝙇𝘼 𝙁𝙊𝙏𝙊 𝘿𝙀𝙇 𝙂𝙍𝙐𝙋𝙊 🏞️\n(Bonito pero no tanto) :3\n\n*Por que no mejor ponen la foto de un fantasma por ahi para ver si habla al ver su foto en un grupo :v*\n\n⟅❬🥏❭⟆ 𝐃𝐄𝐒𝐂𝐑𝐈𝐏𝐂𝐈𝐎𝐍 𝐃𝐄𝐋 𝐆𝐑𝐔𝐏𝐎:\n\n@desc\n\n⟅❬🍷❭⟆ 𝐄𝐒𝐏𝐄𝐑𝐄𝐌𝐎𝐒 𝐘 𝐋𝐀 𝐏𝐑𝐎𝐗𝐈𝐌𝐀 𝐅𝐎𝐓𝐎 𝐒𝐄𝐀 𝐌𝐀𝐒 𝐂𝐇𝐈𝐃𝐎 𝐐𝐔𝐄 𝐄𝐒𝐓𝐄!.\n\n⟅❬👑❭⟆ *Para comenzar, puedes usar el menu o otros comandos, aqui te dejo unos ejemplos :3*\n\n#Menu ➣ *Ver el menu completo*\n#play ➣ *¿Quieres descargar musicas?, este es el comando para descargarlo :3*\n#reg ➣ *Este comando sirve para que te puedas registrsr y usar algunos comandos se necesitan registro :3*\n#Perfil ➣ *puedes ver tu perfil con este comando :3*\n#levelup ➣ *Puedes ver tu nivel de puntuacion con este comando :3*\n\n𝑀𝑖𝑡𝑠𝑢𝑟𝑖-𝐵𝑜𝑡-𝑀𝐷';
  conn.sRevoke = '*╭═━━━━━▢✧ 𝐍𝐮𝐞𝐯𝐚 𝐅𝐨𝐭𝐨 ✧▢━━━━━═╮*\n*╟⟤➤ @subject*\n*╰═━━━━━▢✧ 𝐍𝐮𝐞𝐯𝐚 𝐅𝐨𝐭𝐨 ✧▢━━━━━═╯*\n\n✅ 𝙉𝙐𝙀𝙑𝙊 𝙀𝙉𝙇𝘼𝘾𝙀 𝘿𝙀𝙇 𝙂𝙍𝙐𝙋𝙊 ✅\n\n*⟅❬💬❭⟆ No entraran personas si no comparten el nuevo enlace :^*\n\n⟅❬🌎❭⟆ *𝐄𝐋 𝐄𝐍𝐋𝐀𝐂𝐄 𝐍𝐔𝐄𝐕𝐎:*\n✧➣ @revoke\n\n⟅❬🥏❭⟆ 𝐃𝐄𝐒𝐂𝐑𝐈𝐏𝐂𝐈𝐎𝐍 𝐃𝐄𝐋 𝐆𝐑𝐔𝐏𝐎:\n\n@desc\n\n⟅❬💦❭⟆ 𝐄𝐒𝐏𝐄𝐑𝐄𝐌𝐎𝐒 𝐘 𝐄𝐋/𝐋𝐀 𝐀𝐃𝐌𝐈𝐍 𝐁𝐎𝐑𝐑𝐄 𝐄𝐋 𝐆𝐑𝐔𝐏𝐎!.\n\n⟅❬👑❭⟆ *Para comenzar, puedes usar el menu o otros comandos, aqui te dejo unos ejemplos :3*\n\n#Menu ➣ *Ver el menu completo*\n#play ➣ *¿Quieres descargar musicas?, este es el comando para descargarlo :3*\n#reg ➣ *Este comando sirve para que te puedas registrsr y usar algunos comandos se necesitan registro :3*\n#Perfil ➣ *puedes ver tu perfil con este comando :3*\n#levelup ➣ *Puedes ver tu nivel de puntuacion con este comando :3*\n\n𝑀𝑖𝑡𝑠𝑢𝑟𝑖-𝐵𝑜𝑡-𝑀𝐷';

  conn.handler = handler.handler.bind(global.conn);
  conn.participantsUpdate = handler.participantsUpdate.bind(global.conn);
  conn.groupsUpdate = handler.groupsUpdate.bind(global.conn);
  conn.onDelete = handler.deleteUpdate.bind(global.conn);
  conn.onCall = handler.callUpdate.bind(global.conn);
  conn.connectionUpdate = connectionUpdate.bind(global.conn);
  conn.credsUpdate = saveCreds.bind(global.conn, true);

  const currentDateTime = new Date();
  const messageDateTime = new Date(conn.ev);
  if (currentDateTime >= messageDateTime) {
    const chats = Object.entries(conn.chats).filter(([jid, chat]) => !jid.endsWith('@g.us') && chat.isChats).map((v) => v[0]);
  } else {
    const chats = Object.entries(conn.chats).filter(([jid, chat]) => !jid.endsWith('@g.us') && chat.isChats).map((v) => v[0]);
  }

  conn.ev.on('messages.upsert', conn.handler);
  conn.ev.on('group-participants.update', conn.participantsUpdate);
  conn.ev.on('groups.update', conn.groupsUpdate);
  conn.ev.on('message.delete', conn.onDelete);
  conn.ev.on('call', conn.onCall);
  conn.ev.on('connection.update', conn.connectionUpdate);
  conn.ev.on('creds.update', conn.credsUpdate);
  isInit = false;
  return true;
};

/*

const pluginFolder = join(__dirname, './plugins');
const pluginFilter = filename => /\.js$/.test(filename);
global.plugins = {};

async function filesInit(folder) {
  for (let filename of readdirSync(folder).filter(pluginFilter)) {
    try {
      let file = join(folder, filename);
      const module = await import(file);
      global.plugins[file] = module.default || module;
    } catch (e) {
      console.error(e);
      delete global.plugins[filename];
    }
  }

  for (let subfolder of readdirSync(folder)) {
    const subfolderPath = join(folder, subfolder);
    if (statSync(subfolderPath).isDirectory()) {
      await filesInit(subfolderPath);
    }
  }
}

await filesInit(pluginFolder).then(_ => Object.keys(global.plugins)).catch(console.error);

*/

const pluginFolder = global.__dirname(join(__dirname, './plugins/index'));
const pluginFilter = (filename) => /\.js$/.test(filename);
global.plugins = {};
async function filesInit() {
  for (const filename of readdirSync(pluginFolder).filter(pluginFilter)) {
    try {
      const file = global.__filename(join(pluginFolder, filename));
      const module = await import(file);
      global.plugins[filename] = module.default || module;
    } catch (e) {
      conn.logger.error(e);
      delete global.plugins[filename];
    }
  }
}
filesInit().then((_) => Object.keys(global.plugins)).catch(console.error);

global.reload = async (_ev, filename) => {
  if (pluginFilter(filename)) {
    const dir = global.__filename(join(pluginFolder, filename), true);
    if (filename in global.plugins) {
      if (existsSync(dir)) conn.logger.info(` updated plugin - '${filename}'`);
      else {
        conn.logger.warn(`deleted plugin - '${filename}'`);
        return delete global.plugins[filename];
      }
    } else conn.logger.info(`new plugin - '${filename}'`);
    const err = syntaxerror(readFileSync(dir), filename, {
      sourceType: 'module',
      allowAwaitOutsideFunction: true,
    });
    if (err) conn.logger.error(`syntax error while loading '${filename}'\n${format(err)}`);
    else {
      try {
        const module = (await import(`${global.__filename(dir)}?update=${Date.now()}`));
        global.plugins[filename] = module.default || module;
      } catch (e) {
        conn.logger.error(`error require plugin '${filename}\n${format(e)}'`);
      } finally {
        global.plugins = Object.fromEntries(Object.entries(global.plugins).sort(([a], [b]) => a.localeCompare(b)));
      }
    }
  }
};
Object.freeze(global.reload);
watch(pluginFolder, global.reload);
await global.reloadHandler();
async function _quickTest() {
  const test = await Promise.all([
    spawn('ffmpeg'),
    spawn('ffprobe'),
    spawn('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-filter_complex', 'color', '-frames:v', '1', '-f', 'webp', '-']),
    spawn('convert'),
    spawn('magick'),
    spawn('gm'),
    spawn('find', ['--version']),
  ].map((p) => {
    return Promise.race([
      new Promise((resolve) => {
        p.on('close', (code) => {
          resolve(code !== 127);
        });
      }),
      new Promise((resolve) => {
        p.on('error', (_) => resolve(false));
      })]);
  }));
  const [ffmpeg, ffprobe, ffmpegWebp, convert, magick, gm, find] = test;
  const s = global.support = {ffmpeg, ffprobe, ffmpegWebp, convert, magick, gm, find};
  Object.freeze(global.support);
}
setInterval(async () => {
  if (stopped === 'close' || !conn || !conn.user) return;
  const a = await clearTmp();
  //console.log(chalk.cyanBright(`\nARCHIVOS BASURA ELIMINADOS ✅\n`));
}, 180000);
setInterval(async () => {
  if (stopped === 'close' || !conn || !conn.user) return;
  await purgeSession();
  //console.log(chalk.cyanBright(`\nELIMINAR SESSION CLONADA ✅\n`));
}, 1000 * 60 * 60);
setInterval(async () => {
  if (stopped === 'close' || !conn || !conn.user) return;
  await purgeSessionSB();
  //console.log(chalk.cyanBright(`\n ARCHIVOS BASURA ELIMINADOS ✅\n`));
}, 1000 * 60 * 60);
setInterval(async () => {
  if (stopped === 'close' || !conn || !conn.user) return;
  await purgeOldFiles();
  //console.log(chalk.cyanBright(`\nARCHIVOS BASURA ELIMINADOS ✅\n`));
}, 1000 * 60 * 60);
setInterval(async () => {
  if (stopped === 'close' || !conn || !conn.user) return;
  const _uptime = process.uptime() * 1000;
  const uptime = clockString(_uptime);
  const bio = `💜 𝗠𝗶𝘁𝘀𝘂𝗿𝗶 𝗕𝗼𝘁 𝗠𝗗 💜 / ${uptime} 🍁 ➤ ✅ Cʀᴇᴀᴅᴏʀᴀ: 𝑳𝒊𝒛•𝒀𝒂𝒏𝒆𝒕𝒉.`;
  await mconn.conn.updateProfileStatus(bio).catch((_) => _);
}, 60000);
function clockString(ms) {
  const d = isNaN(ms) ? '--' : Math.floor(ms / 86400000);
  const h = isNaN(ms) ? '--' : Math.floor(ms / 3600000) % 24;
  const m = isNaN(ms) ? '--' : Math.floor(ms / 60000) % 60;
  const s = isNaN(ms) ? '--' : Math.floor(ms / 1000) % 60;
  return [d, ' Día(s) ️', h, ' Hora(s) ', m, ' Minuto(s) ', s, ' Segundo(s) '].map((v) => v.toString().padStart(2, 0)).join('');
}
_quickTest().catch(console.error);
