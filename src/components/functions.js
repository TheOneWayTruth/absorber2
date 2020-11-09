import { log, dmgind } from "./gloabals.js";

function RoundToInt(e) {
  return Math.round(100 * (e + Number.EPSILON)) / 100;
}

function changeLife(a, b, c, d) {
  b = RoundToInt(b);

  if (isNaN(b)) return;

  if ("damage" == d && b < 0) return;

  "damage" == d ? (a.clife -= b) : (a.clife += b);

  if (c == "regeneration") {
    return;
  }

  0 < b && showIndicator(b, c, a, d);
}

function showIndicator(c, d, e, f) {
  let g = {
    fire: "orange",
    bleed: "crimson",
    poison: "lightgreen",
    crit1: "brown",
    crit2: "yellow",
    crit4: "purple",
    crit8: "red",
    crit16: "chartreuse",
    lifesteal: "darkred",
    reflect: "gold",
  }[d];

  switch (d) {
    case "crit1":
      d = "physical";
      break;
    case "crit2":
      d = "crit";
      break;
    case "crit4":
      d = "supercrit";
      break;
    case "crit8":
      d = "megacrit";
      break;
    case "crit16":
      d = "ultracrit";
      break;
    default:
  }

  if (d.includes("crit")) {
    log.push(`<div class="crit">${e.name} takes <span style="color: ${g}">${c}</span> ${f} through ${d}</div>`);
  } else if (d.includes("lifesteal") || d.includes("reflect")) {
    log.push(`<div class="effect">${e.name} takes <span style="color: ${g}">${c}</span> ${f} through ${d}</div>`);
  }
  else {
    log.push(`<div class="basics">${e.name} takes <span style="color: ${g}">${c}</span> ${f} through ${d}</div>`);
  }


  if (null == e.version) {
    dmgind.push({ text: c, color: g });
    setTimeout(() => { try { dmgind.shift(); } catch { } }, 500);
  }
}

export function hasDuplicates(array) {
  return (new Set(array)).size !== array.length;
}

export function removeItemOnce(arr, value) {
  var index = arr.indexOf(value);
  if (index > -1) {
    arr.splice(index, 1);
  }
  return arr;
}

function checkDot(a, b, c) {
  if (0 < a.status.poison) {
    let damage = b.magic / 4;
    if (a.resistance != undefined && a.resistance.poisonresistance != undefined) {
      log.push(`<div class="basics">${a.name} resisted<span style="green"> ${RoundToInt(damage * (a.resistance.poisonresistance / 100))} poison</span> damage</div>`);
      damage = damage - damage * (a.resistance.poisonresistance / 100);
    }
    changeLife(a, damage, "poison", "damage", c);
    a.status.poison--;
  }
  if (0 < a.status.fire) {
    let damage = b.magic / 3;

    if (a.resistance != undefined && a.resistance.fireresistance != undefined) {
      log.push(`<div class="basics">${a.name} resisted<span style="orange"> ${RoundToInt(damage * (a.resistance.fireresistance / 100))} fire</span> damage</div>`);
      damage = damage - damage * (a.resistance.fireresistance / 100);
    }

    changeLife(a, damage, "fire", "damage", c);
    a.status.fire--;
  }
  if (0 < a.status.bleed) {
    let damage = b.dmg / 10;
    if (
      a.resistance != undefined &&
      a.resistance.bleedresistance != undefined
    ) {
      log.push(`<div class="basics">${a.name} resisted<span style="crimson"> ${RoundToInt(damage * (a.resistance.bleedresistance / 100))} bleeding</span>  damage</div>`);
      damage = damage - damage * (a.resistance.bleedresistance / 100);
    }
    changeLife(a, damage, "bleed", "damage", c);
    a.status.bleed--;
  }

  0 < a.status.slow && a.status.slow--;
  0 < a.status.stim && a.status.stim--;
}

function checkRegeneration(a, b, c) {
  if (a.status.invert > 0) {
    changeLife(a, a.regeneration / 25, "invert", "damage", b, c);
  } else if (a.status.bury > 0 && a.regeneration > 0) {
    a.regeneration / 25 * 4 + a.clife <= a.life
      ? changeLife(a, a.regeneration / 6, "regeneration", "heal", b, c)
      : changeLife(a, a.life - a.clife, "regeneration", "heal", b, c);
  } else if (a.regeneration > 0) {
    a.regeneration / 25 + a.clife <= a.life
      ? changeLife(a, a.regeneration / 25, "regeneration", "heal", b, c)
      : changeLife(a, a.life - a.clife, "regeneration", "heal", b, c);
  }
}

function checkChance(a) {
  if (a != null) {
    if (Math.floor(10001 * Math.random()) <= 100 * a) {
      return true;
    }
  }
  return false;
}

function checkDodge(target, attacker) {
  if (null != attacker.chance) {
    if (null != target.effects)
      if (target.effects.precision != null)
        if (
          checkChance(attacker.chance.dodge - target.effects.precision)
        ) {
          return true;
        } else {
          return false;
        }

    if (checkChance(attacker.chance.dodge)) return true;
  }
  return false;
}

function checkDouble(a) {
  return checkChance(a.chance.double);
}

function CheckDotChance(name, a, b) {
  let chance = a.chance[name];
  if (chance != undefined) {
    let table = [
      { id: "fire", color: "orange", verb: "burned" },
      { id: "bleed", color: "crimson", verb: "sliced" },
      { id: "poison", color: "green", verb: "poisoned" },
      { id: "disarm", color: "yellow", verb: "disarmed" },
    ];

    let obj = table.find((x) => name == x.id);

    if (chance >= 100) {
      let times = (chance - (chance % 100)) / 100;
      checkChance(chance % 100) && times++;
      b.status[name] += times;
      log.push(`<div class="chances">${a.name} <span style="color:${obj.color}">${obj.verb}</span> ${b.name} ${times} times</div>`);
    } else if (checkChance(chance)) {
      b.status[name]++;
      log.push(`<div class="chances">${a.name} <span style="color:${obj.color}">${obj.verb}</span> ${b.name}</div>`);
    }
  }
}

function checkPoison(a, b) {
  CheckDotChance("poison", a, b);
}

function checkBleed(a, b) {
  CheckDotChance("bleed", a, b);
}

function checkFire(a, b) {
  CheckDotChance("fire", a, b);
}

function checkDisarm(a, b) {
  CheckDotChance("disarm", a, b);
}

function checkInstakill(a, b) {
  if (checkChance(a.chance.instakill)) {
    if (b.boss && !a.items.includes("helosword")) {
      log.push(`<div class="chances">${a.name} tryed to <span style="color:purple">instakill</span> ${b.name} doing ${b.life / 4} Damage</div>`);
      b.clife -= b.life / 4;
    } else {
      log.push(`<div class="chances">${a.name} <span style="color:purple">instakilled</span> ${b.name}</div>`);
      b.clife = -1;
    }
    return true;
  }
  return false;
}

function checkSlow(a, b) {
  if (checkChance(a.chance.slow)) {
    b.status.slow++;
    log.push(`<div class="chances">${a.name} <span style="color:lightGrey">slowed</span> ${b.name}</div>`);
  }
}

function checkInvert(a, b) {
  if (checkChance(a.chance.invert)) {
    b.status.invert++;
    log.push(`<div class="chances">${a.name} <span style="color:white">invert</span> ${b.name}</div>`);
  }
}

function checkStim(a) {
  if (checkChance(a.chance.stim)) {
    a.status.stim++;
    log.push(`<div class="chances">${a.name} <span style="color:green">used Stimmpack</span></div>`);
  }
}

function checkStun(a, b) {
  if (checkChance(a.chance.stun)) {
    b.status.stun++;
    log.push(`<div class="chances">${a.name} <span style="color:lightYellow">stunned</span> ${b.name}</div>`);
  }
}

function checkSilence(a, b) {
  if (checkChance(a.chance.silence)) {
    b.status.silence++;
    log.push(`<div class="chances">${a.name} <span style="color:grey">silenced</span> ${b.name}</div>`);
  }
}

function checkBury(a) {
  if (checkChance(a.chance.bury)) {
    a.status.bury++;
    log.push(`<div class="chances">${a.name} <span style="color:brown">buried</span> himself</div>`);
  }
}

function checkRot(a, b) {
  if (checkChance(a.chance.rot)) {
    b.status.rot++;
    log.push(`<div class="chances">${a.name} <span style="color:darkred">casted rot on</span> ${b.name}</div>`);
  }
}

function checkBlock(a) {
  if (null != a.effects) if (null != a.effects.block) return a.effects.block;
  return 0;
}

function checkRotTurn(a) {
  if (a.status.rot > 0) {
    a.status.rot--;
    return true;
  }
  return false;
}

export function checkTurn(target, attacker, disfi, exit, itemlist) {

  if (!checkRotTurn(target)) {
    checkRegeneration(target);
  }

  if (checkSpeed(target)) {
    return;
  }

  checkDot(target, attacker);

  if (!checkDeath(target, attacker, disfi, exit, itemlist)) {
    return;
  }

  if (checkStunTurn(target)) {
    checkDeath(target, attacker, disfi, exit, itemlist);
    return;
  }

  checkInvertTurn(target);

  checkBuryTurn(target);

  let att = false,
    crit = 1;

  if (checkDodge(target, attacker)) {
    log.push(`<div class="chances">${attacker.name} <span style="color:brown">dodged</span></div>`);
    checkDeath(target, attacker, disfi, exit, itemlist);
    return;
  }

  if (target.status.silence <= 0) {
    if (null != target.chance) {
      if (checkInstakill(target, attacker)) {
        checkDeath(target, attacker, disfi, exit, itemlist);
        return;
      }

      att = checkDouble(target);

      checkBury(target);


      checkInvert(target, attacker);
      checkStim(target, attacker);
      checkRot(target, attacker);
      checkPoison(target, attacker);
      checkBleed(target, attacker);
      checkFire(target, attacker);
      checkDisarm(target, attacker);
      checkSlow(target, attacker);
      checkStun(target, attacker);
      checkSilence(target, attacker);
      if (checkChance(target.chance.crit)) {
        crit = 2;
        if (checkChance(target.chance.supercrit)) {
          crit = 4;
          if (checkChance(target.chance.megacrit)) {
            crit = 8
            if (checkChance(target.chance.ultracrit)) {
              crit = 16
            }
          }
        }
      }
    }
  } else {
    target.status.silence--;
  }

  let block = checkBlock(attacker);

  if (checkDisarmTurn(target)) {
    log.push(`<div class="chances">${target.name} is <span style="color:yellow">disarmed</span> and does not attack<div>`);
    return;
  }

  checkCrit(crit, attacker, target, block);

  att &&
    setTimeout(() => {
      try {
        dmgind.shift();
        log.push(`<div class="chances">${target.name} attacks second time<div>`);
        checkCrit(crit, scrit, mcrit, attacker, target, block);
      } catch { }
    }, 500);

  checkCounter(target, attacker);

  target.version != null && animateObject("animated");

  checkDeath(target, attacker, disfi, exit, itemlist);
}

function checkCounter(target, attacker) {
  if (attacker.chance != null) {
    if (checkChance(attacker.chance.counter)) {
      checkCrit(1, target, attacker, 0);
      log.push(`<div class="chances">${attacker.name} countered the attack</div>`);
    }
  }
}

function checkCrit(crit, attacker, target, block) {
  let dmg = target.dmg * crit - block;
  checkReflect(target, attacker, target.dmg * crit);
  if (0 < dmg) {
    changeLife(attacker, dmg, "crit" + crit, "damage");
    checkLifesteal(target, dmg);
  } else {
    log.push(`<div class="basics">${target.name} can't do any damage to ${attacker.name}</div>`);
  }
}

function checkReflect(a, b, c, d, e) {
  if (b.effects != null) {
    if (b.effects.reflect != null) {
      changeLife(a, c * (b.effects.reflect / 100), "reflect", "damage", d, e);
    }
  }
}

function checkLifesteal(a, b, c, d) {
  if (null != a.effects)
    if (null != a.effects.lifesteal) {
      a.clife + b * (a.effects.lifesteal / 100) <= a.life
        ? changeLife(
          a,
          b * (a.effects.lifesteal / 100),
          "lifesteal",
          "heal",
          c,
          d
        )
        : changeLife(a, a.life - a.clife, "lifesteal", "heal", c, d);
    }
}

function checkSpeed(a) {
  let sp = 100;

  0 < a.status.slow && (sp -= 50);
  0 < a.status.stim && (sp += 50);

  a.cspeed += sp;

  if (a.cspeed >= a.speed) {
    a.cspeed = 0;
    return false;
  }
  return true;
}

function animateObject(b) {
  $("#enemy").addClass(b);
  setTimeout(() => {
    try {
      $("#enemy").removeClass(b);
    } catch { }
  }, 500);
}

function checkEnemyDeath(target, attacker, func, res, itemlist) {
  if (attacker.chance != null) {
    if (checkChance(attacker.chance.resurrect)) {
      respawn(attacker);
      return;
    }
  }

  if (target.version != null) {
    animateObject("die");
  }

  for (let a in attacker.gain)
    if (
      "effects" != a &&
      "chance" != a &&
      "speed" != a &&
      "resistance" != a &&
      "life" != a
    ) {
      target[a] += attacker.gain[a];
    } else if ("life" == a) {
      if (target[a] + attacker.gain[a] <= 0) {
        target[a] = 1;
      } else {
        target[a] += attacker.gain[a];
      }
    } else if ("speed" == a) {
      if (attacker.gain.speed > 0) {
        if (target.speed - attacker.gain.speed < 110) {
          target.speed = 110;
          target.sspeed += target.speed - 110 + attacker.gain.speed;
        } else {
          target.speed -= attacker.gain.speed;
        }
      } else {
        if (target.sspeed - attacker.gain.speed * -1 >= 0) {
          target.sspeed += attacker.gain.speed;
        } else {
          target.speed -= attacker.gain.speed;
        }
      }
    } else if ("effects" == a)
      for (let b in attacker.gain.effects)
        target.effects[b] == null
          ? (target.effects[b] = attacker.gain.effects[b])
          : (target.effects[b] += attacker.gain.effects[b]);
    else if ("chance" == a)
      for (let b in attacker.gain.chance)
        target.chance[b] == null
          ? (target.chance[b] = attacker.gain.chance[b])
          : (target.chance[b] += attacker.gain.chance[b]);
    else if ("resistance" == a)
      for (let b in attacker.gain.resistance)
        target.resistance[b] == null
          ? (target.resistance[b] = attacker.gain.resistance[b])
          : (target.resistance[b] += attacker.gain.resistance[b]);

  target.counter[attacker.id]++;
  target.allcount[attacker.id]++;

  for (let e of itemlist.filter(x => !target.unlocked.includes(x.id))) {
    if (e.req != undefined) {

      if ((target.allcount[e.req.id] * 100) / e.req.count >= 100) {
        target.unlocked.push(e.id);
      }
    }
  }

  try {
    if (attacker.boss) {
      log.push(`<div class="death">${attacker.name} was killed in ${target.time}</div>`);
      attacker.id == getLastBoss(target) && func();
    } else {
      log.push(`<div class="death">${target.name} killed  ${attacker.name}</div>`);
    }
  } catch (e) {
    console.log("some error with boss")
    console.error(e)
  }

  respawn(attacker);
  checkCleared(target, attacker, res);
}

export function getLastBoss(t) {
  let lastBoss = "chulthuluseye";

  switch (t.prestige) {
    case 0:
      lastBoss = "chulthuluseye";
      break;
    case 1:
      lastBoss = "necromant";
      break;
    case 2:
      lastBoss = "darlek";
      break;
    case 3:
      lastBoss = "chromeman";
      break;
    case 4:
      lastBoss = "turret";
      break;
    case 5:
      lastBoss = "jadis";
      break;

    default:
      lastBoss = "jadis";
      break;
  }
  return lastBoss;
}

export function isEmpty(obj) {
  for (var prop in obj) {
    if (obj.hasOwnProperty(prop)) {
      return false;
    }
  }

  return JSON.stringify(obj) === JSON.stringify({});
}

function checkDeath(target, attacker, func, res, itemlist) {
  if (target.version != null) {
    if (attacker.clife <= 0) {
      checkEnemyDeath(target, attacker, func, res, itemlist);
      return false;
    }
    if (target.clife <= 0) {
      checkPlayerDeath(target, attacker, res);
      return false;
    }
  } else {
    if (attacker.clife <= 0) {
      checkPlayerDeath(attacker, target, res);
      return false;
    }
    if (target.clife <= 0) {
      checkEnemyDeath(attacker, target, func, res, itemlist);
      return false;
    }
  }
  return true;
}

export function respawn(t) {
  t.clife = t.life;
  t.cspeed = 0;
  t.status = {
    slow: 0,
    poison: 0,
    fire: 0,
    stun: 0,
    silence: 0,
    rot: 0,
    bleed: 0,
    bury: 0,
    stim: 0,
    invert: 0,
    disarm: 0,
  };
  return t;
}

function checkPlayerDeath(a, b, d) {
  if (a.chance != null) {
    if (checkChance(a.chance.resurrect)) {
      log.push(`<div class="chances">${a.name} resurrected</div>`);
      respawn(a);
      return;
    }
  }

  log.push(`<div class="death">${b.name} killed  ${a.name}</div>`);
  respawn(b);
  d();
}

function checkBuryTurn(a) {
  if (a.status.bury > 0) {
    a.status.bury--;
  }
}

function checkInvertTurn(a) {
  if (a.status.invert > 0) {
    a.status.invert--;
  }
}

function checkStunTurn(a) {
  if (a.status.stun > 0) {
    a.status.stun--;
    return true;
  }
  return false;
}

function checkDisarmTurn(a) {
  if (a.status.disarm > 0) {
    a.status.disarm--;
    return true;
  }
  return false;
}

function checkCleared(a, b, d) {
  a.counter[b.id] >= getLast(b.max, a.prestige) && d();
}

export function getLast(j, p) {
  if (p >= j.length) {
    return j[j.length - 1];
  } else {
    return j[p];
  }
}

export function getNodeById(id, node) {
  var reduce = [].reduce;
  function runner(result, node) {
    if (result || !node) return result;
    return (
      (node.id === id && node) ||
      runner(null, node.open) ||
      reduce.call(Object(node), runner, result)
    );
  }
  return runner(null, node);
}

export function getNext(db, key) {
  for (var i = 0; i < db.length; i++) {
    if (db[i].key === key) {
      return db[i + 1] && db[i + 1].value;
    }
  }
}

export function copyToClipboard(text) {
  var today = new Date();
  var date =
    today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();
  let filename = "AbsorberSave" + date;
  var element = document.createElement("a");
  element.setAttribute(
    "href",
    "data:text/plain;charset=utf-8," + encodeURIComponent(text)
  );
  element.setAttribute("download", filename);
  element.style.display = "none";
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
}
