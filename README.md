# 🚀 CloudNest Platform

Production-Grade Cloud Deployment with Docker, CI/CD & AWS

## Overview

CloudNest Platform là một backend service được triển khai theo kiến trúc production thực tế trên AWS.

Project mô phỏng quy trình triển khai của một Cloud/DevOps Engineer:

Containerization với Docker

CI/CD pipeline bằng GitHub Actions

Deployment qua SSH vào EC2

Reverse Proxy với Nginx

Database tách riêng trên AWS RDS (Private)

Secure VPC & Security Group configuration

Debug production-level networking issues

## 🏗 Production Architecture
                    ┌────────────────────┐
                    │      Internet      │
                    └─────────┬──────────┘
                              │
                              ▼
                    ┌────────────────────┐
                    │   EC2 (Public)     │
                    │  - Nginx :80       │
                    │  - Docker Engine   │
                    └─────────┬──────────┘
                              │
                              ▼
                    ┌────────────────────┐
                    │ Docker Container   │
                    │ Node.js App :4000  │
                    └─────────┬──────────┘
                              │
                              ▼
                    ┌────────────────────┐
                    │ RDS PostgreSQL     │
                    │ Private Subnet     │
                    └────────────────────┘
## 🔐 Security Design
### Database Isolation

- RDS không public

- Không cho phép 0.0.0.0/0

- Chỉ Security Group của EC2 được phép truy cập port 5432

### Deployment Security

- SSH key-based authentication

- GitHub Secrets quản lý credentials

- Không commit thông tin nhạy cảm vào repo

### Network Flow
GitHub Actions
      -> 
SSH into EC2
      ->
Docker rebuild & restart
      ->
EC2 connects to private RDS

## ⚙️ Tech Stack
| Layer | Technology |
|-------|------------|
| Backend | ![Node.js](https://img.shields.io/badge/Node.js-18-green) |
| Containerization | ![Docker](https://img.shields.io/badge/Docker-Container-blue) |
| Reverse Proxy | ![Nginx](https://img.shields.io/badge/Nginx-Reverse_Proxy-darkgreen) |
| CI/CD | ![GitHub Actions](https://img.shields.io/badge/GitHub_Actions-CI/CD-black) |
| Cloud Compute | ![AWS EC2](https://img.shields.io/badge/AWS-EC2-orange) |
| Database | ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-RDS-blue) |
| OS | ![Ubuntu](https://img.shields.io/badge/Ubuntu-Linux-orange) |

## 🐳 Containerization Strategy

### Multi-Service Deployment via Docker Compose

```yaml
version: '3.8'

services:
  app:
    build: ./backend
    container_name: cloudnest_app
    ports:
      - "4000:4000"
    env_file:
      - .env
```

---

### Dockerfile (Production-Oriented)

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 4000

CMD ["npm", "start"]
```



## 🔁 CI/CD Pipeline

### 🚀 Trigger

- Runs automatically **on push to `main` branch**

---

### ⚙️ Workflow Steps

1. **Checkout repository**
2. **SSH into EC2** (using `appleboy/ssh-action`)
3. **Pull latest code**
4. **Rebuild Docker container**
5. **Restart services**

---

### 🖥️ Deployment Command

```bash
docker compose down
docker compose up --build -d
```
## 🧪 Infrastructure Debugging Experience

During deployment, several real-world infrastructure issues were identified and resolved:

---

### 1️⃣ Docker Build Context Error

**Issue:**
```bash
COPY package*.json ./
no source files were specified
```

**Root Cause:**
Incorrect Docker build context defined in `docker-compose.yml`.

Docker was building from the wrong directory, so `package.json` could not be found.

**Solution:**
Set correct build context:

```yaml
services:
  app:
    build: ./backend
```

---

### 2️⃣ RDS Connection Timeout

**Issue:**
```
Connection timed out
```

**Root Cause:**
AWS RDS Security Group did not allow inbound traffic from EC2.

**Solution:**
Configured inbound rule in RDS Security Group:

| Type        | Port | Source              |
|------------|------|--------------------|
| PostgreSQL | 5432 | EC2 Security Group |

This allowed secure internal VPC communication between EC2 and RDS.

---

### 3️⃣ Orphan Docker Network

**Issue:**
```
network has active endpoints
```

**Root Cause:**
Docker network was still attached to stopped containers.

**Solution:**
Clean unused Docker networks:

```bash
docker network prune -f
```

---

### 🔍 Key Learnings

- Proper Docker build context is critical
- AWS Security Groups control network-level access
- Docker networking issues require cleanup and inspection
- Troubleshooting follows a layered approach:
  - Application layer
  - Container layer
  - Network layer
  - Cloud infrastructure layer
 
## ☁️ AWS Infrastructure Details

### 🖥️ EC2

- Ubuntu Server
- Docker & Docker Compose installed
- Nginx configured as reverse proxy
- Deployed in **Public Subnet**
- Accessible via SSH

---

### 🗄️ RDS

- PostgreSQL engine
- Deployed in **Private Subnet**
- Public access: **Disabled**
- Security Group allows access **only from EC2 Security Group**
- Internal VPC communication only

---

## 📈 DevOps Concepts Demonstrated

- Containerized backend deployment
- Secure VPC architecture
- Private database isolation
- CI/CD automation with GitHub Actions
- SSH-based production deployment
- Environment variable management
- Network-level debugging (ETIMEDOUT, Security Groups)
- Docker build context management
- Security Group configuration
- Production troubleshooting mindset

---

## 🚀 How to Deploy Manually

### 1️⃣ Connect to EC2

```bash
ssh -i key.pem ubuntu@<ec2-public-ip>
```

---

### 2️⃣ Navigate to Project Directory

```bash
cd cloudnest-platform
```

---

### 3️⃣ Build and Start Containers

```bash
docker compose up --build -d
```

---

### 4️⃣ Verify Running Containers

```bash
docker ps
```

## 🎯 Why This Project Is Relevant for Cloud / DevOps Roles

This project demonstrates hands-on experience with real-world cloud infrastructure and DevOps practices:

- Strong understanding of AWS cloud networking (VPC, Subnets, Security Groups)
- Secure infrastructure design with private database isolation
- CI/CD implementation using GitHub Actions
- SSH-based production deployment workflow
- Containerized application architecture (Docker & Docker Compose)
- Reverse proxy configuration with Nginx
- Environment variable and secret management
- Infrastructure-level debugging (network, security group, container issues)
- Real-world AWS service integration (EC2 + RDS)
- Production troubleshooting mindset

This project reflects the ability to design, deploy, secure, and debug cloud-based systems in a production-like environment.

---

## 👨‍💻 Author

**Khoa Nguyễn**  
Aspiring Cloud / DevOps Engineer  

Focused on:
- Secure infrastructure architecture  
- Automation & CI/CD pipelines  
- Cloud-native deployments  
- Production-ready system design  
