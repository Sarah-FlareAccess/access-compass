// Supabase Connection Test
// Run this to verify your Supabase setup is working correctly

import { supabase, isSupabaseEnabled } from './supabase';

export async function testSupabaseConnection() {
  console.log('🧪 Testing Supabase Connection...\n');

  // Step 1: Check if credentials are present
  console.log('Step 1: Checking environment variables...');
  if (!isSupabaseEnabled()) {
    console.error('❌ Supabase credentials not found in .env file');
    console.log('Make sure you have:');
    console.log('  - VITE_SUPABASE_URL');
    console.log('  - VITE_SUPABASE_ANON_KEY');
    return false;
  }
  console.log('✅ Supabase credentials found\n');

  // Step 2: Test database connection
  console.log('Step 2: Testing database connection...');
  try {
    const { error } = await supabase!.from('sessions').select('count').limit(1);

    if (error) {
      console.error('❌ Database connection failed:', error.message);
      console.log('\n📋 Common issues:');
      console.log('  1. Have you run database-schema.sql in Supabase SQL Editor?');
      console.log('  2. Check if the "sessions" table exists in Table Editor');
      console.log('  3. Verify your VITE_SUPABASE_URL is correct');
      return false;
    }

    console.log('✅ Database connection successful\n');
  } catch (err: any) {
    console.error('❌ Connection error:', err.message);
    return false;
  }

  // Step 3: Check if tables exist
  console.log('Step 3: Checking if tables exist...');
  const tables = ['sessions', 'actions', 'evidence', 'clarifications'];

  for (const table of tables) {
    try {
      const { error } = await supabase!.from(table).select('count').limit(1);

      if (error) {
        console.error(`❌ Table "${table}" not found`);
        console.log('   Run database-schema.sql in Supabase SQL Editor');
        return false;
      }
      console.log(`✅ Table "${table}" exists`);
    } catch (err) {
      console.error(`❌ Error checking table "${table}"`);
      return false;
    }
  }

  console.log('\n🎉 All tests passed! Supabase is ready to use.\n');
  return true;
}

// Test insert/select (optional)
export async function testDatabaseOperations() {
  if (!isSupabaseEnabled()) {
    console.log('Supabase not enabled');
    return;
  }

  console.log('🧪 Testing database operations...\n');

  try {
    // Test insert
    console.log('Testing insert...');
    const testSession = {
      business_snapshot: { test: true },
      selected_modules: ['physical-access'],
      discovery_responses: {},
      constraints: {},
    };

    const { data: insertData, error: insertError } = await supabase!
      .from('sessions')
      .insert(testSession)
      .select()
      .single();

    if (insertError) {
      console.error('❌ Insert failed:', insertError.message);
      return;
    }
    console.log('✅ Insert successful');

    // Test select
    console.log('Testing select...');
    const { error: selectError } = await supabase!
      .from('sessions')
      .select('*')
      .eq('id', insertData.id)
      .single();

    if (selectError) {
      console.error('❌ Select failed:', selectError.message);
      return;
    }
    console.log('✅ Select successful');

    // Test delete (cleanup)
    console.log('Cleaning up test data...');
    const { error: deleteError } = await supabase!
      .from('sessions')
      .delete()
      .eq('id', insertData.id);

    if (deleteError) {
      console.error('❌ Delete failed:', deleteError.message);
      return;
    }
    console.log('✅ Delete successful');

    console.log('\n🎉 All database operations working correctly!\n');
  } catch (err: any) {
    console.error('❌ Test failed:', err.message);
  }
}
