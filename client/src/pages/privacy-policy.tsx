import { ArrowLeft } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";

export default function PrivacyPolicy() {
  const { t, language } = useLanguage();

  type PrivacyCopy = {
    lastUpdated: string;
    introTitle: string;
    introBody: string;
    collectTitle: string;
    provideTitle: string;
    provideBullets: string[];
    autoTitle: string;
    autoBullets: string[];
    useTitle: string;
    useBullets: string[];
    sharingTitle: string;
    sharingIntro: string;
    sharingBullets: string[];
    aiTitle: string;
    aiIntro: string;
    aiBullets: string[];
    securityTitle: string;
    securityIntro: string;
    securityBullets: string[];
    rightsTitle: string;
    rightsIntro: string;
    rightsBullets: string[];
    retentionTitle: string;
    retentionBody: string;
    cookiesTitle: string;
    cookiesBody: string;
    minorsTitle: string;
    minorsBody: string;
    changesTitle: string;
    changesBody: string;
    contactTitle: string;
    contactIntro: string;
    emailLabel: string;
    supportLabel: string;
  };

  const title =
    language === "pt-BR"
      ? "Política de Privacidade"
      : language === "en"
        ? "Privacy Policy"
        : language === "es"
          ? "Política de privacidad"
          : language === "fr"
            ? "Politique de confidentialité"
            : language === "de"
              ? "Datenschutzerklärung"
              : "隐私政策";

  if (language !== "pt-BR") {
    const contentLanguage =
      language === "es" ? "es" : language === "fr" ? "fr" : language === "de" ? "de" : language === "zh" ? "zh" : "en";
    const copy: PrivacyCopy =
      contentLanguage === "es"
        ? {
            lastUpdated: "Última actualización: 07 de octubre de 2025",
            introTitle: "1. Introducción",
            introBody:
              'DTTools ("nosotros", "nuestro") respeta su privacidad y se compromete a proteger sus datos personales. Esta Política de privacidad explica cómo recopilamos, utilizamos, almacenamos y protegemos su información cuando utiliza nuestra plataforma de Design Thinking.',
            collectTitle: "2. Información que recopilamos",
            provideTitle: "2.1 Información que usted proporciona",
            provideBullets: [
              "Información de la cuenta (nombre, correo electrónico, contraseña cifrada)",
              "Datos de proyectos y herramientas que usted crea dentro de DTTools",
              "Información del perfil y preferencias",
              "Contenido que usted comparte dentro de la plataforma",
            ],
            autoTitle: "2.2 Información recopilada automáticamente",
            autoBullets: [
              "Datos de uso e interacción",
              "Información técnica (tipo de dispositivo, navegador, sistema operativo)",
              "Dirección IP y datos aproximados de ubicación",
              "Cookies y tecnologías similares",
            ],
            useTitle: "3. Cómo usamos su información",
            useBullets: [
              "Proporcionar, operar y mantener nuestra plataforma",
              "Mejorar, personalizar y ampliar nuestros servicios",
              "Comunicarnos con usted sobre actualizaciones y soporte",
              "Procesar transacciones y gestionar su cuenta",
              "Analizar el uso para mejorar la experiencia del usuario",
              "Prevenir fraudes y garantizar la seguridad",
            ],
            sharingTitle: "4. Compartición de datos",
            sharingIntro:
              "No vendemos su información personal. Solo podemos compartir sus datos en las siguientes situaciones:",
            sharingBullets: [
              "Con su consentimiento explícito",
              "Con proveedores de servicios que nos ayudan a operar la plataforma",
              "Para cumplir obligaciones legales o proteger derechos",
              "En caso de fusión, adquisición o venta de activos (con aviso previo)",
            ],
            aiTitle: "4.1 Inteligencia Artificial (Chat)",
            aiIntro:
              "Para ofrecer orientación y sugerencias en el chat, DTTools puede procesar su mensaje y partes del contexto de su proyecto con proveedores de IA.",
            aiBullets: [
              "Podemos enviar el texto de su mensaje y la información necesaria para responder (p. ej., fase actual, nombre/descrición del proyecto al usar el chat dentro de un proyecto).",
              "No pretendemos enviar contraseñas, datos bancarios o documentos personales. Por favor, no comparta información sensible en el chat.",
              "El procesamiento se realiza para generar respuestas y mejorar la experiencia del usuario.",
            ],
            securityTitle: "5. Seguridad de los datos",
            securityIntro: "Implementamos medidas técnicas y organizativas de seguridad, incluyendo:",
            securityBullets: [
              "Cifrado de contraseñas y datos sensibles",
              "Conexiones HTTPS seguras",
              "Controles de acceso estrictos",
              "Monitoreo continuo de seguridad",
              "Copias de seguridad regulares y procedimientos de recuperación",
            ],
            rightsTitle: "6. Sus derechos",
            rightsIntro:
              "Dependiendo de su jurisdicción (por ejemplo, LGPD/GDPR), puede tener derechos como:",
            rightsBullets: [
              "Confirmar si procesamos sus datos personales",
              "Acceder a sus datos personales",
              "Corregir datos incompletos, inexactos o desactualizados",
              "Eliminar datos cuando corresponda",
              "Portabilidad de datos",
              "Retirar el consentimiento",
            ],
            retentionTitle: "7. Conservación de datos",
            retentionBody:
              "Conservamos su información durante el tiempo necesario para prestar nuestros servicios y cumplir obligaciones legales. Los datos del proyecto se conservan mientras su cuenta esté activa. Tras eliminar la cuenta, los datos pueden eliminarse permanentemente en hasta 90 días.",
            cookiesTitle: "8. Cookies",
            cookiesBody:
              "Usamos cookies esenciales para la autenticación y el funcionamiento de la plataforma. Puede gestionar las cookies en la configuración de su navegador, pero hacerlo puede afectar el servicio.",
            minorsTitle: "9. Menores",
            minorsBody:
              "Nuestra plataforma no está destinada a usuarios menores de 18 años. No recopilamos conscientemente datos de menores.",
            changesTitle: "10. Cambios en la política",
            changesBody:
              "Podemos actualizar esta Política de privacidad de vez en cuando. Le notificaremos cambios importantes por correo electrónico o mediante un aviso dentro de la app. El uso continuado después de los cambios constituye la aceptación de la política actualizada.",
            contactTitle: "11. Contacto",
            contactIntro:
              "Para ejercer sus derechos o hacer preguntas sobre esta Política de privacidad, contáctenos:",
            emailLabel: "Correo electrónico",
            supportLabel: "Soporte",
          }
        : contentLanguage === "fr"
          ? {
              lastUpdated: "Dernière mise à jour : 07 octobre 2025",
              introTitle: "1. Introduction",
              introBody:
                "DTTools (« nous », « notre ») respecte votre vie privée et s’engage à protéger vos données personnelles. La présente Politique de confidentialité explique comment nous collectons, utilisons, stockons et protégeons vos informations lorsque vous utilisez notre plateforme de Design Thinking.",
              collectTitle: "2. Informations que nous collectons",
              provideTitle: "2.1 Informations que vous fournissez",
              provideBullets: [
                "Informations de compte (nom, email, mot de passe chiffré)",
                "Données de projets et d’outils que vous créez dans DTTools",
                "Informations de profil et préférences",
                "Contenu que vous partagez au sein de la plateforme",
              ],
              autoTitle: "2.2 Informations collectées automatiquement",
              autoBullets: [
                "Données d’utilisation et d’interaction",
                "Informations techniques (type d’appareil, navigateur, système d’exploitation)",
                "Adresse IP et données de localisation approximatives",
                "Cookies et technologies similaires",
              ],
              useTitle: "3. Comment nous utilisons vos informations",
              useBullets: [
                "Fournir, exploiter et maintenir notre plateforme",
                "Améliorer, personnaliser et étendre nos services",
                "Communiquer avec vous au sujet des mises à jour et du support",
                "Traiter les transactions et gérer votre compte",
                "Analyser l’utilisation afin d’améliorer l’expérience utilisateur",
                "Prévenir la fraude et assurer la sécurité",
              ],
              sharingTitle: "4. Partage des données",
              sharingIntro:
                "Nous ne vendons pas vos informations personnelles. Nous pouvons partager vos données uniquement dans les situations suivantes :",
              sharingBullets: [
                "Avec votre consentement explicite",
                "Avec des prestataires de services qui nous aident à exploiter la plateforme",
                "Pour respecter des obligations légales ou protéger des droits",
                "En cas de fusion, d’acquisition ou de vente d’actifs (avec notification préalable)",
              ],
              aiTitle: "4.1 Intelligence Artificielle (Chat)",
              aiIntro:
                "Pour fournir des conseils et des suggestions via le chat, DTTools peut traiter votre message et certaines parties du contexte de votre projet avec des fournisseurs d’IA.",
              aiBullets: [
                "Nous pouvons envoyer le texte de votre message et les informations nécessaires pour répondre (par ex. la phase en cours, le nom/la description du projet lors de l’utilisation du chat dans un projet).",
                "Nous n’avons pas l’intention d’envoyer des mots de passe, des données bancaires ou des documents personnels. Merci de ne pas partager d’informations sensibles dans le chat.",
                "Le traitement est effectué afin de générer des réponses et d’améliorer l’expérience utilisateur.",
              ],
              securityTitle: "5. Sécurité des données",
              securityIntro: "Nous mettons en œuvre des mesures de sécurité techniques et organisationnelles, notamment :",
              securityBullets: [
                "Chiffrement des mots de passe et des données sensibles",
                "Connexions HTTPS sécurisées",
                "Contrôles d’accès stricts",
                "Surveillance continue de la sécurité",
                "Sauvegardes régulières et procédures de récupération",
              ],
              rightsTitle: "6. Vos droits",
              rightsIntro:
                "Selon votre juridiction (par ex. LGPD/RGPD), vous pouvez disposer de droits tels que :",
              rightsBullets: [
                "Confirmer si nous traitons vos données personnelles",
                "Accéder à vos données personnelles",
                "Corriger des données incomplètes, inexactes ou obsolètes",
                "Supprimer des données lorsque cela s’applique",
                "Portabilité des données",
                "Retirer votre consentement",
              ],
              retentionTitle: "7. Conservation des données",
              retentionBody:
                "Nous conservons vos informations aussi longtemps que nécessaire pour fournir nos services et respecter nos obligations légales. Les données de projet sont conservées tant que votre compte est actif. Après suppression du compte, les données peuvent être supprimées définitivement dans un délai pouvant aller jusqu’à 90 jours.",
              cookiesTitle: "8. Cookies",
              cookiesBody:
                "Nous utilisons des cookies essentiels pour l’authentification et le fonctionnement de la plateforme. Vous pouvez gérer les cookies via les paramètres de votre navigateur, mais cela peut affecter le service.",
              minorsTitle: "9. Mineurs",
              minorsBody:
                "Notre plateforme n’est pas destinée aux utilisateurs de moins de 18 ans. Nous ne collectons pas sciemment de données de mineurs.",
              changesTitle: "10. Modifications de la politique",
              changesBody:
                "Nous pouvons mettre à jour cette Politique de confidentialité de temps à autre. Nous vous informerons des changements significatifs par email ou via un avis dans l’application. La poursuite de l’utilisation après les changements vaut acceptation de la politique mise à jour.",
              contactTitle: "11. Contact",
              contactIntro:
                "Pour exercer vos droits ou poser des questions sur cette Politique de confidentialité, contactez :",
              emailLabel: "Email",
              supportLabel: "Support",
            }
          : contentLanguage === "de"
            ? {
                lastUpdated: "Letzte Aktualisierung: 07. Oktober 2025",
                introTitle: "1. Einleitung",
                introBody:
                  "DTTools („wir“, „unser“) respektiert Ihre Privatsphäre und verpflichtet sich zum Schutz Ihrer personenbezogenen Daten. Diese Datenschutzerklärung erläutert, wie wir Ihre Informationen erfassen, verwenden, speichern und schützen, wenn Sie unsere Design-Thinking-Plattform nutzen.",
                collectTitle: "2. Welche Informationen wir erfassen",
                provideTitle: "2.1 Von Ihnen bereitgestellte Informationen",
                provideBullets: [
                  "Kontoinformationen (Name, E-Mail, verschlüsseltes Passwort)",
                  "Projekt- und Tool-Daten, die Sie innerhalb von DTTools erstellen",
                  "Profilinformationen und Präferenzen",
                  "Inhalte, die Sie innerhalb der Plattform teilen",
                ],
                autoTitle: "2.2 Automatisch erfasste Informationen",
                autoBullets: [
                  "Nutzungs- und Interaktionsdaten",
                  "Technische Informationen (Gerätetyp, Browser, Betriebssystem)",
                  "IP-Adresse und ungefähre Standortdaten",
                  "Cookies und ähnliche Technologien",
                ],
                useTitle: "3. Wie wir Ihre Informationen verwenden",
                useBullets: [
                  "Bereitstellung, Betrieb und Wartung unserer Plattform",
                  "Verbesserung, Personalisierung und Erweiterung unserer Dienste",
                  "Kommunikation mit Ihnen über Updates und Support",
                  "Abwicklung von Transaktionen und Verwaltung Ihres Kontos",
                  "Analyse der Nutzung zur Verbesserung der Benutzererfahrung",
                  "Betrugsprävention und Gewährleistung der Sicherheit",
                ],
                sharingTitle: "4. Datenweitergabe",
                sharingIntro:
                  "Wir verkaufen Ihre personenbezogenen Daten nicht. Wir können Ihre Daten nur in den folgenden Fällen weitergeben:",
                sharingBullets: [
                  "Mit Ihrer ausdrücklichen Einwilligung",
                  "Mit Dienstleistern, die uns beim Betrieb der Plattform unterstützen",
                  "Zur Erfüllung gesetzlicher Pflichten oder zum Schutz von Rechten",
                  "Im Falle einer Fusion, Übernahme oder eines Asset-Verkaufs (mit vorheriger Benachrichtigung)",
                ],
                aiTitle: "4.1 Künstliche Intelligenz (Chat)",
                aiIntro:
                  "Um Chat-Hinweise und Vorschläge bereitzustellen, kann DTTools Ihre Nachricht und Teile Ihres Projektkontexts mit KI-Anbietern verarbeiten.",
                aiBullets: [
                  "Wir können den Text Ihrer Nachricht und Informationen, die zur Beantwortung nötig sind, senden (z. B. aktuelle Phase, Projektname/-beschreibung, wenn der Chat innerhalb eines Projekts genutzt wird).",
                  "Wir beabsichtigen nicht, Passwörter, Bankdaten oder persönliche Dokumente zu senden. Bitte teilen Sie keine sensiblen Informationen im Chat.",
                  "Die Verarbeitung erfolgt, um Antworten zu generieren und die Benutzererfahrung zu verbessern.",
                ],
                securityTitle: "5. Datensicherheit",
                securityIntro:
                  "Wir setzen technische und organisatorische Sicherheitsmaßnahmen ein, einschließlich:",
                securityBullets: [
                  "Verschlüsselung von Passwörtern und sensiblen Daten",
                  "Sichere HTTPS-Verbindungen",
                  "Strenge Zugriffskontrollen",
                  "Kontinuierliche Sicherheitsüberwachung",
                  "Regelmäßige Backups und Wiederherstellungsverfahren",
                ],
                rightsTitle: "6. Ihre Rechte",
                rightsIntro:
                  "Abhängig von Ihrer Rechtsordnung (z. B. LGPD/GDPR) haben Sie möglicherweise Rechte wie:",
                rightsBullets: [
                  "Bestätigung, ob wir Ihre personenbezogenen Daten verarbeiten",
                  "Zugriff auf Ihre personenbezogenen Daten",
                  "Berichtigung unvollständiger, unrichtiger oder veralteter Daten",
                  "Löschung von Daten, soweit anwendbar",
                  "Datenübertragbarkeit",
                  "Widerruf der Einwilligung",
                ],
                retentionTitle: "7. Aufbewahrung von Daten",
                retentionBody:
                  "Wir bewahren Ihre Informationen so lange auf, wie es zur Bereitstellung unserer Dienste und zur Einhaltung gesetzlicher Pflichten erforderlich ist. Projektdaten werden gespeichert, solange Ihr Konto aktiv ist. Nach Kontolöschung können Daten innerhalb von bis zu 90 Tagen dauerhaft gelöscht werden.",
                cookiesTitle: "8. Cookies",
                cookiesBody:
                  "Wir verwenden essenzielle Cookies für Authentifizierung und Plattformfunktionen. Sie können Cookies über Ihre Browsereinstellungen verwalten, aber dies kann den Service beeinträchtigen.",
                minorsTitle: "9. Minderjährige",
                minorsBody:
                  "Unsere Plattform ist nicht für Nutzer unter 18 Jahren bestimmt. Wir erfassen wissentlich keine Daten von Minderjährigen.",
                changesTitle: "10. Änderungen dieser Erklärung",
                changesBody:
                  "Wir können diese Datenschutzerklärung von Zeit zu Zeit aktualisieren. Über wesentliche Änderungen informieren wir Sie per E-Mail oder per Hinweis in der App. Die fortgesetzte Nutzung nach Änderungen gilt als Zustimmung zur aktualisierten Erklärung.",
                contactTitle: "11. Kontakt",
                contactIntro:
                  "Um Ihre Rechte auszuüben oder Fragen zu dieser Datenschutzerklärung zu stellen, kontaktieren Sie:",
                emailLabel: "E-Mail",
                supportLabel: "Support",
              }
            : contentLanguage === "zh"
              ? {
                  lastUpdated: "最后更新：2025年10月07日",
                  introTitle: "1. 引言",
                  introBody:
                    "DTTools（“我们”）尊重您的隐私并致力于保护您的个人数据。本隐私政策说明您在使用我们的设计思维平台时，我们如何收集、使用、存储并保护您的信息。",
                  collectTitle: "2. 我们收集的信息",
                  provideTitle: "2.1 您提供的信息",
                  provideBullets: [
                    "账户信息（姓名、邮箱、加密后的密码）",
                    "您在 DTTools 中创建的项目与工具数据",
                    "个人资料信息与偏好设置",
                    "您在平台内分享的内容",
                  ],
                  autoTitle: "2.2 自动收集的信息",
                  autoBullets: [
                    "使用与交互数据",
                    "技术信息（设备类型、浏览器、操作系统）",
                    "IP 地址与大致位置数据",
                    "Cookies 与类似技术",
                  ],
                  useTitle: "3. 我们如何使用您的信息",
                  useBullets: [
                    "提供、运营与维护平台",
                    "改进、个性化并扩展我们的服务",
                    "就更新与支持与您沟通",
                    "处理交易并管理您的账户",
                    "分析使用情况以改进用户体验",
                    "防范欺诈并保障安全",
                  ],
                  sharingTitle: "4. 数据共享",
                  sharingIntro:
                    "我们不会出售您的个人信息。我们仅在以下情况下共享您的数据：",
                  sharingBullets: [
                    "经您明确同意",
                    "与帮助我们运营平台的服务提供商共享",
                    "为履行法律义务或保护权利",
                    "发生合并、收购或资产出售时（将提前通知）",
                  ],
                  aiTitle: "4.1 人工智能（聊天）",
                  aiIntro:
                    "为提供聊天指导与建议，DTTools 可能会将您的消息及项目上下文的部分内容交由 AI 供应商处理。",
                  aiBullets: [
                    "我们可能发送您的消息文本，以及为回答所需的信息（例如当前阶段、在项目内使用聊天时的项目名称/描述）。",
                    "我们无意发送密码、银行信息或个人证件等内容。请勿在聊天中分享敏感信息。",
                    "处理用于生成回复并改善用户体验。",
                  ],
                  securityTitle: "5. 数据安全",
                  securityIntro: "我们采取技术与组织层面的安全措施，包括：",
                  securityBullets: [
                    "密码与敏感数据加密",
                    "安全的 HTTPS 连接",
                    "严格的访问控制",
                    "持续的安全监控",
                    "定期备份与恢复流程",
                  ],
                  rightsTitle: "6. 您的权利",
                  rightsIntro:
                    "根据您所在司法辖区（例如 LGPD/GDPR），您可能享有如下权利：",
                  rightsBullets: [
                    "确认我们是否处理您的个人数据",
                    "访问您的个人数据",
                    "更正不完整、不准确或过期的数据",
                    "在适用情况下删除数据",
                    "数据可携带性",
                    "撤回同意",
                  ],
                  retentionTitle: "7. 数据保留",
                  retentionBody:
                    "我们会在提供服务及履行法律义务所必需的期限内保留您的信息。项目数据在您的账户处于激活状态时保留。删除账户后，数据可能在最长 90 天内被永久删除。",
                  cookiesTitle: "8. Cookies",
                  cookiesBody:
                    "我们使用必要的 Cookies 以实现身份验证与平台功能。您可在浏览器设置中管理 Cookies，但这可能影响服务使用。",
                  minorsTitle: "9. 未成年人",
                  minorsBody: "我们的平台不面向 18 岁以下用户。我们不会在知情的情况下收集未成年人的数据。",
                  changesTitle: "10. 政策变更",
                  changesBody:
                    "我们可能不时更新本隐私政策。对于重大变更，我们将通过邮件或应用内通知告知您。变更后继续使用服务即表示您接受更新后的政策。",
                  contactTitle: "11. 联系方式",
                  contactIntro: "如需行使您的权利或就本隐私政策提出问题，请联系：",
                  emailLabel: "邮箱",
                  supportLabel: "支持",
                }
            : {
                lastUpdated: "Last updated: October 07, 2025",
                introTitle: "1. Introduction",
                introBody:
                  "DTTools (\"we\", \"our\") respects your privacy and is committed to protecting your personal data. This Privacy Policy explains how we collect, use, store, and protect your information when you use our Design Thinking platform.",
                collectTitle: "2. Information We Collect",
                provideTitle: "2.1 Information You Provide",
                provideBullets: [
                  "Account information (name, email, encrypted password)",
                  "Project and tool data you create within DTTools",
                  "Profile information and preferences",
                  "Content you share within the platform",
                ],
                autoTitle: "2.2 Automatically Collected Information",
                autoBullets: [
                  "Usage and interaction data",
                  "Technical information (device type, browser, operating system)",
                  "IP address and approximate location data",
                  "Cookies and similar technologies",
                ],
                useTitle: "3. How We Use Your Information",
                useBullets: [
                  "Provide, operate, and maintain our platform",
                  "Improve, personalize, and expand our services",
                  "Communicate with you about updates and support",
                  "Process transactions and manage your account",
                  "Analyze usage to improve user experience",
                  "Prevent fraud and ensure security",
                ],
                sharingTitle: "4. Data Sharing",
                sharingIntro:
                  "We do not sell your personal information. We may share your data only in the following situations:",
                sharingBullets: [
                  "With your explicit consent",
                  "With service providers that help us operate the platform",
                  "To comply with legal obligations or protect rights",
                  "In case of merger, acquisition, or asset sale (with prior notice)",
                ],
                aiTitle: "4.1 Artificial Intelligence (Chat)",
                aiIntro:
                  "To provide chat guidance and suggestions, DTTools may process your message and parts of your project context with AI providers.",
                aiBullets: [
                  "We may send the text of your message and information needed to answer (e.g., current phase, project name/description when using chat inside a project).",
                  "We do not intend to send passwords, banking data, or personal documents. Please do not share sensitive information in the chat.",
                  "Processing is done to generate responses and improve user experience.",
                ],
                securityTitle: "5. Data Security",
                securityIntro: "We implement technical and organizational security measures, including:",
                securityBullets: [
                  "Password and sensitive data encryption",
                  "Secure HTTPS connections",
                  "Strict access controls",
                  "Continuous security monitoring",
                  "Regular backups and recovery procedures",
                ],
                rightsTitle: "6. Your Rights",
                rightsIntro:
                  "Depending on your jurisdiction (e.g., LGPD/GDPR), you may have rights such as:",
                rightsBullets: [
                  "Confirming whether we process your personal data",
                  "Accessing your personal data",
                  "Correcting incomplete, inaccurate, or outdated data",
                  "Deleting data when applicable",
                  "Data portability",
                  "Withdrawing consent",
                ],
                retentionTitle: "7. Data Retention",
                retentionBody:
                  "We retain your information for as long as necessary to provide our services and comply with legal obligations. Project data is kept while your account is active. After account deletion, data may be permanently removed within up to 90 days.",
                cookiesTitle: "8. Cookies",
                cookiesBody:
                  "We use essential cookies for authentication and platform functionality. You can manage cookies through your browser settings, but doing so may affect the service.",
                minorsTitle: "9. Minors",
                minorsBody: "Our platform is not intended for users under 18. We do not knowingly collect data from minors.",
                changesTitle: "10. Policy Changes",
                changesBody:
                  "We may update this Privacy Policy from time to time. We will notify you of significant changes via email or an in-app notice. Continued use after changes constitutes acceptance of the updated policy.",
                contactTitle: "11. Contact",
                contactIntro: "To exercise your rights or ask questions about this Privacy Policy, contact:",
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
                <h2 className="text-2xl font-semibold mb-3 text-gray-900 dark:text-white">{copy.introTitle}</h2>
                <p>{copy.introBody}</p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-3 text-gray-900 dark:text-white">{copy.collectTitle}</h2>

                <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-200">{copy.provideTitle}</h3>
                <ul className="list-disc pl-6 space-y-2">
                  {copy.provideBullets.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>

                <h3 className="text-xl font-semibold mb-2 mt-4 text-gray-800 dark:text-gray-200">{copy.autoTitle}</h3>
                <ul className="list-disc pl-6 space-y-2">
                  {copy.autoBullets.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-3 text-gray-900 dark:text-white">{copy.useTitle}</h2>
                <ul className="list-disc pl-6 space-y-2">
                  {copy.useBullets.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-3 text-gray-900 dark:text-white">{copy.sharingTitle}</h2>
                <p className="mb-3">{copy.sharingIntro}</p>
                <ul className="list-disc pl-6 space-y-2">
                  {copy.sharingBullets.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-3 text-gray-900 dark:text-white">{copy.aiTitle}</h2>
                <p className="mb-3">{copy.aiIntro}</p>
                <ul className="list-disc pl-6 space-y-2">
                  {copy.aiBullets.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-3 text-gray-900 dark:text-white">{copy.securityTitle}</h2>
                <p>{copy.securityIntro}</p>
                <ul className="list-disc pl-6 space-y-2 mt-2">
                  {copy.securityBullets.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-3 text-gray-900 dark:text-white">{copy.rightsTitle}</h2>
                <p className="mb-3">{copy.rightsIntro}</p>
                <ul className="list-disc pl-6 space-y-2">
                  {copy.rightsBullets.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-3 text-gray-900 dark:text-white">{copy.retentionTitle}</h2>
                <p>{copy.retentionBody}</p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-3 text-gray-900 dark:text-white">{copy.cookiesTitle}</h2>
                <p>{copy.cookiesBody}</p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-3 text-gray-900 dark:text-white">{copy.minorsTitle}</h2>
                <p>{copy.minorsBody}</p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-3 text-gray-900 dark:text-white">{copy.changesTitle}</h2>
                <p>{copy.changesBody}</p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-3 text-gray-900 dark:text-white">{copy.contactTitle}</h2>
                <p>{copy.contactIntro}</p>
                <ul className="list-none space-y-2 mt-3">
                  <li><strong>{copy.emailLabel}:</strong> privacy@dttools.app</li>
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
                1. Introdução
              </h2>
              <p>
                A DTTools ("nós", "nosso" ou "nossa") respeita sua privacidade e está comprometida em proteger seus dados pessoais. Esta Política de Privacidade explica como coletamos, usamos, armazenamos e protegemos suas informações quando você usa nossa plataforma de Design Thinking.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3 text-gray-900 dark:text-white">
                2. Informações que Coletamos
              </h2>
              <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-200">
                2.1 Informações Fornecidas por Você
              </h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Informações de conta (nome, email, senha criptografada)</li>
                <li>Dados de projetos e ferramentas de Design Thinking que você cria</li>
                <li>Informações de perfil e preferências</li>
                <li>Conteúdo que você compartilha na plataforma</li>
              </ul>

              <h3 className="text-xl font-semibold mb-2 mt-4 text-gray-800 dark:text-gray-200">
                2.2 Informações Coletadas Automaticamente
              </h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Dados de uso e interação com a plataforma</li>
                <li>Informações técnicas (tipo de dispositivo, navegador, sistema operacional)</li>
                <li>Endereço IP e dados de localização aproximada</li>
                <li>Cookies e tecnologias similares</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3 text-gray-900 dark:text-white">
                3. Como Usamos Suas Informações
              </h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>Fornecer, operar e manter nossa plataforma</li>
                <li>Melhorar, personalizar e expandir nossos serviços</li>
                <li>Comunicar com você sobre atualizações e suporte</li>
                <li>Processar transações e gerenciar sua conta</li>
                <li>Analisar uso para aprimorar a experiência do usuário</li>
                <li>Prevenir fraudes e garantir a segurança</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3 text-gray-900 dark:text-white">
                4. Compartilhamento de Dados
              </h2>
              <p className="mb-3">
                Não vendemos suas informações pessoais. Podemos compartilhar seus dados apenas nas seguintes situações:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Com seu consentimento explícito</li>
                <li>Com provedores de serviços que nos auxiliam na operação da plataforma</li>
                <li>Para cumprir obrigações legais ou proteger direitos</li>
                <li>Em caso de fusão, aquisição ou venda de ativos (com notificação prévia)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3 text-gray-900 dark:text-white">
                4.1 Uso de Inteligência Artificial (Chat)
              </h2>
              <p className="mb-3">
                Para oferecer funcionalidades de chat com orientação e sugestões, a DTTools pode processar sua mensagem e partes do contexto do seu projeto com provedores de IA.
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Podemos enviar o texto da sua mensagem e informações necessárias para responder (por exemplo: fase atual, nome/descrição do projeto quando você estiver usando o chat dentro de um projeto).</li>
                <li>Não temos intenção de enviar dados como senhas, dados bancários ou documentos pessoais. Por isso, pedimos que você NÃO compartilhe informações sensíveis no chat.</li>
                <li>O processamento ocorre com a finalidade de gerar a resposta e melhorar a experiência do usuário.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3 text-gray-900 dark:text-white">
                5. Segurança dos Dados
              </h2>
              <p>
                Implementamos medidas de segurança técnicas e organizacionais para proteger suas informações, incluindo:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-2">
                <li>Criptografia de senhas e dados sensíveis</li>
                <li>Conexões HTTPS seguras</li>
                <li>Controles de acesso rigorosos</li>
                <li>Monitoramento contínuo de segurança</li>
                <li>Backups regulares e recuperação de dados</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3 text-gray-900 dark:text-white">
                6. Seus Direitos (LGPD)
              </h2>
              <p className="mb-3">
                De acordo com a Lei Geral de Proteção de Dados (LGPD), você tem os seguintes direitos:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Confirmação da existência de tratamento de dados</li>
                <li>Acesso aos seus dados pessoais</li>
                <li>Correção de dados incompletos, inexatos ou desatualizados</li>
                <li>Anonimização, bloqueio ou eliminação de dados desnecessários</li>
                <li>Portabilidade dos dados a outro fornecedor</li>
                <li>Eliminação dos dados pessoais tratados com consentimento</li>
                <li>Revogação do consentimento</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3 text-gray-900 dark:text-white">
                7. Retenção de Dados
              </h2>
              <p>
                Mantemos suas informações pelo tempo necessário para fornecer nossos serviços e cumprir obrigações legais. Dados de projetos são mantidos enquanto sua conta estiver ativa. Após a exclusão da conta, os dados são permanentemente removidos em até 90 dias.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3 text-gray-900 dark:text-white">
                8. Cookies
              </h2>
              <p>
                Utilizamos cookies essenciais para autenticação e funcionalidade da plataforma. Você pode controlar cookies através das configurações do seu navegador, mas isso pode afetar a funcionalidade do serviço.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3 text-gray-900 dark:text-white">
                9. Menores de Idade
              </h2>
              <p>
                Nossa plataforma não é direcionada a menores de 18 anos. Não coletamos intencionalmente informações de menores. Se descobrirmos que coletamos dados de um menor, excluiremos essas informações imediatamente.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3 text-gray-900 dark:text-white">
                10. Alterações nesta Política
              </h2>
              <p>
                Podemos atualizar esta Política de Privacidade periodicamente. Notificaremos você sobre mudanças significativas por email ou através de aviso na plataforma. O uso continuado após as alterações constitui aceitação da nova política.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3 text-gray-900 dark:text-white">
                11. Contato
              </h2>
              <p>
                Para exercer seus direitos ou esclarecer dúvidas sobre esta Política de Privacidade, entre em contato:
              </p>
              <ul className="list-none space-y-2 mt-3">
                <li><strong>Email:</strong> privacy@dttools.app</li>
                <li><strong>Suporte:</strong> <Link href="/support" className="text-blue-600 hover:underline">dttools.app/support</Link></li>
              </ul>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
