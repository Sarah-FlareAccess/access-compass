-- Custom board columns for the DIAP action plan (Asana-style sections).
--
-- board_column on diap_items records which custom column an action sits in
-- (null = Unassigned). diap_board_columns on organisations stores the ordered
-- list of the org's columns as a JSON array of { "id": "...", "name": "..." },
-- so the columns and their order are shared across the team and devices.

alter table diap_items add column if not exists board_column text;

alter table organisations add column if not exists diap_board_columns jsonb;
