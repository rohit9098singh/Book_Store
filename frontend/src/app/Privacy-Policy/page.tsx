"use client";
import React from 'react';

const sections = [
  { title: '1. Information We Collect', content: 'We collect information from you when you register on our site or place an order. This includes your name, email address, mailing address, phone number, and payment information.' },
  { title: '2. How We Use Your Information', content: 'We use the information we collect to process transactions, improve our website, and send periodic emails regarding your order or other products and services.' },
  { title: '3. Sharing Your Information', content: 'We do not sell, trade, or otherwise transfer your personally identifiable information to outside parties without your consent.' },
  { title: '4. Security of Your Information', content: 'We implement a variety of security measures to maintain the safety of your personal information when you place an order or enter, submit, or access your personal information.' },
  { title: '5. Changes to Our Privacy Policy', content: 'We may update this privacy policy periodically. We will notify you about significant changes in the way we treat personal information by sending a notice to the primary email address specified in your account or by placing a prominent notice on our site.' },
  { title: '6. Contact Us', content: 'If you have any questions about this privacy policy or our practices regarding your personal information, please contact us at support@bookkart.com.' }
];

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-gray-100 py-16 ">
      <div className="container mx-auto px-4 max-w-7xl ">
        <h1 className="text-4xl font-bold text-center mb-8">Privacy Policy</h1>
        <p className="text-gray-600 mb-4">
          At BookKart, we are committed to protecting your privacy. This privacy policy explains how we collect, use, and disclose your information.
        </p>
        {sections.map((section, index) => (
          <div key={index}>
            <h2 className="text-2xl font-semibold mt-6">{section.title}</h2>
            <p className="text-gray-600 mb-4">{section.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PrivacyPolicy;
