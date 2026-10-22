import { motion } from "framer-motion";
import { 
  ShieldCheckIcon, 
  ClockIcon, 
  CurrencyDollarIcon,
  ExclamationTriangleIcon,
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
  DocumentTextIcon
} from "@heroicons/react/24/outline";
import "@fontsource/ubuntu";

function Refund() {
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


    const policyItems = [
        {
            id: 1,
            title: "Introduction",
            icon: DocumentTextIcon,
            content: "At Popular Diagnostic Centre Ltd., we are committed to providing high-quality diagnostic services in Pathology, Radiology, and Imaging tests. Our Return and Refund Policy ensures clarity and fairness in handling the unique nature of our services.",
            color: "bg-blue-50 border-blue-200 text-blue-800"
        },
        {
            id: 2,
            title: "Refund Eligibility",
            icon: ShieldCheckIcon,
            content: [
                "Refunds are generally processed for tests that have not been conducted or processed.",
                "Tests that are already in progress or completed are not eligible for a refund.",
                "In cases of error or technical issues attributable to our facility, clients may be eligible for a retest or partial refund, as determined on a case-by-case basis."
            ],
            color: "bg-green-50 border-green-200 text-green-800"
        },
        {
            id: 3,
            title: "Process for Requesting a Refund",
            icon: CurrencyDollarIcon,
            content: [
                "To initiate a refund, clients must contact Popular Diagnostic Centre Ltd. through our official communication channels, providing details of the test and the reason for the refund request.",
                "Refund requests must be made within 3 business days of the test date."
            ],
            color: "bg-amber-50 border-amber-200 text-amber-800"
        },
        {
            id: 4,
            title: "Refund Timeline",
            icon: ClockIcon,
            content: [
                "Approved refunds will be processed within 7 to 10 working days from the date of approval.",
                "Refunds will be credited to the original payment method or through an alternative method mutually agreed upon."
            ],
            color: "bg-purple-50 border-purple-200 text-purple-800"
        },
        {
            id: 5,
            title: "Non-refundable Services",
            icon: ExclamationTriangleIcon,
            content: [
                "Services where the results have already been provided to the client are non-refundable.",
                "In cases where test results are contested, we offer a procedure for review or retesting, subject to specific terms and conditions."
            ],
            color: "bg-red-50 border-red-200 text-red-800"
        },
        {
            id: 6,
            title: "Amendments to the Policy",
            icon: DocumentTextIcon,
            content: "Popular Diagnostic Centre Ltd. reserves the right to amend this policy at any time. Amendments will be effective immediately and will be communicated through our official channels.",
            color: "bg-gray-50 border-gray-200 text-gray-800"
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
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
                                Refund Policy
                            </span>
                        </motion.div>
                        
                        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 sm:mb-6 font-ubuntu leading-tight">
                            Refund and Return
                            <span className="text-PDCL-green block">Policy</span>
                        </h1>
                        
                        <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed px-2">
                            Transparent and fair policies designed to protect your interests while maintaining the highest standards of diagnostic services.
                        </p>
                    </motion.div>

                    {/* Policy Items */}
                    <motion.div 
                        className="space-y-8 mb-16"
                        variants={staggerContainer}>
                        {policyItems.map((item) => (
                            <motion.div
                                key={item.id}
                                className="glass rounded-2xl p-4 sm:p-6 md:p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-white/20"
                                variants={fadeInUp}
                                whileHover={{ y: -2, scale: typeof window !== 'undefined' && window.innerWidth >= 768 ? 1.01 : 1 }}
                                whileTap={{ scale: 0.98 }}
                                style={{
                                    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.7) 100%)',
                                    backdropFilter: 'blur(10px)'
                                }}>
                                
                                <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
                                    <motion.div
                                        className={`p-4 rounded-xl ${item.color} flex-shrink-0`}
                                        whileHover={{ rotate: 5, scale: 1.1 }}
                                        transition={{ type: "spring", stiffness: 300 }}>
                                        <item.icon className="w-8 h-8" />
                                    </motion.div>
                                    
                                    <div className="flex-1 w-full sm:w-auto">
                                        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4 font-ubuntu">
                                            {item.id}. {item.title}
                                        </h2>
                                        
                                        {Array.isArray(item.content) ? (
                                            <div className="space-y-4">
                                                {item.content.map((paragraph, idx) => (
                                                    <motion.p
                                                        key={idx}
                                                        className="text-gray-700 leading-relaxed text-lg"
                                                        initial={{ opacity: 0, x: -20 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        transition={{ delay: 0.2 + idx * 0.1 }}>
                                                        • {paragraph}
                                                    </motion.p>
                                                ))}
                                            </div>
                                        ) : (
                                            <p className="text-gray-700 leading-relaxed text-lg">
                                                {item.content}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>

                    {/* Contact Information Section */}
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
                                Need Help with Refunds?
                            </h2>
                            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                                For any queries or further information regarding our Return and Refund Policy, please contact us through any of the following channels:
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
                            {/* Company Info */}
                            <motion.div
                                className="bg-white/60 rounded-2xl p-6 sm:p-8 shadow-lg border border-white/30"
                                whileHover={{ y: typeof window !== 'undefined' && window.innerWidth >= 768 ? -3 : -1, shadow: "0 20px 40px rgba(0,0,0,0.1)" }}
                                whileTap={{ scale: 0.98 }}
                                style={{ backdropFilter: 'blur(10px)' }}>
                                
                                <h3 className="text-xl font-bold text-gray-900 mb-6 font-ubuntu flex items-center gap-3">
                                    <MapPinIcon className="w-6 h-6 text-PDCL-green" />
                                    Visit Our Main Branch
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
                                            <p className="font-semibold text-green-800">Phone Lines</p>
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
                                            <p className="font-semibold text-blue-800">Email Support</p>
                                            <p className="text-blue-600">info@populardiagnostic.com</p>
                                        </div>
                                    </motion.a>
                                </div>
                            </motion.div>
                        </div>

                        {/* Important Notice */}
                        <motion.div
                            className="mt-10 p-6 bg-amber-50 border border-amber-200 rounded-2xl"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.8 }}>
                            <div className="flex items-start gap-4">
                                <ExclamationTriangleIcon className="w-6 h-6 text-amber-600 flex-shrink-0 mt-1" />
                                <div>
                                    <h4 className="font-bold text-amber-800 mb-2">Important Notice</h4>
                                    <p className="text-amber-700">
                                        Please ensure you understand our refund policy before proceeding with any diagnostic services. 
                                        For immediate assistance with refund-related queries, please call our dedicated support line during business hours (7 AM - 11 PM).
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

export default Refund;