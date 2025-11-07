import React from "react";

const Footer = () => {
  // Common link style for easy readability
  const linkStyle =
    "text-sm hover:text-white transition-colors duration-200 font-light";

  // Data structure for the main link columns
  const footerLinks = [
    {
      title: "Shop",
      links: [
        { name: "Natural Rubies", href: "/products/natural" },
        { name: "Heated Rubies", href: "/products/heated" },
        { name: "Heated Sapphires", href: "/products/sapphire" },
        { name: "View All Gems", href: "/products" },
      ],
    },
    {
      title: "Company",
      links: [
        { name: "About Ruby", href: "/about" },
        { name: "Our Certification", href: "/certification" },
        { name: "Careers", href: "/careers" },
        // Requested link to Apple website (using a generic link)
        { name: "Design Inspiration", href: "https://www.apple.com/" },
      ],
    },
    {
      title: "Support",
      links: [
        { name: "Contact Us", href: "/contact" },
        { name: "24/7 Chat Support", href: "/support/chat" },
        { name: "Shipping & Returns", href: "/support/shipping" },
        { name: "Schedule Meeting", href: "/schedule" },
      ],
    },
  ];

  return (
    <footer className="bg-gray-900 text-gray-300 border-t border-red-800/50">
      <div className="container mx-auto px-6 max-w-7xl pt-14 pb-8">
        {/* Main Footer Grid for Links */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-10 lg:gap-8">
          {/* Brand Column (First Column on Desktop) */}
          <div className="col-span-2 md:col-span-1 space-y-4">
            <div className="flex items-center space-x-2 text-2xl font-bold text-white">
              {/* Simple 'R' icon for the Ruby brand */}
              <svg
                className="w-6 h-6 text-red-600"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M10 20l-4-4h8l-4 4zM10 0l4 4H6l4-4zM2 10l4-4v8l-4-4zM18 10l-4-4v8l4-4z" />
              </svg>
              <span>Ruby</span>
            </div>
            <p className="text-sm font-light text-gray-500">
              The world's most authentic Burmar Rubies.
            </p>
          </div>

          {/* Link Columns */}
          {footerLinks.map((section) => (
            <div key={section.title} className="space-y-4">
              <h4 className="text-base font-semibold text-white tracking-wider uppercase">
                {section.title}
              </h4>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <a href={link.href} className={linkStyle}>
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Contact/Social Media Column (Last Column on Desktop) */}
          <div className="col-span-2 md:col-span-1 space-y-4 md:pl-4">
            <h4 className="text-base font-semibold text-white tracking-wider uppercase">
              Connect
            </h4>
            <div className="flex space-x-4">
              {/* Placeholder Social Icons (Replace with actual links) */}
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors duration-200"
              >
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2C6.477 2 2 6.477 2 12c0 4.991 3.656 9.126 8.432 9.873V14.89h-2.54V12h2.54V9.79c0-2.508 1.493-3.89 3.776-3.89 1.094 0 2.24.192 2.24.192v2.46h-1.26c-1.247 0-1.637.77-1.637 1.562V12h2.773l-.443 2.89h-2.33V21.873C18.344 21.126 22 16.991 22 12c0-5.523-4.477-10-10-10z" />
                </svg>
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-white transition-colors duration-200"
              >
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M19 0H5a5 5 0 00-5 5v14a5 5 0 005 5h14a5 5 0 005-5V5a5 5 0 00-5-5zm-7 18.5c-3.59 0-6.5-2.91-6.5-6.5S8.41 5.5 12 5.5s6.5 2.91 6.5 6.5-2.91 6.5-6.5 6.5zm-5-6.5a5 5 0 1110 0 5 5 0 01-10 0zM17.5 7.5a1 1 0 11-2 0 1 1 0 012 0z" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Separator and Copyright */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <p className="text-xs text-gray-600 text-center md:text-left">
            &copy; {new Date().getFullYear()} Ruby Gems Inc. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
