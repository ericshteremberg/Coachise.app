
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function TermsOfService() {
  const [isExpanded, setIsExpanded] = useState(false);

  const termsText = `Coachise – Terms of Service
Effective Date: [07/06/2025]

Welcome to Coachise, a networking platform that connects athletes and coaches to facilitate training, collaboration, and personal development. By using Coachise (the “Service”), you agree to the following Terms of Service (the “Terms”). Please read them carefully.


3. Purpose of the Platform
Coachise is designed to serve as a secure and structured networking tool that enables athletes and coaches to connect, communicate, and coordinate in-person training relationships. The platform allows users to browse profiles, send messages, and schedule introductions based on shared goals, experience, and location.

Coachise does not host, manage, or deliver any training sessions. Our role is limited to connecting parties who may choose to meet and train in person. All training sessions, agreements, and safety precautions are the responsibility of the individuals involved.


1. Eligibility
Coachise is open to users of all ages. However, if you are under 18, you may only use the platform with the consent and supervision of a parent or legal guardian.

By registering, you confirm that either (a) you are 18 years of age or older, or (b) you have received verifiable permission from your parent or legal guardian. We reserve the right to request proof of age and consent at any time.


2. Minors Offering Coaching Services
Minors (individuals under the age of 18) may offer coaching services on Coachise only with the express permission of a parent or legal guardian. By using the platform as a coach, users under 18 confirm that:
They have obtained documented consent from a parent or legal guardian.


Their participation complies with all applicable local, state, and federal labor laws.


A parent or legal guardian is responsible for overseeing any coaching activities, communications, and potential liabilities arising from their services.


Coachise does not verify work eligibility, labor law compliance, or parental consent for minor users. All responsibility for ensuring that underage users are legally permitted to coach lies with the user and their parent or guardian.
Minors may not enter into binding legal agreements, waivers, or payment arrangements without adult supervision. Coachise is not responsible for managing payment processing for minors and may require that payments be handled by a parent or guardian on behalf of the underage coach.

Coachise reserves the right to restrict, suspend, or remove any coaching account if it appears that these conditions are not being met.


4. Payment and Fees
Coachise may charge platform or transaction fees for services facilitated through the platform. All payments for training services initiated through Coachise must be made through the platform. Users agree not to engage in, encourage, or solicit off-platform payments for sessions discovered via Coachise. Coachise is not liable for transactions or financial disputes conducted outside of our payment system.


5. User Conduct
By using Coachise, you agree not to:
Misrepresent your identity, qualifications, or affiliations
Harass, exploit, or endanger other users
Engage in fraudulent, unlawful, or deceptive behavior
Interfere with the platform’s security, payments, or operations
Violate any applicable local, national, or international laws

Coachise reserves the right to remove or ban any user who violates these standards.


6. Liability & Safety Disclaimer
You acknowledge that Coachise does not vet or guarantee the safety, skills, conduct, or legitimacy of users (athletes or coaches). Coachise is not liable for any injury, harm, accident, dispute, or damage—physical, emotional, or financial—that may arise from in-person training sessions, off-platform communications or meetups, or use or misuse of platform tools or content.

You use the Coachise platform and engage with other users entirely at your own risk. We strongly encourage minors to have adult supervision when participating in off-platform training activities.


7. Account Security
You are solely responsible for maintaining the confidentiality of your account credentials and for all activities conducted under your account. Notify Coachise immediately if you suspect unauthorized access or a security breach.


8. Termination
Coachise reserves the right to suspend or permanently terminate any account for violating these Terms, particularly those involving:
Abusive or unsafe conduct
Repeated complaints or verified policy violations
Circumvention of payment systems (see Section 9)

All terminations are at the sole discretion of Coachise.


9. Fee Circumvention Policy
To maintain the integrity of the platform and ensure fairness for all users, any attempt to bypass Coachise’s service fees by arranging off-platform sessions that originate through the platform is strictly prohibited.

Violations may result in temporary or permanent account suspension, removal from search or matchmaking visibility, or legal action if deemed necessary. We reserve the right to investigate and enforce this policy without prior notice.


10. Modifications to the Terms
We may update or revise these Terms periodically. Users will be notified of significant changes, and continued use of the Service after updates constitutes acceptance of the new Terms.


12. Intellectual Property
All content, trademarks, logos, software, and design elements displayed on or used by Coachise are the property of Coachise, its licensors, or authorized third parties, and are protected by copyright, trademark, and other applicable laws.

You may not reproduce, distribute, modify, or create derivative works from any portion of the platform without express written permission from Coachise.
Users retain ownership of any content they submit (such as bios or profile photos), but by submitting such content, you grant Coachise a non-exclusive, worldwide, royalty-free license to use, display, and distribute that content solely in connection with providing and promoting the Service.

Coachise™ is a common law trademark of [“Coachise”]. Unauthorized use of the name or branding is prohibited.


11. Contact
If you have questions, concerns, or need assistance, contact us at: support@coachise.com


Agreement
By using Coachise, you agree to these Terms of Service and understand that any violations may result in suspension, removal, or legal action.`;

  return (
    <Card className="bg-white border-gray-200 rounded-2xl shadow-sm mb-4">
      <CardHeader>
        <Button
          variant="ghost"
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full p-0 h-auto justify-between hover:bg-transparent"
        >
          <CardTitle className="text-base font-medium text-gray-900 underline">
            Terms of Service
          </CardTitle>
          {isExpanded ? (
            <ChevronUp className="w-4 h-4 text-gray-500" />
          ) : (
            <ChevronDown className="w-4 h-4 text-gray-500" />
          )}
        </Button>
      </CardHeader>
      
      {isExpanded && (
        <CardContent className="pt-0">
          <div className="max-h-96 overflow-y-auto pr-2">
            <div className="text-sm text-gray-700 leading-loose whitespace-pre-line">
              {termsText}
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  );
}
