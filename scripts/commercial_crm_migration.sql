-- Commercial CRM Migration (Phase 1 + Phase 2)
-- Compatible with PostgreSQL

CREATE TABLE IF NOT EXISTS commercial_accounts (
  id varchar PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id varchar NOT NULL REFERENCES users(id),
  name text NOT NULL,
  segment text,
  company_size text,
  country text,
  state text,
  city text,
  address text,
  website text,
  status text DEFAULT 'active',
  tags jsonb DEFAULT '[]'::jsonb,
  custom_fields jsonb DEFAULT '{}'::jsonb,
  created_at timestamp DEFAULT now(),
  updated_at timestamp DEFAULT now()
);

CREATE TABLE IF NOT EXISTS commercial_contacts (
  id varchar PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id varchar NOT NULL REFERENCES commercial_accounts(id) ON DELETE CASCADE,
  name text NOT NULL,
  role text,
  email text,
  phone text,
  preferred_channel text,
  notes text,
  created_at timestamp DEFAULT now(),
  updated_at timestamp DEFAULT now()
);

CREATE TABLE IF NOT EXISTS commercial_pipeline_stages (
  id varchar PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id varchar NOT NULL REFERENCES users(id),
  name text NOT NULL,
  "order" integer NOT NULL DEFAULT 0,
  color text DEFAULT '#3B82F6',
  is_default boolean DEFAULT false,
  created_at timestamp DEFAULT now(),
  updated_at timestamp DEFAULT now()
);

CREATE TABLE IF NOT EXISTS commercial_opportunities (
  id varchar PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id varchar NOT NULL REFERENCES users(id),
  project_id varchar REFERENCES projects(id) ON DELETE SET NULL,
  account_id varchar NOT NULL REFERENCES commercial_accounts(id) ON DELETE CASCADE,
  contact_id varchar REFERENCES commercial_contacts(id) ON DELETE SET NULL,
  stage_id varchar REFERENCES commercial_pipeline_stages(id) ON DELETE SET NULL,
  title text NOT NULL,
  value_estimate real DEFAULT 0,
  probability integer DEFAULT 0,
  expected_close_date timestamp,
  status text DEFAULT 'open',
  loss_reason text,
  next_action_type text,
  next_action_description text,
  next_action_date timestamp,
  last_contact_at timestamp,
  created_at timestamp DEFAULT now(),
  updated_at timestamp DEFAULT now()
);

CREATE TABLE IF NOT EXISTS commercial_swot_analyses (
  id varchar PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id varchar NOT NULL REFERENCES users(id),
  project_id varchar REFERENCES projects(id) ON DELETE SET NULL,
  name text NOT NULL,
  segment text,
  context text,
  strengths jsonb DEFAULT '[]'::jsonb,
  weaknesses jsonb DEFAULT '[]'::jsonb,
  opportunities jsonb DEFAULT '[]'::jsonb,
  threats jsonb DEFAULT '[]'::jsonb,
  action_plan jsonb DEFAULT '[]'::jsonb,
  created_at timestamp DEFAULT now(),
  updated_at timestamp DEFAULT now()
);

CREATE TABLE IF NOT EXISTS commercial_playbook_templates (
  id varchar PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id varchar NOT NULL REFERENCES users(id),
  project_id varchar REFERENCES projects(id) ON DELETE SET NULL,
  name text NOT NULL,
  channel text NOT NULL,
  segment text,
  objective text,
  content text NOT NULL,
  checklist jsonb DEFAULT '[]'::jsonb,
  version integer DEFAULT 1,
  is_active boolean DEFAULT true,
  created_at timestamp DEFAULT now(),
  updated_at timestamp DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_commercial_accounts_user_id ON commercial_accounts(user_id);
CREATE INDEX IF NOT EXISTS idx_commercial_contacts_account_id ON commercial_contacts(account_id);
CREATE INDEX IF NOT EXISTS idx_commercial_stages_user_id ON commercial_pipeline_stages(user_id);
CREATE INDEX IF NOT EXISTS idx_commercial_opportunities_user_id ON commercial_opportunities(user_id);
CREATE INDEX IF NOT EXISTS idx_commercial_opportunities_stage_id ON commercial_opportunities(stage_id);
CREATE INDEX IF NOT EXISTS idx_commercial_swot_user_id ON commercial_swot_analyses(user_id);
CREATE INDEX IF NOT EXISTS idx_commercial_playbooks_user_id ON commercial_playbook_templates(user_id);

-- Backward-compatible updates for databases where tables already exist
ALTER TABLE commercial_opportunities ADD COLUMN IF NOT EXISTS project_id varchar;
ALTER TABLE commercial_swot_analyses ADD COLUMN IF NOT EXISTS project_id varchar;
ALTER TABLE commercial_playbook_templates ADD COLUMN IF NOT EXISTS project_id varchar;

DO $$ BEGIN
  ALTER TABLE commercial_opportunities
    ADD CONSTRAINT commercial_opportunities_project_id_projects_id_fk
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE SET NULL;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE commercial_swot_analyses
    ADD CONSTRAINT commercial_swot_analyses_project_id_projects_id_fk
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE SET NULL;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  ALTER TABLE commercial_playbook_templates
    ADD CONSTRAINT commercial_playbook_templates_project_id_projects_id_fk
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE SET NULL;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
