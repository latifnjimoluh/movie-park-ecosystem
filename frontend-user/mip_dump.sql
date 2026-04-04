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
-- Name: enum_activity_logs_action; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.enum_activity_logs_action AS ENUM (
    'create',
    'read',
    'update',
    'delete',
    'export',
    'validate'
);


ALTER TYPE public.enum_activity_logs_action OWNER TO postgres;

--
-- Name: enum_activity_logs_entity_type; Type: TYPE; Schema: public; Owner: postgres
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


ALTER TYPE public.enum_activity_logs_entity_type OWNER TO postgres;

--
-- Name: enum_activity_logs_status; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.enum_activity_logs_status AS ENUM (
    'success',
    'failed'
);


ALTER TYPE public.enum_activity_logs_status OWNER TO postgres;

--
-- Name: enum_payments_method; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.enum_payments_method AS ENUM (
    'momo',
    'cash',
    'orange',
    'card',
    'other'
);


ALTER TYPE public.enum_payments_method OWNER TO postgres;

--
-- Name: enum_reservations_status; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.enum_reservations_status AS ENUM (
    'pending',
    'partial',
    'paid',
    'ticket_generated',
    'cancelled'
);


ALTER TYPE public.enum_reservations_status OWNER TO postgres;

--
-- Name: enum_tickets_status; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.enum_tickets_status AS ENUM (
    'valid',
    'used',
    'cancelled'
);


ALTER TYPE public.enum_tickets_status OWNER TO postgres;

--
-- Name: enum_users_role; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.enum_users_role AS ENUM (
    'superadmin',
    'admin',
    'cashier',
    'scanner'
);


ALTER TYPE public.enum_users_role OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: SequelizeMeta; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."SequelizeMeta" (
    name character varying(255) NOT NULL
);


ALTER TABLE public."SequelizeMeta" OWNER TO postgres;

--
-- Name: UniqueVisitors; Type: TABLE; Schema: public; Owner: postgres
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


ALTER TABLE public."UniqueVisitors" OWNER TO postgres;

--
-- Name: COLUMN "UniqueVisitors"."ipHash"; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public."UniqueVisitors"."ipHash" IS 'SHA256 hash of visitor IP address for privacy';


--
-- Name: UniqueVisitors_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."UniqueVisitors_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."UniqueVisitors_id_seq" OWNER TO postgres;

--
-- Name: UniqueVisitors_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."UniqueVisitors_id_seq" OWNED BY public."UniqueVisitors".id;


--
-- Name: Visits; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Visits" (
    id integer NOT NULL,
    "totalVisits" integer DEFAULT 0 NOT NULL,
    "createdAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."Visits" OWNER TO postgres;

--
-- Name: Visits_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Visits_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Visits_id_seq" OWNER TO postgres;

--
-- Name: Visits_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Visits_id_seq" OWNED BY public."Visits".id;


--
-- Name: action_logs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.action_logs (
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    reservation_id uuid,
    action_type character varying(255) NOT NULL,
    meta jsonb DEFAULT '{}'::jsonb,
    "createdAt" timestamp with time zone,
    description character varying(255)
);


ALTER TABLE public.action_logs OWNER TO postgres;

--
-- Name: activity_logs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.activity_logs (
    id uuid NOT NULL,
    user_id uuid,
    permission character varying(255),
    entity_type public.enum_activity_logs_entity_type NOT NULL,
    entity_id uuid,
    action public.enum_activity_logs_action NOT NULL,
    description text,
    changes jsonb DEFAULT '{}'::jsonb,
    status public.enum_activity_logs_status DEFAULT 'success'::public.enum_activity_logs_status,
    ip_address character varying(255),
    user_agent character varying(255),
    created_at timestamp with time zone
);


ALTER TABLE public.activity_logs OWNER TO postgres;

--
-- Name: COLUMN activity_logs.permission; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.activity_logs.permission IS 'Permission utilisée pour cette action (ex: packs.create)';


--
-- Name: COLUMN activity_logs.entity_type; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.activity_logs.entity_type IS 'Type d''entité affectée';


--
-- Name: COLUMN activity_logs.entity_id; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.activity_logs.entity_id IS 'ID de l''entité affectée';


--
-- Name: COLUMN activity_logs.action; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.activity_logs.action IS 'Type d''action effectuée';


--
-- Name: COLUMN activity_logs.description; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.activity_logs.description IS 'Description lisible de l''action';


--
-- Name: COLUMN activity_logs.changes; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.activity_logs.changes IS 'Détails des changements effectués';


--
-- Name: packs; Type: TABLE; Schema: public; Owner: postgres
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


ALTER TABLE public.packs OWNER TO postgres;

--
-- Name: COLUMN packs.price; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.packs.price IS 'Price in XAF cents';


--
-- Name: COLUMN packs.capacity; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.packs.capacity IS 'Number of participants, null if single';


--
-- Name: participants; Type: TABLE; Schema: public; Owner: postgres
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


ALTER TABLE public.participants OWNER TO postgres;

--
-- Name: payments; Type: TABLE; Schema: public; Owner: postgres
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


ALTER TABLE public.payments OWNER TO postgres;

--
-- Name: COLUMN payments.amount; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.payments.amount IS 'Amount in XAF cents';


--
-- Name: reservations; Type: TABLE; Schema: public; Owner: postgres
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


ALTER TABLE public.reservations OWNER TO postgres;

--
-- Name: COLUMN reservations.unit_price; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.reservations.unit_price IS 'Price per unit in XAF cents';


--
-- Name: tickets; Type: TABLE; Schema: public; Owner: postgres
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


ALTER TABLE public.tickets OWNER TO postgres;

--
-- Name: COLUMN tickets.qr_payload; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.tickets.qr_payload IS 'JSON with signature';


--
-- Name: unique_visitors; Type: TABLE; Schema: public; Owner: postgres
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


ALTER TABLE public.unique_visitors OWNER TO postgres;

--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id uuid NOT NULL,
    email character varying(255) NOT NULL,
    password_hash character varying(255) NOT NULL,
    name character varying(255) NOT NULL,
    phone character varying(255),
    role public.enum_users_role DEFAULT 'cashier'::public.enum_users_role,
    "createdAt" timestamp with time zone,
    "updatedAt" timestamp with time zone,
    last_login timestamp with time zone
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: visits; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.visits (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    total_visits integer DEFAULT 0 NOT NULL,
    created_at timestamp with time zone,
    updated_at timestamp with time zone
);


ALTER TABLE public.visits OWNER TO postgres;

--
-- Name: UniqueVisitors id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."UniqueVisitors" ALTER COLUMN id SET DEFAULT nextval('public."UniqueVisitors_id_seq"'::regclass);


--
-- Name: Visits id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Visits" ALTER COLUMN id SET DEFAULT nextval('public."Visits_id_seq"'::regclass);


--
-- Data for Name: SequelizeMeta; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."SequelizeMeta" (name) FROM stdin;
20251201224802-add-description-to-actionlog.js
add-last-login-to-users.js
20251205-create-activity-logs-table.js
20250107-create-unique-visitors.js
20250107-create-visits.js
\.


--
-- Data for Name: UniqueVisitors; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."UniqueVisitors" (id, "ipHash", "userAgent", "visitCount", "lastVisitedAt", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: Visits; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Visits" (id, "totalVisits", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: action_logs; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.action_logs (id, user_id, reservation_id, action_type, meta, "createdAt", description) FROM stdin;
\.


--
-- Data for Name: activity_logs; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.activity_logs (id, user_id, permission, entity_type, entity_id, action, description, changes, status, ip_address, user_agent, created_at) FROM stdin;
339b355d-ec98-4aad-b6a4-4ee53a04afbb	02ae193b-0f63-42df-b039-d984998f0d2a	public.reservation.create	reservation	f95b38f1-948f-4082-915a-973f935ffb7c	create	Réservation publique créée pour Anas Farid Njimoluh - Forfait: VIP	{"status": "pending", "pack_id": "b8c4fe5e-16f1-47a7-86bc-423dcb7a3d7b", "quantity": 1, "pack_name": "VIP", "payeur_name": "Anas Farid Njimoluh", "total_price": 5000, "payeur_email": "latifnjimoluh@gmail.com", "payeur_phone": "237672475691", "participants_count": 1}	success	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	2025-12-07 09:06:17.312+01
0bd6583d-16b8-4b0f-b0df-5844fecab39b	02ae193b-0f63-42df-b039-d984998f0d2a	public.reservation.create	reservation	254445f0-ee3a-4915-8d69-4ddcb89076cb	create	Réservation publique créée pour Anas Farid Njimoluh - Forfait: VIP	{"status": "pending", "pack_id": "b8c4fe5e-16f1-47a7-86bc-423dcb7a3d7b", "quantity": 1, "pack_name": "VIP", "payeur_name": "Anas Farid Njimoluh", "total_price": 5000, "payeur_email": "nexuslatif4@gmail.com", "payeur_phone": "237672475691", "participants_count": 1}	success	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	2025-12-07 09:09:44.811+01
f5828967-13e4-4fa1-891b-14013d5b1f78	02ae193b-0f63-42df-b039-d984998f0d2a	public.reservation.create	reservation	b50e80e0-2c8a-41d7-b0f5-bf57d8af7742	create	Réservation publique créée pour Anas Farid Njimoluh - Forfait: VIP	{"status": "pending", "pack_id": "b8c4fe5e-16f1-47a7-86bc-423dcb7a3d7b", "quantity": 1, "pack_name": "VIP", "payeur_name": "Anas Farid Njimoluh", "total_price": 5000, "payeur_email": "nexuslatif4@gmail.com", "payeur_phone": "237672475691", "participants_count": 1}	success	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	2025-12-07 09:11:43.488+01
0bacc4fe-97ca-4144-bdfd-bae6ade08108	02ae193b-0f63-42df-b039-d984998f0d2a	public.reservation.create	reservation	9335975b-686b-4d44-9c45-26927d6ce0ff	create	Réservation publique créée pour Anas Farid Njimoluh - Forfait: Couple	{"status": "pending", "pack_id": "6768485c-c22b-45c7-8141-056221bab100", "quantity": 2, "pack_name": "Couple", "payeur_name": "Anas Farid Njimoluh", "total_price": 8000, "payeur_email": "nexuslatif4@gmail.com", "payeur_phone": "237672475691", "participants_count": 2}	success	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	2025-12-07 09:17:17.866+01
9b29b7e1-cebb-4102-b1ec-f76ed40e5866	02ae193b-0f63-42df-b039-d984998f0d2a	public.reservation.create	reservation	070102c7-d0c9-492c-9845-d7bb2d345841	create	Réservation publique créée pour Anas Farid Njimoluh - Forfait: Couple	{"status": "pending", "pack_id": "6768485c-c22b-45c7-8141-056221bab100", "quantity": 2, "pack_name": "Couple", "payeur_name": "Anas Farid Njimoluh", "total_price": 8000, "payeur_email": "nexuslatif35@gmail.com", "payeur_phone": "237672475691", "participants_count": 2}	success	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	2025-12-07 09:26:47.662+01
f1c59b35-1cfd-4056-bcfb-7d962e62901e	02ae193b-0f63-42df-b039-d984998f0d2a	reservations.delete.permanent	reservation	070102c7-d0c9-492c-9845-d7bb2d345841	delete	Réservation supprimée définitivement (undefined)	{"status": "pending", "total_paid": 0, "payeur_name": "Anas Farid Njimoluh", "total_price": 8000, "payeur_email": "nexuslatif35@gmail.com", "deleted_related_data": {"payments": 0, "participants": 2}}	success	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	2025-12-07 09:34:17.707+01
daa1f15b-e32a-4818-92d1-ef500b63e0cf	02ae193b-0f63-42df-b039-d984998f0d2a	reservations.delete.permanent	reservation	9335975b-686b-4d44-9c45-26927d6ce0ff	delete	Réservation supprimée définitivement (undefined)	{"status": "pending", "total_paid": 0, "payeur_name": "Anas Farid Njimoluh", "total_price": 8000, "payeur_email": "nexuslatif4@gmail.com", "deleted_related_data": {"payments": 0, "participants": 2}}	success	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	2025-12-07 09:34:23.442+01
e22c6d18-3004-4740-b504-a362cd940960	02ae193b-0f63-42df-b039-d984998f0d2a	public.reservation.create	reservation	01c7409a-46c7-41d0-8551-8ff7b0a58664	create	Réservation publique créée pour Anas Farid Njimoluh - Forfait: Couple	{"status": "pending", "pack_id": "6768485c-c22b-45c7-8141-056221bab100", "quantity": 2, "pack_name": "Couple", "payeur_name": "Anas Farid Njimoluh", "total_price": 8000, "payeur_email": "nexuslatif4@gmail.com", "payeur_phone": "237672475691", "participants_count": 2}	success	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	2025-12-07 09:35:02.794+01
531cb3e3-a44c-4988-9075-76aaeab067ab	02ae193b-0f63-42df-b039-d984998f0d2a	public.reservation.create	reservation	185df4eb-6f2d-4e86-b775-f598ab718209	create	Réservation publique créée pour Anas Farid Njimoluh - Forfait: Famille	{"status": "pending", "pack_id": "ab93b402-66b5-4f18-a9c3-da877e326a3f", "quantity": 4, "pack_name": "Famille", "payeur_name": "Anas Farid Njimoluh", "total_price": 10000, "payeur_email": "nexuslatif4@gmail.com", "payeur_phone": "237672475691", "participants_count": 4}	success	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36	2025-12-07 09:55:33.198+01
\.


--
-- Data for Name: packs; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.packs (id, name, price, description, capacity, is_active, "createdAt", "updatedAt") FROM stdin;
b8c4fe5e-16f1-47a7-86bc-423dcb7a3d7b	VIP	5000	Pack VIP accès premium	1	t	2025-12-01 16:39:03.151+01	2025-12-02 09:17:21.082+01
da21dee5-4864-49d9-9ff9-4de4d02bcdd3	Simple	3000	Pack Simple	1	t	2025-12-02 09:17:40.154+01	2025-12-02 09:17:40.155+01
5007978b-f437-4c5a-af79-200e0e00c755	Stand	20000	Stands auto entrepreneur 	3	t	2025-12-02 14:54:57.351+01	2025-12-02 14:54:57.351+01
6768485c-c22b-45c7-8141-056221bab100	Couple	8000	Pack Couple	2	t	2025-12-02 09:18:04.075+01	2025-12-02 09:18:04.075+01
ab93b402-66b5-4f18-a9c3-da877e326a3f	Famille	10000	Pack de Famille	5	t	2025-12-02 09:18:34.166+01	2025-12-05 10:44:20.592+01
\.


--
-- Data for Name: participants; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.participants (id, reservation_id, name, phone, email, ticket_id, entrance_validated, "createdAt", "updatedAt") FROM stdin;
76384d2a-5378-4e34-a54c-9957a30e7934	4c501e14-d684-435d-920e-1d571ac3de61	Anas Farid Latif	237658509963	latifnjimoluh@gmail.com	\N	f	2025-12-07 09:02:01.478+01	2025-12-07 09:02:01.478+01
65a89de5-0cc6-42c1-94da-798ba2a9374c	c0932e10-3f22-4fc7-8a6d-c971be4edf5e	Anas Farid Latif	237658509963	latifnjimoluh@gmail.com	\N	f	2025-12-07 09:02:01.48+01	2025-12-07 09:02:01.48+01
e0ca99c7-71c2-4252-9df2-31102cf681aa	4c501e14-d684-435d-920e-1d571ac3de61	Anas Farid Njimoluh	672475691	\N	\N	f	2025-12-07 09:02:01.481+01	2025-12-07 09:02:01.482+01
8a6b2740-a5c9-4de1-b5d2-9549ebbe85a9	c0932e10-3f22-4fc7-8a6d-c971be4edf5e	Anas Farid Njimoluh	672475691	\N	\N	f	2025-12-07 09:02:01.483+01	2025-12-07 09:02:01.485+01
4fa8bb33-021c-4c70-bca6-a65472f0dd5a	f95b38f1-948f-4082-915a-973f935ffb7c	Anas Farid Njimoluh	237672475691	latifnjimoluh@gmail.com	\N	f	2025-12-07 09:06:17.288+01	2025-12-07 09:06:17.289+01
384f5fb5-4a6b-4ec6-93f4-830f60a8c234	254445f0-ee3a-4915-8d69-4ddcb89076cb	Anas Farid Njimoluh	237672475691	nexuslatif4@gmail.com	\N	f	2025-12-07 09:09:44.785+01	2025-12-07 09:09:44.786+01
878668bf-35a2-4d52-a763-01b90f62657d	b50e80e0-2c8a-41d7-b0f5-bf57d8af7742	Anas Farid Njimoluh	237672475691	nexuslatif4@gmail.com	\N	f	2025-12-07 09:11:43.463+01	2025-12-07 09:11:43.464+01
230c4261-8e0c-4978-9220-3eda5da3ae84	01c7409a-46c7-41d0-8551-8ff7b0a58664	Anas Farid Njimoluh	237672475691	nexuslatif4@gmail.com	\N	f	2025-12-07 09:35:02.774+01	2025-12-07 09:35:02.775+01
bd0d1594-0375-451f-ae10-1fc74ba45323	01c7409a-46c7-41d0-8551-8ff7b0a58664	Anas Farid Njimoluh	672475691	nexuslatif35@gmail.com	\N	f	2025-12-07 09:35:02.779+01	2025-12-07 09:35:02.779+01
ead7a7b3-983a-4125-8fb1-c651d8d8a85f	185df4eb-6f2d-4e86-b775-f598ab718209	Anas Farid Njimoluh	237672475691	nexuslatif4@gmail.com	\N	f	2025-12-07 09:55:33.165+01	2025-12-07 09:55:33.166+01
a932f035-ae58-4a44-9329-71a7f64aaec9	185df4eb-6f2d-4e86-b775-f598ab718209	Anas Farid Njimoluh	672475691	nexuslatif35@gmail.com	\N	f	2025-12-07 09:55:33.168+01	2025-12-07 09:55:33.169+01
9b7803be-3d83-4223-8001-fddb711d46a5	185df4eb-6f2d-4e86-b775-f598ab718209	Anas Farid Njimoluh	672475691	faridnjimoluh@gmail.com	\N	f	2025-12-07 09:55:33.17+01	2025-12-07 09:55:33.17+01
94f947be-382d-4673-8cdb-79ce6adcc8ec	185df4eb-6f2d-4e86-b775-f598ab718209	Anas Farid Njimoluh	672475691	afriquefutee@gmail.com	\N	f	2025-12-07 09:55:33.172+01	2025-12-07 09:55:33.172+01
\.


--
-- Data for Name: payments; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.payments (id, reservation_id, amount, method, proof_url, comment, created_by, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: reservations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.reservations (id, payeur_name, payeur_phone, payeur_email, pack_id, pack_name_snapshot, unit_price, quantity, total_price, total_paid, status, "createdAt", "updatedAt") FROM stdin;
4c501e14-d684-435d-920e-1d571ac3de61	Anas Farid Latif	237658509963	latifnjimoluh@gmail.com	6768485c-c22b-45c7-8141-056221bab100	Couple	8000	2	8000	0	pending	2025-12-07 09:02:01.472+01	2025-12-07 09:02:01.473+01
c0932e10-3f22-4fc7-8a6d-c971be4edf5e	Anas Farid Latif	237658509963	latifnjimoluh@gmail.com	6768485c-c22b-45c7-8141-056221bab100	Couple	8000	2	8000	0	pending	2025-12-07 09:02:01.474+01	2025-12-07 09:02:01.474+01
f95b38f1-948f-4082-915a-973f935ffb7c	Anas Farid Njimoluh	237672475691	latifnjimoluh@gmail.com	b8c4fe5e-16f1-47a7-86bc-423dcb7a3d7b	VIP	5000	1	5000	0	pending	2025-12-07 09:06:17.272+01	2025-12-07 09:06:17.273+01
254445f0-ee3a-4915-8d69-4ddcb89076cb	Anas Farid Njimoluh	237672475691	nexuslatif4@gmail.com	b8c4fe5e-16f1-47a7-86bc-423dcb7a3d7b	VIP	5000	1	5000	0	pending	2025-12-07 09:09:44.757+01	2025-12-07 09:09:44.759+01
b50e80e0-2c8a-41d7-b0f5-bf57d8af7742	Anas Farid Njimoluh	237672475691	nexuslatif4@gmail.com	b8c4fe5e-16f1-47a7-86bc-423dcb7a3d7b	VIP	5000	1	5000	0	pending	2025-12-07 09:11:43.448+01	2025-12-07 09:11:43.45+01
01c7409a-46c7-41d0-8551-8ff7b0a58664	Anas Farid Njimoluh	237672475691	nexuslatif4@gmail.com	6768485c-c22b-45c7-8141-056221bab100	Couple	8000	2	8000	0	pending	2025-12-07 09:35:02.767+01	2025-12-07 09:35:02.767+01
185df4eb-6f2d-4e86-b775-f598ab718209	Anas Farid Njimoluh	237672475691	nexuslatif4@gmail.com	ab93b402-66b5-4f18-a9c3-da877e326a3f	Famille	10000	4	10000	0	pending	2025-12-07 09:55:33.15+01	2025-12-07 09:55:33.151+01
\.


--
-- Data for Name: tickets; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tickets (id, reservation_id, ticket_number, qr_payload, qr_image_url, pdf_url, status, generated_by, generated_at, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: unique_visitors; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.unique_visitors (id, ip_hash, times_visited, first_visit, last_visit, created_at, updated_at) FROM stdin;
10398be6-8679-462a-893d-b63eb97b99df	41210dc38086fd5d019bfc35b812a332a77b2f4e258b7d484ff5825b291c5f5e	2	2025-12-07 11:38:21.412+01	2025-12-07 11:39:19.123+01	2025-12-07 11:38:21.413+01	2025-12-07 11:39:19.124+01
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, email, password_hash, name, phone, role, "createdAt", "updatedAt", last_login) FROM stdin;
f5e9373d-1cbb-4684-adc5-5da7f3baba93	nexuslatif4@gmail.com	$2a$10$N0bHlL/ZgzanldOhLLiXCukKp5KcCh183tJ.9iChpI7tf0riuboRK	nexus		scanner	2025-12-05 00:19:42.052+01	2025-12-05 10:46:54.781+01	\N
02ae193b-0f63-42df-b039-d984998f0d2a	latifnjimoluh@gmail.com	$2a$10$dqFCfUEqtkNhTupzbXriDeOU4w8INYQjjNvWkLTlwyIDrkt0CbKv2	Admin	699000000	superadmin	2025-12-01 16:11:00.621+01	2025-12-07 08:33:39.425+01	2025-12-07 08:33:39.423+01
\.


--
-- Data for Name: visits; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.visits (id, total_visits, created_at, updated_at) FROM stdin;
bed425a9-66f1-4e8b-907d-9bdf7994f82a	2	2025-12-07 11:38:21.397+01	2025-12-07 11:39:19.113+01
\.


--
-- Name: UniqueVisitors_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."UniqueVisitors_id_seq"', 1, false);


--
-- Name: Visits_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Visits_id_seq"', 1, false);


--
-- Name: SequelizeMeta SequelizeMeta_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."SequelizeMeta"
    ADD CONSTRAINT "SequelizeMeta_pkey" PRIMARY KEY (name);


--
-- Name: UniqueVisitors UniqueVisitors_ipHash_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."UniqueVisitors"
    ADD CONSTRAINT "UniqueVisitors_ipHash_key" UNIQUE ("ipHash");


--
-- Name: UniqueVisitors UniqueVisitors_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."UniqueVisitors"
    ADD CONSTRAINT "UniqueVisitors_pkey" PRIMARY KEY (id);


--
-- Name: Visits Visits_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Visits"
    ADD CONSTRAINT "Visits_pkey" PRIMARY KEY (id);


--
-- Name: action_logs action_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.action_logs
    ADD CONSTRAINT action_logs_pkey PRIMARY KEY (id);


--
-- Name: activity_logs activity_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.activity_logs
    ADD CONSTRAINT activity_logs_pkey PRIMARY KEY (id);


--
-- Name: packs packs_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.packs
    ADD CONSTRAINT packs_name_key UNIQUE (name);


--
-- Name: packs packs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.packs
    ADD CONSTRAINT packs_pkey PRIMARY KEY (id);


--
-- Name: participants participants_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.participants
    ADD CONSTRAINT participants_pkey PRIMARY KEY (id);


--
-- Name: payments payments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_pkey PRIMARY KEY (id);


--
-- Name: reservations reservations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reservations
    ADD CONSTRAINT reservations_pkey PRIMARY KEY (id);


--
-- Name: tickets tickets_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tickets
    ADD CONSTRAINT tickets_pkey PRIMARY KEY (id);


--
-- Name: tickets tickets_ticket_number_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tickets
    ADD CONSTRAINT tickets_ticket_number_key UNIQUE (ticket_number);


--
-- Name: unique_visitors unique_visitors_ip_hash_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.unique_visitors
    ADD CONSTRAINT unique_visitors_ip_hash_key UNIQUE (ip_hash);


--
-- Name: unique_visitors unique_visitors_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.unique_visitors
    ADD CONSTRAINT unique_visitors_pkey PRIMARY KEY (id);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: visits visits_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.visits
    ADD CONSTRAINT visits_pkey PRIMARY KEY (id);


--
-- Name: activity_logs_created_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX activity_logs_created_at ON public.activity_logs USING btree (created_at);


--
-- Name: activity_logs_entity_type_entity_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX activity_logs_entity_type_entity_id ON public.activity_logs USING btree (entity_type, entity_id);


--
-- Name: activity_logs_permission; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX activity_logs_permission ON public.activity_logs USING btree (permission);


--
-- Name: activity_logs_user_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX activity_logs_user_id ON public.activity_logs USING btree (user_id);


--
-- Name: unique_visitors_ip_hash; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX unique_visitors_ip_hash ON public."UniqueVisitors" USING btree ("ipHash");


--
-- Name: unique_visitors_last_visited_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX unique_visitors_last_visited_at ON public."UniqueVisitors" USING btree ("lastVisitedAt");


--
-- Name: action_logs action_logs_reservation_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.action_logs
    ADD CONSTRAINT action_logs_reservation_id_fkey FOREIGN KEY (reservation_id) REFERENCES public.reservations(id) ON UPDATE CASCADE;


--
-- Name: action_logs action_logs_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.action_logs
    ADD CONSTRAINT action_logs_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE;


--
-- Name: activity_logs activity_logs_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.activity_logs
    ADD CONSTRAINT activity_logs_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE;


--
-- Name: participants participants_reservation_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.participants
    ADD CONSTRAINT participants_reservation_id_fkey FOREIGN KEY (reservation_id) REFERENCES public.reservations(id) ON UPDATE CASCADE;


--
-- Name: participants participants_ticket_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.participants
    ADD CONSTRAINT participants_ticket_id_fkey FOREIGN KEY (ticket_id) REFERENCES public.tickets(id) ON UPDATE CASCADE;


--
-- Name: payments payments_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(id) ON UPDATE CASCADE;


--
-- Name: payments payments_reservation_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_reservation_id_fkey FOREIGN KEY (reservation_id) REFERENCES public.reservations(id) ON UPDATE CASCADE;


--
-- Name: reservations reservations_pack_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reservations
    ADD CONSTRAINT reservations_pack_id_fkey FOREIGN KEY (pack_id) REFERENCES public.packs(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: tickets tickets_generated_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tickets
    ADD CONSTRAINT tickets_generated_by_fkey FOREIGN KEY (generated_by) REFERENCES public.users(id) ON UPDATE CASCADE;


--
-- Name: tickets tickets_reservation_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tickets
    ADD CONSTRAINT tickets_reservation_id_fkey FOREIGN KEY (reservation_id) REFERENCES public.reservations(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

