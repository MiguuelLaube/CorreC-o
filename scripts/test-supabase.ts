import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config({ path: '.env.local' });

const url =
  process.env.VITE_SUPABASE_URL ||
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  process.env.SUPABASE_URL;

const key =
  process.env.VITE_SUPABASE_ANON_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  process.env.SUPABASE_ANON_KEY;

console.log('--------------------------------------------------');
console.log('🔍 Testando conexão com Supabase...');
console.log('🌐 URL:', url || '(não definida)');
console.log('🔑 Key:', key ? `${key.substring(0, 15)}...` : '(não definida)');
console.log('--------------------------------------------------');

if (!url || !key) {
  console.log('❌ ATENÇÃO: Cole as chaves no arquivo .env.local para prosseguir:');
  console.log('VITE_SUPABASE_URL="https://seu-projeto.supabase.co"');
  console.log('VITE_SUPABASE_ANON_KEY="sb_publishable_..."\n');
  process.exit(1);
}

const supabase = createClient(url, key);

async function testConnection() {
  try {
    const { data, error } = await supabase.auth.getSession();
    if (error) {
      console.log('❌ Erro de resposta do Supabase:', error.message);
    } else {
      console.log('🎉 SUCESSO! Conexão com o Supabase estabelecida perfeitamente.');
    }
  } catch (err: any) {
    console.log('❌ Falha na conexão:', err.message);
  }
}

testConnection();
