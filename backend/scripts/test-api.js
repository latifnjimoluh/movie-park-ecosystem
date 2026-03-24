const axios = require('axios')

const BASE_URL = "http://127.0.0.1:3000/api"
const credentials = {
  email: "latifnjimoluh@gmail.com",
  password: "AdminPassword123!"
}

async function runTests() {
  console.log("🚀 Lancement des tests API...")
  let token = ""

  try {
    // 1. Test Login
    console.log("\n🧪 Test Login...")
    const loginRes = await axios.post(`${BASE_URL}/auth/login`, credentials)
    if (loginRes.data.status === 200) {
      console.log("✅ Login réussi")
      token = loginRes.data.data.token
    }

    const headers = { Authorization: `Bearer ${token}` }

    // 2. Test Me
    console.log("\n🧪 Test /auth/me...")
    const meRes = await axios.get(`${BASE_URL}/auth/me`, { headers })
    console.log(`✅ Utilisateur connecté: ${meRes.data.data.user.name} (${meRes.data.data.user.role})`)

    // 3. Test Roles
    console.log("\n🧪 Test /auth/roles...")
    const rolesRes = await axios.get(`${BASE_URL}/auth/roles`, { headers })
    console.log(`✅ Roles récupérés: ${rolesRes.data.data.length} rôles trouvés`)
    rolesRes.data.data.forEach(r => console.log(`   - ${r.label} (${r.permissions.length} perms)`))

    // 4. Test Reservations
    console.log("\n🧪 Test /reservations...")
    const resRes = await axios.get(`${BASE_URL}/reservations`, { headers })
    console.log(`✅ Réservations récupérées: ${resRes.data.data.reservations?.length || 0} trouvées`)

    console.log("\n✨ TOUS LES TESTS SONT RÉUSSIS !")
    
  } catch (err) {
    console.error("\n❌ ERREUR LORS DES TESTS:")
    if (err.response) {
      console.error(`   Status: ${err.response.status}`)
      console.error(`   Message: ${err.response.data.message || err.message}`)
    } else {
      console.error(`   ${err.message}`)
    }
    console.log("\n💡 Assurez-vous que le backend est bien lancé sur le port 3000.")
  }
}

runTests()
