let handler = m => m

handler.before = function (m) {
    let user = global.db.data.users[m.sender]
    let role = (user.level <= 3) ? '⟆ 𝙶𝚄𝙴𝚁𝚁𝙴𝙾/𝙰 [ 𝚅 ] ⟅'
      : ((user.level >= 3) && (user.level <= 6)) ? '⟆ 𝙶𝚄𝙴𝚁𝚁𝙴𝙾/𝙰 [ 𝙸𝚅 ] ⟅'
      : ((user.level >= 6) && (user.level <= 9)) ? '⟆ 𝙶𝚄𝙴𝚁𝚁𝙴𝙾/𝙰 [ 𝙸𝙸𝙸 ] ⟅'
      : ((user.level >= 9) && (user.level <= 12)) ? '⟆ 𝙶𝚄𝙴𝚁𝚁𝙴𝙾/𝙰 [ 𝙸𝙸 ] ⟅'
      : ((user.level >= 12) && (user.level <= 15)) ? '⟆ 𝙶𝚄𝙴𝚁𝚁𝙴𝙾/𝙰 [ 𝙸 ] ⟅'
      : ((user.level >= 15) && (user.level <= 18)) ? '⟆ 𝙴𝙻𝙸𝚃𝙴 [ 𝚅 ] ⟅'
      : ((user.level >= 18) && (user.level <= 21)) ? '⟆ 𝙴𝙻𝙸𝚃𝙴 [ 𝙸𝚅 ] ⟅'
      : ((user.level >= 21) && (user.level <= 24)) ? '⟆ 𝙴𝙻𝙸𝚃𝙴 [ 𝙸𝙸𝙸 ] ⟅'
      : ((user.level >= 24) && (user.level <= 27)) ? '⟆ 𝙴𝙻𝙸𝚃𝙴 [ 𝙸𝙸 ] ⟅'
      : ((user.level >= 27) && (user.level <= 30)) ? '⟆ 𝙴𝙻𝙸𝚃𝙴 [ 𝙸 ] ⟅'
      : ((user.level >= 30) && (user.level <= 33)) ? '⟆ 𝙼𝙰𝙴𝚂𝚃𝚁𝙾/𝙰 [ 𝚅 ] ⟅'
      : ((user.level >= 33) && (user.level <= 36)) ? '⟆ 𝙼𝙰𝙴𝚂𝚃𝚁𝙾/𝙰 [ 𝙸𝚅 ] ⟅'
      : ((user.level >= 36) && (user.level <= 39)) ? '⟆ 𝙼𝙰𝙴𝚂𝚃𝚁𝙾/𝙰 [ 𝙸𝙸𝙸 ] ⟅'
      : ((user.level >= 39) && (user.level <= 42)) ? '⟆ 𝙼𝙰𝙴𝚂𝚃𝚁𝙾/𝙰 [ 𝙸𝙸 ] ⟅'
      : ((user.level >= 42) && (user.level <= 45)) ? '⟆ 𝙼𝙰𝙴𝚂𝚃𝚁𝙾/𝙰 [ 𝙸 ] ⟅'
      : ((user.level >= 45) && (user.level <= 48)) ? '⟆ 𝚄𝚂𝙴𝚁 𝙿𝚁𝙾 [ 𝚅 ] ⟅'
      : ((user.level >= 48) && (user.level <= 51)) ? '⟆ 𝚄𝚂𝙴𝚁 𝙿𝚁𝙾 [ 𝙸𝚅 ] ⟅'
      : ((user.level >= 51) && (user.level <= 54)) ? '⟆ 𝚄𝚂𝙴𝚁 𝙿𝚁𝙾 [ 𝙸𝙸𝙸 ] ⟅'
      : ((user.level >= 54) && (user.level <= 57)) ? '⟆ 𝚄𝚂𝙴𝚁 𝙿𝚁𝙾 [ 𝙸𝙸 ] ⟅'
      : ((user.level >= 57) && (user.level <= 60)) ? '⟆ 𝚄𝚂𝙴𝚁 𝙿𝚁𝙾 [ 𝙸 ] ⟅'
      : ((user.level >= 60) && (user.level <= 63)) ? '⟆ 𝙴𝙿𝙸𝙲𝙾 [ 𝚅 ] ⟅'
      : ((user.level >= 63) && (user.level <= 66)) ? '⟆ 𝙴𝙿𝙸𝙲𝙾 [ 𝙸𝚅 ] ⟅'
      : ((user.level >= 66) && (user.level <= 69)) ? '⟆ 𝙴𝙿𝙸𝙲𝙾 [ 𝙸𝙸𝙸 ] ⟅'
      : ((user.level >= 69) && (user.level <= 71)) ? '⟆ 𝙴𝙿𝙸𝙲𝙾 [ 𝙸𝙸 ] ⟅'
      : ((user.level >= 71) && (user.level <= 74)) ? '⟆ 𝙴𝙿𝙸𝙲𝙾 [ 𝙸 ] ⟅'
      : ((user.level >= 74) && (user.level <= 77)) ? '⟆ 𝙻𝙴𝚈𝙴𝙽𝙳𝙰 [ 𝚅 ] ⟅'
      : ((user.level >= 77) && (user.level <= 80)) ? '⟆ 𝙻𝙴𝚈𝙴𝙽𝙳𝙰 [ 𝙸𝚅 ] ⟅'
      : ((user.level >= 80) && (user.level <= 83)) ? '⟆ 𝙻𝙴𝚈𝙴𝙽𝙳𝙰 [ 𝙸𝙸𝙸 ] ⟅'
      : ((user.level >= 83) && (user.level <= 86)) ? '⟆ 𝙻𝙴𝚈𝙴𝙽𝙳𝙰 [ 𝙸𝙸 ] ⟅'
      : ((user.level >= 86) && (user.level <= 89)) ? '⟆ 𝙻𝙴𝚈𝙴𝙽𝙳𝙰 [ 𝙸 ] ⟅'
      : ((user.level >= 89) && (user.level <= 91)) ? '⟆ 𝙼𝙸𝚃𝙸𝙲𝙾 [ 𝚅 ] ⟅'
      : ((user.level >= 91) && (user.level <= 94)) ? '⟆ 𝙼𝙸𝚃𝙸𝙲𝙾 [ 𝙸𝚅 ] ⟅'
      : ((user.level >= 94) && (user.level <= 97)) ? '⟆ 𝙼𝙸𝚃𝙸𝙲𝙾 [ 𝙸𝙸𝙸 ] ⟅'
      : ((user.level >= 97) && (user.level <= 100)) ? '⟆ 𝙼𝙸𝚃𝙸𝙲𝙾 [ 𝙸𝙸 ] ⟅'
      : ((user.level >= 100) && (user.level <= 105)) ? '⟆ 𝙼𝙸𝚃𝙸𝙲𝙾 [ 𝙸 ] ⟅'      
      : ((user.level >= 105) && (user.level <= 120)) ? '💎 𝚄𝚂𝙴𝚁 𝙿𝚁𝙾 - 𝙼𝙸𝚃𝚂𝚄𝚁𝙸 𝙱𝙾𝚃 𝙼𝙳 💎'
      : ((user.level >= 120) && (user.level <= 150)) ? '⟆ 𝚄𝚂𝙴𝚁 𝙴𝚇𝙿𝙴𝚁𝚃𝙾/𝙰 [ 𝚅 ] ⟅'
      : ((user.level >= 150) && (user.level <= 160)) ? '⟆ 𝚄𝚂𝙴𝚁 𝙴𝚇𝙿𝙴𝚁𝚃𝙾/𝙰 [ 𝙸𝚅 ] ⟅'
      : ((user.level >= 160) && (user.level <= 170)) ? '⟆ 𝚄𝚂𝙴𝚁 𝙴𝚇𝙿𝙴𝚁𝚃𝙾/𝙰 [ 𝙸𝙸𝙸 ] ⟅'
      : ((user.level >= 170) && (user.level <= 185)) ? '⟆ 𝚄𝚂𝙴𝚁 𝙴𝚇𝙿𝙴𝚁𝚃𝙾/𝙰 [ 𝙸𝙸 ] ⟅'
      : ((user.level >= 185) && (user.level <= 200)) ? '⟆ 𝚄𝚂𝙴𝚁 𝙴𝚇𝙿𝙴𝚁𝚃𝙾/𝙰 [ 𝙸 ] ⟅'
      : ((user.level >= 200) && (user.level <= 400)) ? '⟆ 𝙰𝙳𝙼𝙸𝙽 𝙱𝙾𝚃 [ 𝙿𝚁𝙾 1 ] ⟅'
      : ((user.level >= 405) && (user.level <= 700)) ? '⟆ 𝙰𝙳𝙼𝙸𝙽 𝙱𝙾𝚃 [ 𝙿𝚁𝙾 2 ] ⟅'
      : ((user.level >= 700) && (user.level <= 1000)) ? '⟆ 𝙰𝙳𝙼𝙸𝙽 𝙱𝙾𝚃 [ 𝙿𝚁𝙾 3 ] ⟅'
      : '❮💞 𝙴𝚇𝙿𝙴𝚁𝚃𝙾 𝙴𝙽 𝙼𝙸𝚃𝚂𝚄𝚁𝙸 - 𝙱𝙾𝚃 - 𝙼𝙳 💞❯'

    user.role = role
    return true
}

export default handler
