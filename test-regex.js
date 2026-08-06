const fs = require('fs');

const garbled = "Normal: á é í. Garbled: SeÃ§Ã£o ou municÃ­pio... â€œaspasâ€\u009D";

const regex = /([\u00C2-\u00DF][\u0080-\u00BF])|([\u00E0-\u00EF][\u0080-\u00BF][\u0080-\u00BF])|([\u00F0-\u00F4][\u0080-\u00BF][\u0080-\u00BF][\u0080-\u00BF])/g;

const fixed = garbled.replace(regex, (match) => {
  try {
    return Buffer.from(match, 'latin1').toString('utf8');
  } catch(e) {
    return match;
  }
});

console.log('Original:', garbled);
console.log('Fixed:', fixed);
