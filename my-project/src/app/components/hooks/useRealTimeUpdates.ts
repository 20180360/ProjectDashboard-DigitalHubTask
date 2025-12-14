import { useState, useCallback, useEffect, useRef } from 'react';
import { Task } from '../../types/tasks';

export function useRealTimeUpdates(projectId: string) {
  const wsRef = useRef<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]);

  // Connect to WebSocket
  const connect = useCallback(() => {
    if (!projectId || wsRef.current) return;

const ws = new WebSocket(`ws://localhost:3001/ws/projects/${projectId}`);
    wsRef.current = ws;

    ws.onopen = () => {
      console.log("WebSocket connected");
      setIsConnected(true);

      // طلب الـ tasks الحالية عند الاتصال
      ws.send(JSON.stringify({ type: "getTasks", projectId }));
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        // استقبال قائمة tasks كاملة
        if (data.type === "tasks" && data.tasks) {
          setTasks(data.tasks);
        }

        // استقبال مهمة جديدة فقط
        if (data.type === "taskCreated" && data.task) {
          setTasks(prev => [...prev, data.task]);
        }
      } catch (err) {
        console.error("WebSocket message parse error:", err);
      }
    };

    ws.onclose = () => {
      console.log("WebSocket disconnected");
      wsRef.current = null;
      setIsConnected(false);
    };

    ws.onerror = (err) => {
      console.error("WebSocket error:", err);
    };
  }, [projectId]);

  const disconnect = useCallback(() => {
    wsRef.current?.close();
    wsRef.current = null;
    setIsConnected(false);
  }, []);

  // Connect automatically when projectId changes
  useEffect(() => {
    connect();

    return () => disconnect();
  }, [projectId, connect, disconnect]);

  return { isConnected, tasks, connect, disconnect };
}
