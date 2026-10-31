-- ==============================================================================
-- SUPPLIER REALITY AI — SUPABASE POSTGRESQL SCHEMA
-- ContextCon 03 · IIT Bombay
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    organization TEXT,
    role TEXT DEFAULT 'analyst',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. INVESTIGATIONS
CREATE TABLE IF NOT EXISTS public.investigations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_name TEXT NOT NULL,
    domain TEXT,
    cin TEXT,
    gstin TEXT,
    founder_name TEXT,
    linkedin_url TEXT,
    status TEXT NOT NULL DEFAULT 'draft', -- 'draft', 'in_progress', 'completed', 'failed', 'review_required'
    current_stage TEXT NOT NULL DEFAULT 'INPUT_VALIDATION',
    stage_progress INTEGER DEFAULT 0, -- 0 to 100
    priority_level TEXT DEFAULT 'STANDARD', -- 'STANDARD', 'ELEVATED_REVIEW', 'CRITICAL_DISCREPANCY'
    summary TEXT,
    recommendation TEXT,
    raw_crustdata_company JSONB,
    raw_crustdata_founder JSONB,
    raw_crustdata_posts JSONB,
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    is_demo BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for fast lookup
CREATE INDEX IF NOT EXISTS idx_investigations_company ON public.investigations(company_name);
CREATE INDEX IF NOT EXISTS idx_investigations_domain ON public.investigations(domain);
CREATE INDEX IF NOT EXISTS idx_investigations_status ON public.investigations(status);
CREATE INDEX IF NOT EXISTS idx_investigations_created_at ON public.investigations(created_at DESC);

-- 3. ENTITIES
CREATE TABLE IF NOT EXISTS public.entities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    investigation_id UUID NOT NULL REFERENCES public.investigations(id) ON DELETE CASCADE,
    entity_type TEXT NOT NULL, -- 'company', 'person', 'address', 'director', 'previous_venture', 'bank_account'
    name TEXT NOT NULL,
    identifier TEXT, -- CIN, DIN, GSTIN, PAN, Address Hash
    role_or_title TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_entities_investigation ON public.entities(investigation_id);
CREATE INDEX IF NOT EXISTS idx_entities_type ON public.entities(entity_type);

-- 4. RELATIONSHIPS (GRAPH EDGES)
CREATE TABLE IF NOT EXISTS public.relationships (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    investigation_id UUID NOT NULL REFERENCES public.investigations(id) ON DELETE CASCADE,
    source_entity_id UUID NOT NULL REFERENCES public.entities(id) ON DELETE CASCADE,
    target_entity_id UUID NOT NULL REFERENCES public.entities(id) ON DELETE CASCADE,
    relationship_type TEXT NOT NULL, -- 'FOUNDED', 'WORKED_AT', 'DIRECTOR_OF', 'SHARES_ADDRESS_WITH', 'SUB_CONTRACTOR_OF', 'ASSOCIATED_WITH'
    confidence NUMERIC(3, 2) DEFAULT 0.90, -- 0.00 to 1.00
    is_discrepancy BOOLEAN DEFAULT FALSE,
    evidence_description TEXT NOT NULL,
    source_reference TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_relationships_investigation ON public.relationships(investigation_id);

-- 5. EVIDENCE SOURCES
CREATE TABLE IF NOT EXISTS public.evidence_sources (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    investigation_id UUID NOT NULL REFERENCES public.investigations(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    source_type TEXT NOT NULL, -- 'CRUSTDATA_COMPANY', 'CRUSTDATA_PEOPLE', 'CRUSTDATA_POSTS', 'DOCUMENT_UPLOAD', 'PUBLIC_REGISTRY', 'WEB_GROUNDING'
    url TEXT,
    retrieval_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    publication_date TEXT,
    raw_payload JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_evidence_sources_investigation ON public.evidence_sources(investigation_id);

-- 6. FINDINGS (CRITICAL EVIDENCE ARCHITECTURE)
-- 7 explicit classifications required by specification:
-- 1. OFFICIALLY_VERIFIED
-- 2. THIRD_PARTY_REPORTED
-- 3. COMPANY_SELF_REPORTED
-- 4. PUBLIC_SOCIAL_MEDIA
-- 5. UPLOADED_DOCUMENT
-- 6. AI_GENERATED_INFERENCE
-- 7. UNVERIFIED_CLAIM
CREATE TABLE IF NOT EXISTS public.findings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    investigation_id UUID NOT NULL REFERENCES public.investigations(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    module TEXT NOT NULL, -- 'COMPANY', 'FOUNDER', 'DOCUMENT', 'RELATIONSHIP', 'CROSS_VERIFICATION'
    classification TEXT NOT NULL,
    confidence_level TEXT NOT NULL DEFAULT 'MEDIUM', -- 'HIGH', 'MEDIUM', 'LOW', 'UNCERTAIN'
    verification_status TEXT NOT NULL DEFAULT 'UNVERIFIED', -- 'VERIFIED', 'CONTRADICTED', 'REQUIRES_REVIEW', 'UNVERIFIED'
    evidence_source_id UUID REFERENCES public.evidence_sources(id) ON DELETE SET NULL,
    source_name TEXT NOT NULL,
    source_url TEXT,
    publication_date TEXT,
    retrieval_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    evidence_excerpt TEXT NOT NULL,
    is_discrepancy BOOLEAN DEFAULT FALSE,
    severity TEXT DEFAULT 'INFO', -- 'INFO', 'LOW', 'MEDIUM', 'HIGH', 'CRITICAL'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_findings_investigation ON public.findings(investigation_id);
CREATE INDEX IF NOT EXISTS idx_findings_classification ON public.findings(classification);
CREATE INDEX IF NOT EXISTS idx_findings_discrepancy ON public.findings(is_discrepancy);

-- 7. UPLOADED DOCUMENTS
CREATE TABLE IF NOT EXISTS public.uploaded_documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    investigation_id UUID NOT NULL REFERENCES public.investigations(id) ON DELETE CASCADE,
    filename TEXT NOT NULL,
    file_type TEXT NOT NULL, -- 'application/pdf', 'image/png', 'image/jpeg'
    file_size_bytes INTEGER NOT NULL,
    storage_path TEXT NOT NULL,
    extracted_fields JSONB DEFAULT '{}'::jsonb,
    comparison_results JSONB DEFAULT '[]'::jsonb,
    status TEXT NOT NULL DEFAULT 'PENDING', -- 'PENDING', 'PROCESSED', 'FAILED'
    processing_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_documents_investigation ON public.uploaded_documents(investigation_id);

-- Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.investigations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.entities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.relationships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.evidence_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.findings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.uploaded_documents ENABLE ROW LEVEL SECURITY;

-- Authenticated users can access only their own investigation records.
-- No anonymous write policies: synthetic demo is served from local sample data.
CREATE POLICY "owners select investigations" ON public.investigations FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "owners insert investigations" ON public.investigations FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "owners update investigations" ON public.investigations FOR UPDATE TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY "owners delete investigations" ON public.investigations FOR DELETE TO authenticated USING (user_id = auth.uid());
CREATE POLICY "owners profiles" ON public.profiles FOR ALL TO authenticated USING (id = auth.uid()) WITH CHECK (id = auth.uid());
CREATE POLICY "owners select entities" ON public.entities FOR SELECT TO authenticated USING (EXISTS (SELECT 1 FROM public.investigations i WHERE i.id = investigation_id AND i.user_id = auth.uid()));
CREATE POLICY "owners insert entities" ON public.entities FOR INSERT TO authenticated WITH CHECK (EXISTS (SELECT 1 FROM public.investigations i WHERE i.id = investigation_id AND i.user_id = auth.uid()));
CREATE POLICY "owners update entities" ON public.entities FOR UPDATE TO authenticated USING (EXISTS (SELECT 1 FROM public.investigations i WHERE i.id = investigation_id AND i.user_id = auth.uid())) WITH CHECK (EXISTS (SELECT 1 FROM public.investigations i WHERE i.id = investigation_id AND i.user_id = auth.uid()));
CREATE POLICY "owners delete entities" ON public.entities FOR DELETE TO authenticated USING (EXISTS (SELECT 1 FROM public.investigations i WHERE i.id = investigation_id AND i.user_id = auth.uid()));
CREATE POLICY "owners select relationships" ON public.relationships FOR SELECT TO authenticated USING (EXISTS (SELECT 1 FROM public.investigations i WHERE i.id = investigation_id AND i.user_id = auth.uid()));
CREATE POLICY "owners insert relationships" ON public.relationships FOR INSERT TO authenticated WITH CHECK (EXISTS (SELECT 1 FROM public.investigations i WHERE i.id = investigation_id AND i.user_id = auth.uid()));
CREATE POLICY "owners update relationships" ON public.relationships FOR UPDATE TO authenticated USING (EXISTS (SELECT 1 FROM public.investigations i WHERE i.id = investigation_id AND i.user_id = auth.uid())) WITH CHECK (EXISTS (SELECT 1 FROM public.investigations i WHERE i.id = investigation_id AND i.user_id = auth.uid()));
CREATE POLICY "owners delete relationships" ON public.relationships FOR DELETE TO authenticated USING (EXISTS (SELECT 1 FROM public.investigations i WHERE i.id = investigation_id AND i.user_id = auth.uid()));
CREATE POLICY "owners select evidence_sources" ON public.evidence_sources FOR SELECT TO authenticated USING (EXISTS (SELECT 1 FROM public.investigations i WHERE i.id = investigation_id AND i.user_id = auth.uid()));
CREATE POLICY "owners insert evidence_sources" ON public.evidence_sources FOR INSERT TO authenticated WITH CHECK (EXISTS (SELECT 1 FROM public.investigations i WHERE i.id = investigation_id AND i.user_id = auth.uid()));
CREATE POLICY "owners update evidence_sources" ON public.evidence_sources FOR UPDATE TO authenticated USING (EXISTS (SELECT 1 FROM public.investigations i WHERE i.id = investigation_id AND i.user_id = auth.uid())) WITH CHECK (EXISTS (SELECT 1 FROM public.investigations i WHERE i.id = investigation_id AND i.user_id = auth.uid()));
CREATE POLICY "owners delete evidence_sources" ON public.evidence_sources FOR DELETE TO authenticated USING (EXISTS (SELECT 1 FROM public.investigations i WHERE i.id = investigation_id AND i.user_id = auth.uid()));
CREATE POLICY "owners select findings" ON public.findings FOR SELECT TO authenticated USING (EXISTS (SELECT 1 FROM public.investigations i WHERE i.id = investigation_id AND i.user_id = auth.uid()));
CREATE POLICY "owners insert findings" ON public.findings FOR INSERT TO authenticated WITH CHECK (EXISTS (SELECT 1 FROM public.investigations i WHERE i.id = investigation_id AND i.user_id = auth.uid()));
CREATE POLICY "owners update findings" ON public.findings FOR UPDATE TO authenticated USING (EXISTS (SELECT 1 FROM public.investigations i WHERE i.id = investigation_id AND i.user_id = auth.uid())) WITH CHECK (EXISTS (SELECT 1 FROM public.investigations i WHERE i.id = investigation_id AND i.user_id = auth.uid()));
CREATE POLICY "owners delete findings" ON public.findings FOR DELETE TO authenticated USING (EXISTS (SELECT 1 FROM public.investigations i WHERE i.id = investigation_id AND i.user_id = auth.uid()));
CREATE POLICY "owners select uploaded_documents" ON public.uploaded_documents FOR SELECT TO authenticated USING (EXISTS (SELECT 1 FROM public.investigations i WHERE i.id = investigation_id AND i.user_id = auth.uid()));
CREATE POLICY "owners insert uploaded_documents" ON public.uploaded_documents FOR INSERT TO authenticated WITH CHECK (EXISTS (SELECT 1 FROM public.investigations i WHERE i.id = investigation_id AND i.user_id = auth.uid()));
CREATE POLICY "owners update uploaded_documents" ON public.uploaded_documents FOR UPDATE TO authenticated USING (EXISTS (SELECT 1 FROM public.investigations i WHERE i.id = investigation_id AND i.user_id = auth.uid())) WITH CHECK (EXISTS (SELECT 1 FROM public.investigations i WHERE i.id = investigation_id AND i.user_id = auth.uid()));
CREATE POLICY "owners delete uploaded_documents" ON public.uploaded_documents FOR DELETE TO authenticated USING (EXISTS (SELECT 1 FROM public.investigations i WHERE i.id = investigation_id AND i.user_id = auth.uid()));

-- A private storage bucket is created if the storage extension is enabled.
INSERT INTO storage.buckets (id, name, public) VALUES ('supplier-documents', 'supplier-documents', false) ON CONFLICT (id) DO UPDATE SET public = false;
CREATE POLICY "owners read private documents" ON storage.objects FOR SELECT TO authenticated USING (bucket_id = 'supplier-documents' AND (storage.foldername(name))[1] = auth.uid()::text);
CREATE POLICY "owners upload private documents" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'supplier-documents' AND (storage.foldername(name))[1] = auth.uid()::text);
