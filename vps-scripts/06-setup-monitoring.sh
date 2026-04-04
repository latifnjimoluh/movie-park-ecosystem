#!/bin/bash
# vps-scripts/06-setup-monitoring.sh
# Version avec Forçage du format HTML pour Gmail

echo "🎨 Correction du format HTML des mails..."

# Variables
GMAIL_USER="latifnjimoluh@gmail.com"
GMAIL_PASS="eohg hxto xgjs qybp" # À REMPLIR SUR LE VPS

# Nouvelle configuration
sudo bash -c "cat > /etc/monit/monitrc" <<EOF
set daemon 60
set log syslog

# --- INTERFACE HTTP ---
set httpd port 2812
    use address localhost
    allow localhost

# --- CONFIGURATION GMAIL (PORT 465 - SSL) ---
set mailserver smtp.gmail.com port 465
    username "$GMAIL_USER" password "$GMAIL_PASS"
    using ssl
    with timeout 30 seconds

# --- FORMAT DE L'ALERTE (HTML FORCÉ) ---
set mail-format {
  from: monit@movie-in-the-park.com
  header: Content-Type: text/html; charset=utf-8
  subject: [ALERTE VPS] \$SERVICE \$EVENT - Movie In The Park
  message: 
    <html>
      <body style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
        <div style="max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
          <div style="background-color: #e74c3c; color: white; padding: 20px; text-align: center;">
            <h1 style="margin: 0; font-size: 24px;">🚨 ALERTE SYSTÈME</h1>
            <p style="margin: 5px 0 0; font-size: 16px;">Movie In The Park - VPS Monitoring</p>
          </div>
          <div style="padding: 30px; background-color: #ffffff;">
            <p>Bonjour,</p>
            <p>Une anomalie a été détectée sur votre serveur VPS <strong>vps119467</strong> :</p>
            
            <div style="background-color: #f9f9f9; border-left: 4px solid #e74c3c; padding: 15px; margin: 20px 0;">
              <p style="margin: 0;"><strong>🛠️ Service :</strong> \$SERVICE</p>
              <p style="margin: 10px 0 0;"><strong>📅 Date :</strong> \$DATE</p>
              <p style="margin: 10px 0 0;"><strong>⚠️ Événement :</strong> \$EVENT</p>
              <p style="margin: 10px 0 0;"><strong>🔄 Action :</strong> \$ACTION</p>
            </div>

            <div style="padding: 15px; background-color: #fff3f3; border-radius: 5px; color: #c0392b;">
              <strong>Détails :</strong> \$DESCRIPTION
            </div>

            <p style="margin-top: 25px;">Veuillez vous connecter au VPS pour vérifier l'état des services avec <code>pm2 status</code> ou <code>monit status</code>.</p>
          </div>
          <div style="background-color: #f4f4f4; color: #888; padding: 15px; text-align: center; font-size: 12px;">
            <p>© 2026 Movie In The Park - Surveillance Automatisée</p>
          </div>
        </div>
      </body>
    </html>
}

set alert $GMAIL_USER

# --- SURVEILLANCE SYSTÈME ---
check system \$HOST
    if cpu usage > 50% for 2 cycles then alert
    if memory usage > 50% for 2 cycles then alert

check device root_disk with path /
    if space usage > 50% then alert

# --- SERVICES SYSTEME ---
check process nginx with pidfile /run/nginx.pid
    if failed host 127.0.0.1 port 80 protocol http then alert

check process postgres with pidfile /var/run/postgresql/16-main.pid
    if failed host 127.0.0.1 port 5432 protocol pgsql then alert

# --- SERVICES PM2 ---
check host mip_api_backend address 127.0.0.1
    if failed port 5000 protocol http request "/api/health" then alert

check host mip_frontend_user address 127.0.0.1
    if failed port 3000 protocol http then alert

check host mip_frontend_admin address 127.0.0.1
    if failed port 3001 protocol http then alert
EOF

sudo chmod 600 /etc/monit/monitrc
sudo monit reload
echo "🔄 Configuration HTML corrigée. Testez avec 'pm2 stop mip-admin'"
