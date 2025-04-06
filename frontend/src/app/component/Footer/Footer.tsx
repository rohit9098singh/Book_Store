import { Clock, Facebook, HeadphonesIcon, Instagram, Shield, Twitter, Youtube } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

const socialIcons = [
  { Icon: Facebook, href: '#' },
  { Icon: Instagram, href: '#' },
  { Icon: Youtube, href: '#' },
  { Icon: Twitter, href: '#' }
];

const footerLinks = [
  {
    title: 'About Us',
    links: [
      { name: 'About us', href: '/About-Us' },
      { name: 'Contact us', href: '/Contact-Us' }
    ]
  },
  {
    title: 'Useful Links',
    links: [
      { name: 'How It Works', href: '/how-it-works' },
      { name: 'Blogs', href: '/' }
    ]
  },
  {
    title: 'Policies',
    links: [
      { name: 'Terms Of Use', href: '/Terms-Of-Use' },
      { name: 'Privacy Policy', href: '/Privacy-Policy' }
    ]
  }
];

const features = [
  { Icon: Shield, title: 'Secure Payment', desc: '100% Secure Online Transaction' },
  { Icon: Clock, title: 'BookKart Trust', desc: 'Money transferred safely after confirmation' },
  { Icon: HeadphonesIcon, title: 'Customer Support', desc: 'Friendly customer support' }
];

const paymentMethods = ['visa', 'rupay', 'paytm', 'upi'];

const Footer = () => {
  return (
    <footer className='bg-gray-900 text-gray-400 py-12 px-6'>
      <div className='max-w-7xl mx-auto'>
        {/* Top Section */}
        <div className='grid grid-cols-1 md:grid-cols-4 gap-8'>
          {footerLinks.map(({ title, links }, idx) => (
            <div key={idx}>
              <h2 className='font-semibold text-white text-lg mb-4'>{title}</h2>
              <ul className='space-y-2'>
                {links.map(({ name, href }) => (
                  <li key={href}><Link href={href} className='hover:text-white transition'>{name}</Link></li>
                ))}
              </ul>
            </div>
          ))}
          <div>
            <h2 className='font-semibold text-white text-lg mb-4'>Stay Connected</h2>
            <div className='flex gap-4 mb-4'>
              {socialIcons.map(({ Icon, href }, idx) => (
                <Link key={idx} href={href} className='hover:text-white transition'>
                  <Icon className='w-6 h-6' />
                </Link>
              ))}
            </div>
            <p className='text-sm max-w-xs'>
              BookKart is a free platform where you can buy second-hand books at affordable prices. College books, school books, and more—right near you.
            </p>
          </div>
        </div>

        {/* Features Section */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-8 mt-12'>
          {features.map(({ Icon, title, desc }, index) => (
            <div key={index} className='flex items-center gap-4 p-6 bg-gray-800 rounded-lg'>
              <div className='p-3 bg-gray-700 rounded-full'>
                <Icon className='w-6 h-6 text-gray-300' />
              </div>
              <div>
                <h3 className='font-semibold text-white'>{title}</h3>
                <p className='text-sm text-gray-400'>{desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Section */}
        <div className='mt-12 border-t border-gray-700 pt-6 flex flex-col md:flex-row justify-between items-center'>
          <p className='text-sm'>&copy; {new Date().getFullYear()} BookKart. All Rights Reserved.</p>
          <div className='flex items-center space-x-4'>
            {paymentMethods.map((name) => (
              <Image
                key={name}
                src={`/icons/${name}.svg`}
                alt={name}
                height={30}
                width={50}
                className='filter brightness-75 invert'
              />
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
