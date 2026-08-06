const fs = require('fs');

const garbled = "SeÃ§Ã£o ou municÃ­pio...";
console.log(garbled);
try {
  // Convert from garbled UTF-8 back to correct string
  // If garbled was created by decoding UTF-8 as Latin1, then 
  // encoding as Latin1 gives the original UTF-8 bytes.
  const fixed = Buffer.from(garbled, 'latin1').toString('utf8');
  console.log('Fixed:', fixed);
} catch(e) {
  console.error(e);
}
