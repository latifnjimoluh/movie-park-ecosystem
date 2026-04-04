--
-- PostgreSQL database dump
--

-- Dumped from database version 17.5
-- Dumped by pg_dump version 17.5

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: enum_activity_logs_action; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.enum_activity_logs_action AS ENUM (
    'create',
    'read',
    'update',
    'delete',
    'export',
    'validate'
);


--
-- Name: enum_activity_logs_entity_type; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.enum_activity_logs_entity_type AS ENUM (
    'reservation',
    'pack',
    'payment',
    'ticket',
    'scan',
    'participant',
    'user'
);


--
-- Name: enum_activity_logs_status; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.enum_activity_logs_status AS ENUM (
    'success',
    'failed'
);


--
-- Name: enum_donations_payment_status; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.enum_donations_payment_status AS ENUM (
    'pending',
    'completed',
    'failed'
);


--
-- Name: enum_event_config_type; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.enum_event_config_type AS ENUM (
    'text',
    'number',
    'boolean',
    'json'
);


--
-- Name: enum_payments_method; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.enum_payments_method AS ENUM (
    'momo',
    'cash',
    'orange',
    'card',
    'other'
);


--
-- Name: enum_reservations_status; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.enum_reservations_status AS ENUM (
    'pending',
    'partial',
    'paid',
    'ticket_generated',
    'cancelled'
);


--
-- Name: enum_tickets_status; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.enum_tickets_status AS ENUM (
    'valid',
    'used',
    'cancelled'
);


--
-- Name: enum_users_role; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.enum_users_role AS ENUM (
    'superadmin',
    'admin',
    'cashier',
    'scanner'
);


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: SequelizeMeta; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."SequelizeMeta" (
    name character varying(255) NOT NULL
);


--
-- Name: UniqueVisitors; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."UniqueVisitors" (
    id integer NOT NULL,
    "ipHash" character varying(255) NOT NULL,
    "userAgent" text,
    "visitCount" integer DEFAULT 1 NOT NULL,
    "lastVisitedAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    "createdAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: COLUMN "UniqueVisitors"."ipHash"; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public."UniqueVisitors"."ipHash" IS 'SHA256 hash of visitor IP address for privacy';


--
-- Name: UniqueVisitors_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public."UniqueVisitors_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: UniqueVisitors_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public."UniqueVisitors_id_seq" OWNED BY public."UniqueVisitors".id;


--
-- Name: Visits; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Visits" (
    id integer NOT NULL,
    "totalVisits" integer DEFAULT 0 NOT NULL,
    "createdAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: Visits_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public."Visits_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: Visits_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public."Visits_id_seq" OWNED BY public."Visits".id;


--
-- Name: action_logs; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.action_logs (
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    reservation_id uuid,
    action_type character varying(255) NOT NULL,
    meta jsonb DEFAULT '{}'::jsonb,
    "createdAt" timestamp with time zone,
    description text
);


--
-- Name: activity_logs; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.activity_logs (
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    permission character varying(255),
    entity_type character varying(255) NOT NULL,
    entity_id uuid,
    action public.enum_activity_logs_action NOT NULL,
    description text,
    changes jsonb DEFAULT '{}'::jsonb,
    status public.enum_activity_logs_status DEFAULT 'success'::public.enum_activity_logs_status,
    ip_address character varying(255),
    user_agent character varying(255),
    created_at timestamp with time zone
);


--
-- Name: COLUMN activity_logs.permission; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.activity_logs.permission IS 'Permission utilisée pour cette action (ex: packs.create)';


--
-- Name: COLUMN activity_logs.entity_type; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.activity_logs.entity_type IS 'Type d''entité affectée';


--
-- Name: COLUMN activity_logs.entity_id; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.activity_logs.entity_id IS 'ID de l''entité affectée';


--
-- Name: COLUMN activity_logs.action; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.activity_logs.action IS 'Type d''action effectuée';


--
-- Name: COLUMN activity_logs.description; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.activity_logs.description IS 'Description lisible de l''action';


--
-- Name: COLUMN activity_logs.changes; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.activity_logs.changes IS 'Détails des changements effectués';


--
-- Name: daily_visits; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.daily_visits (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    visit_date date NOT NULL,
    total_visits integer DEFAULT 0 NOT NULL,
    unique_visitors integer DEFAULT 0 NOT NULL,
    created_at timestamp with time zone,
    updated_at timestamp with time zone
);


--
-- Name: donations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.donations (
    id uuid NOT NULL,
    donor_name character varying(255),
    amount numeric(10,2) NOT NULL,
    email character varying(255),
    payment_status public.enum_donations_payment_status DEFAULT 'pending'::public.enum_donations_payment_status NOT NULL,
    transaction_id character varying(255),
    "createdAt" timestamp with time zone,
    "updatedAt" timestamp with time zone,
    proof_url character varying(255)
);


--
-- Name: COLUMN donations.donor_name; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.donations.donor_name IS 'Nom du donateur (optionnel — don anonyme autorisé)';


--
-- Name: COLUMN donations.amount; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.donations.amount IS 'Montant du don en XAF';


--
-- Name: COLUMN donations.email; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.donations.email IS 'Email du donateur pour confirmation';


--
-- Name: COLUMN donations.transaction_id; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.donations.transaction_id IS 'Référence de transaction Mobile Money';


--
-- Name: COLUMN donations.proof_url; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.donations.proof_url IS 'URL de la preuve de paiement (image/PDF uploadé par l''admin)';


--
-- Name: event_config; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.event_config (
    id uuid NOT NULL,
    key character varying(255) NOT NULL,
    value text,
    type public.enum_event_config_type DEFAULT 'text'::public.enum_event_config_type,
    label character varying(255),
    "group" character varying(255) DEFAULT 'general'::character varying,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


--
-- Name: COLUMN event_config.key; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.event_config.key IS 'Clé unique ex: edition_label, location_lat';


--
-- Name: COLUMN event_config.value; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.event_config.value IS 'Valeur de la configuration';


--
-- Name: COLUMN event_config.label; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.event_config.label IS 'Label lisible pour l''interface admin';


--
-- Name: COLUMN event_config."group"; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.event_config."group" IS 'Groupe de configuration: general, hero, contact, social';


--
-- Name: films; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.films (
    id uuid NOT NULL,
    title_fr character varying(255) NOT NULL,
    title_en character varying(255),
    genre_fr character varying(255),
    genre_en character varying(255),
    year character varying(255),
    country_fr character varying(255),
    country_en character varying(255),
    duration character varying(255),
    synopsis_fr text,
    synopsis_en text,
    classification_fr character varying(255),
    classification_en character varying(255),
    poster_url character varying(255),
    youtube_url character varying(255),
    screening_time character varying(255),
    display_order integer DEFAULT 0,
    is_active boolean DEFAULT true,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    image_url character varying(255)
);


--
-- Name: COLUMN films.screening_time; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.films.screening_time IS 'Heure de diffusion ex: 18h30';


--
-- Name: COLUMN films.image_url; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.films.image_url IS 'Chemin de l''image uploadée localement';


--
-- Name: packs; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.packs (
    id uuid NOT NULL,
    name character varying(255) NOT NULL,
    price integer NOT NULL,
    description text,
    capacity integer,
    is_active boolean DEFAULT true,
    "createdAt" timestamp with time zone,
    "updatedAt" timestamp with time zone
);


--
-- Name: COLUMN packs.price; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.packs.price IS 'Price in XAF cents';


--
-- Name: COLUMN packs.capacity; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.packs.capacity IS 'Number of participants, null if single';


--
-- Name: participants; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.participants (
    id uuid NOT NULL,
    reservation_id uuid NOT NULL,
    name character varying(255) NOT NULL,
    phone character varying(255),
    email character varying(255),
    ticket_id uuid,
    entrance_validated boolean DEFAULT false,
    "createdAt" timestamp with time zone,
    "updatedAt" timestamp with time zone
);


--
-- Name: payments; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.payments (
    id uuid NOT NULL,
    reservation_id uuid NOT NULL,
    amount integer NOT NULL,
    method public.enum_payments_method NOT NULL,
    proof_url character varying(255),
    comment text,
    created_by uuid NOT NULL,
    "createdAt" timestamp with time zone,
    "updatedAt" timestamp with time zone
);


--
-- Name: COLUMN payments.amount; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.payments.amount IS 'Amount in XAF';


--
-- Name: COLUMN payments.proof_url; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.payments.proof_url IS 'URL or path to payment proof file';


--
-- Name: reservations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.reservations (
    id uuid NOT NULL,
    payeur_name character varying(255) NOT NULL,
    payeur_phone character varying(255) NOT NULL,
    payeur_email character varying(255),
    pack_id uuid NOT NULL,
    pack_name_snapshot character varying(255) NOT NULL,
    unit_price integer NOT NULL,
    quantity integer DEFAULT 1 NOT NULL,
    total_price integer NOT NULL,
    total_paid integer DEFAULT 0,
    status public.enum_reservations_status DEFAULT 'pending'::public.enum_reservations_status,
    "createdAt" timestamp with time zone,
    "updatedAt" timestamp with time zone
);


--
-- Name: COLUMN reservations.unit_price; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.reservations.unit_price IS 'Price per unit in XAF cents';


--
-- Name: roles; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.roles (
    id uuid NOT NULL,
    name character varying(255) NOT NULL,
    label character varying(255) NOT NULL,
    description character varying(255),
    permissions json DEFAULT '[]'::json,
    is_system boolean DEFAULT false,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


--
-- Name: COLUMN roles.name; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.roles.name IS 'Nom technique du rôle (ex: superadmin, cashier)';


--
-- Name: COLUMN roles.label; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.roles.label IS 'Nom affiché (ex: Administrateur Principal)';


--
-- Name: COLUMN roles.permissions; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.roles.permissions IS 'Liste des permissions [reservations.view, ...]';


--
-- Name: COLUMN roles.is_system; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.roles.is_system IS 'Si vrai, le rôle ne peut pas être supprimé';


--
-- Name: schedule_items; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.schedule_items (
    id uuid NOT NULL,
    "time" character varying(255) NOT NULL,
    title_fr character varying(255) NOT NULL,
    title_en character varying(255),
    description_fr text,
    description_en text,
    is_surprise boolean DEFAULT false,
    is_after boolean DEFAULT false,
    is_teaser boolean DEFAULT false,
    display_order integer DEFAULT 0,
    is_active boolean DEFAULT true,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


--
-- Name: COLUMN schedule_items."time"; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.schedule_items."time" IS 'Plage horaire ex: 18h00 - 18h30';


--
-- Name: COLUMN schedule_items.is_surprise; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.schedule_items.is_surprise IS 'Affiche le bloc surprise sous cet item';


--
-- Name: COLUMN schedule_items.is_after; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.schedule_items.is_after IS 'Affiche le bloc after-midnight sous cet item';


--
-- Name: COLUMN schedule_items.is_teaser; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.schedule_items.is_teaser IS 'Affiche un message de teaser discret';


--
-- Name: testimonials; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.testimonials (
    id uuid NOT NULL,
    quote_fr text NOT NULL,
    quote_en text,
    author character varying(255) NOT NULL,
    pack_name character varying(255),
    edition character varying(255),
    photo_url character varying(255),
    rating integer DEFAULT 5,
    is_active boolean DEFAULT true,
    display_order integer DEFAULT 0,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    image_url character varying(255)
);


--
-- Name: COLUMN testimonials.pack_name; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.testimonials.pack_name IS 'Nom du pack acheté ex: Pack VIP';


--
-- Name: COLUMN testimonials.edition; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.testimonials.edition IS 'Édition ex: Decembre 2024';


--
-- Name: COLUMN testimonials.photo_url; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.testimonials.photo_url IS 'Chemin vers la photo du participant';


--
-- Name: COLUMN testimonials.image_url; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.testimonials.image_url IS 'Chemin de l''image uploadée localement';


--
-- Name: tickets; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.tickets (
    id uuid NOT NULL,
    reservation_id uuid NOT NULL,
    ticket_number character varying(255) NOT NULL,
    qr_payload text NOT NULL,
    qr_image_url character varying(255),
    pdf_url character varying(255),
    status public.enum_tickets_status DEFAULT 'valid'::public.enum_tickets_status,
    generated_by uuid NOT NULL,
    generated_at timestamp with time zone,
    "createdAt" timestamp with time zone,
    "updatedAt" timestamp with time zone
);


--
-- Name: COLUMN tickets.qr_payload; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.tickets.qr_payload IS 'JSON with signature';


--
-- Name: unique_visitors; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.unique_visitors (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    ip_hash character varying(255) NOT NULL,
    times_visited integer DEFAULT 1 NOT NULL,
    first_visit timestamp with time zone NOT NULL,
    last_visit timestamp with time zone NOT NULL,
    created_at timestamp with time zone,
    updated_at timestamp with time zone
);


--
-- Name: users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.users (
    id uuid NOT NULL,
    email character varying(255) NOT NULL,
    password_hash character varying(255) NOT NULL,
    name character varying(255) NOT NULL,
    phone character varying(255),
    role character varying(255) DEFAULT 'cashier'::character varying,
    "createdAt" timestamp with time zone,
    "updatedAt" timestamp with time zone,
    last_login timestamp with time zone,
    role_id uuid
);


--
-- Name: visits; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.visits (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    total_visits integer DEFAULT 0 NOT NULL,
    created_at timestamp with time zone,
    updated_at timestamp with time zone
);


--
-- Name: UniqueVisitors id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."UniqueVisitors" ALTER COLUMN id SET DEFAULT nextval('public."UniqueVisitors_id_seq"'::regclass);


--
-- Name: Visits id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Visits" ALTER COLUMN id SET DEFAULT nextval('public."Visits_id_seq"'::regclass);


--
-- Name: SequelizeMeta SequelizeMeta_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."SequelizeMeta"
    ADD CONSTRAINT "SequelizeMeta_pkey" PRIMARY KEY (name);


--
-- Name: UniqueVisitors UniqueVisitors_ipHash_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."UniqueVisitors"
    ADD CONSTRAINT "UniqueVisitors_ipHash_key" UNIQUE ("ipHash");


--
-- Name: UniqueVisitors UniqueVisitors_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."UniqueVisitors"
    ADD CONSTRAINT "UniqueVisitors_pkey" PRIMARY KEY (id);


--
-- Name: Visits Visits_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Visits"
    ADD CONSTRAINT "Visits_pkey" PRIMARY KEY (id);


--
-- Name: action_logs action_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.action_logs
    ADD CONSTRAINT action_logs_pkey PRIMARY KEY (id);


--
-- Name: activity_logs activity_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.activity_logs
    ADD CONSTRAINT activity_logs_pkey PRIMARY KEY (id);


--
-- Name: daily_visits daily_visits_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.daily_visits
    ADD CONSTRAINT daily_visits_pkey PRIMARY KEY (id);


--
-- Name: daily_visits daily_visits_visit_date_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.daily_visits
    ADD CONSTRAINT daily_visits_visit_date_key UNIQUE (visit_date);


--
-- Name: daily_visits daily_visits_visit_date_key1; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.daily_visits
    ADD CONSTRAINT daily_visits_visit_date_key1 UNIQUE (visit_date);


--
-- Name: daily_visits daily_visits_visit_date_key10; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.daily_visits
    ADD CONSTRAINT daily_visits_visit_date_key10 UNIQUE (visit_date);


--
-- Name: daily_visits daily_visits_visit_date_key11; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.daily_visits
    ADD CONSTRAINT daily_visits_visit_date_key11 UNIQUE (visit_date);


--
-- Name: daily_visits daily_visits_visit_date_key12; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.daily_visits
    ADD CONSTRAINT daily_visits_visit_date_key12 UNIQUE (visit_date);


--
-- Name: daily_visits daily_visits_visit_date_key13; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.daily_visits
    ADD CONSTRAINT daily_visits_visit_date_key13 UNIQUE (visit_date);


--
-- Name: daily_visits daily_visits_visit_date_key14; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.daily_visits
    ADD CONSTRAINT daily_visits_visit_date_key14 UNIQUE (visit_date);


--
-- Name: daily_visits daily_visits_visit_date_key15; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.daily_visits
    ADD CONSTRAINT daily_visits_visit_date_key15 UNIQUE (visit_date);


--
-- Name: daily_visits daily_visits_visit_date_key16; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.daily_visits
    ADD CONSTRAINT daily_visits_visit_date_key16 UNIQUE (visit_date);


--
-- Name: daily_visits daily_visits_visit_date_key17; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.daily_visits
    ADD CONSTRAINT daily_visits_visit_date_key17 UNIQUE (visit_date);


--
-- Name: daily_visits daily_visits_visit_date_key18; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.daily_visits
    ADD CONSTRAINT daily_visits_visit_date_key18 UNIQUE (visit_date);


--
-- Name: daily_visits daily_visits_visit_date_key19; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.daily_visits
    ADD CONSTRAINT daily_visits_visit_date_key19 UNIQUE (visit_date);


--
-- Name: daily_visits daily_visits_visit_date_key2; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.daily_visits
    ADD CONSTRAINT daily_visits_visit_date_key2 UNIQUE (visit_date);


--
-- Name: daily_visits daily_visits_visit_date_key20; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.daily_visits
    ADD CONSTRAINT daily_visits_visit_date_key20 UNIQUE (visit_date);


--
-- Name: daily_visits daily_visits_visit_date_key21; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.daily_visits
    ADD CONSTRAINT daily_visits_visit_date_key21 UNIQUE (visit_date);


--
-- Name: daily_visits daily_visits_visit_date_key22; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.daily_visits
    ADD CONSTRAINT daily_visits_visit_date_key22 UNIQUE (visit_date);


--
-- Name: daily_visits daily_visits_visit_date_key23; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.daily_visits
    ADD CONSTRAINT daily_visits_visit_date_key23 UNIQUE (visit_date);


--
-- Name: daily_visits daily_visits_visit_date_key24; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.daily_visits
    ADD CONSTRAINT daily_visits_visit_date_key24 UNIQUE (visit_date);


--
-- Name: daily_visits daily_visits_visit_date_key25; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.daily_visits
    ADD CONSTRAINT daily_visits_visit_date_key25 UNIQUE (visit_date);


--
-- Name: daily_visits daily_visits_visit_date_key26; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.daily_visits
    ADD CONSTRAINT daily_visits_visit_date_key26 UNIQUE (visit_date);


--
-- Name: daily_visits daily_visits_visit_date_key27; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.daily_visits
    ADD CONSTRAINT daily_visits_visit_date_key27 UNIQUE (visit_date);


--
-- Name: daily_visits daily_visits_visit_date_key28; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.daily_visits
    ADD CONSTRAINT daily_visits_visit_date_key28 UNIQUE (visit_date);


--
-- Name: daily_visits daily_visits_visit_date_key29; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.daily_visits
    ADD CONSTRAINT daily_visits_visit_date_key29 UNIQUE (visit_date);


--
-- Name: daily_visits daily_visits_visit_date_key3; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.daily_visits
    ADD CONSTRAINT daily_visits_visit_date_key3 UNIQUE (visit_date);


--
-- Name: daily_visits daily_visits_visit_date_key30; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.daily_visits
    ADD CONSTRAINT daily_visits_visit_date_key30 UNIQUE (visit_date);


--
-- Name: daily_visits daily_visits_visit_date_key4; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.daily_visits
    ADD CONSTRAINT daily_visits_visit_date_key4 UNIQUE (visit_date);


--
-- Name: daily_visits daily_visits_visit_date_key5; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.daily_visits
    ADD CONSTRAINT daily_visits_visit_date_key5 UNIQUE (visit_date);


--
-- Name: daily_visits daily_visits_visit_date_key6; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.daily_visits
    ADD CONSTRAINT daily_visits_visit_date_key6 UNIQUE (visit_date);


--
-- Name: daily_visits daily_visits_visit_date_key7; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.daily_visits
    ADD CONSTRAINT daily_visits_visit_date_key7 UNIQUE (visit_date);


--
-- Name: daily_visits daily_visits_visit_date_key8; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.daily_visits
    ADD CONSTRAINT daily_visits_visit_date_key8 UNIQUE (visit_date);


--
-- Name: daily_visits daily_visits_visit_date_key9; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.daily_visits
    ADD CONSTRAINT daily_visits_visit_date_key9 UNIQUE (visit_date);


--
-- Name: donations donations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.donations
    ADD CONSTRAINT donations_pkey PRIMARY KEY (id);


--
-- Name: event_config event_config_key_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.event_config
    ADD CONSTRAINT event_config_key_key UNIQUE (key);


--
-- Name: event_config event_config_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.event_config
    ADD CONSTRAINT event_config_pkey PRIMARY KEY (id);


--
-- Name: films films_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.films
    ADD CONSTRAINT films_pkey PRIMARY KEY (id);


--
-- Name: packs packs_name_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.packs
    ADD CONSTRAINT packs_name_key UNIQUE (name);


--
-- Name: packs packs_name_key1; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.packs
    ADD CONSTRAINT packs_name_key1 UNIQUE (name);


--
-- Name: packs packs_name_key10; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.packs
    ADD CONSTRAINT packs_name_key10 UNIQUE (name);


--
-- Name: packs packs_name_key11; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.packs
    ADD CONSTRAINT packs_name_key11 UNIQUE (name);


--
-- Name: packs packs_name_key12; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.packs
    ADD CONSTRAINT packs_name_key12 UNIQUE (name);


--
-- Name: packs packs_name_key13; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.packs
    ADD CONSTRAINT packs_name_key13 UNIQUE (name);


--
-- Name: packs packs_name_key14; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.packs
    ADD CONSTRAINT packs_name_key14 UNIQUE (name);


--
-- Name: packs packs_name_key15; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.packs
    ADD CONSTRAINT packs_name_key15 UNIQUE (name);


--
-- Name: packs packs_name_key16; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.packs
    ADD CONSTRAINT packs_name_key16 UNIQUE (name);


--
-- Name: packs packs_name_key17; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.packs
    ADD CONSTRAINT packs_name_key17 UNIQUE (name);


--
-- Name: packs packs_name_key18; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.packs
    ADD CONSTRAINT packs_name_key18 UNIQUE (name);


--
-- Name: packs packs_name_key19; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.packs
    ADD CONSTRAINT packs_name_key19 UNIQUE (name);


--
-- Name: packs packs_name_key2; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.packs
    ADD CONSTRAINT packs_name_key2 UNIQUE (name);


--
-- Name: packs packs_name_key20; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.packs
    ADD CONSTRAINT packs_name_key20 UNIQUE (name);


--
-- Name: packs packs_name_key21; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.packs
    ADD CONSTRAINT packs_name_key21 UNIQUE (name);


--
-- Name: packs packs_name_key22; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.packs
    ADD CONSTRAINT packs_name_key22 UNIQUE (name);


--
-- Name: packs packs_name_key23; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.packs
    ADD CONSTRAINT packs_name_key23 UNIQUE (name);


--
-- Name: packs packs_name_key24; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.packs
    ADD CONSTRAINT packs_name_key24 UNIQUE (name);


--
-- Name: packs packs_name_key25; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.packs
    ADD CONSTRAINT packs_name_key25 UNIQUE (name);


--
-- Name: packs packs_name_key26; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.packs
    ADD CONSTRAINT packs_name_key26 UNIQUE (name);


--
-- Name: packs packs_name_key27; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.packs
    ADD CONSTRAINT packs_name_key27 UNIQUE (name);


--
-- Name: packs packs_name_key28; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.packs
    ADD CONSTRAINT packs_name_key28 UNIQUE (name);


--
-- Name: packs packs_name_key29; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.packs
    ADD CONSTRAINT packs_name_key29 UNIQUE (name);


--
-- Name: packs packs_name_key3; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.packs
    ADD CONSTRAINT packs_name_key3 UNIQUE (name);


--
-- Name: packs packs_name_key30; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.packs
    ADD CONSTRAINT packs_name_key30 UNIQUE (name);


--
-- Name: packs packs_name_key4; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.packs
    ADD CONSTRAINT packs_name_key4 UNIQUE (name);


--
-- Name: packs packs_name_key5; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.packs
    ADD CONSTRAINT packs_name_key5 UNIQUE (name);


--
-- Name: packs packs_name_key6; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.packs
    ADD CONSTRAINT packs_name_key6 UNIQUE (name);


--
-- Name: packs packs_name_key7; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.packs
    ADD CONSTRAINT packs_name_key7 UNIQUE (name);


--
-- Name: packs packs_name_key8; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.packs
    ADD CONSTRAINT packs_name_key8 UNIQUE (name);


--
-- Name: packs packs_name_key9; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.packs
    ADD CONSTRAINT packs_name_key9 UNIQUE (name);


--
-- Name: packs packs_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.packs
    ADD CONSTRAINT packs_pkey PRIMARY KEY (id);


--
-- Name: participants participants_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.participants
    ADD CONSTRAINT participants_pkey PRIMARY KEY (id);


--
-- Name: payments payments_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_pkey PRIMARY KEY (id);


--
-- Name: reservations reservations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.reservations
    ADD CONSTRAINT reservations_pkey PRIMARY KEY (id);


--
-- Name: roles roles_name_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_name_key UNIQUE (name);


--
-- Name: roles roles_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_pkey PRIMARY KEY (id);


--
-- Name: schedule_items schedule_items_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.schedule_items
    ADD CONSTRAINT schedule_items_pkey PRIMARY KEY (id);


--
-- Name: testimonials testimonials_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.testimonials
    ADD CONSTRAINT testimonials_pkey PRIMARY KEY (id);


--
-- Name: tickets tickets_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tickets
    ADD CONSTRAINT tickets_pkey PRIMARY KEY (id);


--
-- Name: tickets tickets_ticket_number_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tickets
    ADD CONSTRAINT tickets_ticket_number_key UNIQUE (ticket_number);


--
-- Name: tickets tickets_ticket_number_key1; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tickets
    ADD CONSTRAINT tickets_ticket_number_key1 UNIQUE (ticket_number);


--
-- Name: tickets tickets_ticket_number_key10; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tickets
    ADD CONSTRAINT tickets_ticket_number_key10 UNIQUE (ticket_number);


--
-- Name: tickets tickets_ticket_number_key11; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tickets
    ADD CONSTRAINT tickets_ticket_number_key11 UNIQUE (ticket_number);


--
-- Name: tickets tickets_ticket_number_key12; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tickets
    ADD CONSTRAINT tickets_ticket_number_key12 UNIQUE (ticket_number);


--
-- Name: tickets tickets_ticket_number_key13; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tickets
    ADD CONSTRAINT tickets_ticket_number_key13 UNIQUE (ticket_number);


--
-- Name: tickets tickets_ticket_number_key14; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tickets
    ADD CONSTRAINT tickets_ticket_number_key14 UNIQUE (ticket_number);


--
-- Name: tickets tickets_ticket_number_key15; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tickets
    ADD CONSTRAINT tickets_ticket_number_key15 UNIQUE (ticket_number);


--
-- Name: tickets tickets_ticket_number_key16; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tickets
    ADD CONSTRAINT tickets_ticket_number_key16 UNIQUE (ticket_number);


--
-- Name: tickets tickets_ticket_number_key17; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tickets
    ADD CONSTRAINT tickets_ticket_number_key17 UNIQUE (ticket_number);


--
-- Name: tickets tickets_ticket_number_key18; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tickets
    ADD CONSTRAINT tickets_ticket_number_key18 UNIQUE (ticket_number);


--
-- Name: tickets tickets_ticket_number_key19; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tickets
    ADD CONSTRAINT tickets_ticket_number_key19 UNIQUE (ticket_number);


--
-- Name: tickets tickets_ticket_number_key2; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tickets
    ADD CONSTRAINT tickets_ticket_number_key2 UNIQUE (ticket_number);


--
-- Name: tickets tickets_ticket_number_key20; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tickets
    ADD CONSTRAINT tickets_ticket_number_key20 UNIQUE (ticket_number);


--
-- Name: tickets tickets_ticket_number_key21; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tickets
    ADD CONSTRAINT tickets_ticket_number_key21 UNIQUE (ticket_number);


--
-- Name: tickets tickets_ticket_number_key22; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tickets
    ADD CONSTRAINT tickets_ticket_number_key22 UNIQUE (ticket_number);


--
-- Name: tickets tickets_ticket_number_key23; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tickets
    ADD CONSTRAINT tickets_ticket_number_key23 UNIQUE (ticket_number);


--
-- Name: tickets tickets_ticket_number_key24; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tickets
    ADD CONSTRAINT tickets_ticket_number_key24 UNIQUE (ticket_number);


--
-- Name: tickets tickets_ticket_number_key25; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tickets
    ADD CONSTRAINT tickets_ticket_number_key25 UNIQUE (ticket_number);


--
-- Name: tickets tickets_ticket_number_key26; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tickets
    ADD CONSTRAINT tickets_ticket_number_key26 UNIQUE (ticket_number);


--
-- Name: tickets tickets_ticket_number_key27; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tickets
    ADD CONSTRAINT tickets_ticket_number_key27 UNIQUE (ticket_number);


--
-- Name: tickets tickets_ticket_number_key28; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tickets
    ADD CONSTRAINT tickets_ticket_number_key28 UNIQUE (ticket_number);


--
-- Name: tickets tickets_ticket_number_key3; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tickets
    ADD CONSTRAINT tickets_ticket_number_key3 UNIQUE (ticket_number);


--
-- Name: tickets tickets_ticket_number_key4; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tickets
    ADD CONSTRAINT tickets_ticket_number_key4 UNIQUE (ticket_number);


--
-- Name: tickets tickets_ticket_number_key5; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tickets
    ADD CONSTRAINT tickets_ticket_number_key5 UNIQUE (ticket_number);


--
-- Name: tickets tickets_ticket_number_key6; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tickets
    ADD CONSTRAINT tickets_ticket_number_key6 UNIQUE (ticket_number);


--
-- Name: tickets tickets_ticket_number_key7; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tickets
    ADD CONSTRAINT tickets_ticket_number_key7 UNIQUE (ticket_number);


--
-- Name: tickets tickets_ticket_number_key8; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tickets
    ADD CONSTRAINT tickets_ticket_number_key8 UNIQUE (ticket_number);


--
-- Name: tickets tickets_ticket_number_key9; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tickets
    ADD CONSTRAINT tickets_ticket_number_key9 UNIQUE (ticket_number);


--
-- Name: unique_visitors unique_visitors_ip_hash_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.unique_visitors
    ADD CONSTRAINT unique_visitors_ip_hash_key UNIQUE (ip_hash);


--
-- Name: unique_visitors unique_visitors_ip_hash_key1; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.unique_visitors
    ADD CONSTRAINT unique_visitors_ip_hash_key1 UNIQUE (ip_hash);


--
-- Name: unique_visitors unique_visitors_ip_hash_key10; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.unique_visitors
    ADD CONSTRAINT unique_visitors_ip_hash_key10 UNIQUE (ip_hash);


--
-- Name: unique_visitors unique_visitors_ip_hash_key11; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.unique_visitors
    ADD CONSTRAINT unique_visitors_ip_hash_key11 UNIQUE (ip_hash);


--
-- Name: unique_visitors unique_visitors_ip_hash_key12; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.unique_visitors
    ADD CONSTRAINT unique_visitors_ip_hash_key12 UNIQUE (ip_hash);


--
-- Name: unique_visitors unique_visitors_ip_hash_key13; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.unique_visitors
    ADD CONSTRAINT unique_visitors_ip_hash_key13 UNIQUE (ip_hash);


--
-- Name: unique_visitors unique_visitors_ip_hash_key14; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.unique_visitors
    ADD CONSTRAINT unique_visitors_ip_hash_key14 UNIQUE (ip_hash);


--
-- Name: unique_visitors unique_visitors_ip_hash_key15; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.unique_visitors
    ADD CONSTRAINT unique_visitors_ip_hash_key15 UNIQUE (ip_hash);


--
-- Name: unique_visitors unique_visitors_ip_hash_key16; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.unique_visitors
    ADD CONSTRAINT unique_visitors_ip_hash_key16 UNIQUE (ip_hash);


--
-- Name: unique_visitors unique_visitors_ip_hash_key17; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.unique_visitors
    ADD CONSTRAINT unique_visitors_ip_hash_key17 UNIQUE (ip_hash);


--
-- Name: unique_visitors unique_visitors_ip_hash_key18; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.unique_visitors
    ADD CONSTRAINT unique_visitors_ip_hash_key18 UNIQUE (ip_hash);


--
-- Name: unique_visitors unique_visitors_ip_hash_key19; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.unique_visitors
    ADD CONSTRAINT unique_visitors_ip_hash_key19 UNIQUE (ip_hash);


--
-- Name: unique_visitors unique_visitors_ip_hash_key2; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.unique_visitors
    ADD CONSTRAINT unique_visitors_ip_hash_key2 UNIQUE (ip_hash);


--
-- Name: unique_visitors unique_visitors_ip_hash_key20; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.unique_visitors
    ADD CONSTRAINT unique_visitors_ip_hash_key20 UNIQUE (ip_hash);


--
-- Name: unique_visitors unique_visitors_ip_hash_key21; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.unique_visitors
    ADD CONSTRAINT unique_visitors_ip_hash_key21 UNIQUE (ip_hash);


--
-- Name: unique_visitors unique_visitors_ip_hash_key22; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.unique_visitors
    ADD CONSTRAINT unique_visitors_ip_hash_key22 UNIQUE (ip_hash);


--
-- Name: unique_visitors unique_visitors_ip_hash_key23; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.unique_visitors
    ADD CONSTRAINT unique_visitors_ip_hash_key23 UNIQUE (ip_hash);


--
-- Name: unique_visitors unique_visitors_ip_hash_key24; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.unique_visitors
    ADD CONSTRAINT unique_visitors_ip_hash_key24 UNIQUE (ip_hash);


--
-- Name: unique_visitors unique_visitors_ip_hash_key25; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.unique_visitors
    ADD CONSTRAINT unique_visitors_ip_hash_key25 UNIQUE (ip_hash);


--
-- Name: unique_visitors unique_visitors_ip_hash_key26; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.unique_visitors
    ADD CONSTRAINT unique_visitors_ip_hash_key26 UNIQUE (ip_hash);


--
-- Name: unique_visitors unique_visitors_ip_hash_key27; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.unique_visitors
    ADD CONSTRAINT unique_visitors_ip_hash_key27 UNIQUE (ip_hash);


--
-- Name: unique_visitors unique_visitors_ip_hash_key28; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.unique_visitors
    ADD CONSTRAINT unique_visitors_ip_hash_key28 UNIQUE (ip_hash);


--
-- Name: unique_visitors unique_visitors_ip_hash_key3; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.unique_visitors
    ADD CONSTRAINT unique_visitors_ip_hash_key3 UNIQUE (ip_hash);


--
-- Name: unique_visitors unique_visitors_ip_hash_key4; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.unique_visitors
    ADD CONSTRAINT unique_visitors_ip_hash_key4 UNIQUE (ip_hash);


--
-- Name: unique_visitors unique_visitors_ip_hash_key5; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.unique_visitors
    ADD CONSTRAINT unique_visitors_ip_hash_key5 UNIQUE (ip_hash);


--
-- Name: unique_visitors unique_visitors_ip_hash_key6; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.unique_visitors
    ADD CONSTRAINT unique_visitors_ip_hash_key6 UNIQUE (ip_hash);


--
-- Name: unique_visitors unique_visitors_ip_hash_key7; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.unique_visitors
    ADD CONSTRAINT unique_visitors_ip_hash_key7 UNIQUE (ip_hash);


--
-- Name: unique_visitors unique_visitors_ip_hash_key8; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.unique_visitors
    ADD CONSTRAINT unique_visitors_ip_hash_key8 UNIQUE (ip_hash);


--
-- Name: unique_visitors unique_visitors_ip_hash_key9; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.unique_visitors
    ADD CONSTRAINT unique_visitors_ip_hash_key9 UNIQUE (ip_hash);


--
-- Name: unique_visitors unique_visitors_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.unique_visitors
    ADD CONSTRAINT unique_visitors_pkey PRIMARY KEY (id);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_email_key1; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key1 UNIQUE (email);


--
-- Name: users users_email_key10; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key10 UNIQUE (email);


--
-- Name: users users_email_key11; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key11 UNIQUE (email);


--
-- Name: users users_email_key12; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key12 UNIQUE (email);


--
-- Name: users users_email_key13; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key13 UNIQUE (email);


--
-- Name: users users_email_key14; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key14 UNIQUE (email);


--
-- Name: users users_email_key15; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key15 UNIQUE (email);


--
-- Name: users users_email_key16; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key16 UNIQUE (email);


--
-- Name: users users_email_key17; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key17 UNIQUE (email);


--
-- Name: users users_email_key18; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key18 UNIQUE (email);


--
-- Name: users users_email_key19; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key19 UNIQUE (email);


--
-- Name: users users_email_key2; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key2 UNIQUE (email);


--
-- Name: users users_email_key20; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key20 UNIQUE (email);


--
-- Name: users users_email_key21; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key21 UNIQUE (email);


--
-- Name: users users_email_key22; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key22 UNIQUE (email);


--
-- Name: users users_email_key23; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key23 UNIQUE (email);


--
-- Name: users users_email_key24; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key24 UNIQUE (email);


--
-- Name: users users_email_key25; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key25 UNIQUE (email);


--
-- Name: users users_email_key26; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key26 UNIQUE (email);


--
-- Name: users users_email_key27; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key27 UNIQUE (email);


--
-- Name: users users_email_key28; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key28 UNIQUE (email);


--
-- Name: users users_email_key29; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key29 UNIQUE (email);


--
-- Name: users users_email_key3; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key3 UNIQUE (email);


--
-- Name: users users_email_key30; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key30 UNIQUE (email);


--
-- Name: users users_email_key4; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key4 UNIQUE (email);


--
-- Name: users users_email_key5; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key5 UNIQUE (email);


--
-- Name: users users_email_key6; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key6 UNIQUE (email);


--
-- Name: users users_email_key7; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key7 UNIQUE (email);


--
-- Name: users users_email_key8; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key8 UNIQUE (email);


--
-- Name: users users_email_key9; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key9 UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: visits visits_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.visits
    ADD CONSTRAINT visits_pkey PRIMARY KEY (id);


--
-- Name: activity_logs_created_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX activity_logs_created_at ON public.activity_logs USING btree (created_at);


--
-- Name: activity_logs_entity_type_entity_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX activity_logs_entity_type_entity_id ON public.activity_logs USING btree (entity_type, entity_id);


--
-- Name: activity_logs_permission; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX activity_logs_permission ON public.activity_logs USING btree (permission);


--
-- Name: activity_logs_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX activity_logs_user_id ON public.activity_logs USING btree (user_id);


--
-- Name: donations_email; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX donations_email ON public.donations USING btree (email);


--
-- Name: donations_payment_status; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX donations_payment_status ON public.donations USING btree (payment_status);


--
-- Name: unique_visitors_ip_hash; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX unique_visitors_ip_hash ON public."UniqueVisitors" USING btree ("ipHash");


--
-- Name: unique_visitors_last_visited_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX unique_visitors_last_visited_at ON public."UniqueVisitors" USING btree ("lastVisitedAt");


--
-- Name: action_logs action_logs_reservation_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.action_logs
    ADD CONSTRAINT action_logs_reservation_id_fkey FOREIGN KEY (reservation_id) REFERENCES public.reservations(id) ON UPDATE CASCADE;


--
-- Name: action_logs action_logs_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.action_logs
    ADD CONSTRAINT action_logs_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE;


--
-- Name: activity_logs activity_logs_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.activity_logs
    ADD CONSTRAINT activity_logs_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE;


--
-- Name: participants participants_reservation_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.participants
    ADD CONSTRAINT participants_reservation_id_fkey FOREIGN KEY (reservation_id) REFERENCES public.reservations(id) ON UPDATE CASCADE;


--
-- Name: participants participants_ticket_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.participants
    ADD CONSTRAINT participants_ticket_id_fkey FOREIGN KEY (ticket_id) REFERENCES public.tickets(id) ON UPDATE CASCADE;


--
-- Name: payments payments_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(id) ON UPDATE CASCADE;


--
-- Name: payments payments_reservation_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_reservation_id_fkey FOREIGN KEY (reservation_id) REFERENCES public.reservations(id) ON UPDATE CASCADE;


--
-- Name: reservations reservations_pack_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.reservations
    ADD CONSTRAINT reservations_pack_id_fkey FOREIGN KEY (pack_id) REFERENCES public.packs(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: tickets tickets_generated_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tickets
    ADD CONSTRAINT tickets_generated_by_fkey FOREIGN KEY (generated_by) REFERENCES public.users(id) ON UPDATE CASCADE;


--
-- Name: tickets tickets_reservation_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tickets
    ADD CONSTRAINT tickets_reservation_id_fkey FOREIGN KEY (reservation_id) REFERENCES public.reservations(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: users users_role_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_role_id_fkey FOREIGN KEY (role_id) REFERENCES public.roles(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- PostgreSQL database dump complete
--

