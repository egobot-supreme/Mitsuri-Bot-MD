import {format} from 'util';
const debugMode = !1;
const winScore = 5500;
const playScore = 99;
export async function before(m) {
  let ok;
  let isWin = !1;
  let isTie = !1;
  let isSurrender = !1;
  this.game = this.game ? this.game : {};
  const room = Object.values(this.game).find((room) => room.id && room.game && room.state && room.id.startsWith('tictactoe') && [room.game.playerX, room.game.playerO].includes(m.sender) && room.state == 'PLAYING');
  if (room) {
    if (!/^([1-9]|(me)?nyerah|\rendirse\|rendirse|RENDIRSE|surr?ender)$/i.test(m.text)) {
      return !0;
    }
    isSurrender = !/^[1-9]$/.test(m.text);
    if (m.sender !== room.game.currentTurn) {
      if (!isSurrender) {
        return !0;
      }
    }
    if (debugMode) {
      m.reply('[DEBUG]\n' + require('util').format({
        isSurrender,
        text: m.text}));
    }
    if (!isSurrender && 1 > (ok = room.game.turn(m.sender === room.game.playerO, parseInt(m.text) - 1))) {
      m.reply({
        '-3': 'El juego ha terminado',
        '-2': 'Inválido',
        '-1': 'Posición inválida',
        '0': 'Posición inválida',
      }[ok]);
      return !0;
    }
    if (m.sender === room.game.winner) {
      isWin = true;
    } else if (room.game.board === 511) {
      isTie = true;
    }
    const arr = room.game.render().map((v) => {
      return {
        X: '❎',
        O: '⭕',
        1: '1️⃣',
        2: '2️⃣',
        3: '3️⃣',
        4: '4️⃣',
        5: '5️⃣',
        6: '6️⃣',
        7: '7️⃣',
        8: '8️⃣',
        9: '9️⃣',
      }[v];
    });
    if (isSurrender) {
      room.game._currentTurn = m.sender === room.game.playerX;
      isWin = true;
    }
    const winner = isSurrender ? room.game.currentTurn : room.game.winner;
    const str = `
❮🍁 𝗧𝗥𝗘𝗦 𝗘𝗡 𝗥𝗔𝗬𝗔 🍁❯

❎ = @${room.game.playerX.split('@')[0]}
⭕ = @${room.game.playerO.split('@')[0]}

        ${arr.slice(0, 3).join('')}
        ${arr.slice(3, 6).join('')}
        ${arr.slice(6).join('')}

${isWin ? `@${(isSurrender ? room.game.currentTurn : room.game.winner).split('@')[0]} 𝗚𝗔𝗡𝗔𝗦𝗧𝗘!!!! 😍 𝗧𝗘 𝗟𝗟𝗘𝗩𝗔𝗦 +5500 𝗗𝗘 𝗘𝗫𝗣𝗘𝗥𝗜𝗘𝗡𝗖𝗜𝗔` : isTie ? '❮👑❯➤ 𝗘𝗹 𝗷𝘂𝗲𝗴𝗼 𝘁𝗲𝗿𝗺𝗶𝗻𝗼 𝗲𝗻 𝗲𝗺𝗽𝗮𝘁𝗲' : `❮😍❯➤ 𝗧𝘂𝗿𝗻𝗼 𝗱𝗲 @${room.game.currentTurn.split('@')[0]}`}
`.trim();
    const users = global.db.data.users;
    if ((room.game._currentTurn ^ isSurrender ? room.x : room.o) !== m.chat) {
      room[room.game._currentTurn ^ isSurrender ? 'x' : 'o'] = m.chat;
    }
    if (room.x !== room.o) {
      await this.sendMessage(room.x, {text: str, mentions: this.parseMention(str)}, {quoted: m});
    }
    await this.sendMessage(room.o, {text: str, mentions: this.parseMention(str)}, {quoted: m});
    if (isTie || isWin) {
      users[room.game.playerX].exp += playScore;
      users[room.game.playerO].exp += playScore;
      if (isWin) {
        users[winner].exp += winScore - playScore;
      }
      if (debugMode) {
        m.reply('[DEBUG]\n' + format(room));
      }
      delete this.game[room.id];
    }
  }
  return !0;
}
