let svg_to_png = require('svg-to-png');
const path = require('path');

const process_dir_path = path.dirname(process.argv[1])

console.log(process_dir_path)

svg_to_png.convert(`${process_dir_path}/components.svg`, `${process_dir_path}/output`) // async, returns promise
  .then( function(){
    // Do tons of stuff
  });