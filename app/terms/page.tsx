import Link from "next/link";

export default function TermsOfUsePage() {
  return (
    <div className="min-h-screen bg-[#FAFAFA] text-[#121212]">
      <header className="sticky top-0 z-10 border-b border-[#E8E8E8] bg-white/95 px-4 py-4 backdrop-blur sm:px-6 md:px-8">
        <div className="mx-auto flex max-w-3xl items-center justify-between">
          <Link href="/" className="text-xl font-extrabold text-[#121212]">
            Tandermis
          </Link>
          <Link
            href="/auth/signup"
            className="text-sm font-semibold text-[#121212] sm:text-base"
          >
            Back to sign up
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6 md:px-8 md:py-12">
        <p className="text-sm text-[#6F6F6F]">Last modified: July 22, 2026</p>
        <h1 className="mt-2 text-2xl font-bold sm:text-3xl">
          Tandermis Terms of Use
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-[#4F4F4F] sm:text-base">
          By using, reproducing, modifying, or displaying any portion or element
          of the Tandermis Services (as defined below), or otherwise accepting
          these Tandermis Terms of Use (the &quot;Agreement&quot;), you agree to
          be bound by this Agreement.
        </p>

        <section className="mt-10 space-y-4 text-sm leading-relaxed text-[#4F4F4F] sm:text-base">
          <h2 className="text-lg font-semibold text-[#121212] sm:text-xl">
            Section 1: DEFINITIONS
          </h2>
          <h3 className="font-semibold text-[#121212]">1.1 Definitions</h3>
          <p>
            (a) &quot;Clinical Use&quot; means, any use in diagnosis or treatment
            of patients (including as part of a research study).
          </p>
          <p>
            (b) &quot;Tandermis&quot; means Tandermis Limited.
          </p>
          <p>
            (c) &quot;Tandermis Models&quot; or &quot;Models&quot; means the set
            of machine learning language models, trained model weights, and
            parameters identified at the tandermis website, regardless of the
            source that you obtained it from.
          </p>
          <p>
            (d) &quot;Tandermis Services&quot; means collectively our models or
            Model Derivatives, including as may be accessed or used via API, web
            access, a mobile or desktop app, or any other electronic or remote
            means (&quot;Hosted Service&quot;).
          </p>
          <p>
            (e) &quot;Health Regulatory Authority&quot; means any regulatory
            authority that oversees health-related products and services,
            including any national, supra national, regional, state, or local
            regulatory authority, department, bureau, commission, council, or
            other authority that is responsible for granting Health Regulatory
            Authorizations allowing distribution of products, or overseeing the
            development, use, manufacture, transport, storage, or
            commercialization of products and services for the diagnosis, cure,
            prevention, treatment, and/or mitigation of disorders, diseases, or
            conditions in humans.
          </p>
          <p>
            (f) &quot;Health Regulatory Authorization&quot; means, with respect
            to any country or jurisdiction, all approvals, registrations,
            licenses, or authorizations from the relevant Regulatory Authority
            in a country or jurisdiction for conducting research, Clinical Use,
            marketing and/or commercializing of a product or service in such
            country or jurisdiction.
          </p>
          <p>
            (g) &quot;Model Derivatives&quot; means (i) all modifications to
            Tandermis Models, (ii) all works based on Tandermis Models, or (iii)
            any other machine learning model which is created by transfer of
            patterns of the weights, parameters, operations, or Output of
            Tandermis Models, to that model in order to cause that model to
            perform similarly to Tandermis Models, including distillation methods
            that use intermediate data representations or methods based on the
            generation of synthetic data Outputs by Tandermis Models for training
            that model. Outputs are not deemed Model Derivatives.
          </p>
          <p>
            (h) &quot;Output&quot; means the information content output of
            Tandermis Models or a Model Derivative that results from operating or
            otherwise using Tandermis Models or the Model Derivative, including
            via a Hosted Service.
          </p>
          <h3 className="font-semibold text-[#121212]">1.2</h3>
          <p>
            In this Agreement, &quot;including&quot; means &quot;including but
            not limited to&quot;.
          </p>
        </section>

        <section className="mt-10 space-y-4 text-sm leading-relaxed text-[#4F4F4F] sm:text-base">
          <h2 className="text-lg font-semibold text-[#121212] sm:text-xl">
            Section 2: ELIGIBILITY AND USAGE
          </h2>
          <h3 className="font-semibold text-[#121212]">2.1 Eligibility</h3>
          <p>
            You represent and warrant that you have the legal capacity to enter
            into this Agreement (including being of sufficient age of consent).
            If you are accessing or using any of the Tandermis Services for or on
            behalf of a legal entity, (a) you are entering into this Agreement on
            behalf of yourself and that legal entity, (b) you represent and
            warrant that you have the authority to act on behalf of and bind that
            entity to this Agreement, and (c) references to &quot;you&quot; or
            &quot;your&quot; in the remainder of this Agreement refers to both
            you (as an individual) and that entity.
          </p>
          <h3 className="font-semibold text-[#121212]">2.2 Use</h3>
          <p>
            You may use or display any of the Tandermis Services only in
            accordance with the terms of this Agreement, and must not violate (or
            encourage or permit anyone else to violate) any term of this
            Agreement. Tandermis Models are Derivatives of Google Health AI
            Developer Foundations or HAI-DEF models, a set of machine learning
            language models, trained model weights, and parameters identified at{" "}
            <a
              href="https://developers.google.com/health-ai-developer-foundations"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-[#121212] underline"
            >
              developers.google.com/health-ai-developer-foundations
            </a>
            , and thus your use of our Models must be in accordance with their
            terms, available at{" "}
            <a
              href="https://developers.google.com/health-ai-developer-foundations/terms"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-[#121212] underline"
            >
              https://developers.google.com/health-ai-developer-foundations/terms
            </a>
            .
          </p>
          <p>
            Tandermis Models are AI and can make mistakes. Outputs generated by
            Tandermis Models are not meant to replace medical advice or counsel
            given by a medical practitioner. Rather, these Outputs must be vetted
            by a licensed medical practitioner. Aestheticians may use Tandermis
            Models to screen their clientele and refer those needing further
            expert management. You agree to use Outputs from Tandermis Models
            while bearing in mind the restrictions under section 3.2 Generated
            Output.
          </p>
        </section>

        <section className="mt-10 space-y-4 text-sm leading-relaxed text-[#4F4F4F] sm:text-base">
          <h2 className="text-lg font-semibold text-[#121212] sm:text-xl">
            Section 3: RESTRICTIONS
          </h2>
          <h3 className="font-semibold text-[#121212]">3.1 Use Restrictions</h3>
          <p>You must not use any of the Tandermis Services:</p>
          <ul className="list-disc space-y-2 pl-5">
            <li>
              for any use that could cause a Health Regulatory Authority to deem
              Tandermis to be a &quot;manufacturer&quot; of a medical device; or
            </li>
            <li>in violation of applicable laws and regulations.</li>
          </ul>
          <p>for the restricted uses described below:</p>
          <p>
            You must not access or use nor allow others to access or use
            Tandermis Models or Model Derivatives to:
          </p>
          <ul className="list-disc space-y-3 pl-5">
            <li>
              Generate any content, including Outputs or results generated by
              Tandermis Models or Model Derivatives, that infringes,
              misappropriates, or otherwise violates any individual&apos;s or
              entity&apos;s rights (including, but not limited to rights in
              copyrighted content).
            </li>
            <li>
              Perform, promote, or facilitate dangerous, illegal, or malicious
              activities, including:
              <ul className="mt-2 list-disc space-y-2 pl-5">
                <li>
                  Facilitation or promotion of illegal activities or violations
                  of law, such as: promoting or generating content related to
                  child sexual abuse or exploitation; promoting or facilitating
                  sale of, or providing instructions for synthesizing or
                  accessing, illegal substances, goods, or services; facilitating
                  or encouraging users to commit any type of crimes; or promoting
                  or generating violent extremism or terrorist content.
                </li>
                <li>
                  Engagement in the illegal or unlicensed practice of any
                  vocation or profession including, but not limited to, legal,
                  medical, accounting, or financial professional practices.
                </li>
                <li>
                  Abuse, harm, interference, or disruption of services (or enable
                  others to do the same), such as: promoting or facilitating the
                  generation or distribution of spam; or generating content for
                  deceptive or fraudulent activities, scams, phishing, or
                  malware.
                </li>
                <li>
                  Attempts to override or circumvent safety filters or
                  intentionally drive Tandermis Models or Model Derivatives to
                  act in a manner that contravenes these terms of use.
                </li>
                <li>
                  Generation of content that may harm or promote the harm of
                  individuals or a group, such as: generating content that
                  promotes or encourages hatred; facilitating methods of
                  harassment or bullying to intimidate, abuse, or insult others;
                  generating content that facilitates, promotes, or incites
                  violence; generating content that facilitates, promotes, or
                  encourages self harm; generating personally identifying
                  information for distribution or other harms; tracking or
                  monitoring people without their consent; generating content
                  that may have unfair or adverse impacts on people, particularly
                  impacts related to sensitive or protected characteristics; or
                  generating, gathering, processing, or inferring sensitive
                  personal or private information about individuals without
                  obtaining all rights, authorizations, and consents required by
                  applicable laws.
                </li>
                <li>
                  Generate and distribute content intended to misinform,
                  misrepresent or mislead, including: misrepresentation of the
                  provenance of generated content by claiming content was created
                  by a human, or represent generated content as original works,
                  in order to deceive; generation of content that impersonates an
                  individual (living or dead) without explicit disclosure, in
                  order to deceive; misleading claims of expertise or capability
                  made particularly in sensitive areas (e.g. health, finance,
                  government services, or legal); making automated decisions in
                  domains that affect material or individual rights or well-being
                  (e.g., finance, legal, employment, healthcare, housing,
                  insurance, and social welfare); generation of defamatory
                  content, including defamatory statements, images, or audio
                  content; or engaging in the unauthorized or unlicensed practice
                  of any profession including, but not limited to, financial,
                  legal, medical/health, or related professional practices.
                </li>
                <li>
                  Generate sexually explicit content, including content created
                  for the purposes of pornography or sexual gratification (e.g.
                  sexual chatbots). Note that this does not include content
                  created for scientific, educational, documentary, or artistic
                  purposes.
                </li>
              </ul>
            </li>
          </ul>
          <p>
            To the maximum extent permitted by law and without limiting any of
            Tandermis&apos; other rights, Tandermis reserves the right to restrict
            (remotely or otherwise) usage of any of the Tandermis Services that
            Tandermis reasonably believes are in violation of this Agreement.
          </p>
          <h3 className="font-semibold text-[#121212]">3.2 Generated Output</h3>
          <p>
            Tandermis will not claim ownership over any original Outputs you
            generate using Tandermis Models. You acknowledge that Tandermis or
            Tandermis Models may generate the same or similar Outputs for others,
            including Tandermis, and that Tandermis reserves all of Tandermis&apos;
            rights in the Outputs it generates independently of you. You and your
            users are solely responsible for Outputs and their subsequent uses.
          </p>
        </section>

        <section className="mt-10 space-y-4 text-sm leading-relaxed text-[#4F4F4F] sm:text-base">
          <h2 className="text-lg font-semibold text-[#121212] sm:text-xl">
            Section 4: ADDITIONAL PROVISIONS
          </h2>
          <h3 className="font-semibold text-[#121212]">4.1 Updates</h3>
          <p>Tandermis may update Tandermis Models from time to time.</p>
          <h3 className="font-semibold text-[#121212]">4.2 Trademarks</h3>
          <p>
            Nothing in this Agreement grants you any rights to use Tandermis&apos;
            trademarks, trade names, logos or to otherwise suggest endorsement or
            misrepresent the relationship between you and Tandermis. Tandermis
            reserves any rights not expressly granted herein.
          </p>
          <h3 className="font-semibold text-[#121212]">
            4.3 DISCLAIMER OF WARRANTY
          </h3>
          <p className="uppercase">
            Unless required by applicable law, the Tandermis Services and Outputs
            are provided on an &quot;as is&quot; basis, without warranties or
            conditions of any kind, either express or implied, including any
            warranties or conditions of title, non-infringement, merchantability,
            or fitness for a particular purpose. You are solely responsible for
            determining the appropriateness of using, reproducing, modifying,
            performing, displaying, or distributing any of the Tandermis Services
            or Outputs and assume any and all risks associated with your use or
            distribution of any of the Tandermis Services or Outputs and your
            exercise of rights and permissions under this Agreement. You agree
            that Tandermis will not be deemed to be furnishing any medical advice
            or health care services by virtue of providing the Tandermis Services.
          </p>
          <h3 className="font-semibold text-[#121212]">
            4.4 LIMITATION OF LIABILITY
          </h3>
          <p className="uppercase">
            To the maximum extent permitted by applicable law, in no event and
            under no legal theory, whether in tort (including negligence), product
            liability, contract, or otherwise, unless required by applicable law,
            will Tandermis or its affiliates be liable to you for damages,
            including any direct, indirect, special, incidental, exemplary,
            consequential, or punitive damages, or lost profits of any kind
            arising from this Agreement or related to any of the Tandermis
            Services or Outputs even if Tandermis or its affiliates have been
            advised of the possibility of such damages.
          </p>
          <h3 className="font-semibold text-[#121212]">4.5 Indemnification</h3>
          <p>
            Unless prohibited by applicable law, you will defend and indemnify
            Tandermis, and its affiliates, directors, officers, employees, and
            contractors against all liabilities, damages, losses, costs, fees
            (including legal fees), and expenses relating to any allegations or
            third-party legal proceeding (including regulatory proceedings) to
            the extent arising from: (a) your violation of any term of this
            Agreement; (b) damage or injury to any person or property as a result
            of your use of Tandermis (including your modification, distribution,
            reproduction, performance, display, or adaptation of Tandermis
            Services); (c) your gross negligence or willful misconduct in
            connection with Tandermis Services; or (d) any claim that any
            modifications or combinations to Tandermis Services made by you,
            including Model Derivatives, infringe or violate a third party&apos;s
            intellectual property or other rights, including applicable privacy
            or data protection rights.
          </p>
          <h3 className="font-semibold text-[#121212]">
            4.6 Term, Termination, and Survival
          </h3>
          <p>
            The term of this Agreement will commence upon your acceptance of this
            Agreement (including acceptance by your use, modification, or
            Distribution, reproduction, performance, or display of any portion or
            element of the Tandermis Services) and will continue in full force and
            effect until terminated in accordance with the terms of this
            Agreement. Tandermis may terminate this Agreement if you are in breach
            of any term of this Agreement or if Tandermis reasonably determines
            that a Health Regulatory Authority may deem that Tandermis is, or is
            reasonably likely to be considered a &quot;manufacturer&quot; of a
            medical device in connection with your use of the Tandermis Services.
            Upon termination of this Agreement, you must delete and cease use and
            Distribution of all copies of Tandermis and Model Derivatives in your
            possession or control. Sections 1, 2.1, 3, and 4.2 to 4.7 will
            survive the termination of this Agreement.
          </p>
          <h3 className="font-semibold text-[#121212]">
            4.7 General Legal Terms
          </h3>
          <p>
            This Agreement states all terms agreed between the parties and
            supersedes all other agreements between the parties relating to its
            subject matter. If any provision of this Agreement is held to be
            invalid, illegal or unenforceable, the rest of the Agreement will
            remain in effect. Tandermis&apos; delay or omission in exercising any
            right under this Agreement will not be treated as a waiver of that
            right. Nigeria law will govern all disputes arising out of or
            relating to this Agreement and the Tandermis Services, regardless of
            any conflict of laws rules. These disputes will be resolved
            exclusively in the federal or state courts of Lagos State, Nigeria,
            and the parties consent to personal jurisdiction in those courts.
          </p>
        </section>
      </main>
    </div>
  );
}
