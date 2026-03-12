const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

// Configuration
const ITERATIONS = 100000;
const KEY_LENGTH = 32; // AES-256
const ALGORITHM = 'aes-256-gcm';

async function encrypt(text, password) {
    const salt = crypto.randomBytes(16);
    const iv = crypto.randomBytes(12);
    
    const key = crypto.pbkdf2Sync(password, salt, ITERATIONS, KEY_LENGTH, 'sha256');
    const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
    
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    const tag = cipher.getAuthTag().toString('hex');
    
    return {
        encryptedData: encrypted,
        iv: iv.toString('hex'),
        salt: salt.toString('hex'),
        tag: tag.toString('hex')
    };
}

const args = process.argv.slice(2);
if (args.length < 2) {
    console.log('Usage: node encrypt-post.js <content> <password>');
    process.exit(1);
}

const content = args[0];
const password = args[1];

encrypt(content, password).then(result => {
    console.log('\n--- ENCRYPTED METADATA ---\n');
    console.log(`encryptedData: "${result.encryptedData}"`);
    console.log(`iv: "${result.iv}"`);
    console.log(`salt: "${result.salt}"`);
    console.log(`tag: "${result.tag}"`);
    console.log('\n---------------------------\n');
});
