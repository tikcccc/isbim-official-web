import type { LegalPageData } from "@/components/legal/legal-page-template";
import { Link } from "@/lib/i18n";

export function getPrivacyCookiePolicyData(_locale: "en" | "zh"): LegalPageData {
  void _locale;

  return {
    pageTitle: "Privacy & Cookie Policy",
    lastUpdated: "Last updated: December 2025",
    intro: "Review our privacy, cookie, and site terms in the sections below.",
    sections: [
      {
        title: "Terms and Conditions",
        content: (
          <p>
            isbim Limited ("We") reserve our rights to amend these terms and
            conditions from time to time. Every time you wish to use our Site,
            please check these terms and conditions to ensure you understand the
            terms and conditions that are currently applicable. By using our
            Website, you confirm that you accept these terms and conditions and
            that you agree to comply with them.
          </p>
        ),
      },
      {
        title: "Disclaimer",
        content: (
          <>
            <p className="mb-4">
              The information contained in this Website is only provided for
              reference. We do not warrant or represent the accuracy,
              completeness of such information or that it is up to date.
              Further, we do not guarantee the security of any communication via
              this Website. We shall not be responsible for any delay, loss,
              diversion, alteration, corruption or non-delivery of any
              communication sent to or received from or via this Website. We
              disclaim to the maximum extent permissible by law all warranties
              of any kind. Any reliance on our information or this Website shall
              be at your own risk.
            </p>
            <p className="mb-4">
              Without prejudice to the generality of the foregoing, we also
              disclaim any responsibility for the security, accuracy, contents,
              availability or omission of information found on sites that link
              to or from this Website. The contents, accuracy, opinions
              expressed, and other links provided at these sites are not
              investigated, verified, monitored, or endorsed by us. It is your
              sole responsibility to make all enquiries and investigation before
              proceeding with any online or offline access or transaction with
              any of these entities.
            </p>
            <p>
              We do not guarantee that our Website will be secured or free from
              bugs or viruses. Please take notice that isbim Limited and our
              affiliates do not maintain other Websites of similar names. If you
              receive suspicious emails from domains other than those officially
              associated with us, you should call and verify with us at{" "}
              <a href="tel:+85223828380" className="cookies-email-link">
                +852 2382 8380
              </a>
              .
            </p>
          </>
        ),
      },
      {
        title: "Your Liability",
        content: (
          <p>
            You are responsible for configuring your information technology,
            computer programmes and platform to access our Site. You should use
            your own virus protection software. You must not misuse our Site by
            introducing viruses or other materials that could be malicious or
            technologically harmful. You shall be fully liable to us and to
            other users of this Website for any erosion of data, malfunction or
            interruption of systems and network caused by your access to or use
            of this Website. Under such circumstances, your right to use our
            Site will cease immediately.
          </p>
        ),
      },
      {
        title: "Ownership and Use of Materials",
        content: (
          <>
            <p className="mb-4">
              We are the owner or the licensee of all intellectual property
              rights of our Website, and all the materials herein are protected
              by copyright laws and such rights are reserved. isbim Limited and
              our logo are registered trademarks of isbim Limited and you are
              not permitted to use them without our prior approval. You may only
              print off, copy or download extracts, of any page(s) from our
              Website for your personal use only. You must not use any part of
              the content on our Website for commercial purposes without first
              obtaining a license to do so from us or our licensors.
            </p>
            <p>
              You must not modify the paper or digital copies of any materials
              you have printed off, copy or downloaded from our Website in any
              way. If you print off, copy or download any part of our Website in
              breach of these terms and conditions, your right to use our
              Website will cease immediately and you must, at our discretion and
              request, return or destroy any copies of the materials you have
              made.
            </p>
          </>
        ),
      },
      {
        title: "Governing Law",
        content: (
          <p>
            These Terms and Conditions shall be governed by the laws of the Hong
            Kong Special Administration Region of the People's Republic of China
            ("Hong Kong") and you agree to submit to the non-exclusive
            jurisdiction of the Hong Kong courts in the event of disputes
            arising out of or in relation to these terms and conditions.
          </p>
        ),
      },
      {
        title: "Queries",
        content: (
          <p>
            Any question regarding these Terms and Conditions shall be directed
            to{" "}
            <Link
              href="mailto:solution@isbim.com.hk"
              className="cookies-email-link"
            >
              solution@isbim.com.hk
            </Link>
            .
          </p>
        ),
      },
    ],
  };
}
