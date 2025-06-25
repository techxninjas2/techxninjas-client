import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Shield, Eye, Lock, Database, Mail, Phone } from 'lucide-react';
import usePageTitle from '../usePageTitle';

const PrivacyPolicyPage: React.FC = () => {
  usePageTitle("Privacy Policy");

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-brand-dark-gray">
      <div className="container mx-auto px-4 py-8">
        <Link
          to="/"
          className="inline-flex items-center text-brand-primary hover:text-brand-ninja-gold mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Home
        </Link>

        <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 mb-8">
          <div className="flex items-center justify-between bg-gradient-to-r from-brand-primary to-brand-ninja-gold text-white rounded-lg p-6">
            <p className="text-lg font-semibold leading-relaxed">
              Every human or organisation has three levels of openness: Public, Personal and Private. We do believe in your rights to privacy.
            </p>
            <Shield className="w-12 h-12 text-white opacity-80" />
          </div>
        </div>

        <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
          <div className="flex items-center mb-8">
            <Shield className="w-8 h-8 text-brand-primary mr-3" />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Privacy Policy</h1>
          </div>

          <div className="text-sm text-gray-600 dark:text-gray-400 mb-8">
            <p><strong>Last Updated:</strong> June 24, 2025</p>
            <p><strong>Effective Date:</strong> June 24, 2025</p>
          </div>

          <div className="prose prose-lg dark:prose-invert max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <Eye className="w-6 h-6 mr-2 text-brand-primary" />
                1. Introduction
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                Welcome to TechXNinjas ("we," "our," or "us"), a community dedicated to empowering students through technology, innovation, and opportunities. We are registered with the MSME Udyam Portal and verified by Microsoft for Startups. We are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our services, including participation in contests, events, and other student-focused initiatives.
              </p>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mt-4">
                By accessing or using TechXNinjas, you agree to the collection and use of information in accordance with this Privacy Policy. If you do not agree with our policies and practices, please do not use our services.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <Database className="w-6 h-6 mr-2 text-brand-primary" />
                2. Information We Collect
              </h2>
              
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">2.1 Personal Information</h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                We may collect personal information that you voluntarily provide to us when you:
              </p>
              <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 mb-4 space-y-2">
                <li>Register for an account</li>
                <li>Subscribe to our newsletter</li>
                <li>Participate in events, competitions, quizzes, hackathons, or workshops</li>
                <li>Contact us through our support channels</li>
                <li>Complete your user profile</li>
                <li>Submit responses to assessments or forms for events or opportunities</li>
              </ul>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                This may include your full name, email address, phone number, profile picture, date of birth, gender, educational institution, and other details relevant to your participation.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">2.2 Information Collected Automatically</h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                When you visit our website, we automatically collect certain information, including:
              </p>
              <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 mb-4 space-y-2">
                <li>IP address and location data</li>
                <li>Browser type and version</li>
                <li>Device information (e.g., operating system, device ID)</li>
                <li>Pages visited and time spent</li>
                <li>Referring website</li>
                <li>Cookies and similar tracking technologies</li>
                <li>Interaction data, such as clicks and browsing behavior</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">2.3 Third-Party Information</h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                We may receive information about you from third parties, such as social media platforms (e.g., Google, LinkedIn) when you choose to log in using social authentication or connect your profile. This information is processed in accordance with this Privacy Policy.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <Lock className="w-6 h-6 mr-2 text-brand-primary" />
                3. How We Use Your Information
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                We use the information we collect for various purposes, including:
              </p>
              <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2">
                <li>Providing and maintaining our services, including event and contest management</li>
                <li>Processing registrations and managing user accounts</li>
                <li>Sending important notifications about events, contests, and updates</li>
                <li>Personalizing your experience on our platform</li>
                <li>Analyzing usage patterns to improve our services</li>
                <li>Preventing fraud and ensuring security</li>
                <li>Complying with legal obligations</li>
                <li>Marketing and promotional communications (with your consent)</li>
                <li>Facilitating connections between participants and event organizers or sponsors</li>
                <li>Providing tailored opportunities, such as internships or scholarships</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">4. Information Sharing and Disclosure</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                TechXNinjas will not sell, trade, or rent your personally identifiable information to anyone. We may share your personal information with third parties only in the following circumstances:
              </p>
              
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">4.1 With Your Consent</h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                We may share your information when you have explicitly consented to such sharing.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">4.2 To Provide Requested Services</h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                We may share your information as necessary to provide the product or service you have requested, such as sharing your details with event organizers or sponsors for opportunities you registered for (e.g., contests, hackathons).
              </p>

              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">4.3 Service Providers</h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                We may share your information with trusted third-party service providers who assist us in operating our website and delivering our services, including:
              </p>
              <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 mb-4 space-y-2">
                <li>Cloud hosting services (e.g., Supabase)</li>
                <li>Email service providers</li>
                <li>Analytics providers</li>
                <li>Payment processors</li>
              </ul>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                These partners are contractually obligated to use your information solely for the specified purposes and have no independent right to use it otherwise, unless explicitly stated.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">4.4 Legal and Regulatory Requirements</h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                We may disclose your information when required by law, in response to requests from any Indian or foreign government, security, defense, revenue, regulatory, or other authority, agency, or officer, or to comply with subpoenas, court orders, or legal processes.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">4.5 Protection of Rights and Safety</h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                We may share your information to protect our rights, property, or safety, or that of our users or others, including when we find that your actions on our websites violate the TechXNinjas terms of service or usage guidelines for specific products or services.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">4.6 Business Transfers</h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                In the event of a merger, acquisition, or sale of assets, your information may be transferred as part of that transaction, subject to appropriate safeguards.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">5. Data Security</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. These measures include:
              </p>
              <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2">
                <li>Encryption of data in transit and at rest</li>
                <li>Regular security assessments and updates</li>
                <li>Access controls and authentication measures</li>
                <li>Volunteer training on data protection</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">6. Your Rights and Choices</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                Depending on your location, you may have certain rights regarding your personal information, including:
              </p>
              <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2">
                <li><strong>Access:</strong> Request access to your personal information</li>
                <li><strong>Correction:</strong> Request correction of inaccurate information</li>
                <li><strong>Deletion:</strong> Request deletion of your personal information</li>
                <li><strong>Portability:</strong> Request a copy of your data in a portable format</li>
                <li><strong>Opt-out:</strong> Unsubscribe from marketing communications</li>
                <li><strong>Restriction:</strong> Request restriction of processing</li>
                <li><strong>Objection:</strong> Object to processing for direct marketing or other purposes</li>
              </ul>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mt-4">
                To exercise these rights, contact us at <a href="mailto:support@techxninjas.com" className="text-brand-primary hover:text-brand-ninja-gold transition-colors">support@techxninjas.com</a>. We may rely on exemptions under applicable laws (e.g., GDPR or Data Protection Act 2018) if fulfilling your request would infringe on others' rights or legal obligations.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">7. Cookies and Tracking Technologies</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                We use cookies and similar tracking technologies to enhance your experience on our website, such as maintaining session IDs and analyzing usage patterns. You can control cookie settings through your browser preferences, but disabling cookies may affect the functionality of our services. Third-party advertisers on our site may also use cookies, subject to their own privacy policies.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">8. Children's Privacy</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                Our services are not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13. If you are a parent or guardian and believe your child has provided us with personal information, please contact us at <a href="mailto:support@techxninjas.com" className="text-brand-primary hover:text-brand-ninja-gold transition-colors">support@techxninjas.com</a>.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">9. International Data Transfers</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                Your information may be transferred to and processed in countries other than your own, such as India, where our servers or service providers are located. We ensure appropriate safeguards, such as standard contractual clauses, are in place to protect your information in accordance with this Privacy Policy.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">10. Data Retention</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                We retain your personal information for as long as your account is active or as needed to provide you with our services. After account closure or inactivity for five (5) years, we retain data for an additional five (5) years to comply with legal obligations or resolve disputes. For marketing purposes, we process data until you opt out, maintaining a record to respect your preferences.
              </p>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                Event-specific data (e.g., quiz responses) shared with organizers is retained for three (3) years, archived after one (1) year, or deleted upon request, whichever is earlier.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">11. Account Deletion</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                If you wish to delete your account, please email us at <a href="mailto:support@techxninjas.com" className="text-brand-primary hover:text-brand-ninja-gold transition-colors">support@techxninjas.com</a> from your registered email address. We will process your request within a reasonable timeframe, subject to legal or contractual obligations to retain certain data.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">12. Participant Data Shared with Organizers</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                When participating in events or opportunities, you may share additional information directly with event organizers (e.g., resumes, project submissions). TechXNinjas is not responsible for the use, misuse, or treatment of such information by organizers, as it is shared directly by you. We encourage you to review the organizers' privacy policies before sharing sensitive information.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">13. Changes to This Privacy Policy</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date. Significant changes will be communicated via email or prominent notices on our website. We encourage you to review this Privacy Policy periodically.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <Mail className="w-6 h-6 mr-2 text-brand-primary" />
                14. Contact Us
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                If you have any questions about this Privacy Policy or our data practices, please contact us:
              </p>
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <div className="flex items-center mb-2">
                  <Mail className="w-5 h-5 mr-2 text-brand-primary" />
                  <a
                    href="mailto:support@techxninjas.com"
                    className="text-brand-primary hover:text-brand-ninja-gold transition-colors"
                  >
                    support@techxninjas.com
                  </a>
                </div>
                <div className="flex items-center">
                  <Phone className="w-5 h-5 mr-2 text-brand-primary" />
                  <span className="text-gray-700 dark:text-gray-300">Phone: +91 91229 85472</span>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;