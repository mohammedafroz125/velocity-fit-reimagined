"use client";

import * as React from "react";
import Link from "next/link";
import { faqsData } from "@/data/faqs";
import { AccordionItem } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Search, MessageSquareQuote } from "lucide-react";
import { siteConfig } from "@/data/site-config";

export function FaqClient() {
  const [selectedCategory, setSelectedCategory] = React.useState<string>("All");
  const [openFaqId, setOpenFaqId] = React.useState<string | null>(faqsData[0]?.id || null);
  const [searchQuery, setSearchQuery] = React.useState("");

  const categories = ["All", "Clinical", "Programs", "Diet & Lifestyle", "Logistics & Consultation"];

  const filteredFaqs = faqsData.filter((faq) => {
    const matchesCategory = selectedCategory === "All" || faq.category === selectedCategory;
    const matchesSearch =
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-10">
      {/* Search & Filter Bar */}
      <div className="space-y-4">
        <div className="relative">
          <Search className="w-5 h-5 text-ink/40 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search questions (e.g. PCOS, pricing, supplements, duration)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-13 pl-12 pr-4 rounded-2xl border border-ink/15 bg-paper text-sm text-ink placeholder:text-ink/40 focus:outline-none focus:ring-2 focus:ring-olive-deep shadow-sm"
          />
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? "bg-ink text-champagne shadow-sm"
                  : "bg-paper border border-ink/10 text-ink-soft hover:bg-ivory"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Accordion Questions List */}
      <div className="space-y-3">
        {filteredFaqs.length > 0 ? (
          filteredFaqs.map((faq) => (
            <AccordionItem
              key={faq.id}
              question={faq.question}
              answer={faq.answer}
              isOpen={openFaqId === faq.id}
              onToggle={() => setOpenFaqId(openFaqId === faq.id ? null : faq.id)}
              variant="light"
            />
          ))
        ) : (
          <div className="p-8 rounded-2xl bg-paper border border-ink/10 text-center space-y-3">
            <p className="text-sm font-semibold text-ink">
              No questions found matching &ldquo;{searchQuery}&rdquo;
            </p>
            <p className="text-xs text-ink-soft">
              Try adjusting your search term or category filter, or connect with us directly on WhatsApp.
            </p>
            <div>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("All");
                }}
              >
                Reset Search & Filters
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Direct WhatsApp Prompt */}
      <div className="p-8 rounded-3xl bg-paper border border-ink/10 text-center space-y-4">
        <h3 className="text-lg font-display font-medium text-ink">
          Have a Question Not Answered Here?
        </h3>
        <p className="text-xs sm:text-sm text-ink-soft max-w-md mx-auto leading-relaxed">
          Dr. Lubna Fatima&apos;s clinical team is available to answer questions about specific medical histories, medication protocols, and intake procedures.
        </p>
        <Button asChild variant="default" size="lg">
          <a
            href={`https://wa.me/${siteConfig.contact.whatsappRaw}?text=${encodeURIComponent(
              "Hello Dr. Lubna, I reviewed the FAQ page and have a specific question regarding your transformation programs."
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-2"
          >
            <MessageSquareQuote className="w-4 h-4" />
            <span>Chat Directly on WhatsApp</span>
          </a>
        </Button>
      </div>
    </div>
  );
}
