#!/bin/bash
# AI康复思路助手 — VPS部署脚本 (Ubuntu 22.04)

set -e
echo "=== AI运动康复思路助手 — 部署开始 ==="

REPO_DIR="/opt/ai-rehab"

# 1. 系统更新
echo "[1/6] 系统更新..."
sudo apt update && sudo apt upgrade -y

# 2. 安装 Node.js 20.x
echo "[2/6] 安装 Node.js..."
if ! command -v node &> /dev/null; then
  curl -fsSL https://deb.nodesource.com/setup_20.x | sudo bash -
  sudo apt install -y nodejs
fi
echo "Node.js $(node -v), npm $(npm -v)"

# 3. 安装 Nginx
echo "[3/6] 安装 Nginx..."
sudo apt install -y nginx

# 4. 安装 PM2
echo "[4/6] 安装 PM2..."
sudo npm install -g pm2

# 5. 克隆/更新代码
if [ -d "$REPO_DIR" ]; then
  echo "[5/6] 更新代码..."
  cd "$REPO_DIR"
  git pull origin master
else
  echo "[5/6] 克隆代码..."
  sudo mkdir -p "$REPO_DIR"
  cd /opt
  git clone https://github.com/ptdaydreamer/ai-rehab-guide.git ai-rehab
  sudo chown -R $USER:$USER "$REPO_DIR"
fi

cd "$REPO_DIR"
npm install --production

# 6. 配置 Nginx + 启动
echo "[6/6] 配置 Nginx + 启动服务..."

# Nginx 配置
sudo tee /etc/nginx/sites-available/ai-rehab > /dev/null << 'NGINX'
server {
    listen 80;
    server_name _;
    
    location / {
        proxy_pass http://127.0.0.1:3099;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_cache_bypass $http_upgrade;
    }
}
NGINX

sudo ln -sf /etc/nginx/sites-available/ai-rehab /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t && sudo systemctl reload nginx

# PM2 启动
pm2 delete ai-rehab 2>/dev/null || true
pm2 start server.js --name ai-rehab --time
pm2 save
pm2 startup systemd -u $USER --hp $HOME 2>/dev/null || true

echo ""
echo "=== 部署完成! ==="
echo "访问: http://$(curl -s ifconfig.me 2>/dev/null || echo 'YOUR_IP')"
echo "PM2状态: pm2 status"
