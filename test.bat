@echo off
call npm install
node main.js scriptName=testing/s322/chat.js arguments="{\"@Say\":\"How fun!\"}"