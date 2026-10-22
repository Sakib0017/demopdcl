import { motion } from "framer-motion";
import { 
  DocumentTextIcon, 
  UserGroupIcon, 
  CalendarIcon,
  CurrencyDollarIcon,
  ShieldCheckIcon,
  ExclamationTriangleIcon,
  ScaleIcon,
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
  ClipboardDocumentListIcon,
  BeakerIcon,
  CameraIcon,
  MagnifyingGlassIcon,
  InformationCircleIcon
} from "@heroicons/react/24/outline";
import "@fontsource/ubuntu";
import { Helmet } from "react-helmet-async";

function Terms() {
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

    const termsSection = [
        {
            id: "welcome",
            title: "Welcome to PDCL",
            icon: UserGroupIcon,
            content: "Welcome to Popular Diagnostic Centre Limited (PDCL)! Thank you for choosing us for your healthcare needs. PDCL is a leading provider of diagnostic services, including laboratory tests, imaging, and pathology. We are committed to providing high-quality, affordable, and accessible healthcare to our patients.",
            color: "bg-blue-50 border-blue-200 text-blue-800"
        },
        {
            id: "services",
            title: "Scope of Services",
            icon: ClipboardDocumentListIcon,
            color: "bg-green-50 border-green-200 text-green-800",
            content: "PDCL offers a comprehensive range of diagnostic services to meet the needs of our patients:",
            subsections: [
                {
                    title: "Laboratory Tests",
                    icon: BeakerIcon,
                    content: "We offer a wide range of laboratory tests, including blood tests, urine tests, and stool tests. Our laboratory is accredited by ISO 9001:2015, ensuring accurate and reliable results."
                },
                {
                    title: "Medical Imaging",
                    icon: CameraIcon,
                    content: "We provide various imaging services including X-rays, ultrasound, CT scans, and MRI scans using state-of-the-art equipment with highly trained staff."
                },
                {
                    title: "Pathology Services",
                    icon: MagnifyingGlassIcon,
                    content: "Our full range of pathology services includes biopsies, cytology, and histopathology. Our expert pathologists provide accurate diagnoses for various medical conditions."
                }
            ]
        },
        {
            id: "registration",
            title: "Patient Registration & Identification",
            icon: UserGroupIcon,
            content: "To access our services, you need to register with PDCL and provide personal information including your name, date of birth, contact information, and medical history. We ensure all information is kept confidential and only used for providing our services, except as required by law.",
            color: "bg-purple-50 border-purple-200 text-purple-800"
        },
        {
            id: "appointments",
            title: "Scheduling & Managing Appointments",
            icon: CalendarIcon,
            color: "bg-amber-50 border-amber-200 text-amber-800",
            subsections: [
                {
                    title: "Booking Appointments",
                    content: "Schedule appointments online at www.populardiagnostic.com, by phone at 09613 787801, or visit any PDCL branch in person."
                },
                {
                    title: "Cancellation Policy",
                    content: "Cancel appointments at least 24 hours in advance to avoid cancellation fees. Cancellations can be made online, by phone, or in person."
                }
            ]
        },
        {
            id: "payment",
            title: "Payment & Billing",
            icon: CurrencyDollarIcon,
            content: "You are responsible for paying for all services received from PDCL. We accept cash, credit cards, and debit cards. Some services may require deposits or prepayment. All services are subject to current fee schedules.",
            color: "bg-emerald-50 border-emerald-200 text-emerald-800"
        },
        {
            id: "confidentiality",
            title: "Patient Information Confidentiality",
            icon: ShieldCheckIcon,
            content: "PDCL is committed to protecting your patient information confidentiality. We implement physical, technical, and administrative safeguards. Your information will not be disclosed without consent, except as required by law or to provide services. You have the right to access and review your medical records.",
            color: "bg-red-50 border-red-200 text-red-800"
        },
        {
            id: "medical-records",
            title: "Medical Records Access",
            icon: DocumentTextIcon,
            content: "You have the right to access and review your medical records. Submit written requests to our Medical Records Department, and we'll provide records within 30 days. You can also authorize release of records to other healthcare providers by completing our authorization form.",
            color: "bg-indigo-50 border-indigo-200 text-indigo-800"
        },
        {
            id: "liability",
            title: "Service Terms & Liability",
            icon: ExclamationTriangleIcon,
            color: "bg-orange-50 border-orange-200 text-orange-800",
            subsections: [
                {
                    title: "Service Disclaimer",
                    content: "Services are provided 'as is' and 'as available'. We make no warranties about uninterrupted or error-free services, though we strive for the highest quality."
                },
                {
                    title: "Limitation of Liability",
                    content: "PDCL's liability is limited as permitted by law. We are not liable for indirect, incidental, or consequential damages arising from service use."
                },
                {
                    title: "User Responsibility",
                    content: "You agree to indemnify PDCL from claims arising from your use of services, violation of terms, or infringement of third-party rights."
                }
            ]
        },
        {
            id: "legal",
            title: "Legal & Governance",
            icon: ScaleIcon,
            color: "bg-slate-50 border-slate-200 text-slate-800",
            subsections: [
                {
                    title: "Governing Law",
                    content: "These terms are governed by Bangladesh law, with disputes resolved exclusively in Bangladesh courts."
                },
                {
                    title: "Severability",
                    content: "If any provision is invalid, it will be removed while remaining provisions stay in effect."
                },
                {
                    title: "Terms Updates",
                    content: "We may update these terms at our discretion. Changes will be posted on our website, and continued use constitutes acceptance."
                }
            ]
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-gray-100">
            <Helmet>
                {/* Temporarily disabled — falls back to the site-wide default in main.jsx.
                <title>Popular Diagnostic Centre Ltd. | Terms & Conditions</title>
                <meta
                    name="description"
                    content="Read the Terms & Conditions of Popular Diagnostic Centre Ltd. covering diagnostic services, laboratory, imaging, pathology services, appointments, payments, privacy, and patient rights."
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
                            <DocumentTextIcon className="w-6 h-6 text-PDCL-green" />
                            <span className="text-PDCL-green font-semibold text-sm uppercase tracking-wide">
                                Terms & Conditions
                            </span>
                        </motion.div>
                        
                        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 sm:mb-6 font-ubuntu leading-tight">
                            Terms and
                            <span className="text-PDCL-green block">Conditions</span>
                        </h1>
                        
                        <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed px-2">
                            Clear terms that govern your use of our diagnostic services, designed to ensure quality healthcare delivery while protecting both patients and our medical facility.
                        </p>

                        {/* Service Highlights */}
                        <motion.div 
                            className="flex flex-wrap justify-center gap-6 mt-10"
                            variants={staggerContainer}>
                            {[
                                { icon: BeakerIcon, text: "Laboratory Services" },
                                { icon: CameraIcon, text: "Medical Imaging" },
                                { icon: MagnifyingGlassIcon, text: "Pathology" }
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

                    {/* Terms Sections */}
                    <motion.div 
                        className="space-y-12 mb-16"
                        variants={staggerContainer}>
                        {termsSection.map((section) => (
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
                                            <div className="space-y-4 sm:space-y-6">
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
                                                        
                                                        <div className="flex items-start gap-4">
                                                            {subsection.icon && (
                                                                <subsection.icon className="w-6 h-6 text-PDCL-green flex-shrink-0 mt-1" />
                                                            )}
                                                            <div>
                                                                <h3 className="font-bold text-lg text-gray-900 mb-3">
                                                                    {subsection.title}
                                                                </h3>
                                                                <p className="text-gray-600 leading-relaxed">
                                                                    {subsection.content}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </motion.div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>

                    {/* Contact Information Section */}
                    <motion.div 
                        className="glass rounded-3xl p-10 shadow-2xl border border-white/20 bg-gradient-to-br from-PDCL-green/5 to-slate-50/50"
                        variants={fadeInUp}
                        style={{ backdropFilter: 'blur(15px)' }}>
                        
                        <div className="text-center mb-10">
                            <motion.div
                                className="inline-flex items-center gap-3 bg-PDCL-green/10 px-6 py-3 rounded-full mb-6"
                                whileHover={{ scale: 1.05 }}>
                                <PhoneIcon className="w-6 h-6 text-PDCL-green" />
                                <span className="text-PDCL-green font-semibold text-sm uppercase tracking-wide">
                                    Contact Information
                                </span>
                            </motion.div>
                            
                            <h2 className="text-3xl font-bold text-gray-900 mb-4 font-ubuntu">
                                Questions About Our Terms?
                            </h2>
                            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                                If you have any questions about these Terms and Conditions or need clarification on any policies, please contact us:
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
                            {/* Company Info */}
                            <motion.div
                                className="bg-white/60 rounded-2xl p-6 sm:p-8 shadow-lg border border-white/30"
                                whileHover={{ y: typeof window !== 'undefined' && window.innerWidth >= 768 ? -3 : -1, shadow: "0 20px 40px rgba(0,0,0,0.1)" }}
                                whileTap={{ scale: 0.98 }}
                                style={{ backdropFilter: 'blur(10px)' }}>
                                
                                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6 font-ubuntu flex items-center gap-3">
                                    <MapPinIcon className="w-5 sm:w-6 h-5 sm:h-6 text-PDCL-green" />
                                    Visit Our Main Office
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
                                className="bg-white/60 rounded-2xl p-6 sm:p-8 shadow-lg border border-white/30"
                                whileHover={{ y: typeof window !== 'undefined' && window.innerWidth >= 768 ? -3 : -1, shadow: "0 20px 40px rgba(0,0,0,0.1)" }}
                                whileTap={{ scale: 0.98 }}
                                style={{ backdropFilter: 'blur(10px)' }}>
                                
                                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6 font-ubuntu flex items-center gap-3">
                                    <PhoneIcon className="w-5 sm:w-6 h-5 sm:h-6 text-PDCL-green" />
                                    Contact Support
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
                                            <p className="text-green-600">09613 787801, 10636</p>
                                        </div>
                                    </motion.a>
                                    
                                    <motion.a
                                        href="mailto:info@populardiagnostic.com"
                                        className="flex items-center gap-4 p-4 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors group"
                                        whileHover={{ x: 5 }}
                                        whileTap={{ scale: 0.98 }}>
                                        <EnvelopeIcon className="w-5 h-5 text-blue-600" />
                                        <div>
                                            <p className="font-semibold text-blue-800">Email Support</p>
                                            <p className="text-blue-600">info@populardiagnostic.com</p>
                                        </div>
                                    </motion.a>
                                </div>
                            </motion.div>
                        </div>

                        {/* Agreement Notice */}
                        <motion.div
                            className="mt-10 p-6 bg-PDCL-green/5 border border-PDCL-green/20 rounded-2xl"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.8 }}>
                            <div className="flex items-start gap-4">
                                <InformationCircleIcon className="w-6 h-6 text-PDCL-green flex-shrink-0 mt-1" />
                                <div>
                                    <h4 className="font-bold text-PDCL-green-dark mb-2">Agreement & Updates</h4>
                                    <p className="text-PDCL-green-dark/80">
                                        By using our services, you agree to these Terms and Conditions. We may update these terms periodically, 
                                        and continued use of our services after changes constitutes acceptance of the updated terms. 
                                        Please review these terms regularly to stay informed of any changes.
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

export default Terms;
