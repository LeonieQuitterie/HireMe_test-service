// D:\HireMeAI\apps\backend\src\index.ts
import * as dotenv from 'dotenv';
import * as path from 'path';
import * as fs from 'fs';

// ✅ Manual override - force load .env
const envPath = path.resolve(__dirname, '../.env');

console.log('🔍 Manual dotenv loading:');
console.log('Current __dirname:', __dirname);
console.log('Looking for .env at:', envPath);
console.log('File exists?', fs.existsSync(envPath) ? '✅ YES' : '❌ NO');

if (fs.existsSync(envPath)) {
  // Read and parse manually
  const envContent = fs.readFileSync(envPath, 'utf8');
  const envConfig = dotenv.parse(envContent);
  
  console.log('📦 Found variables:', Object.keys(envConfig));
  
  // Force set into process.env (override any existing values)
  for (const key in envConfig) {
    process.env[key] = envConfig[key];
  }
  
  console.log('✅ Environment variables loaded and set');
} else {
  console.error('❌ .env file not found!');
  console.error('Please create .env file at:', envPath);
  process.exit(1);
}

console.log('='.repeat(50));
console.log('🔍 Final environment check:');
console.log('PORT:', process.env.PORT || '5000 (default)');
console.log('SUPABASE_URL:', process.env.SUPABASE_URL ? '✅ Loaded' : '❌ Missing');
console.log('SUPABASE_SERVICE_ROLE:', process.env.SUPABASE_SERVICE_ROLE ? '✅ Loaded' : '❌ Missing');
console.log('='.repeat(50));

// NOW import other modules
import express from 'express';
import cors from 'cors';
import routes from './routes';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api', routes);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Error Handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('❌ Error:', err.stack);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Start server
app.listen(PORT, () => {
  console.log('='.repeat(50));
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📝 API docs available at http://localhost:${PORT}/api/health`);
  console.log('='.repeat(50));
});