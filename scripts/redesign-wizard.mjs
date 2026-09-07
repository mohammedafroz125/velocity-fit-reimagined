import fs from 'fs';
import path from 'path';

const root = process.cwd();

// 1. Assessment Wizard
const assessmentWizard = `"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  ASSESSMENT_STEPS,
  GOAL_OPTIONS,
  MEDICAL_CONDITION_OPTIONS,
  FEMALE_MARKER_OPTIONS,
  EATING_PATTERN_OPTIONS,
  BOWEL_MOVEMENT_OPTIONS,
  TIMEFRAME_OPTIONS,
  REFERRAL_SOURCES,
} from "@/data/assessment";
import { siteConfig } from "@/data/site-config";
import { getStoredAttribution } from "@/lib/attribution";
import { trackEvent } from "@/lib/analytics";
import { ArrowLeft, ArrowRight, CheckCircle2, MessageSquareQuote, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export function AssessmentWizard({ initialGoal }: { initialGoal?: string }) {
  const [currentStep, setCurrentStep] = React.useState(1);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isCompleted, setIsCompleted] = React.useState(false);
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [serverError, setServerError] = React.useState<string | null>(null);

  // Form State initialized with verified schema
  const [form, setForm] = React.useState({
    // Step 1: Profile
    fullName: "",
    age: "",
    gender: "" as "Male" | "Female" | "Rather not specify" | "",
    city: "",
    phone: "",
    email: "",

    // Step 2: Body & Goals
    heightCm: "",
    currentWeightKg: "",
    highestWeightKg: "",
    targetWeightKg: "",
    targetTimeframe: "3 Months",
    mainGoals: initialGoal ? [initialGoal] : ["Weight loss"],

    // Step 3: Medical Background
    medicalConditions: ["None"],
    otherMedications: "",
    isOnLongTermMedications: "No",
    longTermMedicationsDetails: "",
    hasPastSurgeries: "No",
    pastSurgeriesDetails: "",
    femaleMarkers: ["None"],

    // Step 4: Lifestyle & Habits (V6 Audit™ Foundation)
    dailyWaterLiters: "",
    sleepHours: "",
    bowelMovement: "Daily",
    eatingPatterns: ["Structured meals"],
    previousDietAttempts: "",
    biggestStruggle: "",

    // Step 5: Readiness & Attribution
    seriousnessScale: 9,
    lifeChangeVision: "",
    pastRoadblocks: "",
    readyFor60DaysCommitment: "Yes",
    referralSource: "Instagram",
  });

  React.useEffect(() => {
    trackEvent("assessment_start");
  }, []);

  const handleGoalToggle = (goal: string) => {
    setForm((prev) => {
      const exists = prev.mainGoals.includes(goal);
      const updated = exists
        ? prev.mainGoals.filter((g) => g !== goal)
        : [...prev.mainGoals, goal];
      return { ...prev, mainGoals: updated.length ? updated : [goal] };
    });
  };

  const handleConditionToggle = (condition: string) => {
    setForm((prev) => {
      if (condition === "None") {
        return { ...prev, medicalConditions: ["None"] };
      }
      const withoutNone = prev.medicalConditions.filter((c) => c !== "None");
      const exists = withoutNone.includes(condition);
      const updated = exists
        ? withoutNone.filter((c) => c !== condition)
        : [...withoutNone, condition];
      return { ...prev, medicalConditions: updated.length ? updated : ["None"] };
    });
  };

  const handleFemaleMarkerToggle = (marker: string) => {
    setForm((prev) => {
      if (marker === "None") {
        return { ...prev, femaleMarkers: ["None"] };
      }
      const withoutNone = (prev.femaleMarkers || []).filter((m) => m !== "None");
      const exists = withoutNone.includes(marker);
      const updated = exists
        ? withoutNone.filter((m) => m !== marker)
        : [...withoutNone, marker];
      return { ...prev, femaleMarkers: updated.length ? updated : ["None"] };
    });
  };

  const handleEatingPatternToggle = (pattern: string) => {
    setForm((prev) => {
      const exists = prev.eatingPatterns.includes(pattern);
      const updated = exists
        ? prev.eatingPatterns.filter((p) => p !== pattern)
        : [...prev.eatingPatterns, pattern];
      return { ...prev, eatingPatterns: updated.length ? updated : [pattern] };
    });
  };

  const validateCurrentStep = (): boolean => {
    const errs: Record<string, string> = {};

    if (currentStep === 1) {
      if (!form.fullName.trim()) errs.fullName = "Full Name is required";
      if (!form.age) errs.age = "Age is required";
      if (!form.gender) errs.gender = "Please select gender";
      if (!form.phone.trim()) {
        errs.phone = "Phone number is required for WhatsApp coordination";
      } else if (!/^\\+?[0-9]{10,14}$/.test(form.phone.replace(/[\\s-]/g, ""))) {
        errs.phone = "Please enter a valid 10-digit mobile number";
      }
      if (form.email && !/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(form.email)) {
        errs.email = "Please enter a valid email address";
      }
    } else if (currentStep === 2) {
      if (!form.heightCm) errs.heightCm = "Height in cm is required";
      if (!form.currentWeightKg) errs.currentWeightKg = "Current weight is required";
      if (!form.targetWeightKg) errs.targetWeightKg = "Target weight is required";
      if (form.mainGoals.length === 0) errs.mainGoals = "Please select at least one primary goal";
    } else if (currentStep === 4) {
      if (!form.dailyWaterLiters) errs.dailyWaterLiters = "Approximate daily water intake is required";
      if (!form.sleepHours) errs.sleepHours = "Average sleep hours is required";
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const nextStep = () => {
    if (!validateCurrentStep()) return;
    trackEvent("assessment_step", { step: currentStep });
    setCurrentStep((prev) => Math.min(prev + 1, 5));
    window.scrollTo({ top: 120, behavior: "smooth" });
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
    window.scrollTo({ top: 120, behavior: "smooth" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);
    if (!validateCurrentStep()) return;

    setIsSubmitting(true);
    const attribution = getStoredAttribution();

    try {
      const res = await fetch("/api/leads/assessment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: form.fullName,
          age: Number(form.age),
          gender: form.gender,
          city: form.city || undefined,
          phone: form.phone,
          email: form.email,
          heightCm: Number(form.heightCm),
          currentWeightKg: Number(form.currentWeightKg),
          highestWeightKg: form.highestWeightKg ? Number(form.highestWeightKg) : undefined,
          targetWeightKg: Number(form.targetWeightKg),
          targetTimeframe: form.targetTimeframe,
          mainGoals: form.mainGoals,
          medicalConditions: form.medicalConditions,
          otherConditionMedications: form.otherMedications || undefined,
          isOnLongTermMedications: form.isOnLongTermMedications,
          longTermMedicationsDetails: form.longTermMedicationsDetails || undefined,
          hasPastSurgeries: form.hasPastSurgeries,
          pastSurgeriesDetails: form.pastSurgeriesDetails || undefined,
          femaleMarkers: form.femaleMarkers,
          dailyWaterLiters: Number(form.dailyWaterLiters),
          sleepHours: Number(form.sleepHours),
          bowelMovement: form.bowelMovement || undefined,
          eatingPatterns: form.eatingPatterns,
          previousDietAttempts: form.previousDietAttempts || undefined,
          biggestStruggle: form.biggestStruggle || undefined,
          seriousnessScale: form.seriousnessScale,
          lifeChangeVision: form.lifeChangeVision || undefined,
          pastRoadblocks: form.pastRoadblocks || undefined,
          readyFor60DaysCommitment: form.readyFor60DaysCommitment,
          referralSource: form.referralSource,
          attribution,
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || "Failed to record health assessment");
      }

      trackEvent("assessment_complete", {
        primary_goal: form.mainGoals[0],
        utm_source: attribution.utmSource || "direct",
      });

      setIsSubmitting(false);
      setIsCompleted(true);
    } catch (err: unknown) {
      setIsSubmitting(false);
      setServerError(
        err instanceof Error
          ? err.message
          : "Unable to submit your assessment. Please connect with Dr. Fatima on WhatsApp."
      );
    }
  };

  const currentHeightM = Number(form.heightCm) / 100;
  const currentWeightNum = Number(form.currentWeightKg);
  const calculatedBmi =
    currentHeightM > 0 && currentWeightNum > 0
      ? (currentWeightNum / (currentHeightM * currentHeightM)).toFixed(1)
      : null;

  if (isCompleted) {
    return (
      <div className="p-8 sm:p-12 rounded-[2rem] bg-paper border border-ink/10 shadow-elevated text-center space-y-6 max-w-2xl mx-auto">
        <div className="size-16 rounded-full bg-olive/10 text-olive-deep flex items-center justify-center mx-auto shadow-subtle">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <p className="eyebrow">Assessment Successfully Recorded</p>
          <h2 className="font-display text-3xl font-medium text-ink">
            Thank you, {form.fullName}
          </h2>
          <p className="text-sm text-ink-soft max-w-md mx-auto leading-relaxed">
            Your V6 Audit™ health intake has been transmitted directly to Dr. Lubna Fatima&apos;s clinical team for personal review.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-ivory border border-ink/10 text-left space-y-3">
          <h4 className="font-mono text-xs uppercase tracking-wider text-olive-deep font-semibold">
            Next Steps in Your Care:
          </h4>
          <ul className="space-y-2 text-xs text-ink-soft">
            <li className="flex items-start gap-2">
              <span className="font-bold text-ink">1.</span>
              <span>Our clinical coordinator will reach out on WhatsApp at <strong>{form.phone}</strong>.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold text-ink">2.</span>
              <span>We will schedule your 1-on-1 doctor consultation to review your metabolic markers.</span>
            </li>
          </ul>
        </div>

        <div className="pt-2">
          <Button asChild size="lg" fullWidth>
            <a
              href={\`https://wa.me/\${siteConfig.contact.whatsappRaw}?text=\${encodeURIComponent(
                \`Hello Dr. Lubna, I just completed my VelocityFit Pre-Signup Health Assessment for \${form.fullName} (\${form.phone}). Looking forward to your review.\`
              )}\`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2"
            >
              <MessageSquareQuote className="w-4 h-4" />
              <span>Connect Immediately on WhatsApp</span>
            </a>
          </Button>
        </div>
      </div>
    );
  }

  const currentStepConfig = ASSESSMENT_STEPS[currentStep - 1];

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Step Indicator Bar */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs font-mono uppercase tracking-wider">
          <span className="text-olive-deep font-semibold">
            Step 0{currentStep} / 05 — {currentStepConfig.title}
          </span>
          <span className="text-ink-soft">{Math.round((currentStep / 5) * 100)}% Complete</span>
        </div>
        <div className="h-2 w-full bg-mist rounded-full overflow-hidden">
          <div
            className="h-full bg-olive transition-all duration-300 ease-out"
            style={{ width: \`\${(currentStep / 5) * 100}%\` }}
          />
        </div>
      </div>

      {/* Main Form Container */}
      <div className="p-7 sm:p-12 rounded-[2rem] bg-paper border border-ink/10 shadow-elevated">
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-2 border-b border-ink/10 pb-5">
            <span className="font-mono text-xs uppercase tracking-wider text-olive-deep font-semibold">
              {currentStepConfig.subtitle}
            </span>
            <h2 className="font-display text-3xl font-medium text-ink">
              {currentStepConfig.title}
            </h2>
            <p className="text-sm text-ink-soft">
              {currentStepConfig.description}
            </p>
          </div>

          {serverError && (
            <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-xs text-red-800">
              {serverError}
            </div>
          )}

          {/* STEP 1: Personal Profile */}
          {currentStep === 1 && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Full Name *"
                  placeholder="e.g. Priya Sharma"
                  value={form.fullName}
                  onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                  error={errors.fullName}
                />
                <Input
                  label="Age *"
                  type="number"
                  placeholder="e.g. 34"
                  value={form.age}
                  onChange={(e) => setForm({ ...form, age: e.target.value })}
                  error={errors.age}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Select
                  label="Gender *"
                  value={form.gender}
                  onChange={(e) => setForm({ ...form, gender: e.target.value as any })}
                  options={[
                    { label: "Select gender...", value: "" },
                    { label: "Female", value: "Female" },
                    { label: "Male", value: "Male" },
                    { label: "Rather not specify", value: "Rather not specify" },
                  ]}
                  error={errors.gender}
                />
                <Input
                  label="City & State"
                  placeholder="e.g. Hyderabad, Telangana"
                  value={form.city}
                  onChange={(e) => setForm({ ...form, city: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Phone Number (WhatsApp) *"
                  placeholder="+91 98765 43210"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  error={errors.phone}
                />
                <Input
                  label="Email Address"
                  type="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  error={errors.email}
                />
              </div>
            </div>
          )}

          {/* STEP 2: Body & Goals */}
          {currentStep === 2 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Input
                  label="Height in cm *"
                  type="number"
                  placeholder="e.g. 165"
                  value={form.heightCm}
                  onChange={(e) => setForm({ ...form, heightCm: e.target.value })}
                  error={errors.heightCm}
                />
                <Input
                  label="Current Weight in kg *"
                  type="number"
                  placeholder="e.g. 78"
                  value={form.currentWeightKg}
                  onChange={(e) => setForm({ ...form, currentWeightKg: e.target.value })}
                  error={errors.currentWeightKg}
                />
                <Input
                  label="Target Weight in kg *"
                  type="number"
                  placeholder="e.g. 64"
                  value={form.targetWeightKg}
                  onChange={(e) => setForm({ ...form, targetWeightKg: e.target.value })}
                  error={errors.targetWeightKg}
                />
              </div>

              {/* BMI Card */}
              {calculatedBmi && (
                <div className="p-4 rounded-2xl bg-ivory border border-ink/10 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <span className="font-mono text-[10px] uppercase tracking-wider text-olive-deep font-semibold">
                      Calculated BMI Baseline
                    </span>
                    <p className="text-xs text-ink-soft">
                      {Number(calculatedBmi) >= 25 ? "Elevated Metabolic Resistance" : "Healthy Range Baseline"}
                    </p>
                  </div>
                  <span className="font-display text-2xl font-bold text-ink">
                    {calculatedBmi}
                  </span>
                </div>
              )}

              {/* Goal Multi-Select */}
              <div className="space-y-2">
                <label className="block text-xs font-mono uppercase tracking-wider text-ink-soft">
                  Primary Transformation Goals (Select all that apply) *
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {GOAL_OPTIONS.map((g) => {
                    const isSelected = form.mainGoals.includes(g);
                    return (
                      <button
                        type="button"
                        key={g}
                        onClick={() => handleGoalToggle(g)}
                        className={cn(
                          "p-4 rounded-2xl border text-left text-xs font-medium transition-all",
                          isSelected
                            ? "border-olive bg-olive/10 text-ink shadow-sm"
                            : "border-ink/10 bg-ivory text-ink-soft hover:border-ink/30"
                        )}
                      >
                        <div className="flex items-center justify-between">
                          <span>{g}</span>
                          <span className={cn(
                            "size-4 rounded-full border flex items-center justify-center text-[10px]",
                            isSelected ? "border-olive bg-olive text-paper" : "border-ink/20"
                          )}>
                            {isSelected && "✓"}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
                {errors.mainGoals && <p className="text-xs text-red-600 font-medium">{errors.mainGoals}</p>}
              </div>

              <Select
                label="Target Timeframe"
                value={form.targetTimeframe}
                onChange={(e) => setForm({ ...form, targetTimeframe: e.target.value })}
                options={TIMEFRAME_OPTIONS.map((t) => ({ label: t, value: t }))}
              />
            </div>
          )}

          {/* STEP 3: Medical Background */}
          {currentStep === 3 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="space-y-2">
                <label className="block text-xs font-mono uppercase tracking-wider text-ink-soft">
                  Diagnosed Medical Conditions
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {MEDICAL_CONDITION_OPTIONS.map((c) => {
                    const isSelected = form.medicalConditions.includes(c);
                    return (
                      <button
                        type="button"
                        key={c}
                        onClick={() => handleConditionToggle(c)}
                        className={cn(
                          "p-3 rounded-2xl border text-center text-xs font-medium transition-all",
                          isSelected
                            ? "border-olive bg-olive/10 text-ink font-semibold"
                            : "border-ink/10 bg-ivory text-ink-soft hover:border-ink/30"
                        )}
                      >
                        {c}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Female Markers if applicable */}
              {form.gender !== "Male" && (
                <div className="space-y-2">
                  <label className="block text-xs font-mono uppercase tracking-wider text-ink-soft">
                    Hormonal & Cycle Evaluation (Female Health)
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                    {FEMALE_MARKER_OPTIONS.map((m) => {
                      const isSelected = form.femaleMarkers.includes(m);
                      return (
                        <button
                          type="button"
                          key={m}
                          onClick={() => handleFemaleMarkerToggle(m)}
                          className={cn(
                            "p-3 rounded-2xl border text-center text-xs font-medium transition-all",
                            isSelected
                              ? "border-olive bg-olive/10 text-ink font-semibold"
                              : "border-ink/10 bg-ivory text-ink-soft hover:border-ink/30"
                          )}
                        >
                          {m}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              <Textarea
                label="Long-Term Medications & Past Surgeries (Optional)"
                placeholder="List any regular medications (Thyroid, Metformin, BP, etc.) or surgeries..."
                rows={3}
                value={form.longTermMedicationsDetails}
                onChange={(e) => setForm({ ...form, longTermMedicationsDetails: e.target.value })}
              />
            </div>
          )}

          {/* STEP 4: Lifestyle & Habits (V6 Audit™) */}
          {currentStep === 4 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Daily Water Intake (Liters) *"
                  type="number"
                  step="0.5"
                  placeholder="e.g. 2.5"
                  value={form.dailyWaterLiters}
                  onChange={(e) => setForm({ ...form, dailyWaterLiters: e.target.value })}
                  error={errors.dailyWaterLiters}
                />
                <Input
                  label="Average Sleep Hours per Night *"
                  type="number"
                  placeholder="e.g. 7"
                  value={form.sleepHours}
                  onChange={(e) => setForm({ ...form, sleepHours: e.target.value })}
                  error={errors.sleepHours}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Select
                  label="Digestive Motility & Bowel Pattern"
                  value={form.bowelMovement}
                  onChange={(e) => setForm({ ...form, bowelMovement: e.target.value })}
                  options={BOWEL_MOVEMENT_OPTIONS.map((b) => ({ label: b, value: b }))}
                />
                <Select
                  label="Where did you hear about us?"
                  value={form.referralSource}
                  onChange={(e) => setForm({ ...form, referralSource: e.target.value })}
                  options={REFERRAL_SOURCES.map((r) => ({ label: r, value: r }))}
                />
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-mono uppercase tracking-wider text-ink-soft">
                  Eating Patterns & Challenges (Select all that apply)
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {EATING_PATTERN_OPTIONS.map((p) => {
                    const isSelected = form.eatingPatterns.includes(p);
                    return (
                      <button
                        type="button"
                        key={p}
                        onClick={() => handleEatingPatternToggle(p)}
                        className={cn(
                          "p-3 rounded-2xl border text-center text-xs font-medium transition-all",
                          isSelected
                            ? "border-olive bg-olive/10 text-ink font-semibold"
                            : "border-ink/10 bg-ivory text-ink-soft hover:border-ink/30"
                        )}
                      >
                        {p}
                      </button>
                    );
                  })}
                </div>
              </div>

              <Textarea
                label="Biggest Struggle with Past Diets (Optional)"
                placeholder="e.g. Rebound weight gain, constant evening hunger, busy travel schedule..."
                rows={3}
                value={form.biggestStruggle}
                onChange={(e) => setForm({ ...form, biggestStruggle: e.target.value })}
              />
            </div>
          )}

          {/* STEP 5: Readiness & Commitment */}
          {currentStep === 5 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono uppercase tracking-wider text-ink-soft font-semibold">
                    Commitment & Seriousness Level (1 to 10)
                  </span>
                  <span className="font-display text-xl font-bold text-olive-deep">
                    {form.seriousnessScale} / 10
                  </span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={10}
                  value={form.seriousnessScale}
                  onChange={(e) => setForm({ ...form, seriousnessScale: Number(e.target.value) })}
                  className="w-full accent-olive h-2 bg-mist rounded-lg cursor-pointer"
                />
              </div>

              <Textarea
                label="How will achieving your ideal health transform your life? (Optional)"
                placeholder="Share your personal vision (confidence, energy with children, reversing condition)..."
                rows={3}
                value={form.lifeChangeVision}
                onChange={(e) => setForm({ ...form, lifeChangeVision: e.target.value })}
              />

              <div className="p-6 rounded-2xl bg-ivory border border-ink/10 space-y-3">
                <span className="font-mono text-[10px] uppercase tracking-wider text-olive-deep font-semibold">
                  Physician Care Commitment
                </span>
                <p className="text-xs text-ink-soft leading-relaxed">
                  By submitting, you consent to Dr. Lubna Fatima&apos;s clinical team reviewing your baseline markers to architect your Velocity Fit transformation protocol.
                </p>
              </div>
            </div>
          )}

          {/* Wizard Action Controls */}
          <div className="flex items-center justify-between pt-6 border-t border-ink/10">
            {currentStep > 1 ? (
              <Button type="button" variant="outline" onClick={prevStep} className="flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </Button>
            ) : (
              <div />
            )}

            {currentStep < 5 ? (
              <Button type="button" onClick={nextStep} className="flex items-center gap-2">
                <span>Continue to Step 0{currentStep + 1}</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            ) : (
              <Button type="submit" disabled={isSubmitting} size="lg" className="flex items-center gap-2">
                <span>{isSubmitting ? "Transmitting..." : "Submit Health Assessment"}</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
`;

fs.writeFileSync(path.join(root, 'src/components/forms/assessment-wizard.tsx'), assessmentWizard, 'utf8');

console.log('AssessmentWizard component updated successfully!');
