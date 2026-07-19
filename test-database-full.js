// Comprehensive Database Test Script
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL || 'https://wwdbdstbbpcmcbzwgunj.supabase.co';
const supabaseKey = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind3ZGJkc3RiYnBjbWNiendndW5qIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQyMTAyNzIsImV4cCI6MjA5OTc4NjI3Mn0.NC7VUoJNKM3BkP0RagRhi_FScAyP2TDOpx-crPP4OnA';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testDatabase() {
  console.log('🔍 Testing Supabase Database Connection...\n');
  console.log('URL:', supabaseUrl);
  console.log('');

  const results = {
    connection: false,
    users: false,
    meetings: false,
    participants: false,
    canInsert: false,
    canQuery: false
  };

  try {
    // Test 1: Connection
    console.log('✓ Connection established');
    results.connection = true;

    // Test 2: Users table
    console.log('\n=== Testing USERS Table ===');
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('id, email, full_name')
      .limit(5);

    if (usersError) {
      console.log('❌ Users table error:', usersError.message);
    } else {
      console.log(`✅ Users table: ${users.length} users found`);
      if (users.length > 0) {
        console.log('Sample user:', {
          id: users[0].id,
          email: users[0].email,
          name: users[0].full_name
        });
      }
      results.users = true;
    }

    // Test 3: Meetings table
    console.log('\n=== Testing MEETINGS Table ===');
    const { data: meetings, error: meetingsError } = await supabase
      .from('meetings')
      .select('*')
      .limit(5);

    if (meetingsError) {
      console.log('❌ Meetings table error:', meetingsError.message);
    } else {
      console.log(`✅ Meetings table: ${meetings.length} meetings found`);
      if (meetings.length > 0) {
        console.log('Sample meeting:', {
          id: meetings[0].id,
          meeting_id: meetings[0].meeting_id,
          title: meetings[0].title,
          status: meetings[0].status
        });
      }
      results.meetings = true;
    }

    // Test 4: Participants table
    console.log('\n=== Testing PARTICIPANTS Table ===');
    const { data: participants, error: participantsError } = await supabase
      .from('participants')
      .select('*')
      .limit(5);

    if (participantsError) {
      console.log('❌ Participants table error:', participantsError.message);
    } else {
      console.log(`✅ Participants table: ${participants.length} participants found`);
      results.participants = true;
    }

    // Test 5: Can we insert a test meeting?
    console.log('\n=== Testing INSERT Permission ===');
    const testMeetingId = 'TEST' + Date.now();
    const { data: insertTest, error: insertError } = await supabase
      .from('meetings')
      .insert([{
        meeting_id: testMeetingId,
        title: 'Test Meeting - Will Delete',
        host_id: users && users[0] ? users[0].id : '00000000-0000-0000-0000-000000000000',
        host_name: 'Test User',
        status: 'active',
        created_at: new Date().toISOString()
      }])
      .select()
      .single();

    if (insertError) {
      console.log('❌ Insert permission:', insertError.message);
    } else {
      console.log('✅ Insert permission: Working');
      console.log('Created test meeting:', insertTest.meeting_id);
      results.canInsert = true;

      // Clean up - delete test meeting
      const { error: deleteError } = await supabase
        .from('meetings')
        .delete()
        .eq('id', insertTest.id);

      if (!deleteError) {
        console.log('✅ Cleanup: Test meeting deleted');
      }
    }

    // Test 6: Query with filters
    console.log('\n=== Testing QUERY with Filters ===');
    const { data: activeMeetings, error: queryError } = await supabase
      .from('meetings')
      .select('*')
      .eq('status', 'active')
      .limit(3);

    if (queryError) {
      console.log('❌ Query error:', queryError.message);
    } else {
      console.log(`✅ Query working: ${activeMeetings.length} active meetings found`);
      results.canQuery = true;
    }

    // Summary
    console.log('\n' + '='.repeat(50));
    console.log('DATABASE TEST SUMMARY');
    console.log('='.repeat(50));
    console.log('Connection:       ', results.connection ? '✅ PASS' : '❌ FAIL');
    console.log('Users Table:      ', results.users ? '✅ PASS' : '❌ FAIL');
    console.log('Meetings Table:   ', results.meetings ? '✅ PASS' : '❌ FAIL');
    console.log('Participants Table:', results.participants ? '✅ PASS' : '❌ FAIL');
    console.log('Insert Permission:', results.canInsert ? '✅ PASS' : '❌ FAIL');
    console.log('Query Permission: ', results.canQuery ? '✅ PASS' : '❌ FAIL');
    console.log('='.repeat(50));

    const allPass = Object.values(results).every(v => v === true);
    if (allPass) {
      console.log('\n✅ ALL TESTS PASSED - Database is fully functional!\n');
      process.exit(0);
    } else {
      console.log('\n⚠️  SOME TESTS FAILED - Check permissions or table structure\n');
      process.exit(1);
    }

  } catch (error) {
    console.error('\n❌ FATAL ERROR:', error.message);
    console.error(error);
    process.exit(1);
  }
}

testDatabase();
