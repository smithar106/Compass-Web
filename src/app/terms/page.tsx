export default function TermsPage() {
  return (
    <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-heading font-bold text-ink">Terms of Service</h1>
        <p className="mt-4 text-sm text-stone">Last updated: July 2026</p>

        <section className="mt-10 space-y-6 text-body text-stone leading-relaxed">
          <p>
            By accessing or using the Compass AI website and services, you agree to be bound by these Terms of Service. If you do not agree, please do not use our services.
          </p>

          <h2 className="text-subhead font-semibold text-ink mt-8">1. Description of Service</h2>
          <p>
            Compass AI provides an AI-powered opportunity-discovery platform for B2B SaaS companies. Our assessment tool generates AI Opportunity Maps based on user-provided information. The results are recommendations and should be evaluated alongside professional judgment.
          </p>

          <h2 className="text-subhead font-semibold text-ink mt-8">2. User Responsibilities</h2>
          <p>You agree to:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Provide accurate and complete information in your assessment</li>
            <li>Use the service in compliance with all applicable laws and regulations</li>
            <li>Not attempt to disrupt, overload, or compromise our systems</li>
            <li>Not use the service for any unlawful or unauthorized purpose</li>
          </ul>

          <h2 className="text-subhead font-semibold text-ink mt-8">3. Intellectual Property</h2>
          <p>
            The Compass AI platform, including its design, code, algorithms, and generated content (excluding your input data), is our intellectual property. You may not copy, modify, distribute, or create derivative works without our express permission.
          </p>
          <p>
            Your assessment responses and their generated results remain your property. We claim no ownership over the information you provide.
          </p>

          <h2 className="text-subhead font-semibold text-ink mt-8">4. Limitation of Liability</h2>
          <p>
            Compass AI provides recommendations and insights based on the information you provide. We do not guarantee specific outcomes or results. Our services are provided "as is" without warranties of any kind, either express or implied.
          </p>
          <p>
            We are not liable for any indirect, incidental, or consequential damages arising from your use of our services, including business decisions made based on AI Opportunity Map results.
          </p>

          <h2 className="text-subhead font-semibold text-ink mt-8">5. Design Partner Program</h2>
          <p>
            Design partners agree to provide feedback and participate in product discussions. Participation in the design partner program does not guarantee continued free access or any equity or compensation.
          </p>
          <p>
            We reserve the right to modify or terminate the design partner program at any time.
          </p>

          <h2 className="text-subhead font-semibold text-ink mt-8">6. Termination</h2>
          <p>
            We reserve the right to suspend or terminate access to our services at any time, with or without cause. Upon termination, your right to use the service will immediately cease.
          </p>

          <h2 className="text-subhead font-semibold text-ink mt-8">7. Changes to Terms</h2>
          <p>
            We may modify these terms at any time. Continued use of the service after changes constitutes acceptance of the new terms. We will notify users of material changes via email or website notice.
          </p>

          <h2 className="text-subhead font-semibold text-ink mt-8">8. Governing Law</h2>
          <p>
            These terms are governed by the laws of the State of Delaware. Any disputes shall be resolved in the courts of Delaware.
          </p>

          <h2 className="text-subhead font-semibold text-ink mt-8">9. Contact</h2>
          <p>
            For questions about these terms, contact us at legal@compass-ai.com.
          </p>
        </section>
      </div>
    </div>
  );
}
