@echo off

REM Test API connectivity
echo Testing API connectivity...
curl -X POST -H "Content-Type: application/json" -d "{\"message\":\"test\"}" http://localhost:5000/chat

REM Test response handling
echo 
Testing response handling...
curl -X POST -H "Content-Type: application/json" -d "{\"message\":\"What is carbon footprint?\"}" http://localhost:5000/chat

REM Test frontend display
echo 
Testing frontend display...
start http://localhost:5000

echo 
Tests completed. Check the output above for results.
pause