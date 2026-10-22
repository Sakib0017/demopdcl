import { motion } from "framer-motion";
import { 
  ShieldCheckIcon, 
  UserIcon, 
  LockClosedIcon,
  EyeIcon,
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
  CheckCircleIcon,
  InformationCircleIcon,
  CogIcon,
  HeartIcon
} from "@heroicons/react/24/outline";
import "@fontsource/ubuntu";
import { Helmet } from "react-helmet-async";

function Privacy() {
    const fadeInUp = {
        initial: { opacity: 0, y: 30 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.6, ease: "easeOut" }
    };

    const staggerContainer = {
        animate: {
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const privacySections = [
        {
            id: "introduction",
            title: "Introduction",
            icon: InformationCircleIcon,
            content: "Popular Diagnostic Centre Limited (PDCL) is committed to protecting the privacy of your personal information. This Privacy Policy explains how we collect, use, and disclose your personal information when you visit our website or use our services.",
            color: "bg-blue-50 border-blue-200 text-blue-800"
        },
        {
            id: "data-collection",
            title: "Information We Collect",
            icon: UserIcon,
            color: "bg-green-50 border-green-200 text-green-800",
            subsections: [
                {
                    title: "Personal Identifiers",
                    content: "Your name, address, date of birth, government-issued identifiers, and other identifying information necessary for our services."
                },
                {
                    title: "Contact Information",
                    content: "Your email address, phone number, mailing address, and preferred communication methods."
                },
                {
                    title: "Medical Information",
                    content: "Your medical history, insurance information, test results, and other health-related information required for diagnostic services."
                },
                {
                    title: "Payment Information",
                    content: "Credit card numbers, bank account information, and other payment details processed through secure channels."
                },
                {
                    title: "Technical Information",
                    content: "IP address, device type, browser information, and usage patterns when you interact with our digital services."
                }
            ]
        },
        {
            id: "data-usage",
            title: "How We Use Your Information",
            icon: CogIcon,
            color: "bg-purple-50 border-purple-200 text-purple-800",
            subsections: [
                {
                    title: "Service Delivery",
                    content: "We use your information to provide diagnostic services, process appointments, and deliver test results securely."
                },
                {
                    title: "Communication",
                    content: "To communicate about appointments, test results, billing, and important health-related information."
                },
                {
                    title: "Service Improvement",
                    content: "To enhance our services, develop new diagnostic tests, and improve patient care quality."
                },
                {
                    title: "Legal Compliance",
                    content: "To meet regulatory requirements, maintain medical records, and comply with healthcare laws."
                }
            ]
        },
        {
            id: "data-sharing",
            title: "Information Sharing",
            icon: EyeIcon,
            color: "bg-amber-50 border-amber-200 text-amber-800",
            subsections: [
                {
                    title: "Healthcare Providers",
                    content: "We may share your information with healthcare providers involved in your care, with your consent."
                },
                {
                    title: "Insurance Companies",
                    content: "Information may be shared with insurance providers for claim processing and coverage verification."
                },
                {
                    title: "Service Providers",
                    content: "Trusted third-party service providers who assist with billing, appointment scheduling, and other essential services."
                },
                {
                    title: "Legal Requirements",
                    content: "Information may be disclosed to government agencies as required by law or legal processes."
                }
            ]
        },
        {
            id: "data-security",
            title: "Data Security",
            icon: LockClosedIcon,
            content: "PDCL implements comprehensive security measures including physical, technical, and administrative safeguards to protect your personal information from unauthorized access, use, or disclosure. We use industry-standard encryption, secure servers, and regular security audits.",
            color: "bg-red-50 border-red-200 text-red-800"
        },
        {
            id: "your-rights",
            title: "Your Privacy Rights",
            icon: CheckCircleIcon,
            color: "bg-indigo-50 border-indigo-200 text-indigo-800",
            subsections: [
                {
                    title: "Access Rights",
                    content: "You have the right to access and review your personal information in our records."
                },
                {
                    title: "Correction Rights",
                    content: "You can request correction of inaccurate or incomplete personal information."
                },
                {
                    title: "Deletion Rights",
                    content: "You may request deletion of your personal information in certain circumstances."
                },
                {
                    title: "Objection Rights",
                    content: "You can object to certain uses of your personal information, such as marketing communications."
                },
                {
                    title: "Data Portability",
                    content: "You have the right to receive your personal information in a machine-readable format."
                }
            ]
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
            <Helmet>
                {/* Temporarily disabled — falls back to the site-wide default in main.jsx.
                <title>Popular Diagnostic Centre Ltd. | Privacy Policy</title>
                <meta
                    name="description"
                    content="Read the Privacy Policy of Popular Diagnostic Centre Ltd. to learn how we collect, use, protect, and safeguard your personal and medical information."
                />
                */}
            </Helmet>
            <div className="mx-auto max-w-7xl px-3 sm:px-4 md:px-6 lg:px-8">
                <motion.div 
                    className="pt-16 sm:pt-20 pb-12 sm:pb-16"
                    initial="initial"
                    animate="animate"
                    variants={staggerContainer}>
                    
                    {/* Header Section */}
                    <motion.div 
                        className="text-center mb-16"
                        variants={fadeInUp}>
                        <motion.div
                            className="inline-flex items-center gap-3 bg-PDCL-green/10 px-6 py-3 rounded-full mb-6"
                            whileHover={{ scale: 1.05 }}
                            transition={{ type: "spring", stiffness: 300 }}>
                            <ShieldCheckIcon className="w-6 h-6 text-PDCL-green" />
                            <span className="text-PDCL-green font-semibold text-sm uppercase tracking-wide">
                                Privacy Policy
                            </span>
                        </motion.div>
                        
                        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 sm:mb-6 font-ubuntu leading-tight">
                            Your Privacy
                            <span className="text-PDCL-green block">Matters to Us</span>
                        </h1>
                        
                        <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed px-2">
                            We are committed to protecting your personal information and maintaining the highest standards of privacy and security in all our healthcare services.
                        </p>

                        {/* Trust Indicators */}
                        <motion.div 
                            className="flex flex-wrap justify-center gap-6 mt-10"
                            variants={staggerContainer}>
                            {[
                                { icon: LockClosedIcon, text: "256-bit Encryption" },
                                { icon: CheckCircleIcon, text: "ISO Certified" }
                            ].map((item, index) => (
                                <motion.div
                                    key={index}
                                    className="flex items-center gap-2 bg-white/80 px-4 py-2 rounded-full shadow-sm"
                                    variants={fadeInUp}
                                    whileHover={{ scale: 1.05, y: -2 }}>
                                    <item.icon className="w-5 h-5 text-PDCL-green" />
                                    <span className="text-sm font-medium text-gray-700">{item.text}</span>
                                </motion.div>
                            ))}
                        </motion.div>
                    </motion.div>

                    {/* Privacy Sections */}
                    <motion.div 
                        className="space-y-12 mb-16"
                        variants={staggerContainer}>
                        {privacySections.map((section) => (
                            <motion.div
                                key={section.id}
                                className="glass rounded-3xl p-4 sm:p-6 md:p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-white/20"
                                variants={fadeInUp}
                                whileHover={{ y: typeof window !== 'undefined' && window.innerWidth >= 768 ? -5 : -2, scale: typeof window !== 'undefined' && window.innerWidth >= 768 ? 1.01 : 1 }}
                                whileTap={{ scale: 0.98 }}
                                style={{
                                    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.7) 100%)',
                                    backdropFilter: 'blur(10px)'
                                }}>
                                
                                <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
                                    <motion.div
                                        className={`p-4 rounded-xl ${section.color} flex-shrink-0`}
                                        whileHover={{ rotate: 5, scale: 1.1 }}
                                        transition={{ type: "spring", stiffness: 300 }}>
                                        <section.icon className="w-8 h-8" />
                                    </motion.div>
                                    
                                    <div className="flex-1 w-full sm:w-auto">
                                        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-4 sm:mb-6 font-ubuntu">
                                            {section.title}
                                        </h2>
                                        
                                        {section.content && (
                                            <p className="text-gray-700 leading-relaxed text-lg mb-6">
                                                {section.content}
                                            </p>
                                        )}

                                        {section.subsections && (
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                                                {section.subsections.map((subsection, idx) => (
                                                    <motion.div
                                                        key={idx}
                                                        className="bg-white/60 rounded-xl p-4 sm:p-6 border border-white/30"
                                                        initial={{ opacity: 0, y: 20 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        transition={{ delay: 0.2 + idx * 0.1 }}
                                                        whileHover={{ y: typeof window !== 'undefined' && window.innerWidth >= 768 ? -3 : -1, shadow: "0 10px 20px rgba(0,0,0,0.1)" }}
                                        whileTap={{ scale: 0.98 }}
                                                        style={{ backdropFilter: 'blur(5px)' }}>
                                                        <h3 className="font-bold text-lg text-gray-900 mb-3">
                                                            {subsection.title}
                                                        </h3>
                                                        <p className="text-gray-600 leading-relaxed">
                                                            {subsection.content}
                                                        </p>
                                                    </motion.div>
                                                ))}
          </div>
                                        )}
          </div>
            </div>
                            </motion.div>
                        ))}
                    </motion.div>

                    {/* Additional Information Section */}
                    <motion.div 
                        className="glass rounded-3xl p-10 shadow-2xl border border-white/20 bg-gradient-to-br from-PDCL-green/5 to-blue-50/50 mb-12"
                        variants={fadeInUp}
                        style={{ backdropFilter: 'blur(15px)' }}>
                        
                        <div className="text-center mb-10">
                            <motion.div
                                className="inline-flex items-center gap-3 bg-PDCL-green/10 px-6 py-3 rounded-full mb-6"
                                whileHover={{ scale: 1.05 }}>
                                <HeartIcon className="w-6 h-6 text-PDCL-green" />
                                <span className="text-PDCL-green font-semibold text-sm uppercase tracking-wide">
                                    Additional Services
                                </span>
                            </motion.div>
                            
                            <h2 className="text-3xl font-bold text-gray-900 mb-4 font-ubuntu">
                                Personalized Healthcare
                            </h2>
            </div>
           
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
                            <motion.div
                                className="bg-white/60 rounded-2xl p-6 shadow-lg border border-white/30"
                                whileHover={{ y: -3, shadow: "0 20px 40px rgba(0,0,0,0.1)" }}
                                style={{ backdropFilter: 'blur(10px)' }}>
                                <h3 className="text-xl font-bold text-gray-900 mb-4 font-ubuntu">
                                    Clinical Trials
                                </h3>
                                <p className="text-gray-700 leading-relaxed">
                                    We may invite you to participate in clinical trials for new diagnostic tests, always with your explicit consent and the option to withdraw at any time.
                                </p>
                            </motion.div>

                            <motion.div
                                className="bg-white/60 rounded-2xl p-6 shadow-lg border border-white/30"
                                whileHover={{ y: -3, shadow: "0 20px 40px rgba(0,0,0,0.1)" }}
                                style={{ backdropFilter: 'blur(10px)' }}>
                                <h3 className="text-xl font-bold text-gray-900 mb-4 font-ubuntu">
                                    Health Recommendations
                                </h3>
                                <p className="text-gray-700 leading-relaxed">
                                    With your permission, we provide personalized health information, appointment reminders, and recommendations based on your health profile.
                                </p>
                            </motion.div>

                            <motion.div
                                className="bg-white/60 rounded-2xl p-6 shadow-lg border border-white/30"
                                whileHover={{ y: -3, shadow: "0 20px 40px rgba(0,0,0,0.1)" }}
                                style={{ backdropFilter: 'blur(10px)' }}>
                                <h3 className="text-xl font-bold text-gray-900 mb-4 font-ubuntu">
                                    Marketing Communications
                                </h3>
                                <p className="text-gray-700 leading-relaxed">
                                    We only send marketing communications with your opt-in consent. You can unsubscribe at any time through our emails or by contacting us directly.
                                </p>
                            </motion.div>
            </div>
                    </motion.div>

                    {/* Contact Section */}
                    <motion.div 
                        className="glass rounded-3xl p-10 shadow-2xl border border-white/20 bg-gradient-to-br from-PDCL-green/5 to-blue-50/50"
                        variants={fadeInUp}
                        style={{ backdropFilter: 'blur(15px)' }}>
                        
                        <div className="text-center mb-10">
                            <motion.div
                                className="inline-flex items-center gap-3 bg-PDCL-green/10 px-6 py-3 rounded-full mb-6"
                                whileHover={{ scale: 1.05 }}>
                                <PhoneIcon className="w-6 h-6 text-PDCL-green" />
                                <span className="text-PDCL-green font-semibold text-sm uppercase tracking-wide">
                                    Contact Us
                                </span>
                            </motion.div>
                            
                            <h2 className="text-3xl font-bold text-gray-900 mb-4 font-ubuntu">
                                Privacy Questions?
                            </h2>
                            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                                If you have any questions about this Privacy Policy or want to exercise your privacy rights, please contact us:
                            </p>
            </div>

                        <div className="grid md:grid-cols-2 gap-8">
                            {/* Company Info */}
                            <motion.div
                                className="bg-white/60 rounded-2xl p-8 shadow-lg border border-white/30"
                                whileHover={{ y: -3, shadow: "0 20px 40px rgba(0,0,0,0.1)" }}
                                style={{ backdropFilter: 'blur(10px)' }}>
                                
                                <h3 className="text-xl font-bold text-gray-900 mb-6 font-ubuntu flex items-center gap-3">
                                    <MapPinIcon className="w-6 h-6 text-PDCL-green" />
                                    Visit Our Office
                                </h3>
                                
                                <div className="space-y-4 text-gray-700">
                                    <p className="font-semibold text-lg text-PDCL-green">
                                        Popular Diagnostic Centre Ltd.
                                    </p>
                                    <p className="flex items-start gap-3">
                                        <MapPinIcon className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                                        <span>
                                            House #16, Road # 2, Dhanmondi R/A,<br />
                                            Dhaka-1205, Bangladesh
                                        </span>
                                    </p>
            </div>
                            </motion.div>

                            {/* Contact Details */}
                            <motion.div
                                className="bg-white/60 rounded-2xl p-8 shadow-lg border border-white/30"
                                whileHover={{ y: -3, shadow: "0 20px 40px rgba(0,0,0,0.1)" }}
                                style={{ backdropFilter: 'blur(10px)' }}>
                                
                                <h3 className="text-xl font-bold text-gray-900 mb-6 font-ubuntu flex items-center gap-3">
                                    <PhoneIcon className="w-6 h-6 text-PDCL-green" />
                                    Get in Touch
                                </h3>
                                
                                <div className="space-y-6">
                                    <motion.a
                                        href="tel:09613787801"
                                        className="flex items-center gap-4 p-4 bg-green-50 rounded-xl hover:bg-green-100 transition-colors group"
                                        whileHover={{ x: 5 }}
                                        whileTap={{ scale: 0.98 }}>
                                        <PhoneIcon className="w-5 h-5 text-green-600" />
                                        <div>
                                            <p className="font-semibold text-green-800">Phone Support</p>
                                            <p className="text-green-600">09613-787801, 10636</p>
            </div>
                                    </motion.a>
                                    
                                    <motion.a
                                        href="mailto:info@populardiagnostic.com"
                                        className="flex items-center gap-4 p-4 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors group"
                                        whileHover={{ x: 5 }}
                                        whileTap={{ scale: 0.98 }}>
                                        <EnvelopeIcon className="w-5 h-5 text-blue-600" />
                                        <div>
                                            <p className="font-semibold text-blue-800">Email Privacy Officer</p>
                                            <p className="text-blue-600">info@populardiagnostic.com</p>
          </div>
                                    </motion.a>
        </div>
                            </motion.div>
        </div>

                        {/* Policy Updates Notice */}
                        <motion.div
                            className="mt-10 p-6 bg-blue-50 border border-blue-200 rounded-2xl"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.8 }}>
                            <div className="flex items-start gap-4">
                                <InformationCircleIcon className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                                <div>
                                    <h4 className="font-bold text-blue-800 mb-2">Policy Updates</h4>
                                    <p className="text-blue-700">
                                        We may update this Privacy Policy from time to time to reflect changes in our practices or legal requirements. 
                                        We will notify you of any material changes via email and post the updated policy on our website.
                                    </p>
          </div>
        </div>
                        </motion.div>
                    </motion.div>
                </motion.div>
        </div>
      </div>
    );
}

export default Privacy;