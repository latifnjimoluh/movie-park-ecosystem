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

COMMENT ON COLUMN public.activity_logs.permission IS 'Permission utilis├®e pour cette action (ex: packs.create)';


--
-- Name: COLUMN activity_logs.entity_type; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.activity_logs.entity_type IS 'Type d''entit├® affect├®e';


--
-- Name: COLUMN activity_logs.entity_id; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.activity_logs.entity_id IS 'ID de l''entit├® affect├®e';


--
-- Name: COLUMN activity_logs.action; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.activity_logs.action IS 'Type d''action effectu├®e';


--
-- Name: COLUMN activity_logs.description; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.activity_logs.description IS 'Description lisible de l''action';


--
-- Name: COLUMN activity_logs.changes; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.activity_logs.changes IS 'D├®tails des changements effectu├®s';


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

COMMENT ON COLUMN public.donations.donor_name IS 'Nom du donateur (optionnel ÔÇö don anonyme autoris├®)';


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

COMMENT ON COLUMN public.donations.transaction_id IS 'R├®f├®rence de transaction Mobile Money';


--
-- Name: COLUMN donations.proof_url; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.donations.proof_url IS 'URL de la preuve de paiement (image/PDF upload├® par l''admin)';


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

COMMENT ON COLUMN public.event_config.key IS 'Cl├® unique ex: edition_label, location_lat';


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

COMMENT ON COLUMN public.films.image_url IS 'Chemin de l''image upload├®e localement';


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

COMMENT ON COLUMN public.roles.name IS 'Nom technique du r├┤le (ex: superadmin, cashier)';


--
-- Name: COLUMN roles.label; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.roles.label IS 'Nom affich├® (ex: Administrateur Principal)';


--
-- Name: COLUMN roles.permissions; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.roles.permissions IS 'Liste des permissions [reservations.view, ...]';


--
-- Name: COLUMN roles.is_system; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.roles.is_system IS 'Si vrai, le r├┤le ne peut pas ├¬tre supprim├®';


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

COMMENT ON COLUMN public.testimonials.pack_name IS 'Nom du pack achet├® ex: Pack VIP';


--
-- Name: COLUMN testimonials.edition; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.testimonials.edition IS '├ëdition ex: Decembre 2024';


--
-- Name: COLUMN testimonials.photo_url; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.testimonials.photo_url IS 'Chemin vers la photo du participant';


--
-- Name: COLUMN testimonials.image_url; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.testimonials.image_url IS 'Chemin de l''image upload├®e localement';


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
-- Data for Name: SequelizeMeta; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public."SequelizeMeta" (name) VALUES ('20250107-create-unique-visitors.js');
INSERT INTO public."SequelizeMeta" (name) VALUES ('20250107-create-visits.js');
INSERT INTO public."SequelizeMeta" (name) VALUES ('20260403-create-donations.js');
INSERT INTO public."SequelizeMeta" (name) VALUES ('20260404-add-proof-url-to-donations.js');


--
-- Data for Name: UniqueVisitors; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- Data for Name: Visits; Type: TABLE DATA; Schema: public; Owner: -
--



--
-- Data for Name: daily_visits; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.daily_visits (id, visit_date, total_visits, unique_visitors, created_at, updated_at) VALUES ('8090c3d7-1ae4-4fa0-98bd-7cf533c32d16', '2025-12-10', 102, 0, '2025-12-10 07:21:13.02+01', '2025-12-10 23:39:36.201+01');
INSERT INTO public.daily_visits (id, visit_date, total_visits, unique_visitors, created_at, updated_at) VALUES ('ee411d0b-f61f-4cef-9808-a40461f1d714', '2025-12-07', 214, 0, '2025-12-07 13:49:25.493+01', '2025-12-08 00:48:54.076+01');
INSERT INTO public.daily_visits (id, visit_date, total_visits, unique_visitors, created_at, updated_at) VALUES ('afd5b404-a5dd-4bc3-b3b9-2b2c90d67af6', '2025-12-09', 129, 0, '2025-12-09 01:00:08.932+01', '2025-12-10 00:45:08.433+01');
INSERT INTO public.daily_visits (id, visit_date, total_visits, unique_visitors, created_at, updated_at) VALUES ('7c35b4a0-b11d-43c1-9828-10f993662428', '2025-12-18', 13, 1, '2025-12-18 02:28:37.836+01', '2025-12-18 10:27:11.867+01');
INSERT INTO public.daily_visits (id, visit_date, total_visits, unique_visitors, created_at, updated_at) VALUES ('243d2d4a-0e10-4b65-94ba-e90c2db18681', '2025-12-13', 95, 0, '2025-12-13 07:25:04.329+01', '2025-12-14 00:27:23.737+01');
INSERT INTO public.daily_visits (id, visit_date, total_visits, unique_visitors, created_at, updated_at) VALUES ('9aa4e908-714d-46e3-a662-820a516e0519', '2025-12-08', 181, 0, '2025-12-08 01:44:59.878+01', '2025-12-09 00:59:20.761+01');
INSERT INTO public.daily_visits (id, visit_date, total_visits, unique_visitors, created_at, updated_at) VALUES ('3842659a-7adb-4c70-b229-eb4378e41014', '2025-12-12', 44, 0, '2025-12-12 01:52:49.252+01', '2025-12-13 00:53:02.6+01');
INSERT INTO public.daily_visits (id, visit_date, total_visits, unique_visitors, created_at, updated_at) VALUES ('92240a87-8b74-4659-9bcd-d0e5725baf1b', '2025-12-15', 103, 1, '2025-12-15 01:28:19.076+01', '2025-12-16 00:26:17.573+01');
INSERT INTO public.daily_visits (id, visit_date, total_visits, unique_visitors, created_at, updated_at) VALUES ('ea104bbe-88c8-4d34-8063-75bc2067aada', '2025-12-14', 115, 1, '2025-12-14 01:32:30.791+01', '2025-12-15 00:49:28.774+01');
INSERT INTO public.daily_visits (id, visit_date, total_visits, unique_visitors, created_at, updated_at) VALUES ('37cd0886-b970-495b-ae7d-375fe0ece687', '2025-12-11', 37, 0, '2025-12-11 01:04:30.457+01', '2025-12-12 00:48:03.981+01');
INSERT INTO public.daily_visits (id, visit_date, total_visits, unique_visitors, created_at, updated_at) VALUES ('3c9cd922-d01a-4e5b-b84b-25d06e815f94', '2025-12-16', 71, 0, '2025-12-16 03:12:48.864+01', '2025-12-17 00:19:27+01');
INSERT INTO public.daily_visits (id, visit_date, total_visits, unique_visitors, created_at, updated_at) VALUES ('b6b6de82-12d4-495e-a446-54357cd0da36', '2025-12-17', 56, 0, '2025-12-17 01:13:39.636+01', '2025-12-18 00:39:54.856+01');
INSERT INTO public.daily_visits (id, visit_date, total_visits, unique_visitors, created_at, updated_at) VALUES ('e1254e18-2597-4836-8b67-51917e378999', '2025-12-21', 3, 1, '2025-12-21 15:32:34.68+01', '2025-12-21 15:42:16.318+01');
INSERT INTO public.daily_visits (id, visit_date, total_visits, unique_visitors, created_at, updated_at) VALUES ('4761e1da-2e43-48a0-a633-b578bd25a51c', '2026-03-24', 47, 0, '2026-03-24 02:42:00.516+01', '2026-03-24 12:29:08.692+01');
INSERT INTO public.daily_visits (id, visit_date, total_visits, unique_visitors, created_at, updated_at) VALUES ('263f6a7e-d845-40ad-90f1-fe81a7f9ee50', '2026-04-03', 6, 0, '2026-04-03 22:11:01.922+01', '2026-04-04 00:51:55.599+01');
INSERT INTO public.daily_visits (id, visit_date, total_visits, unique_visitors, created_at, updated_at) VALUES ('8045aec2-d15b-48bb-992e-057b73482204', '2026-04-04', 1, 0, '2026-04-04 01:24:38.253+01', '2026-04-04 01:24:38.254+01');


--
-- Data for Name: event_config; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.event_config (id, key, value, type, label, "group", "createdAt", "updatedAt") VALUES ('06a19e70-aab5-4ed7-a3b2-ec00b7511300', 'tagline', 'Une soir├®e cin├®ma unique, sous les ├®toiles de Yaound├®.', 'text', 'Tagline principale', 'hero', '2026-03-24 08:00:24.532+01', '2026-03-24 08:00:24.532+01');
INSERT INTO public.event_config (id, key, value, type, label, "group", "createdAt", "updatedAt") VALUES ('9ef394fd-05d0-480a-a50a-27b215cb7569', 'subtitle', 'Ambiance ┬À Films ┬À Exp├®rience Printani├¿re', 'text', 'Sous-tagline', 'hero', '2026-03-24 08:00:24.536+01', '2026-03-24 08:00:24.536+01');
INSERT INTO public.event_config (id, key, value, type, label, "group", "createdAt", "updatedAt") VALUES ('0117990a-da9c-4561-97f8-de1f20a4517d', 'social_proof', '­ƒÄƒ´©Å Plus de 100 participants lors de la derni├¿re ├®dition', 'text', 'Preuve sociale', 'hero', '2026-03-24 08:00:24.541+01', '2026-03-24 08:00:24.541+01');
INSERT INTO public.event_config (id, key, value, type, label, "group", "createdAt", "updatedAt") VALUES ('cd808a75-919b-4ec2-ae27-2710393ff6fc', 'particle_symbols', '["­ƒî©","­ƒî╝","­ƒî┐","­ƒî║","­ƒÑÜ","Ô£¿","­ƒî▒","­ƒÉú"]', 'json', 'Symboles particules', 'hero', '2026-03-24 08:00:24.544+01', '2026-03-24 08:00:24.544+01');
INSERT INTO public.event_config (id, key, value, type, label, "group", "createdAt", "updatedAt") VALUES ('052fa75f-a8b2-4653-9301-767835f0d5b3', 'location_lat', '3.876146', 'number', 'Latitude GPS', 'location', '2026-03-24 08:00:24.549+01', '2026-03-24 08:00:24.549+01');
INSERT INTO public.event_config (id, key, value, type, label, "group", "createdAt", "updatedAt") VALUES ('288a8cf0-6c27-4dc6-b9f2-77cc1e69d794', 'location_lng', '11.518691', 'number', 'Longitude GPS', 'location', '2026-03-24 08:00:24.553+01', '2026-03-24 08:00:24.553+01');
INSERT INTO public.event_config (id, key, value, type, label, "group", "createdAt", "updatedAt") VALUES ('66cfb015-ca33-4274-837d-795b16bf6344', 'films_badge', '­ƒÄ¼ Programme P├óques 2026', 'text', 'Badge section Films', 'films', '2026-03-24 08:00:24.558+01', '2026-03-24 08:00:24.558+01');
INSERT INTO public.event_config (id, key, value, type, label, "group", "createdAt", "updatedAt") VALUES ('ee40c6c0-6c14-471e-99c5-193ccac8a197', 'films_description', 'Deux films soigneusement s├®lectionn├®s pour une soir├®e inoubliable.', 'text', 'Description section Films', 'films', '2026-03-24 08:00:24.562+01', '2026-03-24 08:00:24.562+01');
INSERT INTO public.event_config (id, key, value, type, label, "group", "createdAt", "updatedAt") VALUES ('109af107-e99c-45cd-a58b-c821bf0180d7', 'pricing_badge', '­ƒÄƒ´©Å Choisissez votre exp├®rience', 'text', 'Badge section Tarifs', 'pricing', '2026-03-24 08:00:24.565+01', '2026-03-24 08:00:24.565+01');
INSERT INTO public.event_config (id, key, value, type, label, "group", "createdAt", "updatedAt") VALUES ('ed15c2c2-79fa-4872-b87a-c09e410d5345', 'contact_phone', '+237 697 30 44 50', 'text', 'T├®l├®phone affich├®', 'contact', '2026-03-24 08:00:24.569+01', '2026-03-24 08:00:24.569+01');
INSERT INTO public.event_config (id, key, value, type, label, "group", "createdAt", "updatedAt") VALUES ('26af3938-edf5-42ec-8d02-8815e54a0224', 'contact_email', 'matangabrooklyn@gmail.com', 'text', 'Email affich├®', 'contact', '2026-03-24 08:00:24.577+01', '2026-03-24 08:00:24.577+01');
INSERT INTO public.event_config (id, key, value, type, label, "group", "createdAt", "updatedAt") VALUES ('dcdf42a0-7a0f-4f2e-a77e-bfba4973770a', 'contact_whatsapp', '237697304450', 'text', 'Num├®ro WhatsApp', 'contact', '2026-03-24 08:00:24.58+01', '2026-03-24 08:00:24.58+01');
INSERT INTO public.event_config (id, key, value, type, label, "group", "createdAt", "updatedAt") VALUES ('266afccf-8af7-4193-90a9-ae904b876c71', 'edition_label', '­ƒÉú ├ëdition P├óques 2026', 'text', 'Badge ├®dition', 'hero', '2026-03-24 08:00:24.479+01', '2026-03-24 08:11:55.13+01');


--
-- Data for Name: films; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.films (id, title_fr, title_en, genre_fr, genre_en, year, country_fr, country_en, duration, synopsis_fr, synopsis_en, classification_fr, classification_en, poster_url, youtube_url, screening_time, display_order, is_active, "createdAt", "updatedAt", image_url) VALUES ('7b3176ff-93a3-4d30-9e0e-e4bc0f7bd895', 'Saw IV (2007)', 'Saw IV (2007)', 'Horreur, Thriller, Myst├¿re', 'Horror, Thriller, Mystery', '2007', 'Royaume-Uni | ├ëtats-Unis | Canada', 'United Kingdom | United States | Canada', '93 min', 'Alors que le tueur au puzzle Jigsaw semble avoir disparu, une nouvelle s├®rie de jeux macabres d├®bute. L''enqu├¬te plonge au c┼ôur d''un r├®seau complexe de choix moraux, de pi├¿ges redoutables et de r├®v├®lations sombres, o├╣ chaque d├®cision peut co├╗ter la vie.', 'As the Jigsaw killer appears to have died, a new series of macabre traps begins. The investigation dives into a complex web of moral choices, deadly traps and dark revelations, where every decision can cost a life.', 'Interdit aux moins de 18 ans', '18+', '/saw.jpeg', '#', '22h00', 1, true, '2026-03-24 08:00:24.439+01', '2026-03-24 08:14:02.223+01', NULL);
INSERT INTO public.films (id, title_fr, title_en, genre_fr, genre_en, year, country_fr, country_en, duration, synopsis_fr, synopsis_en, classification_fr, classification_en, poster_url, youtube_url, screening_time, display_order, is_active, "createdAt", "updatedAt", image_url) VALUES ('e7a4815c-bf2c-4046-bc5f-c73c0e2a8f8f', 'Zootopie 2 (2025)', 'Zootopia 2 (2025)', 'Famille, Animation, Com├®die, Aventure', 'Family, Animation, Comedy, Adventure', '2025', '├ëtats-Unis', 'United States', '115 min', 'Dans cette suite tr├¿s attendue, Judy Hopps et Nick Wilde reprennent du service pour faire face ├á une nouvelle affaire qui menace l''├®quilibre de la ville de Zootopie. Entre enqu├¬tes, humour et messages forts sur la tol├®rance et le vivre-ensemble, le duo devra une fois de plus prouver que les diff├®rences sont une force.', 'In this long-awaited sequel, Judy Hopps and Nick Wilde are back on the case to face a new threat to the balance of Zootopia. Between investigations, humor and strong messages about tolerance, the duo must once again prove that differences are a strength.', 'Tout public', 'All audiences', '/zootopie.jpeg', '#', '18h30', 0, true, '2026-03-24 08:00:24.439+01', '2026-03-24 12:27:59.298+01', '/uploads/films/film-1774351679288-777872502.jpeg');


--
-- Data for Name: packs; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.packs (id, name, price, description, capacity, is_active, "createdAt", "updatedAt") VALUES ('b8249ec2-993a-4140-902b-6bfad049a1b6', 'COUPLE', 8000, 'Pack Couple', 2, true, '2025-12-04 21:19:42.967+01', '2025-12-05 00:48:34.803+01');
INSERT INTO public.packs (id, name, price, description, capacity, is_active, "createdAt", "updatedAt") VALUES ('b62e0c02-e4ff-4e86-8c46-ed7e6acc9eb8', 'VIP', 5000, 'Pack VIP', 1, true, '2025-12-04 21:19:21.066+01', '2025-12-05 00:48:46.277+01');
INSERT INTO public.packs (id, name, price, description, capacity, is_active, "createdAt", "updatedAt") VALUES ('7c209804-be05-48dc-b14d-4d8bf63c19df', 'SIMPLE', 3000, 'Pack Simple', 1, true, '2025-12-04 21:16:48.675+01', '2025-12-05 00:48:56.614+01');
INSERT INTO public.packs (id, name, price, description, capacity, is_active, "createdAt", "updatedAt") VALUES ('acce7b77-3f10-480f-8ec0-5ef0256b01db', 'STAND', 20000, 'Pack stand', 3, true, '2025-12-15 21:34:42.232+01', '2025-12-15 21:34:42.232+01');
INSERT INTO public.packs (id, name, price, description, capacity, is_active, "createdAt", "updatedAt") VALUES ('d90648b7-1afb-4d0d-91c7-3eaf0ddb40c3', 'FAMILLE', 10000, 'Pack Famille ', 5, true, '2025-12-04 21:20:55.144+01', '2026-03-24 10:24:52.691+01');


--
-- Data for Name: roles; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.roles (id, name, label, description, permissions, is_system, "createdAt", "updatedAt") VALUES ('f0830051-4319-49ee-b7c6-837c9bfbf27c', 'superadmin', 'Super Administrateur', NULL, '["reservations.view","reservations.view.all","reservations.create","reservations.edit","reservations.edit.status","reservations.delete","reservations.export","reservations.statistics","payments.view","payments.view.all","payments.create","payments.edit","payments.delete","payments.export","payments.approve","payments.statistics","tickets.view","tickets.view.all","tickets.create","tickets.generate","tickets.download","tickets.preview","scan.validate","scan.decode","scan.search","scan.statistics","packs.view","packs.view.all","packs.create","packs.edit","packs.delete","users.view","users.view.all","users.create","users.edit","users.manage_permissions","audit.view.all","content.view","content.create","content.edit","content.delete"]', true, '2026-03-24 11:12:15.428+01', '2026-03-24 11:12:15.428+01');
INSERT INTO public.roles (id, name, label, description, permissions, is_system, "createdAt", "updatedAt") VALUES ('6433f342-11e6-4ea4-a686-13b80098fcd2', 'cashier', 'Caissier / Vendeur', NULL, '["reservations.view","reservations.create","reservations.edit","payments.view","payments.create","tickets.view","tickets.download","tickets.preview","packs.view"]', true, '2026-03-24 11:12:15.49+01', '2026-03-24 11:12:15.49+01');
INSERT INTO public.roles (id, name, label, description, permissions, is_system, "createdAt", "updatedAt") VALUES ('42bf2da9-5e64-4a55-be3a-46631cbb1a62', 'scanner', 'Contr├┤leur Entr├®e', NULL, '["tickets.view","scan.validate","scan.decode","scan.search"]', true, '2026-03-24 11:12:15.495+01', '2026-03-24 11:12:15.495+01');
INSERT INTO public.roles (id, name, label, description, permissions, is_system, "createdAt", "updatedAt") VALUES ('4f2a6b8b-ac1a-46fe-a360-c466448bdb3e', 'admin', 'Administrateur', NULL, '["reservations.view","reservations.view.all","reservations.create","reservations.edit","reservations.export","reservations.statistics","payments.view","payments.view.all","payments.create","payments.approve","tickets.view","tickets.view.all","tickets.generate","tickets.download","tickets.preview","scan.validate","scan.decode","scan.search","packs.view","packs.view.all","packs.create","packs.edit","users.view","users.view.all","content.view","content.edit","content.create","content.delete"]', true, '2026-03-24 11:12:15.486+01', '2026-03-24 11:21:49.228+01');


--
-- Data for Name: schedule_items; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.schedule_items (id, "time", title_fr, title_en, description_fr, description_en, is_surprise, is_after, is_teaser, display_order, is_active, "createdAt", "updatedAt") VALUES ('2e5421a3-3b02-4c09-9298-221c60d57041', '13h00 - 18h00', 'Activit├®s & Animations', 'Activities & Entertainment', 'Jeux vid├®o, jeux de soci├®t├®, challenges, mini-tournages vid├®o, photobooth, DJ zone', 'Video games, board games, challenges, mini-video shoots, photobooth, DJ zone', false, false, false, 0, true, '2026-03-24 08:00:24.456+01', '2026-03-24 08:00:24.456+01');
INSERT INTO public.schedule_items (id, "time", title_fr, title_en, description_fr, description_en, is_surprise, is_after, is_teaser, display_order, is_active, "createdAt", "updatedAt") VALUES ('5ff7dd76-37e4-4c7a-9aae-e602827ccc68', '18h00', 'Ouverture des portes', 'Doors Open', 'Accueil du public et installation', 'Welcome and seating', false, false, false, 1, true, '2026-03-24 08:00:24.456+01', '2026-03-24 08:00:24.456+01');
INSERT INTO public.schedule_items (id, "time", title_fr, title_en, description_fr, description_en, is_surprise, is_after, is_teaser, display_order, is_active, "createdAt", "updatedAt") VALUES ('e5d8bc44-d534-48af-9c92-79c4cee5f18c', '18h30', 'Premier Film', 'First Film', 'Zootopie 2 (2025) - Installation du public d├¿s 18h00', 'Zootopia 2 (2025) - Seating from 18h00', false, false, false, 2, true, '2026-03-24 08:00:24.456+01', '2026-03-24 08:00:24.456+01');
INSERT INTO public.schedule_items (id, "time", title_fr, title_en, description_fr, description_en, is_surprise, is_after, is_teaser, display_order, is_active, "createdAt", "updatedAt") VALUES ('a2c32acd-dc38-40d4-8d56-0256c075446a', '21h00', 'Pause & Animations', 'Break & Entertainment', 'Repas, photobooth, mini-concours et rafra├«chissements', 'Food, photobooth, mini-contest and refreshments', false, false, false, 3, true, '2026-03-24 08:00:24.456+01', '2026-03-24 08:00:24.456+01');
INSERT INTO public.schedule_items (id, "time", title_fr, title_en, description_fr, description_en, is_surprise, is_after, is_teaser, display_order, is_active, "createdAt", "updatedAt") VALUES ('bd7c82de-da79-473f-9ea3-214d20435aa4', '22h00', 'Deuxi├¿me Film', 'Second Film', 'Saw IV ÔÇô s├®ance nocturne', 'Saw IV ÔÇô night screening', true, true, true, 4, true, '2026-03-24 08:00:24.456+01', '2026-03-24 08:00:24.456+01');
INSERT INTO public.schedule_items (id, "time", title_fr, title_en, description_fr, description_en, is_surprise, is_after, is_teaser, display_order, is_active, "createdAt", "updatedAt") VALUES ('73b8b18b-b21e-439d-b508-f195f906e393', '00h00+', 'Cl├┤ture', 'Closing', 'Fin de l''├®v├®nement', 'End of event', false, false, false, 5, true, '2026-03-24 08:00:24.456+01', '2026-03-24 08:00:24.456+01');


--
-- Data for Name: testimonials; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.testimonials (id, quote_fr, quote_en, author, pack_name, edition, photo_url, rating, is_active, display_order, "createdAt", "updatedAt", image_url) VALUES ('4b458033-6d56-4dfc-b383-aabf2f63601b', 'Le concept est g├®nial. Entre le DJ set, les films et l''ambiance conviviale, c''├®tait une soir├®e parfaite. Le pack VIP vaut vraiment le coup !', 'The concept is brilliant. Between the DJ set, the films and the friendly atmosphere, it was a perfect evening. The VIP pack is really worth it!', 'Dorian', 'Pack VIP', 'Decembre 2024', '/dorian.jpg', 5, true, 1, '2026-03-24 08:00:24.466+01', '2026-03-24 08:00:24.466+01', NULL);
INSERT INTO public.testimonials (id, quote_fr, quote_en, author, pack_name, edition, photo_url, rating, is_active, display_order, "createdAt", "updatedAt", image_url) VALUES ('9aa820ad-d671-40d8-8f66-4323b974d22a', 'Date night parfaite ! Le pack Couple avec le matelas double et la photo souvenir a rendu notre soir├®e encore plus sp├®ciale. ├Ç refaire absolument.', 'Perfect date night! The Couple pack with the double mattress and souvenir photo made our evening even more special. Definitely doing it again.', 'Sammy', 'Pack Couple', 'Decembre 2024', '/sammy.jpg', 5, true, 2, '2026-03-24 08:00:24.466+01', '2026-03-24 08:00:24.466+01', NULL);
INSERT INTO public.testimonials (id, quote_fr, quote_en, author, pack_name, edition, photo_url, rating, is_active, display_order, "createdAt", "updatedAt", image_url) VALUES ('5bb98428-6341-4296-b86a-26c8887317a0', 'Une exp├®rience magique ! L''organisation ├®tait impeccable, l''ambiance chaleureuse, et les films excellents. Nous reviendrons avec plaisir pour la prochaine ├®dition.', 'A magical experience! The organization was impeccable, the atmosphere warm, and the films excellent. We will definitely come back for the next edition.', 'Brooklyn', 'Pack Famille', 'Decembre 2024', '/man-profile.jpg', 5, true, 0, '2026-03-24 08:00:24.466+01', '2026-03-24 12:23:39.105+01', '/uploads/testimonials/avatar-1774351419091-541791766.png');


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.users (id, email, password_hash, name, phone, role, "createdAt", "updatedAt", last_login, role_id) VALUES ('dbc241e1-a237-4b97-b8c1-db367ae07cc0', 'matangabrooklyn@gmail.com', '$2a$10$IVK3eUi0j6RW4Vwp48SQgu.SkjrudoOGwSu2LmgWPrwXsvXtqOHNC', 'Brooklyn Matanga ', '', 'superadmin', '2025-12-04 20:12:38.559+01', '2025-12-14 22:13:06.928+01', '2025-12-14 22:13:06.928+01', NULL);
INSERT INTO public.users (id, email, password_hash, name, phone, role, "createdAt", "updatedAt", last_login, role_id) VALUES ('2734a88d-9994-4c30-b0e4-cde8a9c13874', 'admin@moviepark.com', '$2a$10$dkWLQd1T0ESerI3J8XEx..uQoGeMjBoqlUT4YMpycA9WXsFH74E7.', 'admintest', '', 'superadmin', '2025-12-04 23:16:17.589+01', '2026-03-24 03:02:08.508+01', '2026-03-24 03:02:08.507+01', NULL);
INSERT INTO public.users (id, email, password_hash, name, phone, role, "createdAt", "updatedAt", last_login, role_id) VALUES ('282162e8-232a-4635-8bea-437ced2365e2', 'admin@test.com', '$2a$10$91rvwqziCijy7dfiUvePzeHf2kVGap9s8oAV4u2Q0/vLSlAZvaEKS', 'Admin Test', NULL, 'admin', '2026-03-24 03:01:46.066144+01', '2026-03-24 10:54:52.279+01', '2026-03-24 10:54:52.279+01', NULL);
INSERT INTO public.users (id, email, password_hash, name, phone, role, "createdAt", "updatedAt", last_login, role_id) VALUES ('02ae193b-0f63-42df-b039-d984998f0d2a', 'latifnjimoluh@gmail.com', '$2a$10$VMBphb8wjm43z6eo8XSYIurPCgbxHnBoeKDlDMwZUBuW.bA4YAP8i', 'Admin', '699000000', 'superadmin', '2025-12-01 16:11:00.621+01', '2026-04-04 00:46:39.819+01', '2026-04-04 00:46:39.818+01', 'f0830051-4319-49ee-b7c6-837c9bfbf27c');


--
-- Name: UniqueVisitors_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public."UniqueVisitors_id_seq"', 1, false);


--
-- Name: Visits_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public."Visits_id_seq"', 1, false);


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
-- Name: daily_visits daily_visits_visit_date_key3; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.daily_visits
    ADD CONSTRAINT daily_visits_visit_date_key3 UNIQUE (visit_date);


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
-- Name: packs packs_name_key3; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.packs
    ADD CONSTRAINT packs_name_key3 UNIQUE (name);


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
-- Name: users users_email_key3; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key3 UNIQUE (email);


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

