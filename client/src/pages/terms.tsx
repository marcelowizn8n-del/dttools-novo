import { ArrowLeft } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Terms() {
  const { t, language } = useLanguage();

  type PlanBullet = {
    label: string;
    body: string;
  };

  type TermsCopy = {
    lastUpdated: string;
    acceptanceTitle: string;
    acceptanceBody: string;
    serviceTitle: string;
    serviceIntro: string;
    serviceBullets: string[];
    accountTitle: string;
    accountRegistrationTitle: string;
    accountRegistrationBody: string;
    accountResponsibilityTitle: string;
    accountResponsibilityBody: string;
    accountEligibilityTitle: string;
    accountEligibilityBody: string;
    plansTitle: string;
    plansAvailableTitle: string;
    plansBullets: PlanBullet[];
    billingTitle: string;
    billingBody: string;
    cancellationsTitle: string;
    cancellationsBody: string;
    acceptableTitle: string;
    acceptableIntro: string;
    acceptableBullets: string[];
    ipTitle: string;
    ipBody: string;
    privacyTitle: string;
    privacyBodyBeforeLink: string;
    privacyLinkText: string;
    privacyBodyAfterLink: string;
    aiBody: string;
    liabilityTitle: string;
    liabilityBody: string;
    modificationsTitle: string;
    modificationsBody: string;
    terminationTitle: string;
    terminationBody: string;
    lawTitle: string;
    lawBody: string;
    changesTitle: string;
    changesBody: string;
    contactTitle: string;
    contactIntro: string;
    emailLabel: string;
    supportLabel: string;
  };

  const title =
    language === "pt-BR"
      ? "Termos de Uso"
      : language === "en"
        ? "Terms of Use"
        : language === "es"
          ? "Términos de uso"
          : language === "fr"
            ? "Conditions d'utilisation"
            : language === "de"
              ? "Nutzungsbedingungen"
              : "使用条款";

  if (language !== "pt-BR") {
    const contentLanguage =
      language === "es"
        ? "es"
        : language === "fr"
          ? "fr"
          : language === "de"
            ? "de"
            : language === "zh"
              ? "zh"
              : "en";
    const copy: TermsCopy =
      contentLanguage === "es"
        ? {
            lastUpdated: "Última actualización: 07 de octubre de 2025",
            acceptanceTitle: "1. Aceptación de los Términos",
            acceptanceBody:
              "Al acceder y utilizar la plataforma DTTools (el \"Servicio\"), usted acepta cumplir y quedar vinculado por estos Términos de uso. Si no está de acuerdo con alguna parte de estos términos, no debe utilizar nuestro Servicio.",
            serviceTitle: "2. Descripción del Servicio",
            serviceIntro: "DTTools es una plataforma interactiva de herramientas de Design Thinking que ofrece:",
            serviceBullets: [
              "Herramientas para las 5 fases de Design Thinking (Empatizar, Definir, Idear, Prototipar, Probar)",
              "Gestión de proyectos de innovación",
              "Seguimiento del progreso y gamificación",
              "Biblioteca de conocimiento y recursos educativos",
              "Funciones de colaboración y exportación",
            ],
            accountTitle: "3. Cuenta de usuario",
            accountRegistrationTitle: "3.1 Registro",
            accountRegistrationBody:
              "Para utilizar el Servicio, debe crear una cuenta proporcionando información precisa y completa. Usted es responsable de mantener la confidencialidad de sus credenciales.",
            accountResponsibilityTitle: "3.2 Responsabilidad",
            accountResponsibilityBody:
              "Usted es responsable de todas las actividades que ocurran bajo su cuenta y debe notificarnos de inmediato cualquier uso no autorizado.",
            accountEligibilityTitle: "3.3 Elegibilidad",
            accountEligibilityBody: "Debe tener al menos 18 años para usar este Servicio.",
            plansTitle: "4. Planes y pagos",
            plansAvailableTitle: "4.1 Planes disponibles",
            plansBullets: [
              { label: "Gratis", body: "Acceso básico con limitaciones" },
              { label: "Pro", body: "Funciones avanzadas y proyectos ilimitados" },
              { label: "Empresarial", body: "Soluciones personalizadas para empresas" },
            ],
            billingTitle: "4.2 Facturación",
            billingBody: "Los planes de pago se facturan mensualmente o anualmente, según su selección.",
            cancellationsTitle: "4.3 Cancelaciones y reembolsos",
            cancellationsBody:
              "Puede cancelar su suscripción en cualquier momento. Las cancelaciones surtirán efecto al final del período de facturación actual. No ofrecemos reembolsos prorrateados, excepto cuando la ley lo exija.",
            acceptableTitle: "5. Uso aceptable",
            acceptableIntro: "Usted se compromete a NO:",
            acceptableBullets: [
              "Violar las leyes o reglamentos aplicables",
              "Infringir derechos de propiedad intelectual de terceros",
              "Transmitir contenido ilegal, dañino u ofensivo",
              "Intentar acceder a áreas restringidas del sistema",
              "Interferir o interrumpir el funcionamiento del Servicio",
              "Usar el Servicio para spam o actividades fraudulentas",
              "Realizar ingeniería inversa o copiar la funcionalidad de la plataforma",
            ],
            ipTitle: "6. Propiedad intelectual",
            ipBody:
              "El Servicio (incluyendo su diseño, código, marca y contenido) es propiedad de DTTools y está protegido por las leyes de propiedad intelectual.",
            privacyTitle: "7. Privacidad y datos",
            privacyBodyBeforeLink: "El uso del Servicio también se rige por nuestra ",
            privacyLinkText: "Política de Privacidad",
            privacyBodyAfterLink: ".",
            aiBody:
              "Para funciones que utilizan Inteligencia Artificial (por ejemplo, el chat), su mensaje y partes del contexto de su proyecto pueden ser procesados por proveedores de IA para generar respuestas. No introduzca información sensible (contraseñas, datos bancarios, documentos personales o secretos comerciales).",
            liabilityTitle: "8. Limitación de responsabilidad",
            liabilityBody:
              "El Servicio se proporciona \"tal cual\" y \"según disponibilidad\". No garantizamos un funcionamiento ininterrumpido, seguro o libre de errores. Bajo ninguna circunstancia seremos responsables de daños indirectos o consecuentes.",
            modificationsTitle: "9. Modificaciones del servicio",
            modificationsBody: "Podemos modificar, suspender o discontinuar cualquier parte del Servicio en cualquier momento.",
            terminationTitle: "10. Terminación",
            terminationBody:
              "Podemos suspender o cancelar su cuenta por violaciones de estos Términos. Usted puede cancelar su cuenta en cualquier momento a través de la configuración de la plataforma o poniéndose en contacto con nosotros.",
            lawTitle: "11. Ley aplicable",
            lawBody: "Estos Términos se rigen por las leyes de la República Federativa de Brasil.",
            changesTitle: "12. Cambios a estos términos",
            changesBody:
              "Podemos actualizar estos Términos de vez en cuando. El uso continuado después de los cambios constituye la aceptación de los nuevos Términos.",
            contactTitle: "13. Contacto",
            contactIntro: "Si tiene preguntas sobre estos Términos de uso, póngase en contacto:",
            emailLabel: "Correo electrónico",
            supportLabel: "Soporte",
          }
        : contentLanguage === "fr"
          ? {
              lastUpdated: "Dernière mise à jour : 07 octobre 2025",
              acceptanceTitle: "1. Acceptation des Conditions",
              acceptanceBody:
                "En accédant et en utilisant la plateforme DTTools (le « Service »), vous acceptez de respecter et d’être lié par les présentes Conditions d’utilisation. Si vous n’acceptez pas une partie de ces conditions, vous ne devez pas utiliser notre Service.",
              serviceTitle: "2. Description du Service",
              serviceIntro: "DTTools est une plateforme interactive d’outils de Design Thinking, offrant :",
              serviceBullets: [
                "Des outils pour les 5 phases du Design Thinking (Empathiser, Définir, Idéation, Prototyper, Tester)",
                "La gestion de projets d’innovation",
                "Le suivi de progression et la gamification",
                "Une bibliothèque de connaissances et des ressources éducatives",
                "Des fonctionnalités de collaboration et d’export",
              ],
              accountTitle: "3. Compte utilisateur",
              accountRegistrationTitle: "3.1 Inscription",
              accountRegistrationBody:
                "Pour utiliser le Service, vous devez créer un compte en fournissant des informations exactes et complètes. Vous êtes responsable de la confidentialité de vos identifiants.",
              accountResponsibilityTitle: "3.2 Responsabilité",
              accountResponsibilityBody:
                "Vous êtes responsable de toutes les activités effectuées sous votre compte et devez nous informer immédiatement de toute utilisation non autorisée.",
              accountEligibilityTitle: "3.3 Éligibilité",
              accountEligibilityBody: "Vous devez avoir au moins 18 ans pour utiliser ce Service.",
              plansTitle: "4. Forfaits et paiements",
              plansAvailableTitle: "4.1 Forfaits disponibles",
              plansBullets: [
                { label: "Gratuit", body: "Accès de base avec limitations" },
                { label: "Pro", body: "Fonctionnalités avancées et projets illimités" },
                { label: "Entreprise", body: "Solutions personnalisées pour les entreprises" },
              ],
              billingTitle: "4.2 Facturation",
              billingBody: "Les forfaits payants sont facturés mensuellement ou annuellement, selon votre sélection.",
              cancellationsTitle: "4.3 Annulations et remboursements",
              cancellationsBody:
                "Vous pouvez annuler votre abonnement à tout moment. Les annulations prennent effet à la fin de la période de facturation en cours. Nous n’offrons pas de remboursement au prorata, sauf si la loi l’exige.",
              acceptableTitle: "5. Utilisation acceptable",
              acceptableIntro: "Vous acceptez de NE PAS :",
              acceptableBullets: [
                "Violer les lois ou réglementations applicables",
                "Porter atteinte aux droits de propriété intellectuelle de tiers",
                "Transmettre du contenu illégal, nuisible ou offensant",
                "Tenter d’accéder à des zones restreintes du système",
                "Interférer avec ou perturber le fonctionnement du Service",
                "Utiliser le Service pour du spam ou des activités frauduleuses",
                "Réaliser de l’ingénierie inverse ou copier la fonctionnalité de la plateforme",
              ],
              ipTitle: "6. Propriété intellectuelle",
              ipBody:
                "Le Service (y compris son design, son code, sa marque et son contenu) appartient à DTTools et est protégé par les lois sur la propriété intellectuelle.",
              privacyTitle: "7. Confidentialité et données",
              privacyBodyBeforeLink: "Votre utilisation du Service est également régie par notre ",
              privacyLinkText: "Politique de confidentialité",
              privacyBodyAfterLink: ".",
              aiBody:
                "Pour les fonctionnalités utilisant l’Intelligence Artificielle (par exemple, le chat), votre message et certaines parties du contexte de votre projet peuvent être traités par des fournisseurs d’IA afin de générer des réponses. Ne saisissez pas d’informations sensibles (mots de passe, données bancaires, documents personnels ou secrets commerciaux).",
              liabilityTitle: "8. Limitation de responsabilité",
              liabilityBody:
                "Le Service est fourni « en l’état » et « selon disponibilité ». Nous ne garantissons pas un fonctionnement ininterrompu, sécurisé ou exempt d’erreurs. En aucun cas nous ne serons responsables des dommages indirects ou consécutifs.",
              modificationsTitle: "9. Modifications du Service",
              modificationsBody: "Nous pouvons modifier, suspendre ou interrompre toute partie du Service à tout moment.",
              terminationTitle: "10. Résiliation",
              terminationBody:
                "Nous pouvons suspendre ou résilier votre compte en cas de violation des présentes Conditions. Vous pouvez résilier votre compte à tout moment via les paramètres de la plateforme ou en nous contactant.",
              lawTitle: "11. Droit applicable",
              lawBody: "Ces Conditions sont régies par les lois de la République fédérative du Brésil.",
              changesTitle: "12. Modifications de ces conditions",
              changesBody:
                "Nous pouvons mettre à jour ces Conditions de temps à autre. La poursuite de l’utilisation après des modifications vaut acceptation des nouvelles Conditions.",
              contactTitle: "13. Contact",
              contactIntro: "Pour toute question concernant ces Conditions d’utilisation, contactez :",
              emailLabel: "Email",
              supportLabel: "Support",
            }
          : contentLanguage === "de"
            ? {
                lastUpdated: "Letzte Aktualisierung: 07. Oktober 2025",
                acceptanceTitle: "1. Annahme der Nutzungsbedingungen",
                acceptanceBody:
                  "Durch den Zugriff auf und die Nutzung der DTTools-Plattform (der „Service“) erklären Sie sich damit einverstanden, diese Nutzungsbedingungen einzuhalten und an sie gebunden zu sein. Wenn Sie mit einem Teil dieser Bedingungen nicht einverstanden sind, dürfen Sie unseren Service nicht nutzen.",
                serviceTitle: "2. Beschreibung des Services",
                serviceIntro: "DTTools ist eine interaktive Plattform für Design-Thinking-Tools und bietet:",
                serviceBullets: [
                  "Tools für die 5 Phasen des Design Thinking (Empathize, Define, Ideate, Prototype, Test)",
                  "Management von Innovationsprojekten",
                  "Fortschrittsverfolgung und Gamification",
                  "Wissensbibliothek und Lernressourcen",
                  "Kollaborations- und Exportfunktionen",
                ],
                accountTitle: "3. Benutzerkonto",
                accountRegistrationTitle: "3.1 Registrierung",
                accountRegistrationBody:
                  "Um den Service zu nutzen, müssen Sie ein Konto erstellen und dabei genaue und vollständige Informationen angeben. Sie sind dafür verantwortlich, Ihre Zugangsdaten vertraulich zu behandeln.",
                accountResponsibilityTitle: "3.2 Verantwortung",
                accountResponsibilityBody:
                  "Sie sind für alle Aktivitäten verantwortlich, die unter Ihrem Konto stattfinden, und müssen uns unverzüglich über jede unbefugte Nutzung informieren.",
                accountEligibilityTitle: "3.3 Teilnahmeberechtigung",
                accountEligibilityBody: "Sie müssen mindestens 18 Jahre alt sein, um diesen Service zu nutzen.",
                plansTitle: "4. Pläne und Zahlungen",
                plansAvailableTitle: "4.1 Verfügbare Pläne",
                plansBullets: [
                  { label: "Kostenlos", body: "Basiszugang mit Einschränkungen" },
                  { label: "Pro", body: "Erweiterte Funktionen und unbegrenzte Projekte" },
                  { label: "Enterprise", body: "Individuelle Lösungen für Unternehmen" },
                ],
                billingTitle: "4.2 Abrechnung",
                billingBody: "Bezahlpläne werden je nach Auswahl monatlich oder jährlich abgerechnet.",
                cancellationsTitle: "4.3 Kündigungen und Rückerstattungen",
                cancellationsBody:
                  "Sie können Ihr Abonnement jederzeit kündigen. Kündigungen werden zum Ende des aktuellen Abrechnungszeitraums wirksam. Wir bieten keine anteiligen Rückerstattungen an, außer wenn dies gesetzlich vorgeschrieben ist.",
                acceptableTitle: "5. Zulässige Nutzung",
                acceptableIntro: "Sie verpflichten sich, Folgendes NICHT zu tun:",
                acceptableBullets: [
                  "Geltende Gesetze oder Vorschriften zu verletzen",
                  "Rechte an geistigem Eigentum Dritter zu verletzen",
                  "Illegale, schädliche oder anstößige Inhalte zu übertragen",
                  "Zu versuchen, auf geschützte Bereiche des Systems zuzugreifen",
                  "Den Betrieb des Services zu stören oder zu beeinträchtigen",
                  "Den Service für Spam oder betrügerische Aktivitäten zu nutzen",
                  "Reverse Engineering durchzuführen oder Funktionen der Plattform zu kopieren",
                ],
                ipTitle: "6. Geistiges Eigentum",
                ipBody:
                  "Der Service (einschließlich Design, Code, Marke und Inhalte) ist Eigentum von DTTools und durch Gesetze zum Schutz geistigen Eigentums geschützt.",
                privacyTitle: "7. Datenschutz und Daten",
                privacyBodyBeforeLink: "Ihre Nutzung des Services unterliegt auch unserer ",
                privacyLinkText: "Datenschutzerklärung",
                privacyBodyAfterLink: ".",
                aiBody:
                  "Für Funktionen, die Künstliche Intelligenz verwenden (z. B. der Chat), können Ihre Nachricht und Teile des Projektkontexts von KI-Anbietern verarbeitet werden, um Antworten zu generieren. Geben Sie keine sensiblen Informationen ein (Passwörter, Bankdaten, persönliche Dokumente oder Geschäftsgeheimnisse).",
                liabilityTitle: "8. Haftungsbeschränkung",
                liabilityBody:
                  "Der Service wird „wie besehen“ und „wie verfügbar“ bereitgestellt. Wir garantieren keinen unterbrechungsfreien, sicheren oder fehlerfreien Betrieb. Unter keinen Umständen haften wir für indirekte oder Folgeschäden.",
                modificationsTitle: "9. Änderungen am Service",
                modificationsBody: "Wir können jederzeit Teile des Services ändern, aussetzen oder einstellen.",
                terminationTitle: "10. Beendigung",
                terminationBody:
                  "Wir können Ihr Konto bei Verstößen gegen diese Bedingungen sperren oder beenden. Sie können Ihr Konto jederzeit über die Plattform-Einstellungen beenden oder uns kontaktieren.",
                lawTitle: "11. Anwendbares Recht",
                lawBody: "Diese Bedingungen unterliegen dem Recht der Föderativen Republik Brasilien.",
                changesTitle: "12. Änderungen dieser Bedingungen",
                changesBody:
                  "Wir können diese Bedingungen von Zeit zu Zeit aktualisieren. Die fortgesetzte Nutzung nach Änderungen gilt als Zustimmung zu den neuen Bedingungen.",
                contactTitle: "13. Kontakt",
                contactIntro: "Bei Fragen zu diesen Nutzungsbedingungen kontaktieren Sie:",
                emailLabel: "E-Mail",
                supportLabel: "Support",
              }
          : contentLanguage === "zh"
            ? {
                lastUpdated: "最后更新：2025年10月07日",
                acceptanceTitle: "1. 接受条款",
                acceptanceBody:
                  "访问和使用 DTTools 平台（“服务”）即表示您同意遵守并受本使用条款约束。如您不同意本条款的任何部分，请勿使用我们的服务。",
                serviceTitle: "2. 服务说明",
                serviceIntro: "DTTools 是一个交互式的设计思维工具平台，提供：",
                serviceBullets: [
                  "覆盖设计思维五个阶段的工具（共情、定义、构思、原型、测试）",
                  "创新项目管理",
                  "进度跟踪与游戏化",
                  "知识库与教育资源",
                  "协作与导出功能",
                ],
                accountTitle: "3. 用户账户",
                accountRegistrationTitle: "3.1 注册",
                accountRegistrationBody:
                  "使用本服务需要创建账户并提供准确且完整的信息。您有责任保持账户凭据的机密性。",
                accountResponsibilityTitle: "3.2 责任",
                accountResponsibilityBody:
                  "您需对您账户下发生的所有活动负责，并应立即通知我们任何未经授权的使用情况。",
                accountEligibilityTitle: "3.3 资格",
                accountEligibilityBody: "您必须年满 18 周岁方可使用本服务。",
                plansTitle: "4. 套餐与付款",
                plansAvailableTitle: "4.1 可用套餐",
                plansBullets: [
                  { label: "免费", body: "基础访问，功能有限" },
                  { label: "Pro", body: "高级功能与不限项目" },
                  { label: "企业", body: "面向企业的定制化解决方案" },
                ],
                billingTitle: "4.2 计费",
                billingBody: "付费套餐按月或按年计费，取决于您的选择。",
                cancellationsTitle: "4.3 取消与退款",
                cancellationsBody:
                  "您可随时取消订阅。取消将在当前计费周期结束时生效。除非法律要求，我们不提供按比例退款。",
                acceptableTitle: "5. 合理使用",
                acceptableIntro: "您同意不得：",
                acceptableBullets: [
                  "违反适用法律或法规",
                  "侵犯第三方知识产权",
                  "传播非法、有害或冒犯性内容",
                  "尝试访问系统受限区域",
                  "干扰或破坏服务运行",
                  "将服务用于垃圾信息或欺诈活动",
                  "对平台进行反向工程或复制平台功能",
                ],
                ipTitle: "6. 知识产权",
                ipBody:
                  "服务（包括其设计、代码、品牌与内容）归 DTTools 所有，并受知识产权法律保护。",
                privacyTitle: "7. 隐私与数据",
                privacyBodyBeforeLink: "您对本服务的使用亦受我们的 ",
                privacyLinkText: "隐私政策",
                privacyBodyAfterLink: " 约束。",
                aiBody:
                  "对于使用人工智能的功能（例如聊天），您的消息及项目上下文的部分内容可能会由 AI 供应商处理以生成回复。请勿输入敏感信息（密码、银行信息、个人证件或商业机密）。",
                liabilityTitle: "8. 责任限制",
                liabilityBody:
                  "服务按“现状”与“可用性”提供。我们不保证服务不间断、安全或无错误。在任何情况下，我们均不对间接或后果性损害承担责任。",
                modificationsTitle: "9. 服务变更",
                modificationsBody: "我们可在任何时候修改、暂停或终止服务的任何部分。",
                terminationTitle: "10. 终止",
                terminationBody:
                  "如您违反本条款，我们可暂停或终止您的账户。您也可通过平台设置或联系我们随时终止账户。",
                lawTitle: "11. 适用法律",
                lawBody: "本条款受巴西联邦共和国法律管辖。",
                changesTitle: "12. 条款变更",
                changesBody:
                  "我们可能不时更新本条款。变更后继续使用服务即表示您接受更新后的条款。",
                contactTitle: "13. 联系方式",
                contactIntro: "如对本使用条款有任何疑问，请联系：",
                emailLabel: "邮箱",
                supportLabel: "支持",
              }
            : {
                lastUpdated: "Last updated: October 07, 2025",
                acceptanceTitle: "1. Acceptance of Terms",
                acceptanceBody:
                  "By accessing and using the DTTools platform (the “Service”), you agree to comply with and be bound by these Terms of Use. If you do not agree with any part of these terms, you must not use our Service.",
                serviceTitle: "2. Service Description",
                serviceIntro: "DTTools is an interactive Design Thinking tools platform, offering:",
                serviceBullets: [
                  "Tools for the 5 phases of Design Thinking (Empathize, Define, Ideate, Prototype, Test)",
                  "Innovation project management",
                  "Progress tracking and gamification",
                  "Knowledge library and educational resources",
                  "Collaboration and export features",
                ],
                accountTitle: "3. User Account",
                accountRegistrationTitle: "3.1 Registration",
                accountRegistrationBody:
                  "To use the Service, you must create an account by providing accurate and complete information. You are responsible for maintaining the confidentiality of your credentials.",
                accountResponsibilityTitle: "3.2 Responsibility",
                accountResponsibilityBody:
                  "You are responsible for all activities that occur under your account and must notify us immediately of any unauthorized use.",
                accountEligibilityTitle: "3.3 Eligibility",
                accountEligibilityBody: "You must be at least 18 years old to use this Service.",
                plansTitle: "4. Plans and Payments",
                plansAvailableTitle: "4.1 Available Plans",
                plansBullets: [
                  { label: "Free", body: "Basic access with limitations" },
                  { label: "Pro", body: "Advanced features and unlimited projects" },
                  { label: "Enterprise", body: "Customized solutions for businesses" },
                ],
                billingTitle: "4.2 Billing",
                billingBody: "Paid plans are billed monthly or annually, depending on your selection.",
                cancellationsTitle: "4.3 Cancellations and Refunds",
                cancellationsBody:
                  "You may cancel your subscription at any time. Cancellations take effect at the end of the current billing period. We do not offer prorated refunds, except where required by law.",
                acceptableTitle: "5. Acceptable Use",
                acceptableIntro: "You agree NOT to:",
                acceptableBullets: [
                  "Violate applicable laws or regulations",
                  "Infringe third-party intellectual property rights",
                  "Transmit illegal, harmful, or offensive content",
                  "Attempt to access restricted areas of the system",
                  "Interfere with or disrupt the operation of the Service",
                  "Use the Service for spam or fraudulent activities",
                  "Reverse engineer or copy platform functionality",
                ],
                ipTitle: "6. Intellectual Property",
                ipBody:
                  "The Service (including its design, code, brand, and content) is owned by DTTools and protected by intellectual property laws.",
                privacyTitle: "7. Privacy and Data",
                privacyBodyBeforeLink: "Your use of the Service is also governed by our ",
                privacyLinkText: "Privacy Policy",
                privacyBodyAfterLink: ".",
                aiBody:
                  "For features that use Artificial Intelligence (for example, the chat), your message and parts of your project context may be processed by AI providers to generate responses. Do not enter sensitive information (passwords, banking data, personal documents, or trade secrets).",
                liabilityTitle: "8. Limitation of Liability",
                liabilityBody:
                  "The Service is provided “as is” and “as available”. We do not guarantee uninterrupted, secure, or error-free operation. Under no circumstances will we be liable for indirect or consequential damages.",
                modificationsTitle: "9. Service Modifications",
                modificationsBody: "We may modify, suspend, or discontinue any part of the Service at any time.",
                terminationTitle: "10. Termination",
                terminationBody:
                  "We may suspend or terminate your account for violations of these Terms. You may terminate your account at any time through platform settings or by contacting us.",
                lawTitle: "11. Governing Law",
                lawBody: "These Terms are governed by the laws of the Federative Republic of Brazil.",
                changesTitle: "12. Changes to these Terms",
                changesBody:
                  "We may update these Terms from time to time. Continued use after changes constitutes acceptance of the new Terms.",
                contactTitle: "13. Contact",
                contactIntro: "For questions about these Terms of Use, contact:",
                emailLabel: "Email",
                supportLabel: "Support",
              };

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <Link href="/">
            <Button variant="ghost" className="mb-6" data-testid="button-back">
              <ArrowLeft className="mr-2 h-4 w-4" />
              {t("common.back")}
            </Button>
          </Link>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
            <h1 className="text-4xl font-bold mb-6 text-gray-900 dark:text-white">{title}</h1>

            <div className="space-y-6 text-gray-700 dark:text-gray-300">
              <section>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{copy.lastUpdated}</p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-3 text-gray-900 dark:text-white">{copy.acceptanceTitle}</h2>
                <p>{copy.acceptanceBody}</p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-3 text-gray-900 dark:text-white">{copy.serviceTitle}</h2>
                <p>{copy.serviceIntro}</p>
                <ul className="list-disc pl-6 space-y-2 mt-2">
                  {copy.serviceBullets.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-3 text-gray-900 dark:text-white">{copy.accountTitle}</h2>
                <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-200">{copy.accountRegistrationTitle}</h3>
                <p>{copy.accountRegistrationBody}</p>

                <h3 className="text-xl font-semibold mb-2 mt-4 text-gray-800 dark:text-gray-200">{copy.accountResponsibilityTitle}</h3>
                <p>{copy.accountResponsibilityBody}</p>

                <h3 className="text-xl font-semibold mb-2 mt-4 text-gray-800 dark:text-gray-200">{copy.accountEligibilityTitle}</h3>
                <p>{copy.accountEligibilityBody}</p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-3 text-gray-900 dark:text-white">{copy.plansTitle}</h2>
                <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-200">{copy.plansAvailableTitle}</h3>
                <ul className="list-disc pl-6 space-y-2">
                  {copy.plansBullets.map((item) => (
                    <li key={item.label}>
                      <strong>{item.label}:</strong> {item.body}
                    </li>
                  ))}
                </ul>

                <h3 className="text-xl font-semibold mb-2 mt-4 text-gray-800 dark:text-gray-200">{copy.billingTitle}</h3>
                <p>{copy.billingBody}</p>

                <h3 className="text-xl font-semibold mb-2 mt-4 text-gray-800 dark:text-gray-200">{copy.cancellationsTitle}</h3>
                <p>{copy.cancellationsBody}</p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-3 text-gray-900 dark:text-white">{copy.acceptableTitle}</h2>
                <p className="mb-3">{copy.acceptableIntro}</p>
                <ul className="list-disc pl-6 space-y-2">
                  {copy.acceptableBullets.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-3 text-gray-900 dark:text-white">{copy.ipTitle}</h2>
                <p>{copy.ipBody}</p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-3 text-gray-900 dark:text-white">{copy.privacyTitle}</h2>
                <p>
                  {copy.privacyBodyBeforeLink}
                  <Link href="/privacidade" className="text-blue-600 hover:underline">{copy.privacyLinkText}</Link>
                  {copy.privacyBodyAfterLink}
                </p>
                <p className="mt-3">{copy.aiBody}</p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-3 text-gray-900 dark:text-white">{copy.liabilityTitle}</h2>
                <p>{copy.liabilityBody}</p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-3 text-gray-900 dark:text-white">{copy.modificationsTitle}</h2>
                <p>{copy.modificationsBody}</p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-3 text-gray-900 dark:text-white">{copy.terminationTitle}</h2>
                <p>{copy.terminationBody}</p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-3 text-gray-900 dark:text-white">{copy.lawTitle}</h2>
                <p>{copy.lawBody}</p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-3 text-gray-900 dark:text-white">{copy.changesTitle}</h2>
                <p>{copy.changesBody}</p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-3 text-gray-900 dark:text-white">{copy.contactTitle}</h2>
                <p>{copy.contactIntro}</p>
                <ul className="list-none space-y-2 mt-3">
                  <li><strong>{copy.emailLabel}:</strong> legal@dttools.app</li>
                  <li>
                    <strong>{copy.supportLabel}:</strong> <Link href="/support" className="text-blue-600 hover:underline">dttools.app/support</Link>
                  </li>
                </ul>
              </section>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Link href="/">
          <Button variant="ghost" className="mb-6" data-testid="button-back">
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t("common.back")}
          </Button>
        </Link>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
          <h1 className="text-4xl font-bold mb-6 text-gray-900 dark:text-white">
            {title}
          </h1>
          
          <div className="space-y-6 text-gray-700 dark:text-gray-300">
            <section>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Última atualização: 07 de outubro de 2025
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3 text-gray-900 dark:text-white">
                1. Aceitação dos Termos
              </h2>
              <p>
                Ao acessar e usar a plataforma DTTools ("Serviço"), você concorda em cumprir e estar vinculado a estes Termos de Uso. Se você não concordar com qualquer parte destes termos, não deverá usar nosso Serviço.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3 text-gray-900 dark:text-white">
                2. Descrição do Serviço
              </h2>
              <p>
                DTTools é uma plataforma interativa de ferramentas para Design Thinking, oferecendo:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-2">
                <li>Ferramentas para as 5 fases do Design Thinking (Empatizar, Definir, Idear, Prototipar, Testar)</li>
                <li>Gestão de projetos de inovação</li>
                <li>Sistema de progresso e gamificação</li>
                <li>Biblioteca de conhecimento e recursos educacionais</li>
                <li>Funcionalidades de colaboração e exportação</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3 text-gray-900 dark:text-white">
                3. Conta de Usuário
              </h2>
              <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-200">
                3.1 Registro
              </h3>
              <p>
                Para usar o Serviço, você deve criar uma conta fornecendo informações precisas e completas. Você é responsável por manter a confidencialidade de suas credenciais.
              </p>

              <h3 className="text-xl font-semibold mb-2 mt-4 text-gray-800 dark:text-gray-200">
                3.2 Responsabilidade
              </h3>
              <p>
                Você é responsável por todas as atividades que ocorrem em sua conta e deve notificar-nos imediatamente sobre qualquer uso não autorizado.
              </p>

              <h3 className="text-xl font-semibold mb-2 mt-4 text-gray-800 dark:text-gray-200">
                3.3 Elegibilidade
              </h3>
              <p>
                Você deve ter pelo menos 18 anos para usar este Serviço. Ao criar uma conta, você confirma que atende a este requisito.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3 text-gray-900 dark:text-white">
                4. Planos e Pagamentos
              </h2>
              <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-200">
                4.1 Planos Disponíveis
              </h3>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Gratuito:</strong> Acesso básico com limitações</li>
                <li><strong>Pro:</strong> Recursos avançados e projetos ilimitados</li>
                <li><strong>Enterprise:</strong> Soluções customizadas para empresas</li>
              </ul>

              <h3 className="text-xl font-semibold mb-2 mt-4 text-gray-800 dark:text-gray-200">
                4.2 Faturamento
              </h3>
              <p>
                Os planos pagos são cobrados mensalmente ou anualmente, conforme selecionado. As cobranças são processadas através de nossos parceiros de pagamento seguros.
              </p>

              <h3 className="text-xl font-semibold mb-2 mt-4 text-gray-800 dark:text-gray-200">
                4.3 Cancelamento e Reembolsos
              </h3>
              <p>
                Você pode cancelar sua assinatura a qualquer momento. Cancelamentos terão efeito ao final do período de faturamento atual. Não oferecemos reembolsos proporcionais, exceto quando exigido por lei.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3 text-gray-900 dark:text-white">
                5. Uso Aceitável
              </h2>
              <p className="mb-3">Você concorda em NÃO:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Violar qualquer lei ou regulamento aplicável</li>
                <li>Infringir direitos de propriedade intelectual de terceiros</li>
                <li>Transmitir conteúdo ilegal, prejudicial ou ofensivo</li>
                <li>Tentar acessar áreas restritas do sistema</li>
                <li>Interferir ou interromper a operação do Serviço</li>
                <li>Usar o Serviço para spam ou atividades fraudulentas</li>
                <li>Fazer engenharia reversa ou copiar funcionalidades da plataforma</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3 text-gray-900 dark:text-white">
                6. Propriedade Intelectual
              </h2>
              <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-200">
                6.1 Propriedade da Plataforma
              </h3>
              <p>
                O Serviço, incluindo seu design, código, marca e conteúdo, é propriedade da DTTools e está protegido por leis de propriedade intelectual.
              </p>

              <h3 className="text-xl font-semibold mb-2 mt-4 text-gray-800 dark:text-gray-200">
                6.2 Seu Conteúdo
              </h3>
              <p>
                Você mantém todos os direitos sobre o conteúdo que criar na plataforma (projetos, ideias, protótipos). Ao usar o Serviço, você nos concede uma licença limitada para hospedar e exibir seu conteúdo conforme necessário para operar o Serviço.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3 text-gray-900 dark:text-white">
                7. Privacidade e Dados
              </h2>
              <p>
                Seu uso do Serviço também é regido por nossa <Link href="/privacidade" className="text-blue-600 hover:underline">Política de Privacidade</Link>. Ao usar o Serviço, você consente com a coleta e uso de informações conforme descrito nessa política.
              </p>
              <p className="mt-3">
                Em funcionalidades que utilizam Inteligência Artificial (por exemplo, o chat), sua mensagem e partes do contexto do projeto podem ser processados por provedores de IA para gerar respostas. Você concorda em não inserir no chat informações sensíveis (como senhas, dados bancários, documentos pessoais ou segredos comerciais) e entende que a DTTools não se responsabiliza por informações sensíveis inseridas voluntariamente por você nessas funcionalidades.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3 text-gray-900 dark:text-white">
                8. Limitação de Responsabilidade
              </h2>
              <p>
                O Serviço é fornecido "como está" e "conforme disponível". Não garantimos que o Serviço será ininterrupto, seguro ou livre de erros. Em nenhuma circunstância seremos responsáveis por:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-2">
                <li>Perda de dados ou conteúdo</li>
                <li>Lucros cessantes ou oportunidades perdidas</li>
                <li>Danos indiretos, incidentais ou consequenciais</li>
                <li>Problemas resultantes de caso fortuito ou força maior</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3 text-gray-900 dark:text-white">
                9. Modificações do Serviço
              </h2>
              <p>
                Reservamo-nos o direito de modificar, suspender ou descontinuar qualquer parte do Serviço a qualquer momento, com ou sem aviso prévio. Não seremos responsáveis por qualquer modificação, suspensão ou descontinuação.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3 text-gray-900 dark:text-white">
                10. Rescisão
              </h2>
              <p>
                Podemos suspender ou encerrar sua conta imediatamente, sem aviso prévio, por violação destes Termos. Você pode encerrar sua conta a qualquer momento através das configurações da plataforma ou entrando em contato conosco.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3 text-gray-900 dark:text-white">
                11. Lei Aplicável
              </h2>
              <p>
                Estes Termos são regidos pelas leis da República Federativa do Brasil. Qualquer disputa será resolvida nos tribunais competentes de São Paulo, SP.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3 text-gray-900 dark:text-white">
                12. Alterações nos Termos
              </h2>
              <p>
                Podemos atualizar estes Termos periodicamente. Notificaremos sobre mudanças significativas através de email ou aviso na plataforma. O uso continuado após as alterações constitui aceitação dos novos Termos.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3 text-gray-900 dark:text-white">
                13. Contato
              </h2>
              <p>
                Para dúvidas sobre estes Termos de Uso, entre em contato:
              </p>
              <ul className="list-none space-y-2 mt-3">
                <li><strong>Email:</strong> legal@dttools.app</li>
                <li><strong>Suporte:</strong> <Link href="/support" className="text-blue-600 hover:underline">dttools.app/support</Link></li>
              </ul>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
