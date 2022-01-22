const fs = require('fs').promises;
const glob = require('glob');
let chalk;
import('chalk').then(({ default: instance }) => chalk = instance);
const matchingReactString = "from \"react\"";

glob(
  // Modify the paths as you like
  './src/**/*.js',
  // Add anything else you want to ignore here
  { ignore: [] }, 
  (err, matches) => {
    if (err) return;

    console.log(chalk.blue`Found these files matching the globs specified:`);
    console.log(matches);

    matches.forEach(async path => {
      const result = await fs.readFile(path);
      if (!result) return;

      if (result.includes(matchingReactString)) {
        const newPath = path.concat('x'); // Pretty much add 'x' to the end to make it 'jsx'
        console.log(chalk.yellow`Renaming ${path} to ${newPath}`);
        fs.rename(path, newPath);
      }
    });
  }
);
