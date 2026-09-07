import path from 'path';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig, type Plugin } from 'vite';

import runtimeErrorOverlay from '@replit/vite-plugin-runtime-error-modal';

const rawPort = process.env.PORT || '5173';
const port = Number(rawPort);

if (Number.isNaN(port) || port <= 0) {
  throw new Error(`Invalid PORT value: "${rawPort}"`);
}

const basePath = process.env.BASE_PATH || '/';

const HOP_BY_HOP = new Set([
  'connection',
  'keep-alive',
  'transfer-encoding',
  'upgrade',
  'http2-settings',
  'host',
  'content-length',
]);

function apiForwarderPlugin(): Plugin {
  return {
    name: 'api-forwarder',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (!req.url || (!req.url.startsWith('/api/') && req.url !== '/api')) {
          return next();
        }

        try {
          const apiPort = process.env.API_PORT || '3000';
          const targets = [
            `http://127.0.0.1:${apiPort}`,
            `http://localhost:${apiPort}`,
          ];

          let bodyBuffer: Buffer | undefined;
          if (req.method !== 'GET' && req.method !== 'HEAD') {
            const chunks: Buffer[] = [];
            for await (const chunk of req) {
              chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
            }
            bodyBuffer = Buffer.concat(chunks);
          }

          const headers: Record<string, string> = {};
          for (const [k, v] of Object.entries(req.headers)) {
            if (v && !HOP_BY_HOP.has(k.toLowerCase())) {
              headers[k] = Array.isArray(v) ? v.join(', ') : v;
            }
          }
          if (bodyBuffer) {
            headers['content-length'] = String(bodyBuffer.length);
          }

          let lastError: any = null;
          for (const targetBase of targets) {
            const targetUrl = `${targetBase}${req.url}`;
            try {
              console.log(`[Vite -> API Forward] ${req.method} ${targetUrl}`);
              const controller = new AbortController();
              const timeout = setTimeout(() => controller.abort(), 6000);

              const response = await fetch(targetUrl, {
                method: req.method,
                headers,
                body: bodyBuffer,
                signal: controller.signal,
              } as any);

              clearTimeout(timeout);

              res.statusCode = response.status;
              response.headers.forEach((val, key) => {
                if (!HOP_BY_HOP.has(key.toLowerCase())) {
                  try {
                    res.setHeader(key, val);
                  } catch {}
                }
              });

              const resData = Buffer.from(await response.arrayBuffer());
              res.end(resData);
              return;
            } catch (err: any) {
              lastError = err;
              console.warn(`[Vite Forward Fail] ${targetUrl}: ${err.message}`);
            }
          }

          console.error('[Vite Forward All Failed]', lastError);
          if (!res.headersSent) {
            res.statusCode = 502;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({
              success: false,
              error: `API Server Unreachable: ${lastError?.message || 'Connection failed'}`,
            }));
          }
        } catch (fatalErr: any) {
          console.error('[Vite Forward Fatal Error]', fatalErr);
          if (!res.headersSent) {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({
              success: false,
              error: `Internal forwarder error: ${fatalErr?.message || 'Fatal error'}`,
            }));
          }
        }
      });
    },
  };
}

export default defineConfig({
  base: basePath,
  plugins: [
    apiForwarderPlugin(),
    react(),
    tailwindcss(),
    runtimeErrorOverlay(),
    ...(process.env.NODE_ENV !== 'production' &&
    process.env.REPL_ID !== undefined
      ? [
          await import('@replit/vite-plugin-cartographer').then((m) =>
            m.cartographer({
              root: path.resolve(import.meta.dirname, '..'),
            }),
          ),
          await import('@replit/vite-plugin-dev-banner').then((m) =>
            m.devBanner(),
          ),
        ]
      : []),
  ],
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, 'src'),
      '@assets': path.resolve(
        import.meta.dirname,
        '..',
        '..',
        'attached_assets',
      ),
    },
    dedupe: ['react', 'react-dom'],
  },
  root: path.resolve(import.meta.dirname),
  build: {
    outDir: path.resolve(import.meta.dirname, 'dist/public'),
    emptyOutDir: true,
  },
  server: {
    port,
    strictPort: true,
    host: '0.0.0.0',
    allowedHosts: true,
    fs: {
      strict: true,
    },
  },
  preview: {
    port,
    host: '0.0.0.0',
    allowedHosts: true,
  },
});
