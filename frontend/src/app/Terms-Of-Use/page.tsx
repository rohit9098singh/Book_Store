"use client";
import React from 'react';

const terms = [
  { title: '1. Acceptance of Terms', content: 'By accessing this website, you accept these terms and conditions in full. If you disagree with any part of these terms, you must not use our website.' },
  { title: '2. User Responsibilities', content: 'Users are responsible for maintaining the confidentiality of their account information and for all activities that occur under their account.' },
  { title: '3. Selling Books', content: 'When selling books on BookKart, you agree to provide accurate and complete information about the books you are listing.' },
  { title: '4. Changes to Terms', content: 'We may revise these terms from time to time. The revised terms will apply to the use of our website from the date of publication.' },
  { title: '5. Contact Us', content: 'If you have any questions about these terms, please contact us at support@bookkart.com.' }
];

const TermsOfUse = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-200 py-16">
      <div className="container mx-auto px-6 md:px-12 lg:px-20">
        <h1 className="text-5xl font-extrabold text-center text-gray-800 mb-12">Terms of Use</h1>
        <p className="text-lg text-gray-700 text-center mb-10">
          Welcome to <span className="font-semibold text-blue-600">BookKart</span>! These terms outline the rules for using our website.
        </p>
        <div className="space-y-8">
          {terms.map((term, index) => (
            <div key={index} className="bg-white shadow-md rounded-lg p-6 border-l-4 border-blue-500">
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">{term.title}</h2>
              <p className="text-gray-600 leading-relaxed">{term.content}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TermsOfUse;
