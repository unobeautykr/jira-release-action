const child_process = require("child_process");

async function runCommmand(command) {
  return new Promise((resolve, reject) => {
    child_process.exec(command, function (err, stdout, stderr) {
      if (err != null) {
        reject(new Error(err));
      } else if (typeof stderr != "string") {
        reject(new Error(stderr));
      } else {
        resolve(stdout);
      }
    });
  });
}

module.exports = { runCommmand };
