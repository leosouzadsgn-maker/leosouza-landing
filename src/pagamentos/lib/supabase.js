import { createClient } from '@supabase/supabase-js';

/*
=====================================================
SUPABASE - CENTRAL DE PAGAMENTOS
=====================================================

A URL do projeto e a Publishable Key são públicas
e podem ser utilizadas no frontend.

NÃO coloque aqui uma sb_secret_.
=====================================================
*/

// URL pública do projeto Supabase
const SUPABASE_URL =
  'https://tjbzzkvdsnubsndqmzsd.supabase.co';

// Cole aqui a sua Publishable Key (sb_publishable_...)
const SUPABASE_PUBLISHABLE_KEY =
  'sb_publishable_iWQPhYPqHaBOEJUQcaelwA_ocFsQUUn';

export const supabase = createClient(
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY
);