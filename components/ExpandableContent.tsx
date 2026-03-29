'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface ExpandableContentProps {
    title: string;
    children: React.ReactNode;
    defaultExpanded?: boolean;
    id?: string;
}

/**
 * ExpandableContent Component
 * 
 * LLM-optimized expandable content that is always in the DOM for SEO and LLM readability.
 * Content is rendered but visually hidden when collapsed, ensuring search engines and
 * LLMs can always access the full content.
 * 
 * Features:
 * - Content always in DOM (not conditionally rendered)
 * - Semantic HTML with proper ARIA attributes
 * - Accessible keyboard navigation
 * - Screen reader optimized
 * - Google and LLM can read collapsed content
 */
export default function ExpandableContent({
    title,
    children,
    defaultExpanded = false,
    id
}: ExpandableContentProps) {
    const [isExpanded, setIsExpanded] = useState(defaultExpanded);

    const contentId = id || `expandable-${title.toLowerCase().replace(/\s+/g, '-')}`;

    return (
        <div className="border border-gray-200 rounded-lg overflow-hidden mb-4">
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                aria-expanded={isExpanded}
                aria-controls={contentId}
                className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors text-left"
            >
                <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
                <span className="ml-4 flex-shrink-0">
                    {isExpanded ? (
                        <ChevronUp className="w-5 h-5 text-gray-600" />
                    ) : (
                        <ChevronDown className="w-5 h-5 text-gray-600" />
                    )}
                </span>
            </button>

            {/* Content is ALWAYS rendered in DOM, just visually hidden when collapsed */}
            {/* This ensures Google and LLMs can always read the content */}
            <div
                id={contentId}
                className={`
          overflow-hidden transition-all duration-300 ease-in-out
          ${isExpanded ? 'max-h-[5000px] opacity-100' : 'max-h-0 opacity-0'}
        `}
                style={{
                    // Content remains in DOM for SEO/LLM but is visually hidden
                    visibility: isExpanded ? 'visible' : 'hidden',
                }}
            >
                <div className="p-4 bg-white prose prose-sm max-w-none">
                    {children}
                </div>
            </div>

            {/* Screen reader only content - always accessible */}
            <div className="sr-only" aria-live="polite">
                {children}
            </div>
        </div>
    );
}
