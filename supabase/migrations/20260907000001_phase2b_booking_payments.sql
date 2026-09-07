-- ==============================================================================
-- Velocity Fit — Phase 2B Consultation Booking & Payment Foundation Schema
-- Description: DDL for Appointments, Payments, Customers, and Program Enrollments
-- ==============================================================================

-- 1. Appointments Table
CREATE TABLE IF NOT EXISTS public.appointments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lead_id UUID NOT NULL REFERENCES public.leads(id) ON DELETE CASCADE,
    customer_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ NOT NULL,
    timezone TEXT NOT NULL DEFAULT 'Asia/Kolkata',
    status TEXT NOT NULL DEFAULT 'REQUESTED' CHECK (
        status IN ('REQUESTED', 'CONFIRMED', 'COMPLETED', 'CANCELLED', 'NO_SHOW')
    ),
    meeting_type TEXT NOT NULL DEFAULT 'VIDEO_CALL' CHECK (
        meeting_type IN ('VIDEO_CALL', 'PHONE_CALL', 'IN_PERSON')
    ),
    meeting_link TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexing for appointment queries and slot conflict checks
CREATE INDEX IF NOT EXISTS idx_appointments_lead_id ON public.appointments(lead_id);
CREATE INDEX IF NOT EXISTS idx_appointments_start_time ON public.appointments(start_time);
CREATE INDEX IF NOT EXISTS idx_appointments_status ON public.appointments(status);

-- 2. Payments Table
CREATE TABLE IF NOT EXISTS public.payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lead_id UUID NOT NULL REFERENCES public.leads(id) ON DELETE CASCADE,
    customer_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    program_track TEXT NOT NULL CHECK (program_track IN ('Flex', 'Grit')),
    support_tier TEXT NOT NULL CHECK (support_tier IN ('Prime', 'Elite')),
    duration TEXT NOT NULL CHECK (duration IN ('1-month', '3-months')),
    amount INT NOT NULL, -- in INR (e.g. 2000, 5500, 3000, 8000)
    currency TEXT NOT NULL DEFAULT 'INR',
    gateway TEXT NOT NULL DEFAULT 'razorpay' CHECK (gateway IN ('razorpay', 'cashfree', 'mock')),
    gateway_order_id TEXT NOT NULL UNIQUE,
    gateway_payment_id TEXT,
    gateway_signature TEXT,
    status TEXT NOT NULL DEFAULT 'CREATED' CHECK (
        status IN ('CREATED', 'PENDING', 'SUCCESS', 'FAILED', 'CANCELLED', 'REFUNDED')
    ),
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_payments_lead_id ON public.payments(lead_id);
CREATE INDEX IF NOT EXISTS idx_payments_gateway_order_id ON public.payments(gateway_order_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON public.payments(status);

-- 3. Customers Table (Forward preparation for Phase 3 portal)
CREATE TABLE IF NOT EXISTS public.customers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lead_id UUID REFERENCES public.leads(id) ON DELETE SET NULL,
    email TEXT UNIQUE,
    phone TEXT NOT NULL,
    full_name TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 4. Program Enrollments Table (Forward preparation for Phase 3 portal)
CREATE TABLE IF NOT EXISTS public.program_enrollments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID NOT NULL REFERENCES public.customers(id) ON DELETE CASCADE,
    payment_id UUID REFERENCES public.payments(id) ON DELETE SET NULL,
    program_track TEXT NOT NULL,
    support_tier TEXT NOT NULL,
    duration TEXT NOT NULL,
    start_date DATE NOT NULL DEFAULT CURRENT_DATE,
    end_date DATE NOT NULL,
    status TEXT NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'PAUSED', 'COMPLETED', 'EXPIRED')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ==============================================================================
-- Row Level Security (RLS) Policies
-- ==============================================================================

ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.program_enrollments ENABLE ROW LEVEL SECURITY;

-- 1. Appointments Policies
CREATE POLICY "Admins can view appointments"
    ON public.appointments FOR SELECT
    TO authenticated
    USING (public.is_admin());

CREATE POLICY "Admins can update appointments"
    ON public.appointments FOR UPDATE
    TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

CREATE POLICY "Admins can insert appointments"
    ON public.appointments FOR INSERT
    TO authenticated
    WITH CHECK (public.is_admin());

-- 2. Payments Policies
CREATE POLICY "Admins can view payments"
    ON public.payments FOR SELECT
    TO authenticated
    USING (public.is_admin());

CREATE POLICY "Admins can update payments"
    ON public.payments FOR UPDATE
    TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- 3. Customers & Enrollments Policies
CREATE POLICY "Admins can view customers"
    ON public.customers FOR SELECT
    TO authenticated
    USING (public.is_admin());

CREATE POLICY "Admins can view enrollments"
    ON public.program_enrollments FOR SELECT
    TO authenticated
    USING (public.is_admin());

-- Triggers for automatic updated_at
CREATE TRIGGER trg_appointments_updated_at
    BEFORE UPDATE ON public.appointments
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER trg_payments_updated_at
    BEFORE UPDATE ON public.payments
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
