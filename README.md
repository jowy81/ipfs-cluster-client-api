# ipfs-cluster-client-api

> A simple Node.js client library for interacting with the IPFS Cluster HTTP API.

## Table of contents <!-- omit in toc -->

- [Installation](#installation)
- [Usage](#usage)
- [API](#api)
  - [Methods](#methods)
    - [add(filePath)](#addfilepath)
    - [dirAdd(dirPath)](#diradddirpath)
    - [pin(cid)](#pincid)
    - [status(cid)](#statuscid)
    - [remove(cid)](#removecid)
    - [listPins()](#listpins)
    - [allocations(cid)](#allocationscid)
    - [health()](#health)
    - [peers()](#peers)
    - [checkConnection()](#checkconnection)
- [Requirements](#requirements)
- [License](#license)

## Installation

Install the package and its dependencies via npm:

```bash
npm install ipfs-cluster-client-api axios form-data
```

## Usage

Here's a basic example of how to use the library:

```javascript
const { IPFSClusterClient } = require('ipfs-cluster-client-api');

// Initialize the client with your cluster's host and port
const client = new IPFSClusterClient({ host: 'localhost', port: '9094' });

// Upload a file
client.add('./testfile.txt').then(result => {
  console.log('CID:', result.cid);
}).catch(err => console.error(err));
```

## API

### Methods

#### add(filePath)

Uploads a single file to the IPFS Cluster and returns its CID.

- **Parameters**:
  - `filePath` (string): Path to the file on the local filesystem.
- **Returns**: Promise resolving to:
  - Success: `{ success: true, cid: string, path: string, size: number, type: 'file', timestamp: string }`
  - Failure: `{ success: false, error: string, code: number }`
- **Example**:
```javascript
client.add('/path/to/file.txt').then(result => {
  if (result.success) {
    console.log(`Uploaded ${result.path} with CID: ${result.cid}`);
  }
});
```

#### dirAdd(dirPath)

Uploads an entire directory recursively and returns an array of CIDs.

- **Parameters**:
  - `dirPath` (string): Path to the directory on the local filesystem.
- **Returns**: Promise resolving to:
  - Success: `{ success: true, count: number, items: [{ name: string, cid: string, size: number, path: string }], type: 'directory' }`
  - Failure: `{ success: false, error: string, code: number }`
- **Example**:
```javascript
client.dirAdd('/path/to/directory').then(result => {
  if (result.success) {
    console.log(`Uploaded ${result.count} files:`, result.items);
  }
});
```

#### pin(cid)

Pins a CID to the IPFS Cluster.

- **Parameters**:
  - `cid` (string): Content Identifier to pin.
- **Returns**: Promise resolving to:
  - Success: `{ success: true, cid: string, status: 'pinned', operation: 'pin', timestamp: string, ...additionalData }`
  - Failure: `{ success: false, cid: string, error: string, code: number }`
- **Example**:
```javascript
client.pin('Qm...').then(result => {
  if (result.success) {
    console.log(`Pinned CID: ${result.cid}`);
  }
});
```

#### status(cid)

Retrieves the status of a CID in the cluster.

- **Parameters**:
  - `cid` (string): Content Identifier to check.
- **Returns**: Promise resolving to:
  - Success: `{ success: true, cid: string, status: string, peers: array, timestamp: string }`
  - Failure: `{ success: false, cid: string, error: string, code: number }`
- **Example**:
```javascript
client.status('Qm...').then(result => {
  if (result.success) {
    console.log(`Status of ${result.cid}: ${result.status}`);
  }
});
```

#### remove(cid)

Removes a pin from the cluster.

- **Parameters**:
  - `cid` (string): Content Identifier to unpin.
- **Returns**: Promise resolving to:
  - Success: `{ success: true, cid: string, operation: 'remove', timestamp: string, ...additionalData }`
  - Failure: `{ success: false, cid: string, error: string, code: number }`
- **Example**:
```javascript
client.remove('Qm...').then(result => {
  if (result.success) {
    console.log(`Removed CID: ${result.cid}`);
  }
});
```

#### listPins()

Lists all pinned CIDs in the cluster.

- **Returns**: Promise resolving to:
  - Success: `{ success: true, count: number, pins: array, timestamp: string }`
  - Failure: `{ success: false, error: string, code: number }`
- **Example**:
```javascript
client.listPins().then(result => {
  if (result.success) {
    console.log(`Total pins: ${result.count}`, result.pins);
  }
});
```

#### allocations(cid)

Gets the nodes where a CID is stored.

- **Parameters**:
  - `cid` (string): Content Identifier to query.
- **Returns**: Promise resolving to:
  - Success: `{ success: true, cid: string, nodes: array, timestamp: string }`
  - Failure: `{ success: false, cid: string, error: string, code: number }`
- **Example**:
```javascript
client.allocations('Qm...').then(result => {
  if (result.success) {
    console.log(`Nodes for ${result.cid}:`, result.nodes);
  }
});
```

#### health()

Gets the health status of the cluster.

- **Returns**: Promise resolving to:
  - Success: `{ success: true, status: string, timestamp: string, details: object }`
  - Failure: `{ success: false, error: string, code: number }`
- **Example**:
```javascript
client.health().then(result => {
  if (result.success) {
    console.log('Cluster health:', result.details);
  }
});
```

#### peers()

Lists the peers (nodes) in the cluster.

- **Returns**: Promise resolving to:
  - Success: `{ success: true, status: string, timestamp: string, details: object }`
  - Failure: `{ success: false, error: string, code: number }`
- **Example**:
```javascript
client.peers().then(result => {
  if (result.success) {
    console.log('Cluster peers:', result.details);
  }
});
```

#### checkConnection()

Tests the connection to the IPFS Cluster.

- **Returns**: Promise resolving to:
  - Success: `{ connected: true, version: string, peerId: string, clusterId: string }`
  - Failure: `{ connected: false, error: string, code: string|number, endpoint: string }`
- **Example**:
```javascript
client.checkConnection().then(result => {
  if (result.connected) {
    console.log(`Connected to cluster v${result.version}`);
  } else {
    console.log('Connection failed:', result.error);
  }
});
```

## Requirements

- **Node.js**: v14.x or higher
- **IPFS Cluster**: A running instance (default: `http://localhost:9094`)
- **Dependencies**:
  - `axios`: For HTTP requests
  - `form-data`: For multipart file uploads
  - `fs` and `path`: Node.js built-in modules

## License

MIT License. See [LICENSE](LICENSE) for details.