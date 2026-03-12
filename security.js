const { machineIdSync } = require('node-machine-id');
const si = require('systeminformation');
const crypto = require('crypto');

async function getMachineHash() {
    const uuid = machineIdSync(); // OS ID
    const cpu = await si.cpu();   // CPU Info
    const mb = await si.baseboard(); // Motherboard Serial

    // In teeno ko mila kar aik unique string banayein
    const rawString = `${uuid}-${cpu.brand}-${mb.serial}`;
    
    // String ko hash (encrypt) karein taake user samajh na sakay
    return crypto.createHash('sha256').update(rawString).digest('hex');
}

module.exports = { getMachineHash };