import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';
import path from 'path';

class IPFSClusterClient {
  constructor({ host = 'localhost', port = '9094', protocol = 'http' } = {}) {
    this.baseUrl = `${protocol}://${host}:${port}`;
  }

  // Upload a file and return its CID
  async add(filePath) {
    try {
      const fileContent = fs.readFileSync(filePath);
      const formData = new FormData();
      formData.append('file', fileContent, { filename: path.basename(filePath) });

      const response = await axios.post(`${this.baseUrl}/add`, formData, {
        headers: {
          ...formData.getHeaders()
        }
      });
      return response.data.cid;
    } catch (error) {
      throw new Error(`Error uploading file: ${error.message}`);
    }
  }

  // Upload an entire directory and return an array of CIDs
  async dirAdd(dirPath) {
    try {
      const files = fs.readdirSync(dirPath);
      const cids = [];

      for (const file of files) {
        const fullPath = path.join(dirPath, file);
        const stats = fs.statSync(fullPath);

        if (stats.isFile()) {
          const cid = await this.add(fullPath);
          cids.push({ name: file, cid });
        } else if (stats.isDirectory()) {
          // Recursively upload subdirectories
          const subCids = await this.dirAdd(fullPath);
          cids.push(...subCids);
        }
      }

      return cids;
    } catch (error) {
      throw new Error(`Error uploading directory: ${error.message}`);
    }
  }

  // Pin a CID to the cluster
  async pin(cid) {
    try {
      const response = await axios.post(`${this.baseUrl}/pins/${cid}`);
      return response.data;
    } catch (error) {
      throw new Error(`Error pinning CID: ${error.message}`);
    }
  }

  // Get the status of a CID in the cluster
  async status(cid) {
    try {
      const response = await axios.get(`${this.baseUrl}/pins/${cid}`);
      return response.data;
    } catch (error) {
      throw new Error(`Error fetching status: ${error.message}`);
    }
  }

  // Remove a pin from the cluster
  async remove(cid) {
    try {
      const response = await axios.delete(`${this.baseUrl}/pins/${cid}`);
      return response.data;
    } catch (error) {
      throw new Error(`Error removing pin: ${error.message}`);
    }
  }

  // List all pins in the cluster
  async listPins() {
    try {
      const response = await axios.get(`${this.baseUrl}/pins`);
      return response.data;
    } catch (error) {
      throw new Error(`Error listing pins: ${error.message}`);
    }
  }

  // Get the allocations (nodes) for a CID
  async allocations(cid) {
    try {
      const response = await axios.get(`${this.baseUrl}/allocations/${cid}`);
      return response.data;
    } catch (error) {
      throw new Error(`Error fetching allocations: ${error.message}`);
    }
  }

  // Get the health status of the cluster
  async health() {
    try {
      const response = await axios.get(`${this.baseUrl}/health`);
      return response.data;
    } catch (error) {
      throw new Error(`Error fetching health: ${error.message}`);
    }
  }

  // List the peers (nodes) in the cluster
  async peers() {
    try {
      const response = await axios.get(`${this.baseUrl}/peers`);
      return response.data;
    } catch (error) {
      throw new Error(`Error fetching peers: ${error.message}`);
    }
  }
}

export { IPFSClusterClient };