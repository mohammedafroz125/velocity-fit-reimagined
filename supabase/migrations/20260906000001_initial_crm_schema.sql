-- ==============================================================================
-- Velocity Fit — Phase 2A Initial CRM & Lead Management Schema
-- Description: Complete PostgreSQL DDL with RLS, Constraints, and Audit Trails
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Admin Users / Profiles
CREATE TABLE IF NOT EXISTS public.admin_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    full_name TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'ADMIN' CHECK (role IN ('SUPER_ADMIN', 'ADMIN')),
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. Leads Table
CREATE TABLE IF NOT EXISTS public.leads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    last_activity_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    
    -- Contact Information
    full_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    phone_normalized TEXT NOT NULL,
    email TEXT,
    age INT,
    gender TEXT CHECK (gender IN ('Male', 'Female', 'Rather not specify')),
    city TEXT,
    
    -- Status Pipeline (Strict Business Statuses)
    status TEXT NOT NULL DEFAULT 'NEW' CHECK (
        status IN (
            'NEW', 'CONTACTED', 'QUALIFIED', 'FOLLOW_UP',
            'CONSULTATION_BOOKED', 'CONSULTATION_COMPLETED',
            'PAYMENT_PENDING', 'CONVERTED', 'ACTIVE_CUSTOMER',
            'NOT_INTERESTED', 'LOST'
        )
    ),
    
    -- Preferences & Intent
    preferred_program TEXT, -- 'Flex', 'Grit', 'Unsure', etc.
    preferred_contact_method TEXT DEFAULT 'WhatsApp' CHECK (
        preferred_contact_method IN ('WhatsApp', 'Phone Call', 'Email')
    ),
    source_type TEXT NOT NULL DEFAULT 'CONTACT_FORM' CHECK (
        source_type IN ('CONTACT_FORM', 'ASSESSMENT_WIZARD', 'DIRECT_WHATSAPP', 'MANUAL_ENTRY')
    ),
    enquiry_message TEXT,
    
    -- Attribution & Campaign Metadata
    utm_source TEXT,
    utm_medium TEXT,
    utm_campaign TEXT,
    utm_content TEXT,
    utm_term TEXT,
    landing_page TEXT,
    referrer_url TEXT,
    device_type TEXT,
    
    -- Administration & Assignment
    assigned_to UUID REFERENCES public.admin_profiles(id) ON DELETE SET NULL
);

-- Indexes for Fast CRM Filtering & Deduplication
CREATE INDEX IF NOT EXISTS idx_leads_phone_normalized ON public.leads(phone_normalized);
CREATE INDEX IF NOT EXISTS idx_leads_email ON public.leads(email);
CREATE INDEX IF NOT EXISTS idx_leads_status ON public.leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON public.leads(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_leads_assigned_to ON public.leads(assigned_to);

-- 3. Lead Status History
CREATE TABLE IF NOT EXISTS public.lead_status_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lead_id UUID NOT NULL REFERENCES public.leads(id) ON DELETE CASCADE,
    old_status TEXT,
    new_status TEXT NOT NULL,
    changed_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    reason TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_lead_status_history_lead_id ON public.lead_status_history(lead_id);

-- 4. Lead Internal Notes
CREATE TABLE IF NOT EXISTS public.lead_notes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lead_id UUID NOT NULL REFERENCES public.leads(id) ON DELETE CASCADE,
    author_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    author_name TEXT NOT NULL,
    note_body TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_lead_notes_lead_id ON public.lead_notes(lead_id);

-- 5. Clinical Assessments (Sensitive Protected Data)
CREATE TABLE IF NOT EXISTS public.assessments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lead_id UUID REFERENCES public.leads(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    
    -- Body & Metrics
    height_cm NUMERIC(5,2) NOT NULL,
    current_weight_kg NUMERIC(5,2) NOT NULL,
    highest_weight_kg NUMERIC(5,2),
    target_weight_kg NUMERIC(5,2) NOT NULL,
    calculated_bmi NUMERIC(4,1),
    target_timeframe TEXT NOT NULL, -- '1 Months', '2 Months', '3 Months', '6 Months'
    primary_goals TEXT[] NOT NULL DEFAULT '{}',
    
    -- Health & Medical Background
    medical_conditions TEXT[] NOT NULL DEFAULT '{}',
    medications TEXT,
    surgeries TEXT,
    female_markers TEXT[] DEFAULT '{}',
    
    -- Lifestyle & V6 Audit™ Markers
    daily_water_liters NUMERIC(4,2) NOT NULL,
    sleep_hours NUMERIC(4,2) NOT NULL,
    bowel_movement TEXT,
    eating_patterns TEXT[] NOT NULL DEFAULT '{}',
    diet_struggles TEXT,
    
    -- Readiness & Commitment
    seriousness_scale INT NOT NULL CHECK (seriousness_scale BETWEEN 1 AND 10),
    life_change_vision TEXT,
    past_roadblocks TEXT,
    ready_for_60_days TEXT NOT NULL, -- 'Yes', 'No', 'Not Sure'
    referral_source TEXT,
    
    -- Structured JSON for Forward Compatibility
    raw_payload JSONB NOT NULL DEFAULT '{}'::jsonb
);

CREATE INDEX IF NOT EXISTS idx_assessments_lead_id ON public.assessments(lead_id);

-- 6. System Notifications
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    type TEXT NOT NULL CHECK (type IN ('NEW_LEAD', 'NEW_ASSESSMENT', 'STATUS_CHANGE', 'NOTE_ADDED')),
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    lead_id UUID REFERENCES public.leads(id) ON DELETE CASCADE,
    is_read BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON public.notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON public.notifications(created_at DESC);

-- 7. Audit Trail (No Medical Info in Descriptions)
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    actor_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    actor_name TEXT NOT NULL DEFAULT 'System',
    action TEXT NOT NULL, -- 'LEAD_CREATED', 'ASSESSMENT_SUBMITTED', 'STATUS_CHANGED', 'NOTE_ADDED', 'ASSIGNED'
    entity_type TEXT NOT NULL, -- 'lead', 'assessment', 'note'
    entity_id UUID NOT NULL,
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_audit_logs_entity ON public.audit_logs(entity_type, entity_id);

-- ==============================================================================
-- Row Level Security (RLS) Policies
-- ==============================================================================

-- Enable RLS on all tables
ALTER TABLE public.admin_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lead_status_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lead_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Helper function to check if current user is an active admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.admin_profiles
    WHERE id = auth.uid() AND is_active = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 1. admin_profiles Policies
CREATE POLICY "Admins can view admin profiles"
    ON public.admin_profiles FOR SELECT
    TO authenticated
    USING (public.is_admin());

-- 2. leads Policies
-- Authenticated admins can view, update, and insert leads
CREATE POLICY "Admins can view leads"
    ON public.leads FOR SELECT
    TO authenticated
    USING (public.is_admin());

CREATE POLICY "Admins can update leads"
    ON public.leads FOR UPDATE
    TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- 3. lead_status_history Policies
CREATE POLICY "Admins can view status history"
    ON public.lead_status_history FOR SELECT
    TO authenticated
    USING (public.is_admin());

CREATE POLICY "Admins can insert status history"
    ON public.lead_status_history FOR INSERT
    TO authenticated
    WITH CHECK (public.is_admin());

-- 4. lead_notes Policies
CREATE POLICY "Admins can view notes"
    ON public.lead_notes FOR SELECT
    TO authenticated
    USING (public.is_admin());

CREATE POLICY "Admins can insert notes"
    ON public.lead_notes FOR INSERT
    TO authenticated
    WITH CHECK (public.is_admin());

-- 5. assessments Policies (STRICT PROTECTION - Only Admins)
CREATE POLICY "Admins can view assessments"
    ON public.assessments FOR SELECT
    TO authenticated
    USING (public.is_admin());

-- 6. notifications Policies
CREATE POLICY "Admins can view notifications"
    ON public.notifications FOR SELECT
    TO authenticated
    USING (public.is_admin());

CREATE POLICY "Admins can update notifications"
    ON public.notifications FOR UPDATE
    TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- 7. audit_logs Policies
CREATE POLICY "Admins can view audit logs"
    ON public.audit_logs FOR SELECT
    TO authenticated
    USING (public.is_admin());

-- ==============================================================================
-- Trigger for automatic updated_at timestamps
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_leads_updated_at
    BEFORE UPDATE ON public.leads
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER trg_admin_profiles_updated_at
    BEFORE UPDATE ON public.admin_profiles
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
