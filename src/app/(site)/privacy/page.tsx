import { site } from "@/content/site";

export default function PrivacyPage() {
  return (
    <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-heading font-bold text-ink">Privacy Policy</h1>
        <p className="mt-4 text-sm text-stone">Last updated: August 2026</p>

        <section className="mt-10 space-y-6 text-body text-stone leading-relaxed">
          <p>
            Compass is a product operated by Red Derby Ventures LLC, a Maryland limited liability company (&ldquo;Red Derby Ventures,&rdquo; &ldquo;Compass,&rdquo; &ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;). This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or use the Compass platform and related services (the &ldquo;Services&rdquo;).
          </p>

          <h2 className="text-subhead font-semibold text-ink mt-8">1. Information We Collect</h2>

          <h3 className="text-body font-semibold text-ink mt-6">Information You Provide</h3>
          <p>
            We collect information you provide directly to us, including your name, email address, company name, role, and other details when you complete an assessment, submit a design partner application, or otherwise communicate with us through the Services.
          </p>
          <p>
            We also collect the content of your investigation responses, recommendations generated for you, and any other information you submit while using the Services.
          </p>

          <h3 className="text-body font-semibold text-ink mt-6">Information Collected Automatically</h3>
          <p>
            When you access or use the Services, we may automatically collect certain information, including your IP address, browser type, device information, referring pages, pages visited, time spent on pages, and other usage data. We may use analytics tools, including PostHog, to collect and analyze this information.
          </p>

          <h3 className="text-body font-semibold text-ink mt-6">Cookies and Similar Technologies</h3>
          <p>
            We may use cookies and similar tracking technologies to operate the Services, remember your preferences, understand usage, and improve the platform. You can configure your browser to refuse cookies, though some features of the Services may not function properly without them.
          </p>

          <h2 className="text-subhead font-semibold text-ink mt-8">2. How We Use Your Information</h2>
          <p>We use the information we collect to:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Generate assessments, recommendations, and other outputs based on the information you provide</li>
            <li>Provide, maintain, and improve the Services</li>
            <li>Communicate with you about the Services, including the Design Partner Program</li>
            <li>Analyze usage patterns to enhance the platform and user experience</li>
            <li>Develop and improve our underlying methodologies, evidence base, and recommendation capabilities</li>
            <li>Protect the security and integrity of the Services</li>
            <li>Comply with legal obligations</li>
          </ul>

          <h2 className="text-subhead font-semibold text-ink mt-8">3. How We Share Your Information</h2>
          <p>
            We do not sell your personal information. We may share information in the following circumstances:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>With third-party service providers who perform services on our behalf, including hosting (Railway), analytics (PostHog), and infrastructure providers. These providers are obligated to use your information only to perform tasks on our behalf and in accordance with this policy.</li>
            <li>If you use Compass on behalf of an organization, we may share investigation results and related information with that organization as described in a separate agreement.</li>
            <li>If required by law, legal process, or to protect the rights, property, or safety of Red Derby Ventures LLC, our users, or others.</li>
            <li>In connection with a merger, acquisition, financing, or sale of assets, in which case your information may be transferred as a business asset.</li>
          </ul>

          <h2 className="text-subhead font-semibold text-ink mt-8">4. Data Storage and Security</h2>
          <p>
            We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of electronic storage or transmission is completely secure, and we cannot guarantee absolute security.
          </p>
          <p>
            Your information may be stored and processed in the United States or other countries where our service providers operate. By using the Services, you consent to this transfer.
          </p>

          <h2 className="text-subhead font-semibold text-ink mt-8">5. Data Retention</h2>
          <p>
            We retain your personal information and investigation data for as long as necessary to provide the Services and for the purposes described in this policy. You may request deletion of your information by contacting us at {site.contact.email}. We will comply with deletion requests subject to legal obligations and legitimate business interests that require retention.
          </p>

          <h2 className="text-subhead font-semibold text-ink mt-8">6. Your Rights</h2>
          <p>
            You have the right to access, correct, or delete your personal information. You may also withdraw consent for data processing at any time, subject to legal or contractual restrictions. To exercise these rights, contact us at {site.contact.email}.
          </p>
          <p>
            If you use Compass on behalf of an organization, additional rights or obligations may apply under a separate agreement with Red Derby Ventures LLC.
          </p>

          <h2 className="text-subhead font-semibold text-ink mt-8">7. Children&apos;s Privacy</h2>
          <p>
            The Services are not intended for individuals under the age of 18. We do not knowingly collect personal information from children. If we learn that we have collected personal information from a child, we will delete it.
          </p>

          <h2 className="text-subhead font-semibold text-ink mt-8">8. Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. If we make material changes, we will provide reasonable notice, which may include notice through the Services, on our website, or by email. Your continued use of the Services after updated terms become effective constitutes acceptance of the updated policy.
          </p>

          <h2 className="text-subhead font-semibold text-ink mt-8">9. Governing Law</h2>
          <p>
            This Privacy Policy and any dispute arising out of or relating to it are governed by the laws of the State of Maryland, without regard to its conflict-of-laws principles.
          </p>

          <h2 className="text-subhead font-semibold text-ink mt-8">10. Contact</h2>
          <p>If you have questions about this Privacy Policy, please contact us:</p>
          <p>
            Red Derby Ventures LLC<br />
            Compass<br />
            Email: {site.contact.email}
          </p>
        </section>
      </div>
    </div>
  );
}
