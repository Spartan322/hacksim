@echo off
call npm install
node commandline.js scriptName=testing/s322/chat.js arguments="{\"@Say\":\"How fun!\"}"