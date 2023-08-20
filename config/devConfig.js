module.exports = {
    devConfig: {
        DB_CONNECTION_STRING: 'mongodb://127.0.0.1/insta-store',
        JWT_ACCESS_SECRET:
            '409e7a79e152370390172e1a6600b7b5f31da2a51b33e8bd3f834f50580197008624b84d45c877b950fcfa110ed2ded76a1b2e28e5cfdc4c8abd2f72287617cd',
        JWT_REFRESH_SECRET:
            '414b1eacbf6dba1be501ca9758f903692a61864c7fe6ee814feb6e96db63bf64a3474a47d0a3b3371426a0ac38d7f2b80bab9c860c96f3b0f64a7655149b31bb',
        CLIENT_ORIGIN: 'localhost,localhost:3000,localhost:3001,localhost:5000,localhost:8000,localhost:5173',
        ORIGIN: 'http://localhost,http://localhost:5173,http://localhost:5000',
    },
};
