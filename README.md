# ipfs-cluster-client-api

A simple Node.js client library for interacting with the IPFS Cluster HTTP API.

## Installation

Install the package via npm:

```bash
npm install ipfs-cluster-client-api
```

## Usage

Here's a basic example of how to use the library:

```javascript
import IPFSClusterClient from 'ipfs-cluster-client-api';

// Initialize the client with your cluster's host and port
const client = new IPFSClusterClient({ host: '91.99.15.187', port: '9094' });

// Upload a file
const cid = await client.add('./testfile.txt');
console.log('CID:', cid);

// Pin a CID
await client.pin(cid);
console.log('Pinned CID:', cid);

// Check status of the CID
const status = await client.status(cid);
console.log('Status:', status);
```

## API

### `new IPFSClusterClient({ host, port, protocol })`

Creates a new instance of the IPFS Cluster client.

- `host` (string, default: `'localhost'`): The hostname or IP address of the IPFS Cluster.
- `port` (string, default: `'9094'`): The port where the IPFS Cluster API is running.
- `protocol` (string, default: `'http'`): The protocol to use (`'http'` or `'https'`).

### Methods

#### `add(filePath)`

Uploads a file to the cluster and returns its CID.

- `filePath` (string): Path to the file to upload.
- Returns: `string` - The CID of the uploaded file.
- Throws: Error if the upload fails.

```javascript
const cid = await client.add('./testfile.txt');
console.log(cid); // e.g., "QmUNTyqtgDWB7m6QzMJZNgbcUirkuxwXJjUahUeeLsryL7"
```

#### `dirAdd(dirPath)`

Uploads an entire directory and its contents recursively, returning an array of file names and their CIDs.

- `dirPath` (string): Path to the directory to upload.
- Returns: `Array<{ name: string, cid: string }>` - List of uploaded files with their names and CIDs.
- Throws: Error if the upload fails.

```javascript
const cids = await client.dirAdd('./testDir');
console.log(cids); // e.g., [{ name: "file1.txt", cid: "Qm..." }, { name: "file2.txt", cid: "Qm..." }]
```

#### `pin(cid)`

Pins a CID to the cluster, ensuring it is replicated across nodes.

- `cid` (string): The CID to pin.
- Returns: `object` - Details of the pinning operation.
- Throws: Error if pinning fails.

```javascript
await client.pin('QmUNTyqtgDWB7m6QzMJZNgbcUirkuxwXJjUahUeeLsryL7');
```

#### `status(cid)`

Gets the status of a CID in the cluster.

- `cid` (string): The CID to check.
- Returns: `object` - Status information (e.g., pinned, replicated).
- Throws: Error if the request fails.

```javascript
const status = await client.status('QmUNTyqtgDWB7m6QzMJZNgbcUirkuxwXJjUahUeeLsryL7');
console.log(status);
```

#### `remove(cid)`

Removes a pinned CID from the cluster.

- `cid` (string): The CID to unpin.
- Returns: `object` - Confirmation of the removal.
- Throws: Error if the removal fails.

```javascript
await client.remove('QmUNTyqtgDWB7m6QzMJZNgbcUirkuxwXJjUahUeeLsryL7');
```

#### `listPins()`

Lists all pinned CIDs in the cluster.

- Returns: `object` - List of pinned CIDs and their details.
- Throws: Error if the request fails.

```javascript
const pins = await client.listPins();
console.log(pins);
```

#### `allocations(cid)`

Gets the list of nodes where a CID is pinned.

- `cid` (string): The CID to check.
- Returns: `object` - List of node IDs or details.
- Throws: Error if the request fails.

```javascript
const allocations = await client.allocations('QmUNTyqtgDWB7m6QzMJZNgbcUirkuxwXJjUahUeeLsryL7');
console.log(allocations);
```

#### `health()`

Gets the health status of the cluster.

- Returns: `object` - Health metrics and status of the cluster.
- Throws: Error if the request fails.

```javascript
const health = await client.health();
console.log(health);
```

#### `peers()`

Lists the peers (nodes) in the cluster.

- Returns: `object` - List of peer IDs and details.
- Throws: Error if the request fails.

```javascript
const peers = await client.peers();
console.log(peers);
```

## Requirements

- Node.js v14 or higher
- Dependencies: `axios`, `form-data`

## License

MIT