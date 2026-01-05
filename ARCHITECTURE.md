# OWASP Bootcamp Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                    OWASP Bootcamp Workshop                       │
│                   Docker Compose Cluster                         │
└─────────────────────────────────────────────────────────────────┘

                              ┌──────────┐
                              │ Student  │
                              │ Browser  │
                              └────┬─────┘
                                   │
        ┌──────────────────────────┼──────────────────────────┐
        │                          │                          │
        │                          │                          │
   ┌────▼────┐              ┌──────▼──────┐          ┌───────▼────────┐
   │ Citadel │              │Instructional│          │ Instructional  │
   │  :3000  │              │   Labs      │          │     Labs       │
   │         │              │  :3001-3010 │          │   :3001-3010   │
   └────┬────┘              └─────────────┘          └────────────────┘
        │
        │
   ┌────▼────┐
   │PostgreSQL│
   │   DB    │
   │ :5432   │
   └─────────┘
```

## Container Architecture

### Citadel (Main Application)
```
┌─────────────────────────────────────────┐
│         Citadel Container               │
│  ┌───────────────────────────────────┐  │
│  │   Node.js 20 Alpine               │  │
│  │   - Express Server                │  │
│  │   - EJS Templates                 │  │
│  │   - ALL 10 Vulnerabilities        │  │
│  └───────────────────────────────────┘  │
│           Port: 3000                     │
└───────────────┬─────────────────────────┘
                │
                ▼
┌─────────────────────────────────────────┐
│      PostgreSQL Container               │
│  ┌───────────────────────────────────┐  │
│  │   PostgreSQL 16 Alpine            │  │
│  │   - User Database                 │  │
│  │   - Products                      │  │
│  │   - Sensitive Data                │  │
│  └───────────────────────────────────┘  │
│           Port: 5432                     │
└─────────────────────────────────────────┘
```

### Instructional Labs (10 Containers)
```
┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐
│   Lab A01        │  │   Lab A02        │  │   Lab A03        │
│ Broken Access    │  │ Misconfiguration │  │ Supply Chain     │
│   Port: 3001     │  │   Port: 3002     │  │   Port: 3003     │
└──────────────────┘  └──────────────────┘  └──────────────────┘

┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐
│   Lab A04        │  │   Lab A05        │  │   Lab A06        │
│ Cryptographic    │  │   Injection      │  │ Insecure Design  │
│   Port: 3004     │  │   Port: 3005     │  │   Port: 3006     │
└──────────────────┘  └──────────────────┘  └──────────────────┘

┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐
│   Lab A07        │  │   Lab A08        │  │   Lab A09        │
│  Auth Failures   │  │  Integrity       │  │   Logging        │
│   Port: 3007     │  │   Port: 3008     │  │   Port: 3009     │
└──────────────────┘  └──────────────────┘  └──────────────────┘

                    ┌──────────────────┐
                    │   Lab A10        │
                    │  Exceptions      │
                    │   Port: 3010     │
                    └──────────────────┘
```

## Network Architecture

```
┌────────────────────────────────────────────────────────────┐
│               Docker Bridge Network                         │
│                  owasp-network                              │
│                                                             │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  │
│  │ Citadel  │  │Citadel DB│  │ Lab A01  │  │ Lab A02  │  │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘  │
│                                                             │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  │
│  │ Lab A03  │  │ Lab A04  │  │ Lab A05  │  │ Lab A06  │  │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘  │
│                                                             │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  │
│  │ Lab A07  │  │ Lab A08  │  │ Lab A09  │  │ Lab A10  │  │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘  │
│                                                             │
└────────────────────────────────────────────────────────────┘
```

## Container Details

### Base Image Strategy
All containers use **Alpine Linux** for minimal size:
- Node.js 20 Alpine (~180MB)
- PostgreSQL 16 Alpine (~240MB)
- Total footprint: ~2.5GB (all containers)

### Security Context (Intentionally Vulnerable)
Each container runs:
- As non-root user (nodejs:nodejs)
- With minimal permissions
- Isolated in Docker network
- No external network access required

### Resource Usage (Per Container)
- **CPU**: ~0.1-0.5% idle, ~5% under load
- **Memory**: 20-50MB per lab, 100MB for Citadel
- **Disk**: ~200MB per container
- **Network**: Minimal, localhost only

## Data Flow

### Instructional Lab Flow
```
Browser Request (localhost:300X)
    ↓
Docker Host Port Mapping
    ↓
Container Port 3000
    ↓
Express Server
    ↓
In-Memory Data (Simulated)
    ↓
Response with Vulnerability Demo
```

### Citadel Flow
```
Browser Request (localhost:3000)
    ↓
Docker Host Port Mapping
    ↓
Citadel Container (Port 3000)
    ↓
Express Application
    ↓
PostgreSQL Query (citadel-db:5432)
    ↓
Database Response
    ↓
EJS Template Rendering
    ↓
Response with Vulnerability
```

## Deployment Options

### Option 1: Full Deployment (Recommended)
```bash
docker compose up -d
```
- All 12 containers
- ~2.5GB RAM usage
- All labs available

### Option 2: Selective Deployment
```bash
docker compose up -d citadel citadel-db lab-a01-broken-access
```
- Only specific containers
- ~500MB RAM usage
- Faster startup

### Option 3: Labs Only (No Citadel)
```bash
docker compose up -d $(docker compose config --services | grep lab-)
```
- 10 lab containers
- ~1GB RAM usage
- Instructional mode only

## Scaling Considerations

### For Small Groups (1-10 students)
- Single host running all containers
- Minimal resource usage
- Localhost access

### For Larger Groups (10-50 students)
Each student runs their own local environment:
- No shared resources needed
- No network congestion
- Consistent experience

### For Remote/Cloud Deployment (Not Recommended)
If absolutely necessary:
- Deploy to isolated VM per student
- Use VPN access
- Implement strict access controls
- **NEVER expose to public internet**

## Monitoring & Logging

### Health Checks
```bash
# Check all containers
docker compose ps

# Check specific service
docker compose ps citadel

# View logs
docker compose logs -f citadel
```

### Resource Monitoring
```bash
# Container stats
docker stats

# Specific container
docker stats owasp-citadel
```

## Backup & Recovery

### Backup Database
```bash
docker compose exec citadel-db pg_dump -U citadel_user citadel > backup.sql
```

### Restore Database
```bash
cat backup.sql | docker compose exec -T citadel-db psql -U citadel_user citadel
```

### Reset Everything
```bash
docker compose down -v
docker compose up -d
```

## Security Notes

⚠️ **IMPORTANT SECURITY CONSIDERATIONS**

1. **Network Isolation**
   - Containers communicate via internal Docker network
   - Only localhost ports exposed to host
   - No external internet access required

2. **Intentional Vulnerabilities**
   - All vulnerabilities are DELIBERATE
   - For educational purposes ONLY
   - Never deploy to production
   - Never expose to internet

3. **Container Security**
   - Non-root user execution
   - Read-only root filesystem where possible
   - Minimal attack surface
   - Isolated from host system

4. **Data Protection**
   - No real sensitive data
   - All data is synthetic/fake
   - Database resets with container

## Troubleshooting

### Container Won't Start
- Check Docker Desktop is running
- Verify port availability
- Check logs: `docker compose logs [service]`
- Rebuild: `docker compose build --no-cache`

### Performance Issues
- Check available RAM (4GB minimum)
- Close unnecessary applications
- Start fewer containers
- Restart Docker Desktop

### Network Issues
- Verify Docker network: `docker network ls`
- Recreate network: `docker compose down && docker compose up -d`
- Check firewall settings

---

**Architecture designed for:**
- Educational effectiveness
- Resource efficiency  
- Easy deployment
- Maximum portability
- Minimal overhead
