// Test script to verify Supabase connection and database structure
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL || 'https://wwdbdstbbpcmcbzwgunj.supabase.co';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || 
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind3ZGJkc3RiYnBjbWNiendndW5qIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQyMTAyNzIsImV4cCI6MjA5OTc4NjI3Mn0.NC7VUoJNKM3BkP0RagRhi_FScAyP2TDOpx-crPP4OnA';

console.log('🔍 Testing Supabase Connection...\n');
console.log('URL:', supabaseUrl);
console.log('Key:', supabaseAnonKey.substring(0, 20) + '...\n');

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testConnection() {
    try {
        // Test 1: Check if we can connect
        console.log('✅ Test 1: Supabase client created\n');

        // Test 2: Check meetings table structure
        console.log('📋 Test 2: Checking meetings table...');
        const { data: meetings, error: meetingsError } = await supabase
            .from('meetings')
            .select('*')
            .limit(1);

        if (meetingsError) {
            console.error('❌ Error accessing meetings table:', meetingsError);
            console.error('   Code:', meetingsError.code);
            console.error('   Message:', meetingsError.message);
            console.error('   Details:', meetingsError.details);
            console.error('   Hint:', meetingsError.hint);
        } else {
            console.log('✅ Meetings table exists');
            console.log('   Sample data:', meetings);
        }

        // Test 3: Check meeting_participants table
        console.log('\n📋 Test 3: Checking meeting_participants table...');
        const { data: participants, error: participantsError } = await supabase
            .from('meeting_participants')
            .select('*')
            .limit(1);

        if (participantsError) {
            console.error('❌ Error accessing meeting_participants table:', participantsError);
            console.error('   Code:', participantsError.code);
            console.error('   Message:', participantsError.message);
        } else {
            console.log('✅ Meeting_participants table exists');
            console.log('   Sample data:', participants);
        }

        // Test 4: Check users table
        console.log('\n📋 Test 4: Checking users table...');
        const { data: users, error: usersError } = await supabase
            .from('users')
            .select('id, email, full_name')
            .limit(1);

        if (usersError) {
            console.error('❌ Error accessing users table:', usersError);
            console.error('   Code:', usersError.code);
            console.error('   Message:', usersError.message);
        } else {
            console.log('✅ Users table exists');
            console.log('   Sample data:', users);
        }

        // Test 5: Try to insert a test meeting
        console.log('\n🧪 Test 5: Trying to create a test meeting...');
        const testMeeting = {
            meeting_id: '999999',
            title: 'Test Meeting - DELETE ME',
            description: 'This is a test meeting',
            host_id: users && users[0] ? users[0].id : 'test-user-id',
            host_name: users && users[0] ? users[0].full_name : 'Test User',
            status: 'active',
            created_at: new Date().toISOString()
        };

        const { data: newMeeting, error: insertError } = await supabase
            .from('meetings')
            .insert([testMeeting])
            .select()
            .single();

        if (insertError) {
            console.error('❌ Failed to insert test meeting:', insertError);
            console.error('   Code:', insertError.code);
            console.error('   Message:', insertError.message);
            console.error('   Details:', insertError.details);
            console.error('   Hint:', insertError.hint);
        } else {
            console.log('✅ Successfully created test meeting!');
            console.log('   Meeting ID:', newMeeting.meeting_id);
            console.log('   Database ID:', newMeeting.id);

            // Clean up - delete the test meeting
            const { error: deleteError } = await supabase
                .from('meetings')
                .delete()
                .eq('meeting_id', '999999');

            if (deleteError) {
                console.error('⚠️  Failed to delete test meeting:', deleteError.message);
            } else {
                console.log('   ✅ Test meeting cleaned up');
            }
        }

        console.log('\n✅ All tests completed!\n');

    } catch (error) {
        console.error('\n❌ Unexpected error:', error);
        console.error('   Stack:', error.stack);
    }
}

testConnection();
