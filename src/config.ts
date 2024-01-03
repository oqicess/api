const config = {
    mode: process.env.MODE || 'dev',
    isDev: process.env.MODE === 'dev',
    isProd: process.env.MODE === 'prod',
    app: {
        port: !!process.env.APP_PORT ? Number(process.env.APP_PORT) : 8080,
        frontendUrl: process.env.MODE === 'prod' ? 'https://example.com' : 'http://localhost:3000',
    },
};

export default config;
