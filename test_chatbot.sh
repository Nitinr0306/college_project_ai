# Test chatbot functionality using PowerShell

# Test successful response
$response = Invoke-RestMethod -Uri 'http://localhost:5000/chat' -Method Post -ContentType 'application/json' -Body (@{message="Hello"} | ConvertTo-Json)
Write-Host "Successful response test:"
$response

# Test empty message
$response = Invoke-RestMethod -Uri 'http://localhost:5000/chat' -Method Post -ContentType 'application/json' -Body (@{message=""} | ConvertTo-Json)
Write-Host "Empty message test:"
$response

# Test API error handling
$response = Invoke-RestMethod -Uri 'http://localhost:5000/chat' -Method Post -ContentType 'application/json' -Body (@{message="Test error"} | ConvertTo-Json)
Write-Host "Error handling test:"
$response