/**
 * seed-content.js
 * ──────────────────────────────────────────────────────
 * Peuple les nouvelles tables de contenu dynamique :
 *   - films
 *   - schedule_items
 *   - testimonials
 *   - event_config
 *
 * Usage :  node backend/src/seeders/seed-content.js
 *
 * ⚠️  Ce script est idempotent : il n'insère que si la table est vide,
 *     ou si la clé (event_config) n'existe pas encore.
 */

require("dotenv").config({ path: require("path").join(__dirname, "../../.env") })

const { sequelize, Film, ScheduleItem, Testimonial, EventConfig } = require("../models")

async function seed() {
  try {
    await sequelize.authenticate()
    console.log("✅ Connexion BD OK")

    // ─── Sync tables (create if not exists) ──────────────────────────────────
    await sequelize.sync({ alter: false })
    console.log("✅ Tables synchronisées")

    // ─── FILMS ───────────────────────────────────────────────────────────────
    const filmCount = await Film.count()
    if (filmCount === 0) {
      await Film.bulkCreate([
        {
          title_fr: "Zootopie 2 (2025)",
          title_en: "Zootopia 2 (2025)",
          genre_fr: "Famille, Animation, Comédie, Aventure",
          genre_en: "Family, Animation, Comedy, Adventure",
          year: "2025",
          country_fr: "États-Unis",
          country_en: "United States",
          duration: "115 min",
          synopsis_fr:
            "Dans cette suite très attendue, Judy Hopps et Nick Wilde reprennent du service pour faire face à une nouvelle affaire qui menace l'équilibre de la ville de Zootopie. Entre enquêtes, humour et messages forts sur la tolérance et le vivre-ensemble, le duo devra une fois de plus prouver que les différences sont une force.",
          synopsis_en:
            "In this long-awaited sequel, Judy Hopps and Nick Wilde are back on the case to face a new threat to the balance of Zootopia. Between investigations, humor and strong messages about tolerance, the duo must once again prove that differences are a strength.",
          classification_fr: "Tout public",
          classification_en: "All audiences",
          poster_url: "/zootopie.jpeg",
          youtube_url: "#",
          screening_time: "18h30",
          display_order: 0,
          is_active: true,
        },
        {
          title_fr: "Saw IV (2007)",
          title_en: "Saw IV (2007)",
          genre_fr: "Horreur, Thriller, Mystère",
          genre_en: "Horror, Thriller, Mystery",
          year: "2007",
          country_fr: "Royaume-Uni | États-Unis | Canada",
          country_en: "United Kingdom | United States | Canada",
          duration: "93 min",
          synopsis_fr:
            "Alors que le tueur au puzzle Jigsaw semble avoir disparu, une nouvelle série de jeux macabres débute. L'enquête plonge au cœur d'un réseau complexe de choix moraux, de pièges redoutables et de révélations sombres, où chaque décision peut coûter la vie.",
          synopsis_en:
            "As the Jigsaw killer appears to have died, a new series of macabre traps begins. The investigation dives into a complex web of moral choices, deadly traps and dark revelations, where every decision can cost a life.",
          classification_fr: "Interdit aux moins de 18 ans",
          classification_en: "18+",
          poster_url: "/saw.jpeg",
          youtube_url: "#",
          screening_time: "22h00",
          display_order: 1,
          is_active: true,
        },
      ])
      console.log("✅ Films seedés (2 films)")
    } else {
      console.log(`ℹ️  Films ignorés (${filmCount} existants)`)
    }

    // ─── SCHEDULE ITEMS ───────────────────────────────────────────────────────
    const scheduleCount = await ScheduleItem.count()
    if (scheduleCount === 0) {
      await ScheduleItem.bulkCreate([
        {
          time: "13h00 - 18h00",
          title_fr: "Activités & Animations",
          title_en: "Activities & Entertainment",
          description_fr: "Jeux vidéo, jeux de société, challenges, mini-tournages vidéo, photobooth, DJ zone",
          description_en: "Video games, board games, challenges, mini-video shoots, photobooth, DJ zone",
          is_surprise: false, is_after: false, is_teaser: false,
          display_order: 0, is_active: true,
        },
        {
          time: "18h00",
          title_fr: "Ouverture des portes",
          title_en: "Doors Open",
          description_fr: "Accueil du public et installation",
          description_en: "Welcome and seating",
          is_surprise: false, is_after: false, is_teaser: false,
          display_order: 1, is_active: true,
        },
        {
          time: "18h30",
          title_fr: "Premier Film",
          title_en: "First Film",
          description_fr: "Zootopie 2 (2025) - Installation du public dès 18h00",
          description_en: "Zootopia 2 (2025) - Seating from 18h00",
          is_surprise: false, is_after: false, is_teaser: false,
          display_order: 2, is_active: true,
        },
        {
          time: "21h00",
          title_fr: "Pause & Animations",
          title_en: "Break & Entertainment",
          description_fr: "Repas, photobooth, mini-concours et rafraîchissements",
          description_en: "Food, photobooth, mini-contest and refreshments",
          is_surprise: false, is_after: false, is_teaser: false,
          display_order: 3, is_active: true,
        },
        {
          time: "22h00",
          title_fr: "Deuxième Film",
          title_en: "Second Film",
          description_fr: "Saw IV – séance nocturne",
          description_en: "Saw IV – night screening",
          is_surprise: true, is_after: true, is_teaser: true,
          display_order: 4, is_active: true,
        },
        {
          time: "00h00+",
          title_fr: "Clôture",
          title_en: "Closing",
          description_fr: "Fin de l'événement",
          description_en: "End of event",
          is_surprise: false, is_after: false, is_teaser: false,
          display_order: 5, is_active: true,
        },
      ])
      console.log("✅ Programme seedé (6 items)")
    } else {
      console.log(`ℹ️  Programme ignoré (${scheduleCount} existants)`)
    }

    // ─── TESTIMONIALS ─────────────────────────────────────────────────────────
    const testimonialCount = await Testimonial.count()
    if (testimonialCount === 0) {
      await Testimonial.bulkCreate([
        {
          quote_fr: "Une expérience magique ! L'organisation était impeccable, l'ambiance chaleureuse, et les films excellents. Nous reviendrons avec plaisir pour la prochaine édition.",
          quote_en: "A magical experience! The organization was impeccable, the atmosphere warm, and the films excellent. We will definitely come back for the next edition.",
          author: "Brooklyn",
          pack_name: "Pack Famille",
          edition: "Decembre 2024",
          photo_url: "/man-profile.jpg",
          rating: 5, display_order: 0, is_active: true,
        },
        {
          quote_fr: "Le concept est génial. Entre le DJ set, les films et l'ambiance conviviale, c'était une soirée parfaite. Le pack VIP vaut vraiment le coup !",
          quote_en: "The concept is brilliant. Between the DJ set, the films and the friendly atmosphere, it was a perfect evening. The VIP pack is really worth it!",
          author: "Dorian",
          pack_name: "Pack VIP",
          edition: "Decembre 2024",
          photo_url: "/dorian.jpg",
          rating: 5, display_order: 1, is_active: true,
        },
        {
          quote_fr: "Date night parfaite ! Le pack Couple avec le matelas double et la photo souvenir a rendu notre soirée encore plus spéciale. À refaire absolument.",
          quote_en: "Perfect date night! The Couple pack with the double mattress and souvenir photo made our evening even more special. Definitely doing it again.",
          author: "Sammy",
          pack_name: "Pack Couple",
          edition: "Decembre 2024",
          photo_url: "/sammy.jpg",
          rating: 5, display_order: 2, is_active: true,
        },
      ])
      console.log("✅ Témoignages seedés (3 témoignages)")
    } else {
      console.log(`ℹ️  Témoignages ignorés (${testimonialCount} existants)`)
    }

    // ─── EVENT CONFIG ─────────────────────────────────────────────────────────
    const configDefaults = [
      { key: "edition_label",     value: "🐣 Édition Pâques 2026",                                              type: "text",    label: "Badge édition",             group: "hero" },
      { key: "tagline",           value: "Une soirée cinéma unique, sous les étoiles de Yaoundé.",              type: "text",    label: "Tagline principale",         group: "hero" },
      { key: "subtitle",          value: "Ambiance · Films · Expérience Printanière",                           type: "text",    label: "Sous-tagline",               group: "hero" },
      { key: "social_proof",      value: "🎟️ Plus de 100 participants lors de la dernière édition",             type: "text",    label: "Preuve sociale",             group: "hero" },
      { key: "particle_symbols",  value: '["🌸","🌼","🌿","🌺","🥚","✨","🌱","🐣"]',                           type: "json",    label: "Symboles particules",        group: "hero" },
      { key: "location_lat",      value: "3.876146",                                                            type: "number",  label: "Latitude GPS",               group: "location" },
      { key: "location_lng",      value: "11.518691",                                                           type: "number",  label: "Longitude GPS",              group: "location" },
      { key: "films_badge",       value: "🎬 Programme Pâques 2026",                                            type: "text",    label: "Badge section Films",        group: "films" },
      { key: "films_description", value: "Deux films soigneusement sélectionnés pour une soirée inoubliable.", type: "text",    label: "Description section Films",  group: "films" },
      { key: "pricing_badge",     value: "🎟️ Choisissez votre expérience",                                     type: "text",    label: "Badge section Tarifs",       group: "pricing" },
      { key: "contact_phone",     value: "+237 697 30 44 50",                                                   type: "text",    label: "Téléphone affiché",          group: "contact" },
      { key: "contact_email",     value: "matangabrooklyn@gmail.com",                                           type: "text",    label: "Email affiché",              group: "contact" },
      { key: "contact_whatsapp",  value: "237697304450",                                                        type: "text",    label: "Numéro WhatsApp",            group: "contact" },
    ]

    let configSeeded = 0
    for (const cfg of configDefaults) {
      const [, created] = await EventConfig.findOrCreate({
        where: { key: cfg.key },
        defaults: cfg,
      })
      if (created) configSeeded++
    }
    console.log(`✅ EventConfig : ${configSeeded} clé(s) créée(s), ${configDefaults.length - configSeeded} déjà existante(s)`)

    console.log("\n🎉 Seed terminé avec succès !")
    process.exit(0)
  } catch (err) {
    console.error("❌ Erreur de seed :", err)
    process.exit(1)
  }
}

seed()
