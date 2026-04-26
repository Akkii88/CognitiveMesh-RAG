#!/bin/bash

echo "🔧 Cleaning ports..."

# Kill backend port (8000)
PID8000=$(lsof -ti :8000)
if [ -n "$PID8000" ]; then
  kill -9 $PID8000
  echo "✅ Killed process on port 8000"
fi

# Kill frontend port (3000)
PID3000=$(lsof -ti :3000)
if [ -n "$PID3000" ]; then
  kill -9 $PID3000
  echo "✅ Killed process on port 3000"
fi

echo "🚀 Starting backend..."

# Activate virtual environment
source venv/bin/activate

# Start backend in background
uvicorn api:app --reload --port 8000 &
BACKEND_PID=$!

# Wait until backend is live
echo "⏳ Waiting for backend..."
until curl -s http://localhost:8000/ > /dev/null; do
  sleep 1
done

echo "✅ Backend is running!"

echo "🌐 Starting frontend..."

# Start frontend
cd UI
pnpm install
pnpm dev