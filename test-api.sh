#!/bin/bash

# Example API Usage Script for Haven Rush V1 Backend
# This demonstrates how to interact with the Moneyball API

echo "========================================"
echo "Haven Rush V1 - API Usage Examples"
echo "========================================"
echo ""

# Configuration
API_URL="http://localhost:3000/api/moneyball"
VISITOR_ID="550e8400-e29b-41d4-a716-446655440001"
PROPERTY_ID="550e8400-e29b-41d4-a716-446655440002"

echo "1. Recording a check-in event (10 points)"
echo "POST $API_URL"
echo ""

curl -X POST "$API_URL" \
  -H "Content-Type: application/json" \
  -d '{
    "visitor_id": "'"$VISITOR_ID"'",
    "property_id": "'"$PROPERTY_ID"'",
    "event_type": "check_in",
    "metadata": {
      "location": "Open House",
      "timestamp": "2024-01-01T10:00:00Z"
    }
  }' | jq '.'

echo ""
echo "2. Recording a favorite event (5 points)"
echo "POST $API_URL"
echo ""

curl -X POST "$API_URL" \
  -H "Content-Type: application/json" \
  -d '{
    "visitor_id": "'"$VISITOR_ID"'",
    "property_id": "'"$PROPERTY_ID"'",
    "event_type": "favorite",
    "metadata": {
      "from_page": "property_detail"
    }
  }' | jq '.'

echo ""
echo "3. Recording a tour request (20 points)"
echo "POST $API_URL"
echo ""

curl -X POST "$API_URL" \
  -H "Content-Type: application/json" \
  -d '{
    "visitor_id": "'"$VISITOR_ID"'",
    "property_id": "'"$PROPERTY_ID"'",
    "event_type": "tour_request",
    "metadata": {
      "preferred_time": "2024-01-05T14:00:00Z",
      "contact_method": "email"
    }
  }' | jq '.'

echo ""
echo "4. Retrieving engagement score"
echo "GET $API_URL?visitor_id=$VISITOR_ID&property_id=$PROPERTY_ID"
echo ""

curl -X GET "$API_URL?visitor_id=$VISITOR_ID&property_id=$PROPERTY_ID" \
  | jq '.'

echo ""
echo "========================================"
echo "Expected total: 35 points (medium engagement)"
echo "========================================"
