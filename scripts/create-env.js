const fs = require('fs');

fs.writeFileSync('./.env', `MODE=${process.env.MODE}\n`);