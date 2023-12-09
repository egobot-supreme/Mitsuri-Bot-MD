export async function before(m, {match}) {
  if (!m.chat.endsWith('@s.whatsapp.net')) {
    return !0;
  }
  this.anonymous = this.anonymous ? this.anonymous : {};
  const room = Object.values(this.anonymous).find((room) => [room?.a, room?.b].includes(m.sender) && room?.state === 'CHATTING');
  if (room) {
    if (/^(next|leave|start)/.test(m.text)) {
      const other = [room?.a, room?.b].find((user) => user !== m.sender);
      if (other) {
        await m.copyNForward(other, true);
      } else {
        conn.sendMessage(m.chat, {text: `*「🧧」INFORMACION「🧧」*\n\n*• No estas en un chat anonimo, por favor espere a que este en uno.*`}, {quoted: m});
      }
    }
  } else {
    if (!/^(next|leave|start)/.test(m.text)) {
      return;
    }
    conn.sendMessage(m.chat, {text: `*「🧧」INFORMACION「🧧」*\n\n*• No estas en un chat anonimo, por favor espere a que este en uno.*`}, {quoted: m});
  }
  return !0;
}
