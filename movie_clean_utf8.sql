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
-- Data for Name: SequelizeMeta; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."SequelizeMeta" (name) FROM stdin;
20250107-create-unique-visitors.js
20250107-create-visits.js
20260403-create-donations.js
20260404-add-proof-url-to-donations.js
\.


--
-- Data for Name: UniqueVisitors; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."UniqueVisitors" (id, "ipHash", "userAgent", "visitCount", "lastVisitedAt", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: Visits; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Visits" (id, "totalVisits", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: action_logs; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.action_logs (id, user_id, reservation_id, action_type, meta, "createdAt", description) FROM stdin;
2be3ea6a-bec5-47f0-8719-60dcd6f9eb12	dbc241e1-a237-4b97-b8c1-db367ae07cc0	647a5486-b263-4564-846a-5c74ac183fdd	payment.add	{"amount": 8000, "method": "orange", "payment_id": "2e872047-ce39-4826-8eeb-19b2ded36754"}	2025-12-06 21:15:52.032+01	Un paiement de 8000 XAF a été enregistré (orange)
2f58b69d-59e6-4c7d-801a-944ba7248ff5	dbc241e1-a237-4b97-b8c1-db367ae07cc0	647a5486-b263-4564-846a-5c74ac183fdd	ticket.generate	{"pack_name": "COUPLE", "ticket_id": "36fde980-ebb9-456f-9456-3496b0ab2c18", "ticket_number": "MIP-MIUQHNLK-FCTHIB", "participants_count": 2}	2025-12-06 21:16:11.475+01	\N
bf506167-dad6-4e93-97d9-76d132e80bfa	dbc241e1-a237-4b97-b8c1-db367ae07cc0	9e4d9498-334b-40d7-91bd-e8341cbb6448	payment.add	{"amount": 8000, "method": "orange", "payment_id": "0c68ccdf-0b77-4c18-ba58-289742334ee1"}	2025-12-06 21:23:18.155+01	Un paiement de 8000 XAF a été enregistré (orange)
a9638578-e491-49ec-ac6f-3a0137b12031	dbc241e1-a237-4b97-b8c1-db367ae07cc0	9e4d9498-334b-40d7-91bd-e8341cbb6448	ticket.generate	{"pack_name": "COUPLE", "ticket_id": "4b2b601f-6a4a-41bc-8429-3ff377942bb7", "ticket_number": "MIP-MIUQR4NE-F38MDE", "participants_count": 2}	2025-12-06 21:23:33.432+01	\N
41076d6b-869a-4891-89fe-6066be1a7f73	dbc241e1-a237-4b97-b8c1-db367ae07cc0	12e2ee73-7be7-4cd7-a63a-cd12fa9a0b8a	payment.add	{"amount": 10000, "method": "orange", "payment_id": "fc312a5b-a577-4370-aea0-cd2fa4b82e74"}	2025-12-08 08:54:05.13+01	Un paiement de 10000 XAF a été enregistré (orange)
7d1a22f9-5a17-4ce6-a201-030af5ad6b8a	dbc241e1-a237-4b97-b8c1-db367ae07cc0	12e2ee73-7be7-4cd7-a63a-cd12fa9a0b8a	ticket.generate	{"pack_name": "FAMILLE", "ticket_id": "d7c1c2c5-b82e-4ab3-b588-db163ebbe060", "ticket_number": "MIP-MIWUV8IJ-CYCZ64", "participants_count": 5}	2025-12-08 08:54:15.935+01	\N
e6d746a1-77da-4ad4-b6a4-ce3fb271e1fa	dbc241e1-a237-4b97-b8c1-db367ae07cc0	a887aff5-10ad-450e-b60d-f0cb7a95c877	payment.add	{"amount": 5000, "method": "cash", "payment_id": "9d1e0eb0-3156-4793-9781-227087372a5b"}	2025-12-08 17:01:28.997+01	Un paiement de 5000 XAF a été enregistré (cash)
30b105d3-f57c-4bd5-acbb-ecac5aeec687	dbc241e1-a237-4b97-b8c1-db367ae07cc0	a887aff5-10ad-450e-b60d-f0cb7a95c877	ticket.generate	{"pack_name": "VIP", "ticket_id": "2ffdb975-615d-4db5-a353-2f4d5a0284c8", "ticket_number": "MIP-MIXC9Y4T-HKHU5F", "participants_count": 1}	2025-12-08 17:01:35.719+01	\N
5ce70b17-36a1-4e97-92af-065a1c0fc7ca	dbc241e1-a237-4b97-b8c1-db367ae07cc0	0de178ec-777d-455b-99ec-96663e0b8738	payment.add	{"amount": 3000, "method": "orange", "payment_id": "91dd7ea4-826d-4f16-9312-7c2f88198c01"}	2025-12-10 11:09:04.039+01	Un paiement de 3000 XAF a été enregistré (orange)
7b5f24f2-7bcc-43f9-b04b-3445d0bec91d	dbc241e1-a237-4b97-b8c1-db367ae07cc0	0de178ec-777d-455b-99ec-96663e0b8738	ticket.generate	{"pack_name": "SIMPLE", "ticket_id": "adafb5c1-69a5-4765-b886-c8c18b2f1cd4", "ticket_number": "MIP-MIZUKH1J-5R2CYN", "participants_count": 1}	2025-12-10 11:09:12.244+01	\N
009efbef-3a0c-49f2-97ba-530c02cbcee0	dbc241e1-a237-4b97-b8c1-db367ae07cc0	6ec62590-e4e7-4190-972e-b9609ebcd23b	payment.add	{"amount": 8000, "method": "orange", "payment_id": "4c4122ae-dbcb-41f4-8e5e-1ae746a92685"}	2025-12-12 16:29:57.479+01	Un paiement de 8000 XAF a été enregistré (orange)
3097e2bb-12fa-4bfe-b261-9ee37ab91b31	dbc241e1-a237-4b97-b8c1-db367ae07cc0	6ec62590-e4e7-4190-972e-b9609ebcd23b	ticket.generate	{"pack_name": "COUPLE", "ticket_id": "0837b2b3-6076-4486-accf-7c7a5c84e959", "ticket_number": "MIP-MJ30WWQ7-KR3SAS", "participants_count": 2}	2025-12-12 16:30:08.664+01	\N
7259ee04-6263-4741-9eef-7258b2a4e8a5	dbc241e1-a237-4b97-b8c1-db367ae07cc0	49e02951-ae2a-453f-90fd-f302c1cd7c8e	payment.add	{"amount": 5000, "method": "orange", "payment_id": "6fa22c8a-43ed-47d3-8d02-5b5227afaa29"}	2025-12-14 10:01:53.004+01	Un paiement de 5000 XAF a été enregistré (orange)
a984edec-36a8-41b9-8c97-a359e63c1737	dbc241e1-a237-4b97-b8c1-db367ae07cc0	49e02951-ae2a-453f-90fd-f302c1cd7c8e	ticket.generate	{"pack_name": "VIP", "ticket_id": "029fb400-f839-41ef-a628-4ede2da9eb1d", "ticket_number": "MIP-MJ5MRAJR-3LSZ10", "participants_count": 1}	2025-12-14 12:17:10.561+01	\N
bc414769-b31b-48fa-847c-440d8dddf39c	dbc241e1-a237-4b97-b8c1-db367ae07cc0	5c75ca03-2ba3-47ff-b688-7e948bffc827	payment.add	{"amount": 8000, "method": "orange", "payment_id": "52bb65d3-3303-49b9-a968-2449bf9f7eae"}	2025-12-14 13:33:44.939+01	Un paiement de 8000 XAF a été enregistré (orange)
50dc35ba-fe4a-4d78-9e58-12297f546fb2	dbc241e1-a237-4b97-b8c1-db367ae07cc0	5c75ca03-2ba3-47ff-b688-7e948bffc827	ticket.generate	{"pack_name": "COUPLE", "ticket_id": "fe49ddd8-72e1-4831-8a2d-d7b72eaddf64", "ticket_number": "MIP-MJ5PHWVQ-2DZV5P", "participants_count": 2}	2025-12-14 13:33:51.855+01	\N
ba0d791e-3676-4b6f-8855-39b0971e5e7d	dbc241e1-a237-4b97-b8c1-db367ae07cc0	039d7927-321e-459c-8250-31e3a2ebf3cc	payment.add	{"amount": 5000, "method": "orange", "payment_id": "120b3a40-a401-4106-a96e-571ee84a68dc"}	2025-12-14 14:11:59.964+01	Un paiement de 5000 XAF a été enregistré (orange)
de69b0ed-d6db-4a6e-93d8-1ea826db9bbf	dbc241e1-a237-4b97-b8c1-db367ae07cc0	039d7927-321e-459c-8250-31e3a2ebf3cc	ticket.generate	{"pack_name": "VIP", "ticket_id": "6c7a61eb-5643-475d-b8e8-bfa9fce4ec35", "ticket_number": "MIP-MJ5QV473-6YH5C0", "participants_count": 1}	2025-12-14 14:12:07.415+01	\N
f9054e4d-132d-4222-8f69-e13a01417cb0	dbc241e1-a237-4b97-b8c1-db367ae07cc0	47de6424-a45b-4dc2-a0b0-b4cde0ac4248	payment.add	{"amount": 8000, "method": "cash", "payment_id": "d9344151-4e6d-4add-8560-833dcb5b0aac"}	2025-12-14 18:33:47.296+01	Un paiement de 8000 XAF a été enregistré (cash)
200054a9-5c4e-4f6c-8708-674383ca9b28	dbc241e1-a237-4b97-b8c1-db367ae07cc0	47de6424-a45b-4dc2-a0b0-b4cde0ac4248	ticket.generate	{"pack_name": "COUPLE", "ticket_id": "c444ed6d-bc43-4561-9fea-ee1315667416", "ticket_number": "MIP-MJ607S5I-CE998B", "participants_count": 2}	2025-12-14 18:33:54.851+01	\N
261250d6-35fd-405d-9b8d-8f426d3582a1	dbc241e1-a237-4b97-b8c1-db367ae07cc0	0781a9b4-28ad-4a01-995f-16b546e598c0	payment.add	{"amount": 8000, "method": "cash", "payment_id": "997e560c-5c8e-4363-9e3e-5611e8078896"}	2025-12-14 18:35:47.329+01	Un paiement de 8000 XAF a été enregistré (cash)
40dda537-e5a4-43b6-9057-5093194ca93e	dbc241e1-a237-4b97-b8c1-db367ae07cc0	0781a9b4-28ad-4a01-995f-16b546e598c0	ticket.generate	{"pack_name": "COUPLE", "ticket_id": "b4a8d383-de48-4f8f-92e5-b5adac754835", "ticket_number": "MIP-MJ60ADSB-YDX52W", "participants_count": 2}	2025-12-14 18:35:56.248+01	\N
cefec9db-ace4-469c-a6a3-d7ca3b2a5837	dbc241e1-a237-4b97-b8c1-db367ae07cc0	9266b89f-fb12-43a5-bf94-dc70cc357e98	payment.add	{"amount": 10000, "method": "orange", "payment_id": "c502bf03-ca96-4709-bc35-3bbaa2c3aa34"}	2025-12-15 13:14:32.973+01	Un paiement de 10000 XAF a été enregistré (orange)
9316617e-43d9-4448-bd2f-60ccaba3e274	dbc241e1-a237-4b97-b8c1-db367ae07cc0	9266b89f-fb12-43a5-bf94-dc70cc357e98	ticket.generate	{"pack_name": "FAMILLE", "ticket_id": "9465b814-5ccf-4e15-98d7-b0e788d65eda", "ticket_number": "MIP-MJ7499JO-ZJGVDP", "participants_count": 3}	2025-12-15 13:14:48.738+01	\N
0ee469ff-3707-47c7-8ea6-300bdec6aaa1	dbc241e1-a237-4b97-b8c1-db367ae07cc0	f0a4a00e-bd08-4ac4-abc6-834b97869450	payment.add	{"amount": 8000, "method": "orange", "payment_id": "cc370af6-1357-4e69-a145-55f921239383"}	2025-12-15 15:18:37.869+01	Un paiement de 8000 XAF a été enregistré (orange)
a6ef6c80-aed4-4152-9d7a-c6afc9e20d8b	dbc241e1-a237-4b97-b8c1-db367ae07cc0	f0a4a00e-bd08-4ac4-abc6-834b97869450	ticket.generate	{"pack_name": "COUPLE", "ticket_id": "01d210dd-f45a-422d-907e-92c8c7d66b82", "ticket_number": "MIP-MJ78OOOW-5WOB81", "participants_count": 2}	2025-12-15 15:18:46.766+01	\N
9fa842d7-b7c7-42f2-9361-edba6eb7fdd2	dbc241e1-a237-4b97-b8c1-db367ae07cc0	4e8358b2-1b25-4116-a0c1-e0e6c082f82d	payment.add	{"amount": 3000, "method": "orange", "payment_id": "36eab627-2c38-4ca4-84cc-789bd4bb69c4"}	2025-12-15 16:33:11.901+01	Un paiement de 3000 XAF a été enregistré (orange)
1c5d8d7b-36f7-439d-b193-3d69afcadd2a	dbc241e1-a237-4b97-b8c1-db367ae07cc0	4e8358b2-1b25-4116-a0c1-e0e6c082f82d	ticket.generate	{"pack_name": "SIMPLE", "ticket_id": "7d0f1f44-1c07-4dba-a1d7-ab7993da5525", "ticket_number": "MIP-MJ7BCJ36-ALQ3SC", "participants_count": 1}	2025-12-15 16:33:18.353+01	\N
9d929775-9d12-43cd-abba-3caea33f73ba	dbc241e1-a237-4b97-b8c1-db367ae07cc0	a29df73c-6441-4511-bd9c-001185b72b19	payment.add	{"amount": 20000, "method": "orange", "payment_id": "d9cc1361-28a4-44ac-8ead-8050f13cd8f8"}	2025-12-15 22:11:08.57+01	Un paiement de 20000 XAF a été enregistré (orange)
1267adf4-98d1-4c7e-bc6b-9c3e0a307005	dbc241e1-a237-4b97-b8c1-db367ae07cc0	a29df73c-6441-4511-bd9c-001185b72b19	ticket.generate	{"pack_name": "STAND", "ticket_id": "a6d962e4-aef8-4517-8856-49f248828abc", "ticket_number": "MIP-MJ7NF8BF-FJ5SDR", "participants_count": 3}	2025-12-15 22:11:19.805+01	\N
666433df-e511-480a-a95b-e3c407438556	dbc241e1-a237-4b97-b8c1-db367ae07cc0	297d83af-1b9f-4990-95eb-b53b90dd814e	payment.add	{"amount": 20000, "method": "cash", "payment_id": "77d3135d-d6fe-4cf7-aeac-dbf21de05550"}	2025-12-15 22:12:49.389+01	Un paiement de 20000 XAF a été enregistré (cash)
99bc224d-401c-42cb-9c02-7b00da4d217a	dbc241e1-a237-4b97-b8c1-db367ae07cc0	9afd72dd-37ea-4588-93b4-d756fcc2d8d4	payment.add	{"amount": 8000, "method": "momo", "payment_id": "a0a127c0-c0d4-4588-9178-dc89dfa20b1a"}	2025-12-16 09:46:00.637+01	Un paiement de 8000 XAF a été enregistré (momo)
72176e8a-d665-4b32-84d7-b6e333c402b8	dbc241e1-a237-4b97-b8c1-db367ae07cc0	9afd72dd-37ea-4588-93b4-d756fcc2d8d4	ticket.generate	{"pack_name": "COUPLE", "ticket_id": "b0b0ac23-249f-4167-b849-8feaf5169638", "ticket_number": "MIP-MJ8C8QWO-EGSVA7", "participants_count": 2}	2025-12-16 09:46:07.68+01	\N
2cc7f08e-6853-4735-93d5-a5099105e7aa	dbc241e1-a237-4b97-b8c1-db367ae07cc0	d4a7c88b-5fe9-44e7-8452-2111d6679e8e	payment.add	{"amount": 3000, "method": "orange", "payment_id": "ad035d5c-71e9-4fd0-86b6-4064466ada3c"}	2025-12-16 20:11:07.167+01	Un paiement de 3000 XAF a été enregistré (orange)
d9c972ff-12f8-40f0-b3f9-79bcc447ecef	dbc241e1-a237-4b97-b8c1-db367ae07cc0	d4a7c88b-5fe9-44e7-8452-2111d6679e8e	ticket.generate	{"pack_name": "SIMPLE", "ticket_id": "3f405145-6014-4e3b-93a2-b507a73e8b3f", "ticket_number": "MIP-MJ8YKO4A-YHYHPF", "participants_count": 1}	2025-12-16 20:11:15.482+01	\N
10b081c5-9784-46ae-b763-4609f20e4224	dbc241e1-a237-4b97-b8c1-db367ae07cc0	6b5632e3-39e5-4998-b7f2-a800de52231e	payment.add	{"amount": 8000, "method": "orange", "payment_id": "1724d98e-efad-4ebe-b41b-a831482a9e4e"}	2025-12-16 21:23:02.256+01	Un paiement de 8000 XAF a été enregistré (orange)
26390b3b-1a16-4875-a05c-a6559f90dbe4	dbc241e1-a237-4b97-b8c1-db367ae07cc0	6b5632e3-39e5-4998-b7f2-a800de52231e	ticket.generate	{"pack_name": "COUPLE", "ticket_id": "76b74505-2063-4b5f-9bda-b3d9ed701f70", "ticket_number": "MIP-MJ9152ZK-YAM2QY", "participants_count": 2}	2025-12-16 21:23:07.08+01	\N
4f88462b-9142-41ba-a37e-edccb4f272a6	dbc241e1-a237-4b97-b8c1-db367ae07cc0	6bfb590a-93a2-4398-ad99-b2a67deba640	payment.add	{"amount": 20000, "method": "cash", "payment_id": "22d891a6-6d79-44ab-89e9-9d5339cd2eeb"}	2025-12-16 22:48:13.981+01	Un paiement de 20000 XAF a été enregistré (cash)
e70366c0-7a22-4821-bf6c-f49e8754d9e6	dbc241e1-a237-4b97-b8c1-db367ae07cc0	553f726b-33a5-4786-8980-21bd128692ed	payment.add	{"amount": 5000, "method": "orange", "payment_id": "eb6cf71e-7253-42a5-a3bf-3536c9c1250b"}	2025-12-17 15:58:22.185+01	Un paiement de 5000 XAF a été enregistré (orange)
655a5028-5d6f-43bb-994a-d432f627fc92	dbc241e1-a237-4b97-b8c1-db367ae07cc0	553f726b-33a5-4786-8980-21bd128692ed	ticket.generate	{"pack_name": "VIP", "ticket_id": "87b78b00-a786-45d5-ac53-dc165f1d5194", "ticket_number": "MIP-MJA4ZEA3-IU2AQ1", "participants_count": 1}	2025-12-17 15:58:26.407+01	\N
43702280-1086-4481-b333-59316945b670	dbc241e1-a237-4b97-b8c1-db367ae07cc0	4dadaddb-6d54-4d63-9ff4-d6dc6ffbbb82	payment.add	{"amount": 5000, "method": "cash", "payment_id": "560e3f4a-b0b2-46f0-babe-b3c81a4ac5d3"}	2025-12-17 16:00:19.182+01	Un paiement de 5000 XAF a été enregistré (cash)
bb33f9da-b4f8-4804-91da-575f889f46ea	dbc241e1-a237-4b97-b8c1-db367ae07cc0	4dadaddb-6d54-4d63-9ff4-d6dc6ffbbb82	ticket.generate	{"pack_name": "VIP", "ticket_id": "ce13135e-64f8-455d-be1f-044f54f65c17", "ticket_number": "MIP-MJA51W25-E8AGQL", "participants_count": 1}	2025-12-17 16:00:22.743+01	\N
2568954e-e62a-47bd-af8e-723972ee1794	dbc241e1-a237-4b97-b8c1-db367ae07cc0	52525a88-08af-4ff1-9e74-7342ea3556b3	payment.add	{"amount": 3000, "method": "orange", "payment_id": "acbf0969-b434-481a-945d-b9d9c5bd8155"}	2025-12-17 19:14:52.874+01	Un paiement de 3000 XAF a été enregistré (orange)
9222adac-39e1-4820-a81f-073f1ed10e6b	dbc241e1-a237-4b97-b8c1-db367ae07cc0	52525a88-08af-4ff1-9e74-7342ea3556b3	ticket.generate	{"pack_name": "SIMPLE", "ticket_id": "4cfb767c-0094-4599-95bd-ae997aeb5da7", "ticket_number": "MIP-MJAC056Y-3EECEQ", "participants_count": 1}	2025-12-17 19:14:58.586+01	\N
c3344bc2-0744-48b5-bf38-abca46864c2d	dbc241e1-a237-4b97-b8c1-db367ae07cc0	cd3f7caf-6882-4e32-9687-7a8274f23cd5	payment.add	{"amount": 3000, "method": "orange", "payment_id": "1c8f75ff-fbca-44c4-9379-8e517ab40be8"}	2025-12-17 20:20:42.61+01	Un paiement de 3000 XAF a été enregistré (orange)
8c472be5-ca38-46fc-8ed9-434a6c13d97a	dbc241e1-a237-4b97-b8c1-db367ae07cc0	cd3f7caf-6882-4e32-9687-7a8274f23cd5	ticket.generate	{"pack_name": "SIMPLE", "ticket_id": "f6eb05af-a551-49d2-9831-a5e5a551442a", "ticket_number": "MIP-MJAECRQE-FOSNH9", "participants_count": 1}	2025-12-17 20:20:46.956+01	\N
381b4fc1-4cef-4b61-be5e-bbeab8bbaf3a	dbc241e1-a237-4b97-b8c1-db367ae07cc0	0d84035d-37d8-4dab-ace9-56278bd579e8	payment.add	{"amount": 3000, "method": "orange", "payment_id": "deacd276-bbff-43ca-854b-782eec25050d"}	2025-12-17 20:23:16.53+01	Un paiement de 3000 XAF a été enregistré (orange)
32e57b84-cfd1-4549-8ffc-08f7cc0c20d7	dbc241e1-a237-4b97-b8c1-db367ae07cc0	0d84035d-37d8-4dab-ace9-56278bd579e8	ticket.generate	{"pack_name": "SIMPLE", "ticket_id": "31f6a4cb-43d5-4cd5-985b-b074bbb0c15f", "ticket_number": "MIP-MJAEG3I7-VZ09M9", "participants_count": 1}	2025-12-17 20:23:22.163+01	\N
de3e77e5-ae2e-4ddb-aab3-0234c6e73790	02ae193b-0f63-42df-b039-d984998f0d2a	bb8d5c26-4cc6-4a6c-9dbf-f794cefac2b3	payment.add	{"amount": 5000, "method": "cash", "payment_id": "c1c19b47-0809-4889-9065-942e1824c953"}	2025-12-21 15:42:55.38+01	Un paiement de 5000 XAF a été enregistré (cash)
9ec77dab-8056-46cc-be1c-b3590c361e14	02ae193b-0f63-42df-b039-d984998f0d2a	bb8d5c26-4cc6-4a6c-9dbf-f794cefac2b3	ticket.generate	{"pack_name": "VIP", "ticket_id": "e751cd2d-8c85-4a48-acf5-a3e5e11e93c4", "ticket_number": "MIP-MJFU6X0U-IVAQIA", "participants_count": 1}	2025-12-21 15:42:58.462+01	\N
e1f7f617-3904-4996-8940-376aece705ee	282162e8-232a-4635-8bea-437ced2365e2	4c0e3b42-e279-4604-a498-0bc81ae09b1e	payment.add	{"amount": 20000, "method": "cash", "payment_id": "e4f7be70-e9c2-48ba-820f-01e28d584bb3"}	2026-03-24 08:41:48.64+01	Un paiement de 20000 XAF a été enregistré (cash)
23617509-5375-4a14-8cf8-1bc0cd0d1648	282162e8-232a-4635-8bea-437ced2365e2	4c0e3b42-e279-4604-a498-0bc81ae09b1e	ticket.generate	{"pack_name": "STAND", "ticket_id": "46b59079-8a9e-4067-983b-1f16936d8a61", "ticket_number": "MIP-MN4B3PZ5-73PU0K", "participants_count": 1}	2026-03-24 08:41:58.067+01	\N
9b122fcc-ea7e-4e95-a377-5e87baa084d9	282162e8-232a-4635-8bea-437ced2365e2	4c0e3b42-e279-4604-a498-0bc81ae09b1e	entry.validate	{"ticket_number": "MIP-MN4B3PZ5-73PU0K", "participant_id": "ea99b26c-029b-4ed9-8784-e84183a67738"}	2026-03-24 09:13:22.539+01	\N
ca3bf38d-0c5c-4134-97fa-d9c14a405ddc	282162e8-232a-4635-8bea-437ced2365e2	1aeb340c-48c3-4eff-ba55-f55f52cc9df2	payment.add	{"amount": 8000, "method": "cash", "payment_id": "5bedfd38-8dd0-4e9e-98ec-0bb542d7c6f5"}	2026-03-24 09:14:48.15+01	Un paiement de 8000 XAF a été enregistré (cash)
0a620862-7809-4a23-9c00-b30bad6b674e	282162e8-232a-4635-8bea-437ced2365e2	1aeb340c-48c3-4eff-ba55-f55f52cc9df2	ticket.generate	{"pack_name": "COUPLE", "ticket_id": "d8a804de-d622-4ecf-8c5f-73faf929a98d", "ticket_number": "MIP-MN4CA31X-DSHOTS", "participants_count": 3}	2026-03-24 09:14:54.649+01	\N
359ad5c0-a1f5-48f3-945b-9843ad8305f3	282162e8-232a-4635-8bea-437ced2365e2	d569c5ec-1b98-45c9-a52d-4f086fdbbc37	payment.add	{"amount": 5000, "method": "cash", "payment_id": "0a3233d1-64c4-4bee-88af-99ef5e32e25a"}	2026-03-24 09:59:20.99+01	Un paiement de 5000 XAF a été enregistré (cash)
19b73a64-bb32-409f-90a3-e1335ab4b539	282162e8-232a-4635-8bea-437ced2365e2	d569c5ec-1b98-45c9-a52d-4f086fdbbc37	payment.add	{"amount": 3000, "method": "momo", "payment_id": "fd2e2c12-7fca-4188-98de-e15fe87ba4bf"}	2026-03-24 10:00:08.268+01	Un paiement de 3000 XAF a été enregistré (momo)
fd7bf4ea-aee0-47f1-88a8-db2b2de87570	282162e8-232a-4635-8bea-437ced2365e2	d569c5ec-1b98-45c9-a52d-4f086fdbbc37	ticket.generate	{"pack_name": "COUPLE", "ticket_id": "ce52992f-3e13-4199-b402-c98a5e39390e", "ticket_number": "MIP-MN4DWCQM-QTMI9Y", "participants_count": 2}	2026-03-24 10:00:13.142+01	\N
f171329d-3722-4ba9-a5f5-c596078a460d	282162e8-232a-4635-8bea-437ced2365e2	d569c5ec-1b98-45c9-a52d-4f086fdbbc37	entry.validate	{"ticket_number": "MIP-MN4DWCQM-QTMI9Y", "participant_id": "1d4d56aa-9289-4fce-b0e6-183aeeed0efe"}	2026-03-24 10:40:50.423+01	\N
9db8cfa7-f209-4c68-97cf-961ebc49084a	282162e8-232a-4635-8bea-437ced2365e2	d569c5ec-1b98-45c9-a52d-4f086fdbbc37	entry.validate	{"ticket_number": "MIP-MN4DWCQM-QTMI9Y", "participant_id": "f1afb167-c388-447e-ab28-d1bf90c2c3c5"}	2026-03-24 10:40:54.398+01	\N
34dd9a72-7959-4672-b4b4-3438c07570cc	02ae193b-0f63-42df-b039-d984998f0d2a	0afd8c46-0cf9-4007-b2e3-1be95473d50d	payment.add	{"amount": 8000, "method": "cash", "payment_id": "05e907f4-06d4-45d1-b59f-3f4b908de4c1"}	2026-03-24 12:34:04.296+01	Un paiement de 8000 XAF a été enregistré (cash)
0a163e3c-258e-4281-973d-97009f4d68ab	02ae193b-0f63-42df-b039-d984998f0d2a	0afd8c46-0cf9-4007-b2e3-1be95473d50d	ticket.generate	{"pack_name": "COUPLE", "ticket_id": "42473b2b-b9c2-43fd-9e27-722e42a4a4f3", "ticket_number": "MIP-MN4JEB3C-4UMZK7", "participants_count": 2}	2026-03-24 12:34:08.996+01	\N
d81177ad-ab2f-42bf-aa8c-7bc77ffea0dd	02ae193b-0f63-42df-b039-d984998f0d2a	691af412-bef8-48f8-9339-85fd4637f15e	payment.add	{"amount": 5000, "method": "cash", "payment_id": "99101ef3-ac9c-41b1-83f9-ae740b686083"}	2026-04-04 01:12:57.701+01	Un paiement de 5000 XAF a été enregistré (cash)
9e3e0d39-6349-4f2c-92ea-3d34081f6ee9	02ae193b-0f63-42df-b039-d984998f0d2a	691af412-bef8-48f8-9339-85fd4637f15e	ticket.generate	{"pack_name": "VIP", "ticket_id": "41acb9e5-f503-4d74-88f0-e10ddd8e00ad", "ticket_number": "MIP-MNJKWZM8-IT0JBW", "participants_count": 1}	2026-04-04 01:13:12.857+01	\N
\.


--
-- Data for Name: activity_logs; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.activity_logs (id, user_id, permission, entity_type, entity_id, action, description, changes, status, ip_address, user_agent, created_at) FROM stdin;
f96ecd7b-3e3c-4e89-ad68-22302a24194e	02ae193b-0f63-42df-b039-d984998f0d2a	reservations.delete.permanent	reservation	7e87e3d2-6f50-4f99-820a-24da096a7ce0	delete	Réservation supprimée définitivement (undefined)	{"status": "pending", "total_paid": 0, "payeur_name": "Christine Endale", "total_price": 10000, "payeur_email": "matangabrooklyn@gmail.com", "deleted_related_data": {"payments": 0, "participants": 0}}	success	::ffff:127.0.0.1	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.1 Mobile/15E148 Safari/604.1	2025-12-06 02:16:35.028+01
70c1df55-d0f9-4168-8735-8edcf4cf7773	02ae193b-0f63-42df-b039-d984998f0d2a	reservations.delete.permanent	reservation	5f148044-1d0d-4b13-841e-4489c10166e5	delete	Réservation supprimée définitivement (undefined)	{"status": "pending", "total_paid": 0, "payeur_name": "Ayangma  Jenny", "total_price": 3000, "payeur_email": "ayangmajenny@vgmail.com", "deleted_related_data": {"payments": 0, "participants": 0}}	success	::ffff:127.0.0.1	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.1 Mobile/15E148 Safari/604.1	2025-12-06 02:16:38.709+01
5b5c39bf-3c21-42a7-afdb-7da3d829cb20	02ae193b-0f63-42df-b039-d984998f0d2a	public.reservation.create	reservation	47c6276f-2d12-47fc-90a3-dd593dceb0f1	create	Réservation publique créée pour Gabriel Fokou - Forfait: COUPLE	{"status": "pending", "pack_id": "b8249ec2-993a-4140-902b-6bfad049a1b6", "quantity": 2, "pack_name": "COUPLE", "payeur_name": "Gabriel Fokou", "total_price": 8000, "payeur_email": "gabrielfokou26@gmail.com", "payeur_phone": "237658980051", "participants_count": 2}	success	::ffff:127.0.0.1	Mozilla/5.0 (iPhone; CPU iPhone OS 26_1_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/143.0.7499.92 Mobile/15E148 Safari/604.1	2025-12-07 22:52:57.844+01
5b418f6f-7220-427e-9a75-ee50fe7be06d	02ae193b-0f63-42df-b039-d984998f0d2a	public.reservation.create	reservation	2fa8752e-a76f-4a72-a0f9-c39a1079dea3	create	Réservation publique créée pour nexus Nexus - Forfait: COUPLE	{"status": "pending", "pack_id": "b8249ec2-993a-4140-902b-6bfad049a1b6", "quantity": 2, "pack_name": "COUPLE", "payeur_name": "nexus Nexus", "total_price": 8000, "payeur_email": "nexuslatif4@gmail.com", "payeur_phone": "237658509963", "participants_count": 2}	success	::ffff:127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Avast/142.0.0.0	2025-12-08 06:16:25.345+01
5943099a-903e-46a3-86d7-0be7b0d22140	02ae193b-0f63-42df-b039-d984998f0d2a	reservations.delete.permanent	reservation	2fa8752e-a76f-4a72-a0f9-c39a1079dea3	delete	Réservation supprimée définitivement (undefined)	{"status": "pending", "total_paid": 0, "payeur_name": "nexus Nexus", "total_price": 8000, "payeur_email": "nexuslatif4@gmail.com", "deleted_related_data": {"payments": 0, "participants": 2}}	success	::ffff:127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Avast/142.0.0.0	2025-12-08 06:17:38.893+01
141c4740-215b-4c2f-b10a-78f6a71e07f6	02ae193b-0f63-42df-b039-d984998f0d2a	public.reservation.create	reservation	12ea6c61-8210-4b49-99bf-b19f700a9ff8	create	Réservation publique créée pour nex nex - Forfait: SIMPLE	{"status": "pending", "pack_id": "7c209804-be05-48dc-b14d-4d8bf63c19df", "quantity": 1, "pack_name": "SIMPLE", "payeur_name": "nex nex", "total_price": 3000, "payeur_email": "nexuslatif35@gmail.com", "payeur_phone": "237658585858", "participants_count": 1}	success	::ffff:127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Avast/142.0.0.0	2025-12-08 06:21:22.443+01
64f5243e-ad58-487a-8d87-a63a80cb6101	02ae193b-0f63-42df-b039-d984998f0d2a	reservations.delete.permanent	reservation	12ea6c61-8210-4b49-99bf-b19f700a9ff8	delete	Réservation supprimée définitivement (undefined)	{"status": "pending", "total_paid": 0, "payeur_name": "nex nex", "total_price": 3000, "payeur_email": "nexuslatif35@gmail.com", "deleted_related_data": {"payments": 0, "participants": 1}}	success	::ffff:127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	2025-12-08 06:39:43.206+01
3008fb71-ad6e-4587-8641-4dc64710f42c	02ae193b-0f63-42df-b039-d984998f0d2a	public.reservation.create	reservation	fb245bdb-18b6-4477-9b1f-4f5fe90fd906	create	Réservation publique créée pour Anas Farid Njimoluh - Forfait: SIMPLE	{"status": "pending", "pack_id": "7c209804-be05-48dc-b14d-4d8bf63c19df", "quantity": 1, "pack_name": "SIMPLE", "payeur_name": "Anas Farid Njimoluh", "total_price": 3000, "payeur_email": "nexuslatif4@gmail.com", "payeur_phone": "237672475691", "participants_count": 1}	success	::ffff:127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	2025-12-08 06:44:37.053+01
324999bc-7c3b-4dde-9ab3-28769e43a165	02ae193b-0f63-42df-b039-d984998f0d2a	reservations.delete.permanent	reservation	fb245bdb-18b6-4477-9b1f-4f5fe90fd906	delete	Réservation supprimée définitivement (undefined)	{"status": "pending", "total_paid": 0, "payeur_name": "Anas Farid Njimoluh", "total_price": 3000, "payeur_email": "nexuslatif4@gmail.com", "deleted_related_data": {"payments": 0, "participants": 1}}	success	::ffff:127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	2025-12-08 06:58:03.446+01
e518ca25-37a1-4065-8996-042a564bcbc0	02ae193b-0f63-42df-b039-d984998f0d2a	public.reservation.create	reservation	a887aff5-10ad-450e-b60d-f0cb7a95c877	create	Réservation publique créée pour Rayan Arnold KOMBOU KAMDOUM - Forfait: VIP	{"status": "pending", "pack_id": "b62e0c02-e4ff-4e86-8c46-ed7e6acc9eb8", "quantity": 1, "pack_name": "VIP", "payeur_name": "Rayan Arnold KOMBOU KAMDOUM", "total_price": 5000, "payeur_email": "rayankamdoum12@gmail.com", "payeur_phone": "237673069061", "participants_count": 1}	success	::ffff:127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36	2025-12-08 07:40:18.188+01
9d8cb9d6-dc1d-4e3e-b03e-4be17be01039	dbc241e1-a237-4b97-b8c1-db367ae07cc0	reservations.delete.permanent	reservation	47c6276f-2d12-47fc-90a3-dd593dceb0f1	delete	Réservation supprimée définitivement (undefined)	{"status": "pending", "total_paid": 0, "payeur_name": "Gabriel Fokou", "total_price": 8000, "payeur_email": "gabrielfokou26@gmail.com", "deleted_related_data": {"payments": 0, "participants": 2}}	success	::ffff:127.0.0.1	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.1 Mobile/15E148 Safari/604.1	2025-12-08 08:43:16.695+01
b66bbea1-c28d-4a9c-9b25-bbe2add3debd	02ae193b-0f63-42df-b039-d984998f0d2a	public.reservation.create	reservation	12e2ee73-7be7-4cd7-a63a-cd12fa9a0b8a	create	Réservation publique créée pour Gabriel Fokou - Forfait: FAMILLE	{"status": "pending", "pack_id": "d90648b7-1afb-4d0d-91c7-3eaf0ddb40c3", "quantity": 5, "pack_name": "FAMILLE", "payeur_name": "Gabriel Fokou", "total_price": 10000, "payeur_email": "gabrielfokou26@gmail.com", "payeur_phone": "237658980051", "participants_count": 5}	success	::ffff:127.0.0.1	Mozilla/5.0 (iPhone; CPU iPhone OS 26_1_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/143.0.7499.92 Mobile/15E148 Safari/604.1	2025-12-08 08:50:40.937+01
d5ee1e66-82fc-4621-acbc-afe8db149501	02ae193b-0f63-42df-b039-d984998f0d2a	public.reservation.create	reservation	1a41bd8d-12e5-4b1e-9509-87f7d7c3953b	create	Réservation publique créée pour Lea Lili - Forfait: SIMPLE	{"status": "pending", "pack_id": "7c209804-be05-48dc-b14d-4d8bf63c19df", "quantity": 1, "pack_name": "SIMPLE", "payeur_name": "Lea Lili", "total_price": 3000, "payeur_email": "sohlaurent3@gmail.com", "payeur_phone": "237653254219", "participants_count": 1}	success	::ffff:127.0.0.1	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Mobile Safari/537.36	2025-12-08 10:52:25.287+01
65f2b0e1-3d6e-467b-a030-4cd7663deaf7	02ae193b-0f63-42df-b039-d984998f0d2a	public.reservation.create	reservation	47de6424-a45b-4dc2-a0b0-b4cde0ac4248	create	Réservation publique créée pour Nathanaël  Tamba - Forfait: COUPLE	{"status": "pending", "pack_id": "b8249ec2-993a-4140-902b-6bfad049a1b6", "quantity": 2, "pack_name": "COUPLE", "payeur_name": "Nathanaël  Tamba", "total_price": 8000, "payeur_email": "Koltanatamba@gmail.com", "payeur_phone": "237682973174", "participants_count": 2}	success	::ffff:127.0.0.1	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Mobile Safari/537.36	2025-12-08 20:47:16.147+01
7ce252e0-c298-43aa-a8ad-092fb16105ab	02ae193b-0f63-42df-b039-d984998f0d2a	public.reservation.create	reservation	4b61138c-61b2-445d-957b-cf536c5c8218	create	Réservation publique créée pour Michel Zama - Forfait: COUPLE	{"status": "pending", "pack_id": "b8249ec2-993a-4140-902b-6bfad049a1b6", "quantity": 2, "pack_name": "COUPLE", "payeur_name": "Michel Zama", "total_price": 8000, "payeur_email": "zamamichel@icloud.com", "payeur_phone": "237696971336", "participants_count": 2}	success	::ffff:127.0.0.1	Mozilla/5.0 (iPhone; CPU iPhone OS 18_2_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.2 Mobile/15E148 Safari/604.1	2025-12-08 21:32:31.205+01
08b24fcc-2c3e-46a4-b9c0-2a848f52a48f	02ae193b-0f63-42df-b039-d984998f0d2a	public.reservation.create	reservation	f95ff1e4-2e83-4551-b305-03c5fdb84c86	create	Réservation publique créée pour FRIEDE STERN VON  NDOM - Forfait: VIP	{"status": "pending", "pack_id": "b62e0c02-e4ff-4e86-8c46-ed7e6acc9eb8", "quantity": 1, "pack_name": "VIP", "payeur_name": "FRIEDE STERN VON  NDOM", "total_price": 5000, "payeur_email": "vonstern7@gmail.com", "payeur_phone": "237657402824", "participants_count": 1}	success	::ffff:127.0.0.1	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Mobile Safari/537.36	2025-12-08 23:22:30.148+01
36648878-407a-4f8e-824f-0a446603064f	02ae193b-0f63-42df-b039-d984998f0d2a	public.reservation.create	reservation	aca69c03-fa9a-48b5-b6ee-a787675d75cc	create	Réservation publique créée pour Anas Farid Njimoluh - Forfait: SIMPLE	{"status": "pending", "pack_id": "7c209804-be05-48dc-b14d-4d8bf63c19df", "quantity": 1, "pack_name": "SIMPLE", "payeur_name": "Anas Farid Njimoluh", "total_price": 3000, "payeur_email": "latifnjimoluh@gmail.com", "payeur_phone": "237672475691", "participants_count": 1}	success	::ffff:127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	2025-12-09 01:00:28.125+01
31e63c78-aaf2-4fed-b4e2-dd9c1d67f4c8	02ae193b-0f63-42df-b039-d984998f0d2a	reservations.delete.permanent	reservation	aca69c03-fa9a-48b5-b6ee-a787675d75cc	delete	Réservation supprimée définitivement (undefined)	{"status": "pending", "total_paid": 0, "payeur_name": "Anas Farid Njimoluh", "total_price": 3000, "payeur_email": "latifnjimoluh@gmail.com", "deleted_related_data": {"payments": 0, "participants": 1}}	success	::ffff:127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	2025-12-09 01:01:57.219+01
dfe99a8a-5454-4b00-aae9-79df883f5cc6	02ae193b-0f63-42df-b039-d984998f0d2a	public.reservation.create	reservation	0489162a-5234-419c-b08a-0439a942bfb3	create	Réservation publique créée pour Anas Farid Njimoluh - Forfait: SIMPLE	{"status": "pending", "pack_id": "7c209804-be05-48dc-b14d-4d8bf63c19df", "quantity": 1, "pack_name": "SIMPLE", "payeur_name": "Anas Farid Njimoluh", "total_price": 3000, "payeur_email": "latifnjimoluh@gmail.com", "payeur_phone": "237672475691", "participants_count": 1}	success	::ffff:127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	2025-12-09 01:15:27.046+01
03988619-4e29-42ea-a0e8-a3b614dfc114	02ae193b-0f63-42df-b039-d984998f0d2a	public.reservation.create	reservation	ddcb911a-06aa-4047-81b3-b3f41f7accdc	create	Réservation publique créée pour Anas Farid Njimoluh - Forfait: SIMPLE	{"status": "pending", "pack_id": "7c209804-be05-48dc-b14d-4d8bf63c19df", "quantity": 1, "pack_name": "SIMPLE", "payeur_name": "Anas Farid Njimoluh", "total_price": 3000, "payeur_email": "latifnjimoluh@gmail.com", "payeur_phone": "237672475691", "participants_count": 1}	success	::ffff:127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	2025-12-09 01:19:48.655+01
314cee66-bf0d-4875-bc34-8f56249f0943	02ae193b-0f63-42df-b039-d984998f0d2a	reservations.delete.permanent	reservation	ddcb911a-06aa-4047-81b3-b3f41f7accdc	delete	Réservation supprimée définitivement (undefined)	{"status": "pending", "total_paid": 0, "payeur_name": "Anas Farid Njimoluh", "total_price": 3000, "payeur_email": "latifnjimoluh@gmail.com", "deleted_related_data": {"payments": 0, "participants": 1}}	success	::ffff:127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	2025-12-09 01:22:02.668+01
f9935723-ca0d-43c8-84b9-0bef92eb4f95	02ae193b-0f63-42df-b039-d984998f0d2a	reservations.delete.permanent	reservation	0489162a-5234-419c-b08a-0439a942bfb3	delete	Réservation supprimée définitivement (undefined)	{"status": "pending", "total_paid": 0, "payeur_name": "Anas Farid Njimoluh", "total_price": 3000, "payeur_email": "latifnjimoluh@gmail.com", "deleted_related_data": {"payments": 0, "participants": 1}}	success	::ffff:127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	2025-12-09 01:22:06.983+01
a33bc926-fb65-43cc-b23f-1b0a829f1856	02ae193b-0f63-42df-b039-d984998f0d2a	public.reservation.create	reservation	12d39f54-76a8-434f-a1b9-4aaa9f9ac0a3	create	Réservation publique créée pour Anas Farid Njimoluh - Forfait: SIMPLE	{"status": "pending", "pack_id": "7c209804-be05-48dc-b14d-4d8bf63c19df", "quantity": 1, "pack_name": "SIMPLE", "payeur_name": "Anas Farid Njimoluh", "total_price": 3000, "payeur_email": "latifnjimoluh@gmail.com", "payeur_phone": "237672475691", "participants_count": 1}	success	::ffff:127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	2025-12-09 01:25:04.704+01
bd4f4c43-4983-473b-a743-3704001bdafb	02ae193b-0f63-42df-b039-d984998f0d2a	public.reservation.create	reservation	e17e1e52-7720-4d74-abf4-901af2eb92a1	create	Réservation publique créée pour Anas Farid Njimoluh - Forfait: SIMPLE	{"status": "pending", "pack_id": "7c209804-be05-48dc-b14d-4d8bf63c19df", "quantity": 1, "pack_name": "SIMPLE", "payeur_name": "Anas Farid Njimoluh", "total_price": 3000, "payeur_email": "latifnjimoluh@gmail.com", "payeur_phone": "237672475691", "participants_count": 1}	success	::ffff:127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	2025-12-09 01:26:27+01
7d386e36-bb8e-40c8-8498-8aea8d876e7f	02ae193b-0f63-42df-b039-d984998f0d2a	public.reservation.create	reservation	01c43cbe-b102-479e-ac49-35aa3c6e924b	create	Réservation publique créée pour Anas Farid Njimoluh - Forfait: SIMPLE	{"status": "pending", "pack_id": "7c209804-be05-48dc-b14d-4d8bf63c19df", "quantity": 1, "pack_name": "SIMPLE", "payeur_name": "Anas Farid Njimoluh", "total_price": 3000, "payeur_email": "latifnjimoluh@gmail.com", "payeur_phone": "237672475691", "participants_count": 1}	success	::ffff:127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	2025-12-09 01:29:07.837+01
b302bd3e-12e1-4c05-b382-8e8bee89b606	02ae193b-0f63-42df-b039-d984998f0d2a	public.reservation.create	reservation	4fd863a6-1158-474c-a603-6ea1f202a0d4	create	Réservation publique créée pour Anas Farid Njimoluh - Forfait: SIMPLE	{"status": "pending", "pack_id": "7c209804-be05-48dc-b14d-4d8bf63c19df", "quantity": 1, "pack_name": "SIMPLE", "payeur_name": "Anas Farid Njimoluh", "total_price": 3000, "payeur_email": "latifnjimoluh@gmail.com", "payeur_phone": "237672475691", "participants_count": 1}	success	::ffff:127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	2025-12-09 01:30:20.896+01
4b6ee626-54a5-458a-b97f-e712f183b006	02ae193b-0f63-42df-b039-d984998f0d2a	public.reservation.create	reservation	9baa750e-14be-4575-ad72-329925437298	create	Réservation publique créée pour Anas Farid Njimoluh - Forfait: SIMPLE	{"status": "pending", "pack_id": "7c209804-be05-48dc-b14d-4d8bf63c19df", "quantity": 1, "pack_name": "SIMPLE", "payeur_name": "Anas Farid Njimoluh", "total_price": 3000, "payeur_email": "latifnjimoluh@gmail.com", "payeur_phone": "237672475691", "participants_count": 1}	success	::ffff:127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	2025-12-09 01:33:06.838+01
3495d655-d805-41c4-9c72-9dff2da7b1b5	02ae193b-0f63-42df-b039-d984998f0d2a	public.reservation.create	reservation	c5e4bb36-34ca-4f1d-adee-5909e195a77e	create	Réservation publique créée pour Anas Farid Njimoluh - Forfait: SIMPLE	{"status": "pending", "pack_id": "7c209804-be05-48dc-b14d-4d8bf63c19df", "quantity": 1, "pack_name": "SIMPLE", "payeur_name": "Anas Farid Njimoluh", "total_price": 3000, "payeur_email": "latifnjimoluh@gmail.com", "payeur_phone": "237672475691", "participants_count": 1}	success	::ffff:127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	2025-12-09 01:35:13.708+01
03088c50-8a4c-4f83-9891-4655144a95fa	02ae193b-0f63-42df-b039-d984998f0d2a	public.reservation.create	reservation	469582d0-be88-480d-bd1f-629963ba9de3	create	Réservation publique créée pour Anas Farid Njimoluh - Forfait: SIMPLE	{"status": "pending", "pack_id": "7c209804-be05-48dc-b14d-4d8bf63c19df", "quantity": 1, "pack_name": "SIMPLE", "payeur_name": "Anas Farid Njimoluh", "total_price": 3000, "payeur_email": "latifnjimoluh@gmail.com", "payeur_phone": "237672475691", "participants_count": 1}	success	::ffff:127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	2025-12-09 01:40:16.319+01
d9f7f74e-c744-4b6d-a862-1089fac2592c	02ae193b-0f63-42df-b039-d984998f0d2a	reservations.delete.permanent	reservation	4fd863a6-1158-474c-a603-6ea1f202a0d4	delete	Réservation supprimée définitivement (undefined)	{"status": "pending", "total_paid": 0, "payeur_name": "Anas Farid Njimoluh", "total_price": 3000, "payeur_email": "latifnjimoluh@gmail.com", "deleted_related_data": {"payments": 0, "participants": 1}}	success	::ffff:127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	2025-12-09 01:40:27.369+01
c5e04881-e269-43ae-871b-e73d113561a8	02ae193b-0f63-42df-b039-d984998f0d2a	reservations.delete.permanent	reservation	9baa750e-14be-4575-ad72-329925437298	delete	Réservation supprimée définitivement (undefined)	{"status": "pending", "total_paid": 0, "payeur_name": "Anas Farid Njimoluh", "total_price": 3000, "payeur_email": "latifnjimoluh@gmail.com", "deleted_related_data": {"payments": 0, "participants": 1}}	success	::ffff:127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	2025-12-09 01:40:30.162+01
1c2e58e3-732d-4ac0-a564-dd4f4ad94dd3	02ae193b-0f63-42df-b039-d984998f0d2a	reservations.delete.permanent	reservation	469582d0-be88-480d-bd1f-629963ba9de3	delete	Réservation supprimée définitivement (undefined)	{"status": "pending", "total_paid": 0, "payeur_name": "Anas Farid Njimoluh", "total_price": 3000, "payeur_email": "latifnjimoluh@gmail.com", "deleted_related_data": {"payments": 0, "participants": 1}}	success	::ffff:127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	2025-12-09 01:40:34.55+01
bb077b46-6459-4ec0-be62-1a677ff53495	02ae193b-0f63-42df-b039-d984998f0d2a	reservations.delete.permanent	reservation	c5e4bb36-34ca-4f1d-adee-5909e195a77e	delete	Réservation supprimée définitivement (undefined)	{"status": "pending", "total_paid": 0, "payeur_name": "Anas Farid Njimoluh", "total_price": 3000, "payeur_email": "latifnjimoluh@gmail.com", "deleted_related_data": {"payments": 0, "participants": 1}}	success	::ffff:127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	2025-12-09 01:40:37.623+01
b9310ea4-6199-4355-82d5-81e64e4c698c	02ae193b-0f63-42df-b039-d984998f0d2a	reservations.delete.permanent	reservation	01c43cbe-b102-479e-ac49-35aa3c6e924b	delete	Réservation supprimée définitivement (undefined)	{"status": "pending", "total_paid": 0, "payeur_name": "Anas Farid Njimoluh", "total_price": 3000, "payeur_email": "latifnjimoluh@gmail.com", "deleted_related_data": {"payments": 0, "participants": 1}}	success	::ffff:127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	2025-12-09 01:40:40.949+01
c6004186-edcf-4995-9fc0-c1e3cca70960	02ae193b-0f63-42df-b039-d984998f0d2a	reservations.delete.permanent	reservation	e17e1e52-7720-4d74-abf4-901af2eb92a1	delete	Réservation supprimée définitivement (undefined)	{"status": "pending", "total_paid": 0, "payeur_name": "Anas Farid Njimoluh", "total_price": 3000, "payeur_email": "latifnjimoluh@gmail.com", "deleted_related_data": {"payments": 0, "participants": 1}}	success	::ffff:127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	2025-12-09 01:40:44.266+01
774ca5a5-e1b7-423e-b992-7c066927217d	02ae193b-0f63-42df-b039-d984998f0d2a	reservations.delete.permanent	reservation	12d39f54-76a8-434f-a1b9-4aaa9f9ac0a3	delete	Réservation supprimée définitivement (undefined)	{"status": "pending", "total_paid": 0, "payeur_name": "Anas Farid Njimoluh", "total_price": 3000, "payeur_email": "latifnjimoluh@gmail.com", "deleted_related_data": {"payments": 0, "participants": 1}}	success	::ffff:127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	2025-12-09 01:40:48.24+01
b7fb32dd-f3d3-4168-bfdc-516414da8fcb	02ae193b-0f63-42df-b039-d984998f0d2a	public.reservation.create	reservation	c66b8541-8701-4f32-8aff-d31b44a81d90	create	Réservation publique créée pour Amstrong Florent  TANKEU - Forfait: COUPLE	{"status": "pending", "pack_id": "b8249ec2-993a-4140-902b-6bfad049a1b6", "quantity": 2, "pack_name": "COUPLE", "payeur_name": "Amstrong Florent  TANKEU", "total_price": 8000, "payeur_email": "ammstrongkapseu@gmail.com", "payeur_phone": "237656512217", "participants_count": 2}	success	::ffff:127.0.0.1	Mozilla/5.0 (iPhone; CPU iPhone OS 18_5_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/141.0.7390.96 Mobile/15E148 Safari/604.1	2025-12-09 08:27:24.096+01
d4e97f46-fd7c-4ab4-b4ad-448255e6bc73	dbc241e1-a237-4b97-b8c1-db367ae07cc0	reservations.delete.soft	reservation	1a41bd8d-12e5-4b1e-9509-87f7d7c3953b	delete	Réservation annulée (undefined)	{"new_status": "cancelled", "total_paid": 0, "payeur_name": "Lea Lili", "total_price": 3000, "payeur_email": "sohlaurent3@gmail.com", "previous_status": "pending"}	success	::ffff:127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36 Edg/143.0.0.0	2025-12-09 21:13:36.166+01
0dd9f1e3-5757-4d0c-a641-1e8e9ec82237	dbc241e1-a237-4b97-b8c1-db367ae07cc0	reservations.delete.soft	reservation	1a41bd8d-12e5-4b1e-9509-87f7d7c3953b	delete	Réservation annulée (undefined)	{"new_status": "cancelled", "total_paid": 0, "payeur_name": "Lea Lili", "total_price": 3000, "payeur_email": "sohlaurent3@gmail.com", "previous_status": "cancelled"}	success	::ffff:127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36 Edg/143.0.0.0	2025-12-09 21:13:52.207+01
eacedd8d-39cd-43d4-8e1a-dab4aff6de3c	dbc241e1-a237-4b97-b8c1-db367ae07cc0	reservations.delete.soft	reservation	1a41bd8d-12e5-4b1e-9509-87f7d7c3953b	delete	Réservation annulée (undefined)	{"new_status": "cancelled", "total_paid": 0, "payeur_name": "Lea Lili", "total_price": 3000, "payeur_email": "sohlaurent3@gmail.com", "previous_status": "cancelled"}	success	::ffff:127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36 Edg/143.0.0.0	2025-12-09 21:37:30.38+01
78463101-2b7e-4dfb-b21f-2273ef2d6058	02ae193b-0f63-42df-b039-d984998f0d2a	public.reservation.create	reservation	0de178ec-777d-455b-99ec-96663e0b8738	create	Réservation publique créée pour Righteous  Atasiri - Forfait: SIMPLE	{"status": "pending", "pack_id": "7c209804-be05-48dc-b14d-4d8bf63c19df", "quantity": 1, "pack_name": "SIMPLE", "payeur_name": "Righteous  Atasiri", "total_price": 3000, "payeur_email": "iamshatan17@gmail.com", "payeur_phone": "237693166393", "participants_count": 1}	success	::ffff:127.0.0.1	Mozilla/5.0 (iPhone; CPU iPhone OS 18_3_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.3.1 Mobile/15E148 Safari/604.1	2025-12-09 22:38:23.519+01
a5710ac2-7540-451b-ae92-f3bd45ace7b1	02ae193b-0f63-42df-b039-d984998f0d2a	public.reservation.create	reservation	f0a4a00e-bd08-4ac4-abc6-834b97869450	create	Réservation publique créée pour Ivan Junior  KETCHAPA - Forfait: COUPLE	{"status": "pending", "pack_id": "b8249ec2-993a-4140-902b-6bfad049a1b6", "quantity": 2, "pack_name": "COUPLE", "payeur_name": "Ivan Junior  KETCHAPA", "total_price": 8000, "payeur_email": "juniorketchapa3@gmail.com", "payeur_phone": "237698947179", "participants_count": 2}	success	::ffff:127.0.0.1	Mozilla/5.0 (Linux; U; Android 13; fr-fr; Redmi Note 10 5G Build/TP1A.220624.014) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/100.0.4896.127 Mobile Safari/537.36 XiaoMi/MiuiBrowser/13.25.2.2-gn	2025-12-10 21:38:18.929+01
04801b9e-b7b2-4905-87f5-1cadccc9c65c	02ae193b-0f63-42df-b039-d984998f0d2a	public.reservation.create	reservation	5c4ee137-c143-499a-9c13-1b2c3c4d5909	create	Réservation publique créée pour joseph bakoa - Forfait: VIP	{"status": "pending", "pack_id": "b62e0c02-e4ff-4e86-8c46-ed7e6acc9eb8", "quantity": 1, "pack_name": "VIP", "payeur_name": "joseph bakoa", "total_price": 5000, "payeur_email": "kalihacker98@gmail.com", "payeur_phone": "237698285723", "participants_count": 1}	success	::ffff:127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36 Edg/143.0.0.0	2025-12-10 22:48:30.051+01
4ce2ab31-87ff-4768-a11d-607bf52cef6e	02ae193b-0f63-42df-b039-d984998f0d2a	reservations.delete.soft	reservation	1a41bd8d-12e5-4b1e-9509-87f7d7c3953b	delete	Réservation annulée (undefined)	{"new_status": "cancelled", "total_paid": 0, "payeur_name": "Lea Lili", "total_price": 3000, "payeur_email": "sohlaurent3@gmail.com", "previous_status": "cancelled"}	success	::ffff:127.0.0.1	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.1 Mobile/15E148 Safari/604.1	2025-12-11 05:47:10.758+01
3f89e5ed-121b-4852-b7f3-105eeffa4cc9	02ae193b-0f63-42df-b039-d984998f0d2a	reservations.delete.soft	reservation	1a41bd8d-12e5-4b1e-9509-87f7d7c3953b	delete	Réservation annulée (undefined)	{"new_status": "cancelled", "total_paid": 0, "payeur_name": "Lea Lili", "total_price": 3000, "payeur_email": "sohlaurent3@gmail.com", "previous_status": "cancelled"}	success	::ffff:127.0.0.1	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.1 Mobile/15E148 Safari/604.1	2025-12-11 05:47:14.823+01
aca84244-83f2-4541-83f9-d2f871c40cb4	02ae193b-0f63-42df-b039-d984998f0d2a	public.reservation.create	reservation	948b8dd9-ba89-4b3d-8b28-96db8e7d541d	create	Réservation publique créée pour Franck Ryan CHAMEN NKONGMENECK - Forfait: VIP	{"status": "pending", "pack_id": "b62e0c02-e4ff-4e86-8c46-ed7e6acc9eb8", "quantity": 1, "pack_name": "VIP", "payeur_name": "Franck Ryan CHAMEN NKONGMENECK", "total_price": 5000, "payeur_email": "chamenfranck@gmail.com", "payeur_phone": "237697360550", "participants_count": 1}	success	::ffff:127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36 Edg/143.0.0.0	2025-12-12 14:14:08.248+01
0db5e953-7883-4952-8b3c-06cf2e0bdcf1	02ae193b-0f63-42df-b039-d984998f0d2a	public.reservation.create	reservation	6ec62590-e4e7-4190-972e-b9609ebcd23b	create	Réservation publique créée pour Jeff Anthony  TCHALLA TCHASSEM - Forfait: COUPLE	{"status": "pending", "pack_id": "b8249ec2-993a-4140-902b-6bfad049a1b6", "quantity": 2, "pack_name": "COUPLE", "payeur_name": "Jeff Anthony  TCHALLA TCHASSEM", "total_price": 8000, "payeur_email": "jefftchass@gmail.com", "payeur_phone": "237655851766", "participants_count": 2}	success	::ffff:127.0.0.1	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Mobile Safari/537.36	2025-12-12 16:23:33.545+01
10840423-f246-4326-ad91-813699eaaeb8	02ae193b-0f63-42df-b039-d984998f0d2a	public.reservation.create	reservation	49e02951-ae2a-453f-90fd-f302c1cd7c8e	create	Réservation publique créée pour Marie-joséphine EMALE KANG - Forfait: VIP	{"status": "pending", "pack_id": "b62e0c02-e4ff-4e86-8c46-ed7e6acc9eb8", "quantity": 1, "pack_name": "VIP", "payeur_name": "Marie-joséphine EMALE KANG", "total_price": 5000, "payeur_email": "mariejosyek@gmail.com", "payeur_phone": "237696436352", "participants_count": 1}	success	::ffff:127.0.0.1	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.1 Mobile/15E148 Safari/604.1	2025-12-13 15:32:51.069+01
0704f9d7-c2ce-4cc9-93b4-0b01ce9264e0	02ae193b-0f63-42df-b039-d984998f0d2a	public.reservation.create	reservation	0781a9b4-28ad-4a01-995f-16b546e598c0	create	Réservation publique créée pour Sonia  Mbatchou - Forfait: COUPLE	{"status": "pending", "pack_id": "b8249ec2-993a-4140-902b-6bfad049a1b6", "quantity": 2, "pack_name": "COUPLE", "payeur_name": "Sonia  Mbatchou", "total_price": 8000, "payeur_email": "soniageorgiambatchou@icloud.com", "payeur_phone": "237657484401", "participants_count": 2}	success	::ffff:127.0.0.1	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Mobile Safari/537.36	2025-12-13 16:50:42.084+01
46680d9c-49c7-48db-a567-4111174461b1	02ae193b-0f63-42df-b039-d984998f0d2a	public.reservation.create	reservation	18511c31-345b-47a7-a018-e9239fb096a7	create	Réservation publique créée pour Paul Ernest  Ewoti - Forfait: COUPLE	{"status": "pending", "pack_id": "b8249ec2-993a-4140-902b-6bfad049a1b6", "quantity": 2, "pack_name": "COUPLE", "payeur_name": "Paul Ernest  Ewoti", "total_price": 8000, "payeur_email": "alexandreewoti527@gmail.com", "payeur_phone": "237654286327", "participants_count": 2}	success	::ffff:127.0.0.1	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Mobile Safari/537.36	2025-12-13 20:50:15.483+01
371676b6-0ec8-48e5-9043-548b3283433e	02ae193b-0f63-42df-b039-d984998f0d2a	public.reservation.create	reservation	039d7927-321e-459c-8250-31e3a2ebf3cc	create	Réservation publique créée pour Ravel  Pessy - Forfait: VIP	{"status": "pending", "pack_id": "b62e0c02-e4ff-4e86-8c46-ed7e6acc9eb8", "quantity": 1, "pack_name": "VIP", "payeur_name": "Ravel  Pessy", "total_price": 5000, "payeur_email": "tambatresor@icloud.com", "payeur_phone": "237657483769", "participants_count": 1}	success	::ffff:127.0.0.1	Mozilla/5.0 (iPhone; CPU iPhone OS 18_1_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.1.1 Mobile/15E148 Safari/604.1	2025-12-14 11:44:41.624+01
b873acc6-68c7-49b9-b5fd-7eeff54e9590	02ae193b-0f63-42df-b039-d984998f0d2a	public.reservation.create	reservation	5c75ca03-2ba3-47ff-b688-7e948bffc827	create	Réservation publique créée pour Fortune  Tagne - Forfait: COUPLE	{"status": "pending", "pack_id": "b8249ec2-993a-4140-902b-6bfad049a1b6", "quantity": 2, "pack_name": "COUPLE", "payeur_name": "Fortune  Tagne", "total_price": 8000, "payeur_email": "tagnefortune0@gmail.com", "payeur_phone": "237655443776", "participants_count": 2}	success	::ffff:127.0.0.1	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Mobile Safari/537.36	2025-12-14 13:13:16.141+01
8fb1f454-54f6-4d7b-8648-c31de979eaee	02ae193b-0f63-42df-b039-d984998f0d2a	public.reservation.create	reservation	c3218828-6ebf-4406-837c-c044c5d7451f	create	Réservation publique créée pour Teddy Ghomo - Forfait: COUPLE	{"status": "pending", "pack_id": "b8249ec2-993a-4140-902b-6bfad049a1b6", "quantity": 2, "pack_name": "COUPLE", "payeur_name": "Teddy Ghomo", "total_price": 8000, "payeur_email": "Teddyghomo714@gmail.com", "payeur_phone": "237693117127", "participants_count": 2}	success	::ffff:127.0.0.1	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Mobile Safari/537.36	2025-12-14 16:14:57.873+01
0dfe30df-57fb-4097-b0c0-11be739c3a88	02ae193b-0f63-42df-b039-d984998f0d2a	public.reservation.create	reservation	9266b89f-fb12-43a5-bf94-dc70cc357e98	create	Réservation publique créée pour Anne Vanessa  Mbazoa - Forfait: FAMILLE	{"status": "pending", "pack_id": "d90648b7-1afb-4d0d-91c7-3eaf0ddb40c3", "quantity": 3, "pack_name": "FAMILLE", "payeur_name": "Anne Vanessa  Mbazoa", "total_price": 10000, "payeur_email": "vanessambazoa9@gmail.com", "payeur_phone": "237690825139", "participants_count": 3}	success	::ffff:127.0.0.1	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.7.2 Mobile/15E148 Safari/604.1	2025-12-15 08:59:40.971+01
d21919c3-952a-4513-9140-f4b16d73aeb8	02ae193b-0f63-42df-b039-d984998f0d2a	public.reservation.create	reservation	4e8358b2-1b25-4116-a0c1-e0e6c082f82d	create	Réservation publique créée pour Paul-fany  Doumba - Forfait: SIMPLE	{"status": "pending", "pack_id": "7c209804-be05-48dc-b14d-4d8bf63c19df", "quantity": 1, "pack_name": "SIMPLE", "payeur_name": "Paul-fany  Doumba", "total_price": 3000, "payeur_email": "paul-fanydoumba@icloud.com", "payeur_phone": "237690417616", "participants_count": 1}	success	::ffff:127.0.0.1	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.1 Mobile/15E148 Safari/604.1	2025-12-15 16:25:34.876+01
a52d2b59-0a0a-4876-9468-2994ae0765e4	02ae193b-0f63-42df-b039-d984998f0d2a	packs.create	pack	acce7b77-3f10-480f-8ec0-5ef0256b01db	create	Forfait "STAND" créé avec un prix de 20000 XAF	{"name": "STAND", "price": 20000, "capacity": 3, "description": "Pack stand"}	success	::ffff:127.0.0.1	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.1 Mobile/15E148 Safari/604.1	2025-12-15 21:34:42.253+01
097e6f25-22a6-4f2b-a0b8-2ef07f8f2562	02ae193b-0f63-42df-b039-d984998f0d2a	public.reservation.create	reservation	cd3f7caf-6882-4e32-9687-7a8274f23cd5	create	Réservation publique créée pour Maeva Ntonga - Forfait: SIMPLE	{"status": "pending", "pack_id": "7c209804-be05-48dc-b14d-4d8bf63c19df", "quantity": 1, "pack_name": "SIMPLE", "payeur_name": "Maeva Ntonga", "total_price": 3000, "payeur_email": null, "payeur_phone": "237688227556", "participants_count": 1}	success	::ffff:127.0.0.1	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0.1 Mobile/15E148 Safari/604.1	2025-12-15 21:52:50.83+01
1f3b5d9b-8772-447f-9d0f-c50b76436ae4	02ae193b-0f63-42df-b039-d984998f0d2a	public.reservation.create	reservation	a29df73c-6441-4511-bd9c-001185b72b19	create	Réservation publique créée pour Tatiana Stella Elouga Gounouck - Forfait: STAND	{"status": "pending", "pack_id": "acce7b77-3f10-480f-8ec0-5ef0256b01db", "quantity": 3, "pack_name": "STAND", "payeur_name": "Tatiana Stella Elouga Gounouck", "total_price": 20000, "payeur_email": "etatianastella@gmail.com", "payeur_phone": "237693838518", "participants_count": 3}	success	::ffff:127.0.0.1	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Mobile Safari/537.36	2025-12-15 21:59:40.738+01
ef38a827-6789-4d3b-835a-94de17d9d1ec	02ae193b-0f63-42df-b039-d984998f0d2a	public.reservation.create	reservation	51f8537c-6bbf-4d1d-b7d6-f24062c7dbbb	create	Réservation publique créée pour Duva Atangana Robert - Forfait: SIMPLE	{"status": "pending", "pack_id": "7c209804-be05-48dc-b14d-4d8bf63c19df", "quantity": 1, "pack_name": "SIMPLE", "payeur_name": "Duva Atangana Robert", "total_price": 3000, "payeur_email": null, "payeur_phone": "237688227556", "participants_count": 1}	success	::ffff:127.0.0.1	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0.1 Mobile/15E148 Safari/604.1	2025-12-15 22:00:11.629+01
271a1d2f-7aaa-474f-a771-9eadb35211b4	02ae193b-0f63-42df-b039-d984998f0d2a	public.reservation.create	reservation	2e66af7f-0e9b-49d7-9267-30344e98cddf	create	Réservation publique créée pour Agathe Ngessomba - Forfait: SIMPLE	{"status": "pending", "pack_id": "7c209804-be05-48dc-b14d-4d8bf63c19df", "quantity": 1, "pack_name": "SIMPLE", "payeur_name": "Agathe Ngessomba", "total_price": 3000, "payeur_email": null, "payeur_phone": "237688227556", "participants_count": 1}	success	::ffff:127.0.0.1	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0.1 Mobile/15E148 Safari/604.1	2025-12-15 22:01:57.951+01
de2e9d23-bde4-4589-8018-8636daace3db	02ae193b-0f63-42df-b039-d984998f0d2a	public.reservation.create	reservation	0d84035d-37d8-4dab-ace9-56278bd579e8	create	Réservation publique créée pour cerena  Touna Ongono - Forfait: SIMPLE	{"status": "pending", "pack_id": "7c209804-be05-48dc-b14d-4d8bf63c19df", "quantity": 1, "pack_name": "SIMPLE", "payeur_name": "cerena  Touna Ongono", "total_price": 3000, "payeur_email": null, "payeur_phone": "237688227556", "participants_count": 1}	success	::ffff:127.0.0.1	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0.1 Mobile/15E148 Safari/604.1	2025-12-15 22:04:29.119+01
3eb0d8cc-72f4-4431-9e79-8df5e16d0be1	02ae193b-0f63-42df-b039-d984998f0d2a	public.reservation.create	reservation	297d83af-1b9f-4990-95eb-b53b90dd814e	create	Réservation publique créée pour Hilaire  Minja Ze - Forfait: STAND	{"status": "pending", "pack_id": "acce7b77-3f10-480f-8ec0-5ef0256b01db", "quantity": 3, "pack_name": "STAND", "payeur_name": "Hilaire  Minja Ze", "total_price": 20000, "payeur_email": "minjazehilaire@gmail.com", "payeur_phone": "237656915233", "participants_count": 3}	success	::ffff:127.0.0.1	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Mobile Safari/537.36	2025-12-15 22:06:59.71+01
d3d7b42c-e67c-4076-99ca-d305338b7a78	02ae193b-0f63-42df-b039-d984998f0d2a	public.reservation.create	reservation	552cd824-3f05-46f1-8ba4-8fc283ce30b9	create	Réservation publique créée pour LAETICIA  KENFACK - Forfait: STAND	{"status": "pending", "pack_id": "acce7b77-3f10-480f-8ec0-5ef0256b01db", "quantity": 3, "pack_name": "STAND", "payeur_name": "LAETICIA  KENFACK", "total_price": 20000, "payeur_email": "kenfackkakabiyvana@gmail.com", "payeur_phone": "237657399805", "participants_count": 3}	success	::ffff:127.0.0.1	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Mobile Safari/537.36	2025-12-15 22:07:51.12+01
8e2556ef-340a-449f-b6a9-dc8348379e83	02ae193b-0f63-42df-b039-d984998f0d2a	public.reservation.create	reservation	a0059aff-9bad-4d22-b3c5-88e82b898da6	create	Réservation publique créée pour Mariella BDL STUDIO NGWAMBE - Forfait: STAND	{"status": "pending", "pack_id": "acce7b77-3f10-480f-8ec0-5ef0256b01db", "quantity": 1, "pack_name": "STAND", "payeur_name": "Mariella BDL STUDIO NGWAMBE", "total_price": 20000, "payeur_email": "ngwambem@gmail.com", "payeur_phone": "237659189043", "participants_count": 1}	success	::ffff:127.0.0.1	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.7 Mobile/15E148 Safari/604.1	2025-12-16 05:20:29.97+01
c38b5663-38ce-4a20-90e8-0a0397e33d6c	02ae193b-0f63-42df-b039-d984998f0d2a	public.reservation.create	reservation	9afd72dd-37ea-4588-93b4-d756fcc2d8d4	create	Réservation publique créée pour Ze Arnauld - Forfait: COUPLE	{"status": "pending", "pack_id": "b8249ec2-993a-4140-902b-6bfad049a1b6", "quantity": 2, "pack_name": "COUPLE", "payeur_name": "Ze Arnauld", "total_price": 8000, "payeur_email": "arnauldze478@gmail.com", "payeur_phone": "237683609362", "participants_count": 2}	success	::ffff:127.0.0.1	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Mobile Safari/537.36	2025-12-16 09:30:29.576+01
655e06ad-9748-44a5-a9eb-81af6f62facc	02ae193b-0f63-42df-b039-d984998f0d2a	public.reservation.create	reservation	e7fa78e7-9215-4028-af5e-736278294dfd	create	Réservation publique créée pour nexus nexus - Forfait: SIMPLE	{"status": "pending", "pack_id": "7c209804-be05-48dc-b14d-4d8bf63c19df", "quantity": 1, "pack_name": "SIMPLE", "payeur_name": "nexus nexus", "total_price": 3000, "payeur_email": "latifnjimoluh@gmail.com", "payeur_phone": "237672475691", "participants_count": 1}	success	::ffff:127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Avast/142.0.0.0	2025-12-16 15:53:04.822+01
b5ae4721-66ab-47e7-9579-70f1a3496983	02ae193b-0f63-42df-b039-d984998f0d2a	reservations.delete.soft	reservation	e7fa78e7-9215-4028-af5e-736278294dfd	delete	Réservation annulée (undefined)	{"new_status": "cancelled", "total_paid": 0, "payeur_name": "nexus nexus", "total_price": 3000, "payeur_email": "latifnjimoluh@gmail.com", "previous_status": "pending"}	success	::ffff:127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Avast/142.0.0.0	2025-12-16 15:53:45.658+01
c491bca5-b5c3-4d42-967a-f205c9abea1a	02ae193b-0f63-42df-b039-d984998f0d2a	reservations.delete.soft	reservation	e7fa78e7-9215-4028-af5e-736278294dfd	delete	Réservation annulée (undefined)	{"new_status": "cancelled", "total_paid": 0, "payeur_name": "nexus nexus", "total_price": 3000, "payeur_email": "latifnjimoluh@gmail.com", "previous_status": "cancelled"}	success	::ffff:127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Avast/142.0.0.0	2025-12-16 17:12:34.654+01
b5932e9b-487f-49b2-8249-5bd4c60e771c	02ae193b-0f63-42df-b039-d984998f0d2a	public.reservation.create	reservation	905b14f6-6331-4dc4-9313-81a373371ce8	create	Réservation publique créée pour Tella  Laetitia - Forfait: COUPLE	{"status": "pending", "pack_id": "b8249ec2-993a-4140-902b-6bfad049a1b6", "quantity": 2, "pack_name": "COUPLE", "payeur_name": "Tella  Laetitia", "total_price": 8000, "payeur_email": null, "payeur_phone": "237696633654", "participants_count": 2}	success	::ffff:127.0.0.1	Mozilla/5.0 (iPhone; CPU iPhone OS 17_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2 Mobile/15E148 Safari/604.1	2025-12-16 19:13:45.097+01
de4ce686-7948-40e3-a8f1-11ca91e02df3	02ae193b-0f63-42df-b039-d984998f0d2a	public.reservation.create	reservation	d4a7c88b-5fe9-44e7-8452-2111d6679e8e	create	Réservation publique créée pour Dorothé gloria Engoulou - Forfait: SIMPLE	{"status": "pending", "pack_id": "7c209804-be05-48dc-b14d-4d8bf63c19df", "quantity": 1, "pack_name": "SIMPLE", "payeur_name": "Dorothé gloria Engoulou", "total_price": 3000, "payeur_email": "doumbapaul-fany@icloud.com", "payeur_phone": "237697434502", "participants_count": 1}	success	::ffff:127.0.0.1	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.1 Mobile/15E148 Safari/604.1	2025-12-16 20:05:53.315+01
aaad7206-58d7-4577-af17-f5eaafb45c97	02ae193b-0f63-42df-b039-d984998f0d2a	public.reservation.create	reservation	6b5632e3-39e5-4998-b7f2-a800de52231e	create	Réservation publique créée pour Tony Tsague - Forfait: COUPLE	{"status": "pending", "pack_id": "b8249ec2-993a-4140-902b-6bfad049a1b6", "quantity": 2, "pack_name": "COUPLE", "payeur_name": "Tony Tsague", "total_price": 8000, "payeur_email": "tsaguetony@gmail.com", "payeur_phone": "237690473113", "participants_count": 2}	success	::ffff:127.0.0.1	Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Mobile/15E148 Safari/604.1	2025-12-16 21:19:01.552+01
461f71b0-4ccb-4ef1-a927-70d39563fef5	02ae193b-0f63-42df-b039-d984998f0d2a	public.reservation.create	reservation	6bfb590a-93a2-4398-ad99-b2a67deba640	create	Réservation publique créée pour Emilie  Ze - Forfait: STAND	{"status": "pending", "pack_id": "acce7b77-3f10-480f-8ec0-5ef0256b01db", "quantity": 2, "pack_name": "STAND", "payeur_name": "Emilie  Ze", "total_price": 20000, "payeur_email": "zeemilie390@gmail.com", "payeur_phone": "237657105896", "participants_count": 2}	success	::ffff:127.0.0.1	Mozilla/5.0 (Linux; Android 11; TECNO BE7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.98 Mobile Safari/537.36	2025-12-16 21:39:57.097+01
26da44f6-7e63-45b2-816b-e2af4be668d0	02ae193b-0f63-42df-b039-d984998f0d2a	public.reservation.create	reservation	553f726b-33a5-4786-8980-21bd128692ed	create	Réservation publique créée pour Ravel Pessy - Forfait: VIP	{"status": "pending", "pack_id": "b62e0c02-e4ff-4e86-8c46-ed7e6acc9eb8", "quantity": 1, "pack_name": "VIP", "payeur_name": "Ravel Pessy", "total_price": 5000, "payeur_email": "tambatresor@icloud.com", "payeur_phone": "237657483769", "participants_count": 1}	success	::ffff:127.0.0.1	Mozilla/5.0 (iPhone; CPU iPhone OS 18_1_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.1.1 Mobile/15E148 Safari/604.1	2025-12-17 15:01:50.082+01
2cb565fa-7355-400e-a7e1-f59bcd4b9d5f	dbc241e1-a237-4b97-b8c1-db367ae07cc0	reservations.create	reservation	4dadaddb-6d54-4d63-9ff4-d6dc6ffbbb82	create	Réservation créée pour KAMENI Marguerite - Forfait: VIP	{"status": "pending", "pack_id": "b62e0c02-e4ff-4e86-8c46-ed7e6acc9eb8", "quantity": 1, "pack_name": "VIP", "payeur_name": "KAMENI Marguerite", "total_price": 5000, "payeur_email": "margueritekameni2@gmail.com", "payeur_phone": "652968611", "participants_count": 1}	success	::ffff:127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36 Edg/143.0.0.0	2025-12-17 16:00:10.725+01
b441a4ff-355a-4300-9110-57f7915cfce8	02ae193b-0f63-42df-b039-d984998f0d2a	public.reservation.create	reservation	52525a88-08af-4ff1-9e74-7342ea3556b3	create	Réservation publique créée pour NLOGA  ALEX - Forfait: SIMPLE	{"status": "pending", "pack_id": "7c209804-be05-48dc-b14d-4d8bf63c19df", "quantity": 1, "pack_name": "SIMPLE", "payeur_name": "NLOGA  ALEX", "total_price": 3000, "payeur_email": "latredesign22@gmail.com", "payeur_phone": "237697783", "participants_count": 1}	success	::ffff:127.0.0.1	Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Mobile Safari/537.36	2025-12-17 18:09:26.944+01
37d37b68-2dc4-466b-b91e-d5baa71d2e3a	dbc241e1-a237-4b97-b8c1-db367ae07cc0	reservations.delete.permanent	reservation	a0059aff-9bad-4d22-b3c5-88e82b898da6	delete	Réservation supprimée définitivement (undefined)	{"status": "pending", "total_paid": 0, "payeur_name": "Mariella BDL STUDIO NGWAMBE", "total_price": 20000, "payeur_email": "ngwambem@gmail.com", "deleted_related_data": {"payments": 0, "participants": 1}}	success	::ffff:127.0.0.1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36 Edg/143.0.0.0	2025-12-17 19:04:40.485+01
40cce6c6-b49a-40be-abe1-c5aee01fecea	02ae193b-0f63-42df-b039-d984998f0d2a	public.reservation.create	reservation	bb8d5c26-4cc6-4a6c-9dbf-f794cefac2b3	create	Réservation publique créée pour Anas Farid Njimoluh - Forfait: VIP	{"status": "pending", "pack_id": "b62e0c02-e4ff-4e86-8c46-ed7e6acc9eb8", "quantity": 1, "pack_name": "VIP", "payeur_name": "Anas Farid Njimoluh", "total_price": 5000, "payeur_email": "latifnjimoluh@gmail.com", "payeur_phone": "237672475691", "participants_count": 1}	success	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	2025-12-21 15:41:38.896+01
323dd673-20f3-4448-a1e6-889f6ca236b9	282162e8-232a-4635-8bea-437ced2365e2	reservations.create	reservation	4c0e3b42-e279-4604-a498-0bc81ae09b1e	create	Réservation créée pour latif njimoluh - Forfait: STAND	{"status": "pending", "pack_id": "acce7b77-3f10-480f-8ec0-5ef0256b01db", "quantity": 1, "pack_name": "STAND", "payeur_name": "latif njimoluh", "total_price": 20000, "payeur_email": "latifnjimoluh@gmail.com", "payeur_phone": "658509963", "participants_count": 1}	success	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36	2026-03-24 08:41:21.482+01
4d3f0260-3496-4613-8bd8-f0100dba8ac2	282162e8-232a-4635-8bea-437ced2365e2	reservations.create	reservation	1aeb340c-48c3-4eff-ba55-f55f52cc9df2	create	Réservation créée pour latif njimoluh - Forfait: COUPLE	{"status": "pending", "pack_id": "b8249ec2-993a-4140-902b-6bfad049a1b6", "quantity": 1, "pack_name": "COUPLE", "payeur_name": "latif njimoluh", "total_price": 8000, "payeur_email": "latifnjimoluh@gmail.com", "payeur_phone": "658509963", "participants_count": 3}	success	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36	2026-03-24 09:14:34.52+01
5dfd749d-adc4-458b-8325-e3feed8ab112	282162e8-232a-4635-8bea-437ced2365e2	reservations.create	reservation	d569c5ec-1b98-45c9-a52d-4f086fdbbc37	create	Réservation créée pour latif njimoluh - Forfait: COUPLE	{"status": "pending", "pack_id": "b8249ec2-993a-4140-902b-6bfad049a1b6", "quantity": 1, "pack_name": "COUPLE", "payeur_name": "latif njimoluh", "total_price": 8000, "payeur_email": "latifnjimoluh@gmail.com", "payeur_phone": "658509963", "participants_count": 2}	success	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36	2026-03-24 09:58:34.515+01
7a66b5ae-697c-492f-bcb1-e7b10536816c	282162e8-232a-4635-8bea-437ced2365e2	packs.edit	pack	d90648b7-1afb-4d0d-91c7-3eaf0ddb40c3	update	Forfait "FAMILLE" modifié	{"capacity": {"to": 4, "from": 5}}	success	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36	2026-03-24 10:16:39.097+01
6f35e81a-b684-4d2e-ad2d-62c27ead09b6	282162e8-232a-4635-8bea-437ced2365e2	packs.edit	pack	d90648b7-1afb-4d0d-91c7-3eaf0ddb40c3	update	Forfait "FAMILLE" modifié	{"capacity": {"to": 5, "from": 4}}	success	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36	2026-03-24 10:24:52.708+01
4a56a8b8-8326-4dc1-a312-a20ba5c111c1	02ae193b-0f63-42df-b039-d984998f0d2a	content.edit	film	e7a4815c-bf2c-4046-bc5f-c73c0e2a8f8f	update	Film "Zootopie 2 (2025)" modifié	{"year": "2025", "duration": "115 min", "genre_en": "Family, Animation, Comedy, Adventure", "genre_fr": "Famille, Animation, Comédie, Aventure", "title_en": "Zootopia 2 (2025)", "title_fr": "Zootopie 2 (2025)", "image_url": "/uploads/films/film-1774350945384-50188926.png", "is_active": "true", "country_en": "United States", "country_fr": "États-Unis", "synopsis_en": "In this long-awaited sequel, Judy Hopps and Nick Wilde are back on the case to face a new threat to the balance of Zootopia. Between investigations, humor and strong messages about tolerance, the duo must once again prove that differences are a strength.", "synopsis_fr": "Dans cette suite très attendue, Judy Hopps et Nick Wilde reprennent du service pour faire face à une nouvelle affaire qui menace l'équilibre de la ville de Zootopie. Entre enquêtes, humour et messages forts sur la tolérance et le vivre-ensemble, le duo devra une fois de plus prouver que les différences sont une force.", "youtube_url": "#", "display_order": "0", "screening_time": "18h30", "classification_en": "All audiences", "classification_fr": "Tout public"}	success	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36	2026-03-24 12:15:45.602+01
82567104-606a-416f-b360-f4c4fb8a3071	02ae193b-0f63-42df-b039-d984998f0d2a	content.edit	film	e7a4815c-bf2c-4046-bc5f-c73c0e2a8f8f	update	Film "Zootopie 2 (2025)" modifié	{"year": "2025", "duration": "115 min", "genre_en": "Family, Animation, Comedy, Adventure", "genre_fr": "Famille, Animation, Comédie, Aventure", "title_en": "Zootopia 2 (2025)", "title_fr": "Zootopie 2 (2025)", "image_url": "/uploads/films/film-1774351284736-190038790.png", "is_active": "true", "country_en": "United States", "country_fr": "États-Unis", "synopsis_en": "In this long-awaited sequel, Judy Hopps and Nick Wilde are back on the case to face a new threat to the balance of Zootopia. Between investigations, humor and strong messages about tolerance, the duo must once again prove that differences are a strength.", "synopsis_fr": "Dans cette suite très attendue, Judy Hopps et Nick Wilde reprennent du service pour faire face à une nouvelle affaire qui menace l'équilibre de la ville de Zootopie. Entre enquêtes, humour et messages forts sur la tolérance et le vivre-ensemble, le duo devra une fois de plus prouver que les différences sont une force.", "youtube_url": "#", "display_order": "0", "screening_time": "18h30", "classification_en": "All audiences", "classification_fr": "Tout public"}	success	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36	2026-03-24 12:21:24.855+01
52a7e2bf-d02c-4e4d-9ce8-b8c6eed9793a	02ae193b-0f63-42df-b039-d984998f0d2a	content.edit	testimonial	5bb98428-6341-4296-b86a-26c8887317a0	update	Témoignage de "undefined" modifié	{"author": "Brooklyn", "rating": "5", "edition": "Decembre 2024", "quote_en": "A magical experience! The organization was impeccable, the atmosphere warm, and the films excellent. We will definitely come back for the next edition.", "quote_fr": "Une expérience magique ! L'organisation était impeccable, l'ambiance chaleureuse, et les films excellents. Nous reviendrons avec plaisir pour la prochaine édition.", "image_url": "/uploads/testimonials/avatar-1774351419091-541791766.png", "is_active": "true", "pack_name": "Pack Famille", "display_order": "0"}	success	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36	2026-03-24 12:23:39.121+01
181d1ebc-06ca-453e-9662-e25bd7305753	02ae193b-0f63-42df-b039-d984998f0d2a	content.delete	film	cc99ccb8-8fc5-4bc4-98f8-624f95adf012	delete	Film "n" supprimé	{}	success	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36	2026-03-24 12:27:52.08+01
65e2bd2e-bf58-4245-80fd-29e936bdeac6	02ae193b-0f63-42df-b039-d984998f0d2a	content.edit	film	e7a4815c-bf2c-4046-bc5f-c73c0e2a8f8f	update	Film "Zootopie 2 (2025)" modifié	{"year": "2025", "duration": "115 min", "genre_en": "Family, Animation, Comedy, Adventure", "genre_fr": "Famille, Animation, Comédie, Aventure", "title_en": "Zootopia 2 (2025)", "title_fr": "Zootopie 2 (2025)", "image_url": "/uploads/films/film-1774351679288-777872502.jpeg", "is_active": "true", "country_en": "United States", "country_fr": "États-Unis", "synopsis_en": "In this long-awaited sequel, Judy Hopps and Nick Wilde are back on the case to face a new threat to the balance of Zootopia. Between investigations, humor and strong messages about tolerance, the duo must once again prove that differences are a strength.", "synopsis_fr": "Dans cette suite très attendue, Judy Hopps et Nick Wilde reprennent du service pour faire face à une nouvelle affaire qui menace l'équilibre de la ville de Zootopie. Entre enquêtes, humour et messages forts sur la tolérance et le vivre-ensemble, le duo devra une fois de plus prouver que les différences sont une force.", "youtube_url": "#", "display_order": "0", "screening_time": "18h30", "classification_en": "All audiences", "classification_fr": "Tout public"}	success	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36	2026-03-24 12:27:59.314+01
\.


--
-- Data for Name: daily_visits; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.daily_visits (id, visit_date, total_visits, unique_visitors, created_at, updated_at) FROM stdin;
8090c3d7-1ae4-4fa0-98bd-7cf533c32d16	2025-12-10	102	0	2025-12-10 07:21:13.02+01	2025-12-10 23:39:36.201+01
ee411d0b-f61f-4cef-9808-a40461f1d714	2025-12-07	214	0	2025-12-07 13:49:25.493+01	2025-12-08 00:48:54.076+01
afd5b404-a5dd-4bc3-b3b9-2b2c90d67af6	2025-12-09	129	0	2025-12-09 01:00:08.932+01	2025-12-10 00:45:08.433+01
7c35b4a0-b11d-43c1-9828-10f993662428	2025-12-18	13	1	2025-12-18 02:28:37.836+01	2025-12-18 10:27:11.867+01
243d2d4a-0e10-4b65-94ba-e90c2db18681	2025-12-13	95	0	2025-12-13 07:25:04.329+01	2025-12-14 00:27:23.737+01
9aa4e908-714d-46e3-a662-820a516e0519	2025-12-08	181	0	2025-12-08 01:44:59.878+01	2025-12-09 00:59:20.761+01
3842659a-7adb-4c70-b229-eb4378e41014	2025-12-12	44	0	2025-12-12 01:52:49.252+01	2025-12-13 00:53:02.6+01
92240a87-8b74-4659-9bcd-d0e5725baf1b	2025-12-15	103	1	2025-12-15 01:28:19.076+01	2025-12-16 00:26:17.573+01
ea104bbe-88c8-4d34-8063-75bc2067aada	2025-12-14	115	1	2025-12-14 01:32:30.791+01	2025-12-15 00:49:28.774+01
37cd0886-b970-495b-ae7d-375fe0ece687	2025-12-11	37	0	2025-12-11 01:04:30.457+01	2025-12-12 00:48:03.981+01
3c9cd922-d01a-4e5b-b84b-25d06e815f94	2025-12-16	71	0	2025-12-16 03:12:48.864+01	2025-12-17 00:19:27+01
b6b6de82-12d4-495e-a446-54357cd0da36	2025-12-17	56	0	2025-12-17 01:13:39.636+01	2025-12-18 00:39:54.856+01
e1254e18-2597-4836-8b67-51917e378999	2025-12-21	3	1	2025-12-21 15:32:34.68+01	2025-12-21 15:42:16.318+01
4761e1da-2e43-48a0-a633-b578bd25a51c	2026-03-24	47	0	2026-03-24 02:42:00.516+01	2026-03-24 12:29:08.692+01
263f6a7e-d845-40ad-90f1-fe81a7f9ee50	2026-04-03	6	0	2026-04-03 22:11:01.922+01	2026-04-04 00:51:55.599+01
8045aec2-d15b-48bb-992e-057b73482204	2026-04-04	14	0	2026-04-04 01:24:38.253+01	2026-04-04 18:34:41.518+01
\.


--
-- Data for Name: donations; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.donations (id, donor_name, amount, email, payment_status, transaction_id, "createdAt", "updatedAt", proof_url) FROM stdin;
0d4c2076-4df4-4c09-927b-f0702f0c3637	qq	100000.00	latifnjimoluh@gmail.com	completed	\N	2026-04-04 01:14:32.317+01	2026-04-04 01:25:48.497+01	\N
\.


--
-- Data for Name: event_config; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.event_config (id, key, value, type, label, "group", "createdAt", "updatedAt") FROM stdin;
06a19e70-aab5-4ed7-a3b2-ec00b7511300	tagline	Une soirée cinéma unique, sous les étoiles de Yaoundé.	text	Tagline principale	hero	2026-03-24 08:00:24.532+01	2026-03-24 08:00:24.532+01
9ef394fd-05d0-480a-a50a-27b215cb7569	subtitle	Ambiance · Films · Expérience Printanière	text	Sous-tagline	hero	2026-03-24 08:00:24.536+01	2026-03-24 08:00:24.536+01
0117990a-da9c-4561-97f8-de1f20a4517d	social_proof	🎟️ Plus de 100 participants lors de la dernière édition	text	Preuve sociale	hero	2026-03-24 08:00:24.541+01	2026-03-24 08:00:24.541+01
cd808a75-919b-4ec2-ae27-2710393ff6fc	particle_symbols	["🌸","🌼","🌿","🌺","🥚","✨","🌱","🐣"]	json	Symboles particules	hero	2026-03-24 08:00:24.544+01	2026-03-24 08:00:24.544+01
052fa75f-a8b2-4653-9301-767835f0d5b3	location_lat	3.876146	number	Latitude GPS	location	2026-03-24 08:00:24.549+01	2026-03-24 08:00:24.549+01
288a8cf0-6c27-4dc6-b9f2-77cc1e69d794	location_lng	11.518691	number	Longitude GPS	location	2026-03-24 08:00:24.553+01	2026-03-24 08:00:24.553+01
66cfb015-ca33-4274-837d-795b16bf6344	films_badge	🎬 Programme Pâques 2026	text	Badge section Films	films	2026-03-24 08:00:24.558+01	2026-03-24 08:00:24.558+01
ee40c6c0-6c14-471e-99c5-193ccac8a197	films_description	Deux films soigneusement sélectionnés pour une soirée inoubliable.	text	Description section Films	films	2026-03-24 08:00:24.562+01	2026-03-24 08:00:24.562+01
109af107-e99c-45cd-a58b-c821bf0180d7	pricing_badge	🎟️ Choisissez votre expérience	text	Badge section Tarifs	pricing	2026-03-24 08:00:24.565+01	2026-03-24 08:00:24.565+01
ed15c2c2-79fa-4872-b87a-c09e410d5345	contact_phone	+237 697 30 44 50	text	Téléphone affiché	contact	2026-03-24 08:00:24.569+01	2026-03-24 08:00:24.569+01
26af3938-edf5-42ec-8d02-8815e54a0224	contact_email	matangabrooklyn@gmail.com	text	Email affiché	contact	2026-03-24 08:00:24.577+01	2026-03-24 08:00:24.577+01
dcdf42a0-7a0f-4f2e-a77e-bfba4973770a	contact_whatsapp	237697304450	text	Numéro WhatsApp	contact	2026-03-24 08:00:24.58+01	2026-03-24 08:00:24.58+01
266afccf-8af7-4193-90a9-ae904b876c71	edition_label	🐣 Édition Pâques 2026	text	Badge édition	hero	2026-03-24 08:00:24.479+01	2026-03-24 08:11:55.13+01
\.


--
-- Data for Name: films; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.films (id, title_fr, title_en, genre_fr, genre_en, year, country_fr, country_en, duration, synopsis_fr, synopsis_en, classification_fr, classification_en, poster_url, youtube_url, screening_time, display_order, is_active, "createdAt", "updatedAt", image_url) FROM stdin;
7b3176ff-93a3-4d30-9e0e-e4bc0f7bd895	Saw IV (2007)	Saw IV (2007)	Horreur, Thriller, Mystère	Horror, Thriller, Mystery	2007	Royaume-Uni | États-Unis | Canada	United Kingdom | United States | Canada	93 min	Alors que le tueur au puzzle Jigsaw semble avoir disparu, une nouvelle série de jeux macabres débute. L'enquête plonge au cœur d'un réseau complexe de choix moraux, de pièges redoutables et de révélations sombres, où chaque décision peut coûter la vie.	As the Jigsaw killer appears to have died, a new series of macabre traps begins. The investigation dives into a complex web of moral choices, deadly traps and dark revelations, where every decision can cost a life.	Interdit aux moins de 18 ans	18+	/saw.jpeg	#	22h00	1	t	2026-03-24 08:00:24.439+01	2026-03-24 08:14:02.223+01	\N
e7a4815c-bf2c-4046-bc5f-c73c0e2a8f8f	Zootopie 2 (2025)	Zootopia 2 (2025)	Famille, Animation, Comédie, Aventure	Family, Animation, Comedy, Adventure	2025	États-Unis	United States	115 min	Dans cette suite très attendue, Judy Hopps et Nick Wilde reprennent du service pour faire face à une nouvelle affaire qui menace l'équilibre de la ville de Zootopie. Entre enquêtes, humour et messages forts sur la tolérance et le vivre-ensemble, le duo devra une fois de plus prouver que les différences sont une force.	In this long-awaited sequel, Judy Hopps and Nick Wilde are back on the case to face a new threat to the balance of Zootopia. Between investigations, humor and strong messages about tolerance, the duo must once again prove that differences are a strength.	Tout public	All audiences	/zootopie.jpeg	#	18h30	0	t	2026-03-24 08:00:24.439+01	2026-03-24 12:27:59.298+01	/uploads/films/film-1774351679288-777872502.jpeg
\.


--
-- Data for Name: packs; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.packs (id, name, price, description, capacity, is_active, "createdAt", "updatedAt") FROM stdin;
b8249ec2-993a-4140-902b-6bfad049a1b6	COUPLE	8000	Pack Couple	2	t	2025-12-04 21:19:42.967+01	2025-12-05 00:48:34.803+01
b62e0c02-e4ff-4e86-8c46-ed7e6acc9eb8	VIP	5000	Pack VIP	1	t	2025-12-04 21:19:21.066+01	2025-12-05 00:48:46.277+01
7c209804-be05-48dc-b14d-4d8bf63c19df	SIMPLE	3000	Pack Simple	1	t	2025-12-04 21:16:48.675+01	2025-12-05 00:48:56.614+01
acce7b77-3f10-480f-8ec0-5ef0256b01db	STAND	20000	Pack stand	3	t	2025-12-15 21:34:42.232+01	2025-12-15 21:34:42.232+01
d90648b7-1afb-4d0d-91c7-3eaf0ddb40c3	FAMILLE	10000	Pack Famille 	5	t	2025-12-04 21:20:55.144+01	2026-03-24 10:24:52.691+01
\.


--
-- Data for Name: participants; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.participants (id, reservation_id, name, phone, email, ticket_id, entrance_validated, "createdAt", "updatedAt") FROM stdin;
33c3e42a-43f6-415d-8aa6-7d88f1884c69	9e4d9498-334b-40d7-91bd-e8341cbb6448	Abdel Ndichout	237656937672	ndichout1984@icloud.com	\N	f	2025-12-05 23:47:30.746+01	2025-12-05 23:47:30.746+01
c0a05bae-12c2-4fb7-a327-9c199432ea0c	9e4d9498-334b-40d7-91bd-e8341cbb6448	Merveille  Umwizerwa	696434752	merveillebenji@gmail.com	\N	f	2025-12-05 23:47:30.749+01	2025-12-05 23:47:30.749+01
3b104061-4550-4240-ad79-6b57ba1b4488	b00a2e24-c8c3-4cb6-94b8-662a3668e3df	Esrdra  Tagne	237675433571	tagnefortune0@gmail.com	\N	f	2025-12-06 07:03:54.096+01	2025-12-06 07:03:54.097+01
38f4f914-155d-4d74-b57f-12ba3b2bb97c	b00a2e24-c8c3-4cb6-94b8-662a3668e3df	Mégane  Nguepinssi	656809124	\N	\N	f	2025-12-06 07:03:54.1+01	2025-12-06 07:03:54.1+01
9fc89e34-5b9c-466d-8d56-888402c2213c	1f4644eb-735f-460f-a48b-fb2b5b8380bb	Gilbert Fonkeng	237698541239	gilfonkeng@gmail.com	\N	f	2025-12-06 12:18:14.639+01	2025-12-06 12:18:14.639+01
40febe83-17d6-45dc-90a7-02e5283c186f	40ba10ac-f663-41b0-95dd-3ee34f1894ec	Fresnel Mouaffo	237672267714	fresnelmouaffo@gmail.com	\N	f	2025-12-06 13:38:03.785+01	2025-12-06 13:38:03.785+01
018dabf3-6528-4d62-ad18-b379ee62590a	40ba10ac-f663-41b0-95dd-3ee34f1894ec	Syntiche ASSABDJEU	688303459	synticheassabdjeu@gmail.com	\N	f	2025-12-06 13:38:03.789+01	2025-12-06 13:38:03.789+01
9fa68a18-4290-451b-b6db-79508de7935c	fabeed06-d3a9-43b6-8408-67df94295eec	Yannick Mombou nitcheu	237655377730	iamyannick237@gmail.com	\N	f	2025-12-06 15:42:24.128+01	2025-12-06 15:42:24.128+01
abfe7e65-d38e-4d24-99ef-4458ed02bd26	647a5486-b263-4564-846a-5c74ac183fdd	Laetitia Belva  Ngamanga	237694664897	laetitiangamanga7@gmail.com	\N	f	2025-12-06 20:56:36.034+01	2025-12-06 20:56:36.035+01
c4167ef5-4b4d-49a6-9f0a-b073d19d3f03	647a5486-b263-4564-846a-5c74ac183fdd	David Robynn  Otya’a Messi	694664897	laetitiangamanga7@gmail.com	\N	f	2025-12-06 20:56:36.037+01	2025-12-06 20:56:36.038+01
cbfd4444-a533-40d7-8c2a-89535b5f5fe4	a887aff5-10ad-450e-b60d-f0cb7a95c877	Rayan Arnold KOMBOU KAMDOUM	237673069061	rayankamdoum12@gmail.com	\N	f	2025-12-08 07:40:18.181+01	2025-12-08 07:40:18.181+01
fe17e0a1-9202-4267-9e62-0d4e888294ce	12e2ee73-7be7-4cd7-a63a-cd12fa9a0b8a	Gabriel Fokou	237658980051	gabrielfokou26@gmail.com	\N	f	2025-12-08 08:50:40.922+01	2025-12-08 08:50:40.922+01
8923f82a-4e49-4a5d-9fef-370e6bf1a343	12e2ee73-7be7-4cd7-a63a-cd12fa9a0b8a	Morel cœurtis	+237 6 54 19 79 66	\N	\N	f	2025-12-08 08:50:40.924+01	2025-12-08 08:50:40.924+01
6a57ab65-f647-4169-802f-79a24f648b93	12e2ee73-7be7-4cd7-a63a-cd12fa9a0b8a	Cedrick  Claver	6 96 31 51 69	\N	\N	f	2025-12-08 08:50:40.926+01	2025-12-08 08:50:40.926+01
893200b0-e842-4ac7-968c-0e7cb16eb1f8	12e2ee73-7be7-4cd7-a63a-cd12fa9a0b8a	Stella  Lori	674148151	\N	\N	f	2025-12-08 08:50:40.927+01	2025-12-08 08:50:40.927+01
6b2c7554-c653-4924-9906-f11db041b8ef	12e2ee73-7be7-4cd7-a63a-cd12fa9a0b8a	Viny Dornel	+237 6 77 98 30 28	\N	\N	f	2025-12-08 08:50:40.931+01	2025-12-08 08:50:40.931+01
94549fe0-2455-42cb-a3a6-b1adae469cf4	1a41bd8d-12e5-4b1e-9509-87f7d7c3953b	Lea Lili	237653254219	sohlaurent3@gmail.com	\N	f	2025-12-08 10:52:25.278+01	2025-12-08 10:52:25.278+01
139fc497-5e17-48cc-a04a-8aa77bec4fca	47de6424-a45b-4dc2-a0b0-b4cde0ac4248	Nathanaël  Tamba	237682973174	Koltanatamba@gmail.com	\N	f	2025-12-08 20:47:16.133+01	2025-12-08 20:47:16.134+01
4479dd55-de65-48be-8618-557378626c45	47de6424-a45b-4dc2-a0b0-b4cde0ac4248	Divine  Divine	6 58 43 58 82	\N	\N	f	2025-12-08 20:47:16.137+01	2025-12-08 20:47:16.137+01
c3469941-1813-4baa-9755-b47d409466bd	4b61138c-61b2-445d-957b-cf536c5c8218	Michel Zama	237696971336	zamamichel@icloud.com	\N	f	2025-12-08 21:32:31.197+01	2025-12-08 21:32:31.197+01
34fc6541-cdec-4c91-a307-941af3485de4	4b61138c-61b2-445d-957b-cf536c5c8218	Morelle  Ayissi	696971336	zamamichel@icloud.com	\N	f	2025-12-08 21:32:31.199+01	2025-12-08 21:32:31.199+01
3753067a-9806-49a9-add8-0b3184cfe43d	f95ff1e4-2e83-4551-b305-03c5fdb84c86	FRIEDE STERN VON  NDOM	237657402824	vonstern7@gmail.com	\N	f	2025-12-08 23:22:30.141+01	2025-12-08 23:22:30.141+01
f20a2492-e220-4208-9269-3cd2ec68ecb9	c66b8541-8701-4f32-8aff-d31b44a81d90	Amstrong Florent  TANKEU	237656512217	ammstrongkapseu@gmail.com	\N	f	2025-12-09 08:27:24.087+01	2025-12-09 08:27:24.088+01
afa19307-473b-4af7-afb0-05635856edb4	c66b8541-8701-4f32-8aff-d31b44a81d90	Sephora leticia Djoum	656512217	amstrongkapseu@gmail.com	\N	f	2025-12-09 08:27:24.09+01	2025-12-09 08:27:24.09+01
441ca9fb-9f5e-470d-b790-0e73f6ebd57c	0de178ec-777d-455b-99ec-96663e0b8738	Righteous  Atasiri	237693166393	iamshatan17@gmail.com	\N	f	2025-12-09 22:38:23.509+01	2025-12-09 22:38:23.509+01
32544282-46ce-4ed6-817f-94b08f4f17f5	f0a4a00e-bd08-4ac4-abc6-834b97869450	Ivan Junior  KETCHAPA	237698947179	juniorketchapa3@gmail.com	\N	f	2025-12-10 21:38:18.919+01	2025-12-10 21:38:18.919+01
e32ed915-9bb5-486c-97a3-099c2b5e5df8	f0a4a00e-bd08-4ac4-abc6-834b97869450	Fortune Rahina TAWAMBA	696083698	juniorketchapa3@gmail.com	\N	f	2025-12-10 21:38:18.921+01	2025-12-10 21:38:18.921+01
c71e0133-7404-4698-8927-de9ddb564e36	5c4ee137-c143-499a-9c13-1b2c3c4d5909	joseph bakoa	237698285723	kalihacker98@gmail.com	\N	f	2025-12-10 22:48:30.041+01	2025-12-10 22:48:30.041+01
2fd78d13-690a-415b-b5ff-5c263b6bd95d	948b8dd9-ba89-4b3d-8b28-96db8e7d541d	Franck Ryan CHAMEN NKONGMENECK	237697360550	chamenfranck@gmail.com	\N	f	2025-12-12 14:14:08.238+01	2025-12-12 14:14:08.239+01
2dc9f828-e951-414b-8156-d07ba2b92a07	6ec62590-e4e7-4190-972e-b9609ebcd23b	Jeff Anthony  TCHALLA TCHASSEM	237655851766	jefftchass@gmail.com	\N	f	2025-12-12 16:23:33.535+01	2025-12-12 16:23:33.535+01
ae7cc187-40dd-4e63-a97f-17d2874d0497	6ec62590-e4e7-4190-972e-b9609ebcd23b	Audrey Léonce  Nassara	6 94 07 09 12	\N	\N	f	2025-12-12 16:23:33.537+01	2025-12-12 16:23:33.537+01
0760aba9-abba-41a8-817f-287202db6c77	49e02951-ae2a-453f-90fd-f302c1cd7c8e	Marie-joséphine EMALE KANG	237696436352	mariejosyek@gmail.com	\N	f	2025-12-13 15:32:51.054+01	2025-12-13 15:32:51.054+01
9d391639-f2c1-4f2b-9d33-b8953f8b4060	0781a9b4-28ad-4a01-995f-16b546e598c0	Sonia  Mbatchou	237657484401	soniageorgiambatchou@icloud.com	\N	f	2025-12-13 16:50:42.075+01	2025-12-13 16:50:42.075+01
884e5312-8a41-473b-810d-6ad280470e23	0781a9b4-28ad-4a01-995f-16b546e598c0	Brendaine Tina	6 91 06 22 03	Tinabrendaines@icloud.com	\N	f	2025-12-13 16:50:42.079+01	2025-12-13 16:50:42.079+01
abf3e336-40a5-45ba-8f68-d31cbacfa5b4	18511c31-345b-47a7-a018-e9239fb096a7	Paul Ernest  Ewoti	237654286327	alexandreewoti527@gmail.com	\N	f	2025-12-13 20:50:15.475+01	2025-12-13 20:50:15.475+01
b90fba10-f36d-4809-ad02-eda395786a3b	18511c31-345b-47a7-a018-e9239fb096a7	Sharon Glory Yassi syuidi	\N	\N	\N	f	2025-12-13 20:50:15.477+01	2025-12-13 20:50:15.477+01
1090635f-e299-4e00-a59f-36be2751b897	039d7927-321e-459c-8250-31e3a2ebf3cc	Ravel  Pessy	237657483769	tambatresor@icloud.com	\N	f	2025-12-14 11:44:41.612+01	2025-12-14 11:44:41.613+01
38cf6b2c-334a-4c6e-b454-2d016bc8cac9	5c75ca03-2ba3-47ff-b688-7e948bffc827	Fortune  Tagne	237655443776	tagnefortune0@gmail.com	\N	f	2025-12-14 13:13:16.13+01	2025-12-14 13:13:16.13+01
82fe312e-3f00-4312-960d-257e146cd565	5c75ca03-2ba3-47ff-b688-7e948bffc827	Mégane  Nguepinssi	656809124	\N	\N	f	2025-12-14 13:13:16.133+01	2025-12-14 13:13:16.133+01
d07c7a7a-1aee-42dc-af27-3f7c50fe71e7	c3218828-6ebf-4406-837c-c044c5d7451f	Teddy Ghomo	237693117127	Teddyghomo714@gmail.com	\N	f	2025-12-14 16:14:57.862+01	2025-12-14 16:14:57.862+01
3b5aca07-b474-4fda-bc51-b398f01912e1	c3218828-6ebf-4406-837c-c044c5d7451f	Ange Temgoua	698580494	\N	\N	f	2025-12-14 16:14:57.864+01	2025-12-14 16:14:57.864+01
a6356fa9-4bbb-4fa4-bfd5-23df90900f1e	9266b89f-fb12-43a5-bf94-dc70cc357e98	Anne Vanessa  Mbazoa	237690825139	vanessambazoa9@gmail.com	\N	f	2025-12-15 08:59:40.954+01	2025-12-15 08:59:40.954+01
aad75169-c657-4cd5-ba83-b9213e19d78f	9266b89f-fb12-43a5-bf94-dc70cc357e98	Bb Chloé Bb Malik	690825139	vanessambazoa9@gmail.com	\N	f	2025-12-15 08:59:40.958+01	2025-12-15 08:59:40.959+01
5a58e0cc-9e60-4897-9939-0ba0812cc00e	9266b89f-fb12-43a5-bf94-dc70cc357e98	Bb Wayne Vanessa	690825139	vanessambazoa9@gmail.com	\N	f	2025-12-15 08:59:40.961+01	2025-12-15 08:59:40.961+01
78837592-275a-4742-90e4-c9f26a4a11ba	4e8358b2-1b25-4116-a0c1-e0e6c082f82d	Paul-fany  Doumba	237690417616	paul-fanydoumba@icloud.com	\N	f	2025-12-15 16:25:34.864+01	2025-12-15 16:25:34.865+01
0dca8d6d-76ee-4cf9-8139-03a00ce9abd7	cd3f7caf-6882-4e32-9687-7a8274f23cd5	Maeva Ntonga	237688227556	\N	\N	f	2025-12-15 21:52:50.824+01	2025-12-15 21:52:50.824+01
a851d508-ff7e-479f-bb1a-d17c9eb987e7	a29df73c-6441-4511-bd9c-001185b72b19	Tatiana Stella Elouga Gounouck	237693838518	etatianastella@gmail.com	\N	f	2025-12-15 21:59:40.725+01	2025-12-15 21:59:40.725+01
9be3d1d7-f5a7-4f82-a0d4-055e4376f371	a29df73c-6441-4511-bd9c-001185b72b19	X Y	\N	\N	\N	f	2025-12-15 21:59:40.727+01	2025-12-15 21:59:40.727+01
6b8426bb-945d-41bb-bc85-90df82565032	a29df73c-6441-4511-bd9c-001185b72b19	X Y	\N	\N	\N	f	2025-12-15 21:59:40.728+01	2025-12-15 21:59:40.729+01
9cd6ab10-4b51-4b74-b8b2-f34e6bf37a2b	51f8537c-6bbf-4d1d-b7d6-f24062c7dbbb	Duva Atangana Robert	237688227556	\N	\N	f	2025-12-15 22:00:11.618+01	2025-12-15 22:00:11.618+01
beb815e8-30cb-4dc3-83de-4daa1fb35c06	2e66af7f-0e9b-49d7-9267-30344e98cddf	Agathe Ngessomba	237688227556	\N	\N	f	2025-12-15 22:01:57.943+01	2025-12-15 22:01:57.943+01
9b9e9b13-eee9-4f87-bec2-f4a5f1724658	0d84035d-37d8-4dab-ace9-56278bd579e8	cerena  Touna Ongono	237688227556	\N	\N	f	2025-12-15 22:04:29.111+01	2025-12-15 22:04:29.111+01
53580c0e-79f8-4245-b7fb-408de9bb79ae	297d83af-1b9f-4990-95eb-b53b90dd814e	Hilaire  Minja Ze	237656915233	minjazehilaire@gmail.com	\N	f	2025-12-15 22:06:59.698+01	2025-12-15 22:06:59.698+01
a0feed8d-dc8a-49f8-8b56-11694e7f4fd0	297d83af-1b9f-4990-95eb-b53b90dd814e	Ronelle  FEUBI Simo	690637845	\N	\N	f	2025-12-15 22:06:59.701+01	2025-12-15 22:06:59.701+01
72e7636a-bd39-4c69-b984-acf9c40840c8	297d83af-1b9f-4990-95eb-b53b90dd814e	Dolvine  Tsague	+237 6 94 55 97 82	\N	\N	f	2025-12-15 22:06:59.702+01	2025-12-15 22:06:59.702+01
57429129-dc4c-4c16-b475-67abbe019c13	552cd824-3f05-46f1-8ba4-8fc283ce30b9	LAETICIA  KENFACK	237657399805	kenfackkakabiyvana@gmail.com	\N	f	2025-12-15 22:07:51.11+01	2025-12-15 22:07:51.11+01
f72d4217-14e3-48c0-9845-c30a5860a368	552cd824-3f05-46f1-8ba4-8fc283ce30b9	Léa  KAMENI	690141249	kamenilea07@gmail.com	\N	f	2025-12-15 22:07:51.112+01	2025-12-15 22:07:51.112+01
32111e16-66df-4a1e-a69f-37c7c29889a2	552cd824-3f05-46f1-8ba4-8fc283ce30b9	Ledoux  Honda	699152569	ledouxhonda@gmail.com	\N	f	2025-12-15 22:07:51.114+01	2025-12-15 22:07:51.114+01
bcaf14ec-94ab-4025-bb76-dff02e59afe6	9afd72dd-37ea-4588-93b4-d756fcc2d8d4	Ze Arnauld	237683609362	arnauldze478@gmail.com	\N	f	2025-12-16 09:30:29.565+01	2025-12-16 09:30:29.566+01
7f9257b9-47db-41bf-aa5a-6e2c5a5114ae	9afd72dd-37ea-4588-93b4-d756fcc2d8d4	Fernande shanice Zibi	622146419	Evazibifs@gmail.com	\N	f	2025-12-16 09:30:29.57+01	2025-12-16 09:30:29.57+01
1839db7a-f4fe-41e4-9b94-01d9f7f18031	e7fa78e7-9215-4028-af5e-736278294dfd	nexus nexus	237672475691	latifnjimoluh@gmail.com	\N	f	2025-12-16 15:53:04.805+01	2025-12-16 15:53:04.805+01
02fca5eb-d47c-40c0-985b-08e25c4cdefc	905b14f6-6331-4dc4-9313-81a373371ce8	Tella  Laetitia	237696633654	\N	\N	f	2025-12-16 19:13:45.085+01	2025-12-16 19:13:45.085+01
f771257c-c22e-4394-9c31-feec53d522ba	905b14f6-6331-4dc4-9313-81a373371ce8	Tella Megane	696633654	\N	\N	f	2025-12-16 19:13:45.088+01	2025-12-16 19:13:45.088+01
f42d71c8-5e3b-4478-8bb2-cbab287e09ee	d4a7c88b-5fe9-44e7-8452-2111d6679e8e	Dorothé gloria Engoulou	237697434502	doumbapaul-fany@icloud.com	\N	f	2025-12-16 20:05:53.306+01	2025-12-16 20:05:53.306+01
ed4edb47-034d-4bd2-a7a2-a43797ad0a6e	6b5632e3-39e5-4998-b7f2-a800de52231e	Tony Tsague	237690473113	tsaguetony@gmail.com	\N	f	2025-12-16 21:19:01.541+01	2025-12-16 21:19:01.542+01
7e625a04-f246-493c-bff4-74bc90d9c4e2	6b5632e3-39e5-4998-b7f2-a800de52231e	Ange TCHOUANE	+237 6 56 36 49 94	yamatotony2@gmail.com	\N	f	2025-12-16 21:19:01.544+01	2025-12-16 21:19:01.544+01
98654bb4-ddb1-491b-ac33-a290c11f5f01	6bfb590a-93a2-4398-ad99-b2a67deba640	Emilie  Ze	237657105896	zeemilie390@gmail.com	\N	f	2025-12-16 21:39:57.088+01	2025-12-16 21:39:57.089+01
71bba039-cc68-4e67-85e0-94da05da416a	6bfb590a-93a2-4398-ad99-b2a67deba640	Michel  Mewolo	657788896	\N	\N	f	2025-12-16 21:39:57.091+01	2025-12-16 21:39:57.091+01
764b8a41-d472-42c3-ad29-4a6b0a3aff14	553f726b-33a5-4786-8980-21bd128692ed	Ravel Pessy	237657483769	tambatresor@icloud.com	\N	f	2025-12-17 15:01:50.074+01	2025-12-17 15:01:50.074+01
ebfb577b-ff46-427e-81e6-34efba774ef5	4dadaddb-6d54-4d63-9ff4-d6dc6ffbbb82	KAMENI Marguerite	652968611	margueritekameni2@gmail.com	\N	f	2025-12-17 16:00:10.717+01	2025-12-17 16:00:10.717+01
7162ed5b-ef2c-439f-8457-3eb28a1c9690	52525a88-08af-4ff1-9e74-7342ea3556b3	NLOGA  ALEX	237697783	latredesign22@gmail.com	\N	f	2025-12-17 18:09:26.935+01	2025-12-17 18:09:26.935+01
f9ff2359-bcad-4d68-876f-7c1f3c8b778e	bb8d5c26-4cc6-4a6c-9dbf-f794cefac2b3	Anas Farid Njimoluh	237672475691	latifnjimoluh@gmail.com	\N	f	2025-12-21 15:41:38.867+01	2025-12-21 15:41:38.867+01
760b5c7d-ecee-4f53-88f1-ce81198484c0	0339568e-5932-43e8-bb38-e1d339af7ee6	latif njimoluh	237658509963	latifnjimoluh@gmail.com	\N	f	2026-03-24 08:06:12.856+01	2026-03-24 08:06:12.856+01
ea99b26c-029b-4ed9-8784-e84183a67738	4c0e3b42-e279-4604-a498-0bc81ae09b1e	latif njimoluh	\N	latifnjimoluh@gmail.com	46b59079-8a9e-4067-983b-1f16936d8a61	t	2026-03-24 08:41:21.445+01	2026-03-24 09:13:22.526+01
52569eee-b398-415b-87b4-9de64f3393d2	1aeb340c-48c3-4eff-ba55-f55f52cc9df2	latif njimoluh	\N	latifnjimoluh@gmail.com	\N	f	2026-03-24 09:14:34.486+01	2026-03-24 09:14:34.486+01
015d65b6-ab76-4a14-956a-8b0130792e17	1aeb340c-48c3-4eff-ba55-f55f52cc9df2	latif njimoluh	\N	latifnjimoluh@gmail.com	\N	f	2026-03-24 09:14:34.503+01	2026-03-24 09:14:34.503+01
e0c4168f-7153-4c23-bddd-2d00977d7161	1aeb340c-48c3-4eff-ba55-f55f52cc9df2	latif njimoluh	\N	\N	\N	f	2026-03-24 09:14:34.505+01	2026-03-24 09:14:34.505+01
1d4d56aa-9289-4fce-b0e6-183aeeed0efe	d569c5ec-1b98-45c9-a52d-4f086fdbbc37	latif njimoluh	\N	latifnjimoluh@gmail.com	ce52992f-3e13-4199-b402-c98a5e39390e	t	2026-03-24 09:58:34.497+01	2026-03-24 10:40:50.416+01
f1afb167-c388-447e-ab28-d1bf90c2c3c5	d569c5ec-1b98-45c9-a52d-4f086fdbbc37	latif njimoluh	\N	latifnjimoluh@gmail.com	ce52992f-3e13-4199-b402-c98a5e39390e	t	2026-03-24 09:58:34.5+01	2026-03-24 10:40:54.393+01
d202c9a6-503f-4a8f-93d1-100952e068aa	0afd8c46-0cf9-4007-b2e3-1be95473d50d	latif njimoluh	237658509963	latifnjimoluh@gmail.com	\N	f	2026-03-24 12:32:54.702+01	2026-03-24 12:32:54.702+01
ce43af37-1840-4ac9-ba21-d64fa5bba231	0afd8c46-0cf9-4007-b2e3-1be95473d50d	Njimoluh Farid	\N	latifnjimoluh@gmail.com	\N	f	2026-03-24 12:32:54.717+01	2026-03-24 12:32:54.717+01
106fbe1e-73ad-4f0b-b062-0f0baa10a6d8	caf4e5f4-602c-4120-a470-29abfeda3be5	n n	237658509963	latifnjimoluh@gmail.com	\N	f	2026-04-04 00:56:38.519+01	2026-04-04 00:56:38.52+01
1c59171a-a0fb-4310-ae73-f6303e952df3	691af412-bef8-48f8-9339-85fd4637f15e	nexus n	237658509963	latifnjimoluh@gmail.com	\N	f	2026-04-04 01:10:21.345+01	2026-04-04 01:10:21.346+01
\.


--
-- Data for Name: payments; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.payments (id, reservation_id, amount, method, proof_url, comment, created_by, "createdAt", "updatedAt") FROM stdin;
2e872047-ce39-4826-8eeb-19b2ded36754	647a5486-b263-4564-846a-5c74ac183fdd	8000	orange	\N	\N	dbc241e1-a237-4b97-b8c1-db367ae07cc0	2025-12-06 21:15:52.024+01	2025-12-06 21:15:52.024+01
0c68ccdf-0b77-4c18-ba58-289742334ee1	9e4d9498-334b-40d7-91bd-e8341cbb6448	8000	orange	\N	\N	dbc241e1-a237-4b97-b8c1-db367ae07cc0	2025-12-06 21:23:18.146+01	2025-12-06 21:23:18.147+01
fc312a5b-a577-4370-aea0-cd2fa4b82e74	12e2ee73-7be7-4cd7-a63a-cd12fa9a0b8a	10000	orange	\N	\N	dbc241e1-a237-4b97-b8c1-db367ae07cc0	2025-12-08 08:54:05.125+01	2025-12-08 08:54:05.125+01
9d1e0eb0-3156-4793-9781-227087372a5b	a887aff5-10ad-450e-b60d-f0cb7a95c877	5000	cash	\N	\N	dbc241e1-a237-4b97-b8c1-db367ae07cc0	2025-12-08 17:01:28.993+01	2025-12-08 17:01:28.993+01
91dd7ea4-826d-4f16-9312-7c2f88198c01	0de178ec-777d-455b-99ec-96663e0b8738	3000	orange	\N	\N	dbc241e1-a237-4b97-b8c1-db367ae07cc0	2025-12-10 11:09:04.035+01	2025-12-10 11:09:04.035+01
4c4122ae-dbcb-41f4-8e5e-1ae746a92685	6ec62590-e4e7-4190-972e-b9609ebcd23b	8000	orange	\N	\N	dbc241e1-a237-4b97-b8c1-db367ae07cc0	2025-12-12 16:29:57.472+01	2025-12-12 16:29:57.473+01
6fa22c8a-43ed-47d3-8d02-5b5227afaa29	49e02951-ae2a-453f-90fd-f302c1cd7c8e	5000	orange	\N	\N	dbc241e1-a237-4b97-b8c1-db367ae07cc0	2025-12-14 10:01:53+01	2025-12-14 10:01:53.001+01
52bb65d3-3303-49b9-a968-2449bf9f7eae	5c75ca03-2ba3-47ff-b688-7e948bffc827	8000	orange	\N	\N	dbc241e1-a237-4b97-b8c1-db367ae07cc0	2025-12-14 13:33:44.934+01	2025-12-14 13:33:44.935+01
120b3a40-a401-4106-a96e-571ee84a68dc	039d7927-321e-459c-8250-31e3a2ebf3cc	5000	orange	\N	\N	dbc241e1-a237-4b97-b8c1-db367ae07cc0	2025-12-14 14:11:59.96+01	2025-12-14 14:11:59.96+01
d9344151-4e6d-4add-8560-833dcb5b0aac	47de6424-a45b-4dc2-a0b0-b4cde0ac4248	8000	cash	\N	\N	dbc241e1-a237-4b97-b8c1-db367ae07cc0	2025-12-14 18:33:47.292+01	2025-12-14 18:33:47.292+01
997e560c-5c8e-4363-9e3e-5611e8078896	0781a9b4-28ad-4a01-995f-16b546e598c0	8000	cash	\N	\N	dbc241e1-a237-4b97-b8c1-db367ae07cc0	2025-12-14 18:35:47.325+01	2025-12-14 18:35:47.325+01
c502bf03-ca96-4709-bc35-3bbaa2c3aa34	9266b89f-fb12-43a5-bf94-dc70cc357e98	10000	orange	\N	\N	dbc241e1-a237-4b97-b8c1-db367ae07cc0	2025-12-15 13:14:32.969+01	2025-12-15 13:14:32.969+01
cc370af6-1357-4e69-a145-55f921239383	f0a4a00e-bd08-4ac4-abc6-834b97869450	8000	orange	\N	\N	dbc241e1-a237-4b97-b8c1-db367ae07cc0	2025-12-15 15:18:37.864+01	2025-12-15 15:18:37.865+01
36eab627-2c38-4ca4-84cc-789bd4bb69c4	4e8358b2-1b25-4116-a0c1-e0e6c082f82d	3000	orange	\N	\N	dbc241e1-a237-4b97-b8c1-db367ae07cc0	2025-12-15 16:33:11.898+01	2025-12-15 16:33:11.898+01
d9cc1361-28a4-44ac-8ead-8050f13cd8f8	a29df73c-6441-4511-bd9c-001185b72b19	20000	orange	\N	\N	dbc241e1-a237-4b97-b8c1-db367ae07cc0	2025-12-15 22:11:08.566+01	2025-12-15 22:11:08.566+01
77d3135d-d6fe-4cf7-aeac-dbf21de05550	297d83af-1b9f-4990-95eb-b53b90dd814e	20000	cash	\N	\N	dbc241e1-a237-4b97-b8c1-db367ae07cc0	2025-12-15 22:12:49.385+01	2025-12-15 22:12:49.385+01
a0a127c0-c0d4-4588-9178-dc89dfa20b1a	9afd72dd-37ea-4588-93b4-d756fcc2d8d4	8000	momo	\N	\N	dbc241e1-a237-4b97-b8c1-db367ae07cc0	2025-12-16 09:46:00.632+01	2025-12-16 09:46:00.632+01
ad035d5c-71e9-4fd0-86b6-4064466ada3c	d4a7c88b-5fe9-44e7-8452-2111d6679e8e	3000	orange	\N	\N	dbc241e1-a237-4b97-b8c1-db367ae07cc0	2025-12-16 20:11:07.162+01	2025-12-16 20:11:07.162+01
1724d98e-efad-4ebe-b41b-a831482a9e4e	6b5632e3-39e5-4998-b7f2-a800de52231e	8000	orange	\N	\N	dbc241e1-a237-4b97-b8c1-db367ae07cc0	2025-12-16 21:23:02.251+01	2025-12-16 21:23:02.251+01
22d891a6-6d79-44ab-89e9-9d5339cd2eeb	6bfb590a-93a2-4398-ad99-b2a67deba640	20000	cash	\N	\N	dbc241e1-a237-4b97-b8c1-db367ae07cc0	2025-12-16 22:48:13.976+01	2025-12-16 22:48:13.976+01
eb6cf71e-7253-42a5-a3bf-3536c9c1250b	553f726b-33a5-4786-8980-21bd128692ed	5000	orange	\N	\N	dbc241e1-a237-4b97-b8c1-db367ae07cc0	2025-12-17 15:58:22.178+01	2025-12-17 15:58:22.179+01
560e3f4a-b0b2-46f0-babe-b3c81a4ac5d3	4dadaddb-6d54-4d63-9ff4-d6dc6ffbbb82	5000	cash	\N	\N	dbc241e1-a237-4b97-b8c1-db367ae07cc0	2025-12-17 16:00:19.179+01	2025-12-17 16:00:19.179+01
acbf0969-b434-481a-945d-b9d9c5bd8155	52525a88-08af-4ff1-9e74-7342ea3556b3	3000	orange	\N	\N	dbc241e1-a237-4b97-b8c1-db367ae07cc0	2025-12-17 19:14:52.869+01	2025-12-17 19:14:52.869+01
1c8f75ff-fbca-44c4-9379-8e517ab40be8	cd3f7caf-6882-4e32-9687-7a8274f23cd5	3000	orange	\N	\N	dbc241e1-a237-4b97-b8c1-db367ae07cc0	2025-12-17 20:20:42.603+01	2025-12-17 20:20:42.604+01
deacd276-bbff-43ca-854b-782eec25050d	0d84035d-37d8-4dab-ace9-56278bd579e8	3000	orange	\N	\N	dbc241e1-a237-4b97-b8c1-db367ae07cc0	2025-12-17 20:23:16.523+01	2025-12-17 20:23:16.524+01
c1c19b47-0809-4889-9065-942e1824c953	bb8d5c26-4cc6-4a6c-9dbf-f794cefac2b3	5000	cash	\N	\N	02ae193b-0f63-42df-b039-d984998f0d2a	2025-12-21 15:42:55.374+01	2025-12-21 15:42:55.375+01
e4f7be70-e9c2-48ba-820f-01e28d584bb3	4c0e3b42-e279-4604-a498-0bc81ae09b1e	20000	cash	\N	\N	282162e8-232a-4635-8bea-437ced2365e2	2026-03-24 08:41:48.631+01	2026-03-24 08:41:48.631+01
5bedfd38-8dd0-4e9e-98ec-0bb542d7c6f5	1aeb340c-48c3-4eff-ba55-f55f52cc9df2	8000	cash	\N	\N	282162e8-232a-4635-8bea-437ced2365e2	2026-03-24 09:14:48.143+01	2026-03-24 09:14:48.144+01
0a3233d1-64c4-4bee-88af-99ef5e32e25a	d569c5ec-1b98-45c9-a52d-4f086fdbbc37	5000	cash	\N	\N	282162e8-232a-4635-8bea-437ced2365e2	2026-03-24 09:59:20.983+01	2026-03-24 09:59:20.983+01
fd2e2c12-7fca-4188-98de-e15fe87ba4bf	d569c5ec-1b98-45c9-a52d-4f086fdbbc37	3000	momo	\N	\N	282162e8-232a-4635-8bea-437ced2365e2	2026-03-24 10:00:08.258+01	2026-03-24 10:00:08.258+01
05e907f4-06d4-45d1-b59f-3f4b908de4c1	0afd8c46-0cf9-4007-b2e3-1be95473d50d	8000	cash	\N	\N	02ae193b-0f63-42df-b039-d984998f0d2a	2026-03-24 12:34:04.284+01	2026-03-24 12:34:04.284+01
99101ef3-ac9c-41b1-83f9-ae740b686083	691af412-bef8-48f8-9339-85fd4637f15e	5000	cash	\N	\N	02ae193b-0f63-42df-b039-d984998f0d2a	2026-04-04 01:12:57.674+01	2026-04-04 01:12:57.674+01
\.


--
-- Data for Name: reservations; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.reservations (id, payeur_name, payeur_phone, payeur_email, pack_id, pack_name_snapshot, unit_price, quantity, total_price, total_paid, status, "createdAt", "updatedAt") FROM stdin;
c66b8541-8701-4f32-8aff-d31b44a81d90	Amstrong Florent  TANKEU	237656512217	ammstrongkapseu@gmail.com	b8249ec2-993a-4140-902b-6bfad049a1b6	COUPLE	8000	2	8000	0	pending	2025-12-09 08:27:24.082+01	2025-12-09 08:27:24.083+01
1a41bd8d-12e5-4b1e-9509-87f7d7c3953b	Lea Lili	237653254219	sohlaurent3@gmail.com	7c209804-be05-48dc-b14d-4d8bf63c19df	SIMPLE	3000	1	3000	0	cancelled	2025-12-08 10:52:25.272+01	2025-12-09 21:13:36.159+01
0781a9b4-28ad-4a01-995f-16b546e598c0	Sonia  Mbatchou	237657484401	soniageorgiambatchou@icloud.com	b8249ec2-993a-4140-902b-6bfad049a1b6	COUPLE	8000	2	8000	8000	ticket_generated	2025-12-13 16:50:42.072+01	2025-12-14 18:35:56.247+01
0de178ec-777d-455b-99ec-96663e0b8738	Righteous  Atasiri	237693166393	iamshatan17@gmail.com	7c209804-be05-48dc-b14d-4d8bf63c19df	SIMPLE	3000	1	3000	3000	ticket_generated	2025-12-09 22:38:23.503+01	2025-12-10 11:09:12.243+01
5c4ee137-c143-499a-9c13-1b2c3c4d5909	joseph bakoa	237698285723	kalihacker98@gmail.com	b62e0c02-e4ff-4e86-8c46-ed7e6acc9eb8	VIP	5000	1	5000	0	pending	2025-12-10 22:48:30.035+01	2025-12-10 22:48:30.036+01
948b8dd9-ba89-4b3d-8b28-96db8e7d541d	Franck Ryan CHAMEN NKONGMENECK	237697360550	chamenfranck@gmail.com	b62e0c02-e4ff-4e86-8c46-ed7e6acc9eb8	VIP	5000	1	5000	0	pending	2025-12-12 14:14:08.233+01	2025-12-12 14:14:08.233+01
b00a2e24-c8c3-4cb6-94b8-662a3668e3df	Esrdra  Tagne	237675433571	tagnefortune0@gmail.com	b8249ec2-993a-4140-902b-6bfad049a1b6	COUPLE	8000	2	8000	0	pending	2025-12-06 07:03:54.089+01	2025-12-06 07:03:54.089+01
1f4644eb-735f-460f-a48b-fb2b5b8380bb	Gilbert Fonkeng	237698541239	gilfonkeng@gmail.com	7c209804-be05-48dc-b14d-4d8bf63c19df	SIMPLE	3000	1	3000	0	pending	2025-12-06 12:18:14.634+01	2025-12-06 12:18:14.635+01
40ba10ac-f663-41b0-95dd-3ee34f1894ec	Fresnel Mouaffo	237672267714	fresnelmouaffo@gmail.com	b8249ec2-993a-4140-902b-6bfad049a1b6	COUPLE	8000	2	8000	0	pending	2025-12-06 13:38:03.781+01	2025-12-06 13:38:03.781+01
fabeed06-d3a9-43b6-8408-67df94295eec	Yannick Mombou nitcheu	237655377730	iamyannick237@gmail.com	d90648b7-1afb-4d0d-91c7-3eaf0ddb40c3	FAMILLE	10000	1	10000	0	pending	2025-12-06 15:42:24.125+01	2025-12-06 15:42:24.125+01
647a5486-b263-4564-846a-5c74ac183fdd	Laetitia Belva  Ngamanga	237694664897	laetitiangamanga7@gmail.com	b8249ec2-993a-4140-902b-6bfad049a1b6	COUPLE	8000	2	8000	8000	ticket_generated	2025-12-06 20:56:36.026+01	2025-12-06 21:16:11.474+01
9e4d9498-334b-40d7-91bd-e8341cbb6448	Abdel Ndichout	237656937672	ndichout1984@icloud.com	b8249ec2-993a-4140-902b-6bfad049a1b6	COUPLE	8000	2	8000	8000	ticket_generated	2025-12-05 23:47:30.732+01	2025-12-06 21:23:33.431+01
6ec62590-e4e7-4190-972e-b9609ebcd23b	Jeff Anthony  TCHALLA TCHASSEM	237655851766	jefftchass@gmail.com	b8249ec2-993a-4140-902b-6bfad049a1b6	COUPLE	8000	2	8000	8000	ticket_generated	2025-12-12 16:23:33.53+01	2025-12-12 16:30:08.661+01
12e2ee73-7be7-4cd7-a63a-cd12fa9a0b8a	Gabriel Fokou	237658980051	gabrielfokou26@gmail.com	d90648b7-1afb-4d0d-91c7-3eaf0ddb40c3	FAMILLE	10000	5	10000	10000	ticket_generated	2025-12-08 08:50:40.917+01	2025-12-08 08:54:15.934+01
a887aff5-10ad-450e-b60d-f0cb7a95c877	Rayan Arnold KOMBOU KAMDOUM	237673069061	rayankamdoum12@gmail.com	b62e0c02-e4ff-4e86-8c46-ed7e6acc9eb8	VIP	5000	1	5000	5000	ticket_generated	2025-12-08 07:40:18.176+01	2025-12-08 17:01:35.718+01
4b61138c-61b2-445d-957b-cf536c5c8218	Michel Zama	237696971336	zamamichel@icloud.com	b8249ec2-993a-4140-902b-6bfad049a1b6	COUPLE	8000	2	8000	0	pending	2025-12-08 21:32:31.191+01	2025-12-08 21:32:31.191+01
f95ff1e4-2e83-4551-b305-03c5fdb84c86	FRIEDE STERN VON  NDOM	237657402824	vonstern7@gmail.com	b62e0c02-e4ff-4e86-8c46-ed7e6acc9eb8	VIP	5000	1	5000	0	pending	2025-12-08 23:22:30.136+01	2025-12-08 23:22:30.136+01
18511c31-345b-47a7-a018-e9239fb096a7	Paul Ernest  Ewoti	237654286327	alexandreewoti527@gmail.com	b8249ec2-993a-4140-902b-6bfad049a1b6	COUPLE	8000	2	8000	0	pending	2025-12-13 20:50:15.471+01	2025-12-13 20:50:15.472+01
49e02951-ae2a-453f-90fd-f302c1cd7c8e	Marie-joséphine EMALE KANG	237696436352	mariejosyek@gmail.com	b62e0c02-e4ff-4e86-8c46-ed7e6acc9eb8	VIP	5000	1	5000	5000	ticket_generated	2025-12-13 15:32:51.046+01	2025-12-14 12:17:10.559+01
9266b89f-fb12-43a5-bf94-dc70cc357e98	Anne Vanessa  Mbazoa	237690825139	vanessambazoa9@gmail.com	d90648b7-1afb-4d0d-91c7-3eaf0ddb40c3	FAMILLE	10000	3	10000	10000	ticket_generated	2025-12-15 08:59:40.947+01	2025-12-15 13:14:48.737+01
5c75ca03-2ba3-47ff-b688-7e948bffc827	Fortune  Tagne	237655443776	tagnefortune0@gmail.com	b8249ec2-993a-4140-902b-6bfad049a1b6	COUPLE	8000	2	8000	8000	ticket_generated	2025-12-14 13:13:16.123+01	2025-12-14 13:33:51.853+01
6b5632e3-39e5-4998-b7f2-a800de52231e	Tony Tsague	237690473113	tsaguetony@gmail.com	b8249ec2-993a-4140-902b-6bfad049a1b6	COUPLE	8000	2	8000	8000	ticket_generated	2025-12-16 21:19:01.535+01	2025-12-16 21:23:07.078+01
039d7927-321e-459c-8250-31e3a2ebf3cc	Ravel  Pessy	237657483769	tambatresor@icloud.com	b62e0c02-e4ff-4e86-8c46-ed7e6acc9eb8	VIP	5000	1	5000	5000	ticket_generated	2025-12-14 11:44:41.605+01	2025-12-14 14:12:07.414+01
c3218828-6ebf-4406-837c-c044c5d7451f	Teddy Ghomo	237693117127	Teddyghomo714@gmail.com	b8249ec2-993a-4140-902b-6bfad049a1b6	COUPLE	8000	2	8000	0	pending	2025-12-14 16:14:57.857+01	2025-12-14 16:14:57.857+01
f0a4a00e-bd08-4ac4-abc6-834b97869450	Ivan Junior  KETCHAPA	237698947179	juniorketchapa3@gmail.com	b8249ec2-993a-4140-902b-6bfad049a1b6	COUPLE	8000	2	8000	8000	ticket_generated	2025-12-10 21:38:18.913+01	2025-12-15 15:18:46.765+01
47de6424-a45b-4dc2-a0b0-b4cde0ac4248	Nathanaël  Tamba	237682973174	Koltanatamba@gmail.com	b8249ec2-993a-4140-902b-6bfad049a1b6	COUPLE	8000	2	8000	8000	ticket_generated	2025-12-08 20:47:16.127+01	2025-12-14 18:33:54.85+01
9afd72dd-37ea-4588-93b4-d756fcc2d8d4	Ze Arnauld	237683609362	arnauldze478@gmail.com	b8249ec2-993a-4140-902b-6bfad049a1b6	COUPLE	8000	2	8000	8000	ticket_generated	2025-12-16 09:30:29.561+01	2025-12-16 09:46:07.679+01
4e8358b2-1b25-4116-a0c1-e0e6c082f82d	Paul-fany  Doumba	237690417616	paul-fanydoumba@icloud.com	7c209804-be05-48dc-b14d-4d8bf63c19df	SIMPLE	3000	1	3000	3000	ticket_generated	2025-12-15 16:25:34.859+01	2025-12-15 16:33:18.348+01
51f8537c-6bbf-4d1d-b7d6-f24062c7dbbb	Duva Atangana Robert	237688227556	\N	7c209804-be05-48dc-b14d-4d8bf63c19df	SIMPLE	3000	1	3000	0	pending	2025-12-15 22:00:11.615+01	2025-12-15 22:00:11.615+01
2e66af7f-0e9b-49d7-9267-30344e98cddf	Agathe Ngessomba	237688227556	\N	7c209804-be05-48dc-b14d-4d8bf63c19df	SIMPLE	3000	1	3000	0	pending	2025-12-15 22:01:57.937+01	2025-12-15 22:01:57.937+01
552cd824-3f05-46f1-8ba4-8fc283ce30b9	LAETICIA  KENFACK	237657399805	kenfackkakabiyvana@gmail.com	acce7b77-3f10-480f-8ec0-5ef0256b01db	STAND	20000	3	20000	0	pending	2025-12-15 22:07:51.107+01	2025-12-15 22:07:51.107+01
e7fa78e7-9215-4028-af5e-736278294dfd	nexus nexus	237672475691	latifnjimoluh@gmail.com	7c209804-be05-48dc-b14d-4d8bf63c19df	SIMPLE	3000	1	3000	0	cancelled	2025-12-16 15:53:04.792+01	2025-12-16 15:53:45.654+01
a29df73c-6441-4511-bd9c-001185b72b19	Tatiana Stella Elouga Gounouck	237693838518	etatianastella@gmail.com	acce7b77-3f10-480f-8ec0-5ef0256b01db	STAND	20000	3	20000	20000	ticket_generated	2025-12-15 21:59:40.717+01	2025-12-15 22:11:19.804+01
297d83af-1b9f-4990-95eb-b53b90dd814e	Hilaire  Minja Ze	237656915233	minjazehilaire@gmail.com	acce7b77-3f10-480f-8ec0-5ef0256b01db	STAND	20000	3	20000	20000	paid	2025-12-15 22:06:59.693+01	2025-12-15 22:12:49.387+01
905b14f6-6331-4dc4-9313-81a373371ce8	Tella  Laetitia	237696633654	\N	b8249ec2-993a-4140-902b-6bfad049a1b6	COUPLE	8000	2	8000	0	pending	2025-12-16 19:13:45.078+01	2025-12-16 19:13:45.079+01
d4a7c88b-5fe9-44e7-8452-2111d6679e8e	Dorothé gloria Engoulou	237697434502	doumbapaul-fany@icloud.com	7c209804-be05-48dc-b14d-4d8bf63c19df	SIMPLE	3000	1	3000	3000	ticket_generated	2025-12-16 20:05:53.295+01	2025-12-16 20:11:15.481+01
6bfb590a-93a2-4398-ad99-b2a67deba640	Emilie  Ze	237657105896	zeemilie390@gmail.com	acce7b77-3f10-480f-8ec0-5ef0256b01db	STAND	20000	2	20000	20000	paid	2025-12-16 21:39:57.083+01	2025-12-16 22:48:13.979+01
cd3f7caf-6882-4e32-9687-7a8274f23cd5	Maeva Ntonga	237688227556	\N	7c209804-be05-48dc-b14d-4d8bf63c19df	SIMPLE	3000	1	3000	3000	ticket_generated	2025-12-15 21:52:50.821+01	2025-12-17 20:20:46.954+01
553f726b-33a5-4786-8980-21bd128692ed	Ravel Pessy	237657483769	tambatresor@icloud.com	b62e0c02-e4ff-4e86-8c46-ed7e6acc9eb8	VIP	5000	1	5000	5000	ticket_generated	2025-12-17 15:01:50.068+01	2025-12-17 15:58:26.406+01
52525a88-08af-4ff1-9e74-7342ea3556b3	NLOGA  ALEX	237697783	latredesign22@gmail.com	7c209804-be05-48dc-b14d-4d8bf63c19df	SIMPLE	3000	1	3000	3000	ticket_generated	2025-12-17 18:09:26.928+01	2025-12-17 19:14:58.585+01
4dadaddb-6d54-4d63-9ff4-d6dc6ffbbb82	KAMENI Marguerite	652968611	margueritekameni2@gmail.com	b62e0c02-e4ff-4e86-8c46-ed7e6acc9eb8	VIP	5000	1	5000	5000	ticket_generated	2025-12-17 16:00:10.712+01	2025-12-17 16:00:22.742+01
0d84035d-37d8-4dab-ace9-56278bd579e8	cerena  Touna Ongono	237688227556	\N	7c209804-be05-48dc-b14d-4d8bf63c19df	SIMPLE	3000	1	3000	3000	ticket_generated	2025-12-15 22:04:29.107+01	2025-12-17 20:23:22.161+01
bb8d5c26-4cc6-4a6c-9dbf-f794cefac2b3	Anas Farid Njimoluh	237672475691	latifnjimoluh@gmail.com	b62e0c02-e4ff-4e86-8c46-ed7e6acc9eb8	VIP	5000	1	5000	5000	ticket_generated	2025-12-21 15:41:38.845+01	2025-12-21 15:42:58.46+01
0339568e-5932-43e8-bb38-e1d339af7ee6	latif njimoluh	237658509963	latifnjimoluh@gmail.com	7c209804-be05-48dc-b14d-4d8bf63c19df	SIMPLE	3000	1	3000	0	pending	2026-03-24 08:06:12.841+01	2026-03-24 08:06:12.842+01
4c0e3b42-e279-4604-a498-0bc81ae09b1e	latif njimoluh	658509963	latifnjimoluh@gmail.com	acce7b77-3f10-480f-8ec0-5ef0256b01db	STAND	20000	1	20000	20000	ticket_generated	2026-03-24 08:41:21.43+01	2026-03-24 08:41:58.066+01
1aeb340c-48c3-4eff-ba55-f55f52cc9df2	latif njimoluh	658509963	latifnjimoluh@gmail.com	b8249ec2-993a-4140-902b-6bfad049a1b6	COUPLE	8000	1	8000	8000	ticket_generated	2026-03-24 09:14:34.477+01	2026-03-24 09:14:54.647+01
d569c5ec-1b98-45c9-a52d-4f086fdbbc37	latif njimoluh	658509963	latifnjimoluh@gmail.com	b8249ec2-993a-4140-902b-6bfad049a1b6	COUPLE	8000	1	8000	8000	ticket_generated	2026-03-24 09:58:34.491+01	2026-03-24 10:00:13.14+01
caf4e5f4-602c-4120-a470-29abfeda3be5	n n	237658509963	latifnjimoluh@gmail.com	b62e0c02-e4ff-4e86-8c46-ed7e6acc9eb8	VIP	5000	1	5000	0	pending	2026-04-04 00:56:38.496+01	2026-04-04 00:56:38.497+01
0afd8c46-0cf9-4007-b2e3-1be95473d50d	latif njimoluh	237658509963	latifnjimoluh@gmail.com	b8249ec2-993a-4140-902b-6bfad049a1b6	COUPLE	8000	2	8000	8000	ticket_generated	2026-03-24 12:32:54.693+01	2026-03-24 12:34:08.995+01
691af412-bef8-48f8-9339-85fd4637f15e	nexus n	237658509963	latifnjimoluh@gmail.com	b62e0c02-e4ff-4e86-8c46-ed7e6acc9eb8	VIP	5000	1	5000	5000	ticket_generated	2026-04-04 01:10:21.325+01	2026-04-04 01:13:12.854+01
\.


--
-- Data for Name: roles; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.roles (id, name, label, description, permissions, is_system, "createdAt", "updatedAt") FROM stdin;
f0830051-4319-49ee-b7c6-837c9bfbf27c	superadmin	Super Administrateur	\N	["reservations.view","reservations.view.all","reservations.create","reservations.edit","reservations.edit.status","reservations.delete","reservations.export","reservations.statistics","payments.view","payments.view.all","payments.create","payments.edit","payments.delete","payments.export","payments.approve","payments.statistics","tickets.view","tickets.view.all","tickets.create","tickets.generate","tickets.download","tickets.preview","scan.validate","scan.decode","scan.search","scan.statistics","packs.view","packs.view.all","packs.create","packs.edit","packs.delete","users.view","users.view.all","users.create","users.edit","users.manage_permissions","audit.view.all","content.view","content.create","content.edit","content.delete"]	t	2026-03-24 11:12:15.428+01	2026-03-24 11:12:15.428+01
6433f342-11e6-4ea4-a686-13b80098fcd2	cashier	Caissier / Vendeur	\N	["reservations.view","reservations.create","reservations.edit","payments.view","payments.create","tickets.view","tickets.download","tickets.preview","packs.view"]	t	2026-03-24 11:12:15.49+01	2026-03-24 11:12:15.49+01
42bf2da9-5e64-4a55-be3a-46631cbb1a62	scanner	Contrôleur Entrée	\N	["tickets.view","scan.validate","scan.decode","scan.search"]	t	2026-03-24 11:12:15.495+01	2026-03-24 11:12:15.495+01
4f2a6b8b-ac1a-46fe-a360-c466448bdb3e	admin	Administrateur	\N	["reservations.view","reservations.view.all","reservations.create","reservations.edit","reservations.export","reservations.statistics","payments.view","payments.view.all","payments.create","payments.approve","tickets.view","tickets.view.all","tickets.generate","tickets.download","tickets.preview","scan.validate","scan.decode","scan.search","packs.view","packs.view.all","packs.create","packs.edit","users.view","users.view.all","content.view","content.edit","content.create","content.delete"]	t	2026-03-24 11:12:15.486+01	2026-03-24 11:21:49.228+01
\.


--
-- Data for Name: schedule_items; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.schedule_items (id, "time", title_fr, title_en, description_fr, description_en, is_surprise, is_after, is_teaser, display_order, is_active, "createdAt", "updatedAt") FROM stdin;
2e5421a3-3b02-4c09-9298-221c60d57041	13h00 - 18h00	Activités & Animations	Activities & Entertainment	Jeux vidéo, jeux de société, challenges, mini-tournages vidéo, photobooth, DJ zone	Video games, board games, challenges, mini-video shoots, photobooth, DJ zone	f	f	f	0	t	2026-03-24 08:00:24.456+01	2026-03-24 08:00:24.456+01
5ff7dd76-37e4-4c7a-9aae-e602827ccc68	18h00	Ouverture des portes	Doors Open	Accueil du public et installation	Welcome and seating	f	f	f	1	t	2026-03-24 08:00:24.456+01	2026-03-24 08:00:24.456+01
e5d8bc44-d534-48af-9c92-79c4cee5f18c	18h30	Premier Film	First Film	Zootopie 2 (2025) - Installation du public dès 18h00	Zootopia 2 (2025) - Seating from 18h00	f	f	f	2	t	2026-03-24 08:00:24.456+01	2026-03-24 08:00:24.456+01
a2c32acd-dc38-40d4-8d56-0256c075446a	21h00	Pause & Animations	Break & Entertainment	Repas, photobooth, mini-concours et rafraîchissements	Food, photobooth, mini-contest and refreshments	f	f	f	3	t	2026-03-24 08:00:24.456+01	2026-03-24 08:00:24.456+01
bd7c82de-da79-473f-9ea3-214d20435aa4	22h00	Deuxième Film	Second Film	Saw IV – séance nocturne	Saw IV – night screening	t	t	t	4	t	2026-03-24 08:00:24.456+01	2026-03-24 08:00:24.456+01
73b8b18b-b21e-439d-b508-f195f906e393	00h00+	Clôture	Closing	Fin de l'événement	End of event	f	f	f	5	t	2026-03-24 08:00:24.456+01	2026-03-24 08:00:24.456+01
\.


--
-- Data for Name: testimonials; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.testimonials (id, quote_fr, quote_en, author, pack_name, edition, photo_url, rating, is_active, display_order, "createdAt", "updatedAt", image_url) FROM stdin;
4b458033-6d56-4dfc-b383-aabf2f63601b	Le concept est génial. Entre le DJ set, les films et l'ambiance conviviale, c'était une soirée parfaite. Le pack VIP vaut vraiment le coup !	The concept is brilliant. Between the DJ set, the films and the friendly atmosphere, it was a perfect evening. The VIP pack is really worth it!	Dorian	Pack VIP	Decembre 2024	/dorian.jpg	5	t	1	2026-03-24 08:00:24.466+01	2026-03-24 08:00:24.466+01	\N
9aa820ad-d671-40d8-8f66-4323b974d22a	Date night parfaite ! Le pack Couple avec le matelas double et la photo souvenir a rendu notre soirée encore plus spéciale. À refaire absolument.	Perfect date night! The Couple pack with the double mattress and souvenir photo made our evening even more special. Definitely doing it again.	Sammy	Pack Couple	Decembre 2024	/sammy.jpg	5	t	2	2026-03-24 08:00:24.466+01	2026-03-24 08:00:24.466+01	\N
5bb98428-6341-4296-b86a-26c8887317a0	Une expérience magique ! L'organisation était impeccable, l'ambiance chaleureuse, et les films excellents. Nous reviendrons avec plaisir pour la prochaine édition.	A magical experience! The organization was impeccable, the atmosphere warm, and the films excellent. We will definitely come back for the next edition.	Brooklyn	Pack Famille	Decembre 2024	/man-profile.jpg	5	t	0	2026-03-24 08:00:24.466+01	2026-03-24 12:23:39.105+01	/uploads/testimonials/avatar-1774351419091-541791766.png
\.


--
-- Data for Name: tickets; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.tickets (id, reservation_id, ticket_number, qr_payload, qr_image_url, pdf_url, status, generated_by, generated_at, "createdAt", "updatedAt") FROM stdin;
36fde980-ebb9-456f-9456-3496b0ab2c18	647a5486-b263-4564-846a-5c74ac183fdd	MIP-MIUQHNLK-FCTHIB	{"ticket_number":"MIP-MIUQHNLK-FCTHIB","reservation_id":"647a5486-b263-4564-846a-5c74ac183fdd","timestamp":1765052171,"signature":"4ea63f455a7fcf621dca16e32d618f5d750beacf41aaf41272c027200597e1f5","participants":[{"name":"Laetitia Belva  Ngamanga","email":"laetitiangamanga7@gmail.com","phone":"237694664897"},{"name":"David Robynn  Otya’a Messi","email":"laetitiangamanga7@gmail.com","phone":"694664897"}],"payer":{"name":"Laetitia Belva  Ngamanga","email":"laetitiangamanga7@gmail.com","phone":"237694664897"}}	/uploads/qr/MIP-MIUQHNLK-FCTHIB.png	/uploads/tickets/MIP-MIUQHNLK-FCTHIB.pdf	valid	dbc241e1-a237-4b97-b8c1-db367ae07cc0	2025-12-06 21:16:11.47+01	2025-12-06 21:16:11.47+01	2025-12-06 21:16:11.47+01
4b2b601f-6a4a-41bc-8429-3ff377942bb7	9e4d9498-334b-40d7-91bd-e8341cbb6448	MIP-MIUQR4NE-F38MDE	{"ticket_number":"MIP-MIUQR4NE-F38MDE","reservation_id":"9e4d9498-334b-40d7-91bd-e8341cbb6448","timestamp":1765052613,"signature":"7c395bc1dc4b24e86cd4a08a74b850b7735cb9bea1d7a71d1a60a21ee14a2a22","participants":[{"name":"Abdel Ndichout","email":"ndichout1984@icloud.com","phone":"237656937672"},{"name":"Merveille  Umwizerwa","email":"merveillebenji@gmail.com","phone":"696434752"}],"payer":{"name":"Abdel Ndichout","email":"ndichout1984@icloud.com","phone":"237656937672"}}	/uploads/qr/MIP-MIUQR4NE-F38MDE.png	/uploads/tickets/MIP-MIUQR4NE-F38MDE.pdf	valid	dbc241e1-a237-4b97-b8c1-db367ae07cc0	2025-12-06 21:23:33.427+01	2025-12-06 21:23:33.427+01	2025-12-06 21:23:33.427+01
d7c1c2c5-b82e-4ab3-b588-db163ebbe060	12e2ee73-7be7-4cd7-a63a-cd12fa9a0b8a	MIP-MIWUV8IJ-CYCZ64	{"ticket_number":"MIP-MIWUV8IJ-CYCZ64","reservation_id":"12e2ee73-7be7-4cd7-a63a-cd12fa9a0b8a","timestamp":1765180455,"signature":"e75d73e0ad6e76c01f9ffab015420db8fc7d6c8158faf8a1088fcd22ac71b2e7","participants":[{"name":"Gabriel Fokou","email":"gabrielfokou26@gmail.com","phone":"237658980051"},{"name":"Morel cœurtis","email":null,"phone":"+237 6 54 19 79 66"},{"name":"Cedrick  Claver","email":null,"phone":"6 96 31 51 69"},{"name":"Stella  Lori","email":null,"phone":"674148151"},{"name":"Viny Dornel","email":null,"phone":"+237 6 77 98 30 28"}],"payer":{"name":"Gabriel Fokou","email":"gabrielfokou26@gmail.com","phone":"237658980051"}}	/uploads/qr/MIP-MIWUV8IJ-CYCZ64.png	/uploads/tickets/MIP-MIWUV8IJ-CYCZ64.pdf	valid	dbc241e1-a237-4b97-b8c1-db367ae07cc0	2025-12-08 08:54:15.931+01	2025-12-08 08:54:15.931+01	2025-12-08 08:54:15.931+01
2ffdb975-615d-4db5-a353-2f4d5a0284c8	a887aff5-10ad-450e-b60d-f0cb7a95c877	MIP-MIXC9Y4T-HKHU5F	{"ticket_number":"MIP-MIXC9Y4T-HKHU5F","reservation_id":"a887aff5-10ad-450e-b60d-f0cb7a95c877","timestamp":1765209695,"signature":"6e5bf4f34459a2592acdccaa36f75e57a04d8ec6b64995e0b6843e45699533d6","participants":[{"name":"Rayan Arnold KOMBOU KAMDOUM","email":"rayankamdoum12@gmail.com","phone":"237673069061"}],"payer":{"name":"Rayan Arnold KOMBOU KAMDOUM","email":"rayankamdoum12@gmail.com","phone":"237673069061"}}	/uploads/qr/MIP-MIXC9Y4T-HKHU5F.png	/uploads/tickets/MIP-MIXC9Y4T-HKHU5F.pdf	valid	dbc241e1-a237-4b97-b8c1-db367ae07cc0	2025-12-08 17:01:35.716+01	2025-12-08 17:01:35.716+01	2025-12-08 17:01:35.716+01
adafb5c1-69a5-4765-b886-c8c18b2f1cd4	0de178ec-777d-455b-99ec-96663e0b8738	MIP-MIZUKH1J-5R2CYN	{"ticket_number":"MIP-MIZUKH1J-5R2CYN","reservation_id":"0de178ec-777d-455b-99ec-96663e0b8738","timestamp":1765361352,"signature":"2eee8082103f6e880709ed178e26d74c0efecc92aaa43ea52de100ce6d674d44","participants":[{"name":"Righteous  Atasiri","email":"iamshatan17@gmail.com","phone":"237693166393"}],"payer":{"name":"Righteous  Atasiri","email":"iamshatan17@gmail.com","phone":"237693166393"}}	/uploads/qr/MIP-MIZUKH1J-5R2CYN.png	/uploads/tickets/MIP-MIZUKH1J-5R2CYN.pdf	valid	dbc241e1-a237-4b97-b8c1-db367ae07cc0	2025-12-10 11:09:12.238+01	2025-12-10 11:09:12.238+01	2025-12-10 11:09:12.238+01
0837b2b3-6076-4486-accf-7c7a5c84e959	6ec62590-e4e7-4190-972e-b9609ebcd23b	MIP-MJ30WWQ7-KR3SAS	{"ticket_number":"MIP-MJ30WWQ7-KR3SAS","reservation_id":"6ec62590-e4e7-4190-972e-b9609ebcd23b","timestamp":1765553408,"signature":"16850f83966f29e627445db6b763219253c77a5c76ac9666a69a3b75904cb4af","participants":[{"name":"Jeff Anthony  TCHALLA TCHASSEM","email":"jefftchass@gmail.com","phone":"237655851766"},{"name":"Audrey Léonce  Nassara","email":null,"phone":"6 94 07 09 12"}],"payer":{"name":"Jeff Anthony  TCHALLA TCHASSEM","email":"jefftchass@gmail.com","phone":"237655851766"}}	/uploads/qr/MIP-MJ30WWQ7-KR3SAS.png	/uploads/tickets/MIP-MJ30WWQ7-KR3SAS.pdf	valid	dbc241e1-a237-4b97-b8c1-db367ae07cc0	2025-12-12 16:30:08.647+01	2025-12-12 16:30:08.647+01	2025-12-12 16:30:08.648+01
029fb400-f839-41ef-a628-4ede2da9eb1d	49e02951-ae2a-453f-90fd-f302c1cd7c8e	MIP-MJ5MRAJR-3LSZ10	{"ticket_number":"MIP-MJ5MRAJR-3LSZ10","reservation_id":"49e02951-ae2a-453f-90fd-f302c1cd7c8e","timestamp":1765711030,"signature":"98e10cee0cd189da9d50f5588e229ea6582dabc2d5a6dbb7a76e2f3403e4958a","participants":[{"name":"Marie-joséphine EMALE KANG","email":"mariejosyek@gmail.com","phone":"237696436352"}],"payer":{"name":"Marie-joséphine EMALE KANG","email":"mariejosyek@gmail.com","phone":"237696436352"}}	/uploads/qr/MIP-MJ5MRAJR-3LSZ10.png	/uploads/tickets/MIP-MJ5MRAJR-3LSZ10.pdf	valid	dbc241e1-a237-4b97-b8c1-db367ae07cc0	2025-12-14 12:17:10.557+01	2025-12-14 12:17:10.557+01	2025-12-14 12:17:10.557+01
fe49ddd8-72e1-4831-8a2d-d7b72eaddf64	5c75ca03-2ba3-47ff-b688-7e948bffc827	MIP-MJ5PHWVQ-2DZV5P	{"ticket_number":"MIP-MJ5PHWVQ-2DZV5P","reservation_id":"5c75ca03-2ba3-47ff-b688-7e948bffc827","timestamp":1765715631,"signature":"f59e8d4a4e7a15153a3fec8c110c35182bc24078cfa2478544255aca285d325a","participants":[{"name":"Fortune  Tagne","email":"tagnefortune0@gmail.com","phone":"237655443776"},{"name":"Mégane  Nguepinssi","email":null,"phone":"656809124"}],"payer":{"name":"Fortune  Tagne","email":"tagnefortune0@gmail.com","phone":"237655443776"}}	/uploads/qr/MIP-MJ5PHWVQ-2DZV5P.png	/uploads/tickets/MIP-MJ5PHWVQ-2DZV5P.pdf	valid	dbc241e1-a237-4b97-b8c1-db367ae07cc0	2025-12-14 13:33:51.847+01	2025-12-14 13:33:51.847+01	2025-12-14 13:33:51.848+01
6c7a61eb-5643-475d-b8e8-bfa9fce4ec35	039d7927-321e-459c-8250-31e3a2ebf3cc	MIP-MJ5QV473-6YH5C0	{"ticket_number":"MIP-MJ5QV473-6YH5C0","reservation_id":"039d7927-321e-459c-8250-31e3a2ebf3cc","timestamp":1765717927,"signature":"5ed043c11b32c1e114fbcc9aa02d9aa349ba90a188790b74acc1032be92070b3","participants":[{"name":"Ravel  Pessy","email":"tambatresor@icloud.com","phone":"237657483769"}],"payer":{"name":"Ravel  Pessy","email":"tambatresor@icloud.com","phone":"237657483769"}}	/uploads/qr/MIP-MJ5QV473-6YH5C0.png	/uploads/tickets/MIP-MJ5QV473-6YH5C0.pdf	valid	dbc241e1-a237-4b97-b8c1-db367ae07cc0	2025-12-14 14:12:07.411+01	2025-12-14 14:12:07.411+01	2025-12-14 14:12:07.412+01
c444ed6d-bc43-4561-9fea-ee1315667416	47de6424-a45b-4dc2-a0b0-b4cde0ac4248	MIP-MJ607S5I-CE998B	{"ticket_number":"MIP-MJ607S5I-CE998B","reservation_id":"47de6424-a45b-4dc2-a0b0-b4cde0ac4248","timestamp":1765733634,"signature":"b7399cb25c0ca47edb6f85cf43d396209329db0d3767052f7921f5e0ae5949c8","participants":[{"name":"Nathanaël  Tamba","email":"Koltanatamba@gmail.com","phone":"237682973174"},{"name":"Divine  Divine","email":null,"phone":"6 58 43 58 82"}],"payer":{"name":"Nathanaël  Tamba","email":"Koltanatamba@gmail.com","phone":"237682973174"}}	/uploads/qr/MIP-MJ607S5I-CE998B.png	/uploads/tickets/MIP-MJ607S5I-CE998B.pdf	valid	dbc241e1-a237-4b97-b8c1-db367ae07cc0	2025-12-14 18:33:54.847+01	2025-12-14 18:33:54.847+01	2025-12-14 18:33:54.847+01
b4a8d383-de48-4f8f-92e5-b5adac754835	0781a9b4-28ad-4a01-995f-16b546e598c0	MIP-MJ60ADSB-YDX52W	{"ticket_number":"MIP-MJ60ADSB-YDX52W","reservation_id":"0781a9b4-28ad-4a01-995f-16b546e598c0","timestamp":1765733755,"signature":"920589b378dd2b042dba872848ee4e09b3960a7d64809d1850593fb130c1bbff","participants":[{"name":"Sonia  Mbatchou","email":"soniageorgiambatchou@icloud.com","phone":"237657484401"},{"name":"Brendaine Tina","email":"Tinabrendaines@icloud.com","phone":"6 91 06 22 03"}],"payer":{"name":"Sonia  Mbatchou","email":"soniageorgiambatchou@icloud.com","phone":"237657484401"}}	/uploads/qr/MIP-MJ60ADSB-YDX52W.png	/uploads/tickets/MIP-MJ60ADSB-YDX52W.pdf	valid	dbc241e1-a237-4b97-b8c1-db367ae07cc0	2025-12-14 18:35:56.243+01	2025-12-14 18:35:56.243+01	2025-12-14 18:35:56.243+01
e751cd2d-8c85-4a48-acf5-a3e5e11e93c4	bb8d5c26-4cc6-4a6c-9dbf-f794cefac2b3	MIP-MJFU6X0U-IVAQIA	{"ticket_number":"MIP-MJFU6X0U-IVAQIA","reservation_id":"bb8d5c26-4cc6-4a6c-9dbf-f794cefac2b3","timestamp":1766328178,"signature":"443f5bd16cb513a6dce234b314586614b77775925acdbf429617b0a22369835b","participants":[{"name":"Anas Farid Njimoluh","email":"latifnjimoluh@gmail.com","phone":"237672475691"}],"payer":{"name":"Anas Farid Njimoluh","email":"latifnjimoluh@gmail.com","phone":"237672475691"}}	/uploads/qr/MIP-MJFU6X0U-IVAQIA.png	/uploads/tickets/MIP-MJFU6X0U-IVAQIA.pdf	valid	02ae193b-0f63-42df-b039-d984998f0d2a	2025-12-21 15:42:58.454+01	2025-12-21 15:42:58.454+01	2025-12-21 15:42:58.454+01
9465b814-5ccf-4e15-98d7-b0e788d65eda	9266b89f-fb12-43a5-bf94-dc70cc357e98	MIP-MJ7499JO-ZJGVDP	{"ticket_number":"MIP-MJ7499JO-ZJGVDP","reservation_id":"9266b89f-fb12-43a5-bf94-dc70cc357e98","timestamp":1765800888,"signature":"fc9f62f08005ce4d1ca53179c181ff19363c05fb5dfe49bbbe3c8c48b451c2bd","participants":[{"name":"Anne Vanessa  Mbazoa","email":"vanessambazoa9@gmail.com","phone":"237690825139"},{"name":"Bb Chloé Bb Malik","email":"vanessambazoa9@gmail.com","phone":"690825139"},{"name":"Bb Wayne Vanessa","email":"vanessambazoa9@gmail.com","phone":"690825139"}],"payer":{"name":"Anne Vanessa  Mbazoa","email":"vanessambazoa9@gmail.com","phone":"237690825139"}}	/uploads/qr/MIP-MJ7499JO-ZJGVDP.png	/uploads/tickets/MIP-MJ7499JO-ZJGVDP.pdf	valid	dbc241e1-a237-4b97-b8c1-db367ae07cc0	2025-12-15 13:14:48.734+01	2025-12-15 13:14:48.734+01	2025-12-15 13:14:48.734+01
01d210dd-f45a-422d-907e-92c8c7d66b82	f0a4a00e-bd08-4ac4-abc6-834b97869450	MIP-MJ78OOOW-5WOB81	{"ticket_number":"MIP-MJ78OOOW-5WOB81","reservation_id":"f0a4a00e-bd08-4ac4-abc6-834b97869450","timestamp":1765808326,"signature":"ea21a0a160790996a383825f5e9b7618d36e788c46dcb299a0201a3754d8f3c6","participants":[{"name":"Ivan Junior  KETCHAPA","email":"juniorketchapa3@gmail.com","phone":"237698947179"},{"name":"Fortune Rahina TAWAMBA","email":"juniorketchapa3@gmail.com","phone":"696083698"}],"payer":{"name":"Ivan Junior  KETCHAPA","email":"juniorketchapa3@gmail.com","phone":"237698947179"}}	/uploads/qr/MIP-MJ78OOOW-5WOB81.png	/uploads/tickets/MIP-MJ78OOOW-5WOB81.pdf	valid	dbc241e1-a237-4b97-b8c1-db367ae07cc0	2025-12-15 15:18:46.762+01	2025-12-15 15:18:46.762+01	2025-12-15 15:18:46.762+01
7d0f1f44-1c07-4dba-a1d7-ab7993da5525	4e8358b2-1b25-4116-a0c1-e0e6c082f82d	MIP-MJ7BCJ36-ALQ3SC	{"ticket_number":"MIP-MJ7BCJ36-ALQ3SC","reservation_id":"4e8358b2-1b25-4116-a0c1-e0e6c082f82d","timestamp":1765812798,"signature":"4cb97a374e035ae944cdc5d123ce19a320f252cda12c5a2d35e919513a4b7e7e","participants":[{"name":"Paul-fany  Doumba","email":"paul-fanydoumba@icloud.com","phone":"237690417616"}],"payer":{"name":"Paul-fany  Doumba","email":"paul-fanydoumba@icloud.com","phone":"237690417616"}}	/uploads/qr/MIP-MJ7BCJ36-ALQ3SC.png	/uploads/tickets/MIP-MJ7BCJ36-ALQ3SC.pdf	valid	dbc241e1-a237-4b97-b8c1-db367ae07cc0	2025-12-15 16:33:18.338+01	2025-12-15 16:33:18.338+01	2025-12-15 16:33:18.338+01
a6d962e4-aef8-4517-8856-49f248828abc	a29df73c-6441-4511-bd9c-001185b72b19	MIP-MJ7NF8BF-FJ5SDR	{"ticket_number":"MIP-MJ7NF8BF-FJ5SDR","reservation_id":"a29df73c-6441-4511-bd9c-001185b72b19","timestamp":1765833079,"signature":"5ef84d28e06942274701323452296e96316be9f1511c145a713d6bfe5e8bcfcd","participants":[{"name":"Tatiana Stella Elouga Gounouck","email":"etatianastella@gmail.com","phone":"237693838518"},{"name":"X Y","email":null,"phone":null},{"name":"X Y","email":null,"phone":null}],"payer":{"name":"Tatiana Stella Elouga Gounouck","email":"etatianastella@gmail.com","phone":"237693838518"}}	/uploads/qr/MIP-MJ7NF8BF-FJ5SDR.png	/uploads/tickets/MIP-MJ7NF8BF-FJ5SDR.pdf	valid	dbc241e1-a237-4b97-b8c1-db367ae07cc0	2025-12-15 22:11:19.8+01	2025-12-15 22:11:19.8+01	2025-12-15 22:11:19.8+01
b0b0ac23-249f-4167-b849-8feaf5169638	9afd72dd-37ea-4588-93b4-d756fcc2d8d4	MIP-MJ8C8QWO-EGSVA7	{"ticket_number":"MIP-MJ8C8QWO-EGSVA7","reservation_id":"9afd72dd-37ea-4588-93b4-d756fcc2d8d4","timestamp":1765874767,"signature":"87a724ef243cf8329925192177ee97ec225c0c1ef9e8f69186e1b804c1e58962","participants":[{"name":"Ze Arnauld","email":"arnauldze478@gmail.com","phone":"237683609362"},{"name":"Fernande shanice Zibi","email":"Evazibifs@gmail.com","phone":"622146419"}],"payer":{"name":"Ze Arnauld","email":"arnauldze478@gmail.com","phone":"237683609362"}}	/uploads/qr/MIP-MJ8C8QWO-EGSVA7.png	/uploads/tickets/MIP-MJ8C8QWO-EGSVA7.pdf	valid	dbc241e1-a237-4b97-b8c1-db367ae07cc0	2025-12-16 09:46:07.676+01	2025-12-16 09:46:07.676+01	2025-12-16 09:46:07.676+01
3f405145-6014-4e3b-93a2-b507a73e8b3f	d4a7c88b-5fe9-44e7-8452-2111d6679e8e	MIP-MJ8YKO4A-YHYHPF	{"ticket_number":"MIP-MJ8YKO4A-YHYHPF","reservation_id":"d4a7c88b-5fe9-44e7-8452-2111d6679e8e","timestamp":1765912275,"signature":"e95b389124060c3f33b7fdd3c9c652f59c7a5003892db6330798725cc9004b82","participants":[{"name":"Dorothé gloria Engoulou","email":"doumbapaul-fany@icloud.com","phone":"237697434502"}],"payer":{"name":"Dorothé gloria Engoulou","email":"doumbapaul-fany@icloud.com","phone":"237697434502"}}	/uploads/qr/MIP-MJ8YKO4A-YHYHPF.png	/uploads/tickets/MIP-MJ8YKO4A-YHYHPF.pdf	valid	dbc241e1-a237-4b97-b8c1-db367ae07cc0	2025-12-16 20:11:15.478+01	2025-12-16 20:11:15.478+01	2025-12-16 20:11:15.478+01
76b74505-2063-4b5f-9bda-b3d9ed701f70	6b5632e3-39e5-4998-b7f2-a800de52231e	MIP-MJ9152ZK-YAM2QY	{"ticket_number":"MIP-MJ9152ZK-YAM2QY","reservation_id":"6b5632e3-39e5-4998-b7f2-a800de52231e","timestamp":1765916586,"signature":"6954ba1e19da6c584a88f7a785dabd2f9fca45e39d835fc96d256794464a4191","participants":[{"name":"Tony Tsague","email":"tsaguetony@gmail.com","phone":"237690473113"},{"name":"Ange TCHOUANE","email":"yamatotony2@gmail.com","phone":"+237 6 56 36 49 94"}],"payer":{"name":"Tony Tsague","email":"tsaguetony@gmail.com","phone":"237690473113"}}	/uploads/qr/MIP-MJ9152ZK-YAM2QY.png	/uploads/tickets/MIP-MJ9152ZK-YAM2QY.pdf	valid	dbc241e1-a237-4b97-b8c1-db367ae07cc0	2025-12-16 21:23:07.075+01	2025-12-16 21:23:07.075+01	2025-12-16 21:23:07.075+01
87b78b00-a786-45d5-ac53-dc165f1d5194	553f726b-33a5-4786-8980-21bd128692ed	MIP-MJA4ZEA3-IU2AQ1	{"ticket_number":"MIP-MJA4ZEA3-IU2AQ1","reservation_id":"553f726b-33a5-4786-8980-21bd128692ed","timestamp":1765983506,"signature":"d20098393116e64cbfde48d9a400582c55ea7d2a70bc2e495b697f63a34dec61","participants":[{"name":"Ravel Pessy","email":"tambatresor@icloud.com","phone":"237657483769"}],"payer":{"name":"Ravel Pessy","email":"tambatresor@icloud.com","phone":"237657483769"}}	/uploads/qr/MIP-MJA4ZEA3-IU2AQ1.png	/uploads/tickets/MIP-MJA4ZEA3-IU2AQ1.pdf	valid	dbc241e1-a237-4b97-b8c1-db367ae07cc0	2025-12-17 15:58:26.403+01	2025-12-17 15:58:26.403+01	2025-12-17 15:58:26.403+01
ce13135e-64f8-455d-be1f-044f54f65c17	4dadaddb-6d54-4d63-9ff4-d6dc6ffbbb82	MIP-MJA51W25-E8AGQL	{"ticket_number":"MIP-MJA51W25-E8AGQL","reservation_id":"4dadaddb-6d54-4d63-9ff4-d6dc6ffbbb82","timestamp":1765983622,"signature":"66127ce97a152ec31c1717a144c2833b36c7ef94777e0dfc9c8a1e46218744da","participants":[{"name":"KAMENI Marguerite","email":"margueritekameni2@gmail.com","phone":"652968611"}],"payer":{"name":"KAMENI Marguerite","email":"margueritekameni2@gmail.com","phone":"652968611"}}	/uploads/qr/MIP-MJA51W25-E8AGQL.png	/uploads/tickets/MIP-MJA51W25-E8AGQL.pdf	valid	dbc241e1-a237-4b97-b8c1-db367ae07cc0	2025-12-17 16:00:22.739+01	2025-12-17 16:00:22.74+01	2025-12-17 16:00:22.74+01
4cfb767c-0094-4599-95bd-ae997aeb5da7	52525a88-08af-4ff1-9e74-7342ea3556b3	MIP-MJAC056Y-3EECEQ	{"ticket_number":"MIP-MJAC056Y-3EECEQ","reservation_id":"52525a88-08af-4ff1-9e74-7342ea3556b3","timestamp":1765995298,"signature":"ab20828bb43327a004d19ea203d29e17f271b87d9b7042aa13a537174386cc12","participants":[{"name":"NLOGA  ALEX","email":"latredesign22@gmail.com","phone":"237697783"}],"payer":{"name":"NLOGA  ALEX","email":"latredesign22@gmail.com","phone":"237697783"}}	/uploads/qr/MIP-MJAC056Y-3EECEQ.png	/uploads/tickets/MIP-MJAC056Y-3EECEQ.pdf	valid	dbc241e1-a237-4b97-b8c1-db367ae07cc0	2025-12-17 19:14:58.581+01	2025-12-17 19:14:58.581+01	2025-12-17 19:14:58.582+01
f6eb05af-a551-49d2-9831-a5e5a551442a	cd3f7caf-6882-4e32-9687-7a8274f23cd5	MIP-MJAECRQE-FOSNH9	{"ticket_number":"MIP-MJAECRQE-FOSNH9","reservation_id":"cd3f7caf-6882-4e32-9687-7a8274f23cd5","timestamp":1765999246,"signature":"02b766543d84cb544de590e2b505df08b50195d8963f8e44c70d334985f89a1d","participants":[{"name":"Maeva Ntonga","email":null,"phone":"237688227556"}],"payer":{"name":"Maeva Ntonga","email":null,"phone":"237688227556"}}	/uploads/qr/MIP-MJAECRQE-FOSNH9.png	/uploads/tickets/MIP-MJAECRQE-FOSNH9.pdf	valid	dbc241e1-a237-4b97-b8c1-db367ae07cc0	2025-12-17 20:20:46.951+01	2025-12-17 20:20:46.951+01	2025-12-17 20:20:46.952+01
31f6a4cb-43d5-4cd5-985b-b074bbb0c15f	0d84035d-37d8-4dab-ace9-56278bd579e8	MIP-MJAEG3I7-VZ09M9	{"ticket_number":"MIP-MJAEG3I7-VZ09M9","reservation_id":"0d84035d-37d8-4dab-ace9-56278bd579e8","timestamp":1765999401,"signature":"afd8786d23ae1704c64faa7b40a41a7dade841da7b8812dcaf3e9bf7e4d36a32","participants":[{"name":"cerena  Touna Ongono","email":null,"phone":"237688227556"}],"payer":{"name":"cerena  Touna Ongono","email":null,"phone":"237688227556"}}	/uploads/qr/MIP-MJAEG3I7-VZ09M9.png	/uploads/tickets/MIP-MJAEG3I7-VZ09M9.pdf	valid	dbc241e1-a237-4b97-b8c1-db367ae07cc0	2025-12-17 20:23:22.158+01	2025-12-17 20:23:22.158+01	2025-12-17 20:23:22.159+01
46b59079-8a9e-4067-983b-1f16936d8a61	4c0e3b42-e279-4604-a498-0bc81ae09b1e	MIP-MN4B3PZ5-73PU0K	{"ticket_number":"MIP-MN4B3PZ5-73PU0K","reservation_id":"4c0e3b42-e279-4604-a498-0bc81ae09b1e","timestamp":1774338117,"signature":"4d5817c65e3da774ad553e7a189f23997df918ee746383c22efa19d337494b0d","participants":[{"name":"latif njimoluh","email":"latifnjimoluh@gmail.com","phone":null}],"payer":{"name":"latif njimoluh","email":"latifnjimoluh@gmail.com","phone":"658509963"}}	/uploads/qr/MIP-MN4B3PZ5-73PU0K.png	/uploads/tickets/MIP-MN4B3PZ5-73PU0K.pdf	used	282162e8-232a-4635-8bea-437ced2365e2	2026-03-24 08:41:58.051+01	2026-03-24 08:41:58.051+01	2026-03-24 09:13:22.535+01
d8a804de-d622-4ecf-8c5f-73faf929a98d	1aeb340c-48c3-4eff-ba55-f55f52cc9df2	MIP-MN4CA31X-DSHOTS	{"ticket_number":"MIP-MN4CA31X-DSHOTS","reservation_id":"1aeb340c-48c3-4eff-ba55-f55f52cc9df2","timestamp":1774340094,"signature":"76d3b04feeee6f0595cec4d333c3c1746e0cf0be4ffb907ce369b38cfb6c4c90","participants":[{"name":"latif njimoluh","email":"latifnjimoluh@gmail.com","phone":null},{"name":"latif njimoluh","email":"latifnjimoluh@gmail.com","phone":null},{"name":"latif njimoluh","email":null,"phone":null}],"payer":{"name":"latif njimoluh","email":"latifnjimoluh@gmail.com","phone":"658509963"}}	/uploads/qr/MIP-MN4CA31X-DSHOTS.png	/uploads/tickets/MIP-MN4CA31X-DSHOTS.pdf	valid	282162e8-232a-4635-8bea-437ced2365e2	2026-03-24 09:14:54.628+01	2026-03-24 09:14:54.628+01	2026-03-24 09:14:54.629+01
ce52992f-3e13-4199-b402-c98a5e39390e	d569c5ec-1b98-45c9-a52d-4f086fdbbc37	MIP-MN4DWCQM-QTMI9Y	{"ticket_number":"MIP-MN4DWCQM-QTMI9Y","reservation_id":"d569c5ec-1b98-45c9-a52d-4f086fdbbc37","timestamp":1774342813,"signature":"59097a145c02eda6d3a7c6bef2a676ed5a5f27206117532a49594c20e1cb3b4d","participants":[{"name":"latif njimoluh","email":"latifnjimoluh@gmail.com","phone":null},{"name":"latif njimoluh","email":"latifnjimoluh@gmail.com","phone":null}],"payer":{"name":"latif njimoluh","email":"latifnjimoluh@gmail.com","phone":"658509963"}}	/uploads/qr/MIP-MN4DWCQM-QTMI9Y.png	/uploads/tickets/MIP-MN4DWCQM-QTMI9Y.pdf	used	282162e8-232a-4635-8bea-437ced2365e2	2026-03-24 10:00:13.137+01	2026-03-24 10:00:13.137+01	2026-03-24 10:40:54.397+01
42473b2b-b9c2-43fd-9e27-722e42a4a4f3	0afd8c46-0cf9-4007-b2e3-1be95473d50d	MIP-MN4JEB3C-4UMZK7	{"ticket_number":"MIP-MN4JEB3C-4UMZK7","reservation_id":"0afd8c46-0cf9-4007-b2e3-1be95473d50d","timestamp":1774352048,"signature":"1d9141f3184a3221a52a6bdc2636aa0d182b65b55ec3f15d1a5ab66373eaab9a","participants":[{"name":"latif njimoluh","email":"latifnjimoluh@gmail.com","phone":"237658509963"},{"name":"Njimoluh Farid","email":"latifnjimoluh@gmail.com","phone":null}],"payer":{"name":"latif njimoluh","email":"latifnjimoluh@gmail.com","phone":"237658509963"}}	/uploads/qr/MIP-MN4JEB3C-4UMZK7.png	/uploads/tickets/MIP-MN4JEB3C-4UMZK7.pdf	valid	02ae193b-0f63-42df-b039-d984998f0d2a	2026-03-24 12:34:08.979+01	2026-03-24 12:34:08.979+01	2026-03-24 12:34:08.979+01
41acb9e5-f503-4d74-88f0-e10ddd8e00ad	691af412-bef8-48f8-9339-85fd4637f15e	MIP-MNJKWZM8-IT0JBW	{"ticket_number":"MIP-MNJKWZM8-IT0JBW","reservation_id":"691af412-bef8-48f8-9339-85fd4637f15e","timestamp":1775261592,"signature":"68197aa00b31343f6670ac363c0c91692a51e397063017d68efaaeaf1b8055c7","participants":[{"name":"nexus n","email":"latifnjimoluh@gmail.com","phone":"237658509963"}],"payer":{"name":"nexus n","email":"latifnjimoluh@gmail.com","phone":"237658509963"}}	/uploads/qr/MIP-MNJKWZM8-IT0JBW.png	/uploads/tickets/MIP-MNJKWZM8-IT0JBW.pdf	valid	02ae193b-0f63-42df-b039-d984998f0d2a	2026-04-04 01:13:12.807+01	2026-04-04 01:13:12.807+01	2026-04-04 01:13:12.807+01
\.


--
-- Data for Name: unique_visitors; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.unique_visitors (id, ip_hash, times_visited, first_visit, last_visit, created_at, updated_at) FROM stdin;
9920cbba-d04a-480e-b7bd-0885d6cf91ac	a19862a8f83ac233e89e489b927be5bf62153c8289db9a45635b7c3d28fd8c96	1191	2025-12-07 12:28:45.929+01	2025-12-18 10:27:11.871+01	2025-12-07 12:28:45.93+01	2025-12-18 10:27:11.871+01
15900385-496a-4dbe-9f87-48967b7343ac	c8b94883e618fe821a88ed3f11cf8c25f2a197839b27d3ca17627f538c2c6cb8	1	2025-12-18 05:51:55.65+01	2025-12-18 05:51:55.65+01	2025-12-18 05:51:55.65+01	2025-12-18 05:51:55.651+01
aac0ff80-18d6-48a1-897f-81f5c31ddeea	810ad658290c5cb713d791a1f443327b2c750eca87589f9b7a7dc44fca519790	1	2025-12-14 23:58:56.039+01	2025-12-14 23:58:56.039+01	2025-12-14 23:58:56.039+01	2025-12-14 23:58:56.039+01
517810a4-2249-456e-95f7-1ebf72eedbf0	629b653d72fb45f5ee14a6116c634767c3152e772145e10d89478047aa8975b4	1	2025-12-15 12:48:01.165+01	2025-12-15 12:48:01.165+01	2025-12-15 12:48:01.166+01	2025-12-15 12:48:01.166+01
8bb13d25-491c-48f6-bdaa-f166116ac8e9	41210dc38086fd5d019bfc35b812a332a77b2f4e258b7d484ff5825b291c5f5e	70	2025-12-21 15:32:34.694+01	2026-04-04 18:34:41.554+01	2025-12-21 15:32:34.695+01	2026-04-04 18:34:41.554+01
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.users (id, email, password_hash, name, phone, role, "createdAt", "updatedAt", last_login, role_id) FROM stdin;
dbc241e1-a237-4b97-b8c1-db367ae07cc0	matangabrooklyn@gmail.com	$2a$10$IVK3eUi0j6RW4Vwp48SQgu.SkjrudoOGwSu2LmgWPrwXsvXtqOHNC	Brooklyn Matanga 		superadmin	2025-12-04 20:12:38.559+01	2025-12-14 22:13:06.928+01	2025-12-14 22:13:06.928+01	\N
2734a88d-9994-4c30-b0e4-cde8a9c13874	admin@moviepark.com	$2a$10$dkWLQd1T0ESerI3J8XEx..uQoGeMjBoqlUT4YMpycA9WXsFH74E7.	admintest		superadmin	2025-12-04 23:16:17.589+01	2026-03-24 03:02:08.508+01	2026-03-24 03:02:08.507+01	\N
282162e8-232a-4635-8bea-437ced2365e2	admin@test.com	$2a$10$91rvwqziCijy7dfiUvePzeHf2kVGap9s8oAV4u2Q0/vLSlAZvaEKS	Admin Test	\N	admin	2026-03-24 03:01:46.066144+01	2026-03-24 10:54:52.279+01	2026-03-24 10:54:52.279+01	\N
02ae193b-0f63-42df-b039-d984998f0d2a	latifnjimoluh@gmail.com	$2a$10$VMBphb8wjm43z6eo8XSYIurPCgbxHnBoeKDlDMwZUBuW.bA4YAP8i	Admin	699000000	superadmin	2025-12-01 16:11:00.621+01	2026-04-04 16:50:31.953+01	2026-04-04 16:50:31.949+01	f0830051-4319-49ee-b7c6-837c9bfbf27c
\.


--
-- Data for Name: visits; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.visits (id, total_visits, created_at, updated_at) FROM stdin;
4e40dcad-5f4f-4e91-a677-52f367d67bf2	1264	2025-12-07 12:28:45.912+01	2026-04-04 18:34:41.47+01
\.


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

