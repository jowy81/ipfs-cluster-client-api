import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';
import path from 'path';

class IPFSClusterClient {
  constructor({ host = 'localhost', port = '9094', protocol = 'http' } = {}) {
    this.baseUrl = `${protocol}://${host}:${port}`;
  }

  // Test connection
  async checkConnection() {
    try {
      const response = await axios.get(`${this.baseUrl}/id`, {
        timeout: 3000
      });
      return {
        connected: true,
        version: response.data.version,
        peerId: response.data.id,
        clusterId: response.data.cluster_peer_id
      };
    } catch (error) {
      return {
        connected: false,
        error: error.message,
        code: error.response?.status || 'ECONNREFUSED',
        endpoint: `${this.baseUrl}/id`
      };
    }
  }

  // Upload a file and return its CID
  async add(filePath) {
    try {
      const fileContent = fs.readFileSync(filePath);
      const formData = new FormData();
      formData.append('file', fileContent, {
        filename: path.basename(filePath)
      });

      const response = await axios.post(`${this.baseUrl}/add`, formData, {
        headers: formData.getHeaders()
      });

      return {
        success: true,
        cid: response.data.cid,
        path: path.basename(filePath),
        size: fileContent.length,
        type: 'file',
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        code: error.response?.status || 500
      };
    }
  }

  // Upload an entire directory and return an array of CIDs
  async dirAdd(dirPath) {
    try {
      const files = fs.readdirSync(dirPath);
      const results = [];
  
      for (const file of files) {
        const fullPath = path.join(dirPath, file);
        const stats = fs.statSync(fullPath);
  
        if (stats.isFile()) {
          const result = await this.add(fullPath);
          if (result.success) {
            results.push({
              name: file,
              cid: result.cid,
              size: result.size,
              path: result.path
            });
          }
        } else if (stats.isDirectory()) {
          const subResults = await this.dirAdd(fullPath);
          if (subResults.success) {
            results.push(...subResults.items); // Only spread if successful
          }
        }
      }
  
      return {
        success: true,
        count: results.length,
        items: results,
        type: 'directory'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        code: error.response?.status || 500
      };
    }
  }

  // Pin a CID to the cluster
  async pin(cid) {
    try {
      const response = await axios.post(`${this.baseUrl}/pins/${cid}`);
      return {
        success: true,
        cid,
        status: 'pinned',
        operation: 'pin',
        timestamp: new Date().toISOString(),
        ...response.data
      };
    } catch (error) {
      return {
        success: false,
        cid,
        error: error.message,
        code: error.response?.status || 500
      };
    }
  }

  // Get the status of a CID in the cluster
  async status(cid) {
    try {
      const response = await axios.get(`${this.baseUrl}/pins/${cid}`);
      return {
        success: true,
        cid,
        status: response.data.status,
        peers: response.data.peers,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        success: false,
        cid,
        error: error.message,
        code: error.response?.status || 500
      };
    }
  }

  // Remove a pin from the cluster
  async remove(cid) {
    try {
      const response = await axios.delete(`${this.baseUrl}/pins/${cid}`);
      return {
        success: true,
        cid,
        operation: 'remove',
        timestamp: new Date().toISOString(),
        ...response.data
      };
    } catch (error) {
      return {
        success: false,
        cid,
        error: error.message,
        code: error.response?.status || 500
      };
    }
  }

  // List all pins in the cluster
  async listPins() {
    try {
      const response = await axios.get(`${this.baseUrl}/pins`);
      return {
        success: true,
        count: response.data.pins?.length || 0,
        pins: response.data.pins,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        code: error.response?.status || 500
      };
    }
  }

  // Get the allocations (nodes) for a CID
  async allocations(cid) {
    try {
      const response = await axios.get(`${this.baseUrl}/allocations/${cid}`);
      return {
        success: true,
        cid,
        nodes: response.data.allocations,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        success: false,
        cid,
        error: error.message,
        code: error.response?.status || 500
      };
    }
  }

  // Get the health status of the cluster
  async health() {
    try {
      const response = await axios.get(`${this.baseUrl}/health`);
      return {
        success: true,
        status: response.data.status,
        timestamp: new Date().toISOString(),
        details: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        code: error.response?.status || 500
      };
    }
  }

  // List the peers (nodes) in the cluster
  async peers() {
    try {
      const response = await axios.get(`${this.baseUrl}/peers`);
      return {
        success: true,
        status: response.data.status,
        timestamp: new Date().toISOString(),
        details: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        code: error.response?.status || 500
      };
    }
  }
}

export { IPFSClusterClient };