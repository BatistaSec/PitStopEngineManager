// telemetry.worker.ts

// Este worker roda em uma thread separada para não bloquear a UI do React (60 FPS)
self.onmessage = function(e: MessageEvent) {
    const rawData = e.data;
    
    try {
        // Parsing pesado de dados binários ou JSON complexo
        let parsed;
        if (typeof rawData === 'string') {
            parsed = JSON.parse(rawData);
        } else {
            parsed = rawData;
        }

        // Interpolation e suavização de dados para o Canvas
        const processed = {
            ...parsed,
            smoothedX: parsed.x * 1.05, // Placeholder interpolation
            smoothedY: parsed.y * 1.05,
            timestamp: Date.now()
        };

        // Envia de volta para a thread principal (React)
        self.postMessage(processed);
    } catch (err) {
        console.error("[WebWorker] Erro ao parsear telemetria", err);
    }
};
