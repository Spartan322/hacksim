# Hacksim
A simple Javascript project aimed at making development in Hackmud just a little bit easier

## Warning
This is really barebones and could use some fixing up, this started as a quick and dirty prototype to prove it could be done in an easier to use interface

## Usage
- Make sure you first have node installed
- Make sure npm is available and call `npm install` in this folder
- When finished those steps, run something like the following:
```
node commandline.js scriptName="<location of script>" arguments="<arguments to hand into the script>"
```
Hacksim will take care of the rest.
**NOTE: you must escape quotations for now**

If you feel like using this system as a normal node module instead, simply do require('hacksim'), documentation on this coming shortly.

After its run, you may see a warning that starts with:
```
{ Error: Cannot find module '../build/Release/bson'
```
in which case skipping past `js-bson: Failed to load c++ bson extension, using pure JS version`, 
everything produced to console will be shown, this includes chat and accts manipulations and other social scripts.
This is a problem with mangodb and has been an annoying bug to figure out.
I have made a simple hack to point out the actual output to account for this, I am not super skilled in node so someone else coming up with a better fix would be nice
