SET session_replication_role = replica;

--
-- PostgreSQL database dump
--

-- \restrict Slr7z1aewd2yYhPkyruSQejKxoWBxi8roIzo3mC7Fc2VtAvWwLhqdsG7M2LR3aL

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

INSERT INTO "auth"."audit_log_entries" ("instance_id", "id", "payload", "created_at", "ip_address") VALUES
	('00000000-0000-0000-0000-000000000000', 'e46946f4-80b1-49e3-9dcf-f28731aab6d2', '{"action":"user_signedup","actor_id":"6aec6474-c5cb-440b-a4d7-11f42681ea8c","actor_username":"ge.fishta@gmail.com","actor_via_sso":false,"log_type":"team","traits":{"provider":"github"}}', '2025-10-29 10:59:49.131209+00', ''),
	('00000000-0000-0000-0000-000000000000', '5074d15e-0cce-4fe9-abc0-5088332c1ae8', '{"action":"token_refreshed","actor_id":"6aec6474-c5cb-440b-a4d7-11f42681ea8c","actor_username":"ge.fishta@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-10-29 11:57:38.899878+00', ''),
	('00000000-0000-0000-0000-000000000000', '5fc6b09a-9118-4a6f-a708-f33d49c83525', '{"action":"token_revoked","actor_id":"6aec6474-c5cb-440b-a4d7-11f42681ea8c","actor_username":"ge.fishta@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-10-29 11:57:38.908428+00', ''),
	('00000000-0000-0000-0000-000000000000', '505e1427-dc92-47fd-ba8e-be89b55a29ae', '{"action":"logout","actor_id":"6aec6474-c5cb-440b-a4d7-11f42681ea8c","actor_username":"ge.fishta@gmail.com","actor_via_sso":false,"log_type":"account"}', '2025-10-29 12:11:44.215376+00', ''),
	('00000000-0000-0000-0000-000000000000', '5796e16c-2f01-409c-aade-ad060a318b3b', '{"action":"login","actor_id":"6aec6474-c5cb-440b-a4d7-11f42681ea8c","actor_username":"ge.fishta@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"github"}}', '2025-10-29 12:11:47.352551+00', ''),
	('00000000-0000-0000-0000-000000000000', '5e90ca25-bce4-4c1e-a165-ae9a0ad282db', '{"action":"logout","actor_id":"6aec6474-c5cb-440b-a4d7-11f42681ea8c","actor_username":"ge.fishta@gmail.com","actor_via_sso":false,"log_type":"account"}', '2025-10-29 12:12:58.740843+00', ''),
	('00000000-0000-0000-0000-000000000000', '20cd532b-d935-40c1-aa7f-660ece9a5856', '{"action":"login","actor_id":"6aec6474-c5cb-440b-a4d7-11f42681ea8c","actor_username":"ge.fishta@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"github"}}', '2025-10-29 12:18:38.47972+00', ''),
	('00000000-0000-0000-0000-000000000000', '4e30d96c-1643-4464-b5be-f6b4fdec1a4e', '{"action":"token_refreshed","actor_id":"6aec6474-c5cb-440b-a4d7-11f42681ea8c","actor_username":"ge.fishta@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-10-29 13:38:38.926015+00', ''),
	('00000000-0000-0000-0000-000000000000', '2a278aa9-ba0c-4233-a825-4244fc2afa8d', '{"action":"token_revoked","actor_id":"6aec6474-c5cb-440b-a4d7-11f42681ea8c","actor_username":"ge.fishta@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-10-29 13:38:38.945042+00', ''),
	('00000000-0000-0000-0000-000000000000', '6f109d7f-792a-4718-802d-c6d895a6ad5a', '{"action":"logout","actor_id":"6aec6474-c5cb-440b-a4d7-11f42681ea8c","actor_username":"ge.fishta@gmail.com","actor_via_sso":false,"log_type":"account"}', '2025-10-29 13:49:51.829373+00', ''),
	('00000000-0000-0000-0000-000000000000', '410c66a8-d0a5-43c4-947a-696f50882ccd', '{"action":"login","actor_id":"6aec6474-c5cb-440b-a4d7-11f42681ea8c","actor_username":"ge.fishta@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"github"}}', '2025-10-29 13:50:03.279624+00', ''),
	('00000000-0000-0000-0000-000000000000', 'e1015f43-d04c-468d-94e9-f693a355bbff', '{"action":"token_refreshed","actor_id":"6aec6474-c5cb-440b-a4d7-11f42681ea8c","actor_username":"ge.fishta@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-10-29 14:47:49.013038+00', ''),
	('00000000-0000-0000-0000-000000000000', '9f2e2909-6610-4ead-9ba7-aac44bd253d2', '{"action":"token_revoked","actor_id":"6aec6474-c5cb-440b-a4d7-11f42681ea8c","actor_username":"ge.fishta@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-10-29 14:47:49.035195+00', ''),
	('00000000-0000-0000-0000-000000000000', 'ac815675-8cd5-414c-90ab-6710b31d9250', '{"action":"user_invited","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"user_email":"wobodyxeno@mailinator.com","user_id":"a0208271-e72e-43d4-b302-b477691f1a25"}}', '2025-10-29 15:29:54.726157+00', ''),
	('00000000-0000-0000-0000-000000000000', '13a46fde-90c8-4e13-b4b3-d682228f5ea7', '{"action":"token_refreshed","actor_id":"6aec6474-c5cb-440b-a4d7-11f42681ea8c","actor_username":"ge.fishta@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-10-29 15:57:36.078577+00', ''),
	('00000000-0000-0000-0000-000000000000', '9bf6a83f-3cd8-4740-8e63-c8c2cdc4fc7f', '{"action":"token_revoked","actor_id":"6aec6474-c5cb-440b-a4d7-11f42681ea8c","actor_username":"ge.fishta@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-10-29 15:57:36.088301+00', ''),
	('00000000-0000-0000-0000-000000000000', 'a00d57ad-59da-4c1a-bce6-9032b45b514c', '{"action":"token_refreshed","actor_id":"6aec6474-c5cb-440b-a4d7-11f42681ea8c","actor_username":"ge.fishta@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-10-30 08:00:25.524707+00', ''),
	('00000000-0000-0000-0000-000000000000', 'b71ba3cc-5e66-4737-aaa6-f0ba7f07ba57', '{"action":"token_revoked","actor_id":"6aec6474-c5cb-440b-a4d7-11f42681ea8c","actor_username":"ge.fishta@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-10-30 08:00:25.546304+00', ''),
	('00000000-0000-0000-0000-000000000000', 'ca089c9c-cb72-4fd1-9c86-588311a6dcff', '{"action":"token_refreshed","actor_id":"6aec6474-c5cb-440b-a4d7-11f42681ea8c","actor_username":"ge.fishta@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-10-30 09:11:23.203663+00', ''),
	('00000000-0000-0000-0000-000000000000', 'b603d7b4-c5a2-47f1-88f3-aa664c8c8616', '{"action":"token_revoked","actor_id":"6aec6474-c5cb-440b-a4d7-11f42681ea8c","actor_username":"ge.fishta@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-10-30 09:11:23.219644+00', ''),
	('00000000-0000-0000-0000-000000000000', '33d11225-a272-4880-afcc-38c129e53632', '{"action":"token_refreshed","actor_id":"6aec6474-c5cb-440b-a4d7-11f42681ea8c","actor_username":"ge.fishta@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-10-30 12:03:39.716567+00', ''),
	('00000000-0000-0000-0000-000000000000', '90d1afab-4395-4bc6-9ecd-0aa6c80c6285', '{"action":"token_revoked","actor_id":"6aec6474-c5cb-440b-a4d7-11f42681ea8c","actor_username":"ge.fishta@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-10-30 12:03:39.731584+00', ''),
	('00000000-0000-0000-0000-000000000000', '51e3a241-f51b-4ff1-a692-080cd2896040', '{"action":"token_refreshed","actor_id":"6aec6474-c5cb-440b-a4d7-11f42681ea8c","actor_username":"ge.fishta@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-10-30 14:45:15.219384+00', ''),
	('00000000-0000-0000-0000-000000000000', '4733f7f7-a41e-44d7-8f3a-d1dcd0dec048', '{"action":"token_revoked","actor_id":"6aec6474-c5cb-440b-a4d7-11f42681ea8c","actor_username":"ge.fishta@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-10-30 14:45:15.233836+00', ''),
	('00000000-0000-0000-0000-000000000000', '8232d557-7a7a-4c12-9fcb-07a6bcf6ecb7', '{"action":"user_invited","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"user_email":"qododygof@mailinator.com","user_id":"af725396-1fc5-4156-84ea-a1a61aa3a9fd"}}', '2025-10-30 15:08:03.128335+00', ''),
	('00000000-0000-0000-0000-000000000000', '73d2cc02-a8b6-45f0-93ca-c022991a09ae', '{"action":"token_refreshed","actor_id":"6aec6474-c5cb-440b-a4d7-11f42681ea8c","actor_username":"ge.fishta@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-10-30 15:42:54.334238+00', ''),
	('00000000-0000-0000-0000-000000000000', '1116ef23-4b5c-487f-b89c-d0fa8735092a', '{"action":"token_revoked","actor_id":"6aec6474-c5cb-440b-a4d7-11f42681ea8c","actor_username":"ge.fishta@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-10-30 15:42:54.352187+00', ''),
	('00000000-0000-0000-0000-000000000000', 'df2d5d18-46fe-4f54-88d4-9219c62b42d6', '{"action":"token_refreshed","actor_id":"6aec6474-c5cb-440b-a4d7-11f42681ea8c","actor_username":"ge.fishta@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-10-31 09:39:12.051536+00', ''),
	('00000000-0000-0000-0000-000000000000', 'f8d97d77-43f6-4be4-b385-53a442c8f9fd', '{"action":"token_revoked","actor_id":"6aec6474-c5cb-440b-a4d7-11f42681ea8c","actor_username":"ge.fishta@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-10-31 09:39:12.060621+00', ''),
	('00000000-0000-0000-0000-000000000000', '6fc2a08d-f4d8-474f-b3ce-192cfd3dba20', '{"action":"token_refreshed","actor_id":"6aec6474-c5cb-440b-a4d7-11f42681ea8c","actor_username":"ge.fishta@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-10-31 10:37:14.234274+00', ''),
	('00000000-0000-0000-0000-000000000000', 'e961534b-2522-470f-9886-823ce4f367ca', '{"action":"token_revoked","actor_id":"6aec6474-c5cb-440b-a4d7-11f42681ea8c","actor_username":"ge.fishta@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-10-31 10:37:14.251222+00', ''),
	('00000000-0000-0000-0000-000000000000', '8bb0d40b-6f68-42c5-acbc-37ecb0a8b150', '{"action":"token_refreshed","actor_id":"6aec6474-c5cb-440b-a4d7-11f42681ea8c","actor_username":"ge.fishta@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-10-31 11:43:12.478138+00', ''),
	('00000000-0000-0000-0000-000000000000', 'c6ee522c-bb81-4f56-b861-96358ce06057', '{"action":"token_revoked","actor_id":"6aec6474-c5cb-440b-a4d7-11f42681ea8c","actor_username":"ge.fishta@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-10-31 11:43:12.497648+00', ''),
	('00000000-0000-0000-0000-000000000000', '3d261146-4f64-4cad-97aa-6f2645d3994c', '{"action":"login","actor_id":"6aec6474-c5cb-440b-a4d7-11f42681ea8c","actor_username":"ge.fishta@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"github"}}', '2025-10-31 12:12:12.319372+00', ''),
	('00000000-0000-0000-0000-000000000000', 'b1feab06-e2a3-4336-8055-4a0894edda2e', '{"action":"user_invited","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"user_email":"rurymofahy@mailinator.com","user_id":"6de50483-27f4-4fb0-b4b0-05a47b55a71a"}}', '2025-10-31 12:17:19.868694+00', ''),
	('00000000-0000-0000-0000-000000000000', '723c8e57-c23c-4204-a1b2-cfa1976936b2', '{"action":"token_refreshed","actor_id":"6aec6474-c5cb-440b-a4d7-11f42681ea8c","actor_username":"ge.fishta@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-10-31 12:40:49.164952+00', ''),
	('00000000-0000-0000-0000-000000000000', '3e38b24c-bb8e-4f4f-8e7d-d36fc2654e16', '{"action":"token_revoked","actor_id":"6aec6474-c5cb-440b-a4d7-11f42681ea8c","actor_username":"ge.fishta@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-10-31 12:40:49.174513+00', ''),
	('00000000-0000-0000-0000-000000000000', 'e36df8da-7e90-48d9-91b0-8f7c0028e29a', '{"action":"token_refreshed","actor_id":"6aec6474-c5cb-440b-a4d7-11f42681ea8c","actor_username":"ge.fishta@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-10-31 13:39:51.85456+00', ''),
	('00000000-0000-0000-0000-000000000000', '7fe6eb4c-525d-4c1a-8674-7e304dabad62', '{"action":"token_revoked","actor_id":"6aec6474-c5cb-440b-a4d7-11f42681ea8c","actor_username":"ge.fishta@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-10-31 13:39:51.870022+00', ''),
	('00000000-0000-0000-0000-000000000000', 'eb8d7ba5-8dba-40a4-a5a8-5c4ce47f94c7', '{"action":"token_refreshed","actor_id":"6aec6474-c5cb-440b-a4d7-11f42681ea8c","actor_username":"ge.fishta@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-10-31 15:48:53.315736+00', ''),
	('00000000-0000-0000-0000-000000000000', 'ac0fc48e-db60-46ff-941d-7028ae591a27', '{"action":"token_revoked","actor_id":"6aec6474-c5cb-440b-a4d7-11f42681ea8c","actor_username":"ge.fishta@gmail.com","actor_via_sso":false,"log_type":"token"}', '2025-10-31 15:48:53.330465+00', '');


--
-- Data for Name: flow_state; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: users; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."users" ("instance_id", "id", "aud", "role", "email", "encrypted_password", "email_confirmed_at", "invited_at", "confirmation_token", "confirmation_sent_at", "recovery_token", "recovery_sent_at", "email_change_token_new", "email_change", "email_change_sent_at", "last_sign_in_at", "raw_app_meta_data", "raw_user_meta_data", "is_super_admin", "created_at", "updated_at", "phone", "phone_confirmed_at", "phone_change", "phone_change_token", "phone_change_sent_at", "email_change_token_current", "email_change_confirm_status", "banned_until", "reauthentication_token", "reauthentication_sent_at", "is_sso_user", "deleted_at", "is_anonymous") VALUES
	('00000000-0000-0000-0000-000000000000', '6de50483-27f4-4fb0-b4b0-05a47b55a71a', 'authenticated', 'authenticated', 'rurymofahy@mailinator.com', '', NULL, '2025-10-31 12:17:19.872012+00', '3fdc3d3edeed98690185fec2aa7f9e17463c1ba79cb18b09fe2be718', '2025-10-31 12:17:19.872012+00', '', NULL, '', '', NULL, NULL, '{"provider": "email", "providers": ["email"]}', '{"role": "employee", "last_name": "Lewis", "first_name": "Genevieve"}', NULL, '2025-10-31 12:17:19.831074+00', '2025-10-31 12:17:20.89466+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', 'af725396-1fc5-4156-84ea-a1a61aa3a9fd', 'authenticated', 'authenticated', 'qododygof@mailinator.com', '', NULL, '2025-10-30 15:08:03.144519+00', 'a40f8fae3de6ef968bc2732485cbe53aeaae91492fcd14199f224ec3', '2025-10-30 15:08:03.144519+00', '', NULL, '', '', NULL, NULL, '{"provider": "email", "providers": ["email"]}', '{"role": "employee", "last_name": "Rojas", "first_name": "Uriel"}', NULL, '2025-10-30 15:08:03.093318+00', '2025-10-30 15:08:04.205787+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', '6aec6474-c5cb-440b-a4d7-11f42681ea8c', 'authenticated', 'authenticated', 'ge.fishta@gmail.com', NULL, '2025-10-29 10:59:49.145518+00', NULL, '', NULL, '', NULL, '', '', NULL, '2025-10-31 12:12:12.334558+00', '{"provider": "github", "providers": ["github"]}', '{"iss": "https://api.github.com", "sub": "128983495", "email": "ge.fishta@gmail.com", "user_name": "GeraldFishta", "avatar_url": "https://avatars.githubusercontent.com/u/128983495?v=4", "provider_id": "128983495", "email_verified": true, "phone_verified": false, "preferred_username": "GeraldFishta"}', NULL, '2025-10-29 10:59:49.091793+00', '2025-10-31 15:48:53.352389+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false),
	('00000000-0000-0000-0000-000000000000', 'a0208271-e72e-43d4-b302-b477691f1a25', 'authenticated', 'authenticated', 'wobodyxeno@mailinator.com', '', NULL, '2025-10-29 15:29:54.733853+00', '5ee0c8ef630ee0f94fbd1a89f4bb9e5c8e51c1bbc62d17192e56152b', '2025-10-29 15:29:54.733853+00', '', NULL, '', '', NULL, NULL, '{"provider": "email", "providers": ["email"]}', '{"role": "employee", "last_name": "Howell", "first_name": "Aiko"}', NULL, '2025-10-29 15:29:54.698873+00', '2025-10-29 15:29:56.198822+00', NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, false, NULL, false);


--
-- Data for Name: identities; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."identities" ("provider_id", "user_id", "identity_data", "provider", "last_sign_in_at", "created_at", "updated_at", "id") VALUES
	('a0208271-e72e-43d4-b302-b477691f1a25', 'a0208271-e72e-43d4-b302-b477691f1a25', '{"sub": "a0208271-e72e-43d4-b302-b477691f1a25", "email": "wobodyxeno@mailinator.com", "email_verified": false, "phone_verified": false}', 'email', '2025-10-29 15:29:54.720315+00', '2025-10-29 15:29:54.720379+00', '2025-10-29 15:29:54.720379+00', 'b532dc9e-6485-44e9-83d7-5c8ec775051f'),
	('af725396-1fc5-4156-84ea-a1a61aa3a9fd', 'af725396-1fc5-4156-84ea-a1a61aa3a9fd', '{"sub": "af725396-1fc5-4156-84ea-a1a61aa3a9fd", "email": "qododygof@mailinator.com", "email_verified": false, "phone_verified": false}', 'email', '2025-10-30 15:08:03.121765+00', '2025-10-30 15:08:03.121828+00', '2025-10-30 15:08:03.121828+00', '3eb8bffc-6c8e-4c93-a17c-78dca82bf6ae'),
	('128983495', '6aec6474-c5cb-440b-a4d7-11f42681ea8c', '{"iss": "https://api.github.com", "sub": "128983495", "email": "ge.fishta@gmail.com", "user_name": "GeraldFishta", "avatar_url": "https://avatars.githubusercontent.com/u/128983495?v=4", "provider_id": "128983495", "email_verified": true, "phone_verified": false, "preferred_username": "GeraldFishta"}', 'github', '2025-10-29 10:59:49.119757+00', '2025-10-29 10:59:49.119811+00', '2025-10-31 12:12:12.283667+00', '4509b86d-ccb2-404d-8150-cb094a8d8cb5'),
	('6de50483-27f4-4fb0-b4b0-05a47b55a71a', '6de50483-27f4-4fb0-b4b0-05a47b55a71a', '{"sub": "6de50483-27f4-4fb0-b4b0-05a47b55a71a", "email": "rurymofahy@mailinator.com", "email_verified": false, "phone_verified": false}', 'email', '2025-10-31 12:17:19.863892+00', '2025-10-31 12:17:19.863943+00', '2025-10-31 12:17:19.863943+00', 'ac62db9d-8de9-4dfb-90a2-48d33be32dde');


--
-- Data for Name: instances; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: oauth_clients; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: sessions; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."sessions" ("id", "user_id", "created_at", "updated_at", "factor_id", "aal", "not_after", "refreshed_at", "user_agent", "ip", "tag", "oauth_client_id") VALUES
	('f9c71bc0-5a4c-4daf-ad84-bf14907eab0c', '6aec6474-c5cb-440b-a4d7-11f42681ea8c', '2025-10-31 12:12:12.335739+00', '2025-10-31 12:12:12.335739+00', NULL, 'aal1', NULL, NULL, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', '80.78.67.141', NULL, NULL),
	('f4ee7641-1d07-4e0d-92fa-87287e2332d4', '6aec6474-c5cb-440b-a4d7-11f42681ea8c', '2025-10-29 13:50:03.280287+00', '2025-10-31 15:48:53.369375+00', NULL, 'aal1', NULL, '2025-10-31 15:48:53.368044', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', '80.78.67.141', NULL, NULL);


--
-- Data for Name: mfa_amr_claims; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."mfa_amr_claims" ("session_id", "created_at", "updated_at", "authentication_method", "id") VALUES
	('f4ee7641-1d07-4e0d-92fa-87287e2332d4', '2025-10-29 13:50:03.291322+00', '2025-10-29 13:50:03.291322+00', 'oauth', '82134316-a742-445d-bbc9-7eb0edfeaba4'),
	('f9c71bc0-5a4c-4daf-ad84-bf14907eab0c', '2025-10-31 12:12:12.384841+00', '2025-10-31 12:12:12.384841+00', 'oauth', '66534b73-7bbb-4511-aab1-72f83e0e870c');


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
-- Data for Name: oauth_consents; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: one_time_tokens; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."one_time_tokens" ("id", "user_id", "token_type", "token_hash", "relates_to", "created_at", "updated_at") VALUES
	('184e4bb8-4709-430b-b7bc-dd7d6f552afd', 'a0208271-e72e-43d4-b302-b477691f1a25', 'confirmation_token', '5ee0c8ef630ee0f94fbd1a89f4bb9e5c8e51c1bbc62d17192e56152b', 'wobodyxeno@mailinator.com', '2025-10-29 15:29:56.205774', '2025-10-29 15:29:56.205774'),
	('dcf0ec3f-aa40-4a67-b98b-a3bf26a6f286', 'af725396-1fc5-4156-84ea-a1a61aa3a9fd', 'confirmation_token', 'a40f8fae3de6ef968bc2732485cbe53aeaae91492fcd14199f224ec3', 'qododygof@mailinator.com', '2025-10-30 15:08:04.213962', '2025-10-30 15:08:04.213962'),
	('e19cdec0-7de5-4dd9-8bf4-74d08793d6a3', '6de50483-27f4-4fb0-b4b0-05a47b55a71a', 'confirmation_token', '3fdc3d3edeed98690185fec2aa7f9e17463c1ba79cb18b09fe2be718', 'rurymofahy@mailinator.com', '2025-10-31 12:17:20.904096', '2025-10-31 12:17:20.904096');


--
-- Data for Name: refresh_tokens; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--

INSERT INTO "auth"."refresh_tokens" ("instance_id", "id", "token", "user_id", "revoked", "created_at", "updated_at", "parent", "session_id") VALUES
	('00000000-0000-0000-0000-000000000000', 6, 'h6q5wsc6iaws', '6aec6474-c5cb-440b-a4d7-11f42681ea8c', true, '2025-10-29 13:50:03.284025+00', '2025-10-29 14:47:49.036572+00', NULL, 'f4ee7641-1d07-4e0d-92fa-87287e2332d4'),
	('00000000-0000-0000-0000-000000000000', 7, 'by2cvhqpr57t', '6aec6474-c5cb-440b-a4d7-11f42681ea8c', true, '2025-10-29 14:47:49.049781+00', '2025-10-29 15:57:36.091374+00', 'h6q5wsc6iaws', 'f4ee7641-1d07-4e0d-92fa-87287e2332d4'),
	('00000000-0000-0000-0000-000000000000', 8, '3hu2tf27u7qa', '6aec6474-c5cb-440b-a4d7-11f42681ea8c', true, '2025-10-29 15:57:36.099836+00', '2025-10-30 08:00:25.547044+00', 'by2cvhqpr57t', 'f4ee7641-1d07-4e0d-92fa-87287e2332d4'),
	('00000000-0000-0000-0000-000000000000', 9, 'xal6zyi53dcv', '6aec6474-c5cb-440b-a4d7-11f42681ea8c', true, '2025-10-30 08:00:25.567242+00', '2025-10-30 09:11:23.222226+00', '3hu2tf27u7qa', 'f4ee7641-1d07-4e0d-92fa-87287e2332d4'),
	('00000000-0000-0000-0000-000000000000', 10, 'ih3eeugoehoy', '6aec6474-c5cb-440b-a4d7-11f42681ea8c', true, '2025-10-30 09:11:23.232079+00', '2025-10-30 12:03:39.733411+00', 'xal6zyi53dcv', 'f4ee7641-1d07-4e0d-92fa-87287e2332d4'),
	('00000000-0000-0000-0000-000000000000', 11, 'akfgajajfuo7', '6aec6474-c5cb-440b-a4d7-11f42681ea8c', true, '2025-10-30 12:03:39.746122+00', '2025-10-30 14:45:15.237589+00', 'ih3eeugoehoy', 'f4ee7641-1d07-4e0d-92fa-87287e2332d4'),
	('00000000-0000-0000-0000-000000000000', 12, 'rap6vdpzcf7c', '6aec6474-c5cb-440b-a4d7-11f42681ea8c', true, '2025-10-30 14:45:15.247959+00', '2025-10-30 15:42:54.354647+00', 'akfgajajfuo7', 'f4ee7641-1d07-4e0d-92fa-87287e2332d4'),
	('00000000-0000-0000-0000-000000000000', 13, 'wr57qnidmxia', '6aec6474-c5cb-440b-a4d7-11f42681ea8c', true, '2025-10-30 15:42:54.370957+00', '2025-10-31 09:39:12.061963+00', 'rap6vdpzcf7c', 'f4ee7641-1d07-4e0d-92fa-87287e2332d4'),
	('00000000-0000-0000-0000-000000000000', 14, 'mppqjlqe2dxb', '6aec6474-c5cb-440b-a4d7-11f42681ea8c', true, '2025-10-31 09:39:12.069825+00', '2025-10-31 10:37:14.251917+00', 'wr57qnidmxia', 'f4ee7641-1d07-4e0d-92fa-87287e2332d4'),
	('00000000-0000-0000-0000-000000000000', 15, 'mbvgtf2dyket', '6aec6474-c5cb-440b-a4d7-11f42681ea8c', true, '2025-10-31 10:37:14.26496+00', '2025-10-31 11:43:12.509552+00', 'mppqjlqe2dxb', 'f4ee7641-1d07-4e0d-92fa-87287e2332d4'),
	('00000000-0000-0000-0000-000000000000', 17, 'mra3gt5kmha6', '6aec6474-c5cb-440b-a4d7-11f42681ea8c', false, '2025-10-31 12:12:12.359364+00', '2025-10-31 12:12:12.359364+00', NULL, 'f9c71bc0-5a4c-4daf-ad84-bf14907eab0c'),
	('00000000-0000-0000-0000-000000000000', 16, 'iz74lbwtvzb6', '6aec6474-c5cb-440b-a4d7-11f42681ea8c', true, '2025-10-31 11:43:12.518512+00', '2025-10-31 12:40:49.176411+00', 'mbvgtf2dyket', 'f4ee7641-1d07-4e0d-92fa-87287e2332d4'),
	('00000000-0000-0000-0000-000000000000', 18, 'enhbnsx4q2ei', '6aec6474-c5cb-440b-a4d7-11f42681ea8c', true, '2025-10-31 12:40:49.183627+00', '2025-10-31 13:39:51.872485+00', 'iz74lbwtvzb6', 'f4ee7641-1d07-4e0d-92fa-87287e2332d4'),
	('00000000-0000-0000-0000-000000000000', 19, 'fzldiajgniqe', '6aec6474-c5cb-440b-a4d7-11f42681ea8c', true, '2025-10-31 13:39:51.881211+00', '2025-10-31 15:48:53.334825+00', 'enhbnsx4q2ei', 'f4ee7641-1d07-4e0d-92fa-87287e2332d4'),
	('00000000-0000-0000-0000-000000000000', 20, 'ohzfoh3vdepi', '6aec6474-c5cb-440b-a4d7-11f42681ea8c', false, '2025-10-31 15:48:53.344916+00', '2025-10-31 15:48:53.344916+00', 'fzldiajgniqe', 'f4ee7641-1d07-4e0d-92fa-87287e2332d4');


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
-- Data for Name: profiles; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."profiles" ("id", "email", "first_name", "last_name", "role", "created_at", "updated_at") VALUES
	('a0208271-e72e-43d4-b302-b477691f1a25', 'wobodyxeno@mailinator.com', 'Aiko', 'Howell', 'employee', '2025-10-29 15:29:54.697235+00', '2025-10-29 15:29:56.825213+00'),
	('af725396-1fc5-4156-84ea-a1a61aa3a9fd', 'qododygof@mailinator.com', 'Uriel', 'Rojas', 'employee', '2025-10-30 15:08:03.092307+00', '2025-10-30 15:08:04.851376+00'),
	('6de50483-27f4-4fb0-b4b0-05a47b55a71a', 'rurymofahy@mailinator.com', 'Genevieve', 'Lewis', 'employee', '2025-10-31 12:17:19.830774+00', '2025-10-31 14:00:40.153564+00'),
	('6aec6474-c5cb-440b-a4d7-11f42681ea8c', 'ge.fishta@gmail.com', 'Gerald', 'Fishta', 'admin', '2025-11-03 10:11:54.160115+00', '2025-11-03 10:13:03.325871+00');


--
-- Data for Name: employees; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."employees" ("id", "profile_id", "employee_id", "salary", "hourly_rate", "employment_type", "status", "manager_id", "created_at", "updated_at", "department", "position", "hire_date") VALUES
	('254608a5-0c8f-457f-b3c3-559eb02a8b0c', 'a0208271-e72e-43d4-b302-b477691f1a25', 'Tempore id similiqu', 19900.00, 19.00, 'full-time', 'active', NULL, '2025-10-29 15:29:56.984384+00', '2025-10-31 14:45:26.027458+00', 'engineering', 'Similique sunt quo r', '1979-04-24'),
	('e20ff85a-8b5b-46d8-bca9-1144e41d3e27', '6de50483-27f4-4fb0-b4b0-05a47b55a71a', 'Repudiandae aut aliq', 19000.00, 20.00, 'full-time', 'active', NULL, '2025-10-31 12:17:21.697905+00', '2025-10-31 14:45:26.027458+00', 'engineering', 'Invented Position', '2024-05-09');


--
-- Data for Name: payroll_periods; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: payroll_records; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: timesheets; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: buckets; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: buckets_analytics; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: objects; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: prefixes; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: s3_multipart_uploads; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: s3_multipart_uploads_parts; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE SET; Schema: auth; Owner: supabase_auth_admin
--

SELECT pg_catalog.setval('"auth"."refresh_tokens_id_seq"', 20, true);


--
-- PostgreSQL database dump complete
--

-- \unrestrict Slr7z1aewd2yYhPkyruSQejKxoWBxi8roIzo3mC7Fc2VtAvWwLhqdsG7M2LR3aL

RESET ALL;
