export default function PrivacyPage() {
  return (
    <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-heading font-bold text-ink">Privacy Policy</h1>
        <p className="mt-4 text-sm text-stone">Last updated: July 2026</p>

        <section className="mt-10 space-y-6 text-body text-stone leading-relaxed">
          <p>
            Compass AI ("Compass", "we", "us", "our") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or use our services.
          </p>

          <h2 className="text-subhead font-semibold text-ink mt-8">1. Information We Collect</h2>
          <p>
            We collect information you provide directly to us, including your name, email address, company name, and other details when you fill out our assessment or design partner application form.
          </p>
          <p>
            We also collect technical information automatically, such as your IP address, browser type, device information, and usage data through analytics tools including PostHog (when configured).
          </p>

          <h2 className="text-subhead font-semibold text-ink mt-8">2. How We Use Your Information</h2>
          <p>We use the information we collect to:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Generate your AI Opportunity Map based on your assessment responses</li>
            <li>Communicate with you about our services and design partner program</li>
            <li>Improve and develop our products and services</li>
            <li>Analyze usage patterns to enhance user experience</li>
            <li>Comply with legal obligations</li>
          </ul>

          <h2 className="text-subhead font-semibold text-ink mt-8">3. Data Storage and Security</h2>
          <p>
            We implement appropriate technical and organizational measures to protect your personal information. Your assessment data is stored securely and is not shared with third parties without your consent.
          </p>

          <h2 className="text-subhead font-semibold text-ink mt-8">4. Third-Party Services</h2>
          <p>
            We may use third-party services for analytics (PostHog), hosting (Railway), and infrastructure. These service providers have access to your information only to perform tasks on our behalf and are obligated not to disclose or use it for any other purpose.
          </p>

          <h2 className="text-subhead font-semibold text-ink mt-8">5. Your Rights</h2>
          <p>
            You have the right to access, correct, or delete your personal information. You may also withdraw consent for data processing at any time. To exercise these rights, contact us at privacy@compass-ai.com.
          </p>

          <h2 className="text-subhead font-semibold text-ink mt-8">6. Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page with an updated date.
          </p>

          <h2 className="text-subhead font-semibold text-ink mt-8">7. Contact</h2>
          <p>
            If you have questions about this Privacy Policy, please contact us at privacy@compass-ai.com.
          </p>
        </section>
      </div>
    </div>
  );
}
