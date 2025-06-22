import React from "react";
import { motion } from "framer-motion";
function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.9 }}
      className="mt-10 py-10 w-full border-t border-solid border-neutral-300/60"
    >
      <div className="max-w-6xl mx-auto px-4">
        <div
          className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-4 mb-8 pb-8 
                        border-b border-solid border-neutral-300/60"
        >
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-1">
            <h3 className="text-neutral-800 font-bold text-lg mb-4 flex items-center gap-2">
              <span className="text-primary-500">🔥</span>
              StreakSpark
            </h3>
            <p className="text-neutral-600/70">
              Building better habits, one streak at a time.
            </p>
          </div>
          <div className="col-span-1 md:col-span-3">
            <div className="grid grid-cols-3 gap-4 md:gap-8">
              <div>
                <h4 className="text-neutral-800 font-semibold mb-4">Product</h4>
                <ul className="space-y-2  text-neutral-600/70 text-sm">
                  <li>
                    <a
                      href="#"
                      className="hover:text-primary-500 transition-colors duration-200 
                         group"
                    >
                      Features
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="hover:text-primary-500 transition-colors duration-200 
                         group"
                    >
                      Pricing
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="hover:text-primary-500 transition-colors duration-200 
                         group"
                    >
                      FAQ
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="text-neutral-800 font-semibold mb-4">Company</h4>
                <ul className="space-y-2  text-neutral-600/70 text-sm">
                  <li>
                    <a
                      href="#"
                      className="hover:text-primary-500 transition-colors duration-200 
                         group"
                    >
                      About Us
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="hover:text-primary-500 transition-colors duration-200 
                         group"
                    >
                      Blog
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="hover:text-primary-500 transition-colors duration-200 
                         group"
                    >
                      Careers
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="text-neutral-800 font-semibold mb-4">Connect</h4>
                <ul className="space-y-2  text-neutral-600/70 text-sm">
                  <li>
                    <a
                      href="#"
                      className="hover:text-primary-500 transition-colors duration-200 
                         group"
                    >
                      Twitter
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="hover:text-primary-500 transition-colors duration-200 
                         group"
                    >
                      Instagram
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="hover:text-primary-500 transition-colors duration-200 
                         group"
                    >
                      LinkedIn
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div
          className="flex flex-col md:flex-row justify-between items-center 
                    text-neutral-500 text-sm"
        >
          <div className="mb-4 md:mb-0">
            © 2025 StreakSpark. All rights reserved.
          </div>
          <div className="flex gap-6">
            <a
              href="#"
              className="hover:text-primary-500 transition-colors duration-200"
            >
              Privacy Policy
            </a>
            <a
              href="#"
              className="hover:text-primary-500 transition-colors duration-200"
            >
              Terms of Service
            </a>
            <a
              href="#"
              className="hover:text-primary-500 transition-colors duration-200"
            >
              Cookie Policy
            </a>
          </div>
        </div>
      </div>
    </motion.footer>
  );
}

export default Footer;
