
import React from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import HowItWorks from "@/components/HowItWorks";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <main>
        <Hero />
        
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          id="about"
          className="py-20 px-4"
        >
          <div className="max-w-5xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              About Our
              <span className="text-gradient bg-gradient-to-r from-cancer-blue to-cancer-purple bg-clip-text text-transparent ml-2">
                Quirky Technology
              </span>
            </h2>
            
            <p className="text-lg text-gray-700 mb-8 max-w-3xl mx-auto">
              CellScan combines cutting-edge AI with a playful interface to make cancer detection both more accurate and less intimidating. Our technology analyzes cellular patterns and biomarkers with unparalleled precision while presenting results in an accessible, human-friendly way.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white rounded-xl p-6 shadow-md border border-cancer-blue/10 hover:border-cancer-blue/30 transition-all">
                <div className="w-16 h-16 rounded-full bg-cancer-blue/10 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-cancer-blue">99%</span>
                </div>
                <h3 className="text-xl font-bold mb-2">Accuracy Rate</h3>
                <p className="text-gray-600">Our AI detection systems achieve remarkable precision in identifying cellular abnormalities.</p>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-md border border-cancer-purple/10 hover:border-cancer-purple/30 transition-all">
                <div className="w-16 h-16 rounded-full bg-cancer-purple/10 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-cancer-purple">3x</span>
                </div>
                <h3 className="text-xl font-bold mb-2">Faster Detection</h3>
                <p className="text-gray-600">Get results three times faster than traditional diagnostic methods with our quantum-inspired algorithms.</p>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-md border border-cancer-pink/10 hover:border-cancer-pink/30 transition-all">
                <div className="w-16 h-16 rounded-full bg-cancer-pink/10 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-cancer-pink">24/7</span>
                </div>
                <h3 className="text-xl font-bold mb-2">Always Available</h3>
                <p className="text-gray-600">Our platform never sleeps, giving you access to powerful diagnostic tools whenever you need them.</p>
              </div>
            </div>
          </div>
        </motion.div>
        
        <Features />
        <HowItWorks />
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
