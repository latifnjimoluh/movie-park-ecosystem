/**
 * ============================================================================
 * MOVIE IN THE PARK - TRANSLATIONS FILE
 * ============================================================================
 *
 * Ce fichier contient toutes les traductions pour le site Movie in the Park
 * Langues disponibles : Français (fr) et Anglais (en)
 *
 * Structure :
 * - Common (Navigation, boutons communs)
 * - Footer (Marque, navigation, contact, newsletter, copyright)
 * - Pages principales (Home, About, Contact, Films, Reservation)
 * - Composants (Packs, Activities, Testimonials, etc.)
 * - Fonctionnalités (Tracking, Payment, Forms)
 */

export const translations = {
  // ============================================================================
  // FRANÇAIS (FR)
  // ============================================================================
  fr: {
    // --------------------------------------------------------------------------
    // ÉLÉMENTS COMMUNS (Navigation, boutons partagés)
    // --------------------------------------------------------------------------
    common: {
      home: "Accueil",
      films: "Films & Programme",
      reservation: "Réservation",
      archives: "Éditions passées",
      about: "À propos",
      contact: "Contact",
      back: "Retour",
      next: "Suivant",
      confirm: "Confirmer",
    },

    // --------------------------------------------------------------------------
    // FOOTER (Pied de page)
    // --------------------------------------------------------------------------
    footer: {
      // Marque et slogan
      brand: {
        title: "Movie in the Park",
        tagline: "Vivez le cinéma autrement, sous les étoiles.",
      },

      // Navigation dans le footer
      navigation: {
        title: "Navigation",
        home: "Accueil",
        films: "Films & Programme",
        reservation: "Réservation",
        archives: "Éditions passées",
        about: "À propos",
        contact: "Contact",
      },

      // Informations de contact
      contact: {
        title: "Nous contacter",
        phone: {
          label: "Téléphone",
          number: "+237 697 30 44 50",
        },
        email: {
          label: "Email",
          address: "matangabrooklyn@gmail.com",
        },
        whatsapp: {
          label: "WhatsApp",
        },
        location: {
          label: "Localisation",
          address: "Mini Prix Bastos, Yaoundé",
        },
      },

      // Newsletter
      newsletter: {
        title: "Restez informé",
        subtitle: "Recevez les annonces des prochaines éditions.",
        placeholder: "Votre email",
        button: "S'inscrire",
      },

      // Copyright et mentions légales
      copyright: {
        text: "© 2025 Movie in the Park. Tous droits réservés.",
        legal: "Mentions légales",
        privacy: "Politique de confidentialité",
      },
    },

    // --------------------------------------------------------------------------
    // PAGE HERO / ACCUEIL (Section d'en-tête principale)
    // --------------------------------------------------------------------------
    hero: {
      title: "Movie in the Park",
      tagline: "Cinéma en plein air sous les étoiles",
      dateLabel: "Date",
      dateValue: "Dimanche 12 Avril 2026",
      locationLabel: "Lieu",
      locationValue: "Mini Prix Bastos",
      timeLabel: "Horaire",
      timeValue: "Ouverture 13h00",
      advice: "🥚 Conseil : Préparez-vous pour une chasse aux œufs cinématographique unique !",

      ctaFilms: "Voir les films",
      ctaReservation: "Réserver ma place",
    },

    // --------------------------------------------------------------------------
    // SECTION "POURQUOI VENIR" (Avantages de l'événement)
    // --------------------------------------------------------------------------
    whyCome: {
      title: "Pourquoi participer à Movie in the Park ?",
      subtitle: "Une expérience cinématographique premium combinant divertissement, confort et convivialité",

      item1_title: "Cinéma en plein air",
      item1_desc:
        "Grand écran HD 6 mètres, sonorisation professionnelle Dolby, et une ambiance unique sous le ciel étoilé de Yaoundé.",

      item2_title: "Confort & convivialité",
      item2_desc:
        "Matelas confortables, snacks variés, boissons rafraîchissantes, et une atmosphère détendue pour profiter pleinement.",

      item3_title: "Pour toute la famille",
      item3_desc:
        "Seul, en couple, en famille ou entre amis : des packs adaptés à chaque public pour vivre l'expérience ensemble.",

      item4_title: "Éditions précédentes réussies",
      item4_desc: "Plus de 500 participants conquis lors de notre dernière édition, avec une note moyenne de 4.8/5.",
    },

    // --------------------------------------------------------------------------
    // SECTION FILMS (Présentation courte des films)
    // --------------------------------------------------------------------------
    filmsSection: {
      title: "Les films de cette édition",
      subtitle: "Deux films soigneusement sélectionnés pour une soirée inoubliable",
      moreDetails: "En savoir plus →",
      fullProgramCta: "Voir le programme complet",
    },

    // Liste des films avec détails
    filmsList: {
      horror: {
        title: "Saw IV (2007)",
        genre: "Horreur, Thriller, Mystère",
        year: "2007",
        country: "Royaume-Uni | États-Unis | Canada",
        time: "22:00",
        synopsis:
          "Alors que le tueur au puzzle Jigsaw semble avoir disparu, une nouvelle série de jeux macabres débute. L’enquête plonge au cœur d’un réseau complexe de choix moraux, de pièges redoutables et de révélations sombres, où chaque décision peut coûter la vie. Quatrième volet de la célèbre saga, SAW 4 intensifie le suspense et explore les conséquences psychologiques des épreuves imposées, offrant une expérience intense réservée aux amateurs de frissons.",
      },
      family: {
        title: "Zootopie 2 (2025)",
        genre: "Famille, Animation, Comédie, Aventure",
        year: "2025",
        country: "États-Unis",
        time: "18:30",
        synopsis:
        
          "Dans cette suite très attendue, Judy Hopps et Nick Wilde reprennent du service pour faire face à une nouvelle affaire qui menace l’équilibre de la ville de Zootopie. Entre enquêtes, humour et messages forts sur la tolérance et le vivre-ensemble, le duo devra une fois de plus prouver que les différences sont une force. Inspiré de l’univers à succès de Disney, Zootopie 2 promet une aventure drôle, rythmée et pleine d’émotions, idéale pour toute la famille.",
      },
    },

    // --------------------------------------------------------------------------
    // SECTION TARIFS / PACKS (Vue d'ensemble des offres)
    // --------------------------------------------------------------------------
    pricing: {
      title: "Choisissez votre expérience",
      subtitle: "Des packs adaptés à tous les budgets",
      choose: "Choisir",

      // Pack Stand Entreprise
      standTitle: "Stand Grande Entreprise",
      standSubtitle: "Pour les entreprises et partenaires",
      standPriceLabel: "Tarif",
      standPriceValue: "Sur demande",
      standPriceNote: "Tarif négociable selon vos besoins",
      standSetup: "Aménagement",
      standSetup1: "1 table + 4 chaises",
      standSetup2: "OU 2 tables + 2 chaises",
      standServices: "Services",
      standElectricity: "Électricité",
      standVisibility: "Visibilité premium",
      standAdvantages: "Avantages inclus :",
      standAdv1: "Promotion sur réseaux sociaux",
      standAdv2: "Mention dans communications officielles",
      standAdv3: "Accès aux 2 projections films",
      standExtra: "Services supplémentaires :",
      standExtra1: "2 badges de prestataire",
      standExtra2: "Activation marketing possible",
      standExtra3: "Accès à toutes les activités",
      standCTA: "Contacter l'équipe pour un devis",
      standPhoneNote: "📞 +237 697 30 44 50 ou contactez-nous via le formulaire",
      reservationCTA: "Voir tous les détails & réserver",
    },

    // Métadonnées des packs (résumé)
    packs: {
      simple: {
        name: "Ticket Simple",
        price: "3 000",
        features: ["Accès aux 2 films", "Snack : Popcorn + Boisson", "Siège confortable", "Accès standard"],
      },
      vip: {
        name: "Ticket VIP",
        price: "5 000",
        badge: "⭐ POPULAIRE",
        features: ["Accès aux 2 films", "Siège premium avec matelas", " boisson", "Zone photo gratuite"],
      },
      couple: {
        name: "Ticket Couple",
        price: "8 000",
        features: [
          "Pour 2 personnes",
          "Sièges premium côte à côte",
          "Repas + boisson inclus",
          "Photo professionnelle gratuite",
        ],
      },
      family: {
        name: "Ticket Famille",
        price: "10 000",
        features: ["De 3 à 5 personnes", "Tous les privilèges VIP", "Sièges premium groupés", "Priorité enfants"],
      },
    },

    // --------------------------------------------------------------------------
    // SECTION AMBIANCE (Galerie photo + activités)
    // --------------------------------------------------------------------------
    atmosphere: {
      title: "Plus qu'un simple film, une soirée complète !",

      // Descriptions des photos
      photos: {
        p1: "Une audience captivée",
        p2: "Restauration sur place",
        p3: "Animations live",
      },

      // Activités proposées
      activities: {
        dj: {
          title: "DJ Set & Animations",
          description: "DJ live, MC dynamique et jeux interactifs pour échauffer l'ambiance avant le premier film.",
        },
        photos: {
          title: "Photos & Souvenirs",
          description: "Photobooth professionnel et photographe sur place pour immortaliser vos meilleurs moments.",
        },
        food: {
          title: "Food & Drinks",
          description:
            "Stands de snacks variés, boissons fraîches et chaudes, partenaires locaux pour régaler vos papilles.",
        },
        games: {
          title: "Jeux & Concours",
          description: "Quiz cinéma, tombola avec lots à gagner, et animations surprises entre les deux films.",
        },
      },

      cta: "📅 Découvrir le programme détaillé",
    },

    // --------------------------------------------------------------------------
    // TÉMOIGNAGES (Avis des participants)
    // --------------------------------------------------------------------------
    testimonials: {
      title: "Ce qu'ils en ont pensé",

      // Note globale
      overall: {
        ratingValue: "4.8/5",
        basedOn: "Basé sur 127 retours participants",
      },

      // Liste des témoignages
      items: {
        t1: {
          quote:
            "Une expérience magique ! L'organisation était impeccable, l'ambiance chaleureuse, et les films excellents. Nous reviendrons avec plaisir pour la prochaine édition.",
          author: "Brooklyn",
          pack: "Pack Famille",
          edition: "Decembre 2024",
        },
        t2: {
          quote:
            "Le concept est génial. Entre le DJ set, les films et l'ambiance conviviale, c'était une soirée parfaite. Le pack VIP vaut vraiment le coup !",
          author: "Dorian",
          pack: "Pack VIP",
          edition: "Decembre 2024",
        },
        t3: {
          quote:
            "Date night parfaite ! Le pack Couple avec le matelas double et la photo souvenir a rendu notre soirée encore plus spéciale. À refaire absolument.",
          author: "Sammy",
          pack: "Pack Couple",
          edition: "Decembre 2024",
        },
      },
    },

    // --------------------------------------------------------------------------
    // PAGE FILMS (Détails complets)
    // --------------------------------------------------------------------------
    filmsPage: {
      // En-tête de la page
      header: {
        title: "Films & Programme",
        subtitle: "Découvrez ce qui vous attend lors de cette édition",
      },

      // Films détaillés
      films: {
        title: "Films de cette édition",

        f1: {
          title: "Zootopie 2 (2025)",
          genre: "Famille, Aventure, Fantastique",
          country: "USA",
          year: "2025",
          duration: "115 min",
          classification: "Tout public",
          synopsis:
            "Une aventure épique où un jeune héros doit sauver l'Overworld d'une force destructrice. Inspiré de l'univers mondialement connu, ce film offre une expérience spectaculaire pour toute la famille.",
          screening: "18h30",
        },

        f2: {
          title: "The Lodge",
          genre: "Horreur | Drame | Thriller psychologique",
          country: "Royaume-Uni | États-Unis | Canada",
          year: "2019",
          duration: "138 min",
          classification: "Interdit aux moins de 18 ans",
          synopsis:
            "Une future belle-mère se retrouve isolée dans un chalet en montagne, bloquée par la neige, avec les deux enfants de son fiancé. Alors que des événements inexpliqués et effrayants se produisent, son passé religieux et traumatisant refait surface, mettant à l'épreuve la santé mentale de chacun.",
          screening: "22h00",
        },
      },

      // Programme détaillé de la journée
      schedule: {
        title: "Programme détaillé de la journée",
        subtitle: "Suivez l'évolution complète de votre journée",

        s1: {
          time: "13h00 - 18h00",
          title: "Activités & Animations",
          description: "Jeux vidéo, jeux de société, challenges, mini-tournages vidéo, photobooth, DJ zone",
        },
        s2: {
          time: "18h00",
          title: "Ouverture des portes",
          description: "Accueil du public et installation",
        },
        s3: {
          time: "18h30",
          title: "Premier Film",
          description: "Zootopie 2 (2025) - Installation du public dès 18h00",
        },
        s4: {
          time: "21h00",
          title: "Pause & Animations",
          description: "Repas, photobooth, mini-concours et rafraîchissements",
        },
        s5: {
          time: "22h00",
          title: "Deuxième Film",
          description: "The Lodge – séance nocturne",
        },
        s6: {
          time: "00h00+",
          title: "Clôture",
          description: "Fin de l'événement",
        },
      },

      // Section activités
      activitiesSection: {
        title: "Activités & Animations",
      },

      // Call to action
      cta: {
        title: "Prêt à vivre l'expérience ?",
        subtitle: "Réservez votre pack dès maintenant et assurez-vous une place pour cette édition inoubliable.",
        button: "Réserver ma place",
      },
    },

    // --------------------------------------------------------------------------
    // ACTIVITÉS (Liste courte)
    // --------------------------------------------------------------------------
    activities: {
      a1: {
        icon: "🎤",
        title: "Concerts & Performances",
        description: "Découvrez des artistes locaux en live",
      },
      a2: {
        icon: "📸",
        title: "Photobooth & Zones photos",
        description: "Captures inoubliables sous les étoiles",
      },
      a3: {
        icon: "🍟",
        title: "Food & Boissons",
        description: "Repas et rafraîchissements gourmands",
      },
      a4: {
        icon: "🎁",
        title: "Jeux & Challenges",
        description: "Participez et gagnez des prix",
      },
      a5: {
        icon: "🔒",
        title: "Bonus exclusif",
        description: "Une activité spéciale réservée aux participants sera dévoilée le jour J.",
      },
    },

    // --------------------------------------------------------------------------
    // PAGE À PROPOS
    // --------------------------------------------------------------------------
    aboutPage: {
      // Hero section
      hero: {
        title: "À propos de Movie in the Park",
        subtitle:
          "Découvrez l'histoire d'une aventure cinématographique unique qui transforme les parcs en salles de cinéma à ciel ouvert",
      },

      // Qu'est-ce que Movie in the Park
      whatIs: {
        title: "C'est quoi Movie in the Park ?",
        p1: "Movie in the Park est un événement de cinéma en plein air à Yaoundé. Une expérience unique sous les étoiles, mêlant films grand écran, concerts live, activités ludiques, jeux, zones photo, repas et boissons dans une ambiance conviviale et festive.",
        p2: "Chaque édition réunit des familles, des amis, des couples et des passionnés de cinéma. Le but : offrir une soirée inoubliable où vous regardez un film, vous mangez, vous dansez, vous jouez, vous prenez des photos et vous profitez.",
        nextEditionTitle: "📅 Prochaine édition : Avril 2026 — Yaoundé",
        nextEditionSubtitle: "Ne manquez pas cette édition printanière exceptionnelle !",
        clothingTitle: "🌸 Recommandation printanière",
        clothingText:
          "Prévoyez une tenue légère pour la journée et une petite veste pour la soirée sous les étoiles. Vivez Pâques en plein air !",
      },

      // Vision et valeurs
      visionValues: {
        title: "Notre Vision & Nos Valeurs",

        experienceTitle: "Expérience",
        experienceText:
          "Donner une dimension immersive et unique au cinéma avec un grand écran HD, une sonorisation professionnelle Dolby, et une ambiance magique sous les étoiles.",

        convivialityTitle: "Convivialité",
        convivialityText:
          "Créer un espace de rencontre et de partage où chacun se sent bienvenu, que vous veniez seul, en couple, en famille ou entre amis.",

        qualityTitle: "Qualité",
        qualityText:
          "Garantir un excellent son, une image cristalline, un grand confort et une organisation impeccable à chaque édition.",

        innovationTitle: "Innovation",
        innovationText:
          "Innover constamment pour offrir des expériences toujours plus engageantes avec nouvelles technologies et activités.",
      },

      // Équipe
      team: {
        title: "Notre Équipe",
        defaultMemberText: "Dédié à la réussite de votre expérience",

        roles: {
          logistics: "Chargé de La Logistique",
          programming: "Chargé événementiel",
          communication: "Responsable Communication",
        },
      },

      // FAQ
      faq: {
        title: "Questions Fréquemment Posées",

        q1: "Que se passe-t-il en cas de pluie ?",
        a1: "En cas de pluie légère, l'événement se poursuit avec des équipements de protection (bâches, auvents). Pour une pluie importante, l'événement sera reporté à une autre date avec remboursement complet ou report gratuit de votre ticket.",

        q2: "Puis-je venir avec des enfants ?",
        a2: "Absolument ! Movie in the Park est conçu pour toute la famille. Les films sélectionnés sont adaptés à tous les âges. Nous recommandons nos packs Famille pour une meilleure expérience avec les enfants.",

        q3: "Puis-je venir avec ma propre nourriture ?",
        a3: "Non, il n'est pas autorisé d'apporter sa propre nourriture. Toute la restauration doit être achetée sur place auprès de nos stands officiels.",

        q4: "Que faire en cas de perte de mon ticket ?",
        a4: "Votre ticket numérique sera envoyé par email et WhatsApp. Si vous le perdez, contactez-nous immédiatement avec vos informations de réservation et nous vous enverrons une copie.",

        q5: "Y a-t-il des places accessibles aux personnes en situation de handicap ?",
        a5: "Oui, nous avons des espaces réservés pour les personnes en situation de handicap avec meilleur accès et vue. Contactez-nous pour en savoir plus sur nos accommodations.",

        q6: "Puis-je apporter mon propre matelas ou coussin ?",
        a6: "Oui, vous pouvez apporter votre propre matelas ou coussin. Les packs VIP et Couple incluent déjà un matelas confortable.",
      },

      // Call to action
      cta: {
        title: "Prêt à nous rejoindre pour la prochaine édition ?",
        subtitle: "Soyez parmi les premiers à vivre cette expérience cinématographique unique",
        button: "Réserver ma place",
      },
    },

    // --------------------------------------------------------------------------
    // PAGE CONTACT
    // --------------------------------------------------------------------------
    contactPage: {
      // Hero section
      hero: {
        title: "Nous contacter",
        subtitle: "Une question ? Une collaboration ? Nous sommes disponibles et réactifs.",
      },

      // Contacts directs
      directContacts: {
        title: "Coordonnées directes",

        whatsapp: {
          title: "WhatsApp",
          subtitle: "Chat en direct",
          number: "+237 697 30 44 50",
        },

        phone: {
          title: "Téléphone",
          subtitle: "Appel direct",
          number: "+237 697 30 44 50",
        },

        email: {
          title: "Email",
          subtitle: "Message écrit",
          address: "matangabrooklyn@gmail.com",
        },

        location: {
          title: "Localisation",
          subtitle: "Lieu de l'événement",
          place: "Mini Prix Bastos, Yaoundé",
        },
      },

      // Horaires
      schedule: {
        title: "Horaires de contact",
        mondaySaturday: "Lundi - Samedi : 09h00 - 20h00",
        sunday: "Dimanche : 10h00 - 18h00",
        responseTime: "Réponse garantie sous 24h",
      },

      // Formulaire
      form: {
        title: "Formulaire de contact",

        sentTitle: "Message envoyé avec succès",
        sentText: "Merci d'avoir contacté Movie in the Park.",

        fields: {
          name: {
            label: "Nom",
            placeholder: "Votre nom",
          },
          email: {
            label: "Email",
            placeholder: "votre.email@exemple.com",
          },
          phone: {
            label: "Téléphone (optionnel)",
            placeholder: "+237 6 XX XX XX XX",
          },
          subject: {
            label: "Sujet",
            options: {
              reservationQuestion: "Question sur la réservation",
              packQuestion: "Question sur les packs",
              partnership: "Partenariat / sponsor",
              feedback: "Remarques ou suggestions",
              other: "Autre",
            },
          },
          message: {
            label: "Message",
            placeholder: "Écrivez votre message ici...",
          },
        },

        submit: {
          button: "Envoyer mon message",
        },
      },

      // Réseaux sociaux
      socials: {
        title: "Suivez-nous",
        facebook: "Facebook",
        instagram: "Instagram",
        tiktok: "TikTok",
        whatsapp: "WhatsApp",
      },
    },

    // --------------------------------------------------------------------------
    // PAGE RÉSERVATION
    // --------------------------------------------------------------------------
    reservation: {
      title: "Réservez votre place",
      subtitle:
        "Choisissez votre pack, remplissez vos informations, puis envoyez votre preuve de paiement via WhatsApp",
      selectPack: "Choisissez votre pack",
      yourInfo: "Vos informations",
      selectedPack: "Pack sélectionné",
      participants: "Participants",
      paymentProof: "Preuve de paiement",
      addParticipant: "Ajouter un participant",
      standMember: "Membre du comité de stand",
    },

    reservationPage: {
      title: "Réservez votre place",
      subtitle:
        "Choisissez votre pack, remplissez vos informations, puis envoyez votre preuve de paiement via WhatsApp",

      backToPacks: "Retour aux packs",

      step1Title: "Pack sélectionné",
      step1PackPriceSuffix: "XAF",

      step2Title: "Vos informations",

      step3ParticipantsTitle: "Participants",
      step3StandTitle: "Membres du comité",

      alertMissingFields: "Veuillez remplir tous les champs obligatoires",

      confirmationBack: "Retour aux packs",
    },

    // --------------------------------------------------------------------------
    // SÉLECTEUR DE PACK
    // --------------------------------------------------------------------------
    packSelector: {
      title: "Choisissez votre pack",
      subtitle: "Sélectionnez l'offre qui correspond le mieux à vos besoins",

      // Tags et boutons
      popularTag: "POPULAIRE",
      choosePackButton: "Choisir ce pack",

      // Pack Stand spécifique
      standTagline: "Pour les entreprises et partenaires",
      standTarifLabel: "Tarif",
      standCapacityLabel: "Capacité",
      standAdvantagesLabel: "Avantages",
      standCapacityValue: "Jusqu'à {{count}} personnes",
      standAdvantagesValue: "{{count}} bénéfices",
      standLayoutTitle: "Aménagement au choix :",
      standLayoutOption1: "1 table avec 4 chaises",
      standLayoutOption2: "OU 2 tables avec 2 chaises",
      standServicesTitle: "Services inclus :",
      standReserveButton: "Réserver votre stand",
    },

    // --------------------------------------------------------------------------
    // DÉTAILS DES PACKS
    // --------------------------------------------------------------------------
    packsDetails: {
      simple: {
        name: "Simple",
        description: "L'expérience cinéma en plein air classique",
        features: {
          f1: "Accès aux deux projections",
          f2: "Snack inclus : Popcorn + Boisson",
          f3: "Siège confortable",
          f4: "Accès standard",
          f5: "Accès à la zone photo payant",
        },
      },

      vip: {
        name: "VIP",
        description: "L'expérience VIP ultime",
        features: {
          f1: "Accès aux deux films",
          f2: "Accès gratuit à la zone photo",
          f3: "Siège premium (matelas + couverture)",
          f4: "Snack + boisson",
          f5: "Snack + boisson",
          f6: "Accès prioritaire aux animations et activités",
          f7: "Espace VIP réservé",
        },
      },

      couple: {
        name: "Couple",
        description: "Parfait pour une soirée romantique",
        features: {
          f1: "Deux sièges premium côte à côte",
          f2: "Snacks + boissons",
          f3: "Photo professionnelle gratuite",
          f4: "Accès zone VIP",
          f5: "Accès à toutes les activités",
        },
      },

      famille: {
        name: "Famille",
        description: "Une sortie en famille inoubliable",
        features: {
          f1: "De 2 à 4 personnes",
          f2: "Privilèges VIP",
          f3: "Accès prioritaire (surtout pour les enfants)",
          f4: "Snacks + boissons",
          f5: "Sièges premium",
          f6: "Zone photo gratuite",
          f7: "Avantage spécial famille : accès gratuit pour enfants de 0 à 5 ans",
        },
      },

      stand: {
        name: "Stand Entreprise",
        description: "Volet professionnel pour entreprises et partenaires",
        features: {
          f1: "1 table avec 4 chaises OU 2 tables avec 2 chaises",
          f2: "Électricité incluse",
          f3: "Promotion de l'entreprise dans le groupe",
          f4: "Promotion sur les réseaux sociaux Movie in the Park",
          f5: "Accès aux projections des 2 films",
          f6: "2 badges de prestataire",
        },
      },
    },

    // --------------------------------------------------------------------------
    // FORMULAIRE DE RÉSERVATION
    // --------------------------------------------------------------------------
    reservationForm: {
      firstnameLabel: "Prénom *",
      firstnamePlaceholder: "Votre prénom",
      lastnameLabel: "Nom *",
      lastnamePlaceholder: "Votre nom",
      phoneLabel: "Téléphone",
      phonePlaceholder: "+237 6XX XXX XXX",
      emailLabel: "Email (fortement conseillé)",
      emailPlaceholder: "votre.email@exemple.com",
      sourceLabel: "Comment avez-vous connu l'événement ?",
      sourcePlaceholder: "Sélectionnez une option",
      sourceFacebook: "Facebook",
      sourceInstagram: "Instagram",
      sourceFriend: "Un ami",
      sourceOther: "Autre",
      incompleteNumber: "Numéro incomplet",
      maxCharacters: "Maximum 20 caractères",
      minDigits: "Minimum 9 chiffres requis",
      required: "Champ requis",
      participantNameRequired: "Nom requis",
      couplePackRequires2People: "Le pack Couple nécessite 2 personnes",
    },

    // --------------------------------------------------------------------------
    // FORMULAIRE PARTICIPANTS
    // --------------------------------------------------------------------------
    participantForm: {
      coupleTitle: "Participant 2 (champs obligatoires *)",
      firstname: "Prénom",
      lastname: "Nom",
      requiredSymbol: "*",

      familyTitle: "Participants supplémentaires (optionnel - max {{max}} personnes en plus du payeur)",
      noParticipant: "Aucun participant ajouté. Cliquez ci-dessous pour en ajouter.",
      addParticipant: "Ajouter un participant ({{current}}/{{max}})",

      standTitle: "Membres du comité de stand (max {{max}})",
      noMember: "Aucun membre ajouté. Cliquez ci-dessous pour en ajouter.",
      addMember: "Ajouter un membre ({{current}}/{{max}})",

      placeholderFirstname: "Prénom",
      placeholderLastname: "Nom",
      dynamicTitle: "Participants (max {{max}} personnes)",
    },

    // --------------------------------------------------------------------------
    // RÉSUMÉ DE RÉSERVATION
    // --------------------------------------------------------------------------
    reservationSummary: {
      title: "Résumé de votre réservation",
      packLabel: "Pack",
      priceLabel: "Prix",
      teamStand: "1 stand pour toute votre équipe",
      singleTicketFor: "Un seul ticket pour {{count}} personnes",
      participantsCount: "Nombre de participants",
      reservingPerson: "Réservant",
      companyContact: "Contact de l'entreprise",
      participantsIncluded: "Participants inclus",
      totalToPay: "Total à payer",
      confirm: "Confirmer ma réservation",
      back: "Retour à la sélection du pack",
    },

    // --------------------------------------------------------------------------
    // INSTRUCTIONS DE PAIEMENT
    // --------------------------------------------------------------------------
    paymentInstructions: {
      successTitle: "Réservation confirmée !",
      successMessage: "Votre réservation #{{id}} a été prise en compte",

      detailsTitle: "Détails de votre réservation",
      reservationNumber: "Numéro de réservation",
      pack: "Pack",
      amountToPay: "Montant à payer",
      reservingPerson: "Réservant",

      instructionsTitle: "Instructions de paiement",

      step1Title: "Étape 1 : Effectuez votre paiement",
      step1Description: "Veuillez effectuer un virement Mobile Money sur le compte suivant :",
      operator: "Opérateur",
      operatorsList: "MTN Mobile Money / Orange Money",
      phoneNumber: "Numéro",
      amount: "Montant",

      step2Title: "Étape 2 : Envoyez votre preuve de paiement",
      step2Description:
        "Une fois le paiement effectué, capturez votre reçu et envoyez-le via WhatsApp avec votre confirmation de réservation.",
      openWhatsapp: "Ouvrir WhatsApp pour envoyer ma preuve",

      prefilledMessage: "Votre message pré-rempli :",

      nextStepsTitle: "Qu'est-ce qui se passe ensuite ?",
      stepVerification: "Paiement en attente de vérification",
      stepVerificationDesc: "Votre paiement sera vérifié par un administrateur",

      stepWhatsapp: "Confirmation par WhatsApp",
      stepWhatsappDesc: "Vous recevrez une confirmation et votre ticket numérique par WhatsApp",

      stepEmail: "Email de confirmation",
      stepEmailDesc: "Un email récapitulatif sera aussi envoyé à {{email}}",

      stepEnjoy: "Profitez de l'événement !",
      stepEnjoyDesc: "Présentez votre ticket numérique à l'entrée",

      infoMessage: "Des questions ? Consultez notre page d'accueil ou contactez-nous directement sur WhatsApp",
      homepage: "page d'accueil",
    },

    // --------------------------------------------------------------------------
    // SUIVI DE RÉSERVATION
    // --------------------------------------------------------------------------
    tracking: {
      title: "Suivez votre réservation",
      subtitle: "Entrez votre numéro de téléphone pour voir l'état de votre paiement",
      phoneLabel: "Numéro de téléphone",
      phonePlaceholder: "+237 6XX XXX XXX",
      searchButton: "Rechercher",
    },

    reservationTracking: {
      loading: "Recherche en cours...",
      noReservation: "Aucune réservation trouvée pour ce numéro",
      retry: "Réessayer",
      reservation: "Réservation #{{id}}",
      date: "Date",
      pack: "Pack",
      totalAmount: "Montant total",
      paidAmount: "Montant payé",
      remainingAmount: "Montant restant",
      reservingPerson: "Réservant",
      newSearch: "Nouvelle recherche",

      // Statuts de paiement
      status_confirmed: "Confirmée",
      status_partial: "Paiement partiel",
      status_pending: "En attente",
      status_paid: "Payée",
    },

    // --------------------------------------------------------------------------
    // PAGE ARCHIVES (Éditions passées)
    // --------------------------------------------------------------------------
    archivesPage: {
      title: "Éditions précédentes",
      subtitle: "Revivez les ambiances des années passées",

      // Cartes d'édition
      card: {
        films: "Films",
        participants: "Participants",
        seeDetails: "Voir les détails",
      },

      // Modal de détails
      modal: {
        title: "Édition {{year}}",
        dateLabel: "Date",
        locationLabel: "Lieu",
        filmsLabel: "Films présentés",
        highlightsLabel: "Ambiance",
        close: "Fermer",
        cta: "Réserver pour la prochaine édition",
      },

      // Call to action final
      finalCTA: {
        title: "Vous voulez participer à la prochaine édition ?",
        subtitle: "Réservez votre place dès maintenant pour ne pas rater l'événement",
        button: "Réserver ma place",
      },

      // Données des éditions
      editions: {
        e2024: {
          highlights:
            "Une édition exceptionnelle ayant rassemblé près de 200 participants. Une ambiance électrique, une organisation optimisée et un public fidèle au rendez-vous.",
          date: "15 Décembre 2024",
          location: "Musée National, Yaoundé",
          film1: "Inception",
          film2: "La La Land",
        },
        e2023: {
          highlights:
            "Une montée en puissance remarquable avec plus de 120 participants. Le concept s'est solidifié et a commencé à attirer un public plus large.",
          date: "10 Novembre 2023",
          location: "Musée National, Yaoundé",
          film1: "Rêves sous les Étoiles",
          film2: "La Nuit du Cinéma",
        },
        e2022: {
          highlights:
            "Une édition charnière qui a presque doublé son audience par rapport à l'année précédente. Le bouche-à-oreille a permis d'asseoir la réputation de l'événement.",
          date: "22 Octobre 2022",
          location: "Musée National, Yaoundé",
          film1: "Le Voyage",
          film2: "Lumières de la Nuit",
        },
        e2021: {
          highlights:
            "La toute première édition, réunissant environ 50 personnes. Un lancement modeste mais prometteur, qui a jeté les bases du futur succès de Movie in the Park.",
          date: "18 Septembre 2021",
          location: "Musée National, Yaoundé",
          film1: "Étoile Brillante",
          film2: "Soirée Magique",
        },
      },
    },
  },

  // ============================================================================
  // ANGLAIS (EN)
  // ============================================================================
  en: {
    // --------------------------------------------------------------------------
    // COMMON ELEMENTS (Navigation, shared buttons)
    // --------------------------------------------------------------------------
    common: {
      home: "Home",
      films: "Films & Program",
      reservation: "Reservation",
      archives: "Past Editions",
      about: "About",
      contact: "Contact",
      back: "Back",
      next: "Next",
      confirm: "Confirm",
    },

    // --------------------------------------------------------------------------
    // FOOTER
    // --------------------------------------------------------------------------
    footer: {
      // Brand & tagline
      brand: {
        title: "Movie in the Park",
        tagline: "Experience cinema differently, under the stars.",
      },

      // Footer navigation
      navigation: {
        title: "Navigation",
        home: "Home",
        films: "Movies & Schedule",
        reservation: "Reservation",
        archives: "Past Editions",
        about: "About",
        contact: "Contact",
      },

      // Contact information
      contact: {
        title: "Contact us",
        phone: {
          label: "Phone",
          number: "+237 697 30 44 50",
        },
        email: {
          label: "Email",
          address: "matangabrooklyn@gmail.com",
        },
        whatsapp: {
          label: "WhatsApp",
        },
        location: {
          label: "Location",
          address: "Mini Prix Bastos, Yaoundé",
        },
      },

      // Newsletter
      newsletter: {
        title: "Stay updated",
        subtitle: "Receive updates about upcoming editions.",
        placeholder: "Your email",
        button: "Subscribe",
      },

      // Copyright & legal
      copyright: {
        text: "© 2025 Movie in the Park. All rights reserved.",
        legal: "Legal Notice",
        privacy: "Privacy Policy",
      },
    },

    // --------------------------------------------------------------------------
    // HERO / LANDING SECTION
    // --------------------------------------------------------------------------
    hero: {
      title: "Movie in the Park",
      tagline: "Outdoor cinema under the stars",
      dateLabel: "Date",
      dateValue: "Saturday, December 20, 2025",
      locationLabel: "Location",
      locationValue: "Mini Prix Bastos",
      timeLabel: "Time",
      timeValue: "Opens 1:00 PM",
      advice: "🧥 Tip: Bring a sweater, a blanket and socks — evenings can get chilly!",
      ctaFilms: "See films",
      ctaReservation: "Reserve my spot",
    },

    // --------------------------------------------------------------------------
    // WHY COME SECTION (Event benefits)
    // --------------------------------------------------------------------------
    whyCome: {
      title: "Why join Movie in the Park?",
      subtitle: "A premium outdoor cinema experience combining entertainment, comfort, and togetherness",

      item1_title: "Outdoor cinema",
      item1_desc:
        "6-meter HD giant screen, professional Dolby sound, and a unique atmosphere under Yaoundé's starry sky.",

      item2_title: "Comfort & friendliness",
      item2_desc:
        "Comfortable mattresses, snacks, refreshing drinks, and a relaxed atmosphere to fully enjoy the night.",

      item3_title: "Family friendly",
      item3_desc: "Alone, as a couple, with family or friends: adapted packs for everyone to enjoy the experience.",

      item4_title: "Successful previous editions",
      item4_desc: "More than 500 delighted participants at our latest edition, with an average rating of 4.8/5.",
    },

    // --------------------------------------------------------------------------
    // FILMS SECTION (Short presentation)
    // --------------------------------------------------------------------------
    filmsSection: {
      title: "Movies for this edition",
      subtitle: "Two carefully selected movies for an unforgettable night",
      moreDetails: "Learn more →",
      fullProgramCta: "View full program",
    },

    // Films list with details
    filmsList: {
      horror: {
        title: "The Lodge",
        genre: "Horror | Drama | Psychological Thriller | Mystery",
        year: "2019",
        country: "United Kingdom | United States | Canada",
        time: "10:00 PM",
        synopsis:
          "A soon-to-be stepmother is snowed in at a remote lodge with her fiancé's two children. As unexplained and frightening events occur, her dark, traumatic religious past resurfaces, pushing everyone to their limits in isolation.",
      },
      family: {
        title: "Zootopie 2 (2025)",
        genre: "Family | Adventure | Fantasy",
        year: "2025",
        country: "United States",
        time: "6:30 PM",
        synopsis:
          "A young hero must save the Overworld from destruction in a spectacular family adventure inspired by the worldwide hit game.",
      },
    },

    // --------------------------------------------------------------------------
    // PRICING / PACKS SECTION
    // --------------------------------------------------------------------------
    pricing: {
      title: "Choose Your Experience",
      subtitle: "Packages available for all budgets",
      choose: "Choose",

      // Corporate Booth Pack
      standTitle: "Corporate Booth",
      standSubtitle: "For companies and partners",
      standPriceLabel: "Price",
      standPriceValue: "On request",
      standPriceNote: "Negotiable depending on your needs",
      standSetup: "Setup",
      standSetup1: "1 table + 4 chairs",
      standSetup2: "OR 2 tables + 2 chairs",
      standServices: "Services",
      standElectricity: "Electricity",
      standVisibility: "Premium visibility",
      standAdvantages: "Included advantages:",
      standAdv1: "Promotion on Movie in the Park social media",
      standAdv2: "Mention in official communications",
      standAdv3: "Access to all 2 film screenings",
      standExtra: "Additional services:",
      standExtra1: "2 staff badges",
      standExtra2: "Optional marketing activation",
      standExtra3: "Access to all activities",
      standCTA: "Contact the team for a quote",
      standPhoneNote: "📞 +237 697 30 44 50 or reach us via the contact form",
      reservationCTA: "View all details & book",
    },

    // Pack metadata (summary)
    packs: {
      simple: {
        name: "Standard Ticket",
        price: "3 000",
        features: ["Access to both films", "Snack: Popcorn + Drink", "Comfortable seating", "Standard access"],
      },
      vip: {
        name: "VIP Ticket",
        price: "5 000",
        badge: "⭐ POPULAR",
        features: ["Access to both films", "Premium mattress seating", "Free meal + drink", "Free photo zone"],
      },
      couple: {
        name: "Couple Ticket",
        price: "8 000",
        features: ["For 2 people", "Side-by-side premium seats", "Meal + drink included", "Free professional photo"],
      },
      family: {
        name: "Family Ticket",
        price: "10 000",
        features: ["From 3 to 5 people", "All VIP privileges", "Grouped premium seating", "Children priority access"],
      },
    },

    // --------------------------------------------------------------------------
    // ATMOSPHERE SECTION (Photo gallery + activities)
    // --------------------------------------------------------------------------
    atmosphere: {
      title: "More than just a movie, a complete night experience!",

      // Photo descriptions
      photos: {
        p1: "An engaged audience",
        p2: "Food & catering available",
        p3: "Live entertainment",
      },

      // Activities offered
      activities: {
        dj: {
          title: "DJ Set & Entertainment",
          description: "Live DJ, dynamic MC and interactive games to warm up the atmosphere before the first movie.",
        },
        photos: {
          title: "Photos & Memories",
          description: "Professional photobooth and photographer on site to capture your best moments.",
        },
        food: {
          title: "Food & Drinks",
          description: "Snack stands, hot & cold drinks, and local partners to treat your taste buds.",
        },
        games: {
          title: "Games & Contests",
          description: "Cinema quiz, raffle with prizes to win, and surprise animations between the two movies.",
        },
      },

      cta: "📅 View the full schedule",
    },

    // --------------------------------------------------------------------------
    // TESTIMONIALS (Participant reviews)
    // --------------------------------------------------------------------------
    testimonials: {
      title: "What people thought about it",

      // Overall rating
      overall: {
        ratingValue: "4.8/5",
        basedOn: "Based on 127 participant reviews",
      },

      // Testimonial list
      items: {
        t1: {
          quote:
            "A magical experience! The organization was flawless, the atmosphere warm, and the movies excellent. We will gladly come back for the next edition.",
          author: "Brooklyn",
          pack: "Family Pack",
          edition: "December 2024",
        },
        t2: {
          quote:
            "The concept is amazing. Between the DJ set, the movies, and the friendly atmosphere, it was a perfect evening. The VIP pack is totally worth it!",
          author: "Dorian",
          pack: "VIP Pack",
          edition: "December 2024",
        },
        t3: {
          quote:
            "Perfect date night! The Couple Pack with the double mattress and souvenir photo made our evening extra special. Definitely doing it again.",
          author: "Sammy",
          pack: "Couple Pack",
          edition: "December 2024",
        },
      },
    },

    // --------------------------------------------------------------------------
    // FILMS PAGE (Complete details)
    // --------------------------------------------------------------------------
    filmsPage: {
      // Page header
      header: {
        title: "Films & Program",
        subtitle: "Discover what's waiting for you in this edition",
      },

      // Detailed films
      films: {
        title: "Movies of this edition",

        f1: {
          title: "Zootopie 2 (2025)",
          genre: "Family, Adventure, Fantasy",
          country: "USA",
          year: "2025",
          duration: "115 min",
          classification: "All audiences",
          synopsis:
            "An epic journey where a young hero must save the Overworld from a destructive force. Inspired by the world-famous universe, this film offers a spectacular adventure for all ages.",
          screening: "6:30 PM",
        },

        f2: {
          title: "The Lodge",
          genre: "Horror | Drama | Psychological Thriller | Mystery",
          country: "United Kingdom | United States | Canada",
          year: "2019",
          duration: "138 min",
          classification: "Restricted – 18+",
          synopsis:
            "A soon-to-be stepmother is snowed in at a remote lodge with her fiancé's two children. As unexplained and frightening events occur, her dark, traumatic religious past resurfaces, pushing everyone to their limits in isolation.",
          screening: "10:00 PM",
        },
      },

      // Detailed day schedule
      schedule: {
        title: "Detailed Day Program",
        subtitle: "Follow the full progression of your evening",

        s1: {
          time: "1:00 PM – 6:00 PM",
          title: "Activities & Animations",
          description: "Video games, board games, challenges, mini video shoots, photobooth, DJ zone",
        },
        s2: {
          time: "6:00 PM",
          title: "Doors Opening",
          description: "Public reception and installation",
        },
        s3: {
          time: "6:30 PM",
          title: "First Movie",
          description: "Zootopie 2 (2025) – Audience installation starts at 6:00 PM",
        },
        s4: {
          time: "9:00 PM",
          title: "Break & Animations",
          description: "Meals, photobooth, mini-contests and refreshments",
        },
        s5: {
          time: "10:00 PM",
          title: "Second Movie",
          description: "The Lodge – night screening",
        },
        s6: {
          time: "12:00 AM+",
          title: "Closing",
          description: "End of the event",
        },
      },

      // Activities section
      activitiesSection: {
        title: "Activities & Animations",
      },

      // Call to action
      cta: {
        title: "Ready for the experience?",
        subtitle: "Book your package now and secure your seat for this unforgettable edition.",
        button: "Reserve my spot",
      },
    },

    // --------------------------------------------------------------------------
    // ACTIVITIES (Short list)
    // --------------------------------------------------------------------------
    activities: {
      a1: {
        icon: "🎤",
        title: "Concerts & Performances",
        description: "Discover live local artists",
      },
      a2: {
        icon: "📸",
        title: "Photobooth & Photo Zones",
        description: "Unforgettable captures under the stars",
      },
      a3: {
        icon: "🍟",
        title: "Food & Drinks",
        description: "Delicious meals and refreshments",
      },
      a4: {
        icon: "🎁",
        title: "Games & Challenges",
        description: "Participate and win prizes",
      },
      a5: {
        icon: "🔒",
        title: "Exclusive Bonus",
        description: "A special activity reserved for attendees will be unveiled on the day.",
      },
    },

    // --------------------------------------------------------------------------
    // ABOUT PAGE
    // --------------------------------------------------------------------------
    aboutPage: {
      // Hero section
      hero: {
        title: "About Movie in the Park",
        subtitle: "Discover the story of a unique cinematic adventure that turns parks into open-air movie theaters",
      },

      // What is Movie in the Park
      whatIs: {
        title: "What is Movie in the Park?",
        p1: "Movie in the Park is an open-air cinema event in Yaoundé. A unique experience under the stars, mixing big-screen movies, live concerts, games, photo zones, food, drinks, and a warm festive atmosphere.",
        p2: "Each edition brings together families, friends, couples, and movie lovers. The goal: offer an unforgettable evening where you watch a movie, eat, dance, take photos, play, and enjoy every moment.",
        nextEditionTitle: "📅 Next edition: December 2025 — Yaoundé",
        nextEditionSubtitle: "Don't miss this exceptional edition!",
        clothingTitle: "🧥 Dress recommendation",
        clothingText:
          "We strongly recommend bringing a sweater, blanket, and socks as evenings can get chilly. Think about your comfort!",
      },

      // Vision and values
      visionValues: {
        title: "Our Vision & Values",

        experienceTitle: "Experience",
        experienceText:
          "Offer an immersive and unique cinematic experience with a large HD screen, professional Dolby sound, and a magical atmosphere under the stars.",

        convivialityTitle: "Conviviality",
        convivialityText:
          "Create a space for sharing and meeting where everyone feels welcome, whether alone, as a couple, with family, or friends.",

        qualityTitle: "Quality",
        qualityText:
          "Guarantee excellent sound, crystal-clear image, great comfort, and flawless organization at every edition.",

        innovationTitle: "Innovation",
        innovationText:
          "Constantly innovate to deliver even more engaging experiences using new technologies and activities.",
      },

      // Team
      team: {
        title: "Our Team",
        defaultMemberText: "Dedicated to making your experience unforgettable",

        roles: {
          logistics: "Logistics Manager",
          programming: "Programming Manager",
          communication: "Communication Manager",
        },
      },

      // FAQ
      faq: {
        title: "Frequently Asked Questions",

        q1: "What happens in case of rain?",
        a1: "If the rain is light, the event continues with protective equipment (covers, shelters). For heavy rain, the event is postponed to another date with full refund or a free ticket reschedule.",

        q2: "Can I come with children?",
        a2: "Absolutely! Movie in the Park is designed for families. The selected films are suitable for all ages. We recommend our Family packs for the best experience with kids.",

        q3: "Can I bring my own food?",
        a3: "No, bringing your own food is not allowed. All meals and drinks must be purchased from our official stands.",

        q4: "What if I lose my ticket?",
        a4: "Your digital ticket is sent via email and WhatsApp. If you lose it, contact us with your reservation details and we will resend it.",

        q5: "Are there accessible seats for people with disabilities?",
        a5: "Yes, we have reserved spaces for people with disabilities, with improved access and visibility. Contact us for more information.",

        q6: "Can I bring my own mattress or cushion?",
        a6: "Yes, you may bring your own mattress or cushion. VIP and Couple packs already include a comfortable mattress.",
      },

      // Call to action
      cta: {
        title: "Ready to join us for the next edition?",
        subtitle: "Be among the first to experience this unique cinematic adventure",
        button: "Reserve my seat",
      },
    },

    // --------------------------------------------------------------------------
    // CONTACT PAGE
    // --------------------------------------------------------------------------
    contactPage: {
      // Hero section
      hero: {
        title: "Contact Us",
        subtitle: "A question? A collaboration request? We are available and responsive.",
      },

      // Direct contacts
      directContacts: {
        title: "Direct Contact",

        whatsapp: {
          title: "WhatsApp",
          subtitle: "Live chat",
          number: "+237 697 30 44 50",
        },

        phone: {
          title: "Phone",
          subtitle: "Direct call",
          number: "+237 697 30 44 50",
        },

        email: {
          title: "Email",
          subtitle: "Written message",
          address: "matangabrooklyn@gmail.com",
        },

        location: {
          title: "Location",
          subtitle: "Event venue",
          place: "Mini Prix Bastos, Yaoundé",
        },
      },

      // Schedule
      schedule: {
        title: "Contact Hours",
        mondaySaturday: "Monday - Saturday: 9:00 AM - 8:00 PM",
        sunday: "Sunday: 10:00 AM - 6:00 PM",
        responseTime: "Response guaranteed within 24h",
      },

      // Form
      form: {
        title: "Contact Form",

        sentTitle: "Message sent successfully",
        sentText: "Thank you for contacting Movie in the Park.",

        fields: {
          name: {
            label: "Name",
            placeholder: "Your name",
          },
          email: {
            label: "Email",
            placeholder: "your.email@example.com",
          },
          phone: {
            label: "Phone (optional)",
            placeholder: "+237 6 XX XX XX XX",
          },
          subject: {
            label: "Subject",
            options: {
              reservationQuestion: "Reservation question",
              packQuestion: "Question about packs",
              partnership: "Partnership / sponsorship",
              feedback: "Feedback or suggestions",
              other: "Other",
            },
          },
          message: {
            label: "Message",
            placeholder: "Write your message here...",
          },
        },

        submit: {
          button: "Send my message",
        },
      },

      // Social networks
      socials: {
        title: "Follow Us",
        facebook: "Facebook",
        instagram: "Instagram",
        tiktok: "TikTok",
        whatsapp: "WhatsApp",
      },
    },

    // --------------------------------------------------------------------------
    // RESERVATION
    // --------------------------------------------------------------------------
    reservation: {
      title: "Book Your Ticket",
      subtitle: "Choose your package, fill in your information, then send your payment proof via WhatsApp",
      selectPack: "Select your package",
      yourInfo: "Your Information",
      selectedPack: "Selected Package",
      participants: "Participants",
      paymentProof: "Payment Proof",
      addParticipant: "Add a Participant",
      standMember: "Stand Committee Member",
    },

    reservationPage: {
      title: "Book Your Ticket",
      subtitle: "Choose your package, fill in your details, then send your payment proof via WhatsApp",

      backToPacks: "Back to packs",

      step1Title: "Selected Package",
      step1PackPriceSuffix: "XAF",

      step2Title: "Your Information",

      step3ParticipantsTitle: "Participants",
      step3StandTitle: "Stand Committee Members",

      alertMissingFields: "Please fill in all required fields",

      confirmationBack: "Back to packs",
    },

    // --------------------------------------------------------------------------
    // PACK SELECTOR
    // --------------------------------------------------------------------------
    packSelector: {
      title: "Choose your pack",
      subtitle: "Select the offer that best fits your needs",

      // Tags and buttons
      popularTag: "POPULAR",
      choosePackButton: "Choose this pack",

      // Specific Stand Pack
      standTagline: "For companies and partners",
      standTarifLabel: "Price",
      standCapacityLabel: "Capacity",
      standAdvantagesLabel: "Advantages",
      standCapacityValue: "Up to {{count}} people",
      standAdvantagesValue: "{{count}} benefits",
      standLayoutTitle: "Available layout:",
      standLayoutOption1: "1 table with 4 chairs",
      standLayoutOption2: "OR 2 tables with 2 chairs",
      standServicesTitle: "Included services:",
      standReserveButton: "Book your stand",
    },

    // --------------------------------------------------------------------------
    // PACKS DETAILS
    // --------------------------------------------------------------------------
    packsDetails: {
      simple: {
        name: "Standard",
        description: "The classic outdoor cinema experience",
        features: {
          f1: "Access to both screenings",
          f2: "Snack included: Popcorn + Drink",
          f3: "Comfortable seating",
          f4: "Standard access",
          f5: "Paid access to the photo zone",
        },
      },

      vip: {
        name: "VIP",
        description: "The ultimate VIP experience",
        features: {
          f1: "Access to both movies",
          f2: "Free access to the photo zone",
          f3: "Premium seating (mattress + blanket + pillow)",
          f4: "Snack + drink",
          f5: "Free meal",
          f6: "Priority access to animations and activities",
          f7: "Reserved VIP area",
        },
      },

      couple: {
        name: "Couple",
        description: "Perfect for a romantic night",
        features: {
          f1: "Two premium seats side by side",
          f2: "Snacks + drinks + meal",
          f3: "Free professional photo",
          f4: "VIP zone access",
          f5: "Access all activities ",
        },
      },

      famille: {
        name: "Family",
        description: "An unforgettable family outing",
        features: {
          f1: "3 to 5 people",
          f2: "All VIP privileges",
          f3: "Priority access (especially for children)",
          f4: "Snacks + drinks + meal",
          f5: "Premium seating",
          f6: "Free photo zone",
          f7: "Special family advantage: free access for kids under 05 years old",
        },
      },

      stand: {
        name: "Business Stand",
        description: "Professional option for companies and partners",
        features: {
          f1: "1 table with 4 chairs OR 2 tables with 2 chairs",
          f2: "Electricity included",
          f3: "Business promotion in the group",
          f4: "Promotion on Movie in the Park social media",
          f5: "Access to both movie screenings",
          f6: "2 staff badges",
        },
      },
    },

    // --------------------------------------------------------------------------
    // RESERVATION FORM (English)
    // --------------------------------------------------------------------------
    reservationForm: {
      firstnameLabel: "First name *",
      firstnamePlaceholder: "Your first name",
      lastnameLabel: "Last name *",
      lastnamePlaceholder: "Your last name",
      phoneLabel: "Phone",
      phonePlaceholder: "+237 6XX XXX XXX",
      emailLabel: "Email (highly recommended)",
      emailPlaceholder: "your.email@example.com",
      sourceLabel: "How did you hear about the event?",
      sourcePlaceholder: "Select an option",
      sourceFacebook: "Facebook",
      sourceInstagram: "Instagram",
      sourceFriend: "A friend",
      sourceOther: "Other",
      incompleteNumber: "Incomplete number",
      maxCharacters: "Maximum 20 characters",
      minDigits: "Minimum 9 digits required",
      required: "Required field",
      participantNameRequired: "Name required",
      couplePackRequires2People: "The Couple pack requires 2 people",
    },

    // --------------------------------------------------------------------------
    // PARTICIPANT FORM (English)
    // --------------------------------------------------------------------------
    participantForm: {
      coupleTitle: "Second participant (required fields *)",
      firstname: "First name",
      lastname: "Last name",
      requiredSymbol: "*",

      familyTitle: "Additional participants (optional - max {{max}} people besides the payer)",
      noParticipant: "No participant added. Click below to add one.",
      addParticipant: "Add a participant ({{current}}/{{max}})",

      standTitle: "Stand committee members (max {{max}})",
      noMember: "No member added. Click below to add one.",
      addMember: "Add a member ({{current}}/{{max}})",

      placeholderFirstname: "First name",
      placeholderLastname: "Last name",
      dynamicTitle: "Participants (max {{max}} people)",
    },

    // --------------------------------------------------------------------------
    // RESERVATION SUMMARY (English)
    // --------------------------------------------------------------------------
    reservationSummary: {
      title: "Your reservation summary",
      packLabel: "Pack",
      priceLabel: "Price",
      teamStand: "1 stand for your entire team",
      singleTicketFor: "One ticket for {{count}} people",
      participantsCount: "Number of participants",
      reservingPerson: "Main contact",
      companyContact: "Company contact",
      participantsIncluded: "Included participants",
      totalToPay: "Total to pay",
      confirm: "Confirm my reservation",
      back: "Back to pack selection",
    },

    // --------------------------------------------------------------------------
    // PAYMENT INSTRUCTIONS (English)
    // --------------------------------------------------------------------------
    paymentInstructions: {
      successTitle: "Reservation confirmed!",
      successMessage: "Your reservation #{{id}} has been successfully recorded",

      detailsTitle: "Your reservation details",
      reservationNumber: "Reservation number",
      pack: "Pack",
      amountToPay: "Amount to pay",
      reservingPerson: "Main contact",

      instructionsTitle: "Payment instructions",

      step1Title: "Step 1: Make your payment",
      step1Description: "Please send your Mobile Money payment to the following account:",
      operator: "Operator",
      operatorsList: "MTN Mobile Money / Orange Money",
      phoneNumber: "Phone number",
      amount: "Amount",

      step2Title: "Step 2: Send your proof of payment",
      step2Description:
        "Once the payment is made, capture your receipt and send it via WhatsApp along with your reservation details.",
      openWhatsapp: "Open WhatsApp to send my proof",

      prefilledMessage: "Your pre-filled message:",

      nextStepsTitle: "What happens next?",
      stepVerification: "Payment pending verification",
      stepVerificationDesc: "Your payment will be checked by an administrator",

      stepWhatsapp: "WhatsApp confirmation",
      stepWhatsappDesc: "You will receive a confirmation and your digital ticket via WhatsApp",

      stepEmail: "Email confirmation",
      stepEmailDesc: "A summary email will also be sent to {{email}}",

      stepEnjoy: "Enjoy the event!",
      stepEnjoyDesc: "Show your digital ticket at the entrance",

      infoMessage: "Any questions? Check our homepage or contact us directly on WhatsApp",
      homepage: "homepage",
    },

    // --------------------------------------------------------------------------
    // RESERVATION TRACKING (English)
    // --------------------------------------------------------------------------
    tracking: {
      title: "Track your reservation",
      subtitle: "Enter your phone number to check your payment status",
      phoneLabel: "Phone number",
      phonePlaceholder: "+237 6XX XXX XXX",
      searchButton: "Search",
    },

    reservationTracking: {
      loading: "Searching...",
      noReservation: "No reservation found for this number",
      retry: "Try again",
      reservation: "Reservation #{{id}}",
      date: "Date",
      pack: "Pack",
      totalAmount: "Total amount",
      paidAmount: "Amount paid",
      remainingAmount: "Remaining amount",
      reservingPerson: "Main contact",
      newSearch: "New search",

      // Payment statuses
      status_confirmed: "Confirmed",
      status_partial: "Partially paid",
      status_pending: "Pending",
      status_paid: "Paid",
    },

    // --------------------------------------------------------------------------
    // ARCHIVES PAGE (English)
    // --------------------------------------------------------------------------
    archivesPage: {
      title: "Past Editions",
      subtitle: "Relive the atmosphere of previous years",

      // Edition cards
      card: {
        films: "Films",
        participants: "Participants",
        seeDetails: "See details",
      },

      // Details modal
      modal: {
        title: "Edition {{year}}",
        dateLabel: "Date",
        locationLabel: "Location",
        filmsLabel: "Presented films",
        highlightsLabel: "Atmosphere",
        close: "Close",
        cta: "Book for the next edition",
      },

      // Final call to action
      finalCTA: {
        title: "Want to join the next edition?",
        subtitle: "Book your spot now so you don't miss the event",
        button: "Reserve my spot",
      },

      // Editions data
      editions: {
        e2024: {
          highlights:
            "An exceptional edition gathering nearly 200 participants. An electric atmosphere, optimized organization, and a loyal audience.",
          date: "December 15, 2024",
          location: "National Museum, Yaoundé",
          film1: "Inception",
          film2: "La La Land",
        },
        e2023: {
          highlights:
            "A remarkable rise with more than 120 participants. The concept solidified and began attracting a broader audience.",
          date: "November 10, 2023",
          location: "National Museum, Yaoundé",
          film1: "Dreams Under the Stars",
          film2: "Night at the Cinema",
        },
        e2022: {
          highlights:
            "A pivotal edition that nearly doubled its audience compared to the previous year. Word-of-mouth helped strengthen the event's reputation.",
          date: "October 22, 2022",
          location: "National Museum, Yaoundé",
          film1: "The Journey",
          film2: "Lights of the Night",
        },
        e2021: {
          highlights:
            "The very first edition, gathering around 50 people. A modest but promising start that laid the foundation for the future success of Movie in the Park.",
          date: "September 18, 2021",
          location: "National Museum, Yaoundé",
          film1: "Shining Star",
          film2: "Magical Evening",
        },
      },
    },
  }, // Fin de l'objet 'en'
} // Fin de l'objet translations

// --------------------------------------------------------------------------
// FONCTION UTILITAIRE (Helper function for translations)
// --------------------------------------------------------------------------
export function t(key: string, language: "fr" | "en") {
  const keys = key.split(".")
  let value: any = translations[language]

  for (const k of keys) {
    if (value && typeof value === "object") {
      value = value[k]
    } else {
      return key // Retourne la clé si la traduction n'existe pas
    }
  }

  return value || key
}
