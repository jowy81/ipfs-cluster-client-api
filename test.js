import IPFSClusterClient from './src/index.js';

const client = new IPFSClusterClient({ host: 'localhost', port: '9094' });

async function runTests() {
  try {
    // Test /add
    console.log('Testing /add...');
    const cid = await client.add('./testfile.txt');
    console.log('✅ Uploaded CID:', cid);

    // Test /dirAdd
    console.log('Testing /dirAdd...');
    const dirCids = await client.dirAdd('./testDir');
    console.log('✅ Directory CIDs:', dirCids);

    // Test /pin
    console.log('Testing /pin...');
    const pinResult = await client.pin(cid);
    console.log('✅ Pinned:', pinResult);

    // Test /status
    console.log('Testing /status...');
    const status = await client.status(cid);
    console.log('✅ Status:', status);

    // Test /allocations
    console.log('Testing /allocations...');
    const allocations = await client.allocations(cid);
    console.log('✅ Allocations:', allocations);

    // Test /health
    console.log('Testing /health...');
    const health = await client.health();
    console.log('✅ Health:', health);

    // Test /peers
    console.log('Testing /peers...');
    const peers = await client.peers();
    console.log('✅ Peers:', peers);

    // Test /listPins
    console.log('Testing /listPins...');
    const pins = await client.listPins();
    console.log('✅ Pins:', pins);

    // Test /remove
    console.log('Testing /remove...');
    const removeResult = await client.remove(cid);
    console.log('✅ Removed:', removeResult);
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

runTests();