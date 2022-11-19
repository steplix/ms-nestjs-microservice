"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.servicesFactory = void 0;
const config_1 = require("@nestjs/config");
const service_1 = require("./service");
exports.servicesFactory = {
    provide: "SERVICE",
    inject: [config_1.ConfigService],
    useFactory: (config) => {
        const services = config.get("services", []);
        // Add all configurated services to Service class
        Object.values(services).forEach((service) => service_1.Service.add(service));
        // Return Service class
        return service_1.Service;
    },
};
// export Service Class
__exportStar(require("./service"), exports);
// export Service Health Indicator
__exportStar(require("./health"), exports);
