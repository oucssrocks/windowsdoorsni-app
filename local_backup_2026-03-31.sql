SET session_replication_role = replica;

--
-- PostgreSQL database dump
--

-- \restrict axQQdcyvRy48hJ0AJR8FpscNPYEBB15793LGi7nvWiCkW62WN9N0neeVATJHvHw

-- Dumped from database version 17.6
-- Dumped by pg_dump version 17.6

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
-- Data for Name: audit_log_entries; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: custom_oauth_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: flow_state; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: users; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: identities; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: instances; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: oauth_clients; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: sessions; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: mfa_amr_claims; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: mfa_factors; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: mfa_challenges; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: oauth_authorizations; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: oauth_client_states; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: oauth_consents; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: one_time_tokens; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: refresh_tokens; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: sso_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: saml_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: saml_relay_states; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: sso_domains; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: webauthn_challenges; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: webauthn_credentials; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: inspections; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."inspections" ("id", "text", "created", "done") VALUES
	('ins001', '14 Glengormley Park – check lintel above front door before fit', 1743000000000, true),
	('ins002', 'Portrush job (Nuala Quinn) – measure bay window before quoting', 1743100000000, true),
	('ins003', '32 Lisburn Road – confirm which side door hinges on', 1742900000000, true),
	('ins004', 'Seamus Bradley site – return to hang stable door (day 2)', 1743300000000, false),
	('ins005', 'Aoife Gallagher snag – kitchen window bead gap to fix', 1742850000000, false);


--
-- Data for Name: jobs; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."jobs" ("id", "name", "phone", "email", "date", "status", "notes", "products", "created_at", "ref", "address", "booked", "created") VALUES
	('job006', 'Thomas Laverty', '07688 441122', 'tlaverty@btinternet.com', '2026-04-22', 'booked', 'Customer very particular about alignment. Double-check frame square.', '1x composite front door (Black, gold hardware), 1x side panel', '2026-03-31 03:40:54.310709+00', 'JOB-006', '55 Ballyclare Road, Templepatrick, BT39 0AA', '2026-03-25', 1743400000000),
	('mne3tyc9yu54ll1qimp', 'Davy nelson', '123456789', 'davy@tits.com', '2026-04-13', 'booked', '', 'He’s got bigger tits', '2026-03-31 04:16:06.681+00', '100023', 'The manor', '2026-04-14', 1774930566681),
	('job007', 'Nuala Quinn', '07823 667788', '', '2026-05-01', 'quoted', 'Quote sent 28 Mar. Follow up if no response by 4 Apr.', '8x UPVC windows full house replacement, 1x composite door', '2026-03-31 03:40:54.310709+00', 'JOB-007', '3 Dunluce Street, Portrush, BT56 8DQ', NULL, 1743500000000),
	('job001', 'Margaret Doherty', '07712 345678', 'mdoherty@gmail.com', '2026-04-07', 'booked', 'Customer wants keyed alike locks. Access via side gate.', '2x UPVC casement windows, 1x composite front door (Anthracite Grey)', '2026-03-31 03:40:54.310709+00', 'JOB-001', '14 Glengormley Park, Newtownabbey, BT36 5AA', '2026-03-10', 1743000000000),
	('mne3eyurt8ccc1wu999', 'gav', '1234324234', 'test@tits.com', '2026-03-31', 'quoted', 'big ones too', 'massive tits', '2026-03-31 04:04:27.507+00', '11111', '123 the street', '2026-03-31', 1774929867507),
	('job002', 'Connor McAllister', '07834 567890', 'cmcallister@hotmail.com', '2026-04-10', 'booked', 'New build. Site contact is foreman Gary – 07900 112233.', '4x tilt & turn windows, 1x bi-fold patio door (white)', '2026-03-31 03:40:54.310709+00', 'JOB-002', '7 Malone Avenue, Belfast, BT9 6EQ', '2026-03-15', 1743100000000),
	('job003', 'Patricia Kerr', '02890 123456', 'pkerr@yahoo.co.uk', '2026-04-14', 'quoted', 'Awaiting customer confirmation on colour.', '1x composite back door (Chartwell Green), 2x bedroom windows', '2026-03-31 03:40:54.310709+00', 'JOB-003', '32 Lisburn Road, Dromore, BT25 1AJ', '2026-03-20', 1743200000000),
	('job004', 'Seamus Bradley', '07901 234567', '', '2026-04-03', 'in-progress', 'Day 1 of 2. Windows fitted, door to be hung tomorrow.', '6x UPVC sash windows (Georgian bar), 1x stable door', '2026-03-31 03:40:54.310709+00', 'JOB-004', '9 Carnhill Estate, Derry, BT48 8AX', '2026-02-28', 1743300000000),
	('job005', 'Aoife Gallagher', '07755 998877', 'aoife.g@gmail.com', '2026-03-20', 'done', 'Completed. Snag: small bead gap on kitchen window — revisit noted.', '3x casement windows, 1x French doors (Cream)', '2026-03-31 03:40:54.310709+00', 'JOB-005', '21 Shore Road, Greenisland, BT38 8TH', '2026-02-10', 1742800000000);


--
-- Data for Name: stock; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."stock" ("id", "name", "category", "sku", "qty", "min", "unit", "supplier") VALUES
	('stk012', 'Window Handle (White)', 'Hardware', 'HW-HDL-WHT', 34, 15, 'units', 'Mila'),
	('stk013', 'Window Handle (Anthracite)', 'Hardware', 'HW-HDL-ANT', 8, 10, 'units', 'Mila'),
	('stk014', '28mm Double Glazed Unit 600x900', 'Glass', 'GLS-DG-0609', 6, 4, 'units', 'Pilkington'),
	('stk015', '28mm Double Glazed Unit 900x1200', 'Glass', 'GLS-DG-0912', 3, 4, 'units', 'Pilkington'),
	('mne3xyr9501zndzvvnm', '45 trim', 'Hardware', '', 4, 2, 'packs', 'SupaSeal'),
	('stk016', 'Low-E Argon Glazed Unit 1000x1400', 'Glass', 'GLS-LE-1014', 2, 3, 'units', 'Pilkington'),
	('stk017', 'UPVC Foam Sealant (750ml)', 'Material', 'MAT-SEL-750', 22, 10, 'cans', 'Soudal'),
	('stk018', 'Frame Packers Assorted Pack', 'Material', 'MAT-PCK-AST', 14, 6, 'packs', 'TFC'),
	('stk019', 'Silicone Sealant Clear (310ml)', 'Material', 'MAT-SIL-CLR', 9, 10, 'tubes', 'Soudal'),
	('stk020', 'Silicone Sealant White (310ml)', 'Material', 'MAT-SIL-WHT', 4, 10, 'tubes', 'Soudal'),
	('stk001', 'UPVC Casement Window 600x900', 'Window Unit', 'WIN-CAS-0609', 12, 4, 'units', 'Eurocell'),
	('stk002', 'UPVC Casement Window 900x1200', 'Window Unit', 'WIN-CAS-0912', 7, 4, 'units', 'Eurocell'),
	('stk003', 'UPVC Tilt & Turn Window 800x1000', 'Window Unit', 'WIN-TT-0810', 3, 2, 'units', 'Rehau'),
	('stk004', 'UPVC Sash Window 630x1050', 'Window Unit', 'WIN-SAS-0610', 2, 2, 'units', 'Spectus'),
	('stk005', 'Composite Front Door (Anthracite)', 'Door Unit', 'DOR-COM-ANT', 4, 2, 'units', 'Solidor'),
	('stk006', 'Composite Front Door (Black)', 'Door Unit', 'DOR-COM-BLK', 2, 2, 'units', 'Solidor'),
	('stk007', 'Composite Back Door (Chartwell Grn)', 'Door Unit', 'DOR-COM-CGN', 1, 2, 'units', 'Solidor'),
	('stk008', 'Bi-Fold Patio Door 2400x2100', 'Door Unit', 'DOR-BIF-2421', 1, 1, 'units', 'Origin'),
	('stk009', 'Georgian Bar Strip 10mm', 'Hardware', 'HW-GEO-10MM', 45, 20, 'metres', 'Eurocell'),
	('stk010', 'Multipoint Lock Set (UPVC)', 'Hardware', 'HW-MPL-UPV', 18, 8, 'units', 'Mila'),
	('stk011', 'Composite Door Lock Cylinder', 'Hardware', 'HW-CYL-COM', 6, 5, 'units', 'Ultion');


--
-- Data for Name: buckets; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: buckets_analytics; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: buckets_vectors; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: objects; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: s3_multipart_uploads; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: s3_multipart_uploads_parts; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: vector_indexes; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE SET; Schema: auth; Owner: supabase_auth_admin
--

SELECT pg_catalog.setval('"auth"."refresh_tokens_id_seq"', 1, false);


--
-- PostgreSQL database dump complete
--

-- \unrestrict axQQdcyvRy48hJ0AJR8FpscNPYEBB15793LGi7nvWiCkW62WN9N0neeVATJHvHw

RESET ALL;
