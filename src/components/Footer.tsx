// File: src/components/Footer.tsx (Final Version)

import * as React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-gray-100 border-t mt-12 py-6">
            <div className="container mx-auto px-4 text-sm text-gray-600">
                <div className="flex justify-between items-center flex-wrap">
                    {/* Left/Center Section: Copyright & Legal Links */}
                    <div className="text-left md:text-center w-full md:w-auto mb-4 md:mb-0">
                        {/* FINAL COPYRIGHT FIX: Only NAS retains rights */}
                        <p className="mb-3">
                            © {currentYear} SISMMS - Student Information System (V1). All rights reserved by **NAS**.
                        </p>
                        <div className="flex justify-center space-x-6 flex-wrap">
                            <Link to="/disclaimer" className="hover:text-primary transition-colors">Disclaimer</Link>
                            <Link to="/terms" className="hover:text-primary transition-colors">Terms of Service</Link>
                            <Link to="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link>
                            <Link to="/copyright" className="hover:text-primary transition-colors">Copyright</Link>
                            <Link to="/contact" className="hover:text-primary transition-colors">Support / Contact</Link>
                        </div>
                    </div>

                    {/* Right Section: NAS Credit (Relocated from Navbar) */}
                    <div className="text-sm font-bold px-3 py-1 bg-secondary text-white rounded-md mx-auto md:mx-0">
                        A NAS Project
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;