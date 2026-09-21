"use client";

import React, { useEffect, useRef, useState } from 'react';

export default function LiveTimingMap() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const workerRef = useRef<Worker | null>(null);
    const [status, setStatus] = useState('Desconectado');
    
    // Posição otimista de reconciliação
    const carPositions = useRef<Record<string, { x: number, y: number }>>({});

    useEffect(() => {
        // 1. Inicializar Web Worker
        workerRef.current = new Worker(new URL('../workers/telemetry.worker.ts', import.meta.url));
        
        workerRef.current.onmessage = (e) => {
            const data = e.data;
            if (data.carId) {
                // Reconciliação Cliente-Servidor (Corrige a posição com base no servidor)
                carPositions.current[data.carId] = { x: data.smoothedX, y: data.smoothedY };
            }
        };

        // 2. Conectar WebSocket de alta latência
        const ws = new WebSocket('ws://localhost:3001/ws/telemetry');
        ws.onopen = () => setStatus('Conectado a 20Hz');
        ws.onmessage = (e) => {
            // Envia o payload bruto direto para o Worker para não travar o React
            workerRef.current?.postMessage(e.data);
        };
        ws.onclose = () => setStatus('Desconectado');

        // 3. Render Loop de 60 FPS (Canvas API nativa, sem re-render do React)
        let animationId: number;
        
        const renderLoop = () => {
            const canvas = canvasRef.current;
            if (canvas) {
                const ctx = canvas.getContext('2d');
                if (ctx) {
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    
                    // Desenhar traçado da pista (Simplificado)
                    ctx.strokeStyle = '#333';
                    ctx.lineWidth = 15;
                    ctx.beginPath();
                    ctx.ellipse(400, 300, 300, 150, 0, 0, 2 * Math.PI);
                    ctx.stroke();

                    // Desenhar carros
                    Object.entries(carPositions.current).forEach(([carId, pos]) => {
                        ctx.fillStyle = carId === 'VER' ? '#0600EF' : '#FF0000';
                        ctx.beginPath();
                        ctx.arc(pos.x || 400, pos.y || 150, 8, 0, 2 * Math.PI);
                        ctx.fill();
                        
                        ctx.fillStyle = '#FFF';
                        ctx.font = '10px Arial';
                        ctx.fillText(carId, (pos.x || 400) - 10, (pos.y || 150) - 12);
                    });
                }
            }
            animationId = requestAnimationFrame(renderLoop);
        };
        
        animationId = requestAnimationFrame(renderLoop);

        return () => {
            ws.close();
            workerRef.current?.terminate();
            cancelAnimationFrame(animationId);
        };
    }, []);

    return (
        <div className="w-full flex flex-col items-center bg-gray-900 p-4 rounded-xl border border-gray-800">
            <h2 className="text-xl font-bold text-white mb-2">Engenharia de Pista - Live Map</h2>
            <div className="text-sm text-green-400 mb-4 font-mono">Status: {status} (60 FPS Canvas API + Web Worker)</div>
            <canvas 
                ref={canvasRef} 
                width={800} 
                height={600} 
                className="bg-black border border-gray-700 rounded-lg shadow-2xl"
            />
        </div>
    );
}
