import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, FileText, Scale, AlertTriangle, Shield, Users, Gavel } from 'lucide-react';
import usePageTitle from '../usePageTitle';

const TermsOfServicePage: React.FC = () => {
  usePageTitle("Terms of Service");

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

        <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
          <div className="flex items-center mb-8">
            <FileText className="w-8 h-8 text-brand-primary mr-3" />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Terms of Service</h1>
          </div>

          <div className="text-sm text-gray-600 dark:text-gray-400 mb-8">
            <p><strong>Last Updated:</strong> January 20, 2025</p>
            <p><strong>Effective Date:</strong> January 20, 2025</p>
          </div>

          <div className="prose prose-lg dark:prose-invert max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <Scale className="w-6 h-6 mr-2 text-brand-primary" />
                1. Acceptance of Terms
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                Welcome to TechXNinjas! These Terms of Service ("Terms") govern your use of our website, services, and platform (collectively, the "Service") operated by TechXNinjas ("we," "us," or "our"). By accessing or using our Service, you agree to be bound by these Terms. If you disagree with any part of these terms, you may not access the Service. You can accept the Terms by clicking to accept or agree where this option is made available in the user interface or by actually using the Services. Your use of the Services constitutes acceptance of these Terms from that point onwards.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <Users className="w-6 h-6 mr-2 text-brand-primary" />
                2. Description of Service
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                TechXNinjas is a platform that provides:
              </p>
              <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2">
                <li>Information about hackathons, tech events, and competitions</li>
                <li>Educational content and articles about technology</li>
                <li>Community features for tech enthusiasts</li>
                <li>User profiles and networking opportunities</li>
                <li>Event registration and participation services</li>
                <li>Learning resources and courses</li>
                <li>Opportunities for internships, jobs, and mentorships</li>
                <li>Assessments, coding challenges, and practice resources</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">3. User Accounts</h2>
              
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">3.1 Account Creation</h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                To access certain features of our Service, you must create an account by completing the registration process, providing current, complete, and accurate information as prompted by the applicable registration form. You will choose a username (your email ID) and password. You agree to update such information to keep it accurate, current, and complete.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">3.2 Account Security</h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                You are responsible for safeguarding your account credentials and for all activities that occur under your account. You agree to notify us immediately of any unauthorized use of your account at <a href="mailto:support@techxninjas.com" className="text-brand-primary hover:underline">support@techxninjas.com</a>. TechXNinjas will not be liable for any loss you may incur as a result of someone else using your password or account. However, you could be held liable for losses incurred by TechXNinjas or another party due to someone else using your account or password.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">3.3 Account Restrictions</h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                We do not permit sharing your account and password with others, caching any part of the Service in proxy servers for access by unregistered users, or making a single account and password available to multiple users on a network. If TechXNinjas reasonably believes an account is being misused, we reserve the right to cancel access rights immediately without notice and block access to all users from that IP address.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">3.4 Account Termination</h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                We reserve the right to suspend or terminate your account at any time for violations of these Terms or for any other reason at our sole discretion.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <AlertTriangle className="w-6 h-6 mr-2 text-brand-primary" />
                4. Acceptable Use Policy
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                You agree not to use the Service to:
              </p>
              <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2">
                <li>Violate any applicable laws or regulations</li>
                <li>Infringe upon the rights of others</li>
                <li>Upload or transmit harmful, offensive, or inappropriate content</li>
                <li>Engage in spam, phishing, or other fraudulent activities</li>
                <li>Attempt to gain unauthorized access to our systems</li>
                <li>Interfere with or disrupt the Service</li>
                <li>Use automated tools to access the Service without permission</li>
                <li>Impersonate others or provide false information</li>
                <li>Engage in harassment, bullying, or discriminatory behavior</li>
                <li>Defame, abuse, stalk, threaten, or otherwise violate the legal rights of others</li>
                <li>Publish, post, upload, distribute, or disseminate any inappropriate, profane, defamatory, obscene, indecent, or unlawful material</li>
                <li>Upload files containing software or material protected by intellectual property laws unless you own or control the rights or have received necessary consents</li>
                <li>Upload or distribute files containing viruses, corrupted files, or similar software that may damage the operation of the Service or another's computer</li>
                <li>Conduct or forward surveys, contests, pyramid schemes, or chain letters</li>
                <li>Falsify or delete any author attributions, legal notices, or proprietary designations</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">5. User Content</h2>
              
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">5.1 Content Ownership</h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                You retain ownership of any content you submit, post, or display on the Service ("User Content"). By submitting User Content, you grant TechXNinjas a worldwide, non-exclusive, royalty-free license to use, reproduce, modify, and distribute such content in connection with the Service. You warrant that you are the owner of the content or are authorized to use it and that it does not infringe upon the property or intellectual property rights of others.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">5.2 Content Standards</h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                All User Content must comply with our community guidelines and must not:
              </p>
              <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2">
                <li>Contain false, misleading, or defamatory information</li>
                <li>Violate intellectual property rights</li>
                <li>Include personal information of others without consent</li>
                <li>Contain malicious code or viruses</li>
                <li>Promote illegal activities or violence</li>
                <li>Be obscene, vulgar, sexually-oriented, hateful, or threatening</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">5.3 Content Moderation</h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                We reserve the right to review, modify, or remove User Content that violates these Terms or our community guidelines. TechXNinjas does not verify, endorse, or vouch for the contents of any user-uploaded material.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <Shield className="w-6 h-6 mr-2 text-brand-primary" />
                6. Intellectual Property Rights
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                The Service and its original content, features, and functionality are and will remain the exclusive property of TechXNinjas and its licensors. The Service is protected by copyright, trademark, and other laws. Our trademarks and trade dress may not be used without our prior written consent.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">7. Privacy Policy</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                Your privacy is important to us. By using the Service, you consent to the terms of our Privacy Policy, which governs the collection and use of your information. Please review our Privacy Policy to understand our practices.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">8. Events and Competitions</h2>
              
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">8.1 Event Participation</h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                Participation in events, hackathons, and competitions listed on our platform may be subject to additional terms and conditions set by the event organizers.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">8.2 Registration Accuracy</h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                You agree to provide accurate information when registering for events and to comply with all event rules and requirements.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">8.3 Event Changes</h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                Event details, including dates, venues, and requirements, may change. We are not responsible for changes made by event organizers.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">9. Disclaimers and Limitation of Liability</h2>
              
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">9.1 Service Availability</h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                The Service is provided "as is" and "as available" without warranties of any kind. We do not guarantee that the Service will be uninterrupted, secure, or error-free. TechXNinjas does not warrant the accuracy or completeness of any data, information, product, or Service.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">9.2 Third-Party Content</h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                We are not responsible for the accuracy, completeness, or reliability of third-party content, including event information provided by advertisers or organizers. Your dealings with advertisers, including payment and delivery of goods or services, are solely between you and such advertisers.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">9.3 Limitation of Liability</h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                To the maximum extent permitted by law, TechXNinjas shall not be liable for any indirect, incidental, damages arising from your use of the Service, unauthorized access to or alteration of your data, or any other matter related to the Service, including loss of use, data, or profits.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">10. Indemnification</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                You agree to defend, indemnify, and hold harmless TechXNinjas and its affiliates from and against any claims, damages, obligations, losses, liabilities, costs, or debt (including legal fees) arising from your use of the Service, violation of these Terms, or any activities that occur through your account.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">11. Termination</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                We may terminate or suspend your access to the Service immediately, without prior notice or liability, for any reason, including breach of these Terms or if the provision of the Service is no longer commercially viable. You may terminate your agreement with TechXNinjas by notifying us in writing at <a href="mailto:support@techxninjas.com" className="text-brand-primary hover:underline">support@techxninjas.com</a> and closing your account. Upon termination, your right to use the Service will cease immediately.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <Gavel className="w-6 h-6 mr-2 text-brand-primary" />
                12. Governing Law and Dispute Resolution
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                These Terms shall be governed by and construed in accordance with the laws of India. Any disputes arising under these Terms shall be subject to the exclusive jurisdiction of the courts in Bangalore, India.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">13. Changes to Terms</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                We reserve the right to modify or replace these Terms at any time. If a revision is material, we will try to provide at least 30 days notice prior to any new terms taking effect. Your continued use of the Service after such changes constitutes acceptance of these Terms. You are responsible for checking these Terms periodically to remain in compliance.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">14. Severability</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                If any provision of these Terms is held to be unenforceable or invalid, such provision will be changed and interpreted to accomplish the objectives of such provision to the greatest extent possible under applicable law, and the remaining provisions will be in full force and effect.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">15. Fees and Payments</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                TechXNinjas reserves the right to charge listing, product usage, as well as transaction fees for certain completed transactions using the Services. We may alter these fees at anytime without notice. You are responsible for liable to pay all applicable charges, fees, taxes, duties, and levies for availing the Services.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">16. Delivery of Services</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                All our services are delivered online. No physical delivery will be available. Upon purchasing a service, you will receive an email with instructions on how to use the service on the available website. Our team will assist you with providing a seamless user experience.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">17. Cancellation and Refund Policy</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                All purchases of services are final with no refund or exchange permitted. If money has been charged to your account without the delivery of the service, you may notify us at <a href="mailto:support@techxninjas.com" className="text-brand-primary hover:underline">support@techxninjas.com</a>. We will investigate, and if confirmed, the money will be refunded within 30 working days from the date of receipt of your email, after deducting applicable service charges and taxes. Refunds will be credited back to the original payment source, with processing times of 3-30 days depending on your bank’s policy.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">18. Forum Rules</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                Registration to any forums under TechXNinjas is free. You agree to abide by our forum rules and policies. You warrant not to post any content that is obscene, vulgar, offensive, hateful, or illegal. We do not verify the content of any messages posted by users, and are not responsible for such content. TechXNinjas reserves the right to remove, edit, or close any content for any reason.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">19. Report Abuse</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                Users are solely responsible for the content they upload to the Service. TechXNinjas does not verify or endorse user content. If you encounter any abuse or violation of these Terms, please report it to <a href="mailto:support@techxninjas.com" className="text-brand-primary hover:underline">support@techxninjas.com</a>.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">20. Contact Information</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                If you have any questions about these Terms of Service, please contact us:
              </p>
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <div className="space-y-2">
                  <p className="text-gray-700 dark:text-gray-300"><strong>Email:</strong> <a href="mailto:support@techxninjas.com" className="text-brand-primary hover:underline">support@techxninjas.com</a></p>
                  <p className="text-gray-700 dark:text-gray-300"><strong>Phone:</strong> +91 91229 85472</p>
                  <p className="text-gray-700 dark:text-gray-300"><strong>Address:</strong> Motihari, Bihar, India</p>
                </div>
              </div>
            </section>

            <div className="bg-blue-50 dark:bg-blue-900 border border-blue-200 dark:border-blue-700 rounded-lg p-4 mt-8">
              <p className="text-blue-800 dark:text-blue-200 text-sm">
                <strong>Note:</strong> By using TechXNinjas, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service and our Privacy Policy.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsOfServicePage;