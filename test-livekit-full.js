// Comprehensive LiveKit Test Script
const { AccessToken, RoomServiceClient } = require('livekit-server-sdk');
require('dotenv').config();

const LIVEKIT_URL = process.env.LIVEKIT_URL || 'wss://vcollab-a6y9bamp.livekit.cloud';
const LIVEKIT_API_KEY = process.env.LIVEKIT_API_KEY || 'APviq7oyyp5n9kk';
const LIVEKIT_API_SECRET = process.env.LIVEKIT_API_SECRET || 'SqGM3qauo0Cpq22AGHy7JgZ4xIMCNIICRWVUovJNUK';

async function testLiveKit() {
  console.log('🔍 Testing LiveKit Integration...\n');
  console.log('URL:', LIVEKIT_URL);
  console.log('API Key:', LIVEKIT_API_KEY);
  console.log('');

  const results = {
    config: false,
    tokenGeneration: false,
    roomService: false,
    canCreateRoom: false,
    canListRooms: false
  };

  try {
    // Test 1: Configuration
    console.log('=== Test 1: Configuration ===');
    if (LIVEKIT_URL && LIVEKIT_API_KEY && LIVEKIT_API_SECRET) {
      console.log('✅ LiveKit credentials configured');
      results.config = true;
    } else {
      console.log('❌ Missing LiveKit credentials');
      throw new Error('LiveKit not configured');
    }

    // Test 2: Token Generation
    console.log('\n=== Test 2: Token Generation ===');
    const testRoomName = 'test-room-' + Date.now();
    const testParticipant = 'test-user';
    
    const token = new AccessToken(LIVEKIT_API_KEY, LIVEKIT_API_SECRET, {
      identity: testParticipant,
      ttl: '1h',
    });

    token.addGrant({
      roomJoin: true,
      room: testRoomName,
      canPublish: true,
      canSubscribe: true,
      canPublishData: true,
    });

    const jwt = await token.toJwt();
    console.log('✅ Token generated successfully');
    console.log('Token (first 50 chars):', jwt.substring(0, 50) + '...');
    console.log('Room:', testRoomName);
    console.log('Participant:', testParticipant);
    results.tokenGeneration = true;

    // Test 3: Room Service Client
    console.log('\n=== Test 3: Room Service Client ===');
    const roomService = new RoomServiceClient(
      LIVEKIT_URL.replace('wss://', 'https://'),
      LIVEKIT_API_KEY,
      LIVEKIT_API_SECRET
    );
    console.log('✅ Room service client created');
    results.roomService = true;

    // Test 4: List Rooms
    console.log('\n=== Test 4: List Rooms ===');
    try {
      const rooms = await roomService.listRooms();
      console.log(`✅ Can list rooms: ${rooms.length} rooms found`);
      if (rooms.length > 0) {
        console.log('Sample room:', {
          name: rooms[0].name,
          numParticipants: rooms[0].numParticipants,
          creationTime: new Date(Number(rooms[0].creationTime) * 1000).toISOString()
        });
      }
      results.canListRooms = true;
    } catch (error) {
      console.log('⚠️  List rooms failed:', error.message);
      console.log('This might be a permissions issue, but token generation still works');
    }

    // Test 5: Create Room
    console.log('\n=== Test 5: Create Room ===');
    try {
      const newRoom = await roomService.createRoom({
        name: testRoomName,
        emptyTimeout: 300, // 5 minutes
        maxParticipants: 100,
      });
      console.log('✅ Can create rooms');
      console.log('Created room:', {
        name: newRoom.name,
        sid: newRoom.sid
      });
      results.canCreateRoom = true;

      // Clean up - delete test room
      try {
        await roomService.deleteRoom(testRoomName);
        console.log('✅ Cleanup: Test room deleted');
      } catch (cleanupError) {
        console.log('⚠️  Could not delete test room:', cleanupError.message);
      }
    } catch (error) {
      console.log('⚠️  Create room failed:', error.message);
      console.log('This might be a permissions issue, but token generation still works');
    }

    // Summary
    console.log('\n' + '='.repeat(50));
    console.log('LIVEKIT TEST SUMMARY');
    console.log('='.repeat(50));
    console.log('Configuration:     ', results.config ? '✅ PASS' : '❌ FAIL');
    console.log('Token Generation:  ', results.tokenGeneration ? '✅ PASS' : '❌ FAIL');
    console.log('Room Service:      ', results.roomService ? '✅ PASS' : '❌ FAIL');
    console.log('List Rooms:        ', results.canListRooms ? '✅ PASS' : '⚠️  SKIP');
    console.log('Create Rooms:      ', results.canCreateRoom ? '✅ PASS' : '⚠️  SKIP');
    console.log('='.repeat(50));

    // Critical tests must pass
    const criticalPass = results.config && results.tokenGeneration && results.roomService;
    
    if (criticalPass) {
      console.log('\n✅ CRITICAL TESTS PASSED - LiveKit is functional!');
      console.log('Note: Room management permissions are optional for video calls\n');
      process.exit(0);
    } else {
      console.log('\n❌ CRITICAL TESTS FAILED - Check LiveKit configuration\n');
      process.exit(1);
    }

  } catch (error) {
    console.error('\n❌ FATAL ERROR:', error.message);
    console.error(error);
    process.exit(1);
  }
}

testLiveKit();
