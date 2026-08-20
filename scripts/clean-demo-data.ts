import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config({ path: '.env.local' });

const url =
  process.env.VITE_SUPABASE_URL ||
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  process.env.SUPABASE_URL ||
  'https://lfueqadcdsmujufekifo.supabase.co';

const key =
  process.env.VITE_SUPABASE_ANON_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  process.env.SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxmdWVxYWRjZHNtdWp1ZmVraWZvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODcxODc3MzgsImV4cCI6MjEwMjc2MzczOH0.mRAGUWzqPa14jJWbtmCdaPDWn7UU8XOhE75gr0TnWpg';

const supabase = createClient(url, key);

const DEMO_PET_IDS = ['thor', 'caramelo', 'luna', 'bolinha', 'rex'];
const DEMO_SOL_IDS = ['sol-1', 'sol-2'];
const DEMO_FOSTER_IDS = ['foster-1'];

async function executeClean() {
  console.log('--------------------------------------------------');
  console.log('🧹 Limpando dados padrão / demonstração do Supabase...');
  console.log('--------------------------------------------------');

  try {
    // 1. Deletar solicitações de demonstração
    const { error: errSol } = await supabase
      .from('solicitations')
      .delete()
      .in('id', DEMO_SOL_IDS);

    console.log('1. Solicitações de teste removidas:', errSol ? errSol.message : '✅ Sucesso');

    // 2. Deletar pedidos de acolhimento de demonstração
    const { error: errFoster } = await supabase
      .from('foster_requests')
      .delete()
      .in('id', DEMO_FOSTER_IDS);

    console.log('2. Acolhimentos de teste removidos:', errFoster ? errFoster.message : '✅ Sucesso');

    // 3. Deletar cachorros/pets de exemplo
    const { error: errPets } = await supabase
      .from('pets')
      .delete()
      .in('id', DEMO_PET_IDS);

    console.log('3. Pets de demonstração removidos:', errPets ? errPets.message : '✅ Sucesso');

    console.log('--------------------------------------------------');
    console.log('✨ Base de dados 100% limpa! Apenas registros criados por usuários foram preservados.');
    console.log('--------------------------------------------------');
  } catch (error: any) {
    console.error('❌ Erro durante a limpeza:', error.message);
  }
}

executeClean();
