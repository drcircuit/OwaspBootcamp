# A08: Software and Data Integrity Failures - Instructor Writeup

**Lab URL:** http://localhost:3008  
**Topic:** OWASP Top 10 2025 - A08: Software and Data Integrity Failures  
**Difficulty:** Easy → Medium → Hard  
**Theme:** FreshHarvest Market 🌱

---

## Overview

This lab demonstrates integrity failure vulnerabilities through an organic market platform. Students learn about unsigned updates, missing checksums, and unverified file uploads that allow tampering and malicious code injection.

### Learning Objectives
- Understand software update integrity verification
- Learn about digital signatures and checksums
- Identify unverified file upload risks
- Implement integrity checks

---

## Challenge Summary

| Lab | Vulnerability | Endpoint | Flag |
|-----|---------------|----------|------|
| Lab 1 | Unsigned Updates | `GET /api/lab1/update-info` | `HARVEST{UPD4T3_N0T_V3R1F13D}` |
| Lab 2 | Missing Checksums | `GET /api/lab2/download?file=plugin.zip` | `HARVEST{N0_CHK5UM_0RG4N1C}` |
| Lab 3 | Unsigned Uploads | `POST /api/lab3/upload` | `HARVEST{N0_S1GN4TUR3_FR3SH}` |

---

## LAB 1: Updates - No Signature Verification

**Difficulty:** Easy  
**Stage:** Recon

### Vulnerability
Software update metadata provided without digital signature, allowing man-in-the-middle attacks to serve malicious updates.

### Exploitation
```bash
curl http://localhost:3008/api/lab1/update-info
```

### Response
```json
{
  "version": "2.1.0",
  "downloadUrl": "https://updates.freshharvest.market/app-2.1.0.zip",
  "size": "45MB",
  "releaseDate": "2025-01-15",
  "changelog": "Bug fixes and performance improvements",
  "flag": "HARVEST{UPD4T3_N0T_V3R1F13D}",
  "signature": null,
  "checksum": null
}
```

### Vulnerable Code
```javascript
app.get('/api/lab1/update-info', (req, res) => {
    // VULNERABILITY: No signature to verify update authenticity
    res.json({
        version: '2.1.0',
        downloadUrl: 'https://updates.freshharvest.market/app-2.1.0.zip',
        signature: null,  // Should contain RSA signature
        checksum: null    // Should contain SHA-256 hash
    });
});
```

### Secure Implementation
```javascript
const crypto = require('crypto');
const fs = require('fs');

// Generate RSA key pair (do this once, store private key securely)
const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
    modulusLength: 4096,
    publicKeyEncoding: { type: 'spki', format: 'pem' },
    privateKeyEncoding: { type: 'pkcs8', format: 'pem' }
});

// Sign update file
function signUpdateFile(filePath) {
    const fileBuffer = fs.readFileSync(filePath);
    
    // 1. Calculate checksum
    const checksum = crypto
        .createHash('sha256')
        .update(fileBuffer)
        .digest('hex');
    
    // 2. Sign checksum with private key
    const signature = crypto
        .sign('sha256', Buffer.from(checksum), {
            key: privateKey,
            padding: crypto.constants.RSA_PKCS1_PSS_PADDING
        })
        .toString('base64');
    
    return { checksum, signature };
}

// Serve update info with signature
app.get('/api/updates/info', (req, res) => {
    const updateFile = '/path/to/app-2.1.0.zip';
    const { checksum, signature } = signUpdateFile(updateFile);
    
    res.json({
        version: '2.1.0',
        downloadUrl: 'https://updates.freshharvest.market/app-2.1.0.zip',
        checksum: checksum,      // SHA-256 hash
        signature: signature,     // RSA-4096 signature
        publicKey: publicKey,     // For client verification
        algorithm: 'RSA-SHA256'
    });
});

// Client-side verification
function verifyUpdate(fileBuffer, checksum, signature, publicKey) {
    // 1. Verify checksum
    const calculatedChecksum = crypto
        .createHash('sha256')
        .update(fileBuffer)
        .digest('hex');
    
    if (calculatedChecksum !== checksum) {
        throw new Error('Checksum verification failed - file may be corrupted or tampered');
    }
    
    // 2. Verify signature
    const isValid = crypto.verify(
        'sha256',
        Buffer.from(checksum),
        {
            key: publicKey,
            padding: crypto.constants.RSA_PKCS1_PSS_PADDING
        },
        Buffer.from(signature, 'base64')
    );
    
    if (!isValid) {
        throw new Error('Signature verification failed - update not from trusted source');
    }
    
    return true;  // Update is authentic and untampered
}
```

### Teaching Points
- All updates must be signed with private key
- Public key distributed with application
- Client verifies signature before applying update
- Protects against man-in-the-middle attacks
- Use RSA-4096 or ECDSA P-256 for signing

---

## LAB 2: Downloads - No Checksum Validation

**Difficulty:** Medium  
**Stage:** Scanning

### Vulnerability
Downloaded files have no checksum validation, allowing corrupted or tampered files to be installed.

### Exploitation
```bash
curl "http://localhost:3008/api/lab2/download?file=plugin.zip"
```

### Vulnerable Code
```javascript
app.get('/api/lab2/download', (req, res) => {
    const fileName = req.query.file;
    const filePath = path.join(__dirname, 'downloads', fileName);
    
    // VULNERABILITY: No checksum provided or verified
    res.download(filePath, (err) => {
        if (!err) {
            res.json({
                flag: 'HARVEST{N0_CHK5UM_0RG4N1C}',
                message: 'File downloaded without integrity verification'
            });
        }
    });
});
```

### Secure Implementation
```javascript
const crypto = require('crypto');

// Calculate and store checksums for all files
const fileChecksums = new Map();

function calculateChecksum(filePath) {
    return new Promise((resolve, reject) => {
        const hash = crypto.createHash('sha256');
        const stream = fs.createReadStream(filePath);
        
        stream.on('data', (data) => hash.update(data));
        stream.on('end', () => resolve(hash.digest('hex')));
        stream.on('error', reject);
    });
}

// Pre-calculate checksums for all downloadable files
async function initializeChecksums() {
    const files = fs.readdirSync('./downloads');
    for (const file of files) {
        const filePath = path.join('./downloads', file);
        const checksum = await calculateChecksum(filePath);
        fileChecksums.set(file, checksum);
    }
}

initializeChecksums();

// Provide file with checksum
app.get('/api/download', async (req, res) => {
    const fileName = req.query.file;
    
    // Validate file name (prevent path traversal)
    if (fileName.includes('..') || fileName.includes('/')) {
        return res.status(400).json({ error: 'Invalid file name' });
    }
    
    const filePath = path.join(__dirname, 'downloads', fileName);
    
    if (!fs.existsSync(filePath)) {
        return res.status(404).json({ error: 'File not found' });
    }
    
    // Get pre-calculated checksum
    const checksum = fileChecksums.get(fileName);
    
    // Set checksum in response header
    res.setHeader('X-Checksum-SHA256', checksum);
    res.setHeader('X-Checksum-Algorithm', 'SHA256');
    
    res.download(filePath, fileName);
});

// Endpoint to get checksum before download
app.get('/api/download/checksum', (req, res) => {
    const fileName = req.query.file;
    const checksum = fileChecksums.get(fileName);
    
    if (!checksum) {
        return res.status(404).json({ error: 'File not found' });
    }
    
    res.json({
        file: fileName,
        checksum: checksum,
        algorithm: 'SHA256'
    });
});

// Client-side verification after download
async function verifyDownload(filePath, expectedChecksum) {
    const actualChecksum = await calculateChecksum(filePath);
    
    if (actualChecksum !== expectedChecksum) {
        fs.unlinkSync(filePath);  // Delete corrupted file
        throw new Error('Checksum mismatch - file may be corrupted or tampered');
    }
    
    return true;
}
```

### Teaching Points
- Always provide checksums (SHA-256 or better)
- Verify checksum before using downloaded file
- Store checksums separately from files
- Use secure channels for checksum distribution
- Consider using Subresource Integrity (SRI) for web resources

---

## LAB 3: File Upload - No Signature Verification

**Difficulty:** Hard  
**Stage:** Initial Access

### Vulnerability
File upload endpoint accepts any file without verifying digital signature, allowing malicious file injection.

### Exploitation
```bash
# Upload any file (including malicious ones)
curl -X POST http://localhost:3008/api/lab3/upload \
  -F "file=@malicious.zip"

# Or create a test file
echo "malicious code" > malicious.sh
curl -X POST http://localhost:3008/api/lab3/upload \
  -F "file=@malicious.sh"
```

### Vulnerable Code
```javascript
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

app.post('/api/lab3/upload', upload.single('file'), (req, res) => {
    // VULNERABILITY: No signature verification
    // Accepts any file up to 5MB
    res.json({
        flag: 'HARVEST{N0_S1GN4TUR3_FR3SH}',
        message: 'File uploaded without signature verification',
        filename: req.file.originalname
    });
});
```

### Secure Implementation
```javascript
const multer = require('multer');
const crypto = require('crypto');

// Configure multer with validation
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/pending/');  // Quarantine until verified
    },
    filename: (req, file, cb) => {
        const uniqueName = crypto.randomBytes(16).toString('hex');
        cb(null, `${uniqueName}-${file.originalname}`);
    }
});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024,  // 5MB
        files: 1
    },
    fileFilter: (req, file, cb) => {
        // Whitelist allowed file types
        const allowedTypes = [
            'application/zip',
            'application/x-zip-compressed',
            'application/pdf'
        ];
        
        if (!allowedTypes.includes(file.mimetype)) {
            return cb(new Error('File type not allowed'));
        }
        
        cb(null, true);
    }
});

// Upload with signature verification
app.post('/api/upload', upload.single('file'), async (req, res) => {
    const file = req.file;
    const signature = req.body.signature;  // Base64 encoded signature
    const publicKeyPem = req.body.publicKey || TRUSTED_PUBLIC_KEY;
    
    try {
        // 1. Calculate file checksum
        const fileBuffer = fs.readFileSync(file.path);
        const checksum = crypto
            .createHash('sha256')
            .update(fileBuffer)
            .digest('hex');
        
        // 2. Verify signature
        const isValid = crypto.verify(
            'sha256',
            Buffer.from(checksum),
            {
                key: publicKeyPem,
                padding: crypto.constants.RSA_PKCS1_PSS_PADDING
            },
            Buffer.from(signature, 'base64')
        );
        
        if (!isValid) {
            // Delete unverified file
            fs.unlinkSync(file.path);
            return res.status(401).json({ 
                error: 'Signature verification failed' 
            });
        }
        
        // 3. Verify against trusted publishers
        const publisher = await verifyPublisher(publicKeyPem);
        if (!publisher.trusted) {
            fs.unlinkSync(file.path);
            return res.status(401).json({ 
                error: 'Publisher not trusted' 
            });
        }
        
        // 4. Additional security scans
        const scanResult = await virusScan(file.path);
        if (!scanResult.clean) {
            fs.unlinkSync(file.path);
            return res.status(400).json({ 
                error: 'File failed security scan' 
            });
        }
        
        // 5. Move from quarantine to production
        const finalPath = path.join('uploads/verified/', file.filename);
        fs.renameSync(file.path, finalPath);
        
        // 6. Store metadata
        await db.insertFile({
            filename: file.originalname,
            path: finalPath,
            checksum: checksum,
            signature: signature,
            publisher: publisher.name,
            uploadedBy: req.user.id,
            uploadedAt: new Date(),
            verified: true
        });
        
        res.json({
            success: true,
            filename: file.originalname,
            checksum: checksum,
            publisher: publisher.name
        });
        
    } catch (err) {
        // Clean up on error
        if (fs.existsSync(file.path)) {
            fs.unlinkSync(file.path);
        }
        res.status(500).json({ error: 'Upload failed' });
    }
});

// Client-side: Sign file before upload
function signFile(filePath, privateKey) {
    const fileBuffer = fs.readFileSync(filePath);
    
    // Calculate checksum
    const checksum = crypto
        .createHash('sha256')
        .update(fileBuffer)
        .digest('hex');
    
    // Sign checksum
    const signature = crypto
        .sign('sha256', Buffer.from(checksum), {
            key: privateKey,
            padding: crypto.constants.RSA_PKCS1_PSS_PADDING
        })
        .toString('base64');
    
    return signature;
}

// Upload signed file
async function uploadSignedFile(filePath, signature, publicKey) {
    const formData = new FormData();
    formData.append('file', fs.createReadStream(filePath));
    formData.append('signature', signature);
    formData.append('publicKey', publicKey);
    
    const response = await fetch('https://api.example.com/upload', {
        method: 'POST',
        body: formData
    });
    
    return response.json();
}
```

### Additional Security Measures

**Code Signing Certificates:**
```javascript
// Verify certificate chain
const forge = require('node-forge');

function verifyCertificate(certPem, caPem) {
    const cert = forge.pki.certificateFromPem(certPem);
    const caCert = forge.pki.certificateFromPem(caPem);
    
    try {
        // Verify certificate is signed by CA
        const verified = caCert.verify(cert);
        
        // Check expiration
        const now = new Date();
        if (now < cert.validity.notBefore || now > cert.validity.notAfter) {
            throw new Error('Certificate expired');
        }
        
        // Check revocation (CRL or OCSP)
        const revoked = await checkRevocation(cert);
        if (revoked) {
            throw new Error('Certificate revoked');
        }
        
        return true;
    } catch (err) {
        console.error('Certificate verification failed:', err);
        return false;
    }
}
```

---

## Integrity Protection Best Practices

### For Software Updates
1. **Sign all updates** with RSA-4096 or ECDSA P-256
2. **Distribute public key** with application
3. **Verify signature** before applying update
4. **Use HTTPS** for update distribution
5. **Implement rollback** mechanism
6. **Log all update attempts**

### For File Downloads
1. **Calculate SHA-256** checksum
2. **Provide checksum** via secure channel
3. **Verify checksum** before using file
4. **Use Subresource Integrity** (SRI) for web resources
5. **Serve over HTTPS** only

### For File Uploads
1. **Require digital signature** from trusted source
2. **Verify signature** before processing
3. **Scan for malware** (ClamAV, VirusTotal API)
4. **Quarantine** files until verified
5. **Whitelist** file types and sizes
6. **Sandbox** execution if needed

---

## Remediation Checklist

- [ ] All software updates digitally signed
- [ ] Update signatures verified before installation
- [ ] Checksums provided for all downloads
- [ ] Downloaded files verified before use
- [ ] File uploads require signature verification
- [ ] Uploaded files scanned for malware
- [ ] Certificate revocation checking (CRL/OCSP)
- [ ] Trusted publisher whitelist maintained
- [ ] Integrity failures logged and alerted
- [ ] Rollback mechanism for failed updates

---

## Additional Resources
- [OWASP Software and Data Integrity](https://owasp.org/Top10/A08_2021-Software_and_Data_Integrity_Failures/)
- [Code Signing Best Practices](https://www.schneier.com/academic/paperfiles/paper-code-signing.pdf)
- [Subresource Integrity](https://developer.mozilla.org/en-US/docs/Web/Security/Subresource_Integrity)
