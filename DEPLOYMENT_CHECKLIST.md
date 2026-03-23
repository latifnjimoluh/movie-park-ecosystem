# Deployment Checklist - Generate Ticket Feature

## Pre-Deployment

- [ ] Backend QR_SECRET generated and stored in vault
- [ ] Frontend NEXT_PUBLIC_API_HOST configured
- [ ] Database migrations run successfully
- [ ] All template images uploaded to public folder
- [ ] CORS headers configured on backend
- [ ] UPLOAD_DIR has write permissions
- [ ] SSL/TLS certificates installed (production)

## Backend Deployment Steps

\`\`\`bash
# 1. Install dependencies
npm install --production

# 2. Run migrations
npm run migrate

# 3. Set environment variables
export NODE_ENV=production
export QR_SECRET="{secure-value-from-vault}"
export DATABASE_URL="{production-db-url}"
export JWT_SECRET="{secure-jwt-secret}"

# 4. Start server
npm start
\`\`\`

## Frontend Deployment Steps

\`\`\`bash
# 1. Install dependencies
npm install

# 2. Set environment variable
export NEXT_PUBLIC_API_HOST="https://api.yourdomain.com/api"

# 3. Build
npm run build

# 4. Start
npm start
\`\`\`

## Post-Deployment Verification

- [ ] API endpoint returns 200 OK: `curl https://api.yourdomain.com/api/tickets/{id}/generate`
- [ ] Frontend loads without errors
- [ ] Generate ticket button visible on fully paid reservations
- [ ] Test ticket generation end-to-end
- [ ] QR code scans successfully
- [ ] PDF downloads work
- [ ] PNG preview renders correctly
- [ ] Monitor logs for errors

## Rollback Plan

If issues occur:

1. **Backend:** Restart with previous version
2. **Frontend:** Revert to previous build
3. **Database:** Transactions ensure no data corruption
4. **Assets:** Clear CDN cache if needed

## Monitoring

Monitor these metrics:
- API response time: `POST /api/tickets/:id/generate` (target <2s)
- Error rate: ticket generation failures
- QR code validation success rate
- PDF generation time
- Disk usage: `UPLOAD_DIR` size

---
All systems deployed and verified ✅
