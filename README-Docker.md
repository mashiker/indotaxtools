# Docker Setup untuk Kalkulator PPh Unifikasi

## 🚀 Menjalankan dengan Docker

### Persyaratan
- Docker Desktop terinstall
- Docker Compose terinstall

### Langkah 1: Build dan Jalankan Container
```bash
# Dari folder indotaxtools-next
docker-compose up --build
```

### Langkah 2: Akses Website
Buka browser dan akses: `http://localhost:4000`

### Perintah Docker Lainnya

```bash
# Jalankan di background
docker-compose up -d --build

# Stop container
docker-compose down

# Lihat logs
docker-compose logs -f

# Rebuild tanpa cache
docker-compose build --no-cache
```

## 🐳 File Konfigurasi

### Dockerfile
- Menggunakan Node.js 18 Alpine
- Multi-stage build untuk optimasi
- Port 4000 untuk menghindari konflik

### docker-compose.yml
- Port mapping: 4000 (host) → 4000 (container)
- Health check otomatis
- Restart policy: unless-stopped

## 🔧 Troubleshooting

### Port Sudah Digunakan
Jika port 4000 sudah digunakan, ubah di `docker-compose.yml`:
```yaml
ports:
  - "9000:4000"  # Menggunakan port 9000 di host
```

### Build Gagal
```bash
# Clear cache dan rebuild
docker system prune -f
docker-compose build --no-cache
```

### Container Tidak Start
```bash
# Cek logs untuk error
docker-compose logs indotaxtools-next
```

## 📊 Monitoring

### Health Check
Container memiliki health check otomatis setiap 30 detik untuk memastikan aplikasi berjalan dengan baik.

### Resource Usage
```bash
# Lihat resource usage
docker stats
```

## 🔒 Security Notes

- Container berjalan sebagai non-root user
- Minimal base image (Alpine Linux)
- Tidak ada sensitive data di container