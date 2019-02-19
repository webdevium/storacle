const ServerExpress = require('spreadable/src/server/transports/express')();
const routes = require('spreadable/src/server/transports/express/routes');
const routesClient = require('spreadable/src/server/transports/express/client/routes');
const routesApi = require('spreadable/src/server/transports/express/api/routes');
const routesApiMaster = require('spreadable/src/server/transports/express/api/master/routes');
const routesApiSlave = require('spreadable/src/server/transports/express/api/slave/routes');
const routesApiNode = require('spreadable/src/server/transports/express/api/node/routes');
const utils = require('../../../utils');

module.exports = (Parent) => {
  return class ServerExpressStoracle extends (Parent || ServerExpress) {
    /**
     * @see ServerExpress.prototype.getMainRouter
     */
    getMainRouter() {
      const arr = routes.slice();
      arr.splice(routes.findIndex(r => r.name == 'ping'), 0, ...require('./routes'));
      return this.createRouter(arr);
    }
  
    /**
     * @see ServerExpress.prototype.getClientRouter
     */
    getClientRouter() {
      return this.createRouter(routesClient.concat(require('./client/routes')));
    }
  
    /**
     * @see ServerExpress.prototype.getApiRouter
     */
    getApiRouter() {
      return this.createRouter(routesApi.concat(require('./api/routes')));
    }
  
    /**
     * @see ServerExpress.prototype.getApiMasterRouter
     */
    getApiMasterRouter() {
      return this.createRouter(routesApiMaster.concat(require('./api/master/routes')));
    }
  
    /**
     * @see ServerExpress.prototype.getApiSlaveRouter
     */
    getApiSlaveRouter() {
      return this.createRouter(routesApiSlave.concat(require('./api/slave/routes')));
    }

    /**
     * @see ServerExpress.prototype.getApiNodeRouter
     */
    getApiNodeRouter() {
      return this.createRouter(routesApiNode.concat(require('./api/node/routes')));
    }

    /**
     * Get the file storing response schema
     * 
     * @returns {object}
     */
    getFileStoreResponseSchema() {
      return {
        type: 'object',
        props: {
          address: {
            type: 'string',
            value: utils.isValidAddress.bind(utils)
          },
          hash: 'string',
          link: {
            type: 'string',
            value: this.node.isValidFileLink.bind(this.node)
          }
        },
        strict: true
      }
    }

    /**
     * Get the file storing candidate slave response schema
     * 
     * @returns {object}
     */
    getFileStoreCandidateSlaveResponseSchema() {
      return {
        type: 'object',
        props: {
          address: {
            type: 'string',
            value: utils.isValidAddress.bind(utils)
          },
          free: 'number',
          isAvailable: 'boolean',
          isExistent: 'boolean'
        },
        strict: true
      }
    }

    /**
     * Get the file storing candidate master response schema
     * 
     * @returns {object}
     */
    getFileStoreCandidateMasterResponseSchema() {
      return {
        type: 'object',
        props: {
          address: {
            type: 'string',
            value: utils.isValidAddress.bind(utils)
          },
          candidates: {
            type: 'array',
            items: this.getFileStoreCandidateSlaveResponseSchema()
          },
          existing: 'number'
        },
        strict: true
      }
    }

    /**
     * Get the file links slave response schema
     * 
     * @returns {object}
     */
    getFileLinksSlaveResponseSchema() {
      return {
        type: 'object',
        props: {
          address: {
            type: 'string',
            value: utils.isValidAddress.bind(utils)
          },
          link: {
            type: 'string',
            value: this.node.isValidFileLink.bind(this.node)
          }
        },
        strict: true
      }
    }

    /**
     * Get the file links master response schema
     * 
     * @returns {object}
     */
    getFileLinksMasterResponseSchema() {
      return {
        type: 'object',
        props: {
          address: {
            type: 'string',
            value: utils.isValidAddress.bind(utils)
          },
          links: {
            type: 'array',
            items: this.getFileLinksSlaveResponseSchema()
          }
        },
        strict: true
      }
    }
  }
};